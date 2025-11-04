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
  marketPage: {
    title: "コースマーケット",
    subtitle: "高品質なWeb3教育コースを発見し、スキルを磨きましょう。",
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
  courseList: {
    fallback: {
      title: "不明なコース",
      description: "説明はまだありません",
      category: "カテゴリ未設定",
      instructor: "講師不明",
    },
    errors: {
      api: "⚠️ {message}",
      showingSample: "サンプルデータを表示しています。",
    },
    alerts: {
      purchaseFailed: "❌ 購入に失敗しました: {error}",
      purchaseSuccess:
        "🎉 購入が完了しました！\n\nコース: {course}\nトランザクションハッシュ: {hash}\n\n学習ページへリダイレクトします...",
    },
    progress: {
      checkingWallet: "ウォレット接続を確認しています...",
      authenticating: "署名認証を完了しています...",
      checkingAllowance: "承認額を確認しています...",
      approvingToken: "ウォレットで承認を確認してください...",
      waitingApprove: "承認の完了を待っています...",
      purchasingCourse: "ウォレットで購入を確認してください...",
      waitingTransaction: "トランザクションの確認を待っています...",
      savingToDb: "購入記録を保存しています...",
    },
    empty: {
      noCourses: "コースデータはまだありません。",
    },
  },
  courseFilter: {
    search: {
      placeholder: "コース名で検索...",
      iconLabel: "検索アイコン",
    },
    categories: {
      all: "すべてのカテゴリ",
      blockchain: "ブロックチェーン",
      web3: "Web3",
      defi: "DeFi",
      nft: "NFT",
    },
    sort: {
      popular: "人気順",
      newest: "新着順",
      priceLowHigh: "価格が安い順",
      priceHighLow: "価格が高い順",
    },
    actions: {
      advancedFilter: "詳細フィルター",
      advancedFilterIcon: "フィルターアイコン",
    },
    price: {
      label: "価格帯 (USDT)",
      maxDisplay: "{value}+",
      minLabel: "{value}",
      maxLabel: "{value}+",
    },
    summary: {
      prefix: "合計",
      suffix: "件のコース",
    },
  },
  daoHero: {
    badge: "🔥 Web3 教育革命",
    title: "コミュニティガバナンス",
    description:
      "トークン保有者は提案を投稿し、投票によってプラットフォームのロードマップやコース方針、報酬配分を共に決定できます。",
  },
  daoStats: {
    items: {
      totalVotes: "総投票パワー",
      activeProposals: "アクティブ提案",
      treasury: "トレジャリー資金",
      proposals: "提案総数",
    },
  },
  daoEmpty: {
    title: "まだ{tab}はありません",
    tabs: {
      proposal: "ガバナンス提案",
      dispute: "コース紛争",
      history: "履歴",
      default: "提案",
    },
    messages: {
      connectWallet: "提案を見るにはウォレットを接続してください。",
      createProposal: "上のボタンから最初の提案を作成しましょう。",
      submitDispute: "上のボタンからコース紛争を提出できます。",
    },
  },
  daoProposals: {
    loading: "提案を読み込んでいます...",
  },
  daoTabs: {
    proposal: "ガバナンス提案",
    dispute: "紛争解決",
    history: "履歴",
    filters: {
      active: "進行中",
      passed: "可決",
      rejected: "否決",
    },
  },
  daoCategories: {
    courseRules: "コース規則",
    rewardDistribution: "報酬配分",
    nftRules: "NFT規則",
    platformRules: "プラットフォーム規則",
    pricingRules: "価格設定",
  },
  daoDisputeModal: {
    title: "紛争を提出",
    deposit: {
      prefix: "紛争を提出するには",
      amount: "{deposit} YD",
      suffix:
        "のステークが必要です。紛争が却下された場合、ステークは没収されます。",
      balanceLabel: "現在の残高:",
      balanceValue: "{balance} YD",
    },
    warnings: {
      insufficient:
        "YDトークン残高が不足しています。十分なトークンを取得してください。",
    },
    fields: {
      typeLabel: "紛争タイプ",
      courseIdLabel: "コースID",
      courseIdPlaceholder: "紛争対象のコースIDを入力してください",
      courseIdHint: "ヒント：コースIDはコース詳細ページに表示されています。",
      descriptionLabel: "紛争内容",
      descriptionPlaceholder:
        "紛争の状況と証拠を詳しく記載してください（10〜500文字）",
      descriptionCounter: "{count}/{max} 文字",
    },
    types: {
      contentQuality: "コンテンツ品質",
      teacherAttitude: "講師の態度",
      courseFraud: "コース詐欺",
      other: "その他",
    },
    errors: {
      missingCourseId: "コースIDを入力してください。",
      invalidCourseId: "有効なコースID（正の整数）を入力してください。",
      missingDescription: "紛争内容を入力してください。",
      minDescription: "紛争内容は10文字以上で入力してください。",
      maxDescription: "紛争内容は500文字以内で入力してください。",
      insufficientBalance:
        "残高が不足しています。必要額は {required} YD、現在の残高は {balance} YD です。",
    },
    actions: {
      cancel: "キャンセル",
      submit: "紛争を提出（ステーク {deposit} YD）",
      submitting: "送信中...",
    },
  },
  projectHero: {
    badge: "🚀 スマート外注プラットフォームが公開されました",
    title: "Web3 外注プロジェクトマーケット",
    description: {
      line1:
        "YDトークンで質の高いプロジェクト機会を獲得し、ブロックチェーンで取引の透明性と安全性を確保しましょう。",
      line2: "スマートコントラクトが資金をエスクローし、すべての協業を安心に。",
    },
    actions: {
      postProject: "プロジェクトを掲載",
      viewGuide: "ガイドを見る",
    },
    stats: {
      activeProjects: "稼働中のプロジェクト",
      developers: "優秀な開発者",
      totalVolume: "プロジェクト総額",
      completionRate: "完了率",
    },
  },
  ydVerification: {
    connect: {
      title: "まずウォレットを接続してください",
      subtitle: "ウォレット接続後、YDトークン残高を自動的に確認します。",
      features: {
        auto: {
          title: "自動検証",
          description: "接続するとすぐにYD残高をチェックします",
        },
        minimum: {
          title: "必要最低保有量",
          description: "最低 {amount} YD の保有が必要です",
        },
        rewards: {
          title: "報酬を獲得",
          description: "タスク達成で追加のYDトークンを入手できます",
        },
      },
    },
    verifying: {
      title: "YDトークン残高を確認しています",
      subtitle: "しばらくお待ちください...",
    },
    verified: {
      title: "✨ 優良ユーザーとして認証されました",
      balance: "YD残高: {balance} YD",
      badge: "⭐ タスクを受注可能",
    },
    insufficient: {
      title: "YDトークン残高が不足しています",
      description:
        "現在の残高は {balance} YD です。タスクを受注するには最低 {required} YD が必要です。",
      hintTitle: "💡 YDトークンを手に入れる方法:",
      steps: {
        step1: "コミュニティイベントに参加して報酬を獲得",
        step2: "学習タスクを完了してYDを稼ぐ",
        step3: "DEXでYDトークンを購入する",
      },
    },
  },
  projectList: {
    empty: {
      title: "該当するプロジェクトが見つかりません",
      subtitle: "フィルターを調整するか、後でもう一度お試しください。",
    },
    labels: {
      crawler: "アグリゲーター",
      verified: "認証済み",
    },
    fields: {
      budget: "予算",
      difficulty: "難易度",
      deadline: "締め切り",
      applicants: "応募者数",
      applicantsValue: "応募者 {count} 名",
    },
    actions: {
      apply: "今すぐ応募",
      needsVerification: "YD残高の認証が必要",
    },
    difficulty: {
      beginner: "初級",
      intermediate: "中級",
      advanced: "上級",
    },
    tags: {
      solidity: "Solidity",
      defi: "DeFi",
      smartContract: "スマートコントラクト",
      react: "React",
      web3js: "Web3.js",
      nft: "NFT",
      data: "データ分析",
      blockchain: "ブロックチェーン",
      visualization: "ビジュアライゼーション",
      node: "Node.js",
      postgresql: "PostgreSQL",
      dao: "DAO",
      uiDesign: "UIデザイン",
      uxDesign: "UXデザイン",
      mobile: "モバイル",
    },
    projects: {
      defiLending: {
        title: "DeFi 借入プロトコルのスマートコントラクト開発",
        description:
          "複数トークンの担保、金利アルゴリズムの最適化、清算メカニズムを備えた分散型借入プロトコルを構築します。Solidity の実務経験と Aave・Compound などの理解が必須です。",
      },
      nftMarketplace: {
        title: "NFT 取引マーケットのフロントエンド開発",
        description:
          "NFT の閲覧・取引・ウォレット接続などを備えたモダンなマーケットフロントを実装します。React と Web3.js の経験、NFT マーケット開発経験があると尚良いです。",
      },
      analyticsDashboard: {
        title: "ブロックチェーン分析ダッシュボード",
        description:
          "オンチェーンの取引、ガス代、DeFi データなどをリアルタイムで可視化するダッシュボードを開発します。データ可視化とブロックチェーンデータ取得のスキルが必要です。",
      },
      daoBackend: {
        title: "DAO ガバナンスプラットフォームのバックエンド API",
        description:
          "提案管理、投票、通知などの機能を備えた DAO ガバナンス用バックエンド API を構築します。Node.js、PostgreSQL への習熟と DAO メカニズムの理解が求められます。",
      },
      walletDesign: {
        title: "Web3 ウォレット UI/UX デザイン",
        description:
          "資産管理、取引履歴、DApp 接続などを含むモダンな Web3 ウォレット体験をデザインします。モバイルデザインの経験と Web3 ユーザー行動の知識が必要です。",
      },
    },
  },
  projectFilters: {
    search: {
      placeholder: "プロジェクト名・スキル・キーワードで検索...",
    },
    labels: {
      category: "プロジェクトカテゴリ",
      difficulty: "難易度",
      budget: "予算範囲",
      sort: "並び替え",
    },
    categories: {
      all: "すべてのカテゴリ",
      smartContract: "スマートコントラクト開発",
      frontend: "フロントエンド開発",
      backend: "バックエンド開発",
      data: "データ分析",
      design: "UI/UXデザイン",
    },
    difficulty: {
      all: "すべての難易度",
      beginner: "初級",
      intermediate: "中級",
      advanced: "上級",
    },
    budget: {
      all: "すべての予算",
      low: "0 - 20,000 YD",
      mid: "20,000 - 50,000 YD",
      high: "50,000+ YD",
    },
    sort: {
      latest: "最新",
      budgetHigh: "予算が高い順",
      budgetLow: "予算が低い順",
      deadline: "締め切りが近い順",
      applicants: "応募数が多い順",
    },
    quickFilters: {
      label: "クイックフィルター:",
      highBudget: "高報酬案件",
      urgent: "急募",
      beginner: "初心者歓迎",
    },
  },
  daoProposalCard: {
    status: {
      active: "進行中",
      succeeded: "可決",
      executed: "実行済み",
      failed: "否決",
      canceled: "キャンセル",
      unknown: "{status}",
      syncing: "同期中",
      chainSynced: "✓ オンチェーンデータ",
      syncingChain: "オンチェーンデータを同期しています...",
      apiFallback: "APIのキャッシュデータを表示中",
    },
    titles: {
      proposal: "ガバナンス提案",
      dispute: "コース[{courseId}]の紛争",
    },
    votes: {
      support: "✓ 賛成: {count}",
      against: "✗ 反対: {count}",
      total: "総投票数: {count}",
      supportShort: "賛成票 ({percent}%)",
      againstShort: "反対票 ({percent}%)",
      totalLabel: "総投票数:",
      unit: "票",
    },
    meta: {
      disputeLabel: "紛争",
      proposalLabel: "提案",
      typeLabel: "提案タイプ",
      proposerLabel: "提案者",
      proposerUnknown: "不明",
    },
  },
  daoCreateButtons: {
    submitProposal: "提案を提出",
    submitDispute: "紛争を提出",
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
