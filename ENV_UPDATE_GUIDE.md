# ========== 环境变量配置更新说明 ==========

## 需要在 .env.local 中添加以下配置：

# API 基础地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# YD代币配置
NEXT_PUBLIC_YD_TOKEN_ADDRESS=0x6Ebb0dAeEA2f89648aa077C57687fC851d199767
NEXT_PUBLIC_MIN_YD_REQUIRED=100

## 完整的 .env.local 示例：

```env
# API 配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# YD代币配置
NEXT_PUBLIC_YD_TOKEN_ADDRESS=0x6Ebb0dAeEA2f89648aa077C57687fC851d199767
NEXT_PUBLIC_MIN_YD_REQUIRED=100

# 其他已有配置...
```

## 后端需要实现的 API 接口

### 1. YD币余额查询
**GET** `/api/outsource/balance?walletAddress={address}`

响应示例：
```json
{
  "data": {
    "balance": "1500000000000000000000",
    "formattedBalance": "1500.00",
    "hasMinimumBalance": true,
    "minimumRequired": "100"
  },
  "statusCode": 200
}
```

### 2. 项目列表查询
**GET** `/api/outsource/projects?category=all&difficulty=all&sort=latest&page=1&limit=12`

响应示例：
```json
{
  "data": {
    "projects": [
      {
        "id": 1,
        "title": "开发DeFi借贷协议",
        "description": "需要有经验的Solidity开发者...",
        "category": "smart-contract",
        "difficulty": "advanced",
        "budget": {
          "min": 50000,
          "max": 80000,
          "currency": "YD"
        },
        "deadline": "2025-12-31",
        "skills": ["Solidity", "DeFi", "Smart Contract"],
        "createdAt": "2025-10-15T10:00:00Z",
        "createdBy": {
          "walletAddress": "0x...",
          "username": "DeFi Labs",
          "rating": 4.9
        },
        "status": "open",
        "applicants": 12
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 12,
    "hasMore": true
  },
  "statusCode": 200
}
```

### 3. 创建项目
**POST** `/api/outsource/projects`

请求体：
```json
{
  "title": "项目标题",
  "description": "项目描述",
  "category": "smart-contract",
  "difficulty": "intermediate",
  "budgetMin": 10000,
  "budgetMax": 20000,
  "deadline": "2025-12-31",
  "skills": ["React", "TypeScript"]
}
```

### 4. 申请项目
**POST** `/api/outsource/projects/:id/apply`

请求体：
```json
{
  "proposal": "我的申请提案...",
  "estimatedDuration": 30,
  "proposedBudget": 15000
}
```
