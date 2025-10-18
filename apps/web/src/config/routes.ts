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
  { label: "学习中心", href: "/learn" },
  { label: "DAO治理", href: "/dao", requiresAuth: true },
  { label: "个人中心", href: "/profile", requiresAuth: true },
];
