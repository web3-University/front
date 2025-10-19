'use strict';

var React = require('react');

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var reactJsxRuntime_development = {};

/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_development;

function requireReactJsxRuntime_development () {
	if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
	hasRequiredReactJsxRuntime_development = 1;
	"production" !== process.env.NODE_ENV &&
	  (function () {
	    function getComponentNameFromType(type) {
	      if (null == type) return null;
	      if ("function" === typeof type)
	        return type.$$typeof === REACT_CLIENT_REFERENCE
	          ? null
	          : type.displayName || type.name || null;
	      if ("string" === typeof type) return type;
	      switch (type) {
	        case REACT_FRAGMENT_TYPE:
	          return "Fragment";
	        case REACT_PROFILER_TYPE:
	          return "Profiler";
	        case REACT_STRICT_MODE_TYPE:
	          return "StrictMode";
	        case REACT_SUSPENSE_TYPE:
	          return "Suspense";
	        case REACT_SUSPENSE_LIST_TYPE:
	          return "SuspenseList";
	        case REACT_ACTIVITY_TYPE:
	          return "Activity";
	      }
	      if ("object" === typeof type)
	        switch (
	          ("number" === typeof type.tag &&
	            console.error(
	              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
	            ),
	          type.$$typeof)
	        ) {
	          case REACT_PORTAL_TYPE:
	            return "Portal";
	          case REACT_CONTEXT_TYPE:
	            return (type.displayName || "Context") + ".Provider";
	          case REACT_CONSUMER_TYPE:
	            return (type._context.displayName || "Context") + ".Consumer";
	          case REACT_FORWARD_REF_TYPE:
	            var innerType = type.render;
	            type = type.displayName;
	            type ||
	              ((type = innerType.displayName || innerType.name || ""),
	              (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
	            return type;
	          case REACT_MEMO_TYPE:
	            return (
	              (innerType = type.displayName || null),
	              null !== innerType
	                ? innerType
	                : getComponentNameFromType(type.type) || "Memo"
	            );
	          case REACT_LAZY_TYPE:
	            innerType = type._payload;
	            type = type._init;
	            try {
	              return getComponentNameFromType(type(innerType));
	            } catch (x) {}
	        }
	      return null;
	    }
	    function testStringCoercion(value) {
	      return "" + value;
	    }
	    function checkKeyStringCoercion(value) {
	      try {
	        testStringCoercion(value);
	        var JSCompiler_inline_result = !1;
	      } catch (e) {
	        JSCompiler_inline_result = true;
	      }
	      if (JSCompiler_inline_result) {
	        JSCompiler_inline_result = console;
	        var JSCompiler_temp_const = JSCompiler_inline_result.error;
	        var JSCompiler_inline_result$jscomp$0 =
	          ("function" === typeof Symbol &&
	            Symbol.toStringTag &&
	            value[Symbol.toStringTag]) ||
	          value.constructor.name ||
	          "Object";
	        JSCompiler_temp_const.call(
	          JSCompiler_inline_result,
	          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
	          JSCompiler_inline_result$jscomp$0
	        );
	        return testStringCoercion(value);
	      }
	    }
	    function getTaskName(type) {
	      if (type === REACT_FRAGMENT_TYPE) return "<>";
	      if (
	        "object" === typeof type &&
	        null !== type &&
	        type.$$typeof === REACT_LAZY_TYPE
	      )
	        return "<...>";
	      try {
	        var name = getComponentNameFromType(type);
	        return name ? "<" + name + ">" : "<...>";
	      } catch (x) {
	        return "<...>";
	      }
	    }
	    function getOwner() {
	      var dispatcher = ReactSharedInternals.A;
	      return null === dispatcher ? null : dispatcher.getOwner();
	    }
	    function UnknownOwner() {
	      return Error("react-stack-top-frame");
	    }
	    function hasValidKey(config) {
	      if (hasOwnProperty.call(config, "key")) {
	        var getter = Object.getOwnPropertyDescriptor(config, "key").get;
	        if (getter && getter.isReactWarning) return false;
	      }
	      return void 0 !== config.key;
	    }
	    function defineKeyPropWarningGetter(props, displayName) {
	      function warnAboutAccessingKey() {
	        specialPropKeyWarningShown ||
	          ((specialPropKeyWarningShown = true),
	          console.error(
	            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
	            displayName
	          ));
	      }
	      warnAboutAccessingKey.isReactWarning = true;
	      Object.defineProperty(props, "key", {
	        get: warnAboutAccessingKey,
	        configurable: true
	      });
	    }
	    function elementRefGetterWithDeprecationWarning() {
	      var componentName = getComponentNameFromType(this.type);
	      didWarnAboutElementRef[componentName] ||
	        ((didWarnAboutElementRef[componentName] = true),
	        console.error(
	          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
	        ));
	      componentName = this.props.ref;
	      return void 0 !== componentName ? componentName : null;
	    }
	    function ReactElement(
	      type,
	      key,
	      self,
	      source,
	      owner,
	      props,
	      debugStack,
	      debugTask
	    ) {
	      self = props.ref;
	      type = {
	        $$typeof: REACT_ELEMENT_TYPE,
	        type: type,
	        key: key,
	        props: props,
	        _owner: owner
	      };
	      null !== (void 0 !== self ? self : null)
	        ? Object.defineProperty(type, "ref", {
	            enumerable: false,
	            get: elementRefGetterWithDeprecationWarning
	          })
	        : Object.defineProperty(type, "ref", { enumerable: false, value: null });
	      type._store = {};
	      Object.defineProperty(type._store, "validated", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: 0
	      });
	      Object.defineProperty(type, "_debugInfo", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: null
	      });
	      Object.defineProperty(type, "_debugStack", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: debugStack
	      });
	      Object.defineProperty(type, "_debugTask", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: debugTask
	      });
	      Object.freeze && (Object.freeze(type.props), Object.freeze(type));
	      return type;
	    }
	    function jsxDEVImpl(
	      type,
	      config,
	      maybeKey,
	      isStaticChildren,
	      source,
	      self,
	      debugStack,
	      debugTask
	    ) {
	      var children = config.children;
	      if (void 0 !== children)
	        if (isStaticChildren)
	          if (isArrayImpl(children)) {
	            for (
	              isStaticChildren = 0;
	              isStaticChildren < children.length;
	              isStaticChildren++
	            )
	              validateChildKeys(children[isStaticChildren]);
	            Object.freeze && Object.freeze(children);
	          } else
	            console.error(
	              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
	            );
	        else validateChildKeys(children);
	      if (hasOwnProperty.call(config, "key")) {
	        children = getComponentNameFromType(type);
	        var keys = Object.keys(config).filter(function (k) {
	          return "key" !== k;
	        });
	        isStaticChildren =
	          0 < keys.length
	            ? "{key: someKey, " + keys.join(": ..., ") + ": ...}"
	            : "{key: someKey}";
	        didWarnAboutKeySpread[children + isStaticChildren] ||
	          ((keys =
	            0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}"),
	          console.error(
	            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
	            isStaticChildren,
	            children,
	            keys,
	            children
	          ),
	          (didWarnAboutKeySpread[children + isStaticChildren] = true));
	      }
	      children = null;
	      void 0 !== maybeKey &&
	        (checkKeyStringCoercion(maybeKey), (children = "" + maybeKey));
	      hasValidKey(config) &&
	        (checkKeyStringCoercion(config.key), (children = "" + config.key));
	      if ("key" in config) {
	        maybeKey = {};
	        for (var propName in config)
	          "key" !== propName && (maybeKey[propName] = config[propName]);
	      } else maybeKey = config;
	      children &&
	        defineKeyPropWarningGetter(
	          maybeKey,
	          "function" === typeof type
	            ? type.displayName || type.name || "Unknown"
	            : type
	        );
	      return ReactElement(
	        type,
	        children,
	        self,
	        source,
	        getOwner(),
	        maybeKey,
	        debugStack,
	        debugTask
	      );
	    }
	    function validateChildKeys(node) {
	      "object" === typeof node &&
	        null !== node &&
	        node.$$typeof === REACT_ELEMENT_TYPE &&
	        node._store &&
	        (node._store.validated = 1);
	    }
	    var React$1 = React,
	      REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	      REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	      REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	      REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	      REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	      REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	      REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	      REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	      REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
	      REACT_MEMO_TYPE = Symbol.for("react.memo"),
	      REACT_LAZY_TYPE = Symbol.for("react.lazy"),
	      REACT_ACTIVITY_TYPE = Symbol.for("react.activity"),
	      REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"),
	      ReactSharedInternals =
	        React$1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	      hasOwnProperty = Object.prototype.hasOwnProperty,
	      isArrayImpl = Array.isArray,
	      createTask = console.createTask
	        ? console.createTask
	        : function () {
	            return null;
	          };
	    React$1 = {
	      "react-stack-bottom-frame": function (callStackForError) {
	        return callStackForError();
	      }
	    };
	    var specialPropKeyWarningShown;
	    var didWarnAboutElementRef = {};
	    var unknownOwnerDebugStack = React$1["react-stack-bottom-frame"].bind(
	      React$1,
	      UnknownOwner
	    )();
	    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
	    var didWarnAboutKeySpread = {};
	    reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
	    reactJsxRuntime_development.jsx = function (type, config, maybeKey, source, self) {
	      var trackActualOwner =
	        1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
	      return jsxDEVImpl(
	        type,
	        config,
	        maybeKey,
	        false,
	        source,
	        self,
	        trackActualOwner
	          ? Error("react-stack-top-frame")
	          : unknownOwnerDebugStack,
	        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
	      );
	    };
	    reactJsxRuntime_development.jsxs = function (type, config, maybeKey, source, self) {
	      var trackActualOwner =
	        1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
	      return jsxDEVImpl(
	        type,
	        config,
	        maybeKey,
	        true,
	        source,
	        self,
	        trackActualOwner
	          ? Error("react-stack-top-frame")
	          : unknownOwnerDebugStack,
	        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
	      );
	    };
	  })();
	return reactJsxRuntime_development;
}

