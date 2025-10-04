import baseConfig from "../../jest.config.base.js";

/** @type {import('jest').Config} */
export default {
  ...baseConfig,
  displayName: "libs",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
};
