// 导入要测试的addressFormat函数
import { addressFormat } from "../../../src/utils/addressFormat";

// describe: Jest测试套件，用于组织相关的测试用例
describe("addressFormat", () => {
  test("formats valid Ethereum address correctly", () => {
    // 准备测试数据：标准的以太坊地址
    const address = "0x1234567890123456789012345678901234567890";
    // 执行被测试的函数
    const result = addressFormat(address);

    // expect + toBe: 验证函数返回值是否符合预期格式
    expect(result).toBe("0x1234...7890");
  });

  test("handles short address correctly", () => {
    const address = "0x123456";
    const result = addressFormat(address);

    expect(result).toBe("0x1234...3456");
  });

  test('returns "无效地址" for address not starting with 0x', () => {
    const address = "1234567890123456789012345678901234567890";
    const result = addressFormat(address);

    expect(result).toBe("无效地址");
  });

  test('returns "无效地址" for empty string', () => {
    const address = "";
    const result = addressFormat(address);

    expect(result).toBe("无效地址");
  });

  test('returns "无效地址" for null input', () => {
    const result = addressFormat(null);

    expect(result).toBe("无效地址");
  });

  test('returns "无效地址" for undefined input', () => {
    const result = addressFormat(undefined);

    expect(result).toBe("无效地址");
  });

  test("handles minimum valid address length", () => {
    const address = "0x1234";
    const result = addressFormat(address);

    expect(result).toBe("0x1234...1234");
  });

  test("handles address with exactly 6 characters after 0x", () => {
    const address = "0x123456";
    const result = addressFormat(address);

    expect(result).toBe("0x1234...3456");
  });

  test("handles very long address", () => {
    const address = "0x" + "1".repeat(100);
    const result = addressFormat(address);

    expect(result).toBe("0x1111...1111");
  });

  test("handles address with mixed case", () => {
    const address = "0xAbCdEf1234567890123456789012345678901234";
    const result = addressFormat(address);

    expect(result).toBe("0xAbCd...1234");
  });
});
