var ht = Object.defineProperty;
var ft = (e, t, r) => t in e ? ht(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var B = (e, t, r) => ft(e, typeof t != "symbol" ? t + "" : t, r);
import { jsx as n, jsxs as u, Fragment as bt } from "react/jsx-runtime";
import { createContext as Ve, useContext as Ue, useState as N, useEffect as be, useMemo as Le, useCallback as Fe } from "react";
import { useOutletContext as gt, Link as yt } from "react-router-dom";
import * as x from "lucide-react";
import { createPortal as Re } from "react-dom";
const xt = Ve(null);
function wt() {
  return Ue(xt);
}
const vt = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function _e() {
  const e = wt(), t = gt();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : vt);
}
const kt = Ve(null);
function He() {
  return Ue(kt);
}
function Te() {
  return He()?.isWindowed === !0;
}
function Xe(e) {
  var t, r, s = "";
  if (typeof e == "string" || typeof e == "number") s += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = Xe(e[t])) && (s && (s += " "), s += r);
  } else for (r in e) e[r] && (s && (s += " "), s += r);
  return s;
}
function Nt() {
  for (var e, t, r = 0, s = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = Xe(e)) && (s && (s += " "), s += t);
  return s;
}
const Pe = "-", Ct = (e) => {
  const t = _t(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: s
  } = e;
  return {
    getClassGroupId: (l) => {
      const d = l.split(Pe);
      return d[0] === "" && d.length !== 1 && d.shift(), Je(d, t) || St(l);
    },
    getConflictingClassGroupIds: (l, d) => {
      const p = r[l] || [];
      return d && s[l] ? [...p, ...s[l]] : p;
    }
  };
}, Je = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], s = t.nextPart.get(r), o = s ? Je(e.slice(1), s) : void 0;
  if (o)
    return o;
  if (t.validators.length === 0)
    return;
  const i = e.join(Pe);
  return t.validators.find(({
    validator: l
  }) => l(i))?.classGroupId;
}, $e = /^\[(.+)\]$/, St = (e) => {
  if ($e.test(e)) {
    const t = $e.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, _t = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, s = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Pt(Object.entries(e.classGroups), r).forEach(([i, l]) => {
    Ne(l, s, i, t);
  }), s;
}, Ne = (e, t, r, s) => {
  e.forEach((o) => {
    if (typeof o == "string") {
      const i = o === "" ? t : Oe(t, o);
      i.classGroupId = r;
      return;
    }
    if (typeof o == "function") {
      if (Tt(o)) {
        Ne(o(s), t, r, s);
        return;
      }
      t.validators.push({
        validator: o,
        classGroupId: r
      });
      return;
    }
    Object.entries(o).forEach(([i, l]) => {
      Ne(l, Oe(t, i), r, s);
    });
  });
}, Oe = (e, t) => {
  let r = e;
  return t.split(Pe).forEach((s) => {
    r.nextPart.has(s) || r.nextPart.set(s, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(s);
  }), r;
}, Tt = (e) => e.isThemeGetter, Pt = (e, t) => t ? e.map(([r, s]) => {
  const o = s.map((i) => typeof i == "string" ? t + i : typeof i == "object" ? Object.fromEntries(Object.entries(i).map(([l, d]) => [t + l, d])) : i);
  return [r, o];
}) : e, Mt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  const o = (i, l) => {
    r.set(i, l), t++, t > e && (t = 0, s = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(i) {
      let l = r.get(i);
      if (l !== void 0)
        return l;
      if ((l = s.get(i)) !== void 0)
        return o(i, l), l;
    },
    set(i, l) {
      r.has(i) ? r.set(i, l) : o(i, l);
    }
  };
}, Qe = "!", zt = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, s = t.length === 1, o = t[0], i = t.length, l = (d) => {
    const p = [];
    let y = 0, b = 0, _;
    for (let v = 0; v < d.length; v++) {
      let T = d[v];
      if (y === 0) {
        if (T === o && (s || d.slice(v, v + i) === t)) {
          p.push(d.slice(b, v)), b = v + i;
          continue;
        }
        if (T === "/") {
          _ = v;
          continue;
        }
      }
      T === "[" ? y++ : T === "]" && y--;
    }
    const z = p.length === 0 ? d : d.substring(b), I = z.startsWith(Qe), w = I ? z.substring(1) : z, C = _ && _ > b ? _ - b : void 0;
    return {
      modifiers: p,
      hasImportantModifier: I,
      baseClassName: w,
      maybePostfixModifierPosition: C
    };
  };
  return r ? (d) => r({
    className: d,
    parseClassName: l
  }) : l;
}, Et = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((s) => {
    s[0] === "[" ? (t.push(...r.sort(), s), r = []) : r.push(s);
  }), t.push(...r.sort()), t;
}, jt = (e) => ({
  cache: Mt(e.cacheSize),
  parseClassName: zt(e),
  ...Ct(e)
}), At = /\s+/, It = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: s,
    getConflictingClassGroupIds: o
  } = t, i = [], l = e.trim().split(At);
  let d = "";
  for (let p = l.length - 1; p >= 0; p -= 1) {
    const y = l[p], {
      modifiers: b,
      hasImportantModifier: _,
      baseClassName: z,
      maybePostfixModifierPosition: I
    } = r(y);
    let w = !!I, C = s(w ? z.substring(0, I) : z);
    if (!C) {
      if (!w) {
        d = y + (d.length > 0 ? " " + d : d);
        continue;
      }
      if (C = s(z), !C) {
        d = y + (d.length > 0 ? " " + d : d);
        continue;
      }
      w = !1;
    }
    const v = Et(b).join(":"), T = _ ? v + Qe : v, j = T + C;
    if (i.includes(j))
      continue;
    i.push(j);
    const V = o(C, w);
    for (let A = 0; A < V.length; ++A) {
      const P = V[A];
      i.push(T + P);
    }
    d = y + (d.length > 0 ? " " + d : d);
  }
  return d;
};
function Lt() {
  let e = 0, t, r, s = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = Ye(t)) && (s && (s += " "), s += r);
  return s;
}
const Ye = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let s = 0; s < e.length; s++)
    e[s] && (t = Ye(e[s])) && (r && (r += " "), r += t);
  return r;
};
function Ft(e, ...t) {
  let r, s, o, i = l;
  function l(p) {
    const y = t.reduce((b, _) => _(b), e());
    return r = jt(y), s = r.cache.get, o = r.cache.set, i = d, d(p);
  }
  function d(p) {
    const y = s(p);
    if (y)
      return y;
    const b = It(p, r);
    return o(p, b), b;
  }
  return function() {
    return i(Lt.apply(null, arguments));
  };
}
const k = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, qe = /^\[(?:([a-z-]+):)?(.+)\]$/i, Rt = /^\d+\/\d+$/, $t = /* @__PURE__ */ new Set(["px", "full", "screen"]), Ot = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Gt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Dt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Wt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Bt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, K = (e) => re(e) || $t.has(e) || Rt.test(e), X = (e) => oe(e, "length", Yt), re = (e) => !!e && !Number.isNaN(Number(e)), ve = (e) => oe(e, "number", re), de = (e) => !!e && Number.isInteger(Number(e)), Kt = (e) => e.endsWith("%") && re(e.slice(0, -1)), f = (e) => qe.test(e), J = (e) => Ot.test(e), Vt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Ut = (e) => oe(e, Vt, Ze), Ht = (e) => oe(e, "position", Ze), Xt = /* @__PURE__ */ new Set(["image", "url"]), Jt = (e) => oe(e, Xt, Zt), Qt = (e) => oe(e, "", qt), ue = () => !0, oe = (e, t, r) => {
  const s = qe.exec(e);
  return s ? s[1] ? typeof t == "string" ? s[1] === t : t.has(s[1]) : r(s[2]) : !1;
}, Yt = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Gt.test(e) && !Dt.test(e)
), Ze = () => !1, qt = (e) => Wt.test(e), Zt = (e) => Bt.test(e), er = () => {
  const e = k("colors"), t = k("spacing"), r = k("blur"), s = k("brightness"), o = k("borderColor"), i = k("borderRadius"), l = k("borderSpacing"), d = k("borderWidth"), p = k("contrast"), y = k("grayscale"), b = k("hueRotate"), _ = k("invert"), z = k("gap"), I = k("gradientColorStops"), w = k("gradientColorStopPositions"), C = k("inset"), v = k("margin"), T = k("opacity"), j = k("padding"), V = k("saturate"), A = k("scale"), P = k("sepia"), Q = k("skew"), S = k("space"), ne = k("translate"), L = () => ["auto", "contain", "none"], se = () => ["auto", "hidden", "clip", "visible", "scroll"], W = () => ["auto", f, t], g = () => [f, t], ae = () => ["", K, X], c = () => ["auto", re, f], E = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Y = () => ["solid", "dashed", "dotted", "double", "none"], q = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], le = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], G = () => ["", "0", f], ie = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], $ = () => [re, f];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [ue],
      spacing: [K, X],
      blur: ["none", "", J, f],
      brightness: $(),
      borderColor: [e],
      borderRadius: ["none", "", "full", J, f],
      borderSpacing: g(),
      borderWidth: ae(),
      contrast: $(),
      grayscale: G(),
      hueRotate: $(),
      invert: G(),
      gap: g(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Kt, X],
      inset: W(),
      margin: W(),
      opacity: $(),
      padding: g(),
      saturate: $(),
      scale: $(),
      sepia: G(),
      skew: $(),
      space: g(),
      translate: g()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", f]
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
        columns: [J]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": ie()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": ie()
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
        object: [...E(), f]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: se()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": se()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": se()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: L()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": L()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": L()
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
        inset: [C]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [C]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [C]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [C]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [C]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [C]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [C]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [C]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [C]
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
        z: ["auto", de, f]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: W()
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
        flex: ["1", "auto", "initial", "none", f]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: G()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: G()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", de, f]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [ue]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", de, f]
        }, f]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": c()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": c()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [ue]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [de, f]
        }, f]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": c()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": c()
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
        "auto-cols": ["auto", "min", "max", "fr", f]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", f]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [z]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [z]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [z]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...le()]
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
        content: ["normal", ...le(), "baseline"]
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
        "place-content": [...le(), "baseline"]
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
        p: [j]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [j]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [j]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [j]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [j]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [j]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [j]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [j]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [j]
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
        "space-x": [S]
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
        "space-y": [S]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", f, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [f, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [f, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [J]
        }, J]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [f, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [f, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [f, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [f, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", J, X]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", ve]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [ue]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", f]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", re, ve]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", K, f]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", f]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", f]
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
        decoration: [...Y(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", K, X]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", K, f]
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
        indent: g()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", f]
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
        content: ["none", f]
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
        bg: [...E(), Ht]
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
        bg: ["auto", "cover", "contain", Ut]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Jt]
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
        from: [w]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [w]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [w]
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
        rounded: [i]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [i]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [i]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [i]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [i]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [i]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [i]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [i]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [i]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [i]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [i]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [i]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [i]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [i]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [i]
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
        border: [...Y(), "hidden"]
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
        divide: Y()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [o]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [o]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [o]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [o]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [o]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [o]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [o]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [o]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [o]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [o]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...Y()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [K, f]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [K, X]
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
        ring: ae()
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
        "ring-offset": [K, X]
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
        shadow: ["", "inner", "none", J, Qt]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [ue]
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
        "mix-blend": [...q(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": q()
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
        blur: [r]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [s]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [p]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", J, f]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [y]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [b]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [_]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [V]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [P]
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
        "backdrop-blur": [r]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [s]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [p]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [y]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [b]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [_]
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
        "backdrop-saturate": [V]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [P]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", f]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: $()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", f]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: $()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", f]
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
        scale: [A]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [A]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [A]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [de, f]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [ne]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [ne]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [Q]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [Q]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", f]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", f]
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
        "scroll-m": g()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": g()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": g()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": g()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": g()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": g()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": g()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": g()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": g()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": g()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": g()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": g()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": g()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": g()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": g()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": g()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": g()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": g()
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
        "will-change": ["auto", "scroll", "contents", "transform", f]
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
        stroke: [K, X, ve]
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
}, tr = /* @__PURE__ */ Ft(er);
function h(...e) {
  return tr(Nt(e));
}
const rr = "copanel_mobile_desktop_site";
function or() {
  try {
    return localStorage.getItem(rr) === "1";
  } catch {
    return !1;
  }
}
function Ce(e = window.innerWidth) {
  return or() || e >= 1024;
}
function nr({ children: e, className: t, constrained: r = !1 }) {
  const { theme: s } = _e(), o = Te(), i = s === "dark", l = !o && !Ce();
  return /* @__PURE__ */ n(
    "div",
    {
      className: h(
        "flex flex-col transition-colors duration-200",
        o ? "h-full min-h-0" : l ? "min-h-0" : "min-h-screen",
        i ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !o && r && "mx-auto max-w-7xl",
        t
      ),
      children: e
    }
  );
}
function sr({
  isDark: e,
  sidebar: t,
  children: r,
  mobileTitle: s,
  className: o
}) {
  const i = Te(), [l, d] = N(!1), [p, y] = N(() => Ce());
  be(() => {
    const z = () => y(Ce());
    return window.addEventListener("resize", z), () => window.removeEventListener("resize", z);
  }, []);
  const b = !i && !p;
  be(() => {
    p && d(!1);
  }, [p]);
  const _ = () => d(!1);
  return b ? /* @__PURE__ */ u("div", { className: h("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", o), children: [
    /* @__PURE__ */ u(
      "div",
      {
        className: h(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2.5",
          e ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white"
        ),
        children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => d(!0),
              className: h(
                "inline-flex items-center justify-center rounded-lg p-2",
                e ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ n(x.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          s ? /* @__PURE__ */ n("span", { className: h("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: s }) : null
        ]
      }
    ),
    l ? /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: _
      }
    ) : null,
    /* @__PURE__ */ n(
      "div",
      {
        className: h(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          l ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: _,
        children: t
      }
    ),
    /* @__PURE__ */ n("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: r })
  ] }) : /* @__PURE__ */ u("div", { className: h("flex h-full min-h-0 flex-1 overflow-hidden", o), children: [
    t,
    /* @__PURE__ */ n("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: r })
  ] });
}
const ar = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function ke({
  open: e,
  onClose: t,
  children: r,
  title: s,
  className: o,
  maxWidth: i = "lg",
  closeOnBackdropClick: l = !0
}) {
  const { theme: d } = _e(), p = d === "dark", y = He();
  if (!e) return null;
  const b = /* @__PURE__ */ n(
    "div",
    {
      className: h(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        y?.isWindowed ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: l ? t : void 0,
      children: /* @__PURE__ */ u(
        "div",
        {
          className: h(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            ar[i],
            p ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            o
          ),
          onClick: (_) => _.stopPropagation(),
          children: [
            s && /* @__PURE__ */ u(
              "div",
              {
                className: h(
                  "flex items-center justify-between border-b px-4 py-3",
                  p ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ n("h3", { className: "text-sm font-bold", children: s }),
                  /* @__PURE__ */ n("button", { type: "button", onClick: t, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ n(x.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            r
          ]
        }
      )
    }
  );
  return y?.isWindowed && y.viewportRef.current ? Re(b, y.viewportRef.current) : Re(b, document.body);
}
class Ge extends Error {
  constructor(r, s, o, i) {
    super(s);
    B(this, "code");
    B(this, "status");
    B(this, "details");
    this.code = r, this.status = o, this.details = i;
  }
}
async function D(e, t = {}) {
  const r = typeof window < "u" ? localStorage.getItem("copanel_token") : null, s = {
    "Content-Type": "application/json",
    ...t.headers || {}
  };
  r && (s.Authorization = `Bearer ${r}`);
  const o = {
    method: t.method || "GET",
    headers: s,
    signal: t.signal
  };
  t.body !== void 0 && (o.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body));
  const i = await fetch(e, o);
  let l = null;
  const d = await i.text();
  if (d)
    try {
      l = JSON.parse(d);
    } catch {
      l = d;
    }
  if (t.raw)
    return l;
  if (!i.ok) {
    const p = l && typeof l == "object" && l.error ? l.error : { code: `HTTP_${i.status}`, message: typeof l == "string" ? l : l?.detail || i.statusText };
    throw new Ge(p.code || `HTTP_${i.status}`, p.message || "Request failed", i.status, p.details);
  }
  if (l && typeof l == "object" && "status" in l) {
    if (l.status === "success")
      return l.data !== void 0 ? l.data : l;
    if (l.status === "error" && l.error)
      throw new Ge(l.error.code, l.error.message, i.status, l.error.details);
  }
  return l;
}
const lr = "copanel-platform-sse-degraded", pe = 2e3, ir = 6e4, cr = 3;
class dr {
  constructor() {
    B(this, "source", null);
    B(this, "handlers", /* @__PURE__ */ new Map());
    B(this, "retryDelay", pe);
    B(this, "retryTimer", null);
    B(this, "failureCount", 0);
  }
  on(t, r) {
    let s = this.handlers.get(t);
    return s || (s = /* @__PURE__ */ new Set(), this.handlers.set(t, s)), s.add(r), this.ensureConnected(), () => {
      s.delete(r), s.size === 0 && this.handlers.delete(t), this.teardownIfIdle();
    };
  }
  emit(t, r) {
    const s = this.handlers.get(t);
    s && s.forEach((o) => {
      try {
        o(r);
      } catch (i) {
        console.error("event handler failed", t, i);
      }
    });
  }
  buildUrl() {
    const t = localStorage.getItem("copanel_token");
    return t ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      access_token: t
    }).toString()}` : null;
  }
  ensureConnected() {
    if (this.source || typeof document < "u" && document.hidden) return;
    const t = this.buildUrl();
    if (t) {
      try {
        this.source = new EventSource(t, { withCredentials: !1 });
      } catch {
        this.scheduleRetry();
        return;
      }
      this.source.addEventListener("open", () => {
        this.failureCount = 0, this.retryDelay = pe;
      }), this.source.addEventListener("jobs", (r) => {
        this.onStreamMessage(), this.parseAndEmit("jobs", r.data);
      }), this.source.addEventListener("notifications", (r) => {
        this.onStreamMessage(), this.parseAndEmit("notifications", r.data);
      }), this.source.addEventListener("message", () => {
        this.onStreamMessage();
      }), this.source.onerror = () => {
        this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= cr && window.dispatchEvent(new CustomEvent(lr)), this.scheduleRetry();
      };
    }
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = pe;
  }
  parseAndEmit(t, r) {
    try {
      const s = JSON.parse(r);
      this.emit(t, s.payload || s);
    } catch {
    }
  }
  scheduleRetry() {
    if (this.retryTimer || this.handlers.size === 0) return;
    const t = this.retryDelay;
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), ir), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = pe);
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = pe, this.handlers.size > 0 && this.ensureConnected();
  }
}
const Me = new dr();
function ur() {
  Me.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || ur();
});
function et(e) {
  let t = e;
  const r = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (s) => {
      const o = typeof s == "function" ? s(t) : s;
      if (!o || Object.keys(o).length === 0) return;
      let i = !1;
      for (const l of Object.keys(o))
        if (t[l] !== o[l]) {
          i = !0;
          break;
        }
      i && (t = { ...t, ...o }, r.forEach((l) => l()));
    },
    subscribe: (s) => (r.add(s), () => r.delete(s))
  };
}
const tt = et({ jobs: {}, order: [], lastFetch: 0 });
function pr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function De(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function te(e, t, r) {
  if (!e || typeof e != "object") return;
  const s = De(e[t], r);
  if (s) return s;
  const o = De(e[`${t}_i18n`], r);
  if (o) return o;
  const i = e[`${t}_${r}`];
  if (typeof i == "string" && i) return i;
  const l = e[`${t}_en`];
  if (typeof l == "string" && l) return l;
  const d = e[`${t}_vi`];
  if (typeof d == "string" && d) return d;
}
function mr(e) {
  const t = pr(), r = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: te(e, "title", t) || te(r, "title", t) || e?.title || "",
    message: te(e, "message", t) || te(r, "message", t) || e?.message,
    error: te(e, "error", t) || te(r, "error", t) || e?.error || null
  };
}
function We(e) {
  const t = mr(e);
  tt.setState((r) => {
    const s = { ...r.jobs, [t.id]: { ...r.jobs[t.id], ...t } };
    let o = r.order;
    return o.includes(t.id) || (o = [t.id, ...o].slice(0, 200)), { jobs: s, order: o };
  });
}
Me.on("jobs", (e) => {
  if (e?.job) {
    We(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = tt.getState().jobs[e.job_id];
    t && We({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const Se = et({ inbox: [], unread: 0, toasts: [] }), hr = 6e3;
function fr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Be(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function fe(e, t, r) {
  if (!e || typeof e != "object") return;
  const s = Be(e[t], r);
  if (s) return s;
  const o = Be(e[`${t}_i18n`], r);
  if (o) return o;
  const i = e[`${t}_${r}`];
  if (typeof i == "string" && i) return i;
  const l = e[`${t}_en`];
  if (typeof l == "string" && l) return l;
  const d = e[`${t}_vi`];
  if (typeof d == "string" && d) return d;
}
function br(e) {
  const t = fr(), r = e?.payload && typeof e.payload == "object" ? e.payload : {}, s = fe(e, "title", t) || fe(r, "title", t) || e?.title || "", o = fe(e, "body", t) || fe(r, "body", t) || e?.body || null;
  return {
    ...e,
    title: s,
    body: o
  };
}
function gr(e) {
  Se.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    Se.setState((t) => ({ toasts: t.toasts.filter((r) => r.id !== e.id) }));
  }, hr);
}
Me.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = br(e.notification);
    gr({ ...t, ephemeral: !0 }), Se.setState((r) => ({
      inbox: [t, ...r.inbox].slice(0, 200),
      unread: r.unread + 1
    }));
  }
});
const yr = {
  title: "FTP Manager",
  subtitle: "External FTP · FTPS · SFTP",
  connections: "Connections",
  add: "Add connection",
  addShort: "Add",
  edit: "Edit",
  delete: "Delete",
  test: "Test",
  save: "Save",
  cancel: "Cancel",
  label: "Name",
  protocol: "Protocol",
  host: "Host",
  port: "Port",
  username: "Username",
  password: "Password",
  authType: "Authentication",
  authPassword: "Password",
  authKeyPath: "SSH key path",
  authKeyBlob: "Paste private key",
  keyPath: "Private key path",
  keyBlob: "Private key (PEM)",
  remoteRoot: "Remote root",
  passive: "Passive mode (FTP)",
  timeout: "Timeout (seconds)",
  advanced: "Advanced",
  passwordKeep: "Leave blank to keep current password",
  keyKeep: "Leave blank to keep current key",
  emptyTitle: "No connections yet",
  emptyHint: "Add an FTP or SFTP server to browse and transfer files.",
  emptySidebar: "No connections",
  browse: "Remote files",
  refresh: "Refresh",
  mkdir: "New folder",
  rename: "Rename",
  deleteItem: "Delete",
  upload: "Upload",
  download: "Download",
  localPath: "Local path",
  remotePath: "Remote path",
  transferJob: "Start transfer",
  openFileManager: "Open File Manager",
  testing: "Testing…",
  saving: "Saving…",
  loading: "Loading…",
  testOk: "Connection OK",
  testFail: "Connection failed",
  confirmDelete: "Delete this connection?",
  confirmDeleteItem: "Delete this remote item?",
  namePrompt: "Folder name",
  renamePrompt: "New name",
  selectHint: "Select a connection from the list",
  path: "Path",
  size: "Size",
  modified: "Modified",
  name: "Name",
  type: "Type",
  folder: "Folder",
  file: "File",
  jobQueued: "Queued in Task Center",
  noItems: "This folder is empty",
  overwrite: "Overwrite if exists",
  saved: "Saved"
}, xr = {
  title: "FTP Manager",
  subtitle: "FTP · FTPS · SFTP bên ngoài",
  connections: "Kết nối",
  add: "Thêm kết nối",
  addShort: "Thêm",
  edit: "Sửa",
  delete: "Xóa",
  test: "Kiểm tra",
  save: "Lưu",
  cancel: "Hủy",
  label: "Tên",
  protocol: "Giao thức",
  host: "Máy chủ",
  port: "Cổng",
  username: "Tài khoản",
  password: "Mật khẩu",
  authType: "Xác thực",
  authPassword: "Mật khẩu",
  authKeyPath: "Đường dẫn SSH key",
  authKeyBlob: "Dán private key",
  keyPath: "Đường dẫn private key",
  keyBlob: "Private key (PEM)",
  remoteRoot: "Thư mục gốc remote",
  passive: "Chế độ Passive (FTP)",
  timeout: "Timeout (giây)",
  advanced: "Nâng cao",
  passwordKeep: "Để trống để giữ mật khẩu hiện tại",
  keyKeep: "Để trống để giữ key hiện tại",
  emptyTitle: "Chưa có kết nối",
  emptyHint: "Thêm máy chủ FTP hoặc SFTP để duyệt và chuyển file.",
  emptySidebar: "Chưa có kết nối",
  browse: "File remote",
  refresh: "Tải lại",
  mkdir: "Thư mục mới",
  rename: "Đổi tên",
  deleteItem: "Xóa",
  upload: "Upload",
  download: "Download",
  localPath: "Đường dẫn local",
  remotePath: "Đường dẫn remote",
  transferJob: "Bắt đầu chuyển",
  openFileManager: "Mở File Manager",
  testing: "Đang kiểm tra…",
  saving: "Đang lưu…",
  loading: "Đang tải…",
  testOk: "Kết nối thành công",
  testFail: "Kết nối thất bại",
  confirmDelete: "Xóa kết nối này?",
  confirmDeleteItem: "Xóa mục remote này?",
  namePrompt: "Tên thư mục",
  renamePrompt: "Tên mới",
  selectHint: "Chọn một kết nối bên trái",
  path: "Đường dẫn",
  size: "Kích thước",
  modified: "Sửa đổi",
  name: "Tên",
  type: "Loại",
  folder: "Thư mục",
  file: "Tệp",
  jobQueued: "Đã đưa vào Task Center",
  noItems: "Thư mục trống",
  overwrite: "Ghi đè nếu tồn tại",
  saved: "Đã lưu"
}, wr = { en: yr, vi: xr }, Ke = () => ({
  label: "",
  protocol: "sftp",
  host: "",
  port: "22",
  username: "",
  auth_type: "password",
  password: "",
  key_path: "",
  key_blob: "",
  remote_root: "/",
  passive: !0,
  timeout: "30"
});
function vr(e) {
  return {
    label: e.label,
    protocol: e.protocol,
    host: e.host,
    port: String(e.port),
    username: e.username,
    auth_type: e.auth_type || "password",
    password: "",
    key_path: "",
    key_blob: "",
    remote_root: e.remote_root || "/",
    passive: e.passive,
    timeout: String(e.timeout || 30)
  };
}
function kr(e) {
  return e === "sftp" ? "22" : "21";
}
function Nr(e) {
  return e ? e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : e < 1024 * 1024 * 1024 ? `${(e / (1024 * 1024)).toFixed(1)} MB` : `${(e / (1024 * 1024 * 1024)).toFixed(2)} GB` : "—";
}
function Cr(e) {
  if (!e) return "—";
  try {
    return new Date(e * 1e3).toLocaleString();
  } catch {
    return "—";
  }
}
function zr() {
  const { theme: e, language: t } = _e(), r = e === "dark", o = wr[t === "vi" ? "vi" : "en"], i = Te(), [l, d] = N([]), [p, y] = N(null), [b, _] = N("/"), [z, I] = N([]), [w, C] = N(null), [v, T] = N(!0), [j, V] = N(!1), [A, P] = N(!1), [Q, S] = N(null), [ne, L] = N(null), [se, W] = N(!1), [g, ae] = N(null), [c, E] = N(Ke()), [Y, q] = N(!1), [le, G] = N(!1), [ie, $] = N("download"), [ge, ye] = N("/tmp"), [ze, rt] = N(!0), [ot, Z] = N(!1), [xe, Ee] = N("connection"), O = Le(
    () => l.find((a) => a.id === p) || null,
    [l, p]
  ), me = Fe(async (a) => {
    T(!0), S(null);
    try {
      const m = await D("/api/ftp_manager/connections"), M = Array.isArray(m) ? m : [];
      d(M), y((ee) => a != null && M.some((we) => we.id === a) ? a : ee != null && M.some((we) => we.id === ee) ? ee : M.length > 0 ? M[0].id : null);
    } catch (m) {
      S(m?.message || String(m)), d([]);
    } finally {
      T(!1);
    }
  }, []), U = Fe(async (a, m) => {
    V(!0), S(null), C(null);
    try {
      const M = await D(
        `/api/ftp_manager/connections/${a}/list?path=${encodeURIComponent(m)}`
      );
      _(M.path || m || "/"), I(Array.isArray(M.items) ? M.items : []);
    } catch (M) {
      S(M?.message || String(M)), I([]);
    } finally {
      V(!1);
    }
  }, []);
  be(() => {
    me();
  }, [me]), be(() => {
    if (p != null) {
      const a = l.find((m) => m.id === p)?.remote_root || "/";
      U(p, a);
    } else
      I([]), _("/");
  }, [p]);
  const je = Le(() => {
    const a = b.split("/").filter(Boolean), m = [{ label: "/", path: "/" }];
    let M = "";
    for (const ee of a)
      M += `/${ee}`, m.push({ label: ee, path: M });
    return m;
  }, [b]), Ae = () => {
    ae(null), E(Ke()), q(!1), W(!0), L(null), S(null);
  }, nt = (a) => {
    ae(a.id), E(vr(a)), q(!1), W(!0), L(null), S(null);
  }, st = (a) => {
    E((m) => ({
      ...m,
      protocol: a,
      port: m.port === "21" || m.port === "22" || !m.port ? kr(a) : m.port,
      auth_type: a === "sftp" ? m.auth_type : "password"
    }));
  }, at = async () => {
    P(!0), S(null), L(null);
    try {
      const a = {
        label: c.label.trim(),
        protocol: c.protocol,
        host: c.host.trim(),
        port: Number(c.port) || 0,
        username: c.username.trim(),
        auth_type: c.auth_type,
        remote_root: c.remote_root.trim() || "/",
        passive: c.passive,
        timeout: Number(c.timeout) || 30
      };
      c.password && (a.password = c.password), c.auth_type === "key_path" && c.key_path && (a.key_path = c.key_path), c.auth_type === "key_blob" && c.key_blob && (a.key_blob = c.key_blob);
      let m = g;
      g == null ? m = (await D("/api/ftp_manager/connections", {
        method: "POST",
        body: a
      })).id : await D(`/api/ftp_manager/connections/${g}`, {
        method: "PATCH",
        body: a
      }), W(!1), await me(m), L(o.saved);
    } catch (a) {
      S(a?.message || String(a));
    } finally {
      P(!1);
    }
  }, Ie = async (a) => {
    P(!0), S(null), L(null);
    try {
      a != null ? await D(`/api/ftp_manager/connections/${a}/test`, { method: "POST", body: {} }) : await D("/api/ftp_manager/connections/test", {
        method: "POST",
        body: {
          protocol: c.protocol,
          host: c.host.trim(),
          port: Number(c.port) || 0,
          username: c.username.trim(),
          auth_type: c.auth_type,
          password: c.password || void 0,
          key_path: c.key_path || void 0,
          key_blob: c.key_blob || void 0,
          remote_root: c.remote_root || "/",
          passive: c.passive,
          timeout: Number(c.timeout) || 30
        }
      }), L(o.testOk);
    } catch (m) {
      S(m?.message || o.testFail);
    } finally {
      P(!1);
    }
  }, lt = async () => {
    if (p != null) {
      P(!0);
      try {
        await D(`/api/ftp_manager/connections/${p}`, { method: "DELETE" }), y(null), Z(!1), await me(null);
      } catch (a) {
        S(a?.message || String(a));
      } finally {
        P(!1);
      }
    }
  }, it = async () => {
    if (p == null) return;
    const a = window.prompt(o.namePrompt);
    if (!a || !a.trim()) return;
    const m = `${b.replace(/\/$/, "")}/${a.trim()}`;
    P(!0);
    try {
      await D(`/api/ftp_manager/connections/${p}/mkdir`, {
        method: "POST",
        body: { path: m }
      }), await U(p, b);
    } catch (M) {
      S(M?.message || String(M));
    } finally {
      P(!1);
    }
  }, ct = async () => {
    if (p == null || !w) return;
    const a = window.prompt(o.renamePrompt, w.name);
    if (!(!a || !a.trim() || a.trim() === w.name)) {
      P(!0);
      try {
        await D(`/api/ftp_manager/connections/${p}/rename`, {
          method: "POST",
          body: { path: w.path, new_name: a.trim() }
        }), await U(p, b);
      } catch (m) {
        S(m?.message || String(m));
      } finally {
        P(!1);
      }
    }
  }, dt = async () => {
    if (!(p == null || !w)) {
      P(!0);
      try {
        await D(`/api/ftp_manager/connections/${p}/delete`, {
          method: "POST",
          body: { path: w.path, recursive: w.is_dir }
        }), Z(!1), C(null), await U(p, b);
      } catch (a) {
        S(a?.message || String(a));
      } finally {
        P(!1);
      }
    }
  }, ut = async () => {
    if (p == null) return;
    const a = w?.path || b;
    P(!0), S(null), L(null);
    try {
      const m = await D("/api/ftp_manager/transfer_job", {
        method: "POST",
        body: {
          connection_id: p,
          direction: ie,
          remote_path: a,
          local_path: ge.trim(),
          overwrite: ze
        }
      });
      G(!1), L(`${o.jobQueued}: ${m.job_id}`);
    } catch (m) {
      S(m?.message || String(m));
    } finally {
      P(!1);
    }
  }, F = h(
    "w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
    "focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500",
    r ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-300 bg-white text-slate-900"
  ), R = h("mb-1.5 block text-xs font-medium", r ? "text-slate-400" : "text-slate-500"), ce = h(
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white",
    "bg-sky-600 hover:bg-sky-500 disabled:opacity-50"
  ), H = h(
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium border",
    r ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"
  ), he = h(
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border",
    r ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"
  ), pt = /* @__PURE__ */ u(
    "aside",
    {
      className: h(
        "flex h-full w-[220px] shrink-0 flex-col border-r",
        r ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-slate-50/95"
      ),
      children: [
        /* @__PURE__ */ u(
          "div",
          {
            className: h(
              "flex shrink-0 items-center justify-between gap-2 border-b px-3 py-3",
              r ? "border-slate-800" : "border-slate-200"
            ),
            children: [
              /* @__PURE__ */ u("div", { className: "min-w-0", children: [
                /* @__PURE__ */ n("div", { className: "truncate text-sm font-semibold", children: o.title }),
                /* @__PURE__ */ n("div", { className: h("truncate text-[11px]", r ? "text-slate-500" : "text-slate-400"), children: o.subtitle })
              ] }),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  title: o.add,
                  onClick: Ae,
                  className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white hover:bg-sky-500",
                  children: /* @__PURE__ */ n(x.Plus, { className: "h-4 w-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ u("nav", { className: "min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2", children: [
          v && /* @__PURE__ */ u("div", { className: h("flex items-center gap-2 px-2 py-3 text-xs", r ? "text-slate-500" : "text-slate-400"), children: [
            /* @__PURE__ */ n(x.Loader2, { className: "h-3.5 w-3.5 animate-spin" }),
            o.loading
          ] }),
          !v && l.length === 0 && /* @__PURE__ */ n("p", { className: h("px-2 py-6 text-center text-[11px] leading-relaxed", r ? "text-slate-500" : "text-slate-400"), children: o.emptySidebar }),
          !v && l.map((a) => {
            const m = a.id === p;
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                onClick: () => y(a.id),
                className: h(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs transition",
                  m ? r ? "bg-slate-800 text-white" : "bg-white text-slate-900 shadow-sm" : r ? "text-slate-300 hover:bg-slate-900/70" : "text-slate-700 hover:bg-white/80"
                ),
                children: [
                  /* @__PURE__ */ n(
                    x.HardDrive,
                    {
                      className: h("h-4 w-4 shrink-0", m ? "text-sky-500" : "text-slate-400")
                    }
                  ),
                  /* @__PURE__ */ u("span", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ n("span", { className: "block truncate font-medium", children: a.label }),
                    /* @__PURE__ */ u("span", { className: h("block truncate", r ? "text-slate-500" : "text-slate-400"), children: [
                      a.protocol.toUpperCase(),
                      " · ",
                      a.host
                    ] })
                  ] })
                ]
              },
              a.id
            );
          })
        ] })
      ]
    }
  ), mt = Q || ne ? /* @__PURE__ */ u(
    "div",
    {
      className: h(
        "mx-4 mt-3 flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs",
        Q ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
      ),
      children: [
        Q ? /* @__PURE__ */ n(x.AlertTriangle, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ n(x.CheckCircle2, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ n("span", { className: "min-w-0 flex-1", children: Q || ne }),
        /* @__PURE__ */ n("button", { type: "button", className: "opacity-60 hover:opacity-100", onClick: () => {
          S(null), L(null);
        }, children: /* @__PURE__ */ n(x.X, { className: "h-3.5 w-3.5" }) })
      ]
    }
  ) : null;
  return /* @__PURE__ */ u(nr, { constrained: !0, className: "overflow-hidden", children: [
    /* @__PURE__ */ n(
      sr,
      {
        isDark: r,
        mobileTitle: o.title,
        className: h("min-h-0", r ? "text-slate-100" : "text-slate-900"),
        sidebar: pt,
        children: /* @__PURE__ */ u("div", { className: "flex h-full min-h-0 flex-col overflow-hidden", children: [
          mt,
          O ? /* @__PURE__ */ u(bt, { children: [
            /* @__PURE__ */ u(
              "header",
              {
                className: h(
                  "flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-3",
                  r ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ u("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ n("h1", { className: "truncate text-base font-semibold", children: O.label }),
                    /* @__PURE__ */ u("p", { className: h("truncate text-xs", r ? "text-slate-500" : "text-slate-400"), children: [
                      O.protocol.toUpperCase(),
                      "://",
                      O.username,
                      "@",
                      O.host,
                      ":",
                      O.port
                    ] })
                  ] }),
                  /* @__PURE__ */ u("div", { className: "flex flex-wrap gap-1.5", children: [
                    /* @__PURE__ */ u("button", { type: "button", className: H, disabled: A, onClick: () => Ie(O.id), children: [
                      /* @__PURE__ */ n(x.ShieldCheck, { className: "h-4 w-4" }),
                      A ? o.testing : o.test
                    ] }),
                    /* @__PURE__ */ u("button", { type: "button", className: H, onClick: () => nt(O), children: [
                      /* @__PURE__ */ n(x.Pencil, { className: "h-4 w-4" }),
                      o.edit
                    ] }),
                    /* @__PURE__ */ u(
                      "button",
                      {
                        type: "button",
                        className: H,
                        onClick: () => {
                          Ee("connection"), Z(!0);
                        },
                        children: [
                          /* @__PURE__ */ n(x.Trash2, { className: "h-4 w-4" }),
                          o.delete
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: h(
                  "flex shrink-0 flex-wrap items-center gap-1.5 border-b px-3 py-2",
                  r ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ n("div", { className: "flex min-w-0 flex-1 flex-wrap items-center gap-0.5 text-sm", children: je.map((a, m) => /* @__PURE__ */ u("span", { className: "inline-flex items-center gap-0.5", children: [
                    m > 0 && /* @__PURE__ */ n(x.ChevronRight, { className: "h-3.5 w-3.5 opacity-40" }),
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: h(
                          "rounded px-1.5 py-0.5 hover:text-sky-500",
                          m === je.length - 1 && "font-medium"
                        ),
                        onClick: () => U(O.id, a.path),
                        children: a.label
                      }
                    )
                  ] }, a.path)) }),
                  /* @__PURE__ */ n("button", { type: "button", className: he, title: o.refresh, disabled: j, onClick: () => U(O.id, b), children: /* @__PURE__ */ n(x.RefreshCw, { className: h("h-4 w-4", j && "animate-spin") }) }),
                  /* @__PURE__ */ n("button", { type: "button", className: he, title: o.mkdir, onClick: it, children: /* @__PURE__ */ n(x.FolderPlus, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ n("button", { type: "button", className: he, title: o.rename, disabled: !w, onClick: ct, children: /* @__PURE__ */ n(x.TextCursorInput, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: he,
                      title: o.deleteItem,
                      disabled: !w,
                      onClick: () => {
                        Ee("item"), Z(!0);
                      },
                      children: /* @__PURE__ */ n(x.Trash2, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: H,
                      onClick: () => {
                        $("download"), ye("/tmp"), G(!0);
                      },
                      children: [
                        /* @__PURE__ */ n(x.Download, { className: "h-4 w-4" }),
                        o.download
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: ce,
                      onClick: () => {
                        $("upload"), ye("/tmp"), G(!0);
                      },
                      children: [
                        /* @__PURE__ */ n(x.Upload, { className: "h-4 w-4" }),
                        o.upload
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ n("div", { className: h("min-h-0 flex-1 overflow-y-auto overscroll-contain", ""), children: /* @__PURE__ */ u("table", { className: "w-full text-left text-sm", children: [
              /* @__PURE__ */ n(
                "thead",
                {
                  className: h(
                    "sticky top-0 z-10 border-b text-[11px] uppercase tracking-wide",
                    r ? "border-slate-800 bg-slate-950 text-slate-500" : "border-slate-200 bg-slate-50 text-slate-400"
                  ),
                  children: /* @__PURE__ */ u("tr", { children: [
                    /* @__PURE__ */ n("th", { className: "px-4 py-2.5 font-medium", children: o.name }),
                    /* @__PURE__ */ n("th", { className: "px-4 py-2.5 font-medium", children: o.type }),
                    /* @__PURE__ */ n("th", { className: "px-4 py-2.5 font-medium", children: o.size }),
                    /* @__PURE__ */ n("th", { className: "px-4 py-2.5 font-medium", children: o.modified })
                  ] })
                }
              ),
              /* @__PURE__ */ u("tbody", { children: [
                b !== "/" && /* @__PURE__ */ n(
                  "tr",
                  {
                    className: h(
                      "cursor-pointer border-b",
                      r ? "border-slate-800/80 hover:bg-slate-900" : "border-slate-100 hover:bg-slate-50"
                    ),
                    onDoubleClick: () => {
                      const a = b.replace(/\/+$/, "").split("/").slice(0, -1).join("/") || "/";
                      U(O.id, a);
                    },
                    children: /* @__PURE__ */ n("td", { className: "px-4 py-2.5", colSpan: 4, children: /* @__PURE__ */ u("span", { className: "inline-flex items-center gap-2 opacity-70", children: [
                      /* @__PURE__ */ n(x.CornerLeftUp, { className: "h-4 w-4" }),
                      ".."
                    ] }) })
                  }
                ),
                !j && z.length === 0 && /* @__PURE__ */ n("tr", { children: /* @__PURE__ */ n("td", { className: "px-4 py-10 text-center text-sm opacity-50", colSpan: 4, children: o.noItems }) }),
                z.map((a) => {
                  const m = w?.path === a.path;
                  return /* @__PURE__ */ u(
                    "tr",
                    {
                      className: h(
                        "cursor-pointer border-b",
                        r ? "border-slate-800/80" : "border-slate-100",
                        m ? "bg-sky-500/10" : r ? "hover:bg-slate-900" : "hover:bg-slate-50"
                      ),
                      onClick: () => C(a),
                      onDoubleClick: () => {
                        a.is_dir && U(O.id, a.path);
                      },
                      children: [
                        /* @__PURE__ */ n("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ u("span", { className: "inline-flex items-center gap-2", children: [
                          a.is_dir ? /* @__PURE__ */ n(x.Folder, { className: "h-4 w-4 text-amber-500" }) : /* @__PURE__ */ n(x.File, { className: "h-4 w-4 opacity-50" }),
                          a.name
                        ] }) }),
                        /* @__PURE__ */ n("td", { className: "px-4 py-2.5 opacity-60", children: a.is_dir ? o.folder : o.file }),
                        /* @__PURE__ */ n("td", { className: "px-4 py-2.5 opacity-60", children: a.is_dir ? "—" : Nr(a.size) }),
                        /* @__PURE__ */ n("td", { className: "px-4 py-2.5 opacity-60", children: Cr(a.modified) })
                      ]
                    },
                    a.path
                  );
                })
              ] })
            ] }) }),
            /* @__PURE__ */ u(
              "div",
              {
                className: h(
                  "flex shrink-0 items-center justify-between gap-2 border-t px-4 py-2 text-[11px]",
                  r ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"
                ),
                children: [
                  /* @__PURE__ */ u("span", { className: "truncate", children: [
                    o.path,
                    ": ",
                    b,
                    w ? ` · ${w.name}` : ""
                  ] }),
                  /* @__PURE__ */ u(yt, { to: "/file-manager", className: "inline-flex items-center gap-1 text-sky-500 hover:underline", children: [
                    /* @__PURE__ */ n(x.FolderOpen, { className: "h-3.5 w-3.5" }),
                    o.openFileManager
                  ] })
                ]
              }
            )
          ] }) : /* @__PURE__ */ u("div", { className: "flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center", children: [
            /* @__PURE__ */ n(
              "div",
              {
                className: h(
                  "flex h-14 w-14 items-center justify-center rounded-2xl",
                  r ? "bg-slate-800" : "bg-slate-100"
                ),
                children: /* @__PURE__ */ n(x.Server, { className: h("h-7 w-7", r ? "text-slate-400" : "text-slate-500") })
              }
            ),
            /* @__PURE__ */ u("div", { className: "max-w-sm space-y-1.5", children: [
              /* @__PURE__ */ n("h2", { className: "text-base font-semibold", children: o.emptyTitle }),
              /* @__PURE__ */ n("p", { className: h("text-sm", r ? "text-slate-400" : "text-slate-500"), children: o.emptyHint })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", className: ce, onClick: Ae, children: [
              /* @__PURE__ */ n(x.Plus, { className: "h-4 w-4" }),
              o.add
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n(
      ke,
      {
        open: se,
        onClose: () => W(!1),
        title: g == null ? o.add : o.edit,
        maxWidth: "lg",
        className: "max-h-[85vh]",
        children: /* @__PURE__ */ u("div", { className: "space-y-4 p-1", children: [
          /* @__PURE__ */ u("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ u("label", { className: "block sm:col-span-1", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.label }),
              /* @__PURE__ */ n(
                "input",
                {
                  className: F,
                  autoComplete: "off",
                  value: c.label,
                  onChange: (a) => E({ ...c, label: a.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ u("label", { className: "block sm:col-span-1", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.protocol }),
              /* @__PURE__ */ u(
                "select",
                {
                  className: F,
                  value: c.protocol,
                  onChange: (a) => st(a.target.value),
                  children: [
                    /* @__PURE__ */ n("option", { value: "sftp", children: "SFTP" }),
                    /* @__PURE__ */ n("option", { value: "ftp", children: "FTP" }),
                    /* @__PURE__ */ n("option", { value: "ftps", children: "FTPS" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.host }),
              /* @__PURE__ */ n(
                "input",
                {
                  className: F,
                  autoComplete: "off",
                  value: c.host,
                  onChange: (a) => E({ ...c, host: a.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ u("label", { className: "block", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.port }),
              /* @__PURE__ */ n(
                "input",
                {
                  className: F,
                  autoComplete: "off",
                  inputMode: "numeric",
                  value: c.port,
                  onChange: (a) => E({ ...c, port: a.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ u("label", { className: "block", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.username }),
              /* @__PURE__ */ n(
                "input",
                {
                  className: F,
                  autoComplete: "off",
                  name: "ftp-username",
                  value: c.username,
                  onChange: (a) => E({ ...c, username: a.target.value })
                }
              )
            ] }),
            c.protocol === "sftp" && /* @__PURE__ */ u("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.authType }),
              /* @__PURE__ */ u(
                "select",
                {
                  className: F,
                  value: c.auth_type,
                  onChange: (a) => E({ ...c, auth_type: a.target.value }),
                  children: [
                    /* @__PURE__ */ n("option", { value: "password", children: o.authPassword }),
                    /* @__PURE__ */ n("option", { value: "key_path", children: o.authKeyPath }),
                    /* @__PURE__ */ n("option", { value: "key_blob", children: o.authKeyBlob })
                  ]
                }
              )
            ] }),
            (c.auth_type === "password" || c.protocol !== "sftp") && /* @__PURE__ */ u("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.password }),
              /* @__PURE__ */ n(
                "input",
                {
                  type: "password",
                  className: F,
                  autoComplete: "new-password",
                  name: "ftp-password",
                  value: c.password,
                  placeholder: g != null ? o.passwordKeep : "",
                  onChange: (a) => E({ ...c, password: a.target.value })
                }
              )
            ] }),
            c.protocol === "sftp" && c.auth_type === "key_path" && /* @__PURE__ */ u("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.keyPath }),
              /* @__PURE__ */ n(
                "input",
                {
                  className: F,
                  autoComplete: "off",
                  value: c.key_path,
                  placeholder: g != null ? o.keyKeep : "~/.ssh/id_ed25519",
                  onChange: (a) => E({ ...c, key_path: a.target.value })
                }
              )
            ] }),
            c.protocol === "sftp" && c.auth_type === "key_blob" && /* @__PURE__ */ u("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.keyBlob }),
              /* @__PURE__ */ n(
                "textarea",
                {
                  className: h(F, "min-h-[100px] font-mono text-xs"),
                  autoComplete: "off",
                  value: c.key_blob,
                  placeholder: g != null ? o.keyKeep : "-----BEGIN OPENSSH PRIVATE KEY-----",
                  onChange: (a) => E({ ...c, key_blob: a.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: h(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium",
                r ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-50"
              ),
              onClick: () => q((a) => !a),
              children: [
                Y ? /* @__PURE__ */ n(x.ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ n(x.ChevronRight, { className: "h-3.5 w-3.5" }),
                o.advanced
              ]
            }
          ),
          Y && /* @__PURE__ */ u("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ u("label", { className: "block", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.remoteRoot }),
              /* @__PURE__ */ n(
                "input",
                {
                  className: F,
                  autoComplete: "off",
                  value: c.remote_root,
                  onChange: (a) => E({ ...c, remote_root: a.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ u("label", { className: "block", children: [
              /* @__PURE__ */ n("span", { className: R, children: o.timeout }),
              /* @__PURE__ */ n(
                "input",
                {
                  className: F,
                  autoComplete: "off",
                  inputMode: "numeric",
                  value: c.timeout,
                  onChange: (a) => E({ ...c, timeout: a.target.value })
                }
              )
            ] }),
            c.protocol !== "sftp" && /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm sm:col-span-2", children: [
              /* @__PURE__ */ n(
                "input",
                {
                  type: "checkbox",
                  checked: c.passive,
                  onChange: (a) => E({ ...c, passive: a.target.checked })
                }
              ),
              o.passive
            ] })
          ] }),
          /* @__PURE__ */ u("div", { className: "flex flex-wrap justify-end gap-2 border-t pt-3", style: { borderColor: r ? "#1e293b" : "#e2e8f0" }, children: [
            /* @__PURE__ */ n("button", { type: "button", className: H, onClick: () => W(!1), children: o.cancel }),
            /* @__PURE__ */ n("button", { type: "button", className: H, disabled: A || !c.host.trim() || !c.username.trim(), onClick: () => Ie(), children: A ? o.testing : o.test }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: ce,
                disabled: A || !c.label.trim() || !c.host.trim() || !c.username.trim(),
                onClick: at,
                children: A ? o.saving : o.save
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n(
      ke,
      {
        open: le,
        onClose: () => G(!1),
        title: ie === "download" ? o.download : o.upload,
        maxWidth: "md",
        children: /* @__PURE__ */ u("div", { className: "space-y-3 p-1", children: [
          /* @__PURE__ */ u("label", { className: "block", children: [
            /* @__PURE__ */ n("span", { className: R, children: o.remotePath }),
            /* @__PURE__ */ n("input", { className: F, value: w?.path || b, readOnly: !0 })
          ] }),
          /* @__PURE__ */ u("label", { className: "block", children: [
            /* @__PURE__ */ n("span", { className: R, children: o.localPath }),
            /* @__PURE__ */ n(
              "input",
              {
                className: F,
                autoComplete: "off",
                value: ge,
                onChange: (a) => ye(a.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ n("input", { type: "checkbox", checked: ze, onChange: (a) => rt(a.target.checked) }),
            o.overwrite
          ] }),
          /* @__PURE__ */ u("div", { className: "flex justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ n("button", { type: "button", className: H, onClick: () => G(!1), children: o.cancel }),
            /* @__PURE__ */ u("button", { type: "button", className: ce, disabled: A || !ge.trim(), onClick: ut, children: [
              /* @__PURE__ */ n(x.Play, { className: "h-4 w-4" }),
              o.transferJob
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n(
      ke,
      {
        open: ot,
        onClose: () => Z(!1),
        title: xe === "connection" ? o.delete : o.deleteItem,
        maxWidth: "sm",
        children: /* @__PURE__ */ u("div", { className: "space-y-4 p-1", children: [
          /* @__PURE__ */ n("p", { className: h("text-sm", r ? "text-slate-300" : "text-slate-600"), children: xe === "connection" ? o.confirmDelete : o.confirmDeleteItem }),
          /* @__PURE__ */ u("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ n("button", { type: "button", className: H, onClick: () => Z(!1), children: o.cancel }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: h(ce, "!bg-red-600 hover:!bg-red-500"),
                disabled: A,
                onClick: () => xe === "connection" ? lt() : dt(),
                children: o.delete
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  zr as default
};
