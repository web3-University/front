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
import { formatAddress } from '@web3-university/libs';

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

## 📋 API 文档

### formatAddress(address, chain?)

格式化区块链地址字符串。

#### 参数

- `address` (string): 需要格式化的地址字符串
- `chain` (ChainType, 可选): 链类型，默认为 "ethereum"

#### 支持的链类型

| 链类型 | 前缀长度 | 后缀长度 | 特殊规则 |
|--------|----------|----------|----------|
| ethereum | 6 | 4 | - |
| bitcoin | 4 | 4 | - |
| solana | 6 | 6 | - |
| tron | 6 | 4 | - |
| cosmos | 6 | 6 | - |
| polkadot | 6 | 6 | - |
| ripple | 6 | 6 | - |
| cardano | 6 | 6 | - |
| tezos | 6 | 6 | - |
| near | 6 | 6 | 长度 ≤ 15 字符时保持完整 |
| generic | 6 | 4 | 通用格式 |

#### 返回值

- `string`: 格式化后的地址字符串
- 如果输入为空，返回空字符串
- 如果地址长度小于等于前缀+后缀长度，返回原地址

#### 示例

```typescript
// 基本用法
formatAddress("0x1234567890123456789012345678901234567890")
// 返回: "0x1234...7890"

// 空值处理
formatAddress("")
// 返回: ""

// 短地址处理
formatAddress("0x123")
// 返回: "0x123" (保持原样)

// NEAR 特殊处理
formatAddress("alice.near", "near")
// 返回: "alice.near" (短名称保持完整)
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
│   │   └── address.ts    # 地址格式化工具
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