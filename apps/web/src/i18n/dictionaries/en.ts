// apps/web/src/i18n/dictionaries/en.ts
import type { MessageTree } from "@/i18n/translator";

const en: MessageTree = {
  common: {
    appName: "Web3 University",
    appTagline: "Decentralized Education Platform",
    language: "Language",
    viewAll: "View all",
    loading: "Loading...",
    retry: "Retry",
    noData: "No data yet",
    errorWithMessage: "Failed to load: {message}",
    connectWallet: "Connect Wallet",
    connectShort: "Connect",
    menu: "Menu",
  },
  metadata: {
    title: "Web3 University – Decentralized Education Platform",
    description:
      "A blockchain-powered learning platform with token incentives and DAO governance that keeps education transparent and fair.",
    keywords: "Web3, blockchain, online education, NFT, decentralized",
  },
  navigation: {
    home: "Home",
    market: "Course Market",
    dao: "DAO Governance",
    outsource: "Outsourcing",
  },
  marketPage: {
    title: "Course Marketplace",
    subtitle:
      "Explore high-quality Web3 learning experiences to level up your skills.",
  },
  hero: {
    badge: "Web3 Education Revolution",
    titleHighlight: "The future of learning starts here",
    description:
      "A blockchain-powered decentralized university where token incentives and DAO governance build a transparent learning ecosystem for students and educators alike.",
    primaryCta: "Start learning",
    secondaryCta: "Become an instructor",
    metrics: {
      registeredUsers: "Registered learners",
      totalCourses: "Total courses",
      tradingVolume: "Trading volume",
      nftCertificates: "NFT certificates",
    },
  },
  featuredCourses: {
    title: "Featured courses",
    description:
      "Top instructors curate high-impact content to help you enter the Web3 world fast.",
    viewAll: "View all",
    loading: "Loading...",
    error: "Failed to load: {message}",
    retry: "Retry",
    empty: "No featured courses yet",
    noDescription: "No description available",
    noCategory: "Uncategorized",
    unknownInstructor: "Unknown instructor",
  },
  platformAdvantages: {
    title: "Why learners choose us",
    description:
      "Web3 technology meets educational innovation for a truly decentralized experience.",
    items: {
      tokenIncentives: {
        title: "Token incentives",
        description:
          "Earn YD tokens for learning and teaching with a transparent rewards system.",
      },
      blockchainCertification: {
        title: "Blockchain certification",
        description:
          "NFT certificates confirm every achievement and stay verifiable forever on-chain.",
      },
      daoGovernance: {
        title: "DAO governance",
        description:
          "Community-driven decisions and dispute resolution give every member a voice.",
      },
    },
  },
  instructorInvitation: {
    badge: "Teach and unlock new income",
    title: "Share knowledge, capture value",
    description:
      "Join our instructor network where blockchain keeps revenue distribution fair. Publish a course, earn 10 YD tokens instantly, and keep 85% of every sale.",
    ctaPrimary: "Become an instructor",
    ctaSecondary: "Create a course",
    highlights: {
      highEarnings: {
        title: "85% revenue share",
        description:
          "Receive 85% of course sales directly with full transparency.",
      },
      tokenRewards: {
        title: "Token rewards",
        description:
          "Earn bonus tokens for publishing, high ratings, and learner completions.",
      },
      globalReach: {
        title: "Reach 50,000+ learners",
        description:
          "Expand your impact with a global community of motivated students.",
      },
    },
    stats: {
      activeInstructors: "Active instructors",
      totalRevenue: "Total instructor earnings",
      averageRating: "Average rating",
      totalStudents: "Learners",
    },
  },
  tokenExchange: {
    title: "Exchange hub",
    subtitle:
      "Swap ETH for YD tokens instantly to unlock courses and start your Web3 journey.",
    cardTitle: "Swap YD tokens",
    balanceLabel: "Balance: {balance} YD",
    payLabel: "Pay",
    receiveLabel: "Receive",
    rate: "Rate: 1 ETH = {rate} YD",
    exchangeNow: "Swap now",
    exchanging: "Swapping...",
    success: "Swap successful! You received {amount} YD",
    stationTitle: "Web3 Academy swap desk",
    stationDescription:
      "Use testnet ETH to claim YD tokens for course purchases, certifications, and governance. Production networks coming soon.",
    stats: {
      safeContract: { label: "Secure contract", value: "Multisig custody" },
      instantSettlement: { label: "Instant settlement", value: "< 15 seconds" },
      activeExchange: { label: "Active swappers", value: "1,200+" },
    },
    errors: {
      connectWallet: "Connect your wallet first",
      invalidAmount: "Enter a valid ETH amount",
      generic: "Swap failed. Please try again later.",
    },
  },
  courseList: {
    fallback: {
      title: "Untitled course",
      description: "No description yet",
      category: "Uncategorized",
      instructor: "Unknown instructor",
    },
    errors: {
      api: "⚠️ {message}",
      showingSample: "Showing sample data.",
    },
    alerts: {
      purchaseFailed: "❌ Purchase failed: {error}",
      purchaseSuccess:
        "🎉 Purchase successful!\n\nCourse: {course}\nTransaction hash: {hash}\n\nRedirecting you to the learning page...",
    },
    progress: {
      checkingWallet: "Checking wallet connection...",
      authenticating: "Completing signature authentication...",
      checkingAllowance: "Checking allowance...",
      approvingToken: "Please confirm the approval in your wallet...",
      waitingApprove: "Waiting for approval confirmation...",
      purchasingCourse: "Please confirm the purchase in your wallet...",
      waitingTransaction: "Waiting for transaction confirmation...",
      savingToDb: "Saving your purchase record...",
    },
    empty: {
      noCourses: "No courses available yet.",
    },
  },
  courseFilter: {
    search: {
      placeholder: "Search course titles...",
      iconLabel: "Search icon",
    },
    categories: {
      all: "All categories",
      blockchain: "Blockchain",
      web3: "Web3",
      defi: "DeFi",
      nft: "NFT",
    },
    sort: {
      popular: "Most popular",
      newest: "Newest",
      priceLowHigh: "Price: low to high",
      priceHighLow: "Price: high to low",
    },
    actions: {
      advancedFilter: "Advanced filters",
      advancedFilterIcon: "Filter icon",
    },
    price: {
      label: "Price range (USDT)",
      maxDisplay: "{value}+",
      minLabel: "{value}",
      maxLabel: "{value}+",
    },
    summary: {
      prefix: "Found ",
      suffix: " courses",
    },
  },
  daoHero: {
    badge: "🔥 Web3 education revolution",
    title: "Community governance",
    description:
      "Token holders can submit proposals and vote to shape the platform roadmap, course policies, and reward distribution together.",
  },
  daoStats: {
    items: {
      totalVotes: "Total voting power",
      activeProposals: "Active proposals",
      treasury: "Treasury funds",
      proposals: "Total proposals",
    },
  },
  daoEmpty: {
    title: "No {tab} yet",
    tabs: {
      proposal: "governance proposals",
      dispute: "course disputes",
      history: "history records",
      default: "proposals",
    },
    messages: {
      connectWallet: "Connect your wallet to see proposals.",
      createProposal: "Use the button above to create the first proposal.",
      submitDispute: "Use the button above to submit a course dispute.",
    },
  },
  daoProposals: {
    loading: "Loading proposals...",
  },
  daoTabs: {
    proposal: "Governance proposals",
    dispute: "Dispute resolution",
    history: "History",
    filters: {
      active: "Active",
      passed: "Passed",
      rejected: "Rejected",
    },
  },
  daoCategories: {
    courseRules: "Course rules",
    rewardDistribution: "Reward distribution",
    nftRules: "NFT rules",
    platformRules: "Platform rules",
    pricingRules: "Pricing rules",
  },
  daoDisputeModal: {
    title: "Submit dispute",
    deposit: {
      prefix: "Submitting a dispute requires staking",
      amount: "{deposit} YD",
      suffix: ". If the dispute is rejected, the stake will be forfeited.",
      balanceLabel: "Current balance:",
      balanceValue: "{balance} YD",
    },
    warnings: {
      insufficient:
        "Insufficient YD token balance. Please acquire more tokens.",
    },
    fields: {
      typeLabel: "Dispute type",
      courseIdLabel: "Course ID",
      courseIdPlaceholder: "Enter the course ID you want to dispute",
      courseIdHint: "Tip: The course ID is shown on the course detail page",
      descriptionLabel: "Dispute description",
      descriptionPlaceholder:
        "Describe the dispute in detail and provide any evidence (10-500 characters)",
      descriptionCounter: "{count}/{max} characters",
    },
    types: {
      contentQuality: "Content quality",
      teacherAttitude: "Instructor attitude",
      courseFraud: "Course fraud",
      other: "Other",
    },
    errors: {
      missingCourseId: "Please enter a course ID.",
      invalidCourseId: "Please enter a valid course ID (positive integer).",
      missingDescription: "Please provide a dispute description.",
      minDescription:
        "The dispute description must contain at least 10 characters.",
      maxDescription: "The dispute description cannot exceed 500 characters.",
      insufficientBalance:
        "Insufficient balance. {required} YD required, current balance is {balance} YD.",
    },
    actions: {
      cancel: "Cancel",
      submit: "Submit dispute (stake {deposit} YD)",
      submitting: "Submitting...",
    },
  },
  projectHero: {
    badge: "🚀 Smart outsourcing platform is live",
    title: "Web3 outsourcing marketplace",
    description: {
      line1:
        "Use YD tokens to unlock premium project opportunities and keep every transaction transparent and secure.",
      line2:
        "Smart contracts escrow funds so every collaboration is trustworthy.",
    },
    actions: {
      postProject: "Post a project",
      viewGuide: "View guide",
    },
    stats: {
      activeProjects: "Active projects",
      developers: "Skilled developers",
      totalVolume: "Total project volume",
      completionRate: "Completion rate",
    },
  },
  ydVerification: {
    connect: {
      title: "Connect your wallet first",
      subtitle: "We’ll verify your YD balance automatically after connection.",
      features: {
        auto: {
          title: "Automatic verification",
          description: "Check your YD balance right after connecting",
        },
        minimum: {
          title: "Minimum requirement",
          description: "You need at least {amount} YD tokens",
        },
        rewards: {
          title: "Earn rewards",
          description: "Complete tasks to gain additional YD tokens",
        },
      },
    },
    verifying: {
      title: "Verifying your YD balance",
      subtitle: "Please wait a moment...",
    },
    verified: {
      title: "✨ Premium user verified",
      balance: "YD balance: {balance} YD",
      badge: "⭐ Eligible for tasks",
    },
    insufficient: {
      title: "Insufficient YD balance",
      description:
        "Your current balance is {balance} YD. You need at least {required} YD to take on tasks.",
      hintTitle: "💡 How to earn more YD:",
      steps: {
        step1: "Join community events for rewards",
        step2: "Complete learning quests to earn YD",
        step3: "Purchase YD on a DEX",
      },
    },
  },
  projectList: {
    empty: {
      title: "No matching projects",
      subtitle: "Adjust your filters or try again later.",
    },
    labels: {
      crawler: "Aggregator",
      verified: "Verified",
    },
    fields: {
      budget: "Budget",
      difficulty: "Difficulty",
      deadline: "Deadline",
      applicants: "Applicants",
      applicantsValue: "{count} applicants",
    },
    actions: {
      apply: "Apply now",
      needsVerification: "YD balance required",
    },
    difficulty: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    tags: {
      solidity: "Solidity",
      defi: "DeFi",
      smartContract: "Smart contracts",
      react: "React",
      web3js: "Web3.js",
      nft: "NFT",
      data: "Data analytics",
      blockchain: "Blockchain",
      visualization: "Visualization",
      node: "Node.js",
      postgresql: "PostgreSQL",
      dao: "DAO",
      uiDesign: "UI design",
      uxDesign: "UX design",
      mobile: "Mobile",
    },
    projects: {
      defiLending: {
        title: "Build a DeFi lending protocol smart contract",
        description:
          "Create a decentralized lending protocol with multi-asset collateral, optimized interest rate curves, and liquidation mechanisms. Requires proven Solidity experience and familiarity with Aave/Compound.",
      },
      nftMarketplace: {
        title: "NFT marketplace frontend development",
        description:
          "Implement a modern NFT marketplace interface with browsing, trading, and wallet integration. Experience with React and Web3.js, plus prior NFT platform work, is preferred.",
      },
      analyticsDashboard: {
        title: "Blockchain analytics dashboard",
        description:
          "Develop a real-time analytics dashboard for on-chain data, visualising transactions, gas fees, and DeFi metrics. Strong data visualisation and blockchain querying skills are required.",
      },
      daoBackend: {
        title: "DAO governance backend API",
        description:
          "Build backend APIs for a DAO governance platform covering proposals, voting, and notifications. Must be proficient with Node.js, PostgreSQL, and understand DAO governance flows.",
      },
      walletDesign: {
        title: "Web3 wallet UI/UX design",
        description:
          "Design a modern Web3 wallet experience including asset management, history, and DApp connection flows. Mobile design experience and knowledge of Web3 user patterns are needed.",
      },
    },
  },
  projectFilters: {
    search: {
      placeholder: "Search by project name, skills, or keywords...",
    },
    labels: {
      category: "Project category",
      difficulty: "Difficulty",
      budget: "Budget range",
      sort: "Sort by",
    },
    categories: {
      all: "All categories",
      smartContract: "Smart contract development",
      frontend: "Frontend development",
      backend: "Backend development",
      data: "Data analytics",
      design: "UI/UX design",
    },
    difficulty: {
      all: "All levels",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    budget: {
      all: "All budgets",
      low: "0 - 20,000 YD",
      mid: "20,000 - 50,000 YD",
      high: "50,000+ YD",
    },
    sort: {
      latest: "Latest",
      budgetHigh: "Highest budget",
      budgetLow: "Lowest budget",
      deadline: "Nearest deadline",
      applicants: "Most applicants",
    },
    quickFilters: {
      label: "Quick filters:",
      highBudget: "High-paying",
      urgent: "Urgent",
      beginner: "Beginner friendly",
    },
  },
  mobileNav: {
    openNavigation: "Open navigation",
    closeNavigation: "Close navigation",
    label: "Navigation",
    title: "Quick access",
    active: "Current",
    summary: {
      heading: "Tip",
      body: "Use the links above to jump quickly between the main sections.",
    },
  },
  daoProposalCard: {
    status: {
      active: "Active",
      succeeded: "Passed",
      executed: "Executed",
      failed: "Failed",
      canceled: "Canceled",
      unknown: "{status}",
      syncing: "Syncing",
      chainSynced: "✓ On-chain data",
      syncingChain: "Syncing on-chain data...",
      apiFallback: "Showing cached API data",
    },
    titles: {
      proposal: "Governance proposal",
      dispute: "Course [{courseId}] dispute",
    },
    votes: {
      support: "✓ For: {count}",
      against: "✗ Against: {count}",
      total: "Total votes: {count}",
      supportShort: "For votes ({percent}%)",
      againstShort: "Against votes ({percent}%)",
      totalLabel: "Total votes:",
      unit: "votes",
    },
    meta: {
      disputeLabel: "Dispute",
      proposalLabel: "Proposal",
      typeLabel: "Proposal type",
      proposerLabel: "Proposer",
      proposerUnknown: "Unknown",
    },
  },
  daoCreateButtons: {
    submitProposal: "Submit proposal",
    submitDispute: "Submit dispute",
  },
  course: {
    purchased: "Purchased",
  },
  purchase: {
    connectWalletFirst: "Connect your wallet first",
    insufficientBalance: "Insufficient YD token balance",
    approvalFailed: "Approval failed without returning a transaction hash",
    approvalError: "Approval failed. Please try again later.",
    purchaseError: "Purchase failed. Please try again later.",
    purchaseFailedNoHash:
      "Contract call failed without returning a transaction hash",
    invalidCourseId: "Invalid course ID",
    approveTokenFirst: "Please approve YD tokens first",
    approving: "Approving...",
    approveAmount: "Approve {amount} YD",
    purchasing: "Processing purchase...",
    needApproval: "Approve first",
    purchaseNow: "Buy now",
    errorRetry: "Purchase failed. Please retry.",
    success: "Purchase successful!",
  },
};

export default en;
