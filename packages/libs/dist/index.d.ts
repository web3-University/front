type ChainType = "ethereum" | "bitcoin" | "solana" | "cosmos" | "polkadot" | "tron" | "ripple" | "cardano" | "tezos" | "near" | "generic";
/**
 * 格式化地址字符串
 *
 * @param address 地址字符串
 * @param chain 链类型，默认值为 "ethereum"
 * @returns 格式化后的地址字符串
 */
declare function formatAddress(address: string, chain?: ChainType): string;

type TimeInput = Date | number | string;
type FormatType = "YYYY-MM-DD" | "YYYY-MM-DD HH:mm:ss" | "YYYY/MM/DD" | "YYYY/MM/DD HH:mm:ss" | "MM-DD HH:mm" | "HH:mm:ss" | "relative" | "custom";
interface FormatOptions {
    format?: FormatType;
    customFormat?: string;
}
/**
 * 格式化时间
 *
 * @param time - 时间输入（Date 对象、时间戳或日期字符串）
 * @param options - 格式化选项
 * @returns 格式化后的时间字符串
 *
 * @example
 * ```ts
 * formatTime(new Date()) // "2025-10-10 22:00:00" (默认格式)
 * formatTime(Date.now(), { format: "YYYY-MM-DD" }) // "2025-10-10"
 * formatTime(new Date(), { format: "relative" }) // "刚刚"
 * formatTime(new Date(), { format: "custom", customFormat: "YYYY年MM月DD日 HH:mm" }) // "2025年10月10日 22:00"
 * ```
 */
declare function formatTime(time: TimeInput, options?: FormatOptions): string;

declare const _default: {
    formatAddress: typeof formatAddress;
    formatTime: typeof formatTime;
};

export { _default as default };
