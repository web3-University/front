// 导入 Rollup 插件
import swc from "@rollup/plugin-swc"; // SWC 编译器插件，用于 TypeScript/JSX 编译
import resolve from "@rollup/plugin-node-resolve"; // 解析 node_modules 中的模块
import commonjs from "@rollup/plugin-commonjs"; // 将 CommonJS 模块转换为 ES6
import json from "@rollup/plugin-json"; // 支持导入 JSON 文件
import peerDepsExternal from "rollup-plugin-peer-deps-external"; // 将 peer dependencies 标记为外部依赖
import { terser } from "rollup-plugin-terser"; // 代码压缩插件
import dts from "rollup-plugin-dts"; // 生成 TypeScript 声明文件
import postcss from "rollup-plugin-postcss"; // CSS 处理插件

// 判断是否为生产环境构建（非 watch 模式）
const production = !process.env.ROLLUP_WATCH;

export default [
  // 主要构建配置 - 生成 JavaScript 包
  {
    // 入口文件
    input: "src/index.ts",
    // 输出配置
    output: [
      {
        file: "dist/index.js", // CommonJS 格式输出
        format: "cjs", // CommonJS 模块格式
        // sourcemap: true,              // 生成 source map
        exports: "named", // 使用命名导出
      },
      {
        file: "dist/index.esm.js", // ES 模块格式输出
        format: "es", // ES 模块格式
        sourcemap: true, // 生成 source map
      },
    ],
    // 插件配置
    plugins: [
      // 将 peerDependencies 标记为外部依赖，不打包进最终文件
      peerDepsExternal(),
      // 解析 node_modules 中的模块
      resolve({
        browser: true, // 优先使用浏览器版本的包
        preferBuiltins: false, // 不使用 Node.js 内置模块
        extensions: [".js", ".ts", ".tsx", ".json"], // 支持的文件扩展名
      }),
      // 转换 CommonJS 模块为 ES6
      commonjs(),
      // 支持导入 JSON 文件
      json(),
      // CSS 处理
      postcss({
        extract: false, // 提取 CSS 到单独文件
        inject: true, // 将 CSS 注入到 JS 中，运行时自动插入到
        minimize: production, // 生产环境压缩 CSS
        modules: false, // 禁用 CSS Modules，使用普通CSS
      }),
      // SWC 编译器配置
      swc({
        swc: {
          jsc: {
            target: "es2020", // 编译目标为 ES2020
            parser: {
              syntax: "typescript", // 解析 TypeScript 语法
              tsx: true, // 支持 TSX (TypeScript + JSX)
            },
            transform: {
              react: {
                runtime: "automatic", // 使用 React 17+ 的自动运行时
              },
            },
          },
          module: {
            type: "es6", // 输出 ES6 模块
          },
          sourceMaps: true, // 生成 source maps
        },
      }),
      // 生产环境下压缩代码
      production &&
        terser({
          compress: {
            drop_console: true, // 移除 console 语句
          },
        }),
    ].filter(Boolean), // 过滤掉 falsy 值（如开发模式下的 terser）
    // 外部依赖 - 这些包不会被打包，需要用户自己安装
    external: [
      "react",
      "react-dom",
      "wagmi",
      "@rainbow-me/rainbowkit",
      "viem",
      "@tanstack/react-query",
    ],
  },
  // 类型定义构建配置 - 生成 TypeScript 声明文件
  {
    // 入口文件
    input: "src/index.ts",
    // 输出配置
    output: {
      file: "dist/index.d.ts", // TypeScript 声明文件输出
      format: "es", // ES 模块格式
    },
    // 插件配置
    plugins: [
      dts(), // 生成 TypeScript 声明文件
    ],
    // 外部依赖 - 包括 CSS 文件和其他依赖
    external: [
      /\.css$/,
      "react",
      "react-dom",
      "wagmi",
      "@rainbow-me/rainbowkit",
      "viem",
      "@tanstack/react-query",
    ],
  },
];
