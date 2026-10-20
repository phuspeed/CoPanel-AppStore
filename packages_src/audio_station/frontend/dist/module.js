var Xt = Object.defineProperty;
var Zt = (e, r, n) => r in e ? Xt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[r] = n;
var V = (e, r, n) => Zt(e, typeof r != "symbol" ? r + "" : r, n);
import { jsx as o, jsxs as d, Fragment as Kt } from "react/jsx-runtime";
import { createContext as ft, useContext as gt, useState as f, useEffect as te, useMemo as Ee, useRef as er, useCallback as ce } from "react";
import { useOutletContext as tr } from "react-router-dom";
import * as b from "lucide-react";
import { createPortal as it } from "react-dom";
const rr = ft(null);
function nr() {
  return gt(rr);
}
const sr = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function qe() {
  const e = nr(), r = tr();
  return e || (r?.theme ? {
    theme: r.theme,
    setTheme: r.setTheme ?? (() => {
    }),
    language: r.language ?? "en",
    setLanguage: r.setLanguage ?? (() => {
    })
  } : sr);
}
function yt(e) {
  var r, n, t = "";
  if (typeof e == "string" || typeof e == "number") t += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var c = e.length;
    for (r = 0; r < c; r++) e[r] && (n = yt(e[r])) && (t && (t += " "), t += n);
  } else for (n in e) e[n] && (t && (t += " "), t += n);
  return t;
}
function or() {
  for (var e, r, n = 0, t = "", c = arguments.length; n < c; n++) (e = arguments[n]) && (r = yt(e)) && (t && (t += " "), t += r);
  return t;
}
const Ve = "-", ar = (e) => {
  const r = ir(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: t
  } = e;
  return {
    getClassGroupId: (l) => {
      const u = l.split(Ve);
      return u[0] === "" && u.length !== 1 && u.shift(), xt(u, r) || lr(l);
    },
    getConflictingClassGroupIds: (l, u) => {
      const i = n[l] || [];
      return u && t[l] ? [...i, ...t[l]] : i;
    }
  };
}, xt = (e, r) => {
  if (e.length === 0)
    return r.classGroupId;
  const n = e[0], t = r.nextPart.get(n), c = t ? xt(e.slice(1), t) : void 0;
  if (c)
    return c;
  if (r.validators.length === 0)
    return;
  const a = e.join(Ve);
  return r.validators.find(({
    validator: l
  }) => l(a))?.classGroupId;
}, ct = /^\[(.+)\]$/, lr = (e) => {
  if (ct.test(e)) {
    const r = ct.exec(e)[1], n = r?.substring(0, r.indexOf(":"));
    if (n)
      return "arbitrary.." + n;
  }
}, ir = (e) => {
  const {
    theme: r,
    prefix: n
  } = e, t = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return dr(Object.entries(e.classGroups), n).forEach(([a, l]) => {
    De(l, t, a, r);
  }), t;
}, De = (e, r, n, t) => {
  e.forEach((c) => {
    if (typeof c == "string") {
      const a = c === "" ? r : dt(r, c);
      a.classGroupId = n;
      return;
    }
    if (typeof c == "function") {
      if (cr(c)) {
        De(c(t), r, n, t);
        return;
      }
      r.validators.push({
        validator: c,
        classGroupId: n
      });
      return;
    }
    Object.entries(c).forEach(([a, l]) => {
      De(l, dt(r, a), n, t);
    });
  });
}, dt = (e, r) => {
  let n = e;
  return r.split(Ve).forEach((t) => {
    n.nextPart.has(t) || n.nextPart.set(t, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), n = n.nextPart.get(t);
  }), n;
}, cr = (e) => e.isThemeGetter, dr = (e, r) => r ? e.map(([n, t]) => {
  const c = t.map((a) => typeof a == "string" ? r + a : typeof a == "object" ? Object.fromEntries(Object.entries(a).map(([l, u]) => [r + l, u])) : a);
  return [n, c];
}) : e, ur = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, n = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  const c = (a, l) => {
    n.set(a, l), r++, r > e && (r = 0, t = n, n = /* @__PURE__ */ new Map());
  };
  return {
    get(a) {
      let l = n.get(a);
      if (l !== void 0)
        return l;
      if ((l = t.get(a)) !== void 0)
        return c(a, l), l;
    },
    set(a, l) {
      n.has(a) ? n.set(a, l) : c(a, l);
    }
  };
}, wt = "!", mr = (e) => {
  const {
    separator: r,
    experimentalParseClassName: n
  } = e, t = r.length === 1, c = r[0], a = r.length, l = (u) => {
    const i = [];
    let g = 0, h = 0, $;
    for (let v = 0; v < u.length; v++) {
      let C = u[v];
      if (g === 0) {
        if (C === c && (t || u.slice(v, v + a) === r)) {
          i.push(u.slice(h, v)), h = v + a;
          continue;
        }
        if (C === "/") {
          $ = v;
          continue;
        }
      }
      C === "[" ? g++ : C === "]" && g--;
    }
    const y = i.length === 0 ? u : u.substring(h), z = y.startsWith(wt), P = z ? y.substring(1) : y, S = $ && $ > h ? $ - h : void 0;
    return {
      modifiers: i,
      hasImportantModifier: z,
      baseClassName: P,
      maybePostfixModifierPosition: S
    };
  };
  return n ? (u) => n({
    className: u,
    parseClassName: l
  }) : l;
}, pr = (e) => {
  if (e.length <= 1)
    return e;
  const r = [];
  let n = [];
  return e.forEach((t) => {
    t[0] === "[" ? (r.push(...n.sort(), t), n = []) : n.push(t);
  }), r.push(...n.sort()), r;
}, hr = (e) => ({
  cache: ur(e.cacheSize),
  parseClassName: mr(e),
  ...ar(e)
}), br = /\s+/, fr = (e, r) => {
  const {
    parseClassName: n,
    getClassGroupId: t,
    getConflictingClassGroupIds: c
  } = r, a = [], l = e.trim().split(br);
  let u = "";
  for (let i = l.length - 1; i >= 0; i -= 1) {
    const g = l[i], {
      modifiers: h,
      hasImportantModifier: $,
      baseClassName: y,
      maybePostfixModifierPosition: z
    } = n(g);
    let P = !!z, S = t(P ? y.substring(0, z) : y);
    if (!S) {
      if (!P) {
        u = g + (u.length > 0 ? " " + u : u);
        continue;
      }
      if (S = t(y), !S) {
        u = g + (u.length > 0 ? " " + u : u);
        continue;
      }
      P = !1;
    }
    const v = pr(h).join(":"), C = $ ? v + wt : v, T = C + S;
    if (a.includes(T))
      continue;
    a.push(T);
    const re = c(S, P);
    for (let U = 0; U < re.length; ++U) {
      const D = re[U];
      a.push(C + D);
    }
    u = g + (u.length > 0 ? " " + u : u);
  }
  return u;
};
function gr() {
  let e = 0, r, n, t = "";
  for (; e < arguments.length; )
    (r = arguments[e++]) && (n = vt(r)) && (t && (t += " "), t += n);
  return t;
}
const vt = (e) => {
  if (typeof e == "string")
    return e;
  let r, n = "";
  for (let t = 0; t < e.length; t++)
    e[t] && (r = vt(e[t])) && (n && (n += " "), n += r);
  return n;
};
function yr(e, ...r) {
  let n, t, c, a = l;
  function l(i) {
    const g = r.reduce((h, $) => $(h), e());
    return n = hr(g), t = n.cache.get, c = n.cache.set, a = u, u(i);
  }
  function u(i) {
    const g = t(i);
    if (g)
      return g;
    const h = fr(i, n);
    return c(i, h), h;
  }
  return function() {
    return a(gr.apply(null, arguments));
  };
}
const w = (e) => {
  const r = (n) => n[e] || [];
  return r.isThemeGetter = !0, r;
}, Nt = /^\[(?:([a-z-]+):)?(.+)\]$/i, xr = /^\d+\/\d+$/, wr = /* @__PURE__ */ new Set(["px", "full", "screen"]), vr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Nr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, kr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Cr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Sr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Q = (e) => ue(e) || wr.has(e) || xr.test(e), K = (e) => me(e, "length", Rr), ue = (e) => !!e && !Number.isNaN(Number(e)), Fe = (e) => me(e, "number", ue), fe = (e) => !!e && Number.isInteger(Number(e)), $r = (e) => e.endsWith("%") && ue(e.slice(0, -1)), p = (e) => Nt.test(e), ee = (e) => vr.test(e), Tr = /* @__PURE__ */ new Set(["length", "size", "percentage"]), _r = (e) => me(e, Tr, kt), Ar = (e) => me(e, "position", kt), Pr = /* @__PURE__ */ new Set(["image", "url"]), Mr = (e) => me(e, Pr, Ir), Lr = (e) => me(e, "", zr), ge = () => !0, me = (e, r, n) => {
  const t = Nt.exec(e);
  return t ? t[1] ? typeof r == "string" ? t[1] === r : r.has(t[1]) : n(t[2]) : !1;
}, Rr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Nr.test(e) && !kr.test(e)
), kt = () => !1, zr = (e) => Cr.test(e), Ir = (e) => Sr.test(e), jr = () => {
  const e = w("colors"), r = w("spacing"), n = w("blur"), t = w("brightness"), c = w("borderColor"), a = w("borderRadius"), l = w("borderSpacing"), u = w("borderWidth"), i = w("contrast"), g = w("grayscale"), h = w("hueRotate"), $ = w("invert"), y = w("gap"), z = w("gradientColorStops"), P = w("gradientColorStopPositions"), S = w("inset"), v = w("margin"), C = w("opacity"), T = w("padding"), re = w("saturate"), U = w("scale"), D = w("sepia"), Me = w("skew"), pe = w("space"), _ = w("translate"), W = () => ["auto", "contain", "none"], M = () => ["auto", "hidden", "clip", "visible", "scroll"], H = () => ["auto", p, r], x = () => [p, r], se = () => ["", Q, K], j = () => ["auto", ue, p], xe = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], E = () => ["solid", "dashed", "dotted", "double", "none"], Y = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], I = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], A = () => ["", "0", p], he = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], L = () => [ue, p];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [ge],
      spacing: [Q, K],
      blur: ["none", "", ee, p],
      brightness: L(),
      borderColor: [e],
      borderRadius: ["none", "", "full", ee, p],
      borderSpacing: x(),
      borderWidth: se(),
      contrast: L(),
      grayscale: A(),
      hueRotate: L(),
      invert: A(),
      gap: x(),
      gradientColorStops: [e],
      gradientColorStopPositions: [$r, K],
      inset: H(),
      margin: H(),
      opacity: L(),
      padding: x(),
      saturate: L(),
      scale: L(),
      sepia: A(),
      skew: L(),
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
        columns: [ee]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": he()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": he()
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
        object: [...xe(), p]
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
        overscroll: W()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": W()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": W()
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
        z: ["auto", fe, p]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: H()
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
        order: ["first", "last", "none", fe, p]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [ge]
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
        "col-start": j()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": j()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [ge]
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
        "row-start": j()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": j()
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
        justify: ["normal", ...I()]
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
        content: ["normal", ...I(), "baseline"]
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
        "place-content": [...I(), "baseline"]
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
        p: [T]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [T]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [T]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [T]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [T]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [T]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [T]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [T]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [T]
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
          screen: [ee]
        }, ee]
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
        text: ["base", ee, K]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Fe]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [ge]
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
        "line-clamp": ["none", ue, Fe]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Q, p]
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
        decoration: [...E(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Q, K]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Q, p]
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
        bg: [...xe(), Ar]
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
        bg: ["auto", "cover", "contain", _r]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Mr]
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
        from: [P]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [P]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [P]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [z]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [z]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [z]
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
        border: [u]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [u]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [u]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [u]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [u]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [u]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [u]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [u]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [u]
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
        border: [...E(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [u]
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
        "divide-y": [u]
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
        divide: E()
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
        outline: ["", ...E()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Q, p]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Q, K]
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
        "ring-opacity": [C]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Q, K]
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
        shadow: ["", "inner", "none", ee, Lr]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [ge]
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
        brightness: [t]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [i]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", ee, p]
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
        "hue-rotate": [h]
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
        sepia: [D]
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
        "backdrop-brightness": [t]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [i]
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
        "backdrop-hue-rotate": [h]
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
        "backdrop-opacity": [C]
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
        "backdrop-sepia": [D]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", p]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: L()
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
        delay: L()
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
        scale: [U]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [U]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [U]
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
        "skew-x": [Me]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [Me]
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
        stroke: [Q, K, Fe]
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
}, Er = /* @__PURE__ */ yr(jr);
function O(...e) {
  return Er(or(e));
}
const Fr = "copanel_mobile_desktop_site";
function Gr() {
  try {
    return localStorage.getItem(Fr) === "1";
  } catch {
    return !1;
  }
}
function We(e = window.innerWidth) {
  return Gr() || e >= 1024;
}
const Or = ft(null);
function Ct() {
  return gt(Or);
}
function St() {
  return Ct()?.isWindowed === !0;
}
function Ur({ children: e, className: r, constrained: n = !1 }) {
  const { theme: t } = qe(), c = St(), a = t === "dark", l = !c && !We();
  return /* @__PURE__ */ o(
    "div",
    {
      className: O(
        "flex flex-col transition-colors duration-200",
        c ? "h-full min-h-0" : l ? "min-h-0" : "min-h-screen",
        a ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !c && n && "mx-auto max-w-7xl",
        r
      ),
      children: e
    }
  );
}
function Dr({
  isDark: e,
  sidebar: r,
  children: n,
  mobileTitle: t,
  className: c
}) {
  const a = St(), [l, u] = f(!1), [i, g] = f(() => We());
  te(() => {
    const y = () => g(We());
    return window.addEventListener("resize", y), () => window.removeEventListener("resize", y);
  }, []);
  const h = !a && !i;
  te(() => {
    i && u(!1);
  }, [i]);
  const $ = () => u(!1);
  return h ? /* @__PURE__ */ d("div", { className: O("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", c), children: [
    /* @__PURE__ */ d(
      "div",
      {
        className: O(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2.5",
          e ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white"
        ),
        children: [
          /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              onClick: () => u(!0),
              className: O(
                "inline-flex items-center justify-center rounded-lg p-2",
                e ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ o(b.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          t ? /* @__PURE__ */ o("span", { className: O("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: t }) : null
        ]
      }
    ),
    l ? /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: $
      }
    ) : null,
    /* @__PURE__ */ o(
      "div",
      {
        className: O(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          l ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: $,
        children: r
      }
    ),
    /* @__PURE__ */ o("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: n })
  ] }) : /* @__PURE__ */ d("div", { className: O("flex h-full min-h-0 flex-1 overflow-hidden", c), children: [
    r,
    /* @__PURE__ */ o("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: n })
  ] });
}
const Wr = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function Ge({
  open: e,
  onClose: r,
  children: n,
  title: t,
  className: c,
  maxWidth: a = "lg",
  closeOnBackdropClick: l = !0
}) {
  const { theme: u } = qe(), i = u === "dark", g = Ct();
  if (!e) return null;
  const h = /* @__PURE__ */ o(
    "div",
    {
      className: O(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        g?.isWindowed ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: l ? r : void 0,
      children: /* @__PURE__ */ d(
        "div",
        {
          className: O(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            Wr[a],
            i ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            c
          ),
          onClick: ($) => $.stopPropagation(),
          children: [
            t && /* @__PURE__ */ d(
              "div",
              {
                className: O(
                  "flex items-center justify-between border-b px-4 py-3",
                  i ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ o("h3", { className: "text-sm font-bold", children: t }),
                  /* @__PURE__ */ o("button", { type: "button", onClick: r, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ o(b.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            n
          ]
        }
      )
    }
  );
  return g?.isWindowed && g.viewportRef.current ? it(h, g.viewportRef.current) : it(h, document.body);
}
class ut extends Error {
  constructor(n, t, c, a) {
    super(t);
    V(this, "code");
    V(this, "status");
    V(this, "details");
    this.code = n, this.status = c, this.details = a;
  }
}
async function k(e, r = {}) {
  const n = typeof window < "u" ? localStorage.getItem("copanel_token") : null, t = {
    "Content-Type": "application/json",
    ...r.headers || {}
  };
  n && (t.Authorization = `Bearer ${n}`);
  const c = {
    method: r.method || "GET",
    headers: t,
    signal: r.signal
  };
  r.body !== void 0 && (c.body = typeof r.body == "string" ? r.body : JSON.stringify(r.body));
  const a = await fetch(e, c);
  let l = null;
  const u = await a.text();
  if (u)
    try {
      l = JSON.parse(u);
    } catch {
      l = u;
    }
  if (r.raw)
    return l;
  if (!a.ok) {
    const i = l && typeof l == "object" && l.error ? l.error : { code: `HTTP_${a.status}`, message: typeof l == "string" ? l : l?.detail || a.statusText };
    throw new ut(i.code || `HTTP_${a.status}`, i.message || "Request failed", a.status, i.details);
  }
  if (l && typeof l == "object" && "status" in l) {
    if (l.status === "success")
      return l.data !== void 0 ? l.data : l;
    if (l.status === "error" && l.error)
      throw new ut(l.error.code, l.error.message, a.status, l.error.details);
  }
  return l;
}
const Br = "copanel-platform-sse-degraded", ye = 2e3, qr = 6e4, Vr = 3;
class Qr {
  constructor() {
    V(this, "source", null);
    V(this, "handlers", /* @__PURE__ */ new Map());
    V(this, "retryDelay", ye);
    V(this, "retryTimer", null);
    V(this, "failureCount", 0);
  }
  on(r, n) {
    let t = this.handlers.get(r);
    return t || (t = /* @__PURE__ */ new Set(), this.handlers.set(r, t)), t.add(n), this.ensureConnected(), () => {
      t.delete(n), t.size === 0 && this.handlers.delete(r), this.teardownIfIdle();
    };
  }
  emit(r, n) {
    const t = this.handlers.get(r);
    t && t.forEach((c) => {
      try {
        c(n);
      } catch (a) {
        console.error("event handler failed", r, a);
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
        this.failureCount = 0, this.retryDelay = ye;
      }), this.source.addEventListener("jobs", (n) => {
        this.onStreamMessage(), this.parseAndEmit("jobs", n.data);
      }), this.source.addEventListener("notifications", (n) => {
        this.onStreamMessage(), this.parseAndEmit("notifications", n.data);
      }), this.source.addEventListener("message", () => {
        this.onStreamMessage();
      }), this.source.onerror = () => {
        this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Vr && window.dispatchEvent(new CustomEvent(Br)), this.scheduleRetry();
      };
    }
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = ye;
  }
  parseAndEmit(r, n) {
    try {
      const t = JSON.parse(n);
      this.emit(r, t.payload || t);
    } catch {
    }
  }
  scheduleRetry() {
    if (this.retryTimer || this.handlers.size === 0) return;
    const r = this.retryDelay;
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), qr), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, r);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = ye);
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = ye, this.handlers.size > 0 && this.ensureConnected();
  }
}
const Qe = new Qr();
function Hr() {
  Qe.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || Hr();
});
function $t(e) {
  let r = e;
  const n = /* @__PURE__ */ new Set();
  return {
    getState: () => r,
    setState: (t) => {
      const c = typeof t == "function" ? t(r) : t;
      if (!c || Object.keys(c).length === 0) return;
      let a = !1;
      for (const l of Object.keys(c))
        if (r[l] !== c[l]) {
          a = !0;
          break;
        }
      a && (r = { ...r, ...c }, n.forEach((l) => l()));
    },
    subscribe: (t) => (n.add(t), () => n.delete(t))
  };
}
const Tt = $t({ jobs: {}, order: [], lastFetch: 0 });
function Yr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function mt(e, r) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[r] || e.en || e.vi || e.default;
  }
}
function de(e, r, n) {
  if (!e || typeof e != "object") return;
  const t = mt(e[r], n);
  if (t) return t;
  const c = mt(e[`${r}_i18n`], n);
  if (c) return c;
  const a = e[`${r}_${n}`];
  if (typeof a == "string" && a) return a;
  const l = e[`${r}_en`];
  if (typeof l == "string" && l) return l;
  const u = e[`${r}_vi`];
  if (typeof u == "string" && u) return u;
}
function Jr(e) {
  const r = Yr(), n = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: de(e, "title", r) || de(n, "title", r) || e?.title || "",
    message: de(e, "message", r) || de(n, "message", r) || e?.message,
    error: de(e, "error", r) || de(n, "error", r) || e?.error || null
  };
}
function pt(e) {
  const r = Jr(e);
  Tt.setState((n) => {
    const t = { ...n.jobs, [r.id]: { ...n.jobs[r.id], ...r } };
    let c = n.order;
    return c.includes(r.id) || (c = [r.id, ...c].slice(0, 200)), { jobs: t, order: c };
  });
}
Qe.on("jobs", (e) => {
  if (e?.job) {
    pt(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const r = Tt.getState().jobs[e.job_id];
    r && pt({
      ...r,
      progress: e.progress ?? r.progress,
      message: e.message ?? r.message,
      status: e.status ?? r.status
    });
  }
});
const Be = $t({ inbox: [], unread: 0, toasts: [] }), Xr = 6e3;
function Zr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function ht(e, r) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[r] || e.en || e.vi || e.default;
  }
}
function Ae(e, r, n) {
  if (!e || typeof e != "object") return;
  const t = ht(e[r], n);
  if (t) return t;
  const c = ht(e[`${r}_i18n`], n);
  if (c) return c;
  const a = e[`${r}_${n}`];
  if (typeof a == "string" && a) return a;
  const l = e[`${r}_en`];
  if (typeof l == "string" && l) return l;
  const u = e[`${r}_vi`];
  if (typeof u == "string" && u) return u;
}
function Kr(e) {
  const r = Zr(), n = e?.payload && typeof e.payload == "object" ? e.payload : {}, t = Ae(e, "title", r) || Ae(n, "title", r) || e?.title || "", c = Ae(e, "body", r) || Ae(n, "body", r) || e?.body || null;
  return {
    ...e,
    title: t,
    body: c
  };
}
function en(e) {
  Be.setState((r) => ({ toasts: [e, ...r.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    Be.setState((r) => ({ toasts: r.toasts.filter((n) => n.id !== e.id) }));
  }, Xr);
}
Qe.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const r = Kr(e.notification);
    en({ ...r, ephemeral: !0 }), Be.setState((n) => ({
      inbox: [r, ...n.inbox].slice(0, 200),
      unread: n.unread + 1
    }));
  }
});
function tn(e) {
  if (!e || e < 0) return "—";
  const r = ["B", "KB", "MB", "GB"];
  let n = e, t = 0;
  for (; n >= 1024 && t < r.length - 1; )
    n /= 1024, t += 1;
  return `${n.toFixed(t === 0 ? 0 : 1)} ${r[t]}`;
}
function Oe(e) {
  if (!e || !Number.isFinite(e)) return "0:00";
  const r = Math.floor(e / 60), n = Math.floor(e % 60);
  return `${r}:${n.toString().padStart(2, "0")}`;
}
function rn(e) {
  const r = localStorage.getItem("copanel_token") || "", n = new URLSearchParams({
    path: e,
    access_token: r
  });
  return n.set("token", r), `/api/audio_station/stream?${n.toString()}`;
}
function Pe(e) {
  if (!e.hash && !e.id && !e.path) return null;
  const r = localStorage.getItem("copanel_token") || "", n = new URLSearchParams({ access_token: r, token: r });
  return e.hash ? n.set("hash", e.hash) : e.id ? n.set("id", e.id) : e.path && n.set("path", e.path), `/api/audio_station/cover?${n.toString()}`;
}
function bt(e) {
  if (typeof window > "u") return;
  const r = e.currentTrack?.name?.trim(), n = r ? e.playing ? "playing" : "paused" : null, t = r ? e.playing ? `▶ ${r}` : `⏸ ${r}` : "Audio Player";
  window.dispatchEvent(
    new CustomEvent("copanel:module-activity", {
      detail: {
        modulePath: "/audio-player",
        playing: e.playing,
        playbackState: n,
        trackName: r,
        title: t
      }
    })
  );
}
function Ue({
  track: e,
  album: r,
  className: n = "w-10 h-10"
}) {
  const t = Pe({ hash: r?.cover_hash || e?.cover_hash || void 0 }) || (e?.path ? Pe({ path: e.path }) : null) || (e?.id ? Pe({ id: e.id }) : null);
  return t ? /* @__PURE__ */ o("img", { src: t, alt: "", className: `${n} rounded object-cover shrink-0 bg-slate-200` }) : /* @__PURE__ */ o("div", { className: `${n} rounded bg-teal-500/10 flex items-center justify-center shrink-0`, children: /* @__PURE__ */ o(b.Disc, { className: "w-5 h-5 text-teal-500/50" }) });
}
function cn() {
  const { theme: e, language: r } = qe(), n = e === "dark", t = Ee(
    () => r === "vi" ? {
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
    [r]
  ), c = n ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900", a = n ? "text-slate-400" : "text-slate-500", l = n ? "hover:bg-slate-800" : "hover:bg-slate-50", u = n ? "bg-teal-900/40 text-teal-300" : "bg-teal-50 text-teal-700", [i, g] = f("folder"), [h, $] = f(null), [y, z] = f(null), [P, S] = f(!0), [v, C] = f(null), [T, re] = f(""), [U, D] = f(!1), [Me, pe] = f(null), [_, W] = f(null), [M, H] = f(null), [x, se] = f(null), [j, xe] = f([]), [E, Y] = f(0), [I, A] = f(!1), [he, L] = f(0), [He, _t] = f(0), [Ye, At] = f(!1), J = er(null), [B, ne] = f([]), [Je, Pt] = f([]), [Xe, Mt] = f([]), [Ze, Lt] = f([]), [Ke, Rt] = f([]), [q, we] = f(null), [X, ve] = f(null), [Z, be] = f(null), [F, Ne] = f(null), [et, zt] = f([]), [Le, It] = f([]), [jt, ke] = f(!1), [tt, rt] = f(""), [Ce, nt] = f(!1), R = j[E] || null, oe = ce(async (s = "") => {
    try {
      const m = await k(`/api/audio_station/browse?path=${encodeURIComponent(s)}`);
      $(m), C(null);
    } catch (m) {
      C(m.message);
    }
  }, []), ae = ce(async () => {
    try {
      const s = await k("/api/audio_station/library/stats");
      z(s);
    } catch {
    }
  }, []), Se = ce(async () => {
    if (i === "folder" || i === "home") return;
    nt(!0), C(null);
    const s = T.trim();
    try {
      if (i === "all") {
        const m = await k(
          `/api/audio_station/library/tracks?q=${encodeURIComponent(s)}&limit=1000`
        );
        ne(m.items || []);
      } else if (i === "recent") {
        const m = await k("/api/audio_station/library/recent?limit=100");
        ne(m.items || []);
      } else if (i === "random") {
        const m = await k("/api/audio_station/library/random?limit=100");
        ne(m.items || []);
      } else if (i === "playlist" && F) {
        const m = await k(
          `/api/audio_station/playlists/${encodeURIComponent(F.id)}/tracks`
        );
        ne(m.items || []);
      } else if (i === "album")
        if (q) {
          const m = await k(
            `/api/audio_station/library/albums/${encodeURIComponent(q.key)}/tracks`
          );
          ne(m.items || []);
        } else {
          const m = await k(
            `/api/audio_station/library/albums?q=${encodeURIComponent(s)}`
          );
          Pt(m.items || []);
        }
      else if (i === "artist")
        if (X) {
          const m = await k(
            `/api/audio_station/library/artists/${encodeURIComponent(X)}/tracks`
          );
          ne(m.items || []);
        } else {
          const m = await k(
            `/api/audio_station/library/artists?q=${encodeURIComponent(s)}`
          );
          Mt(m.items || []);
        }
      else if (i === "genre")
        if (Z) {
          const m = await k(
            `/api/audio_station/library/genres/${encodeURIComponent(Z)}/tracks`
          );
          ne(m.items || []);
        } else {
          const m = await k(
            `/api/audio_station/library/genres?q=${encodeURIComponent(s)}`
          );
          Lt(m.items || []);
        }
    } catch (m) {
      C(m.message);
    } finally {
      nt(!1);
    }
  }, [i, T, q, X, Z, F]), le = ce(async () => {
    try {
      const s = await k("/api/audio_station/playlists");
      zt(s.items || []);
    } catch {
    }
  }, []), $e = ce(async () => {
    try {
      const s = await k("/api/audio_station/library/recent?limit=8");
      It(s.items || []);
    } catch {
    }
  }, []), Te = ce(async () => {
    try {
      const s = await k("/api/audio_station/library/top-genres");
      Rt(s || []);
    } catch {
    }
  }, []);
  te(() => {
    (async () => (S(!0), await Promise.all([oe(""), ae(), Te(), le(), $e()]), S(!1)))();
  }, [oe, ae, Te, le, $e]), te(() => {
    Se();
  }, [Se]), te(() => {
    if (y?.scan.status !== "running") {
      i !== "folder" && i !== "home" && Se(), Te(), le(), $e();
      return;
    }
    const s = setInterval(() => {
      ae();
    }, 2e3);
    return () => clearInterval(s);
  }, [y?.scan.status, i, ae, Se, Te, le, $e]), te(() => {
    const s = J.current;
    !s || !R || (s.src = rn(R.path), s.load(), I && s.play().catch(() => A(!1)));
  }, [R?.path]), te(() => {
    const s = J.current;
    s && (I ? s.play().catch(() => A(!1)) : s.pause());
  }, [I]), te(() => (bt({ playing: I, currentTrack: R }), () => {
    bt({ playing: !1, currentTrack: null });
  }), [I, R?.path]);
  function Re(s, m = 0) {
    s.length && (xe(s), Y(m), A(!0));
  }
  function ze(s, m = 0) {
    Re(
      s.map((N) => ({ name: N.title || N.path, path: N.path })),
      m
    );
  }
  function Ie(s, m) {
    const N = m.findIndex((G) => G.path === s.path);
    ze(m, N >= 0 ? N : 0);
  }
  function st(s) {
    if (!h) return;
    const m = h.files.map((G) => ({ name: G.name, path: G.path })), N = m.findIndex((G) => G.path === s.path);
    Re(m, N >= 0 ? N : 0);
  }
  function Et() {
    h?.files.length && Re(h.files.map((s) => ({ name: s.name, path: s.path })));
  }
  function Ft() {
    E < j.length - 1 ? (Y((s) => s + 1), A(!0)) : A(!1);
  }
  function Gt() {
    E < j.length - 1 && (Y((s) => s + 1), A(!0));
  }
  function Ot() {
    const s = J.current;
    if (s && s.currentTime > 3) {
      s.currentTime = 0;
      return;
    }
    E > 0 && (Y((m) => m - 1), A(!0));
  }
  async function Ut() {
    const s = await k("/api/audio_station/settings");
    pe(s), W({ ...s, library_roots: [...s.library_roots] }), D(!0);
  }
  async function Dt() {
    if (!_) return;
    const s = await k("/api/audio_station/settings", {
      method: "PUT",
      body: _
    });
    pe(s), W({ ...s, library_roots: [...s.library_roots] }), D(!1), await Promise.all([oe(""), ae()]);
  }
  async function Wt() {
    const s = tt.trim();
    if (!s) return;
    const m = await k("/api/audio_station/playlists", {
      method: "POST",
      body: { name: s }
    });
    rt(""), ke(!1), await le(), Ne(m), g("playlist");
  }
  async function Bt() {
    !F || F.kind === "system" || (await k(`/api/audio_station/playlists/${encodeURIComponent(F.id)}`, { method: "DELETE" }), Ne(null), g("home"), await le());
  }
  function ot(s) {
    we(null), ve(null), be(null), Ne(s), g("playlist");
  }
  function qt(s) {
    const m = et.find((N) => N.id === "__recent__");
    m ? ot(m) : g(s);
  }
  async function at() {
    await k("/api/audio_station/library/scan", { method: "POST" }), await ae();
  }
  async function Vt() {
    se("add");
    const s = await k("/api/audio_station/folders/browse");
    H(s);
  }
  async function je(s) {
    const m = await k(`/api/audio_station/folders/browse?path=${encodeURIComponent(s)}`);
    H(m);
  }
  function Qt(s) {
    !_ || x !== "add" || (_.library_roots.includes(s) || W({
      ..._,
      library_roots: [..._.library_roots, s]
    }), H(null), se(null));
  }
  function Ht(s) {
    !_ || _.library_roots.length <= 1 || W({
      ..._,
      library_roots: _.library_roots.filter((m) => m !== s)
    });
  }
  const lt = Ee(() => {
    if (!h) return [];
    const s = T.trim().toLowerCase();
    return s ? h.files.filter((m) => m.name.toLowerCase().includes(s)) : h.files;
  }, [h, T]), ie = (s, m, N, G = !1) => {
    const Jt = b[N];
    return /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        disabled: G,
        onClick: () => {
          G || (we(null), ve(null), be(null), Ne(null), g(s));
        },
        className: `w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${i === s ? u : `${a} ${G ? "opacity-40 cursor-not-allowed" : l}`}`,
        children: [
          /* @__PURE__ */ o(Jt, { className: "w-4 h-4 shrink-0" }),
          m
        ]
      }
    );
  }, Yt = Ee(() => i === "folder" ? t.byFolder : i === "all" ? t.allMusic : i === "recent" ? t.recentlyAdded : i === "random" ? t.random100 : i === "playlist" ? F?.name || t.playlists : i === "album" ? q ? q.album : t.byAlbum : i === "artist" ? X || t.byArtist : i === "genre" ? Z || t.byGenre : t.home, [i, q, X, Z, F, t]);
  function _e(s, m) {
    return Ce ? /* @__PURE__ */ o("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ o(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : s.length ? /* @__PURE__ */ o("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ d("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ o("thead", { className: `sticky top-0 z-10 ${n ? "bg-slate-900" : "bg-white"}`, children: /* @__PURE__ */ d("tr", { className: `border-b text-left ${n ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`, children: [
        /* @__PURE__ */ o("th", { className: "px-4 py-2 font-medium", children: t.colTitle }),
        /* @__PURE__ */ o("th", { className: "px-4 py-2 font-medium hidden md:table-cell", children: t.colAlbum }),
        /* @__PURE__ */ o("th", { className: "px-4 py-2 font-medium hidden lg:table-cell", children: t.colArtist }),
        /* @__PURE__ */ o("th", { className: "px-4 py-2 font-medium w-24 text-right", children: t.colDuration })
      ] }) }),
      /* @__PURE__ */ o("tbody", { children: s.map((N) => /* @__PURE__ */ d(
        "tr",
        {
          className: `border-b cursor-pointer ${R?.path === N.path ? n ? "bg-teal-900/30" : "bg-teal-50" : l} ${n ? "border-slate-800" : "border-slate-100"}`,
          onClick: () => Ie(N, s),
          onDoubleClick: () => Ie(N, s),
          children: [
            /* @__PURE__ */ o("td", { className: "px-4 py-2", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ o(Ue, { track: N, className: "w-8 h-8" }),
              /* @__PURE__ */ o("span", { className: "truncate", children: N.title })
            ] }) }),
            /* @__PURE__ */ o("td", { className: `px-4 py-2 hidden md:table-cell truncate ${a}`, children: N.album || "—" }),
            /* @__PURE__ */ o("td", { className: `px-4 py-2 hidden lg:table-cell truncate ${a}`, children: N.artist || "—" }),
            /* @__PURE__ */ o("td", { className: `px-4 py-2 text-right ${a}`, children: N.duration_sec ? Oe(N.duration_sec) : "—" })
          ]
        },
        N.path
      )) })
    ] }) }) : /* @__PURE__ */ o("div", { className: `flex-1 flex items-center justify-center p-8 ${a}`, children: m });
  }
  return /* @__PURE__ */ o(Ur, { constrained: !0, children: /* @__PURE__ */ d("div", { className: `flex flex-col h-full min-h-[32rem] border rounded-lg overflow-hidden ${c}`, children: [
    /* @__PURE__ */ d("div", { className: `flex items-center gap-3 px-4 py-3 border-b shrink-0 ${n ? "border-slate-700" : "border-slate-200"}`, children: [
      /* @__PURE__ */ o(b.Music, { className: "w-6 h-6 text-teal-500" }),
      /* @__PURE__ */ d("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ o("h1", { className: "font-semibold text-lg leading-tight", children: t.title }),
        /* @__PURE__ */ o("p", { className: `text-xs ${a}`, children: t.subtitle })
      ] }),
      /* @__PURE__ */ d("div", { className: "relative hidden sm:block", children: [
        /* @__PURE__ */ o(b.Search, { className: `absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${a}` }),
        /* @__PURE__ */ o(
          "input",
          {
            value: T,
            onChange: (s) => re(s.target.value),
            placeholder: t.search,
            className: `pl-8 pr-3 py-1.5 text-sm rounded-md border w-48 lg:w-64 ${n ? "bg-slate-800 border-slate-600" : "bg-slate-50 border-slate-300"}`
          }
        )
      ] }),
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          onClick: Ut,
          className: `flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border ${n ? "border-slate-600 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-50"}`,
          children: [
            /* @__PURE__ */ o(b.Settings, { className: "w-4 h-4" }),
            t.settings
          ]
        }
      )
    ] }),
    /* @__PURE__ */ o(
      Dr,
      {
        isDark: n,
        mobileTitle: t.title,
        sidebar: /* @__PURE__ */ d(
          "aside",
          {
            className: `h-full w-52 shrink-0 border-r overflow-y-auto p-3 space-y-4 ${n ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50/80"}`,
            children: [
              ie("home", t.home, "Home"),
              /* @__PURE__ */ d("div", { children: [
                /* @__PURE__ */ o("div", { className: `text-[10px] font-bold tracking-wider px-3 mb-1 ${a}`, children: t.myMusic }),
                ie("all", t.allMusic, "ListMusic"),
                ie("folder", t.byFolder, "FolderOpen"),
                ie("album", t.byAlbum, "Disc"),
                ie("artist", t.byArtist, "Mic2"),
                ie("genre", t.byGenre, "Tags")
              ] }),
              /* @__PURE__ */ d("div", { children: [
                /* @__PURE__ */ d("div", { className: "flex items-center justify-between px-3 mb-1", children: [
                  /* @__PURE__ */ o("div", { className: `text-[10px] font-bold tracking-wider ${a}`, children: t.playlists }),
                  /* @__PURE__ */ o(
                    "button",
                    {
                      type: "button",
                      onClick: () => ke(!0),
                      className: "p-0.5 rounded hover:bg-teal-500/20 text-teal-500",
                      title: t.newPlaylist,
                      children: /* @__PURE__ */ o(b.Plus, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }),
                et.map((s) => /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    onClick: () => ot(s),
                    className: `w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${i === "playlist" && F?.id === s.id ? u : `${a} ${l}`}`,
                    children: [
                      s.kind === "system" ? /* @__PURE__ */ o(b.Clock, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ o(b.ListMusic, { className: "w-4 h-4 shrink-0" }),
                      /* @__PURE__ */ o("span", { className: "truncate", children: s.name })
                    ]
                  },
                  s.id
                ))
              ] })
            ]
          }
        ),
        children: /* @__PURE__ */ d("main", { className: "flex-1 flex flex-col min-w-0 min-h-0", children: [
          v && /* @__PURE__ */ o("div", { className: "mx-4 mt-3 px-3 py-2 text-sm rounded bg-red-500/10 text-red-500 border border-red-500/30", children: v }),
          i === "home" && /* @__PURE__ */ d("div", { className: "p-6 space-y-6 overflow-y-auto", children: [
            /* @__PURE__ */ o("h2", { className: "text-xl font-semibold", children: t.home }),
            y && /* @__PURE__ */ d("div", { className: "grid grid-cols-3 gap-4 max-w-lg", children: [
              /* @__PURE__ */ d("div", { className: `p-4 rounded-lg border ${n ? "border-slate-700" : "border-slate-200"}`, children: [
                /* @__PURE__ */ o("div", { className: "text-2xl font-bold text-teal-500", children: y.tracks }),
                /* @__PURE__ */ o("div", { className: `text-sm ${a}`, children: t.tracks })
              ] }),
              /* @__PURE__ */ d("div", { className: `p-4 rounded-lg border ${n ? "border-slate-700" : "border-slate-200"}`, children: [
                /* @__PURE__ */ o("div", { className: "text-2xl font-bold text-teal-500", children: y.albums }),
                /* @__PURE__ */ o("div", { className: `text-sm ${a}`, children: t.albums })
              ] }),
              /* @__PURE__ */ d("div", { className: `p-4 rounded-lg border ${n ? "border-slate-700" : "border-slate-200"}`, children: [
                /* @__PURE__ */ o("div", { className: "text-2xl font-bold text-teal-500", children: y.artists }),
                /* @__PURE__ */ o("div", { className: `text-sm ${a}`, children: t.artists })
              ] })
            ] }),
            /* @__PURE__ */ o("p", { className: `text-sm ${a}`, children: t.statsHint }),
            Le.length > 0 && /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ d("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ o("h3", { className: "text-sm font-semibold", children: t.recentlyAdded }),
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    onClick: () => qt("recent"),
                    className: "text-xs text-teal-500 hover:underline",
                    children: t.allMusic
                  }
                )
              ] }),
              /* @__PURE__ */ o("div", { className: "space-y-1 max-w-xl", children: Le.slice(0, 5).map((s) => /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  onClick: () => Ie(s, Le),
                  className: `w-full flex items-center gap-3 p-2 rounded-lg text-left ${l}`,
                  children: [
                    /* @__PURE__ */ o(Ue, { track: s, className: "w-10 h-10" }),
                    /* @__PURE__ */ d("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ o("div", { className: "text-sm font-medium truncate", children: s.title }),
                      /* @__PURE__ */ o("div", { className: `text-xs truncate ${a}`, children: s.artist || s.album })
                    ] })
                  ]
                },
                s.path
              )) })
            ] }),
            Ke.length > 0 && /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ o("h3", { className: "text-sm font-semibold mb-2", children: t.byGenre }),
              /* @__PURE__ */ o("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-w-3xl", children: Ke.map((s) => /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    be(s.name), g("genre");
                  },
                  className: `p-3 rounded-lg border text-left text-sm hover:border-teal-500 ${n ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`,
                  children: [
                    /* @__PURE__ */ o("div", { className: "font-medium truncate", children: s.name }),
                    /* @__PURE__ */ d("div", { className: `text-xs ${a}`, children: [
                      s.track_count,
                      " ",
                      t.tracks
                    ] })
                  ]
                },
                s.name
              )) })
            ] }),
            /* @__PURE__ */ d("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  onClick: () => g("folder"),
                  className: "px-4 py-2 text-sm rounded-md bg-teal-600 text-white hover:bg-teal-500",
                  children: t.byFolder
                }
              ),
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  onClick: at,
                  disabled: y?.scan.status === "running",
                  className: "px-4 py-2 text-sm rounded-md border border-teal-600 text-teal-600 hover:bg-teal-500/10 disabled:opacity-50",
                  children: y?.scan.status === "running" ? t.scanning : t.scanNow
                }
              )
            ] })
          ] }),
          (i === "folder" || i === "all" || i === "album" || i === "artist" || i === "genre" || i === "recent" || i === "random" || i === "playlist") && /* @__PURE__ */ d(Kt, { children: [
            /* @__PURE__ */ d(
              "div",
              {
                className: `flex items-center justify-between px-4 py-2 border-b shrink-0 ${n ? "border-slate-700" : "border-slate-200"}`,
                children: [
                  /* @__PURE__ */ d("div", { className: "flex items-center gap-2 min-w-0 flex-wrap", children: [
                    (q || X || Z) && /* @__PURE__ */ d(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          we(null), ve(null), be(null);
                        },
                        className: "text-sm text-teal-500 hover:underline flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ o(b.ArrowLeft, { className: "w-4 h-4" }),
                          t.back
                        ]
                      }
                    ),
                    /* @__PURE__ */ o("h2", { className: "font-semibold", children: Yt }),
                    i === "folder" && h?.breadcrumbs.map((s, m) => /* @__PURE__ */ d("span", { className: "flex items-center gap-1 text-sm", children: [
                      m > 0 && /* @__PURE__ */ o("span", { className: a, children: "/" }),
                      /* @__PURE__ */ o(
                        "button",
                        {
                          type: "button",
                          onClick: () => oe(s.path),
                          className: "text-teal-500 hover:underline truncate max-w-[8rem]",
                          children: s.name
                        }
                      )
                    ] }, s.path))
                  ] }),
                  i === "folder" && h && h.files.length > 0 && /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: Et,
                      className: "flex items-center gap-1 text-sm text-teal-600 hover:underline shrink-0",
                      children: [
                        /* @__PURE__ */ o(b.Play, { className: "w-4 h-4" }),
                        t.play
                      ]
                    }
                  ),
                  i === "all" && B.length > 0 && /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: () => ze(B),
                      className: "flex items-center gap-1 text-sm text-teal-600 hover:underline shrink-0",
                      children: [
                        /* @__PURE__ */ o(b.Play, { className: "w-4 h-4" }),
                        t.play
                      ]
                    }
                  ),
                  (i === "recent" || i === "random" || i === "playlist") && B.length > 0 && /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: () => ze(B),
                      className: "flex items-center gap-1 text-sm text-teal-600 hover:underline shrink-0",
                      children: [
                        /* @__PURE__ */ o(b.Play, { className: "w-4 h-4" }),
                        t.play
                      ]
                    }
                  ),
                  i === "playlist" && F?.kind === "user" && /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: Bt,
                      className: "flex items-center gap-1 text-sm text-red-500 hover:underline shrink-0",
                      children: [
                        /* @__PURE__ */ o(b.Trash2, { className: "w-4 h-4" }),
                        t.deletePlaylist
                      ]
                    }
                  )
                ]
              }
            ),
            (i === "all" || i === "recent" || i === "random" || i === "playlist") && _e(B, t.noLibrary),
            i === "album" && !q && (Ce ? /* @__PURE__ */ o("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ o(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : Je.length === 0 ? /* @__PURE__ */ o("div", { className: `flex-1 flex items-center justify-center p-8 ${a}`, children: t.noLibrary }) : /* @__PURE__ */ o("div", { className: "flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3", children: Je.map((s) => /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => we(s),
                className: `p-3 rounded-lg border text-left hover:border-teal-500 ${n ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`,
                children: [
                  /* @__PURE__ */ o("div", { className: `w-full aspect-square rounded mb-2 overflow-hidden ${n ? "bg-slate-800" : "bg-slate-100"}`, children: s.has_cover && s.cover_hash ? /* @__PURE__ */ o(
                    "img",
                    {
                      src: Pe({ hash: s.cover_hash }) || "",
                      alt: "",
                      className: "w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ o("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ o(b.Disc, { className: "w-10 h-10 text-teal-500/60" }) }) }),
                  /* @__PURE__ */ o("div", { className: "font-medium text-sm truncate", children: s.album }),
                  /* @__PURE__ */ o("div", { className: `text-xs truncate ${a}`, children: s.album_artist || s.artist }),
                  /* @__PURE__ */ d("div", { className: `text-xs ${a}`, children: [
                    s.track_count,
                    " ",
                    t.songs
                  ] })
                ]
              },
              s.key
            )) })),
            i === "album" && q && _e(B, t.noFiles),
            i === "artist" && !X && (Ce ? /* @__PURE__ */ o("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ o(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : Xe.length === 0 ? /* @__PURE__ */ o("div", { className: `flex-1 flex items-center justify-center p-8 ${a}`, children: t.noLibrary }) : /* @__PURE__ */ o("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ o("table", { className: "w-full text-sm", children: /* @__PURE__ */ o("tbody", { children: Xe.map((s) => /* @__PURE__ */ d(
              "tr",
              {
                className: `border-b cursor-pointer ${l} ${n ? "border-slate-800" : "border-slate-100"}`,
                onClick: () => ve(s.name),
                children: [
                  /* @__PURE__ */ o("td", { className: "px-4 py-2", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ o(b.Mic2, { className: "w-4 h-4 text-teal-500" }),
                    s.name
                  ] }) }),
                  /* @__PURE__ */ o("td", { className: `px-4 py-2 text-right ${a}`, children: s.track_count })
                ]
              },
              s.name
            )) }) }) })),
            i === "artist" && X && _e(B, t.noFiles),
            i === "genre" && !Z && (Ce ? /* @__PURE__ */ o("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ o(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : Ze.length === 0 ? /* @__PURE__ */ o("div", { className: `flex-1 flex items-center justify-center p-8 ${a}`, children: t.noLibrary }) : /* @__PURE__ */ o("div", { className: "flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2", children: Ze.map((s) => /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => be(s.name),
                className: `p-3 rounded-lg border text-left hover:border-teal-500 ${n ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`,
                children: [
                  /* @__PURE__ */ o("div", { className: "font-medium truncate", children: s.name }),
                  /* @__PURE__ */ d("div", { className: `text-xs ${a}`, children: [
                    s.track_count,
                    " ",
                    t.tracks
                  ] })
                ]
              },
              s.name
            )) })),
            i === "genre" && Z && _e(B, t.noFiles),
            i === "folder" && (P && !h ? /* @__PURE__ */ o("div", { className: `flex-1 flex items-center justify-center ${a}`, children: /* @__PURE__ */ o(b.Loader2, { className: "w-8 h-8 animate-spin" }) }) : /* @__PURE__ */ d("div", { className: "flex-1 overflow-y-auto", children: [
              /* @__PURE__ */ d("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ o("thead", { className: `sticky top-0 z-10 ${n ? "bg-slate-900" : "bg-white"}`, children: /* @__PURE__ */ d("tr", { className: `border-b text-left ${n ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`, children: [
                  /* @__PURE__ */ o("th", { className: "px-4 py-2 font-medium", children: t.colTitle }),
                  /* @__PURE__ */ o("th", { className: "px-4 py-2 font-medium hidden md:table-cell", children: t.colAlbum }),
                  /* @__PURE__ */ o("th", { className: "px-4 py-2 font-medium hidden lg:table-cell", children: t.colArtist }),
                  /* @__PURE__ */ o("th", { className: "px-4 py-2 font-medium w-24 text-right", children: t.colDuration })
                ] }) }),
                /* @__PURE__ */ d("tbody", { children: [
                  h?.dirs.map((s) => /* @__PURE__ */ o(
                    "tr",
                    {
                      className: `border-b cursor-pointer ${l} ${n ? "border-slate-800" : "border-slate-100"}`,
                      onDoubleClick: () => oe(s.path),
                      children: /* @__PURE__ */ o("td", { className: "px-4 py-2", colSpan: 4, children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ o(b.Folder, { className: "w-4 h-4 text-amber-500 shrink-0" }),
                        /* @__PURE__ */ o("span", { children: s.name }),
                        /* @__PURE__ */ o(
                          "button",
                          {
                            type: "button",
                            onClick: (m) => {
                              m.stopPropagation(), oe(s.path);
                            },
                            className: `ml-auto text-xs ${a} hover:text-teal-500`,
                            children: t.openFolder
                          }
                        )
                      ] }) })
                    },
                    s.path
                  )),
                  lt.map((s) => /* @__PURE__ */ d(
                    "tr",
                    {
                      className: `border-b cursor-pointer ${R?.path === s.path ? n ? "bg-teal-900/30" : "bg-teal-50" : l} ${n ? "border-slate-800" : "border-slate-100"}`,
                      onDoubleClick: () => st(s),
                      onClick: () => st(s),
                      children: [
                        /* @__PURE__ */ o("td", { className: "px-4 py-2", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ o(b.Music2, { className: "w-4 h-4 text-teal-500 shrink-0" }),
                          /* @__PURE__ */ o("span", { className: "truncate", children: s.name })
                        ] }) }),
                        /* @__PURE__ */ o("td", { className: `px-4 py-2 hidden md:table-cell ${a}`, children: "—" }),
                        /* @__PURE__ */ o("td", { className: `px-4 py-2 hidden lg:table-cell ${a}`, children: "—" }),
                        /* @__PURE__ */ o("td", { className: `px-4 py-2 text-right ${a}`, children: s.size ? tn(s.size) : "—" })
                      ]
                    },
                    s.path
                  ))
                ] })
              ] }),
              h && !h.dirs.length && !lt.length && /* @__PURE__ */ o("div", { className: `p-8 text-center ${a}`, children: t.noFiles })
            ] }))
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ d("div", { className: `border-t px-4 py-2 shrink-0 ${n ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"}`, children: [
      /* @__PURE__ */ o(
        "audio",
        {
          ref: J,
          onTimeUpdate: () => L(J.current?.currentTime || 0),
          onLoadedMetadata: () => _t(J.current?.duration || 0),
          onEnded: Ft,
          onPlay: () => A(!0),
          onPause: () => A(!1)
        }
      ),
      /* @__PURE__ */ d("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ d("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ o("button", { type: "button", onClick: Ot, className: "p-2 rounded-full hover:bg-black/10", title: t.prev, children: /* @__PURE__ */ o(b.SkipBack, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              onClick: () => A((s) => !s),
              className: "p-2 rounded-full bg-teal-600 text-white hover:bg-teal-500",
              title: I ? t.pause : t.play,
              children: I ? /* @__PURE__ */ o(b.Pause, { className: "w-5 h-5" }) : /* @__PURE__ */ o(b.Play, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ o("button", { type: "button", onClick: Gt, className: "p-2 rounded-full hover:bg-black/10", title: t.next, children: /* @__PURE__ */ o(b.SkipForward, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ d("div", { className: "flex-1 min-w-0 flex items-center gap-3", children: [
          R && /* @__PURE__ */ o(
            Ue,
            {
              track: B.find((s) => s.path === R.path) || { id: "", path: R.path, title: R.name, artist: "", album: "", genre: "" },
              className: "w-10 h-10 hidden sm:block"
            }
          ),
          /* @__PURE__ */ d("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ o("div", { className: "text-sm font-medium truncate", children: R?.name || "—" }),
            /* @__PURE__ */ d("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ o("span", { className: `text-xs tabular-nums ${a}`, children: Oe(he) }),
              /* @__PURE__ */ o(
                "input",
                {
                  type: "range",
                  min: 0,
                  max: He || 0,
                  value: he,
                  onChange: (s) => {
                    const m = Number(s.target.value);
                    J.current && (J.current.currentTime = m), L(m);
                  },
                  className: "flex-1 h-1 accent-teal-600"
                }
              ),
              /* @__PURE__ */ o("span", { className: `text-xs tabular-nums ${a}`, children: Oe(He) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            onClick: () => At((s) => !s),
            className: `p-2 rounded-md ${Ye ? "bg-teal-600/20 text-teal-500" : l}`,
            title: t.queue,
            children: /* @__PURE__ */ o(b.ListMusic, { className: "w-5 h-5" })
          }
        )
      ] }),
      Ye && /* @__PURE__ */ o("div", { className: `mt-2 max-h-32 overflow-y-auto rounded border text-sm ${n ? "border-slate-700" : "border-slate-200"}`, children: j.length === 0 ? /* @__PURE__ */ o("div", { className: `p-3 ${a}`, children: t.emptyQueue }) : j.map((s, m) => /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          onClick: () => {
            Y(m), A(!0);
          },
          className: `w-full text-left px-3 py-1.5 flex items-center gap-2 ${m === E ? n ? "bg-teal-900/40" : "bg-teal-50" : l}`,
          children: [
            /* @__PURE__ */ o("span", { className: `w-5 text-xs ${a}`, children: m + 1 }),
            /* @__PURE__ */ o("span", { className: "truncate", children: s.name })
          ]
        },
        s.path
      )) })
    ] }),
    /* @__PURE__ */ o(Ge, { open: jt, onClose: () => ke(!1), title: t.newPlaylist, children: /* @__PURE__ */ d("div", { className: "p-4", children: [
      /* @__PURE__ */ o(
        "input",
        {
          value: tt,
          onChange: (s) => rt(s.target.value),
          placeholder: t.playlistName,
          className: `w-full px-3 py-2 text-sm rounded border mb-3 ${n ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`
        }
      ),
      /* @__PURE__ */ d("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ o("button", { type: "button", onClick: () => ke(!1), className: `px-3 py-1.5 text-sm rounded border ${n ? "border-slate-600" : "border-slate-300"}`, children: t.cancel }),
        /* @__PURE__ */ o("button", { type: "button", onClick: Wt, className: "px-3 py-1.5 text-sm rounded bg-teal-600 text-white hover:bg-teal-500", children: t.save })
      ] })
    ] }) }),
    /* @__PURE__ */ o(Ge, { open: U && !!_, onClose: () => D(!1), title: t.settings, maxWidth: "2xl", className: "max-w-2xl", children: _ && /* @__PURE__ */ d("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ d("div", { children: [
        /* @__PURE__ */ o("label", { className: `block text-sm font-medium mb-2 ${a}`, children: t.libraryRoots }),
        /* @__PURE__ */ o("div", { className: "space-y-2", children: _.library_roots.map((s) => /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ o("code", { className: `flex-1 text-xs px-2 py-1.5 rounded border truncate ${n ? "bg-slate-800 border-slate-600" : "bg-slate-50 border-slate-300"}`, children: s }),
          /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              disabled: _.library_roots.length <= 1,
              onClick: () => Ht(s),
              className: "p-1.5 text-red-500 hover:bg-red-500/10 rounded disabled:opacity-30",
              children: /* @__PURE__ */ o(b.Trash2, { className: "w-4 h-4" })
            }
          )
        ] }, s)) }),
        /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: Vt,
            className: "mt-2 text-sm text-teal-600 hover:underline flex items-center gap-1",
            children: [
              /* @__PURE__ */ o(b.Plus, { className: "w-4 h-4" }),
              t.addRoot
            ]
          }
        )
      ] }),
      /* @__PURE__ */ d("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
        /* @__PURE__ */ o(
          "input",
          {
            type: "checkbox",
            checked: _.scan_on_startup,
            onChange: (s) => W((m) => m && { ...m, scan_on_startup: s.target.checked })
          }
        ),
        t.scanOnStartup
      ] }),
      y?.scan.status === "running" && /* @__PURE__ */ d("div", { className: `text-sm ${a} flex items-center gap-2`, children: [
        /* @__PURE__ */ o(b.Loader2, { className: "w-4 h-4 animate-spin" }),
        t.scanning,
        " (",
        y.scan.files_indexed,
        "/",
        y.scan.files_found,
        " ",
        t.indexed,
        ")"
      ] }),
      /* @__PURE__ */ d("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            onClick: at,
            disabled: y?.scan.status === "running",
            className: "px-3 py-1.5 text-sm rounded border border-teal-600 text-teal-600 hover:bg-teal-500/10 disabled:opacity-50",
            children: t.scanNow
          }
        ),
        /* @__PURE__ */ o("div", { className: "flex-1" }),
        /* @__PURE__ */ o("button", { type: "button", onClick: () => D(!1), className: `px-3 py-1.5 text-sm rounded border ${n ? "border-slate-600" : "border-slate-300"}`, children: t.cancel }),
        /* @__PURE__ */ o("button", { type: "button", onClick: Dt, className: "px-3 py-1.5 text-sm rounded bg-teal-600 text-white hover:bg-teal-500", children: t.save })
      ] })
    ] }) }),
    /* @__PURE__ */ o(
      Ge,
      {
        open: !!M,
        onClose: () => {
          H(null), se(null);
        },
        title: t.selectFolder,
        children: M && /* @__PURE__ */ d("div", { className: "p-4", children: [
          /* @__PURE__ */ o("div", { className: `text-xs mb-2 font-mono truncate ${a}`, children: M.current }),
          /* @__PURE__ */ o("div", { className: "flex flex-wrap gap-1 mb-2", children: M.volumes.map((s) => /* @__PURE__ */ o("button", { type: "button", onClick: () => je(s.path), className: "text-xs px-2 py-0.5 rounded bg-teal-600/20 text-teal-600", children: s.label }, s.path)) }),
          M.parent && /* @__PURE__ */ d("button", { type: "button", onClick: () => je(M.parent), className: "text-sm text-teal-500 mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ o(b.ArrowUp, { className: "w-4 h-4" }),
            " .."
          ] }),
          /* @__PURE__ */ o("div", { className: `max-h-48 overflow-y-auto border rounded mb-3 ${n ? "border-slate-700" : "border-slate-200"}`, children: M.entries.map((s) => /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              onClick: () => je(s.path),
              className: `w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 ${l}`,
              children: [
                /* @__PURE__ */ o(b.Folder, { className: "w-4 h-4 text-amber-500" }),
                s.name
              ]
            },
            s.path
          )) }),
          /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              onClick: () => Qt(M.current),
              className: "w-full py-2 text-sm rounded bg-teal-600 text-white hover:bg-teal-500",
              children: t.useThisFolder
            }
          )
        ] })
      }
    )
  ] }) });
}
export {
  cn as default
};
