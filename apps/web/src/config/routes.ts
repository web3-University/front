// src/config/routes.ts
export type NavRoute = {
  label: string;
  href: string;
  requiresAuth?: boolean;
  aliases?: string[];
};

export const MAIN_ROUTES: NavRoute[] = [
  { label: "首页", href: "/home", aliases: ["/"] },
  { label: "课程市场", href: "/market" },
  { label: "DAO治理", href: "/dao", requiresAuth: true },
  { label: "外包平台", href: "/outsource" },
];
