"use strict";
var e = require("react/jsx-runtime"),
  t = require("react"),
  n = require("wagmi"),
  a = require("@rainbow-me/rainbowkit"),
  r = require("@tanstack/react-query"),
  i = require("wagmi/chains");
require("@rainbow-me/rainbowkit/styles.css");
var s = require("viem");
const o = [i.mainnet, i.sepolia];
i.mainnet.id,
  i.sepolia.id,
  a.lightTheme(),
  a.lightTheme().colors,
  a.lightTheme().radii;
const u = {
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
  },
  c = new r.QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: !1, retry: !1 } },
  });
function d() {
  const {
      address: e,
      connector: t,
      isConnected: a,
      isConnecting: r,
      isReconnecting: i,
    } = n.useAccount(),
    s = n.useChainId(),
    o = n.useChains(),
    { connect: u, connectors: c } = n.useConnect(),
    { reconnect: d } = n.useReconnect(),
    { disconnect: l } = n.useDisconnect(),
    p = o.find((e) => e.id === s);
  return {
    isConnected: a,
    isConnecting: r,
    isReconnecting: i,
    address: e,
    connector: t ? { id: t.id, name: t.name, type: t.type } : void 0,
    chain: p,
    chains: o,
    connect: (e) => {
      if (e) {
        const t = c.find((t) => t.id === e);
        t && u({ connector: t });
      } else {
        const e = c[0];
        e && u({ connector: e });
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
function l({
  address: e,
  abi: t,
  functionName: a,
  args: r,
  chainId: i,
  enabled: s = !0,
  cacheTime: o = 0,
  staleTime: u = 0,
}) {
  const { data: c, ...d } = n.useReadContract({
    address: e,
    abi: t,
    functionName: a,
    args: r,
    chainId: i,
    query: { enabled: s, gcTime: o, staleTime: u },
  });
  return { data: c, ...d };
}
function p({
  address: e,
  abi: t,
  functionName: a,
  args: r,
  value: i,
  chainId: s,
  enabled: o = !0,
  gasLimit: u,
}) {
  const {
    writeContract: c,
    writeContractAsync: d,
    ...l
  } = n.useWriteContract();
  return {
    write: (n) => {
      o &&
        c({
          address: e,
          abi: t,
          functionName: a,
          args: n?.args || r,
          value: n?.value || i,
          chainId: s,
          gas: n?.gas || u,
        });
    },
    writeAsync: async (n) => {
      if (o)
        return await d({
          address: e,
          abi: t,
          functionName: a,
          args: n?.args || r,
          value: n?.value || i,
          chainId: s,
          gas: n?.gas || u,
        });
    },
    receipt: n.useWaitForTransactionReceipt({
      hash: l.data,
      query: { enabled: !!l.data },
    }),
    ...l,
  };
}
const y = [
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
  m = [
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
  f = [
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
function b(e, t) {
  return {
    read:
      (n, a = !0) =>
      (...r) => {
        const i = r.length > 0 && r.every((e) => void 0 !== e);
        return l({
          address: e,
          abi: t,
          functionName: n,
          args: i ? r : void 0,
          enabled: a,
        });
      },
    write: (n) => {
      const a = p({ address: e, abi: t, functionName: n });
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
const h = "0xA812265c869F2BCB755980677812F253459A0cc7";
function g(e, t) {
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
g(
  ".profile__menu-wrapper{position:relative}.profile__menu-trigger{align-items:center;background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#6a6d94;cursor:pointer;display:flex;height:2.5rem;justify-content:center;transition:transform .2s;width:2.5rem}.profile__menu-trigger:hover{transform:translateY(-1px)}.profile__avatar{border-radius:50%}.wallet-dropdown{background-color:#fff;border:1px solid #ecebff;border-radius:1rem;box-shadow:0 24px 60px rgba(154,161,255,.18);color:#2b2558;font-size:.875rem;line-height:1.25rem;padding:1rem;position:absolute;right:0;top:2.8rem;width:18rem}.wallet-header{align-items:flex-start;display:flex;justify-content:space-between}.wallet-label{color:#8b8eb5;font-size:.75rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.wallet-value{font-weight:600;margin-top:.25rem}.wallet-chain-id{background-color:#f4f4ff;border-radius:9999px;color:#5f6094;font-size:.75rem;font-weight:500;line-height:1rem;padding:.25rem .75rem}.wallet-section{margin-top:1rem}.wallet-address-box{align-items:center;background-color:#f8f8ff;border-radius:.75rem;display:flex;justify-content:space-between;margin-top:.25rem;padding:.5rem .75rem}.wallet-address-text{color:#2b2558;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.875rem;line-height:1.25rem}.copy-button{background:transparent;border:none;border-radius:9999px;color:#6a6d94;cursor:pointer;padding:.25rem;transition:background-color .2s}.copy-button:hover{background-color:#fff}.balance-info-box{background-color:#f9f9ff;border-radius:.75rem;margin-top:1rem;padding:.75rem}.balance-info-label{align-items:center;color:#8b8eb5;display:flex;font-size:.75rem;gap:.5rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.balance-info-amount{font-size:1.125rem;font-weight:600;line-height:1.75rem;margin-top:.5rem}.disconnect-button{align-items:center;background-color:#f3f4f6;border:none;border-radius:.5rem;color:#374151;cursor:pointer;display:flex;font-weight:500;gap:.5rem;justify-content:center;margin-top:1rem;padding:.5rem 1rem;transition:background-color .2s;width:100%}.disconnect-button:hover:not(:disabled){background-color:#e5e7eb}.disconnect-button:disabled{cursor:not-allowed;opacity:.5}.disconnect-button.loading{opacity:.7}",
);
const w = ({ account: n, chain: a, openAccountModal: r }) => {
  const [i, s] = t.useState(!1),
    o = t.useRef(null),
    { disconnect: u } = d();
  t.useEffect(() => {
    const e = (e) => {
      o.current && !o.current.contains(e.target) && s(!1);
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
        onClick: () => s(!i),
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
      i &&
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
                s(!1), u();
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
g(
  ".wallet-button{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.wallet-button__container{align-items:center;display:flex;gap:8px;height:44px;justify-content:center}.wallet-button__connect{background:linear-gradient(90deg,#eab308,#f97316);border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__connect:hover{box-shadow:0 4px 12px rgba(102,126,234,.4);transform:translateY(-1px)}.wallet-button__wrong-network{background:#ff6b6b;border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__wrong-network:hover{background:#ff5252}.wallet-button__connected{align-items:center;display:flex;gap:16px}.wallet-button__chain{align-items:center;background:linear-gradient(90deg,#ffe7c5,#ffead4);border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-shadow:0 0 0 1px hsla(0,0%,100%,.6);color:#5a4b23;display:flex;font-size:.875rem;font-weight:500;gap:.5rem;line-height:1.25rem;padding:8px 12px}.wallet-button__chain-icon{align-items:center;border-radius:.5rem;display:flex;gap:.5rem}.wallet-button__icon{align-items:center;background:linear-gradient(90deg,#facc15,#f97316);border-radius:50%;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.wallet-button__account{align-items:center;background-color:rgba(22,163,74,.2);background-color:#fff;border:none;border-radius:.5rem;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#66608d;cursor:pointer;display:flex;font-size:.875rem;gap:.5rem;height:40px;justify-content:space-evenly;line-height:1.25rem;min-width:150px;padding:.25rem .75rem;transform:translateY(-1px);transition:transform .2s}.wallet-button__status-bot{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;background-color:#4ade80;border-radius:9999px;height:.5rem;width:.5rem}.wallet-icon{color:#4ade80;height:1rem;width:1rem}.wallet-button__address{color:#4ade80;color:#8b8eb5;font-size:.875rem;font-size:.75rem;font-weight:600;line-height:1rem}.notification-container{position:relative}.notification-button{background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);box-sizing:border-box;color:#6a6d94;display:flex;height:2.5rem;position:relative;width:2.5rem}.notification-badge,.notification-button{align-items:center;justify-content:center}.notification-badge{background-color:#ff5a5f;border-radius:9999px;color:#fff;display:inline-flex;font-size:.625rem;font-weight:600;height:1rem;line-height:1rem;padding:.25 .25rem;position:absolute;right:-.25rem;top:-.25rem;width:1rem}",
);
(exports.WalletButton = ({
  label: t = "连接钱包",
  showBalance: n = !0,
  showChainName: r = !0,
  className: i = "",
  size: s = "medium",
}) =>
  e.jsx("div", {
    className: `wallet-button wallet-button--${s} ${i}`,
    children: e.jsx(a.ConnectButton.Custom, {
      children: ({
        account: a,
        chain: i,
        openAccountModal: s,
        openConnectModal: o,
        authenticationStatus: u,
        mounted: c,
      }) => {
        const d =
          c && "loading" !== u && a && i && (!u || "authenticated" === u);
        return e.jsx("div", {
          className: "wallet-button__container",
          children: d
            ? e.jsxs("div", {
                className: "wallet-button__connected",
                children: [
                  r &&
                    e.jsxs("div", {
                      className: "wallet-button__chain",
                      children: [
                        i.iconUrl &&
                          e.jsx("div", {
                            className: "wallet-button__chain-icon",
                            children: e.jsx("img", {
                              alt: i.name ?? "Chain icon",
                              src: i.iconUrl,
                              className: "wallet-button__icon",
                            }),
                          }),
                        n &&
                          a.displayBalance &&
                          e.jsx("span", { children: a.displayBalance }),
                      ],
                    }),
                  e.jsxs("button", {
                    onClick: s,
                    type: "button",
                    className: "wallet-button__account",
                    children: [
                      e.jsx("span", { className: "wallet-button__status-bot" }),
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
                            e.jsx("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }),
                          ],
                        }),
                        e.jsx("span", {
                          className: "notification-badge",
                          children: "99",
                        }),
                      ],
                    }),
                  }),
                  e.jsx(w, { account: a, chain: i, openAccountModal: s }),
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
    children: i,
    theme: s = "auto",
    queryClient: d = c,
    initialState: l,
    ...p
  }) {
    const { config: y } = t.useMemo(
        () =>
          (function (e) {
            const {
                appName: t = "APP_NAME",
                projectId: r = "YOUR_PROJECT_ID",
                alchemyApiKey: i,
                infuraApiKey: s,
              } = e,
              u = o.reduce((e, t) => {
                let a = "";
                return (
                  i &&
                    (a = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.g.alchemy.com/v2/${i}`),
                  s &&
                    (a = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.infura.io/v3/${s}`),
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
              transports: u,
            };
          })(p),
        [p.appName, p.projectId, p.alchemyApiKey, p.infuraApiKey],
      ),
      m = t.useMemo(() => u, [s]);
    return e.jsx(n.WagmiProvider, {
      config: y,
      reconnectOnMount: !0,
      initialState: l,
      children: e.jsx(r.QueryClientProvider, {
        client: d,
        children: e.jsx(a.RainbowKitProvider, {
          theme: m,
          modalSize: "compact",
          showRecentTransactions: !0,
          children: i,
        }),
      }),
    });
  }),
  (exports.useCourseContract = function ({
    address: e = "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d",
    tokenDecimals: t = 18,
  }) {
    const n = b(e, m),
      a = (e) => s.parseUnits(e, t),
      r = n.write("createCourse"),
      i = n.write("purchaseCourse"),
      o = n.write("updateCoursePrice"),
      u = n.write("updateProgress"),
      c = n.write("requestRefund"),
      d = n.write("certifyInstructor"),
      l = n.write("revokeInstructor"),
      p = n.write("batchCertifyInstructors"),
      y = n.write("updatePlatformAddress"),
      f = n.write("updateCourse"),
      h = n.write("publishCourse"),
      g = n.write("unpublishCourse"),
      w = n.write("deleteCourse");
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
      updateCoursePrice: async (e, t) => await o.send(e, a(t)),
      updateCourseProgress: async (e, t) => await u.send(e, t),
      requestRefund: async (e) => await c.send(e),
      certifyInstructor: async (e) => await d.send(e),
      revokeInstructor: async (e) => await l.send(e),
      batchCertifyInstructors: async (e) => await p.send(e),
      updatePlatformAddress: async (e) => await y.send(e),
      updateCourse: async (e, t, n) => await f.send(e, t, n),
      publishCourse: async (e) => await h.send(e),
      unpublishCourse: async (e) => await g.send(e),
      deleteCourse: async (e) => await w.send(e),
      createCourseReceipt: r.receipt,
      purchaseCourseReceipt: i.receipt,
      updateCoursePriceReceipt: o.receipt,
      updateCourseProgressReceipt: u.receipt,
      requestRefundReceipt: c.receipt,
      certifyInstructorReceipt: d.receipt,
      revokeInstructorReceipt: l.receipt,
      batchCertifyInstructorsReceipt: p.receipt,
      updatePlatformAddressReceipt: y.receipt,
      updateCourseReceipt: f.receipt,
      publishCourseReceipt: h.receipt,
      unpublishCourseReceipt: g.receipt,
      deleteCourseReceipt: w.receipt,
    };
  }),
  (exports.useERC20 = function ({
    address: e,
    spenderAddress: t,
    enabled: a = !0,
  }) {
    const { address: r } = n.useAccount(),
      i = (e) => {
        if (!d) throw new Error("Decimals not loaded");
        return s.parseUnits(e, d);
      },
      { data: o } = l({
        address: e,
        abi: y,
        functionName: "totalSupply",
        enabled: a,
      }),
      { data: u, refetch: c } = l({
        address: e,
        abi: y,
        functionName: "balanceOf",
        args: r ? [r] : void 0,
        enabled: a && !!r,
      }),
      { data: d } = l({
        address: e,
        abi: y,
        functionName: "decimals",
        enabled: a,
      }),
      { data: m, refetch: f } = l({
        address: e,
        abi: y,
        functionName: "allowance",
        args: r && t ? [r, t] : void 0,
        enabled: a && !!r && !!t,
      }),
      b = p({ address: e, abi: y, functionName: "transfer" }),
      h = p({ address: e, abi: y, functionName: "approve" }),
      g = p({ address: e, abi: y, functionName: "transferFrom" });
    return {
      totalSupply: o,
      balance: u,
      allowance: m,
      transferReceipt: b.receipt,
      approveReceipt: h.receipt,
      transferFromReceipt: g.receipt,
      refetchBalance: c,
      refetchAllowance: f,
      transfer: async (e, t) => {
        if (!b.writeAsync) throw new Error("Transfer not available");
        const n = i(t);
        return b.writeAsync({ args: [e, n] });
      },
      approve: async (e, t) => {
        if (!h.writeAsync) throw new Error("Approve not available");
        const n = i(t);
        return h.writeAsync({ args: [e, n] });
      },
      transferFrom: async (e, t, n) => {
        if (!g.writeAsync) throw new Error("TransferFrom not available");
        const a = i(n);
        return g.writeAsync({ args: [e, t, a] });
      },
    };
  }),
  (exports.useNetworkSwitch = function () {
    const e = n.useChains(),
      t = n.useChainId(),
      a = e.find((e) => e.id === t),
      {
        switchChain: r,
        isPending: i,
        error: s,
        isSuccess: o,
        reset: u,
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
      isPending: i,
      error: s,
      isSuccess: o,
      reset: u,
      isCurrentChain: (e) => t === e,
      canSwitchNetwork: !!r,
    };
  }),
  (exports.useSimpleYDToken = function ({
    address: e = h,
    spenderAddress: a,
    enabled: r = !0,
  }) {
    const { address: i } = n.useAccount(),
      [o, u] = t.useState(),
      [c, d] = t.useState(),
      { data: l, refetch: p } = n.useEstimateGas({
        account: i,
        to: o,
        value: c,
        query: { enabled: !1 },
      }),
      y = (e) => {
        if (!T) throw new Error("Decimals not loaded");
        return s.parseUnits(e, T);
      },
      m = async (e, t) => {
        u(e),
          d(t),
          await new Promise((e) => setTimeout(e, 0)),
          await p(),
          u(void 0),
          d(void 0);
      },
      g = b(e, f),
      { data: w } = g.read("totalSupply")(),
      { data: x, refetch: v } = g.read("balanceOf", r && !!i)(),
      { data: T } = g.read("decimals")(),
      { data: C, refetch: k } = g.read("allowance")(i, a),
      _ = g.write("transfer"),
      j = g.write("approve"),
      N = g.write("transferFrom"),
      M = g.write("exchangeETHForTokens"),
      A = g.write("stake"),
      R = g.write("unstake"),
      I = g.write("claimReward");
    return {
      totalSupply: w,
      balance: x,
      allowance: C,
      transferReceipt: _.receipt,
      approveReceipt: j.receipt,
      transferFromReceipt: N.receipt,
      exchangeETHForTokensReceipt: M.receipt,
      stakeReceipt: A.receipt,
      unstakeReceipt: R.receipt,
      claimRewardReceipt: I.receipt,
      refetchBalance: v,
      refetchAllowance: k,
      getStakeInfo: (e) => g.read("getStakeInfo")(e),
      calculatePendingReward: (e) => g.read("calculatePendingReward")(e),
      canUnstake: (e) => g.read("canUnstake")(e),
      transfer: async (e, t) => {
        const n = y(t);
        return await m(e, n), _.send(e, n, { gas: l });
      },
      approve: async (e, t) => {
        const n = y(t);
        return await m(h, void 0), j.send(e, n, { gas: l });
      },
      transferFrom: async (e, t, n) => {
        const a = y(n);
        return await m(t, a), N.send(e, t, a);
      },
      exchangeETHForTokens: async (e) => (
        await m(h, s.parseEther(e)), M.send({ value: s.parseEther(e), gas: l })
      ),
      stake: async (e, t) => A.send(e, t),
      unstake: async (e) => R.send(e),
      claimReward: async () => I.send(),
    };
  }),
  (exports.useWalletConnection = d),
  (exports.useWalletInfo = function () {
    const { address: e, connector: t, isConnected: a } = n.useAccount(),
      r = n.useChainId(),
      i = n.useChains().find((e) => e.id === r),
      { data: o } = n.useEnsName({ address: e }),
      { data: u, isLoading: c } = n.useBalance({ address: e }),
      d = u
        ? {
            value: u.value,
            formatted: s.formatEther(u.value),
            symbol: u.symbol,
            decimals: u.decimals,
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
      chain: i,
      balance: d,
      isBalanceLoading: c,
    };
  }),
  (exports.useWalletSign = function () {
    const {
      signMessage: e,
      signMessageAsync: t,
      data: a,
      error: r,
      isPending: i,
      isSuccess: s,
      isError: o,
      reset: u,
    } = n.useSignMessage();
    return {
      signMessage: e,
      signMessageAsync: t,
      signature: a,
      error: r,
      isPending: i,
      isSuccess: s,
      isError: o,
      reset: u,
    };
  });
