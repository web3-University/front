const baseConfig = require("@web3-university/ui/tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // 引用共享组件库
    "../../packages/ui/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      // 应用特定的扩展配置
    },
  },
};
