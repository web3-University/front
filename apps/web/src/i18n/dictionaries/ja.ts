// apps/web/src/i18n/dictionaries/ja.ts
import type { MessageTree } from "@/i18n/translator";

const ja: MessageTree = {
  common: {
    appName: "Web3大学",
    appTagline: "分散型教育プラットフォーム",
    language: "言語",
    viewAll: "すべてを見る",
    loading: "読み込み中...",
    retry: "再試行",
    noData: "データがありません",
    errorWithMessage: "読み込みに失敗しました: {message}",
    connectWallet: "ウォレットを接続",
    connectShort: "接続",
    menu: "メニュー",
  },
  metadata: {
    title: "Web3大学 - 分散型教育プラットフォーム",
    description:
      "トークン報酬とDAOガバナンスを備えたブロックチェーン型の学習プラットフォームで、透明で信頼できる学習体験を提供します。",
    keywords: "Web3, ブロックチェーン, オンライン教育, NFT, 分散型",
  },
  navigation: {
    home: "ホーム",
    market: "コースマーケット",
    dao: "DAOガバナンス",
    outsource: "アウトソーシング",
  },
  hero: {
    badge: "Web3 教育革命",
    titleHighlight: "未来の学びはここから始まる",
    description:
      "ブロックチェーンを基盤とした分散型大学プラットフォーム。トークン報酬とDAOガバナンスにより、学習者と教育者が共に成長できる透明なエコシステムを実現します。",
    primaryCta: "学習を始める",
    secondaryCta: "講師になる",
    metrics: {
      registeredUsers: "登録ユーザー",
      totalCourses: "コース総数",
      tradingVolume: "取引量",
      nftCertificates: "NFT証明書",
    },
  },
  featuredCourses: {
    title: "注目のコース",
    description:
      "トップ講師が厳選した高品質なコンテンツで、Web3の世界に素早く入門しましょう。",
    viewAll: "すべてを見る",
    loading: "読み込み中...",
    error: "読み込みに失敗しました: {message}",
    retry: "再試行",
    empty: "注目コースはまだありません",
    noDescription: "説明はまだありません",
    noCategory: "カテゴリ未設定",
    unknownInstructor: "講師不明",
  },
  platformAdvantages: {
    title: "プラットフォームの強み",
    description:
      "ブロックチェーン技術と教育イノベーションを融合した、まったく新しい分散型学習体験。",
    items: {
      tokenIncentives: {
        title: "トークン報酬",
        description:
          "学習でYDトークンを獲得、教学でも報酬を受け取れる透明なインセンティブ設計。",
      },
      blockchainCertification: {
        title: "ブロックチェーン認証",
        description:
          "学習成果はNFT証明書として自動発行。チェーン上に永久保存され、世界中で認知されます。",
      },
      daoGovernance: {
        title: "DAOガバナンス",
        description:
          "コミュニティ主導の意思決定と紛争解決。すべてのユーザーがガバナンスに参加できます。",
      },
    },
  },
  instructorInvitation: {
    badge: "講師になって収益を得る",
    title: "知識を共有し、価値を得る",
    description:
      "Web3大学の講師ネットワークに参加し、公平で透明な収益分配をブロックチェーンで実現。コースを公開すると10 YDトークンを即時獲得し、売上の85%が講師に還元されます。",
    ctaPrimary: "講師登録",
    ctaSecondary: "コースを作成",
    highlights: {
      highEarnings: {
        title: "85%の高収益",
        description:
          "コース売上の85%が直接入金。収益は常に可視化されています。",
      },
      tokenRewards: {
        title: "トークン報酬",
        description:
          "コース公開・高評価・受講完了など、さまざまな行動で追加報酬を獲得できます。",
      },
      globalReach: {
        title: "50,000人以上にリーチ",
        description: "世界中の学習者に届け、あなたの影響力を拡大しましょう。",
      },
    },
    stats: {
      activeInstructors: "アクティブ講師",
      totalRevenue: "講師の総収益",
      averageRating: "平均評価",
      totalStudents: "学習者数",
    },
  },
  tokenExchange: {
    title: "交換センター",
    subtitle:
      "ETHをすぐにYDトークンへ交換し、コース購入からWeb3学習をスタートしましょう。",
    cardTitle: "YDトークンを交換",
    balanceLabel: "現在の残高：{balance} YD",
    payLabel: "支払い",
    receiveLabel: "受け取り",
    rate: "レート：1 ETH = {rate} YD",
    exchangeNow: "今すぐ交換",
    exchanging: "交換中...",
    success: "交換が完了しました！{amount} YDを受け取りました",
    stationTitle: "Web3アカデミー交換デスク",
    stationDescription:
      "テストネットのETHでYDトークンを取得し、コース購入や認証、ガバナンスに利用できます。本番ネットワークにも順次対応予定です。",
    stats: {
      safeContract: {
        label: "セキュアなコントラクト",
        value: "マルチシグ管理",
      },
      instantSettlement: { label: "即時入金", value: "< 15 秒" },
      activeExchange: { label: "アクティブユーザー", value: "1,200+" },
    },
    errors: {
      connectWallet: "まずウォレットを接続してください",
      invalidAmount: "正しいETH数量を入力してください",
      generic: "交換に失敗しました。しばらくしてから再度お試しください。",
    },
  },
  course: {
    purchased: "購入済み",
  },
  purchase: {
    connectWalletFirst: "まずウォレットを接続してください",
    insufficientBalance: "YDトークン残高が不足しています",
    approvalFailed:
      "承認に失敗しました。トランザクションハッシュが返されませんでした",
    approvalError: "承認に失敗しました。時間をおいて再度お試しください。",
    purchaseError: "購入に失敗しました。時間をおいて再度お試しください。",
    purchaseFailedNoHash:
      "コントラクト呼び出しに失敗しました。トランザクションハッシュが返されませんでした",
    invalidCourseId: "無効なコースIDです",
    approveTokenFirst: "先にYDトークンの承認を行ってください",
    approving: "承認中...",
    approveAmount: "{amount} YDを承認",
    purchasing: "購入処理中...",
    needApproval: "先に承認してください",
    purchaseNow: "今すぐ購入",
    errorRetry: "購入に失敗しました。再度お試しください。",
    success: "購入が完了しました！",
  },
};

export default ja;
