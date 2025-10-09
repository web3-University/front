# uni-wallet-lib

一个基于 wagmi v2 和 RainbowKit v2 构建的全面 Web3 钱包库，提供高级 React 接口用于钱包连接、链切换和 Web3 交互。

## 📦 安装

```bash
npm install uni-wallet-lib wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
# 或
pnpm add uni-wallet-lib wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```

## 🚀 快速开始

### 1. 配置 Provider

在你的应用根组件中引入 `WalletProvider`：

```tsx
import { WalletProvider } from 'uni-wallet-lib'
import '@rainbow-me/rainbowkit/styles.css'

function App() {
  return (
    <WalletProvider
      appName="My DApp"
      projectId="YOUR_WALLETCONNECT_PROJECT_ID"
      alchemyApiKey="YOUR_ALCHEMY_API_KEY"  // 可选
      infuraApiKey="YOUR_INFURA_API_KEY"    // 可选
      theme="auto"  // 'light' | 'dark' | 'auto'
    >
      <YourApp />
    </WalletProvider>
  )
}
```

#### Provider 配置参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `appName` | `string` | ✅ | 应用名称 |
| `projectId` | `string` | ✅ | WalletConnect Project ID |
| `alchemyApiKey` | `string` | ❌ | Alchemy API Key |
| `infuraApiKey` | `string` | ❌ | Infura API Key |
| `theme` | `'light' \| 'dark' \| 'auto'` | ❌ | 主题模式（默认：`auto`） |
| `queryClient` | `QueryClient` | ❌ | 自定义 TanStack Query Client |
| `initialState` | `State` | ❌ | Wagmi 初始状态 |

### 2. 使用钱包连接按钮

```tsx
import { WalletButton } from 'uni-wallet-lib'

function Header() {
  return (
    <div>
      <WalletButton />
    </div>
  )
}
```

---

## 📚 Hooks API

### 钱包基础 Hooks

#### `useWalletConnection`

管理钱包连接状态。

```tsx
import { useWalletConnection } from 'uni-wallet-lib'

function MyComponent() {
  const {
    isConnected,      // 是否已连接
    address,          // 用户地址
    connector,        // 当前连接器
    connect,          // 连接钱包
    disconnect,       // 断开连接
    isConnecting,     // 是否连接中
    isReconnecting    // 是否重连中
  } = useWalletConnection()

  return (
    <div>
      {isConnected ? (
        <>
          <p>地址: {address}</p>
          <button onClick={disconnect}>断开</button>
        </>
      ) : (
        <button onClick={() => connect()}>连接钱包</button>
      )}
    </div>
  )
}
```

#### `useWalletInfo`

获取钱包详细信息。

```tsx
import { useWalletInfo } from 'uni-wallet-lib'

function WalletInfo() {
  const {
    balance,      // 余额信息 { value: bigint, decimals: number, formatted: string, symbol: string }
    ensName,      // ENS 名称
    ensAvatar,    // ENS 头像
    chainId,      // 当前链 ID
    chain         // 当前链信息
  } = useWalletInfo()

  return (
    <div>
      <p>余额: {balance?.formatted} {balance?.symbol}</p>
      <p>ENS: {ensName || '未设置'}</p>
      <p>链: {chain?.name}</p>
    </div>
  )
}
```

#### `useNetworkSwitch`

切换网络。

```tsx
import { useNetworkSwitch } from 'uni-wallet-lib'
import { mainnet, polygon } from 'viem/chains'

function NetworkSwitcher() {
  const {
    switchToNetwork,  // 切换网络函数
    isPending,        // 是否切换中
    error            // 错误信息
  } = useNetworkSwitch()

  return (
    <div>
      <button
        onClick={() => switchToNetwork({ chainId: mainnet.id })}
        disabled={isPending}
      >
        切换到以太坊主网
      </button>
      <button
        onClick={() => switchToNetwork({ chainId: polygon.id })}
        disabled={isPending}
      >
        切换到 Polygon
      </button>
      {error && <p>错误: {error.message}</p>}
    </div>
  )
}
```

---

### 合约交互 Hooks

