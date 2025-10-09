try {
  (() => {
    var f = __STORYBOOK_API__,
      {
        ActiveTabs: v,
        Consumer: S,
        ManagerContext: U,
        Provider: c,
        RequestResponseError: k,
        addons: n,
        combineParameters: E,
        controlOrMetaKey: O,
        controlOrMetaSymbol: T,
        eventMatchesShortcut: A,
        eventToShortcut: h,
        experimental_MockUniversalStore: R,
        experimental_UniversalStore: w,
        experimental_requestResponse: F,
        experimental_useUniversalStore: I,
        isMacLike: P,
        isShortcutTaken: g,
        keyToSymbol: x,
        merge: C,
        mockChannel: M,
        optionOrAltSymbol: D,
        shortcutMatchesShortcut: N,
        shortcutToHumanString: B,
        types: K,
        useAddonState: V,
        useArgTypes: q,
        useArgs: G,
        useChannel: L,
        useGlobalTypes: Y,
        useGlobals: $,
        useParameter: H,
        useSharedState: Q,
        useStoryPrepared: j,
        useStorybookApi: z,
        useStorybookState: J,
      } = __STORYBOOK_API__;
    var e = "storybook/links",
      u = {
        NAVIGATE: `${e}/navigate`,
        REQUEST: `${e}/request`,
        RECEIVE: `${e}/receive`,
      };
    n.register(e, (o) => {
      o.on(u.REQUEST, ({ kind: l, name: d }) => {
        let i = o.storyId(l, d);
        o.emit(u.RECEIVE, i);
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
