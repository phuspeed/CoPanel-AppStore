var ft = Object.defineProperty;
var bt = (e, t, r) => t in e ? ft(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var D = (e, t, r) => bt(e, typeof t != "symbol" ? t + "" : t, r);
import { jsx as s, jsxs as d, Fragment as Ve } from "react/jsx-runtime";
import { createContext as He, useContext as Ke, useState as N, useEffect as ge, useRef as gt, useLayoutEffect as yt, useMemo as Ie, useCallback as Re } from "react";
import { useOutletContext as xt, Link as wt } from "react-router-dom";
import * as x from "lucide-react";
import { createPortal as vt } from "react-dom";
const kt = He(null);
function Nt() {
  return Ke(kt);
}
const Ct = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Pe() {
  const e = Nt(), t = xt();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : Ct);
}
const St = He(null);
function Tt() {
  return Ke(St);
}
function Ee() {
  return Tt()?.isWindowed === !0;
}
function Xe(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = Xe(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function _t() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = Xe(e)) && (n && (n += " "), n += t);
  return n;
}
const Me = "-", Pt = (e) => {
  const t = Mt(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (l) => {
      const u = l.split(Me);
      return u[0] === "" && u.length !== 1 && u.shift(), Je(u, t) || Et(l);
    },
    getConflictingClassGroupIds: (l, u) => {
      const p = r[l] || [];
      return u && n[l] ? [...p, ...n[l]] : p;
    }
  };
}, Je = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], n = t.nextPart.get(r), o = n ? Je(e.slice(1), n) : void 0;
  if (o)
    return o;
  if (t.validators.length === 0)
    return;
  const i = e.join(Me);
  return t.validators.find(({
    validator: l
  }) => l(i))?.classGroupId;
}, $e = /^\[(.+)\]$/, Et = (e) => {
  if ($e.test(e)) {
    const t = $e.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, Mt = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return At(Object.entries(e.classGroups), r).forEach(([i, l]) => {
    Se(l, n, i, t);
  }), n;
}, Se = (e, t, r, n) => {
  e.forEach((o) => {
    if (typeof o == "string") {
      const i = o === "" ? t : Oe(t, o);
      i.classGroupId = r;
      return;
    }
    if (typeof o == "function") {
      if (zt(o)) {
        Se(o(n), t, r, n);
        return;
      }
      t.validators.push({
        validator: o,
        classGroupId: r
      });
      return;
    }
    Object.entries(o).forEach(([i, l]) => {
      Se(l, Oe(t, i), r, n);
    });
  });
}, Oe = (e, t) => {
  let r = e;
  return t.split(Me).forEach((n) => {
    r.nextPart.has(n) || r.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(n);
  }), r;
}, zt = (e) => e.isThemeGetter, At = (e, t) => t ? e.map(([r, n]) => {
  const o = n.map((i) => typeof i == "string" ? t + i : typeof i == "object" ? Object.fromEntries(Object.entries(i).map(([l, u]) => [t + l, u])) : i);
  return [r, o];
}) : e, Lt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  const o = (i, l) => {
    r.set(i, l), t++, t > e && (t = 0, n = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(i) {
      let l = r.get(i);
      if (l !== void 0)
        return l;
      if ((l = n.get(i)) !== void 0)
        return o(i, l), l;
    },
    set(i, l) {
      r.has(i) ? r.set(i, l) : o(i, l);
    }
  };
}, qe = "!", Ft = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, n = t.length === 1, o = t[0], i = t.length, l = (u) => {
    const p = [];
    let w = 0, b = 0, _;
    for (let v = 0; v < u.length; v++) {
      let P = u[v];
      if (w === 0) {
        if (P === o && (n || u.slice(v, v + i) === t)) {
          p.push(u.slice(b, v)), b = v + i;
          continue;
        }
        if (P === "/") {
          _ = v;
          continue;
        }
      }
      P === "[" ? w++ : P === "]" && w--;
    }
    const S = p.length === 0 ? u : u.substring(b), A = S.startsWith(qe), y = A ? S.substring(1) : S, C = _ && _ > b ? _ - b : void 0;
    return {
      modifiers: p,
      hasImportantModifier: A,
      baseClassName: y,
      maybePostfixModifierPosition: C
    };
  };
  return r ? (u) => r({
    className: u,
    parseClassName: l
  }) : l;
}, jt = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((n) => {
    n[0] === "[" ? (t.push(...r.sort(), n), r = []) : r.push(n);
  }), t.push(...r.sort()), t;
}, It = (e) => ({
  cache: Lt(e.cacheSize),
  parseClassName: Ft(e),
  ...Pt(e)
}), Rt = /\s+/, $t = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: o
  } = t, i = [], l = e.trim().split(Rt);
  let u = "";
  for (let p = l.length - 1; p >= 0; p -= 1) {
    const w = l[p], {
      modifiers: b,
      hasImportantModifier: _,
      baseClassName: S,
      maybePostfixModifierPosition: A
    } = r(w);
    let y = !!A, C = n(y ? S.substring(0, A) : S);
    if (!C) {
      if (!y) {
        u = w + (u.length > 0 ? " " + u : u);
        continue;
      }
      if (C = n(S), !C) {
        u = w + (u.length > 0 ? " " + u : u);
        continue;
      }
      y = !1;
    }
    const v = jt(b).join(":"), P = _ ? v + qe : v, L = P + C;
    if (i.includes(L))
      continue;
    i.push(L);
    const V = o(C, y);
    for (let F = 0; F < V.length; ++F) {
      const E = V[F];
      i.push(P + E);
    }
    u = w + (u.length > 0 ? " " + u : u);
  }
  return u;
};
function Ot() {
  let e = 0, t, r, n = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = Qe(t)) && (n && (n += " "), n += r);
  return n;
}
const Qe = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = Qe(e[n])) && (r && (r += " "), r += t);
  return r;
};
function Gt(e, ...t) {
  let r, n, o, i = l;
  function l(p) {
    const w = t.reduce((b, _) => _(b), e());
    return r = It(w), n = r.cache.get, o = r.cache.set, i = u, u(p);
  }
  function u(p) {
    const w = n(p);
    if (w)
      return w;
    const b = $t(p, r);
    return o(p, b), b;
  }
  return function() {
    return i(Ot.apply(null, arguments));
  };
}
const k = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, Ye = /^\[(?:([a-z-]+):)?(.+)\]$/i, Dt = /^\d+\/\d+$/, Bt = /* @__PURE__ */ new Set(["px", "full", "screen"]), Wt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Ut = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Vt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Ht = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Kt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, U = (e) => oe(e) || Bt.has(e) || Dt.test(e), X = (e) => ne(e, "length", tr), oe = (e) => !!e && !Number.isNaN(Number(e)), Ne = (e) => ne(e, "number", oe), ue = (e) => !!e && Number.isInteger(Number(e)), Xt = (e) => e.endsWith("%") && oe(e.slice(0, -1)), f = (e) => Ye.test(e), J = (e) => Wt.test(e), Jt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), qt = (e) => ne(e, Jt, Ze), Qt = (e) => ne(e, "position", Ze), Yt = /* @__PURE__ */ new Set(["image", "url"]), Zt = (e) => ne(e, Yt, or), er = (e) => ne(e, "", rr), pe = () => !0, ne = (e, t, r) => {
  const n = Ye.exec(e);
  return n ? n[1] ? typeof t == "string" ? n[1] === t : t.has(n[1]) : r(n[2]) : !1;
}, tr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Ut.test(e) && !Vt.test(e)
), Ze = () => !1, rr = (e) => Ht.test(e), or = (e) => Kt.test(e), nr = () => {
  const e = k("colors"), t = k("spacing"), r = k("blur"), n = k("brightness"), o = k("borderColor"), i = k("borderRadius"), l = k("borderSpacing"), u = k("borderWidth"), p = k("contrast"), w = k("grayscale"), b = k("hueRotate"), _ = k("invert"), S = k("gap"), A = k("gradientColorStops"), y = k("gradientColorStopPositions"), C = k("inset"), v = k("margin"), P = k("opacity"), L = k("padding"), V = k("saturate"), F = k("scale"), E = k("sepia"), q = k("skew"), T = k("space"), se = k("translate"), j = () => ["auto", "contain", "none"], ae = () => ["auto", "hidden", "clip", "visible", "scroll"], W = () => ["auto", f, t], g = () => [f, t], le = () => ["", U, X], c = () => ["auto", oe, f], z = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Q = () => ["solid", "dashed", "dotted", "double", "none"], Y = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ie = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], G = () => ["", "0", f], ce = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], $ = () => [oe, f];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [pe],
      spacing: [U, X],
      blur: ["none", "", J, f],
      brightness: $(),
      borderColor: [e],
      borderRadius: ["none", "", "full", J, f],
      borderSpacing: g(),
      borderWidth: le(),
      contrast: $(),
      grayscale: G(),
      hueRotate: $(),
      invert: G(),
      gap: g(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Xt, X],
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
        "break-after": ce()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": ce()
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
        object: [...z(), f]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: ae()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": ae()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": ae()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: j()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": j()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": j()
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
        z: ["auto", ue, f]
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
        order: ["first", "last", "none", ue, f]
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
          span: ["full", ue, f]
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
        "grid-rows": [pe]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [ue, f]
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
        gap: [S]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [S]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [S]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...ie()]
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
        content: ["normal", ...ie(), "baseline"]
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
        "place-content": [...ie(), "baseline"]
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
        p: [L]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [L]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [L]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [L]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [L]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [L]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [L]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [L]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [L]
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
        "space-x": [T]
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
        "space-y": [T]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Ne]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", f]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", oe, Ne]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", U, f]
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
        "placeholder-opacity": [P]
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
        "text-opacity": [P]
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
        decoration: [...Q(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", U, X]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", U, f]
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
        "bg-opacity": [P]
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
        bg: [...z(), Qt]
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
        bg: ["auto", "cover", "contain", qt]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Zt]
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
        from: [y]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [y]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [y]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [A]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [A]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [A]
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
        "border-opacity": [P]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...Q(), "hidden"]
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
        "divide-opacity": [P]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: Q()
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
        outline: ["", ...Q()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [U, f]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [U, X]
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
        ring: le()
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
        "ring-opacity": [P]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [U, X]
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
        shadow: ["", "inner", "none", J, er]
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
        opacity: [P]
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
        blur: [r]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [n]
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
        grayscale: [w]
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
        "backdrop-brightness": [n]
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
        "backdrop-grayscale": [w]
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
        "backdrop-opacity": [P]
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
        scale: [F]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [F]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [F]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [ue, f]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [se]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [se]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [q]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [q]
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
        stroke: [U, X, Ne]
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
}, sr = /* @__PURE__ */ Gt(nr);
function h(...e) {
  return sr(_t(e));
}
const ar = "copanel_mobile_desktop_site";
function lr() {
  try {
    return localStorage.getItem(ar) === "1";
  } catch {
    return !1;
  }
}
function Te(e = window.innerWidth) {
  return lr() || e >= 1024;
}
function ir({ children: e, className: t, constrained: r = !1 }) {
  const { theme: n } = Pe(), o = Ee(), i = n === "dark", l = !o && !Te();
  return /* @__PURE__ */ s(
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
function cr({
  isDark: e,
  sidebar: t,
  children: r,
  mobileTitle: n,
  className: o
}) {
  const i = Ee(), [l, u] = N(!1), [p, w] = N(() => Te());
  ge(() => {
    const S = () => w(Te());
    return window.addEventListener("resize", S), () => window.removeEventListener("resize", S);
  }, []);
  const b = !i && !p;
  ge(() => {
    p && u(!1);
  }, [p]);
  const _ = () => u(!1);
  return b ? /* @__PURE__ */ d("div", { className: h("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", o), children: [
    /* @__PURE__ */ d(
      "div",
      {
        className: h(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2.5",
          e ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white"
        ),
        children: [
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              onClick: () => u(!0),
              className: h(
                "inline-flex items-center justify-center rounded-lg p-2",
                e ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ s(x.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          n ? /* @__PURE__ */ s("span", { className: h("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: n }) : null
        ]
      }
    ),
    l ? /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: _
      }
    ) : null,
    /* @__PURE__ */ s(
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
    /* @__PURE__ */ s("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: r })
  ] }) : /* @__PURE__ */ d("div", { className: h("flex h-full min-h-0 flex-1 overflow-hidden", o), children: [
    t,
    /* @__PURE__ */ s("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: r })
  ] });
}
const dr = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function Ce({
  open: e,
  onClose: t,
  children: r,
  title: n,
  className: o,
  maxWidth: i = "lg",
  closeOnBackdropClick: l = !0
}) {
  const { theme: u } = Pe(), p = u === "dark", w = gt(null), [b, _] = N(null);
  yt(() => {
    const y = w.current?.closest(".module-window-viewport");
    _(y instanceof HTMLElement ? y : null);
  }, []);
  const S = !!b, A = e ? /* @__PURE__ */ s(
    "div",
    {
      className: h(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        S ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: l ? t : void 0,
      children: /* @__PURE__ */ d(
        "div",
        {
          className: h(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            dr[i],
            p ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            o
          ),
          onClick: (y) => y.stopPropagation(),
          children: [
            n && /* @__PURE__ */ d(
              "div",
              {
                className: h(
                  "flex items-center justify-between border-b px-4 py-3",
                  p ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ s("h3", { className: "text-sm font-bold", children: n }),
                  /* @__PURE__ */ s("button", { type: "button", onClick: t, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ s(x.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            r
          ]
        }
      )
    }
  ) : null;
  return /* @__PURE__ */ d(Ve, { children: [
    /* @__PURE__ */ s("span", { ref: w, className: "hidden", "aria-hidden": "true" }),
    A ? vt(A, S && b ? b : document.body) : null
  ] });
}
class Ge extends Error {
  constructor(r, n, o, i) {
    super(n);
    D(this, "code");
    D(this, "status");
    D(this, "details");
    this.code = r, this.status = o, this.details = i;
  }
}
async function B(e, t = {}) {
  const r = typeof window < "u" ? localStorage.getItem("copanel_token") : null, n = {
    "Content-Type": "application/json",
    ...t.headers || {}
  };
  r && (n.Authorization = `Bearer ${r}`);
  const o = {
    method: t.method || "GET",
    headers: n,
    signal: t.signal
  };
  t.body !== void 0 && (o.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body));
  const i = await fetch(e, o);
  let l = null;
  const u = await i.text();
  if (u)
    try {
      l = JSON.parse(u);
    } catch {
      l = u;
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
const et = "copanel-session-expired", ur = /* @__PURE__ */ new Set([
  "/api/auth/login",
  "/api/panel_settings/branding/public"
]);
function pr(e) {
  try {
    const t = typeof e == "string" ? e : e instanceof URL ? e.href : String(e.url || "");
    return (t.startsWith("http://") || t.startsWith("https://") ? new URL(t) : new URL(t, "http://localhost")).pathname;
  } catch {
    return "";
  }
}
function mr(e) {
  if (!e) return !1;
  for (const t of ur)
    if (e === t || e.startsWith(`${t}/`)) return !0;
  return !1;
}
function hr() {
  typeof window > "u" || window.dispatchEvent(new CustomEvent(et));
}
function re() {
  return typeof localStorage > "u" ? null : localStorage.getItem("copanel_token");
}
function fr(e) {
  const t = {};
  e && new Headers(e).forEach((o, i) => {
    t[i] = o;
  });
  const r = re();
  return r && (t.Authorization = `Bearer ${r}`), t;
}
function br(e, t = {}) {
  const r = fr(t.headers);
  return fetch(e, { ...t, headers: r }).then((n) => (n.status === 401 && !mr(pr(e)) && hr(), n));
}
async function gr() {
  if (!re()) return null;
  try {
    const e = await br("/api/auth/stream-ticket", { method: "POST" });
    if (e.status === 401 || !e.ok) return null;
    const t = await e.json();
    return typeof t?.ticket == "string" ? t.ticket : null;
  } catch {
    return null;
  }
}
const yr = "copanel-platform-sse-degraded", me = 2e3, xr = 6e4, wr = 3;
class vr {
  constructor() {
    D(this, "source", null);
    D(this, "handlers", /* @__PURE__ */ new Map());
    D(this, "retryDelay", me);
    D(this, "retryTimer", null);
    D(this, "failureCount", 0);
    D(this, "connecting", !1);
    D(this, "authFailed", !1);
  }
  on(t, r) {
    let n = this.handlers.get(t);
    return n || (n = /* @__PURE__ */ new Set(), this.handlers.set(t, n)), n.add(r), this.ensureConnected(), () => {
      n.delete(r), n.size === 0 && this.handlers.delete(t), this.teardownIfIdle();
    };
  }
  emit(t, r) {
    const n = this.handlers.get(t);
    n && n.forEach((o) => {
      try {
        o(r);
      } catch (i) {
        console.error("event handler failed", t, i);
      }
    });
  }
  async buildUrl() {
    if (!re()) return null;
    const t = await gr();
    return t ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      ticket: t
    }).toString()}` : null;
  }
  ensureConnected() {
    this.authFailed || this.source || this.connecting || typeof document < "u" && document.hidden || re() && (this.connecting = !0, this.buildUrl().then((t) => {
      if (this.connecting = !1, !(this.source || this.handlers.size === 0)) {
        if (!t) {
          if (!re()) {
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
    }), this.source.addEventListener("jobs", (r) => {
      this.onStreamMessage(), this.parseAndEmit("jobs", r.data);
    }), this.source.addEventListener("notifications", (r) => {
      this.onStreamMessage(), this.parseAndEmit("notifications", r.data);
    }), this.source.addEventListener("message", () => {
      this.onStreamMessage();
    }), this.source.onerror = () => {
      this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= wr && window.dispatchEvent(new CustomEvent(yr)), this.scheduleRetry();
    };
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = me;
  }
  parseAndEmit(t, r) {
    try {
      const n = JSON.parse(r);
      this.emit(t, n.payload || n);
    } catch {
    }
  }
  scheduleRetry() {
    if (this.retryTimer || this.handlers.size === 0) return;
    const t = this.retryDelay;
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), xr), this.retryTimer = setTimeout(() => {
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
    this.authFailed = !1, this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = me, this.handlers.size > 0 && re() && this.ensureConnected();
  }
}
const ye = new vr();
function kr() {
  ye.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || kr();
});
typeof window < "u" && window.addEventListener(et, () => {
  ye.stop();
});
function tt(e) {
  let t = e;
  const r = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (n) => {
      const o = typeof n == "function" ? n(t) : n;
      if (!o || Object.keys(o).length === 0) return;
      let i = !1;
      for (const l of Object.keys(o))
        if (t[l] !== o[l]) {
          i = !0;
          break;
        }
      i && (t = { ...t, ...o }, r.forEach((l) => l()));
    },
    subscribe: (n) => (r.add(n), () => r.delete(n))
  };
}
const rt = tt({ jobs: {}, order: [], lastFetch: 0 });
function Nr() {
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
  const n = De(e[t], r);
  if (n) return n;
  const o = De(e[`${t}_i18n`], r);
  if (o) return o;
  const i = e[`${t}_${r}`];
  if (typeof i == "string" && i) return i;
  const l = e[`${t}_en`];
  if (typeof l == "string" && l) return l;
  const u = e[`${t}_vi`];
  if (typeof u == "string" && u) return u;
}
function Cr(e) {
  const t = Nr(), r = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: te(e, "title", t) || te(r, "title", t) || e?.title || "",
    message: te(e, "message", t) || te(r, "message", t) || e?.message,
    error: te(e, "error", t) || te(r, "error", t) || e?.error || null
  };
}
function Be(e) {
  const t = Cr(e);
  rt.setState((r) => {
    const n = { ...r.jobs, [t.id]: { ...r.jobs[t.id], ...t } };
    let o = r.order;
    return o.includes(t.id) || (o = [t.id, ...o].slice(0, 200)), { jobs: n, order: o };
  });
}
ye.on("jobs", (e) => {
  if (e?.job) {
    Be(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = rt.getState().jobs[e.job_id];
    t && Be({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const _e = tt({ inbox: [], unread: 0, toasts: [] }), Sr = 6e3;
function Tr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function We(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function be(e, t, r) {
  if (!e || typeof e != "object") return;
  const n = We(e[t], r);
  if (n) return n;
  const o = We(e[`${t}_i18n`], r);
  if (o) return o;
  const i = e[`${t}_${r}`];
  if (typeof i == "string" && i) return i;
  const l = e[`${t}_en`];
  if (typeof l == "string" && l) return l;
  const u = e[`${t}_vi`];
  if (typeof u == "string" && u) return u;
}
function _r(e) {
  const t = Tr(), r = e?.payload && typeof e.payload == "object" ? e.payload : {}, n = be(e, "title", t) || be(r, "title", t) || e?.title || "", o = be(e, "body", t) || be(r, "body", t) || e?.body || null;
  return {
    ...e,
    title: n,
    body: o
  };
}
function Pr(e) {
  _e.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    _e.setState((t) => ({ toasts: t.toasts.filter((r) => r.id !== e.id) }));
  }, Sr);
}
ye.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = _r(e.notification);
    Pr({ ...t, ephemeral: !0 }), _e.setState((r) => ({
      inbox: [t, ...r.inbox].slice(0, 200),
      unread: r.unread + 1
    }));
  }
});
const Er = {
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
}, Mr = {
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
}, zr = { en: Er, vi: Mr }, Ue = () => ({
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
function Ar(e) {
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
function Lr(e) {
  return e === "sftp" ? "22" : "21";
}
function Fr(e) {
  return e ? e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : e < 1024 * 1024 * 1024 ? `${(e / (1024 * 1024)).toFixed(1)} MB` : `${(e / (1024 * 1024 * 1024)).toFixed(2)} GB` : "—";
}
function jr(e) {
  if (!e) return "—";
  try {
    return new Date(e * 1e3).toLocaleString();
  } catch {
    return "—";
  }
}
function Dr() {
  const { theme: e, language: t } = Pe(), r = e === "dark", o = zr[t === "vi" ? "vi" : "en"], i = Ee(), [l, u] = N([]), [p, w] = N(null), [b, _] = N("/"), [S, A] = N([]), [y, C] = N(null), [v, P] = N(!0), [L, V] = N(!1), [F, E] = N(!1), [q, T] = N(null), [se, j] = N(null), [ae, W] = N(!1), [g, le] = N(null), [c, z] = N(Ue()), [Q, Y] = N(!1), [ie, G] = N(!1), [ce, $] = N("download"), [xe, we] = N("/tmp"), [ze, ot] = N(!0), [nt, Z] = N(!1), [ve, Ae] = N("connection"), O = Ie(
    () => l.find((a) => a.id === p) || null,
    [l, p]
  ), he = Re(async (a) => {
    P(!0), T(null);
    try {
      const m = await B("/api/ftp_manager/connections"), M = Array.isArray(m) ? m : [];
      u(M), w((ee) => a != null && M.some((ke) => ke.id === a) ? a : ee != null && M.some((ke) => ke.id === ee) ? ee : M.length > 0 ? M[0].id : null);
    } catch (m) {
      T(m?.message || String(m)), u([]);
    } finally {
      P(!1);
    }
  }, []), H = Re(async (a, m) => {
    V(!0), T(null), C(null);
    try {
      const M = await B(
        `/api/ftp_manager/connections/${a}/list?path=${encodeURIComponent(m)}`
      );
      _(M.path || m || "/"), A(Array.isArray(M.items) ? M.items : []);
    } catch (M) {
      T(M?.message || String(M)), A([]);
    } finally {
      V(!1);
    }
  }, []);
  ge(() => {
    he();
  }, [he]), ge(() => {
    if (p != null) {
      const a = l.find((m) => m.id === p)?.remote_root || "/";
      H(p, a);
    } else
      A([]), _("/");
  }, [p]);
  const Le = Ie(() => {
    const a = b.split("/").filter(Boolean), m = [{ label: "/", path: "/" }];
    let M = "";
    for (const ee of a)
      M += `/${ee}`, m.push({ label: ee, path: M });
    return m;
  }, [b]), Fe = () => {
    le(null), z(Ue()), Y(!1), W(!0), j(null), T(null);
  }, st = (a) => {
    le(a.id), z(Ar(a)), Y(!1), W(!0), j(null), T(null);
  }, at = (a) => {
    z((m) => ({
      ...m,
      protocol: a,
      port: m.port === "21" || m.port === "22" || !m.port ? Lr(a) : m.port,
      auth_type: a === "sftp" ? m.auth_type : "password"
    }));
  }, lt = async () => {
    E(!0), T(null), j(null);
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
      g == null ? m = (await B("/api/ftp_manager/connections", {
        method: "POST",
        body: a
      })).id : await B(`/api/ftp_manager/connections/${g}`, {
        method: "PATCH",
        body: a
      }), W(!1), await he(m), j(o.saved);
    } catch (a) {
      T(a?.message || String(a));
    } finally {
      E(!1);
    }
  }, je = async (a) => {
    E(!0), T(null), j(null);
    try {
      a != null ? await B(`/api/ftp_manager/connections/${a}/test`, { method: "POST", body: {} }) : await B("/api/ftp_manager/connections/test", {
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
      }), j(o.testOk);
    } catch (m) {
      T(m?.message || o.testFail);
    } finally {
      E(!1);
    }
  }, it = async () => {
    if (p != null) {
      E(!0);
      try {
        await B(`/api/ftp_manager/connections/${p}`, { method: "DELETE" }), w(null), Z(!1), await he(null);
      } catch (a) {
        T(a?.message || String(a));
      } finally {
        E(!1);
      }
    }
  }, ct = async () => {
    if (p == null) return;
    const a = window.prompt(o.namePrompt);
    if (!a || !a.trim()) return;
    const m = `${b.replace(/\/$/, "")}/${a.trim()}`;
    E(!0);
    try {
      await B(`/api/ftp_manager/connections/${p}/mkdir`, {
        method: "POST",
        body: { path: m }
      }), await H(p, b);
    } catch (M) {
      T(M?.message || String(M));
    } finally {
      E(!1);
    }
  }, dt = async () => {
    if (p == null || !y) return;
    const a = window.prompt(o.renamePrompt, y.name);
    if (!(!a || !a.trim() || a.trim() === y.name)) {
      E(!0);
      try {
        await B(`/api/ftp_manager/connections/${p}/rename`, {
          method: "POST",
          body: { path: y.path, new_name: a.trim() }
        }), await H(p, b);
      } catch (m) {
        T(m?.message || String(m));
      } finally {
        E(!1);
      }
    }
  }, ut = async () => {
    if (!(p == null || !y)) {
      E(!0);
      try {
        await B(`/api/ftp_manager/connections/${p}/delete`, {
          method: "POST",
          body: { path: y.path, recursive: y.is_dir }
        }), Z(!1), C(null), await H(p, b);
      } catch (a) {
        T(a?.message || String(a));
      } finally {
        E(!1);
      }
    }
  }, pt = async () => {
    if (p == null) return;
    const a = y?.path || b;
    E(!0), T(null), j(null);
    try {
      const m = await B("/api/ftp_manager/transfer_job", {
        method: "POST",
        body: {
          connection_id: p,
          direction: ce,
          remote_path: a,
          local_path: xe.trim(),
          overwrite: ze
        }
      });
      G(!1), j(`${o.jobQueued}: ${m.job_id}`);
    } catch (m) {
      T(m?.message || String(m));
    } finally {
      E(!1);
    }
  }, I = h(
    "w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
    "focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500",
    r ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-300 bg-white text-slate-900"
  ), R = h("mb-1.5 block text-xs font-medium", r ? "text-slate-400" : "text-slate-500"), de = h(
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white",
    "bg-sky-600 hover:bg-sky-500 disabled:opacity-50"
  ), K = h(
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium border",
    r ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"
  ), fe = h(
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border",
    r ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"
  ), mt = /* @__PURE__ */ d(
    "aside",
    {
      className: h(
        "flex h-full w-[220px] shrink-0 flex-col border-r",
        r ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-slate-50/95"
      ),
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            className: h(
              "flex shrink-0 items-center justify-between gap-2 border-b px-3 py-3",
              r ? "border-slate-800" : "border-slate-200"
            ),
            children: [
              /* @__PURE__ */ d("div", { className: "min-w-0", children: [
                /* @__PURE__ */ s("div", { className: "truncate text-sm font-semibold", children: o.title }),
                /* @__PURE__ */ s("div", { className: h("truncate text-[11px]", r ? "text-slate-500" : "text-slate-400"), children: o.subtitle })
              ] }),
              /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  title: o.add,
                  onClick: Fe,
                  className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white hover:bg-sky-500",
                  children: /* @__PURE__ */ s(x.Plus, { className: "h-4 w-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ d("nav", { className: "min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2", children: [
          v && /* @__PURE__ */ d("div", { className: h("flex items-center gap-2 px-2 py-3 text-xs", r ? "text-slate-500" : "text-slate-400"), children: [
            /* @__PURE__ */ s(x.Loader2, { className: "h-3.5 w-3.5 animate-spin" }),
            o.loading
          ] }),
          !v && l.length === 0 && /* @__PURE__ */ s("p", { className: h("px-2 py-6 text-center text-[11px] leading-relaxed", r ? "text-slate-500" : "text-slate-400"), children: o.emptySidebar }),
          !v && l.map((a) => {
            const m = a.id === p;
            return /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => w(a.id),
                className: h(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs transition",
                  m ? r ? "bg-slate-800 text-white" : "bg-white text-slate-900 shadow-sm" : r ? "text-slate-300 hover:bg-slate-900/70" : "text-slate-700 hover:bg-white/80"
                ),
                children: [
                  /* @__PURE__ */ s(
                    x.HardDrive,
                    {
                      className: h("h-4 w-4 shrink-0", m ? "text-sky-500" : "text-slate-400")
                    }
                  ),
                  /* @__PURE__ */ d("span", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ s("span", { className: "block truncate font-medium", children: a.label }),
                    /* @__PURE__ */ d("span", { className: h("block truncate", r ? "text-slate-500" : "text-slate-400"), children: [
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
  ), ht = q || se ? /* @__PURE__ */ d(
    "div",
    {
      className: h(
        "mx-4 mt-3 flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs",
        q ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
      ),
      children: [
        q ? /* @__PURE__ */ s(x.AlertTriangle, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ s(x.CheckCircle2, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ s("span", { className: "min-w-0 flex-1", children: q || se }),
        /* @__PURE__ */ s("button", { type: "button", className: "opacity-60 hover:opacity-100", onClick: () => {
          T(null), j(null);
        }, children: /* @__PURE__ */ s(x.X, { className: "h-3.5 w-3.5" }) })
      ]
    }
  ) : null;
  return /* @__PURE__ */ d(ir, { constrained: !0, className: "overflow-hidden", children: [
    /* @__PURE__ */ s(
      cr,
      {
        isDark: r,
        mobileTitle: o.title,
        className: h("min-h-0", r ? "text-slate-100" : "text-slate-900"),
        sidebar: mt,
        children: /* @__PURE__ */ d("div", { className: "flex h-full min-h-0 flex-col overflow-hidden", children: [
          ht,
          O ? /* @__PURE__ */ d(Ve, { children: [
            /* @__PURE__ */ d(
              "header",
              {
                className: h(
                  "flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-3",
                  r ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ d("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ s("h1", { className: "truncate text-base font-semibold", children: O.label }),
                    /* @__PURE__ */ d("p", { className: h("truncate text-xs", r ? "text-slate-500" : "text-slate-400"), children: [
                      O.protocol.toUpperCase(),
                      "://",
                      O.username,
                      "@",
                      O.host,
                      ":",
                      O.port
                    ] })
                  ] }),
                  /* @__PURE__ */ d("div", { className: "flex flex-wrap gap-1.5", children: [
                    /* @__PURE__ */ d("button", { type: "button", className: K, disabled: F, onClick: () => je(O.id), children: [
                      /* @__PURE__ */ s(x.ShieldCheck, { className: "h-4 w-4" }),
                      F ? o.testing : o.test
                    ] }),
                    /* @__PURE__ */ d("button", { type: "button", className: K, onClick: () => st(O), children: [
                      /* @__PURE__ */ s(x.Pencil, { className: "h-4 w-4" }),
                      o.edit
                    ] }),
                    /* @__PURE__ */ d(
                      "button",
                      {
                        type: "button",
                        className: K,
                        onClick: () => {
                          Ae("connection"), Z(!0);
                        },
                        children: [
                          /* @__PURE__ */ s(x.Trash2, { className: "h-4 w-4" }),
                          o.delete
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ d(
              "div",
              {
                className: h(
                  "flex shrink-0 flex-wrap items-center gap-1.5 border-b px-3 py-2",
                  r ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ s("div", { className: "flex min-w-0 flex-1 flex-wrap items-center gap-0.5 text-sm", children: Le.map((a, m) => /* @__PURE__ */ d("span", { className: "inline-flex items-center gap-0.5", children: [
                    m > 0 && /* @__PURE__ */ s(x.ChevronRight, { className: "h-3.5 w-3.5 opacity-40" }),
                    /* @__PURE__ */ s(
                      "button",
                      {
                        type: "button",
                        className: h(
                          "rounded px-1.5 py-0.5 hover:text-sky-500",
                          m === Le.length - 1 && "font-medium"
                        ),
                        onClick: () => H(O.id, a.path),
                        children: a.label
                      }
                    )
                  ] }, a.path)) }),
                  /* @__PURE__ */ s("button", { type: "button", className: fe, title: o.refresh, disabled: L, onClick: () => H(O.id, b), children: /* @__PURE__ */ s(x.RefreshCw, { className: h("h-4 w-4", L && "animate-spin") }) }),
                  /* @__PURE__ */ s("button", { type: "button", className: fe, title: o.mkdir, onClick: ct, children: /* @__PURE__ */ s(x.FolderPlus, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ s("button", { type: "button", className: fe, title: o.rename, disabled: !y, onClick: dt, children: /* @__PURE__ */ s(x.TextCursorInput, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ s(
                    "button",
                    {
                      type: "button",
                      className: fe,
                      title: o.deleteItem,
                      disabled: !y,
                      onClick: () => {
                        Ae("item"), Z(!0);
                      },
                      children: /* @__PURE__ */ s(x.Trash2, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      className: K,
                      onClick: () => {
                        $("download"), we("/tmp"), G(!0);
                      },
                      children: [
                        /* @__PURE__ */ s(x.Download, { className: "h-4 w-4" }),
                        o.download
                      ]
                    }
                  ),
                  /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      className: de,
                      onClick: () => {
                        $("upload"), we("/tmp"), G(!0);
                      },
                      children: [
                        /* @__PURE__ */ s(x.Upload, { className: "h-4 w-4" }),
                        o.upload
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ s("div", { className: h("min-h-0 flex-1 overflow-y-auto overscroll-contain", ""), children: /* @__PURE__ */ d("table", { className: "w-full text-left text-sm", children: [
              /* @__PURE__ */ s(
                "thead",
                {
                  className: h(
                    "sticky top-0 z-10 border-b text-[11px] uppercase tracking-wide",
                    r ? "border-slate-800 bg-slate-950 text-slate-500" : "border-slate-200 bg-slate-50 text-slate-400"
                  ),
                  children: /* @__PURE__ */ d("tr", { children: [
                    /* @__PURE__ */ s("th", { className: "px-4 py-2.5 font-medium", children: o.name }),
                    /* @__PURE__ */ s("th", { className: "px-4 py-2.5 font-medium", children: o.type }),
                    /* @__PURE__ */ s("th", { className: "px-4 py-2.5 font-medium", children: o.size }),
                    /* @__PURE__ */ s("th", { className: "px-4 py-2.5 font-medium", children: o.modified })
                  ] })
                }
              ),
              /* @__PURE__ */ d("tbody", { children: [
                b !== "/" && /* @__PURE__ */ s(
                  "tr",
                  {
                    className: h(
                      "cursor-pointer border-b",
                      r ? "border-slate-800/80 hover:bg-slate-900" : "border-slate-100 hover:bg-slate-50"
                    ),
                    onDoubleClick: () => {
                      const a = b.replace(/\/+$/, "").split("/").slice(0, -1).join("/") || "/";
                      H(O.id, a);
                    },
                    children: /* @__PURE__ */ s("td", { className: "px-4 py-2.5", colSpan: 4, children: /* @__PURE__ */ d("span", { className: "inline-flex items-center gap-2 opacity-70", children: [
                      /* @__PURE__ */ s(x.CornerLeftUp, { className: "h-4 w-4" }),
                      ".."
                    ] }) })
                  }
                ),
                !L && S.length === 0 && /* @__PURE__ */ s("tr", { children: /* @__PURE__ */ s("td", { className: "px-4 py-10 text-center text-sm opacity-50", colSpan: 4, children: o.noItems }) }),
                S.map((a) => {
                  const m = y?.path === a.path;
                  return /* @__PURE__ */ d(
                    "tr",
                    {
                      className: h(
                        "cursor-pointer border-b",
                        r ? "border-slate-800/80" : "border-slate-100",
                        m ? "bg-sky-500/10" : r ? "hover:bg-slate-900" : "hover:bg-slate-50"
                      ),
                      onClick: () => C(a),
                      onDoubleClick: () => {
                        a.is_dir && H(O.id, a.path);
                      },
                      children: [
                        /* @__PURE__ */ s("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ d("span", { className: "inline-flex items-center gap-2", children: [
                          a.is_dir ? /* @__PURE__ */ s(x.Folder, { className: "h-4 w-4 text-amber-500" }) : /* @__PURE__ */ s(x.File, { className: "h-4 w-4 opacity-50" }),
                          a.name
                        ] }) }),
                        /* @__PURE__ */ s("td", { className: "px-4 py-2.5 opacity-60", children: a.is_dir ? o.folder : o.file }),
                        /* @__PURE__ */ s("td", { className: "px-4 py-2.5 opacity-60", children: a.is_dir ? "—" : Fr(a.size) }),
                        /* @__PURE__ */ s("td", { className: "px-4 py-2.5 opacity-60", children: jr(a.modified) })
                      ]
                    },
                    a.path
                  );
                })
              ] })
            ] }) }),
            /* @__PURE__ */ d(
              "div",
              {
                className: h(
                  "flex shrink-0 items-center justify-between gap-2 border-t px-4 py-2 text-[11px]",
                  r ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"
                ),
                children: [
                  /* @__PURE__ */ d("span", { className: "truncate", children: [
                    o.path,
                    ": ",
                    b,
                    y ? ` · ${y.name}` : ""
                  ] }),
                  /* @__PURE__ */ d(wt, { to: "/file-manager", className: "inline-flex items-center gap-1 text-sky-500 hover:underline", children: [
                    /* @__PURE__ */ s(x.FolderOpen, { className: "h-3.5 w-3.5" }),
                    o.openFileManager
                  ] })
                ]
              }
            )
          ] }) : /* @__PURE__ */ d("div", { className: "flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center", children: [
            /* @__PURE__ */ s(
              "div",
              {
                className: h(
                  "flex h-14 w-14 items-center justify-center rounded-2xl",
                  r ? "bg-slate-800" : "bg-slate-100"
                ),
                children: /* @__PURE__ */ s(x.Server, { className: h("h-7 w-7", r ? "text-slate-400" : "text-slate-500") })
              }
            ),
            /* @__PURE__ */ d("div", { className: "max-w-sm space-y-1.5", children: [
              /* @__PURE__ */ s("h2", { className: "text-base font-semibold", children: o.emptyTitle }),
              /* @__PURE__ */ s("p", { className: h("text-sm", r ? "text-slate-400" : "text-slate-500"), children: o.emptyHint })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", className: de, onClick: Fe, children: [
              /* @__PURE__ */ s(x.Plus, { className: "h-4 w-4" }),
              o.add
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ s(
      Ce,
      {
        open: ae,
        onClose: () => W(!1),
        title: g == null ? o.add : o.edit,
        maxWidth: "lg",
        className: "max-h-[85vh]",
        children: /* @__PURE__ */ d("div", { className: "space-y-4 p-1", children: [
          /* @__PURE__ */ d("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ d("label", { className: "block sm:col-span-1", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.label }),
              /* @__PURE__ */ s(
                "input",
                {
                  className: I,
                  autoComplete: "off",
                  value: c.label,
                  onChange: (a) => z({ ...c, label: a.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ d("label", { className: "block sm:col-span-1", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.protocol }),
              /* @__PURE__ */ d(
                "select",
                {
                  className: I,
                  value: c.protocol,
                  onChange: (a) => at(a.target.value),
                  children: [
                    /* @__PURE__ */ s("option", { value: "sftp", children: "SFTP" }),
                    /* @__PURE__ */ s("option", { value: "ftp", children: "FTP" }),
                    /* @__PURE__ */ s("option", { value: "ftps", children: "FTPS" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ d("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.host }),
              /* @__PURE__ */ s(
                "input",
                {
                  className: I,
                  autoComplete: "off",
                  value: c.host,
                  onChange: (a) => z({ ...c, host: a.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ d("label", { className: "block", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.port }),
              /* @__PURE__ */ s(
                "input",
                {
                  className: I,
                  autoComplete: "off",
                  inputMode: "numeric",
                  value: c.port,
                  onChange: (a) => z({ ...c, port: a.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ d("label", { className: "block", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.username }),
              /* @__PURE__ */ s(
                "input",
                {
                  className: I,
                  autoComplete: "off",
                  name: "ftp-username",
                  value: c.username,
                  onChange: (a) => z({ ...c, username: a.target.value })
                }
              )
            ] }),
            c.protocol === "sftp" && /* @__PURE__ */ d("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.authType }),
              /* @__PURE__ */ d(
                "select",
                {
                  className: I,
                  value: c.auth_type,
                  onChange: (a) => z({ ...c, auth_type: a.target.value }),
                  children: [
                    /* @__PURE__ */ s("option", { value: "password", children: o.authPassword }),
                    /* @__PURE__ */ s("option", { value: "key_path", children: o.authKeyPath }),
                    /* @__PURE__ */ s("option", { value: "key_blob", children: o.authKeyBlob })
                  ]
                }
              )
            ] }),
            (c.auth_type === "password" || c.protocol !== "sftp") && /* @__PURE__ */ d("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.password }),
              /* @__PURE__ */ s(
                "input",
                {
                  type: "password",
                  className: I,
                  autoComplete: "new-password",
                  name: "ftp-password",
                  value: c.password,
                  placeholder: g != null ? o.passwordKeep : "",
                  onChange: (a) => z({ ...c, password: a.target.value })
                }
              )
            ] }),
            c.protocol === "sftp" && c.auth_type === "key_path" && /* @__PURE__ */ d("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.keyPath }),
              /* @__PURE__ */ s(
                "input",
                {
                  className: I,
                  autoComplete: "off",
                  value: c.key_path,
                  placeholder: g != null ? o.keyKeep : "~/.ssh/id_ed25519",
                  onChange: (a) => z({ ...c, key_path: a.target.value })
                }
              )
            ] }),
            c.protocol === "sftp" && c.auth_type === "key_blob" && /* @__PURE__ */ d("label", { className: "block sm:col-span-2", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.keyBlob }),
              /* @__PURE__ */ s(
                "textarea",
                {
                  className: h(I, "min-h-[100px] font-mono text-xs"),
                  autoComplete: "off",
                  value: c.key_blob,
                  placeholder: g != null ? o.keyKeep : "-----BEGIN OPENSSH PRIVATE KEY-----",
                  onChange: (a) => z({ ...c, key_blob: a.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: h(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium",
                r ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-50"
              ),
              onClick: () => Y((a) => !a),
              children: [
                Q ? /* @__PURE__ */ s(x.ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ s(x.ChevronRight, { className: "h-3.5 w-3.5" }),
                o.advanced
              ]
            }
          ),
          Q && /* @__PURE__ */ d("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ d("label", { className: "block", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.remoteRoot }),
              /* @__PURE__ */ s(
                "input",
                {
                  className: I,
                  autoComplete: "off",
                  value: c.remote_root,
                  onChange: (a) => z({ ...c, remote_root: a.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ d("label", { className: "block", children: [
              /* @__PURE__ */ s("span", { className: R, children: o.timeout }),
              /* @__PURE__ */ s(
                "input",
                {
                  className: I,
                  autoComplete: "off",
                  inputMode: "numeric",
                  value: c.timeout,
                  onChange: (a) => z({ ...c, timeout: a.target.value })
                }
              )
            ] }),
            c.protocol !== "sftp" && /* @__PURE__ */ d("label", { className: "flex items-center gap-2 text-sm sm:col-span-2", children: [
              /* @__PURE__ */ s(
                "input",
                {
                  type: "checkbox",
                  checked: c.passive,
                  onChange: (a) => z({ ...c, passive: a.target.checked })
                }
              ),
              o.passive
            ] })
          ] }),
          /* @__PURE__ */ d("div", { className: "flex flex-wrap justify-end gap-2 border-t pt-3", style: { borderColor: r ? "#1e293b" : "#e2e8f0" }, children: [
            /* @__PURE__ */ s("button", { type: "button", className: K, onClick: () => W(!1), children: o.cancel }),
            /* @__PURE__ */ s("button", { type: "button", className: K, disabled: F || !c.host.trim() || !c.username.trim(), onClick: () => je(), children: F ? o.testing : o.test }),
            /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: de,
                disabled: F || !c.label.trim() || !c.host.trim() || !c.username.trim(),
                onClick: lt,
                children: F ? o.saving : o.save
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ s(
      Ce,
      {
        open: ie,
        onClose: () => G(!1),
        title: ce === "download" ? o.download : o.upload,
        maxWidth: "md",
        children: /* @__PURE__ */ d("div", { className: "space-y-3 p-1", children: [
          /* @__PURE__ */ d("label", { className: "block", children: [
            /* @__PURE__ */ s("span", { className: R, children: o.remotePath }),
            /* @__PURE__ */ s("input", { className: I, value: y?.path || b, readOnly: !0 })
          ] }),
          /* @__PURE__ */ d("label", { className: "block", children: [
            /* @__PURE__ */ s("span", { className: R, children: o.localPath }),
            /* @__PURE__ */ s(
              "input",
              {
                className: I,
                autoComplete: "off",
                value: xe,
                onChange: (a) => we(a.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ d("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ s("input", { type: "checkbox", checked: ze, onChange: (a) => ot(a.target.checked) }),
            o.overwrite
          ] }),
          /* @__PURE__ */ d("div", { className: "flex justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ s("button", { type: "button", className: K, onClick: () => G(!1), children: o.cancel }),
            /* @__PURE__ */ d("button", { type: "button", className: de, disabled: F || !xe.trim(), onClick: pt, children: [
              /* @__PURE__ */ s(x.Play, { className: "h-4 w-4" }),
              o.transferJob
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ s(
      Ce,
      {
        open: nt,
        onClose: () => Z(!1),
        title: ve === "connection" ? o.delete : o.deleteItem,
        maxWidth: "sm",
        children: /* @__PURE__ */ d("div", { className: "space-y-4 p-1", children: [
          /* @__PURE__ */ s("p", { className: h("text-sm", r ? "text-slate-300" : "text-slate-600"), children: ve === "connection" ? o.confirmDelete : o.confirmDeleteItem }),
          /* @__PURE__ */ d("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ s("button", { type: "button", className: K, onClick: () => Z(!1), children: o.cancel }),
            /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: h(de, "!bg-red-600 hover:!bg-red-500"),
                disabled: F,
                onClick: () => ve === "connection" ? it() : ut(),
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
  Dr as default
};
