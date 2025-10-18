import { useSignMessage } from "wagmi";

export function useWalletSign() {
  const {
    signMessage,
    signMessageAsync,
    data: signature,
    error,
    isPending,
    isSuccess,
    isError,
    reset,
  } = useSignMessage();

  return {
    signMessage,
    signMessageAsync,
    signature,
    error,
    isPending,
    isSuccess,
    isError,
    reset,
  };
}
