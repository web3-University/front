/**
 * 智能合约配置
 * 存放所有合约地址和相关配置
 */

export const CONTRACTS = {
  // 课程合约地址
  COURSE_CONTRACT:
    "0x1Af44F76cbF12d18Cb01C92d4076Da41e9B826EF" as `0x${string}`,

  // YD Token 合约地址
  YD_TOKEN: "0x6Ebb0dAeEA2f89648aa077C57687fC851d199767" as `0x${string}`,

  // 其他合约地址可以在这里添加
} as const;

export const TOKEN_DECIMALS = 18;
