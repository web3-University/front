// apps/web/src/i18n/dictionaries/zh-CN.ts
import type { MessageTree } from "@/i18n/translator";

const zhCN: MessageTree = {
  common: {
    appName: "WEB3大学",
    appTagline: "去中心化教育平台",
    language: "语言",
    viewAll: "查看全部",
    loading: "加载中...",
    retry: "重试",
    noData: "暂无数据",
    errorWithMessage: "加载失败: {message}",
    connectWallet: "连接钱包",
    connectShort: "连接",
    menu: "菜单",
  },
  metadata: {
    title: "WEB3大学 - 去中心化教育平台",
    description:
      "区块链驱动的未来教育平台，通过代币激励与 DAO 治理，打造可信、透明的全球学习体验。",
    keywords: "Web3, 区块链, 在线教育, NFT, 去中心化",
  },
  navigation: {
    home: "首页",
    market: "课程市场",
    dao: "DAO治理",
    outsource: "外包平台",
  },
  hero: {
    badge: "Web3 教育革命",
    titleHighlight: "未来教育从这里开始",
    description:
      "基于区块链的去中心化大学平台，通过代币激励和 DAO 治理，构建全球可信、透明的数字教育生态，让学习者与教育者共同成长。",
    primaryCta: "开始学习",
    secondaryCta: "成为教师",
    metrics: {
      registeredUsers: "注册用户",
      totalCourses: "课程总数",
      tradingVolume: "交易量",
      nftCertificates: "NFT证书",
    },
  },
  featuredCourses: {
    title: "精选课程",
    description: "顶级讲师倾力打造的高质量课程，帮助你快速进入 Web3 世界",
    viewAll: "查看全部",
    loading: "加载中...",
    error: "加载失败: {message}",
    retry: "重试",
    empty: "暂无精选课程",
    noDescription: "暂无描述",
    noCategory: "未分类",
    unknownInstructor: "未知讲师",
  },
  platformAdvantages: {
    title: "平台核心优势",
    description: "结合区块链技术和教育创新，打造全新的去中心化学习体验",
    items: {
      tokenIncentives: {
        title: "代币激励系统",
        description:
          "学习获得 YD 代币奖励，教学获得收益分成，完全透明的激励机制",
      },
      blockchainCertification: {
        title: "区块链认证",
        description: "学习成果自动生成 NFT 证书，永久保存在链上，全球认可",
      },
      daoGovernance: {
        title: "DAO 治理",
        description: "社区自治决策、争议解决机制，让每个用户都能参与平台治理",
      },
    },
  },
  instructorInvitation: {
    badge: "成为讲师，开始收益之旅",
    title: "分享知识，获得价值",
    description:
      "加入 Web3 大学讲师团队，通过区块链技术确保公平透明的收益分配。每发布一门课程即可获得 10 YD 代币，课程销售收益的 85% 归您所有。",
    ctaPrimary: "立即成为讲师",
    ctaSecondary: "创建课程",
    highlights: {
      highEarnings: {
        title: "85% 高收益",
        description: "课程销售收益的85%直接到账，收益透明可查",
      },
      tokenRewards: {
        title: "代币激励",
        description: "发布课程、获得好评、学生完课都有额外奖励",
      },
      globalReach: {
        title: "触达 50,000+ 学员",
        description: "触达50,000+全球学员，扩大您的影响力",
      },
    },
    stats: {
      activeInstructors: "活跃讲师",
      totalRevenue: "讲师总收益",
      averageRating: "平均评分",
      totalStudents: "学员总数",
    },
  },
  tokenExchange: {
    title: "兑换中心",
    subtitle: "快速兑换 YD 代币，购买课程，开始你的 Web3 学习之旅！",
    cardTitle: "兑换 YD 代币",
    balanceLabel: "当前余额：{balance} YD",
    payLabel: "支付",
    receiveLabel: "可得",
    rate: "兑换比例：1 ETH = {rate} YD",
    exchangeNow: "立即兑换",
    exchanging: "兑换中...",
    success: "兑换成功！已兑换 {amount} YD",
    stationTitle: "Web3 学院兑换站",
    stationDescription:
      "使用测试环境 ETH 一键兑换 YD 代币，用于购买课程、支付认证与参与治理。当前兑换为测试合约，稍后可接入主网。",
    stats: {
      safeContract: { label: "安全合约", value: "多签托管" },
      instantSettlement: { label: "实时到账", value: "< 15 秒" },
      activeExchange: { label: "活跃兑换", value: "1,200+" },
    },
    errors: {
      connectWallet: "请先连接钱包",
      invalidAmount: "请输入正确的 ETH 数量",
      generic: "兑换失败，请稍后重试",
    },
  },
  course: {
    purchased: "已购买",
  },
  purchase: {
    connectWalletFirst: "请先连接钱包",
    insufficientBalance: "YD Token 余额不足",
    approvalFailed: "授权失败，未返回交易哈希",
    approvalError: "授权失败，请稍后重试",
    purchaseError: "购买失败，请稍后重试",
    purchaseFailedNoHash: "合约调用失败，未返回交易哈希",
    invalidCourseId: "无效的课程ID",
    approveTokenFirst: "请先授权 YD Token",
    approving: "授权中...",
    approveAmount: "授权 {amount} YD",
    purchasing: "购买中...",
    needApproval: "请先授权",
    purchaseNow: "立即购买",
    errorRetry: "购买失败，请重试",
    success: "购买成功！",
  },
};

export default zhCN;
