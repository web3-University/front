import { j as n } from "./jsx-runtime-D_zvdyIk.js";
import { f as oe, w as ne, u as C, e as c } from "./index-DtL3pAzF.js";
import { R as k } from "./index-D4lIrffr.js";
var te = { exports: {} },
  u = {}; /**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var w;
function se() {
  if (w) return u;
  w = 1;
  var o = Symbol.for("react.transitional.element"),
    s = Symbol.for("react.fragment");
  function i(a, e, r) {
    var l = null;
    if (
      (r !== void 0 && (l = "" + r),
      e.key !== void 0 && (l = "" + e.key),
      "key" in e)
    ) {
      r = {};
      for (var d in e) d !== "key" && (r[d] = e[d]);
    } else r = e;
    return (
      (e = r.ref),
      { $$typeof: o, type: a, key: l, ref: e !== void 0 ? e : null, props: r }
    );
  }
  return (u.Fragment = s), (u.jsx = i), (u.jsxs = i), u;
}
te.exports = se();
var ie = te.exports;
const ce = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    fontWeight: 500,
    transition: "all 0.2s",
    cursor: "pointer",
    border: "none",
    outline: "none",
  },
  le = {
    primary: { backgroundColor: "#2563eb", color: "#ffffff" },
    secondary: { backgroundColor: "#4b5563", color: "#ffffff" },
    outline: {
      backgroundColor: "transparent",
      color: "#2563eb",
      border: "2px solid #2563eb",
    },
    ghost: { backgroundColor: "transparent", color: "#2563eb" },
    danger: { backgroundColor: "#dc2626", color: "#ffffff" },
  },
  de = {
    primary: { backgroundColor: "#1d4ed8" },
    secondary: { backgroundColor: "#374151" },
    outline: { backgroundColor: "#eff6ff" },
    ghost: { backgroundColor: "#eff6ff" },
    danger: { backgroundColor: "#b91c1c" },
  },
  ue = {
    sm: { height: "32px", padding: "0 12px", fontSize: "14px" },
    md: { height: "40px", padding: "0 16px", fontSize: "16px" },
    lg: { height: "48px", padding: "0 24px", fontSize: "18px" },
  },
  pe = { opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" },
  t = k.forwardRef(
    (
      {
        variant: o = "primary",
        size: s = "md",
        style: i,
        children: a,
        disabled: e,
        ...r
      },
      l,
    ) => {
      const [d, S] = k.useState(!1),
        re = {
          ...ce,
          ...le[o],
          ...ue[s],
          ...(d && !e ? de[o] : {}),
          ...(e ? pe : {}),
          ...i,
        };
      return ie.jsx("button", {
        ref: l,
        style: re,
        disabled: e,
        onMouseEnter: () => S(!0),
        onMouseLeave: () => S(!1),
        ...r,
        children: a,
      });
    },
  );
t.displayName = "ButtonCva";
t.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "ButtonCva",
  props: {
    variant: {
      defaultValue: { value: '"primary"', computed: !1 },
      required: !1,
    },
    size: { defaultValue: { value: '"md"', computed: !1 }, required: !1 },
  },
};
const ye = {
    title: "UI/ButtonCva",
    component: t,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
      variant: {
        control: "select",
        options: ["primary", "secondary", "outline", "ghost", "danger"],
      },
      size: { control: "select", options: ["sm", "md", "lg"] },
      disabled: { control: "boolean" },
    },
    args: { onClick: oe() },
  },
  p = {
    args: { children: "Primary Button", variant: "primary" },
    play: async ({ canvasElement: o, args: s }) => {
      const a = ne(o).getByRole("button");
      await C.click(a),
        await c(s.onClick).toHaveBeenCalled(),
        await C.hover(a),
        await c(a).toHaveStyle({ backgroundColor: "#1d4ed8" }),
        await C.unhover(a),
        await c(a).toHaveStyle({ backgroundColor: "#2563eb" });
    },
  },
  m = { args: { children: "Secondary Button", variant: "secondary" } },
  v = {
    args: { children: "Outline Button", variant: "secondary", size: "sm" },
  },
  g = { args: { children: "Ghost Button", variant: "secondary" } },
  y = { args: { children: "Danger Button", variant: "danger" } },
  f = { args: { children: "Small Button", size: "sm" } },
  h = { args: { children: "Medium Button", size: "sm" } },
  x = { args: { children: "Large Button", size: "lg" } },
  b = {
    args: { children: "Disabled Button", disabled: !0 },
    play: async ({ canvasElement: o, args: s }) => {
      const a = ne(o).getByRole("button");
      await c(a).toBeDisabled(),
        await c(a).toHaveStyle({ opacity: "0.5", cursor: "not-allowed" }),
        await c(s.onClick).not.toHaveBeenCalled();
    },
  },
  B = {
    render: () =>
      n.jsxs("div", {
        style: { display: "flex", gap: "1rem", flexDirection: "column" },
        children: [
          n.jsxs("div", {
            style: { display: "flex", gap: "0.5rem" },
            children: [
              n.jsx(t, { variant: "primary", children: "Primary" }),
              n.jsx(t, { variant: "secondary", children: "Secondary" }),
              n.jsx(t, { variant: "outline", children: "Outline" }),
              n.jsx(t, { variant: "ghost", children: "Ghost" }),
              n.jsx(t, { variant: "danger", children: "Danger" }),
            ],
          }),
          n.jsxs("div", {
            style: { display: "flex", gap: "0.5rem", alignItems: "center" },
            children: [
              n.jsx(t, { size: "sm", children: "Small" }),
              n.jsx(t, { size: "md", children: "Medium" }),
              n.jsx(t, { size: "lg", children: "Large" }),
            ],
          }),
        ],
      }),
  };
var E, j, z;
p.parameters = {
  ...p.parameters,
  docs: {
    ...((E = p.parameters) == null ? void 0 : E.docs),
    source: {
      originalSource: `{
  args: {
    children: "Primary Button",
    variant: "primary"
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test click functionality
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();

    // Test hover state
    await userEvent.hover(button);
    await expect(button).toHaveStyle({
      backgroundColor: "#1d4ed8"
    });
    await userEvent.unhover(button);
    await expect(button).toHaveStyle({
      backgroundColor: "#2563eb"
    });
  }
}`,
      ...((z = (j = p.parameters) == null ? void 0 : j.docs) == null
        ? void 0
        : z.source),
    },
  },
};
var R, D, H;
m.parameters = {
  ...m.parameters,
  docs: {
    ...((R = m.parameters) == null ? void 0 : R.docs),
    source: {
      originalSource: `{
  args: {
    children: "Secondary Button",
    variant: "secondary"
  }
}`,
      ...((H = (D = m.parameters) == null ? void 0 : D.docs) == null
        ? void 0
        : H.source),
    },
  },
};
var _, M, T;
v.parameters = {
  ...v.parameters,
  docs: {
    ...((_ = v.parameters) == null ? void 0 : _.docs),
    source: {
      originalSource: `{
  args: {
    children: "Outline Button",
    variant: "secondary",
    size: "sm"
  }
}`,
      ...((T = (M = v.parameters) == null ? void 0 : M.docs) == null
        ? void 0
        : T.source),
    },
  },
};
var P, L, G;
g.parameters = {
  ...g.parameters,
  docs: {
    ...((P = g.parameters) == null ? void 0 : P.docs),
    source: {
      originalSource: `{
  args: {
    children: "Ghost Button",
    variant: "secondary"
  }
}`,
      ...((G = (L = g.parameters) == null ? void 0 : L.docs) == null
        ? void 0
        : G.source),
    },
  },
};
var O, I, A;
y.parameters = {
  ...y.parameters,
  docs: {
    ...((O = y.parameters) == null ? void 0 : O.docs),
    source: {
      originalSource: `{
  args: {
    children: "Danger Button",
    variant: "danger"
  }
}`,
      ...((A = (I = y.parameters) == null ? void 0 : I.docs) == null
        ? void 0
        : A.source),
    },
  },
};
var q, V, J;
f.parameters = {
  ...f.parameters,
  docs: {
    ...((q = f.parameters) == null ? void 0 : q.docs),
    source: {
      originalSource: `{
  args: {
    children: "Small Button",
    size: "sm"
  }
}`,
      ...((J = (V = f.parameters) == null ? void 0 : V.docs) == null
        ? void 0
        : J.source),
    },
  },
};
var $, F, N;
h.parameters = {
  ...h.parameters,
  docs: {
    ...(($ = h.parameters) == null ? void 0 : $.docs),
    source: {
      originalSource: `{
  args: {
    children: "Medium Button",
    size: "sm"
  }
}`,
      ...((N = (F = h.parameters) == null ? void 0 : F.docs) == null
        ? void 0
        : N.source),
    },
  },
};
var Y, U, W;
x.parameters = {
  ...x.parameters,
  docs: {
    ...((Y = x.parameters) == null ? void 0 : Y.docs),
    source: {
      originalSource: `{
  args: {
    children: "Large Button",
    size: "lg"
  }
}`,
      ...((W = (U = x.parameters) == null ? void 0 : U.docs) == null
        ? void 0
        : W.source),
    },
  },
};
var Q, X, Z;
b.parameters = {
  ...b.parameters,
  docs: {
    ...((Q = b.parameters) == null ? void 0 : Q.docs),
    source: {
      originalSource: `{
  args: {
    children: "Disabled Button",
    disabled: true
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test disabled state
    await expect(button).toBeDisabled();
    await expect(button).toHaveStyle({
      opacity: "0.5",
      cursor: "not-allowed"
    });

    // onClick should not be called when disabled
    // (user-event can't click disabled buttons with pointer-events: none)
    await expect(args.onClick).not.toHaveBeenCalled();
  }
}`,
      ...((Z = (X = b.parameters) == null ? void 0 : X.docs) == null
        ? void 0
        : Z.source),
    },
  },
};
var K, ee, ae;
B.parameters = {
  ...B.parameters,
  docs: {
    ...((K = B.parameters) == null ? void 0 : K.docs),
    source: {
      originalSource: `{
  render: () => <div style={{
    display: "flex",
    gap: "1rem",
    flexDirection: "column"
  }}>
      <div style={{
      display: "flex",
      gap: "0.5rem"
    }}>
        <ButtonCva variant="primary">Primary</ButtonCva>
        <ButtonCva variant="secondary">Secondary</ButtonCva>
        <ButtonCva variant="outline">Outline</ButtonCva>
        <ButtonCva variant="ghost">Ghost</ButtonCva>
        <ButtonCva variant="danger">Danger</ButtonCva>
      </div>
      <div style={{
      display: "flex",
      gap: "0.5rem",
      alignItems: "center"
    }}>
        <ButtonCva size="sm">Small</ButtonCva>
        <ButtonCva size="md">Medium</ButtonCva>
        <ButtonCva size="lg">Large</ButtonCva>
      </div>
    </div>
}`,
      ...((ae = (ee = B.parameters) == null ? void 0 : ee.docs) == null
        ? void 0
        : ae.source),
    },
  },
};
const fe = [
  "Primary",
  "Secondary",
  "Outline",
  "Ghost",
  "Danger",
  "Small",
  "Medium",
  "Large",
  "Disabled",
  "AllVariants",
];
export {
  B as AllVariants,
  y as Danger,
  b as Disabled,
  g as Ghost,
  x as Large,
  h as Medium,
  v as Outline,
  p as Primary,
  m as Secondary,
  f as Small,
  fe as __namedExportsOrder,
  ye as default,
};
