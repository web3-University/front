import { createNavigation } from "next-intl/navigation";

import { localePrefix, locales } from "@/i18n/config";

export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation({
		locales,
		localePrefix,
	});
