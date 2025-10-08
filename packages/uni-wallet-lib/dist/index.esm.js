import { jsx as e, jsxs as t } from "react/jsx-runtime";
import n, { useState as a, useRef as i, useEffect as r } from "react";
import {
  http as s,
  createStorage as o,
  cookieStorage as u,
  WagmiProvider as d,
  useAccount as p,
  useChainId as c,
  useChains as l,
  useConnect as y,
  useReconnect as m,
  useDisconnect as f,
  useEnsName as b,
  useBalance as g,
  useSwitchChain as w,
  useReadContract as h,
  useWriteContract as v,
  useWaitForTransactionReceipt as T,
  useEstimateGas as x,
} from "wagmi";
import {
  getDefaultConfig as _,
  lightTheme as C,
  darkTheme as k,
  RainbowKitProvider as N,
  ConnectButton as A,
} from "@rainbow-me/rainbowkit";
import {
  QueryClient as M,
  QueryClientProvider as B,
} from "@tanstack/react-query";
import { sepolia as S, mainnet as E } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { formatEther as I, parseUnits as F, parseEther as R } from "viem";
const L = [E, S];
E.id, S.id, C(), C().colors, C().radii;
const j = {
    ...k(),
    colors: {
      ...k().colors,
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
      ...k().radii,
      actionButton: "8px",
      connectButton: "8px",
      menuButton: "8px",
      modal: "16px",
      modalMobile: "16px",
    },
  },
  O = new M({
    defaultOptions: { queries: { refetchOnWindowFocus: !1, retry: !1 } },
  });
