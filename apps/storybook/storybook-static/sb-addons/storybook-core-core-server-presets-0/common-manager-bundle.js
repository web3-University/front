try {
  (() => {
    var c = __STORYBOOK_API__,
      {
        ActiveTabs: U,
        Consumer: k,
        ManagerContext: O,
        Provider: T,
        RequestResponseError: h,
        addons: u,
        combineParameters: g,
        controlOrMetaKey: w,
        controlOrMetaSymbol: A,
        eventMatchesShortcut: F,
        eventToShortcut: x,
        experimental_MockUniversalStore: P,
        experimental_UniversalStore: M,
        experimental_requestResponse: R,
        experimental_useUniversalStore: C,
        isMacLike: B,
        isShortcutTaken: E,
        keyToSymbol: I,
        merge: K,
        mockChannel: N,
        optionOrAltSymbol: G,
        shortcutMatchesShortcut: L,
        shortcutToHumanString: Y,
        types: q,
        useAddonState: D,
        useArgTypes: H,
        useArgs: j,
        useChannel: V,
        useGlobalTypes: z,
        useGlobals: J,
        useParameter: Q,
        useSharedState: W,
        useStoryPrepared: X,
        useStorybookApi: Z,
        useStorybookState: $,
      } = __STORYBOOK_API__;
    var a = (() => {
        let e;
        return (
          typeof window < "u"
            ? (e = window)
            : typeof globalThis < "u"
              ? (e = globalThis)
              : typeof window < "u"
                ? (e = window)
                : typeof self < "u"
                  ? (e = self)
                  : (e = {}),
          e
        );
      })(),
      _ = "tag-filters",
      m = "static-filter";
    u.register(_, (e) => {
      let d = Object.entries(a.TAGS_OPTIONS ?? {}).reduce((o, t) => {
        let [r, i] = t;
        return i.excludeFromSidebar && (o[r] = !0), o;
      }, {});
      e.experimental_setFilter(m, (o) => {
        let t = o.tags ?? [];
        return (
          (t.includes("dev") || o.type === "docs") &&
          t.filter((r) => d[r]).length === 0
        );
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
