import { jsx as e, jsxs as t } from "react/jsx-runtime";
import n, { useState as a, useRef as i, useEffect as r } from "react";
import {
  http as o,
  createStorage as s,
  cookieStorage as d,
  WagmiProvider as c,
  useAccount as u,
  useChainId as l,
  useChains as p,
  useConnect as m,
  useReconnect as y,
  useDisconnect as f,
  useEnsName as b,
  useBalance as h,
  useSwitchChain as g,
  useReadContract as w,
  useWriteContract as v,
  useWaitForTransactionReceipt as x,
  useEstimateGas as T,
} from "wagmi";
import {
  getDefaultConfig as C,
  lightTheme as N,
  darkTheme as _,
  RainbowKitProvider as k,
  ConnectButton as M,
} from "@rainbow-me/rainbowkit";
import {
  QueryClient as A,
  QueryClientProvider as B,
} from "@tanstack/react-query";
import { sepolia as S, mainnet as I } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { formatEther as E, parseUnits as F, parseEther as z } from "viem";
const R = [I, S];
I.id, S.id, N(), N().colors, N().radii;
const j = {
    ..._(),
    colors: {
      ..._().colors,
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
      ..._().radii,
      actionButton: "8px",
      connectButton: "8px",
      menuButton: "8px",
      modal: "16px",
      modalMobile: "16px",
    },
  },
  O = new A({
    defaultOptions: { queries: { refetchOnWindowFocus: !1, retry: !1 } },
  });
