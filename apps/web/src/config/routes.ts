// src/config/routes.ts
export type NavRoute = {
  labelKey: string;
  href: string;
  requiresAuth?: boolean;
  aliases?: string[];
};

export const MAIN_ROUTES: NavRoute[] = [
  { labelKey: "navigation.home", href: "/home", aliases: ["/"] },
  { labelKey: "navigation.market", href: "/market" },
  { labelKey: "navigation.dao", href: "/dao", requiresAuth: true },
  { labelKey: "navigation.outsource", href: "/outsource" },
];
