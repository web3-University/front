import { useEffect, useRef } from "react";

/**
 * usePrevious - A custom hook to get the previous value of a state or prop
 * @param value - The current value
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
