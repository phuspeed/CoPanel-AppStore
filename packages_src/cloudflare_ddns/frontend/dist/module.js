var wt = Object.defineProperty;
var Nt = (e, n, o) => n in e ? wt(e, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[n] = o;
var j = (e, n, o) => Nt(e, typeof n != "symbol" ? n + "" : n, o);
import { jsx as a, jsxs as d, Fragment as ge } from "react/jsx-runtime";
import { createContext as Ge, useContext as Ue, useState as S, useEffect as ke, useRef as kt, useLayoutEffect as Ct, useCallback as re } from "react";
import { useOutletContext as _t } from "react-router-dom";
import * as O from "lucide-react";
import { createPortal as St } from "react-dom";
const Tt = Ge(null);
function At() {
  return Ue(Tt);
}
const Dt = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Ie() {
  const e = At(), n = _t();
  return e || (n?.theme ? {
    theme: n.theme,
    setTheme: n.setTheme ?? (() => {
    }),
    language: n.language ?? "en",
    setLanguage: n.setLanguage ?? (() => {
    })
  } : Dt);
}
function He(e) {
  var n, o, t = "";
  if (typeof e == "string" || typeof e == "number") t += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var l = e.length;
    for (n = 0; n < l; n++) e[n] && (o = He(e[n])) && (t && (t += " "), t += o);
  } else for (o in e) e[o] && (t && (t += " "), t += o);
  return t;
}
function Pt() {
  for (var e, n, o = 0, t = "", l = arguments.length; o < l; o++) (e = arguments[o]) && (n = He(e)) && (t && (t += " "), t += n);
  return t;
}
const $e = "-", It = (e) => {
  const n = Rt(e), {
    conflictingClassGroups: o,
    conflictingClassGroupModifiers: t
  } = e;
  return {
    getClassGroupId: (i) => {
      const s = i.split($e);
      return s[0] === "" && s.length !== 1 && s.shift(), Be(s, n) || $t(i);
    },
    getConflictingClassGroupIds: (i, s) => {
      const m = o[i] || [];
      return s && t[i] ? [...m, ...t[i]] : m;
    }
  };
}, Be = (e, n) => {
  if (e.length === 0)
    return n.classGroupId;
  const o = e[0], t = n.nextPart.get(o), l = t ? Be(e.slice(1), t) : void 0;
  if (l)
    return l;
  if (n.validators.length === 0)
    return;
  const c = e.join($e);
  return n.validators.find(({
    validator: i
  }) => i(c))?.classGroupId;
}, Le = /^\[(.+)\]$/, $t = (e) => {
  if (Le.test(e)) {
    const n = Le.exec(e)[1], o = n?.substring(0, n.indexOf(":"));
    if (o)
      return "arbitrary.." + o;
  }
}, Rt = (e) => {
  const {
    theme: n,
    prefix: o
  } = e, t = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Ft(Object.entries(e.classGroups), o).forEach(([c, i]) => {
    Ae(i, t, c, n);
  }), t;
}, Ae = (e, n, o, t) => {
  e.forEach((l) => {
    if (typeof l == "string") {
      const c = l === "" ? n : Me(n, l);
      c.classGroupId = o;
      return;
    }
    if (typeof l == "function") {
      if (Et(l)) {
        Ae(l(t), n, o, t);
        return;
      }
      n.validators.push({
        validator: l,
        classGroupId: o
      });
      return;
    }
    Object.entries(l).forEach(([c, i]) => {
      Ae(i, Me(n, c), o, t);
    });
  });
}, Me = (e, n) => {
  let o = e;
  return n.split($e).forEach((t) => {
    o.nextPart.has(t) || o.nextPart.set(t, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), o = o.nextPart.get(t);
  }), o;
}, Et = (e) => e.isThemeGetter, Ft = (e, n) => n ? e.map(([o, t]) => {
  const l = t.map((c) => typeof c == "string" ? n + c : typeof c == "object" ? Object.fromEntries(Object.entries(c).map(([i, s]) => [n + i, s])) : c);
  return [o, l];
}) : e, zt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let n = 0, o = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  const l = (c, i) => {
    o.set(c, i), n++, n > e && (n = 0, t = o, o = /* @__PURE__ */ new Map());
  };
  return {
    get(c) {
      let i = o.get(c);
      if (i !== void 0)
        return i;
      if ((i = t.get(c)) !== void 0)
        return l(c, i), i;
    },
    set(c, i) {
      o.has(c) ? o.set(c, i) : l(c, i);
    }
  };
}, qe = "!", Lt = (e) => {
  const {
    separator: n,
    experimentalParseClassName: o
  } = e, t = n.length === 1, l = n[0], c = n.length, i = (s) => {
    const m = [];
    let h = 0, x = 0, k;
    for (let v = 0; v < s.length; v++) {
      let C = s[v];
      if (h === 0) {
        if (C === l && (t || s.slice(v, v + c) === n)) {
          m.push(s.slice(x, v)), x = v + c;
          continue;
        }
        if (C === "/") {
          k = v;
          continue;
        }
      }
      C === "[" ? h++ : C === "]" && h--;
    }
    const g = m.length === 0 ? s : s.substring(x), D = g.startsWith(qe), I = D ? g.substring(1) : g, T = k && k > x ? k - x : void 0;
    return {
      modifiers: m,
      hasImportantModifier: D,
      baseClassName: I,
      maybePostfixModifierPosition: T
    };
  };
  return o ? (s) => o({
    className: s,
    parseClassName: i
  }) : i;
}, Mt = (e) => {
  if (e.length <= 1)
    return e;
  const n = [];
  let o = [];
  return e.forEach((t) => {
    t[0] === "[" ? (n.push(...o.sort(), t), o = []) : o.push(t);
  }), n.push(...o.sort()), n;
}, jt = (e) => ({
  cache: zt(e.cacheSize),
  parseClassName: Lt(e),
  ...It(e)
}), Ot = /\s+/, Vt = (e, n) => {
  const {
    parseClassName: o,
    getClassGroupId: t,
    getConflictingClassGroupIds: l
  } = n, c = [], i = e.trim().split(Ot);
  let s = "";
  for (let m = i.length - 1; m >= 0; m -= 1) {
    const h = i[m], {
      modifiers: x,
      hasImportantModifier: k,
      baseClassName: g,
      maybePostfixModifierPosition: D
    } = o(h);
    let I = !!D, T = t(I ? g.substring(0, D) : g);
    if (!T) {
      if (!I) {
        s = h + (s.length > 0 ? " " + s : s);
        continue;
      }
      if (T = t(g), !T) {
        s = h + (s.length > 0 ? " " + s : s);
        continue;
      }
      I = !1;
    }
    const v = Mt(x).join(":"), C = k ? v + qe : v, A = C + T;
    if (c.includes(A))
      continue;
    c.push(A);
    const J = l(T, I);
    for (let R = 0; R < J.length; ++R) {
      const K = J[R];
      c.push(C + K);
    }
    s = h + (s.length > 0 ? " " + s : s);
  }
  return s;
};
function Zt() {
  let e = 0, n, o, t = "";
  for (; e < arguments.length; )
    (n = arguments[e++]) && (o = Xe(n)) && (t && (t += " "), t += o);
  return t;
}
const Xe = (e) => {
  if (typeof e == "string")
    return e;
  let n, o = "";
  for (let t = 0; t < e.length; t++)
    e[t] && (n = Xe(e[t])) && (o && (o += " "), o += n);
  return o;
};
function Wt(e, ...n) {
  let o, t, l, c = i;
  function i(m) {
    const h = n.reduce((x, k) => k(x), e());
    return o = jt(h), t = o.cache.get, l = o.cache.set, c = s, s(m);
  }
  function s(m) {
    const h = t(m);
    if (h)
      return h;
    const x = Vt(m, o);
    return l(m, x), x;
  }
  return function() {
    return c(Zt.apply(null, arguments));
  };
}
const w = (e) => {
  const n = (o) => o[e] || [];
  return n.isThemeGetter = !0, n;
}, Ye = /^\[(?:([a-z-]+):)?(.+)\]$/i, Gt = /^\d+\/\d+$/, Ut = /* @__PURE__ */ new Set(["px", "full", "screen"]), Ht = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Bt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, qt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Xt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Yt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, G = (e) => se(e) || Ut.has(e) || Gt.test(e), X = (e) => le(e, "length", on), se = (e) => !!e && !Number.isNaN(Number(e)), Te = (e) => le(e, "number", se), fe = (e) => !!e && Number.isInteger(Number(e)), Jt = (e) => e.endsWith("%") && se(e.slice(0, -1)), p = (e) => Ye.test(e), Y = (e) => Ht.test(e), Kt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Qt = (e) => le(e, Kt, Je), en = (e) => le(e, "position", Je), tn = /* @__PURE__ */ new Set(["image", "url"]), nn = (e) => le(e, tn, sn), rn = (e) => le(e, "", an), he = () => !0, le = (e, n, o) => {
  const t = Ye.exec(e);
  return t ? t[1] ? typeof n == "string" ? t[1] === n : n.has(t[1]) : o(t[2]) : !1;
}, on = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Bt.test(e) && !qt.test(e)
), Je = () => !1, an = (e) => Xt.test(e), sn = (e) => Yt.test(e), ln = () => {
  const e = w("colors"), n = w("spacing"), o = w("blur"), t = w("brightness"), l = w("borderColor"), c = w("borderRadius"), i = w("borderSpacing"), s = w("borderWidth"), m = w("contrast"), h = w("grayscale"), x = w("hueRotate"), k = w("invert"), g = w("gap"), D = w("gradientColorStops"), I = w("gradientColorStopPositions"), T = w("inset"), v = w("margin"), C = w("opacity"), A = w("padding"), J = w("saturate"), R = w("scale"), K = w("sepia"), E = w("skew"), ye = w("space"), ie = w("translate"), ce = () => ["auto", "contain", "none"], $ = () => ["auto", "hidden", "clip", "visible", "scroll"], U = () => ["auto", p, n], y = () => [p, n], xe = () => ["", G, X], b = () => ["auto", se, p], ve = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], f = () => ["solid", "dashed", "dotted", "double", "none"], F = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], H = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], Q = () => ["", "0", p], de = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], z = () => [se, p];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [he],
      spacing: [G, X],
      blur: ["none", "", Y, p],
      brightness: z(),
      borderColor: [e],
      borderRadius: ["none", "", "full", Y, p],
      borderSpacing: y(),
      borderWidth: xe(),
      contrast: z(),
      grayscale: Q(),
      hueRotate: z(),
      invert: Q(),
      gap: y(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Jt, X],
      inset: U(),
      margin: U(),
      opacity: z(),
      padding: y(),
      saturate: z(),
      scale: z(),
      sepia: Q(),
      skew: z(),
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
        "break-after": de()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": de()
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
        object: [...ve(), p]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: $()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": $()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": $()
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
        inset: [T]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [T]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [T]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [T]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [T]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [T]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [T]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [T]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [T]
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
        z: ["auto", fe, p]
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
        grow: Q()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: Q()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", fe, p]
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
          span: ["full", fe, p]
        }, p]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": b()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": b()
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
          span: [fe, p]
        }, p]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": b()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": b()
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
        gap: [g]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [g]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [g]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...H()]
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
        content: ["normal", ...H(), "baseline"]
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
        "place-content": [...H(), "baseline"]
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
        p: [A]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [A]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [A]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [A]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [A]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [A]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [A]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [A]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [A]
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
        "space-x": [ye]
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
        "space-y": [ye]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", p, n]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [p, n, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [p, n, "none", "full", "min", "max", "fit", "prose", {
          screen: [Y]
        }, Y]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [p, n, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [p, n, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [p, n, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [p, n, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", Y, X]
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
        "line-clamp": ["none", se, Te]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", G, p]
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
        "placeholder-opacity": [C]
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
        "text-opacity": [C]
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
        decoration: [...f(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", G, X]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", G, p]
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
        "bg-opacity": [C]
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
        bg: [...ve(), en]
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
        }, nn]
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
        from: [I]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [I]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [I]
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
        rounded: [c]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [c]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [c]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [c]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [c]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [c]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [c]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [c]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [c]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [c]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [c]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [c]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [c]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [c]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [c]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [s]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [s]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [s]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [s]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [s]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [s]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [s]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [s]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [s]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [C]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...f(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [s]
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
        "divide-y": [s]
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
        "divide-opacity": [C]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: f()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [l]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [l]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [l]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [l]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [l]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [l]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [l]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [l]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [l]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [l]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...f()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [G, p]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [G, X]
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
        ring: xe()
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
        "ring-opacity": [C]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [G, X]
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
        shadow: ["", "inner", "none", Y, rn]
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
        opacity: [C]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...F(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": F()
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
        "hue-rotate": [x]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [k]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [J]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [K]
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
        "backdrop-hue-rotate": [x]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [k]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [C]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [J]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [K]
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
        "border-spacing": [i]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [i]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [i]
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
        duration: z()
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
        delay: z()
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
        scale: [R]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [R]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [R]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [fe, p]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [ie]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [ie]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [E]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [E]
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
        stroke: [G, X, Te]
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
}, cn = /* @__PURE__ */ Wt(ln);
function Z(...e) {
  return cn(Pt(e));
}
const dn = "copanel_mobile_desktop_site";
function un() {
  try {
    return localStorage.getItem(dn) === "1";
  } catch {
    return !1;
  }
}
function De(e = window.innerWidth) {
  return un() || e >= 1024;
}
const pn = Ge(null);
function Ke() {
  return Ue(pn);
}
function Qe() {
  return Ke()?.isWindowed === !0;
}
function mn({ children: e, className: n, constrained: o = !1 }) {
  const { theme: t } = Ie(), l = Qe(), c = t === "dark", i = !l && !De();
  return /* @__PURE__ */ a(
    "div",
    {
      className: Z(
        "flex flex-col transition-colors duration-200",
        l ? "h-full min-h-0" : i ? "min-h-0" : "min-h-screen",
        c ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !l && o && "mx-auto max-w-7xl",
        n
      ),
      children: e
    }
  );
}
function fn({
  isDark: e,
  sidebar: n,
  children: o,
  mobileTitle: t,
  className: l
}) {
  const c = Qe(), [i, s] = S(!1), [m, h] = S(() => De());
  ke(() => {
    const g = () => h(De());
    return window.addEventListener("resize", g), () => window.removeEventListener("resize", g);
  }, []);
  const x = !c && !m;
  ke(() => {
    m && s(!1);
  }, [m]);
  const k = () => s(!1);
  return x ? /* @__PURE__ */ d("div", { className: Z("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", l), children: [
    /* @__PURE__ */ d(
      "div",
      {
        className: Z(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2.5",
          e ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white"
        ),
        children: [
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              onClick: () => s(!0),
              className: Z(
                "inline-flex items-center justify-center rounded-lg p-2",
                e ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ a(O.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          t ? /* @__PURE__ */ a("span", { className: Z("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: t }) : null
        ]
      }
    ),
    i ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: k
      }
    ) : null,
    /* @__PURE__ */ a(
      "div",
      {
        className: Z(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          i ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: k,
        children: n
      }
    ),
    /* @__PURE__ */ a("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: o })
  ] }) : /* @__PURE__ */ d("div", { className: Z("flex h-full min-h-0 flex-1 overflow-hidden", l), children: [
    n,
    /* @__PURE__ */ a("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: o })
  ] });
}
const hn = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function bn({
  open: e,
  onClose: n,
  children: o,
  title: t,
  className: l,
  maxWidth: c = "lg",
  closeOnBackdropClick: i = !0
}) {
  const { theme: s } = Ie(), m = s === "dark", h = Ke(), x = kt(null), [k, g] = S(null);
  Ct(() => {
    if (h?.isWindowed) return;
    const A = x.current?.closest(".module-window-viewport");
    g(A instanceof HTMLElement ? A : null);
  }, [h?.isWindowed, e]);
  const D = /* @__PURE__ */ a("span", { ref: x, hidden: !0, "aria-hidden": "true" });
  if (!e) return D;
  const I = !!(h?.isWindowed || k), T = /* @__PURE__ */ a(
    "div",
    {
      className: Z(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        I ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: i ? n : void 0,
      children: /* @__PURE__ */ d(
        "div",
        {
          className: Z(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            hn[c],
            m ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            l
          ),
          onClick: (A) => A.stopPropagation(),
          children: [
            t && /* @__PURE__ */ d(
              "div",
              {
                className: Z(
                  "flex items-center justify-between border-b px-4 py-3",
                  m ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ a("h3", { className: "text-sm font-bold", children: t }),
                  /* @__PURE__ */ a("button", { type: "button", onClick: n, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ a(O.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            o
          ]
        }
      )
    }
  ), v = (h?.isWindowed ? h.viewportRef.current : null) || k || document.body, C = St(T, v);
  return /* @__PURE__ */ d(ge, { children: [
    D,
    C
  ] });
}
class je extends Error {
  constructor(o, t, l, c) {
    super(t);
    j(this, "code");
    j(this, "status");
    j(this, "details");
    this.code = o, this.status = l, this.details = c;
  }
}
async function N(e, n = {}) {
  const o = typeof window < "u" ? localStorage.getItem("copanel_token") : null, t = {
    "Content-Type": "application/json",
    ...n.headers || {}
  };
  o && (t.Authorization = `Bearer ${o}`);
  const l = {
    method: n.method || "GET",
    headers: t,
    signal: n.signal
  };
  n.body !== void 0 && (l.body = typeof n.body == "string" ? n.body : JSON.stringify(n.body));
  const c = await fetch(e, l);
  let i = null;
  const s = await c.text();
  if (s)
    try {
      i = JSON.parse(s);
    } catch {
      i = s;
    }
  if (n.raw)
    return i;
  if (!c.ok) {
    const m = i && typeof i == "object" && i.error ? i.error : { code: `HTTP_${c.status}`, message: typeof i == "string" ? i : i?.detail || c.statusText };
    throw new je(m.code || `HTTP_${c.status}`, m.message || "Request failed", c.status, m.details);
  }
  if (i && typeof i == "object" && "status" in i) {
    if (i.status === "success")
      return i.data !== void 0 ? i.data : i;
    if (i.status === "error" && i.error)
      throw new je(i.error.code, i.error.message, c.status, i.error.details);
  }
  return i;
}
const et = "copanel-session-expired", gn = /* @__PURE__ */ new Set([
  "/api/auth/login",
  "/api/panel_settings/branding/public"
]);
function yn(e) {
  try {
    const n = typeof e == "string" ? e : e instanceof URL ? e.href : String(e.url || "");
    return (n.startsWith("http://") || n.startsWith("https://") ? new URL(n) : new URL(n, "http://localhost")).pathname;
  } catch {
    return "";
  }
}
function xn(e) {
  if (!e) return !1;
  for (const n of gn)
    if (e === n || e.startsWith(`${n}/`)) return !0;
  return !1;
}
function vn() {
  typeof window > "u" || window.dispatchEvent(new CustomEvent(et));
}
function ae() {
  return typeof localStorage > "u" ? null : localStorage.getItem("copanel_token");
}
function wn(e) {
  const n = {};
  e && new Headers(e).forEach((l, c) => {
    n[c] = l;
  });
  const o = ae();
  return o && (n.Authorization = `Bearer ${o}`), n;
}
function Nn(e, n = {}) {
  const o = wn(n.headers);
  return fetch(e, { ...n, headers: o }).then((t) => (t.status === 401 && !xn(yn(e)) && vn(), t));
}
async function kn() {
  if (!ae()) return null;
  try {
    const e = await Nn("/api/auth/stream-ticket", { method: "POST" });
    if (e.status === 401 || !e.ok) return null;
    const n = await e.json();
    return typeof n?.ticket == "string" ? n.ticket : null;
  } catch {
    return null;
  }
}
const Cn = "copanel-platform-sse-degraded", be = 2e3, _n = 6e4, Sn = 3;
class Tn {
  constructor() {
    j(this, "source", null);
    j(this, "handlers", /* @__PURE__ */ new Map());
    j(this, "retryDelay", be);
    j(this, "retryTimer", null);
    j(this, "failureCount", 0);
    j(this, "connecting", !1);
    j(this, "authFailed", !1);
  }
  on(n, o) {
    let t = this.handlers.get(n);
    return t || (t = /* @__PURE__ */ new Set(), this.handlers.set(n, t)), t.add(o), this.ensureConnected(), () => {
      t.delete(o), t.size === 0 && this.handlers.delete(n), this.teardownIfIdle();
    };
  }
  emit(n, o) {
    const t = this.handlers.get(n);
    t && t.forEach((l) => {
      try {
        l(o);
      } catch (c) {
        console.error("event handler failed", n, c);
      }
    });
  }
  async buildUrl() {
    if (!ae()) return null;
    const n = await kn();
    return n ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      ticket: n
    }).toString()}` : null;
  }
  ensureConnected() {
    this.authFailed || this.source || this.connecting || typeof document < "u" && document.hidden || ae() && (this.connecting = !0, this.buildUrl().then((n) => {
      if (this.connecting = !1, !(this.source || this.handlers.size === 0)) {
        if (!n) {
          if (!ae()) {
            this.stopForAuthFailure();
            return;
          }
          this.failureCount += 1, this.scheduleRetry();
          return;
        }
        this.openSource(n);
      }
    }).catch(() => {
      this.connecting = !1, this.scheduleRetry();
    }));
  }
  openSource(n) {
    try {
      this.source = new EventSource(n, { withCredentials: !0 });
    } catch {
      this.scheduleRetry();
      return;
    }
    this.source.addEventListener("open", () => {
      this.failureCount = 0, this.retryDelay = be;
    }), this.source.addEventListener("jobs", (o) => {
      this.onStreamMessage(), this.parseAndEmit("jobs", o.data);
    }), this.source.addEventListener("notifications", (o) => {
      this.onStreamMessage(), this.parseAndEmit("notifications", o.data);
    }), this.source.addEventListener("message", () => {
      this.onStreamMessage();
    }), this.source.onerror = () => {
      this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Sn && window.dispatchEvent(new CustomEvent(Cn)), this.scheduleRetry();
    };
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = be;
  }
  parseAndEmit(n, o) {
    try {
      const t = JSON.parse(o);
      this.emit(n, t.payload || t);
    } catch {
    }
  }
  scheduleRetry() {
    if (this.retryTimer || this.handlers.size === 0) return;
    const n = this.retryDelay;
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), _n), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, n);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = be);
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
    this.authFailed = !1, this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = be, this.handlers.size > 0 && ae() && this.ensureConnected();
  }
}
const Ce = new Tn();
function An() {
  Ce.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || An();
});
typeof window < "u" && window.addEventListener(et, () => {
  Ce.stop();
});
function tt(e) {
  let n = e;
  const o = /* @__PURE__ */ new Set();
  return {
    getState: () => n,
    setState: (t) => {
      const l = typeof t == "function" ? t(n) : t;
      if (!l || Object.keys(l).length === 0) return;
      let c = !1;
      for (const i of Object.keys(l))
        if (n[i] !== l[i]) {
          c = !0;
          break;
        }
      c && (n = { ...n, ...l }, o.forEach((i) => i()));
    },
    subscribe: (t) => (o.add(t), () => o.delete(t))
  };
}
const nt = tt({ jobs: {}, order: [], lastFetch: 0 });
function Dn() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Oe(e, n) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[n] || e.en || e.vi || e.default;
  }
}
function oe(e, n, o) {
  if (!e || typeof e != "object") return;
  const t = Oe(e[n], o);
  if (t) return t;
  const l = Oe(e[`${n}_i18n`], o);
  if (l) return l;
  const c = e[`${n}_${o}`];
  if (typeof c == "string" && c) return c;
  const i = e[`${n}_en`];
  if (typeof i == "string" && i) return i;
  const s = e[`${n}_vi`];
  if (typeof s == "string" && s) return s;
}
function Pn(e) {
  const n = Dn(), o = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: oe(e, "title", n) || oe(o, "title", n) || e?.title || "",
    message: oe(e, "message", n) || oe(o, "message", n) || e?.message,
    error: oe(e, "error", n) || oe(o, "error", n) || e?.error || null
  };
}
function Ve(e) {
  const n = Pn(e);
  nt.setState((o) => {
    const t = { ...o.jobs, [n.id]: { ...o.jobs[n.id], ...n } };
    let l = o.order;
    return l.includes(n.id) || (l = [n.id, ...l].slice(0, 200)), { jobs: t, order: l };
  });
}
Ce.on("jobs", (e) => {
  if (e?.job) {
    Ve(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const n = nt.getState().jobs[e.job_id];
    n && Ve({
      ...n,
      progress: e.progress ?? n.progress,
      message: e.message ?? n.message,
      status: e.status ?? n.status
    });
  }
});
const Pe = tt({ inbox: [], unread: 0, toasts: [] }), In = 6e3;
function $n() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Ze(e, n) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[n] || e.en || e.vi || e.default;
  }
}
function Ne(e, n, o) {
  if (!e || typeof e != "object") return;
  const t = Ze(e[n], o);
  if (t) return t;
  const l = Ze(e[`${n}_i18n`], o);
  if (l) return l;
  const c = e[`${n}_${o}`];
  if (typeof c == "string" && c) return c;
  const i = e[`${n}_en`];
  if (typeof i == "string" && i) return i;
  const s = e[`${n}_vi`];
  if (typeof s == "string" && s) return s;
}
function Rn(e) {
  const n = $n(), o = e?.payload && typeof e.payload == "object" ? e.payload : {}, t = Ne(e, "title", n) || Ne(o, "title", n) || e?.title || "", l = Ne(e, "body", n) || Ne(o, "body", n) || e?.body || null;
  return {
    ...e,
    title: t,
    body: l
  };
}
function En(e) {
  Pe.setState((n) => ({ toasts: [e, ...n.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    Pe.setState((n) => ({ toasts: n.toasts.filter((o) => o.id !== e.id) }));
  }, In);
}
Ce.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const n = Rn(e.notification);
    En({ ...n, ephemeral: !0 }), Pe.setState((o) => ({
      inbox: [n, ...o.inbox].slice(0, 200),
      unread: o.unread + 1
    }));
  }
});
const Fn = ["A", "AAAA", "CNAME", "TXT", "MX", "NS"], We = {
  name: "",
  record_name: "@",
  record_type: "A",
  proxied: !1,
  ttl: 1,
  ip_source: "public",
  interface_name: "eth0",
  custom_ip_url: "",
  interval_minutes: 5,
  enabled: !0
}, zn = {
  en: {
    category: "Network",
    title: "Cloudflare DDNS",
    subtitle: "Dynamic DNS updates, DNS record management, and Cloudflare Tunnel (cloudflared). Requires API Token with Zone:DNS:Edit and Account:Cloudflare Tunnel permissions.",
    tabs: { settings: "API", ddns: "DDNS", records: "DNS Records", tunnels: "Tunnel" },
    apiToken: "Cloudflare API Token",
    apiTokenHintBefore: "Create a token at ",
    apiTokenHintAfter: ". Permissions: Zone → DNS → Edit, Account → Cloudflare Tunnel → Edit.",
    tokenSaved: "Token saved:",
    tokenOptional: "(leave blank to keep current)",
    accountId: "Account ID (optional)",
    accountIdPlaceholder: "Auto-detect on verify",
    saveVerify: "Save & Verify",
    verifyAgain: "Verify again",
    tokenValid: "Token valid ·",
    accounts: "account(s)",
    cronTitle: "DDNS Cron",
    cronOk: "OK — crontab synced",
    cronCheck: "Needs attention",
    cronProfiles: "enabled profile(s) ·",
    cronIntervals: "interval(s)",
    cronDaemon: "daemon",
    cronRunning: "running",
    cronStopped: "stopped",
    cronPlayHint: "Play button = run once via API (not cron). Scheduled runs require enabled profiles and OS cron daemon.",
    cronNoLines: "No cron lines (disabled profiles or not synced).",
    cronSync: "Install cron & sync",
    cronMissingScript: "Missing run_update.py — upgrade module.",
    addDdns: "Add DDNS profile",
    selectZone: "Select zone",
    profileName: "Profile name",
    recordName: "Record (@, home, …)",
    publicIp: "Public IP",
    networkIface: "Network interface",
    customUrl: "Custom URL",
    intervalMin: "Interval (minutes)",
    proxied: "Proxied (orange cloud)",
    add: "Add & update IP",
    ddnsProfiles: "DDNS profiles",
    pending: "pending",
    disabled: "disabled",
    every: "every",
    min: "min",
    lastRun: "Last run:",
    noProfiles: "No DDNS profiles yet.",
    runNow: "Run now",
    enable: "Enable",
    disable: "Disable",
    needZone: "Select a Cloudflare zone before adding a DDNS profile.",
    needProfileName: "Enter a profile name before adding.",
    zones: "Zones",
    noZones: "No zones loaded — configure API token first.",
    selectZoneRecords: "Select a zone to view/edit DNS records.",
    addRecord: "Add",
    noRecords: "No records.",
    proxiedLabel: "proxied",
    cloudflared: "cloudflared",
    installed: "Installed:",
    notInstalled: "cloudflared not installed. Install Cloudflare package before using Tunnel.",
    service: "Service:",
    tunnels: "Tunnels",
    selectTunnel: "Select a tunnel to configure ingress rules.",
    hostname: "hostname (e.g. app.example.com)",
    serviceUrl: "http://localhost:80",
    remove: "Remove",
    addRule: "+ Add rule",
    catchAll404: "+ Catch-all 404",
    saveConfig: "Save config.yml",
    installService: "Install systemd service",
    configPath: "Config saved at",
    configHint: 'After saving, run "Install systemd service" to register cloudflared (Linux).',
    noTunnels: "No tunnels yet.",
    confirmDeleteRecord: "Delete this DNS record?",
    confirmDeleteDdns: "Delete this DDNS profile?",
    confirmDeleteTunnel: "Delete this tunnel from Cloudflare?",
    cancel: "Cancel",
    delete: "Delete",
    needAccountId: "Account ID is missing. Open the API tab, click Save & Verify (or paste Account ID), then return here. Token needs Account → Cloudflare Tunnel → Edit.",
    api404: "Cloudflare DDNS API not found (404) — backend module not loaded. Run: systemctl restart copanel. Previously saved token remains at /var/lib/copanel/cloudflare_ddns.json unless manually deleted.",
    loadFailed: "Load failed",
    loadZonesFailed: "Failed to load zones",
    cronSyncFailed: "Cron sync failed",
    saveFailed: "Save failed",
    verifyFailed: "Verify failed",
    loadRecordsFailed: "Failed to load records",
    addRecordFailed: "Add record failed",
    deleteFailed: "Delete failed",
    createDdnsFailed: "Create DDNS failed",
    runFailed: "Run failed",
    updateFailed: "Update failed",
    createTunnelFailed: "Create tunnel failed",
    saveTunnelFailed: "Save tunnel config failed",
    installFailed: "Install service failed",
    deleteTunnelFailed: "Delete tunnel failed",
    loadTunnelsFailed: "Failed to load tunnels"
  },
  vi: {
    category: "Network",
    title: "Cloudflare DDNS",
    subtitle: "Cập nhật IP động lên Cloudflare DNS, quản lý bản ghi DNS, và cấu hình Cloudflare Tunnel (cloudflared). Cần API Token với quyền Zone:DNS:Edit và Account:Cloudflare Tunnel.",
    tabs: { settings: "API", ddns: "DDNS", records: "DNS Records", tunnels: "Tunnel" },
    apiToken: "Cloudflare API Token",
    apiTokenHintBefore: "Tạo token tại ",
    apiTokenHintAfter: ". Quyền: Zone → DNS → Edit, Account → Cloudflare Tunnel → Edit.",
    tokenSaved: "Token đã lưu:",
    tokenOptional: "(để trống nếu không đổi)",
    accountId: "Account ID (tùy chọn)",
    accountIdPlaceholder: "Auto-detect khi verify",
    saveVerify: "Lưu & Verify",
    verifyAgain: "Verify lại",
    tokenValid: "Token hợp lệ ·",
    accounts: "account(s)",
    cronTitle: "Cron DDNS",
    cronOk: "OK — crontab đã sync",
    cronCheck: "Cần kiểm tra",
    cronProfiles: "profile bật ·",
    cronIntervals: "interval",
    cronDaemon: "daemon",
    cronRunning: "đang chạy",
    cronStopped: "tắt",
    cronPlayHint: "Nút ▶ (Play) = chạy ngay một lần qua API, không phụ thuộc cron. Lịch tự động cần profile bật và daemon cron OS đang chạy.",
    cronNoLines: "Chưa có dòng cron (profile disabled hoặc chưa sync).",
    cronSync: "Cài cron & sync",
    cronMissingScript: "Thiếu run_update.py — cập nhật module lên bản mới.",
    addDdns: "Thêm DDNS profile",
    selectZone: "Chọn zone",
    profileName: "Tên profile",
    recordName: "Record (@, home, …)",
    publicIp: "Public IP",
    networkIface: "Network interface",
    customUrl: "Custom URL",
    intervalMin: "Interval (phút)",
    proxied: "Proxied (orange cloud)",
    add: "Thêm & cập nhật IP",
    ddnsProfiles: "DDNS profiles",
    pending: "pending",
    disabled: "disabled",
    every: "mỗi",
    min: "p",
    lastRun: "Lần chạy:",
    noProfiles: "Chưa có profile DDNS.",
    runNow: "Chạy ngay",
    enable: "Bật",
    disable: "Tắt",
    needZone: "Chọn zone Cloudflare trước khi thêm DDNS profile.",
    needProfileName: "Nhập tên profile trước khi thêm.",
    zones: "Zones",
    noZones: "Chưa load zones — cấu hình API token trước.",
    selectZoneRecords: "Chọn zone để xem/sửa DNS records.",
    addRecord: "Add",
    noRecords: "Không có record.",
    proxiedLabel: "proxied",
    cloudflared: "cloudflared",
    installed: "Đã cài:",
    notInstalled: "Chưa cài cloudflared. Cài từ package Cloudflare trước khi dùng Tunnel.",
    service: "Service:",
    tunnels: "Tunnels",
    selectTunnel: "Chọn tunnel để cấu hình ingress rules.",
    hostname: "hostname (vd: app.example.com)",
    serviceUrl: "http://localhost:80",
    remove: "Xóa",
    addRule: "+ Thêm rule",
    catchAll404: "+ Catch-all 404",
    saveConfig: "Lưu config.yml",
    installService: "Cài systemd service",
    configPath: "Config lưu tại",
    configHint: 'Sau khi lưu, chạy "Cài systemd service" để đăng ký cloudflared (Linux).',
    noTunnels: "Chưa có tunnel.",
    confirmDeleteRecord: "Delete this record?",
    confirmDeleteDdns: "Delete this DDNS profile?",
    confirmDeleteTunnel: "Xóa tunnel này khỏi Cloudflare?",
    cancel: "Hủy",
    delete: "Xóa",
    needAccountId: "Thiếu Account ID. Vào tab API, bấm Lưu & Verify (hoặc dán Account ID), rồi quay lại. Token cần quyền Account → Cloudflare Tunnel → Edit.",
    api404: "API Cloudflare DDNS không tìm thấy (404) — module backend chưa load. Chạy: systemctl restart copanel. Token cấu hình trước đó vẫn nằm tại /var/lib/copanel/cloudflare_ddns.json trên server (trừ khi file bị xóa thủ công).",
    loadFailed: "Load failed",
    loadZonesFailed: "Failed to load zones",
    cronSyncFailed: "Cron sync failed",
    saveFailed: "Save failed",
    verifyFailed: "Verify failed",
    loadRecordsFailed: "Failed to load records",
    addRecordFailed: "Add record failed",
    deleteFailed: "Delete failed",
    createDdnsFailed: "Create DDNS failed",
    runFailed: "Run failed",
    updateFailed: "Update failed",
    createTunnelFailed: "Create tunnel failed",
    saveTunnelFailed: "Save tunnel config failed",
    installFailed: "Install service failed",
    deleteTunnelFailed: "Delete tunnel failed",
    loadTunnelsFailed: "Không tải được danh sách tunnels"
  }
};
function Ln(e) {
  return e ? new Date(e * 1e3).toLocaleString() : "—";
}
function Mn(e) {
  const n = (e || "").toLowerCase();
  return n === "updated" || n === "created" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : n === "unchanged" ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" : n === "error" ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300" : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
}
function Gn() {
  const { theme: e, language: n } = Ie(), o = e === "dark", t = zn[n === "vi" ? "vi" : "en"], [l, c] = S("settings"), [i, s] = S(null), [m, h] = S(!1), [x, k] = S(null), [g, D] = S(null), [I, T] = S(""), [v, C] = S(""), [A, J] = S(null), [R, K] = S([]), [E, ye] = S(null), [ie, ce] = S([]), [$, U] = S({ type: "A", name: "@", content: "", ttl: 1, proxied: !1 }), [y, xe] = S([]), [b, ve] = S(null), [f, F] = S(We), [H, Q] = S(null), [de, z] = S([]), [_e, Re] = S(""), [L, Ee] = S(null), [B, ee] = S([{ hostname: "", service: "http://localhost:80", path: "" }]), [ue, Fe] = S(null), q = o ? "bg-slate-900/60 border-slate-700" : "bg-white border-slate-200", _ = o ? "text-slate-400" : "text-slate-500", P = o ? "bg-slate-950/40 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900", pe = o ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200", me = re(async () => {
    const r = await N("/api/cloudflare_ddns/zones");
    return K(r || []), r || [];
  }, []), ne = re(async () => {
    const r = await N("/api/cloudflare_ddns/ddns");
    xe(r || []);
  }, []), W = re(async () => {
    const r = await N("/api/cloudflare_ddns/ddns/cron-status");
    ve(r);
  }, []), te = re(async () => {
    const [r, u] = await Promise.all([
      N("/api/cloudflare_ddns/tunnels"),
      N("/api/cloudflare_ddns/tunnels/service/status")
    ]);
    z(r || []), Fe(u);
  }, []), we = re(async (r) => {
    J(r), r?.account_id && C(r.account_id);
    try {
      const u = await N("/api/cloudflare_ddns/config");
      D(u), u.account_id && C(u.account_id);
    } catch {
    }
  }, []), ze = re(async () => {
    try {
      s(null);
      const r = await N("/api/cloudflare_ddns/config");
      if (D(r), C(r.account_id || ""), r.api_token_set)
        try {
          await me();
        } catch (u) {
          s(u?.message || t.loadZonesFailed);
        }
      else
        K([]);
      await ne(), await W(), l === "tunnels" && r.api_token_set && await te();
    } catch (r) {
      const u = r?.status, V = r?.message || t.loadFailed;
      s(u === 404 ? t.api404 : V);
    }
  }, [W, ne, te, me, l, t.api404, t.loadFailed, t.loadZonesFailed]);
  ke(() => {
    ze();
  }, []), ke(() => {
    (l === "ddns" || l === "records") && g?.api_token_set && me().catch((r) => s(r?.message || t.loadZonesFailed)), l === "ddns" && W().catch(() => {
    }), l === "tunnels" && g?.api_token_set && (async () => {
      try {
        if (!g.account_id)
          try {
            const r = await N("/api/cloudflare_ddns/config/verify", { method: "POST" });
            await we(r);
          } catch (r) {
            s(r?.message || t.needAccountId);
            return;
          }
        await te(), s(null);
      } catch (r) {
        s(r?.message || t.loadTunnelsFailed);
      }
    })();
  }, [
    l,
    g?.api_token_set,
    g?.account_id,
    we,
    W,
    te,
    me,
    t.loadFailed,
    t.loadTunnelsFailed,
    t.loadZonesFailed,
    t.needAccountId
  ]);
  async function rt() {
    h(!0);
    try {
      await N("/api/cloudflare_ddns/ddns/cron-sync", { method: "POST" }), s(null), await W();
    } catch (r) {
      s(r?.message || t.cronSyncFailed);
    } finally {
      h(!1);
    }
  }
  async function ot() {
    h(!0);
    try {
      const r = await N("/api/cloudflare_ddns/config", {
        method: "PUT",
        body: { api_token: I || void 0, account_id: v || void 0 }
      });
      D(r), C(r.account_id || v), T(""), s(null);
      const u = await N("/api/cloudflare_ddns/config/verify", { method: "POST" });
      await we(u), await me(), await W();
    } catch (r) {
      s(r?.message || t.saveFailed);
    } finally {
      h(!1);
    }
  }
  async function at() {
    h(!0);
    try {
      const r = await N("/api/cloudflare_ddns/config/verify", { method: "POST" });
      await we(r), s(null);
    } catch (r) {
      s(r?.message || t.verifyFailed);
    } finally {
      h(!1);
    }
  }
  async function Se(r) {
    ye(r);
    try {
      const u = await N(`/api/cloudflare_ddns/zones/${r.id}/records`);
      ce(u || []), s(null);
    } catch (u) {
      s(u?.message || t.loadRecordsFailed);
    }
  }
  async function st() {
    if (!(!E || !$.content.trim()))
      try {
        await N(`/api/cloudflare_ddns/zones/${E.id}/records`, {
          method: "POST",
          body: $
        }), U({ ...$, content: "" }), Se(E);
      } catch (r) {
        s(r?.message || t.addRecordFailed);
      }
  }
  async function lt(r) {
    if (E)
      try {
        await N(`/api/cloudflare_ddns/zones/${E.id}/records/${r}`, { method: "DELETE" }), Se(E);
      } catch (u) {
        s(u?.message || t.deleteFailed);
      }
  }
  async function it() {
    if (!H) {
      s(t.needZone);
      return;
    }
    if (!f.name?.trim()) {
      s(t.needProfileName);
      return;
    }
    const r = Number(f.interval_minutes), u = Number.isFinite(r) && r >= 1 ? Math.min(1440, Math.floor(r)) : 5, V = (f.record_name || "@").trim() || "@";
    h(!0);
    try {
      const M = await N("/api/cloudflare_ddns/ddns", {
        method: "POST",
        body: {
          name: f.name.trim(),
          zone_id: H.id,
          zone_name: H.name,
          record_name: V,
          record_type: f.record_type || "A",
          proxied: !!f.proxied,
          ttl: Number(f.ttl) > 0 ? Number(f.ttl) : 1,
          ip_source: f.ip_source || "public",
          interface_name: f.interface_name || "",
          custom_ip_url: f.custom_ip_url || "",
          interval_minutes: u,
          enabled: f.enabled !== !1
        }
      });
      F({ ...We }), s(null);
      try {
        await N(`/api/cloudflare_ddns/ddns/${M.id}/run`, { method: "POST" });
      } catch (vt) {
        s(vt?.message || t.runFailed);
      }
      await ne(), await W();
    } catch (M) {
      s(M?.message || t.createDdnsFailed);
    } finally {
      h(!1);
    }
  }
  async function ct(r) {
    try {
      await N(`/api/cloudflare_ddns/ddns/${r}/run`, { method: "POST" }), await ne();
    } catch (u) {
      s(u?.message || t.runFailed);
    }
  }
  async function dt(r) {
    try {
      await N(`/api/cloudflare_ddns/ddns/${r.id}`, {
        method: "PUT",
        body: { enabled: !r.enabled }
      }), await ne(), await W();
    } catch (u) {
      s(u?.message || t.updateFailed);
    }
  }
  async function ut(r) {
    try {
      await N(`/api/cloudflare_ddns/ddns/${r}`, { method: "DELETE" }), await ne(), await W();
    } catch (u) {
      s(u?.message || t.deleteFailed);
    }
  }
  async function pt() {
    if (_e.trim())
      try {
        await N("/api/cloudflare_ddns/tunnels", { method: "POST", body: { name: _e.trim() } }), Re(""), await te();
      } catch (r) {
        s(r?.message || t.createTunnelFailed);
      }
  }
  async function mt(r) {
    Ee(r);
    try {
      const u = await N(`/api/cloudflare_ddns/tunnels/${r.id}/config`);
      ee(
        u.ingress?.length ? u.ingress : [{ hostname: "", service: "http://localhost:80", path: "" }]
      );
    } catch {
      ee([{ hostname: "", service: "http://localhost:80", path: "" }]);
    }
  }
  async function ft() {
    if (L)
      try {
        await N(`/api/cloudflare_ddns/tunnels/${L.id}/config`, {
          method: "PUT",
          body: { tunnel_id: L.id, tunnel_name: L.name, ingress: B }
        }), await te(), s(null);
      } catch (r) {
        s(r?.message || t.saveTunnelFailed);
      }
  }
  async function ht() {
    if (L)
      try {
        const r = await N(`/api/cloudflare_ddns/tunnels/${L.id}/install`, { method: "POST" });
        Fe(r);
      } catch (r) {
        s(r?.message || t.installFailed);
      }
  }
  async function bt(r) {
    try {
      await N(`/api/cloudflare_ddns/tunnels/${r}`, { method: "DELETE" }), L?.id === r && Ee(null), await te();
    } catch (u) {
      s(u?.message || t.deleteTunnelFailed);
    }
  }
  async function gt() {
    if (!x) return;
    const { kind: r, id: u } = x;
    k(null), r === "record" ? await lt(u) : r === "ddns" ? await ut(u) : r === "tunnel" && await bt(u);
  }
  const yt = [
    { id: "settings", label: t.tabs.settings, icon: "Key" },
    { id: "ddns", label: t.tabs.ddns, icon: "RefreshCw" },
    { id: "records", label: t.tabs.records, icon: "Globe" },
    { id: "tunnels", label: t.tabs.tunnels, icon: "Route" }
  ], xt = x?.kind === "record" ? t.confirmDeleteRecord : x?.kind === "ddns" ? t.confirmDeleteDdns : x?.kind === "tunnel" ? t.confirmDeleteTunnel : "";
  return /* @__PURE__ */ a(mn, { constrained: !0, children: /* @__PURE__ */ d("div", { className: `flex flex-col h-full min-h-0 ${o ? "text-slate-100" : "text-slate-900"}`, children: [
    /* @__PURE__ */ d(
      "header",
      {
        className: `shrink-0 px-4 py-3 border-b flex items-center justify-between gap-4 ${o ? "border-slate-700" : "border-slate-200"}`,
        children: [
          /* @__PURE__ */ d("div", { className: "min-w-0", children: [
            /* @__PURE__ */ a("p", { className: "text-[10px] uppercase tracking-widest text-orange-500 font-bold", children: t.category }),
            /* @__PURE__ */ a("h1", { className: "text-lg font-semibold truncate", children: t.title }),
            /* @__PURE__ */ a("p", { className: `text-xs mt-0.5 line-clamp-2 ${_}`, children: t.subtitle })
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              onClick: () => ze(),
              className: `shrink-0 p-2 rounded-lg border ${pe}`,
              title: "Refresh",
              children: /* @__PURE__ */ a(O.RefreshCw, { className: "w-4 h-4" })
            }
          )
        ]
      }
    ),
    i && /* @__PURE__ */ d("div", { className: "shrink-0 mx-4 mt-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 px-4 py-3 text-sm text-red-600 dark:text-red-300 flex justify-between gap-2", children: [
      /* @__PURE__ */ a("span", { children: i }),
      /* @__PURE__ */ a("button", { type: "button", onClick: () => s(null), className: "shrink-0", children: /* @__PURE__ */ a(O.X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ a(
      fn,
      {
        isDark: o,
        mobileTitle: t.title,
        sidebar: /* @__PURE__ */ a(
          "aside",
          {
            className: `h-full w-44 shrink-0 border-r flex flex-col ${o ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`,
            children: /* @__PURE__ */ a("nav", { className: "flex-1 overflow-y-auto p-2 space-y-0.5", children: yt.map((r) => {
              const u = O[r.icon], V = l === r.id;
              return /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  onClick: () => c(r.id),
                  className: `w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${V ? o ? "bg-orange-600/25 text-orange-300 font-semibold" : "bg-orange-50 text-orange-700 font-semibold" : `hover:${o ? "bg-slate-800" : "bg-slate-100"} ${_}`}`,
                  children: [
                    /* @__PURE__ */ a(u, { className: "w-4 h-4 shrink-0" }),
                    /* @__PURE__ */ a("span", { className: "truncate", children: r.label })
                  ]
                },
                r.id
              );
            }) })
          }
        ),
        children: /* @__PURE__ */ d("main", { className: "flex-1 min-h-0 overflow-y-auto p-4", children: [
          l === "settings" && /* @__PURE__ */ d("section", { className: `rounded-2xl border p-5 space-y-4 ${q}`, children: [
            /* @__PURE__ */ a("h2", { className: "text-sm font-bold", children: t.apiToken }),
            /* @__PURE__ */ d("p", { className: `text-xs ${_}`, children: [
              t.apiTokenHintBefore,
              /* @__PURE__ */ a(
                "a",
                {
                  href: "https://dash.cloudflare.com/profile/api-tokens",
                  target: "_blank",
                  rel: "noreferrer",
                  className: "text-orange-500 underline",
                  children: "Cloudflare Dashboard"
                }
              ),
              t.apiTokenHintAfter
            ] }),
            g?.api_token_set && /* @__PURE__ */ d("p", { className: "text-sm text-emerald-600 dark:text-emerald-400", children: [
              t.tokenSaved,
              " ",
              /* @__PURE__ */ a("span", { className: "font-mono", children: g.api_token_hint }),
              g.account_name && /* @__PURE__ */ d(ge, { children: [
                " ",
                "· Account: ",
                /* @__PURE__ */ a("strong", { children: g.account_name })
              ] })
            ] }),
            /* @__PURE__ */ d("div", { className: "grid gap-3 md:grid-cols-2", children: [
              /* @__PURE__ */ d("label", { className: `block text-xs font-semibold ${_}`, children: [
                "API Token ",
                g?.api_token_set && t.tokenOptional,
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "password",
                    value: I,
                    onChange: (r) => T(r.target.value),
                    placeholder: "Cloudflare API Token",
                    className: `mt-1 w-full rounded-xl border px-3 py-2 text-sm font-mono ${P}`
                  }
                )
              ] }),
              /* @__PURE__ */ d("label", { className: `block text-xs font-semibold ${_}`, children: [
                t.accountId,
                /* @__PURE__ */ a(
                  "input",
                  {
                    value: v,
                    onChange: (r) => C(r.target.value),
                    placeholder: t.accountIdPlaceholder,
                    className: `mt-1 w-full rounded-xl border px-3 py-2 text-sm font-mono ${P}`
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ d("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  onClick: ot,
                  disabled: m,
                  className: "px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold disabled:opacity-50",
                  children: t.saveVerify
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  onClick: at,
                  disabled: m || !g?.api_token_set,
                  className: `px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-50 ${pe}`,
                  children: t.verifyAgain
                }
              )
            ] }),
            A?.valid && /* @__PURE__ */ d("div", { className: `text-xs space-y-1 ${_}`, children: [
              /* @__PURE__ */ d("p", { children: [
                t.tokenValid,
                " ",
                A.accounts?.length || 0,
                " ",
                t.accounts
              ] }),
              /* @__PURE__ */ a("ul", { className: "list-disc pl-4", children: (A.accounts || []).map((r) => /* @__PURE__ */ d("li", { className: "font-mono", children: [
                r.name,
                " (",
                r.id,
                ")"
              ] }, r.id)) })
            ] })
          ] }),
          l === "ddns" && /* @__PURE__ */ d("div", { className: "space-y-4", children: [
            b && /* @__PURE__ */ d(
              "section",
              {
                className: `rounded-2xl border p-4 text-xs ${b.sync_ok ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30" : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"}`,
                children: [
                  /* @__PURE__ */ a("h2", { className: "text-sm font-bold mb-2", children: t.cronTitle }),
                  !b.supported && /* @__PURE__ */ a("p", { children: b.message }),
                  b.supported && /* @__PURE__ */ d(ge, { children: [
                    /* @__PURE__ */ d("p", { children: [
                      /* @__PURE__ */ a("strong", { children: b.sync_ok ? t.cronOk : t.cronCheck }),
                      " · ",
                      b.enabled_profiles,
                      " ",
                      t.cronProfiles,
                      " ",
                      b.intervals_minutes?.length || 0,
                      " ",
                      t.cronIntervals,
                      b.cron_daemon?.service && /* @__PURE__ */ d(ge, { children: [
                        " ",
                        "· ",
                        t.cronDaemon,
                        " ",
                        b.cron_daemon.service,
                        ":",
                        " ",
                        b.cron_service_active ? t.cronRunning : t.cronStopped
                      ] })
                    ] }),
                    /* @__PURE__ */ a("p", { className: `mt-1 ${_}`, children: t.cronPlayHint }),
                    (b.cron_entries || []).length > 0 ? /* @__PURE__ */ a("ul", { className: "mt-2 font-mono space-y-1 text-[11px]", children: b.cron_entries.map((r, u) => /* @__PURE__ */ a("li", { className: "break-all", children: r }, u)) }) : /* @__PURE__ */ a("p", { className: `mt-1 ${_}`, children: t.cronNoLines }),
                    !b.crontab_available && b.install_hint && /* @__PURE__ */ a("p", { className: "mt-2 text-amber-800 dark:text-amber-200", children: b.install_hint }),
                    b.crontab_available && b.cron_service_active === !1 && b.install_hint && /* @__PURE__ */ a("p", { className: "mt-2 text-amber-800 dark:text-amber-200", children: b.install_hint }),
                    !b.sync_ok && /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        onClick: rt,
                        disabled: m,
                        className: "mt-3 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold disabled:opacity-50",
                        children: t.cronSync
                      }
                    ),
                    b.scheduler_sync?.message && /* @__PURE__ */ a("p", { className: `mt-2 ${_}`, children: b.scheduler_sync.message }),
                    !b.run_script_exists && /* @__PURE__ */ a("p", { className: "mt-1 text-red-600", children: t.cronMissingScript }),
                    (b.log_files || []).map(
                      (r) => r.tail?.length > 0 && /* @__PURE__ */ d("details", { className: "mt-2", children: [
                        /* @__PURE__ */ d("summary", { className: "cursor-pointer", children: [
                          "Log ",
                          r.interval_minutes,
                          "p — ",
                          r.path
                        ] }),
                        /* @__PURE__ */ a("pre", { className: "mt-1 whitespace-pre-wrap text-[10px] opacity-80", children: r.tail.join(`
`) })
                      ] }, r.path)
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ d("section", { className: `rounded-2xl border p-5 space-y-3 ${q}`, children: [
              /* @__PURE__ */ a("h2", { className: "text-sm font-bold", children: t.addDdns }),
              /* @__PURE__ */ d("div", { className: "grid gap-2 md:grid-cols-4", children: [
                /* @__PURE__ */ d(
                  "select",
                  {
                    value: H?.id || "",
                    onChange: (r) => Q(R.find((u) => u.id === r.target.value) || null),
                    className: `rounded-xl border px-3 py-2 text-sm ${P}`,
                    children: [
                      /* @__PURE__ */ a("option", { value: "", children: t.selectZone }),
                      R.map((r) => /* @__PURE__ */ a("option", { value: r.id, children: r.name }, r.id))
                    ]
                  }
                ),
                /* @__PURE__ */ a(
                  "input",
                  {
                    value: f.name || "",
                    onChange: (r) => F({ ...f, name: r.target.value }),
                    placeholder: t.profileName,
                    className: `rounded-xl border px-3 py-2 text-sm ${P}`
                  }
                ),
                /* @__PURE__ */ a(
                  "input",
                  {
                    value: f.record_name ?? "@",
                    onChange: (r) => F({ ...f, record_name: r.target.value }),
                    placeholder: t.recordName,
                    className: `rounded-xl border px-3 py-2 text-sm ${P}`
                  }
                ),
                /* @__PURE__ */ d(
                  "select",
                  {
                    value: f.record_type || "A",
                    onChange: (r) => F({ ...f, record_type: r.target.value }),
                    className: `rounded-xl border px-3 py-2 text-sm ${P}`,
                    children: [
                      /* @__PURE__ */ a("option", { value: "A", children: "A" }),
                      /* @__PURE__ */ a("option", { value: "AAAA", children: "AAAA" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ d("div", { className: "grid gap-2 md:grid-cols-4", children: [
                /* @__PURE__ */ d(
                  "select",
                  {
                    value: f.ip_source || "public",
                    onChange: (r) => F({ ...f, ip_source: r.target.value }),
                    className: `rounded-xl border px-3 py-2 text-sm ${P}`,
                    children: [
                      /* @__PURE__ */ a("option", { value: "public", children: t.publicIp }),
                      /* @__PURE__ */ a("option", { value: "interface", children: t.networkIface }),
                      /* @__PURE__ */ a("option", { value: "custom_url", children: t.customUrl })
                    ]
                  }
                ),
                f.ip_source === "interface" && /* @__PURE__ */ a(
                  "input",
                  {
                    value: f.interface_name || "",
                    onChange: (r) => F({ ...f, interface_name: r.target.value }),
                    placeholder: "eth0",
                    className: `rounded-xl border px-3 py-2 text-sm ${P}`
                  }
                ),
                f.ip_source === "custom_url" && /* @__PURE__ */ a(
                  "input",
                  {
                    value: f.custom_ip_url || "",
                    onChange: (r) => F({ ...f, custom_ip_url: r.target.value }),
                    placeholder: "https://…",
                    className: `md:col-span-2 rounded-xl border px-3 py-2 text-sm ${P}`
                  }
                ),
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "number",
                    min: 1,
                    max: 1440,
                    value: f.interval_minutes ?? 5,
                    onChange: (r) => {
                      const u = Number(r.target.value);
                      F({
                        ...f,
                        interval_minutes: Number.isFinite(u) ? u : 5
                      });
                    },
                    placeholder: t.intervalMin,
                    className: `rounded-xl border px-3 py-2 text-sm ${P}`
                  }
                ),
                /* @__PURE__ */ d("label", { className: "flex items-center gap-2 text-sm px-2", children: [
                  /* @__PURE__ */ a(
                    "input",
                    {
                      type: "checkbox",
                      checked: !!f.proxied,
                      onChange: (r) => F({ ...f, proxied: r.target.checked })
                    }
                  ),
                  t.proxied
                ] }),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    onClick: it,
                    disabled: m,
                    className: "rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2 disabled:opacity-50",
                    children: m ? "…" : t.add
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ d("section", { className: `rounded-2xl border p-5 ${q}`, children: [
              /* @__PURE__ */ d("h2", { className: "text-sm font-bold mb-3", children: [
                t.ddnsProfiles,
                " (",
                y.length,
                ")"
              ] }),
              /* @__PURE__ */ d("ul", { className: `divide-y ${o ? "divide-slate-800" : "divide-slate-100"}`, children: [
                y.map((r) => /* @__PURE__ */ d("li", { className: "py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4", children: [
                  /* @__PURE__ */ d("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ d("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ a("span", { className: "font-semibold text-sm", children: r.name }),
                      /* @__PURE__ */ a("span", { className: `text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${Mn(r.last_status)}`, children: r.last_status || t.pending }),
                      !r.enabled && /* @__PURE__ */ a("span", { className: "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400", children: t.disabled })
                    ] }),
                    /* @__PURE__ */ d("p", { className: `text-xs font-mono mt-1 ${_}`, children: [
                      r.record_name,
                      ".",
                      r.zone_name,
                      " · ",
                      r.record_type,
                      " · ",
                      r.ip_source,
                      " · ",
                      t.every,
                      " ",
                      r.interval_minutes,
                      t.min
                    ] }),
                    /* @__PURE__ */ d("p", { className: `text-xs mt-0.5 ${_}`, children: [
                      "IP: ",
                      r.last_ip || "—",
                      " · ",
                      t.lastRun,
                      " ",
                      Ln(r.last_run),
                      r.last_error && /* @__PURE__ */ a("span", { className: "text-red-500 ml-2", children: r.last_error })
                    ] })
                  ] }),
                  /* @__PURE__ */ d("div", { className: "flex items-center gap-2 shrink-0", children: [
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        onClick: () => ct(r.id),
                        className: `p-2 rounded-lg border ${pe}`,
                        title: t.runNow,
                        children: /* @__PURE__ */ a(O.Play, { className: "w-4 h-4 text-emerald-500" })
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        onClick: () => dt(r),
                        className: `p-2 rounded-lg border ${pe}`,
                        title: r.enabled ? t.disable : t.enable,
                        children: r.enabled ? /* @__PURE__ */ a(O.Pause, { className: "w-4 h-4" }) : /* @__PURE__ */ a(O.PlayCircle, { className: "w-4 h-4" })
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        onClick: () => k({ kind: "ddns", id: r.id }),
                        className: "p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10",
                        children: /* @__PURE__ */ a(O.Trash2, { className: "w-4 h-4 text-red-500" })
                      }
                    )
                  ] })
                ] }, r.id)),
                y.length === 0 && /* @__PURE__ */ a("li", { className: `py-4 text-xs ${_}`, children: t.noProfiles })
              ] })
            ] })
          ] }),
          l === "records" && /* @__PURE__ */ d("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0", children: [
            /* @__PURE__ */ d("aside", { className: `rounded-2xl border p-4 ${q}`, children: [
              /* @__PURE__ */ a("h2", { className: "text-sm font-bold mb-3", children: t.zones }),
              /* @__PURE__ */ d("ul", { className: "space-y-1 max-h-64 lg:max-h-none overflow-y-auto", children: [
                R.map((r) => /* @__PURE__ */ a("li", { children: /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    onClick: () => Se(r),
                    className: `w-full text-left px-3 py-2 rounded-xl text-sm transition ${E?.id === r.id ? o ? "bg-orange-600/20 text-orange-300" : "bg-orange-50 text-orange-700" : o ? "hover:bg-slate-800" : "hover:bg-slate-100"}`,
                    children: r.name
                  }
                ) }, r.id)),
                R.length === 0 && /* @__PURE__ */ a("li", { className: `text-xs ${_}`, children: t.noZones })
              ] })
            ] }),
            /* @__PURE__ */ a("section", { className: `lg:col-span-2 rounded-2xl border p-4 ${q}`, children: E ? /* @__PURE__ */ d("div", { className: "space-y-4", children: [
              /* @__PURE__ */ a("h2", { className: "text-base font-bold", children: E.name }),
              /* @__PURE__ */ d("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-2", children: [
                /* @__PURE__ */ a(
                  "select",
                  {
                    value: $.type,
                    onChange: (r) => U({ ...$, type: r.target.value }),
                    className: `rounded-xl border px-3 py-2 text-sm ${P}`,
                    children: Fn.map((r) => /* @__PURE__ */ a("option", { children: r }, r))
                  }
                ),
                /* @__PURE__ */ a(
                  "input",
                  {
                    value: $.name,
                    onChange: (r) => U({ ...$, name: r.target.value }),
                    placeholder: "name",
                    className: `rounded-xl border px-3 py-2 text-sm ${P}`
                  }
                ),
                /* @__PURE__ */ a(
                  "input",
                  {
                    value: $.content,
                    onChange: (r) => U({ ...$, content: r.target.value }),
                    placeholder: "content",
                    className: `md:col-span-2 rounded-xl border px-3 py-2 text-sm ${P}`
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    onClick: st,
                    className: "rounded-xl bg-emerald-600 text-white text-sm font-bold",
                    children: t.addRecord
                  }
                )
              ] }),
              /* @__PURE__ */ d("ul", { className: `divide-y ${o ? "divide-slate-800" : "divide-slate-100"}`, children: [
                ie.map((r) => /* @__PURE__ */ d("li", { className: "flex items-center justify-between py-2 text-sm gap-2", children: [
                  /* @__PURE__ */ d("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ a("span", { className: "text-[10px] uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300 mr-2", children: r.type }),
                    /* @__PURE__ */ a("span", { className: "font-mono", children: r.name }),
                    /* @__PURE__ */ a("span", { className: `mx-1 ${_}`, children: "→" }),
                    /* @__PURE__ */ a("span", { className: "font-mono break-all", children: r.content }),
                    r.proxied && /* @__PURE__ */ a("span", { className: "ml-2 text-[10px] text-orange-500", children: t.proxiedLabel })
                  ] }),
                  /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      onClick: () => k({ kind: "record", id: r.id }),
                      className: "shrink-0 text-slate-400 hover:text-red-500",
                      children: /* @__PURE__ */ a(O.Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] }, r.id)),
                ie.length === 0 && /* @__PURE__ */ a("li", { className: `py-2 text-xs ${_}`, children: t.noRecords })
              ] })
            ] }) : /* @__PURE__ */ a("p", { className: `text-sm ${_}`, children: t.selectZoneRecords }) })
          ] }),
          l === "tunnels" && /* @__PURE__ */ d("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ d("aside", { className: "space-y-4", children: [
              /* @__PURE__ */ d("section", { className: `rounded-2xl border p-4 ${q}`, children: [
                /* @__PURE__ */ a("h2", { className: "text-sm font-bold mb-2", children: t.cloudflared }),
                /* @__PURE__ */ a("p", { className: `text-xs ${_}`, children: ue?.installed ? /* @__PURE__ */ d(ge, { children: [
                  t.installed,
                  " ",
                  /* @__PURE__ */ a("span", { className: "font-mono", children: ue.cloudflared_path })
                ] }) : t.notInstalled }),
                ue?.installed && /* @__PURE__ */ d("p", { className: "text-xs mt-1", children: [
                  t.service,
                  " ",
                  /* @__PURE__ */ a("span", { className: ue.active ? "text-emerald-500" : _, children: ue.message || "unknown" })
                ] })
              ] }),
              /* @__PURE__ */ d("section", { className: `rounded-2xl border p-4 ${q}`, children: [
                /* @__PURE__ */ a("h2", { className: "text-sm font-bold mb-3", children: t.tunnels }),
                /* @__PURE__ */ d("div", { className: "flex gap-2 mb-3", children: [
                  /* @__PURE__ */ a(
                    "input",
                    {
                      value: _e,
                      onChange: (r) => Re(r.target.value),
                      placeholder: "my-tunnel",
                      className: `flex-1 rounded-xl border px-3 py-2 text-sm ${P}`
                    }
                  ),
                  /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      onClick: pt,
                      className: "px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold",
                      children: "+"
                    }
                  )
                ] }),
                /* @__PURE__ */ d("ul", { className: "space-y-1 max-h-48 overflow-y-auto", children: [
                  de.map((r) => /* @__PURE__ */ d("li", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ d(
                      "button",
                      {
                        type: "button",
                        onClick: () => mt(r),
                        className: `flex-1 text-left px-3 py-2 rounded-xl text-sm transition ${L?.id === r.id ? o ? "bg-orange-600/20 text-orange-300" : "bg-orange-50 text-orange-700" : o ? "hover:bg-slate-800" : "hover:bg-slate-100"}`,
                        children: [
                          /* @__PURE__ */ a("span", { className: "font-semibold", children: r.name }),
                          /* @__PURE__ */ a("span", { className: `block text-[10px] ${_}`, children: r.status })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        onClick: () => k({ kind: "tunnel", id: r.id }),
                        className: "p-2 text-slate-400 hover:text-red-500",
                        children: /* @__PURE__ */ a(O.Trash2, { className: "w-4 h-4" })
                      }
                    )
                  ] }, r.id)),
                  de.length === 0 && /* @__PURE__ */ a("li", { className: `text-xs ${_}`, children: t.noTunnels })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ a("section", { className: `lg:col-span-2 rounded-2xl border p-4 ${q}`, children: L ? /* @__PURE__ */ d("div", { className: "space-y-4", children: [
              /* @__PURE__ */ d("header", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ a("h2", { className: "text-base font-bold", children: L.name }),
                /* @__PURE__ */ a("span", { className: `text-[10px] font-mono ${_}`, children: L.id })
              ] }),
              /* @__PURE__ */ d("div", { className: "space-y-2", children: [
                B.map((r, u) => /* @__PURE__ */ d("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-2", children: [
                  /* @__PURE__ */ a(
                    "input",
                    {
                      value: r.hostname,
                      onChange: (V) => {
                        const M = [...B];
                        M[u] = { ...r, hostname: V.target.value }, ee(M);
                      },
                      placeholder: t.hostname,
                      className: `rounded-xl border px-3 py-2 text-sm ${P}`
                    }
                  ),
                  /* @__PURE__ */ a(
                    "input",
                    {
                      value: r.service,
                      onChange: (V) => {
                        const M = [...B];
                        M[u] = { ...r, service: V.target.value }, ee(M);
                      },
                      placeholder: t.serviceUrl,
                      className: `md:col-span-2 rounded-xl border px-3 py-2 text-sm font-mono ${P}`
                    }
                  ),
                  /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      onClick: () => ee(B.filter((V, M) => M !== u)),
                      className: "text-red-500 text-sm",
                      disabled: B.length <= 1,
                      children: t.remove
                    }
                  )
                ] }, u)),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    onClick: () => ee([...B, { hostname: "", service: "http://localhost:8080", path: "" }]),
                    className: "text-xs text-orange-500 font-semibold",
                    children: t.addRule
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    onClick: () => ee([...B, { hostname: "", service: "http_status:404", path: "" }]),
                    className: `text-xs ml-3 ${_}`,
                    children: t.catchAll404
                  }
                )
              ] }),
              /* @__PURE__ */ d("div", { className: "flex flex-wrap gap-2 pt-2", children: [
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    onClick: ft,
                    className: "px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold",
                    children: t.saveConfig
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    onClick: ht,
                    className: "px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold",
                    children: t.installService
                  }
                )
              ] }),
              /* @__PURE__ */ d("p", { className: `text-xs ${_}`, children: [
                t.configPath,
                " ",
                /* @__PURE__ */ d("span", { className: "font-mono", children: [
                  g?.config_dir,
                  "/config.yml"
                ] }),
                ". ",
                t.configHint
              ] })
            ] }) : /* @__PURE__ */ a("p", { className: `text-sm ${_}`, children: t.selectTunnel }) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ a(bn, { open: !!x, onClose: () => k(null), title: xt, maxWidth: "sm", children: /* @__PURE__ */ d("div", { className: "p-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ a("button", { type: "button", onClick: () => k(null), className: `px-4 py-2 rounded-lg border text-sm ${pe}`, children: t.cancel }),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: gt,
          className: "px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold",
          children: t.delete
        }
      )
    ] }) })
  ] }) });
}
export {
  Gn as default
};
