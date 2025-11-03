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
