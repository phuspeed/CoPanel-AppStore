var cr = Object.defineProperty;
var dr = (e, t, n) => t in e ? cr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var F = (e, t, n) => dr(e, typeof t != "symbol" ? t + "" : t, n);
import { jsx as s, jsxs as d, Fragment as kt } from "react/jsx-runtime";
import { createContext as Ct, useContext as St, useState as f, useEffect as J, useRef as Tt, useLayoutEffect as ur, useMemo as Ue, useCallback as ce } from "react";
import { useOutletContext as mr } from "react-router-dom";
import * as b from "lucide-react";
import { createPortal as hr } from "react-dom";
const pr = Ct(null);
function fr() {
  return St(pr);
}
const br = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Ke() {
  const e = fr(), t = mr();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : br);
}
function $t(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var i = e.length;
    for (t = 0; t < i; t++) e[t] && (n = $t(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function gr() {
  for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = $t(e)) && (r && (r += " "), r += t);
  return r;
}
const et = "-", yr = (e) => {
  const t = wr(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = e;
  return {
    getClassGroupId: (l) => {
      const m = l.split(et);
      return m[0] === "" && m.length !== 1 && m.shift(), _t(m, t) || xr(l);
    },
    getConflictingClassGroupIds: (l, m) => {
      const c = n[l] || [];
      return m && r[l] ? [...c, ...r[l]] : c;
    }
  };
}, _t = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const n = e[0], r = t.nextPart.get(n), i = r ? _t(e.slice(1), r) : void 0;
  if (i)
    return i;
  if (t.validators.length === 0)
    return;
  const a = e.join(et);
  return t.validators.find(({
    validator: l
  }) => l(a))?.classGroupId;
}, bt = /^\[(.+)\]$/, xr = (e) => {
  if (bt.test(e)) {
    const t = bt.exec(e)[1], n = t?.substring(0, t.indexOf(":"));
    if (n)
      return "arbitrary.." + n;
  }
}, wr = (e) => {
  const {
    theme: t,
    prefix: n
  } = e, r = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Nr(Object.entries(e.classGroups), n).forEach(([a, l]) => {
    He(l, r, a, t);
  }), r;
}, He = (e, t, n, r) => {
  e.forEach((i) => {
    if (typeof i == "string") {
      const a = i === "" ? t : gt(t, i);
      a.classGroupId = n;
      return;
    }
    if (typeof i == "function") {
      if (vr(i)) {
        He(i(r), t, n, r);
        return;
      }
      t.validators.push({
        validator: i,
        classGroupId: n
      });
      return;
    }
    Object.entries(i).forEach(([a, l]) => {
      He(l, gt(t, a), n, r);
    });
  });
}, gt = (e, t) => {
  let n = e;
  return t.split(et).forEach((r) => {
    n.nextPart.has(r) || n.nextPart.set(r, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), n = n.nextPart.get(r);
  }), n;
}, vr = (e) => e.isThemeGetter, Nr = (e, t) => t ? e.map(([n, r]) => {
  const i = r.map((a) => typeof a == "string" ? t + a : typeof a == "object" ? Object.fromEntries(Object.entries(a).map(([l, m]) => [t + l, m])) : a);
  return [n, i];
}) : e, kr = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  const i = (a, l) => {
    n.set(a, l), t++, t > e && (t = 0, r = n, n = /* @__PURE__ */ new Map());
  };
  return {
    get(a) {
      let l = n.get(a);
      if (l !== void 0)
        return l;
      if ((l = r.get(a)) !== void 0)
        return i(a, l), l;
    },
    set(a, l) {
      n.has(a) ? n.set(a, l) : i(a, l);
    }
  };
}, At = "!", Cr = (e) => {
  const {
    separator: t,
    experimentalParseClassName: n
  } = e, r = t.length === 1, i = t[0], a = t.length, l = (m) => {
    const c = [];
    let g = 0, p = 0, $;
    for (let x = 0; x < m.length; x++) {
      let k = m[x];
      if (g === 0) {
        if (k === i && (r || m.slice(x, x + a) === t)) {
          c.push(m.slice(p, x)), p = x + a;
          continue;
        }
        if (k === "/") {
          $ = x;
          continue;
        }
      }
      k === "[" ? g++ : k === "]" && g--;
    }
    const y = c.length === 0 ? m : m.substring(p), P = y.startsWith(At), L = P ? y.substring(1) : y, S = $ && $ > p ? $ - p : void 0;
    return {
      modifiers: c,
      hasImportantModifier: P,
      baseClassName: L,
      maybePostfixModifierPosition: S
    };
  };
  return n ? (m) => n({
    className: m,
    parseClassName: l
  }) : l;
}, Sr = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let n = [];
  return e.forEach((r) => {
    r[0] === "[" ? (t.push(...n.sort(), r), n = []) : n.push(r);
  }), t.push(...n.sort()), t;
}, Tr = (e) => ({
  cache: kr(e.cacheSize),
  parseClassName: Cr(e),
  ...yr(e)
}), $r = /\s+/, _r = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: i
  } = t, a = [], l = e.trim().split($r);
  let m = "";
  for (let c = l.length - 1; c >= 0; c -= 1) {
    const g = l[c], {
      modifiers: p,
      hasImportantModifier: $,
      baseClassName: y,
      maybePostfixModifierPosition: P
    } = n(g);
    let L = !!P, S = r(L ? y.substring(0, P) : y);
    if (!S) {
      if (!L) {
        m = g + (m.length > 0 ? " " + m : m);
        continue;
      }
      if (S = r(y), !S) {
        m = g + (m.length > 0 ? " " + m : m);
        continue;
      }
      L = !1;
    }
    const x = Sr(p).join(":"), k = $ ? x + At : x, C = k + S;
    if (a.includes(C))
      continue;
    a.push(C);
    const re = i(S, L);
    for (let W = 0; W < re.length; ++W) {
      const B = re[W];
      a.push(k + B);
    }
    m = g + (m.length > 0 ? " " + m : m);
  }
  return m;
};
function Ar() {
  let e = 0, t, n, r = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (n = Pt(t)) && (r && (r += " "), r += n);
  return r;
}
const Pt = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = Pt(e[r])) && (n && (n += " "), n += t);
  return n;
};
function Pr(e, ...t) {
  let n, r, i, a = l;
  function l(c) {
    const g = t.reduce((p, $) => $(p), e());
    return n = Tr(g), r = n.cache.get, i = n.cache.set, a = m, m(c);
  }
  function m(c) {
    const g = r(c);
    if (g)
      return g;
    const p = _r(c, n);
    return i(c, p), p;
  }
  return function() {
    return a(Ar.apply(null, arguments));
  };
}
const N = (e) => {
  const t = (n) => n[e] || [];
  return t.isThemeGetter = !0, t;
}, Lt = /^\[(?:([a-z-]+):)?(.+)\]$/i, Lr = /^\d+\/\d+$/, Mr = /* @__PURE__ */ new Set(["px", "full", "screen"]), Er = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Rr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, zr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Ir = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, jr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Q = (e) => me(e) || Mr.has(e) || Lr.test(e), ee = (e) => he(e, "length", Vr), me = (e) => !!e && !Number.isNaN(Number(e)), De = (e) => he(e, "number", me), ge = (e) => !!e && Number.isInteger(Number(e)), Fr = (e) => e.endsWith("%") && me(e.slice(0, -1)), h = (e) => Lt.test(e), te = (e) => Er.test(e), Gr = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Or = (e) => he(e, Gr, Mt), Ur = (e) => he(e, "position", Mt), Dr = /* @__PURE__ */ new Set(["image", "url"]), Wr = (e) => he(e, Dr, Hr), Br = (e) => he(e, "", qr), ye = () => !0, he = (e, t, n) => {
  const r = Lt.exec(e);
  return r ? r[1] ? typeof t == "string" ? r[1] === t : t.has(r[1]) : n(r[2]) : !1;
}, Vr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Rr.test(e) && !zr.test(e)
), Mt = () => !1, qr = (e) => Ir.test(e), Hr = (e) => jr.test(e), Qr = () => {
  const e = N("colors"), t = N("spacing"), n = N("blur"), r = N("brightness"), i = N("borderColor"), a = N("borderRadius"), l = N("borderSpacing"), m = N("borderWidth"), c = N("contrast"), g = N("grayscale"), p = N("hueRotate"), $ = N("invert"), y = N("gap"), P = N("gradientColorStops"), L = N("gradientColorStopPositions"), S = N("inset"), x = N("margin"), k = N("opacity"), C = N("padding"), re = N("saturate"), W = N("scale"), B = N("sepia"), ze = N("skew"), pe = N("space"), _ = N("translate"), V = () => ["auto", "contain", "none"], M = () => ["auto", "hidden", "clip", "visible", "scroll"], X = () => ["auto", h, t], w = () => [h, t], se = () => ["", Q, ee], G = () => ["auto", me, h], we = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], O = () => ["solid", "dashed", "dotted", "double", "none"], Y = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], j = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], A = () => ["", "0", h], fe = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], E = () => [me, h];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [ye],
      spacing: [Q, ee],
      blur: ["none", "", te, h],
      brightness: E(),
      borderColor: [e],
      borderRadius: ["none", "", "full", te, h],
      borderSpacing: w(),
      borderWidth: se(),
      contrast: E(),
      grayscale: A(),
      hueRotate: E(),
      invert: A(),
      gap: w(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Fr, ee],
      inset: X(),
      margin: X(),
      opacity: E(),
      padding: w(),
      saturate: E(),
      scale: E(),
      sepia: A(),
      skew: E(),
      space: w(),
      translate: w()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", h]
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
        columns: [te]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": fe()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": fe()
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
        object: [...we(), h]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: M()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": M()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": M()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: V()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": V()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": V()
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
        z: ["auto", ge, h]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: X()
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
        flex: ["1", "auto", "initial", "none", h]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: A()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: A()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", ge, h]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [ye]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", ge, h]
        }, h]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": G()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": G()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [ye]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [ge, h]
        }, h]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": G()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": G()
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
        "auto-cols": ["auto", "min", "max", "fr", h]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", h]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [y]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [y]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [y]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...j()]
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
        content: ["normal", ...j(), "baseline"]
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
        "place-content": [...j(), "baseline"]
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
        p: [C]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [C]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [C]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [C]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [C]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [C]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [C]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [C]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [C]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [x]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [x]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [x]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [x]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [x]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [x]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [x]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [x]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [x]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [pe]
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
        "space-y": [pe]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", h, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [h, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [h, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [te]
        }, te]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [h, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [h, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [h, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [h, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", te, ee]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", De]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [ye]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", h]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", me, De]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Q, h]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", h]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", h]
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
        "placeholder-opacity": [k]
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
        "text-opacity": [k]
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
        decoration: [...O(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Q, ee]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Q, h]
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
        indent: w()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", h]
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
        content: ["none", h]
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
        "bg-opacity": [k]
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
        bg: [...we(), Ur]
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
        bg: ["auto", "cover", "contain", Or]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Wr]
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
        from: [P]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [P]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [P]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [a]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [a]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [a]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [a]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [a]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [a]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [a]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [a]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [a]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [a]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [a]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [a]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [a]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [a]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [a]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [m]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [m]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [m]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [m]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [m]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [m]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [m]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [m]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [m]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [k]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...O(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [m]
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
        "divide-y": [m]
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
        "divide-opacity": [k]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: O()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [i]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [i]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [i]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [i]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [i]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [i]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [i]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [i]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [i]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [i]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...O()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Q, h]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Q, ee]
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
        ring: se()
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
        "ring-opacity": [k]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Q, ee]
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
        shadow: ["", "inner", "none", te, Br]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [ye]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [k]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Y(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Y()
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
        blur: [n]
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
        contrast: [c]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", te, h]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [g]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [p]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [$]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [re]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [B]
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
        "backdrop-blur": [n]
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
        "backdrop-contrast": [c]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [g]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [p]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [$]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [k]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [re]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [B]
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
        "border-spacing": [l]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [l]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [l]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", h]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: E()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", h]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: E()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", h]
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
        scale: [W]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [W]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [W]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [ge, h]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [_]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [_]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [ze]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [ze]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", h]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", h]
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
        "scroll-m": w()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": w()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": w()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": w()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": w()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": w()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": w()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": w()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": w()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": w()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": w()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": w()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": w()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": w()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": w()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": w()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": w()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": w()
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
        "will-change": ["auto", "scroll", "contents", "transform", h]
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
        stroke: [Q, ee, De]
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
}, Jr = /* @__PURE__ */ Pr(Qr);
function D(...e) {
  return Jr(gr(e));
}
const Xr = "copanel_mobile_desktop_site";
function Yr() {
  try {
    return localStorage.getItem(Xr) === "1";
  } catch {
    return !1;
  }
}
function Qe(e = window.innerWidth) {
  return Yr() || e >= 1024;
}
const Zr = Ct(null);
function Et() {
  return St(Zr);
}
function Rt() {
  return Et()?.isWindowed === !0;
}
function Kr({ children: e, className: t, constrained: n = !1 }) {
  const { theme: r } = Ke(), i = Rt(), a = r === "dark", l = !i && !Qe();
  return /* @__PURE__ */ s(
    "div",
    {
      className: D(
        "flex flex-col transition-colors duration-200",
        i ? "h-full min-h-0" : l ? "min-h-0" : "min-h-screen",
        a ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !i && n && "mx-auto max-w-7xl",
        t
      ),
      children: e
    }
  );
}
function en({
  isDark: e,
  sidebar: t,
  children: n,
  mobileTitle: r,
  className: i
}) {
  const a = Rt(), [l, m] = f(!1), [c, g] = f(() => Qe());
  J(() => {
    const y = () => g(Qe());
    return window.addEventListener("resize", y), () => window.removeEventListener("resize", y);
  }, []);
  const p = !a && !c;
  J(() => {
    c && m(!1);
  }, [c]);
  const $ = () => m(!1);
  return p ? /* @__PURE__ */ d("div", { className: D("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", i), children: [
    /* @__PURE__ */ d(
      "div",
      {
        className: D(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2.5",
          e ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white"
        ),
        children: [
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              onClick: () => m(!0),
              className: D(
                "inline-flex items-center justify-center rounded-lg p-2",
                e ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ s(b.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          r ? /* @__PURE__ */ s("span", { className: D("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: r }) : null
        ]
      }
    ),
    l ? /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: $
      }
    ) : null,
    /* @__PURE__ */ s(
      "div",
      {
        className: D(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          l ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: $,
        children: t
      }
    ),
    /* @__PURE__ */ s("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: n })
  ] }) : /* @__PURE__ */ d("div", { className: D("flex h-full min-h-0 flex-1 overflow-hidden", i), children: [
    t,
    /* @__PURE__ */ s("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: n })
  ] });
}
const tn = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function We({
  open: e,
  onClose: t,
  children: n,
  title: r,
  className: i,
  maxWidth: a = "lg",
  closeOnBackdropClick: l = !0
}) {
  const { theme: m } = Ke(), c = m === "dark", g = Et(), p = Tt(null), [$, y] = f(null);
  ur(() => {
    if (g?.isWindowed) return;
    const C = p.current?.closest(".module-window-viewport");
    y(C instanceof HTMLElement ? C : null);
  }, [g?.isWindowed, e]);
  const P = /* @__PURE__ */ s("span", { ref: p, hidden: !0, "aria-hidden": "true" });
  if (!e) return P;
  const L = !!(g?.isWindowed || $), S = /* @__PURE__ */ s(
    "div",
    {
      className: D(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        L ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: l ? t : void 0,
      children: /* @__PURE__ */ d(
        "div",
        {
          className: D(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            tn[a],
            c ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            i
          ),
          onClick: (C) => C.stopPropagation(),
          children: [
            r && /* @__PURE__ */ d(
              "div",
              {
                className: D(
                  "flex items-center justify-between border-b px-4 py-3",
                  c ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ s("h3", { className: "text-sm font-bold", children: r }),
                  /* @__PURE__ */ s("button", { type: "button", onClick: t, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ s(b.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            n
          ]
        }
      )
    }
  ), x = (g?.isWindowed ? g.viewportRef.current : null) || $ || document.body, k = hr(S, x);
  return /* @__PURE__ */ d(kt, { children: [
    P,
    k
  ] });
}
class yt extends Error {
  constructor(n, r, i, a) {
    super(r);
    F(this, "code");
    F(this, "status");
    F(this, "details");
    this.code = n, this.status = i, this.details = a;
  }
}
async function T(e, t = {}) {
  const n = typeof window < "u" ? localStorage.getItem("copanel_token") : null, r = {
    "Content-Type": "application/json",
    ...t.headers || {}
  };
  n && (r.Authorization = `Bearer ${n}`);
  const i = {
    method: t.method || "GET",
    headers: r,
    signal: t.signal
  };
  t.body !== void 0 && (i.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body));
  const a = await fetch(e, i);
  let l = null;
  const m = await a.text();
  if (m)
    try {
      l = JSON.parse(m);
    } catch {
      l = m;
    }
  if (t.raw)
    return l;
  if (!a.ok) {
    const c = l && typeof l == "object" && l.error ? l.error : { code: `HTTP_${a.status}`, message: typeof l == "string" ? l : l?.detail || a.statusText };
    throw new yt(c.code || `HTTP_${a.status}`, c.message || "Request failed", a.status, c.details);
  }
  if (l && typeof l == "object" && "status" in l) {
    if (l.status === "success")
      return l.data !== void 0 ? l.data : l;
    if (l.status === "error" && l.error)
      throw new yt(l.error.code, l.error.message, a.status, l.error.details);
  }
  return l;
}
const zt = "copanel-session-expired", rn = /* @__PURE__ */ new Set([
  "/api/auth/login",
  "/api/panel_settings/branding/public"
]);
function nn(e) {
  try {
    const t = typeof e == "string" ? e : e instanceof URL ? e.href : String(e.url || "");
    return (t.startsWith("http://") || t.startsWith("https://") ? new URL(t) : new URL(t, "http://localhost")).pathname;
  } catch {
    return "";
  }
}
function sn(e) {
  if (!e) return !1;
  for (const t of rn)
    if (e === t || e.startsWith(`${t}/`)) return !0;
  return !1;
}
function on() {
  typeof window > "u" || window.dispatchEvent(new CustomEvent(zt));
}
function ue() {
  return typeof localStorage > "u" ? null : localStorage.getItem("copanel_token");
}
function an(e) {
  const t = {};
  e && new Headers(e).forEach((i, a) => {
    t[a] = i;
  });
  const n = ue();
  return n && (t.Authorization = `Bearer ${n}`), t;
}
function ln(e, t = {}) {
  const n = an(t.headers);
  return fetch(e, { ...t, headers: n }).then((r) => (r.status === 401 && !sn(nn(e)) && on(), r));
}
async function cn() {
  if (!ue()) return null;
  try {
    const e = await ln("/api/auth/stream-ticket", { method: "POST" });
    if (e.status === 401 || !e.ok) return null;
    const t = await e.json();
    return typeof t?.ticket == "string" ? t.ticket : null;
  } catch {
    return null;
  }
}
const dn = "copanel-platform-sse-degraded", xe = 2e3, un = 6e4, mn = 3;
class hn {
  constructor() {
    F(this, "source", null);
    F(this, "handlers", /* @__PURE__ */ new Map());
    F(this, "retryDelay", xe);
    F(this, "retryTimer", null);
    F(this, "failureCount", 0);
    F(this, "connecting", !1);
    F(this, "authFailed", !1);
  }
  on(t, n) {
    let r = this.handlers.get(t);
    return r || (r = /* @__PURE__ */ new Set(), this.handlers.set(t, r)), r.add(n), this.ensureConnected(), () => {
      r.delete(n), r.size === 0 && this.handlers.delete(t), this.teardownIfIdle();
    };
  }
  emit(t, n) {
    const r = this.handlers.get(t);
    r && r.forEach((i) => {
      try {
        i(n);
      } catch (a) {
        console.error("event handler failed", t, a);
      }
    });
  }
  async buildUrl() {
    if (!ue()) return null;
    const t = await cn();
    return t ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      ticket: t
    }).toString()}` : null;
  }
  ensureConnected() {
    this.authFailed || this.source || this.connecting || typeof document < "u" && document.hidden || ue() && (this.connecting = !0, this.buildUrl().then((t) => {
      if (this.connecting = !1, !(this.source || this.handlers.size === 0)) {
        if (!t) {
          if (!ue()) {
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
      this.failureCount = 0, this.retryDelay = xe;
    }), this.source.addEventListener("jobs", (n) => {
      this.onStreamMessage(), this.parseAndEmit("jobs", n.data);
    }), this.source.addEventListener("notifications", (n) => {
      this.onStreamMessage(), this.parseAndEmit("notifications", n.data);
    }), this.source.addEventListener("message", () => {
      this.onStreamMessage();
    }), this.source.onerror = () => {
      this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= mn && window.dispatchEvent(new CustomEvent(dn)), this.scheduleRetry();
    };
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = xe;
  }
  parseAndEmit(t, n) {
    try {
      const r = JSON.parse(n);
      this.emit(t, r.payload || r);
    } catch {
    }
  }
  scheduleRetry() {
    if (this.retryTimer || this.handlers.size === 0) return;
    const t = this.retryDelay;
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), un), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = xe);
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
    this.authFailed = !1, this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = xe, this.handlers.size > 0 && ue() && this.ensureConnected();
  }
}
const Re = new hn();
function pn() {
  Re.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || pn();
});
typeof window < "u" && window.addEventListener(zt, () => {
  Re.stop();
});
function It(e) {
  let t = e;
  const n = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (r) => {
      const i = typeof r == "function" ? r(t) : r;
      if (!i || Object.keys(i).length === 0) return;
      let a = !1;
      for (const l of Object.keys(i))
        if (t[l] !== i[l]) {
          a = !0;
          break;
        }
      a && (t = { ...t, ...i }, n.forEach((l) => l()));
    },
    subscribe: (r) => (n.add(r), () => n.delete(r))
  };
}
const jt = It({ jobs: {}, order: [], lastFetch: 0 });
function fn() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function xt(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function de(e, t, n) {
  if (!e || typeof e != "object") return;
  const r = xt(e[t], n);
  if (r) return r;
  const i = xt(e[`${t}_i18n`], n);
  if (i) return i;
  const a = e[`${t}_${n}`];
  if (typeof a == "string" && a) return a;
  const l = e[`${t}_en`];
  if (typeof l == "string" && l) return l;
  const m = e[`${t}_vi`];
  if (typeof m == "string" && m) return m;
}
function bn(e) {
  const t = fn(), n = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: de(e, "title", t) || de(n, "title", t) || e?.title || "",
    message: de(e, "message", t) || de(n, "message", t) || e?.message,
    error: de(e, "error", t) || de(n, "error", t) || e?.error || null
  };
}
function wt(e) {
  const t = bn(e);
  jt.setState((n) => {
    const r = { ...n.jobs, [t.id]: { ...n.jobs[t.id], ...t } };
    let i = n.order;
    return i.includes(t.id) || (i = [t.id, ...i].slice(0, 200)), { jobs: r, order: i };
  });
}
Re.on("jobs", (e) => {
  if (e?.job) {
    wt(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = jt.getState().jobs[e.job_id];
    t && wt({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const Je = It({ inbox: [], unread: 0, toasts: [] }), gn = 6e3;
function yn() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function vt(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function Pe(e, t, n) {
  if (!e || typeof e != "object") return;
  const r = vt(e[t], n);
  if (r) return r;
  const i = vt(e[`${t}_i18n`], n);
  if (i) return i;
  const a = e[`${t}_${n}`];
  if (typeof a == "string" && a) return a;
  const l = e[`${t}_en`];
  if (typeof l == "string" && l) return l;
  const m = e[`${t}_vi`];
  if (typeof m == "string" && m) return m;
}
function xn(e) {
  const t = yn(), n = e?.payload && typeof e.payload == "object" ? e.payload : {}, r = Pe(e, "title", t) || Pe(n, "title", t) || e?.title || "", i = Pe(e, "body", t) || Pe(n, "body", t) || e?.body || null;
  return {
    ...e,
    title: r,
    body: i
  };
}
function wn(e) {
  Je.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    Je.setState((t) => ({ toasts: t.toasts.filter((n) => n.id !== e.id) }));
  }, gn);
}
Re.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = xn(e.notification);
    wn({ ...t, ephemeral: !0 }), Je.setState((n) => ({
      inbox: [t, ...n.inbox].slice(0, 200),
      unread: n.unread + 1
    }));
  }
});
function vn(e) {
  if (!e || e < 0) return "—";
  const t = ["B", "KB", "MB", "GB"];
  let n = e, r = 0;
  for (; n >= 1024 && r < t.length - 1; )
    n /= 1024, r += 1;
  return `${n.toFixed(r === 0 ? 0 : 1)} ${t[r]}`;
}
function Be(e) {
  if (!e || !Number.isFinite(e)) return "0:00";
  const t = Math.floor(e / 60), n = Math.floor(e % 60);
  return `${t}:${n.toString().padStart(2, "0")}`;
}
const Me = "/api/audio_station/stream", Ee = "/api/audio_station/cover", tt = {}, Ve = {}, Xe = /* @__PURE__ */ new Set();
function Ft(e) {
  const t = Ve[e];
  if (t) return t;
  const n = (async () => {
    try {
      const r = localStorage.getItem("copanel_token") || "", i = await fetch("/api/auth/media-token", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...r ? { Authorization: `Bearer ${r}` } : {} },
        body: JSON.stringify({ scope: e })
      }), a = i.ok ? await i.json() : null;
      if (a && typeof a.token == "string") {
        const l = Number(a.expires_in) || 3600;
        return tt[e] = { token: a.token, exp: Date.now() + l * 1e3 }, Xe.forEach((m) => m()), a.token;
      }
    } catch {
    } finally {
      Ve[e] = void 0;
    }
    return "";
  })();
  return Ve[e] = n, n;
}
function Ye(e) {
  const t = tt[e];
  return (!t || t.exp - Date.now() < 10 * 60 * 1e3) && Ft(e), t && t.exp > Date.now() ? t.token : "";
}
async function Ze(e) {
  const t = tt[e];
  return t && t.exp - Date.now() > 60 * 1e3 ? t.token : Ft(e);
}
function Gt() {
  const [e, t] = f(0);
  return J(() => {
    const n = () => t((i) => i + 1);
    Xe.add(n), Ze(Ee), Ze(Me);
    const r = setInterval(() => {
      Ye(Ee), Ye(Me);
    }, 5 * 60 * 1e3);
    return () => {
      Xe.delete(n), clearInterval(r);
    };
  }, []), e;
}
async function Nn(e) {
  const t = new URLSearchParams({ path: e, media_token: await Ze(Me) });
  return `${Me}?${t.toString()}`;
}
function Le(e) {
  if (!e.hash && !e.id && !e.path) return null;
  const t = Ye(Ee);
  if (!t) return null;
  const n = new URLSearchParams({ media_token: t });
  return e.hash ? n.set("hash", e.hash) : e.id ? n.set("id", e.id) : e.path && n.set("path", e.path), `${Ee}?${n.toString()}`;
}
function Nt(e) {
  if (typeof window > "u") return;
  const t = e.currentTrack?.name?.trim(), n = t ? e.playing ? "playing" : "paused" : null, r = t ? e.playing ? `▶ ${t}` : `⏸ ${t}` : "Audio Player";
  window.dispatchEvent(
    new CustomEvent("copanel:module-activity", {
      detail: {
        modulePath: "/audio-player",
        playing: e.playing,
        playbackState: n,
        trackName: t,
        title: r
      }
    })
  );
}
function qe({
  track: e,
  album: t,
  className: n = "w-10 h-10"
}) {
  Gt();
  const r = Le({ hash: t?.cover_hash || e?.cover_hash || void 0 }) || (e?.path ? Le({ path: e.path }) : null) || (e?.id ? Le({ id: e.id }) : null);
  return r ? /* @__PURE__ */ s("img", { src: r, alt: "", className: `${n} rounded object-cover shrink-0 bg-slate-200` }) : /* @__PURE__ */ s("div", { className: `${n} rounded bg-teal-500/10 flex items-center justify-center shrink-0`, children: /* @__PURE__ */ s(b.Disc, { className: "w-5 h-5 text-teal-500/50" }) });
}
function _n() {
  const { theme: e, language: t } = Ke();
  Gt();
  const n = e === "dark", r = Ue(
    () => t === "vi" ? {
      title: "Audio Player",
      subtitle: "Thư viện nhạc — duyệt thư mục & phát nhạc",
      search: "Tìm nhạc…",
      settings: "Cài đặt",
      home: "Trang chủ",
      myMusic: "NHẠC CỦA TÔI",
      allMusic: "Tất cả nhạc",
      byFolder: "Theo thư mục",
      byAlbum: "Theo album",
      byArtist: "Theo nghệ sĩ",
      byGenre: "Theo thể loại",
      comingSoon: "Cần quét thư viện — sắp có",
      noFiles: "Không có file nhạc trong thư mục này.",
      noFolders: "Chưa có thư mục nhạc.",
      colTitle: "Tiêu đề",
      colAlbum: "Album",
      colArtist: "Nghệ sĩ",
      colDuration: "Thời lượng",
      libraryRoots: "Thư mục nhạc",
      addRoot: "Thêm thư mục",
      browse: "Duyệt",
      scanNow: "Quét thư viện",
      scanOnStartup: "Tự quét khi khởi động",
      save: "Lưu",
      cancel: "Hủy",
      selectFolder: "Chọn thư mục",
      useThisFolder: "Chọn thư mục này",
      tracks: "bài",
      albums: "album",
      artists: "nghệ sĩ",
      scanning: "Đang quét…",
      scanDone: "Quét xong",
      scanError: "Lỗi quét",
      play: "Phát",
      pause: "Tạm dừng",
      next: "Tiếp",
      prev: "Trước",
      queue: "Hàng đợi",
      emptyQueue: "Hàng đợi trống",
      openFolder: "Mở thư mục",
      statsHint: "Quét thư viện để nhóm theo album/nghệ sĩ.",
      noLibrary: "Chưa có nhạc trong thư viện. Bấm Quét thư viện.",
      back: "Quay lại",
      songs: "bài hát",
      indexed: "đã index",
      playlists: "PLAYLIST",
      recentlyAdded: "Mới thêm",
      random100: "Ngẫu nhiên 100",
      newPlaylist: "Tạo playlist",
      playlistName: "Tên playlist",
      deletePlaylist: "Xóa playlist",
      addToPlaylist: "Thêm vào playlist"
    } : {
      title: "Audio Player",
      subtitle: "Music library — browse folders and play tracks",
      search: "Search music…",
      settings: "Settings",
      home: "Home",
      myMusic: "MY MUSIC",
      allMusic: "All Music",
      byFolder: "By Folder",
      byAlbum: "By Album",
      byArtist: "By Artist",
      byGenre: "By Genre",
      comingSoon: "Requires library scan — coming in v0.2",
      noFiles: "No audio files in this folder.",
      noFolders: "No music folders yet.",
      colTitle: "Title",
      colAlbum: "Album",
      colArtist: "Artist",
      colDuration: "Duration",
      libraryRoots: "Music folders",
      addRoot: "Add folder",
      browse: "Browse",
      scanNow: "Scan library",
      scanOnStartup: "Scan on startup",
      save: "Save",
      cancel: "Cancel",
      selectFolder: "Select folder",
      useThisFolder: "Use this folder",
      tracks: "tracks",
      albums: "albums",
      artists: "artists",
      scanning: "Scanning…",
      scanDone: "Scan complete",
      scanError: "Scan error",
      play: "Play",
      pause: "Pause",
      next: "Next",
      prev: "Previous",
      queue: "Queue",
      emptyQueue: "Queue is empty",
      openFolder: "Open folder",
      statsHint: "Scan library to group by album/artist.",
      noLibrary: "No music in library yet. Run Scan library.",
      back: "Back",
      songs: "songs",
      indexed: "indexed",
      playlists: "PLAYLIST",
      recentlyAdded: "Recently Added",
      random100: "Random 100",
      newPlaylist: "New playlist",
      playlistName: "Playlist name",
      deletePlaylist: "Delete playlist",
      addToPlaylist: "Add to playlist"
    },
    [t]
  ), i = n ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900", a = n ? "text-slate-400" : "text-slate-500", l = n ? "hover:bg-slate-800" : "hover:bg-slate-50", m = n ? "bg-teal-900/40 text-teal-300" : "bg-teal-50 text-teal-700", [c, g] = f("folder"), [p, $] = f(null), [y, P] = f(null), [L, S] = f(!0), [x, k] = f(null), [C, re] = f(""), [W, B] = f(!1), [ze, pe] = f(null), [_, V] = f(null), [M, X] = f(null), [w, se] = f(null), [G, we] = f([]), [O, Y] = f(0), [j, A] = f(!1), [fe, E] = f(0), [rt, Ot] = f(0), [nt, Ut] = f(!1), R = Tt(null), [q, ne] = f([]), [st, Dt] = f([]), [ot, Wt] = f([]), [at, Bt] = f([]), [lt, Vt] = f([]), [H, ve] = f(null), [Z, Ne] = f(null), [K, be] = f(null), [U, ke] = f(null), [it, qt] = f([]), [Ie, Ht] = f([]), [Qt, Ce] = f(!1), [ct, dt] = f(""), [Se, ut] = f(!1), z = G[O] || null, oe = ce(async (o = "") => {
    try {
      const u = await T(`/api/audio_station/browse?path=${encodeURIComponent(o)}`);
      $(u), k(null);
    } catch (u) {
      k(u.message);
    }
  }, []), ae = ce(async () => {
    try {
      const o = await T("/api/audio_station/library/stats");
      P(o);
    } catch {
    }
  }, []), Te = ce(async () => {
    if (c === "folder" || c === "home") return;
    ut(!0), k(null);
    const o = C.trim();
    try {
      if (c === "all") {
        const u = await T(
          `/api/audio_station/library/tracks?q=${encodeURIComponent(o)}&limit=1000`
        );
        ne(u.items || []);
      } else if (c === "recent") {
        const u = await T("/api/audio_station/library/recent?limit=100");
        ne(u.items || []);
      } else if (c === "random") {
        const u = await T("/api/audio_station/library/random?limit=100");
        ne(u.items || []);
      } else if (c === "playlist" && U) {
        const u = await T(
          `/api/audio_station/playlists/${encodeURIComponent(U.id)}/tracks`
        );
        ne(u.items || []);
      } else if (c === "album")
        if (H) {
          const u = await T(
            `/api/audio_station/library/albums/${encodeURIComponent(H.key)}/tracks`
          );
          ne(u.items || []);
        } else {
          const u = await T(
            `/api/audio_station/library/albums?q=${encodeURIComponent(o)}`
          );
          Dt(u.items || []);
        }
      else if (c === "artist")
        if (Z) {
          const u = await T(
            `/api/audio_station/library/artists/${encodeURIComponent(Z)}/tracks`
          );
          ne(u.items || []);
        } else {
          const u = await T(
            `/api/audio_station/library/artists?q=${encodeURIComponent(o)}`
          );
          Wt(u.items || []);
        }
      else if (c === "genre")
        if (K) {
          const u = await T(
            `/api/audio_station/library/genres/${encodeURIComponent(K)}/tracks`
          );
          ne(u.items || []);
        } else {
          const u = await T(
            `/api/audio_station/library/genres?q=${encodeURIComponent(o)}`
          );
          Bt(u.items || []);
        }
    } catch (u) {
      k(u.message);
    } finally {
      ut(!1);
    }
  }, [c, C, H, Z, K, U]), le = ce(async () => {
    try {
      const o = await T("/api/audio_station/playlists");
      qt(o.items || []);
    } catch {
    }
  }, []), $e = ce(async () => {
    try {
      const o = await T("/api/audio_station/library/recent?limit=8");
      Ht(o.items || []);
    } catch {
    }
  }, []), _e = ce(async () => {
    try {
      const o = await T("/api/audio_station/library/top-genres");
      Vt(o || []);
    } catch {
    }
  }, []);
  J(() => {
    (async () => (S(!0), await Promise.all([oe(""), ae(), _e(), le(), $e()]), S(!1)))();
  }, [oe, ae, _e, le, $e]), J(() => {
    Te();
  }, [Te]), J(() => {
    if (y?.scan.status !== "running") {
      c !== "folder" && c !== "home" && Te(), _e(), le(), $e();
      return;
    }
    const o = setInterval(() => {
      ae();
    }, 2e3);
    return () => clearInterval(o);
  }, [y?.scan.status, c, ae, Te, _e, le, $e]), J(() => {
    if (!R.current || !z) return;
    let u = !1;
    const v = z.path;
    return Nn(v).then((I) => {
      u || !R.current || (R.current.src = I, R.current.load(), j && R.current.play().catch(() => A(!1)));
    }), () => {
      u = !0;
    };
  }, [z?.path]), J(() => {
    const o = R.current;
    o && (j ? o.play().catch(() => A(!1)) : o.pause());
  }, [j]), J(() => (Nt({ playing: j, currentTrack: z }), () => {
    Nt({ playing: !1, currentTrack: null });
  }), [j, z?.path]);
  function je(o, u = 0) {
    o.length && (we(o), Y(u), A(!0));
  }
  function Fe(o, u = 0) {
    je(
      o.map((v) => ({ name: v.title || v.path, path: v.path })),
      u
    );
  }
  function Ge(o, u) {
    const v = u.findIndex((I) => I.path === o.path);
    Fe(u, v >= 0 ? v : 0);
  }
  function mt(o) {
    if (!p) return;
    const u = p.files.map((I) => ({ name: I.name, path: I.path })), v = u.findIndex((I) => I.path === o.path);
    je(u, v >= 0 ? v : 0);
  }
  function Jt() {
    p?.files.length && je(p.files.map((o) => ({ name: o.name, path: o.path })));
  }
  function Xt() {
    O < G.length - 1 ? (Y((o) => o + 1), A(!0)) : A(!1);
  }
  function Yt() {
    O < G.length - 1 && (Y((o) => o + 1), A(!0));
  }
  function Zt() {
    const o = R.current;
    if (o && o.currentTime > 3) {
      o.currentTime = 0;
      return;
    }
    O > 0 && (Y((u) => u - 1), A(!0));
  }
  async function Kt() {
    const o = await T("/api/audio_station/settings");
    pe(o), V({ ...o, library_roots: [...o.library_roots] }), B(!0);
  }
  async function er() {
    if (!_) return;
    const o = await T("/api/audio_station/settings", {
      method: "PUT",
      body: _
    });
    pe(o), V({ ...o, library_roots: [...o.library_roots] }), B(!1), await Promise.all([oe(""), ae()]);
  }
  async function tr() {
    const o = ct.trim();
    if (!o) return;
    const u = await T("/api/audio_station/playlists", {
      method: "POST",
      body: { name: o }
    });
    dt(""), Ce(!1), await le(), ke(u), g("playlist");
  }
  async function rr() {
    !U || U.kind === "system" || (await T(`/api/audio_station/playlists/${encodeURIComponent(U.id)}`, { method: "DELETE" }), ke(null), g("home"), await le());
  }
  function ht(o) {
    ve(null), Ne(null), be(null), ke(o), g("playlist");
  }
  function nr(o) {
    const u = it.find((v) => v.id === "__recent__");
    u ? ht(u) : g(o);
  }
  async function pt() {
    await T("/api/audio_station/library/scan", { method: "POST" }), await ae();
  }
  async function sr() {
    se("add");
    const o = await T("/api/audio_station/folders/browse");
    X(o);
  }
  async function Oe(o) {
    const u = await T(`/api/audio_station/folders/browse?path=${encodeURIComponent(o)}`);
    X(u);
  }
  function or(o) {
    !_ || w !== "add" || (_.library_roots.includes(o) || V({
      ..._,
      library_roots: [..._.library_roots, o]
    }), X(null), se(null));
  }
  function ar(o) {
    !_ || _.library_roots.length <= 1 || V({
      ..._,
      library_roots: _.library_roots.filter((u) => u !== o)
    });
  }
  const ft = Ue(() => {
    if (!p) return [];
    const o = C.trim().toLowerCase();
    return o ? p.files.filter((u) => u.name.toLowerCase().includes(o)) : p.files;
  }, [p, C]), ie = (o, u, v, I = !1) => {
    const ir = b[v];
    return /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        disabled: I,
        onClick: () => {
          I || (ve(null), Ne(null), be(null), ke(null), g(o));
        },
        className: `w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${c === o ? m : `${a} ${I ? "opacity-40 cursor-not-allowed" : l}`}`,
        children: [
          /* @__PURE__ */ s(ir, { className: "w-4 h-4 shrink-0" }),
          u
        ]
      }
    );
  }, lr = Ue(() => c === "folder" ? r.byFolder : c === "all" ? r.allMusic : c === "recent" ? r.recentlyAdded : c === "random" ? r.random100 : c === "playlist" ? U?.name || r.playlists : c === "album" ? H ? H.album : r.byAlbum : c === "artist" ? Z || r.byArtist : c === "genre" ? K || r.byGenre : r.home, [c, H, Z, K, U, r]);
  function Ae(o, u) {
    return Se ? /* @__PURE__ */ s("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ s(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : o.length ? /* @__PURE__ */ s("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ d("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ s("thead", { className: `sticky top-0 z-10 ${n ? "bg-slate-900" : "bg-white"}`, children: /* @__PURE__ */ d("tr", { className: `border-b text-left ${n ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`, children: [
        /* @__PURE__ */ s("th", { className: "px-4 py-2 font-medium", children: r.colTitle }),
        /* @__PURE__ */ s("th", { className: "px-4 py-2 font-medium hidden md:table-cell", children: r.colAlbum }),
        /* @__PURE__ */ s("th", { className: "px-4 py-2 font-medium hidden lg:table-cell", children: r.colArtist }),
        /* @__PURE__ */ s("th", { className: "px-4 py-2 font-medium w-24 text-right", children: r.colDuration })
      ] }) }),
      /* @__PURE__ */ s("tbody", { children: o.map((v) => /* @__PURE__ */ d(
        "tr",
        {
          className: `border-b cursor-pointer ${z?.path === v.path ? n ? "bg-teal-900/30" : "bg-teal-50" : l} ${n ? "border-slate-800" : "border-slate-100"}`,
          onClick: () => Ge(v, o),
          onDoubleClick: () => Ge(v, o),
          children: [
            /* @__PURE__ */ s("td", { className: "px-4 py-2", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ s(qe, { track: v, className: "w-8 h-8" }),
              /* @__PURE__ */ s("span", { className: "truncate", children: v.title })
            ] }) }),
            /* @__PURE__ */ s("td", { className: `px-4 py-2 hidden md:table-cell truncate ${a}`, children: v.album || "—" }),
            /* @__PURE__ */ s("td", { className: `px-4 py-2 hidden lg:table-cell truncate ${a}`, children: v.artist || "—" }),
            /* @__PURE__ */ s("td", { className: `px-4 py-2 text-right ${a}`, children: v.duration_sec ? Be(v.duration_sec) : "—" })
          ]
        },
        v.path
      )) })
    ] }) }) : /* @__PURE__ */ s("div", { className: `flex-1 flex items-center justify-center p-8 ${a}`, children: u });
  }
  return /* @__PURE__ */ s(Kr, { constrained: !0, children: /* @__PURE__ */ d("div", { className: `flex flex-col h-full min-h-[32rem] border rounded-lg overflow-hidden ${i}`, children: [
    /* @__PURE__ */ d("div", { className: `flex items-center gap-3 px-4 py-3 border-b shrink-0 ${n ? "border-slate-700" : "border-slate-200"}`, children: [
      /* @__PURE__ */ s(b.Music, { className: "w-6 h-6 text-teal-500" }),
      /* @__PURE__ */ d("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ s("h1", { className: "font-semibold text-lg leading-tight", children: r.title }),
        /* @__PURE__ */ s("p", { className: `text-xs ${a}`, children: r.subtitle })
      ] }),
      /* @__PURE__ */ d("div", { className: "relative hidden sm:block", children: [
        /* @__PURE__ */ s(b.Search, { className: `absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${a}` }),
        /* @__PURE__ */ s(
          "input",
          {
            value: C,
            onChange: (o) => re(o.target.value),
            placeholder: r.search,
            className: `pl-8 pr-3 py-1.5 text-sm rounded-md border w-48 lg:w-64 ${n ? "bg-slate-800 border-slate-600" : "bg-slate-50 border-slate-300"}`
          }
        )
      ] }),
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          onClick: Kt,
          className: `flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border ${n ? "border-slate-600 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-50"}`,
          children: [
            /* @__PURE__ */ s(b.Settings, { className: "w-4 h-4" }),
            r.settings
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s(
      en,
      {
        isDark: n,
        mobileTitle: r.title,
        sidebar: /* @__PURE__ */ d(
          "aside",
          {
            className: `h-full w-52 shrink-0 border-r overflow-y-auto p-3 space-y-4 ${n ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50/80"}`,
            children: [
              ie("home", r.home, "Home"),
              /* @__PURE__ */ d("div", { children: [
                /* @__PURE__ */ s("div", { className: `text-[10px] font-bold tracking-wider px-3 mb-1 ${a}`, children: r.myMusic }),
                ie("all", r.allMusic, "ListMusic"),
                ie("folder", r.byFolder, "FolderOpen"),
                ie("album", r.byAlbum, "Disc"),
                ie("artist", r.byArtist, "Mic2"),
                ie("genre", r.byGenre, "Tags")
              ] }),
              /* @__PURE__ */ d("div", { children: [
                /* @__PURE__ */ d("div", { className: "flex items-center justify-between px-3 mb-1", children: [
                  /* @__PURE__ */ s("div", { className: `text-[10px] font-bold tracking-wider ${a}`, children: r.playlists }),
                  /* @__PURE__ */ s(
                    "button",
                    {
                      type: "button",
                      onClick: () => Ce(!0),
                      className: "p-0.5 rounded hover:bg-teal-500/20 text-teal-500",
                      title: r.newPlaylist,
                      children: /* @__PURE__ */ s(b.Plus, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }),
                it.map((o) => /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    onClick: () => ht(o),
                    className: `w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${c === "playlist" && U?.id === o.id ? m : `${a} ${l}`}`,
                    children: [
                      o.kind === "system" ? /* @__PURE__ */ s(b.Clock, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ s(b.ListMusic, { className: "w-4 h-4 shrink-0" }),
                      /* @__PURE__ */ s("span", { className: "truncate", children: o.name })
                    ]
                  },
                  o.id
                ))
              ] })
            ]
          }
        ),
        children: /* @__PURE__ */ d("main", { className: "flex-1 flex flex-col min-w-0 min-h-0", children: [
          x && /* @__PURE__ */ s("div", { className: "mx-4 mt-3 px-3 py-2 text-sm rounded bg-red-500/10 text-red-500 border border-red-500/30", children: x }),
          c === "home" && /* @__PURE__ */ d("div", { className: "p-6 space-y-6 overflow-y-auto", children: [
            /* @__PURE__ */ s("h2", { className: "text-xl font-semibold", children: r.home }),
            y && /* @__PURE__ */ d("div", { className: "grid grid-cols-3 gap-4 max-w-lg", children: [
              /* @__PURE__ */ d("div", { className: `p-4 rounded-lg border ${n ? "border-slate-700" : "border-slate-200"}`, children: [
                /* @__PURE__ */ s("div", { className: "text-2xl font-bold text-teal-500", children: y.tracks }),
                /* @__PURE__ */ s("div", { className: `text-sm ${a}`, children: r.tracks })
              ] }),
              /* @__PURE__ */ d("div", { className: `p-4 rounded-lg border ${n ? "border-slate-700" : "border-slate-200"}`, children: [
                /* @__PURE__ */ s("div", { className: "text-2xl font-bold text-teal-500", children: y.albums }),
                /* @__PURE__ */ s("div", { className: `text-sm ${a}`, children: r.albums })
              ] }),
              /* @__PURE__ */ d("div", { className: `p-4 rounded-lg border ${n ? "border-slate-700" : "border-slate-200"}`, children: [
                /* @__PURE__ */ s("div", { className: "text-2xl font-bold text-teal-500", children: y.artists }),
                /* @__PURE__ */ s("div", { className: `text-sm ${a}`, children: r.artists })
              ] })
            ] }),
            /* @__PURE__ */ s("p", { className: `text-sm ${a}`, children: r.statsHint }),
            Ie.length > 0 && /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ d("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ s("h3", { className: "text-sm font-semibold", children: r.recentlyAdded }),
                /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    onClick: () => nr("recent"),
                    className: "text-xs text-teal-500 hover:underline",
                    children: r.allMusic
                  }
                )
              ] }),
              /* @__PURE__ */ s("div", { className: "space-y-1 max-w-xl", children: Ie.slice(0, 5).map((o) => /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  onClick: () => Ge(o, Ie),
                  className: `w-full flex items-center gap-3 p-2 rounded-lg text-left ${l}`,
                  children: [
                    /* @__PURE__ */ s(qe, { track: o, className: "w-10 h-10" }),
                    /* @__PURE__ */ d("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ s("div", { className: "text-sm font-medium truncate", children: o.title }),
                      /* @__PURE__ */ s("div", { className: `text-xs truncate ${a}`, children: o.artist || o.album })
                    ] })
                  ]
                },
                o.path
              )) })
            ] }),
            lt.length > 0 && /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ s("h3", { className: "text-sm font-semibold mb-2", children: r.byGenre }),
              /* @__PURE__ */ s("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-w-3xl", children: lt.map((o) => /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    be(o.name), g("genre");
                  },
                  className: `p-3 rounded-lg border text-left text-sm hover:border-teal-500 ${n ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`,
                  children: [
                    /* @__PURE__ */ s("div", { className: "font-medium truncate", children: o.name }),
                    /* @__PURE__ */ d("div", { className: `text-xs ${a}`, children: [
                      o.track_count,
                      " ",
                      r.tracks
                    ] })
                  ]
                },
                o.name
              )) })
            ] }),
            /* @__PURE__ */ d("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  onClick: () => g("folder"),
                  className: "px-4 py-2 text-sm rounded-md bg-teal-600 text-white hover:bg-teal-500",
                  children: r.byFolder
                }
              ),
              /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  onClick: pt,
                  disabled: y?.scan.status === "running",
                  className: "px-4 py-2 text-sm rounded-md border border-teal-600 text-teal-600 hover:bg-teal-500/10 disabled:opacity-50",
                  children: y?.scan.status === "running" ? r.scanning : r.scanNow
                }
              )
            ] })
          ] }),
          (c === "folder" || c === "all" || c === "album" || c === "artist" || c === "genre" || c === "recent" || c === "random" || c === "playlist") && /* @__PURE__ */ d(kt, { children: [
            /* @__PURE__ */ d(
              "div",
              {
                className: `flex items-center justify-between px-4 py-2 border-b shrink-0 ${n ? "border-slate-700" : "border-slate-200"}`,
                children: [
                  /* @__PURE__ */ d("div", { className: "flex items-center gap-2 min-w-0 flex-wrap", children: [
                    (H || Z || K) && /* @__PURE__ */ d(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          ve(null), Ne(null), be(null);
                        },
                        className: "text-sm text-teal-500 hover:underline flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ s(b.ArrowLeft, { className: "w-4 h-4" }),
                          r.back
                        ]
                      }
                    ),
                    /* @__PURE__ */ s("h2", { className: "font-semibold", children: lr }),
                    c === "folder" && p?.breadcrumbs.map((o, u) => /* @__PURE__ */ d("span", { className: "flex items-center gap-1 text-sm", children: [
                      u > 0 && /* @__PURE__ */ s("span", { className: a, children: "/" }),
                      /* @__PURE__ */ s(
                        "button",
                        {
                          type: "button",
                          onClick: () => oe(o.path),
                          className: "text-teal-500 hover:underline truncate max-w-[8rem]",
                          children: o.name
                        }
                      )
                    ] }, o.path))
                  ] }),
                  c === "folder" && p && p.files.length > 0 && /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: Jt,
                      className: "flex items-center gap-1 text-sm text-teal-600 hover:underline shrink-0",
                      children: [
                        /* @__PURE__ */ s(b.Play, { className: "w-4 h-4" }),
                        r.play
                      ]
                    }
                  ),
                  c === "all" && q.length > 0 && /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: () => Fe(q),
                      className: "flex items-center gap-1 text-sm text-teal-600 hover:underline shrink-0",
                      children: [
                        /* @__PURE__ */ s(b.Play, { className: "w-4 h-4" }),
                        r.play
                      ]
                    }
                  ),
                  (c === "recent" || c === "random" || c === "playlist") && q.length > 0 && /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: () => Fe(q),
                      className: "flex items-center gap-1 text-sm text-teal-600 hover:underline shrink-0",
                      children: [
                        /* @__PURE__ */ s(b.Play, { className: "w-4 h-4" }),
                        r.play
                      ]
                    }
                  ),
                  c === "playlist" && U?.kind === "user" && /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: rr,
                      className: "flex items-center gap-1 text-sm text-red-500 hover:underline shrink-0",
                      children: [
                        /* @__PURE__ */ s(b.Trash2, { className: "w-4 h-4" }),
                        r.deletePlaylist
                      ]
                    }
                  )
                ]
              }
            ),
            (c === "all" || c === "recent" || c === "random" || c === "playlist") && Ae(q, r.noLibrary),
            c === "album" && !H && (Se ? /* @__PURE__ */ s("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ s(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : st.length === 0 ? /* @__PURE__ */ s("div", { className: `flex-1 flex items-center justify-center p-8 ${a}`, children: r.noLibrary }) : /* @__PURE__ */ s("div", { className: "flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3", children: st.map((o) => /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => ve(o),
                className: `p-3 rounded-lg border text-left hover:border-teal-500 ${n ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`,
                children: [
                  /* @__PURE__ */ s("div", { className: `w-full aspect-square rounded mb-2 overflow-hidden ${n ? "bg-slate-800" : "bg-slate-100"}`, children: o.has_cover && o.cover_hash ? /* @__PURE__ */ s(
                    "img",
                    {
                      src: Le({ hash: o.cover_hash }) || "",
                      alt: "",
                      className: "w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ s("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ s(b.Disc, { className: "w-10 h-10 text-teal-500/60" }) }) }),
                  /* @__PURE__ */ s("div", { className: "font-medium text-sm truncate", children: o.album }),
                  /* @__PURE__ */ s("div", { className: `text-xs truncate ${a}`, children: o.album_artist || o.artist }),
                  /* @__PURE__ */ d("div", { className: `text-xs ${a}`, children: [
                    o.track_count,
                    " ",
                    r.songs
                  ] })
                ]
              },
              o.key
            )) })),
            c === "album" && H && Ae(q, r.noFiles),
            c === "artist" && !Z && (Se ? /* @__PURE__ */ s("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ s(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : ot.length === 0 ? /* @__PURE__ */ s("div", { className: `flex-1 flex items-center justify-center p-8 ${a}`, children: r.noLibrary }) : /* @__PURE__ */ s("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ s("table", { className: "w-full text-sm", children: /* @__PURE__ */ s("tbody", { children: ot.map((o) => /* @__PURE__ */ d(
              "tr",
              {
                className: `border-b cursor-pointer ${l} ${n ? "border-slate-800" : "border-slate-100"}`,
                onClick: () => Ne(o.name),
                children: [
                  /* @__PURE__ */ s("td", { className: "px-4 py-2", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ s(b.Mic2, { className: "w-4 h-4 text-teal-500" }),
                    o.name
                  ] }) }),
                  /* @__PURE__ */ s("td", { className: `px-4 py-2 text-right ${a}`, children: o.track_count })
                ]
              },
              o.name
            )) }) }) })),
            c === "artist" && Z && Ae(q, r.noFiles),
            c === "genre" && !K && (Se ? /* @__PURE__ */ s("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ s(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : at.length === 0 ? /* @__PURE__ */ s("div", { className: `flex-1 flex items-center justify-center p-8 ${a}`, children: r.noLibrary }) : /* @__PURE__ */ s("div", { className: "flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2", children: at.map((o) => /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => be(o.name),
                className: `p-3 rounded-lg border text-left hover:border-teal-500 ${n ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`,
                children: [
                  /* @__PURE__ */ s("div", { className: "font-medium truncate", children: o.name }),
                  /* @__PURE__ */ d("div", { className: `text-xs ${a}`, children: [
                    o.track_count,
                    " ",
                    r.tracks
                  ] })
                ]
              },
              o.name
            )) })),
            c === "genre" && K && Ae(q, r.noFiles),
            c === "folder" && (L && !p ? /* @__PURE__ */ s("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ s(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : /* @__PURE__ */ d("div", { className: "flex-1 overflow-y-auto", children: [
              /* @__PURE__ */ d("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ s("thead", { className: `sticky top-0 z-10 ${n ? "bg-slate-900" : "bg-white"}`, children: /* @__PURE__ */ d("tr", { className: `border-b text-left ${n ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`, children: [
                  /* @__PURE__ */ s("th", { className: "px-4 py-2 font-medium", children: r.colTitle }),
                  /* @__PURE__ */ s("th", { className: "px-4 py-2 font-medium hidden md:table-cell", children: r.colAlbum }),
                  /* @__PURE__ */ s("th", { className: "px-4 py-2 font-medium hidden lg:table-cell", children: r.colArtist }),
                  /* @__PURE__ */ s("th", { className: "px-4 py-2 font-medium w-24 text-right", children: r.colDuration })
                ] }) }),
                /* @__PURE__ */ d("tbody", { children: [
                  p?.dirs.map((o) => /* @__PURE__ */ s(
                    "tr",
                    {
                      className: `border-b cursor-pointer ${l} ${n ? "border-slate-800" : "border-slate-100"}`,
                      onDoubleClick: () => oe(o.path),
                      children: /* @__PURE__ */ s("td", { className: "px-4 py-2", colSpan: 4, children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ s(b.Folder, { className: "w-4 h-4 text-amber-500 shrink-0" }),
                        /* @__PURE__ */ s("span", { children: o.name }),
                        /* @__PURE__ */ s(
                          "button",
                          {
                            type: "button",
                            onClick: (u) => {
                              u.stopPropagation(), oe(o.path);
                            },
                            className: `ml-auto text-xs ${a} hover:text-teal-500`,
                            children: r.openFolder
                          }
                        )
                      ] }) })
                    },
                    o.path
                  )),
                  ft.map((o) => /* @__PURE__ */ d(
                    "tr",
                    {
                      className: `border-b cursor-pointer ${z?.path === o.path ? n ? "bg-teal-900/30" : "bg-teal-50" : l} ${n ? "border-slate-800" : "border-slate-100"}`,
                      onDoubleClick: () => mt(o),
                      onClick: () => mt(o),
                      children: [
                        /* @__PURE__ */ s("td", { className: "px-4 py-2", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ s(b.Music2, { className: "w-4 h-4 text-teal-500 shrink-0" }),
                          /* @__PURE__ */ s("span", { className: "truncate", children: o.name })
                        ] }) }),
                        /* @__PURE__ */ s("td", { className: `px-4 py-2 hidden md:table-cell ${a}`, children: "—" }),
                        /* @__PURE__ */ s("td", { className: `px-4 py-2 hidden lg:table-cell ${a}`, children: "—" }),
                        /* @__PURE__ */ s("td", { className: `px-4 py-2 text-right ${a}`, children: o.size ? vn(o.size) : "—" })
                      ]
                    },
                    o.path
                  ))
                ] })
              ] }),
              p && !p.dirs.length && !ft.length && /* @__PURE__ */ s("div", { className: `p-8 text-center ${a}`, children: r.noFiles })
            ] }))
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ d("div", { className: `border-t px-4 py-2 shrink-0 ${n ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"}`, children: [
      /* @__PURE__ */ s(
        "audio",
        {
          ref: R,
          onTimeUpdate: () => E(R.current?.currentTime || 0),
          onLoadedMetadata: () => Ot(R.current?.duration || 0),
          onEnded: Xt,
          onPlay: () => A(!0),
          onPause: () => A(!1)
        }
      ),
      /* @__PURE__ */ d("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ d("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ s("button", { type: "button", onClick: Zt, className: "p-2 rounded-full hover:bg-black/10", title: r.prev, children: /* @__PURE__ */ s(b.SkipBack, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              onClick: () => A((o) => !o),
              className: "p-2 rounded-full bg-teal-600 text-white hover:bg-teal-500",
              title: j ? r.pause : r.play,
              children: j ? /* @__PURE__ */ s(b.Pause, { className: "w-5 h-5" }) : /* @__PURE__ */ s(b.Play, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ s("button", { type: "button", onClick: Yt, className: "p-2 rounded-full hover:bg-black/10", title: r.next, children: /* @__PURE__ */ s(b.SkipForward, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ d("div", { className: "flex-1 min-w-0 flex items-center gap-3", children: [
          z && /* @__PURE__ */ s(
            qe,
            {
              track: q.find((o) => o.path === z.path) || { id: "", path: z.path, title: z.name, artist: "", album: "", genre: "" },
              className: "w-10 h-10 hidden sm:block"
            }
          ),
          /* @__PURE__ */ d("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ s("div", { className: "text-sm font-medium truncate", children: z?.name || "—" }),
            /* @__PURE__ */ d("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ s("span", { className: `text-xs tabular-nums ${a}`, children: Be(fe) }),
              /* @__PURE__ */ s(
                "input",
                {
                  type: "range",
                  min: 0,
                  max: rt || 0,
                  value: fe,
                  onChange: (o) => {
                    const u = Number(o.target.value);
                    R.current && (R.current.currentTime = u), E(u);
                  },
                  className: "flex-1 h-1 accent-teal-600"
                }
              ),
              /* @__PURE__ */ s("span", { className: `text-xs tabular-nums ${a}`, children: Be(rt) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            onClick: () => Ut((o) => !o),
            className: `p-2 rounded-md ${nt ? "bg-teal-600/20 text-teal-500" : l}`,
            title: r.queue,
            children: /* @__PURE__ */ s(b.ListMusic, { className: "w-5 h-5" })
          }
        )
      ] }),
      nt && /* @__PURE__ */ s("div", { className: `mt-2 max-h-32 overflow-y-auto rounded border text-sm ${n ? "border-slate-700" : "border-slate-200"}`, children: G.length === 0 ? /* @__PURE__ */ s("div", { className: `p-3 ${a}`, children: r.emptyQueue }) : G.map((o, u) => /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          onClick: () => {
            Y(u), A(!0);
          },
          className: `w-full text-left px-3 py-1.5 flex items-center gap-2 ${u === O ? n ? "bg-teal-900/40" : "bg-teal-50" : l}`,
          children: [
            /* @__PURE__ */ s("span", { className: `w-5 text-xs ${a}`, children: u + 1 }),
            /* @__PURE__ */ s("span", { className: "truncate", children: o.name })
          ]
        },
        o.path
      )) })
    ] }),
    /* @__PURE__ */ s(We, { open: Qt, onClose: () => Ce(!1), title: r.newPlaylist, children: /* @__PURE__ */ d("div", { className: "p-4", children: [
      /* @__PURE__ */ s(
        "input",
        {
          value: ct,
          onChange: (o) => dt(o.target.value),
          placeholder: r.playlistName,
          className: `w-full px-3 py-2 text-sm rounded border mb-3 ${n ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`
        }
      ),
      /* @__PURE__ */ d("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ s("button", { type: "button", onClick: () => Ce(!1), className: `px-3 py-1.5 text-sm rounded border ${n ? "border-slate-600" : "border-slate-300"}`, children: r.cancel }),
        /* @__PURE__ */ s("button", { type: "button", onClick: tr, className: "px-3 py-1.5 text-sm rounded bg-teal-600 text-white hover:bg-teal-500", children: r.save })
      ] })
    ] }) }),
    /* @__PURE__ */ s(We, { open: W && !!_, onClose: () => B(!1), title: r.settings, maxWidth: "2xl", className: "max-w-2xl", children: _ && /* @__PURE__ */ d("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ d("div", { children: [
        /* @__PURE__ */ s("label", { className: `block text-sm font-medium mb-2 ${a}`, children: r.libraryRoots }),
        /* @__PURE__ */ s("div", { className: "space-y-2", children: _.library_roots.map((o) => /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ s("code", { className: `flex-1 text-xs px-2 py-1.5 rounded border truncate ${n ? "bg-slate-800 border-slate-600" : "bg-slate-50 border-slate-300"}`, children: o }),
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              disabled: _.library_roots.length <= 1,
              onClick: () => ar(o),
              className: "p-1.5 text-red-500 hover:bg-red-500/10 rounded disabled:opacity-30",
              children: /* @__PURE__ */ s(b.Trash2, { className: "w-4 h-4" })
            }
          )
        ] }, o)) }),
        /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: sr,
            className: "mt-2 text-sm text-teal-600 hover:underline flex items-center gap-1",
            children: [
              /* @__PURE__ */ s(b.Plus, { className: "w-4 h-4" }),
              r.addRoot
            ]
          }
        )
      ] }),
      /* @__PURE__ */ d("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
        /* @__PURE__ */ s(
          "input",
          {
            type: "checkbox",
            checked: _.scan_on_startup,
            onChange: (o) => V((u) => u && { ...u, scan_on_startup: o.target.checked })
          }
        ),
        r.scanOnStartup
      ] }),
      y?.scan.status === "running" && /* @__PURE__ */ d("div", { className: `text-sm ${a} flex items-center gap-2`, children: [
        /* @__PURE__ */ s(b.Loader2, { className: "w-4 h-4 animate-spin" }),
        r.scanning,
        " (",
        y.scan.files_indexed,
        "/",
        y.scan.files_found,
        " ",
        r.indexed,
        ")"
      ] }),
      /* @__PURE__ */ d("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            onClick: pt,
            disabled: y?.scan.status === "running",
            className: "px-3 py-1.5 text-sm rounded border border-teal-600 text-teal-600 hover:bg-teal-500/10 disabled:opacity-50",
            children: r.scanNow
          }
        ),
        /* @__PURE__ */ s("div", { className: "flex-1" }),
        /* @__PURE__ */ s("button", { type: "button", onClick: () => B(!1), className: `px-3 py-1.5 text-sm rounded border ${n ? "border-slate-600" : "border-slate-300"}`, children: r.cancel }),
        /* @__PURE__ */ s("button", { type: "button", onClick: er, className: "px-3 py-1.5 text-sm rounded bg-teal-600 text-white hover:bg-teal-500", children: r.save })
      ] })
    ] }) }),
    /* @__PURE__ */ s(
      We,
      {
        open: !!M,
        onClose: () => {
          X(null), se(null);
        },
        title: r.selectFolder,
        children: M && /* @__PURE__ */ d("div", { className: "p-4", children: [
          /* @__PURE__ */ s("div", { className: `text-xs mb-2 font-mono truncate ${a}`, children: M.current }),
          /* @__PURE__ */ s("div", { className: "flex flex-wrap gap-1 mb-2", children: M.volumes.map((o) => /* @__PURE__ */ s("button", { type: "button", onClick: () => Oe(o.path), className: "text-xs px-2 py-0.5 rounded bg-teal-600/20 text-teal-600", children: o.label }, o.path)) }),
          M.parent && /* @__PURE__ */ d("button", { type: "button", onClick: () => Oe(M.parent), className: "text-sm text-teal-500 mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ s(b.ArrowUp, { className: "w-4 h-4" }),
            " .."
          ] }),
          /* @__PURE__ */ s("div", { className: `max-h-48 overflow-y-auto border rounded mb-3 ${n ? "border-slate-700" : "border-slate-200"}`, children: M.entries.map((o) => /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              onClick: () => Oe(o.path),
              className: `w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 ${l}`,
              children: [
                /* @__PURE__ */ s(b.Folder, { className: "w-4 h-4 text-amber-500" }),
                o.name
              ]
            },
            o.path
          )) }),
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              onClick: () => or(M.current),
              className: "w-full py-2 text-sm rounded bg-teal-600 text-white hover:bg-teal-500",
              children: r.useThisFolder
            }
          )
        ] })
      }
    )
  ] }) });
}
export {
  _n as default
};
