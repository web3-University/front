import { jsx as e, jsxs as t } from "react/jsx-runtime";
import n, {
  useState as a,
  useCallback as r,
  useEffect as i,
  useMemo as s,
  createContext as o,
  useContext as c,
  useRef as d,
} from "react";
import {
  http as l,
  createStorage as u,
  cookieStorage as p,
  useAccount as m,
  useChainId as y,
  useChains as h,
  useConnect as f,
  useReconnect as b,
  useDisconnect as g,
  useSignMessage as w,
  WagmiProvider as v,
  useEnsName as x,
  useBalance as T,
  useSwitchChain as C,
  useReadContract as k,
  useWriteContract as N,
  useWaitForTransactionReceipt as I,
  useEstimateGas as _,
} from "wagmi";
import {
  getDefaultConfig as E,
  lightTheme as S,
  darkTheme as R,
  RainbowKitProvider as A,
  ConnectButton as M,
} from "@rainbow-me/rainbowkit";
import {
  QueryClient as B,
  QueryClientProvider as O,
} from "@tanstack/react-query";
import { sepolia as P, mainnet as F } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { formatEther as z, parseUnits as U, parseEther as D } from "viem";
const L = [F, P];
F.id, P.id, S(), S().colors, S().radii;
const j = {
  ...R(),
  colors: {
    ...R().colors,
    accentColor: "#0070f3",
    accentColorForeground: "white",
    actionButtonBorder: "rgba(255, 255, 255, 0.04)",
    actionButtonBorderMobile: "rgba(255, 255, 255, 0.06)",
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.06)",
    closeButton: "rgba(224, 232, 255, 0.8)",
    closeButtonBackground: "rgba(255, 255, 255, 0.06)",
    connectButtonBackground: "#0070f3",
    connectButtonBackgroundError: "#ff494a",
    connectButtonInnerBackground:
      "linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))",
    connectButtonText: "#ffffff",
    connectButtonTextError: "#ffffff",
  },
  radii: {
    ...R().radii,
    actionButton: "8px",
    connectButton: "8px",
    menuButton: "8px",
    modal: "16px",
    modalMobile: "16px",
  },
};
function $() {
  const {
      address: e,
      connector: t,
      isConnected: n,
      isConnecting: a,
      isReconnecting: r,
    } = m(),
    i = y(),
    s = h(),
    { connect: o, connectors: c } = f(),
    { reconnect: d } = b(),
    { disconnect: l } = g(),
    u = s.find((e) => e.id === i);
  return {
    isConnected: n,
    isConnecting: a,
    isReconnecting: r,
    address: e,
    connector: t ? { id: t.id, name: t.name, type: t.type } : void 0,
    chain: u,
    chains: s,
    connect: (e) => {
      if (e) {
        const t = c.find((t) => t.id === e);
        t && o({ connector: t });
      } else {
        const e = c[0];
        e && o({ connector: e });
      }
    },
    reconnect: (e) => {
      d(e);
    },
    disconnect: () => {
      l();
    },
  };
}
function W() {
  const { address: e } = $(),
    { signMessageAsync: t, isPending: n, isSuccess: a, isError: r } = w(),
    i = (e, t, n, a = 1, r, i) =>
      `${e} wants you to sign in with your Ethereum account:\n${t}\n\nI accept the Terms of Service.\n\nURI: https://${e}\nVersion: 1\nChain ID: ${a}\nNonce: ${n}\nIssued At: ${r || new Date().toISOString()}\nExpiration Time: ${i || new Date(Date.now() + 3e5).toISOString()}`;
  return {
    address: e,
    isPending: n,
    isSuccess: a,
    isError: r,
    signMessage: async (n) => {
      if (!e) throw new Error("❗️ 钱包未连接");
      return { message: n, signature: await t({ message: n }), address: e };
    },
    signSIWEMessage: async (n, a, r) => {
      if (!e) throw new Error("❗️ 钱包未连接");
      const s = i(n, e, a, r);
      return { message: s, signature: await t({ message: s }), address: e };
    },
    generateSIWEMessage: i,
  };
}
var G = (function (e) {
  return (
    (e.IDLE = "idle"),
    (e.REQUESTING_NONCE = "requesting"),
    (e.WAITING_SIGNATURE = "waiting"),
    (e.VERIFYING = "verifying"),
    (e.SUCCESS = "success"),
    (e.ERROR = "error"),
    e
  );
})({});
function H(e = {}) {
  const {
      domain: t = "undefined" != typeof window
        ? window.location.host
        : "localhost",
      apiBaseUrl: n = "/api/v1/auth",
      onSuccess: i,
      onError: s,
      onStatusChange: o,
    } = e,
    c = "AUTH_TOKEN",
    d = "REFRESH_TOKEN",
    { signSIWEMessage: l } = W(),
    { address: u, isConnected: p } = $(),
    [m, y] = a(G.IDLE),
    [h, f] = a(null),
    b = r(
      (e) => {
        y(e), o?.(e);
      },
      [o],
    ),
    g = r(async () => {
      if (!u || !p) {
        const e = new Error("Wallet not connected");
        return f(e.message), s?.(e), null;
      }
      f(null);
      try {
        b(G.REQUESTING_NONCE);
        const { nonce: e } = await (async () => (
          setTimeout(() => {}, 3e3),
          {
            nonce: "2b5f8d3a9c1234567890abcdef",
            message:
              "example.com wants you to sign in with your Ethereum account...",
            expiresAt: 1696147200,
          }
        ))();
        b(G.WAITING_SIGNATURE);
        const { signature: n } = await l(t, e);
        b(G.VERIFYING);
        const { accessToken: a, refreshToken: r } = await (async () => (
          setTimeout(() => {}, 3e3),
          {
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            user: {},
            tokenType: "Bearer",
            expiresIn: 900,
          }
        ))();
        return (
          localStorage.setItem(c, a),
          localStorage.setItem(d, r),
          localStorage.setItem(`${c}_address`, u),
          b(G.SUCCESS),
          i?.(a),
          setTimeout(() => b(G.IDLE), 2e3),
          a
        );
      } catch (e) {
        const t = e instanceof Error ? e.message : "Authentication failed",
          n =
            t.toLowerCase().includes("rejected") ||
            t.toLowerCase().includes("denied") ||
            t.toLowerCase().includes("user rejected")
              ? "用户取消签名"
              : t;
        return (
          f(n),
          b(G.ERROR),
          s?.(e instanceof Error ? e : new Error(n)),
          setTimeout(() => {
            b(G.IDLE), f(null);
          }, 3e3),
          null
        );
      }
    }, [u, p, t, n, c, b, i, s]),
    w = r(() => {
      localStorage.removeItem(c),
        localStorage.removeItem(d),
        localStorage.removeItem(`${c}_address`),
        b(G.IDLE),
        f(null);
    }, [c, b]),
    v = r(() => {
      const e = localStorage.getItem(c),
        t = localStorage.getItem(`${c}_address`);
      return !(!e || !t || t !== u);
    }, [c, u]),
    x = r(() => {
      const e = localStorage.getItem(`${c}_address`);
      e && u && e !== u && w();
    }, [u, c, w]);
  return {
    status: m,
    isAuthenticated: v(),
    isAuthenticating: m !== G.IDLE && m !== G.SUCCESS && m !== G.ERROR,
    error: h,
    address: u,
    signIn: g,
    signOut: w,
    reload: x,
  };
}
function q(e, t) {
  void 0 === t && (t = {});
  var n = t.insertAt;
  if (e && "undefined" != typeof document) {
    var a = document.head || document.getElementsByTagName("head")[0],
      r = document.createElement("style");
    (r.type = "text/css"),
      "top" === n && a.firstChild
        ? a.insertBefore(r, a.firstChild)
        : a.appendChild(r),
      r.styleSheet
        ? (r.styleSheet.cssText = e)
        : r.appendChild(document.createTextNode(e));
  }
}
function V({ status: n, error: a, onClose: r }) {
  return n === G.IDLE
    ? null
    : e("div", {
        className: "auth-modal-overlay",
        onClick: r,
        children: t("div", {
          className: "auth-modal-content",
          onClick: (e) => e.stopPropagation(),
          children: [
            n === G.REQUESTING_NONCE &&
              t("div", {
                className: "auth-modal-body",
                children: [
                  e("div", {
                    className: "auth-modal-spinner",
                    children: e("div", { className: "spinner" }),
                  }),
                  e("h3", {
                    className: "auth-modal-title",
                    children: "准备中...",
                  }),
                  e("p", {
                    className: "auth-modal-description",
                    children: "正在准备签名消息",
                  }),
                ],
              }),
            n === G.WAITING_SIGNATURE &&
              t("div", {
                className: "auth-modal-body",
                children: [
                  e("div", {
                    className: "auth-modal-icon",
                    children: t("svg", {
                      width: "64",
                      height: "64",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: [
                        e("path", {
                          d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
                        }),
                        e("path", {
                          d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
                        }),
                      ],
                    }),
                  }),
                  e("h3", {
                    className: "auth-modal-title",
                    children: "等待签名",
                  }),
                  e("p", {
                    className: "auth-modal-description",
                    children: "请在钱包中确认签名请求",
                  }),
                  e("div", {
                    className: "auth-modal-spinner",
                    children: e("div", { className: "spinner" }),
                  }),
                ],
              }),
            n === G.VERIFYING &&
              t("div", {
                className: "auth-modal-body",
                children: [
                  e("div", {
                    className: "auth-modal-spinner",
                    children: e("div", { className: "spinner" }),
                  }),
                  e("h3", {
                    className: "auth-modal-title",
                    children: "验证中...",
                  }),
                  e("p", {
                    className: "auth-modal-description",
                    children: "正在验证您的签名",
                  }),
                ],
              }),
            n === G.SUCCESS &&
              t("div", {
                className: "auth-modal-body",
                children: [
                  e("div", {
                    className: "auth-modal-icon auth-modal-icon--success",
                    children: e("svg", {
                      width: "64",
                      height: "64",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: e("path", { d: "M20 6L9 17l-5-5" }),
                    }),
                  }),
                  e("h3", {
                    className: "auth-modal-title",
                    children: "登录成功!",
                  }),
                  e("p", {
                    className: "auth-modal-description",
                    children: "欢迎回来",
                  }),
                ],
              }),
            n === G.ERROR &&
              t("div", {
                className: "auth-modal-body",
                children: [
                  e("div", {
                    className: "auth-modal-icon auth-modal-icon--error",
                    children: t("svg", {
                      width: "64",
                      height: "64",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: [
                        e("circle", { cx: "12", cy: "12", r: "10" }),
                        e("line", { x1: "15", y1: "9", x2: "9", y2: "15" }),
                        e("line", { x1: "9", y1: "9", x2: "15", y2: "15" }),
                      ],
                    }),
                  }),
                  e("h3", {
                    className: "auth-modal-title",
                    children: "签名失败",
                  }),
                  e("p", {
                    className: "auth-modal-description",
                    children: a || "请重试",
                  }),
                  e("button", {
                    className: "auth-modal-button",
                    onClick: r,
                    children: "关闭",
                  }),
                ],
              }),
          ],
        }),
      });
}
q(
  ".auth-modal-overlay{align-items:center;animation:fadeIn .2s ease-out;backdrop-filter:blur(4px);background:rgba(0,0,0,.5);bottom:0;display:flex;justify-content:center;left:0;position:fixed;right:0;top:0;z-index:9999}.auth-modal-content{animation:slideUp .3s ease-out;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);max-width:400px;padding:32px;width:90%}.auth-modal-body{align-items:center;display:flex;flex-direction:column;text-align:center}.auth-modal-icon{animation:pulse 2s ease-in-out infinite;color:#3b82f6;margin-bottom:16px}.auth-modal-icon--success{animation:scaleIn .3s ease-out;color:#10b981}.auth-modal-icon--error{animation:shake .5s ease-out;color:#ef4444}.auth-modal-title{color:#111;font-size:24px;font-weight:600;margin:0 0 8px}.auth-modal-description{color:#6b7280;font-size:14px;margin:0 0 24px}.auth-modal-spinner{margin-top:16px}.spinner{animation:spin 1s linear infinite;border:3px solid #e5e7eb;border-radius:50%;border-top-color:#3b82f6;height:40px;width:40px}.auth-modal-button{background:#3b82f6;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:16px;font-weight:500;padding:12px 24px;transition:background .2s}.auth-modal-button:hover{background:#2563eb}.auth-modal-button:active{transform:scale(.98)}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes slideUp{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(1turn)}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes scaleIn{0%{transform:scale(0)}to{transform:scale(1)}}@keyframes shake{0%,to{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}@media (prefers-color-scheme:dark){.auth-modal-content{background:#1f2937}.auth-modal-title{color:#f9fafb}.auth-modal-description{color:#9ca3af}.spinner{border-color:#3b82f6 #374151 #374151}}",
);
const Y = o(null);
function J({ children: n, autoSignOnConnect: a = !1, ...r }) {
  const { isConnected: o } = $(),
    {
      signIn: c,
      signOut: d,
      reload: l,
      status: u,
      isAuthenticated: p,
      isAuthenticating: m,
      error: y,
      address: h,
    } = H(r);
  i(() => {
    a && o && !p && u === G.IDLE && c();
  }, [a, o, p, u, c]),
    i(() => {
      l();
    }, [h, l]);
  const f = s(
    () => ({
      status: u,
      isAuthenticated: p,
      isAuthenticating: m,
      error: y,
      address: h,
      signIn: c,
      signOut: d,
      reload: l,
    }),
    [u, p, m, y, h, c, d, l],
  );
  return t(Y.Provider, {
    value: f,
    children: [
      n,
      e(V, {
        status: u,
        error: y,
        onClose: () => {
          G.ERROR;
        },
      }),
    ],
  });
}
function K() {
  const e = c(Y);
  if (!e) throw new Error("useAuth must be used within AuthProvider");
  return e;
}
const X = new B({
  defaultOptions: { queries: { refetchOnWindowFocus: !1, retry: !1 } },
});
function Q({
  children: t,
  theme: a = "auto",
  queryClient: r = X,
  initialState: i,
  enableAuth: s = !1,
  authConfig: o,
  ...c
}) {
  const { config: d } = n.useMemo(
      () =>
        (function (e) {
          const {
              appName: t = "APP_NAME",
              projectId: n = "YOUR_PROJECT_ID",
              alchemyApiKey: a,
              infuraApiKey: r,
            } = e,
            i = L.reduce((e, t) => {
              let n = "";
              return (
                a &&
                  (n = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.g.alchemy.com/v2/${a}`),
                r &&
                  (n = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.infura.io/v3/${r}`),
                (e[t.id] = n ? l(n) : l()),
                e
              );
            }, {});
          return {
            config: E({
              appName: t,
              projectId: n,
              chains: L,
              ssr: !0,
              storage: u({ storage: p }),
            }),
            transports: i,
          };
        })(c),
      [c.appName, c.projectId, c.alchemyApiKey, c.infuraApiKey],
    ),
    m = n.useMemo(() => j, [a]),
    y = e(v, {
      config: d,
      reconnectOnMount: !0,
      initialState: i,
      children: e(O, {
        client: r,
        children: e(A, {
          theme: m,
          modalSize: "compact",
          showRecentTransactions: !0,
          children: t,
        }),
      }),
    });
  return s
    ? e(v, {
        config: d,
        reconnectOnMount: !0,
        initialState: i,
        children: e(O, {
          client: r,
          children: e(A, {
            theme: m,
            modalSize: "compact",
            showRecentTransactions: !0,
            children: e(J, { ...o, children: t }),
          }),
        }),
      })
    : y;
}
function Z() {
  const { address: e, connector: t, isConnected: n } = m(),
    a = y(),
    r = h().find((e) => e.id === a),
    { data: i } = x({ address: e }),
    { data: s, isLoading: o } = T({ address: e }),
    c = s
      ? {
          value: s.value,
          formatted: z(s.value),
          symbol: s.symbol,
          decimals: s.decimals,
        }
      : void 0;
  return {
    address: e,
    isConnected: n,
    ensName: i,
    chainId: a,
    connector: t
      ? { id: t.id, name: t.name, type: t.type, icon: t.icon }
      : void 0,
    chain: r,
    balance: c,
    isBalanceLoading: o,
  };
}
function ee() {
  const e = h(),
    t = y(),
    n = e.find((e) => e.id === t),
    { switchChain: a, isPending: r, error: i, isSuccess: s, reset: o } = C();
  return {
    currentChain: n,
    switchToNetwork: (e) => {
      if (!a) throw new Error("❌Network switching not supported");
      try {
        a({ chainId: e.chainId });
      } catch (e) {
        throw e;
      }
    },
    isPending: r,
    error: i,
    isSuccess: s,
    reset: o,
    isCurrentChain: (e) => t === e,
    canSwitchNetwork: !!a,
  };
}
function te({
  address: e,
  abi: t,
  functionName: n,
  args: a,
  chainId: r,
  enabled: i = !0,
  cacheTime: s = 0,
  staleTime: o = 0,
}) {
  const { data: c, ...d } = k({
    address: e,
    abi: t,
    functionName: n,
    args: a,
    chainId: r,
    query: { enabled: i, gcTime: s, staleTime: o },
  });
  return { data: c, ...d };
}
function ne({
  address: e,
  abi: t,
  functionName: n,
  args: a,
  value: r,
  chainId: i,
  enabled: s = !0,
  gasLimit: o,
}) {
  const { writeContract: c, writeContractAsync: d, ...l } = N();
  return {
    write: (d) => {
      s &&
        c({
          address: e,
          abi: t,
          functionName: n,
          args: d?.args || a,
          value: d?.value || r,
          chainId: i,
          gas: d?.gas || o,
        });
    },
    writeAsync: async (c) => {
      if (s)
        return await d({
          address: e,
          abi: t,
          functionName: n,
          args: c?.args || a,
          value: c?.value || r,
          chainId: i,
          gas: c?.gas || o,
        });
    },
    receipt: I({ hash: l.data, query: { enabled: !!l.data } }),
    ...l,
  };
}
const ae = [
    {
      constant: !0,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      type: "function",
    },
    {
      constant: !0,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      type: "function",
    },
    {
      constant: !0,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      type: "function",
    },
    {
      constant: !0,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      type: "function",
    },
    {
      constant: !0,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
    {
      constant: !1,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
    {
      constant: !1,
      inputs: [
        { name: "_from", type: "address" },
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
    {
      constant: !1,
      inputs: [
        { name: "_spender", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
    {
      constant: !0,
      inputs: [
        { name: "_owner", type: "address" },
        { name: "_spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      type: "function",
    },
    {
      anonymous: !1,
      inputs: [
        { indexed: !0, name: "from", type: "address" },
        { indexed: !0, name: "to", type: "address" },
        { indexed: !1, name: "value", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        { indexed: !0, name: "owner", type: "address" },
        { indexed: !0, name: "spender", type: "address" },
        { indexed: !1, name: "value", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
  ],
  re = [
    {
      inputs: [
        { internalType: "address", name: "_ydToken", type: "address" },
        { internalType: "address", name: "_platformAddress", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "uint256",
          name: "courseId",
          type: "uint256",
        },
        {
          indexed: !0,
          internalType: "address",
          name: "instructor",
          type: "address",
        },
        { indexed: !1, internalType: "string", name: "title", type: "string" },
        {
          indexed: !1,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "CourseCreated",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "uint256",
          name: "courseId",
          type: "uint256",
        },
        {
          indexed: !0,
          internalType: "address",
          name: "student",
          type: "address",
        },
        {
          indexed: !0,
          internalType: "address",
          name: "instructor",
          type: "address",
        },
        {
          indexed: !1,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "CoursePurchased",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "student", type: "address" },
        { internalType: "uint256[]", name: "courseIds", type: "uint256[]" },
      ],
      name: "batchCheckAccess",
      outputs: [{ internalType: "bool[]", name: "", type: "bool[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "courseStudentCount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "courseStudents",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "courses",
      outputs: [
        { internalType: "uint256", name: "id", type: "uint256" },
        { internalType: "string", name: "title", type: "string" },
        { internalType: "address", name: "instructor", type: "address" },
        { internalType: "uint256", name: "price", type: "uint256" },
        { internalType: "bool", name: "isPublished", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "title", type: "string" },
        { internalType: "address", name: "instructor", type: "address" },
        { internalType: "uint256", name: "price", type: "uint256" },
      ],
      name: "createCourse",
      outputs: [{ internalType: "uint256", name: "courseId", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "courseId", type: "uint256" }],
      name: "getCourse",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "string", name: "title", type: "string" },
            { internalType: "address", name: "instructor", type: "address" },
            { internalType: "uint256", name: "price", type: "uint256" },
            { internalType: "bool", name: "isPublished", type: "bool" },
          ],
          internalType: "struct ICourseContract.Course",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "courseId", type: "uint256" }],
      name: "getCourseStudentCount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "courseId", type: "uint256" }],
      name: "getCourseStudents",
      outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "instructor", type: "address" },
      ],
      name: "getInstructorCourses",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "student", type: "address" }],
      name: "getStudentCourses",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getTotalCourses",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "student", type: "address" },
        { internalType: "uint256", name: "courseId", type: "uint256" },
      ],
      name: "hasAccess",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "hasPurchased",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "platformAddress",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "courseId", type: "uint256" }],
      name: "purchaseCourse",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "studentCourses",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalCourses",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "ydToken",
      outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
  ],
  ie = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: !0,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: !1,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        { indexed: !0, internalType: "address", name: "from", type: "address" },
        { indexed: !0, internalType: "address", name: "to", type: "address" },
        {
          indexed: !1,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "EXCHANGE_RATE",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "ownerAddr", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "recipients", type: "address[]" },
        { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      ],
      name: "batchTransfer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "exchangeETHForTokens",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
function se({ address: e, spenderAddress: t, enabled: n = !0 }) {
  const { address: a } = m(),
    r = (e) => {
      if (!c) throw new Error("Decimals not loaded");
      return U(e, c);
    },
    { data: i } = te({
      address: e,
      abi: ae,
      functionName: "totalSupply",
      enabled: n,
    }),
    { data: s, refetch: o } = te({
      address: e,
      abi: ae,
      functionName: "balanceOf",
      args: a ? [a] : void 0,
      enabled: n && !!a,
    }),
    { data: c } = te({
      address: e,
      abi: ae,
      functionName: "decimals",
      enabled: n,
    }),
    { data: d, refetch: l } = te({
      address: e,
      abi: ae,
      functionName: "allowance",
      args: a && t ? [a, t] : void 0,
      enabled: n && !!a && !!t,
    }),
    u = ne({ address: e, abi: ae, functionName: "transfer" }),
    p = ne({ address: e, abi: ae, functionName: "approve" }),
    y = ne({ address: e, abi: ae, functionName: "transferFrom" });
  return {
    totalSupply: i,
    balance: s,
    allowance: d,
    transferReceipt: u.receipt,
    approveReceipt: p.receipt,
    transferFromReceipt: y.receipt,
    refetchBalance: o,
    refetchAllowance: l,
    transfer: async (e, t) => {
      if (!u.writeAsync) throw new Error("Transfer not available");
      const n = r(t);
      return u.writeAsync({ args: [e, n] });
    },
    approve: async (e, t) => {
      if (!p.writeAsync) throw new Error("Approve not available");
      const n = r(t);
      return p.writeAsync({ args: [e, n] });
    },
    transferFrom: async (e, t, n) => {
      if (!y.writeAsync) throw new Error("TransferFrom not available");
      const a = r(n);
      return y.writeAsync({ args: [e, t, a] });
    },
  };
}
function oe(e, t) {
  return {
    read:
      (n, a = !0) =>
      (...r) => {
        const i = r.length > 0 && r.every((e) => void 0 !== e);
        return te({
          address: e,
          abi: t,
          functionName: n,
          args: i ? r : void 0,
          enabled: a,
        });
      },
    write: (n) => {
      const a = ne({ address: e, abi: t, functionName: n });
      return {
        send: async (...e) => {
          if (!a.writeAsync) throw new Error(`Function ${n} is not writable`);
          let t,
            r = e;
          if (e.length > 0) {
            const n = e[e.length - 1];
            n &&
              "object" == typeof n &&
              !Array.isArray(n) &&
              (void 0 !== n.value || void 0 !== n.gas) &&
              ((t = n), (r = e.slice(0, -1)));
          }
          return a.writeAsync({ args: r, value: t?.value, gas: t?.gas });
        },
        receipt: a.receipt,
        writer: a,
      };
    },
  };
}
const ce = "0xA812265c869F2BCB755980677812F253459A0cc7";
function de({ address: e = ce, spenderAddress: t, enabled: n = !0 }) {
  const { address: r } = m(),
    [i, s] = a(),
    [o, c] = a(),
    { data: d, refetch: l } = _({
      account: r,
      to: i,
      value: o,
      query: { enabled: !1 },
    }),
    u = (e) => {
      if (!g) throw new Error("Decimals not loaded");
      return U(e, g);
    },
    p = async (e, t) => {
      s(e),
        c(t),
        await new Promise((e) => setTimeout(e, 0)),
        await l(),
        s(void 0),
        c(void 0);
    },
    y = oe(e, ie),
    { data: h } = y.read("totalSupply")(),
    { data: f, refetch: b } = y.read("balanceOf", n && !!r)(),
    { data: g } = y.read("decimals")(),
    { data: w, refetch: v } = y.read("allowance")(r, t),
    x = y.write("transfer"),
    T = y.write("approve"),
    C = y.write("transferFrom"),
    k = y.write("exchangeETHForTokens"),
    N = y.write("stake"),
    I = y.write("unstake"),
    E = y.write("claimReward");
  return {
    totalSupply: h,
    balance: f,
    allowance: w,
    transferReceipt: x.receipt,
    approveReceipt: T.receipt,
    transferFromReceipt: C.receipt,
    exchangeETHForTokensReceipt: k.receipt,
    stakeReceipt: N.receipt,
    unstakeReceipt: I.receipt,
    claimRewardReceipt: E.receipt,
    refetchBalance: b,
    refetchAllowance: v,
    getStakeInfo: (e) => y.read("getStakeInfo")(e),
    calculatePendingReward: (e) => y.read("calculatePendingReward")(e),
    canUnstake: (e) => y.read("canUnstake")(e),
    transfer: async (e, t) => {
      const n = u(t);
      return await p(e, n), x.send(e, n, { gas: d });
    },
    approve: async (e, t) => {
      const n = u(t);
      return await p(ce, void 0), T.send(e, n, { gas: d });
    },
    transferFrom: async (e, t, n) => {
      const a = u(n);
      return await p(t, a), C.send(e, t, a);
    },
    exchangeETHForTokens: async (e) => (
      await p(ce, D(e)), k.send({ value: D(e), gas: d })
    ),
    stake: async (e, t) => N.send(e, t),
    unstake: async (e) => I.send(e),
    claimReward: async () => E.send(),
  };
}
function le({
  address: e = "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d",
  tokenDecimals: t = 18,
}) {
  const n = oe(e, re),
    a = (e) => U(e, t),
    r = n.write("createCourse"),
    i = n.write("purchaseCourse"),
    s = n.write("updateCoursePrice"),
    o = n.write("updateProgress"),
    c = n.write("requestRefund"),
    d = n.write("certifyInstructor"),
    l = n.write("revokeInstructor"),
    u = n.write("batchCertifyInstructors"),
    p = n.write("updatePlatformAddress"),
    m = n.write("updateCourse"),
    y = n.write("publishCourse"),
    h = n.write("unpublishCourse"),
    f = n.write("deleteCourse");
  return {
    hasAccess: (e, t) => n.read("hasAccess")(e, t),
    getCourse: (e) => n.read("getCourse")(e),
    getStudentCourses: (e) => n.read("getStudentCourses")(e),
    getCourseStudents: (e) => n.read("getCourseStudents")(e),
    getInstructorCourses: (e) => n.read("getInstructorCourses")(e),
    getTotalCourses: () => n.read("getTotalCourses")(),
    getCourseStudentCount: (e) => n.read("getCourseStudentCount")(e),
    batchCheckAccess: (e, t) => n.read("batchCheckAccess")(e, t),
    getCourseProgress: (e, t) => n.read("getProgress")(e, t),
    getRefundRequest: (e) => n.read("getRefundRequest")(e),
    getRefundEligibilityDetails: (e, t) =>
      n.read("getRefundEligibilityDetails")(e, t),
    isCertifiedInstructor: (e) => n.read("isCertifiedInstructor")(e),
    createCourse: async (e, t, n, i) => await r.send(e, t, a(n), i),
    purchaseCourse: async (e) => await i.send(e),
    updateCoursePrice: async (e, t) => await s.send(e, a(t)),
    updateCourseProgress: async (e, t) => await o.send(e, t),
    requestRefund: async (e) => await c.send(e),
    certifyInstructor: async (e) => await d.send(e),
    revokeInstructor: async (e) => await l.send(e),
    batchCertifyInstructors: async (e) => await u.send(e),
    updatePlatformAddress: async (e) => await p.send(e),
    updateCourse: async (e, t, n) => await m.send(e, t, n),
    publishCourse: async (e) => await y.send(e),
    unpublishCourse: async (e) => await h.send(e),
    deleteCourse: async (e) => await f.send(e),
    createCourseReceipt: r.receipt,
    purchaseCourseReceipt: i.receipt,
    updateCoursePriceReceipt: s.receipt,
    updateCourseProgressReceipt: o.receipt,
    requestRefundReceipt: c.receipt,
    certifyInstructorReceipt: d.receipt,
    revokeInstructorReceipt: l.receipt,
    batchCertifyInstructorsReceipt: u.receipt,
    updatePlatformAddressReceipt: p.receipt,
    updateCourseReceipt: m.receipt,
    publishCourseReceipt: y.receipt,
    unpublishCourseReceipt: h.receipt,
    deleteCourseReceipt: f.receipt,
  };
}
q(
  ".profile__menu-wrapper{position:relative}.profile__menu-trigger{align-items:center;background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#6a6d94;cursor:pointer;display:flex;height:2.5rem;justify-content:center;transition:transform .2s;width:2.5rem}.profile__menu-trigger:hover{transform:translateY(-1px)}.profile__avatar{border-radius:50%}.wallet-dropdown{background-color:#fff;border:1px solid #ecebff;border-radius:1rem;box-shadow:0 24px 60px rgba(154,161,255,.18);color:#2b2558;font-size:.875rem;line-height:1.25rem;padding:1rem;position:absolute;right:0;top:2.8rem;width:18rem}.wallet-header{align-items:flex-start;display:flex;justify-content:space-between}.wallet-label{color:#8b8eb5;font-size:.75rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.wallet-value{font-weight:600;margin-top:.25rem}.wallet-chain-id{background-color:#f4f4ff;border-radius:9999px;color:#5f6094;font-size:.75rem;font-weight:500;line-height:1rem;padding:.25rem .75rem}.wallet-section{margin-top:1rem}.wallet-address-box{align-items:center;background-color:#f8f8ff;border-radius:.75rem;display:flex;justify-content:space-between;margin-top:.25rem;padding:.5rem .75rem}.wallet-address-text{color:#2b2558;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.875rem;line-height:1.25rem}.copy-button{background:transparent;border:none;border-radius:9999px;color:#6a6d94;cursor:pointer;padding:.25rem;transition:background-color .2s}.copy-button:hover{background-color:#fff}.balance-info-box{background-color:#f9f9ff;border-radius:.75rem;margin-top:1rem;padding:.75rem}.balance-info-label{align-items:center;color:#8b8eb5;display:flex;font-size:.75rem;gap:.5rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.balance-info-amount{font-size:1.125rem;font-weight:600;line-height:1.75rem;margin-top:.5rem}.disconnect-button{align-items:center;background-color:#f3f4f6;border:none;border-radius:.5rem;color:#374151;cursor:pointer;display:flex;font-weight:500;gap:.5rem;justify-content:center;margin-top:1rem;padding:.5rem 1rem;transition:background-color .2s;width:100%}.disconnect-button:hover:not(:disabled){background-color:#e5e7eb}.disconnect-button:disabled{cursor:not-allowed;opacity:.5}.disconnect-button.loading{opacity:.7}",
);
const ue = ({ account: n, chain: r, openAccountModal: s }) => {
  const [o, c] = a(!1),
    l = d(null),
    { disconnect: u } = $();
  i(() => {
    const e = (e) => {
      l.current && !l.current.contains(e.target) && c(!1);
    };
    return (
      document.addEventListener("mousedown", e),
      () => {
        document.removeEventListener("mousedown", e);
      }
    );
  }, []);
  return t("div", {
    className: "profile__menu-wrapper",
    ref: l,
    children: [
      e("button", {
        onClick: () => c(!o),
        type: "button",
        className: "profile__menu-trigger profile__avatar",
        "aria-label": "Account menu",
        children: t("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [
            e("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
            e("circle", { cx: "12", cy: "7", r: "4" }),
          ],
        }),
      }),
      o &&
        t("div", {
          className: "wallet-dropdown",
          id: "walletDropdown",
          children: [
            t("div", {
              className: "wallet-header",
              children: [
                t("div", {
                  children: [
                    e("div", { className: "wallet-label", children: "网络" }),
                    e("div", { className: "wallet-value", children: r.name }),
                  ],
                }),
                e("div", { className: "wallet-chain-id", children: "ID 1" }),
              ],
            }),
            t("div", {
              className: "wallet-section",
              children: [
                e("div", { className: "wallet-label", children: "地址" }),
                t("div", {
                  className: "wallet-address-box",
                  children: [
                    e("span", {
                      className: "wallet-address-text",
                      children: n.displayName,
                    }),
                    e("button", {
                      type: "button",
                      className: "copy-button",
                      "aria-label": "复制地址",
                      onClick: () => {
                        navigator.clipboard.writeText("");
                      },
                      children: t("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        children: [
                          e("rect", {
                            x: "9",
                            y: "9",
                            width: "13",
                            height: "13",
                            rx: "2",
                            ry: "2",
                          }),
                          e("path", {
                            d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
            t("div", {
              className: "balance-info-box",
              children: [
                t("div", {
                  className: "balance-info-label",
                  children: [
                    t("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: [
                        e("circle", { cx: "12", cy: "12", r: "10" }),
                        e("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
                        e("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" }),
                      ],
                    }),
                    "当前余额",
                  ],
                }),
                e("div", {
                  className: "balance-info-amount",
                  children: n.displayBalance,
                }),
              ],
            }),
            t("button", {
              className: "disconnect-button",
              onClick: () => {
                c(!1), u();
              },
              children: [
                t("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    e("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
                    e("polyline", { points: "16 17 21 12 16 7" }),
                    e("line", { x1: "21", y1: "12", x2: "9", y2: "12" }),
                  ],
                }),
                "断开连接",
              ],
            }),
          ],
        }),
    ],
  });
};
q(
  ".wallet-button{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.wallet-button__container{align-items:center;display:flex;gap:8px;height:44px;justify-content:center}.wallet-button__connect{background:linear-gradient(90deg,#eab308,#f97316);border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__connect:hover{box-shadow:0 4px 12px rgba(102,126,234,.4);transform:translateY(-1px)}.wallet-button__wrong-network{background:#ff6b6b;border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__wrong-network:hover{background:#ff5252}.wallet-button__connected{align-items:center;display:flex;gap:16px}.wallet-button__chain{align-items:center;background:linear-gradient(90deg,#ffe7c5,#ffead4);border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-shadow:0 0 0 1px hsla(0,0%,100%,.6);color:#5a4b23;display:flex;font-size:.875rem;font-weight:500;gap:.5rem;line-height:1.25rem;padding:8px 12px}.wallet-button__chain-icon{align-items:center;border-radius:.5rem;display:flex;gap:.5rem}.wallet-button__icon{align-items:center;background:linear-gradient(90deg,#facc15,#f97316);border-radius:50%;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.wallet-button__account{align-items:center;background-color:rgba(22,163,74,.2);background-color:#fff;border:none;border-radius:.5rem;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#66608d;cursor:pointer;display:flex;font-size:.875rem;gap:.5rem;height:40px;justify-content:space-evenly;line-height:1.25rem;min-width:150px;padding:.25rem .75rem;transform:translateY(-1px);transition:transform .2s}.wallet-button__status-bot{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;background-color:#4ade80;border-radius:9999px;height:.5rem;width:.5rem}.wallet-icon{color:#4ade80;height:1rem;width:1rem}.wallet-button__address{color:#4ade80;color:#8b8eb5;font-size:.875rem;font-size:.75rem;font-weight:600;line-height:1rem}.notification-container{position:relative}.notification-button{background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-sizing:border-box;color:#6a6d94;display:flex;height:2.5rem;position:relative;width:2.5rem}.notification-badge,.notification-button{align-items:center;justify-content:center}.notification-badge{background-color:#ff5a5f;border-radius:9999px;color:#fff;display:inline-flex;font-size:.625rem;font-weight:600;height:1rem;line-height:1rem;padding:.25 .25rem;position:absolute;right:-.25rem;top:-.25rem;width:1rem}",
);
const pe = ({
  label: n = "连接钱包",
  showBalance: a = !0,
  showChainName: r = !0,
  className: i = "",
  size: s = "medium",
}) =>
  e("div", {
    className: `wallet-button wallet-button--${s} ${i}`,
    children: e(M.Custom, {
      children: ({
        account: i,
        chain: s,
        openAccountModal: o,
        openConnectModal: c,
        authenticationStatus: d,
        mounted: l,
      }) =>
        e("div", {
          className: "wallet-button__container",
          children:
            l && "loading" !== d && i && s && (!d || "authenticated" === d)
              ? t("div", {
                  className: "wallet-button__connected",
                  children: [
                    r &&
                      t("div", {
                        className: "wallet-button__chain",
                        children: [
                          s.iconUrl &&
                            e("div", {
                              className: "wallet-button__chain-icon",
                              children: e("img", {
                                alt: s.name ?? "Chain icon",
                                src: s.iconUrl,
                                className: "wallet-button__icon",
                              }),
                            }),
                          a &&
                            i.displayBalance &&
                            e("span", { children: i.displayBalance }),
                        ],
                      }),
                    t("button", {
                      onClick: o,
                      type: "button",
                      className: "wallet-button__account",
                      children: [
                        e("span", { className: "wallet-button__status-bot" }),
                        t("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          className: "wallet-icon",
                          width: "24",
                          height: "24",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "aria-hidden": "true",
                          children: [
                            e("path", {
                              d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
                            }),
                            e("path", {
                              d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
                            }),
                          ],
                        }),
                        e("span", {
                          className: "wallet-button__address",
                          children: i.displayName,
                        }),
                      ],
                    }),
                    e("div", {
                      className: "notification-container",
                      children: t("div", {
                        className: "notification-button",
                        children: [
                          t("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            children: [
                              e("path", {
                                d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
                              }),
                              e("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }),
                            ],
                          }),
                          e("span", {
                            className: "notification-badge",
                            children: "99",
                          }),
                        ],
                      }),
                    }),
                    e(ue, { account: i, chain: s, openAccountModal: o }),
                  ],
                })
              : e("button", {
                  onClick: c,
                  type: "button",
                  className: "wallet-button__connect",
                  children: n,
                }),
        }),
    }),
  });
export {
  V as AuthModal,
  J as AuthProvider,
  G as SignInStatus,
  pe as WalletButton,
  Q as WalletProvider,
  K as useAuth,
  le as useCourseContract,
  se as useERC20,
  ee as useNetworkSwitch,
  de as useSimpleYDToken,
  H as useWalletAuth,
  $ as useWalletConnection,
  Z as useWalletInfo,
  W as useWalletSign,
};
//# sourceMappingURL=index.esm.js.map
