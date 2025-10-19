# @web3-university/libs

Web3 University 通用工具库，提供区块链相关的实用工具函数。

## 📦 安装

```bash
# 从私有仓库安装
npm install @web3-university/libs --registry=http://8.138.248.76:4873/

# 或使用 pnpm
pnpm add @web3-university/libs --registry=http://8.138.248.76:4873/
```

## 🚀 使用方法

### 地址格式化 (formatAddress)

用于格式化各种区块链地址，支持多种链类型，自动按照不同链的规则进行截断显示。

```typescript
import { formatAddress } from "@web3-university/libs";

// 以太坊地址格式化 (默认)
const ethAddress = "0x1234567890123456789012345678901234567890";
console.log(formatAddress(ethAddress));
// 输出: "0x1234...7890"

// 指定链类型
console.log(formatAddress(ethAddress, "ethereum"));
// 输出: "0x1234...7890"

// Bitcoin 地址
const btcAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
console.log(formatAddress(btcAddress, "bitcoin"));
// 输出: "1A1z...fNa"

// Solana 地址
const solAddress = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";
console.log(formatAddress(solAddress, "solana"));
// 输出: "9WzDXw...AWWM"

// NEAR 账户名 (短名称保持完整)
console.log(formatAddress("alice.near", "near"));
// 输出: "alice.near" (保持完整)

console.log(formatAddress("very-long-account-name.near", "near"));
// 输出: "very-l...e.near"
```

### 时间格式化 (formatTime)

用于格式化时间，支持多种预定义格式、相对时间和自定义格式。

```typescript
import { formatTime } from "@web3-university/libs";

// 默认格式 (YYYY-MM-DD HH:mm:ss)
console.log(formatTime(new Date()));
// 输出: "2025-10-10 23:45:30"

// 指定格式
console.log(formatTime(Date.now(), { format: "YYYY-MM-DD" }));
// 输出: "2025-10-10"

console.log(formatTime(new Date(), { format: "YYYY/MM/DD HH:mm:ss" }));
// 输出: "2025/10/10 23:45:30"

console.log(formatTime(new Date(), { format: "MM-DD HH:mm" }));
// 输出: "10-10 23:45"

// 相对时间
console.log(formatTime(new Date(), { format: "relative" }));
// 输出: "刚刚"

const oneHourAgo = Date.now() - 60 * 60 * 1000;
console.log(formatTime(oneHourAgo, { format: "relative" }));
// 输出: "1小时前"

// 自定义格式
console.log(
  formatTime(new Date(), {
    format: "custom",
    customFormat: "YYYY年MM月DD日 HH:mm",
  })
);
// 输出: "2025年10月10日 23:45"

// 支持多种输入类型
formatTime(new Date()); // Date 对象
formatTime(1728576000000); // 时间戳
formatTime("2025-10-10"); // 日期字符串
```

## 📋 API 文档

### formatAddress(address, chain?)

格式化区块链地址字符串。

#### 参数

- `address` (string): 需要格式化的地址字符串
- `chain` (ChainType, 可选): 链类型，默认为 "ethereum"

#### 支持的链类型

| 链类型   | 前缀长度 | 后缀长度 | 特殊规则                 |
| -------- | -------- | -------- | ------------------------ |
| ethereum | 6        | 4        | -                        |
| bitcoin  | 4        | 4        | -                        |
| solana   | 6        | 6        | -                        |
| tron     | 6        | 4        | -                        |
| cosmos   | 6        | 6        | -                        |
| polkadot | 6        | 6        | -                        |
| ripple   | 6        | 6        | -                        |
| cardano  | 6        | 6        | -                        |
| tezos    | 6        | 6        | -                        |
| near     | 6        | 6        | 长度 ≤ 15 字符时保持完整 |
| generic  | 6        | 4        | 通用格式                 |

#### 返回值

- `string`: 格式化后的地址字符串
- 如果输入为空，返回空字符串
- 如果地址长度小于等于前缀+后缀长度，返回原地址

#### 示例

```typescript
// 基本用法
formatAddress("0x1234567890123456789012345678901234567890");
// 返回: "0x1234...7890"

// 空值处理
formatAddress("");
// 返回: ""

// 短地址处理
formatAddress("0x123");
// 返回: "0x123" (保持原样)

// NEAR 特殊处理
formatAddress("alice.near", "near");
// 返回: "alice.near" (短名称保持完整)
```