function P({
  children: t,
  theme: a = "auto",
  queryClient: i = O,
  initialState: r,
  ...p
}) {
  const { config: c } = n.useMemo(
      () =>
        (function (e) {
          const {
              appName: t = "APP_NAME",
              projectId: n = "YOUR_PROJECT_ID",
              alchemyApiKey: a,
              infuraApiKey: i,
            } = e,
            r = L.reduce((e, t) => {
              let n = "";
              return (
                a &&
                  (n = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.g.alchemy.com/v2/${a}`),
                i &&
                  (n = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.infura.io/v3/${i}`),
                (e[t.id] = n ? s(n) : s()),
                e
              );
            }, {});
          return {
            config: _({
              appName: t,
              projectId: n,
              chains: L,
              ssr: !0,
              storage: o({ storage: u }),
            }),
            transports: r,
          };
        })(p),
      [p.appName, p.projectId, p.alchemyApiKey, p.infuraApiKey],
    ),
    l = n.useMemo(() => j, [a]);
  return e(d, {
    config: c,
    reconnectOnMount: !0,
    initialState: r,
    children: e(B, {
      client: i,
      children: e(N, {
        theme: l,
        modalSize: "compact",
        showRecentTransactions: !0,
        children: t,
      }),
    }),
  });
}
function z() {
  const {
      address: e,
      connector: t,
      isConnected: n,
      isConnecting: a,
      isReconnecting: i,
    } = p(),
    r = c(),
    s = l(),
    { connect: o, connectors: u } = y(),
    { reconnect: d } = m(),
    { disconnect: b } = f(),
    g = s.find((e) => e.id === r);
  return {
    isConnected: n,
    isConnecting: a,
    isReconnecting: i,
    address: e,
    connector: t ? { id: t.id, name: t.name, type: t.type } : void 0,
    chain: g,
    chains: s,
    connect: (e) => {
      if (e) {
        const t = u.find((t) => t.id === e);
        t && o({ connector: t });
      } else {
        const e = u[0];
        e && o({ connector: e });
      }
    },
    reconnect: (e) => {
      d(e);
    },
    disconnect: () => {
      b();
    },
  };
}
function D() {
  const { address: e, connector: t, isConnected: n } = p(),
    a = c(),
    i = l().find((e) => e.id === a),
    { data: r } = b({ address: e }),
    { data: s, isLoading: o } = g({ address: e }),
    u = s
      ? {
          value: s.value,
          formatted: I(s.value),
          symbol: s.symbol,
          decimals: s.decimals,
        }
      : void 0;
  return {
    address: e,
    isConnected: n,
    ensName: r,
    chainId: a,
    connector: t
      ? { id: t.id, name: t.name, type: t.type, icon: t.icon }
      : void 0,
    chain: i,
    balance: u,
    isBalanceLoading: o,
  };
}
function H() {
  const e = l(),
    t = c(),
    n = e.find((e) => e.id === t),
    { switchChain: a, isPending: i, error: r, isSuccess: s, reset: o } = w();
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
    isPending: i,
    error: r,
    isSuccess: s,
    reset: o,
    isCurrentChain: (e) => t === e,
    canSwitchNetwork: !!a,
  };
}
function q({
  address: e,
  abi: t,
  functionName: n,
  args: a,
  chainId: i,
  enabled: r = !0,
  cacheTime: s = 0,
  staleTime: o = 0,
}) {
  const { data: u, ...d } = h({
    address: e,
    abi: t,
    functionName: n,
    args: a,
    chainId: i,
    query: { enabled: r, gcTime: s, staleTime: o },
  });
  return { data: u, ...d };
}
function $({
  address: e,
  abi: t,
  functionName: n,
  args: a,
  value: i,
  chainId: r,
  enabled: s = !0,
  gasLimit: o,
}) {
  const { writeContract: u, writeContractAsync: d, ...p } = v();
  return {
    write: (d) => {
      s &&
        u({
          address: e,
          abi: t,
          functionName: n,
          args: d?.args || a,
          value: d?.value || i,
          chainId: r,
          gas: d?.gas || o,
        });
    },
    writeAsync: async (u) => {
      if (s)
        return await d({
          address: e,
          abi: t,
          functionName: n,
          args: u?.args || a,
          value: u?.value || i,
          chainId: r,
          gas: u?.gas || o,
        });
    },
    receipt: T({ hash: p.data, query: { enabled: !!p.data } }),
    ...p,
  };
}
const U = [
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
  K = [
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
  W = [
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
function Y({ address: e, spenderAddress: t, enabled: n = !0 }) {
  const { address: a } = p(),
    i = (e) => {
      if (!u) throw new Error("Decimals not loaded");
      return F(e, u);
    },
    { data: r } = q({
      address: e,
      abi: U,
      functionName: "totalSupply",
      enabled: n,
    }),
    { data: s, refetch: o } = q({
      address: e,
      abi: U,
      functionName: "balanceOf",
      args: a ? [a] : void 0,
      enabled: n && !!a,
    }),
    { data: u } = q({
      address: e,
      abi: U,
      functionName: "decimals",
      enabled: n,
    }),
    { data: d, refetch: c } = q({
      address: e,
      abi: U,
      functionName: "allowance",
      args: a && t ? [a, t] : void 0,
      enabled: n && !!a && !!t,
    }),
    l = $({ address: e, abi: U, functionName: "transfer" }),
    y = $({ address: e, abi: U, functionName: "approve" }),
    m = $({ address: e, abi: U, functionName: "transferFrom" });
  return {
    totalSupply: r,
    balance: s,
    allowance: d,
    transferReceipt: l.receipt,
    approveReceipt: y.receipt,
    transferFromReceipt: m.receipt,
    refetchBalance: o,
    refetchAllowance: c,
    transfer: async (e, t) => {
      if (!l.writeAsync) throw new Error("Transfer not available");
      const n = i(t);
      return l.writeAsync({ args: [e, n] });
    },
    approve: async (e, t) => {
      if (!y.writeAsync) throw new Error("Approve not available");
      const n = i(t);
      return y.writeAsync({ args: [e, n] });
    },
    transferFrom: async (e, t, n) => {
      if (!m.writeAsync) throw new Error("TransferFrom not available");
      const a = i(n);
      return m.writeAsync({ args: [e, t, a] });
    },
  };
}
const V = "0xA812265c869F2BCB755980677812F253459A0cc7";
function G({ address: e = V, spenderAddress: t, enabled: n = !0 }) {
  const { address: i } = p(),
    [r, s] = a(),
    [o, u] = a(),
    { data: d, refetch: c } = x({
      account: i,
      to: r,
      value: o,
      query: { enabled: !1 },
    }),
    l = (e) => {
      if (!g) throw new Error("Decimals not loaded");
      return F(e, g);
    },
    y = async (e, t) => {
      s(e),
        u(t),
        await new Promise((e) => setTimeout(e, 0)),
        await c(),
        s(void 0),
        u(void 0);
    },
    { data: m } = q({
      address: e,
      abi: W,
      functionName: "totalSupply",
      enabled: n,
    }),
    { data: f, refetch: b } = q({
      address: e,
      abi: W,
      functionName: "balanceOf",
      args: i ? [i] : void 0,
      enabled: n && !!i,
    }),
    { data: g } = q({
      address: e,
      abi: W,
      functionName: "decimals",
      enabled: n,
    }),
    { data: w, refetch: h } = q({
      address: e,
      abi: W,
      functionName: "allowance",
      args: i && t ? [i, t] : void 0,
      enabled: n && !!i && !!t,
    }),
    v = $({ address: e, abi: W, functionName: "transfer" }),
    T = $({ address: e, abi: W, functionName: "approve" }),
    _ = $({ address: e, abi: W, functionName: "transferFrom" }),
    C = $({ address: e, abi: W, functionName: "exchangeETHForTokens" });
  return {
    totalSupply: m,
    balance: f,
    allowance: w,
    transferReceipt: v.receipt,
    approveReceipt: T.receipt,
    transferFromReceipt: _.receipt,
    refetchBalance: b,
    refetchAllowance: h,
    transfer: async (e, t) => {
      if (!v.writeAsync) throw new Error("Transfer not available");
      const n = l(t);
      return await y(e, n), v.writeAsync({ args: [e, n] });
    },
    approve: async (e, t) => {
      if (!T.writeAsync) throw new Error("Approve not available");
      const n = l(t);
      return await y(V, void 0), T.writeAsync({ args: [e, n] });
    },
    transferFrom: async (e, t, n) => {
      if (!_.writeAsync) throw new Error("TransferFrom not available");
      const a = l(n);
      return await y(t, a), _.writeAsync({ args: [e, t, a] });
    },
    exchangeETHForTokens: async (e) => {
      if (!C.writeAsync) throw new Error("Exchange not available");
      return await y(V, R(e)), C.writeAsync({ value: R(e), gas: d });
    },
  };
}
function J({
  address: e = "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d",
  tokenDecimals: t = 18,
}) {
  const n = $({ address: e, abi: K, functionName: "createCourse" }),
    a = $({ address: e, abi: K, functionName: "purchaseCourse" });
  return {
    createCourseReceipt: n.receipt,
    purchaseCourseReceipt: a.receipt,
    hasAccess: (t, n) => {
      const a = Boolean(t && n);
      return q({
        address: e,
        abi: K,
        functionName: "hasAccess",
        args: a ? [t, n] : void 0,
        enabled: a,
      });
    },
    getCourse: (t) =>
      q({
        address: e,
        abi: K,
        functionName: "getCourse",
        args: t ? [t] : void 0,
        enabled: !0,
      }),
    getStudentCourses: (t) =>
      q({
        address: e,
        abi: K,
        functionName: "getStudentCourses",
        args: t ? [t] : void 0,
        enabled: !0,
      }),
    getCourseStudents: (t) =>
      q({
        address: e,
        abi: K,
        functionName: "getCourseStudents",
        args: t ? [t] : void 0,
        enabled: !0,
      }),
    getInstructorCourses: (t) =>
      q({
        address: e,
        abi: K,
        functionName: "getInstructorCourses",
        args: t ? [t] : void 0,
        enabled: !0,
      }),
    getTotalCourses: () =>
      q({ address: e, abi: K, functionName: "getTotalCourses", enabled: !0 }),
    getCourseStudentCount: (t) =>
      q({
        address: e,
        abi: K,
        functionName: "getCourseStudentCount",
        args: [t],
        enabled: !0,
      }),
    batchCheckAccess: (t, n) =>
      q({
        address: e,
        abi: K,
        functionName: "batchCheckAccess",
        args: [t, n],
        enabled: !0,
      }),
    createCourse: async (e, a, i) => {
      if (!n.writeAsync) throw new Error("创建课程方法未创建");
      const r = ((e) => F(e, t))(i);
      return n.writeAsync({ args: [e, a, r] });
    },
    purchaseCourse: async (e) => {
      if (!a.writeAsync) throw new Error("创建课程方法未创建");
      return a.writeAsync({ args: [e] });
    },
  };
}
function X(e, t) {
  void 0 === t && (t = {});
  var n = t.insertAt;
  if (e && "undefined" != typeof document) {
    var a = document.head || document.getElementsByTagName("head")[0],
      i = document.createElement("style");
    (i.type = "text/css"),
      "top" === n && a.firstChild
        ? a.insertBefore(i, a.firstChild)
        : a.appendChild(i),
      i.styleSheet
        ? (i.styleSheet.cssText = e)
        : i.appendChild(document.createTextNode(e));
  }
}
X(
  ".profile__menu-wrapper{position:relative}.profile__menu-trigger{align-items:center;background-color:rgba(22,163,74,.1);border:1px solid rgba(34,197,94,.3);border-radius:.5rem;cursor:pointer;display:flex;height:40px;justify-content:center;transition:all .2s ease;width:40px}.profile__avatar{background-color:oklch(.546 .245 262.881);border-radius:50%;color:#fff}.profile__menu-trigger:hover{background-color:oklch(.65 .2 265.15)}.profile__dropdown-menu{animation:slideDown .2s ease;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.1);min-width:180px;padding:8px;position:absolute;right:0;top:calc(100% + 8px);z-index:1000}@keyframes slideDown{0%{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}.profile__menu-item{align-items:center;background:transparent;border:none;border-radius:8px;color:#1e293b;cursor:pointer;display:flex;font-size:14px;font-weight:500;gap:12px;padding:10px 12px;text-align:left;transition:all .2s ease;width:100%}.profile__menu-item:hover{background-color:#f1f5f9}.profile__menu-item svg{flex-shrink:0}.profile__menu-item--danger{color:#ef4444}.profile__menu-item--danger:hover{background-color:#fef2f2}",
);
const Q = ({ openAccountModal: n }) => {
  const [s, o] = a(!1),
    u = i(null),
    { disconnect: d } = z();
  r(() => {
    const e = (e) => {
      u.current && !u.current.contains(e.target) && o(!1);
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
    ref: u,
    children: [
      e("button", {
        onClick: () => o(!s),
        type: "button",
        className: "profile__menu-trigger profile__avatar",
        "aria-label": "Account menu",
        children: t("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "16",
          height: "16",
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
      s &&
        t("div", {
          className: "profile__dropdown-menu",
          children: [
            t("button", {
              onClick: () => {
                o(!1), n();
              },
              className: "profile__menu-item",
              children: [
                t("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    e("path", {
                      d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
                    }),
                    e("circle", { cx: "12", cy: "7", r: "4" }),
                  ],
                }),
                e("span", { children: "Profile" }),
              ],
            }),
            t("button", {
              onClick: () => {
                o(!1), d();
              },
              className: "profile__menu-item profile__menu-item--danger",
              children: [
                t("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    e("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
                    e("polyline", { points: "16 17 21 12 16 7" }),
                    e("line", { x1: "21", y1: "12", x2: "9", y2: "12" }),
                  ],
                }),
                e("span", { children: "Logout" }),
              ],
            }),
          ],
        }),
    ],
  });
};
X(
  ".wallet-button{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.wallet-button__container{align-items:center;display:flex;gap:8px;height:44px;justify-content:center}.wallet-button__connect{background:linear-gradient(90deg,#eab308,#f97316);border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__connect:hover{box-shadow:0 4px 12px rgba(102,126,234,.4);transform:translateY(-1px)}.wallet-button__wrong-network{background:#ff6b6b;border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__wrong-network:hover{background:#ff5252}.wallet-button__connected{align-items:center;display:flex;gap:16px}.wallet-button__chain{align-items:center;background:oklch(.424 .199 265.638);border:1px solid #e2e8f0;border-radius:10px;color:#475569;display:flex;font-size:13px;font-weight:500;gap:1em;padding:8px 12px;transition:all .2s ease}.wallet-button__chain-icon{align-items:center;border-radius:.5rem;display:flex;gap:.5rem}.wallet-button__icon{align-items:center;background:linear-gradient(90deg,#facc15,#f97316);border-radius:50%;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.wallet-button__balance{color:#fff;font-size:1rem;font-weight:600}.wallet-button__account{align-items:center;background-color:rgba(22,163,74,.2);border:1px solid rgba(34,197,94,.3);border-radius:.5rem;display:flex;gap:.5rem;height:40px;justify-content:space-evenly;min-width:150px;padding:0 12px}.wallet-button__status-bot{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;background-color:#4ade80;border-radius:9999px;height:.5rem;width:.5rem}.wallet-icon{color:#4ade80;height:1rem;width:1rem}.wallet-button__address{color:#4ade80;font-size:.875rem;font-weight:600}",
);
const Z = ({
  label: n = "连接钱包",
  showBalance: a = !0,
  showChainName: i = !0,
  className: r = "",
  size: s = "medium",
}) =>
  e("div", {
    className: `wallet-button wallet-button--${s} ${r}`,
    children: e(A.Custom, {
      children: ({
        account: r,
        chain: s,
        openAccountModal: o,
        openConnectModal: u,
        authenticationStatus: d,
        mounted: p,
      }) =>
        e("div", {
          className: "wallet-button__container",
          children:
            p && "loading" !== d && r && s && (!d || "authenticated" === d)
              ? t("div", {
                  className: "wallet-button__connected",
                  children: [
                    i &&
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
                            r.displayBalance &&
                            e("span", {
                              className: "wallet-button__balance",
                              children: r.displayBalance,
                            }),
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
                          "stroke-width": "2",
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
                          children: r.displayName,
                        }),
                      ],
                    }),
                    e(Q, { openAccountModal: o }),
                  ],
                })
              : e("button", {
                  onClick: u,
                  type: "button",
                  className: "wallet-button__connect",
                  children: n,
                }),
        }),
    }),
  });
export {
  Z as WalletButton,
  P as WalletProvider,
  J as useCourseContract,
  Y as useERC20,
  H as useNetworkSwitch,
  G as useSimpleYDToken,
  z as useWalletConnection,
  D as useWalletInfo,
};
//# sourceMappingURL=index.esm.js.map
