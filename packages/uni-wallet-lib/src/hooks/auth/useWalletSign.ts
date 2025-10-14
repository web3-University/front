import { useSignMessage } from "wagmi";
import { useWalletConnection } from "../wallet/useWalletConnection";
import { SiweMessage } from "siwe";

export interface SignMessageOptions {
  message: string;
  onSuccess?: (signature: string) => void;
  onError?: (error: Error) => void;
}

export function useWalletSign() {
  const { address: connectedAddress } = useWalletConnection();
  const { signMessageAsync, isPending, isSuccess, isError } = useSignMessage();

  /**
   * 生成符合EIP-4361（SIWE）标准消息
   */
  const generateSIWEMessage = (
    domain: string,
    address: string,
    nonce: string,
    chainId: number = 1,
    statement: string = "Sign in with Ethereum to the app.",
  ): SiweMessage => {
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: window ? window.location.origin : undefined,
      version: "1",
      chainId,
      nonce,
    });

    return message;
  };

  /**
   * 自定义Message签名
   * @param message 自定义签名消息
   * @returns
   */
  const signMessage = async (message: string) => {
    if (!connectedAddress) throw new Error("❗️ 钱包未连接");
    const signature = await signMessageAsync({ message });
    return {
      message,
      signature,
      address: connectedAddress,
    };
  };

  /**
   * 符合EIP-4361（SIWE）标准消息签名
   * @param domain
   * @param nonce
   * @param chainId
   * @returns
   */
  const signSIWEMessage = async (
    domain: string,
    nonce: string,
    chainId?: number,
  ) => {
    if (!connectedAddress) throw new Error("❗️ 钱包未连接");

    const message = generateSIWEMessage(
      domain,
      connectedAddress,
      nonce,
      chainId,
    );

    const signature = await signMessageAsync({ message: message.toMessage() });

    return {
      message,
      signature,
      address: connectedAddress,
    };
  };

  return {
    address: connectedAddress,
    isPending,
    isSuccess,
    isError,
    signMessage,
    signSIWEMessage,
    generateSIWEMessage,
  };
}
