import { atom } from "jotai";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
type NavAction = "open" | "close" | "toggle"; //列举出来类型
export const navDrawerOpenAtom = atom(false); //默认关闭
export const navDrawerActionAtom = atom(null, (get, set, action: NavAction) => {
  //类redux action
  const current = get(navDrawerOpenAtom);
  switch (action) {
    case "toggle":
      set(navDrawerOpenAtom, !current);
      break;
    case "open":
      set(navDrawerOpenAtom, true);
      break;
    case "close":
      set(navDrawerOpenAtom, false);
      break;
    default:
      break;
  }
});
export function useNavDrawer() {
  const isOpen = useAtomValue(navDrawerOpenAtom);
  const dispatch = useSetAtom(navDrawerActionAtom);

  const open = useCallback(() => dispatch("open"), [dispatch]);
  const close = useCallback(() => dispatch("close"), [dispatch]);
  const toggle = useCallback(() => dispatch("toggle"), [dispatch]);

  return { isOpen, open, close, toggle };
}