#### `useSimpleYDToken`

与 YD Token 合约交互。

```tsx
import { useSimpleYDToken } from 'uni-wallet-lib'
import { useState } from 'react'

function TokenDemo() {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  const {
    // 代币信息
    totalSupply,        // 总供应量
    balance,            // 当前用户余额
    allowance,          // 授权额度

    // 交易收据
    transferReceipt,    // 转账收据
    approveReceipt,     // 授权收据

    // 方法
    transfer,           // 转账
    approve,            // 授权
    exchangeETHForTokens,  // ETH 兑换 YD
    refetchBalance,     // 刷新余额
    refetchAllowance    // 刷新授权额度
  } = useSimpleYDToken({
    address: '0xYourTokenAddress',  // Token 合约地址（可选，有默认值）
    spenderAddress: '0xSpenderAddress',  // 授权地址（可选）
    enabled: true  // 是否启用（可选）
  })

  const handleTransfer = async () => {
    try {
      await transfer(recipient, amount)
      alert('转账成功！')
      refetchBalance()
    } catch (error) {
      console.error('转账失败:', error)
    }
  }

  const handleExchange = async (ethAmount: string) => {
    try {
      await exchangeETHForTokens(ethAmount)
      alert('兑换成功！')
      refetchBalance()
    } catch (error) {
      console.error('兑换失败:', error)
    }
  }

  return (
    <div>
      <h2>我的余额: {(Number(balance) / 1e18).toFixed(4)} YD</h2>

      <div>
        <h3>转账</h3>
        <input
          placeholder="接收地址"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          placeholder="数量"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleTransfer}>
          {transferReceipt.isLoading ? '转账中...' : '转账'}
        </button>
      </div>

      <div>
        <h3>ETH 兑换 YD (1 ETH = 4000 YD)</h3>
        <button onClick={() => handleExchange('0.1')}>
          兑换 0.1 ETH
        </button>
      </div>
    </div>
  )
}
```

**useSimpleYDToken 完整 API：**

| 属性/方法 | 类型 | 说明 |
|----------|------|------|
| `totalSupply` | `bigint` | 代币总供应量 |
| `balance` | `bigint` | 当前用户余额 |
| `allowance` | `bigint` | 授权额度 |
| `transferReceipt` | `Receipt` | 转账交易收据 |
| `approveReceipt` | `Receipt` | 授权交易收据 |
| `transfer(to, amount)` | `Promise` | 转账 |
| `approve(spender, amount)` | `Promise` | 授权 |
| `transferFrom(from, to, amount)` | `Promise` | 代理转账 |
| `exchangeETHForTokens(ether)` | `Promise` | ETH 兑换 YD |
| `refetchBalance()` | `Function` | 刷新余额 |
| `refetchAllowance()` | `Function` | 刷新授权额度 |

---

#### `useCourseContract`

与课程合约交互。

```tsx
import { useCourseContract } from 'uni-wallet-lib'
import { useState } from 'react'

function CourseDemo() {
  const [courseId, setCourseId] = useState('')

  const {
    // 读取方法（返回 Hook 结果）
    getTotalCourses,        // 获取课程总数
    getCourse,              // 获取课程信息
    getStudentCourses,      // 获取学生课程列表
    getInstructorCourses,   // 获取讲师课程列表
    hasAccess,              // 检查访问权限
    getCourseStudentCount,  // 获取课程学生数

    // 写入方法（返回 Promise）
    createCourse,           // 创建课程
    purchaseCourse,         // 购买课程

    // 交易收据
    createCourseReceipt,    // 创建课程收据
    purchaseCourseReceipt   // 购买课程收据
  } = useCourseContract({
    address: '0xYourCourseContractAddress',
    tokenDecimals: 18  // YD Token 精度
  })

  // 读取课程总数
  const totalCourses = getTotalCourses()

  // 读取特定课程信息
  const courseInfo = getCourse(courseId ? BigInt(courseId) : undefined)

  const handleCreateCourse = async () => {
    try {
      await createCourse(
        'Web3 开发课程',           // 标题
        '0xInstructorAddress',     // 讲师地址
        '100'                      // 价格（YD）
      )
      alert('课程创建成功！')
    } catch (error) {
      console.error('创建失败:', error)
    }
  }

  const handlePurchase = async () => {
    try {
      await purchaseCourse(BigInt(courseId))
      alert('购买成功！')
    } catch (error) {
      console.error('购买失败:', error)
    }
  }

  return (
    <div>
      <h2>课程总数: {totalCourses.data?.toString()}</h2>

      <div>
        <h3>创建课程</h3>
        <button onClick={handleCreateCourse}>
          {createCourseReceipt.isLoading ? '创建中...' : '创建课程'}
        </button>
      </div>

      <div>
        <h3>购买课程</h3>
        <input
          placeholder="课程 ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
        <button onClick={handlePurchase}>
          {purchaseCourseReceipt.isLoading ? '购买中...' : '购买'}
        </button>
      </div>

      {courseInfo.data && (
        <div>
          <h3>课程信息</h3>
          <p>标题: {courseInfo.data.title}</p>
          <p>价格: {(Number(courseInfo.data.price) / 1e18).toFixed(2)} YD</p>
          <p>讲师: {courseInfo.data.instructor}</p>
        </div>
      )}
    </div>
  )
}
```

