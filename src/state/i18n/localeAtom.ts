import { atom } from "jotai";

export type AppLocale = "zh" | "en";

export const localeAtom = atom<AppLocale>("zh");

/** 计算下一个语言 */
export const nextLocaleAtom = atom<AppLocale>((get) =>
  get(localeAtom) === "zh" ? "en" : "zh",
);

/** UI 需要的标签也可以集中放在 atom 里 */
export const localeLabelsAtom = atom((get) => {
  const locale = get(localeAtom);
  return {
    compact: locale === "zh" ? "EN" : "中",
    full: locale === "zh" ? "切换到英语" : "Switch to Chinese",
  };
});
