# 个人中心页面使用说明

## 功能概述

个人中心页面提供以下核心功能：

1. **用户信息管理**
   - 修改用户头像（支持图片上传）
   - 修改用户名
   - 修改邮箱
   - 所有信息绑定到钱包地址
   - 修改时需要钱包签名验证

2. **NFT 收藏展示**
   - 展示用户拥有的 NFT
   - 按稀有度分类（Common、Rare、Epic、Legendary）
   - 查看 NFT 详细信息和属性
   - 链接到区块链浏览器查看链上信息

## 访问路径

- URL: `/profile`
- 需要连接钱包才能访问

## 页面结构

```
/profile
├── 个人信息 Tab
│   ├── 用户头像上传
│   ├── 钱包地址（只读）
│   ├── 用户名编辑
│   ├── 邮箱编辑
│   └── 保存按钮（触发钱包签名）
└── 我的NFT Tab
    ├── NFT 统计信息
    ├── NFT 网格展示
    └── NFT 详情模态框
```

## 技术实现

### 钱包签名验证

修改用户信息时，系统会生成包含以下内容的签名消息：

```
更新个人信息
时间戳: {timestamp}
钱包地址: {address}
名称: {name}
邮箱: {email}
```

用户需要在钱包中确认签名，后端验证签名后才允许修改。

### 头像上传流程

1. 用户选择图片文件（限制 5MB 以内）
2. 前端显示预览
3. 保存时转换为 Blob 上传
4. 后端返回图片 URL
5. 将 URL 保存到用户信息

## 后端 API 接口要求

### 1. 获取用户信息

**接口**: `GET /users/profile`

**参数**:
- `address`: 钱包地址（query 参数）

**响应**:
```json
{
  "name": "用户名",
  "email": "user@example.com",
  "avatarUrl": "https://example.com/avatar.jpg",
  "walletAddress": "0x..."
}
```

### 2. 更新用户信息

**接口**: `POST /users/profile`

**请求体**:
```json
{
  "walletAddress": "0x...",
  "name": "用户名",
  "email": "user@example.com",
  "avatarUrl": "https://example.com/avatar.jpg",
  "signature": "0x...",
  "message": "更新个人信息\n时间戳: 1234567890\n...",
  "timestamp": 1234567890
}
```

**响应**:
```json
{
  "success": true,
  "message": "保存成功"
}
```

**验证要求**:
1. 验证签名是否有效
2. 验证时间戳是否在合理范围内（建议5分钟内）
3. 验证邮箱格式
4. 验证用户名不为空

### 3. 上传头像

**接口**: `POST /upload/avatar`

**请求**: FormData，包含 `file` 字段

**响应**:
```json
{
  "url": "https://example.com/avatars/xxx.jpg"
}
```

**要求**:
- 接受常见图片格式（JPEG、PNG、GIF、WebP）
- 限制文件大小（建议 5MB）
- 建议压缩和优化图片
- 返回可公开访问的图片 URL

### 4. 获取用户 NFT 列表

**接口**: `GET /nfts/user`

**参数**:
- `address`: 钱包地址（query 参数）

**响应**:
```json
[
  {
    "id": 1,
    "tokenId": "1",
    "name": "NFT 名称",
    "description": "NFT 描述",
    "imageUrl": "https://example.com/nft.jpg",
    "rarity": "rare",
    "contractAddress": "0x...",
    "obtainedDate": "2024-01-15",
    "attributes": [
      {
        "trait_type": "Type",
        "value": "Achievement"
      }
    ]
  }
]
```

**说明**:
- `rarity`: 必须是 "common" | "rare" | "epic" | "legendary" 之一
- `imageUrl`: 可以是图片 URL 或 emoji
- `attributes`: 可选，NFT 的元数据属性

## 签名验证示例（后端）

### Node.js + ethers.js

```javascript
import { verifyMessage } from "ethers";

function verifySignature(address, message, signature) {
  try {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    return false;
  }
}

// 使用示例
app.post("/users/profile", async (req, res) => {
  const { walletAddress, signature, message, timestamp, name, email, avatarUrl } = req.body;

  // 1. 验证时间戳
  const now = Date.now();
  const timeDiff = Math.abs(now - timestamp);
  if (timeDiff > 5 * 60 * 1000) { // 5分钟
    return res.status(400).json({ error: "签名已过期" });
  }

  // 2. 验证签名
  const isValid = verifySignature(walletAddress, message, signature);
  if (!isValid) {
    return res.status(400).json({ error: "签名验证失败" });
  }

  // 3. 验证数据
  if (!name || !email) {
    return res.status(400).json({ error: "用户名和邮箱不能为空" });
  }

  // 4. 保存到数据库
  await db.users.upsert({
    where: { walletAddress },
    update: { name, email, avatarUrl },
    create: { walletAddress, name, email, avatarUrl }
  });

  res.json({ success: true, message: "保存成功" });
});
```

### Python + web3.py

```python
from eth_account.messages import encode_defunct
from web3 import Web3

def verify_signature(address, message, signature):
    try:
        w3 = Web3()
        message_hash = encode_defunct(text=message)
        recovered_address = w3.eth.account.recover_message(message_hash, signature=signature)
        return recovered_address.lower() == address.lower()
    except Exception:
        return False
```

## 环境变量

确保设置以下环境变量：

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

## 注意事项

1. **安全性**
   - 所有用户信息修改都需要钱包签名验证
   - 后端必须验证签名的有效性
   - 使用时间戳防止签名重放攻击

2. **用户体验**
   - 头像上传前会显示预览
   - 保存时显示加载状态
   - 操作成功/失败会显示相应提示

3. **NFT 展示**
   - 当前使用模拟数据作为示例
   - 需要后端实现真实的 NFT 查询逻辑
   - 可以集成第三方 NFT API（如 Alchemy、Moralis）

4. **错误处理**
   - 网络请求失败会显示错误提示
   - 钱包签名取消会终止保存流程
   - API 错误会显示具体错误信息

## 文件结构

```
apps/web/src/
├── app/
│   └── profile/
│       └── page.tsx                    # 个人中心页面路由
├── components/
│   └── profile/
│       ├── ProfileView.tsx             # 主视图组件
│       ├── UserInfoSection.tsx         # 用户信息编辑组件
│       └── NFTGallery.tsx              # NFT 展示组件
├── lib/
│   └── api/
│       └── profile.ts                  # API 服务函数
└── config/
    └── routes.ts                       # 路由配置（已添加 /profile）
```

## 后续优化建议

1. **图片优化**
   - 使用 CDN 加速图片访问
   - 支持多种尺寸的头像（缩略图、原图）
   - 使用 WebP 格式减小文件大小

2. **NFT 功能增强**
   - 集成真实的 NFT 数据（从链上或 API 获取）
   - 支持多链 NFT 展示
   - NFT 筛选和搜索功能
   - NFT 转让功能

3. **数据缓存**
   - 使用 React Query 缓存用户信息
   - 减少重复 API 请求
   - 优化加载性能

4. **表单验证**
   - 添加更详细的表单验证规则
   - 实时验证反馈
   - 防止重复提交
