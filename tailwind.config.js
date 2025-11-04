/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // 引用 node_modules 中的 UI 组件库
    "./node_modules/@web3-university/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 应用特定的扩展配置
    },
  },
  plugins: [],
};
