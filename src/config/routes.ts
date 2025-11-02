// src/config/routes.ts
export type NavRoute = {
	labelKey: string;
	href: string;
	requiresAuth?: boolean;
	aliases?: string[];
};

export const MAIN_ROUTES: NavRoute[] = [
	{ labelKey: "home", href: "/home", aliases: ["/"] },
	{ labelKey: "market", href: "/market" },
	{ labelKey: "dao", href: "/dao", requiresAuth: true },
	{ labelKey: "outsource", href: "/outsource" },
];
