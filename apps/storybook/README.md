# Storybook

## 使用说明

这是 Web3 University UI 组件库的 Storybook 文档服务。

### 启动开发服务器

```bash
# 从项目根目录运行
pnpm dev:storybook

# 或者在 apps/storybook 目录中运行
pnpm dev
```

Storybook 将在 http://localhost:6006 启动。

### 构建静态文件

```bash
# 从项目根目录运行
pnpm build:storybook

# 或者在 apps/storybook 目录中运行
pnpm build
```

构建后的文件将输出到 `storybook-static` 目录。

### 预览构建结果

```bash
# 在 apps/storybook 目录中运行
pnpm preview
```

## 添加新的 Story

在 `src` 目录中创建 `.stories.tsx` 文件：

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "@web3-university/ui";

const meta = {
  title: "UI/YourComponent",
  component: YourComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```