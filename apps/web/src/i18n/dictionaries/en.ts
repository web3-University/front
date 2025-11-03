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
