var De = Object.defineProperty;
var Ue = (e, t, r) => t in e ? De(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var L = (e, t, r) => Ue(e, typeof t != "symbol" ? t + "" : t, r);
import { jsx as d, jsxs as u } from "react/jsx-runtime";
import { createContext as Te, useContext as Ee, useState as k, useCallback as Fe, useEffect as He } from "react";
import { useOutletContext as qe } from "react-router-dom";
import * as $ from "lucide-react";
const Je = Te(null);
function Ye() {
  return Ee(Je);
}
const Xe = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Re() {
  const e = Ye(), t = qe();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : Xe);
}
function ze(e) {
  var t, r, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var a = e.length;
    for (t = 0; t < a; t++) e[t] && (r = ze(e[t])) && (o && (o += " "), o += r);
  } else for (r in e) e[r] && (o && (o += " "), o += r);
  return o;
}
function Ze() {
  for (var e, t, r = 0, o = "", a = arguments.length; r < a; r++) (e = arguments[r]) && (t = ze(e)) && (o && (o += " "), o += t);
  return o;
}
const he = "-", Qe = (e) => {
  const t = et(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (n) => {
      const i = n.split(he);
      return i[0] === "" && i.length !== 1 && i.shift(), Ie(i, t) || Ke(n);
    },
    getConflictingClassGroupIds: (n, i) => {
      const b = r[n] || [];
      return i && o[n] ? [...b, ...o[n]] : b;
    }
  };
}, Ie = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], o = t.nextPart.get(r), a = o ? Ie(e.slice(1), o) : void 0;
  if (a)
    return a;
  if (t.validators.length === 0)
    return;
  const s = e.join(he);
  return t.validators.find(({
    validator: n
  }) => n(s))?.classGroupId;
}, Ce = /^\[(.+)\]$/, Ke = (e) => {
  if (Ce.test(e)) {
    const t = Ce.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, et = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, o = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return rt(Object.entries(e.classGroups), r).forEach(([s, n]) => {
    be(n, o, s, t);
  }), o;
}, be = (e, t, r, o) => {
  e.forEach((a) => {
    if (typeof a == "string") {
      const s = a === "" ? t : Ne(t, a);
      s.classGroupId = r;
      return;
    }
    if (typeof a == "function") {
      if (tt(a)) {
        be(a(o), t, r, o);
        return;
      }
      t.validators.push({
        validator: a,
        classGroupId: r
      });
      return;
    }
    Object.entries(a).forEach(([s, n]) => {
      be(n, Ne(t, s), r, o);
    });
  });
}, Ne = (e, t) => {
  let r = e;
  return t.split(he).forEach((o) => {
    r.nextPart.has(o) || r.nextPart.set(o, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(o);
  }), r;
}, tt = (e) => e.isThemeGetter, rt = (e, t) => t ? e.map(([r, o]) => {
  const a = o.map((s) => typeof s == "string" ? t + s : typeof s == "object" ? Object.fromEntries(Object.entries(s).map(([n, i]) => [t + n, i])) : s);
  return [r, a];
}) : e, ot = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  const a = (s, n) => {
    r.set(s, n), t++, t > e && (t = 0, o = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(s) {
      let n = r.get(s);
      if (n !== void 0)
        return n;
      if ((n = o.get(s)) !== void 0)
        return a(s, n), n;
    },
    set(s, n) {
      r.has(s) ? r.set(s, n) : a(s, n);
    }
  };
}, Le = "!", st = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, o = t.length === 1, a = t[0], s = t.length, n = (i) => {
    const b = [];
    let w = 0, y = 0, x;
    for (let g = 0; g < i.length; g++) {
      let S = i[g];
      if (w === 0) {
        if (S === a && (o || i.slice(g, g + s) === t)) {
          b.push(i.slice(y, g)), y = g + s;
          continue;
        }
        if (S === "/") {
          x = g;
          continue;
        }
      }
      S === "[" ? w++ : S === "]" && w--;
    }
    const v = b.length === 0 ? i : i.substring(y), _ = v.startsWith(Le), M = _ ? v.substring(1) : v, f = x && x > y ? x - y : void 0;
    return {
      modifiers: b,
      hasImportantModifier: _,
      baseClassName: M,
      maybePostfixModifierPosition: f
    };
  };
  return r ? (i) => r({
    className: i,
    parseClassName: n
  }) : n;
}, nt = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((o) => {
    o[0] === "[" ? (t.push(...r.sort(), o), r = []) : r.push(o);
  }), t.push(...r.sort()), t;
}, at = (e) => ({
  cache: ot(e.cacheSize),
  parseClassName: st(e),
  ...Qe(e)
}), it = /\s+/, lt = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: o,
    getConflictingClassGroupIds: a
  } = t, s = [], n = e.trim().split(it);
  let i = "";
  for (let b = n.length - 1; b >= 0; b -= 1) {
    const w = n[b], {
      modifiers: y,
      hasImportantModifier: x,
      baseClassName: v,
      maybePostfixModifierPosition: _
    } = r(w);
    let M = !!_, f = o(M ? v.substring(0, _) : v);
    if (!f) {
      if (!M) {
        i = w + (i.length > 0 ? " " + i : i);
        continue;
      }
      if (f = o(v), !f) {
        i = w + (i.length > 0 ? " " + i : i);
        continue;
      }
      M = !1;
    }
    const g = nt(y).join(":"), S = x ? g + Le : g, C = S + f;
    if (s.includes(C))
      continue;
    s.push(C);
    const B = a(f, M);
    for (let T = 0; T < B.length; ++T) {
      const E = B[T];
      s.push(S + E);
    }
    i = w + (i.length > 0 ? " " + i : i);
  }
  return i;
};
function ct() {
  let e = 0, t, r, o = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = $e(t)) && (o && (o += " "), o += r);
  return o;
}
const $e = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (t = $e(e[o])) && (r && (r += " "), r += t);
  return r;
};
function dt(e, ...t) {
  let r, o, a, s = n;
  function n(b) {
    const w = t.reduce((y, x) => x(y), e());
    return r = at(w), o = r.cache.get, a = r.cache.set, s = i, i(b);
  }
  function i(b) {
    const w = o(b);
    if (w)
      return w;
    const y = lt(b, r);
    return a(b, y), y;
  }
  return function() {
    return s(ct.apply(null, arguments));
  };
}
const h = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, je = /^\[(?:([a-z-]+):)?(.+)\]$/i, ut = /^\d+\/\d+$/, pt = /* @__PURE__ */ new Set(["px", "full", "screen"]), bt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, mt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ht = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, gt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ft = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, j = (e) => K(e) || pt.has(e) || ut.test(e), O = (e) => ee(e, "length", Nt), K = (e) => !!e && !Number.isNaN(Number(e)), pe = (e) => ee(e, "number", K), ne = (e) => !!e && Number.isInteger(Number(e)), yt = (e) => e.endsWith("%") && K(e.slice(0, -1)), p = (e) => je.test(e), G = (e) => bt.test(e), xt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), vt = (e) => ee(e, xt, Be), wt = (e) => ee(e, "position", Be), St = /* @__PURE__ */ new Set(["image", "url"]), kt = (e) => ee(e, St, _t), Ct = (e) => ee(e, "", Mt), ae = () => !0, ee = (e, t, r) => {
  const o = je.exec(e);
  return o ? o[1] ? typeof t == "string" ? o[1] === t : t.has(o[1]) : r(o[2]) : !1;
}, Nt = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  mt.test(e) && !ht.test(e)
), Be = () => !1, Mt = (e) => gt.test(e), _t = (e) => ft.test(e), Pt = () => {
  const e = h("colors"), t = h("spacing"), r = h("blur"), o = h("brightness"), a = h("borderColor"), s = h("borderRadius"), n = h("borderSpacing"), i = h("borderWidth"), b = h("contrast"), w = h("grayscale"), y = h("hueRotate"), x = h("invert"), v = h("gap"), _ = h("gradientColorStops"), M = h("gradientColorStopPositions"), f = h("inset"), g = h("margin"), S = h("opacity"), C = h("padding"), B = h("saturate"), T = h("scale"), E = h("sepia"), te = h("skew"), R = h("space"), re = h("translate"), U = () => ["auto", "contain", "none"], F = () => ["auto", "hidden", "clip", "visible", "scroll"], W = () => ["auto", p, t], m = () => [p, t], H = () => ["", j, O], q = () => ["auto", K, p], D = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], J = () => ["solid", "dashed", "dotted", "double", "none"], N = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], V = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], l = () => ["", "0", p], oe = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], P = () => [K, p];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [ae],
      spacing: [j, O],
      blur: ["none", "", G, p],
      brightness: P(),
      borderColor: [e],
      borderRadius: ["none", "", "full", G, p],
      borderSpacing: m(),
      borderWidth: H(),
      contrast: P(),
      grayscale: l(),
      hueRotate: P(),
      invert: l(),
      gap: m(),
      gradientColorStops: [e],
      gradientColorStopPositions: [yt, O],
      inset: W(),
      margin: W(),
      opacity: P(),
      padding: m(),
      saturate: P(),
      scale: P(),
      sepia: l(),
      skew: P(),
      space: m(),
      translate: m()
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
        columns: [G]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": oe()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": oe()
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
        object: [...D(), p]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: F()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": F()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": F()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: U()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": U()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": U()
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
        inset: [f]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [f]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [f]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [f]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [f]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [f]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [f]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [f]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [f]
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
        z: ["auto", ne, p]
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
        flex: ["1", "auto", "initial", "none", p]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: l()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: l()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", ne, p]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [ae]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", ne, p]
        }, p]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": q()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": q()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [ae]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [ne, p]
        }, p]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": q()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": q()
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
        gap: [v]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [v]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [v]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...V()]
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
        content: ["normal", ...V(), "baseline"]
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
        "place-content": [...V(), "baseline"]
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
        m: [g]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [g]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [g]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [g]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [g]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [g]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [g]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [g]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [g]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [R]
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
        "space-y": [R]
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
          screen: [G]
        }, G]
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
        text: ["base", G, O]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", pe]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [ae]
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
        "line-clamp": ["none", K, pe]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", j, p]
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
        "placeholder-opacity": [S]
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
        "text-opacity": [S]
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
        decoration: [...J(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", j, O]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", j, p]
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
        indent: m()
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
        "bg-opacity": [S]
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
        bg: [...D(), wt]
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
        bg: ["auto", "cover", "contain", vt]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, kt]
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
        from: [M]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [M]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [M]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [_]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [_]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [_]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [s]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [s]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [s]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [s]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [s]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [s]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [s]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [s]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [s]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [s]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [s]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [s]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [s]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [s]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [s]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [i]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [i]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [i]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [i]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [i]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [i]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [i]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [i]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [i]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [S]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...J(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [i]
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
        "divide-y": [i]
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
        "divide-opacity": [S]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: J()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [a]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [a]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [a]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [a]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [a]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [a]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [a]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [a]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [a]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [a]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...J()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [j, p]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [j, O]
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
        ring: H()
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
        "ring-opacity": [S]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [j, O]
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
        shadow: ["", "inner", "none", G, Ct]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [ae]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [S]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...N(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": N()
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
        brightness: [o]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [b]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", G, p]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [w]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [y]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [x]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [B]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [E]
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
        "backdrop-brightness": [o]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [b]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [w]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [y]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [x]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [S]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [B]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [E]
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
        "border-spacing": [n]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [n]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [n]
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
        duration: P()
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
        delay: P()
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
        scale: [T]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [T]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [T]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [ne, p]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [re]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [re]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [te]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [te]
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
        "scroll-m": m()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": m()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": m()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": m()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": m()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": m()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": m()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": m()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": m()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": m()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": m()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": m()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": m()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": m()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": m()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": m()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": m()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": m()
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
        stroke: [j, O, pe]
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
}, At = /* @__PURE__ */ dt(Pt);
function Tt(...e) {
  return At(Ze(e));
}
const Et = "copanel_mobile_desktop_site";
function Rt() {
  try {
    return localStorage.getItem(Et) === "1";
  } catch {
    return !1;
  }
}
function zt(e = window.innerWidth) {
  return Rt() || e >= 1024;
}
const It = Te(null);
function Lt() {
  return Ee(It);
}
function $t() {
  return Lt()?.isWindowed === !0;
}
function jt({ children: e, className: t, constrained: r = !1 }) {
  const { theme: o } = Re(), a = $t(), s = o === "dark", n = !a && !zt();
  return /* @__PURE__ */ d(
    "div",
    {
      className: Tt(
        "flex flex-col transition-colors duration-200",
        a ? "h-full min-h-0" : n ? "min-h-0" : "min-h-screen",
        s ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !a && r && "mx-auto max-w-7xl",
        t
      ),
      children: e
    }
  );
}
class Me extends Error {
  constructor(r, o, a, s) {
    super(o);
    L(this, "code");
    L(this, "status");
    L(this, "details");
    this.code = r, this.status = a, this.details = s;
  }
}
async function Z(e, t = {}) {
  const r = typeof window < "u" ? localStorage.getItem("copanel_token") : null, o = {
    "Content-Type": "application/json",
    ...t.headers || {}
  };
  r && (o.Authorization = `Bearer ${r}`);
  const a = {
    method: t.method || "GET",
    headers: o,
    signal: t.signal
  };
  t.body !== void 0 && (a.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body));
  const s = await fetch(e, a);
  let n = null;
  const i = await s.text();
  if (i)
    try {
      n = JSON.parse(i);
    } catch {
      n = i;
    }
  if (t.raw)
    return n;
  if (!s.ok) {
    const b = n && typeof n == "object" && n.error ? n.error : { code: `HTTP_${s.status}`, message: typeof n == "string" ? n : n?.detail || s.statusText };
    throw new Me(b.code || `HTTP_${s.status}`, b.message || "Request failed", s.status, b.details);
  }
  if (n && typeof n == "object" && "status" in n) {
    if (n.status === "success")
      return n.data !== void 0 ? n.data : n;
    if (n.status === "error" && n.error)
      throw new Me(n.error.code, n.error.message, s.status, n.error.details);
  }
  return n;
}
const Bt = "copanel-platform-sse-degraded", ie = 2e3, Wt = 6e4, Vt = 3;
class Ot {
  constructor() {
    L(this, "source", null);
    L(this, "handlers", /* @__PURE__ */ new Map());
    L(this, "retryDelay", ie);
    L(this, "retryTimer", null);
    L(this, "failureCount", 0);
  }
  on(t, r) {
    let o = this.handlers.get(t);
    return o || (o = /* @__PURE__ */ new Set(), this.handlers.set(t, o)), o.add(r), this.ensureConnected(), () => {
      o.delete(r), o.size === 0 && this.handlers.delete(t), this.teardownIfIdle();
    };
  }
  emit(t, r) {
    const o = this.handlers.get(t);
    o && o.forEach((a) => {
      try {
        a(r);
      } catch (s) {
        console.error("event handler failed", t, s);
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
        this.failureCount = 0, this.retryDelay = ie;
      }), this.source.addEventListener("jobs", (r) => {
        this.onStreamMessage(), this.parseAndEmit("jobs", r.data);
      }), this.source.addEventListener("notifications", (r) => {
        this.onStreamMessage(), this.parseAndEmit("notifications", r.data);
      }), this.source.addEventListener("message", () => {
        this.onStreamMessage();
      }), this.source.onerror = () => {
        this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Vt && window.dispatchEvent(new CustomEvent(Bt)), this.scheduleRetry();
      };
    }
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = ie;
  }
  parseAndEmit(t, r) {
    try {
      const o = JSON.parse(r);
      this.emit(t, o.payload || o);
    } catch {
    }
  }
  scheduleRetry() {
    if (this.retryTimer || this.handlers.size === 0) return;
    const t = this.retryDelay;
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), Wt), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = ie);
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = ie, this.handlers.size > 0 && this.ensureConnected();
  }
}
const ge = new Ot();
function Gt() {
  ge.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || Gt();
});
function We(e) {
  let t = e;
  const r = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (o) => {
      const a = typeof o == "function" ? o(t) : o;
      if (!a || Object.keys(a).length === 0) return;
      let s = !1;
      for (const n of Object.keys(a))
        if (t[n] !== a[n]) {
          s = !0;
          break;
        }
      s && (t = { ...t, ...a }, r.forEach((n) => n()));
    },
    subscribe: (o) => (r.add(o), () => r.delete(o))
  };
}
const Ve = We({ jobs: {}, order: [], lastFetch: 0 });
function Dt() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function _e(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function Q(e, t, r) {
  if (!e || typeof e != "object") return;
  const o = _e(e[t], r);
  if (o) return o;
  const a = _e(e[`${t}_i18n`], r);
  if (a) return a;
  const s = e[`${t}_${r}`];
  if (typeof s == "string" && s) return s;
  const n = e[`${t}_en`];
  if (typeof n == "string" && n) return n;
  const i = e[`${t}_vi`];
  if (typeof i == "string" && i) return i;
}
function Ut(e) {
  const t = Dt(), r = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: Q(e, "title", t) || Q(r, "title", t) || e?.title || "",
    message: Q(e, "message", t) || Q(r, "message", t) || e?.message,
    error: Q(e, "error", t) || Q(r, "error", t) || e?.error || null
  };
}
function Pe(e) {
  const t = Ut(e);
  Ve.setState((r) => {
    const o = { ...r.jobs, [t.id]: { ...r.jobs[t.id], ...t } };
    let a = r.order;
    return a.includes(t.id) || (a = [t.id, ...a].slice(0, 200)), { jobs: o, order: a };
  });
}
ge.on("jobs", (e) => {
  if (e?.job) {
    Pe(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = Ve.getState().jobs[e.job_id];
    t && Pe({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const me = We({ inbox: [], unread: 0, toasts: [] }), Ft = 6e3;
function Ht() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Ae(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function ce(e, t, r) {
  if (!e || typeof e != "object") return;
  const o = Ae(e[t], r);
  if (o) return o;
  const a = Ae(e[`${t}_i18n`], r);
  if (a) return a;
  const s = e[`${t}_${r}`];
  if (typeof s == "string" && s) return s;
  const n = e[`${t}_en`];
  if (typeof n == "string" && n) return n;
  const i = e[`${t}_vi`];
  if (typeof i == "string" && i) return i;
}
function qt(e) {
  const t = Ht(), r = e?.payload && typeof e.payload == "object" ? e.payload : {}, o = ce(e, "title", t) || ce(r, "title", t) || e?.title || "", a = ce(e, "body", t) || ce(r, "body", t) || e?.body || null;
  return {
    ...e,
    title: o,
    body: a
  };
}
function Jt(e) {
  me.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    me.setState((t) => ({ toasts: t.toasts.filter((r) => r.id !== e.id) }));
  }, Ft);
}
ge.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = qt(e.notification);
    Jt({ ...t, ephemeral: !0 }), me.setState((r) => ({
      inbox: [t, ...r.inbox].slice(0, 200),
      unread: r.unread + 1
    }));
  }
});
function Kt() {
  const { theme: e, language: t } = Re(), r = e === "dark", [o, a] = k(null), [s, n] = k(null), [i, b] = k(null), [w, y] = k(null), [x, v] = k(!1), [_, M] = k("0.0.0.0"), [f, g] = k(8085), [S, C] = k(445), [B, T] = k("/"), [E, te] = k("copanel"), [R, re] = k(!1), [U, F] = k(!1), [W, m] = k(!1), [H, q] = k(null), [D, J] = k(!0), [N, V] = k(""), l = {
    en: {
      title: "WebDAV & SMB",
      desc: "Share files over WebDAV and SMB. Login with the same username/password as the panel root (superadmin) account.",
      settings: "Settings",
      status: "Status",
      bindAddress: "Bind address",
      webdavPort: "WebDAV port",
      smbPort: "SMB port",
      sharePath: "Share folder",
      shareName: "Share name",
      webdavRootMount: "WebDAV root mount (IP:port only)",
      webdavRootMountHint: "Serve files at http://IP:port/ — no /share-name/ in URL. SMB still uses share name below.",
      enableWebdav: "Enable WebDAV",
      enableSmb: "Enable SMB",
      save: "Save & apply",
      saving: "Saving...",
      webdavUrl: "WebDAV URL",
      smbPath: "SMB path (Windows)",
      loginUser: "Login user",
      loginHint: "Password = same as panel root user password",
      running: "Running",
      stopped: "Stopped",
      enabled: "Enabled",
      disabled: "Disabled",
      start: "Start",
      stop: "Stop",
      restart: "Restart",
      applySmb: "Apply SMB config",
      syncPassword: "Sync SMB password",
      serverIps: "Server IPs",
      deps: "Dependencies",
      sambaOk: "Samba installed",
      sambaMissing: "Samba not installed (apt install samba)",
      wsgidavOk: "wsgidav ready",
      wsgidavMissing: "wsgidav missing (pip install wsgidav)",
      linuxOnly: "SMB requires Linux production host",
      saved: "Configuration saved.",
      copy: "Copy",
      smbPassword: "Panel password (for SMB sync)",
      smbPasswordHint: "Required once if the server has no stored admin password file. Must match your CoPanel login password.",
      smbPasswordRequired: "Enter your panel superadmin password to enable or sync SMB.",
      backendTooOld: "Backend module is too old to save root mount (need webdav >= 1.0.6). Upgrade from AppStore or copy backend via SSH, then restart copanel.",
      moduleVersion: "Module version"
    },
    vi: {
      title: "WebDAV & SMB",
      desc: "Chia sẻ file qua WebDAV và SMB. Đăng nhập bằng cùng tài khoản root (superadmin) của panel.",
      settings: "Cấu hình",
      status: "Trạng thái",
      bindAddress: "Địa chỉ lắng nghe",
      webdavPort: "Cổng WebDAV",
      smbPort: "Cổng SMB",
      sharePath: "Thư mục chia sẻ",
      shareName: "Tên share",
      webdavRootMount: "WebDAV mount tại root (chỉ IP:port)",
      webdavRootMountHint: "Truy cập http://IP:port/ — không cần /tên-share/. SMB vẫn dùng tên share bên dưới.",
      enableWebdav: "Bật WebDAV",
      enableSmb: "Bật SMB",
      save: "Lưu & áp dụng",
      saving: "Đang lưu...",
      webdavUrl: "URL WebDAV",
      smbPath: "Đường dẫn SMB (Windows)",
      loginUser: "Tài khoản đăng nhập",
      loginHint: "Mật khẩu = mật khẩu user root của panel",
      running: "Đang chạy",
      stopped: "Đã dừng",
      enabled: "Đã bật",
      disabled: "Đã tắt",
      start: "Khởi động",
      stop: "Dừng",
      restart: "Khởi động lại",
      applySmb: "Áp dụng cấu hình SMB",
      syncPassword: "Đồng bộ mật khẩu SMB",
      serverIps: "IP máy chủ",
      deps: "Phụ thuộc",
      sambaOk: "Đã cài Samba",
      sambaMissing: "Chưa cài Samba (apt install samba)",
      wsgidavOk: "wsgidav sẵn sàng",
      wsgidavMissing: "Thiếu wsgidav (pip install wsgidav)",
      linuxOnly: "SMB cần máy chủ Linux production",
      saved: "Đã lưu cấu hình.",
      copy: "Sao chép",
      smbPassword: "Mật khẩu panel (đồng bộ SMB)",
      smbPasswordHint: "Nhập một lần nếu server chưa có file mật khẩu admin. Phải trùng mật khẩu đăng nhập CoPanel.",
      smbPasswordRequired: "Nhập mật khẩu superadmin panel để bật hoặc đồng bộ SMB.",
      backendTooOld: "Backend module quá cũ, không lưu được root mount (cần webdav >= 1.0.6). Nâng cấp AppStore hoặc copy backend qua SSH, rồi restart copanel.",
      moduleVersion: "Phiên bản module"
    }
  }[t], oe = (c) => c.split(".").map((A) => parseInt(A, 10) || 0), P = (c, A) => {
    const Se = oe(c), ke = oe(A);
    for (let X = 0; X < 3; X += 1) {
      if ((Se[X] || 0) < (ke[X] || 0)) return !0;
      if ((Se[X] || 0) > (ke[X] || 0)) return !1;
    }
    return !1;
  }, se = Fe(async () => {
    const [c, A] = await Promise.all([
      Z("/api/webdav/config"),
      Z("/api/webdav/status")
    ]);
    a(c), n(A), M(c.bind_address), g(c.webdav_port), C(c.smb_port), T(c.share_path), te(c.share_name), re(!!c.webdav_root_mount), F(c.webdav_enabled), m(c.smb_enabled), q(c.module_version || null), J(c.supports_root_mount !== !1 && !P(c.module_version || "0.0.0", "1.0.6"));
  }, []);
  He(() => {
    se().catch((c) => b(c.message || "Failed to load"));
  }, [se]);
  const Oe = async () => {
    if (!D && R) {
      b(l.backendTooOld);
      return;
    }
    if (W && !o?.admin_password_file_present && !N.trim()) {
      b(l.smbPasswordRequired);
      return;
    }
    v(!0), b(null), y(null);
    try {
      const c = {
        bind_address: _,
        webdav_port: f,
        smb_port: S,
        share_path: B,
        share_name: E,
        webdav_root_mount: R,
        webdav_enabled: U,
        smb_enabled: W
      };
      N.trim() && (c.smb_password = N), await Z("/api/webdav/config", { method: "PUT", body: c }), y(l.saved), V(""), await se(), R && !D && b(l.backendTooOld);
    } catch (c) {
      b(c.message || "Save failed");
    } finally {
      v(!1);
    }
  }, de = async (c) => {
    v(!0), b(null);
    try {
      await Z(`/api/webdav/webdav/${c}`, { method: "POST" }), await se();
    } catch (A) {
      b(A.message || "Action failed");
    } finally {
      v(!1);
    }
  }, fe = async (c) => {
    if (c === "apply" && !o?.admin_password_file_present && !N.trim()) {
      b(l.smbPasswordRequired);
      return;
    }
    v(!0), b(null);
    try {
      const A = N.trim() ? { password: N } : {};
      await Z(`/api/webdav/smb/${c}`, { method: "POST", body: A }), N.trim() && V(""), await se();
    } catch (A) {
      b(A.message || "Action failed");
    } finally {
      v(!1);
    }
  }, Ge = async () => {
    if (!o?.admin_password_file_present && !N.trim()) {
      b(l.smbPasswordRequired);
      return;
    }
    v(!0), b(null);
    try {
      const c = N.trim() ? { password: N } : {};
      await Z("/api/webdav/smb/sync-password", { method: "POST", body: c }), V(""), y(t === "vi" ? "Đã đồng bộ mật khẩu SMB." : "SMB password synced.");
    } catch (c) {
      b(c.message || "Sync failed");
    } finally {
      v(!1);
    }
  }, ye = (c) => {
    navigator.clipboard.writeText(c).catch(() => {
    }), y(t === "vi" ? "Đã sao chép." : "Copied.");
  }, le = `${r ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} border rounded-xl p-5`, Y = `w-full px-3 py-2 rounded-lg border text-sm ${r ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-slate-50 border-slate-300"}`, z = `block text-xs font-medium mb-1 ${r ? "text-slate-400" : "text-slate-500"}`, I = (c = !1) => `px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 ${c ? "bg-blue-600 text-white hover:bg-blue-700" : r ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`, xe = (c) => `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`;
  if (!o || !s)
    return /* @__PURE__ */ d("div", { className: `p-6 ${r ? "text-slate-300" : "text-slate-600"}`, children: /* @__PURE__ */ d($.Loader2, { className: "w-6 h-6 animate-spin" }) });
  const ue = o.local_ips[0] || "YOUR_SERVER_IP", ve = R ? `http://${ue}:${f}/` : `http://${ue}:${f}/${E}/`, we = `\\\\${ue}\\${E}`;
  return /* @__PURE__ */ d(jt, { constrained: !0, children: /* @__PURE__ */ u("div", { className: `p-4 md:p-6 space-y-6 ${r ? "text-slate-100" : "text-slate-900"}`, children: [
    /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ d($.FolderSync, { className: "w-7 h-7 text-blue-500" }),
        l.title
      ] }),
      /* @__PURE__ */ d("p", { className: `mt-1 text-sm ${r ? "text-slate-400" : "text-slate-500"}`, children: l.desc })
    ] }),
    i && /* @__PURE__ */ d("div", { className: "rounded-lg border border-red-300 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 px-4 py-3 text-sm text-red-700 dark:text-red-300", children: i }),
    w && /* @__PURE__ */ d("div", { className: "rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/30 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300", children: w }),
    !D && /* @__PURE__ */ u("div", { className: "rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 px-4 py-3 text-sm text-amber-800 dark:text-amber-200", children: [
      l.backendTooOld,
      H ? ` (${l.moduleVersion}: ${H})` : ""
    ] }),
    /* @__PURE__ */ u("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ u("div", { className: le, children: [
        /* @__PURE__ */ u("h2", { className: "font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ d($.Settings, { className: "w-4 h-4" }),
          l.settings
        ] }),
        /* @__PURE__ */ u("div", { className: "space-y-3", children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ d("label", { className: z, children: l.bindAddress }),
            /* @__PURE__ */ d("input", { className: Y, value: _, onChange: (c) => M(c.target.value) })
          ] }),
          /* @__PURE__ */ u("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ d("label", { className: z, children: l.webdavPort }),
              /* @__PURE__ */ d(
                "input",
                {
                  className: Y,
                  type: "number",
                  value: f,
                  onChange: (c) => g(Number(c.target.value))
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ d("label", { className: z, children: l.smbPort }),
              /* @__PURE__ */ d(
                "input",
                {
                  className: Y,
                  type: "number",
                  value: S,
                  onChange: (c) => C(Number(c.target.value))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ d("label", { className: z, children: l.sharePath }),
            /* @__PURE__ */ d("input", { className: Y, value: B, onChange: (c) => T(c.target.value) })
          ] }),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ d("label", { className: z, children: l.shareName }),
            /* @__PURE__ */ d("input", { className: Y, value: E, onChange: (c) => te(c.target.value) })
          ] }),
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
            /* @__PURE__ */ d(
              "input",
              {
                type: "checkbox",
                checked: R,
                disabled: !D,
                onChange: (c) => re(c.target.checked)
              }
            ),
            l.webdavRootMount
          ] }),
          R && /* @__PURE__ */ d("p", { className: `text-xs -mt-1 ${r ? "text-slate-400" : "text-slate-500"}`, children: l.webdavRootMountHint }),
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
            /* @__PURE__ */ d("input", { type: "checkbox", checked: U, onChange: (c) => F(c.target.checked) }),
            l.enableWebdav
          ] }),
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
            /* @__PURE__ */ d("input", { type: "checkbox", checked: W, onChange: (c) => m(c.target.checked) }),
            l.enableSmb
          ] }),
          (W || !o.admin_password_file_present) && /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ d("label", { className: z, children: l.smbPassword }),
            /* @__PURE__ */ d(
              "input",
              {
                className: Y,
                type: "password",
                value: N,
                onChange: (c) => V(c.target.value),
                autoComplete: "current-password",
                placeholder: o.admin_username
              }
            ),
            /* @__PURE__ */ d("p", { className: `mt-1 text-xs ${r ? "text-slate-400" : "text-slate-500"}`, children: l.smbPasswordHint })
          ] }),
          /* @__PURE__ */ d("button", { className: I(!0), disabled: x, onClick: Oe, children: x ? l.saving : l.save })
        ] })
      ] }),
      /* @__PURE__ */ u("div", { className: le, children: [
        /* @__PURE__ */ u("h2", { className: "font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ d($.Activity, { className: "w-4 h-4" }),
          l.status
        ] }),
        /* @__PURE__ */ u("div", { className: "space-y-4 text-sm", children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ u("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ d("span", { className: "font-medium", children: "WebDAV" }),
              /* @__PURE__ */ d("span", { className: xe(s.webdav.running), children: s.webdav.running ? l.running : l.stopped })
            ] }),
            /* @__PURE__ */ d("div", { className: `text-xs mb-2 ${r ? "text-slate-400" : "text-slate-500"}`, children: s.webdav.enabled ? l.enabled : l.disabled }),
            /* @__PURE__ */ u("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ d("button", { className: I(), disabled: x, onClick: () => de("start"), children: l.start }),
              /* @__PURE__ */ d("button", { className: I(), disabled: x, onClick: () => de("stop"), children: l.stop }),
              /* @__PURE__ */ d("button", { className: I(), disabled: x, onClick: () => de("restart"), children: l.restart })
            ] })
          ] }),
          /* @__PURE__ */ u("div", { className: "border-t pt-4 border-slate-700/30", children: [
            /* @__PURE__ */ u("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ d("span", { className: "font-medium", children: "SMB" }),
              /* @__PURE__ */ d("span", { className: xe(!!s.smb.running), children: s.smb.running ? l.running : l.stopped })
            ] }),
            /* @__PURE__ */ u("div", { className: `text-xs mb-2 ${r ? "text-slate-400" : "text-slate-500"}`, children: [
              s.smb.enabled ? l.enabled : l.disabled,
              !o.is_linux && ` — ${l.linuxOnly}`
            ] }),
            /* @__PURE__ */ u("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ d("button", { className: I(), disabled: x, onClick: () => fe("apply"), children: l.applySmb }),
              /* @__PURE__ */ d("button", { className: I(), disabled: x, onClick: () => fe("restart"), children: l.restart }),
              /* @__PURE__ */ d("button", { className: I(), disabled: x, onClick: Ge, children: l.syncPassword })
            ] })
          ] }),
          /* @__PURE__ */ u("div", { className: "border-t pt-4 border-slate-700/30 space-y-2", children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ d("span", { className: z, children: l.loginUser }),
              /* @__PURE__ */ d("code", { className: "text-sm font-mono", children: s.admin_username })
            ] }),
            /* @__PURE__ */ d("p", { className: `text-xs ${r ? "text-slate-400" : "text-slate-500"}`, children: l.loginHint })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u("div", { className: le, children: [
      /* @__PURE__ */ d("h2", { className: "font-semibold mb-3", children: l.serverIps }),
      /* @__PURE__ */ d("div", { className: "flex flex-wrap gap-2 mb-4", children: o.local_ips.map((c) => /* @__PURE__ */ d("span", { className: "px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 text-sm font-mono", children: c }, c)) }),
      /* @__PURE__ */ u("div", { className: "grid md:grid-cols-2 gap-4 text-sm", children: [
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ d("span", { className: z, children: l.webdavUrl }),
          /* @__PURE__ */ u("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ d("code", { className: "flex-1 text-xs font-mono break-all p-2 rounded bg-slate-500/10", children: ve }),
            /* @__PURE__ */ d("button", { className: I(), onClick: () => ye(ve), children: l.copy })
          ] })
        ] }),
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ d("span", { className: z, children: l.smbPath }),
          /* @__PURE__ */ u("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ d("code", { className: "flex-1 text-xs font-mono break-all p-2 rounded bg-slate-500/10", children: we }),
            /* @__PURE__ */ d("button", { className: I(), onClick: () => ye(we), children: l.copy })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u("div", { className: le, children: [
      /* @__PURE__ */ d("h2", { className: "font-semibold mb-3", children: l.deps }),
      /* @__PURE__ */ u("ul", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ u("li", { className: "flex items-center gap-2", children: [
          o.wsgidav_available ? /* @__PURE__ */ d($.CheckCircle, { className: "w-4 h-4 text-emerald-500" }) : /* @__PURE__ */ d($.AlertCircle, { className: "w-4 h-4 text-amber-500" }),
          o.wsgidav_available ? l.wsgidavOk : l.wsgidavMissing
        ] }),
        /* @__PURE__ */ u("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ d($.Info, { className: "w-4 h-4 text-blue-500" }),
          l.moduleVersion,
          ": ",
          /* @__PURE__ */ d("code", { className: "font-mono", children: H || "unknown" })
        ] }),
        /* @__PURE__ */ u("li", { className: "flex items-center gap-2", children: [
          o.samba_installed ? /* @__PURE__ */ d($.CheckCircle, { className: "w-4 h-4 text-emerald-500" }) : /* @__PURE__ */ d($.AlertCircle, { className: "w-4 h-4 text-amber-500" }),
          o.samba_installed ? l.sambaOk : l.sambaMissing
        ] })
      ] })
    ] })
  ] }) });
}
export {
  Kt as default
};
