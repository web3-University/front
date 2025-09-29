const baseConfig = require("../../jest.config.base.js");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  displayName: "web",
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.js"],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom",
};
