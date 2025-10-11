import { jsx as e, jsxs as t } from "react/jsx-runtime";
import n, { useState as a, useRef as r, useEffect as i } from "react";
import {
  http as s,
  createStorage as o,
  cookieStorage as d,
  WagmiProvider as c,
  useAccount as u,
  useChainId as l,
  useChains as p,
  useConnect as y,
  useReconnect as m,
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
  lightTheme as k,
  darkTheme as _,
  RainbowKitProvider as N,
  ConnectButton as M,
} from "@rainbow-me/rainbowkit";
import {
  QueryClient as A,
  QueryClientProvider as R,
} from "@tanstack/react-query";
import { sepolia as I, mainnet as B } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { formatEther as S, parseUnits as E, parseEther as P } from "viem";
const F = [B, I];
B.id, I.id, k(), k().colors, k().radii;
const z = {
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
  j = new A({
    defaultOptions: { queries: { refetchOnWindowFocus: !1, retry: !1 } },
  });
function O({
  children: t,
  theme: a = "auto",
  queryClient: r = j,
  initialState: i,
  ...u
}) {
  const { config: l } = n.useMemo(
      () =>
        (function (e) {
          const {
              appName: t = "APP_NAME",
              projectId: n = "YOUR_PROJECT_ID",
              alchemyApiKey: a,
              infuraApiKey: r,
            } = e,
            i = F.reduce((e, t) => {
              let n = "";
              return (
                a &&
                  (n = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.g.alchemy.com/v2/${a}`),
                r &&
                  (n = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.infura.io/v3/${r}`),
                (e[t.id] = n ? s(n) : s()),
                e
              );
            }, {});
          return {
            config: C({
              appName: t,
              projectId: n,
              chains: F,
              ssr: !0,
              storage: o({ storage: d }),
            }),
            transports: i,
          };
        })(u),
      [u.appName, u.projectId, u.alchemyApiKey, u.infuraApiKey],
    ),
    p = n.useMemo(() => z, [a]);
  return e(c, {
    config: l,
    reconnectOnMount: !0,
    initialState: i,
    children: e(R, {
      client: r,
      children: e(N, {
        theme: p,
        modalSize: "compact",
        showRecentTransactions: !0,
        children: t,
      }),
    }),
  });
}
function q() {
  const {
      address: e,
      connector: t,
      isConnected: n,
      isConnecting: a,
      isReconnecting: r,
    } = u(),
    i = l(),
    s = p(),
    { connect: o, connectors: d } = y(),
    { reconnect: c } = m(),
    { disconnect: b } = f(),
    h = s.find((e) => e.id === i);
  return {
    isConnected: n,
    isConnecting: a,
    isReconnecting: r,
    address: e,
    connector: t ? { id: t.id, name: t.name, type: t.type } : void 0,
    chain: h,
    chains: s,
    connect: (e) => {
      if (e) {
        const t = d.find((t) => t.id === e);
        t && o({ connector: t });
      } else {
        const e = d[0];
        e && o({ connector: e });
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
function D() {
  const { address: e, connector: t, isConnected: n } = u(),
    a = l(),
    r = p().find((e) => e.id === a),
    { data: i } = b({ address: e }),
    { data: s, isLoading: o } = h({ address: e }),
    d = s
      ? {
          value: s.value,
          formatted: S(s.value),
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
    balance: d,
    isBalanceLoading: o,
  };
}
function H() {
  const e = p(),
    t = l(),
    n = e.find((e) => e.id === t),
    { switchChain: a, isPending: r, error: i, isSuccess: s, reset: o } = g();
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
function L({
  address: e,
  abi: t,
  functionName: n,
  args: a,
  chainId: r,
  enabled: i = !0,
  cacheTime: s = 0,
  staleTime: o = 0,
}) {
  const { data: d, ...c } = w({
    address: e,
    abi: t,
    functionName: n,
    args: a,
    chainId: r,
    query: { enabled: i, gcTime: s, staleTime: o },
  });
  return { data: d, ...c };
}
function U({
  address: e,
  abi: t,
  functionName: n,
  args: a,
  value: r,
  chainId: i,
  enabled: s = !0,
  gasLimit: o,
}) {
  const { writeContract: d, writeContractAsync: c, ...u } = v();
  return {
    write: (c) => {
      s &&
        d({
          address: e,
          abi: t,
          functionName: n,
          args: c?.args || a,
          value: c?.value || r,
          chainId: i,
          gas: c?.gas || o,
        });
    },
    writeAsync: async (d) => {
      if (s)
        return await c({
          address: e,
          abi: t,
          functionName: n,
          args: d?.args || a,
          value: d?.value || r,
          chainId: i,
          gas: d?.gas || o,
        });
    },
    receipt: x({ hash: u.data, query: { enabled: !!u.data } }),
    ...u,
  };
}
const W = [
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
  $ = [
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
  K = [
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
  const { address: a } = u(),
    r = (e) => {
      if (!d) throw new Error("Decimals not loaded");
      return E(e, d);
    },
    { data: i } = L({
      address: e,
      abi: W,
      functionName: "totalSupply",
      enabled: n,
    }),
    { data: s, refetch: o } = L({
      address: e,
      abi: W,
      functionName: "balanceOf",
      args: a ? [a] : void 0,
      enabled: n && !!a,
    }),
    { data: d } = L({
      address: e,
      abi: W,
      functionName: "decimals",
      enabled: n,
    }),
    { data: c, refetch: l } = L({
      address: e,
      abi: W,
      functionName: "allowance",
      args: a && t ? [a, t] : void 0,
      enabled: n && !!a && !!t,
    }),
    p = U({ address: e, abi: W, functionName: "transfer" }),
    y = U({ address: e, abi: W, functionName: "approve" }),
    m = U({ address: e, abi: W, functionName: "transferFrom" });
  return {
    totalSupply: i,
    balance: s,
    allowance: c,
    transferReceipt: p.receipt,
    approveReceipt: y.receipt,
    transferFromReceipt: m.receipt,
    refetchBalance: o,
    refetchAllowance: l,
    transfer: async (e, t) => {
      if (!p.writeAsync) throw new Error("Transfer not available");
      const n = r(t);
      return p.writeAsync({ args: [e, n] });
    },
    approve: async (e, t) => {
      if (!y.writeAsync) throw new Error("Approve not available");
      const n = r(t);
      return y.writeAsync({ args: [e, n] });
    },
    transferFrom: async (e, t, n) => {
      if (!m.writeAsync) throw new Error("TransferFrom not available");
      const a = r(n);
      return m.writeAsync({ args: [e, t, a] });
    },
  };
}
function V(e, t) {
  return {
    read:
      (n, a = !0) =>
      (...r) => {
        const i = r.length > 0 && r.every((e) => void 0 !== e);
        return L({
          address: e,
          abi: t,
          functionName: n,
          args: i ? r : void 0,
          enabled: a,
        });
      },
    write: (n) => {
      const a = U({ address: e, abi: t, functionName: n });
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
const G = "0xA812265c869F2BCB755980677812F253459A0cc7";
function J({ address: e = G, spenderAddress: t, enabled: n = !0 }) {
  const { address: r } = u(),
    [i, s] = a(),
    [o, d] = a(),
    { data: c, refetch: l } = T({
      account: r,
      to: i,
      value: o,
      query: { enabled: !1 },
    }),
    p = (e) => {
      if (!g) throw new Error("Decimals not loaded");
      return E(e, g);
    },
    y = async (e, t) => {
      s(e),
        d(t),
        await new Promise((e) => setTimeout(e, 0)),
        await l(),
        s(void 0),
        d(void 0);
    },
    m = V(e, K),
    { data: f } = m.read("totalSupply")(),
    { data: b, refetch: h } = m.read("balanceOf", n && !!r)(),
    { data: g } = m.read("decimals")(),
    { data: w, refetch: v } = m.read("allowance")(r, t),
    x = m.write("transfer"),
    C = m.write("approve"),
    k = m.write("transferFrom"),
    _ = m.write("exchangeETHForTokens"),
    N = m.write("stake"),
    M = m.write("unstake"),
    A = m.write("claimReward");
  return {
    totalSupply: f,
    balance: b,
    allowance: w,
    transferReceipt: x.receipt,
    approveReceipt: C.receipt,
    transferFromReceipt: k.receipt,
    exchangeETHForTokensReceipt: _.receipt,
    stakeReceipt: N.receipt,
    unstakeReceipt: M.receipt,
    claimRewardReceipt: A.receipt,
    refetchBalance: h,
    refetchAllowance: v,
    getStakeInfo: (e) => m.read("getStakeInfo")(e),
    calculatePendingReward: (e) => m.read("calculatePendingReward")(e),
    canUnstake: (e) => m.read("canUnstake")(e),
    transfer: async (e, t) => {
      const n = p(t);
      return await y(e, n), x.send(e, n, { gas: c });
    },
    approve: async (e, t) => {
      const n = p(t);
      return await y(G, void 0), C.send(e, n, { gas: c });
    },
    transferFrom: async (e, t, n) => {
      const a = p(n);
      return await y(t, a), k.send(e, t, a);
    },
    exchangeETHForTokens: async (e) => (
      await y(G, P(e)), _.send({ value: P(e), gas: c })
    ),
    stake: async (e, t) => N.send(e, t),
    unstake: async (e) => M.send(e),
    claimReward: async () => A.send(),
  };
}
function X({
  address: e = "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d",
  tokenDecimals: t = 18,
}) {
  const n = V(e, $),
    a = (e) => E(e, t),
    r = n.write("createCourse"),
    i = n.write("purchaseCourse"),
    s = n.write("updateCoursePrice"),
    o = n.write("updateProgress"),
    d = n.write("requestRefund"),
    c = n.write("certifyInstructor"),
    u = n.write("revokeInstructor"),
    l = n.write("batchCertifyInstructors"),
    p = n.write("updatePlatformAddress"),
    y = n.write("updateCourse"),
    m = n.write("publishCourse"),
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
    createCourse: async (e, t, n, i) => await r.send(e, t, a(n), i),
    purchaseCourse: async (e) => await i.send(e),
    updateCoursePrice: async (e, t) => await s.send(e, a(t)),
    updateCourseProgress: async (e, t) => await o.send(e, t),
    requestRefund: async (e) => await d.send(e),
    certifyInstructor: async (e) => await c.send(e),
    revokeInstructor: async (e) => await u.send(e),
    batchCertifyInstructors: async (e) => await l.send(e),
    updatePlatformAddress: async (e) => await p.send(e),
    updateCourse: async (e, t, n) => await y.send(e, t, n),
    publishCourse: async (e) => await m.send(e),
    unpublishCourse: async (e) => await f.send(e),
    deleteCourse: async (e) => await b.send(e),
    createCourseReceipt: r.receipt,
    purchaseCourseReceipt: i.receipt,
    updateCoursePriceReceipt: s.receipt,
    updateCourseProgressReceipt: o.receipt,
    requestRefundReceipt: d.receipt,
    certifyInstructorReceipt: c.receipt,
    revokeInstructorReceipt: u.receipt,
    batchCertifyInstructorsReceipt: l.receipt,
    updatePlatformAddressReceipt: p.receipt,
    updateCourseReceipt: y.receipt,
    publishCourseReceipt: m.receipt,
    unpublishCourseReceipt: f.receipt,
    deleteCourseReceipt: b.receipt,
  };
}
function Q(e, t) {
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
Q(
  ".profile__menu-wrapper{position:relative}.profile__menu-trigger{align-items:center;background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#6a6d94;cursor:pointer;display:flex;height:2.5rem;justify-content:center;transition:transform .2s;width:2.5rem}.profile__menu-trigger:hover{transform:translateY(-1px)}.profile__avatar{border-radius:50%}.wallet-dropdown{background-color:#fff;border:1px solid #ecebff;border-radius:1rem;box-shadow:0 24px 60px rgba(154,161,255,.18);color:#2b2558;font-size:.875rem;line-height:1.25rem;padding:1rem;position:absolute;right:0;top:2.8rem;width:18rem}.wallet-header{align-items:flex-start;display:flex;justify-content:space-between}.wallet-label{color:#8b8eb5;font-size:.75rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.wallet-value{font-weight:600;margin-top:.25rem}.wallet-chain-id{background-color:#f4f4ff;border-radius:9999px;color:#5f6094;font-size:.75rem;font-weight:500;line-height:1rem;padding:.25rem .75rem}.wallet-section{margin-top:1rem}.wallet-address-box{align-items:center;background-color:#f8f8ff;border-radius:.75rem;display:flex;justify-content:space-between;margin-top:.25rem;padding:.5rem .75rem}.wallet-address-text{color:#2b2558;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.875rem;line-height:1.25rem}.copy-button{background:transparent;border:none;border-radius:9999px;color:#6a6d94;cursor:pointer;padding:.25rem;transition:background-color .2s}.copy-button:hover{background-color:#fff}.balance-info-box{background-color:#f9f9ff;border-radius:.75rem;margin-top:1rem;padding:.75rem}.balance-info-label{align-items:center;color:#8b8eb5;display:flex;font-size:.75rem;gap:.5rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.balance-info-amount{font-size:1.125rem;font-weight:600;line-height:1.75rem;margin-top:.5rem}.disconnect-button{align-items:center;background-color:#f3f4f6;border:none;border-radius:.5rem;color:#374151;cursor:pointer;display:flex;font-weight:500;gap:.5rem;justify-content:center;margin-top:1rem;padding:.5rem 1rem;transition:background-color .2s;width:100%}.disconnect-button:hover:not(:disabled){background-color:#e5e7eb}.disconnect-button:disabled{cursor:not-allowed;opacity:.5}.disconnect-button.loading{opacity:.7}",
);
const Z = ({ account: n, chain: s, openAccountModal: o }) => {
  const [d, c] = a(!1),
    u = r(null),
    { disconnect: l } = q();
  i(() => {
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
                    e("div", { className: "wallet-value", children: s.name }),
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
                c(!1), l();
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
Q(
  ".wallet-button{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.wallet-button__container{align-items:center;display:flex;gap:8px;height:44px;justify-content:center}.wallet-button__connect{background:linear-gradient(90deg,#eab308,#f97316);border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__connect:hover{box-shadow:0 4px 12px rgba(102,126,234,.4);transform:translateY(-1px)}.wallet-button__wrong-network{background:#ff6b6b;border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__wrong-network:hover{background:#ff5252}.wallet-button__connected{align-items:center;display:flex;gap:16px}.wallet-button__chain{align-items:center;background:linear-gradient(90deg,#ffe7c5,#ffead4);border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-shadow:0 0 0 1px hsla(0,0%,100%,.6);color:#5a4b23;display:flex;font-size:.875rem;font-weight:500;gap:.5rem;line-height:1.25rem;padding:8px 12px}.wallet-button__chain-icon{align-items:center;border-radius:.5rem;display:flex;gap:.5rem}.wallet-button__icon{align-items:center;background:linear-gradient(90deg,#facc15,#f97316);border-radius:50%;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.wallet-button__account{align-items:center;background-color:rgba(22,163,74,.2);background-color:#fff;border:none;border-radius:.5rem;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#66608d;cursor:pointer;display:flex;font-size:.875rem;gap:.5rem;height:40px;justify-content:space-evenly;line-height:1.25rem;min-width:150px;padding:.25rem .75rem;transform:translateY(-1px);transition:transform .2s}.wallet-button__status-bot{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;background-color:#4ade80;border-radius:9999px;height:.5rem;width:.5rem}.wallet-icon{color:#4ade80;height:1rem;width:1rem}.wallet-button__address{color:#4ade80;color:#8b8eb5;font-size:.875rem;font-size:.75rem;font-weight:600;line-height:1rem}.notification-container{position:relative}.notification-button{background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-sizing:border-box;color:#6a6d94;display:flex;height:2.5rem;position:relative;width:2.5rem}.notification-badge,.notification-button{align-items:center;justify-content:center}.notification-badge{background-color:#ff5a5f;border-radius:9999px;color:#fff;display:inline-flex;font-size:.625rem;font-weight:600;height:1rem;line-height:1rem;padding:.25 .25rem;position:absolute;right:-.25rem;top:-.25rem;width:1rem}",
);
const ee = ({
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
        openConnectModal: d,
        authenticationStatus: c,
        mounted: u,
      }) =>
        e("div", {
          className: "wallet-button__container",
          children:
            u && "loading" !== c && i && s && (!c || "authenticated" === c)
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
                    e(Z, { account: i, chain: s, openAccountModal: o }),
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
  ee as WalletButton,
  O as WalletProvider,
  X as useCourseContract,
  Y as useERC20,
  H as useNetworkSwitch,
  J as useSimpleYDToken,
  q as useWalletConnection,
  D as useWalletInfo,
};
//# sourceMappingURL=index.esm.js.map