### formatTime(time, options?)

格式化时间字符串。

#### 参数

- `time` (TimeInput): 时间输入，可以是 Date 对象、时间戳（number）或日期字符串（string）
- `options` (FormatOptions, 可选): 格式化选项
  - `format` (FormatType): 格式类型，默认为 "YYYY-MM-DD HH:mm:ss"
  - `customFormat` (string): 自定义格式字符串，仅在 format 为 "custom" 时使用

#### 支持的格式类型

| 格式类型              | 说明                     | 示例输出                       |
| --------------------- | ------------------------ | ------------------------------ |
| `YYYY-MM-DD`          | 年-月-日                 | "2025-10-10"                   |
| `YYYY-MM-DD HH:mm:ss` | 年-月-日 时:分:秒 (默认) | "2025-10-10 23:45:30"          |
| `YYYY/MM/DD`          | 年/月/日                 | "2025/10/10"                   |
| `YYYY/MM/DD HH:mm:ss` | 年/月/日 时:分:秒        | "2025/10/10 23:45:30"          |
| `MM-DD HH:mm`         | 月-日 时:分              | "10-10 23:45"                  |
| `HH:mm:ss`            | 时:分:秒                 | "23:45:30"                     |
| `relative`            | 相对时间                 | "刚刚"、"5 分钟前"、"2 小时前" |
| `custom`              | 自定义格式               | 根据 customFormat 参数         |

#### 自定义格式占位符

在使用 `format: "custom"` 时，可以使用以下占位符：

- `YYYY` - 四位年份
- `MM` - 两位月份（补零）
- `DD` - 两位日期（补零）
- `HH` - 两位小时（补零）
- `mm` - 两位分钟（补零）
- `ss` - 两位秒数（补零）

#### 相对时间规则

- 小于 60 秒：显示"刚刚"
- 1-59 分钟：显示"X 分钟前"
- 1-23 小时：显示"X 小时前"
- 1-29 天：显示"X 天前"
- 1-11 个月：显示"X 个月前"
- 12 个月及以上：显示"X 年前"

#### 返回值

- `string`: 格式化后的时间字符串
- 如果输入无效，返回空字符串

#### 示例

```typescript
const now = new Date();

// 预定义格式
formatTime(now, { format: "YYYY-MM-DD" });
// 返回: "2025-10-10"

// 相对时间
formatTime(Date.now() - 5 * 60 * 1000, { format: "relative" });
// 返回: "5分钟前"

// 自定义格式
formatTime(now, {
  format: "custom",
  customFormat: "YYYY年MM月DD日 星期",
});
// 返回: "2025年10月10日 星期"

// 错误处理
formatTime("invalid-date");
// 返回: ""
```

## 🧪 测试

运行测试：

```bash
# 运行所有测试
pnpm test

# 只运行 libs 包测试
pnpm test -- --testPathPattern="packages/libs"

# 在 libs 目录中运行测试
cd packages/libs && npx jest
```

## 🏗️ 构建

```bash
# 构建包
pnpm run build

# 清理构建文件
pnpm run clean
```

## 📦 发布

```bash
# 从根目录发布
pnpm run publish:libs

# 从 libs 目录发布
cd packages/libs && pnpm run publish:libs
```

## 🔧 开发

### 项目结构

```
packages/libs/
├── src/
│   ├── format/
│   │   ├── address.ts    # 地址格式化工具
│   │   └── time.ts       # 时间格式化工具
│   └── index.ts          # 主入口文件
├── __tests__/
│   ├── address.test.ts   # 地址格式化测试
│   └── setup.js          # 测试设置
├── dist/                 # 构建输出 (发布时生成)
├── package.json
├── README.md
├── jest.config.js        # Jest 配置
├── rollup.config.js      # Rollup 构建配置
└── tsconfig.json         # TypeScript 配置
```

### 添加新功能

1. 在 `src/` 目录下创建新的工具函数
2. 在 `src/index.ts` 中导出新函数
3. 在 `__tests__/` 目录下添加对应的测试文件
4. 更新此 README 文档

## 📄 许可证

此项目是 Web3 University 的私有包，仅供内部使用。

## 🤝 贡献

如需贡献代码或报告问题，请联系 Web3 University 开发团队。

---

**注意**: 此包托管在私有 npm 仓库 (http://8.138.248.76:4873/)，需要相应的访问权限才能安装和使用。
