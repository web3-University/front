try {
  (() => {
    var l = __REACT__,
      {
        Children: se,
        Component: ie,
        Fragment: ue,
        Profiler: ce,
        PureComponent: de,
        StrictMode: me,
        Suspense: pe,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: be,
        cloneElement: _e,
        createContext: fe,
        createElement: ye,
        createFactory: Se,
        createRef: ve,
        forwardRef: Te,
        isValidElement: Oe,
        lazy: Ce,
        memo: ke,
        startTransition: Ie,
        unstable_act: Ee,
        useCallback: T,
        useContext: xe,
        useDebugValue: ge,
        useDeferredValue: Ae,
        useEffect: x,
        useId: Re,
        useImperativeHandle: he,
        useInsertionEffect: Ue,
        useLayoutEffect: Le,
        useMemo: we,
        useReducer: Be,
        useRef: U,
        useState: L,
        useSyncExternalStore: Pe,
        useTransition: Me,
        version: Ne,
      } = __REACT__;
    var We = __STORYBOOK_API__,
      {
        ActiveTabs: Ge,
        Consumer: Ke,
        ManagerContext: Ye,
        Provider: $e,
        RequestResponseError: qe,
        addons: g,
        combineParameters: ze,
        controlOrMetaKey: je,
        controlOrMetaSymbol: Ze,
        eventMatchesShortcut: Je,
        eventToShortcut: Qe,
        experimental_MockUniversalStore: Xe,
        experimental_UniversalStore: et,
        experimental_requestResponse: tt,
        experimental_useUniversalStore: ot,
        isMacLike: rt,
        isShortcutTaken: nt,
        keyToSymbol: lt,
        merge: at,
        mockChannel: st,
        optionOrAltSymbol: it,
        shortcutMatchesShortcut: ut,
        shortcutToHumanString: ct,
        types: w,
        useAddonState: dt,
        useArgTypes: mt,
        useArgs: pt,
        useChannel: bt,
        useGlobalTypes: B,
        useGlobals: A,
        useParameter: _t,
        useSharedState: ft,
        useStoryPrepared: yt,
        useStorybookApi: P,
        useStorybookState: St,
      } = __STORYBOOK_API__;
    var kt = __STORYBOOK_COMPONENTS__,
      {
        A: It,
        ActionBar: Et,
        AddonPanel: xt,
        Badge: gt,
        Bar: At,
        Blockquote: Rt,
        Button: ht,
        ClipboardCode: Ut,
        Code: Lt,
        DL: wt,
        Div: Bt,
        DocumentWrapper: Pt,
        EmptyTabContent: Mt,
        ErrorFormatter: Nt,
        FlexBar: Ft,
        Form: Dt,
        H1: Vt,
        H2: Ht,
        H3: Wt,
        H4: Gt,
        H5: Kt,
        H6: Yt,
        HR: $t,
        IconButton: M,
        IconButtonSkeleton: qt,
        Icons: R,
        Img: zt,
        LI: jt,
        Link: Zt,
        ListItem: Jt,
        Loader: Qt,
        Modal: Xt,
        OL: eo,
        P: to,
        Placeholder: oo,
        Pre: ro,
        ProgressSpinner: no,
        ResetWrapper: lo,
        ScrollArea: ao,
        Separator: N,
        Spaced: so,
        Span: io,
        StorybookIcon: uo,
        StorybookLogo: co,
        Symbols: mo,
        SyntaxHighlighter: po,
        TT: bo,
        TabBar: _o,
        TabButton: fo,
        TabWrapper: yo,
        Table: So,
        Tabs: vo,
        TabsState: To,
        TooltipLinkList: F,
        TooltipMessage: Oo,
        TooltipNote: Co,
        UL: ko,
        WithTooltip: D,
        WithTooltipPure: Io,
        Zoom: Eo,
        codeCommon: xo,
        components: go,
        createCopyToClipboardFunction: Ao,
        getStoryHref: Ro,
        icons: ho,
        interleaveSeparators: Uo,
        nameSpaceClassNames: Lo,
        resetComponents: wo,
        withReset: Bo,
      } = __STORYBOOK_COMPONENTS__;
    var G = { type: "item", value: "" },
      K = (o, t) => ({
        ...t,
        name: t.name || o,
        description: t.description || o,
        toolbar: {
          ...t.toolbar,
          items: t.toolbar.items.map((e) => {
            let r = typeof e == "string" ? { value: e, title: e } : e;
            return (
              r.type === "reset" &&
                t.toolbar.icon &&
                ((r.icon = t.toolbar.icon), (r.hideIcon = !0)),
              { ...G, ...r }
            );
          }),
        },
      }),
      Y = ["reset"],
      $ = (o) => o.filter((t) => !Y.includes(t.type)).map((t) => t.value),
      _ = "addon-toolbars",
      q = async (o, t, e) => {
        e &&
          e.next &&
          (await o.setAddonShortcut(_, {
            label: e.next.label,
            defaultShortcut: e.next.keys,
            actionName: `${t}:next`,
            action: e.next.action,
          })),
          e &&
            e.previous &&
            (await o.setAddonShortcut(_, {
              label: e.previous.label,
              defaultShortcut: e.previous.keys,
              actionName: `${t}:previous`,
              action: e.previous.action,
            })),
          e &&
            e.reset &&
            (await o.setAddonShortcut(_, {
              label: e.reset.label,
              defaultShortcut: e.reset.keys,
              actionName: `${t}:reset`,
              action: e.reset.action,
            }));
      },
      z = (o) => (t) => {
        let {
            id: e,
            toolbar: { items: r, shortcuts: n },
          } = t,
          c = P(),
          [f, i] = A(),
          a = U([]),
          u = f[e],
          O = T(() => {
            i({ [e]: "" });
          }, [i]),
          C = T(() => {
            let s = a.current,
              m = s.indexOf(u),
              p = m === s.length - 1 ? 0 : m + 1,
              d = a.current[p];
            i({ [e]: d });
          }, [a, u, i]),
          k = T(() => {
            let s = a.current,
              m = s.indexOf(u),
              p = m > -1 ? m : 0,
              d = p === 0 ? s.length - 1 : p - 1,
              b = a.current[d];
            i({ [e]: b });
          }, [a, u, i]);
        return (
          x(() => {
            n &&
              q(c, e, {
                next: { ...n.next, action: C },
                previous: { ...n.previous, action: k },
                reset: { ...n.reset, action: O },
              });
          }, [c, e, n, C, k, O]),
          x(() => {
            a.current = $(r);
          }, []),
          l.createElement(o, { cycleValues: a.current, ...t })
        );
      },
      V = ({ currentValue: o, items: t }) =>
        o != null && t.find((e) => e.value === o && e.type !== "reset"),
      j = ({ currentValue: o, items: t }) => {
        let e = V({ currentValue: o, items: t });
        if (e) return e.icon;
      },
      Z = ({ currentValue: o, items: t }) => {
        let e = V({ currentValue: o, items: t });
        if (e) return e.title;
      },
      J = ({
        active: o,
        disabled: t,
        title: e,
        icon: r,
        description: n,
        onClick: c,
      }) =>
        l.createElement(
          M,
          { active: o, title: n, disabled: t, onClick: t ? () => {} : c },
          r &&
            l.createElement(R, { icon: r, __suppressDeprecationWarning: !0 }),
          e ? `\xA0${e}` : null,
        ),
      Q = ({
        right: o,
        title: t,
        value: e,
        icon: r,
        hideIcon: n,
        onClick: c,
        disabled: f,
        currentValue: i,
      }) => {
        let a =
            r &&
            l.createElement(R, {
              style: { opacity: 1 },
              icon: r,
              __suppressDeprecationWarning: !0,
            }),
          u = {
            id: e ?? "_reset",
            active: i === e,
            right: o,
            title: t,
            disabled: f,
            onClick: c,
          };
        return r && !n && (u.icon = a), u;
      },
      X = z(
        ({
          id: o,
          name: t,
          description: e,
          toolbar: {
            icon: r,
            items: n,
            title: c,
            preventDynamicIcon: f,
            dynamicTitle: i,
          },
        }) => {
          let [a, u, O] = A(),
            [C, k] = L(!1),
            s = a[o],
            m = !!s,
            p = o in O,
            d = r,
            b = c;
          f || (d = j({ currentValue: s, items: n }) || d),
            i && (b = Z({ currentValue: s, items: n }) || b),
            !b && !d && console.warn(`Toolbar '${t}' has no title or icon`);
          let H = T(
            (E) => {
              u({ [o]: E });
            },
            [o, u],
          );
          return l.createElement(
            D,
            {
              placement: "top",
              tooltip: ({ onHide: E }) => {
                let W = n
                  .filter(({ type: I }) => {
                    let h = !0;
                    return I === "reset" && !s && (h = !1), h;
                  })
                  .map((I) =>
                    Q({
                      ...I,
                      currentValue: s,
                      disabled: p,
                      onClick: () => {
                        H(I.value), E();
                      },
                    }),
                  );
                return l.createElement(F, { links: W });
              },
              closeOnOutsideClick: !0,
              onVisibleChange: k,
            },
            l.createElement(J, {
              active: C || m,
              disabled: p,
              description: e || "",
              icon: d,
              title: b || "",
            }),
          );
        },
      ),
      ee = () => {
        let o = B(),
          t = Object.keys(o).filter((e) => !!o[e].toolbar);
        return t.length
          ? l.createElement(
              l.Fragment,
              null,
              l.createElement(N, null),
              t.map((e) => {
                let r = K(e, o[e]);
                return l.createElement(X, { key: e, id: e, ...r });
              }),
            )
          : null;
      };
    g.register(_, () =>
      g.add(_, {
        title: _,
        type: w.TOOL,
        match: ({ tabId: o }) => !o,
        render: () => l.createElement(ee, null),
      }),
    );
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
