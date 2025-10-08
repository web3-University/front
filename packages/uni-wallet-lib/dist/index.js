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
const d = {
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
  u = new r.QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: !1, retry: !1 } },
  });
function c() {
  const {
      address: e,
      connector: t,
      isConnected: a,
      isConnecting: r,
      isReconnecting: i,
    } = n.useAccount(),
    s = n.useChainId(),
    o = n.useChains(),
    { connect: d, connectors: u } = n.useConnect(),
    { reconnect: c } = n.useReconnect(),
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
        const t = u.find((t) => t.id === e);
        t && d({ connector: t });
      } else {
        const e = u[0];
        e && d({ connector: e });
      }
    },
    reconnect: (e) => {
      c(e);
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
  staleTime: d = 0,
}) {
  const { data: u, ...c } = n.useReadContract({
    address: e,
    abi: t,
    functionName: a,
    args: r,
    chainId: i,
    query: { enabled: s, gcTime: o, staleTime: d },
  });
  return { data: u, ...c };
}
function p({
  address: e,
  abi: t,
  functionName: a,
  args: r,
  value: i,
  chainId: s,
  enabled: o = !0,
  gasLimit: d,
}) {
  const {
    writeContract: u,
    writeContractAsync: c,
    ...l
  } = n.useWriteContract();
  return {
    write: (n) => {
      o &&
        u({
          address: e,
          abi: t,
          functionName: a,
          args: n?.args || r,
          value: n?.value || i,
          chainId: s,
          gas: n?.gas || d,
        });
    },
    writeAsync: async (n) => {
      if (o)
        return await c({
          address: e,
          abi: t,
          functionName: a,
          args: n?.args || r,
          value: n?.value || i,
          chainId: s,
          gas: n?.gas || d,
        });
    },
    receipt: n.useWaitForTransactionReceipt({
      hash: l.data,
      query: { enabled: !!l.data },
    }),
    ...l,
  };
}
const m = [
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
  y = [
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
const b = "0xA812265c869F2BCB755980677812F253459A0cc7";
function h(e, t) {
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
h(
  ".profile__menu-wrapper{position:relative}.profile__menu-trigger{align-items:center;background-color:#fff;border:1px solid #e7e5fb;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);color:#6a6d94;cursor:pointer;display:flex;height:2.5rem;justify-content:center;transition:transform .2s;width:2.5rem}.profile__menu-trigger:hover{transform:translateY(-1px)}.profile__avatar{border-radius:50%}.wallet-dropdown{background-color:#fff;border:1px solid #ecebff;border-radius:1rem;box-shadow:0 24px 60px rgba(154,161,255,.18);color:#2b2558;font-size:.875rem;line-height:1.25rem;padding:1rem;position:absolute;right:0;top:2.8rem;width:18rem}.wallet-header{align-items:flex-start;display:flex;justify-content:space-between}.wallet-label{color:#8b8eb5;font-size:.75rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.wallet-value{font-weight:600;margin-top:.25rem}.wallet-chain-id{background-color:#f4f4ff;border-radius:9999px;color:#5f6094;font-size:.75rem;font-weight:500;line-height:1rem;padding:.25rem .75rem}.wallet-section{margin-top:1rem}.wallet-address-box{align-items:center;background-color:#f8f8ff;border-radius:.75rem;display:flex;justify-content:space-between;margin-top:.25rem;padding:.5rem .75rem}.wallet-address-text{color:#2b2558;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.875rem;line-height:1.25rem}.copy-button{background:transparent;border:none;border-radius:9999px;color:#6a6d94;cursor:pointer;padding:.25rem;transition:background-color .2s}.copy-button:hover{background-color:#fff}.balance-info-box{background-color:#f9f9ff;border-radius:.75rem;margin-top:1rem;padding:.75rem}.balance-info-label{align-items:center;color:#8b8eb5;display:flex;font-size:.75rem;gap:.5rem;letter-spacing:.08em;line-height:1rem;text-transform:uppercase}.balance-info-amount{font-size:1.125rem;font-weight:600;line-height:1.75rem;margin-top:.5rem}.disconnect-button{align-items:center;background-color:#f3f4f6;border:none;border-radius:.5rem;color:#374151;cursor:pointer;display:flex;font-weight:500;gap:.5rem;justify-content:center;margin-top:1rem;padding:.5rem 1rem;transition:background-color .2s;width:100%}.disconnect-button:hover:not(:disabled){background-color:#e5e7eb}.disconnect-button:disabled{cursor:not-allowed;opacity:.5}.disconnect-button.loading{opacity:.7}",
);
const g = ({ account: n, chain: a, openAccountModal: r }) => {
  const [i, s] = t.useState(!1),
    o = t.useRef(null),
    { disconnect: d } = c();
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
                        "stroke-width": "2",
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
                      "stroke-width": "2",
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
                s(!1), d();
              },
              children: [
                e.jsxs("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
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
h(
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
        authenticationStatus: d,
        mounted: u,
      }) => {
        const c =
          u && "loading" !== d && a && i && (!d || "authenticated" === d);
        return e.jsx("div", {
          className: "wallet-button__container",
          children: c
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
                        "stroke-width": "2",
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
                          "stroke-width": "2",
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
                  e.jsx(g, { account: a, chain: i, openAccountModal: s }),
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
    queryClient: c = u,
    initialState: l,
    ...p
  }) {
    const { config: m } = t.useMemo(
        () =>
          (function (e) {
            const {
                appName: t = "APP_NAME",
                projectId: r = "YOUR_PROJECT_ID",
                alchemyApiKey: i,
                infuraApiKey: s,
              } = e,
              d = o.reduce((e, t) => {
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
              transports: d,
            };
          })(p),
        [p.appName, p.projectId, p.alchemyApiKey, p.infuraApiKey],
      ),
      y = t.useMemo(() => d, [s]);
    return e.jsx(n.WagmiProvider, {
      config: m,
      reconnectOnMount: !0,
      initialState: l,
      children: e.jsx(r.QueryClientProvider, {
        client: c,
        children: e.jsx(a.RainbowKitProvider, {
          theme: y,
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
    const n = p({ address: e, abi: y, functionName: "createCourse" }),
      a = p({ address: e, abi: y, functionName: "purchaseCourse" });
    return {
      createCourseReceipt: n.receipt,
      purchaseCourseReceipt: a.receipt,
      hasAccess: (t, n) => {
        const a = Boolean(t && n);
        return l({
          address: e,
          abi: y,
          functionName: "hasAccess",
          args: a ? [t, n] : void 0,
          enabled: a,
        });
      },
      getCourse: (t) =>
        l({
          address: e,
          abi: y,
          functionName: "getCourse",
          args: t ? [t] : void 0,
          enabled: !0,
        }),
      getStudentCourses: (t) =>
        l({
          address: e,
          abi: y,
          functionName: "getStudentCourses",
          args: t ? [t] : void 0,
          enabled: !0,
        }),
      getCourseStudents: (t) =>
        l({
          address: e,
          abi: y,
          functionName: "getCourseStudents",
          args: t ? [t] : void 0,
          enabled: !0,
        }),
      getInstructorCourses: (t) =>
        l({
          address: e,
          abi: y,
          functionName: "getInstructorCourses",
          args: t ? [t] : void 0,
          enabled: !0,
        }),
      getTotalCourses: () =>
        l({ address: e, abi: y, functionName: "getTotalCourses", enabled: !0 }),
      getCourseStudentCount: (t) =>
        l({
          address: e,
          abi: y,
          functionName: "getCourseStudentCount",
          args: [t],
          enabled: !0,
        }),
      batchCheckAccess: (t, n) =>
        l({
          address: e,
          abi: y,
          functionName: "batchCheckAccess",
          args: [t, n],
          enabled: !0,
        }),
      createCourse: async (e, a, r) => {
        if (!n.writeAsync) throw new Error("创建课程方法未创建");
        const i = ((e) => s.parseUnits(e, t))(r);
        return n.writeAsync({ args: [e, a, i] });
      },
      purchaseCourse: async (e) => {
        if (!a.writeAsync) throw new Error("创建课程方法未创建");
        return a.writeAsync({ args: [e] });
      },
    };
  }),
  (exports.useERC20 = function ({
    address: e,
    spenderAddress: t,
    enabled: a = !0,
  }) {
    const { address: r } = n.useAccount(),
      i = (e) => {
        if (!c) throw new Error("Decimals not loaded");
        return s.parseUnits(e, c);
      },
      { data: o } = l({
        address: e,
        abi: m,
        functionName: "totalSupply",
        enabled: a,
      }),
      { data: d, refetch: u } = l({
        address: e,
        abi: m,
        functionName: "balanceOf",
        args: r ? [r] : void 0,
        enabled: a && !!r,
      }),
      { data: c } = l({
        address: e,
        abi: m,
        functionName: "decimals",
        enabled: a,
      }),
      { data: y, refetch: f } = l({
        address: e,
        abi: m,
        functionName: "allowance",
        args: r && t ? [r, t] : void 0,
        enabled: a && !!r && !!t,
      }),
      b = p({ address: e, abi: m, functionName: "transfer" }),
      h = p({ address: e, abi: m, functionName: "approve" }),
      g = p({ address: e, abi: m, functionName: "transferFrom" });
    return {
      totalSupply: o,
      balance: d,
      allowance: y,
      transferReceipt: b.receipt,
      approveReceipt: h.receipt,
      transferFromReceipt: g.receipt,
      refetchBalance: u,
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
        reset: d,
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
      reset: d,
      isCurrentChain: (e) => t === e,
      canSwitchNetwork: !!r,
    };
  }),
  (exports.useSimpleYDToken = function ({
    address: e = b,
    spenderAddress: a,
    enabled: r = !0,
  }) {
    const { address: i } = n.useAccount(),
      [o, d] = t.useState(),
      [u, c] = t.useState(),
      { data: m, refetch: y } = n.useEstimateGas({
        account: i,
        to: o,
        value: u,
        query: { enabled: !1 },
      }),
      h = (e) => {
        if (!T) throw new Error("Decimals not loaded");
        return s.parseUnits(e, T);
      },
      g = async (e, t) => {
        d(e),
          c(t),
          await new Promise((e) => setTimeout(e, 0)),
          await y(),
          d(void 0),
          c(void 0);
      },
      { data: w } = l({
        address: e,
        abi: f,
        functionName: "totalSupply",
        enabled: r,
      }),
      { data: x, refetch: v } = l({
        address: e,
        abi: f,
        functionName: "balanceOf",
        args: i ? [i] : void 0,
        enabled: r && !!i,
      }),
      { data: T } = l({
        address: e,
        abi: f,
        functionName: "decimals",
        enabled: r,
      }),
      { data: C, refetch: N } = l({
        address: e,
        abi: f,
        functionName: "allowance",
        args: i && a ? [i, a] : void 0,
        enabled: r && !!i && !!a,
      }),
      _ = p({ address: e, abi: f, functionName: "transfer" }),
      k = p({ address: e, abi: f, functionName: "approve" }),
      j = p({ address: e, abi: f, functionName: "transferFrom" }),
      A = p({ address: e, abi: f, functionName: "exchangeETHForTokens" });
    return {
      totalSupply: w,
      balance: x,
      allowance: C,
      transferReceipt: _.receipt,
      approveReceipt: k.receipt,
      transferFromReceipt: j.receipt,
      refetchBalance: v,
      refetchAllowance: N,
      transfer: async (e, t) => {
        if (!_.writeAsync) throw new Error("Transfer not available");
        const n = h(t);
        return await g(e, n), _.writeAsync({ args: [e, n] });
      },
      approve: async (e, t) => {
        if (!k.writeAsync) throw new Error("Approve not available");
        const n = h(t);
        return await g(b, void 0), k.writeAsync({ args: [e, n] });
      },
      transferFrom: async (e, t, n) => {
        if (!j.writeAsync) throw new Error("TransferFrom not available");
        const a = h(n);
        return await g(t, a), j.writeAsync({ args: [e, t, a] });
      },
      exchangeETHForTokens: async (e) => {
        if (!A.writeAsync) throw new Error("Exchange not available");
        return (
          await g(b, s.parseEther(e)),
          A.writeAsync({ value: s.parseEther(e), gas: m })
        );
      },
    };
  }),
  (exports.useWalletConnection = c),
  (exports.useWalletInfo = function () {
    const { address: e, connector: t, isConnected: a } = n.useAccount(),
      r = n.useChainId(),
      i = n.useChains().find((e) => e.id === r),
      { data: o } = n.useEnsName({ address: e }),
      { data: d, isLoading: u } = n.useBalance({ address: e }),
      c = d
        ? {
            value: d.value,
            formatted: s.formatEther(d.value),
            symbol: d.symbol,
            decimals: d.decimals,
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
      balance: c,
      isBalanceLoading: u,
    };
  });
