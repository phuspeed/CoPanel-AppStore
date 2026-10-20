var Qe = Object.defineProperty;
var Ve = (e, t, r) => t in e ? Qe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var R = (e, t, r) => Ve(e, typeof t != "symbol" ? t + "" : t, r);
import { jsx as o, jsxs as u, Fragment as Ue } from "react/jsx-runtime";
import { createContext as ze, useContext as Te, useState as _, useCallback as pe, useEffect as ie, useMemo as We } from "react";
import { useOutletContext as Be } from "react-router-dom";
import * as re from "lucide-react";
const Je = ze(null);
function He() {
  return Te(Je);
}
const Xe = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function $e() {
  const e = He(), t = Be();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : Xe);
}
function Ee(e) {
  var t, r, s = "";
  if (typeof e == "string" || typeof e == "number") s += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var c = e.length;
    for (t = 0; t < c; t++) e[t] && (r = Ee(e[t])) && (s && (s += " "), s += r);
  } else for (r in e) e[r] && (s && (s += " "), s += r);
  return s;
}
function Ye() {
  for (var e, t, r = 0, s = "", c = arguments.length; r < c; r++) (e = arguments[r]) && (t = Ee(e)) && (s && (s += " "), s += t);
  return s;
}
const xe = "-", Ze = (e) => {
  const t = et(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: s
  } = e;
  return {
    getClassGroupId: (i) => {
      const l = i.split(xe);
      return l[0] === "" && l.length !== 1 && l.shift(), qe(l, t) || Ke(i);
    },
    getConflictingClassGroupIds: (i, l) => {
      const h = r[i] || [];
      return l && s[i] ? [...h, ...s[i]] : h;
    }
  };
}, qe = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], s = t.nextPart.get(r), c = s ? qe(e.slice(1), s) : void 0;
  if (c)
    return c;
  if (t.validators.length === 0)
    return;
  const a = e.join(xe);
  return t.validators.find(({
    validator: i
  }) => i(a))?.classGroupId;
}, ke = /^\[(.+)\]$/, Ke = (e) => {
  if (ke.test(e)) {
    const t = ke.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, et = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, s = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return rt(Object.entries(e.classGroups), r).forEach(([a, i]) => {
    he(i, s, a, t);
  }), s;
}, he = (e, t, r, s) => {
  e.forEach((c) => {
    if (typeof c == "string") {
      const a = c === "" ? t : Ce(t, c);
      a.classGroupId = r;
      return;
    }
    if (typeof c == "function") {
      if (tt(c)) {
        he(c(s), t, r, s);
        return;
      }
      t.validators.push({
        validator: c,
        classGroupId: r
      });
      return;
    }
    Object.entries(c).forEach(([a, i]) => {
      he(i, Ce(t, a), r, s);
    });
  });
}, Ce = (e, t) => {
  let r = e;
  return t.split(xe).forEach((s) => {
    r.nextPart.has(s) || r.nextPart.set(s, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(s);
  }), r;
}, tt = (e) => e.isThemeGetter, rt = (e, t) => t ? e.map(([r, s]) => {
  const c = s.map((a) => typeof a == "string" ? t + a : typeof a == "object" ? Object.fromEntries(Object.entries(a).map(([i, l]) => [t + i, l])) : a);
  return [r, c];
}) : e, nt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  const c = (a, i) => {
    r.set(a, i), t++, t > e && (t = 0, s = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(a) {
      let i = r.get(a);
      if (i !== void 0)
        return i;
      if ((i = s.get(a)) !== void 0)
        return c(a, i), i;
    },
    set(a, i) {
      r.has(a) ? r.set(a, i) : c(a, i);
    }
  };
}, Me = "!", st = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, s = t.length === 1, c = t[0], a = t.length, i = (l) => {
    const h = [];
    let v = 0, S = 0, j;
    for (let f = 0; f < l.length; f++) {
      let w = l[f];
      if (v === 0) {
        if (w === c && (s || l.slice(f, f + a) === t)) {
          h.push(l.slice(S, f)), S = f + a;
          continue;
        }
        if (w === "/") {
          j = f;
          continue;
        }
      }
      w === "[" ? v++ : w === "]" && v--;
    }
    const q = h.length === 0 ? l : l.substring(S), g = q.startsWith(Me), A = g ? q.substring(1) : q, b = j && j > S ? j - S : void 0;
    return {
      modifiers: h,
      hasImportantModifier: g,
      baseClassName: A,
      maybePostfixModifierPosition: b
    };
  };
  return r ? (l) => r({
    className: l,
    parseClassName: i
  }) : i;
}, at = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((s) => {
    s[0] === "[" ? (t.push(...r.sort(), s), r = []) : r.push(s);
  }), t.push(...r.sort()), t;
}, ot = (e) => ({
  cache: nt(e.cacheSize),
  parseClassName: st(e),
  ...Ze(e)
}), it = /\s+/, lt = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: s,
    getConflictingClassGroupIds: c
  } = t, a = [], i = e.trim().split(it);
  let l = "";
  for (let h = i.length - 1; h >= 0; h -= 1) {
    const v = i[h], {
      modifiers: S,
      hasImportantModifier: j,
      baseClassName: q,
      maybePostfixModifierPosition: g
    } = r(v);
    let A = !!g, b = s(A ? q.substring(0, g) : q);
    if (!b) {
      if (!A) {
        l = v + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (b = s(q), !b) {
        l = v + (l.length > 0 ? " " + l : l);
        continue;
      }
      A = !1;
    }
    const f = at(S).join(":"), w = j ? f + Me : f, z = w + b;
    if (a.includes(z))
      continue;
    a.push(z);
    const O = c(b, A);
    for (let I = 0; I < O.length; ++I) {
      const Q = O[I];
      a.push(w + Q);
    }
    l = v + (l.length > 0 ? " " + l : l);
  }
  return l;
};
function ct() {
  let e = 0, t, r, s = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = Le(t)) && (s && (s += " "), s += r);
  return s;
}
const Le = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let s = 0; s < e.length; s++)
    e[s] && (t = Le(e[s])) && (r && (r += " "), r += t);
  return r;
};
function dt(e, ...t) {
  let r, s, c, a = i;
  function i(h) {
    const v = t.reduce((S, j) => j(S), e());
    return r = ot(v), s = r.cache.get, c = r.cache.set, a = l, l(h);
  }
  function l(h) {
    const v = s(h);
    if (v)
      return v;
    const S = lt(h, r);
    return c(h, S), S;
  }
  return function() {
    return a(ct.apply(null, arguments));
  };
}
const x = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, Ie = /^\[(?:([a-z-]+):)?(.+)\]$/i, ut = /^\d+\/\d+$/, pt = /* @__PURE__ */ new Set(["px", "full", "screen"]), mt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, ht = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, gt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, bt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ft = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, D = (e) => H(e) || pt.has(e) || ut.test(e), G = (e) => X(e, "length", Ct), H = (e) => !!e && !Number.isNaN(Number(e)), me = (e) => X(e, "number", H), ne = (e) => !!e && Number.isInteger(Number(e)), xt = (e) => e.endsWith("%") && H(e.slice(0, -1)), p = (e) => Ie.test(e), F = (e) => mt.test(e), yt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), vt = (e) => X(e, yt, Pe), wt = (e) => X(e, "position", Pe), St = /* @__PURE__ */ new Set(["image", "url"]), Nt = (e) => X(e, St, jt), kt = (e) => X(e, "", _t), se = () => !0, X = (e, t, r) => {
  const s = Ie.exec(e);
  return s ? s[1] ? typeof t == "string" ? s[1] === t : t.has(s[1]) : r(s[2]) : !1;
}, Ct = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  ht.test(e) && !gt.test(e)
), Pe = () => !1, _t = (e) => bt.test(e), jt = (e) => ft.test(e), At = () => {
  const e = x("colors"), t = x("spacing"), r = x("blur"), s = x("brightness"), c = x("borderColor"), a = x("borderRadius"), i = x("borderSpacing"), l = x("borderWidth"), h = x("contrast"), v = x("grayscale"), S = x("hueRotate"), j = x("invert"), q = x("gap"), g = x("gradientColorStops"), A = x("gradientColorStopPositions"), b = x("inset"), f = x("margin"), w = x("opacity"), z = x("padding"), O = x("saturate"), I = x("scale"), Q = x("sepia"), Y = x("skew"), Z = x("space"), oe = x("translate"), N = () => ["auto", "contain", "none"], W = () => ["auto", "hidden", "clip", "visible", "scroll"], B = () => ["auto", p, t], m = () => [p, t], K = () => ["", D, G], P = () => ["auto", H, p], M = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], C = () => ["solid", "dashed", "dotted", "double", "none"], d = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], L = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], T = () => ["", "0", p], $ = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], k = () => [H, p];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [se],
      spacing: [D, G],
      blur: ["none", "", F, p],
      brightness: k(),
      borderColor: [e],
      borderRadius: ["none", "", "full", F, p],
      borderSpacing: m(),
      borderWidth: K(),
      contrast: k(),
      grayscale: T(),
      hueRotate: k(),
      invert: T(),
      gap: m(),
      gradientColorStops: [e],
      gradientColorStopPositions: [xt, G],
      inset: B(),
      margin: B(),
      opacity: k(),
      padding: m(),
      saturate: k(),
      scale: k(),
      sepia: T(),
      skew: k(),
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
        columns: [F]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": $()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": $()
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
        object: [...M(), p]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: W()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": W()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": W()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: N()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": N()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": N()
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
        inset: [b]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [b]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [b]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [b]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [b]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [b]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [b]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [b]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [b]
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
        basis: B()
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
        grow: T()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: T()
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
        "grid-cols": [se]
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
        "col-start": P()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": P()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [se]
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
        "row-start": P()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": P()
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
        gap: [q]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [q]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [q]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...L()]
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
        content: ["normal", ...L(), "baseline"]
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
        "place-content": [...L(), "baseline"]
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
        p: [z]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [z]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [z]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [z]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [z]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [z]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [z]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [z]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [z]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [f]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [f]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [f]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [f]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [f]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [f]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [f]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [f]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [f]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [Z]
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
        "space-y": [Z]
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
          screen: [F]
        }, F]
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
        text: ["base", F, G]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", me]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [se]
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
        "line-clamp": ["none", H, me]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", D, p]
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
        "placeholder-opacity": [w]
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
        "text-opacity": [w]
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
        decoration: [...C(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", D, G]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", D, p]
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
        "bg-opacity": [w]
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
        bg: [...M(), wt]
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
        }, Nt]
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
        from: [A]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [A]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [A]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [g]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [g]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [g]
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
        "border-opacity": [w]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...C(), "hidden"]
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
        "divide-opacity": [w]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: C()
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
        outline: ["", ...C()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [D, p]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [D, G]
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
        ring: K()
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
        "ring-opacity": [w]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [D, G]
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
        shadow: ["", "inner", "none", F, kt]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [se]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [w]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...d(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": d()
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
        contrast: [h]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", F, p]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [v]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [S]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [j]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [O]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [Q]
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
        "backdrop-contrast": [h]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [v]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [S]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [j]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [w]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [O]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [Q]
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
        duration: k()
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
        delay: k()
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
        scale: [I]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [I]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [I]
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
        "translate-x": [oe]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [oe]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [Y]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [Y]
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
        stroke: [D, G, me]
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
}, zt = /* @__PURE__ */ dt(At);
function Tt(...e) {
  return zt(Ye(e));
}
const $t = "copanel_mobile_desktop_site";
function Et() {
  try {
    return localStorage.getItem($t) === "1";
  } catch {
    return !1;
  }
}
function qt(e = window.innerWidth) {
  return Et() || e >= 1024;
}
const Mt = ze(null);
function Lt() {
  return Te(Mt);
}
function It() {
  return Lt()?.isWindowed === !0;
}
function Pt({ children: e, className: t, constrained: r = !1 }) {
  const { theme: s } = $e(), c = It(), a = s === "dark", i = !c && !qt();
  return /* @__PURE__ */ o(
    "div",
    {
      className: Tt(
        "flex flex-col transition-colors duration-200",
        c ? "h-full min-h-0" : i ? "min-h-0" : "min-h-screen",
        a ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !c && r && "mx-auto max-w-7xl",
        t
      ),
      children: e
    }
  );
}
class _e extends Error {
  constructor(r, s, c, a) {
    super(s);
    R(this, "code");
    R(this, "status");
    R(this, "details");
    this.code = r, this.status = c, this.details = a;
  }
}
async function E(e, t = {}) {
  const r = typeof window < "u" ? localStorage.getItem("copanel_token") : null, s = {
    "Content-Type": "application/json",
    ...t.headers || {}
  };
  r && (s.Authorization = `Bearer ${r}`);
  const c = {
    method: t.method || "GET",
    headers: s,
    signal: t.signal
  };
  t.body !== void 0 && (c.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body));
  const a = await fetch(e, c);
  let i = null;
  const l = await a.text();
  if (l)
    try {
      i = JSON.parse(l);
    } catch {
      i = l;
    }
  if (t.raw)
    return i;
  if (!a.ok) {
    const h = i && typeof i == "object" && i.error ? i.error : { code: `HTTP_${a.status}`, message: typeof i == "string" ? i : i?.detail || a.statusText };
    throw new _e(h.code || `HTTP_${a.status}`, h.message || "Request failed", a.status, h.details);
  }
  if (i && typeof i == "object" && "status" in i) {
    if (i.status === "success")
      return i.data !== void 0 ? i.data : i;
    if (i.status === "error" && i.error)
      throw new _e(i.error.code, i.error.message, a.status, i.error.details);
  }
  return i;
}
const Rt = "copanel-platform-sse-degraded", ae = 2e3, Dt = 6e4, Ot = 3;
class Gt {
  constructor() {
    R(this, "source", null);
    R(this, "handlers", /* @__PURE__ */ new Map());
    R(this, "retryDelay", ae);
    R(this, "retryTimer", null);
    R(this, "failureCount", 0);
  }
  on(t, r) {
    let s = this.handlers.get(t);
    return s || (s = /* @__PURE__ */ new Set(), this.handlers.set(t, s)), s.add(r), this.ensureConnected(), () => {
      s.delete(r), s.size === 0 && this.handlers.delete(t), this.teardownIfIdle();
    };
  }
  emit(t, r) {
    const s = this.handlers.get(t);
    s && s.forEach((c) => {
      try {
        c(r);
      } catch (a) {
        console.error("event handler failed", t, a);
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
        this.failureCount = 0, this.retryDelay = ae;
      }), this.source.addEventListener("jobs", (r) => {
        this.onStreamMessage(), this.parseAndEmit("jobs", r.data);
      }), this.source.addEventListener("notifications", (r) => {
        this.onStreamMessage(), this.parseAndEmit("notifications", r.data);
      }), this.source.addEventListener("message", () => {
        this.onStreamMessage();
      }), this.source.onerror = () => {
        this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Ot && window.dispatchEvent(new CustomEvent(Rt)), this.scheduleRetry();
      };
    }
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = ae;
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
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), Dt), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = ae);
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = ae, this.handlers.size > 0 && this.ensureConnected();
  }
}
const ye = new Gt();
function Ft() {
  ye.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || Ft();
});
function Re(e) {
  let t = e;
  const r = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (s) => {
      const c = typeof s == "function" ? s(t) : s;
      if (!c || Object.keys(c).length === 0) return;
      let a = !1;
      for (const i of Object.keys(c))
        if (t[i] !== c[i]) {
          a = !0;
          break;
        }
      a && (t = { ...t, ...c }, r.forEach((i) => i()));
    },
    subscribe: (s) => (r.add(s), () => r.delete(s))
  };
}
const ve = Re({ jobs: {}, order: [], lastFetch: 0 });
function Qt() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function je(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function J(e, t, r) {
  if (!e || typeof e != "object") return;
  const s = je(e[t], r);
  if (s) return s;
  const c = je(e[`${t}_i18n`], r);
  if (c) return c;
  const a = e[`${t}_${r}`];
  if (typeof a == "string" && a) return a;
  const i = e[`${t}_en`];
  if (typeof i == "string" && i) return i;
  const l = e[`${t}_vi`];
  if (typeof l == "string" && l) return l;
}
function ge(e) {
  const t = Qt(), r = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: J(e, "title", t) || J(r, "title", t) || e?.title || "",
    message: J(e, "message", t) || J(r, "message", t) || e?.message,
    error: J(e, "error", t) || J(r, "error", t) || e?.error || null
  };
}
function be(e) {
  const t = ge(e);
  ve.setState((r) => {
    const s = { ...r.jobs, [t.id]: { ...r.jobs[t.id], ...t } };
    let c = r.order;
    return c.includes(t.id) || (c = [t.id, ...c].slice(0, 200)), { jobs: s, order: c };
  });
}
ye.on("jobs", (e) => {
  if (e?.job) {
    be(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = ve.getState().jobs[e.job_id];
    t && be({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const Vt = {
  async refresh(e = 50) {
    const t = await E(`/api/platform/jobs?limit=${e}`), r = Array.isArray(t) ? t : [];
    ve.setState(() => {
      const s = {}, c = [];
      for (const a of r) {
        if (!a || typeof a != "object" || !a.id) continue;
        const i = ge(a);
        s[i.id] = i, c.push(i.id);
      }
      return { jobs: s, order: c, lastFetch: Date.now() };
    });
  },
  async get(e) {
    const t = await E(`/api/platform/jobs/${e}`), r = ge(t);
    return be(r), r;
  },
  async cancel(e) {
    return E(`/api/platform/jobs/${e}/cancel`, { method: "POST" });
  }
}, fe = Re({ inbox: [], unread: 0, toasts: [] }), Ut = 6e3;
function Wt() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Ae(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function le(e, t, r) {
  if (!e || typeof e != "object") return;
  const s = Ae(e[t], r);
  if (s) return s;
  const c = Ae(e[`${t}_i18n`], r);
  if (c) return c;
  const a = e[`${t}_${r}`];
  if (typeof a == "string" && a) return a;
  const i = e[`${t}_en`];
  if (typeof i == "string" && i) return i;
  const l = e[`${t}_vi`];
  if (typeof l == "string" && l) return l;
}
function Bt(e) {
  const t = Wt(), r = e?.payload && typeof e.payload == "object" ? e.payload : {}, s = le(e, "title", t) || le(r, "title", t) || e?.title || "", c = le(e, "body", t) || le(r, "body", t) || e?.body || null;
  return {
    ...e,
    title: s,
    body: c
  };
}
function Jt(e) {
  fe.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    fe.setState((t) => ({ toasts: t.toasts.filter((r) => r.id !== e.id) }));
  }, Ut);
}
ye.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = Bt(e.notification);
    Jt({ ...t, ephemeral: !0 }), fe.setState((r) => ({
      inbox: [t, ...r.inbox].slice(0, 200),
      unread: r.unread + 1
    }));
  }
});
function Kt() {
  const { theme: e, language: t } = $e(), r = e === "dark", [s, c] = _("overview"), [a, i] = _(null), [l, h] = _(null), [v, S] = _([]), [j, q] = _([]), [g, A] = _(null), [b, f] = _("/home"), [w, z] = _(!0), [O, I] = _(!0), [Q, Y] = _(100), [Z, oe] = _(!1), [N, W] = _(null), [B, m] = _(null), [K, P] = _(null), [M, C] = _(!1), d = {
    en: {
      title: "ClamAV",
      desc: "Antivirus signatures, malware scans, detections, and quarantine control.",
      overview: "Overview",
      scan: "Scan",
      detections: "Detections",
      quarantine: "Quarantine",
      settings: "Settings",
      notInstalled: "ClamAV binaries not detected yet. Install the AppStore package dependencies first.",
      installed: "Installed",
      selectedEngine: "Selected engine",
      signatures: "Signatures",
      services: "Services",
      quickScanHome: "Quick scan /home",
      quickScanWeb: "Quick scan /var/www",
      updateDb: "Update signatures",
      scanPath: "Scan path",
      recursive: "Recursive",
      includeArchives: "Include archives",
      maxFileSize: "Max file size (MB)",
      autoQuarantine: "Auto quarantine infected files",
      startScan: "Start scan",
      stopScan: "Stop scan",
      stopUpdate: "Stop update",
      currentScan: "Current scan",
      recentScans: "Recent scans",
      infected: "Infected",
      scanned: "Scanned",
      errors: "Errors",
      scanLogs: "Scan logs",
      path: "Path",
      signature: "Signature",
      status: "Status",
      actions: "Actions",
      quarantineNow: "Quarantine",
      restore: "Restore",
      deleteForever: "Delete forever",
      emptyDetections: "No detections yet.",
      emptyQuarantine: "Quarantine is empty.",
      quarantineDir: "Quarantine directory",
      defaultTargets: "Default scan targets (one per line)",
      excludePaths: "Exclude paths (one per line)",
      retentionDays: "Retention days",
      preferredEngine: "Preferred engine",
      auto: "Auto",
      saveSettings: "Save settings",
      refresh: "Refresh",
      lastUpdateJob: "Signature update job",
      ready: "Ready",
      active: "Active",
      inactive: "Inactive",
      queued: "Queued",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
      quarantinedState: "Quarantined",
      restoredState: "Restored",
      deletedState: "Deleted",
      detectedState: "Detected",
      browserHint: "Use custom path for targeted scans (example: /home/site/public_html).",
      saveOk: "Saved.",
      started: "Started.",
      actionOk: "Action completed."
    },
    vi: {
      title: "ClamAV",
      desc: "Quản lý chữ ký antivirus, quét malware, danh sách phát hiện và khu cách ly.",
      overview: "Tổng quan",
      scan: "Quét",
      detections: "Phát hiện",
      quarantine: "Cách ly",
      settings: "Cài đặt",
      notInstalled: "Chưa thấy binary ClamAV. Hãy cài dependency của gói AppStore trước.",
      installed: "Đã cài",
      selectedEngine: "Engine đang dùng",
      signatures: "Chữ ký",
      services: "Dịch vụ",
      quickScanHome: "Quét nhanh /home",
      quickScanWeb: "Quét nhanh /var/www",
      updateDb: "Cập nhật chữ ký",
      scanPath: "Đường dẫn quét",
      recursive: "Đệ quy",
      includeArchives: "Quét file nén",
      maxFileSize: "Cỡ file tối đa (MB)",
      autoQuarantine: "Tự cách ly file nhiễm",
      startScan: "Bắt đầu quét",
      stopScan: "Dừng quét",
      stopUpdate: "Dừng cập nhật",
      currentScan: "Lần quét hiện tại",
      recentScans: "Lần quét gần đây",
      infected: "Nhiễm",
      scanned: "Đã quét",
      errors: "Lỗi",
      scanLogs: "Log quét",
      path: "Đường dẫn",
      signature: "Chữ ký",
      status: "Trạng thái",
      actions: "Thao tác",
      quarantineNow: "Cách ly",
      restore: "Khôi phục",
      deleteForever: "Xóa vĩnh viễn",
      emptyDetections: "Chưa có phát hiện nào.",
      emptyQuarantine: "Khu cách ly đang trống.",
      quarantineDir: "Thư mục cách ly",
      defaultTargets: "Mục tiêu quét mặc định (mỗi dòng một path)",
      excludePaths: "Đường dẫn loại trừ (mỗi dòng một path)",
      retentionDays: "Số ngày giữ",
      preferredEngine: "Engine ưu tiên",
      auto: "Tự động",
      saveSettings: "Lưu cài đặt",
      refresh: "Làm mới",
      lastUpdateJob: "Job cập nhật chữ ký",
      ready: "Sẵn sàng",
      active: "Đang chạy",
      inactive: "Không chạy",
      queued: "Đang chờ",
      running: "Đang chạy",
      completed: "Hoàn tất",
      failed: "Thất bại",
      cancelled: "Đã hủy",
      quarantinedState: "Đã cách ly",
      restoredState: "Đã khôi phục",
      deletedState: "Đã xóa",
      detectedState: "Mới phát hiện",
      browserHint: "Có thể nhập path riêng để quét mục tiêu cụ thể (ví dụ: /home/site/public_html).",
      saveOk: "Đã lưu.",
      started: "Đã bắt đầu.",
      actionOk: "Đã thực hiện xong."
    }
  }[t], L = `${r ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} border rounded-xl p-5`, T = `w-full px-3 py-2 rounded-lg border text-sm ${r ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-slate-50 border-slate-300"}`, $ = `block text-xs font-medium mb-1 ${r ? "text-slate-400" : "text-slate-500"}`, k = pe(async () => {
    const n = await E("/api/clamav/overview");
    i(n), h(n.settings), !b && n.settings.default_scan_targets[0] && f(n.settings.default_scan_targets[0]);
  }, [b]), ce = pe(async () => {
    const n = await E("/api/clamav/detections");
    S(n.items || []), q(n.quarantine || []);
  }, []), ee = pe(async () => {
    await Promise.all([k(), ce()]);
  }, [ce, k]);
  ie(() => {
    ee().catch((n) => m(n.message));
  }, [ee]), ie(() => {
    l && (I(l.include_archives), Y(l.max_file_size_mb), !b.trim() && l.default_scan_targets[0] && f(l.default_scan_targets[0]));
  }, [l, b]), ie(() => {
    if (!g?.id || !g.job || !["queued", "running"].includes(g.job.status)) return;
    const n = window.setInterval(() => {
      E(`/api/clamav/scan/${g.id}`).then((y) => {
        A(y), (!y.job || !["queued", "running"].includes(y.job.status)) && ee().catch(() => {
        });
      }).catch(() => {
      });
    }, 2e3);
    return () => window.clearInterval(n);
  }, [g?.id, g?.job?.status, ee]), ie(() => {
    if (!N?.id || !["queued", "running"].includes(N.status)) return;
    const n = window.setInterval(() => {
      E(`/api/platform/jobs/${N.id}`).then((y) => {
        W(y), ["queued", "running"].includes(y.status) || k().catch(() => {
        });
      }).catch(() => {
      });
    }, 2e3);
    return () => window.clearInterval(n);
  }, [N?.id, N?.status, k]);
  const V = (n) => n === "active" || n === "success" || n === "completed" || n === "restored" ? "text-emerald-500" : n === "running" || n === "queued" || n === "quarantined" ? "text-blue-500" : n === "failed" || n === "deleted" || n === "quarantine_failed" || n === "restore_failed" ? "text-red-500" : n === "cancelled" ? "text-slate-500" : n === "detected" ? "text-amber-500" : r ? "text-slate-300" : "text-slate-600", U = (n) => {
    switch (n) {
      case "active":
        return d.active;
      case "inactive":
        return d.inactive;
      case "queued":
        return d.queued;
      case "running":
        return d.running;
      case "completed":
      case "success":
        return d.completed;
      case "failed":
        return d.failed;
      case "cancelled":
        return d.cancelled;
      case "quarantined":
        return d.quarantinedState;
      case "restored":
        return d.restoredState;
      case "deleted":
        return d.deletedState;
      case "detected":
        return d.detectedState;
      default:
        return n || "—";
    }
  }, De = async () => {
    if (l) {
      C(!0), m(null);
      try {
        const n = await E("/api/clamav/settings", {
          method: "PUT",
          body: l
        });
        h(n), P(d.saveOk), await k();
      } catch (n) {
        m(n.message);
      } finally {
        C(!1);
      }
    }
  }, de = async (n) => {
    C(!0), m(null);
    try {
      const y = await E("/api/clamav/scan", {
        method: "POST",
        body: {
          path: n || b,
          recursive: w,
          include_archives: O,
          max_file_size_mb: Q,
          auto_quarantine: Z
        }
      }), te = await E(`/api/clamav/scan/${y.scan_id}`);
      A(te), c("scan"), P(d.started);
    } catch (y) {
      m(y.message);
    } finally {
      C(!1);
    }
  }, Oe = async () => {
    C(!0), m(null);
    try {
      const n = await E("/api/clamav/update-signatures", {
        method: "POST",
        body: { force: !1 }
      }), y = await E(`/api/platform/jobs/${n.job_id}`);
      W(y), P(d.started);
    } catch (n) {
      m(n.message);
    } finally {
      C(!1);
    }
  }, we = async (n) => {
    if (n) {
      C(!0), m(null);
      try {
        await Vt.cancel(n), P(d.cancelled);
      } catch (y) {
        m(y.message);
      } finally {
        C(!1);
      }
    }
  }, ue = async (n, y) => {
    C(!0), m(null);
    try {
      if (await E(n, {
        method: "POST",
        body: { detection_id: y }
      }), P(d.actionOk), await ce(), await k(), g?.id) {
        const te = await E(`/api/clamav/scan/${g.id}`);
        A(te);
      }
    } catch (te) {
      m(te.message);
    } finally {
      C(!1);
    }
  }, Ge = ["overview", "scan", "detections", "quarantine", "settings"], Se = !!(g?.job && ["queued", "running"].includes(g.job.status)), Ne = !!(N && ["queued", "running"].includes(N.status)), Fe = We(() => g?.job?.logs || [], [g?.job?.logs]);
  return /* @__PURE__ */ o(Pt, { constrained: !0, children: /* @__PURE__ */ u("div", { className: `p-4 md:p-6 space-y-6 ${r ? "text-slate-100" : "text-slate-900"}`, children: [
    /* @__PURE__ */ u("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ u("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ o(re.ShieldAlert, { className: "w-7 h-7 text-emerald-500" }),
          d.title
        ] }),
        /* @__PURE__ */ o("p", { className: `mt-1 text-sm ${r ? "text-slate-400" : "text-slate-500"}`, children: d.desc })
      ] }),
      /* @__PURE__ */ u("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: `px-3 py-2 rounded-lg border text-sm ${r ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100"}`,
            onClick: () => ee().catch((n) => m(n.message)),
            children: d.refresh
          }
        ),
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: "px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50",
            onClick: Oe,
            disabled: M || Ne,
            children: d.updateDb
          }
        )
      ] })
    ] }),
    B && /* @__PURE__ */ o("div", { className: "rounded-lg border border-red-300 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300", children: B }),
    K && /* @__PURE__ */ o("div", { className: "rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300", children: K }),
    /* @__PURE__ */ o("div", { className: "flex flex-wrap gap-2", children: Ge.map((n) => /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        onClick: () => c(n),
        className: `px-3 py-2 rounded-lg text-sm font-medium ${s === n ? "bg-blue-600 text-white" : r ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`,
        children: d[n]
      },
      n
    )) }),
    s === "overview" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
      !a?.installed && /* @__PURE__ */ o("div", { className: "rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300", children: d.notInstalled }),
      /* @__PURE__ */ o("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4", children: [
        { label: d.installed, value: a?.installed ? d.ready : "No", icon: re.ShieldCheck },
        { label: d.selectedEngine, value: a?.engine?.selected || "—", icon: re.Cpu },
        { label: d.signatures, value: a?.signatures?.version || "—", icon: re.Database },
        { label: d.detections, value: String(a?.stats?.total_detections || 0), icon: re.Bug }
      ].map((n) => /* @__PURE__ */ u("div", { className: L, children: [
        /* @__PURE__ */ u("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ o(n.icon, { className: "w-4 h-4 text-blue-500" }),
          /* @__PURE__ */ o("span", { className: `text-xs font-medium uppercase ${r ? "text-slate-400" : "text-slate-500"}`, children: n.label })
        ] }),
        /* @__PURE__ */ o("p", { className: "text-lg font-semibold break-all", children: n.value })
      ] }, n.label)) }),
      /* @__PURE__ */ u("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ u("div", { className: L, children: [
          /* @__PURE__ */ o("h2", { className: "font-semibold mb-3", children: d.services }),
          /* @__PURE__ */ u("div", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ u("p", { children: [
              /* @__PURE__ */ o("span", { className: $, children: "clamd" }),
              /* @__PURE__ */ o("span", { className: V(a?.services?.clamd?.status), children: U(a?.services?.clamd?.status) })
            ] }),
            /* @__PURE__ */ u("p", { children: [
              /* @__PURE__ */ o("span", { className: $, children: "freshclam" }),
              /* @__PURE__ */ o("span", { className: V(a?.services?.freshclam?.status), children: U(a?.services?.freshclam?.status) })
            ] }),
            /* @__PURE__ */ u("p", { children: [
              /* @__PURE__ */ o("span", { className: $, children: d.signatures }),
              /* @__PURE__ */ o("span", { children: a?.signatures?.updated_at || "—" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ u("div", { className: L, children: [
          /* @__PURE__ */ o("h2", { className: "font-semibold mb-3", children: d.recentScans }),
          /* @__PURE__ */ u("div", { className: "space-y-3", children: [
            (a?.recent_scans || []).length === 0 && /* @__PURE__ */ o("p", { className: `text-sm ${r ? "text-slate-400" : "text-slate-500"}`, children: "—" }),
            (a?.recent_scans || []).map((n) => /* @__PURE__ */ u("div", { className: `rounded-lg border p-3 ${r ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50"}`, children: [
              /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ o("p", { className: "font-medium break-all", children: n.path }),
                  /* @__PURE__ */ o("p", { className: "text-xs text-slate-500", children: n.engine || "—" })
                ] }),
                /* @__PURE__ */ o("span", { className: `text-sm font-medium ${V(n.status)}`, children: U(n.status) })
              ] }),
              /* @__PURE__ */ u("p", { className: `mt-2 text-xs ${r ? "text-slate-400" : "text-slate-500"}`, children: [
                d.infected,
                ": ",
                n.infected_count
              ] })
            ] }, n.id))
          ] })
        ] })
      ] })
    ] }),
    s === "scan" && /* @__PURE__ */ u("div", { className: "space-y-4", children: [
      /* @__PURE__ */ u("div", { className: L, children: [
        /* @__PURE__ */ u("div", { className: "flex flex-wrap gap-2 mb-4", children: [
          /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-2 rounded-lg bg-slate-700 text-white text-sm", onClick: () => de("/home"), disabled: M, children: d.quickScanHome }),
          /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-2 rounded-lg bg-slate-700 text-white text-sm", onClick: () => de("/var/www"), disabled: M, children: d.quickScanWeb })
        ] }),
        /* @__PURE__ */ o("label", { className: $, children: d.scanPath }),
        /* @__PURE__ */ o("input", { className: T, value: b, onChange: (n) => f(n.target.value), placeholder: "/home/site/public_html" }),
        /* @__PURE__ */ o("p", { className: "mt-1 text-xs text-slate-500", children: d.browserHint }),
        /* @__PURE__ */ u("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4", children: [
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ o("input", { type: "checkbox", checked: w, onChange: (n) => z(n.target.checked) }),
            d.recursive
          ] }),
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ o("input", { type: "checkbox", checked: O, onChange: (n) => I(n.target.checked) }),
            d.includeArchives
          ] }),
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ o("input", { type: "checkbox", checked: Z, onChange: (n) => oe(n.target.checked) }),
            d.autoQuarantine
          ] }),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ o("label", { className: $, children: d.maxFileSize }),
            /* @__PURE__ */ o("input", { className: T, type: "number", min: 1, max: 2048, value: Q, onChange: (n) => Y(Number(n.target.value)) })
          ] })
        ] }),
        /* @__PURE__ */ o("button", { type: "button", className: "mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50", disabled: M || Se || !b.trim(), onClick: () => de(), children: d.startScan })
      ] }),
      g && /* @__PURE__ */ u("div", { className: L, children: [
        /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ o("h2", { className: "font-semibold", children: d.currentScan }),
          /* @__PURE__ */ u("div", { className: "flex items-center gap-2", children: [
            Se && /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50",
                disabled: M,
                onClick: () => we(g.job?.id),
                children: d.stopScan
              }
            ),
            /* @__PURE__ */ o("span", { className: `text-sm font-medium ${V(g.job?.status || g.status)}`, children: U(g.job?.status || g.status) })
          ] })
        ] }),
        /* @__PURE__ */ o("p", { className: "text-sm break-all", children: g.path }),
        /* @__PURE__ */ u("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm", children: [
          /* @__PURE__ */ u("div", { children: [
            d.infected,
            ": ",
            /* @__PURE__ */ o("strong", { children: g.summary?.infected_count || 0 })
          ] }),
          /* @__PURE__ */ u("div", { children: [
            d.scanned,
            ": ",
            /* @__PURE__ */ o("strong", { children: g.summary?.scanned_count || 0 })
          ] }),
          /* @__PURE__ */ u("div", { children: [
            d.errors,
            ": ",
            /* @__PURE__ */ o("strong", { children: g.summary?.error_count || 0 })
          ] })
        ] }),
        /* @__PURE__ */ o("div", { className: `mt-4 h-2 w-full overflow-hidden rounded-full ${r ? "bg-slate-800" : "bg-slate-200"}`, children: /* @__PURE__ */ o("div", { className: "h-full bg-blue-600 rounded-full transition-all", style: { width: `${g.job?.progress || 0}%` } }) }),
        /* @__PURE__ */ u("div", { className: "mt-4", children: [
          /* @__PURE__ */ o("div", { className: `mb-2 text-xs font-medium uppercase ${r ? "text-slate-400" : "text-slate-500"}`, children: d.scanLogs }),
          /* @__PURE__ */ o("pre", { className: `max-h-80 overflow-auto rounded-lg border p-3 text-[11px] whitespace-pre-wrap ${r ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`, children: Fe.map((n) => n.line).join(`
`) || "—" })
        ] })
      ] }),
      N && /* @__PURE__ */ u("div", { className: L, children: [
        /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ o("h2", { className: "font-semibold", children: d.lastUpdateJob }),
          Ne && /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50",
              disabled: M,
              onClick: () => we(N.id),
              children: d.stopUpdate
            }
          )
        ] }),
        /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ o("span", { children: U(N.status) }),
          /* @__PURE__ */ u("span", { children: [
            N.progress || 0,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ o("pre", { className: `mt-3 max-h-52 overflow-auto rounded-lg border p-3 text-[11px] whitespace-pre-wrap ${r ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`, children: (N.logs || []).map((n) => n.line).join(`
`) || N.message || "—" })
      ] })
    ] }),
    s === "detections" && /* @__PURE__ */ u("div", { className: L, children: [
      (v || []).length === 0 && /* @__PURE__ */ o("p", { className: `text-sm ${r ? "text-slate-400" : "text-slate-500"}`, children: d.emptyDetections }),
      /* @__PURE__ */ o("div", { className: "space-y-3", children: v.filter((n) => n.status !== "quarantined").map((n) => /* @__PURE__ */ u("div", { className: `rounded-lg border p-3 ${r ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50"}`, children: [
        /* @__PURE__ */ u("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ u("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ o("p", { className: "font-medium break-all", children: n.path }),
            /* @__PURE__ */ o("p", { className: `text-sm ${V(n.status)}`, children: n.signature }),
            n.action_error && /* @__PURE__ */ o("p", { className: "text-xs text-red-500 mt-1", children: n.action_error })
          ] }),
          /* @__PURE__ */ o("span", { className: `text-sm font-medium ${V(n.status)}`, children: U(n.status) })
        ] }),
        /* @__PURE__ */ o("div", { className: "mt-3 flex flex-wrap gap-2", children: n.status === "detected" && /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium disabled:opacity-50", disabled: M, onClick: () => ue("/api/clamav/detections/quarantine", n.id), children: d.quarantineNow }) })
      ] }, n.id)) })
    ] }),
    s === "quarantine" && /* @__PURE__ */ u("div", { className: L, children: [
      j.length === 0 && /* @__PURE__ */ o("p", { className: `text-sm ${r ? "text-slate-400" : "text-slate-500"}`, children: d.emptyQuarantine }),
      /* @__PURE__ */ o("div", { className: "space-y-3", children: j.map((n) => /* @__PURE__ */ u("div", { className: `rounded-lg border p-3 ${r ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50"}`, children: [
        /* @__PURE__ */ u("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ u("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ o("p", { className: "font-medium break-all", children: n.original_path || n.path }),
            /* @__PURE__ */ o("p", { className: "text-sm text-amber-500", children: n.signature }),
            /* @__PURE__ */ o("p", { className: "text-xs mt-1 text-slate-500", children: n.quarantine_path || "—" }),
            n.action_error && /* @__PURE__ */ o("p", { className: "text-xs text-red-500 mt-1", children: n.action_error })
          ] }),
          /* @__PURE__ */ o("span", { className: `text-sm font-medium ${V(n.status)}`, children: U(n.status) })
        ] }),
        /* @__PURE__ */ o("div", { className: "mt-3 flex flex-wrap gap-2", children: n.status === "quarantined" && /* @__PURE__ */ u(Ue, { children: [
          /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium disabled:opacity-50", disabled: M, onClick: () => ue("/api/clamav/quarantine/restore", n.id), children: d.restore }),
          /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50", disabled: M, onClick: () => ue("/api/clamav/quarantine/delete", n.id), children: d.deleteForever })
        ] }) })
      ] }, n.id)) })
    ] }),
    s === "settings" && l && /* @__PURE__ */ o("div", { className: L, children: /* @__PURE__ */ u("div", { className: "space-y-4", children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ o("label", { className: $, children: d.quarantineDir }),
        /* @__PURE__ */ o("input", { className: T, value: l.quarantine_dir, onChange: (n) => h({ ...l, quarantine_dir: n.target.value }) })
      ] }),
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ o("label", { className: $, children: d.defaultTargets }),
        /* @__PURE__ */ o("textarea", { className: `${T} min-h-28`, value: l.default_scan_targets.join(`
`), onChange: (n) => h({ ...l, default_scan_targets: n.target.value.split(`
`).map((y) => y.trim()).filter(Boolean) }) })
      ] }),
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ o("label", { className: $, children: d.excludePaths }),
        /* @__PURE__ */ o("textarea", { className: `${T} min-h-28`, value: l.exclude_paths.join(`
`), onChange: (n) => h({ ...l, exclude_paths: n.target.value.split(`
`).map((y) => y.trim()).filter(Boolean) }) })
      ] }),
      /* @__PURE__ */ u("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ o("label", { className: $, children: d.retentionDays }),
          /* @__PURE__ */ o("input", { className: T, type: "number", min: 1, max: 365, value: l.retention_days, onChange: (n) => h({ ...l, retention_days: Number(n.target.value) }) })
        ] }),
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ o("label", { className: $, children: d.maxFileSize }),
          /* @__PURE__ */ o("input", { className: T, type: "number", min: 1, max: 2048, value: l.max_file_size_mb, onChange: (n) => h({ ...l, max_file_size_mb: Number(n.target.value) }) })
        ] }),
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ o("label", { className: $, children: d.preferredEngine }),
          /* @__PURE__ */ u("select", { className: T, value: l.preferred_engine, onChange: (n) => h({ ...l, preferred_engine: n.target.value }), children: [
            /* @__PURE__ */ o("option", { value: "auto", children: d.auto }),
            /* @__PURE__ */ o("option", { value: "clamscan", children: "clamscan" }),
            /* @__PURE__ */ o("option", { value: "clamdscan", children: "clamdscan" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ o("input", { type: "checkbox", checked: l.include_archives, onChange: (n) => h({ ...l, include_archives: n.target.checked }) }),
        d.includeArchives
      ] }),
      /* @__PURE__ */ o("button", { type: "button", className: "px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50", disabled: M, onClick: De, children: d.saveSettings })
    ] }) })
  ] }) });
}
export {
  Kt as default
};
