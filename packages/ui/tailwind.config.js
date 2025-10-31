// packages/ui/tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 自定义断点
      screens: {
        xs: "375px", // 小屏手机
        sm: "640px", // 大屏手机
        md: "768px", // 平板
        lg: "1024px", // 小屏电脑
        xl: "1280px", // 桌面
        "2xl": "1536px", // 大屏桌面
        // 自定义断点
        mobile: { max: "767px" }, // 移动端
        tablet: { min: "768px", max: "1023px" }, // 平板
        desktop: { min: "1024px" }, // 桌面
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      // 移动端优化的间距
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