function P({
  children: t,
  theme: a = "auto",
  queryClient: i = O,
  initialState: r,
  ...u
}) {
  const { config: l } = n.useMemo(
      () =>
        (function (e) {
          const {
              appName: t = "APP_NAME",
              projectId: n = "YOUR_PROJECT_ID",
              alchemyApiKey: a,
              infuraApiKey: i,
            } = e,
            r = R.reduce((e, t) => {
              let n = "";
              return (
                a &&
                  (n = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.g.alchemy.com/v2/${a}`),
                i &&
                  (n = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.infura.io/v3/${i}`),
                (e[t.id] = n ? o(n) : o()),
                e
              );
            }, {});
          return {
            config: C({
              appName: t,
              projectId: n,
              chains: R,
              ssr: !0,
              storage: s({ storage: d }),
            }),
            transports: r,
          };
        })(u),
      [u.appName, u.projectId, u.alchemyApiKey, u.infuraApiKey],
    ),
    p = n.useMemo(() => j, [a]);
  return e(c, {
    config: l,
    reconnectOnMount: !0,
    initialState: r,
    children: e(B, {
      client: i,
      children: e(k, {
        theme: p,
        modalSize: "compact",
        showRecentTransactions: !0,
        children: t,
      }),
    }),
  });
}
function D() {
  const {
      address: e,
      connector: t,
      isConnected: n,
      isConnecting: a,
      isReconnecting: i,
    } = u(),
    r = l(),
    o = p(),
    { connect: s, connectors: d } = m(),
    { reconnect: c } = y(),
    { disconnect: b } = f(),
    h = o.find((e) => e.id === r);
  return {
    isConnected: n,
    isConnecting: a,
    isReconnecting: i,
    address: e,
    connector: t ? { id: t.id, name: t.name, type: t.type } : void 0,
    chain: h,
    chains: o,
    connect: (e) => {
      if (e) {
        const t = d.find((t) => t.id === e);
        t && s({ connector: t });
      } else {
        const e = d[0];
        e && s({ connector: e });
      }
    },
    reconnect: (e) => {
      c(e);
    },
    disconnect: () => {
      b();
    },
  };
}
function H() {
  const { address: e, connector: t, isConnected: n } = u(),
    a = l(),
    i = p().find((e) => e.id === a),
    { data: r } = b({ address: e }),
    { data: o, isLoading: s } = h({ address: e }),
    d = o
      ? {
          value: o.value,
          formatted: E(o.value),
          symbol: o.symbol,
          decimals: o.decimals,
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
    balance: d,
    isBalanceLoading: s,
  };
}
function L() {
  const e = p(),
    t = l(),
    n = e.find((e) => e.id === t),
    { switchChain: a, isPending: i, error: r, isSuccess: o, reset: s } = g();
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
    isSuccess: o,
    reset: s,
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
  cacheTime: o = 0,
  staleTime: s = 0,
}) {
  const { data: d, ...c } = w({
    address: e,
    abi: t,
    functionName: n,
    args: a,
    chainId: i,
    query: { enabled: r, gcTime: o, staleTime: s },
  });
  return { data: d, ...c };
}
function $({
  address: e,
  abi: t,
  functionName: n,
  args: a,
  value: i,
  chainId: r,
  enabled: o = !0,
  gasLimit: s,
}) {
  const { writeContract: d, writeContractAsync: c, ...u } = v();
  return {
    write: (c) => {
      o &&
        d({
          address: e,
          abi: t,
          functionName: n,
          args: c?.args || a,
          value: c?.value || i,
          chainId: r,
          gas: c?.gas || s,
        });
    },
    writeAsync: async (d) => {
      if (o)
        return await c({
          address: e,
          abi: t,
          functionName: n,
          args: d?.args || a,
          value: d?.value || i,
          chainId: r,
          gas: d?.gas || s,
        });
    },
    receipt: x({ hash: u.data, query: { enabled: !!u.data } }),
    ...u,
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
  Y = [
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
function V({ address: e, spenderAddress: t, enabled: n = !0 }) {
  const { address: a } = u(),
    i = (e) => {
      if (!d) throw new Error("Decimals not loaded");
      return F(e, d);
    },
    { data: r } = q({
      address: e,
      abi: U,
      functionName: "totalSupply",
      enabled: n,
    }),
    { data: o, refetch: s } = q({
      address: e,
      abi: U,
      functionName: "balanceOf",
      args: a ? [a] : void 0,
      enabled: n && !!a,
    }),
    { data: d } = q({
      address: e,
      abi: U,
      functionName: "decimals",
      enabled: n,
    }),
    { data: c, refetch: l } = q({
      address: e,
      abi: U,
      functionName: "allowance",
      args: a && t ? [a, t] : void 0,
      enabled: n && !!a && !!t,
    }),
    p = $({ address: e, abi: U, functionName: "transfer" }),
    m = $({ address: e, abi: U, functionName: "approve" }),
    y = $({ address: e, abi: U, functionName: "transferFrom" });
  return {
    totalSupply: r,
    balance: o,
    allowance: c,
    transferReceipt: p.receipt,
    approveReceipt: m.receipt,
    transferFromReceipt: y.receipt,
    refetchBalance: s,
    refetchAllowance: l,
    transfer: async (e, t) => {
      if (!p.writeAsync) throw new Error("Transfer not available");
      const n = i(t);
      return p.writeAsync({ args: [e, n] });
    },
    approve: async (e, t) => {
      if (!m.writeAsync) throw new Error("Approve not available");
      const n = i(t);
      return m.writeAsync({ args: [e, n] });
    },
    transferFrom: async (e, t, n) => {
      if (!y.writeAsync) throw new Error("TransferFrom not available");
      const a = i(n);
      return y.writeAsync({ args: [e, t, a] });
    },
  };
}
const W = "0xA812265c869F2BCB755980677812F253459A0cc7";
function G({ address: e = W, spenderAddress: t, enabled: n = !0 }) {
  const { address: i } = u(),
    [r, o] = a(),
    [s, d] = a(),
    { data: c, refetch: l } = T({
      account: i,
      to: r,
      value: s,
      query: { enabled: !1 },
    }),
    p = (e) => {
      if (!h) throw new Error("Decimals not loaded");
      return F(e, h);
    },
    m = async (e, t) => {
      o(e),
        d(t),
        await new Promise((e) => setTimeout(e, 0)),
        await l(),
        o(void 0),
        d(void 0);
    },
    { data: y } = q({
      address: e,
      abi: Y,
      functionName: "totalSupply",
      enabled: n,
    }),
    { data: f, refetch: b } = q({
      address: e,
      abi: Y,
      functionName: "balanceOf",
      args: i ? [i] : void 0,
      enabled: n && !!i,
    }),
    { data: h } = q({
      address: e,
      abi: Y,
      functionName: "decimals",
      enabled: n,
    }),
    { data: g, refetch: w } = q({
      address: e,
      abi: Y,
      functionName: "allowance",
      args: i && t ? [i, t] : void 0,
      enabled: n && !!i && !!t,
    }),
    v = $({ address: e, abi: Y, functionName: "transfer" }),
    x = $({ address: e, abi: Y, functionName: "approve" }),
    C = $({ address: e, abi: Y, functionName: "transferFrom" }),
    N = $({ address: e, abi: Y, functionName: "exchangeETHForTokens" });
  return {
    totalSupply: y,
    balance: f,
    allowance: g,
    transferReceipt: v.receipt,
    approveReceipt: x.receipt,
    transferFromReceipt: C.receipt,
    refetchBalance: b,
    refetchAllowance: w,
    transfer: async (e, t) => {
      if (!v.writeAsync) throw new Error("Transfer not available");
      const n = p(t);
      return await m(e, n), v.writeAsync({ args: [e, n] });
    },
    approve: async (e, t) => {
      if (!x.writeAsync) throw new Error("Approve not available");
      const n = p(t);
      return await m(W, void 0), x.writeAsync({ args: [e, n] });
    },
    transferFrom: async (e, t, n) => {
      if (!C.writeAsync) throw new Error("TransferFrom not available");
      const a = p(n);
      return await m(t, a), C.writeAsync({ args: [e, t, a] });
    },
    exchangeETHForTokens: async (e) => {
      if (!N.writeAsync) throw new Error("Exchange not available");
      return await m(W, z(e)), N.writeAsync({ value: z(e), gas: c });
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
  ".profile__menu-wrapper{position:relative}.profile__menu-trigger{align-items:center;background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#6a6d94;cursor:pointer;display:flex;height:2.5rem;justify-content:center;transition:transform .2s;width:2.5rem}.profile__menu-trigger:hover{transform:translateY(-1px)}.profile__avatar{border-radius:50%}.wallet-dropdown{background-color:#fff;border:1px solid #ecebff;border-radius:1rem;box-shadow:0 24px 60px rgba(154,161,255,.18);color:#2b2558;font-size:.875rem;line-height:1.25rem;padding:1rem;position:absolute;right:0;top:2.8rem;width:18rem}.wallet-header{align-items:flex-start;display:flex;justify-content:space-between}.wallet-label{color:#8b8eb5;font-size:.75rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.wallet-value{font-weight:600;margin-top:.25rem}.wallet-chain-id{background-color:#f4f4ff;border-radius:9999px;color:#5f6094;font-size:.75rem;font-weight:500;line-height:1rem;padding:.25rem .75rem}.wallet-section{margin-top:1rem}.wallet-address-box{align-items:center;background-color:#f8f8ff;border-radius:.75rem;display:flex;justify-content:space-between;margin-top:.25rem;padding:.5rem .75rem}.wallet-address-text{color:#2b2558;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.875rem;line-height:1.25rem}.copy-button{background:transparent;border:none;border-radius:9999px;color:#6a6d94;cursor:pointer;padding:.25rem;transition:background-color .2s}.copy-button:hover{background-color:#fff}.balance-info-box{background-color:#f9f9ff;border-radius:.75rem;margin-top:1rem;padding:.75rem}.balance-info-label{align-items:center;color:#8b8eb5;display:flex;font-size:.75rem;gap:.5rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.balance-info-amount{font-size:1.125rem;font-weight:600;line-height:1.75rem;margin-top:.5rem}.disconnect-button{align-items:center;background-color:#f3f4f6;border:none;border-radius:.5rem;color:#374151;cursor:pointer;display:flex;font-weight:500;gap:.5rem;justify-content:center;margin-top:1rem;padding:.5rem 1rem;transition:background-color .2s;width:100%}.disconnect-button:hover:not(:disabled){background-color:#e5e7eb}.disconnect-button:disabled{cursor:not-allowed;opacity:.5}.disconnect-button.loading{opacity:.7}",
);
const Q = ({ account: n, chain: o, openAccountModal: s }) => {
  const [d, c] = a(!1),
    u = i(null),
    { disconnect: l } = D();
  r(() => {
    const e = (e) => {
      u.current && !u.current.contains(e.target) && c(!1);
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
        onClick: () => c(!d),
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
      d &&
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
                    e("div", { className: "wallet-value", children: o.name }),
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
                        "stroke-width": "2",
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
                      "stroke-width": "2",
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
                c(!1), l();
              },
              children: [
                t("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
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
X(
  ".wallet-button{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.wallet-button__container{align-items:center;display:flex;gap:8px;height:44px;justify-content:center}.wallet-button__connect{background:linear-gradient(90deg,#eab308,#f97316);border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__connect:hover{box-shadow:0 4px 12px rgba(102,126,234,.4);transform:translateY(-1px)}.wallet-button__wrong-network{background:#ff6b6b;border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__wrong-network:hover{background:#ff5252}.wallet-button__connected{align-items:center;display:flex;gap:16px}.wallet-button__chain{align-items:center;background:linear-gradient(90deg,#ffe7c5,#ffead4);border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-shadow:0 0 0 1px hsla(0,0%,100%,.6);color:#5a4b23;display:flex;font-size:.875rem;font-weight:500;gap:.5rem;line-height:1.25rem;padding:8px 12px}.wallet-button__chain-icon{align-items:center;border-radius:.5rem;display:flex;gap:.5rem}.wallet-button__icon{align-items:center;background:linear-gradient(90deg,#facc15,#f97316);border-radius:50%;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.wallet-button__account{align-items:center;background-color:rgba(22,163,74,.2);background-color:#fff;border:none;border-radius:.5rem;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#66608d;cursor:pointer;display:flex;font-size:.875rem;gap:.5rem;height:40px;justify-content:space-evenly;line-height:1.25rem;min-width:150px;padding:.25rem .75rem;transform:translateY(-1px);transition:transform .2s}.wallet-button__status-bot{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;background-color:#4ade80;border-radius:9999px;height:.5rem;width:.5rem}.wallet-icon{color:#4ade80;height:1rem;width:1rem}.wallet-button__address{color:#4ade80;color:#8b8eb5;font-size:.875rem;font-size:.75rem;font-weight:600;line-height:1rem}.notification-container{position:relative}.notification-button{background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-sizing:border-box;color:#6a6d94;display:flex;height:2.5rem;position:relative;width:2.5rem}.notification-badge,.notification-button{align-items:center;justify-content:center}.notification-badge{background-color:#ff5a5f;border-radius:9999px;color:#fff;display:inline-flex;font-size:.625rem;font-weight:600;height:1rem;line-height:1rem;padding:.25 .25rem;position:absolute;right:-.25rem;top:-.25rem;width:1rem}",
);
const Z = ({
  label: n = "连接钱包",
  showBalance: a = !0,
  showChainName: i = !0,
  className: r = "",
  size: o = "medium",
}) =>
  e("div", {
    className: `wallet-button wallet-button--${o} ${r}`,
    children: e(M.Custom, {
      children: ({
        account: r,
        chain: o,
        openAccountModal: s,
        openConnectModal: d,
        authenticationStatus: c,
        mounted: u,
      }) =>
        e("div", {
          className: "wallet-button__container",
          children:
            u && "loading" !== c && r && o && (!c || "authenticated" === c)
              ? t("div", {
                  className: "wallet-button__connected",
                  children: [
                    i &&
                      t("div", {
                        className: "wallet-button__chain",
                        children: [
                          o.iconUrl &&
                            e("div", {
                              className: "wallet-button__chain-icon",
                              children: e("img", {
                                alt: o.name ?? "Chain icon",
                                src: o.iconUrl,
                                className: "wallet-button__icon",
                              }),
                            }),
                          a &&
                            r.displayBalance &&
                            e("span", { children: r.displayBalance }),
                        ],
                      }),
                    t("button", {
                      onClick: s,
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
                            "stroke-width": "2",
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
                    e(Q, { account: r, chain: o, openAccountModal: s }),
                  ],
                })
              : e("button", {
                  onClick: d,
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
  V as useERC20,
  L as useNetworkSwitch,
  G as useSimpleYDToken,
  D as useWalletConnection,
  H as useWalletInfo,
};
//# sourceMappingURL=index.esm.js.map
