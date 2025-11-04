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
  marketPage: {
    title: "课程市场",
    subtitle: "探索高质量的Web3教育课程，提升你的技能",
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
  courseList: {
    fallback: {
      title: "未知课程",
      description: "暂无描述",
      category: "未分类",
      instructor: "未知讲师",
    },
    errors: {
      api: "⚠️ {message}",
      showingSample: "正在显示示例数据",
    },
    alerts: {
      purchaseFailed: "❌ 购买失败：{error}",
      purchaseSuccess:
        "🎉 购买成功！\n\n课程: {course}\n交易哈希: {hash}\n\n即将跳转到学习页面...",
    },
    progress: {
      checkingWallet: "正在检查钱包连接...",
      authenticating: "完成签名认证...",
      checkingAllowance: "检查授权额度...",
      approvingToken: "请在钱包中确认授权...",
      waitingApprove: "等待授权确认...",
      purchasingCourse: "请在钱包中确认购买...",
      waitingTransaction: "等待交易确认...",
      savingToDb: "保存购买记录...",
    },
    empty: {
      noCourses: "暂无课程数据",
    },
  },
  courseFilter: {
    search: {
      placeholder: "搜索课程名称...",
      iconLabel: "搜索图标",
    },
    categories: {
      all: "全部分类",
      blockchain: "区块链",
      web3: "Web3",
      defi: "DeFi",
      nft: "NFT",
    },
    sort: {
      popular: "最受欢迎",
      newest: "最新上线",
      priceLowHigh: "价格从低到高",
      priceHighLow: "价格从高到低",
    },
    actions: {
      advancedFilter: "高级筛选",
      advancedFilterIcon: "筛选图标",
    },
    price: {
      label: "价格范围 (USDT)",
      maxDisplay: "{value}+",
      minLabel: "{value}",
      maxLabel: "{value}+",
    },
    summary: {
      prefix: "共找到",
      suffix: "门课程",
    },
  },
  daoHero: {
    badge: "🔥 Web3 教育革命",
    title: "社区治理",
    description:
      "持有代币的社区成员可以提交提案并投票，共同决定平台的发展方向、课程规则和奖励分配机制。",
  },
  daoStats: {
    items: {
      totalVotes: "总投票权重",
      activeProposals: "活跃提案",
      treasury: "国库资金",
      proposals: "提案总数",
    },
  },
  daoEmpty: {
    title: "暂无{tab}",
    tabs: {
      proposal: "治理提案",
      dispute: "课程争议",
      history: "历史记录",
      default: "提案",
    },
    messages: {
      connectWallet: "请先连接钱包查看提案",
      createProposal: "点击上方按钮创建第一个提案",
      submitDispute: "点击上方按钮提交课程争议",
    },
  },
  daoProposals: {
    loading: "加载提案中...",
  },
  daoTabs: {
    proposal: "治理提案",
    dispute: "争议解决",
    history: "历史记录",
    filters: {
      active: "进行中",
      passed: "已通过",
      rejected: "未通过",
    },
  },
  daoCategories: {
    courseRules: "课程规则",
    rewardDistribution: "奖励分配",
    nftRules: "NFT规则",
    platformRules: "平台规则",
    pricingRules: "定价规则",
  },
  daoDisputeModal: {
    title: "提交争议",
    deposit: {
      prefix: "提交争议需要质押",
      amount: "{deposit} YD",
      suffix: " 代币，如果争议被驳回，质押将被扣除。",
      balanceLabel: "当前余额:",
      balanceValue: "{balance} YD",
    },
    warnings: {
      insufficient: "YD Token 余额不足，请先获取足够的代币。",
    },
    fields: {
      typeLabel: "争议类型",
      courseIdLabel: "课程 ID",
      courseIdPlaceholder: "请输入被投诉的课程 ID",
      courseIdHint: "提示：课程 ID 可在课程详情页面找到",
      descriptionLabel: "争议描述",
      descriptionPlaceholder: "请详细描述争议情况，提供相关证据（10-500字）",
      descriptionCounter: "{count}/{max} 字符",
    },
    types: {
      contentQuality: "内容质量",
      teacherAttitude: "教师态度",
      courseFraud: "课程欺诈",
      other: "其他",
    },
    errors: {
      missingCourseId: "请输入课程 ID",
      invalidCourseId: "请输入有效的课程 ID（正整数）",
      missingDescription: "请输入争议描述",
      minDescription: "争议描述至少需要 10 个字符",
      maxDescription: "争议描述不能超过 500 个字符",
      insufficientBalance:
        "余额不足！需要 {required} YD，当前余额 {balance} YD",
    },
    actions: {
      cancel: "取消",
      submit: "提交争议（质押 {deposit} YD）",
      submitting: "提交中...",
    },
  },
  projectHero: {
    badge: "🚀 智能外包平台现已上线",
    title: "Web3 外包项目市场",
    description: {
      line1: "使用 YD 币解锁优质项目机会，通过区块链技术保障交易透明与安全。",
      line2: "智能合约托管资金，让每一次合作都值得信赖。",
    },
    actions: {
      postProject: "发布项目",
      viewGuide: "查看指南",
    },
    stats: {
      activeProjects: "活跃项目",
      developers: "优质开发者",
      totalVolume: "项目总金额",
      completionRate: "完成率",
    },
  },
  ydVerification: {
    connect: {
      title: "请先连接钱包",
      subtitle: "连接钱包后将自动验证您的 YD 币余额",
      features: {
        auto: {
          title: "自动验证",
          description: "连接后立即检查 YD 币余额",
        },
        minimum: {
          title: "最低要求",
          description: "需持有至少 {amount} YD 币",
        },
        rewards: {
          title: "获取奖励",
          description: "完成任务可获得额外 YD 币奖励",
        },
      },
    },
    verifying: {
      title: "正在自动验证您的 YD 币余额",
      subtitle: "请稍候...",
    },
    verified: {
      title: "✨ 已验证优质用户",
      balance: "YD 币余额: {balance} YD",
      badge: "⭐ 可接取任务",
    },
    insufficient: {
      title: "YD 币余额不足",
      description:
        "您当前的 YD 币余额为 {balance} YD，需要至少 {required} YD 才能接取任务",
      hintTitle: "💡 如何获取 YD 币：",
      steps: {
        step1: "参与社区活动获得奖励",
        step2: "完成学习任务赚取 YD 币",
        step3: "在 DEX 交易所购买 YD 币",
      },
    },
  },
  projectList: {
    empty: {
      title: "暂无匹配项目",
      subtitle: "调整筛选条件或稍后再试",
    },
    labels: {
      crawler: "爬虫",
      verified: "认证",
    },
    fields: {
      budget: "预算",
      difficulty: "难度",
      deadline: "截止时间",
      applicants: "申请人数",
      applicantsValue: "{count} 人",
    },
    actions: {
      apply: "立即申请",
      needsVerification: "需要 YD 币验证",
    },
    difficulty: {
      beginner: "初级",
      intermediate: "中级",
      advanced: "高级",
    },
    tags: {
      solidity: "Solidity",
      defi: "DeFi",
      smartContract: "智能合约",
      react: "React",
      web3js: "Web3.js",
      nft: "NFT",
      data: "数据分析",
      blockchain: "区块链",
      visualization: "可视化",
      node: "Node.js",
      postgresql: "PostgreSQL",
      dao: "DAO",
      uiDesign: "UI设计",
      uxDesign: "UX设计",
      mobile: "移动端",
    },
    projects: {
      defiLending: {
        title: "开发 DeFi 借贷协议智能合约",
        description:
          "需要开发一个去中心化借贷协议，支持多种代币抵押、利率算法优化、清算机制等核心功能。要求有 Solidity 开发经验，熟悉 Aave、Compound 等借贷协议。",
      },
      nftMarketplace: {
        title: "NFT 交易市场前端开发",
        description:
          "构建一个现代化的 NFT 交易平台前端，包括 NFT 展示、交易、钱包连接等功能。需要熟悉 React、Web3.js，有 NFT 市场开发经验优先。",
      },
      analyticsDashboard: {
        title: "区块链数据分析 Dashboard",
        description:
          "开发一个实时区块链数据分析仪表板，展示链上交易、Gas 费用、DeFi 协议数据等。需要掌握数据可视化和区块链数据查询。",
      },
      daoBackend: {
        title: "DAO 治理平台后端 API 开发",
        description:
          "为 DAO 治理平台开发后端 API，包括提案管理、投票系统、通知服务等。需要熟悉 Node.js、PostgreSQL，了解 DAO 治理机制。",
      },
      walletDesign: {
        title: "Web3 钱包 UI/UX 设计",
        description:
          "设计一款现代化的 Web3 钱包界面，包括资产管理、交易历史、DApp 连接等页面。需要有移动端设计经验，了解 Web3 用户习惯。",
      },
    },
  },
  projectFilters: {
    search: {
      placeholder: "搜索项目名称、技能或关键词...",
    },
    labels: {
      category: "项目类别",
      difficulty: "难度等级",
      budget: "预算范围",
      sort: "排序方式",
    },
    categories: {
      all: "全部类别",
      smartContract: "智能合约开发",
      frontend: "前端开发",
      backend: "后端开发",
      data: "数据分析",
      design: "UI/UX设计",
    },
    difficulty: {
      all: "全部难度",
      beginner: "初级",
      intermediate: "中级",
      advanced: "高级",
    },
    budget: {
      all: "全部预算",
      low: "0 - 20,000 YD",
      mid: "20,000 - 50,000 YD",
      high: "50,000+ YD",
    },
    sort: {
      latest: "最新发布",
      budgetHigh: "预算最高",
      budgetLow: "预算最低",
      deadline: "截止最近",
      applicants: "最多申请",
    },
    quickFilters: {
      label: "快速筛选:",
      highBudget: "高薪项目",
      urgent: "紧急招募",
      beginner: "新手友好",
    },
  },
  mobileNav: {
    openNavigation: "打开导航菜单",
    closeNavigation: "关闭导航菜单",
    label: "导航",
    title: "快速访问",
    active: "当前",
    summary: {
      heading: "提示",
      body: "浏览上方菜单即可快速跳转到主要页面。",
    },
  },
  daoProposalCard: {
    status: {
      active: "进行中",
      succeeded: "通过",
      executed: "已执行",
      failed: "未通过",
      canceled: "已取消",
      unknown: "{status}",
      syncing: "同步中",
      chainSynced: "✓ 链上数据",
      syncingChain: "正在同步链上数据...",
      apiFallback: "显示 API 缓存数据",
    },
    titles: {
      proposal: "治理提案",
      dispute: "课程[{courseId}]争议",
    },
    votes: {
      support: "✓ 支持: {count}",
      against: "✗ 反对: {count}",
      total: "总投票数: {count} 票",
      supportShort: "支持票 ({percent}%)",
      againstShort: "反对票 ({percent}%)",
      totalLabel: "总投票数:",
      unit: "票",
    },
    meta: {
      disputeLabel: "争议",
      proposalLabel: "提案",
      typeLabel: "提案类型",
      proposerLabel: "提案人",
      proposerUnknown: "未知",
    },
  },
  daoCreateButtons: {
    submitProposal: "提交新提案",
    submitDispute: "提交争议",
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
