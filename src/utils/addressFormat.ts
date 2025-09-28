function addressFormat(address: string): string {
  if (!address?.startsWith("0x")) {
    return "无效地址";
  }

  // 截取并格式化地址
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
  )}`;
}
export { addressFormat };
