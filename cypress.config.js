const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // 基础URL，指向本地开发服务器
    baseUrl: "http://localhost:3000",

    // 测试文件存放目录
    specPattern: "tests/e2e/**/*.cy.{js,jsx,ts,tsx}",

    // 支持文件目录
    supportFile: "tests/e2e/support/e2e.js",

    // 视口设置
    viewportWidth: 1280,
    viewportHeight: 720,

    // 测试超时设置（Web3交互可能较慢）
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,

    // 在测试失败时录制视频和截图
    video: true,
    screenshotOnRunFailure: true,

    // Web3 测试环境变量
    env: {
      WALLET_PRIVATE_KEY: "test_private_key_here",
      TEST_ACCOUNT_ADDRESS: "0x742d35Cc6634C0532925a3b8D0C9e3e0C8b0e8e8",
      NETWORK_URL: "http://localhost:8545",
    },

    // 忽略Web3相关错误
    chromeWebSecurity: false,

    // 重试配置
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
