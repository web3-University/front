const baseConfig = require("../../jest.config.base.js");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  displayName: "components",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
};