if (process.env.NODE_ENV === 'production') {
  jsxRuntime.exports = requireReactJsxRuntime_production();
} else {
  jsxRuntime.exports = requireReactJsxRuntime_development();
}

var jsxRuntimeExports = jsxRuntime.exports;

const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    fontWeight: 500,
    transition: "all 0.2s",
    cursor: "pointer",
    border: "none",
    outline: "none",
};
const variantStyles = {
    primary: {
        backgroundColor: "#2563eb",
        color: "#ffffff",
    },
    secondary: {
        backgroundColor: "#4b5563",
        color: "#ffffff",
    },
    outline: {
        backgroundColor: "transparent",
        color: "#2563eb",
        border: "2px solid #2563eb",
    },
    ghost: {
        backgroundColor: "transparent",
        color: "#2563eb",
    },
    danger: {
        backgroundColor: "#dc2626",
        color: "#ffffff",
    },
};
const variantHoverStyles = {
    primary: {
        backgroundColor: "#1d4ed8",
    },
    secondary: {
        backgroundColor: "#374151",
    },
    outline: {
        backgroundColor: "#eff6ff",
    },
    ghost: {
        backgroundColor: "#eff6ff",
    },
    danger: {
        backgroundColor: "#b91c1c",
    },
};
const sizeStyles = {
    sm: {
        height: "32px",
        padding: "0 12px",
        fontSize: "14px",
    },
    md: {
        height: "40px",
        padding: "0 16px",
        fontSize: "16px",
    },
    lg: {
        height: "48px",
        padding: "0 24px",
        fontSize: "18px",
    },
};
const disabledStyles = {
    opacity: 0.5,
    cursor: "not-allowed",
    pointerEvents: "none",
};
const ButtonCva = React.forwardRef(({ variant = "primary", size = "md", style, children, disabled, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const buttonStyle = {
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...(isHovered && !disabled ? variantHoverStyles[variant] : {}),
        ...(disabled ? disabledStyles : {}),
        ...style,
    };
    return (jsxRuntimeExports.jsx("button", { ref: ref, style: buttonStyle, disabled: disabled, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), ...props, children: children }));
});
ButtonCva.displayName = "ButtonCva";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Icon = React.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => React.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => React.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const createLucideIcon = (iconName, iconNode) => {
  const Component = React.forwardRef(
    ({ className, ...props }, ref) => React.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$3 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$3);

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Clock = createLucideIcon("clock", __iconNode$2);

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$1);

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
const Wallet = createLucideIcon("wallet", __iconNode);

