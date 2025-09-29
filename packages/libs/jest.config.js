const baseConfig = require("../../jest.config.base.js");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  displayName: "libs",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
};
