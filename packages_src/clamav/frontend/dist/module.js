var We = Object.defineProperty;
var Qe = (e, t, r) => t in e ? We(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var P = (e, t, r) => Qe(e, typeof t != "symbol" ? t + "" : t, r);
import { jsx as o, jsxs as u, Fragment as Be } from "react/jsx-runtime";
import { createContext as Ee, useContext as ze, useState as _, useCallback as me, useEffect as le, useMemo as He } from "react";
import { useOutletContext as Je } from "react-router-dom";
import * as ne from "lucide-react";
const Xe = Ee(null);
function Ye() {
  return ze(Xe);
}
const Ze = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function $e() {
  const e = Ye(), t = Je();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : Ze);
}
function qe(e) {
  var t, r, s = "";
  if (typeof e == "string" || typeof e == "number") s += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var c = e.length;
    for (t = 0; t < c; t++) e[t] && (r = qe(e[t])) && (s && (s += " "), s += r);
  } else for (r in e) e[r] && (s && (s += " "), s += r);
  return s;
}
function Ke() {
  for (var e, t, r = 0, s = "", c = arguments.length; r < c; r++) (e = arguments[r]) && (t = qe(e)) && (s && (s += " "), s += t);
  return s;
}
const ve = "-", et = (e) => {
  const t = rt(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: s
  } = e;
  return {
    getClassGroupId: (i) => {
      const l = i.split(ve);
      return l[0] === "" && l.length !== 1 && l.shift(), Me(l, t) || tt(i);
    },
    getConflictingClassGroupIds: (i, l) => {
      const m = r[i] || [];
      return l && s[i] ? [...m, ...s[i]] : m;
    }
  };
}, Me = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], s = t.nextPart.get(r), c = s ? Me(e.slice(1), s) : void 0;
  if (c)
    return c;
  if (t.validators.length === 0)
    return;
  const a = e.join(ve);
  return t.validators.find(({
    validator: i
  }) => i(a))?.classGroupId;
}, Ce = /^\[(.+)\]$/, tt = (e) => {
  if (Ce.test(e)) {
    const t = Ce.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, rt = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, s = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return st(Object.entries(e.classGroups), r).forEach(([a, i]) => {
    ge(i, s, a, t);
  }), s;
}, ge = (e, t, r, s) => {
  e.forEach((c) => {
    if (typeof c == "string") {
      const a = c === "" ? t : _e(t, c);
      a.classGroupId = r;
      return;
    }
    if (typeof c == "function") {
      if (nt(c)) {
        ge(c(s), t, r, s);
        return;
      }
      t.validators.push({
        validator: c,
        classGroupId: r
      });
      return;
    }
    Object.entries(c).forEach(([a, i]) => {
      ge(i, _e(t, a), r, s);
    });
  });
}, _e = (e, t) => {
  let r = e;
  return t.split(ve).forEach((s) => {
    r.nextPart.has(s) || r.nextPart.set(s, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(s);
  }), r;
}, nt = (e) => e.isThemeGetter, st = (e, t) => t ? e.map(([r, s]) => {
  const c = s.map((a) => typeof a == "string" ? t + a : typeof a == "object" ? Object.fromEntries(Object.entries(a).map(([i, l]) => [t + i, l])) : a);
  return [r, c];
}) : e, at = (e) => {
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
}, Le = "!", ot = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, s = t.length === 1, c = t[0], a = t.length, i = (l) => {
    const m = [];
    let v = 0, S = 0, A;
    for (let b = 0; b < l.length; b++) {
      let w = l[b];
      if (v === 0) {
        if (w === c && (s || l.slice(b, b + a) === t)) {
          m.push(l.slice(S, b)), S = b + a;
          continue;
        }
        if (w === "/") {
          A = b;
          continue;
        }
      }
      w === "[" ? v++ : w === "]" && v--;
    }
    const q = m.length === 0 ? l : l.substring(S), f = q.startsWith(Le), j = f ? q.substring(1) : q, g = A && A > S ? A - S : void 0;
    return {
      modifiers: m,
      hasImportantModifier: f,
      baseClassName: j,
      maybePostfixModifierPosition: g
    };
  };
  return r ? (l) => r({
    className: l,
    parseClassName: i
  }) : i;
}, it = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((s) => {
    s[0] === "[" ? (t.push(...r.sort(), s), r = []) : r.push(s);
  }), t.push(...r.sort()), t;
}, lt = (e) => ({
  cache: at(e.cacheSize),
  parseClassName: ot(e),
  ...et(e)
}), ct = /\s+/, dt = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: s,
    getConflictingClassGroupIds: c
  } = t, a = [], i = e.trim().split(ct);
  let l = "";
  for (let m = i.length - 1; m >= 0; m -= 1) {
    const v = i[m], {
      modifiers: S,
      hasImportantModifier: A,
      baseClassName: q,
      maybePostfixModifierPosition: f
    } = r(v);
    let j = !!f, g = s(j ? q.substring(0, f) : q);
    if (!g) {
      if (!j) {
        l = v + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (g = s(q), !g) {
        l = v + (l.length > 0 ? " " + l : l);
        continue;
      }
      j = !1;
    }
    const b = it(S).join(":"), w = A ? b + Le : b, T = w + g;
    if (a.includes(T))
      continue;
    a.push(T);
    const D = c(g, j);
    for (let R = 0; R < D.length; ++R) {
      const U = D[R];
      a.push(w + U);
    }
    l = v + (l.length > 0 ? " " + l : l);
  }
  return l;
};
function ut() {
  let e = 0, t, r, s = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = Pe(t)) && (s && (s += " "), s += r);
  return s;
}
const Pe = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let s = 0; s < e.length; s++)
    e[s] && (t = Pe(e[s])) && (r && (r += " "), r += t);
  return r;
};
function pt(e, ...t) {
  let r, s, c, a = i;
  function i(m) {
    const v = t.reduce((S, A) => A(S), e());
    return r = lt(v), s = r.cache.get, c = r.cache.set, a = l, l(m);
  }
  function l(m) {
    const v = s(m);
    if (v)
      return v;
    const S = dt(m, r);
    return c(m, S), S;
  }
  return function() {
    return a(ut.apply(null, arguments));
  };
}
const y = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, Re = /^\[(?:([a-z-]+):)?(.+)\]$/i, ht = /^\d+\/\d+$/, mt = /* @__PURE__ */ new Set(["px", "full", "screen"]), ft = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, gt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, bt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, yt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, xt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, F = (e) => X(e) || mt.has(e) || ht.test(e), O = (e) => Y(e, "length", At), X = (e) => !!e && !Number.isNaN(Number(e)), fe = (e) => Y(e, "number", X), se = (e) => !!e && Number.isInteger(Number(e)), vt = (e) => e.endsWith("%") && X(e.slice(0, -1)), p = (e) => Re.test(e), G = (e) => ft.test(e), wt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), St = (e) => Y(e, wt, Ie), Nt = (e) => Y(e, "position", Ie), kt = /* @__PURE__ */ new Set(["image", "url"]), Ct = (e) => Y(e, kt, Tt), _t = (e) => Y(e, "", jt), ae = () => !0, Y = (e, t, r) => {
  const s = Re.exec(e);
  return s ? s[1] ? typeof t == "string" ? s[1] === t : t.has(s[1]) : r(s[2]) : !1;
}, At = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  gt.test(e) && !bt.test(e)
), Ie = () => !1, jt = (e) => yt.test(e), Tt = (e) => xt.test(e), Et = () => {
  const e = y("colors"), t = y("spacing"), r = y("blur"), s = y("brightness"), c = y("borderColor"), a = y("borderRadius"), i = y("borderSpacing"), l = y("borderWidth"), m = y("contrast"), v = y("grayscale"), S = y("hueRotate"), A = y("invert"), q = y("gap"), f = y("gradientColorStops"), j = y("gradientColorStopPositions"), g = y("inset"), b = y("margin"), w = y("opacity"), T = y("padding"), D = y("saturate"), R = y("scale"), U = y("sepia"), Z = y("skew"), K = y("space"), ie = y("translate"), N = () => ["auto", "contain", "none"], Q = () => ["auto", "hidden", "clip", "visible", "scroll"], B = () => ["auto", p, t], h = () => [p, t], ee = () => ["", F, O], I = () => ["auto", X, p], M = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], C = () => ["solid", "dashed", "dotted", "double", "none"], d = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], L = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], E = () => ["", "0", p], z = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], k = () => [X, p];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [ae],
      spacing: [F, O],
      blur: ["none", "", G, p],
      brightness: k(),
      borderColor: [e],
      borderRadius: ["none", "", "full", G, p],
      borderSpacing: h(),
      borderWidth: ee(),
      contrast: k(),
      grayscale: E(),
      hueRotate: k(),
      invert: E(),
      gap: h(),
      gradientColorStops: [e],
      gradientColorStopPositions: [vt, O],
      inset: B(),
      margin: B(),
      opacity: k(),
      padding: h(),
      saturate: k(),
      scale: k(),
      sepia: E(),
      skew: k(),
      space: h(),
      translate: h()
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
        "break-after": z()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": z()
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
        overflow: Q()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": Q()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": Q()
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
        inset: [g]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [g]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [g]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [g]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [g]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [g]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [g]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [g]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [g]
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
        z: ["auto", se, p]
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
        grow: E()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: E()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", se, p]
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
          span: ["full", se, p]
        }, p]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": I()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": I()
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
          span: [se, p]
        }, p]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": I()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": I()
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
        m: [b]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [b]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [b]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [b]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [b]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [b]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [b]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [b]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [b]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", fe]
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
        "line-clamp": ["none", X, fe]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", F, p]
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
        decoration: ["auto", "from-font", F, O]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", F, p]
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
        indent: h()
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
        bg: [...M(), Nt]
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
        bg: ["auto", "cover", "contain", St]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Ct]
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
        from: [j]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [j]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [j]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [f]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [f]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [f]
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
        "outline-offset": [F, p]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [F, O]
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
        "ring-opacity": [w]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [F, O]
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
        shadow: ["", "inner", "none", G, _t]
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
        contrast: [m]
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
        invert: [A]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [D]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [U]
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
        "backdrop-contrast": [m]
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
        "backdrop-invert": [A]
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
        "backdrop-saturate": [D]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [U]
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
        rotate: [se, p]
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
        "skew-x": [Z]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [Z]
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
        "scroll-m": h()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": h()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": h()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": h()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": h()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": h()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": h()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": h()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": h()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": h()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": h()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": h()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": h()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": h()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": h()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": h()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": h()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": h()
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
        stroke: [F, O, fe]
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
}, zt = /* @__PURE__ */ pt(Et);
function $t(...e) {
  return zt(Ke(e));
}
const qt = "copanel_mobile_desktop_site";
function Mt() {
  try {
    return localStorage.getItem(qt) === "1";
  } catch {
    return !1;
  }
}
function Lt(e = window.innerWidth) {
  return Mt() || e >= 1024;
}
const Pt = Ee(null);
function Rt() {
  return ze(Pt);
}
function It() {
  return Rt()?.isWindowed === !0;
}
function Ft({ children: e, className: t, constrained: r = !1 }) {
  const { theme: s } = $e(), c = It(), a = s === "dark", i = !c && !Lt();
  return /* @__PURE__ */ o(
    "div",
    {
      className: $t(
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
class Ae extends Error {
  constructor(r, s, c, a) {
    super(s);
    P(this, "code");
    P(this, "status");
    P(this, "details");
    this.code = r, this.status = c, this.details = a;
  }
}
async function $(e, t = {}) {
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
    const m = i && typeof i == "object" && i.error ? i.error : { code: `HTTP_${a.status}`, message: typeof i == "string" ? i : i?.detail || a.statusText };
    throw new Ae(m.code || `HTTP_${a.status}`, m.message || "Request failed", a.status, m.details);
  }
  if (i && typeof i == "object" && "status" in i) {
    if (i.status === "success")
      return i.data !== void 0 ? i.data : i;
    if (i.status === "error" && i.error)
      throw new Ae(i.error.code, i.error.message, a.status, i.error.details);
  }
  return i;
}
const Fe = "copanel-session-expired", Dt = /* @__PURE__ */ new Set([
  "/api/auth/login",
  "/api/panel_settings/branding/public"
]);
function Ot(e) {
  try {
    const t = typeof e == "string" ? e : e instanceof URL ? e.href : String(e.url || "");
    return (t.startsWith("http://") || t.startsWith("https://") ? new URL(t) : new URL(t, "http://localhost")).pathname;
  } catch {
    return "";
  }
}
function Gt(e) {
  if (!e) return !1;
  for (const t of Dt)
    if (e === t || e.startsWith(`${t}/`)) return !0;
  return !1;
}
function Ut() {
  typeof window > "u" || window.dispatchEvent(new CustomEvent(Fe));
}
function J() {
  return typeof localStorage > "u" ? null : localStorage.getItem("copanel_token");
}
function Vt(e) {
  const t = {};
  e && new Headers(e).forEach((c, a) => {
    t[a] = c;
  });
  const r = J();
  return r && (t.Authorization = `Bearer ${r}`), t;
}
function Wt(e, t = {}) {
  const r = Vt(t.headers);
  return fetch(e, { ...t, headers: r }).then((s) => (s.status === 401 && !Gt(Ot(e)) && Ut(), s));
}
async function Qt() {
  if (!J()) return null;
  try {
    const e = await Wt("/api/auth/stream-ticket", { method: "POST" });
    if (e.status === 401 || !e.ok) return null;
    const t = await e.json();
    return typeof t?.ticket == "string" ? t.ticket : null;
  } catch {
    return null;
  }
}
const Bt = "copanel-platform-sse-degraded", oe = 2e3, Ht = 6e4, Jt = 3;
class Xt {
  constructor() {
    P(this, "source", null);
    P(this, "handlers", /* @__PURE__ */ new Map());
    P(this, "retryDelay", oe);
    P(this, "retryTimer", null);
    P(this, "failureCount", 0);
    P(this, "connecting", !1);
    P(this, "authFailed", !1);
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
  async buildUrl() {
    if (!J()) return null;
    const t = await Qt();
    return t ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      ticket: t
    }).toString()}` : null;
  }
  ensureConnected() {
    this.authFailed || this.source || this.connecting || typeof document < "u" && document.hidden || J() && (this.connecting = !0, this.buildUrl().then((t) => {
      if (this.connecting = !1, !(this.source || this.handlers.size === 0)) {
        if (!t) {
          if (!J()) {
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
      this.failureCount = 0, this.retryDelay = oe;
    }), this.source.addEventListener("jobs", (r) => {
      this.onStreamMessage(), this.parseAndEmit("jobs", r.data);
    }), this.source.addEventListener("notifications", (r) => {
      this.onStreamMessage(), this.parseAndEmit("notifications", r.data);
    }), this.source.addEventListener("message", () => {
      this.onStreamMessage();
    }), this.source.onerror = () => {
      this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Jt && window.dispatchEvent(new CustomEvent(Bt)), this.scheduleRetry();
    };
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = oe;
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
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), Ht), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = oe);
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
    this.authFailed = !1, this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = oe, this.handlers.size > 0 && J() && this.ensureConnected();
  }
}
const de = new Xt();
function Yt() {
  de.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || Yt();
});
typeof window < "u" && window.addEventListener(Fe, () => {
  de.stop();
});
function De(e) {
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
const we = De({ jobs: {}, order: [], lastFetch: 0 });
function Zt() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function je(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function H(e, t, r) {
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
function be(e) {
  const t = Zt(), r = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: H(e, "title", t) || H(r, "title", t) || e?.title || "",
    message: H(e, "message", t) || H(r, "message", t) || e?.message,
    error: H(e, "error", t) || H(r, "error", t) || e?.error || null
  };
}
function ye(e) {
  const t = be(e);
  we.setState((r) => {
    const s = { ...r.jobs, [t.id]: { ...r.jobs[t.id], ...t } };
    let c = r.order;
    return c.includes(t.id) || (c = [t.id, ...c].slice(0, 200)), { jobs: s, order: c };
  });
}
de.on("jobs", (e) => {
  if (e?.job) {
    ye(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = we.getState().jobs[e.job_id];
    t && ye({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const Kt = {
  async refresh(e = 50) {
    const t = await $(`/api/platform/jobs?limit=${e}`), r = Array.isArray(t) ? t : [];
    we.setState(() => {
      const s = {}, c = [];
      for (const a of r) {
        if (!a || typeof a != "object" || !a.id) continue;
        const i = be(a);
        s[i.id] = i, c.push(i.id);
      }
      return { jobs: s, order: c, lastFetch: Date.now() };
    });
  },
  async get(e) {
    const t = await $(`/api/platform/jobs/${e}`), r = be(t);
    return ye(r), r;
  },
  async cancel(e) {
    return $(`/api/platform/jobs/${e}/cancel`, { method: "POST" });
  }
}, xe = De({ inbox: [], unread: 0, toasts: [] }), er = 6e3;
function tr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function Te(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function ce(e, t, r) {
  if (!e || typeof e != "object") return;
  const s = Te(e[t], r);
  if (s) return s;
  const c = Te(e[`${t}_i18n`], r);
  if (c) return c;
  const a = e[`${t}_${r}`];
  if (typeof a == "string" && a) return a;
  const i = e[`${t}_en`];
  if (typeof i == "string" && i) return i;
  const l = e[`${t}_vi`];
  if (typeof l == "string" && l) return l;
}
function rr(e) {
  const t = tr(), r = e?.payload && typeof e.payload == "object" ? e.payload : {}, s = ce(e, "title", t) || ce(r, "title", t) || e?.title || "", c = ce(e, "body", t) || ce(r, "body", t) || e?.body || null;
  return {
    ...e,
    title: s,
    body: c
  };
}
function nr(e) {
  xe.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    xe.setState((t) => ({ toasts: t.toasts.filter((r) => r.id !== e.id) }));
  }, er);
}
de.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = rr(e.notification);
    nr({ ...t, ephemeral: !0 }), xe.setState((r) => ({
      inbox: [t, ...r.inbox].slice(0, 200),
      unread: r.unread + 1
    }));
  }
});
function lr() {
  const { theme: e, language: t } = $e(), r = e === "dark", [s, c] = _("overview"), [a, i] = _(null), [l, m] = _(null), [v, S] = _([]), [A, q] = _([]), [f, j] = _(null), [g, b] = _("/home"), [w, T] = _(!0), [D, R] = _(!0), [U, Z] = _(100), [K, ie] = _(!1), [N, Q] = _(null), [B, h] = _(null), [ee, I] = _(null), [M, C] = _(!1), d = {
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
  }[t], L = `${r ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} border rounded-xl p-5`, E = `w-full px-3 py-2 rounded-lg border text-sm ${r ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-slate-50 border-slate-300"}`, z = `block text-xs font-medium mb-1 ${r ? "text-slate-400" : "text-slate-500"}`, k = me(async () => {
    const n = await $("/api/clamav/overview");
    i(n), m(n.settings), !g && n.settings.default_scan_targets[0] && b(n.settings.default_scan_targets[0]);
  }, [g]), ue = me(async () => {
    const n = await $("/api/clamav/detections");
    S(n.items || []), q(n.quarantine || []);
  }, []), te = me(async () => {
    await Promise.all([k(), ue()]);
  }, [ue, k]);
  le(() => {
    te().catch((n) => h(n.message));
  }, [te]), le(() => {
    l && (R(l.include_archives), Z(l.max_file_size_mb), !g.trim() && l.default_scan_targets[0] && b(l.default_scan_targets[0]));
  }, [l, g]), le(() => {
    if (!f?.id || !f.job || !["queued", "running"].includes(f.job.status)) return;
    const n = window.setInterval(() => {
      $(`/api/clamav/scan/${f.id}`).then((x) => {
        j(x), (!x.job || !["queued", "running"].includes(x.job.status)) && te().catch(() => {
        });
      }).catch(() => {
      });
    }, 2e3);
    return () => window.clearInterval(n);
  }, [f?.id, f?.job?.status, te]), le(() => {
    if (!N?.id || !["queued", "running"].includes(N.status)) return;
    const n = window.setInterval(() => {
      $(`/api/platform/jobs/${N.id}`).then((x) => {
        Q(x), ["queued", "running"].includes(x.status) || k().catch(() => {
        });
      }).catch(() => {
      });
    }, 2e3);
    return () => window.clearInterval(n);
  }, [N?.id, N?.status, k]);
  const V = (n) => n === "active" || n === "success" || n === "completed" || n === "restored" ? "text-emerald-500" : n === "running" || n === "queued" || n === "quarantined" ? "text-blue-500" : n === "failed" || n === "deleted" || n === "quarantine_failed" || n === "restore_failed" ? "text-red-500" : n === "cancelled" ? "text-slate-500" : n === "detected" ? "text-amber-500" : r ? "text-slate-300" : "text-slate-600", W = (n) => {
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
  }, Oe = async () => {
    if (l) {
      C(!0), h(null);
      try {
        const n = await $("/api/clamav/settings", {
          method: "PUT",
          body: l
        });
        m(n), I(d.saveOk), await k();
      } catch (n) {
        h(n.message);
      } finally {
        C(!1);
      }
    }
  }, pe = async (n) => {
    C(!0), h(null);
    try {
      const x = await $("/api/clamav/scan", {
        method: "POST",
        body: {
          path: n || g,
          recursive: w,
          include_archives: D,
          max_file_size_mb: U,
          auto_quarantine: K
        }
      }), re = await $(`/api/clamav/scan/${x.scan_id}`);
      j(re), c("scan"), I(d.started);
    } catch (x) {
      h(x.message);
    } finally {
      C(!1);
    }
  }, Ge = async () => {
    C(!0), h(null);
    try {
      const n = await $("/api/clamav/update-signatures", {
        method: "POST",
        body: { force: !1 }
      }), x = await $(`/api/platform/jobs/${n.job_id}`);
      Q(x), I(d.started);
    } catch (n) {
      h(n.message);
    } finally {
      C(!1);
    }
  }, Se = async (n) => {
    if (n) {
      C(!0), h(null);
      try {
        await Kt.cancel(n), I(d.cancelled);
      } catch (x) {
        h(x.message);
      } finally {
        C(!1);
      }
    }
  }, he = async (n, x) => {
    C(!0), h(null);
    try {
      if (await $(n, {
        method: "POST",
        body: { detection_id: x }
      }), I(d.actionOk), await ue(), await k(), f?.id) {
        const re = await $(`/api/clamav/scan/${f.id}`);
        j(re);
      }
    } catch (re) {
      h(re.message);
    } finally {
      C(!1);
    }
  }, Ue = ["overview", "scan", "detections", "quarantine", "settings"], Ne = !!(f?.job && ["queued", "running"].includes(f.job.status)), ke = !!(N && ["queued", "running"].includes(N.status)), Ve = He(() => f?.job?.logs || [], [f?.job?.logs]);
  return /* @__PURE__ */ o(Ft, { constrained: !0, children: /* @__PURE__ */ u("div", { className: `p-4 md:p-6 space-y-6 ${r ? "text-slate-100" : "text-slate-900"}`, children: [
    /* @__PURE__ */ u("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ u("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ o(ne.ShieldAlert, { className: "w-7 h-7 text-emerald-500" }),
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
            onClick: () => te().catch((n) => h(n.message)),
            children: d.refresh
          }
        ),
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: "px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50",
            onClick: Ge,
            disabled: M || ke,
            children: d.updateDb
          }
        )
      ] })
    ] }),
    B && /* @__PURE__ */ o("div", { className: "rounded-lg border border-red-300 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300", children: B }),
    ee && /* @__PURE__ */ o("div", { className: "rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300", children: ee }),
    /* @__PURE__ */ o("div", { className: "flex flex-wrap gap-2", children: Ue.map((n) => /* @__PURE__ */ o(
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
        { label: d.installed, value: a?.installed ? d.ready : "No", icon: ne.ShieldCheck },
        { label: d.selectedEngine, value: a?.engine?.selected || "—", icon: ne.Cpu },
        { label: d.signatures, value: a?.signatures?.version || "—", icon: ne.Database },
        { label: d.detections, value: String(a?.stats?.total_detections || 0), icon: ne.Bug }
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
              /* @__PURE__ */ o("span", { className: z, children: "clamd" }),
              /* @__PURE__ */ o("span", { className: V(a?.services?.clamd?.status), children: W(a?.services?.clamd?.status) })
            ] }),
            /* @__PURE__ */ u("p", { children: [
              /* @__PURE__ */ o("span", { className: z, children: "freshclam" }),
              /* @__PURE__ */ o("span", { className: V(a?.services?.freshclam?.status), children: W(a?.services?.freshclam?.status) })
            ] }),
            /* @__PURE__ */ u("p", { children: [
              /* @__PURE__ */ o("span", { className: z, children: d.signatures }),
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
                /* @__PURE__ */ o("span", { className: `text-sm font-medium ${V(n.status)}`, children: W(n.status) })
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
          /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-2 rounded-lg bg-slate-700 text-white text-sm", onClick: () => pe("/home"), disabled: M, children: d.quickScanHome }),
          /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-2 rounded-lg bg-slate-700 text-white text-sm", onClick: () => pe("/var/www"), disabled: M, children: d.quickScanWeb })
        ] }),
        /* @__PURE__ */ o("label", { className: z, children: d.scanPath }),
        /* @__PURE__ */ o("input", { className: E, value: g, onChange: (n) => b(n.target.value), placeholder: "/home/site/public_html" }),
        /* @__PURE__ */ o("p", { className: "mt-1 text-xs text-slate-500", children: d.browserHint }),
        /* @__PURE__ */ u("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4", children: [
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ o("input", { type: "checkbox", checked: w, onChange: (n) => T(n.target.checked) }),
            d.recursive
          ] }),
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ o("input", { type: "checkbox", checked: D, onChange: (n) => R(n.target.checked) }),
            d.includeArchives
          ] }),
          /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ o("input", { type: "checkbox", checked: K, onChange: (n) => ie(n.target.checked) }),
            d.autoQuarantine
          ] }),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ o("label", { className: z, children: d.maxFileSize }),
            /* @__PURE__ */ o("input", { className: E, type: "number", min: 1, max: 2048, value: U, onChange: (n) => Z(Number(n.target.value)) })
          ] })
        ] }),
        /* @__PURE__ */ o("button", { type: "button", className: "mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50", disabled: M || Ne || !g.trim(), onClick: () => pe(), children: d.startScan })
      ] }),
      f && /* @__PURE__ */ u("div", { className: L, children: [
        /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ o("h2", { className: "font-semibold", children: d.currentScan }),
          /* @__PURE__ */ u("div", { className: "flex items-center gap-2", children: [
            Ne && /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50",
                disabled: M,
                onClick: () => Se(f.job?.id),
                children: d.stopScan
              }
            ),
            /* @__PURE__ */ o("span", { className: `text-sm font-medium ${V(f.job?.status || f.status)}`, children: W(f.job?.status || f.status) })
          ] })
        ] }),
        /* @__PURE__ */ o("p", { className: "text-sm break-all", children: f.path }),
        /* @__PURE__ */ u("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm", children: [
          /* @__PURE__ */ u("div", { children: [
            d.infected,
            ": ",
            /* @__PURE__ */ o("strong", { children: f.summary?.infected_count || 0 })
          ] }),
          /* @__PURE__ */ u("div", { children: [
            d.scanned,
            ": ",
            /* @__PURE__ */ o("strong", { children: f.summary?.scanned_count || 0 })
          ] }),
          /* @__PURE__ */ u("div", { children: [
            d.errors,
            ": ",
            /* @__PURE__ */ o("strong", { children: f.summary?.error_count || 0 })
          ] })
        ] }),
        /* @__PURE__ */ o("div", { className: `mt-4 h-2 w-full overflow-hidden rounded-full ${r ? "bg-slate-800" : "bg-slate-200"}`, children: /* @__PURE__ */ o("div", { className: "h-full bg-blue-600 rounded-full transition-all", style: { width: `${f.job?.progress || 0}%` } }) }),
        /* @__PURE__ */ u("div", { className: "mt-4", children: [
          /* @__PURE__ */ o("div", { className: `mb-2 text-xs font-medium uppercase ${r ? "text-slate-400" : "text-slate-500"}`, children: d.scanLogs }),
          /* @__PURE__ */ o("pre", { className: `max-h-80 overflow-auto rounded-lg border p-3 text-[11px] whitespace-pre-wrap ${r ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`, children: Ve.map((n) => n.line).join(`
`) || "—" })
        ] })
      ] }),
      N && /* @__PURE__ */ u("div", { className: L, children: [
        /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ o("h2", { className: "font-semibold", children: d.lastUpdateJob }),
          ke && /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50",
              disabled: M,
              onClick: () => Se(N.id),
              children: d.stopUpdate
            }
          )
        ] }),
        /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ o("span", { children: W(N.status) }),
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
          /* @__PURE__ */ o("span", { className: `text-sm font-medium ${V(n.status)}`, children: W(n.status) })
        ] }),
        /* @__PURE__ */ o("div", { className: "mt-3 flex flex-wrap gap-2", children: n.status === "detected" && /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium disabled:opacity-50", disabled: M, onClick: () => he("/api/clamav/detections/quarantine", n.id), children: d.quarantineNow }) })
      ] }, n.id)) })
    ] }),
    s === "quarantine" && /* @__PURE__ */ u("div", { className: L, children: [
      A.length === 0 && /* @__PURE__ */ o("p", { className: `text-sm ${r ? "text-slate-400" : "text-slate-500"}`, children: d.emptyQuarantine }),
      /* @__PURE__ */ o("div", { className: "space-y-3", children: A.map((n) => /* @__PURE__ */ u("div", { className: `rounded-lg border p-3 ${r ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50"}`, children: [
        /* @__PURE__ */ u("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ u("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ o("p", { className: "font-medium break-all", children: n.original_path || n.path }),
            /* @__PURE__ */ o("p", { className: "text-sm text-amber-500", children: n.signature }),
            /* @__PURE__ */ o("p", { className: "text-xs mt-1 text-slate-500", children: n.quarantine_path || "—" }),
            n.action_error && /* @__PURE__ */ o("p", { className: "text-xs text-red-500 mt-1", children: n.action_error })
          ] }),
          /* @__PURE__ */ o("span", { className: `text-sm font-medium ${V(n.status)}`, children: W(n.status) })
        ] }),
        /* @__PURE__ */ o("div", { className: "mt-3 flex flex-wrap gap-2", children: n.status === "quarantined" && /* @__PURE__ */ u(Be, { children: [
          /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium disabled:opacity-50", disabled: M, onClick: () => he("/api/clamav/quarantine/restore", n.id), children: d.restore }),
          /* @__PURE__ */ o("button", { type: "button", className: "px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50", disabled: M, onClick: () => he("/api/clamav/quarantine/delete", n.id), children: d.deleteForever })
        ] }) })
      ] }, n.id)) })
    ] }),
    s === "settings" && l && /* @__PURE__ */ o("div", { className: L, children: /* @__PURE__ */ u("div", { className: "space-y-4", children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ o("label", { className: z, children: d.quarantineDir }),
        /* @__PURE__ */ o("input", { className: E, value: l.quarantine_dir, onChange: (n) => m({ ...l, quarantine_dir: n.target.value }) })
      ] }),
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ o("label", { className: z, children: d.defaultTargets }),
        /* @__PURE__ */ o("textarea", { className: `${E} min-h-28`, value: l.default_scan_targets.join(`
`), onChange: (n) => m({ ...l, default_scan_targets: n.target.value.split(`
`).map((x) => x.trim()).filter(Boolean) }) })
      ] }),
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ o("label", { className: z, children: d.excludePaths }),
        /* @__PURE__ */ o("textarea", { className: `${E} min-h-28`, value: l.exclude_paths.join(`
`), onChange: (n) => m({ ...l, exclude_paths: n.target.value.split(`
`).map((x) => x.trim()).filter(Boolean) }) })
      ] }),
      /* @__PURE__ */ u("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ o("label", { className: z, children: d.retentionDays }),
          /* @__PURE__ */ o("input", { className: E, type: "number", min: 1, max: 365, value: l.retention_days, onChange: (n) => m({ ...l, retention_days: Number(n.target.value) }) })
        ] }),
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ o("label", { className: z, children: d.maxFileSize }),
          /* @__PURE__ */ o("input", { className: E, type: "number", min: 1, max: 2048, value: l.max_file_size_mb, onChange: (n) => m({ ...l, max_file_size_mb: Number(n.target.value) }) })
        ] }),
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ o("label", { className: z, children: d.preferredEngine }),
          /* @__PURE__ */ u("select", { className: E, value: l.preferred_engine, onChange: (n) => m({ ...l, preferred_engine: n.target.value }), children: [
            /* @__PURE__ */ o("option", { value: "auto", children: d.auto }),
            /* @__PURE__ */ o("option", { value: "clamscan", children: "clamscan" }),
            /* @__PURE__ */ o("option", { value: "clamdscan", children: "clamdscan" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ o("input", { type: "checkbox", checked: l.include_archives, onChange: (n) => m({ ...l, include_archives: n.target.checked }) }),
        d.includeArchives
      ] }),
      /* @__PURE__ */ o("button", { type: "button", className: "px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50", disabled: M, onClick: Oe, children: d.saveSettings })
    ] }) })
  ] }) });
}
export {
  lr as default
};
