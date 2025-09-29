import formatAddress from "../src/format/address";

describe("formatAddress", () => {
  describe("basic functionality", () => {
    test("formats ethereum address with default rules", () => {
      const address = "0x1234567890123456789012345678901234567890";
      const result = formatAddress(address);
      expect(result).toBe("0x1234...7890");
    });

    test("formats ethereum address with explicit chain type", () => {
      const address = "0x1234567890123456789012345678901234567890";
      const result = formatAddress(address, "ethereum");
      expect(result).toBe("0x1234...7890");
    });

    test("returns empty string for empty input", () => {
      expect(formatAddress("")).toBe("");
    });

    test("returns address unchanged when shorter than prefix + suffix", () => {
      const address = "short";
      const result = formatAddress(address);
      expect(result).toBe("short");
    });
  });

  describe("chain-specific formatting", () => {
    const testAddress = "1234567890123456789012345678901234567890";

    test("formats bitcoin address correctly", () => {
      const result = formatAddress(testAddress, "bitcoin");
      expect(result).toBe("1234...7890");
    });

    test("formats solana address correctly", () => {
      const result = formatAddress(testAddress, "solana");
      expect(result).toBe("123456...567890");
    });

    test("formats tron address correctly", () => {
      const result = formatAddress(testAddress, "tron");
      expect(result).toBe("123456...7890");
    });

    test("formats cosmos address correctly", () => {
      const result = formatAddress(testAddress, "cosmos");
      expect(result).toBe("123456...567890");
    });

    test("formats polkadot address correctly", () => {
      const result = formatAddress(testAddress, "polkadot");
      expect(result).toBe("123456...567890");
    });

    test("formats ripple address correctly", () => {
      const result = formatAddress(testAddress, "ripple");
      expect(result).toBe("123456...567890");
    });

    test("formats cardano address correctly", () => {
      const result = formatAddress(testAddress, "cardano");
      expect(result).toBe("123456...567890");
    });

    test("formats tezos address correctly", () => {
      const result = formatAddress(testAddress, "tezos");
      expect(result).toBe("123456...567890");
    });

    test("formats generic address correctly", () => {
      const result = formatAddress(testAddress, "generic");
      expect(result).toBe("123456...7890");
    });
  });

  describe("NEAR chain special handling", () => {
    test("keeps short NEAR addresses unchanged (under keepFullIfShort limit)", () => {
      const shortAddress = "alice.near";
      const result = formatAddress(shortAddress, "near");
      expect(result).toBe("alice.near");
    });

    test("formats long NEAR addresses normally", () => {
      const longAddress = "very-long-account-name.near";
      const result = formatAddress(longAddress, "near");
      expect(result).toBe("very-l...e.near");
    });

    test("handles exactly 15 character NEAR address", () => {
      const address = "123456789012345";
      const result = formatAddress(address, "near");
      expect(result).toBe("123456789012345");
    });

    test("formats 16+ character NEAR address", () => {
      const address = "1234567890123456";
      const result = formatAddress(address, "near");
      expect(result).toBe("123456...123456");
    });
  });

  describe("edge cases", () => {
    test("handles very short addresses", () => {
      const result = formatAddress("ab", "ethereum");
      expect(result).toBe("ab");
    });

    test("handles addresses exactly at the prefix + suffix length", () => {
      const address = "1234567890";
      const result = formatAddress(address, "ethereum");
      expect(result).toBe("1234567890");
    });

    test("handles unknown chain type with generic fallback", () => {
      const address = "1234567890123456789012345678901234567890";
      // @ts-ignore - testing with invalid chain type
      const result = formatAddress(address, "unknown-chain");
      expect(result).toBe("123456...7890");
    });

    test("handles very long addresses", () => {
      const longAddress = "1".repeat(100);
      const result = formatAddress(longAddress, "ethereum");
      expect(result).toBe("111111...1111");
    });

    test("handles addresses with special characters", () => {
      const address = "abc!@#$%^&*()_+1234567890";
      const result = formatAddress(address, "ethereum");
      expect(result).toBe("abc!@#...7890");
    });

    test("handles mixed case addresses", () => {
      const address = "AbCdEf1234567890123456789012345678901234";
      const result = formatAddress(address, "ethereum");
      expect(result).toBe("AbCdEf...1234");
    });
  });

  describe("format rules validation", () => {
    test("ethereum uses 6 prefix and 4 suffix", () => {
      const address = "1234567890abcdefghijklmnopqrstuvwxyz";
      const result = formatAddress(address, "ethereum");
      expect(result).toBe("123456...wxyz");
    });

    test("bitcoin uses 4 prefix and 4 suffix", () => {
      const address = "1234567890abcdefghijklmnopqrstuvwxyz";
      const result = formatAddress(address, "bitcoin");
      expect(result).toBe("1234...wxyz");
    });

    test("solana uses 6 prefix and 6 suffix", () => {
      const address = "1234567890abcdefghijklmnopqrstuvwxyz";
      const result = formatAddress(address, "solana");
      expect(result).toBe("123456...uvwxyz");
    });
  });
});
