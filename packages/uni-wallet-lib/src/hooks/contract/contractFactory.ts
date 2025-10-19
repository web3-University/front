import type { Abi, Address, Hash } from "viem";
import type { UseWaitForTransactionReceiptReturnType as ReceiptReturnType } from "wagmi";
import type { UseContractReadReturn } from "./useContractRead";
import { useContractRead } from "./useContractRead";
import type { WriteOverrides } from "./useContractWrite";
import { useContractWrite } from "./useContractWrite";

export type WriteVariables = {
  value?: bigint | undefined;
  gas?: bigint | undefined;
};

export type WriteReturnType = Hash | undefined;

/**
 * 🚀 链式调用 API：创建合约交互工厂（推荐）
 *
 * @param address 合约地址
 * @param abi 合约 ABI
 * @returns 返回链式调用对象
 *
 * @example
 * ✨ 创建工厂
 * const factory = contractFactory(CONTRACT_ADDRESS, CONTRACT_ABI)
 *
 * 📖 读取方法
 * const balanceOf = factory.read<bigint>('balanceOf')
 * const { data } = balanceOf(userAddress)
 *
 * ✍️ 写入方法（简单）
 * const transfer = factory.write('transfer')
 * await transfer.send(toAddress, amount)
 * console.log(transfer.receipt)
 *
 * ✍️ 写入方法（带 value/gas）
 * const purchaseCourse = factory.write('purchaseCourse')
 * await purchaseCourse.send(courseId, {
 *   value: parseEther('0.1'),
 *   gas: 100000n
 * })
 */
export function contractFactory(address: Address, abi: Abi) {
  return {
    /**
     * 创建读取方法
     * @param functionName 合约函数名
     * @returns 返回可调用的读取函数
     *
     * @example
     * const balanceOf = factory.read<bigint>('balanceOf')
     * const { data } = balanceOf(userAddress)
     */
    read: <T>(functionName: string, enabled: boolean = true) => {
      return (...args: any[]): UseContractReadReturn<T> => {
        const hasArgs =
          args.length > 0 && args.every((arg) => arg !== undefined);
        return useContractRead<T>({
          address,
          abi,
          functionName,
          args: hasArgs ? args : undefined,
          enabled: enabled,
        });
      };
    },

    /**
     * 创建写入方法
     * @param functionName 合约函数名
     * @returns 返回对象 { send, receipt, writer }
     *
     * @example
     * - 简单调用
     * const transfer = factory.write('transfer')
     * await transfer.send(toAddress, amount)
     *
     * - 带 overrides (value, gas, etc.)
     * await transfer.send(toAddress, amount, {
     *   value: parseEther('1.0'),
     *   gas: 100000n
     * })
     *
     * - Payable 函数
     * const purchaseCourse = factory.write('purchaseCourse')
     * await purchaseCourse.send(courseId, {
     *   value: parseEther('0.1')
     * })
     */
    write: (functionName: string) => {
      const writer = useContractWrite({ address, abi, functionName });
      /**
       * 发送交易
       * @param args 合约函数参数 + 可选的Payable函数参数
       * @returns 交易 hash
       *
       * 支持两种调用方式：
       * 1. send(arg1, arg2, ...)
       * 2. send(arg1, arg2, ..., { value, gas, ... })
       */
      const send = async (...args: any[]) => {
        if (!writer.writeAsync) {
          throw new Error(`Function ${functionName} is not writable`);
        }

        // 🔍 检测最后一个参数是否是 overrides
        // overrides 的特征：包含 value/gas/gasPrice 等字段的普通对象
        let contractArgs = args;
        let overrides: WriteVariables | undefined;

        if (args.length > 0) {
          const lastArg = args[args.length - 1];

          // 检查是否是 overrides 对象
          const isOverrides =
            lastArg &&
            typeof lastArg === "object" &&
            !Array.isArray(lastArg) &&
            // 检查是否包含 overrides 的常见字段
            ("value" in lastArg || "gas" in lastArg);

          if (isOverrides) {
            overrides = lastArg as WriteOverrides;
            contractArgs = args.slice(0, -1);
          }
        }

        return writer.writeAsync({
          args: contractArgs,
          value: overrides?.value,
          gas: overrides?.gas,
        });
      };

      return {
        send,
        receipt: writer.receipt as ReceiptReturnType,
        writer,
      };
    },
  };
}
