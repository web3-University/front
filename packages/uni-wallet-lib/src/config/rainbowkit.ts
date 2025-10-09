import { darkTheme, lightTheme, Theme } from "@rainbow-me/rainbowkit";

export const customLightTheme: Theme = {
  ...lightTheme(),
  colors: {
    ...lightTheme().colors,
    accentColor: "#0070f3",
    accentColorForeground: "white",
    actionButtonBorder: "rgba(0, 0, 0, 0.04)",
    actionButtonBorderMobile: "rgba(0, 0, 0, 0.06)",
    actionButtonSecondaryBackground: "rgba(0, 0, 0, 0.06)",
    closeButton: "rgba(60, 66, 66, 0.8)",
    closeButtonBackground: "rgba(0, 0, 0, 0.06)",
    connectButtonBackground: "#0070f3",
    connectButtonBackgroundError: "#ff494a",
    connectButtonInnerBackground:
      "linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))",
    connectButtonText: "#ffffff",
    connectButtonTextError: "#ffffff",
  },
  radii: {
    ...lightTheme().radii,
    actionButton: "8px",
    connectButton: "8px",
    menuButton: "8px",
    modal: "16px",
    modalMobile: "16px",
  },
};

export const customDarkTheme: Theme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: "#0070f3",
    accentColorForeground: "white",
    actionButtonBorder: "rgba(255, 255, 255, 0.04)",
    actionButtonBorderMobile: "rgba(255, 255, 255, 0.06)",
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.06)",
    closeButton: "rgba(224, 232, 255, 0.8)",
    closeButtonBackground: "rgba(255, 255, 255, 0.06)",
    connectButtonBackground: "#0070f3",
    connectButtonBackgroundError: "#ff494a",
    connectButtonInnerBackground:
      "linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))",
    connectButtonText: "#ffffff",
    connectButtonTextError: "#ffffff",
  },
  radii: {
    ...darkTheme().radii,
    actionButton: "8px",
    connectButton: "8px",
    menuButton: "8px",
    modal: "16px",
    modalMobile: "16px",
  },
};

export const rainbowkitConfig = {
  appName: "Web3 Wallet Library",
  theme: {
    light: customLightTheme,
    dark: customDarkTheme,
  },
};
