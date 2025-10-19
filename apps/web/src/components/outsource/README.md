# Web3外包任务平台

## 📋 功能概述

这是一个基于YD币的Web3外包任务平台,集成到Web3大学项目中。主要功能包括:

### 1. YD币验证机制
- **优质用户准入**: 只有持有YD币的用户才能接取任务
- **信任体系**: YD币余额代表用户信誉等级
- **快速验证**: 连接钱包即可完成验证

### 2. 任务浏览与筛选
- **多维度筛选**: 按类别、难度、预算、排序方式筛选
- **智能搜索**: 关键词搜索项目
- **任务来源标识**: 清楚标注手动发布和爬虫抓取的任务

### 3. 任务发布
- **完整表单**: 标题、描述、预算、周期、类别、难度、技能标签
- **托管保证金**: 项目发布需支付10%预算作为保证金
- **智能推荐**: 自动推送给匹配的开发者

### 4. 任务展示
- **详细信息**: 预算、周期、申请人数、难度等级
- **发布者评分**: 显示发布者历史评价
- **技能标签**: 快速了解所需技能

## 📁 项目结构

```
/apps/web/src/components/outsource/
├── OutsourceView.tsx           # 主视图组件
├── ProjectHero.tsx             # Hero横幅组件
├── YDTokenVerification.tsx     # YD币验证组件
├── ProjectFilters.tsx          # 筛选器组件
├── ProjectList.tsx             # 项目列表组件
└── PostProjectModal.tsx        # 发布项目弹窗组件
```

## 🎨 设计特点

1. **统一风格**: 完全遵循项目现有的设计系统
   - 使用项目的Button组件
   - 沿用配色方案 (#8A71FF, #FF9D6B, #FF7A7B)
   - 保持圆角、阴影、过渡动画等视觉元素一致

2. **渐变与光晕**: 科技感背景效果
3. **响应式设计**: 适配各种屏幕尺寸
4. **微交互**: 悬停效果、过渡动画

## 🚀 使用方法

### 访问外包平台
```
http://localhost:3000/outsource
```

### 用户流程

#### 开发者流程:
1. 访问外包平台
2. 验证YD币身份
3. 浏览和筛选任务
4. 申请感兴趣的任务
5. 等待项目方审核

#### 项目方流程:
1. 访问外包平台  
2. 点击"发布项目"按钮
3. 填写项目详情表单
4. 支付托管保证金
5. 审核开发者申请

## 🔧 待实现功能

### 1. Web3集成
```typescript
// 在YDTokenVerification.tsx中实现
import { useAccount, useReadContract } from 'wagmi';

const { address } = useAccount();
const { data: balance } = useReadContract({
  address: YD_TOKEN_ADDRESS,
  abi: YD_TOKEN_ABI,
  functionName: 'balanceOf',
  args: [address],
});
```

### 2. 爬虫系统
创建后端服务来抓取外部平台任务:

```javascript
// backend/services/crawler.js
const puppeteer = require('puppeteer');

async function crawlUpwork() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.upwork.com/nx/search/jobs/?q=blockchain');
  
  const jobs = await page.evaluate(() => {
    // 提取任务数据
    return Array.from(document.querySelectorAll('.job-tile')).map(job => ({
      title: job.querySelector('.job-title').textContent,
      description: job.querySelector('.description').textContent,
      budget: job.querySelector('.budget').textContent,
      // ... 其他字段
    }));
  });
  
  await browser.close();
  return jobs;
}

// 定时任务，每小时执行一次
setInterval(crawlUpwork, 3600000);
```

### 3. 智能合约
```solidity
// contracts/OutsourcePlatform.sol
pragma solidity ^0.8.0;

contract OutsourcePlatform {
    struct Project {
        address publisher;
        uint256 budget;
        uint256 deposit; // 10% 保证金
        address assignedDev;
        bool completed;
    }
    
    mapping(uint256 => Project) public projects;
    
    function postProject(uint256 budget) external payable {
        require(msg.value >= budget / 10, "Insufficient deposit");
        // 创建项目逻辑
    }
    
    function applyForProject(uint256 projectId) external {
        require(ydToken.balanceOf(msg.sender) >= MIN_YD_REQUIRED, "Insufficient YD tokens");
        // 申请逻辑
    }
    
    function completeProject(uint256 projectId) external {
        // 完成项目，释放资金
    }
}
```

### 4. API端点
```typescript
// backend/routes/projects.ts
router.get('/projects', async (req, res) => {
  const { category, difficulty, budget, sort } = req.query;
  // 查询并返回项目列表
});

router.post('/projects', async (req, res) => {
  // 创建新项目
});

router.post('/projects/:id/apply', async (req, res) => {
  // 申请项目
});
```

## 📊 数据结构

### Project接口
```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  difficulty: "初级" | "中级" | "高级";
  category: string;
  deadline: string;
  applicants: number;
  verified: boolean;
  publisher: string;
  rating: number;
  source: "manual" | "crawler";
  tags: string[];
  publishedAt: string;
}
```

## 🎯 下一步开发计划

1. **第一阶段 (1-2周)**
   - [ ] 连接Web3钱包
   - [ ] 实现YD币余额查询
   - [ ] 创建后端API
   - [ ] 数据库设计

2. **第二阶段 (2-3周)**
   - [ ] 实现项目发布功能
   - [ ] 开发申请系统
   - [ ] 消息通知系统
   - [ ] 评价系统

3. **第三阶段 (3-4周)**
   - [ ] 部署智能合约
   - [ ] 集成托管支付
   - [ ] 开发爬虫系统
   - [ ] 自动化任务同步

4. **第四阶段 (4-5周)**
   - [ ] 争议解决机制
   - [ ] 多语言支持
   - [ ] 性能优化
   - [ ] 安全审计

## 🔐 安全考虑

1. **智能合约审计**: 在上线前必须进行专业审计
2. **XSS防护**: 对用户输入进行严格过滤
3. **CSRF防护**: 使用token验证
4. **Rate Limiting**: 防止爬虫滥用API
5. **数据加密**: 敏感信息加密存储

## 📝 贡献指南

欢迎贡献代码!请遵循以下流程:

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证

## 📞 联系方式

如有问题或建议,请通过以下方式联系:
- GitHub Issues
- Email: support@web3university.com
