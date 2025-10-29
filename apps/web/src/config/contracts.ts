/**
 * 智能合约配置
 * 存放所有合约地址和相关配置
 */

export const CONTRACTS = {
  // 课程合约地址
  COURSE_CONTRACT:
    "0x2aC2E8D99B585b321ffd875B95467a9B606e146a" as `0x${string}`,

  // YD Token 合约地址
  YD_TOKEN: "0x6Ebb0dAeEA2f89648aa077C57687fC851d199767" as `0x${string}`,

  // 其他合约地址可以在这里添加
  COURSE_DAO: "0x5E3Ab3256cfa5C89bEb63DbB8e12ba42d63F216f" as `0x${string}`,
} as const;

export const TOKEN_DECIMALS = 18;