const CourseCard = (props) => {
    const { course, onDetail, clickable = true, children } = props;
    // 添加安全检查
    if (!course) {
        console.error("CourseCard: course prop is required");
        return null;
    }
    const handleCardClick = (e) => {
        // 如果点击的是按钮区域，不触发卡片点击
        if (e.target.closest('[data-slot="actions"]')) {
            return;
        }
        if (clickable && onDetail) {
            onDetail(course);
        }
    };
    // 根据课程类别获取对应的美观颜色方案
    const getCategoryColors = (category) => {
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes("区块链") ||
            categoryLower.includes("blockchain") ||
            categoryLower.includes("web3")) {
            return "from-emerald-400 via-teal-500 to-cyan-600";
        }
        if (categoryLower.includes("编程") ||
            categoryLower.includes("开发") ||
            categoryLower.includes("programming") ||
            categoryLower.includes("development")) {
            return "from-blue-500 via-indigo-600 to-purple-700";
        }
        if (categoryLower.includes("数据") ||
            categoryLower.includes("分析") ||
            categoryLower.includes("data") ||
            categoryLower.includes("analytics")) {
            return "from-orange-400 via-red-500 to-pink-600";
        }
        if (categoryLower.includes("用户") ||
            categoryLower.includes("ui") ||
            categoryLower.includes("ux") ||
            categoryLower.includes("设计")) {
            return "from-violet-500 via-purple-600 to-fuchsia-700";
        }
        if (categoryLower.includes("人工智能") ||
            categoryLower.includes("ai") ||
            categoryLower.includes("机器学习") ||
            categoryLower.includes("ml")) {
            return "from-green-400 via-emerald-500 to-teal-600";
        }
        if (categoryLower.includes("安全") ||
            categoryLower.includes("security") ||
            categoryLower.includes("网络")) {
            return "from-red-500 via-rose-600 to-pink-700";
        }
        // 默认渐变色 - 优雅的蓝紫色渐变
        return "from-indigo-500 via-purple-600 to-blue-700";
    };
    // 难度级别映射
    const getDifficultyLabel = (difficulty) => {
        switch (difficulty) {
            case "1":
                return {
                    label: "初级",
                    color: "text-green-600",
                    bgColor: "bg-green-100",
                };
            case "2":
                return {
                    label: "中级",
                    color: "text-blue-600",
                    bgColor: "bg-blue-100",
                };
            case "3":
                return {
                    label: "高级",
                    color: "text-purple-600",
                    bgColor: "bg-purple-100",
                };
            default:
                return {
                    label: "初级",
                    color: "text-green-600",
                    bgColor: "bg-green-100",
                };
        }
    };
    // 格式化时长
    const formatDuration = (duration) => {
        if (!duration)
            return "未知时长";
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        if (hours > 0) {
            return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
        }
        return `${minutes}分钟`;
    };
    const difficultyInfo = getDifficultyLabel(course.difficulty);
    return (jsxRuntimeExports.jsxs("article", { onClick: handleCardClick, className: `group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#F7F5FF] pb-6 shadow-[0_22px_60px_rgba(168,174,255,0.22)] ring-1 ring-[#ECEBFF] transition-transform duration-200 hover:-translate-y-2 ${clickable ? "cursor-pointer" : ""}`, children: [jsxRuntimeExports.jsx("div", { className: "relative h-48 w-full overflow-hidden rounded-2xl", children: course.cover ? (
                /* 有封面图片时显示图片 */
                jsxRuntimeExports.jsx("img", { src: course.cover, alt: course.title || "课程封面", className: "h-full w-full object-cover" })) : (
                /* 没有封面图片时显示简洁的默认背景 */
                jsxRuntimeExports.jsx("div", { className: `h-full w-full bg-gradient-to-br ${course.coverColor || getCategoryColors(course.category)}` })) }), jsxRuntimeExports.jsxs("div", { className: `relative h-8 w-full overflow-hidden rounded-2xl bg-gradient-to-br px-3 ${course.coverColor || "from-gray-400 to-gray-600"}`, children: [jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-4 inline-flex rounded-full bg-white/90 py-1 text-xs font-semibold text-[#2B2558]", children: course.category || "未分类" }), course.difficulty && (jsxRuntimeExports.jsxs("span", { className: `absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${difficultyInfo.bgColor} ${difficultyInfo.color}`, children: [jsxRuntimeExports.jsx(ChartColumn, { className: "h-3 w-3" }), difficultyInfo.label] }))] }), jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-4 pt-6 text-left px-3", children: [jsxRuntimeExports.jsxs("div", { children: [jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-[#2B2558] line-clamp-2", children: course.title || "未命名课程" }), course.description && (jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-[#7B7EA9] line-clamp-2", children: course.description }))] }), jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-[#8F92B5] px-3", children: [jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [course.duration && (jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }), jsxRuntimeExports.jsx("span", { children: formatDuration(course.duration) })] })), jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[#F5B742]", children: [jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-[#F5B742] text-[#F5B742]" }), jsxRuntimeExports.jsx("span", { className: "font-semibold", children: (course.rating || 0).toFixed(1) }), jsxRuntimeExports.jsxs("span", { className: "text-[#8F92B5]", children: ["(", course.students || 0, "\u4EBA)"] })] })] }), jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[#FF9F50]", children: [jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }), jsxRuntimeExports.jsxs("span", { className: "text-base font-semibold", children: ["YD ", course.price || 0] })] })] }), children && jsxRuntimeExports.jsx("div", { "data-slot": "actions", children: children })] })] }, course.id));
};

exports.ButtonCva = ButtonCva;
exports.CourseCard = CourseCard;
//# sourceMappingURL=index.js.map
