var Ct = Object.defineProperty;
var Nt = (e, r, o) => r in e ? Ct(e, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[r] = o;
var W = (e, r, o) => Nt(e, typeof r != "symbol" ? r + "" : r, o);
import { jsx as n, jsxs as u, Fragment as Fe } from "react/jsx-runtime";
import { createContext as Ye, useContext as Ze, useState as y, useEffect as be, useMemo as kt, useRef as _t, useCallback as Be } from "react";
import { useOutletContext as St } from "react-router-dom";
import * as N from "lucide-react";
import { createPortal as We } from "react-dom";
const Tt = Ye(null);
function $t() {
  return Ze(Tt);
}
const At = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Re() {
  const e = $t(), r = St();
  return e || (r?.theme ? {
    theme: r.theme,
    setTheme: r.setTheme ?? (() => {
    }),
    language: r.language ?? "en",
    setLanguage: r.setLanguage ?? (() => {
    })
  } : At);
}
function Qe(e) {
  var r, o, t = "";
  if (typeof e == "string" || typeof e == "number") t += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var c = e.length;
    for (r = 0; r < c; r++) e[r] && (o = Qe(e[r])) && (t && (t += " "), t += o);
  } else for (o in e) e[o] && (t && (t += " "), t += o);
  return t;
}
function Pt() {
  for (var e, r, o = 0, t = "", c = arguments.length; o < c; o++) (e = arguments[o]) && (r = Qe(e)) && (t && (t += " "), t += r);
  return t;
}
const Ie = "-", Rt = (e) => {
  const r = Et(e), {
    conflictingClassGroups: o,
    conflictingClassGroupModifiers: t
  } = e;
  return {
    getClassGroupId: (s) => {
      const d = s.split(Ie);
      return d[0] === "" && d.length !== 1 && d.shift(), et(d, r) || It(s);
    },
    getConflictingClassGroupIds: (s, d) => {
      const m = o[s] || [];
      return d && t[s] ? [...m, ...t[s]] : m;
    }
  };
}, et = (e, r) => {
  if (e.length === 0)
    return r.classGroupId;
  const o = e[0], t = r.nextPart.get(o), c = t ? et(e.slice(1), t) : void 0;
  if (c)
    return c;
  if (r.validators.length === 0)
    return;
  const l = e.join(Ie);
  return r.validators.find(({
    validator: s
  }) => s(l))?.classGroupId;
}, He = /^\[(.+)\]$/, It = (e) => {
  if (He.test(e)) {
    const r = He.exec(e)[1], o = r?.substring(0, r.indexOf(":"));
    if (o)
      return "arbitrary.." + o;
  }
}, Et = (e) => {
  const {
    theme: r,
    prefix: o
  } = e, t = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return zt(Object.entries(e.classGroups), o).forEach(([l, s]) => {
    $e(s, t, l, r);
  }), t;
}, $e = (e, r, o, t) => {
  e.forEach((c) => {
    if (typeof c == "string") {
      const l = c === "" ? r : Ve(r, c);
      l.classGroupId = o;
      return;
    }
    if (typeof c == "function") {
      if (Lt(c)) {
        $e(c(t), r, o, t);
        return;
      }
      r.validators.push({
        validator: c,
        classGroupId: o
      });
      return;
    }
    Object.entries(c).forEach(([l, s]) => {
      $e(s, Ve(r, l), o, t);
    });
  });
}, Ve = (e, r) => {
  let o = e;
  return r.split(Ie).forEach((t) => {
    o.nextPart.has(t) || o.nextPart.set(t, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), o = o.nextPart.get(t);
  }), o;
}, Lt = (e) => e.isThemeGetter, zt = (e, r) => r ? e.map(([o, t]) => {
  const c = t.map((l) => typeof l == "string" ? r + l : typeof l == "object" ? Object.fromEntries(Object.entries(l).map(([s, d]) => [r + s, d])) : l);
  return [o, c];
}) : e, Mt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, o = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  const c = (l, s) => {
    o.set(l, s), r++, r > e && (r = 0, t = o, o = /* @__PURE__ */ new Map());
  };
  return {
    get(l) {
      let s = o.get(l);
      if (s !== void 0)
        return s;
      if ((s = t.get(l)) !== void 0)
        return c(l, s), s;
    },
    set(l, s) {
      o.has(l) ? o.set(l, s) : c(l, s);
    }
  };
}, tt = "!", Dt = (e) => {
  const {
    separator: r,
    experimentalParseClassName: o
  } = e, t = r.length === 1, c = r[0], l = r.length, s = (d) => {
    const m = [];
    let h = 0, C = 0, g;
    for (let v = 0; v < d.length; v++) {
      let T = d[v];
      if (h === 0) {
        if (T === c && (t || d.slice(v, v + l) === r)) {
          m.push(d.slice(C, v)), C = v + l;
          continue;
        }
        if (T === "/") {
          g = v;
          continue;
        }
      }
      T === "[" ? h++ : T === "]" && h--;
    }
    const A = m.length === 0 ? d : d.substring(C), D = A.startsWith(tt), j = D ? A.substring(1) : A, S = g && g > C ? g - C : void 0;
    return {
      modifiers: m,
      hasImportantModifier: D,
      baseClassName: j,
      maybePostfixModifierPosition: S
    };
  };
  return o ? (d) => o({
    className: d,
    parseClassName: s
  }) : s;
}, jt = (e) => {
  if (e.length <= 1)
    return e;
  const r = [];
  let o = [];
  return e.forEach((t) => {
    t[0] === "[" ? (r.push(...o.sort(), t), o = []) : o.push(t);
  }), r.push(...o.sort()), r;
}, Ot = (e) => ({
  cache: Mt(e.cacheSize),
  parseClassName: Dt(e),
  ...Rt(e)
}), Gt = /\s+/, Ut = (e, r) => {
  const {
    parseClassName: o,
    getClassGroupId: t,
    getConflictingClassGroupIds: c
  } = r, l = [], s = e.trim().split(Gt);
  let d = "";
  for (let m = s.length - 1; m >= 0; m -= 1) {
    const h = s[m], {
      modifiers: C,
      hasImportantModifier: g,
      baseClassName: A,
      maybePostfixModifierPosition: D
    } = o(h);
    let j = !!D, S = t(j ? A.substring(0, D) : A);
    if (!S) {
      if (!j) {
        d = h + (d.length > 0 ? " " + d : d);
        continue;
      }
      if (S = t(A), !S) {
        d = h + (d.length > 0 ? " " + d : d);
        continue;
      }
      j = !1;
    }
    const v = jt(C).join(":"), T = g ? v + tt : v, b = T + S;
    if (l.includes(b))
      continue;
    l.push(b);
    const Z = c(S, j);
    for (let L = 0; L < Z.length; ++L) {
      const G = Z[L];
      l.push(T + G);
    }
    d = h + (d.length > 0 ? " " + d : d);
  }
  return d;
};
function Ft() {
  let e = 0, r, o, t = "";
  for (; e < arguments.length; )
    (r = arguments[e++]) && (o = rt(r)) && (t && (t += " "), t += o);
  return t;
}
const rt = (e) => {
  if (typeof e == "string")
    return e;
  let r, o = "";
  for (let t = 0; t < e.length; t++)
    e[t] && (r = rt(e[t])) && (o && (o += " "), o += r);
  return o;
};
function Bt(e, ...r) {
  let o, t, c, l = s;
  function s(m) {
    const h = r.reduce((C, g) => g(C), e());
    return o = Ot(h), t = o.cache.get, c = o.cache.set, l = d, d(m);
  }
  function d(m) {
    const h = t(m);
    if (h)
      return h;
    const C = Ut(m, o);
    return c(m, C), C;
  }
  return function() {
    return l(Ft.apply(null, arguments));
  };
}
const w = (e) => {
  const r = (o) => o[e] || [];
  return r.isThemeGetter = !0, r;
}, ot = /^\[(?:([a-z-]+):)?(.+)\]$/i, Wt = /^\d+\/\d+$/, Ht = /* @__PURE__ */ new Set(["px", "full", "screen"]), Vt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Kt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Xt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, qt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Jt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, H = (e) => ae(e) || Ht.has(e) || Wt.test(e), J = (e) => le(e, "length", nr), ae = (e) => !!e && !Number.isNaN(Number(e)), _e = (e) => le(e, "number", ae), ue = (e) => !!e && Number.isInteger(Number(e)), Yt = (e) => e.endsWith("%") && ae(e.slice(0, -1)), p = (e) => ot.test(e), Y = (e) => Vt.test(e), Zt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Qt = (e) => le(e, Zt, nt), er = (e) => le(e, "position", nt), tr = /* @__PURE__ */ new Set(["image", "url"]), rr = (e) => le(e, tr, lr), or = (e) => le(e, "", ar), pe = () => !0, le = (e, r, o) => {
  const t = ot.exec(e);
  return t ? t[1] ? typeof r == "string" ? t[1] === r : r.has(t[1]) : o(t[2]) : !1;
}, nr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Kt.test(e) && !Xt.test(e)
), nt = () => !1, ar = (e) => qt.test(e), lr = (e) => Jt.test(e), sr = () => {
  const e = w("colors"), r = w("spacing"), o = w("blur"), t = w("brightness"), c = w("borderColor"), l = w("borderRadius"), s = w("borderSpacing"), d = w("borderWidth"), m = w("contrast"), h = w("grayscale"), C = w("hueRotate"), g = w("invert"), A = w("gap"), D = w("gradientColorStops"), j = w("gradientColorStopPositions"), S = w("inset"), v = w("margin"), T = w("opacity"), b = w("padding"), Z = w("saturate"), L = w("scale"), G = w("sepia"), se = w("skew"), Q = w("space"), te = w("translate"), ie = () => ["auto", "contain", "none"], V = () => ["auto", "hidden", "clip", "visible", "scroll"], U = () => ["auto", p, r], x = () => [p, r], ee = () => ["", H, J], re = () => ["auto", ae, p], P = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], $ = () => ["solid", "dashed", "dotted", "double", "none"], ge = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ce = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], k = () => ["", "0", p], O = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], f = () => [ae, p];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [pe],
      spacing: [H, J],
      blur: ["none", "", Y, p],
      brightness: f(),
      borderColor: [e],
      borderRadius: ["none", "", "full", Y, p],
      borderSpacing: x(),
      borderWidth: ee(),
      contrast: f(),
      grayscale: k(),
      hueRotate: f(),
      invert: k(),
      gap: x(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Yt, J],
      inset: U(),
      margin: U(),
      opacity: f(),
      padding: x(),
      saturate: f(),
      scale: f(),
      sepia: k(),
      skew: f(),
      space: x(),
      translate: x()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", p]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [Y]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": O()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": O()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...P(), p]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: V()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": V()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": V()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: ie()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": ie()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": ie()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [S]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [S]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [S]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [S]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [S]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [S]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [S]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [S]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [S]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", ue, p]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: U()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", p]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: k()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: k()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", ue, p]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [pe]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", ue, p]
        }, p]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": re()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": re()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [pe]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [ue, p]
        }, p]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": re()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": re()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", p]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", p]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [A]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [A]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [A]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...ce()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ce(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...ce(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [b]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [b]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [b]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [b]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [b]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [b]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [b]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [b]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [b]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [v]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [v]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [v]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [v]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [v]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [v]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [v]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [v]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [v]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [Q]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [Q]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", p, r]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [p, r, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [p, r, "none", "full", "min", "max", "fit", "prose", {
          screen: [Y]
        }, Y]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [p, r, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [p, r, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [p, r, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [p, r, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", Y, J]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", _e]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [pe]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", p]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", ae, _e]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", H, p]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", p]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", p]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [e]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [T]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [e]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [T]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...$(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", H, J]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", H, p]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [e]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: x()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", p]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", p]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [T]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...P(), er]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", Qt]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, rr]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [e]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [j]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [j]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [j]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [D]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [D]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [D]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [l]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [l]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [l]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [l]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [l]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [l]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [l]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [l]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [l]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [l]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [l]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [l]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [l]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [l]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [l]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [d]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [d]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [d]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [d]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [d]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [d]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [d]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [d]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [d]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [T]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...$(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [d]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [d]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [T]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: $()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [c]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [c]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [c]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [c]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [c]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [c]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [c]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [c]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [c]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [c]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...$()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [H, p]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [H, J]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [e]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: ee()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [e]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [T]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [H, J]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [e]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", Y, or]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [pe]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [T]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...ge(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": ge()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [o]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [t]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [m]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", Y, p]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [h]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [C]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [g]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [Z]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [G]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [o]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [t]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [m]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [h]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [C]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [g]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [T]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [Z]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [G]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [s]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [s]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [s]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", p]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: f()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", p]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: f()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", p]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [L]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [L]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [L]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [ue, p]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [te]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [te]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [se]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [se]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", p]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", e]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", p]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [e]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": x()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": x()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": x()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": x()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": x()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": x()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": x()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": x()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": x()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": x()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": x()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": x()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": x()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": x()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": x()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": x()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": x()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": x()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", p]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [e, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [H, J, _e]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [e, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, ir = /* @__PURE__ */ Bt(sr);
function B(...e) {
  return ir(Pt(e));
}
const cr = "copanel_mobile_desktop_site";
function dr() {
  try {
    return localStorage.getItem(cr) === "1";
  } catch {
    return !1;
  }
}
function Ae(e = window.innerWidth) {
  return dr() || e >= 1024;
}
const ur = Ye(null);
function at() {
  return Ze(ur);
}
function lt() {
  return at()?.isWindowed === !0;
}
function pr({ children: e, className: r, constrained: o = !1 }) {
  const { theme: t } = Re(), c = lt(), l = t === "dark", s = !c && !Ae();
  return /* @__PURE__ */ n(
    "div",
    {
      className: B(
        "flex flex-col transition-colors duration-200",
        c ? "h-full min-h-0" : s ? "min-h-0" : "min-h-screen",
        l ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !c && o && "mx-auto max-w-7xl",
        r
      ),
      children: e
    }
  );
}
function mr({
  isDark: e,
  sidebar: r,
  children: o,
  mobileTitle: t,
  className: c
}) {
  const l = lt(), [s, d] = y(!1), [m, h] = y(() => Ae());
  be(() => {
    const A = () => h(Ae());
    return window.addEventListener("resize", A), () => window.removeEventListener("resize", A);
  }, []);
  const C = !l && !m;
  be(() => {
    m && d(!1);
  }, [m]);
  const g = () => d(!1);
  return C ? /* @__PURE__ */ u("div", { className: B("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", c), children: [
    /* @__PURE__ */ u(
      "div",
      {
        className: B(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2.5",
          e ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white"
        ),
        children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => d(!0),
              className: B(
                "inline-flex items-center justify-center rounded-lg p-2",
                e ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ n(N.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          t ? /* @__PURE__ */ n("span", { className: B("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: t }) : null
        ]
      }
    ),
    s ? /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: g
      }
    ) : null,
    /* @__PURE__ */ n(
      "div",
      {
        className: B(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          s ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: g,
        children: r
      }
    ),
    /* @__PURE__ */ n("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: o })
  ] }) : /* @__PURE__ */ u("div", { className: B("flex h-full min-h-0 flex-1 overflow-hidden", c), children: [
    r,
    /* @__PURE__ */ n("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: o })
  ] });
}
const hr = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function Se({
  open: e,
  onClose: r,
  children: o,
  title: t,
  className: c,
  maxWidth: l = "lg",
  closeOnBackdropClick: s = !0
}) {
  const { theme: d } = Re(), m = d === "dark", h = at();
  if (!e) return null;
  const C = /* @__PURE__ */ n(
    "div",
    {
      className: B(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        h?.isWindowed ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: s ? r : void 0,
      children: /* @__PURE__ */ u(
        "div",
        {
          className: B(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            hr[l],
            m ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            c
          ),
          onClick: (g) => g.stopPropagation(),
          children: [
            t && /* @__PURE__ */ u(
              "div",
              {
                className: B(
                  "flex items-center justify-between border-b px-4 py-3",
                  m ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ n("h3", { className: "text-sm font-bold", children: t }),
                  /* @__PURE__ */ n("button", { type: "button", onClick: r, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ n(N.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            o
          ]
        }
      )
    }
  );
  return h?.isWindowed && h.viewportRef.current ? We(C, h.viewportRef.current) : We(C, document.body);
}
class Ke extends Error {
  constructor(o, t, c, l) {
    super(t);
    W(this, "code");
    W(this, "status");
    W(this, "details");
    this.code = o, this.status = c, this.details = l;
  }
}
async function _(e, r = {}) {
  const o = typeof window < "u" ? localStorage.getItem("copanel_token") : null, t = {
    "Content-Type": "application/json",
    ...r.headers || {}
  };
  o && (t.Authorization = `Bearer ${o}`);
  const c = {
    method: r.method || "GET",
    headers: t,
    signal: r.signal
  };
  r.body !== void 0 && (c.body = typeof r.body == "string" ? r.body : JSON.stringify(r.body));
  const l = await fetch(e, c);
  let s = null;
  const d = await l.text();
  if (d)
    try {
      s = JSON.parse(d);
    } catch {
      s = d;
    }
  if (r.raw)
    return s;
  if (!l.ok) {
    const m = s && typeof s == "object" && s.error ? s.error : { code: `HTTP_${l.status}`, message: typeof s == "string" ? s : s?.detail || l.statusText };
    throw new Ke(m.code || `HTTP_${l.status}`, m.message || "Request failed", l.status, m.details);
  }
  if (s && typeof s == "object" && "status" in s) {
    if (s.status === "success")
      return s.data !== void 0 ? s.data : s;
    if (s.status === "error" && s.error)
      throw new Ke(s.error.code, s.error.message, l.status, s.error.details);
  }
  return s;
}
const br = "copanel-platform-sse-degraded", me = 2e3, gr = 6e4, fr = 3;
class xr {
  constructor() {
    W(this, "source", null);
    W(this, "handlers", /* @__PURE__ */ new Map());
    W(this, "retryDelay", me);
    W(this, "retryTimer", null);
    W(this, "failureCount", 0);
  }
  on(r, o) {
    let t = this.handlers.get(r);
    return t || (t = /* @__PURE__ */ new Set(), this.handlers.set(r, t)), t.add(o), this.ensureConnected(), () => {
      t.delete(o), t.size === 0 && this.handlers.delete(r), this.teardownIfIdle();
    };
  }
  emit(r, o) {
    const t = this.handlers.get(r);
    t && t.forEach((c) => {
      try {
        c(o);
      } catch (l) {
        console.error("event handler failed", r, l);
      }
    });
  }
  buildUrl() {
    const r = localStorage.getItem("copanel_token");
    return r ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      access_token: r
    }).toString()}` : null;
  }
  ensureConnected() {
    if (this.source || typeof document < "u" && document.hidden) return;
    const r = this.buildUrl();
    if (r) {
      try {
        this.source = new EventSource(r, { withCredentials: !1 });
      } catch {
        this.scheduleRetry();
        return;
      }
      this.source.addEventListener("open", () => {
        this.failureCount = 0, this.retryDelay = me;
      }), this.source.addEventListener("jobs", (o) => {
        this.onStreamMessage(), this.parseAndEmit("jobs", o.data);
      }), this.source.addEventListener("notifications", (o) => {
        this.onStreamMessage(), this.parseAndEmit("notifications", o.data);
      }), this.source.addEventListener("message", () => {
        this.onStreamMessage();
      }), this.source.onerror = () => {
        this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= fr && window.dispatchEvent(new CustomEvent(br)), this.scheduleRetry();
      };
    }
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = me;
  }
  parseAndEmit(r, o) {
    try {
      const t = JSON.parse(o);
      this.emit(r, t.payload || t);
    } catch {
    }
  }
  scheduleRetry() {
    if (this.retryTimer || this.handlers.size === 0) return;
    const r = this.retryDelay;
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), gr), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, r);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = me);
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = me, this.handlers.size > 0 && this.ensureConnected();
  }
}
const Ee = new xr();
function yr() {
  Ee.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || yr();
});
function st(e) {
  let r = e;
  const o = /* @__PURE__ */ new Set();
  return {
    getState: () => r,
    setState: (t) => {
      const c = typeof t == "function" ? t(r) : t;
      if (!c || Object.keys(c).length === 0) return;
      let l = !1;
      for (const s of Object.keys(c))
        if (r[s] !== c[s]) {
          l = !0;
          break;
        }
      l && (r = { ...r, ...c }, o.forEach((s) => s()));
    },
    subscribe: (t) => (o.add(t), () => o.delete(t))
  };
}
const it = st({ jobs: {}, order: [], lastFetch: 0 });
function wr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Xe(e, r) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[r] || e.en || e.vi || e.default;
  }
}
function ne(e, r, o) {
  if (!e || typeof e != "object") return;
  const t = Xe(e[r], o);
  if (t) return t;
  const c = Xe(e[`${r}_i18n`], o);
  if (c) return c;
  const l = e[`${r}_${o}`];
  if (typeof l == "string" && l) return l;
  const s = e[`${r}_en`];
  if (typeof s == "string" && s) return s;
  const d = e[`${r}_vi`];
  if (typeof d == "string" && d) return d;
}
function vr(e) {
  const r = wr(), o = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: ne(e, "title", r) || ne(o, "title", r) || e?.title || "",
    message: ne(e, "message", r) || ne(o, "message", r) || e?.message,
    error: ne(e, "error", r) || ne(o, "error", r) || e?.error || null
  };
}
function qe(e) {
  const r = vr(e);
  it.setState((o) => {
    const t = { ...o.jobs, [r.id]: { ...o.jobs[r.id], ...r } };
    let c = o.order;
    return c.includes(r.id) || (c = [r.id, ...c].slice(0, 200)), { jobs: t, order: c };
  });
}
Ee.on("jobs", (e) => {
  if (e?.job) {
    qe(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const r = it.getState().jobs[e.job_id];
    r && qe({
      ...r,
      progress: e.progress ?? r.progress,
      message: e.message ?? r.message,
      status: e.status ?? r.status
    });
  }
});
const Pe = st({ inbox: [], unread: 0, toasts: [] }), Cr = 6e3;
function Nr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Je(e, r) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[r] || e.en || e.vi || e.default;
  }
}
function ye(e, r, o) {
  if (!e || typeof e != "object") return;
  const t = Je(e[r], o);
  if (t) return t;
  const c = Je(e[`${r}_i18n`], o);
  if (c) return c;
  const l = e[`${r}_${o}`];
  if (typeof l == "string" && l) return l;
  const s = e[`${r}_en`];
  if (typeof s == "string" && s) return s;
  const d = e[`${r}_vi`];
  if (typeof d == "string" && d) return d;
}
function kr(e) {
  const r = Nr(), o = e?.payload && typeof e.payload == "object" ? e.payload : {}, t = ye(e, "title", r) || ye(o, "title", r) || e?.title || "", c = ye(e, "body", r) || ye(o, "body", r) || e?.body || null;
  return {
    ...e,
    title: t,
    body: c
  };
}
function _r(e) {
  Pe.setState((r) => ({ toasts: [e, ...r.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    Pe.setState((r) => ({ toasts: r.toasts.filter((o) => o.id !== e.id) }));
  }, Cr);
}
Ee.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const r = kr(e.notification);
    _r({ ...r, ephemeral: !0 }), Pe.setState((o) => ({
      inbox: [r, ...o.inbox].slice(0, 200),
      unread: o.unread + 1
    }));
  }
});
const Sr = [
  { key: "all", icon: "List" },
  { key: "downloading", icon: "Download" },
  { key: "completed", icon: "CheckCircle2" },
  { key: "active", icon: "Activity" },
  { key: "inactive", icon: "PauseCircle" },
  { key: "stopped", icon: "Square" }
];
function he(e) {
  if (!e || e < 0) return "—";
  const r = ["B", "KB", "MB", "GB", "TB"];
  let o = e, t = 0;
  for (; o >= 1024 && t < r.length - 1; )
    o /= 1024, t += 1;
  return `${o.toFixed(t === 0 ? 0 : 2)} ${r[t]}`;
}
function Te(e) {
  return e ? `${he(e)}/s` : "—";
}
function Tr(e) {
  switch (e) {
    case "completed":
      return "text-emerald-500";
    case "downloading":
    case "connecting":
      return "text-blue-500";
    case "paused":
    case "stopped":
      return "text-amber-500";
    case "error":
      return "text-red-500";
    default:
      return "text-slate-500";
  }
}
function $r({ status: e }) {
  return e === "completed" ? /* @__PURE__ */ n(N.CheckCircle2, { className: "w-4 h-4 text-emerald-500" }) : e === "downloading" || e === "connecting" ? /* @__PURE__ */ n(N.Loader2, { className: "w-4 h-4 text-blue-500 animate-spin" }) : e === "paused" || e === "stopped" ? /* @__PURE__ */ n(N.PauseCircle, { className: "w-4 h-4 text-amber-500" }) : e === "error" ? /* @__PURE__ */ n(N.AlertCircle, { className: "w-4 h-4 text-red-500" }) : /* @__PURE__ */ n(N.Clock, { className: "w-4 h-4 text-slate-400" });
}
function Lr() {
  const { theme: e, language: r } = Re(), o = e === "dark", t = kt(
    () => r === "vi" ? {
      title: "Download Manager",
      subtitle: "Direct link, Google Drive, file hosting tùy chỉnh",
      search: "Từ khóa hoặc URL",
      addUrl: "Thêm URL",
      pause: "Tạm dừng",
      resume: "Tiếp tục",
      stop: "Dừng",
      delete: "Xóa",
      clearCompleted: "Xóa hoàn tất",
      settings: "Cài đặt",
      noTasks: "Chưa có tác vụ tải.",
      colName: "Tên tệp",
      colSize: "Kích thước",
      colDownloaded: "Đã tải",
      colProgress: "Tiến độ",
      colSpeed: "Tốc độ tải",
      colStatus: "Trạng thái",
      colDest: "Đích",
      tabGeneral: "Chung",
      tabTransfer: "Truyền tải",
      filterAll: "Tất cả",
      filterDownloading: "Đang tải",
      filterCompleted: "Hoàn tất",
      filterActive: "Đang hoạt động",
      filterInactive: "Không hoạt động",
      filterStopped: "Đã dừng",
      tempFolder: "Thư mục tạm",
      destFolder: "Thư mục đích",
      maxConcurrent: "Tải đồng thời tối đa",
      watchedFolder: "Thư mục theo dõi torrent/NZB",
      watchedAutoDelete: "Xóa file torrent sau khi nạp",
      googleApiKey: "Google API Key (folder listing)",
      fileHosting: "File Hosting",
      addHosting: "Thêm hosting",
      curlTemplate: "Mẫu curl",
      apiResolve: "API resolve URL",
      urlPatterns: "Mẫu URL (mỗi dòng một pattern)",
      save: "Lưu",
      cancel: "Hủy",
      add: "Thêm",
      urlPlaceholder: "https://... hoặc link Google Drive",
      selectFolder: "Chọn",
      accounts: "Tài khoản",
      addAccount: "Thêm tài khoản",
      uploadTorrent: "Tải lên .torrent",
      aria2Status: "aria2",
      speedDown: "Tốc độ tải tối đa (KB/s, 0=không giới hạn)",
      speedUp: "Tốc độ upload tối đa (KB/s, 0=không giới hạn)",
      googleOAuth: "Google OAuth",
      connectGoogle: "Kết nối Google Drive",
      oauthClientId: "OAuth Client ID",
      oauthClientSecret: "OAuth Client Secret",
      oauthRedirect: "Redirect URI",
      aria2Rpc: "aria2 RPC",
      aria2Host: "RPC host",
      aria2Port: "RPC port",
      aria2Secret: "RPC secret",
      aria2AutoStart: "Tự khởi động aria2 khi mở panel",
      aria2AutoStartHint: "CoPanel tự chạy aria2c với RPC trên localhost (cần cho BitTorrent).",
      manageAccounts: "Quản lý tài khoản",
      accountLabel: "Nhãn",
      accountUser: "Tên đăng nhập",
      accountPass: "Mật khẩu",
      accountApiKey: "API key",
      accountCookie: "Cookie"
    } : {
      title: "Download Manager",
      subtitle: "Direct links, Google Drive, custom file hosting",
      search: "Keyword or URL",
      addUrl: "Add URL",
      pause: "Pause",
      resume: "Resume",
      stop: "Stop",
      delete: "Delete",
      clearCompleted: "Clear completed",
      settings: "Settings",
      noTasks: "No download tasks yet.",
      colName: "File name",
      colSize: "File size",
      colDownloaded: "Downloaded",
      colProgress: "Progress",
      colSpeed: "Download speed",
      colStatus: "Status",
      colDest: "Destination",
      tabGeneral: "General",
      tabTransfer: "Transfer",
      filterAll: "All Downloads",
      filterDownloading: "Downloading",
      filterCompleted: "Completed",
      filterActive: "Active",
      filterInactive: "Inactive",
      filterStopped: "Stopped",
      tempFolder: "Temporary location",
      destFolder: "Default destination",
      maxConcurrent: "Max concurrent downloads",
      watchedFolder: "Torrent/NZB watched folder",
      watchedAutoDelete: "Delete loaded torrent/NZB files",
      googleApiKey: "Google API Key (folder listing)",
      fileHosting: "File Hosting",
      addHosting: "Add hosting",
      curlTemplate: "curl template",
      apiResolve: "API resolve URL",
      urlPatterns: "URL patterns (one per line)",
      save: "Save",
      cancel: "Cancel",
      add: "Add",
      urlPlaceholder: "https://... or Google Drive link",
      selectFolder: "Browse",
      accounts: "Accounts",
      addAccount: "Add account",
      uploadTorrent: "Upload .torrent",
      aria2Status: "aria2",
      speedDown: "Max download (KB/s, 0=unlimited)",
      speedUp: "Max upload (KB/s, 0=unlimited)",
      googleOAuth: "Google OAuth",
      connectGoogle: "Connect Google Drive",
      oauthClientId: "OAuth Client ID",
      oauthClientSecret: "OAuth Client Secret",
      oauthRedirect: "Redirect URI",
      aria2Rpc: "aria2 RPC",
      aria2Host: "RPC host",
      aria2Port: "RPC port",
      aria2Secret: "RPC secret",
      aria2AutoStart: "Auto-start aria2 on panel load",
      aria2AutoStartHint: "CoPanel starts aria2c with RPC on localhost when BitTorrent support is needed.",
      manageAccounts: "Manage accounts",
      accountLabel: "Label",
      accountUser: "Username",
      accountPass: "Password",
      accountApiKey: "API key",
      accountCookie: "Cookie"
    },
    [r]
  ), c = {
    all: t.filterAll,
    downloading: t.filterDownloading,
    completed: t.filterCompleted,
    active: t.filterActive,
    inactive: t.filterInactive,
    stopped: t.filterStopped
  }, [l, s] = y("all"), [d, m] = y(""), [h, C] = y([]), [g, A] = y(null), [D, j] = y("general"), [S, v] = y(!0), [T, b] = y(null), [Z, L] = y(!1), [G, se] = y(""), [Q, te] = y(null), [ie, V] = y(!1), [U, x] = y("general"), [ee, re] = y(null), [P, $] = y({}), [ge, ce] = y([]), [k, O] = y(null), [f, K] = y(null), [de, we] = y(null), [ct, dt] = y(null), [Le, ut] = y(""), [ze, pt] = y(""), [Me, mt] = y(`${typeof window < "u" ? window.location.origin : ""}/api/download_manager/oauth/google/callback`), De = _t(null), [X, fe] = y(null), [je, ve] = y(null), R = h.find((a) => a.id === g) || null, q = Be(async () => {
    try {
      const a = await _(`/api/download_manager/tasks?filter=${l}&search=${encodeURIComponent(d)}`);
      C(a || []);
    } catch (a) {
      b(a.message);
    } finally {
      v(!1);
    }
  }, [l, d]), oe = Be(async () => {
    const [a, i, F, xe] = await Promise.all([
      _("/api/download_manager/settings"),
      _("/api/download_manager/file-hosting"),
      _("/api/download_manager/engine/status"),
      _("/api/download_manager/oauth/google/status")
    ]);
    re(a), $(a), ce(i || []), we(F), dt(xe);
  }, []);
  be(() => {
    q(), _("/api/download_manager/engine/status").then(we).catch(() => {
    });
    const a = setInterval(() => {
      q(), _("/api/download_manager/engine/status").then(we).catch(() => {
      });
    }, 3e3);
    return () => clearInterval(a);
  }, [q]), be(() => {
    function a(i) {
      !i.data || i.data.type !== "copanel_dm_google_oauth" || (i.data.ok ? (oe(), b(null)) : b(i.data.error || "Google OAuth failed"));
    }
    return window.addEventListener("message", a), () => window.removeEventListener("message", a);
  }, [oe]), be(() => {
    G.length > 8 ? _("/api/download_manager/detect-url", {
      method: "POST",
      body: { url: G }
    }).then(te).catch(() => te(null)) : te(null);
  }, [G]);
  async function Oe() {
    if (G.trim()) {
      b(null);
      try {
        await _("/api/download_manager/tasks", { method: "POST", body: { url: G.trim() } }), se(""), L(!1), q();
      } catch (a) {
        b(a.message);
      }
    }
  }
  async function Ce(a) {
    if (g)
      try {
        await _(`/api/download_manager/tasks/${g}/${a}`, { method: "POST" }), q();
      } catch (i) {
        b(i.message);
      }
  }
  async function ht() {
    if (g)
      try {
        await _(`/api/download_manager/tasks/${g}`, { method: "DELETE" }), A(null), q();
      } catch (a) {
        b(a.message);
      }
  }
  async function bt() {
    try {
      await _("/api/download_manager/tasks/completed", { method: "DELETE" }), q();
    } catch (a) {
      b(a.message);
    }
  }
  async function gt() {
    try {
      await _("/api/download_manager/settings", { method: "PUT", body: P }), await oe(), V(!1);
    } catch (a) {
      b(a.message);
    }
  }
  async function Ne(a) {
    ve(a);
    const i = a === "temp_folder" ? P.temp_folder : a === "destination_folder" ? P.destination_folder : P.watched_folder, F = await _(`/api/download_manager/folders/browse?path=${encodeURIComponent(i || "")}`);
    fe(F);
  }
  async function Ge(a) {
    const i = await _(`/api/download_manager/folders/browse?path=${encodeURIComponent(a)}`);
    fe(i);
  }
  function ft(a) {
    je && ($((i) => ({ ...i, [je]: a })), fe(null), ve(null));
  }
  async function xt(a) {
    if (a) {
      b(null);
      try {
        const i = localStorage.getItem("copanel_token"), F = new FormData();
        F.append("file", a);
        const xe = await fetch("/api/download_manager/tasks/upload-torrent", {
          method: "POST",
          headers: i ? { Authorization: `Bearer ${i}` } : {},
          body: F
        }), Ue = await xe.json();
        if (!xe.ok || Ue.status === "error")
          throw new Error(Ue.error?.message || "Upload failed");
        q();
      } catch (i) {
        b(i.message);
      }
    }
  }
  async function yt() {
    try {
      const a = await _("/api/download_manager/oauth/google/start", {
        method: "POST",
        body: {
          client_id: Le,
          client_secret: ze,
          redirect_uri: Me
        }
      });
      window.open(a.auth_url, "copanel_google_oauth", "width=520,height=720");
    } catch (a) {
      b(a.message);
    }
  }
  async function wt() {
    if (!f?.profileId || !f.label.trim()) return;
    const a = {
      label: f.label,
      username: f.username,
      password: f.password,
      api_key: f.api_key,
      cookie: f.cookie
    };
    try {
      f.account?.id ? await _(`/api/download_manager/file-hosting/${f.profileId}/accounts/${f.account.id}`, {
        method: "PUT",
        body: a
      }) : await _(`/api/download_manager/file-hosting/${f.profileId}/accounts`, {
        method: "POST",
        body: a
      }), K(null), await oe();
    } catch (i) {
      b(i.message);
    }
  }
  async function vt() {
    if (!k?.name) return;
    const a = {
      ...k,
      url_patterns: k.url_patterns ? String(k.url_patterns).split(`
`).map((i) => i.trim()).filter(Boolean) : k.url_patterns || []
    };
    try {
      k.id ? await _(`/api/download_manager/file-hosting/${k.id}`, { method: "PUT", body: a }) : await _("/api/download_manager/file-hosting", { method: "POST", body: a }), O(null), await oe();
    } catch (i) {
      b(i.message);
    }
  }
  const ke = o ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200", z = o ? "text-slate-400" : "text-slate-500", I = o ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200";
  return /* @__PURE__ */ n(pr, { constrained: !0, children: /* @__PURE__ */ u("div", { className: `flex flex-col h-full min-h-0 ${o ? "text-slate-100" : "text-slate-900"}`, children: [
    /* @__PURE__ */ u("div", { className: `px-4 py-3 border-b flex items-center justify-between ${o ? "border-slate-700" : "border-slate-200"}`, children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ n("h1", { className: "text-xl font-semibold", children: t.title }),
        /* @__PURE__ */ n("p", { className: `text-sm ${z}`, children: t.subtitle })
      ] }),
      de && /* @__PURE__ */ u("div", { className: `text-xs px-2 py-1 rounded border ${de.aria2_available ? "border-emerald-500/40 text-emerald-500" : "border-amber-500/40 text-amber-500"}`, children: [
        t.aria2Status,
        ": ",
        de.aria2_available ? `v${de.version || "?"}` : de.message
      ] })
    ] }),
    /* @__PURE__ */ n(
      "input",
      {
        ref: De,
        type: "file",
        accept: ".torrent",
        className: "hidden",
        onChange: (a) => {
          xt(a.target.files?.[0] || null), a.target.value = "";
        }
      }
    ),
    T && /* @__PURE__ */ u("div", { className: "mx-4 mt-2 px-3 py-2 rounded bg-red-500/10 text-red-500 text-sm flex justify-between", children: [
      /* @__PURE__ */ n("span", { children: T }),
      /* @__PURE__ */ n("button", { type: "button", onClick: () => b(null), children: /* @__PURE__ */ n(N.X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ n(
      mr,
      {
        isDark: o,
        mobileTitle: t.title,
        sidebar: /* @__PURE__ */ u("aside", { className: `h-full w-52 shrink-0 border-r flex flex-col ${o ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`, children: [
          /* @__PURE__ */ n("div", { className: "p-2", children: /* @__PURE__ */ n(
            "input",
            {
              className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`,
              placeholder: t.search,
              value: d,
              onChange: (a) => m(a.target.value)
            }
          ) }),
          /* @__PURE__ */ n("nav", { className: "flex-1 overflow-y-auto px-1", children: Sr.map(({ key: a, icon: i }) => {
            const F = N[i];
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                onClick: () => s(a),
                className: `w-full flex items-center gap-2 px-3 py-2 text-sm rounded mb-0.5 ${l === a ? o ? "bg-blue-600/30 text-blue-300" : "bg-blue-50 text-blue-700" : `hover:${o ? "bg-slate-800" : "bg-slate-100"}`}`,
                children: [
                  /* @__PURE__ */ n(F, { className: "w-4 h-4" }),
                  c[a]
                ]
              },
              a
            );
          }) }),
          /* @__PURE__ */ n("div", { className: `p-2 border-t ${o ? "border-slate-700" : "border-slate-200"}`, children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              onClick: () => {
                oe(), V(!0);
              },
              className: `w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded border ${I}`,
              children: [
                /* @__PURE__ */ n(N.Settings, { className: "w-4 h-4" }),
                t.settings
              ]
            }
          ) })
        ] }),
        children: /* @__PURE__ */ u("div", { className: "flex-1 flex flex-col min-w-0", children: [
          /* @__PURE__ */ u("div", { className: `flex items-center gap-1 px-2 py-1.5 border-b flex-wrap ${o ? "border-slate-700" : "border-slate-200"}`, children: [
            /* @__PURE__ */ n("button", { type: "button", onClick: () => L(!0), className: `p-2 rounded border ${I}`, title: t.addUrl, children: /* @__PURE__ */ n(N.Plus, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: () => L(!0), className: `p-2 rounded border ${I}`, title: t.addUrl, children: /* @__PURE__ */ n(N.Globe, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: () => De.current?.click(), className: `p-2 rounded border ${I}`, title: t.uploadTorrent, children: /* @__PURE__ */ n(N.FileUp, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("div", { className: `w-px h-6 mx-1 ${o ? "bg-slate-700" : "bg-slate-200"}` }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !g, onClick: () => Ce("resume"), className: `p-2 rounded border ${I} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Play, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !g, onClick: () => Ce("pause"), className: `p-2 rounded border ${I} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Pause, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !g, onClick: () => Ce("stop"), className: `p-2 rounded border ${I} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Square, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("div", { className: `w-px h-6 mx-1 ${o ? "bg-slate-700" : "bg-slate-200"}` }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !g, onClick: ht, className: `p-2 rounded border ${I} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Trash2, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: bt, className: `p-2 rounded border ${I}`, children: /* @__PURE__ */ n(N.Eraser, { className: "w-4 h-4" }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "flex-1 overflow-auto min-h-0", children: S && h.length === 0 ? /* @__PURE__ */ n("div", { className: `p-8 text-center ${z}`, children: /* @__PURE__ */ n(N.Loader2, { className: "w-6 h-6 animate-spin mx-auto mb-2" }) }) : h.length === 0 ? /* @__PURE__ */ n("div", { className: `p-8 text-center ${z}`, children: t.noTasks }) : /* @__PURE__ */ u("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ n("thead", { className: `sticky top-0 ${o ? "bg-slate-800" : "bg-slate-100"}`, children: /* @__PURE__ */ u("tr", { children: [
              /* @__PURE__ */ n("th", { className: "w-8 p-2" }),
              /* @__PURE__ */ n("th", { className: "text-left p-2 font-medium", children: t.colName }),
              /* @__PURE__ */ n("th", { className: "text-right p-2 font-medium w-24", children: t.colSize }),
              /* @__PURE__ */ n("th", { className: "text-right p-2 font-medium w-24", children: t.colDownloaded }),
              /* @__PURE__ */ n("th", { className: "text-left p-2 font-medium w-36", children: t.colProgress }),
              /* @__PURE__ */ n("th", { className: "text-right p-2 font-medium w-28", children: t.colSpeed }),
              /* @__PURE__ */ n("th", { className: "text-left p-2 font-medium w-28", children: t.colStatus }),
              /* @__PURE__ */ n("th", { className: "text-left p-2 font-medium", children: t.colDest })
            ] }) }),
            /* @__PURE__ */ n("tbody", { children: h.map((a) => /* @__PURE__ */ u(
              "tr",
              {
                onClick: () => A(a.id),
                className: `cursor-pointer border-b ${g === a.id ? o ? "bg-blue-900/30" : "bg-blue-50" : o ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"}`,
                children: [
                  /* @__PURE__ */ n("td", { className: "p-2", children: /* @__PURE__ */ n($r, { status: a.status }) }),
                  /* @__PURE__ */ n("td", { className: "p-2 truncate max-w-xs", title: a.name, children: a.name }),
                  /* @__PURE__ */ n("td", { className: "p-2 text-right tabular-nums", children: he(a.total_bytes) }),
                  /* @__PURE__ */ n("td", { className: "p-2 text-right tabular-nums", children: he(a.downloaded_bytes) }),
                  /* @__PURE__ */ n("td", { className: "p-2", children: /* @__PURE__ */ u("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ n("div", { className: `flex-1 h-2 rounded-full overflow-hidden ${o ? "bg-slate-700" : "bg-slate-200"}`, children: /* @__PURE__ */ n("div", { className: "h-full bg-blue-500 transition-all", style: { width: `${Math.min(100, a.progress || 0)}%` } }) }),
                    /* @__PURE__ */ u("span", { className: "text-xs tabular-nums w-12 text-right", children: [
                      (a.progress || 0).toFixed(1),
                      "%"
                    ] })
                  ] }) }),
                  /* @__PURE__ */ n("td", { className: "p-2 text-right tabular-nums text-xs", children: Te(a.download_speed) }),
                  /* @__PURE__ */ n("td", { className: `p-2 capitalize text-xs ${Tr(a.status)}`, children: a.status }),
                  /* @__PURE__ */ n("td", { className: `p-2 truncate max-w-[10rem] text-xs ${z}`, title: a.destination, children: a.destination })
                ]
              },
              a.id
            )) })
          ] }) }),
          R && /* @__PURE__ */ u("div", { className: `h-44 shrink-0 border-t ${o ? "border-slate-700 bg-slate-900/80" : "border-slate-200 bg-slate-50"}`, children: [
            /* @__PURE__ */ n("div", { className: "flex gap-4 px-4 pt-2 border-b border-transparent", children: [
              { key: "general", label: t.tabGeneral },
              { key: "transfer", label: t.tabTransfer }
            ].map(({ key: a, label: i }) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => j(a),
                className: `pb-2 text-sm border-b-2 ${D === a ? "border-blue-500 text-blue-500" : `border-transparent ${z}`}`,
                children: i
              },
              a
            )) }),
            /* @__PURE__ */ n("div", { className: "px-4 py-3 grid grid-cols-2 gap-x-8 gap-y-1 text-sm overflow-y-auto max-h-32", children: D === "general" ? /* @__PURE__ */ u(Fe, { children: [
              /* @__PURE__ */ n(E, { label: t.colName, value: R.name }),
              /* @__PURE__ */ n(E, { label: t.colDest, value: R.destination }),
              /* @__PURE__ */ n(E, { label: t.colSize, value: he(R.total_bytes) }),
              /* @__PURE__ */ n(E, { label: "URL", value: R.source_url, mono: !0 }),
              /* @__PURE__ */ n(E, { label: "Type", value: R.source_type }),
              /* @__PURE__ */ n(E, { label: "User", value: R.created_by || "—" }),
              /* @__PURE__ */ n(E, { label: "Created", value: R.created_at }),
              R.error_message && /* @__PURE__ */ n(E, { label: "Error", value: R.error_message, error: !0 })
            ] }) : /* @__PURE__ */ u(Fe, { children: [
              /* @__PURE__ */ n(E, { label: t.colDownloaded, value: he(R.downloaded_bytes) }),
              /* @__PURE__ */ n(E, { label: t.colSpeed, value: Te(R.download_speed) }),
              /* @__PURE__ */ n(E, { label: "Upload", value: Te(R.upload_speed) }),
              /* @__PURE__ */ n(E, { label: t.colProgress, value: `${(R.progress || 0).toFixed(1)}%` }),
              /* @__PURE__ */ n(E, { label: t.colStatus, value: R.status }),
              /* @__PURE__ */ n(E, { label: "Completed", value: R.completed_at || "—" })
            ] }) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n(Se, { open: Z, onClose: () => L(!1), title: t.addUrl, children: /* @__PURE__ */ u("div", { className: "p-4", children: [
      /* @__PURE__ */ n(
        "input",
        {
          className: `w-full px-3 py-2 rounded border mb-2 ${o ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`,
          placeholder: t.urlPlaceholder,
          value: G,
          onChange: (a) => se(a.target.value),
          onKeyDown: (a) => a.key === "Enter" && Oe()
        }
      ),
      Q && /* @__PURE__ */ u("p", { className: `text-xs mb-3 ${z}`, children: [
        "Detected: ",
        /* @__PURE__ */ n("span", { className: "font-medium", children: Q.source_type }),
        Q.file_hosting_name ? ` → ${Q.file_hosting_name}` : ""
      ] }),
      /* @__PURE__ */ u("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ n("button", { type: "button", onClick: () => L(!1), className: `px-4 py-2 rounded border ${I}`, children: t.cancel }),
        /* @__PURE__ */ n("button", { type: "button", onClick: Oe, className: "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700", children: t.add })
      ] })
    ] }) }),
    ee && /* @__PURE__ */ u(Se, { open: ie, onClose: () => V(!1), title: t.settings, maxWidth: "2xl", className: "max-w-3xl", children: [
      /* @__PURE__ */ u("div", { className: "p-4 flex gap-4 min-h-[360px]", children: [
        /* @__PURE__ */ n("div", { className: `w-44 shrink-0 border-r pr-3 ${o ? "border-slate-700" : "border-slate-200"}`, children: ["general", "location", "file-hosting", "google", "aria2"].map((a) => /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            onClick: () => x(a),
            className: `block w-full text-left px-2 py-1.5 text-sm rounded mb-1 ${U === a ? "bg-blue-600/20 text-blue-400" : z}`,
            children: a === "general" ? t.tabGeneral : a === "location" ? t.destFolder : a === "file-hosting" ? t.fileHosting : a === "google" ? t.googleOAuth : t.aria2Rpc
          },
          a
        )) }),
        /* @__PURE__ */ u("div", { className: "flex-1 overflow-y-auto pr-2", children: [
          U === "general" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ n(M, { label: t.tempFolder, children: /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `flex-1 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: P.temp_folder || "",
                  onChange: (a) => $((i) => ({ ...i, temp_folder: a.target.value }))
                }
              ),
              /* @__PURE__ */ n("button", { type: "button", onClick: () => Ne("temp_folder"), className: `px-3 py-1.5 text-sm rounded border ${I}`, children: t.selectFolder })
            ] }) }),
            /* @__PURE__ */ n(M, { label: t.maxConcurrent, children: /* @__PURE__ */ n(
              "input",
              {
                type: "number",
                min: 1,
                max: 20,
                className: `w-24 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                value: P.max_concurrent ?? 3,
                onChange: (a) => $((i) => ({ ...i, max_concurrent: Number(a.target.value) }))
              }
            ) }),
            /* @__PURE__ */ n(M, { label: t.speedDown, children: /* @__PURE__ */ n(
              "input",
              {
                type: "number",
                min: 0,
                className: `w-32 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                value: P.max_download_speed_kbps ?? 0,
                onChange: (a) => $((i) => ({ ...i, max_download_speed_kbps: Number(a.target.value) }))
              }
            ) }),
            /* @__PURE__ */ n(M, { label: t.speedUp, children: /* @__PURE__ */ n(
              "input",
              {
                type: "number",
                min: 0,
                className: `w-32 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                value: P.max_upload_speed_kbps ?? 0,
                onChange: (a) => $((i) => ({ ...i, max_upload_speed_kbps: Number(a.target.value) }))
              }
            ) }),
            /* @__PURE__ */ n(M, { label: t.googleApiKey, children: /* @__PURE__ */ n(
              "input",
              {
                type: "password",
                placeholder: ee.google_api_key_set ? "••••••••" : "",
                className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                onChange: (a) => $((i) => ({ ...i, google_api_key: a.target.value }))
              }
            ) })
          ] }),
          U === "location" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ n(M, { label: t.destFolder, children: /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `flex-1 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: P.destination_folder || "",
                  onChange: (a) => $((i) => ({ ...i, destination_folder: a.target.value }))
                }
              ),
              /* @__PURE__ */ n("button", { type: "button", onClick: () => Ne("destination_folder"), className: `px-3 py-1.5 text-sm rounded border ${I}`, children: t.selectFolder })
            ] }) }),
            /* @__PURE__ */ n(M, { label: t.watchedFolder, children: /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `flex-1 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: P.watched_folder || "",
                  onChange: (a) => $((i) => ({ ...i, watched_folder: a.target.value }))
                }
              ),
              /* @__PURE__ */ n("button", { type: "button", onClick: () => Ne("watched_folder"), className: `px-3 py-1.5 text-sm rounded border ${I}`, children: t.selectFolder })
            ] }) }),
            /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  type: "checkbox",
                  checked: !!P.watched_auto_delete,
                  onChange: (a) => $((i) => ({ ...i, watched_auto_delete: a.target.checked }))
                }
              ),
              t.watchedAutoDelete
            ] })
          ] }),
          U === "file-hosting" && /* @__PURE__ */ u("div", { className: "space-y-3", children: [
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                onClick: () => O({
                  name: "",
                  type: "curl",
                  url_patterns: [],
                  enabled: !0,
                  curl_template: "curl -L -o '{OUT}' -b '{COOKIE}' '{URL}'"
                }),
                className: "text-sm text-blue-500 hover:underline flex items-center gap-1",
                children: [
                  /* @__PURE__ */ n(N.Plus, { className: "w-4 h-4" }),
                  " ",
                  t.addHosting
                ]
              }
            ),
            ge.map((a) => /* @__PURE__ */ u("div", { className: `p-3 rounded border ${ke}`, children: [
              /* @__PURE__ */ u("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ n("div", { className: "font-medium", children: a.name }),
                  /* @__PURE__ */ u("div", { className: `text-xs ${z}`, children: [
                    a.type,
                    " · ",
                    a.url_patterns.join(", ")
                  ] })
                ] }),
                /* @__PURE__ */ n("button", { type: "button", onClick: () => O(a), className: "text-xs text-blue-500", children: "Edit" })
              ] }),
              (a.accounts?.length || 0) > 0 && /* @__PURE__ */ u("div", { className: `mt-2 text-xs ${z}`, children: [
                t.accounts,
                ": ",
                a.accounts.map((i) => i.label).join(", ")
              ] }),
              /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  onClick: () => K({
                    profileId: a.id,
                    label: "",
                    username: "",
                    password: "",
                    api_key: "",
                    cookie: ""
                  }),
                  className: "mt-2 text-xs text-blue-500 hover:underline",
                  children: [
                    "+ ",
                    t.addAccount
                  ]
                }
              )
            ] }, a.id)),
            f && /* @__PURE__ */ u("div", { className: `mt-4 p-4 rounded border space-y-2 ${ke}`, children: [
              /* @__PURE__ */ n("div", { className: "text-sm font-medium", children: t.manageAccounts }),
              /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountLabel, value: f.label, onChange: (a) => K((i) => i && { ...i, label: a.target.value }) }),
              /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountUser, value: f.username, onChange: (a) => K((i) => i && { ...i, username: a.target.value }) }),
              /* @__PURE__ */ n("input", { type: "password", className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountPass, value: f.password, onChange: (a) => K((i) => i && { ...i, password: a.target.value }) }),
              /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountApiKey, value: f.api_key, onChange: (a) => K((i) => i && { ...i, api_key: a.target.value }) }),
              /* @__PURE__ */ n("textarea", { className: `w-full px-2 py-1.5 text-sm rounded border h-16 ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountCookie, value: f.cookie, onChange: (a) => K((i) => i && { ...i, cookie: a.target.value }) }),
              /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ n("button", { type: "button", onClick: () => K(null), className: `px-3 py-1.5 text-sm rounded border ${I}`, children: t.cancel }),
                /* @__PURE__ */ n("button", { type: "button", onClick: wt, className: "px-3 py-1.5 text-sm rounded bg-blue-600 text-white", children: t.save })
              ] })
            ] }),
            k && /* @__PURE__ */ u("div", { className: `mt-4 p-4 rounded border space-y-3 ${ke}`, children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: "Name (e.g. MEGA.nz)",
                  value: k.name || "",
                  onChange: (a) => O((i) => ({ ...i, name: a.target.value }))
                }
              ),
              /* @__PURE__ */ u(
                "select",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: k.type || "curl",
                  onChange: (a) => O((i) => ({ ...i, type: a.target.value })),
                  children: [
                    /* @__PURE__ */ n("option", { value: "curl", children: "curl template" }),
                    /* @__PURE__ */ n("option", { value: "api", children: "API resolve" })
                  ]
                }
              ),
              /* @__PURE__ */ n(
                "textarea",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border h-20 ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: t.urlPatterns,
                  value: Array.isArray(k.url_patterns) ? k.url_patterns.join(`
`) : "",
                  onChange: (a) => O((i) => ({
                    ...i,
                    url_patterns: a.target.value.split(`
`).map((F) => F.trim()).filter(Boolean)
                  }))
                }
              ),
              k.type === "curl" ? /* @__PURE__ */ n(
                "textarea",
                {
                  className: `w-full px-2 py-1.5 text-sm font-mono text-xs rounded border h-24 ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: t.curlTemplate,
                  value: k.curl_template || "",
                  onChange: (a) => O((i) => ({ ...i, curl_template: a.target.value }))
                }
              ) : /* @__PURE__ */ n(
                "input",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: t.apiResolve,
                  value: k.api_config?.resolve_url || "",
                  onChange: (a) => O((i) => ({
                    ...i,
                    api_config: { ...i?.api_config || { method: "POST", headers: {}, body_template: "", download_url_field: "direct_link" }, resolve_url: a.target.value }
                  }))
                }
              ),
              /* @__PURE__ */ u("p", { className: `text-xs ${z}`, children: [
                "Placeholders: ",
                "{URL}",
                " ",
                "{OUT}",
                " ",
                "{USER}",
                " ",
                "{PASS}",
                " ",
                "{API_KEY}",
                " ",
                "{COOKIE}"
              ] }),
              /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ n("button", { type: "button", onClick: () => O(null), className: `px-3 py-1.5 text-sm rounded border ${I}`, children: t.cancel }),
                /* @__PURE__ */ n("button", { type: "button", onClick: vt, className: "px-3 py-1.5 text-sm rounded bg-blue-600 text-white", children: t.save })
              ] })
            ] })
          ] }),
          U === "google" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ n("p", { className: `text-sm ${z}`, children: ct?.connected || ee.google_oauth_connected ? "✓ Google Drive connected" : "Connect Google account for private files and folder listing without API key." }),
            /* @__PURE__ */ n(M, { label: t.oauthClientId, children: /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: Le, onChange: (a) => ut(a.target.value) }) }),
            /* @__PURE__ */ n(M, { label: t.oauthClientSecret, children: /* @__PURE__ */ n("input", { type: "password", className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: ze, onChange: (a) => pt(a.target.value) }) }),
            /* @__PURE__ */ n(M, { label: t.oauthRedirect, children: /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: Me, onChange: (a) => mt(a.target.value) }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: yt, className: "px-4 py-2 rounded bg-blue-600 text-white text-sm", children: t.connectGoogle })
          ] }),
          U === "aria2" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ u("p", { className: `text-sm ${z}`, children: [
              t.aria2AutoStartHint,
              " Log:",
              " ",
              /* @__PURE__ */ n("code", { className: "text-xs", children: "/opt/copanel/config/download_manager/aria2.log" })
            ] }),
            /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  type: "checkbox",
                  checked: P.aria2_auto_start !== !1,
                  onChange: (a) => $((i) => ({ ...i, aria2_auto_start: a.target.checked }))
                }
              ),
              t.aria2AutoStart
            ] }),
            /* @__PURE__ */ n(M, { label: t.aria2Host, children: /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: P.aria2_rpc_host || "127.0.0.1", onChange: (a) => $((i) => ({ ...i, aria2_rpc_host: a.target.value })) }) }),
            /* @__PURE__ */ n(M, { label: t.aria2Port, children: /* @__PURE__ */ n("input", { type: "number", className: `w-32 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: P.aria2_rpc_port ?? 6800, onChange: (a) => $((i) => ({ ...i, aria2_rpc_port: Number(a.target.value) })) }) }),
            /* @__PURE__ */ n(M, { label: t.aria2Secret, children: /* @__PURE__ */ n("input", { type: "password", placeholder: ee.aria2_rpc_secret_set ? "••••••••" : "", className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, onChange: (a) => $((i) => ({ ...i, aria2_rpc_secret: a.target.value })) }) })
          ] })
        ] })
      ] }),
      U !== "file-hosting" && /* @__PURE__ */ u("div", { className: "flex justify-end gap-2 mt-4 pt-3 border-t border-slate-700/30", children: [
        /* @__PURE__ */ n("button", { type: "button", onClick: () => V(!1), className: `px-4 py-2 rounded border ${I}`, children: t.cancel }),
        /* @__PURE__ */ n("button", { type: "button", onClick: gt, className: "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700", children: t.save })
      ] })
    ] }),
    /* @__PURE__ */ n(
      Se,
      {
        open: !!X,
        onClose: () => {
          fe(null), ve(null);
        },
        title: t.selectFolder,
        children: X && /* @__PURE__ */ u("div", { className: "p-4", children: [
          /* @__PURE__ */ n("div", { className: `text-xs mb-2 font-mono ${z}`, children: X.current }),
          X.parent && /* @__PURE__ */ u("button", { type: "button", onClick: () => Ge(X.parent), className: "text-sm text-blue-500 mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ n(N.ArrowUp, { className: "w-4 h-4" }),
            " .."
          ] }),
          /* @__PURE__ */ n("div", { className: "max-h-48 overflow-y-auto border rounded mb-3", children: X.entries.map((a) => /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              onClick: () => Ge(a.path),
              className: "w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-blue-500/10",
              children: [
                /* @__PURE__ */ n(N.Folder, { className: "w-4 h-4 text-amber-500" }),
                a.name
              ]
            },
            a.path
          )) }),
          /* @__PURE__ */ u("button", { type: "button", onClick: () => ft(X.current), className: "w-full py-2 rounded bg-blue-600 text-white text-sm", children: [
            t.selectFolder,
            ": ",
            X.current
          ] })
        ] })
      }
    )
  ] }) });
}
function E({ label: e, value: r, mono: o, error: t }) {
  return /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ u("span", { className: "text-slate-500 shrink-0 w-24", children: [
      e,
      ":"
    ] }),
    /* @__PURE__ */ n("span", { className: `truncate ${o ? "font-mono text-xs" : ""} ${t ? "text-red-500" : ""}`, title: r, children: r })
  ] });
}
function M({ label: e, children: r }) {
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ n("div", { className: "text-sm font-medium text-blue-500 mb-1", children: e }),
    r
  ] });
}
export {
  Lr as default
};
