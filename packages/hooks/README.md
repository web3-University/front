# @web3-university/hooks

Web3 University 自定义 React Hooks 库

## 安装

```bash
pnpm add @web3-university/hooks
```

## 包含的 Hooks

### useLocalStorage

管理 localStorage 的自定义 hook，提供类似 useState 的 API。

```typescript
import { useLocalStorage } from '@web3-university/hooks';

function App() {
  const [name, setName] = useLocalStorage('name', 'Guest');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

### useDebounce

防抖处理值变化的自定义 hook。

```typescript
import { useDebounce } from '@web3-university/hooks';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // 使用 debouncedSearchTerm 执行搜索
  }, [debouncedSearchTerm]);

  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
}
```

### useWindowSize

跟踪浏览器窗口尺寸的自定义 hook。

```typescript
import { useWindowSize } from '@web3-university/hooks';

function App() {
  const { width, height } = useWindowSize();

  return (
    <div>
      窗口尺寸: {width} x {height}
    </div>
  );
}
```

### usePrevious

获取 state 或 prop 前一个值的自定义 hook。

```typescript
import { usePrevious } from '@web3-university/hooks';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>当前值: {count}</p>
      <p>上一次的值: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm dev

# 构建
pnpm build

# 清理构建文件
pnpm clean
```

## 技术栈

- React 19.x
- TypeScript 5.x
- Rollup 4.x
