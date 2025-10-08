"use strict";
var e = require("react/jsx-runtime"),
  t = require("react"),
  n = require("wagmi"),
  a = require("@rainbow-me/rainbowkit"),
  i = require("@tanstack/react-query"),
  r = require("wagmi/chains");
require("@rainbow-me/rainbowkit/styles.css");
var s = require("viem");
const o = [r.mainnet, r.sepolia];
r.mainnet.id,
  r.sepolia.id,
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
  d = new i.QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: !1, retry: !1 } },
  });
function c() {
  const {
      address: e,
      connector: t,
      isConnected: a,
      isConnecting: i,
      isReconnecting: r,
    } = n.useAccount(),
    s = n.useChainId(),
    o = n.useChains(),
    { connect: u, connectors: d } = n.useConnect(),
    { reconnect: c } = n.useReconnect(),
    { disconnect: p } = n.useDisconnect(),
    l = o.find((e) => e.id === s);
  return {
    isConnected: a,
    isConnecting: i,
    isReconnecting: r,
    address: e,
    connector: t ? { id: t.id, name: t.name, type: t.type } : void 0,
    chain: l,
    chains: o,
    connect: (e) => {
      if (e) {
        const t = d.find((t) => t.id === e);
        t && u({ connector: t });
      } else {
        const e = d[0];
        e && u({ connector: e });
      }
    },
    reconnect: (e) => {
      c(e);
    },
    disconnect: () => {
      p();
    },
  };
}
function p({
  address: e,
  abi: t,
  functionName: a,
  args: i,
  chainId: r,
  enabled: s = !0,
  cacheTime: o = 0,
  staleTime: u = 0,
}) {
  const { data: d, ...c } = n.useReadContract({
    address: e,
    abi: t,
    functionName: a,
    args: i,
    chainId: r,
    query: { enabled: s, gcTime: o, staleTime: u },
  });
  return { data: d, ...c };
}
function l({
  address: e,
  abi: t,
  functionName: a,
  args: i,
  value: r,
  chainId: s,
  enabled: o = !0,
  gasLimit: u,
}) {
  const {
    writeContract: d,
    writeContractAsync: c,
    ...p
  } = n.useWriteContract();
  return {
    write: (n) => {
      o &&
        d({
          address: e,
          abi: t,
          functionName: a,
          args: n?.args || i,
          value: n?.value || r,
          chainId: s,
          gas: n?.gas || u,
        });
    },
    writeAsync: async (n) => {
      if (o)
        return await c({
          address: e,
          abi: t,
          functionName: a,
          args: n?.args || i,
          value: n?.value || r,
          chainId: s,
          gas: n?.gas || u,
        });
    },
    receipt: n.useWaitForTransactionReceipt({
      hash: p.data,
      query: { enabled: !!p.data },
    }),
    ...p,
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
const b = "0xA812265c869F2BCB755980677812F253459A0cc7";
function h(e, t) {
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
h(
  ".profile__menu-wrapper{position:relative}.profile__menu-trigger{align-items:center;background-color:rgba(22,163,74,.1);border:1px solid rgba(34,197,94,.3);border-radius:.5rem;cursor:pointer;display:flex;height:40px;justify-content:center;transition:all .2s ease;width:40px}.profile__avatar{background-color:oklch(.546 .245 262.881);border-radius:50%;color:#fff}.profile__menu-trigger:hover{background-color:oklch(.65 .2 265.15)}.profile__dropdown-menu{animation:slideDown .2s ease;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.1);min-width:180px;padding:8px;position:absolute;right:0;top:calc(100% + 8px);z-index:1000}@keyframes slideDown{0%{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}.profile__menu-item{align-items:center;background:transparent;border:none;border-radius:8px;color:#1e293b;cursor:pointer;display:flex;font-size:14px;font-weight:500;gap:12px;padding:10px 12px;text-align:left;transition:all .2s ease;width:100%}.profile__menu-item:hover{background-color:#f1f5f9}.profile__menu-item svg{flex-shrink:0}.profile__menu-item--danger{color:#ef4444}.profile__menu-item--danger:hover{background-color:#fef2f2}",
);
const g = ({ openAccountModal: n }) => {
  const [a, i] = t.useState(!1),
    r = t.useRef(null),
    { disconnect: s } = c();
  t.useEffect(() => {
    const e = (e) => {
      r.current && !r.current.contains(e.target) && i(!1);
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
    ref: r,
    children: [
      e.jsx("button", {
        onClick: () => i(!a),
        type: "button",
        className: "profile__menu-trigger profile__avatar",
        "aria-label": "Account menu",
        children: e.jsxs("svg", {
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
            e.jsx("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
            e.jsx("circle", { cx: "12", cy: "7", r: "4" }),
          ],
        }),
      }),
      a &&
        e.jsxs("div", {
          className: "profile__dropdown-menu",
          children: [
            e.jsxs("button", {
              onClick: () => {
                i(!1), n();
              },
              className: "profile__menu-item",
              children: [
                e.jsxs("svg", {
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
                    e.jsx("path", {
                      d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
                    }),
                    e.jsx("circle", { cx: "12", cy: "7", r: "4" }),
                  ],
                }),
                e.jsx("span", { children: "Profile" }),
              ],
            }),
            e.jsxs("button", {
              onClick: () => {
                i(!1), s();
              },
              className: "profile__menu-item profile__menu-item--danger",
              children: [
                e.jsxs("svg", {
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
                    e.jsx("path", {
                      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
                    }),
                    e.jsx("polyline", { points: "16 17 21 12 16 7" }),
                    e.jsx("line", { x1: "21", y1: "12", x2: "9", y2: "12" }),
                  ],
                }),
                e.jsx("span", { children: "Logout" }),
              ],
            }),
          ],
        }),
    ],
  });
};
h(
  ".wallet-button{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.wallet-button__container{align-items:center;display:flex;gap:8px;height:44px;justify-content:center}.wallet-button__connect{background:linear-gradient(90deg,#eab308,#f97316);border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__connect:hover{box-shadow:0 4px 12px rgba(102,126,234,.4);transform:translateY(-1px)}.wallet-button__wrong-network{background:#ff6b6b;border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;font-weight:600;padding:12px 24px;transition:all .2s ease}.wallet-button__wrong-network:hover{background:#ff5252}.wallet-button__connected{align-items:center;display:flex;gap:16px}.wallet-button__chain{align-items:center;background:oklch(.424 .199 265.638);border:1px solid #e2e8f0;border-radius:10px;color:#475569;display:flex;font-size:13px;font-weight:500;gap:1em;padding:8px 12px;transition:all .2s ease}.wallet-button__chain-icon{align-items:center;border-radius:.5rem;display:flex;gap:.5rem}.wallet-button__icon{align-items:center;background:linear-gradient(90deg,#facc15,#f97316);border-radius:50%;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.wallet-button__balance{color:#fff;font-size:1rem;font-weight:600}.wallet-button__account{align-items:center;background-color:rgba(22,163,74,.2);border:1px solid rgba(34,197,94,.3);border-radius:.5rem;display:flex;gap:.5rem;height:40px;justify-content:space-evenly;min-width:150px;padding:0 12px}.wallet-button__status-bot{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;background-color:#4ade80;border-radius:9999px;height:.5rem;width:.5rem}.wallet-icon{color:#4ade80;height:1rem;width:1rem}.wallet-button__address{color:#4ade80;font-size:.875rem;font-weight:600}",
);
(exports.WalletButton = ({
  label: t = "连接钱包",
  showBalance: n = !0,
  showChainName: i = !0,
  className: r = "",
  size: s = "medium",
}) =>
  e.jsx("div", {
    className: `wallet-button wallet-button--${s} ${r}`,
    children: e.jsx(a.ConnectButton.Custom, {
      children: ({
        account: a,
        chain: r,
        openAccountModal: s,
        openConnectModal: o,
        authenticationStatus: u,
        mounted: d,
      }) => {
        const c =
          d && "loading" !== u && a && r && (!u || "authenticated" === u);
        return e.jsx("div", {
          className: "wallet-button__container",
          children: c
            ? e.jsxs("div", {
                className: "wallet-button__connected",
                children: [
                  i &&
                    e.jsxs("div", {
                      className: "wallet-button__chain",
                      children: [
                        r.iconUrl &&
                          e.jsx("div", {
                            className: "wallet-button__chain-icon",
                            children: e.jsx("img", {
                              alt: r.name ?? "Chain icon",
                              src: r.iconUrl,
                              className: "wallet-button__icon",
                            }),
                          }),
                        n &&
                          a.displayBalance &&
                          e.jsx("span", {
                            className: "wallet-button__balance",
                            children: a.displayBalance,
                          }),
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
                  e.jsx(g, { openAccountModal: s }),
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
    children: r,
    theme: s = "auto",
    queryClient: c = d,
    initialState: p,
    ...l
  }) {
    const { config: y } = t.useMemo(
        () =>
          (function (e) {
            const {
                appName: t = "APP_NAME",
                projectId: i = "YOUR_PROJECT_ID",
                alchemyApiKey: r,
                infuraApiKey: s,
              } = e,
              u = o.reduce((e, t) => {
                let a = "";
                return (
                  r &&
                    (a = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.g.alchemy.com/v2/${r}`),
                  s &&
                    (a = `https://${t.name.toLowerCase().replace(/\s+/g, "-")}.infura.io/v3/${s}`),
                  (e[t.id] = a ? n.http(a) : n.http()),
                  e
                );
              }, {});
            return {
              config: a.getDefaultConfig({
                appName: t,
                projectId: i,
                chains: o,
                ssr: !0,
                storage: n.createStorage({ storage: n.cookieStorage }),
              }),
              transports: u,
            };
          })(l),
        [l.appName, l.projectId, l.alchemyApiKey, l.infuraApiKey],
      ),
      m = t.useMemo(() => u, [s]);
    return e.jsx(n.WagmiProvider, {
      config: y,
      reconnectOnMount: !0,
      initialState: p,
      children: e.jsx(i.QueryClientProvider, {
        client: c,
        children: e.jsx(a.RainbowKitProvider, {
          theme: m,
          modalSize: "compact",
          showRecentTransactions: !0,
          children: r,
        }),
      }),
    });
  }),
  (exports.useCourseContract = function ({
    address: e = "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d",
    tokenDecimals: t = 18,
  }) {
    const n = l({ address: e, abi: m, functionName: "createCourse" }),
      a = l({ address: e, abi: m, functionName: "purchaseCourse" });
    return {
      createCourseReceipt: n.receipt,
      purchaseCourseReceipt: a.receipt,
      hasAccess: (t, n) => {
        const a = Boolean(t && n);
        return p({
          address: e,
          abi: m,
          functionName: "hasAccess",
          args: a ? [t, n] : void 0,
          enabled: a,
        });
      },
      getCourse: (t) =>
        p({
          address: e,
          abi: m,
          functionName: "getCourse",
          args: t ? [t] : void 0,
          enabled: !0,
        }),
      getStudentCourses: (t) =>
        p({
          address: e,
          abi: m,
          functionName: "getStudentCourses",
          args: t ? [t] : void 0,
          enabled: !0,
        }),
      getCourseStudents: (t) =>
        p({
          address: e,
          abi: m,
          functionName: "getCourseStudents",
          args: t ? [t] : void 0,
          enabled: !0,
        }),
      getInstructorCourses: (t) =>
        p({
          address: e,
          abi: m,
          functionName: "getInstructorCourses",
          args: t ? [t] : void 0,
          enabled: !0,
        }),
      getTotalCourses: () =>
        p({ address: e, abi: m, functionName: "getTotalCourses", enabled: !0 }),
      getCourseStudentCount: (t) =>
        p({
          address: e,
          abi: m,
          functionName: "getCourseStudentCount",
          args: [t],
          enabled: !0,
        }),
      batchCheckAccess: (t, n) =>
        p({
          address: e,
          abi: m,
          functionName: "batchCheckAccess",
          args: [t, n],
          enabled: !0,
        }),
      createCourse: async (e, a, i) => {
        if (!n.writeAsync) throw new Error("创建课程方法未创建");
        const r = ((e) => s.parseUnits(e, t))(i);
        return n.writeAsync({ args: [e, a, r] });
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
    const { address: i } = n.useAccount(),
      r = (e) => {
        if (!c) throw new Error("Decimals not loaded");
        return s.parseUnits(e, c);
      },
      { data: o } = p({
        address: e,
        abi: y,
        functionName: "totalSupply",
        enabled: a,
      }),
      { data: u, refetch: d } = p({
        address: e,
        abi: y,
        functionName: "balanceOf",
        args: i ? [i] : void 0,
        enabled: a && !!i,
      }),
      { data: c } = p({
        address: e,
        abi: y,
        functionName: "decimals",
        enabled: a,
      }),
      { data: m, refetch: f } = p({
        address: e,
        abi: y,
        functionName: "allowance",
        args: i && t ? [i, t] : void 0,
        enabled: a && !!i && !!t,
      }),
      b = l({ address: e, abi: y, functionName: "transfer" }),
      h = l({ address: e, abi: y, functionName: "approve" }),
      g = l({ address: e, abi: y, functionName: "transferFrom" });
    return {
      totalSupply: o,
      balance: u,
      allowance: m,
      transferReceipt: b.receipt,
      approveReceipt: h.receipt,
      transferFromReceipt: g.receipt,
      refetchBalance: d,
      refetchAllowance: f,
      transfer: async (e, t) => {
        if (!b.writeAsync) throw new Error("Transfer not available");
        const n = r(t);
        return b.writeAsync({ args: [e, n] });
      },
      approve: async (e, t) => {
        if (!h.writeAsync) throw new Error("Approve not available");
        const n = r(t);
        return h.writeAsync({ args: [e, n] });
      },
      transferFrom: async (e, t, n) => {
        if (!g.writeAsync) throw new Error("TransferFrom not available");
        const a = r(n);
        return g.writeAsync({ args: [e, t, a] });
      },
    };
  }),
  (exports.useNetworkSwitch = function () {
    const e = n.useChains(),
      t = n.useChainId(),
      a = e.find((e) => e.id === t),
      {
        switchChain: i,
        isPending: r,
        error: s,
        isSuccess: o,
        reset: u,
      } = n.useSwitchChain();
    return {
      currentChain: a,
      switchToNetwork: (e) => {
        if (!i) throw new Error("❌Network switching not supported");
        try {
          i({ chainId: e.chainId });
        } catch (e) {
          throw e;
        }
      },
      isPending: r,
      error: s,
      isSuccess: o,
      reset: u,
      isCurrentChain: (e) => t === e,
      canSwitchNetwork: !!i,
    };
  }),
  (exports.useSimpleYDToken = function ({
    address: e = b,
    spenderAddress: a,
    enabled: i = !0,
  }) {
    const { address: r } = n.useAccount(),
      [o, u] = t.useState(),
      [d, c] = t.useState(),
      { data: y, refetch: m } = n.useEstimateGas({
        account: r,
        to: o,
        value: d,
        query: { enabled: !1 },
      }),
      h = (e) => {
        if (!T) throw new Error("Decimals not loaded");
        return s.parseUnits(e, T);
      },
      g = async (e, t) => {
        u(e),
          c(t),
          await new Promise((e) => setTimeout(e, 0)),
          await m(),
          u(void 0),
          c(void 0);
      },
      { data: w } = p({
        address: e,
        abi: f,
        functionName: "totalSupply",
        enabled: i,
      }),
      { data: x, refetch: v } = p({
        address: e,
        abi: f,
        functionName: "balanceOf",
        args: r ? [r] : void 0,
        enabled: i && !!r,
      }),
      { data: T } = p({
        address: e,
        abi: f,
        functionName: "decimals",
        enabled: i,
      }),
      { data: C, refetch: _ } = p({
        address: e,
        abi: f,
        functionName: "allowance",
        args: r && a ? [r, a] : void 0,
        enabled: i && !!r && !!a,
      }),
      k = l({ address: e, abi: f, functionName: "transfer" }),
      N = l({ address: e, abi: f, functionName: "approve" }),
      A = l({ address: e, abi: f, functionName: "transferFrom" }),
      M = l({ address: e, abi: f, functionName: "exchangeETHForTokens" });
    return {
      totalSupply: w,
      balance: x,
      allowance: C,
      transferReceipt: k.receipt,
      approveReceipt: N.receipt,
      transferFromReceipt: A.receipt,
      refetchBalance: v,
      refetchAllowance: _,
      transfer: async (e, t) => {
        if (!k.writeAsync) throw new Error("Transfer not available");
        const n = h(t);
        return await g(e, n), k.writeAsync({ args: [e, n] });
      },
      approve: async (e, t) => {
        if (!N.writeAsync) throw new Error("Approve not available");
        const n = h(t);
        return await g(b, void 0), N.writeAsync({ args: [e, n] });
      },
      transferFrom: async (e, t, n) => {
        if (!A.writeAsync) throw new Error("TransferFrom not available");
        const a = h(n);
        return await g(t, a), A.writeAsync({ args: [e, t, a] });
      },
      exchangeETHForTokens: async (e) => {
        if (!M.writeAsync) throw new Error("Exchange not available");
        return (
          await g(b, s.parseEther(e)),
          M.writeAsync({ value: s.parseEther(e), gas: y })
        );
      },
    };
  }),
  (exports.useWalletConnection = c),
  (exports.useWalletInfo = function () {
    const { address: e, connector: t, isConnected: a } = n.useAccount(),
      i = n.useChainId(),
      r = n.useChains().find((e) => e.id === i),
      { data: o } = n.useEnsName({ address: e }),
      { data: u, isLoading: d } = n.useBalance({ address: e }),
      c = u
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
      chainId: i,
      connector: t
        ? { id: t.id, name: t.name, type: t.type, icon: t.icon }
        : void 0,
      chain: r,
      balance: c,
      isBalanceLoading: d,
    };
  });