**useCourseContract 完整 API：**

| 方法 | 类型 | 说明 |
|------|------|------|
| `getTotalCourses()` | `Hook<bigint>` | 获取课程总数 |
| `getCourse(courseId)` | `Hook<Course>` | 获取课程信息 |
| `getStudentCourses(address)` | `Hook<bigint[]>` | 获取学生课程列表 |
| `getInstructorCourses(address)` | `Hook<bigint[]>` | 获取讲师课程列表 |
| `getCourseStudents(courseId)` | `Hook<Address[]>` | 获取课程学生列表 |
| `hasAccess(student, courseId)` | `Hook<boolean>` | 检查访问权限 |
| `getCourseStudentCount(courseId)` | `Hook<bigint>` | 获取课程学生数 |
| `batchCheckAccess(student, courseIds)` | `Hook<boolean[]>` | 批量检查权限 |
| `createCourse(title, instructor, price)` | `Promise` | 创建课程 |
| `purchaseCourse(courseId)` | `Promise` | 购买课程 |

---

### 底层 Hooks

#### `useContractRead`

通用合约读取 Hook。

```tsx
import { useContractRead } from 'uni-wallet-lib'

const { data, isLoading, error, refetch } = useContractRead({
  address: '0xContractAddress',
  abi: contractABI,
  functionName: 'balanceOf',
  args: ['0xUserAddress'],
  enabled: true
})
```

#### `useContractWrite`

通用合约写入 Hook。

```tsx
import { useContractWrite } from 'uni-wallet-lib'

const {
  write,         // 同步写入
  writeAsync,    // 异步写入
  receipt,       // 交易收据
  isPending      // 是否等待中
} = useContractWrite({
  address: '0xContractAddress',
  abi: contractABI,
  functionName: 'transfer'
})

// 使用
await writeAsync({
  args: ['0xRecipient', BigInt(1000)],
  value: parseEther('0.1'),  // 发送 ETH（可选）
  gas: BigInt(100000)        // 自定义 gas（可选）
})
```

---

## 🎨 类型定义

### Course 类型

```typescript
interface Course {
  id: bigint
  title: string
  instructor: Address
  price: bigint
  isPublished: boolean
}
```

### WriteOverrides 类型

```typescript
interface WriteOverrides {
  args?: unknown[]      // 覆盖参数
  value?: bigint        // 发送的 ETH
  gas?: bigint          // 自定义 gas
}
```

---

## 🔧 支持的链

默认支持以下网络：

- Ethereum Mainnet
- Goerli Testnet
- Sepolia Testnet
- Polygon
- Arbitrum One
- Optimism
- Base

---

## 📝 示例项目

完整示例请查看 `example/` 目录：

```bash
cd example
pnpm dev
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- [wagmi 文档](https://wagmi.sh)
- [RainbowKit 文档](https://rainbowkit.com)
- [Viem 文档](https://viem.sh)
