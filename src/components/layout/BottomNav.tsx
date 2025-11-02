// apps/web/src/components/layout/BottomNav.tsx
"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { MAIN_ROUTES } from "@/config/routes";
import { Link, usePathname } from "@/navigation";

export default function BottomNav() {
	const tNav = useTranslations("navigation");
	const pathname = usePathname();

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E5E5E5] pb-safe lg:hidden">
			<div className="flex h-16 items-center justify-around px-2">
				{MAIN_ROUTES.map((item) => {
					const isActive =
						pathname === item.href || pathname.startsWith(item.href);

					return (
						<Link
							key={item.href}
							href={item.href}
							className={clsx(
								"flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
								isActive ? "text-[#FF6B9A]" : "text-[#6A6D94]",
							)}
						>
							<span className="text-xs font-medium">{tNav(item.labelKey)}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
