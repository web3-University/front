module.exports = {
  // 测试环境设置为 jsdom (模拟浏览器环境)
  testEnvironment: "jsdom",

  // 测试设置文件
  setupFilesAfterEnv: ["<rootDir>/tests/unit/setupTests.js"],
  setupFiles: ["<rootDir>/tests/unit/jest.setup.js"],

  // 自动清除 mock
  clearMocks: true,

  // 重置模块注册表
  resetModules: false,

  // 运行测试前重置 mock 调用和实例
  resetMocks: true,

  // 模块路径映射
  moduleNameMapper: {
    // CSS 文件映射
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // 图片文件映射
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "jest-transform-stub",
    // 路径别名映射
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // 测试文件匹配模式
  testMatch: [
    "<rootDir>/tests/unit/**/*.{test,spec}.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],

  // 忽略的文件和目录
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/build/",
    "<rootDir>/tests/e2e/",
    "<rootDir>/cypress/",
  ],

  // 收集测试覆盖率
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/reportWebVitals.ts",
  ],

  // 覆盖率报告格式
  coverageReporters: ["text", "lcov", "html"],

  // 转换配置
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "@swc/jest",
  },

  // 忽略转换的文件
  transformIgnorePatterns: ["<rootDir>/node_modules/"],

  // Jest Stare 报告配置
  reporters: [
    "default",
    [
      "jest-stare",
      {
        resultDir: "jest-stare",
        reportTitle: "Web3 Frontend Tests",
        coverageLink: "../coverage/lcov-report/index.html",
      },
    ],
  ],
};
