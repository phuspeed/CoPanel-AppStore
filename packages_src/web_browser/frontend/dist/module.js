var $e = Object.defineProperty;
var Le = (e, t, r) => t in e ? $e(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var E = (e, t, r) => Le(e, typeof t != "symbol" ? t + "" : t, r);
import { jsx as u, jsxs as j } from "react/jsx-runtime";
import { createContext as ke, useContext as Se, useState as L, useRef as te, useCallback as de, useEffect as ie } from "react";
import { useOutletContext as Oe } from "react-router-dom";
import * as ae from "lucide-react";
const We = ke(null);
function Ge() {
  return Se(We);
}
const Be = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Me() {
  const e = Ge(), t = Oe();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : Be);
}
function ze(e) {
  var t, r, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var i = e.length;
    for (t = 0; t < i; t++) e[t] && (r = ze(e[t])) && (o && (o += " "), o += r);
  } else for (r in e) e[r] && (o && (o += " "), o += r);
  return o;
}
function Ve() {
  for (var e, t, r = 0, o = "", i = arguments.length; r < i; r++) (e = arguments[r]) && (t = ze(e)) && (o && (o += " "), o += t);
  return o;
}
const he = "-", Fe = (e) => {
  const t = Ue(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (n) => {
      const l = n.split(he);
      return l[0] === "" && l.length !== 1 && l.shift(), Ne(l, t) || De(n);
    },
    getConflictingClassGroupIds: (n, l) => {
      const h = r[n] || [];
      return l && o[n] ? [...h, ...o[n]] : h;
    }
  };
}, Ne = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], o = t.nextPart.get(r), i = o ? Ne(e.slice(1), o) : void 0;
  if (i)
    return i;
  if (t.validators.length === 0)
    return;
  const s = e.join(he);
  return t.validators.find(({
    validator: n
  }) => n(s))?.classGroupId;
}, me = /^\[(.+)\]$/, De = (e) => {
  if (me.test(e)) {
    const t = me.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, Ue = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, o = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Je(Object.entries(e.classGroups), r).forEach(([s, n]) => {
    pe(n, o, s, t);
  }), o;
}, pe = (e, t, r, o) => {
  e.forEach((i) => {
    if (typeof i == "string") {
      const s = i === "" ? t : ye(t, i);
      s.classGroupId = r;
      return;
    }
    if (typeof i == "function") {
      if (He(i)) {
        pe(i(o), t, r, o);
        return;
      }
      t.validators.push({
        validator: i,
        classGroupId: r
      });
      return;
    }
    Object.entries(i).forEach(([s, n]) => {
      pe(n, ye(t, s), r, o);
    });
  });
}, ye = (e, t) => {
  let r = e;
  return t.split(he).forEach((o) => {
    r.nextPart.has(o) || r.nextPart.set(o, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(o);
  }), r;
}, He = (e) => e.isThemeGetter, Je = (e, t) => t ? e.map(([r, o]) => {
  const i = o.map((s) => typeof s == "string" ? t + s : typeof s == "object" ? Object.fromEntries(Object.entries(s).map(([n, l]) => [t + n, l])) : s);
  return [r, i];
}) : e, Ye = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  const i = (s, n) => {
    r.set(s, n), t++, t > e && (t = 0, o = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(s) {
      let n = r.get(s);
      if (n !== void 0)
        return n;
      if ((n = o.get(s)) !== void 0)
        return i(s, n), n;
    },
    set(s, n) {
      r.has(s) ? r.set(s, n) : i(s, n);
    }
  };
}, Te = "!", Xe = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, o = t.length === 1, i = t[0], s = t.length, n = (l) => {
    const h = [];
    let b = 0, x = 0, N;
    for (let p = 0; p < l.length; p++) {
      let m = l[p];
      if (b === 0) {
        if (m === i && (o || l.slice(p, p + s) === t)) {
          h.push(l.slice(x, p)), x = p + s;
          continue;
        }
        if (m === "/") {
          N = p;
          continue;
        }
      }
      m === "[" ? b++ : m === "]" && b--;
    }
    const S = h.length === 0 ? l : l.substring(x), v = S.startsWith(Te), R = v ? S.substring(1) : S, w = N && N > x ? N - x : void 0;
    return {
      modifiers: h,
      hasImportantModifier: v,
      baseClassName: R,
      maybePostfixModifierPosition: w
    };
  };
  return r ? (l) => r({
    className: l,
    parseClassName: n
  }) : n;
}, qe = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((o) => {
    o[0] === "[" ? (t.push(...r.sort(), o), r = []) : r.push(o);
  }), t.push(...r.sort()), t;
}, Ke = (e) => ({
  cache: Ye(e.cacheSize),
  parseClassName: Xe(e),
  ...Fe(e)
}), Ze = /\s+/, Qe = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: o,
    getConflictingClassGroupIds: i
  } = t, s = [], n = e.trim().split(Ze);
  let l = "";
  for (let h = n.length - 1; h >= 0; h -= 1) {
    const b = n[h], {
      modifiers: x,
      hasImportantModifier: N,
      baseClassName: S,
      maybePostfixModifierPosition: v
    } = r(b);
    let R = !!v, w = o(R ? S.substring(0, v) : S);
    if (!w) {
      if (!R) {
        l = b + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (w = o(S), !w) {
        l = b + (l.length > 0 ? " " + l : l);
        continue;
      }
      R = !1;
    }
    const p = qe(x).join(":"), m = N ? p + Te : p, k = m + w;
    if (s.includes(k))
      continue;
    s.push(k);
    const z = i(w, R);
    for (let T = 0; T < z.length; ++T) {
      const G = z[T];
      s.push(m + G);
    }
    l = b + (l.length > 0 ? " " + l : l);
  }
  return l;
};
function et() {
  let e = 0, t, r, o = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = _e(t)) && (o && (o += " "), o += r);
  return o;
}
const _e = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (t = _e(e[o])) && (r && (r += " "), r += t);
  return r;
};
function tt(e, ...t) {
  let r, o, i, s = n;
  function n(h) {
    const b = t.reduce((x, N) => N(x), e());
    return r = Ke(b), o = r.cache.get, i = r.cache.set, s = l, l(h);
  }
  function l(h) {
    const b = o(h);
    if (b)
      return b;
    const x = Qe(h, r);
    return i(h, x), x;
  }
  return function() {
    return s(et.apply(null, arguments));
  };
}
const y = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, Ae = /^\[(?:([a-z-]+):)?(.+)\]$/i, rt = /^\d+\/\d+$/, ot = /* @__PURE__ */ new Set(["px", "full", "screen"]), nt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, st = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, it = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, at = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, lt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, P = (e) => X(e) || ot.has(e) || rt.test(e), O = (e) => q(e, "length", gt), X = (e) => !!e && !Number.isNaN(Number(e)), ue = (e) => q(e, "number", X), re = (e) => !!e && Number.isInteger(Number(e)), ct = (e) => e.endsWith("%") && X(e.slice(0, -1)), c = (e) => Ae.test(e), W = (e) => nt.test(e), dt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), ut = (e) => q(e, dt, Re), pt = (e) => q(e, "position", Re), ft = /* @__PURE__ */ new Set(["image", "url"]), ht = (e) => q(e, ft, yt), bt = (e) => q(e, "", mt), oe = () => !0, q = (e, t, r) => {
  const o = Ae.exec(e);
  return o ? o[1] ? typeof t == "string" ? o[1] === t : t.has(o[1]) : r(o[2]) : !1;
}, gt = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  st.test(e) && !it.test(e)
), Re = () => !1, mt = (e) => at.test(e), yt = (e) => lt.test(e), wt = () => {
  const e = y("colors"), t = y("spacing"), r = y("blur"), o = y("brightness"), i = y("borderColor"), s = y("borderRadius"), n = y("borderSpacing"), l = y("borderWidth"), h = y("contrast"), b = y("grayscale"), x = y("hueRotate"), N = y("invert"), S = y("gap"), v = y("gradientColorStops"), R = y("gradientColorStopPositions"), w = y("inset"), p = y("margin"), m = y("opacity"), k = y("padding"), z = y("saturate"), T = y("scale"), G = y("sepia"), U = y("skew"), K = y("space"), C = y("translate"), I = () => ["auto", "contain", "none"], B = () => ["auto", "hidden", "clip", "visible", "scroll"], Z = () => ["auto", c, t], g = () => [c, t], se = () => ["", P, O], M = () => ["auto", X, c], V = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], H = () => ["solid", "dashed", "dotted", "double", "none"], Q = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], F = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], $ = () => ["", "0", c], ee = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], _ = () => [X, c];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [oe],
      spacing: [P, O],
      blur: ["none", "", W, c],
      brightness: _(),
      borderColor: [e],
      borderRadius: ["none", "", "full", W, c],
      borderSpacing: g(),
      borderWidth: se(),
      contrast: _(),
      grayscale: $(),
      hueRotate: _(),
      invert: $(),
      gap: g(),
      gradientColorStops: [e],
      gradientColorStopPositions: [ct, O],
      inset: Z(),
      margin: Z(),
      opacity: _(),
      padding: g(),
      saturate: _(),
      scale: _(),
      sepia: $(),
      skew: _(),
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
        aspect: ["auto", "square", "video", c]
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
        columns: [W]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": ee()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": ee()
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
        object: [...V(), c]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: B()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": B()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": B()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: I()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": I()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": I()
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
        inset: [w]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [w]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [w]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [w]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [w]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [w]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [w]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [w]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [w]
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
        z: ["auto", re, c]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: Z()
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
        flex: ["1", "auto", "initial", "none", c]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: $()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: $()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", re, c]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [oe]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", re, c]
        }, c]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": M()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": M()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [oe]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [re, c]
        }, c]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": M()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": M()
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
        "auto-cols": ["auto", "min", "max", "fr", c]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", c]
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
        justify: ["normal", ...F()]
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
        content: ["normal", ...F(), "baseline"]
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
        "place-content": [...F(), "baseline"]
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
        p: [k]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [k]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [k]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [k]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [k]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [k]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [k]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [k]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [k]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [p]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [p]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [p]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [p]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [p]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [p]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [p]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [p]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [p]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [K]
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
        "space-y": [K]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", c, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [c, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [c, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [W]
        }, W]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [c, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [c, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [c, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [c, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", W, O]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", ue]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [oe]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", c]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", X, ue]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", P, c]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", c]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", c]
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
        "placeholder-opacity": [m]
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
        "text-opacity": [m]
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
        decoration: [...H(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", P, O]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", P, c]
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
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", c]
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
        content: ["none", c]
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
        "bg-opacity": [m]
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
        bg: [...V(), pt]
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
        bg: ["auto", "cover", "contain", ut]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, ht]
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
        from: [R]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [R]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [R]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [v]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [v]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [v]
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
        border: [l]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [l]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [l]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [l]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [l]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [l]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [l]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [l]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [l]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [m]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...H(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [l]
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
        "divide-y": [l]
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
        "divide-opacity": [m]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: H()
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
        outline: ["", ...H()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [P, c]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [P, O]
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
        "ring-opacity": [m]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [P, O]
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
        shadow: ["", "inner", "none", W, bt]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [oe]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [m]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Q(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Q()
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
        contrast: [h]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", W, c]
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
        "hue-rotate": [x]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [N]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [z]
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
        "backdrop-hue-rotate": [x]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [N]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [m]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [z]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", c]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: _()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", c]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: _()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", c]
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
        rotate: [re, c]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [C]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [C]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [U]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [U]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", c]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", c]
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
        "will-change": ["auto", "scroll", "contents", "transform", c]
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
        stroke: [P, O, ue]
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
}, xt = /* @__PURE__ */ tt(wt);
function vt(...e) {
  return xt(Ve(e));
}
const Ct = "copanel_mobile_desktop_site";
function kt() {
  try {
    return localStorage.getItem(Ct) === "1";
  } catch {
    return !1;
  }
}
function St(e = window.innerWidth) {
  return kt() || e >= 1024;
}
const Mt = ke(null);
function zt() {
  return Se(Mt);
}
function Nt() {
  return zt()?.isWindowed === !0;
}
function Tt({ children: e, className: t, constrained: r = !1 }) {
  const { theme: o } = Me(), i = Nt(), s = o === "dark", n = !i && !St();
  return /* @__PURE__ */ u(
    "div",
    {
      className: vt(
        "flex flex-col transition-colors duration-200",
        i ? "h-full min-h-0" : n ? "min-h-0" : "min-h-screen",
        s ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !i && r && "mx-auto max-w-7xl",
        t
      ),
      children: e
    }
  );
}
class we extends Error {
  constructor(r, o, i, s) {
    super(o);
    E(this, "code");
    E(this, "status");
    E(this, "details");
    this.code = r, this.status = i, this.details = s;
  }
}
async function Y(e, t = {}) {
  const r = typeof window < "u" ? localStorage.getItem("copanel_token") : null, o = {
    "Content-Type": "application/json",
    ...t.headers || {}
  };
  r && (o.Authorization = `Bearer ${r}`);
  const i = {
    method: t.method || "GET",
    headers: o,
    signal: t.signal
  };
  t.body !== void 0 && (i.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body));
  const s = await fetch(e, i);
  let n = null;
  const l = await s.text();
  if (l)
    try {
      n = JSON.parse(l);
    } catch {
      n = l;
    }
  if (t.raw)
    return n;
  if (!s.ok) {
    const h = n && typeof n == "object" && n.error ? n.error : { code: `HTTP_${s.status}`, message: typeof n == "string" ? n : n?.detail || s.statusText };
    throw new we(h.code || `HTTP_${s.status}`, h.message || "Request failed", s.status, h.details);
  }
  if (n && typeof n == "object" && "status" in n) {
    if (n.status === "success")
      return n.data !== void 0 ? n.data : n;
    if (n.status === "error" && n.error)
      throw new we(n.error.code, n.error.message, s.status, n.error.details);
  }
  return n;
}
function ce() {
  return typeof localStorage > "u" ? null : localStorage.getItem("copanel_token");
}
function _t(e) {
  const t = {};
  e && new Headers(e).forEach((i, s) => {
    t[s] = i;
  });
  const r = ce();
  return r && (t.Authorization = `Bearer ${r}`), t;
}
function At(e, t = {}) {
  const r = _t(t.headers);
  return fetch(e, { ...t, headers: r });
}
async function Rt() {
  if (!ce()) return null;
  try {
    const e = await At("/api/auth/stream-ticket", { method: "POST" });
    if (!e.ok) return null;
    const t = await e.json();
    return typeof t?.ticket == "string" ? t.ticket : null;
  } catch {
    return null;
  }
}
const It = "copanel-platform-sse-degraded", ne = 2e3, Et = 6e4, jt = 3;
class Pt {
  constructor() {
    E(this, "source", null);
    E(this, "handlers", /* @__PURE__ */ new Map());
    E(this, "retryDelay", ne);
    E(this, "retryTimer", null);
    E(this, "failureCount", 0);
    E(this, "connecting", !1);
  }
  on(t, r) {
    let o = this.handlers.get(t);
    return o || (o = /* @__PURE__ */ new Set(), this.handlers.set(t, o)), o.add(r), this.ensureConnected(), () => {
      o.delete(r), o.size === 0 && this.handlers.delete(t), this.teardownIfIdle();
    };
  }
  emit(t, r) {
    const o = this.handlers.get(t);
    o && o.forEach((i) => {
      try {
        i(r);
      } catch (s) {
        console.error("event handler failed", t, s);
      }
    });
  }
  async buildUrl() {
    if (!ce()) return null;
    const t = await Rt();
    return t ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      ticket: t
    }).toString()}` : null;
  }
  ensureConnected() {
    this.source || this.connecting || typeof document < "u" && document.hidden || ce() && (this.connecting = !0, this.buildUrl().then((t) => {
      if (this.connecting = !1, !(this.source || this.handlers.size === 0)) {
        if (!t) {
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
      this.source = new EventSource(t, { withCredentials: !1 });
    } catch {
      this.scheduleRetry();
      return;
    }
    this.source.addEventListener("open", () => {
      this.failureCount = 0, this.retryDelay = ne;
    }), this.source.addEventListener("jobs", (r) => {
      this.onStreamMessage(), this.parseAndEmit("jobs", r.data);
    }), this.source.addEventListener("notifications", (r) => {
      this.onStreamMessage(), this.parseAndEmit("notifications", r.data);
    }), this.source.addEventListener("message", () => {
      this.onStreamMessage();
    }), this.source.onerror = () => {
      this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= jt && window.dispatchEvent(new CustomEvent(It)), this.scheduleRetry();
    };
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = ne;
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
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), Et), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = ne);
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = ne, this.handlers.size > 0 && this.ensureConnected();
  }
}
const be = new Pt();
function $t() {
  be.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || $t();
});
function Ie(e) {
  let t = e;
  const r = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (o) => {
      const i = typeof o == "function" ? o(t) : o;
      if (!i || Object.keys(i).length === 0) return;
      let s = !1;
      for (const n of Object.keys(i))
        if (t[n] !== i[n]) {
          s = !0;
          break;
        }
      s && (t = { ...t, ...i }, r.forEach((n) => n()));
    },
    subscribe: (o) => (r.add(o), () => r.delete(o))
  };
}
const Ee = Ie({ jobs: {}, order: [], lastFetch: 0 });
function Lt() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function xe(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function J(e, t, r) {
  if (!e || typeof e != "object") return;
  const o = xe(e[t], r);
  if (o) return o;
  const i = xe(e[`${t}_i18n`], r);
  if (i) return i;
  const s = e[`${t}_${r}`];
  if (typeof s == "string" && s) return s;
  const n = e[`${t}_en`];
  if (typeof n == "string" && n) return n;
  const l = e[`${t}_vi`];
  if (typeof l == "string" && l) return l;
}
function Ot(e) {
  const t = Lt(), r = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: J(e, "title", t) || J(r, "title", t) || e?.title || "",
    message: J(e, "message", t) || J(r, "message", t) || e?.message,
    error: J(e, "error", t) || J(r, "error", t) || e?.error || null
  };
}
function ve(e) {
  const t = Ot(e);
  Ee.setState((r) => {
    const o = { ...r.jobs, [t.id]: { ...r.jobs[t.id], ...t } };
    let i = r.order;
    return i.includes(t.id) || (i = [t.id, ...i].slice(0, 200)), { jobs: o, order: i };
  });
}
be.on("jobs", (e) => {
  if (e?.job) {
    ve(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = Ee.getState().jobs[e.job_id];
    t && ve({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const fe = Ie({ inbox: [], unread: 0, toasts: [] }), Wt = 6e3;
function Gt() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Ce(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function le(e, t, r) {
  if (!e || typeof e != "object") return;
  const o = Ce(e[t], r);
  if (o) return o;
  const i = Ce(e[`${t}_i18n`], r);
  if (i) return i;
  const s = e[`${t}_${r}`];
  if (typeof s == "string" && s) return s;
  const n = e[`${t}_en`];
  if (typeof n == "string" && n) return n;
  const l = e[`${t}_vi`];
  if (typeof l == "string" && l) return l;
}
function Bt(e) {
  const t = Gt(), r = e?.payload && typeof e.payload == "object" ? e.payload : {}, o = le(e, "title", t) || le(r, "title", t) || e?.title || "", i = le(e, "body", t) || le(r, "body", t) || e?.body || null;
  return {
    ...e,
    title: o,
    body: i
  };
}
function Vt(e) {
  fe.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    fe.setState((t) => ({ toasts: t.toasts.filter((r) => r.id !== e.id) }));
  }, Wt);
}
be.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = Bt(e.notification);
    Vt({ ...t, ephemeral: !0 }), fe.setState((r) => ({
      inbox: [t, ...r.inbox].slice(0, 200),
      unread: r.unread + 1
    }));
  }
});
async function Ft() {
  try {
    const e = await Y("/api/auth/stream-ticket", { method: "POST" });
    return typeof e?.ticket == "string" ? e.ticket : null;
  } catch {
    return null;
  }
}
function Dt(e) {
  const t = window.location.protocol === "https:" ? "wss:" : "ws:", r = window.location.hostname, o = window.location.port ? `:${window.location.port}` : "", i = new URLSearchParams({ ticket: e });
  return `${t}//${r}${o}/api/web_browser/ws?${i.toString()}`;
}
function Xt() {
  const { theme: e, language: t } = Me(), r = e === "dark", [o, i] = L(null), [s, n] = L("http://192.168.1.1"), [l, h] = L(null), [b, x] = L("idle"), [N, S] = L(""), [v, R] = L(null), [w, p] = L(!1), [m, k] = L(null), z = te(null), T = te(null), G = te(null), U = te({ width: 1280, height: 720 }), K = te({ x: 0, y: 0, left: 0, top: 0 }), C = {
    en: {
      title: "Web Browser",
      desc: "Headless Chromium runs on this VPS and can reach LAN services (router, internal apps) that your PC cannot. Superadmin only. One shared session.",
      installPlaywright: "Install the Web Browser module from App Store (includes Playwright).",
      installChromium: "Install Chromium",
      installing: "Installing Chromium…",
      start: "Start",
      stop: "Stop",
      connect: "Connect stream",
      disconnect: "Disconnect",
      go: "Go",
      back: "Back",
      forward: "Forward",
      reload: "Reload",
      notReady: "Chromium not ready — install browser binary first.",
      wsOpen: "Stream connected",
      wsClosed: "Stream disconnected",
      superadminOnly: "Superadmin only.",
      focusHint: "Click the viewport, then type. Use toolbar for navigation."
    },
    vi: {
      title: "Trình duyệt Web",
      desc: "Chromium headless chạy trên VPS, truy cập dịch vụ LAN (router, webapp nội bộ) mà máy bạn không vào được. Chỉ superadmin. Một phiên dùng chung.",
      installPlaywright: "Cài module Web Browser từ App Store (có Playwright).",
      installChromium: "Cài Chromium",
      installing: "Đang cài Chromium…",
      start: "Bật",
      stop: "Tắt",
      connect: "Kết nối stream",
      disconnect: "Ngắt",
      go: "Đi",
      back: "Lùi",
      forward: "Tiến",
      reload: "Tải lại",
      notReady: "Chưa có Chromium — cài binary trước.",
      wsOpen: "Đã kết nối stream",
      wsClosed: "Đã ngắt stream",
      superadminOnly: "Chỉ superadmin.",
      focusHint: "Click vùng xem, gõ phím. Dùng thanh công cụ để điều hướng."
    }
  }[t === "vi" ? "vi" : "en"], I = de(async () => {
    try {
      const a = await Y("/api/web_browser/status");
      i(a), a.current_url && n(a.current_url);
    } catch (a) {
      S(a?.message || "Failed to load status"), i(null);
    }
  }, []);
  ie(() => {
    I();
  }, [I]);
  const B = de(async (a) => {
    const f = await Y(
      `/api/web_browser/install?job_id=${encodeURIComponent(a)}`
    );
    return f.job && R(f.job), f.chromium_installed ? (await I(), !0) : f.job?.status === "success" || f.job?.status === "failed";
  }, [I]);
  ie(() => {
    if (!v || ["success", "failed", "cancelled"].includes(v.status)) return;
    const a = setInterval(async () => {
      try {
        await B(v.id) && clearInterval(a);
      } catch {
        clearInterval(a);
      }
    }, 2e3);
    return () => clearInterval(a);
  }, [v, B]);
  const Z = async () => {
    p(!0);
    try {
      const a = await Y("/api/web_browser/install", { method: "POST" });
      await B(a.job_id);
    } catch (a) {
      S(a?.message || "Install failed");
    } finally {
      p(!1);
    }
  }, g = async () => {
    p(!0);
    try {
      const a = await Y("/api/web_browser/start", {
        method: "POST",
        body: { width: 1280, height: 720, url: s }
      });
      a.current_url && n(a.current_url), await I();
    } catch (a) {
      S(a?.message || "Start failed");
    } finally {
      p(!1);
    }
  }, se = async () => {
    Q(), p(!0);
    try {
      await Y("/api/web_browser/stop", { method: "POST" }), h(null), await I();
    } catch (a) {
      S(a?.message || "Stop failed");
    } finally {
      p(!1);
    }
  }, M = (a) => {
    z.current?.readyState === WebSocket.OPEN && z.current.send(JSON.stringify(a));
  }, V = de(() => {
    const a = T.current;
    if (!a) return;
    const f = Math.max(320, Math.min(Math.round(a.clientWidth), 1920)), A = Math.max(240, Math.min(Math.round(a.clientHeight), 1080));
    U.current = { width: f, height: A }, M({ type: "resize", width: f, height: A });
  }, []), H = async () => {
    z.current && (z.current.close(), z.current = null), x("connecting");
    const a = await Ft();
    if (!a) {
      x("error");
      return;
    }
    const f = new WebSocket(Dt(a));
    z.current = f, f.onopen = () => {
      x("open"), V();
    }, f.onclose = () => x("closed"), f.onerror = () => x("error"), f.onmessage = (A) => {
      try {
        const d = JSON.parse(A.data);
        if (d.type === "frame" && d.data)
          h(`data:image/jpeg;base64,${d.data}`);
        else if (d.type === "url" && d.url)
          n(d.url);
        else if (d.type === "select") {
          const D = K.current;
          k({
            x: d.x ?? D.x,
            y: d.y ?? D.y,
            left: D.left,
            top: D.top,
            selectedIndex: d.selectedIndex ?? -1,
            options: Array.isArray(d.options) ? d.options : []
          });
        } else d.type === "error" ? S(d.message || "Stream error") : d.type === "ready" && (d.url && n(d.url), d.viewport?.width && d.viewport?.height && (U.current = { width: d.viewport.width, height: d.viewport.height }), V());
      } catch {
      }
    };
  }, Q = () => {
    z.current?.close(), z.current = null, x("idle"), k(null);
  };
  ie(() => () => {
    z.current?.close();
  }, []), ie(() => {
    if (b !== "open") return;
    const a = new ResizeObserver(() => V());
    return T.current && a.observe(T.current), () => a.disconnect();
  }, [b, V]);
  const F = (a, f) => {
    const A = G.current;
    if (!A) return { x: 0, y: 0 };
    const d = A.getBoundingClientRect();
    if (d.width === 0 || d.height === 0) return { x: 0, y: 0 };
    const { width: D, height: ge } = U.current, je = (a - d.left) / d.width * D, Pe = (f - d.top) / d.height * ge;
    return {
      x: Math.max(0, Math.min(je, D - 1)),
      y: Math.max(0, Math.min(Pe, ge - 1))
    };
  }, $ = () => {
    b === "open" ? M({ type: "navigate", url: s }) : g();
  }, ee = !!(o && !o.playwright_installed), _ = !!(o && o.playwright_installed && !o.chromium_installed);
  return /* @__PURE__ */ u(Tt, { constrained: !0, children: /* @__PURE__ */ j("div", { className: `flex flex-col h-full min-h-0 p-4 md:p-6 space-y-4 ${r ? "text-slate-100" : "text-slate-900"}`, children: [
    /* @__PURE__ */ j("div", { children: [
      /* @__PURE__ */ j("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ u(ae.Globe, { className: "w-7 h-7 text-blue-500" }),
        C.title
      ] }),
      /* @__PURE__ */ u("p", { className: `mt-1 text-sm ${r ? "text-slate-400" : "text-slate-600"}`, children: C.desc }),
      /* @__PURE__ */ u("p", { className: `text-xs mt-1 ${r ? "text-amber-400/90" : "text-amber-700"}`, children: C.superadminOnly })
    ] }),
    N && /* @__PURE__ */ u("div", { className: `text-sm px-3 py-2 rounded-lg ${r ? "bg-red-950/50 text-red-300" : "bg-red-50 text-red-700"}`, children: N }),
    ee && /* @__PURE__ */ u("div", { className: `rounded-xl border p-4 ${r ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`, children: /* @__PURE__ */ u("p", { children: C.installPlaywright }) }),
    _ && /* @__PURE__ */ j("div", { className: `rounded-xl border p-4 space-y-3 ${r ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`, children: [
      /* @__PURE__ */ u("p", { children: C.notReady }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          disabled: w,
          onClick: Z,
          className: "px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50",
          children: w ? C.installing : C.installChromium
        }
      ),
      v && /* @__PURE__ */ j("div", { className: "text-xs space-y-1", children: [
        /* @__PURE__ */ j("div", { children: [
          v.status,
          " — ",
          v.progress,
          "%",
          v.message ? `: ${v.message}` : ""
        ] }),
        v.error && /* @__PURE__ */ u("div", { className: "text-red-400", children: v.error })
      ] })
    ] }),
    o && !ee && /* @__PURE__ */ j("div", { className: "flex flex-col flex-1 min-h-0 gap-4", children: [
      /* @__PURE__ */ j("div", { className: `flex flex-wrap gap-2 items-center rounded-xl border p-3 ${r ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`, children: [
        /* @__PURE__ */ u("button", { type: "button", onClick: () => M({ type: "back" }), className: "p-2 rounded-lg hover:bg-slate-800/50", title: C.back, children: /* @__PURE__ */ u(ae.ArrowLeft, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ u("button", { type: "button", onClick: () => M({ type: "forward" }), className: "p-2 rounded-lg hover:bg-slate-800/50", title: C.forward, children: /* @__PURE__ */ u(ae.ArrowRight, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ u("button", { type: "button", onClick: () => M({ type: "reload" }), className: "p-2 rounded-lg hover:bg-slate-800/50", title: C.reload, children: /* @__PURE__ */ u(ae.RotateCw, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ u(
          "input",
          {
            className: `flex-1 min-w-[12rem] px-3 py-2 rounded-lg text-sm border ${r ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-300"}`,
            value: s,
            onChange: (a) => n(a.target.value),
            onKeyDown: (a) => a.key === "Enter" && $()
          }
        ),
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            onClick: $,
            disabled: w || _,
            className: "px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50",
            children: C.go
          }
        ),
        o.running ? /* @__PURE__ */ u("button", { type: "button", onClick: se, disabled: w, className: "px-3 py-2 rounded-lg border text-sm", children: C.stop }) : /* @__PURE__ */ u("button", { type: "button", onClick: g, disabled: w || _, className: "px-3 py-2 rounded-lg border text-sm", children: C.start }),
        b === "open" ? /* @__PURE__ */ u("button", { type: "button", onClick: Q, className: "px-3 py-2 rounded-lg border text-sm", children: C.disconnect }) : /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            onClick: H,
            disabled: !o.running || _,
            className: "px-3 py-2 rounded-lg border text-sm",
            children: C.connect
          }
        ),
        /* @__PURE__ */ u("span", { className: `text-xs ${b === "open" ? "text-green-500" : "text-slate-500"}`, children: b === "open" ? C.wsOpen : C.wsClosed })
      ] }),
      /* @__PURE__ */ u("p", { className: "text-xs text-slate-500", children: C.focusHint }),
      /* @__PURE__ */ j(
        "div",
        {
          ref: T,
          tabIndex: 0,
          className: `relative w-full flex-1 min-h-[320px] rounded-xl border overflow-hidden flex items-center justify-center ${r ? "border-slate-700 bg-black" : "border-slate-300 bg-slate-100"}`,
          onMouseDown: (a) => {
            if (b !== "open") return;
            T.current?.focus(), m && k(null);
            const { x: f, y: A } = F(a.clientX, a.clientY), d = T.current?.getBoundingClientRect();
            K.current = {
              x: f,
              y: A,
              left: d ? a.clientX - d.left : 0,
              top: d ? a.clientY - d.top : 0
            }, M({ type: "click", x: f, y: A, button: a.button === 2 ? "right" : "left" });
          },
          onContextMenu: (a) => a.preventDefault(),
          onMouseMove: (a) => {
            if (b !== "open" || a.buttons === 0) return;
            const { x: f, y: A } = F(a.clientX, a.clientY);
            M({ type: "mousemove", x: f, y: A });
          },
          onWheel: (a) => {
            if (b !== "open") return;
            a.preventDefault();
            const { x: f, y: A } = F(a.clientX, a.clientY);
            M({ type: "wheel", x: f, y: A, deltaY: a.deltaY });
          },
          onKeyDown: (a) => {
            if (b === "open") {
              if (m) {
                a.preventDefault(), a.key === "Escape" && k(null);
                return;
              }
              a.preventDefault(), a.key.length === 1 && !a.ctrlKey && !a.metaKey && !a.altKey ? M({ type: "type", text: a.key }) : M({ type: "key", key: a.key });
            }
          },
          children: [
            l ? /* @__PURE__ */ u("img", { ref: G, src: l, alt: "Remote browser", className: "max-w-full max-h-full object-contain select-none", draggable: !1 }) : /* @__PURE__ */ u("div", { className: "text-sm text-slate-500", children: o.running ? "Connect stream to view" : "Start browser first" }),
            m && /* @__PURE__ */ u(
              "div",
              {
                className: `absolute z-20 max-h-64 overflow-auto rounded-md border shadow-xl text-sm ${r ? "bg-slate-900 border-slate-600" : "bg-white border-slate-300"}`,
                style: { left: m.left, top: m.top, minWidth: 160 },
                onMouseDown: (a) => a.stopPropagation(),
                children: m.options.map((a, f) => /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: a.disabled,
                    onClick: () => {
                      M({ type: "select_option", x: m.x, y: m.y, index: f }), k(null);
                    },
                    className: `block w-full text-left px-3 py-1.5 whitespace-nowrap disabled:opacity-40 ${f === m.selectedIndex ? "bg-blue-600 text-white" : r ? "hover:bg-slate-700 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`,
                    children: a.text || " "
                  },
                  f
                ))
              }
            )
          ]
        }
      )
    ] })
  ] }) });
}
export {
  Xt as default
};
