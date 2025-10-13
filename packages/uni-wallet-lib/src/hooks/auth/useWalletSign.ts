import { useSignMessage } from "wagmi";
import { useWalletConnection } from "../wallet/useWalletConnection";

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
    issuedAt?: string,
    expirationTime?: string,
  ): string => {
    const issuedAtValue = issuedAt || new Date().toISOString();
    const expirationTimeValue =
      expirationTime || new Date(Date.now() + 5 * 60 * 1000).toISOString();

    return `${domain} wants you to sign in with your Ethereum account:
${address}

I accept the Terms of Service.

URI: https://${domain}
Version: 1
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAtValue}
Expiration Time: ${expirationTimeValue}`;
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
    const signature = await signMessageAsync({ message });

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
