"use strict";
var e = require("react/jsx-runtime"),
  t = require("react"),
  n = require("wagmi"),
  a = require("@rainbow-me/rainbowkit"),
  r = require("@tanstack/react-query"),
  s = require("wagmi/chains");
require("@rainbow-me/rainbowkit/styles.css");
var i = require("viem");
const o = [s.mainnet, s.sepolia];
s.mainnet.id,
  s.sepolia.id,
  a.lightTheme(),
  a.lightTheme().colors,
  a.lightTheme().radii;
const c = {
  ...a.darkTheme(),
  colors: {
    ...a.darkTheme().colors,
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
    ...a.darkTheme().radii,
    actionButton: "8px",
    connectButton: "8px",
    menuButton: "8px",
    modal: "16px",
    modalMobile: "16px",
  },
};
function d() {
  const {
      address: e,
      connector: t,
      isConnected: a,
      isConnecting: r,
      isReconnecting: s,
    } = n.useAccount(),
    i = n.useChainId(),
    o = n.useChains(),
    { connect: c, connectors: d } = n.useConnect(),
    { reconnect: u } = n.useReconnect(),
    { disconnect: l } = n.useDisconnect(),
    p = o.find((e) => e.id === i);
  return {
    isConnected: a,
    isConnecting: r,
    isReconnecting: s,
    address: e,
    connector: t ? { id: t.id, name: t.name, type: t.type } : void 0,
    chain: p,
    chains: o,
    connect: (e) => {
      if (e) {
        const t = d.find((t) => t.id === e);
        t && c({ connector: t });
      } else {
        const e = d[0];
        e && c({ connector: e });
      }
    },
    reconnect: (e) => {
      u(e);
    },
    disconnect: () => {
      l();
    },
  };
}
function u() {
  const { address: e } = d(),
    {
      signMessageAsync: t,
      isPending: a,
      isSuccess: r,
      isError: s,
    } = n.useSignMessage(),
    i = (e, t, n, a = 1, r, s) =>
      `${e} wants you to sign in with your Ethereum account:\n${t}\n\nI accept the Terms of Service.\n\nURI: https://${e}\nVersion: 1\nChain ID: ${a}\nNonce: ${n}\nIssued At: ${r || new Date().toISOString()}\nExpiration Time: ${s || new Date(Date.now() + 3e5).toISOString()}`;
  return {
    address: e,
    isPending: a,
    isSuccess: r,
    isError: s,
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
var l = (function (e) {
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
function p(e = {}) {
  const {
      domain: n = "undefined" != typeof window
        ? window.location.host
        : "localhost",
      apiBaseUrl: a = "/api/v1/auth",
      onSuccess: r,
      onError: s,
      onStatusChange: i,
    } = e,
    o = "AUTH_TOKEN",
    c = "REFRESH_TOKEN",
    { signSIWEMessage: p } = u(),
    { address: m, isConnected: y } = d(),
    [h, f] = t.useState(l.IDLE),
    [b, g] = t.useState(null),
    w = t.useCallback(
      (e) => {
        f(e), i?.(e);
      },
      [i],
    ),
    x = t.useCallback(async () => {
      if (!m || !y) {
        const e = new Error("Wallet not connected");
        return g(e.message), s?.(e), null;
      }
      g(null);
      try {
        w(l.REQUESTING_NONCE);
        const { nonce: e } = await (async () => (
          setTimeout(() => {}, 3e3),
          {
            nonce: "2b5f8d3a9c1234567890abcdef",
            message:
              "example.com wants you to sign in with your Ethereum account...",
            expiresAt: 1696147200,
          }
        ))();
        w(l.WAITING_SIGNATURE);
        const { signature: t } = await p(n, e);
        w(l.VERIFYING);
        const { accessToken: a, refreshToken: s } = await (async () => (
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
          localStorage.setItem(o, a),
          localStorage.setItem(c, s),
          localStorage.setItem(`${o}_address`, m),
          w(l.SUCCESS),
          r?.(a),
          setTimeout(() => w(l.IDLE), 2e3),
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
          g(n),
          w(l.ERROR),
          s?.(e instanceof Error ? e : new Error(n)),
          setTimeout(() => {
            w(l.IDLE), g(null);
          }, 3e3),
          null
        );
      }
    }, [m, y, n, a, o, w, r, s]),
    v = t.useCallback(() => {
      localStorage.removeItem(o),
        localStorage.removeItem(c),
        localStorage.removeItem(`${o}_address`),
        w(l.IDLE),
        g(null);
    }, [o, w]),
    C = t.useCallback(() => {
      const e = localStorage.getItem(o),
        t = localStorage.getItem(`${o}_address`);
      return !(!e || !t || t !== m);
    }, [o, m]),
    T = t.useCallback(() => {
      const e = localStorage.getItem(`${o}_address`);
      e && m && e !== m && v();
    }, [m, o, v]);
  return {
    status: h,
    isAuthenticated: C(),
    isAuthenticating: h !== l.IDLE && h !== l.SUCCESS && h !== l.ERROR,
    error: b,
    address: m,
    signIn: x,
    signOut: v,
    reload: T,
  };
}
function m(e, t) {
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
function y({ status: t, error: n, onClose: a }) {
  return t === l.IDLE
    ? null
    : e.jsx("div", {
        className: "auth-modal-overlay",
        onClick: a,
        children: e.jsxs("div", {
          className: "auth-modal-content",
          onClick: (e) => e.stopPropagation(),
          children: [
            t === l.REQUESTING_NONCE &&
              e.jsxs("div", {
                className: "auth-modal-body",
                children: [
                  e.jsx("div", {
                    className: "auth-modal-spinner",
                    children: e.jsx("div", { className: "spinner" }),
                  }),
                  e.jsx("h3", {
                    className: "auth-modal-title",
                    children: "准备中...",
                  }),
                  e.jsx("p", {
                    className: "auth-modal-description",
                    children: "正在准备签名消息",
                  }),
                ],
              }),
            t === l.WAITING_SIGNATURE &&
              e.jsxs("div", {
                className: "auth-modal-body",
                children: [
                  e.jsx("div", {
                    className: "auth-modal-icon",
                    children: e.jsxs("svg", {
                      width: "64",
                      height: "64",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: [
                        e.jsx("path", {
                          d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
                        }),
                        e.jsx("path", {
                          d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
                        }),
                      ],
                    }),
                  }),
                  e.jsx("h3", {
                    className: "auth-modal-title",
                    children: "等待签名",
                  }),
                  e.jsx("p", {
                    className: "auth-modal-description",
                    children: "请在钱包中确认签名请求",
                  }),
                  e.jsx("div", {
                    className: "auth-modal-spinner",
                    children: e.jsx("div", { className: "spinner" }),
                  }),
                ],
              }),
            t === l.VERIFYING &&
              e.jsxs("div", {
                className: "auth-modal-body",
                children: [
                  e.jsx("div", {
                    className: "auth-modal-spinner",
                    children: e.jsx("div", { className: "spinner" }),
                  }),
                  e.jsx("h3", {
                    className: "auth-modal-title",
                    children: "验证中...",
                  }),
                  e.jsx("p", {
                    className: "auth-modal-description",
                    children: "正在验证您的签名",
                  }),
                ],
              }),
            t === l.SUCCESS &&
              e.jsxs("div", {
                className: "auth-modal-body",
                children: [
                  e.jsx("div", {
                    className: "auth-modal-icon auth-modal-icon--success",
                    children: e.jsx("svg", {
                      width: "64",
                      height: "64",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: e.jsx("path", { d: "M20 6L9 17l-5-5" }),
                    }),
                  }),
                  e.jsx("h3", {
                    className: "auth-modal-title",
                    children: "登录成功!",
                  }),
                  e.jsx("p", {
                    className: "auth-modal-description",
                    children: "欢迎回来",
                  }),
                ],
              }),
            t === l.ERROR &&
              e.jsxs("div", {
                className: "auth-modal-body",
                children: [
                  e.jsx("div", {
                    className: "auth-modal-icon auth-modal-icon--error",
                    children: e.jsxs("svg", {
                      width: "64",
                      height: "64",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: [
                        e.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                        e.jsx("line", { x1: "15", y1: "9", x2: "9", y2: "15" }),
                        e.jsx("line", { x1: "9", y1: "9", x2: "15", y2: "15" }),
                      ],
                    }),
                  }),
                  e.jsx("h3", {
                    className: "auth-modal-title",
                    children: "签名失败",
                  }),
                  e.jsx("p", {
                    className: "auth-modal-description",
                    children: n || "请重试",
                  }),
                  e.jsx("button", {
                    className: "auth-modal-button",
                    onClick: a,
                    children: "关闭",
                  }),
                ],
              }),
          ],
        }),
      });
}
m(
  ".auth-modal-overlay{align-items:center;animation:fadeIn .2s ease-out;backdrop-filter:blur(4px);background:rgba(0,0,0,.5);bottom:0;display:flex;justify-content:center;left:0;position:fixed;right:0;top:0;z-index:9999}.auth-modal-content{animation:slideUp .3s ease-out;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);max-width:400px;padding:32px;width:90%}.auth-modal-body{align-items:center;display:flex;flex-direction:column;text-align:center}.auth-modal-icon{animation:pulse 2s ease-in-out infinite;color:#3b82f6;margin-bottom:16px}.auth-modal-icon--success{animation:scaleIn .3s ease-out;color:#10b981}.auth-modal-icon--error{animation:shake .5s ease-out;color:#ef4444}.auth-modal-title{color:#111;font-size:24px;font-weight:600;margin:0 0 8px}.auth-modal-description{color:#6b7280;font-size:14px;margin:0 0 24px}.auth-modal-spinner{margin-top:16px}.spinner{animation:spin 1s linear infinite;border:3px solid #e5e7eb;border-radius:50%;border-top-color:#3b82f6;height:40px;width:40px}.auth-modal-button{background:#3b82f6;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:16px;font-weight:500;padding:12px 24px;transition:background .2s}.auth-modal-button:hover{background:#2563eb}.auth-modal-button:active{transform:scale(.98)}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes slideUp{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(1turn)}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes scaleIn{0%{transform:scale(0)}to{transform:scale(1)}}@keyframes shake{0%,to{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}@media (prefers-color-scheme:dark){.auth-modal-content{background:#1f2937}.auth-modal-title{color:#f9fafb}.auth-modal-description{color:#9ca3af}.spinner{border-color:#3b82f6 #374151 #374151}}",
);
const h = t.createContext(null);
function f({ children: n, autoSignOnConnect: a = !1, ...r }) {
  const { isConnected: s } = d(),
    {
      signIn: i,
      signOut: o,
      reload: c,
      status: u,
      isAuthenticated: m,
      isAuthenticating: f,
      error: b,
      address: g,
    } = p(r);
  t.useEffect(() => {
    a && s && !m && u === l.IDLE && i();
  }, [a, s, m, u, i]),
    t.useEffect(() => {
      c();
    }, [g, c]);
  const w = t.useMemo(
    () => ({
      status: u,
      isAuthenticated: m,
      isAuthenticating: f,
      error: b,
      address: g,
      signIn: i,
      signOut: o,
      reload: c,
    }),
    [u, m, f, b, g, i, o, c],
  );
  return e.jsxs(h.Provider, {
    value: w,
    children: [
      n,
      e.jsx(y, {
        status: u,
        error: b,
        onClose: () => {
          l.ERROR;
        },
      }),
    ],
  });
}
const b = new r.QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: !1, retry: !1 } },
});
function g({
  address: e,
  abi: t,
  functionName: a,
  args: r,
  chainId: s,
  enabled: i = !0,
  cacheTime: o = 0,
  staleTime: c = 0,
}) {
  const { data: d, ...u } = n.useReadContract({
    address: e,
    abi: t,
    functionName: a,
    args: r,
    chainId: s,
    query: { enabled: i, gcTime: o, staleTime: c },
  });
  return { data: d, ...u };
}
function w({
  address: e,
  abi: t,
  functionName: a,
  args: r,
  value: s,
  chainId: i,
  enabled: o = !0,
  gasLimit: c,
}) {
  const {
    writeContract: d,
    writeContractAsync: u,
    ...l
  } = n.useWriteContract();
  return {
    write: (n) => {
      o &&
        d({
          address: e,
          abi: t,
          functionName: a,
          args: n?.args || r,
          value: n?.value || s,
          chainId: i,
          gas: n?.gas || c,
        });
    },
    writeAsync: async (n) => {
      if (o)
        return await u({
          address: e,
          abi: t,
          functionName: a,
          args: n?.args || r,
          value: n?.value || s,
          chainId: i,
          gas: n?.gas || c,
        });
    },
    receipt: n.useWaitForTransactionReceipt({
      hash: l.data,
      query: { enabled: !!l.data },
    }),
    ...l,
  };
}
const x = [
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
  v = [
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
  C = [
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
function T(e, t) {
  return {
    read:
      (n, a = !0) =>
      (...r) => {
        const s = r.length > 0 && r.every((e) => void 0 !== e);
        return g({
          address: e,
          abi: t,
          functionName: n,
          args: s ? r : void 0,
          enabled: a,
        });
      },
    write: (n) => {
      const a = w({ address: e, abi: t, functionName: n });
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
const k = "0xA812265c869F2BCB755980677812F253459A0cc7";
m(
  ".profile__menu-wrapper{position:relative}.profile__menu-trigger{align-items:center;background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#6a6d94;cursor:pointer;display:flex;height:2.5rem;justify-content:center;transition:transform .2s;width:2.5rem}.profile__menu-trigger:hover{transform:translateY(-1px)}.profile__avatar{border-radius:50%}.wallet-dropdown{background-color:#fff;border:1px solid #ecebff;border-radius:1rem;box-shadow:0 24px 60px rgba(154,161,255,.18);color:#2b2558;font-size:.875rem;line-height:1.25rem;padding:1rem;position:absolute;right:0;top:2.8rem;width:18rem}.wallet-header{align-items:flex-start;display:flex;justify-content:space-between}.wallet-label{color:#8b8eb5;font-size:.75rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.wallet-value{font-weight:600;margin-top:.25rem}.wallet-chain-id{background-color:#f4f4ff;border-radius:9999px;color:#5f6094;font-size:.75rem;font-weight:500;line-height:1rem;padding:.25rem .75rem}.wallet-section{margin-top:1rem}.wallet-address-box{align-items:center;background-color:#f8f8ff;border-radius:.75rem;display:flex;justify-content:space-between;margin-top:.25rem;padding:.5rem .75rem}.wallet-address-text{color:#2b2558;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.875rem;line-height:1.25rem}.copy-button{background:transparent;border:none;border-radius:9999px;color:#6a6d94;cursor:pointer;padding:.25rem;transition:background-color .2s}.copy-button:hover{background-color:#fff}.balance-info-box{background-color:#f9f9ff;border-radius:.75rem;margin-top:1rem;padding:.75rem}.balance-info-label{align-items:center;color:#8b8eb5;display:flex;font-size:.75rem;gap:.5rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.balance-info-amount{font-size:1.125rem;font-weight:600;line-height:1.75rem;margin-top:.5rem}.disconnect-button{align-items:center;background-color:#f3f4f6;border:none;border-radius:.5rem;color:#374151;cursor:pointer;display:flex;font-weight:500;gap:.5rem;justify-content:center;margin-top:1rem;padding:.5rem 1rem;transition:background-color .2s;width:100%}.disconnect-button:hover:not(:disabled){background-color:#e5e7eb}.disconnect-button:disabled{cursor:not-allowed;opacity:.5}.disconnect-button.loading{opacity:.7}",
);
const j = ({ account: n, chain: a, openAccountModal: r }) => {
  const [s, i] = t.useState(!1),
    o = t.useRef(null),
    { disconnect: c } = d();
  t.useEffect(() => {
    const e = (e) => {
      o.current && !o.current.contains(e.target) && i(!1);
    };
    return (
      document.addEventListener("mousedown", e),
      () => {
        document.removeEventListener("mousedown", e);
      }
    );
  }, []);
  return e.jsxs("div", {
    className: "profile__menu-wrapper",
    ref: o,
    children: [
      e.jsx("button", {
        onClick: () => i(!s),
        type: "button",
        className: "profile__menu-trigger profile__avatar",
        "aria-label": "Account menu",
        children: e.jsxs("svg", {
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
            e.jsx("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
            e.jsx("circle", { cx: "12", cy: "7", r: "4" }),
          ],
        }),
      }),
      s &&
        e.jsxs("div", {
          className: "wallet-dropdown",
          id: "walletDropdown",
          children: [
            e.jsxs("div", {
              className: "wallet-header",
              children: [
                e.jsxs("div", {
                  children: [
                    e.jsx("div", {
                      className: "wallet-label",
                      children: "网络",
                    }),
                    e.jsx("div", {
                      className: "wallet-value",
                      children: a.name,
                    }),
                  ],
                }),
                e.jsx("div", {
                  className: "wallet-chain-id",
                  children: "ID 1",
                }),
              ],
            }),
            e.jsxs("div", {
              className: "wallet-section",
              children: [
                e.jsx("div", { className: "wallet-label", children: "地址" }),
                e.jsxs("div", {
                  className: "wallet-address-box",
                  children: [
                    e.jsx("span", {
                      className: "wallet-address-text",
                      children: n.displayName,
                    }),
                    e.jsx("button", {
                      type: "button",
                      className: "copy-button",
                      "aria-label": "复制地址",
                      onClick: () => {
                        navigator.clipboard.writeText("");
                      },
                      children: e.jsxs("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        children: [
                          e.jsx("rect", {
                            x: "9",
                            y: "9",
                            width: "13",
                            height: "13",
                            rx: "2",
                            ry: "2",
                          }),
                          e.jsx("path", {
                            d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs("div", {
              className: "balance-info-box",
              children: [
                e.jsxs("div", {
                  className: "balance-info-label",
                  children: [
                    e.jsxs("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: [
                        e.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                        e.jsx("line", {
                          x1: "12",
                          y1: "16",
                          x2: "12",
                          y2: "12",
                        }),
                        e.jsx("line", {
                          x1: "12",
                          y1: "8",
                          x2: "12.01",
                          y2: "8",
                        }),
                      ],
                    }),
                    "当前余额",
                  ],
                }),
                e.jsx("div", {
                  className: "balance-info-amount",
                  children: n.displayBalance,
                }),
              ],
            }),
            e.jsxs("button", {
              className: "disconnect-button",
              onClick: () => {
                i(!1), c();
              },
              children: [
                e.jsxs("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    e.jsx("path", {
                      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
                    }),
                    e.jsx("polyline", { points: "16 17 21 12 16 7" }),
                    e.jsx("line", { x1: "21", y1: "12", x2: "9", y2: "12" }),
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
m(
  ".wallet-button{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.wallet-button__container{align-items:center;display:flex;gap:8px;height:44px;justify-content:center}.wallet-button__connect{background:linear-gradient(90deg,#eab308,#f97316);border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__connect:hover{box-shadow:0 4px 12px rgba(102,126,234,.4);transform:translateY(-1px)}.wallet-button__wrong-network{background:#ff6b6b;border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__wrong-network:hover{background:#ff5252}.wallet-button__connected{align-items:center;display:flex;gap:16px}.wallet-button__chain{align-items:center;background:linear-gradient(90deg,#ffe7c5,#ffead4);border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-shadow:0 0 0 1px hsla(0,0%,100%,.6);color:#5a4b23;display:flex;font-size:.875rem;font-weight:500;gap:.5rem;line-height:1.25rem;padding:8px 12px}.wallet-button__chain-icon{align-items:center;border-radius:.5rem;display:flex;gap:.5rem}.wallet-button__icon{align-items:center;background:linear-gradient(90deg,#facc15,#f97316);border-radius:50%;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.wallet-button__account{align-items:center;background-color:rgba(22,163,74,.2);background-color:#fff;border:none;border-radius:.5rem;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#66608d;cursor:pointer;display:flex;font-size:.875rem;gap:.5rem;height:40px;justify-content:space-evenly;line-height:1.25rem;min-width:150px;padding:.25rem .75rem;transform:translateY(-1px);transition:transform .2s}.wallet-button__status-bot{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;background-color:#4ade80;border-radius:9999px;height:.5rem;width:.5rem}.wallet-icon{color:#4ade80;height:1rem;width:1rem}.wallet-button__address{color:#4ade80;color:#8b8eb5;font-size:.875rem;font-size:.75rem;font-weight:600;line-height:1rem}.notification-container{position:relative}.notification-button{background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-sizing:border-box;color:#6a6d94;display:flex;height:2.5rem;position:relative;width:2.5rem}.notification-badge,.notification-button{align-items:center;justify-content:center}.notification-badge{background-color:#ff5a5f;border-radius:9999px;color:#fff;display:inline-flex;font-size:.625rem;font-weight:600;height:1rem;line-height:1rem;padding:.25 .25rem;position:absolute;right:-.25rem;top:-.25rem;width:1rem}",
);
(exports.AuthModal = y),
  (exports.AuthProvider = f),
  (exports.SignInStatus = l),
  (exports.WalletButton = ({
    label: t = "连接钱包",
    showBalance: n = !0,
    showChainName: r = !0,
    className: s = "",
    size: i = "medium",
  }) =>
    e.jsx("div", {
      className: `wallet-button wallet-button--${i} ${s}`,
      children: e.jsx(a.ConnectButton.Custom, {
        children: ({
          account: a,
          chain: s,
          openAccountModal: i,
          openConnectModal: o,
          authenticationStatus: c,
          mounted: d,
        }) => {
          const u =
            d && "loading" !== c && a && s && (!c || "authenticated" === c);
          return e.jsx("div", {
            className: "wallet-button__container",
            children: u
              ? e.jsxs("div", {
                  className: "wallet-button__connected",
                  children: [
                    r &&
                      e.jsxs("div", {
                        className: "wallet-button__chain",
                        children: [
                          s.iconUrl &&
                            e.jsx("div", {
                              className: "wallet-button__chain-icon",
                              children: e.jsx("img", {
                                alt: s.name ?? "Chain icon",
                                src: s.iconUrl,
                                className: "wallet-button__icon",
                              }),
                            }),
                          n &&
                            a.displayBalance &&
                            e.jsx("span", { children: a.displayBalance }),
                        ],
                      }),
                    e.jsxs("button", {
                      onClick: i,
                      type: "button",
                      className: "wallet-button__account",
                      children: [
                        e.jsx("span", {
                          className: "wallet-button__status-bot",
                        }),
                        e.jsxs("svg", {
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
                            e.jsx("path", {
                              d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
                            }),
                            e.jsx("path", {
                              d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
                            }),
                          ],
                        }),
                        e.jsx("span", {
                          className: "wallet-button__address",
                          children: a.displayName,
                        }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "notification-container",
                      children: e.jsxs("div", {
                        className: "notification-button",
                        children: [
                          e.jsxs("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            children: [
                              e.jsx("path", {
                                d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
                              }),
                              e.jsx("path", {
                                d: "M13.73 21a2 2 0 0 1-3.46 0",
                              }),
                            ],
                          }),
                          e.jsx("span", {
                            className: "notification-badge",
                            children: "99",
                          }),
                        ],
                      }),
                    }),
                    e.jsx(j, { account: a, chain: s, openAccountModal: i }),
                  ],
                })
              : e.jsx("button", {
                  onClick: o,
                  type: "button",
                  className: "wallet-button__connect",
                  children: t,
                }),
          });
        },
      }),
    })),
  (exports.WalletProvider = function ({
    children: s,
    theme: i = "auto",
    queryClient: d = b,
    initialState: u,
    enableAuth: l = !1,
    authConfig: p,
    ...m
  }) {
    const { config: y } = t.useMemo(
        () =>
          (function (e) {
            const {
                appName: t = "APP_NAME",
                projectId: r = "YOUR_PROJECT_ID",
                alchemyApiKey: s,
                infuraApiKey: i,
              } = e,
              c = o.reduce((e, t) => {
                let a = "";
                return (
                  s &&
                    (a = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.g.alchemy.com/v2/${s}`),
                  i &&
                    (a = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.infura.io/v3/${i}`),
                  (e[t.id] = a ? n.http(a) : n.http()),
                  e
                );
              }, {});
            return {
              config: a.getDefaultConfig({
                appName: t,
                projectId: r,
                chains: o,
                ssr: !0,
                storage: n.createStorage({ storage: n.cookieStorage }),
              }),
              transports: c,
            };
          })(m),
        [m.appName, m.projectId, m.alchemyApiKey, m.infuraApiKey],
      ),
      h = t.useMemo(() => c, [i]),
      g = e.jsx(n.WagmiProvider, {
        config: y,
        reconnectOnMount: !0,
        initialState: u,
        children: e.jsx(r.QueryClientProvider, {
          client: d,
          children: e.jsx(a.RainbowKitProvider, {
            theme: h,
            modalSize: "compact",
            showRecentTransactions: !0,
            children: s,
          }),
        }),
      });
    return l
      ? e.jsx(n.WagmiProvider, {
          config: y,
          reconnectOnMount: !0,
          initialState: u,
          children: e.jsx(r.QueryClientProvider, {
            client: d,
            children: e.jsx(a.RainbowKitProvider, {
              theme: h,
              modalSize: "compact",
              showRecentTransactions: !0,
              children: e.jsx(f, { ...p, children: s }),
            }),
          }),
        })
      : g;
  }),
  (exports.useAuth = function () {
    const e = t.useContext(h);
    if (!e) throw new Error("useAuth must be used within AuthProvider");
    return e;
  }),
  (exports.useCourseContract = function ({
    address: e = "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d",
    tokenDecimals: t = 18,
  }) {
    const n = T(e, v),
      a = (e) => i.parseUnits(e, t),
      r = n.write("createCourse"),
      s = n.write("purchaseCourse"),
      o = n.write("updateCoursePrice"),
      c = n.write("updateProgress"),
      d = n.write("requestRefund"),
      u = n.write("certifyInstructor"),
      l = n.write("revokeInstructor"),
      p = n.write("batchCertifyInstructors"),
      m = n.write("updatePlatformAddress"),
      y = n.write("updateCourse"),
      h = n.write("publishCourse"),
      f = n.write("unpublishCourse"),
      b = n.write("deleteCourse");
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
      createCourse: async (e, t, n, s) => await r.send(e, t, a(n), s),
      purchaseCourse: async (e) => await s.send(e),
      updateCoursePrice: async (e, t) => await o.send(e, a(t)),
      updateCourseProgress: async (e, t) => await c.send(e, t),
      requestRefund: async (e) => await d.send(e),
      certifyInstructor: async (e) => await u.send(e),
      revokeInstructor: async (e) => await l.send(e),
      batchCertifyInstructors: async (e) => await p.send(e),
      updatePlatformAddress: async (e) => await m.send(e),
      updateCourse: async (e, t, n) => await y.send(e, t, n),
      publishCourse: async (e) => await h.send(e),
      unpublishCourse: async (e) => await f.send(e),
      deleteCourse: async (e) => await b.send(e),
      createCourseReceipt: r.receipt,
      purchaseCourseReceipt: s.receipt,
      updateCoursePriceReceipt: o.receipt,
      updateCourseProgressReceipt: c.receipt,
      requestRefundReceipt: d.receipt,
      certifyInstructorReceipt: u.receipt,
      revokeInstructorReceipt: l.receipt,
      batchCertifyInstructorsReceipt: p.receipt,
      updatePlatformAddressReceipt: m.receipt,
      updateCourseReceipt: y.receipt,
      publishCourseReceipt: h.receipt,
      unpublishCourseReceipt: f.receipt,
      deleteCourseReceipt: b.receipt,
    };
  }),
  (exports.useERC20 = function ({
    address: e,
    spenderAddress: t,
    enabled: a = !0,
  }) {
    const { address: r } = n.useAccount(),
      s = (e) => {
        if (!u) throw new Error("Decimals not loaded");
        return i.parseUnits(e, u);
      },
      { data: o } = g({
        address: e,
        abi: x,
        functionName: "totalSupply",
        enabled: a,
      }),
      { data: c, refetch: d } = g({
        address: e,
        abi: x,
        functionName: "balanceOf",
        args: r ? [r] : void 0,
        enabled: a && !!r,
      }),
      { data: u } = g({
        address: e,
        abi: x,
        functionName: "decimals",
        enabled: a,
      }),
      { data: l, refetch: p } = g({
        address: e,
        abi: x,
        functionName: "allowance",
        args: r && t ? [r, t] : void 0,
        enabled: a && !!r && !!t,
      }),
      m = w({ address: e, abi: x, functionName: "transfer" }),
      y = w({ address: e, abi: x, functionName: "approve" }),
      h = w({ address: e, abi: x, functionName: "transferFrom" });
    return {
      totalSupply: o,
      balance: c,
      allowance: l,
      transferReceipt: m.receipt,
      approveReceipt: y.receipt,
      transferFromReceipt: h.receipt,
      refetchBalance: d,
      refetchAllowance: p,
      transfer: async (e, t) => {
        if (!m.writeAsync) throw new Error("Transfer not available");
        const n = s(t);
        return m.writeAsync({ args: [e, n] });
      },
      approve: async (e, t) => {
        if (!y.writeAsync) throw new Error("Approve not available");
        const n = s(t);
        return y.writeAsync({ args: [e, n] });
      },
      transferFrom: async (e, t, n) => {
        if (!h.writeAsync) throw new Error("TransferFrom not available");
        const a = s(n);
        return h.writeAsync({ args: [e, t, a] });
      },
    };
  }),
  (exports.useNetworkSwitch = function () {
    const e = n.useChains(),
      t = n.useChainId(),
      a = e.find((e) => e.id === t),
      {
        switchChain: r,
        isPending: s,
        error: i,
        isSuccess: o,
        reset: c,
      } = n.useSwitchChain();
    return {
      currentChain: a,
      switchToNetwork: (e) => {
        if (!r) throw new Error("❌Network switching not supported");
        try {
          r({ chainId: e.chainId });
        } catch (e) {
          throw e;
        }
      },
      isPending: s,
      error: i,
      isSuccess: o,
      reset: c,
      isCurrentChain: (e) => t === e,
      canSwitchNetwork: !!r,
    };
  }),
  (exports.useSimpleYDToken = function ({
    address: e = k,
    spenderAddress: a,
    enabled: r = !0,
  }) {
    const { address: s } = n.useAccount(),
      [o, c] = t.useState(),
      [d, u] = t.useState(),
      { data: l, refetch: p } = n.useEstimateGas({
        account: s,
        to: o,
        value: d,
        query: { enabled: !1 },
      }),
      m = (e) => {
        if (!w) throw new Error("Decimals not loaded");
        return i.parseUnits(e, w);
      },
      y = async (e, t) => {
        c(e),
          u(t),
          await new Promise((e) => setTimeout(e, 0)),
          await p(),
          c(void 0),
          u(void 0);
      },
      h = T(e, C),
      { data: f } = h.read("totalSupply")(),
      { data: b, refetch: g } = h.read("balanceOf", r && !!s)(),
      { data: w } = h.read("decimals")(),
      { data: x, refetch: v } = h.read("allowance")(s, a),
      j = h.write("transfer"),
      N = h.write("approve"),
      I = h.write("transferFrom"),
      S = h.write("exchangeETHForTokens"),
      E = h.write("stake"),
      _ = h.write("unstake"),
      R = h.write("claimReward");
    return {
      totalSupply: f,
      balance: b,
      allowance: x,
      transferReceipt: j.receipt,
      approveReceipt: N.receipt,
      transferFromReceipt: I.receipt,
      exchangeETHForTokensReceipt: S.receipt,
      stakeReceipt: E.receipt,
      unstakeReceipt: _.receipt,
      claimRewardReceipt: R.receipt,
      refetchBalance: g,
      refetchAllowance: v,
      getStakeInfo: (e) => h.read("getStakeInfo")(e),
      calculatePendingReward: (e) => h.read("calculatePendingReward")(e),
      canUnstake: (e) => h.read("canUnstake")(e),
      transfer: async (e, t) => {
        const n = m(t);
        return await y(e, n), j.send(e, n, { gas: l });
      },
      approve: async (e, t) => {
        const n = m(t);
        return await y(k, void 0), N.send(e, n, { gas: l });
      },
      transferFrom: async (e, t, n) => {
        const a = m(n);
        return await y(t, a), I.send(e, t, a);
      },
      exchangeETHForTokens: async (e) => (
        await y(k, i.parseEther(e)), S.send({ value: i.parseEther(e), gas: l })
      ),
      stake: async (e, t) => E.send(e, t),
      unstake: async (e) => _.send(e),
      claimReward: async () => R.send(),
    };
  }),
  (exports.useWalletAuth = p),
  (exports.useWalletConnection = d),
  (exports.useWalletInfo = function () {
    const { address: e, connector: t, isConnected: a } = n.useAccount(),
      r = n.useChainId(),
      s = n.useChains().find((e) => e.id === r),
      { data: o } = n.useEnsName({ address: e }),
      { data: c, isLoading: d } = n.useBalance({ address: e }),
      u = c
        ? {
            value: c.value,
            formatted: i.formatEther(c.value),
            symbol: c.symbol,
            decimals: c.decimals,
          }
        : void 0;
    return {
      address: e,
      isConnected: a,
      ensName: o,
      chainId: r,
      connector: t
        ? { id: t.id, name: t.name, type: t.type, icon: t.icon }
        : void 0,
      chain: s,
      balance: u,
      isBalanceLoading: d,
    };
  }),
  (exports.useWalletSign = u);
