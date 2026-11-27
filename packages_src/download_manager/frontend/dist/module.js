var kt = Object.defineProperty;
var _t = (e, t, o) => t in e ? kt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var G = (e, t, o) => _t(e, typeof t != "symbol" ? t + "" : t, o);
import { jsx as n, jsxs as u, Fragment as Pe } from "react/jsx-runtime";
import { createContext as Ye, useContext as Ze, useState as x, useEffect as fe, useRef as Qe, useLayoutEffect as St, useMemo as Tt, useCallback as We } from "react";
import { useOutletContext as At } from "react-router-dom";
import * as N from "lucide-react";
import { createPortal as $t } from "react-dom";
const Pt = Ye(null);
function Rt() {
  return Ze(Pt);
}
const Et = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Le() {
  const e = Rt(), t = At();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : Et);
}
function et(e) {
  var t, o, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var c = e.length;
    for (t = 0; t < c; t++) e[t] && (o = et(e[t])) && (r && (r += " "), r += o);
  } else for (o in e) e[o] && (r && (r += " "), r += o);
  return r;
}
function It() {
  for (var e, t, o = 0, r = "", c = arguments.length; o < c; o++) (e = arguments[o]) && (t = et(e)) && (r && (r += " "), r += t);
  return r;
}
const ze = "-", Lt = (e) => {
  const t = Mt(e), {
    conflictingClassGroups: o,
    conflictingClassGroupModifiers: r
  } = e;
  return {
    getClassGroupId: (s) => {
      const d = s.split(ze);
      return d[0] === "" && d.length !== 1 && d.shift(), tt(d, t) || zt(s);
    },
    getConflictingClassGroupIds: (s, d) => {
      const h = o[s] || [];
      return d && r[s] ? [...h, ...r[s]] : h;
    }
  };
}, tt = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const o = e[0], r = t.nextPart.get(o), c = r ? tt(e.slice(1), r) : void 0;
  if (c)
    return c;
  if (t.validators.length === 0)
    return;
  const l = e.join(ze);
  return t.validators.find(({
    validator: s
  }) => s(l))?.classGroupId;
}, He = /^\[(.+)\]$/, zt = (e) => {
  if (He.test(e)) {
    const t = He.exec(e)[1], o = t?.substring(0, t.indexOf(":"));
    if (o)
      return "arbitrary.." + o;
  }
}, Mt = (e) => {
  const {
    theme: t,
    prefix: o
  } = e, r = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Ft(Object.entries(e.classGroups), o).forEach(([l, s]) => {
    Re(s, r, l, t);
  }), r;
}, Re = (e, t, o, r) => {
  e.forEach((c) => {
    if (typeof c == "string") {
      const l = c === "" ? t : Ve(t, c);
      l.classGroupId = o;
      return;
    }
    if (typeof c == "function") {
      if (Dt(c)) {
        Re(c(r), t, o, r);
        return;
      }
      t.validators.push({
        validator: c,
        classGroupId: o
      });
      return;
    }
    Object.entries(c).forEach(([l, s]) => {
      Re(s, Ve(t, l), o, r);
    });
  });
}, Ve = (e, t) => {
  let o = e;
  return t.split(ze).forEach((r) => {
    o.nextPart.has(r) || o.nextPart.set(r, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), o = o.nextPart.get(r);
  }), o;
}, Dt = (e) => e.isThemeGetter, Ft = (e, t) => t ? e.map(([o, r]) => {
  const c = r.map((l) => typeof l == "string" ? t + l : typeof l == "object" ? Object.fromEntries(Object.entries(l).map(([s, d]) => [t + s, d])) : l);
  return [o, c];
}) : e, jt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  const c = (l, s) => {
    o.set(l, s), t++, t > e && (t = 0, r = o, o = /* @__PURE__ */ new Map());
  };
  return {
    get(l) {
      let s = o.get(l);
      if (s !== void 0)
        return s;
      if ((s = r.get(l)) !== void 0)
        return c(l, s), s;
    },
    set(l, s) {
      o.has(l) ? o.set(l, s) : c(l, s);
    }
  };
}, rt = "!", Ot = (e) => {
  const {
    separator: t,
    experimentalParseClassName: o
  } = e, r = t.length === 1, c = t[0], l = t.length, s = (d) => {
    const h = [];
    let b = 0, C = 0, f;
    for (let w = 0; w < d.length; w++) {
      let _ = d[w];
      if (b === 0) {
        if (_ === c && (r || d.slice(w, w + l) === t)) {
          h.push(d.slice(C, w)), C = w + l;
          continue;
        }
        if (_ === "/") {
          f = w;
          continue;
        }
      }
      _ === "[" ? b++ : _ === "]" && b--;
    }
    const A = h.length === 0 ? d : d.substring(C), I = A.startsWith(rt), L = I ? A.substring(1) : A, k = f && f > C ? f - C : void 0;
    return {
      modifiers: h,
      hasImportantModifier: I,
      baseClassName: L,
      maybePostfixModifierPosition: k
    };
  };
  return o ? (d) => o({
    className: d,
    parseClassName: s
  }) : s;
}, Ut = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let o = [];
  return e.forEach((r) => {
    r[0] === "[" ? (t.push(...o.sort(), r), o = []) : o.push(r);
  }), t.push(...o.sort()), t;
}, Gt = (e) => ({
  cache: jt(e.cacheSize),
  parseClassName: Ot(e),
  ...Lt(e)
}), Bt = /\s+/, Wt = (e, t) => {
  const {
    parseClassName: o,
    getClassGroupId: r,
    getConflictingClassGroupIds: c
  } = t, l = [], s = e.trim().split(Bt);
  let d = "";
  for (let h = s.length - 1; h >= 0; h -= 1) {
    const b = s[h], {
      modifiers: C,
      hasImportantModifier: f,
      baseClassName: A,
      maybePostfixModifierPosition: I
    } = o(b);
    let L = !!I, k = r(L ? A.substring(0, I) : A);
    if (!k) {
      if (!L) {
        d = b + (d.length > 0 ? " " + d : d);
        continue;
      }
      if (k = r(A), !k) {
        d = b + (d.length > 0 ? " " + d : d);
        continue;
      }
      L = !1;
    }
    const w = Ut(C).join(":"), _ = f ? w + rt : w, m = _ + k;
    if (l.includes(m))
      continue;
    l.push(m);
    const Z = c(k, L);
    for (let M = 0; M < Z.length; ++M) {
      const O = Z[M];
      l.push(_ + O);
    }
    d = b + (d.length > 0 ? " " + d : d);
  }
  return d;
};
function Ht() {
  let e = 0, t, o, r = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (o = ot(t)) && (r && (r += " "), r += o);
  return r;
}
const ot = (e) => {
  if (typeof e == "string")
    return e;
  let t, o = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = ot(e[r])) && (o && (o += " "), o += t);
  return o;
};
function Vt(e, ...t) {
  let o, r, c, l = s;
  function s(h) {
    const b = t.reduce((C, f) => f(C), e());
    return o = Gt(b), r = o.cache.get, c = o.cache.set, l = d, d(h);
  }
  function d(h) {
    const b = r(h);
    if (b)
      return b;
    const C = Wt(h, o);
    return c(h, C), C;
  }
  return function() {
    return l(Ht.apply(null, arguments));
  };
}
const v = (e) => {
  const t = (o) => o[e] || [];
  return t.isThemeGetter = !0, t;
}, nt = /^\[(?:([a-z-]+):)?(.+)\]$/i, Kt = /^\d+\/\d+$/, Xt = /* @__PURE__ */ new Set(["px", "full", "screen"]), qt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Jt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Yt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Zt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Qt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, H = (e) => le(e) || Xt.has(e) || Kt.test(e), J = (e) => se(e, "length", sr), le = (e) => !!e && !Number.isNaN(Number(e)), Te = (e) => se(e, "number", le), pe = (e) => !!e && Number.isInteger(Number(e)), er = (e) => e.endsWith("%") && le(e.slice(0, -1)), p = (e) => nt.test(e), Y = (e) => qt.test(e), tr = /* @__PURE__ */ new Set(["length", "size", "percentage"]), rr = (e) => se(e, tr, at), or = (e) => se(e, "position", at), nr = /* @__PURE__ */ new Set(["image", "url"]), ar = (e) => se(e, nr, cr), lr = (e) => se(e, "", ir), he = () => !0, se = (e, t, o) => {
  const r = nt.exec(e);
  return r ? r[1] ? typeof t == "string" ? r[1] === t : t.has(r[1]) : o(r[2]) : !1;
}, sr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Jt.test(e) && !Yt.test(e)
), at = () => !1, ir = (e) => Zt.test(e), cr = (e) => Qt.test(e), dr = () => {
  const e = v("colors"), t = v("spacing"), o = v("blur"), r = v("brightness"), c = v("borderColor"), l = v("borderRadius"), s = v("borderSpacing"), d = v("borderWidth"), h = v("contrast"), b = v("grayscale"), C = v("hueRotate"), f = v("invert"), A = v("gap"), I = v("gradientColorStops"), L = v("gradientColorStopPositions"), k = v("inset"), w = v("margin"), _ = v("opacity"), m = v("padding"), Z = v("saturate"), M = v("scale"), O = v("sepia"), ie = v("skew"), Q = v("space"), te = v("translate"), ce = () => ["auto", "contain", "none"], V = () => ["auto", "hidden", "clip", "visible", "scroll"], U = () => ["auto", p, t], y = () => [p, t], ee = () => ["", H, J], re = () => ["auto", le, p], P = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], $ = () => ["solid", "dashed", "dotted", "double", "none"], ge = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], de = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], S = () => ["", "0", p], j = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], g = () => [le, p];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [he],
      spacing: [H, J],
      blur: ["none", "", Y, p],
      brightness: g(),
      borderColor: [e],
      borderRadius: ["none", "", "full", Y, p],
      borderSpacing: y(),
      borderWidth: ee(),
      contrast: g(),
      grayscale: S(),
      hueRotate: g(),
      invert: S(),
      gap: y(),
      gradientColorStops: [e],
      gradientColorStopPositions: [er, J],
      inset: U(),
      margin: U(),
      opacity: g(),
      padding: y(),
      saturate: g(),
      scale: g(),
      sepia: S(),
      skew: g(),
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
        "break-after": j()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": j()
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
        overscroll: ce()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": ce()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": ce()
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
        z: ["auto", pe, p]
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
        order: ["first", "last", "none", pe, p]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [he]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", pe, p]
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
        "grid-rows": [he]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [pe, p]
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
        justify: ["normal", ...de()]
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
        content: ["normal", ...de(), "baseline"]
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
        "place-content": [...de(), "baseline"]
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
        p: [m]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [m]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [m]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [m]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [m]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [m]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [m]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [m]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [m]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", p, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [p, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [p, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [Y]
        }, Y]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [p, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [p, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [p, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [p, t, "auto", "min", "max", "fit"]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Te]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [he]
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
        "line-clamp": ["none", le, Te]
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
        bg: [...P(), or]
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
        bg: ["auto", "cover", "contain", rr]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, ar]
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
        from: [I]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [I]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [I]
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
        shadow: ["", "inner", "none", Y, lr]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [he]
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
        brightness: [r]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [h]
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
        invert: [f]
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
        sepia: [O]
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
        "backdrop-brightness": [r]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [h]
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
        "backdrop-invert": [f]
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
        "backdrop-sepia": [O]
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
        duration: g()
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
        delay: g()
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
        rotate: [pe, p]
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
        "skew-x": [ie]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [ie]
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
        stroke: [H, J, Te]
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
}, ur = /* @__PURE__ */ Vt(dr);
function W(...e) {
  return ur(It(e));
}
const pr = "copanel_mobile_desktop_site";
function hr() {
  try {
    return localStorage.getItem(pr) === "1";
  } catch {
    return !1;
  }
}
function Ee(e = window.innerWidth) {
  return hr() || e >= 1024;
}
const mr = Ye(null);
function lt() {
  return Ze(mr);
}
function st() {
  return lt()?.isWindowed === !0;
}
function br({ children: e, className: t, constrained: o = !1 }) {
  const { theme: r } = Le(), c = st(), l = r === "dark", s = !c && !Ee();
  return /* @__PURE__ */ n(
    "div",
    {
      className: W(
        "flex flex-col transition-colors duration-200",
        c ? "h-full min-h-0" : s ? "min-h-0" : "min-h-screen",
        l ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !c && o && "mx-auto max-w-7xl",
        t
      ),
      children: e
    }
  );
}
function fr({
  isDark: e,
  sidebar: t,
  children: o,
  mobileTitle: r,
  className: c
}) {
  const l = st(), [s, d] = x(!1), [h, b] = x(() => Ee());
  fe(() => {
    const A = () => b(Ee());
    return window.addEventListener("resize", A), () => window.removeEventListener("resize", A);
  }, []);
  const C = !l && !h;
  fe(() => {
    h && d(!1);
  }, [h]);
  const f = () => d(!1);
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
          r ? /* @__PURE__ */ n("span", { className: W("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: r }) : null
        ]
      }
    ),
    s ? /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: f
      }
    ) : null,
    /* @__PURE__ */ n(
      "div",
      {
        className: W(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          s ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: f,
        children: t
      }
    ),
    /* @__PURE__ */ n("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: o })
  ] }) : /* @__PURE__ */ u("div", { className: W("flex h-full min-h-0 flex-1 overflow-hidden", c), children: [
    t,
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
function Ae({
  open: e,
  onClose: t,
  children: o,
  title: r,
  className: c,
  maxWidth: l = "lg",
  closeOnBackdropClick: s = !0
}) {
  const { theme: d } = Le(), h = d === "dark", b = lt(), C = Qe(null), [f, A] = x(null);
  St(() => {
    if (b?.isWindowed) return;
    const m = C.current?.closest(".module-window-viewport");
    A(m instanceof HTMLElement ? m : null);
  }, [b?.isWindowed, e]);
  const I = /* @__PURE__ */ n("span", { ref: C, hidden: !0, "aria-hidden": "true" });
  if (!e) return I;
  const L = !!(b?.isWindowed || f), k = /* @__PURE__ */ n(
    "div",
    {
      className: W(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        L ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: s ? t : void 0,
      children: /* @__PURE__ */ u(
        "div",
        {
          className: W(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            gr[l],
            h ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            c
          ),
          onClick: (m) => m.stopPropagation(),
          children: [
            r && /* @__PURE__ */ u(
              "div",
              {
                className: W(
                  "flex items-center justify-between border-b px-4 py-3",
                  h ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ n("h3", { className: "text-sm font-bold", children: r }),
                  /* @__PURE__ */ n("button", { type: "button", onClick: t, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ n(N.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            o
          ]
        }
      )
    }
  ), w = (b?.isWindowed ? b.viewportRef.current : null) || f || document.body, _ = $t(k, w);
  return /* @__PURE__ */ u(Pe, { children: [
    I,
    _
  ] });
}
class Ke extends Error {
  constructor(o, r, c, l) {
    super(r);
    G(this, "code");
    G(this, "status");
    G(this, "details");
    this.code = o, this.status = c, this.details = l;
  }
}
async function T(e, t = {}) {
  const o = typeof window < "u" ? localStorage.getItem("copanel_token") : null, r = {
    "Content-Type": "application/json",
    ...t.headers || {}
  };
  o && (r.Authorization = `Bearer ${o}`);
  const c = {
    method: t.method || "GET",
    headers: r,
    signal: t.signal
  };
  t.body !== void 0 && (c.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body));
  const l = await fetch(e, c);
  let s = null;
  const d = await l.text();
  if (d)
    try {
      s = JSON.parse(d);
    } catch {
      s = d;
    }
  if (t.raw)
    return s;
  if (!l.ok) {
    const h = s && typeof s == "object" && s.error ? s.error : { code: `HTTP_${l.status}`, message: typeof s == "string" ? s : s?.detail || l.statusText };
    throw new Ke(h.code || `HTTP_${l.status}`, h.message || "Request failed", l.status, h.details);
  }
  if (s && typeof s == "object" && "status" in s) {
    if (s.status === "success")
      return s.data !== void 0 ? s.data : s;
    if (s.status === "error" && s.error)
      throw new Ke(s.error.code, s.error.message, l.status, s.error.details);
  }
  return s;
}
const it = "copanel-session-expired", xr = /* @__PURE__ */ new Set([
  "/api/auth/login",
  "/api/panel_settings/branding/public"
]);
function yr(e) {
  try {
    const t = typeof e == "string" ? e : e instanceof URL ? e.href : String(e.url || "");
    return (t.startsWith("http://") || t.startsWith("https://") ? new URL(t) : new URL(t, "http://localhost")).pathname;
  } catch {
    return "";
  }
}
function wr(e) {
  if (!e) return !1;
  for (const t of xr)
    if (e === t || e.startsWith(`${t}/`)) return !0;
  return !1;
}
function vr() {
  typeof window > "u" || window.dispatchEvent(new CustomEvent(it));
}
function ae() {
  return typeof localStorage > "u" ? null : localStorage.getItem("copanel_token");
}
function Cr(e) {
  const t = {};
  e && new Headers(e).forEach((c, l) => {
    t[l] = c;
  });
  const o = ae();
  return o && (t.Authorization = `Bearer ${o}`), t;
}
function Nr(e, t = {}) {
  const o = Cr(t.headers);
  return fetch(e, { ...t, headers: o }).then((r) => (r.status === 401 && !wr(yr(e)) && vr(), r));
}
async function kr() {
  if (!ae()) return null;
  try {
    const e = await Nr("/api/auth/stream-ticket", { method: "POST" });
    if (e.status === 401 || !e.ok) return null;
    const t = await e.json();
    return typeof t?.ticket == "string" ? t.ticket : null;
  } catch {
    return null;
  }
}
const _r = "copanel-platform-sse-degraded", me = 2e3, Sr = 6e4, Tr = 3;
class Ar {
  constructor() {
    G(this, "source", null);
    G(this, "handlers", /* @__PURE__ */ new Map());
    G(this, "retryDelay", me);
    G(this, "retryTimer", null);
    G(this, "failureCount", 0);
    G(this, "connecting", !1);
    G(this, "authFailed", !1);
  }
  on(t, o) {
    let r = this.handlers.get(t);
    return r || (r = /* @__PURE__ */ new Set(), this.handlers.set(t, r)), r.add(o), this.ensureConnected(), () => {
      r.delete(o), r.size === 0 && this.handlers.delete(t), this.teardownIfIdle();
    };
  }
  emit(t, o) {
    const r = this.handlers.get(t);
    r && r.forEach((c) => {
      try {
        c(o);
      } catch (l) {
        console.error("event handler failed", t, l);
      }
    });
  }
  async buildUrl() {
    if (!ae()) return null;
    const t = await kr();
    return t ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      ticket: t
    }).toString()}` : null;
  }
  ensureConnected() {
    this.authFailed || this.source || this.connecting || typeof document < "u" && document.hidden || ae() && (this.connecting = !0, this.buildUrl().then((t) => {
      if (this.connecting = !1, !(this.source || this.handlers.size === 0)) {
        if (!t) {
          if (!ae()) {
            this.stopForAuthFailure();
            return;
          }
          this.failureCount += 1, this.scheduleRetry();
          return;
        }
        this.openSource(t);
      }
    }).catch(() => {
      this.connecting = !1, this.scheduleRetry();
    }));
  }
  openSource(t) {
    try {
      this.source = new EventSource(t, { withCredentials: !0 });
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
      this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Tr && window.dispatchEvent(new CustomEvent(_r)), this.scheduleRetry();
    };
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = me;
  }
  parseAndEmit(t, o) {
    try {
      const r = JSON.parse(o);
      this.emit(t, r.payload || r);
    } catch {
    }
  }
  scheduleRetry() {
    if (this.retryTimer || this.handlers.size === 0) return;
    const t = this.retryDelay;
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), Sr), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = me);
  }
  stopForAuthFailure() {
    this.authFailed = !0, this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null);
  }
  /** Close the stream and do not retry until reconnect() (called after login). */
  stop() {
    this.stopForAuthFailure();
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.authFailed = !1, this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = me, this.handlers.size > 0 && ae() && this.ensureConnected();
  }
}
const ve = new Ar();
function $r() {
  ve.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || $r();
});
typeof window < "u" && window.addEventListener(it, () => {
  ve.stop();
});
function ct(e) {
  let t = e;
  const o = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (r) => {
      const c = typeof r == "function" ? r(t) : r;
      if (!c || Object.keys(c).length === 0) return;
      let l = !1;
      for (const s of Object.keys(c))
        if (t[s] !== c[s]) {
          l = !0;
          break;
        }
      l && (t = { ...t, ...c }, o.forEach((s) => s()));
    },
    subscribe: (r) => (o.add(r), () => o.delete(r))
  };
}
const dt = ct({ jobs: {}, order: [], lastFetch: 0 });
function Pr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Xe(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function ne(e, t, o) {
  if (!e || typeof e != "object") return;
  const r = Xe(e[t], o);
  if (r) return r;
  const c = Xe(e[`${t}_i18n`], o);
  if (c) return c;
  const l = e[`${t}_${o}`];
  if (typeof l == "string" && l) return l;
  const s = e[`${t}_en`];
  if (typeof s == "string" && s) return s;
  const d = e[`${t}_vi`];
  if (typeof d == "string" && d) return d;
}
function Rr(e) {
  const t = Pr(), o = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: ne(e, "title", t) || ne(o, "title", t) || e?.title || "",
    message: ne(e, "message", t) || ne(o, "message", t) || e?.message,
    error: ne(e, "error", t) || ne(o, "error", t) || e?.error || null
  };
}
function qe(e) {
  const t = Rr(e);
  dt.setState((o) => {
    const r = { ...o.jobs, [t.id]: { ...o.jobs[t.id], ...t } };
    let c = o.order;
    return c.includes(t.id) || (c = [t.id, ...c].slice(0, 200)), { jobs: r, order: c };
  });
}
ve.on("jobs", (e) => {
  if (e?.job) {
    qe(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = dt.getState().jobs[e.job_id];
    t && qe({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const Ie = ct({ inbox: [], unread: 0, toasts: [] }), Er = 6e3;
function Ir() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Je(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function we(e, t, o) {
  if (!e || typeof e != "object") return;
  const r = Je(e[t], o);
  if (r) return r;
  const c = Je(e[`${t}_i18n`], o);
  if (c) return c;
  const l = e[`${t}_${o}`];
  if (typeof l == "string" && l) return l;
  const s = e[`${t}_en`];
  if (typeof s == "string" && s) return s;
  const d = e[`${t}_vi`];
  if (typeof d == "string" && d) return d;
}
function Lr(e) {
  const t = Ir(), o = e?.payload && typeof e.payload == "object" ? e.payload : {}, r = we(e, "title", t) || we(o, "title", t) || e?.title || "", c = we(e, "body", t) || we(o, "body", t) || e?.body || null;
  return {
    ...e,
    title: r,
    body: c
  };
}
function zr(e) {
  Ie.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    Ie.setState((t) => ({ toasts: t.toasts.filter((o) => o.id !== e.id) }));
  }, Er);
}
ve.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = Lr(e.notification);
    zr({ ...t, ephemeral: !0 }), Ie.setState((o) => ({
      inbox: [t, ...o.inbox].slice(0, 200),
      unread: o.unread + 1
    }));
  }
});
const Mr = [
  { key: "all", icon: "List" },
  { key: "downloading", icon: "Download" },
  { key: "completed", icon: "CheckCircle2" },
  { key: "active", icon: "Activity" },
  { key: "inactive", icon: "PauseCircle" },
  { key: "stopped", icon: "Square" }
];
function be(e) {
  if (!e || e < 0) return "—";
  const t = ["B", "KB", "MB", "GB", "TB"];
  let o = e, r = 0;
  for (; o >= 1024 && r < t.length - 1; )
    o /= 1024, r += 1;
  return `${o.toFixed(r === 0 ? 0 : 2)} ${t[r]}`;
}
function $e(e) {
  return e ? `${be(e)}/s` : "—";
}
function Dr(e) {
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
function Fr({ status: e }) {
  return e === "completed" ? /* @__PURE__ */ n(N.CheckCircle2, { className: "w-4 h-4 text-emerald-500" }) : e === "downloading" || e === "connecting" ? /* @__PURE__ */ n(N.Loader2, { className: "w-4 h-4 text-blue-500 animate-spin" }) : e === "paused" || e === "stopped" ? /* @__PURE__ */ n(N.PauseCircle, { className: "w-4 h-4 text-amber-500" }) : e === "error" ? /* @__PURE__ */ n(N.AlertCircle, { className: "w-4 h-4 text-red-500" }) : /* @__PURE__ */ n(N.Clock, { className: "w-4 h-4 text-slate-400" });
}
function Wr() {
  const { theme: e, language: t } = Le(), o = e === "dark", r = Tt(
    () => t === "vi" ? {
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
    [t]
  ), c = {
    all: r.filterAll,
    downloading: r.filterDownloading,
    completed: r.filterCompleted,
    active: r.filterActive,
    inactive: r.filterInactive,
    stopped: r.filterStopped
  }, [l, s] = x("all"), [d, h] = x(""), [b, C] = x([]), [f, A] = x(null), [I, L] = x("general"), [k, w] = x(!0), [_, m] = x(null), [Z, M] = x(!1), [O, ie] = x(""), [Q, te] = x(null), [ce, V] = x(!1), [U, y] = x("general"), [ee, re] = x(null), [P, $] = x({}), [ge, de] = x([]), [S, j] = x(null), [g, K] = x(null), [ue, Ce] = x(null), [ut, pt] = x(null), [Me, ht] = x(""), [De, mt] = x(""), [Fe, bt] = x(`${typeof window < "u" ? window.location.origin : ""}/api/download_manager/oauth/google/callback`), je = Qe(null), [X, xe] = x(null), [Oe, Ne] = x(null), R = b.find((a) => a.id === f) || null, q = We(async () => {
    try {
      const a = await T(`/api/download_manager/tasks?filter=${l}&search=${encodeURIComponent(d)}`);
      C(a || []);
    } catch (a) {
      m(a.message);
    } finally {
      w(!1);
    }
  }, [l, d]), oe = We(async () => {
    const [a, i, B, ye] = await Promise.all([
      T("/api/download_manager/settings"),
      T("/api/download_manager/file-hosting"),
      T("/api/download_manager/engine/status"),
      T("/api/download_manager/oauth/google/status")
    ]);
    re(a), $(a), de(i || []), Ce(B), pt(ye);
  }, []);
  fe(() => {
    q(), T("/api/download_manager/engine/status").then(Ce).catch(() => {
    });
    const a = setInterval(() => {
      q(), T("/api/download_manager/engine/status").then(Ce).catch(() => {
      });
    }, 3e3);
    return () => clearInterval(a);
  }, [q]), fe(() => {
    function a(i) {
      i.origin === window.location.origin && (!i.data || i.data.type !== "copanel_dm_google_oauth" || (i.data.ok ? (oe(), m(null)) : m(i.data.error || "Google OAuth failed")));
    }
    return window.addEventListener("message", a), () => window.removeEventListener("message", a);
  }, [oe]), fe(() => {
    O.length > 8 ? T("/api/download_manager/detect-url", {
      method: "POST",
      body: { url: O }
    }).then(te).catch(() => te(null)) : te(null);
  }, [O]);
  async function Ue() {
    if (O.trim()) {
      m(null);
      try {
        await T("/api/download_manager/tasks", { method: "POST", body: { url: O.trim() } }), ie(""), M(!1), q();
      } catch (a) {
        m(a.message);
      }
    }
  }
  async function ke(a) {
    if (f)
      try {
        await T(`/api/download_manager/tasks/${f}/${a}`, { method: "POST" }), q();
      } catch (i) {
        m(i.message);
      }
  }
  async function ft() {
    if (f)
      try {
        await T(`/api/download_manager/tasks/${f}`, { method: "DELETE" }), A(null), q();
      } catch (a) {
        m(a.message);
      }
  }
  async function gt() {
    try {
      await T("/api/download_manager/tasks/completed", { method: "DELETE" }), q();
    } catch (a) {
      m(a.message);
    }
  }
  async function xt() {
    try {
      await T("/api/download_manager/settings", { method: "PUT", body: P }), await oe(), V(!1);
    } catch (a) {
      m(a.message);
    }
  }
  async function _e(a) {
    Ne(a);
    const i = a === "temp_folder" ? P.temp_folder : a === "destination_folder" ? P.destination_folder : P.watched_folder, B = await T(`/api/download_manager/folders/browse?path=${encodeURIComponent(i || "")}`);
    xe(B);
  }
  async function Ge(a) {
    const i = await T(`/api/download_manager/folders/browse?path=${encodeURIComponent(a)}`);
    xe(i);
  }
  function yt(a) {
    Oe && ($((i) => ({ ...i, [Oe]: a })), xe(null), Ne(null));
  }
  async function wt(a) {
    if (a) {
      m(null);
      try {
        const i = localStorage.getItem("copanel_token"), B = new FormData();
        B.append("file", a);
        const ye = await fetch("/api/download_manager/tasks/upload-torrent", {
          method: "POST",
          headers: i ? { Authorization: `Bearer ${i}` } : {},
          body: B
        }), Be = await ye.json();
        if (!ye.ok || Be.status === "error")
          throw new Error(Be.error?.message || "Upload failed");
        q();
      } catch (i) {
        m(i.message);
      }
    }
  }
  async function vt() {
    try {
      const a = await T("/api/download_manager/oauth/google/start", {
        method: "POST",
        body: {
          client_id: Me,
          client_secret: De,
          redirect_uri: Fe
        }
      });
      window.open(a.auth_url, "copanel_google_oauth", "width=520,height=720");
    } catch (a) {
      m(a.message);
    }
  }
  async function Ct() {
    if (!g?.profileId || !g.label.trim()) return;
    const a = {
      label: g.label,
      username: g.username,
      password: g.password,
      api_key: g.api_key,
      cookie: g.cookie
    };
    try {
      g.account?.id ? await T(`/api/download_manager/file-hosting/${g.profileId}/accounts/${g.account.id}`, {
        method: "PUT",
        body: a
      }) : await T(`/api/download_manager/file-hosting/${g.profileId}/accounts`, {
        method: "POST",
        body: a
      }), K(null), await oe();
    } catch (i) {
      m(i.message);
    }
  }
  async function Nt() {
    if (!S?.name) return;
    const a = {
      ...S,
      url_patterns: S.url_patterns ? String(S.url_patterns).split(`
`).map((i) => i.trim()).filter(Boolean) : S.url_patterns || []
    };
    try {
      S.id ? await T(`/api/download_manager/file-hosting/${S.id}`, { method: "PUT", body: a }) : await T("/api/download_manager/file-hosting", { method: "POST", body: a }), j(null), await oe();
    } catch (i) {
      m(i.message);
    }
  }
  const Se = o ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200", D = o ? "text-slate-400" : "text-slate-500", E = o ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200";
  return /* @__PURE__ */ n(br, { constrained: !0, children: /* @__PURE__ */ u("div", { className: `flex flex-col h-full min-h-0 ${o ? "text-slate-100" : "text-slate-900"}`, children: [
    /* @__PURE__ */ u("div", { className: `px-4 py-3 border-b flex items-center justify-between ${o ? "border-slate-700" : "border-slate-200"}`, children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ n("h1", { className: "text-xl font-semibold", children: r.title }),
        /* @__PURE__ */ n("p", { className: `text-sm ${D}`, children: r.subtitle })
      ] }),
      ue && /* @__PURE__ */ u("div", { className: `text-xs px-2 py-1 rounded border ${ue.aria2_available ? "border-emerald-500/40 text-emerald-500" : "border-amber-500/40 text-amber-500"}`, children: [
        r.aria2Status,
        ": ",
        ue.aria2_available ? `v${ue.version || "?"}` : ue.message
      ] })
    ] }),
    /* @__PURE__ */ n(
      "input",
      {
        ref: je,
        type: "file",
        accept: ".torrent",
        className: "hidden",
        onChange: (a) => {
          wt(a.target.files?.[0] || null), a.target.value = "";
        }
      }
    ),
    _ && /* @__PURE__ */ u("div", { className: "mx-4 mt-2 px-3 py-2 rounded bg-red-500/10 text-red-500 text-sm flex justify-between", children: [
      /* @__PURE__ */ n("span", { children: _ }),
      /* @__PURE__ */ n("button", { type: "button", onClick: () => m(null), children: /* @__PURE__ */ n(N.X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ n(
      fr,
      {
        isDark: o,
        mobileTitle: r.title,
        sidebar: /* @__PURE__ */ u("aside", { className: `h-full w-52 shrink-0 border-r flex flex-col ${o ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`, children: [
          /* @__PURE__ */ n("div", { className: "p-2", children: /* @__PURE__ */ n(
            "input",
            {
              className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`,
              placeholder: r.search,
              value: d,
              onChange: (a) => h(a.target.value)
            }
          ) }),
          /* @__PURE__ */ n("nav", { className: "flex-1 overflow-y-auto px-1", children: Mr.map(({ key: a, icon: i }) => {
            const B = N[i];
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                onClick: () => s(a),
                className: `w-full flex items-center gap-2 px-3 py-2 text-sm rounded mb-0.5 ${l === a ? o ? "bg-blue-600/30 text-blue-300" : "bg-blue-50 text-blue-700" : `hover:${o ? "bg-slate-800" : "bg-slate-100"}`}`,
                children: [
                  /* @__PURE__ */ n(B, { className: "w-4 h-4" }),
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
              className: `w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded border ${E}`,
              children: [
                /* @__PURE__ */ n(N.Settings, { className: "w-4 h-4" }),
                r.settings
              ]
            }
          ) })
        ] }),
        children: /* @__PURE__ */ u("div", { className: "flex-1 flex flex-col min-w-0", children: [
          /* @__PURE__ */ u("div", { className: `flex items-center gap-1 px-2 py-1.5 border-b flex-wrap ${o ? "border-slate-700" : "border-slate-200"}`, children: [
            /* @__PURE__ */ n("button", { type: "button", onClick: () => M(!0), className: `p-2 rounded border ${E}`, title: r.addUrl, children: /* @__PURE__ */ n(N.Plus, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: () => M(!0), className: `p-2 rounded border ${E}`, title: r.addUrl, children: /* @__PURE__ */ n(N.Globe, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: () => je.current?.click(), className: `p-2 rounded border ${E}`, title: r.uploadTorrent, children: /* @__PURE__ */ n(N.FileUp, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("div", { className: `w-px h-6 mx-1 ${o ? "bg-slate-700" : "bg-slate-200"}` }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !f, onClick: () => ke("resume"), className: `p-2 rounded border ${E} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Play, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !f, onClick: () => ke("pause"), className: `p-2 rounded border ${E} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Pause, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !f, onClick: () => ke("stop"), className: `p-2 rounded border ${E} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Square, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("div", { className: `w-px h-6 mx-1 ${o ? "bg-slate-700" : "bg-slate-200"}` }),
            /* @__PURE__ */ n("button", { type: "button", disabled: !f, onClick: ft, className: `p-2 rounded border ${E} disabled:opacity-40`, children: /* @__PURE__ */ n(N.Trash2, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: gt, className: `p-2 rounded border ${E}`, children: /* @__PURE__ */ n(N.Eraser, { className: "w-4 h-4" }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "flex-1 overflow-auto min-h-0", children: k && b.length === 0 ? /* @__PURE__ */ n("div", { className: `p-8 text-center ${D}`, children: /* @__PURE__ */ n(N.Loader2, { className: "w-6 h-6 animate-spin mx-auto mb-2" }) }) : b.length === 0 ? /* @__PURE__ */ n("div", { className: `p-8 text-center ${D}`, children: r.noTasks }) : /* @__PURE__ */ u("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ n("thead", { className: `sticky top-0 ${o ? "bg-slate-800" : "bg-slate-100"}`, children: /* @__PURE__ */ u("tr", { children: [
              /* @__PURE__ */ n("th", { className: "w-8 p-2" }),
              /* @__PURE__ */ n("th", { className: "text-left p-2 font-medium", children: r.colName }),
              /* @__PURE__ */ n("th", { className: "text-right p-2 font-medium w-24", children: r.colSize }),
              /* @__PURE__ */ n("th", { className: "text-right p-2 font-medium w-24", children: r.colDownloaded }),
              /* @__PURE__ */ n("th", { className: "text-left p-2 font-medium w-36", children: r.colProgress }),
              /* @__PURE__ */ n("th", { className: "text-right p-2 font-medium w-28", children: r.colSpeed }),
              /* @__PURE__ */ n("th", { className: "text-left p-2 font-medium w-28", children: r.colStatus }),
              /* @__PURE__ */ n("th", { className: "text-left p-2 font-medium", children: r.colDest })
            ] }) }),
            /* @__PURE__ */ n("tbody", { children: b.map((a) => /* @__PURE__ */ u(
              "tr",
              {
                onClick: () => A(a.id),
                className: `cursor-pointer border-b ${f === a.id ? o ? "bg-blue-900/30" : "bg-blue-50" : o ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"}`,
                children: [
                  /* @__PURE__ */ n("td", { className: "p-2", children: /* @__PURE__ */ n(Fr, { status: a.status }) }),
                  /* @__PURE__ */ n("td", { className: "p-2 truncate max-w-xs", title: a.name, children: a.name }),
                  /* @__PURE__ */ n("td", { className: "p-2 text-right tabular-nums", children: be(a.total_bytes) }),
                  /* @__PURE__ */ n("td", { className: "p-2 text-right tabular-nums", children: be(a.downloaded_bytes) }),
                  /* @__PURE__ */ n("td", { className: "p-2", children: /* @__PURE__ */ u("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ n("div", { className: `flex-1 h-2 rounded-full overflow-hidden ${o ? "bg-slate-700" : "bg-slate-200"}`, children: /* @__PURE__ */ n("div", { className: "h-full bg-blue-500 transition-all", style: { width: `${Math.min(100, a.progress || 0)}%` } }) }),
                    /* @__PURE__ */ u("span", { className: "text-xs tabular-nums w-12 text-right", children: [
                      (a.progress || 0).toFixed(1),
                      "%"
                    ] })
                  ] }) }),
                  /* @__PURE__ */ n("td", { className: "p-2 text-right tabular-nums text-xs", children: $e(a.download_speed) }),
                  /* @__PURE__ */ n("td", { className: `p-2 capitalize text-xs ${Dr(a.status)}`, children: a.status }),
                  /* @__PURE__ */ n("td", { className: `p-2 truncate max-w-[10rem] text-xs ${D}`, title: a.destination, children: a.destination })
                ]
              },
              a.id
            )) })
          ] }) }),
          R && /* @__PURE__ */ u("div", { className: `h-44 shrink-0 border-t ${o ? "border-slate-700 bg-slate-900/80" : "border-slate-200 bg-slate-50"}`, children: [
            /* @__PURE__ */ n("div", { className: "flex gap-4 px-4 pt-2 border-b border-transparent", children: [
              { key: "general", label: r.tabGeneral },
              { key: "transfer", label: r.tabTransfer }
            ].map(({ key: a, label: i }) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => L(a),
                className: `pb-2 text-sm border-b-2 ${I === a ? "border-blue-500 text-blue-500" : `border-transparent ${D}`}`,
                children: i
              },
              a
            )) }),
            /* @__PURE__ */ n("div", { className: "px-4 py-3 grid grid-cols-2 gap-x-8 gap-y-1 text-sm overflow-y-auto max-h-32", children: I === "general" ? /* @__PURE__ */ u(Pe, { children: [
              /* @__PURE__ */ n(z, { label: r.colName, value: R.name }),
              /* @__PURE__ */ n(z, { label: r.colDest, value: R.destination }),
              /* @__PURE__ */ n(z, { label: r.colSize, value: be(R.total_bytes) }),
              /* @__PURE__ */ n(z, { label: "URL", value: R.source_url, mono: !0 }),
              /* @__PURE__ */ n(z, { label: "Type", value: R.source_type }),
              /* @__PURE__ */ n(z, { label: "User", value: R.created_by || "—" }),
              /* @__PURE__ */ n(z, { label: "Created", value: R.created_at }),
              R.error_message && /* @__PURE__ */ n(z, { label: "Error", value: R.error_message, error: !0 })
            ] }) : /* @__PURE__ */ u(Pe, { children: [
              /* @__PURE__ */ n(z, { label: r.colDownloaded, value: be(R.downloaded_bytes) }),
              /* @__PURE__ */ n(z, { label: r.colSpeed, value: $e(R.download_speed) }),
              /* @__PURE__ */ n(z, { label: "Upload", value: $e(R.upload_speed) }),
              /* @__PURE__ */ n(z, { label: r.colProgress, value: `${(R.progress || 0).toFixed(1)}%` }),
              /* @__PURE__ */ n(z, { label: r.colStatus, value: R.status }),
              /* @__PURE__ */ n(z, { label: "Completed", value: R.completed_at || "—" })
            ] }) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n(Ae, { open: Z, onClose: () => M(!1), title: r.addUrl, children: /* @__PURE__ */ u("div", { className: "p-4", children: [
      /* @__PURE__ */ n(
        "input",
        {
          className: `w-full px-3 py-2 rounded border mb-2 ${o ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`,
          placeholder: r.urlPlaceholder,
          value: O,
          onChange: (a) => ie(a.target.value),
          onKeyDown: (a) => a.key === "Enter" && Ue()
        }
      ),
      Q && /* @__PURE__ */ u("p", { className: `text-xs mb-3 ${D}`, children: [
        "Detected: ",
        /* @__PURE__ */ n("span", { className: "font-medium", children: Q.source_type }),
        Q.file_hosting_name ? ` → ${Q.file_hosting_name}` : ""
      ] }),
      /* @__PURE__ */ u("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ n("button", { type: "button", onClick: () => M(!1), className: `px-4 py-2 rounded border ${E}`, children: r.cancel }),
        /* @__PURE__ */ n("button", { type: "button", onClick: Ue, className: "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700", children: r.add })
      ] })
    ] }) }),
    ee && /* @__PURE__ */ u(Ae, { open: ce, onClose: () => V(!1), title: r.settings, maxWidth: "2xl", className: "max-w-3xl", children: [
      /* @__PURE__ */ u("div", { className: "p-4 flex gap-4 min-h-[360px]", children: [
        /* @__PURE__ */ n("div", { className: `w-44 shrink-0 border-r pr-3 ${o ? "border-slate-700" : "border-slate-200"}`, children: ["general", "location", "file-hosting", "google", "aria2"].map((a) => /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            onClick: () => y(a),
            className: `block w-full text-left px-2 py-1.5 text-sm rounded mb-1 ${U === a ? "bg-blue-600/20 text-blue-400" : D}`,
            children: a === "general" ? r.tabGeneral : a === "location" ? r.destFolder : a === "file-hosting" ? r.fileHosting : a === "google" ? r.googleOAuth : r.aria2Rpc
          },
          a
        )) }),
        /* @__PURE__ */ u("div", { className: "flex-1 overflow-y-auto pr-2", children: [
          U === "general" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ n(F, { label: r.tempFolder, children: /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `flex-1 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: P.temp_folder || "",
                  onChange: (a) => $((i) => ({ ...i, temp_folder: a.target.value }))
                }
              ),
              /* @__PURE__ */ n("button", { type: "button", onClick: () => _e("temp_folder"), className: `px-3 py-1.5 text-sm rounded border ${E}`, children: r.selectFolder })
            ] }) }),
            /* @__PURE__ */ n(F, { label: r.maxConcurrent, children: /* @__PURE__ */ n(
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
            /* @__PURE__ */ n(F, { label: r.speedDown, children: /* @__PURE__ */ n(
              "input",
              {
                type: "number",
                min: 0,
                className: `w-32 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                value: P.max_download_speed_kbps ?? 0,
                onChange: (a) => $((i) => ({ ...i, max_download_speed_kbps: Number(a.target.value) }))
              }
            ) }),
            /* @__PURE__ */ n(F, { label: r.speedUp, children: /* @__PURE__ */ n(
              "input",
              {
                type: "number",
                min: 0,
                className: `w-32 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                value: P.max_upload_speed_kbps ?? 0,
                onChange: (a) => $((i) => ({ ...i, max_upload_speed_kbps: Number(a.target.value) }))
              }
            ) }),
            /* @__PURE__ */ n(F, { label: r.googleApiKey, children: /* @__PURE__ */ n(
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
            /* @__PURE__ */ n(F, { label: r.destFolder, children: /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `flex-1 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: P.destination_folder || "",
                  onChange: (a) => $((i) => ({ ...i, destination_folder: a.target.value }))
                }
              ),
              /* @__PURE__ */ n("button", { type: "button", onClick: () => _e("destination_folder"), className: `px-3 py-1.5 text-sm rounded border ${E}`, children: r.selectFolder })
            ] }) }),
            /* @__PURE__ */ n(F, { label: r.watchedFolder, children: /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `flex-1 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: P.watched_folder || "",
                  onChange: (a) => $((i) => ({ ...i, watched_folder: a.target.value }))
                }
              ),
              /* @__PURE__ */ n("button", { type: "button", onClick: () => _e("watched_folder"), className: `px-3 py-1.5 text-sm rounded border ${E}`, children: r.selectFolder })
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
              r.watchedAutoDelete
            ] })
          ] }),
          U === "file-hosting" && /* @__PURE__ */ u("div", { className: "space-y-3", children: [
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                onClick: () => j({
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
                  r.addHosting
                ]
              }
            ),
            ge.map((a) => /* @__PURE__ */ u("div", { className: `p-3 rounded border ${Se}`, children: [
              /* @__PURE__ */ u("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ n("div", { className: "font-medium", children: a.name }),
                  /* @__PURE__ */ u("div", { className: `text-xs ${D}`, children: [
                    a.type,
                    " · ",
                    a.url_patterns.join(", ")
                  ] })
                ] }),
                /* @__PURE__ */ n("button", { type: "button", onClick: () => j(a), className: "text-xs text-blue-500", children: "Edit" })
              ] }),
              (a.accounts?.length || 0) > 0 && /* @__PURE__ */ u("div", { className: `mt-2 text-xs ${D}`, children: [
                r.accounts,
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
                    r.addAccount
                  ]
                }
              )
            ] }, a.id)),
            g && /* @__PURE__ */ u("div", { className: `mt-4 p-4 rounded border space-y-2 ${Se}`, children: [
              /* @__PURE__ */ n("div", { className: "text-sm font-medium", children: r.manageAccounts }),
              /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: r.accountLabel, value: g.label, onChange: (a) => K((i) => i && { ...i, label: a.target.value }) }),
              /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: r.accountUser, value: g.username, onChange: (a) => K((i) => i && { ...i, username: a.target.value }) }),
              /* @__PURE__ */ n("input", { type: "password", className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: r.accountPass, value: g.password, onChange: (a) => K((i) => i && { ...i, password: a.target.value }) }),
              /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: r.accountApiKey, value: g.api_key, onChange: (a) => K((i) => i && { ...i, api_key: a.target.value }) }),
              /* @__PURE__ */ n("textarea", { className: `w-full px-2 py-1.5 text-sm rounded border h-16 ${o ? "bg-slate-800 border-slate-600" : ""}`, placeholder: r.accountCookie, value: g.cookie, onChange: (a) => K((i) => i && { ...i, cookie: a.target.value }) }),
              /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ n("button", { type: "button", onClick: () => K(null), className: `px-3 py-1.5 text-sm rounded border ${E}`, children: r.cancel }),
                /* @__PURE__ */ n("button", { type: "button", onClick: Ct, className: "px-3 py-1.5 text-sm rounded bg-blue-600 text-white", children: r.save })
              ] })
            ] }),
            S && /* @__PURE__ */ u("div", { className: `mt-4 p-4 rounded border space-y-3 ${Se}`, children: [
              /* @__PURE__ */ n(
                "input",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: "Name (e.g. MEGA.nz)",
                  value: S.name || "",
                  onChange: (a) => j((i) => ({ ...i, name: a.target.value }))
                }
              ),
              /* @__PURE__ */ u(
                "select",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  value: S.type || "curl",
                  onChange: (a) => j((i) => ({ ...i, type: a.target.value })),
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
                  placeholder: r.urlPatterns,
                  value: Array.isArray(S.url_patterns) ? S.url_patterns.join(`
`) : "",
                  onChange: (a) => j((i) => ({
                    ...i,
                    url_patterns: a.target.value.split(`
`).map((B) => B.trim()).filter(Boolean)
                  }))
                }
              ),
              S.type === "curl" ? /* @__PURE__ */ n(
                "textarea",
                {
                  className: `w-full px-2 py-1.5 text-sm font-mono text-xs rounded border h-24 ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: r.curlTemplate,
                  value: S.curl_template || "",
                  onChange: (a) => j((i) => ({ ...i, curl_template: a.target.value }))
                }
              ) : /* @__PURE__ */ n(
                "input",
                {
                  className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`,
                  placeholder: r.apiResolve,
                  value: S.api_config?.resolve_url || "",
                  onChange: (a) => j((i) => ({
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
                /* @__PURE__ */ n("button", { type: "button", onClick: () => j(null), className: `px-3 py-1.5 text-sm rounded border ${E}`, children: r.cancel }),
                /* @__PURE__ */ n("button", { type: "button", onClick: Nt, className: "px-3 py-1.5 text-sm rounded bg-blue-600 text-white", children: r.save })
              ] })
            ] })
          ] }),
          U === "google" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ n("p", { className: `text-sm ${D}`, children: ut?.connected || ee.google_oauth_connected ? "✓ Google Drive connected" : "Connect Google account for private files and folder listing without API key." }),
            /* @__PURE__ */ n(F, { label: r.oauthClientId, children: /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: Me, onChange: (a) => ht(a.target.value) }) }),
            /* @__PURE__ */ n(F, { label: r.oauthClientSecret, children: /* @__PURE__ */ n("input", { type: "password", className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: De, onChange: (a) => mt(a.target.value) }) }),
            /* @__PURE__ */ n(F, { label: r.oauthRedirect, children: /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: Fe, onChange: (a) => bt(a.target.value) }) }),
            /* @__PURE__ */ n("button", { type: "button", onClick: vt, className: "px-4 py-2 rounded bg-blue-600 text-white text-sm", children: r.connectGoogle })
          ] }),
          U === "aria2" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
            /* @__PURE__ */ u("p", { className: `text-sm ${D}`, children: [
              r.aria2AutoStartHint,
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
              r.aria2AutoStart
            ] }),
            /* @__PURE__ */ n(F, { label: r.aria2Host, children: /* @__PURE__ */ n("input", { className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: P.aria2_rpc_host || "127.0.0.1", onChange: (a) => $((i) => ({ ...i, aria2_rpc_host: a.target.value })) }) }),
            /* @__PURE__ */ n(F, { label: r.aria2Port, children: /* @__PURE__ */ n("input", { type: "number", className: `w-32 px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, value: P.aria2_rpc_port ?? 6800, onChange: (a) => $((i) => ({ ...i, aria2_rpc_port: Number(a.target.value) })) }) }),
            /* @__PURE__ */ n(F, { label: r.aria2Secret, children: /* @__PURE__ */ n("input", { type: "password", placeholder: ee.aria2_rpc_secret_set ? "••••••••" : "", className: `w-full px-2 py-1.5 text-sm rounded border ${o ? "bg-slate-800 border-slate-600" : ""}`, onChange: (a) => $((i) => ({ ...i, aria2_rpc_secret: a.target.value })) }) })
          ] })
        ] })
      ] }),
      U !== "file-hosting" && /* @__PURE__ */ u("div", { className: "flex justify-end gap-2 mt-4 pt-3 border-t border-slate-700/30", children: [
        /* @__PURE__ */ n("button", { type: "button", onClick: () => V(!1), className: `px-4 py-2 rounded border ${E}`, children: r.cancel }),
        /* @__PURE__ */ n("button", { type: "button", onClick: xt, className: "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700", children: r.save })
      ] })
    ] }),
    /* @__PURE__ */ n(
      Ae,
      {
        open: !!X,
        onClose: () => {
          xe(null), Ne(null);
        },
        title: r.selectFolder,
        children: X && /* @__PURE__ */ u("div", { className: "p-4", children: [
          /* @__PURE__ */ n("div", { className: `text-xs mb-2 font-mono ${D}`, children: X.current }),
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
          /* @__PURE__ */ u("button", { type: "button", onClick: () => yt(X.current), className: "w-full py-2 rounded bg-blue-600 text-white text-sm", children: [
            r.selectFolder,
            ": ",
            X.current
          ] })
        ] })
      }
    )
  ] }) });
}
function z({ label: e, value: t, mono: o, error: r }) {
  return /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ u("span", { className: "text-slate-500 shrink-0 w-24", children: [
      e,
      ":"
    ] }),
    /* @__PURE__ */ n("span", { className: `truncate ${o ? "font-mono text-xs" : ""} ${r ? "text-red-500" : ""}`, title: t, children: t })
  ] });
}
function F({ label: e, children: t }) {
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ n("div", { className: "text-sm font-medium text-blue-500 mb-1", children: e }),
    t
  ] });
}
export {
  Wr as default
};
