var Nt = Object.defineProperty;
var kt = (e, r, o) => r in e ? Nt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[r] = o;
var B = (e, r, o) => kt(e, typeof r != "symbol" ? r + "" : r, o);
import { jsx as n, jsxs as u, Fragment as $e } from "react/jsx-runtime";
import { createContext as Ye, useContext as Ze, useState as x, useEffect as be, useRef as Qe, useLayoutEffect as _t, useMemo as St, useCallback as We } from "react";
import { useOutletContext as Tt } from "react-router-dom";
import * as N from "lucide-react";
import { createPortal as At } from "react-dom";
const $t = Ye(null);
function Pt() {
  return Ze($t);
}
const Rt = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Ee() {
  const e = Pt(), r = Tt();
  return e || (r?.theme ? {
    theme: r.theme,
    setTheme: r.setTheme ?? (() => {
    }),
    language: r.language ?? "en",
    setLanguage: r.setLanguage ?? (() => {
    })
  } : Rt);
}
function et(e) {
  var r, o, t = "";
  if (typeof e == "string" || typeof e == "number") t += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var c = e.length;
    for (r = 0; r < c; r++) e[r] && (o = et(e[r])) && (t && (t += " "), t += o);
  } else for (o in e) e[o] && (t && (t += " "), t += o);
  return t;
}
function It() {
  for (var e, r, o = 0, t = "", c = arguments.length; o < c; o++) (e = arguments[o]) && (r = et(e)) && (t && (t += " "), t += r);
  return t;
}
const Le = "-", Et = (e) => {
  const r = zt(e), {
    conflictingClassGroups: o,
    conflictingClassGroupModifiers: t
  } = e;
  return {
    getClassGroupId: (s) => {
      const d = s.split(Le);
      return d[0] === "" && d.length !== 1 && d.shift(), tt(d, r) || Lt(s);
    },
    getConflictingClassGroupIds: (s, d) => {
      const m = o[s] || [];
      return d && t[s] ? [...m, ...t[s]] : m;
    }
  };
}, tt = (e, r) => {
  if (e.length === 0)
    return r.classGroupId;
  const o = e[0], t = r.nextPart.get(o), c = t ? tt(e.slice(1), t) : void 0;
  if (c)
    return c;
  if (r.validators.length === 0)
    return;
  const l = e.join(Le);
  return r.validators.find(({
    validator: s
  }) => s(l))?.classGroupId;
}, He = /^\[(.+)\]$/, Lt = (e) => {
  if (He.test(e)) {
    const r = He.exec(e)[1], o = r?.substring(0, r.indexOf(":"));
    if (o)
      return "arbitrary.." + o;
  }
}, zt = (e) => {
  const {
    theme: r,
    prefix: o
  } = e, t = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Dt(Object.entries(e.classGroups), o).forEach(([l, s]) => {
    Pe(s, t, l, r);
  }), t;
}, Pe = (e, r, o, t) => {
  e.forEach((c) => {
    if (typeof c == "string") {
      const l = c === "" ? r : Ve(r, c);
      l.classGroupId = o;
      return;
    }
    if (typeof c == "function") {
      if (Mt(c)) {
        Pe(c(t), r, o, t);
        return;
      }
      r.validators.push({
        validator: c,
        classGroupId: o
      });
      return;
    }
    Object.entries(c).forEach(([l, s]) => {
      Pe(s, Ve(r, l), o, t);
    });
  });
}, Ve = (e, r) => {
  let o = e;
  return r.split(Le).forEach((t) => {
    o.nextPart.has(t) || o.nextPart.set(t, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), o = o.nextPart.get(t);
  }), o;
}, Mt = (e) => e.isThemeGetter, Dt = (e, r) => r ? e.map(([o, t]) => {
  const c = t.map((l) => typeof l == "string" ? r + l : typeof l == "object" ? Object.fromEntries(Object.entries(l).map(([s, d]) => [r + s, d])) : l);
  return [o, c];
}) : e, jt = (e) => {
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
}, rt = "!", Ot = (e) => {
  const {
    separator: r,
    experimentalParseClassName: o
  } = e, t = r.length === 1, c = r[0], l = r.length, s = (d) => {
    const m = [];
    let b = 0, C = 0, g;
    for (let w = 0; w < d.length; w++) {
      let _ = d[w];
      if (b === 0) {
        if (_ === c && (t || d.slice(w, w + l) === r)) {
          m.push(d.slice(C, w)), C = w + l;
          continue;
        }
        if (_ === "/") {
          g = w;
          continue;
        }
      }
      _ === "[" ? b++ : _ === "]" && b--;
    }
    const A = m.length === 0 ? d : d.substring(C), E = A.startsWith(rt), L = E ? A.substring(1) : A, k = g && g > C ? g - C : void 0;
    return {
      modifiers: m,
      hasImportantModifier: E,
      baseClassName: L,
      maybePostfixModifierPosition: k
    };
  };
  return o ? (d) => o({
    className: d,
    parseClassName: s
  }) : s;
}, Gt = (e) => {
  if (e.length <= 1)
    return e;
  const r = [];
  let o = [];
  return e.forEach((t) => {
    t[0] === "[" ? (r.push(...o.sort(), t), o = []) : o.push(t);
  }), r.push(...o.sort()), r;
}, Ut = (e) => ({
  cache: jt(e.cacheSize),
  parseClassName: Ot(e),
  ...Et(e)
}), Ft = /\s+/, Bt = (e, r) => {
  const {
    parseClassName: o,
    getClassGroupId: t,
    getConflictingClassGroupIds: c
  } = r, l = [], s = e.trim().split(Ft);
  let d = "";
  for (let m = s.length - 1; m >= 0; m -= 1) {
    const b = s[m], {
      modifiers: C,
      hasImportantModifier: g,
      baseClassName: A,
      maybePostfixModifierPosition: E
    } = o(b);
    let L = !!E, k = t(L ? A.substring(0, E) : A);
    if (!k) {
      if (!L) {
        d = b + (d.length > 0 ? " " + d : d);
        continue;
      }
      if (k = t(A), !k) {
        d = b + (d.length > 0 ? " " + d : d);
        continue;
      }
      L = !1;
    }
    const w = Gt(C).join(":"), _ = g ? w + rt : w, h = _ + k;
    if (l.includes(h))
      continue;
    l.push(h);
    const Z = c(k, L);
    for (let M = 0; M < Z.length; ++M) {
      const G = Z[M];
      l.push(_ + G);
    }
    d = b + (d.length > 0 ? " " + d : d);
  }
  return d;
};
function Wt() {
  let e = 0, r, o, t = "";
  for (; e < arguments.length; )
    (r = arguments[e++]) && (o = ot(r)) && (t && (t += " "), t += o);
  return t;
}
const ot = (e) => {
  if (typeof e == "string")
    return e;
  let r, o = "";
  for (let t = 0; t < e.length; t++)
    e[t] && (r = ot(e[t])) && (o && (o += " "), o += r);
  return o;
};
function Ht(e, ...r) {
  let o, t, c, l = s;
  function s(m) {
    const b = r.reduce((C, g) => g(C), e());
    return o = Ut(b), t = o.cache.get, c = o.cache.set, l = d, d(m);
  }
  function d(m) {
    const b = t(m);
    if (b)
      return b;
    const C = Bt(m, o);
    return c(m, C), C;
  }
  return function() {
    return l(Wt.apply(null, arguments));
  };
}
const v = (e) => {
  const r = (o) => o[e] || [];
  return r.isThemeGetter = !0, r;
}, nt = /^\[(?:([a-z-]+):)?(.+)\]$/i, Vt = /^\d+\/\d+$/, Kt = /* @__PURE__ */ new Set(["px", "full", "screen"]), Xt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, qt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Jt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Yt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Zt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, H = (e) => ae(e) || Kt.has(e) || Vt.test(e), J = (e) => le(e, "length", lr), ae = (e) => !!e && !Number.isNaN(Number(e)), Se = (e) => le(e, "number", ae), ue = (e) => !!e && Number.isInteger(Number(e)), Qt = (e) => e.endsWith("%") && ae(e.slice(0, -1)), p = (e) => nt.test(e), Y = (e) => Xt.test(e), er = /* @__PURE__ */ new Set(["length", "size", "percentage"]), tr = (e) => le(e, er, at), rr = (e) => le(e, "position", at), or = /* @__PURE__ */ new Set(["image", "url"]), nr = (e) => le(e, or, ir), ar = (e) => le(e, "", sr), pe = () => !0, le = (e, r, o) => {
  const t = nt.exec(e);
  return t ? t[1] ? typeof r == "string" ? t[1] === r : r.has(t[1]) : o(t[2]) : !1;
}, lr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  qt.test(e) && !Jt.test(e)
), at = () => !1, sr = (e) => Yt.test(e), ir = (e) => Zt.test(e), cr = () => {
  const e = v("colors"), r = v("spacing"), o = v("blur"), t = v("brightness"), c = v("borderColor"), l = v("borderRadius"), s = v("borderSpacing"), d = v("borderWidth"), m = v("contrast"), b = v("grayscale"), C = v("hueRotate"), g = v("invert"), A = v("gap"), E = v("gradientColorStops"), L = v("gradientColorStopPositions"), k = v("inset"), w = v("margin"), _ = v("opacity"), h = v("padding"), Z = v("saturate"), M = v("scale"), G = v("sepia"), se = v("skew"), Q = v("space"), te = v("translate"), ie = () => ["auto", "contain", "none"], V = () => ["auto", "hidden", "clip", "visible", "scroll"], U = () => ["auto", p, r], y = () => [p, r], ee = () => ["", H, J], re = () => ["auto", ae, p], P = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], $ = () => ["solid", "dashed", "dotted", "double", "none"], ge = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ce = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], S = () => ["", "0", p], O = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], f = () => [ae, p];
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
      borderSpacing: y(),
      borderWidth: ee(),
      contrast: f(),
      grayscale: S(),
      hueRotate: f(),
      invert: S(),
      gap: y(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Qt, J],
      inset: U(),
      margin: U(),
      opacity: f(),
      padding: y(),
      saturate: f(),
      scale: f(),
      sepia: S(),
      skew: f(),
      space: y(),
      translate: y()
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
        inset: [k]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [k]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [k]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [k]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [k]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [k]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [k]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [k]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [k]
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
        grow: S()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: S()
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
        p: [h]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [h]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [h]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [h]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [h]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [h]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [h]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [h]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [h]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [w]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [w]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [w]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [w]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [w]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [w]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [w]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [w]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [w]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Se]
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
        "line-clamp": ["none", ae, Se]
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
        "placeholder-opacity": [_]
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
        "text-opacity": [_]
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
        indent: y()
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
        "bg-opacity": [_]
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
        bg: [...P(), rr]
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
        bg: ["auto", "cover", "contain", tr]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, nr]
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
        from: [L]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [L]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [L]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [E]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [E]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [E]
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
        "border-opacity": [_]
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
        "divide-opacity": [_]
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
        "ring-opacity": [_]
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
        shadow: ["", "inner", "none", Y, ar]
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
        opacity: [_]
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
        grayscale: [b]
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
        "backdrop-grayscale": [b]
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
        "backdrop-opacity": [_]
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
        scale: [M]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [M]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [M]
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
        "scroll-m": y()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": y()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": y()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": y()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": y()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": y()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": y()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": y()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": y()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": y()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": y()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": y()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": y()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": y()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": y()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": y()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": y()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": y()
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
        stroke: [H, J, Se]
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
}, dr = /* @__PURE__ */ Ht(cr);
function W(...e) {
  return dr(It(e));
}
const ur = "copanel_mobile_desktop_site";
function pr() {
  try {
    return localStorage.getItem(ur) === "1";
  } catch {
    return !1;
  }
}
function Re(e = window.innerWidth) {
  return pr() || e >= 1024;
}
const mr = Ye(null);
function lt() {
  return Ze(mr);
}
function st() {
  return lt()?.isWindowed === !0;
}
function hr({ children: e, className: r, constrained: o = !1 }) {
  const { theme: t } = Ee(), c = st(), l = t === "dark", s = !c && !Re();
  return /* @__PURE__ */ n(
    "div",
    {
      className: W(
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
function br({
  isDark: e,
  sidebar: r,
  children: o,
  mobileTitle: t,
  className: c
}) {
  const l = st(), [s, d] = x(!1), [m, b] = x(() => Re());
  be(() => {
    const A = () => b(Re());
    return window.addEventListener("resize", A), () => window.removeEventListener("resize", A);
  }, []);
  const C = !l && !m;
  be(() => {
    m && d(!1);
  }, [m]);
  const g = () => d(!1);
  return C ? /* @__PURE__ */ u("div", { className: W("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", c), children: [
    /* @__PURE__ */ u(
      "div",
      {
        className: W(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2.5",
          e ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white"
        ),
        children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => d(!0),
              className: W(
                "inline-flex items-center justify-center rounded-lg p-2",
                e ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ n(N.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          t ? /* @__PURE__ */ n("span", { className: W("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: t }) : null
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
        className: W(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          s ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: g,
        children: r
      }
    ),
    /* @__PURE__ */ n("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: o })
  ] }) : /* @__PURE__ */ u("div", { className: W("flex h-full min-h-0 flex-1 overflow-hidden", c), children: [
    r,
    /* @__PURE__ */ n("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: o })
  ] });
}
const gr = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function Te({
  open: e,
  onClose: r,
  children: o,
  title: t,
  className: c,
  maxWidth: l = "lg",
  closeOnBackdropClick: s = !0
}) {
  const { theme: d } = Ee(), m = d === "dark", b = lt(), C = Qe(null), [g, A] = x(null);
  _t(() => {
    if (b?.isWindowed) return;
    const h = C.current?.closest(".module-window-viewport");
    A(h instanceof HTMLElement ? h : null);
  }, [b?.isWindowed, e]);
  const E = /* @__PURE__ */ n("span", { ref: C, hidden: !0, "aria-hidden": "true" });
  if (!e) return E;
  const L = !!(b?.isWindowed || g), k = /* @__PURE__ */ n(
    "div",
    {
      className: W(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        L ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: s ? r : void 0,
      children: /* @__PURE__ */ u(
        "div",
        {
          className: W(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            gr[l],
            m ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            c
          ),
          onClick: (h) => h.stopPropagation(),
          children: [
            t && /* @__PURE__ */ u(
              "div",
              {
                className: W(
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
  ), w = (b?.isWindowed ? b.viewportRef.current : null) || g || document.body, _ = At(k, w);
  return /* @__PURE__ */ u($e, { children: [
    E,
    _
  ] });
}
class Ke extends Error {
  constructor(o, t, c, l) {
    super(t);
    B(this, "code");
    B(this, "status");
    B(this, "details");
    this.code = o, this.status = c, this.details = l;
  }
}
async function T(e, r = {}) {
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
function we() {
  return typeof localStorage > "u" ? null : localStorage.getItem("copanel_token");
}
function fr(e) {
  const r = {};
  e && new Headers(e).forEach((c, l) => {
    r[l] = c;
  });
  const o = we();
  return o && (r.Authorization = `Bearer ${o}`), r;
}
function xr(e, r = {}) {
  const o = fr(r.headers);
  return fetch(e, { ...r, headers: o });
}
async function yr() {
  if (!we()) return null;
  try {
    const e = await xr("/api/auth/stream-ticket", { method: "POST" });
    if (!e.ok) return null;
    const r = await e.json();
    return typeof r?.ticket == "string" ? r.ticket : null;
  } catch {
    return null;
  }
}
const wr = "copanel-platform-sse-degraded", me = 2e3, vr = 6e4, Cr = 3;
class Nr {
  constructor() {
    B(this, "source", null);
    B(this, "handlers", /* @__PURE__ */ new Map());
    B(this, "retryDelay", me);
    B(this, "retryTimer", null);
    B(this, "failureCount", 0);
    B(this, "connecting", !1);
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
  async buildUrl() {
    if (!we()) return null;
    const r = await yr();
    return r ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      ticket: r
    }).toString()}` : null;
  }
  ensureConnected() {
    this.source || this.connecting || typeof document < "u" && document.hidden || we() && (this.connecting = !0, this.buildUrl().then((r) => {
      if (this.connecting = !1, !(this.source || this.handlers.size === 0)) {
        if (!r) {
          this.failureCount += 1, this.scheduleRetry();
          return;
        }
        this.openSource(r);
      }
    }).catch(() => {
      this.connecting = !1, this.scheduleRetry();
    }));
  }
  openSource(r) {
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
      this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Cr && window.dispatchEvent(new CustomEvent(wr)), this.scheduleRetry();
    };
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
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), vr), this.retryTimer = setTimeout(() => {
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
const ze = new Nr();
function kr() {
  ze.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || kr();
});
function it(e) {
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
const ct = it({ jobs: {}, order: [], lastFetch: 0 });
function _r() {
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
function Sr(e) {
  const r = _r(), o = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: ne(e, "title", r) || ne(o, "title", r) || e?.title || "",
    message: ne(e, "message", r) || ne(o, "message", r) || e?.message,
    error: ne(e, "error", r) || ne(o, "error", r) || e?.error || null
  };
}
function qe(e) {
  const r = Sr(e);
  ct.setState((o) => {
    const t = { ...o.jobs, [r.id]: { ...o.jobs[r.id], ...r } };
    let c = o.order;
    return c.includes(r.id) || (c = [r.id, ...c].slice(0, 200)), { jobs: t, order: c };
  });
}
ze.on("jobs", (e) => {
  if (e?.job) {
    qe(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const r = ct.getState().jobs[e.job_id];
    r && qe({
      ...r,
      progress: e.progress ?? r.progress,
      message: e.message ?? r.message,
      status: e.status ?? r.status
    });
  }
});
const Ie = it({ inbox: [], unread: 0, toasts: [] }), Tr = 6e3;
function Ar() {
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
function $r(e) {
  const r = Ar(), o = e?.payload && typeof e.payload == "object" ? e.payload : {}, t = ye(e, "title", r) || ye(o, "title", r) || e?.title || "", c = ye(e, "body", r) || ye(o, "body", r) || e?.body || null;
  return {
    ...e,
    title: t,
    body: c
  };
}
function Pr(e) {
  Ie.setState((r) => ({ toasts: [e, ...r.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    Ie.setState((r) => ({ toasts: r.toasts.filter((o) => o.id !== e.id) }));
  }, Tr);
}
ze.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const r = $r(e.notification);
    Pr({ ...r, ephemeral: !0 }), Ie.setState((o) => ({
      inbox: [r, ...o.inbox].slice(0, 200),
      unread: o.unread + 1
    }));
  }
});
const Rr = [
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
function Ae(e) {
  return e ? `${he(e)}/s` : "—";
}
function Ir(e) {
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
function Er({ status: e }) {
  return e === "completed" ? /* @__PURE__ */ n(N.CheckCircle2, { className: "w-4 h-4 text-emerald-500" }) : e === "downloading" || e === "connecting" ? /* @__PURE__ */ n(N.Loader2, { className: "w-4 h-4 text-blue-500 animate-spin" }) : e === "paused" || e === "stopped" ? /* @__PURE__ */ n(N.PauseCircle, { className: "w-4 h-4 text-amber-500" }) : e === "error" ? /* @__PURE__ */ n(N.AlertCircle, { className: "w-4 h-4 text-red-500" }) : /* @__PURE__ */ n(N.Clock, { className: "w-4 h-4 text-slate-400" });
}
function Or() {
  const { theme: e, language: r } = Ee(), o = e === "dark", t = St(
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
  }, [l, s] = x("all"), [d, m] = x(""), [b, C] = x([]), [g, A] = x(null), [E, L] = x("general"), [k, w] = x(!0), [_, h] = x(null), [Z, M] = x(!1), [G, se] = x(""), [Q, te] = x(null), [ie, V] = x(!1), [U, y] = x("general"), [ee, re] = x(null), [P, $] = x({}), [ge, ce] = x([]), [S, O] = x(null), [f, K] = x(null), [de, ve] = x(null), [dt, ut] = x(null), [Me, pt] = x(""), [De, mt] = x(""), [je, ht] = x(`${typeof window < "u" ? window.location.origin : ""}/api/download_manager/oauth/google/callback`), Oe = Qe(null), [X, fe] = x(null), [Ge, Ce] = x(null), R = b.find((a) => a.id === g) || null, q = We(async () => {
    try {
      const a = await T(`/api/download_manager/tasks?filter=${l}&search=${encodeURIComponent(d)}`);
      C(a || []);
    } catch (a) {
      h(a.message);
    } finally {
      w(!1);
    }
  }, [l, d]), oe = We(async () => {
    const [a, i, F, xe] = await Promise.all([
      T("/api/download_manager/settings"),
      T("/api/download_manager/file-hosting"),
      T("/api/download_manager/engine/status"),
      T("/api/download_manager/oauth/google/status")
    ]);
    re(a), $(a), ce(i || []), ve(F), ut(xe);
  }, []);
  be(() => {
    q(), T("/api/download_manager/engine/status").then(ve).catch(() => {
    });
    const a = setInterval(() => {
      q(), T("/api/download_manager/engine/status").then(ve).catch(() => {
      });
    }, 3e3);
    return () => clearInterval(a);
  }, [q]), be(() => {
    function a(i) {
      i.origin === window.location.origin && (!i.data || i.data.type !== "copanel_dm_google_oauth" || (i.data.ok ? (oe(), h(null)) : h(i.data.error || "Google OAuth failed")));
    }
    return window.addEventListener("message", a), () => window.removeEventListener("message", a);
  }, [oe]), be(() => {
    G.length > 8 ? T("/api/download_manager/detect-url", {
      method: "POST",
      body: { url: G }
    }).then(te).catch(() => te(null)) : te(null);
  }, [G]);
  async function Ue() {
    if (G.trim()) {
      h(null);
      try {
        await T("/api/download_manager/tasks", { method: "POST", body: { url: G.trim() } }), se(""), M(!1), q();
      } catch (a) {
        h(a.message);
      }
    }
  }
  async function Ne(a) {
    if (g)
      try {
        await T(`/api/download_manager/tasks/${g}/${a}`, { method: "POST" }), q();
      } catch (i) {
        h(i.message);
      }
  }
  async function bt() {
    if (g)
      try {
        await T(`/api/download_manager/tasks/${g}`, { method: "DELETE" }), A(null), q();
      } catch (a) {
        h(a.message);
      }
  }
  async function gt() {
    try {
      await T("/api/download_manager/tasks/completed", { method: "DELETE" }), q();
    } catch (a) {
      h(a.message);
    }
  }
  async function ft() {
    try {
      await T("/api/download_manager/settings", { method: "PUT", body: P }), await oe(), V(!1);
    } catch (a) {
      h(a.message);
    }
  }
  async function ke(a) {
    Ce(a);
    const i = a === "temp_folder" ? P.temp_folder : a === "destination_folder" ? P.destination_folder : P.watched_folder, F = await T(`/api/download_manager/folders/browse?path=${encodeURIComponent(i || "")}`);
    fe(F);
  }
  async function Fe(a) {
    const i = await T(`/api/download_manager/folders/browse?path=${encodeURIComponent(a)}`);
    fe(i);
  }
  function xt(a) {
    Ge && ($((i) => ({ ...i, [Ge]: a })), fe(null), Ce(null));
  }
  async function yt(a) {
    if (a) {
      h(null);
      try {
        const i = localStorage.getItem("copanel_token"), F = new FormData();
        F.append("file", a);
        const xe = await fetch("/api/download_manager/tasks/upload-torrent", {
          method: "POST",
          headers: i ? { Authorization: `Bearer ${i}` } : {},
          body: F
        }), Be = await xe.json();
        if (!xe.ok || Be.status === "error")
          throw new Error(Be.error?.message || "Upload failed");
        q();
      } catch (i) {
        h(i.message);
      }
    }
  }
  async function wt() {
    try {
      const a = await T("/api/download_manager/oauth/google/start", {
        method: "POST",
        body: {
          client_id: Me,
          client_secret: De,
          redirect_uri: je
        }
      });
      window.open(a.auth_url, "copanel_google_oauth", "width=520,height=720");
    } catch (a) {
      h(a.message);
    }
  }
  async function vt() {
    if (!f?.profileId || !f.label.trim()) return;
    const a = {
      label: f.label,
      username: f.username,
      password: f.password,
      api_key: f.api_key,
      cookie: f.cookie
    };
    try {
      f.account?.id ? await T(`/api/download_manager/file-hosting/${f.profileId}/accounts/${f.account.id}`, {
        method: "PUT",
        body: a
      }) : await T(`/api/download_manager/file-hosting/${f.profileId}/accounts`, {
        method: "POST",
        body: a
      }), K(null), await oe();
    } catch (i) {
      h(i.message);
    }
  }
  async function Ct() {
    if (!S?.name) return;
    const a = {
      ...S,
      url_patterns: S.url_patterns ? String(S.url_patterns).split(`
`).map((i) => i.trim()).filter(Boolean) : S.url_patterns || []
    };
    try {
      S.id ? await T(`/api/download_manager/file-hosting/${S.id}`, { method: "PUT", body: a }) : await T("/api/download_manager/file-hosting", { method: "POST", body: a }), O(null), await oe();
    } catch (i) {
      h(i.message);
    }
  }
  const _e = o ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200", D = o ? "text-slate-400" : "text-slate-500", I = o ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200";
  return /* @__PURE__ */ n(hr, { constrained: !0, children: /* @__PURE__ */ u("div", { className: `flex flex-col h-full min-h-0 ${o ? "text-slate-100" : "text-slate-900"}`, children: [
    /* @__PURE__ */ u("div", { className: `px-4 py-3 border-b flex items-center justify-between ${o ? "border-slate-700" : "border-slate-200"}`, children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ n("h1", { className: "text-xl font-semibold", children: t.title }),
        /* @__PURE__ */ n("p", { className: `text-sm ${D}`, children: t.subtitle })
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
        ref: Oe,
        type: "file",
        accept: ".torrent",
        className: "hidden",
        onChange: (a) => {
          yt(a.target.files?.[0] || null), a.target.value = "";
        }
      }
    ),
    _ && /* @__PURE__ */ u("div", { className: "mx-4 mt-2 px-3 py-2 rounded bg-red-500/10 text-red-500 text-sm flex justify-between", children: [
      /* @__PURE__ */ n("span", { children: _ }),
      /* @__PURE__ */ n("button", { type: "button", onClick: () => h(null), children: /* @__PURE__ */ n(N.X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ n(
      br,
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
          /* @__PURE__ */ n("nav", { className: "flex-1 overflow-y-auto px-1", children: Rr.map(({ key: a, icon: i }) => {
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
            /* @__PURE__ */ n("button", { type: "button", onClick: () => M(!0), className: `p-2 rounded border ${I}`, title: t.addUrl, children: /* @__PURE__ */ n(N.Plus, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: () => M(!0), className: `p-2 rounded border ${I}`, title: t.addUrl, children: /* @__PURE__ */ n(N.Globe, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: () => Oe.current?.click(), className: `p-2 rounded border ${I}`, title: t.uploadTorrent, children: /* @__PURE__ */ n(N.FileUp, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("div", { className: `w-px h-6 mx-1 ${o ? "bg-slate-700" : "bg-slate-200"}` }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !g, onClick: () => Ne("resume"), className: `p-2 rounded border ${I} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Play, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !g, onClick: () => Ne("pause"), className: `p-2 rounded border ${I} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Pause, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !g, onClick: () => Ne("stop"), className: `p-2 rounded border ${I} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Square, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("div", { className: `w-px h-6 mx-1 ${o ? "bg-slate-700" : "bg-slate-200"}` }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !g, onClick: bt, className: `p-2 rounded border ${I} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Trash2, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: gt, className: `p-2 rounded border ${I}`, children: /* @__PURE__ */ n(N.Eraser, { className: "w-4 h-4" }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "flex-1 overflow-auto min-h-0", children: k && b.length === 0 ? /* @__PURE__ */ n("div", { className: `p-8 text-center ${D}`, children: /* @__PURE__ */ n(N.Loader2, { className: "w-6 h-6 animate-spin mx-auto mb-2" }) }) : b.length === 0 ? /* @__PURE__ */ n("div", { className: `p-8 text-center ${D}`, children: t.noTasks }) : /* @__PURE__ */ u("table", { className: "w-full text-sm", children: [
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
            /* @__PURE__ */ n("tbody", { children: b.map((a) => /* @__PURE__ */ u(
              "tr",
              {
                onClick: () => A(a.id),
                className: `cursor-pointer border-b ${g === a.id ? o ? "bg-blue-900/30" : "bg-blue-50" : o ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"}`,
                children: [
                  /* @__PURE__ */ n("td", { className: "p-2", children: /* @__PURE__ */ n(Er, { status: a.status }) }),
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
                  /* @__PURE__ */ n("td", { className: "p-2 text-right tabular-nums text-xs", children: Ae(a.download_speed) }),
                  /* @__PURE__ */ n("td", { className: `p-2 capitalize text-xs ${Ir(a.status)}`, children: a.status }),
                  /* @__PURE__ */ n("td", { className: `p-2 truncate max-w-[10rem] text-xs ${D}`, title: a.destination, children: a.destination })
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
                onClick: () => L(a),
                className: `pb-2 text-sm border-b-2 ${E === a ? "border-blue-500 text-blue-500" : `border-transparent ${D}`}`,
                children: i
              },
              a
            )) }),
            /* @__PURE__ */ n("div", { className: "px-4 py-3 grid grid-cols-2 gap-x-8 gap-y-1 text-sm overflow-y-auto max-h-32", children: E === "general" ? /* @__PURE__ */ u($e, { children: [
              /* @__PURE__ */ n(z, { label: t.colName, value: R.name }),
              /* @__PURE__ */ n(z, { label: t.colDest, value: R.destination }),
              /* @__PURE__ */ n(z, { label: t.colSize, value: he(R.total_bytes) }),
              /* @__PURE__ */ n(z, { label: "URL", value: R.source_url, mono: !0 }),
              /* @__PURE__ */ n(z, { label: "Type", value: R.source_type }),
              /* @__PURE__ */ n(z, { label: "User", value: R.created_by || "—" }),
              /* @__PURE__ */ n(z, { label: "Created", value: R.created_at }),
              R.error_message && /* @__PURE__ */ n(z, { label: "Error", value: R.error_message, error: !0 })
            ] }) : /* @__PURE__ */ u($e, { children: [
              /* @__PURE__ */ n(z, { label: t.colDownloaded, value: he(R.downloaded_bytes) }),
              /* @__PURE__ */ n(z, { label: t.colSpeed, value: Ae(R.download_speed) }),
              /* @__PURE__ */ n(z, { label: "Upload", value: Ae(R.upload_speed) }),
              /* @__PURE__ */ n(z, { label: t.colProgress, value: `${(R.progress || 0).toFixed(1)}%` }),
              /* @__PURE__ */ n(z, { label: t.colStatus, value: R.status }),
              /* @__PURE__ */ n(z, { label: "Completed", value: R.completed_at || "—" })
            ] }) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n(Te, { open: Z, onClose: () => M(!1), title: t.addUrl, children: /* @__PURE__ */ u("div", { className: "p-4", children: [
      /* @__PURE__ */ n(
        "input",
        {
          className: `w-full px-3 py-2 rounded border mb-2 ${o ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`,
          placeholder: t.urlPlaceholder,
          value: G,
          onChange: (a) => se(a.target.value),
          onKeyDown: (a) => a.key === "Enter" && Ue()
        }
      ),
      Q && /* @__PURE__ */ u("p", { className: `text-xs mb-3 ${D}`, children: [
        "Detected: ",
        /* @__PURE__ */ n("span", { className: "font-medium", children: Q.source_type }),
        Q.file_hosting_name ? ` → ${Q.file_hosting_name}` : ""
      ] }),
      /* @__PURE__ */ u("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ n("button", { type: "button", onClick: () => M(!1), className: `px-4 py-2 rounded border ${I}`, children: t.cancel }),
        /* @__PURE__ */ n("button", { type: "button", onClick: Ue, className: "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700", children: t.add })
      ] })
    ] }) }),
    ee && /* @__PURE__ */ u(Te, { open: ie, onClose: () => V(!1), title: t.settings, maxWidth: "2xl", className: "max-w-3xl", children: [
      /* @__PURE__ */ u("div", { className: "p-4 flex gap-4 min-h-[360px]", children: [
        /* @__PURE__ */ n("div", { className: `w-44 shrink-0 border-r pr-3 ${o ? "border-slate-700" : "border-slate-200"}`, children: ["general", "location", "file-hosting", "google", "aria2"].map((a) => /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            onClick: () => y(a),
            className: `block w-full text-left px-2 py-1.5 text-sm rounded mb-1 ${U === a ? "bg-blue-600/20 text-blue-400" : D}`,
            children: a === "general" ? t.tabGeneral : a === "location" ? t.destFolder : a === "file-hosting" ? t.fileHosting : a === "google" ? t.googleOAuth : t.aria2Rpc
          },
          a
        )) }),
        /* @__PURE__ */ u("div", { className: "flex-1 overflow-y-auto pr-2", children: [
          U === "general" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ n(j, { label: t.tempFolder, children: /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `flex-1 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: P.temp_folder || "",
                  onChange: (a) => $((i) => ({ ...i, temp_folder: a.target.value }))
                }
              ),
              /* @__PURE__ */ n("button", { type: "button", onClick: () => ke("temp_folder"), className: `px-3 py-1.5 text-sm rounded border ${I}`, children: t.selectFolder })
            ] }) }),
            /* @__PURE__ */ n(j, { label: t.maxConcurrent, children: /* @__PURE__ */ n(
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
            /* @__PURE__ */ n(j, { label: t.speedDown, children: /* @__PURE__ */ n(
              "input",
              {
                type: "number",
                min: 0,
                className: `w-32 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                value: P.max_download_speed_kbps ?? 0,
                onChange: (a) => $((i) => ({ ...i, max_download_speed_kbps: Number(a.target.value) }))
              }
            ) }),
            /* @__PURE__ */ n(j, { label: t.speedUp, children: /* @__PURE__ */ n(
              "input",
              {
                type: "number",
                min: 0,
                className: `w-32 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                value: P.max_upload_speed_kbps ?? 0,
                onChange: (a) => $((i) => ({ ...i, max_upload_speed_kbps: Number(a.target.value) }))
              }
            ) }),
            /* @__PURE__ */ n(j, { label: t.googleApiKey, children: /* @__PURE__ */ n(
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
            /* @__PURE__ */ n(j, { label: t.destFolder, children: /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `flex-1 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: P.destination_folder || "",
                  onChange: (a) => $((i) => ({ ...i, destination_folder: a.target.value }))
                }
              ),
              /* @__PURE__ */ n("button", { type: "button", onClick: () => ke("destination_folder"), className: `px-3 py-1.5 text-sm rounded border ${I}`, children: t.selectFolder })
            ] }) }),
            /* @__PURE__ */ n(j, { label: t.watchedFolder, children: /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `flex-1 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: P.watched_folder || "",
                  onChange: (a) => $((i) => ({ ...i, watched_folder: a.target.value }))
                }
              ),
              /* @__PURE__ */ n("button", { type: "button", onClick: () => ke("watched_folder"), className: `px-3 py-1.5 text-sm rounded border ${I}`, children: t.selectFolder })
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
            ge.map((a) => /* @__PURE__ */ u("div", { className: `p-3 rounded border ${_e}`, children: [
              /* @__PURE__ */ u("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ n("div", { className: "font-medium", children: a.name }),
                  /* @__PURE__ */ u("div", { className: `text-xs ${D}`, children: [
                    a.type,
                    " · ",
                    a.url_patterns.join(", ")
                  ] })
                ] }),
                /* @__PURE__ */ n("button", { type: "button", onClick: () => O(a), className: "text-xs text-blue-500", children: "Edit" })
              ] }),
              (a.accounts?.length || 0) > 0 && /* @__PURE__ */ u("div", { className: `mt-2 text-xs ${D}`, children: [
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
            f && /* @__PURE__ */ u("div", { className: `mt-4 p-4 rounded border space-y-2 ${_e}`, children: [
              /* @__PURE__ */ n("div", { className: "text-sm font-medium", children: t.manageAccounts }),
              /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountLabel, value: f.label, onChange: (a) => K((i) => i && { ...i, label: a.target.value }) }),
              /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountUser, value: f.username, onChange: (a) => K((i) => i && { ...i, username: a.target.value }) }),
              /* @__PURE__ */ n("input", { type: "password", className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountPass, value: f.password, onChange: (a) => K((i) => i && { ...i, password: a.target.value }) }),
              /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountApiKey, value: f.api_key, onChange: (a) => K((i) => i && { ...i, api_key: a.target.value }) }),
              /* @__PURE__ */ n("textarea", { className: `w-full px-2 py-1.5 text-sm rounded border h-16 ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: t.accountCookie, value: f.cookie, onChange: (a) => K((i) => i && { ...i, cookie: a.target.value }) }),
              /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ n("button", { type: "button", onClick: () => K(null), className: `px-3 py-1.5 text-sm rounded border ${I}`, children: t.cancel }),
                /* @__PURE__ */ n("button", { type: "button", onClick: vt, className: "px-3 py-1.5 text-sm rounded bg-blue-600 text-white", children: t.save })
              ] })
            ] }),
            S && /* @__PURE__ */ u("div", { className: `mt-4 p-4 rounded border space-y-3 ${_e}`, children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: "Name (e.g. MEGA.nz)",
                  value: S.name || "",
                  onChange: (a) => O((i) => ({ ...i, name: a.target.value }))
                }
              ),
              /* @__PURE__ */ u(
                "select",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: S.type || "curl",
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
                  value: Array.isArray(S.url_patterns) ? S.url_patterns.join(`
`) : "",
                  onChange: (a) => O((i) => ({
                    ...i,
                    url_patterns: a.target.value.split(`
`).map((F) => F.trim()).filter(Boolean)
                  }))
                }
              ),
              S.type === "curl" ? /* @__PURE__ */ n(
                "textarea",
                {
                  className: `w-full px-2 py-1.5 text-sm font-mono text-xs rounded border h-24 ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: t.curlTemplate,
                  value: S.curl_template || "",
                  onChange: (a) => O((i) => ({ ...i, curl_template: a.target.value }))
                }
              ) : /* @__PURE__ */ n(
                "input",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: t.apiResolve,
                  value: S.api_config?.resolve_url || "",
                  onChange: (a) => O((i) => ({
                    ...i,
                    api_config: { ...i?.api_config || { method: "POST", headers: {}, body_template: "", download_url_field: "direct_link" }, resolve_url: a.target.value }
                  }))
                }
              ),
              /* @__PURE__ */ u("p", { className: `text-xs ${D}`, children: [
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
                /* @__PURE__ */ n("button", { type: "button", onClick: Ct, className: "px-3 py-1.5 text-sm rounded bg-blue-600 text-white", children: t.save })
              ] })
            ] })
          ] }),
          U === "google" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ n("p", { className: `text-sm ${D}`, children: dt?.connected || ee.google_oauth_connected ? "✓ Google Drive connected" : "Connect Google account for private files and folder listing without API key." }),
            /* @__PURE__ */ n(j, { label: t.oauthClientId, children: /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: Me, onChange: (a) => pt(a.target.value) }) }),
            /* @__PURE__ */ n(j, { label: t.oauthClientSecret, children: /* @__PURE__ */ n("input", { type: "password", className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: De, onChange: (a) => mt(a.target.value) }) }),
            /* @__PURE__ */ n(j, { label: t.oauthRedirect, children: /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: je, onChange: (a) => ht(a.target.value) }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: wt, className: "px-4 py-2 rounded bg-blue-600 text-white text-sm", children: t.connectGoogle })
          ] }),
          U === "aria2" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ u("p", { className: `text-sm ${D}`, children: [
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
            /* @__PURE__ */ n(j, { label: t.aria2Host, children: /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: P.aria2_rpc_host || "127.0.0.1", onChange: (a) => $((i) => ({ ...i, aria2_rpc_host: a.target.value })) }) }),
            /* @__PURE__ */ n(j, { label: t.aria2Port, children: /* @__PURE__ */ n("input", { type: "number", className: `w-32 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: P.aria2_rpc_port ?? 6800, onChange: (a) => $((i) => ({ ...i, aria2_rpc_port: Number(a.target.value) })) }) }),
            /* @__PURE__ */ n(j, { label: t.aria2Secret, children: /* @__PURE__ */ n("input", { type: "password", placeholder: ee.aria2_rpc_secret_set ? "••••••••" : "", className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, onChange: (a) => $((i) => ({ ...i, aria2_rpc_secret: a.target.value })) }) })
          ] })
        ] })
      ] }),
      U !== "file-hosting" && /* @__PURE__ */ u("div", { className: "flex justify-end gap-2 mt-4 pt-3 border-t border-slate-700/30", children: [
        /* @__PURE__ */ n("button", { type: "button", onClick: () => V(!1), className: `px-4 py-2 rounded border ${I}`, children: t.cancel }),
        /* @__PURE__ */ n("button", { type: "button", onClick: ft, className: "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700", children: t.save })
      ] })
    ] }),
    /* @__PURE__ */ n(
      Te,
      {
        open: !!X,
        onClose: () => {
          fe(null), Ce(null);
        },
        title: t.selectFolder,
        children: X && /* @__PURE__ */ u("div", { className: "p-4", children: [
          /* @__PURE__ */ n("div", { className: `text-xs mb-2 font-mono ${D}`, children: X.current }),
          X.parent && /* @__PURE__ */ u("button", { type: "button", onClick: () => Fe(X.parent), className: "text-sm text-blue-500 mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ n(N.ArrowUp, { className: "w-4 h-4" }),
            " .."
          ] }),
          /* @__PURE__ */ n("div", { className: "max-h-48 overflow-y-auto border rounded mb-3", children: X.entries.map((a) => /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              onClick: () => Fe(a.path),
              className: "w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-blue-500/10",
              children: [
                /* @__PURE__ */ n(N.Folder, { className: "w-4 h-4 text-amber-500" }),
                a.name
              ]
            },
            a.path
          )) }),
          /* @__PURE__ */ u("button", { type: "button", onClick: () => xt(X.current), className: "w-full py-2 rounded bg-blue-600 text-white text-sm", children: [
            t.selectFolder,
            ": ",
            X.current
          ] })
        ] })
      }
    )
  ] }) });
}
function z({ label: e, value: r, mono: o, error: t }) {
  return /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ u("span", { className: "text-slate-500 shrink-0 w-24", children: [
      e,
      ":"
    ] }),
    /* @__PURE__ */ n("span", { className: `truncate ${o ? "font-mono text-xs" : ""} ${t ? "text-red-500" : ""}`, title: r, children: r })
  ] });
}
function j({ label: e, children: r }) {
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ n("div", { className: "text-sm font-medium text-blue-500 mb-1", children: e }),
    r
  ] });
}
export {
  Or as default
};
