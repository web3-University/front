// apps/web/src/i18n/dictionaries/de.ts
import type { MessageTree } from "@/i18n/translator";

const de: MessageTree = {
  common: {
    appName: "Web3 Universität",
    appTagline: "Dezentralisierte Bildungsplattform",
    language: "Sprache",
    viewAll: "Alle anzeigen",
    loading: "Wird geladen...",
    retry: "Erneut versuchen",
    noData: "Noch keine Daten",
    errorWithMessage: "Laden fehlgeschlagen: {message}",
    connectWallet: "Wallet verbinden",
    connectShort: "Verbinden",
    menu: "Menü",
  },
  metadata: {
    title: "Web3 Universität – Dezentralisierte Bildungsplattform",
    description:
      "Eine Blockchain-basierte Lernplattform mit Token-Anreizen und DAO-Governance für transparente und faire Bildung.",
    keywords: "Web3, Blockchain, Online-Bildung, NFT, dezentral",
  },
  navigation: {
    home: "Startseite",
    market: "Kursmarkt",
    dao: "DAO-Governance",
    outsource: "Outsourcing",
  },
  marketPage: {
    title: "Kursmarktplatz",
    subtitle:
      "Entdecke hochwertige Web3-Kurse und erweitere deine Fähigkeiten.",
  },
  hero: {
    badge: "Web3 Bildungsrevolution",
    titleHighlight: "Die Zukunft des Lernens beginnt hier",
    description:
      "Eine Blockchain-Universität mit Token-Anreizen und DAO-Governance, die ein transparentes Ökosystem für Lernende und Lehrende schafft.",
    primaryCta: "Jetzt lernen",
    secondaryCta: "Dozent werden",
    metrics: {
      registeredUsers: "Registrierte Nutzer",
      totalCourses: "Kurse insgesamt",
      tradingVolume: "Handelsvolumen",
      nftCertificates: "NFT-Zertifikate",
    },
  },
  featuredCourses: {
    title: "Ausgewählte Kurse",
    description:
      "Top-Dozenten kuratieren hochwertige Inhalte, um dich schnell in die Web3-Welt zu führen.",
    viewAll: "Alle anzeigen",
    loading: "Wird geladen...",
    error: "Laden fehlgeschlagen: {message}",
    retry: "Erneut versuchen",
    empty: "Noch keine ausgewählten Kurse",
    noDescription: "Keine Beschreibung verfügbar",
    noCategory: "Keine Kategorie",
    unknownInstructor: "Dozent unbekannt",
  },
  platformAdvantages: {
    title: "Unsere größten Vorteile",
    description:
      "Blockchain-Technologie trifft Bildungsinnovation für ein echtes dezentrales Lernerlebnis.",
    items: {
      tokenIncentives: {
        title: "Token-Anreize",
        description:
          "Verdiene YD-Token für Lernen und Lehren mit einem transparenten Belohnungssystem.",
      },
      blockchainCertification: {
        title: "Blockchain-Zertifizierung",
        description:
          "NFT-Zertifikate dokumentieren jeden Lernerfolg dauerhaft und weltweit überprüfbar.",
      },
      daoGovernance: {
        title: "DAO-Governance",
        description:
          "Gemeinschaftsentscheidungen und Streitbeilegung geben jedem Mitglied eine Stimme.",
      },
    },
  },
  instructorInvitation: {
    badge: "Dozent werden, Einkommen steigern",
    title: "Wissen teilen, Wert schaffen",
    description:
      "Schließe dich unserem Dozentennetzwerk an. Die Blockchain sorgt für faire und transparente Einnahmen. Jede Kursveröffentlichung bringt 10 YD-Token, und 85% aller Verkäufe gehören dir.",
    ctaPrimary: "Als Dozent starten",
    ctaSecondary: "Kurs erstellen",
    highlights: {
      highEarnings: {
        title: "85 % Umsatzanteil",
        description:
          "85 % der Kursverkäufe werden direkt ausgezahlt – jederzeit nachvollziehbar.",
      },
      tokenRewards: {
        title: "Token-Belohnungen",
        description:
          "Zusätzliche Token für neue Kurse, gute Bewertungen und abgeschlossene Lektionen.",
      },
      globalReach: {
        title: "50.000+ Lernende erreichen",
        description:
          "Erweitere deine Reichweite mit einer wachsenden, globalen Community.",
      },
    },
    stats: {
      activeInstructors: "Aktive Dozenten",
      totalRevenue: "Gesamte Dozenteneinnahmen",
      averageRating: "Durchschnittsbewertung",
      totalStudents: "Teilnehmende",
    },
  },
  tokenExchange: {
    title: "Tauschzentrale",
    subtitle:
      "Tausche ETH sofort in YD-Token, um Kurse freizuschalten und deine Web3-Reise zu starten.",
    cardTitle: "YD-Token tauschen",
    balanceLabel: "Aktueller Kontostand: {balance} YD",
    payLabel: "Zahlung",
    receiveLabel: "Erhalt",
    rate: "Wechselkurs: 1 ETH = {rate} YD",
    exchangeNow: "Jetzt tauschen",
    exchanging: "Tausch läuft...",
    success: "Tausch erfolgreich! Du hast {amount} YD erhalten",
    stationTitle: "Web3 Academy Tauschstation",
    stationDescription:
      "Nutze Testnet-ETH, um YD-Token für Kurskäufe, Zertifizierungen und Governance zu erhalten. Hauptnetzwerke folgen in Kürze.",
    stats: {
      safeContract: { label: "Sicherer Vertrag", value: "Multisig-Verwahrung" },
      instantSettlement: {
        label: "Sofortige Abwicklung",
        value: "< 15 Sekunden",
      },
      activeExchange: { label: "Aktive Nutzer", value: "1.200+" },
    },
    errors: {
      connectWallet: "Verbinde zuerst dein Wallet",
      invalidAmount: "Bitte gib einen gültigen ETH-Betrag ein",
      generic: "Tausch fehlgeschlagen. Bitte versuche es später erneut.",
    },
  },
  courseList: {
    fallback: {
      title: "Unbekannter Kurs",
      description: "Keine Beschreibung verfügbar",
      category: "Keine Kategorie",
      instructor: "Unbekannter Dozent",
    },
    errors: {
      api: "⚠️ {message}",
      showingSample: "Es werden Beispieldaten angezeigt.",
    },
    alerts: {
      purchaseFailed: "❌ Kauf fehlgeschlagen: {error}",
      purchaseSuccess:
        "🎉 Kauf erfolgreich!\n\nKurs: {course}\nTransaktions-Hash: {hash}\n\nWir leiten dich gleich zur Lernseite weiter...",
    },
    progress: {
      checkingWallet: "Wallet-Verbindung wird überprüft...",
      authenticating: "Signatur wird abgeschlossen...",
      checkingAllowance: "Freigabe wird überprüft...",
      approvingToken: "Bitte bestätige die Freigabe in deinem Wallet...",
      waitingApprove: "Warte auf Bestätigung der Freigabe...",
      purchasingCourse: "Bitte bestätige den Kauf in deinem Wallet...",
      waitingTransaction: "Warte auf Transaktionsbestätigung...",
      savingToDb: "Kauf wird gespeichert...",
    },
    empty: {
      noCourses: "Noch keine Kurse verfügbar.",
    },
  },
  courseFilter: {
    search: {
      placeholder: "Kurstitel suchen...",
      iconLabel: "Suchsymbol",
    },
    categories: {
      all: "Alle Kategorien",
      blockchain: "Blockchain",
      web3: "Web3",
      defi: "DeFi",
      nft: "NFT",
    },
    sort: {
      popular: "Beliebteste",
      newest: "Neueste",
      priceLowHigh: "Preis: aufsteigend",
      priceHighLow: "Preis: absteigend",
    },
    actions: {
      advancedFilter: "Erweiterte Filter",
      advancedFilterIcon: "Filtersymbol",
    },
    price: {
      label: "Preisspanne (USDT)",
      maxDisplay: "{value}+",
      minLabel: "{value}",
      maxLabel: "{value}+",
    },
    summary: {
      prefix: "Gefunden ",
      suffix: " Kurse",
    },
  },
  daoHero: {
    badge: "🔥 Web3 Bildungsrevolution",
    title: "Community-Governance",
    description:
      "Token-Inhaber können Vorschläge einreichen und abstimmen, um gemeinsam über Roadmap, Kursregeln und Verteilungsmechanismen der Belohnungen zu entscheiden.",
  },
  daoStats: {
    items: {
      totalVotes: "Gesamtes Stimmgewicht",
      activeProposals: "Aktive Vorschläge",
      treasury: "Treasury-Mittel",
      proposals: "Anzahl der Vorschläge",
    },
  },
  daoEmpty: {
    title: "Noch keine {tab}",
    tabs: {
      proposal: "Governance-Vorschläge",
      dispute: "Kurskonflikte",
      history: "Verlaufseinträge",
      default: "Vorschläge",
    },
    messages: {
      connectWallet: "Bitte verbinde dein Wallet, um Vorschläge zu sehen.",
      createProposal:
        "Klicke oben auf die Schaltfläche, um den ersten Vorschlag zu erstellen.",
      submitDispute:
        "Klicke oben auf die Schaltfläche, um einen Kurskonflikt einzureichen.",
    },
  },
  daoProposals: {
    loading: "Vorschläge werden geladen...",
  },
  daoTabs: {
    proposal: "Governance-Vorschläge",
    dispute: "Streitbeilegung",
    history: "Verlauf",
    filters: {
      active: "Aktiv",
      passed: "Angenommen",
      rejected: "Abgelehnt",
    },
  },
  daoCategories: {
    courseRules: "Kursregeln",
    rewardDistribution: "Belohnungsverteilung",
    nftRules: "NFT-Regeln",
    platformRules: "Plattformregeln",
    pricingRules: "Preisgestaltung",
  },
  daoDisputeModal: {
    title: "Streitfall einreichen",
    deposit: {
      prefix: "Für die Einreichung eines Streitfalls müssen",
      amount: "{deposit} YD",
      suffix:
        " hinterlegt werden. Wird der Streitfall abgelehnt, verfällt die Hinterlegung.",
      balanceLabel: "Aktueller Kontostand:",
      balanceValue: "{balance} YD",
    },
    warnings: {
      insufficient:
        "YD-Token-Guthaben ist nicht ausreichend. Bitte erwerbe genügend Token.",
    },
    fields: {
      typeLabel: "Streitfalltyp",
      courseIdLabel: "Kurs-ID",
      courseIdPlaceholder:
        "Gib die Kurs-ID ein, gegen die du Einspruch erhebst",
      courseIdHint: "Hinweis: Die Kurs-ID findest du auf der Kursdetailseite.",
      descriptionLabel: "Beschreibung des Streitfalls",
      descriptionPlaceholder:
        "Beschreibe den Streitfall detailliert und füge relevante Nachweise hinzu (10–500 Zeichen).",
      descriptionCounter: "{count}/{max} Zeichen",
    },
    types: {
      contentQuality: "Inhaltsqualität",
      teacherAttitude: "Verhalten des Dozenten",
      courseFraud: "Kursbetrug",
      other: "Sonstiges",
    },
    errors: {
      missingCourseId: "Bitte gib eine Kurs-ID ein.",
      invalidCourseId: "Bitte gib eine gültige Kurs-ID ein (positive Zahl).",
      missingDescription: "Bitte füge eine Beschreibung des Streitfalls hinzu.",
      minDescription:
        "Die Beschreibung des Streitfalls muss mindestens 10 Zeichen enthalten.",
      maxDescription:
        "Die Beschreibung des Streitfalls darf 500 Zeichen nicht überschreiten.",
      insufficientBalance:
        "Guthaben unzureichend. {required} YD benötigt, aktueller Kontostand: {balance} YD.",
    },
    actions: {
      cancel: "Abbrechen",
      submit: "Streitfall einreichen (Hinterlegung {deposit} YD)",
      submitting: "Übermittlung...",
    },
  },
  projectHero: {
    badge: "🚀 Intelligente Outsourcing-Plattform ist live",
    title: "Web3 Outsourcing-Marktplatz",
    description: {
      line1:
        "Nutze YD-Token, um hochwertige Projektchancen zu erschließen und sichere, transparente Transaktionen über die Blockchain zu gewährleisten.",
      line2:
        "Smart Contracts verwahren die Gelder treuhänderisch, damit jede Zusammenarbeit vertrauenswürdig bleibt.",
    },
    actions: {
      postProject: "Projekt veröffentlichen",
      viewGuide: "Leitfaden ansehen",
    },
    stats: {
      activeProjects: "Aktive Projekte",
      developers: "Qualifizierte Entwickler",
      totalVolume: "Projektvolumen gesamt",
      completionRate: "Abschlussrate",
    },
  },
  ydVerification: {
    connect: {
      title: "Bitte verbinde zuerst dein Wallet",
      subtitle: "Nach dem Verbinden prüfen wir dein YD-Guthaben automatisch.",
      features: {
        auto: {
          title: "Automatische Prüfung",
          description: "Direkte YD-Guthabenprüfung nach der Verbindung",
        },
        minimum: {
          title: "Mindestanforderung",
          description: "Mindestens {amount} YD-Token erforderlich",
        },
        rewards: {
          title: "Belohnungen erhalten",
          description: "Erledige Aufgaben und erhalte zusätzliche YD-Token",
        },
      },
    },
    verifying: {
      title: "YD-Guthaben wird überprüft",
      subtitle: "Einen Moment bitte...",
    },
    verified: {
      title: "✨ Premium-Nutzer verifiziert",
      balance: "YD-Guthaben: {balance} YD",
      badge: "⭐ Für Aufgaben freigeschaltet",
    },
    insufficient: {
      title: "YD-Guthaben nicht ausreichend",
      description:
        "Dein aktuelles Guthaben beträgt {balance} YD. Du benötigst mindestens {required} YD, um Aufgaben anzunehmen.",
      hintTitle: "💡 So erhältst du mehr YD:",
      steps: {
        step1: "Nimm an Community-Aktionen teil und sichere dir Belohnungen",
        step2: "Schließe Lernaufgaben ab und verdiene YD",
        step3: "Kaufe YD an einer DEX",
      },
    },
  },
  projectList: {
    empty: {
      title: "Keine passenden Projekte",
      subtitle: "Passe die Filter an oder versuche es später erneut.",
    },
    labels: {
      crawler: "Aggregator",
      verified: "Verifiziert",
    },
    fields: {
      budget: "Budget",
      difficulty: "Schwierigkeit",
      deadline: "Frist",
      applicants: "Bewerber",
      applicantsValue: "{count} Bewerber",
    },
    actions: {
      apply: "Jetzt bewerben",
      needsVerification: "YD-Guthaben erforderlich",
    },
    difficulty: {
      beginner: "Einsteiger",
      intermediate: "Fortgeschritten",
      advanced: "Experte",
    },
    tags: {
      solidity: "Solidity",
      defi: "DeFi",
      smartContract: "Smart Contracts",
      react: "React",
      web3js: "Web3.js",
      nft: "NFT",
      data: "Datenanalyse",
      blockchain: "Blockchain",
      visualization: "Visualisierung",
      node: "Node.js",
      postgresql: "PostgreSQL",
      dao: "DAO",
      uiDesign: "UI-Design",
      uxDesign: "UX-Design",
      mobile: "Mobile",
    },
    projects: {
      defiLending: {
        title: "Smart Contracts für ein DeFi-Kreditprotokoll",
        description:
          "Entwickle ein dezentrales Kreditprotokoll mit Multi-Asset-Kollateral, optimierten Zinssätzen und Liquidationsmechanismen. Erforderlich sind fundierte Solidity-Kenntnisse sowie Erfahrung mit Aave oder Compound.",
      },
      nftMarketplace: {
        title: "Frontend-Entwicklung für einen NFT-Marktplatz",
        description:
          "Erstelle ein modernes Frontend für einen NFT-Marktplatz mit Darstellung, Handel und Wallet-Integration. Erfahrung mit React, Web3.js und bestehenden NFT-Plattformen ist von Vorteil.",
      },
      analyticsDashboard: {
        title: "Blockchain-Analytics-Dashboard",
        description:
          "Baue ein Echtzeit-Dashboard für On-Chain-Daten, das Transaktionen, Gasgebühren und DeFi-Kennzahlen visualisiert. Benötigt werden starke Fähigkeiten in Datenvisualisierung und Blockchain-Abfragen.",
      },
      daoBackend: {
        title: "Backend-API für eine DAO-Governance-Plattform",
        description:
          "Entwickle Backend-APIs für Governance-Funktionen wie Vorschläge, Abstimmungen und Benachrichtigungen. Kenntnisse in Node.js, PostgreSQL und DAO-Governance sind erforderlich.",
      },
      walletDesign: {
        title: "UI/UX-Design für eine Web3-Wallet",
        description:
          "Gestalte eine moderne Web3-Wallet-Oberfläche inklusive Asset-Management, Verlauf und DApp-Verbindung. Erfahrung im Mobile-Design und Verständnis von Web3-Nutzern ist wichtig.",
      },
    },
  },
  projectFilters: {
    search: {
      placeholder: "Suche nach Projektnamen, Skills oder Stichwörtern...",
    },
    labels: {
      category: "Projektkategorie",
      difficulty: "Schwierigkeitsgrad",
      budget: "Budgetrahmen",
      sort: "Sortieren nach",
    },
    categories: {
      all: "Alle Kategorien",
      smartContract: "Smart-Contract-Entwicklung",
      frontend: "Frontend-Entwicklung",
      backend: "Backend-Entwicklung",
      data: "Datenanalyse",
      design: "UI/UX-Design",
    },
    difficulty: {
      all: "Alle Stufen",
      beginner: "Einsteiger",
      intermediate: "Fortgeschritten",
      advanced: "Experte",
    },
    budget: {
      all: "Alle Budgets",
      low: "0 - 20.000 YD",
      mid: "20.000 - 50.000 YD",
      high: "50.000+ YD",
    },
    sort: {
      latest: "Neueste",
      budgetHigh: "Höchstes Budget",
      budgetLow: "Niedrigstes Budget",
      deadline: "Nächste Frist",
      applicants: "Meiste Bewerber",
    },
    quickFilters: {
      label: "Schnellauswahl:",
      highBudget: "Hohes Honorar",
      urgent: "Dringend",
      beginner: "Einsteigerfreundlich",
    },
  },
  daoProposalCard: {
    status: {
      active: "Aktiv",
      succeeded: "Angenommen",
      executed: "Ausgeführt",
      failed: "Abgelehnt",
      canceled: "Storniert",
      unknown: "{status}",
      syncing: "Synchronisiere",
      chainSynced: "✓ On-Chain-Daten",
      syncingChain: "On-Chain-Daten werden synchronisiert...",
      apiFallback: "API-Zwischenspeicher wird angezeigt",
    },
    titles: {
      proposal: "Governance-Vorschlag",
      dispute: "Kurs [{courseId}] Streitfall",
    },
    votes: {
      support: "✓ Zustimmung: {count}",
      against: "✗ Ablehnung: {count}",
      total: "Gesamtstimmen: {count}",
      supportShort: "Zustimmung ({percent}%)",
      againstShort: "Ablehnung ({percent}%)",
      totalLabel: "Gesamtstimmen:",
      unit: "Stimmen",
    },
    meta: {
      disputeLabel: "Streitfall",
      proposalLabel: "Vorschlag",
      typeLabel: "Vorschlagstyp",
      proposerLabel: "Einreicher",
      proposerUnknown: "Unbekannt",
    },
  },
  daoCreateButtons: {
    submitProposal: "Vorschlag einreichen",
    submitDispute: "Streitfall einreichen",
  },
  course: {
    purchased: "Gekauft",
  },
  purchase: {
    connectWalletFirst: "Verbinde zuerst dein Wallet",
    insufficientBalance: "YD-Token-Guthaben ist nicht ausreichend",
    approvalFailed:
      "Genehmigung fehlgeschlagen, keine Transaktions-ID erhalten",
    approvalError: "Genehmigung fehlgeschlagen. Bitte später erneut versuchen.",
    purchaseError: "Kauf fehlgeschlagen. Bitte später erneut versuchen.",
    purchaseFailedNoHash:
      "Contract-Aufruf fehlgeschlagen, keine Transaktions-ID erhalten",
    invalidCourseId: "Ungültige Kurs-ID",
    approveTokenFirst: "Bitte genehmige zuerst YD-Token",
    approving: "Genehmigung läuft...",
    approveAmount: "{amount} YD genehmigen",
    purchasing: "Kauf wird verarbeitet...",
    needApproval: "Bitte zuerst genehmigen",
    purchaseNow: "Jetzt kaufen",
    errorRetry: "Kauf fehlgeschlagen. Bitte erneut versuchen.",
    success: "Kauf erfolgreich!",
  },
};

export default de;
