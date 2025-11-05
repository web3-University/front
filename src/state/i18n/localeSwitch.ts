import { useRouter, usePathname } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { locales } from "@/i18n/config";
import {
  AppLocale,
  localeAtom,
  nextLocaleAtom,
  localeLabelsAtom,
} from "./localeAtom";

export function useLocaleSwitch() {
  const router = useRouter();
  const pathname = usePathname();

  const locale = useAtomValue(localeAtom);
  const nextLocale = useAtomValue(nextLocaleAtom);
  const labels = useAtomValue(localeLabelsAtom);
  const setLocale = useSetAtom(localeAtom);

  const replaceLocale = (target: AppLocale = nextLocale) => {
    setLocale(target);

    const currentPath = pathname ?? "/";
    const localePattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`, "i");
    const pathWithoutLocale = currentPath.replace(localePattern, "") || "/";

    const normalizedPath =
      pathWithoutLocale === "/"
        ? `/${target}`
        : `/${target}${pathWithoutLocale}`;

    router.replace(normalizedPath);
  };

  return {
    locale,
    nextLocale,
    labels,
    replaceLocale,
  };
}
