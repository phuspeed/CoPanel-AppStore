import { jsx as e, jsxs as r, Fragment as J } from "react/jsx-runtime";
import { createContext as fa, useContext as va, useState as p, useEffect as Le, useRef as Kt, useLayoutEffect as Ua, useCallback as K, useMemo as fe } from "react";
import { useOutletContext as qa } from "react-router-dom";
import * as $ from "lucide-react";
import { createPortal as Qa } from "react-dom";
const Xa = fa(null);
function Ya() {
  return va(Xa);
}
const Za = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Ut() {
  const a = Ya(), i = qa();
  return a || (i?.theme ? {
    theme: i.theme,
    setTheme: i.setTheme ?? (() => {
    }),
    language: i.language ?? "en",
    setLanguage: i.setLanguage ?? (() => {
    })
  } : Za);
}
function ya(a) {
  var i, n, o = "";
  if (typeof a == "string" || typeof a == "number") o += a;
  else if (typeof a == "object") if (Array.isArray(a)) {
    var c = a.length;
    for (i = 0; i < c; i++) a[i] && (n = ya(a[i])) && (o && (o += " "), o += n);
  } else for (n in a) a[n] && (o && (o += " "), o += n);
  return o;
}
function Ja() {
  for (var a, i, n = 0, o = "", c = arguments.length; n < c; n++) (a = arguments[n]) && (i = ya(a)) && (o && (o += " "), o += i);
  return o;
}
const qt = "-", en = (a) => {
  const i = an(a), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: o
  } = a;
  return {
    getClassGroupId: (b) => {
      const h = b.split(qt);
      return h[0] === "" && h.length !== 1 && h.shift(), wa(h, i) || tn(b);
    },
    getConflictingClassGroupIds: (b, h) => {
      const C = n[b] || [];
      return h && o[b] ? [...C, ...o[b]] : C;
    }
  };
}, wa = (a, i) => {
  if (a.length === 0)
    return i.classGroupId;
  const n = a[0], o = i.nextPart.get(n), c = o ? wa(a.slice(1), o) : void 0;
  if (c)
    return c;
  if (i.validators.length === 0)
    return;
  const m = a.join(qt);
  return i.validators.find(({
    validator: b
  }) => b(m))?.classGroupId;
}, ia = /^\[(.+)\]$/, tn = (a) => {
  if (ia.test(a)) {
    const i = ia.exec(a)[1], n = i?.substring(0, i.indexOf(":"));
    if (n)
      return "arbitrary.." + n;
  }
}, an = (a) => {
  const {
    theme: i,
    prefix: n
  } = a, o = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return rn(Object.entries(a.classGroups), n).forEach(([m, b]) => {
    Dt(b, o, m, i);
  }), o;
}, Dt = (a, i, n, o) => {
  a.forEach((c) => {
    if (typeof c == "string") {
      const m = c === "" ? i : da(i, c);
      m.classGroupId = n;
      return;
    }
    if (typeof c == "function") {
      if (nn(c)) {
        Dt(c(o), i, n, o);
        return;
      }
      i.validators.push({
        validator: c,
        classGroupId: n
      });
      return;
    }
    Object.entries(c).forEach(([m, b]) => {
      Dt(b, da(i, m), n, o);
    });
  });
}, da = (a, i) => {
  let n = a;
  return i.split(qt).forEach((o) => {
    n.nextPart.has(o) || n.nextPart.set(o, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), n = n.nextPart.get(o);
  }), n;
}, nn = (a) => a.isThemeGetter, rn = (a, i) => i ? a.map(([n, o]) => {
  const c = o.map((m) => typeof m == "string" ? i + m : typeof m == "object" ? Object.fromEntries(Object.entries(m).map(([b, h]) => [i + b, h])) : m);
  return [n, c];
}) : a, ln = (a) => {
  if (a < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let i = 0, n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  const c = (m, b) => {
    n.set(m, b), i++, i > a && (i = 0, o = n, n = /* @__PURE__ */ new Map());
  };
  return {
    get(m) {
      let b = n.get(m);
      if (b !== void 0)
        return b;
      if ((b = o.get(m)) !== void 0)
        return c(m, b), b;
    },
    set(m, b) {
      n.has(m) ? n.set(m, b) : c(m, b);
    }
  };
}, Na = "!", sn = (a) => {
  const {
    separator: i,
    experimentalParseClassName: n
  } = a, o = i.length === 1, c = i[0], m = i.length, b = (h) => {
    const C = [];
    let x = 0, s = 0, g;
    for (let _ = 0; _ < h.length; _++) {
      let L = h[_];
      if (x === 0) {
        if (L === c && (o || h.slice(_, _ + m) === i)) {
          C.push(h.slice(s, _)), s = _ + m;
          continue;
        }
        if (L === "/") {
          g = _;
          continue;
        }
      }
      L === "[" ? x++ : L === "]" && x--;
    }
    const N = C.length === 0 ? h : h.substring(s), f = N.startsWith(Na), T = f ? N.substring(1) : N, k = g && g > s ? g - s : void 0;
    return {
      modifiers: C,
      hasImportantModifier: f,
      baseClassName: T,
      maybePostfixModifierPosition: k
    };
  };
  return n ? (h) => n({
    className: h,
    parseClassName: b
  }) : b;
}, on = (a) => {
  if (a.length <= 1)
    return a;
  const i = [];
  let n = [];
  return a.forEach((o) => {
    o[0] === "[" ? (i.push(...n.sort(), o), n = []) : n.push(o);
  }), i.push(...n.sort()), i;
}, dn = (a) => ({
  cache: ln(a.cacheSize),
  parseClassName: sn(a),
  ...en(a)
}), cn = /\s+/, mn = (a, i) => {
  const {
    parseClassName: n,
    getClassGroupId: o,
    getConflictingClassGroupIds: c
  } = i, m = [], b = a.trim().split(cn);
  let h = "";
  for (let C = b.length - 1; C >= 0; C -= 1) {
    const x = b[C], {
      modifiers: s,
      hasImportantModifier: g,
      baseClassName: N,
      maybePostfixModifierPosition: f
    } = n(x);
    let T = !!f, k = o(T ? N.substring(0, f) : N);
    if (!k) {
      if (!T) {
        h = x + (h.length > 0 ? " " + h : h);
        continue;
      }
      if (k = o(N), !k) {
        h = x + (h.length > 0 ? " " + h : h);
        continue;
      }
      T = !1;
    }
    const _ = on(s).join(":"), L = g ? _ + Na : _, E = L + k;
    if (m.includes(E))
      continue;
    m.push(E);
    const j = c(k, T);
    for (let M = 0; M < j.length; ++M) {
      const v = j[M];
      m.push(L + v);
    }
    h = x + (h.length > 0 ? " " + h : h);
  }
  return h;
};
function pn() {
  let a = 0, i, n, o = "";
  for (; a < arguments.length; )
    (i = arguments[a++]) && (n = ka(i)) && (o && (o += " "), o += n);
  return o;
}
const ka = (a) => {
  if (typeof a == "string")
    return a;
  let i, n = "";
  for (let o = 0; o < a.length; o++)
    a[o] && (i = ka(a[o])) && (n && (n += " "), n += i);
  return n;
};
function un(a, ...i) {
  let n, o, c, m = b;
  function b(C) {
    const x = i.reduce((s, g) => g(s), a());
    return n = dn(x), o = n.cache.get, c = n.cache.set, m = h, h(C);
  }
  function h(C) {
    const x = o(C);
    if (x)
      return x;
    const s = mn(C, n);
    return c(C, s), s;
  }
  return function() {
    return m(pn.apply(null, arguments));
  };
}
const B = (a) => {
  const i = (n) => n[a] || [];
  return i.isThemeGetter = !0, i;
}, Ca = /^\[(?:([a-z-]+):)?(.+)\]$/i, bn = /^\d+\/\d+$/, hn = /* @__PURE__ */ new Set(["px", "full", "screen"]), gn = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, xn = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, fn = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, vn = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, yn = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, we = (a) => Qe(a) || hn.has(a) || bn.test(a), Ce = (a) => Xe(a, "length", Pn), Qe = (a) => !!a && !Number.isNaN(Number(a)), Ot = (a) => Xe(a, "number", Qe), ut = (a) => !!a && Number.isInteger(Number(a)), wn = (a) => a.endsWith("%") && Qe(a.slice(0, -1)), S = (a) => Ca.test(a), $e = (a) => gn.test(a), Nn = /* @__PURE__ */ new Set(["length", "size", "percentage"]), kn = (a) => Xe(a, Nn, $a), Cn = (a) => Xe(a, "position", $a), $n = /* @__PURE__ */ new Set(["image", "url"]), _n = (a) => Xe(a, $n, Mn), Sn = (a) => Xe(a, "", Tn), bt = () => !0, Xe = (a, i, n) => {
  const o = Ca.exec(a);
  return o ? o[1] ? typeof i == "string" ? o[1] === i : i.has(o[1]) : n(o[2]) : !1;
}, Pn = (a) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  xn.test(a) && !fn.test(a)
), $a = () => !1, Tn = (a) => vn.test(a), Mn = (a) => yn.test(a), zn = () => {
  const a = B("colors"), i = B("spacing"), n = B("blur"), o = B("brightness"), c = B("borderColor"), m = B("borderRadius"), b = B("borderSpacing"), h = B("borderWidth"), C = B("contrast"), x = B("grayscale"), s = B("hueRotate"), g = B("invert"), N = B("gap"), f = B("gradientColorStops"), T = B("gradientColorStopPositions"), k = B("inset"), _ = B("margin"), L = B("opacity"), E = B("padding"), j = B("saturate"), M = B("scale"), v = B("sepia"), A = B("skew"), O = B("space"), F = B("translate"), G = () => ["auto", "contain", "none"], ee = () => ["auto", "hidden", "clip", "visible", "scroll"], U = () => ["auto", S, i], P = () => [S, i], te = () => ["", we, Ce], ae = () => ["auto", Qe, S], pe = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], ue = () => ["solid", "dashed", "dotted", "double", "none"], be = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], he = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], ie = () => ["", "0", S], _e = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], q = () => [Qe, S];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [bt],
      spacing: [we, Ce],
      blur: ["none", "", $e, S],
      brightness: q(),
      borderColor: [a],
      borderRadius: ["none", "", "full", $e, S],
      borderSpacing: P(),
      borderWidth: te(),
      contrast: q(),
      grayscale: ie(),
      hueRotate: q(),
      invert: ie(),
      gap: P(),
      gradientColorStops: [a],
      gradientColorStopPositions: [wn, Ce],
      inset: U(),
      margin: U(),
      opacity: q(),
      padding: P(),
      saturate: q(),
      scale: q(),
      sepia: ie(),
      skew: q(),
      space: P(),
      translate: P()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", S]
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
        columns: [$e]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": _e()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": _e()
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
        object: [...pe(), S]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: ee()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": ee()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": ee()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: G()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": G()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": G()
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
        z: ["auto", ut, S]
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
        flex: ["1", "auto", "initial", "none", S]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ie()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ie()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", ut, S]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [bt]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", ut, S]
        }, S]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": ae()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": ae()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [bt]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [ut, S]
        }, S]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": ae()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": ae()
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
        "auto-cols": ["auto", "min", "max", "fr", S]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", S]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [N]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [N]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [N]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...he()]
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
        content: ["normal", ...he(), "baseline"]
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
        "place-content": [...he(), "baseline"]
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
        p: [E]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [E]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [E]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [E]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [E]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [E]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [E]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [E]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [E]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [_]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [_]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [_]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [_]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [_]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [_]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [_]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [_]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [_]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [O]
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
        "space-y": [O]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", S, i]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [S, i, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [S, i, "none", "full", "min", "max", "fit", "prose", {
          screen: [$e]
        }, $e]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [S, i, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [S, i, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [S, i, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [S, i, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", $e, Ce]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Ot]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [bt]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", S]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", Qe, Ot]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", we, S]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", S]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", S]
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
        placeholder: [a]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [L]
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
        text: [a]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [L]
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
        decoration: [...ue(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", we, Ce]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", we, S]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [a]
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
        indent: P()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", S]
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
        content: ["none", S]
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
        "bg-opacity": [L]
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
        bg: [...pe(), Cn]
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
        bg: ["auto", "cover", "contain", kn]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, _n]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [a]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [T]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [T]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [T]
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
        rounded: [m]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [m]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [m]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [m]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [m]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [m]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [m]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [m]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [m]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [m]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [m]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [m]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [m]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [m]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [m]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [h]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [h]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [h]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [h]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [h]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [h]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [h]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [h]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [h]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [L]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...ue(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [h]
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
        "divide-y": [h]
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
        "divide-opacity": [L]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: ue()
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
        outline: ["", ...ue()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [we, S]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [we, Ce]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [a]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: te()
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
        ring: [a]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [L]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [we, Ce]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [a]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", $e, Sn]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [bt]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [L]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...be(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": be()
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
        brightness: [o]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [C]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", $e, S]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [x]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [s]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [g]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [j]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [v]
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
        "backdrop-brightness": [o]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [C]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [x]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [s]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [g]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [L]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [j]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [v]
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
        "border-spacing": [b]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [b]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [b]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", S]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: q()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", S]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: q()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", S]
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
        rotate: [ut, S]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [F]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [F]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [A]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [A]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", S]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", a]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", S]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [a]
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
        "scroll-m": P()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": P()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": P()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": P()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": P()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": P()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": P()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": P()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": P()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": P()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": P()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": P()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": P()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": P()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": P()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": P()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": P()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": P()
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
        "will-change": ["auto", "scroll", "contents", "transform", S]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [a, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [we, Ce, Ot]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [a, "none"]
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
}, Rn = /* @__PURE__ */ un(zn);
function ve(...a) {
  return Rn(Ja(a));
}
const An = "copanel_mobile_desktop_site";
function Fn() {
  try {
    return localStorage.getItem(An) === "1";
  } catch {
    return !1;
  }
}
function jt(a = window.innerWidth) {
  return Fn() || a >= 1024;
}
const Ln = fa(null);
function _a() {
  return va(Ln);
}
function Qt() {
  return _a()?.isWindowed === !0;
}
function En({ children: a, className: i, constrained: n = !1 }) {
  const { theme: o } = Ut(), c = Qt(), m = o === "dark", b = !c && !jt();
  return /* @__PURE__ */ e(
    "div",
    {
      className: ve(
        "flex flex-col transition-colors duration-200",
        c ? "h-full min-h-0" : b ? "min-h-0" : "min-h-screen",
        m ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !c && n && "mx-auto max-w-7xl",
        i
      ),
      children: a
    }
  );
}
function Bn({
  isDark: a,
  sidebar: i,
  children: n,
  mobileTitle: o,
  className: c
}) {
  const m = Qt(), [b, h] = p(!1), [C, x] = p(() => jt());
  Le(() => {
    const N = () => x(jt());
    return window.addEventListener("resize", N), () => window.removeEventListener("resize", N);
  }, []);
  const s = !m && !C;
  Le(() => {
    C && h(!1);
  }, [C]);
  const g = () => h(!1);
  return s ? /* @__PURE__ */ r("div", { className: ve("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", c), children: [
    /* @__PURE__ */ r(
      "div",
      {
        className: ve(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2.5",
          a ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white"
        ),
        children: [
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: () => h(!0),
              className: ve(
                "inline-flex items-center justify-center rounded-lg p-2",
                a ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ e($.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          o ? /* @__PURE__ */ e("span", { className: ve("truncate text-sm font-semibold", a ? "text-slate-100" : "text-slate-900"), children: o }) : null
        ]
      }
    ),
    b ? /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: g
      }
    ) : null,
    /* @__PURE__ */ e(
      "div",
      {
        className: ve(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          b ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: g,
        children: i
      }
    ),
    /* @__PURE__ */ e("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: n })
  ] }) : /* @__PURE__ */ r("div", { className: ve("flex h-full min-h-0 flex-1 overflow-hidden", c), children: [
    i,
    /* @__PURE__ */ e("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: n })
  ] });
}
const In = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function Vn({
  open: a,
  onClose: i,
  children: n,
  title: o,
  className: c,
  maxWidth: m = "lg",
  closeOnBackdropClick: b = !0
}) {
  const { theme: h } = Ut(), C = h === "dark", x = _a(), s = Kt(null), [g, N] = p(null);
  Ua(() => {
    if (x?.isWindowed) return;
    const E = s.current?.closest(".module-window-viewport");
    N(E instanceof HTMLElement ? E : null);
  }, [x?.isWindowed, a]);
  const f = /* @__PURE__ */ e("span", { ref: s, hidden: !0, "aria-hidden": "true" });
  if (!a) return f;
  const T = !!(x?.isWindowed || g), k = /* @__PURE__ */ e(
    "div",
    {
      className: ve(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        T ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: b ? i : void 0,
      children: /* @__PURE__ */ r(
        "div",
        {
          className: ve(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            In[m],
            C ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            c
          ),
          onClick: (E) => E.stopPropagation(),
          children: [
            o && /* @__PURE__ */ r(
              "div",
              {
                className: ve(
                  "flex items-center justify-between border-b px-4 py-3",
                  C ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ e("h3", { className: "text-sm font-bold", children: o }),
                  /* @__PURE__ */ e("button", { type: "button", onClick: i, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ e($.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            n
          ]
        }
      )
    }
  ), _ = (x?.isWindowed ? x.viewportRef.current : null) || g || document.body, L = Qa(k, _);
  return /* @__PURE__ */ r(J, { children: [
    f,
    L
  ] });
}
function Gn({
  queue: a,
  log: i,
  isDark: n,
  busy: o,
  validationSummary: c,
  tr: m,
  onRemove: b,
  onClear: h,
  onValidate: C,
  onApply: x
}) {
  const s = n ? "border-slate-800" : "border-slate-200", g = n ? "text-slate-500" : "text-slate-400";
  return /* @__PURE__ */ r("aside", { className: `flex w-full shrink-0 flex-col border-t lg:w-52 lg:border-l lg:border-t-0 xl:w-56 ${s} ${n ? "bg-slate-950/25" : "bg-[#ececf0]/35"}`, children: [
    /* @__PURE__ */ r("div", { className: `p-3 border-b ${s}`, children: [
      /* @__PURE__ */ e("p", { className: `text-[10px] font-bold uppercase tracking-wider mb-2 ${g}`, children: m.pendingOps }),
      a.length === 0 ? /* @__PURE__ */ e("p", { className: `text-[11px] ${g}`, children: m.pendingEmpty }) : /* @__PURE__ */ e("ul", { className: "space-y-1.5 max-h-40 overflow-y-auto", children: a.map((N, f) => /* @__PURE__ */ r(
        "li",
        {
          className: `flex items-start gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] ${n ? "border-slate-700 bg-slate-900/60" : "border-slate-200 bg-white"}`,
          children: [
            /* @__PURE__ */ r("span", { className: `shrink-0 font-mono font-bold ${n ? "text-cyan-400" : "text-cyan-700"}`, children: [
              f + 1,
              "."
            ] }),
            /* @__PURE__ */ e("span", { className: "flex-1 leading-snug break-words", children: N.summary }),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                disabled: o,
                onClick: () => b(N.id),
                className: `shrink-0 p-0.5 rounded ${n ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`,
                title: m.remove,
                children: /* @__PURE__ */ e($.X, { className: "w-3 h-3" })
              }
            )
          ]
        },
        N.id
      )) }),
      /* @__PURE__ */ r("div", { className: "flex flex-col gap-1.5 mt-3", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: o || a.length === 0,
            onClick: C,
            className: `w-full py-1.5 rounded-lg text-[10px] font-bold border ${n ? "border-slate-600 text-slate-200 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-white"} disabled:opacity-40`,
            children: o ? m.validating : m.validate
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: o || a.length === 0,
            onClick: x,
            className: "w-full py-2 rounded-lg text-[10px] font-bold bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-40",
            children: o ? m.applying : m.applyAll
          }
        ),
        a.length > 0 && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: o,
            onClick: h,
            className: `w-full py-1 text-[10px] font-semibold ${g} hover:underline disabled:opacity-40`,
            children: m.clearQueue
          }
        )
      ] }),
      c && /* @__PURE__ */ e("p", { className: `mt-2 text-[10px] leading-relaxed ${c.includes("error") ? "text-red-500" : n ? "text-emerald-400" : "text-emerald-700"}`, children: c })
    ] }),
    /* @__PURE__ */ r("div", { className: "flex-1 p-3 min-h-[120px] overflow-y-auto", children: [
      /* @__PURE__ */ e("p", { className: `text-[10px] font-bold uppercase tracking-wider mb-2 ${g}`, children: m.operationLog }),
      i.length === 0 ? /* @__PURE__ */ e("p", { className: `text-[11px] ${g}`, children: m.logEmpty }) : /* @__PURE__ */ e("ul", { className: "space-y-2", children: i.map((N) => /* @__PURE__ */ r("li", { className: "text-[10px] leading-relaxed", children: [
        /* @__PURE__ */ r("div", { className: "flex items-center gap-1.5", children: [
          N.status === "success" ? /* @__PURE__ */ e($.CheckCircle2, { className: "w-3 h-3 text-emerald-500 shrink-0" }) : N.status === "failed" ? /* @__PURE__ */ e($.XCircle, { className: "w-3 h-3 text-red-500 shrink-0" }) : /* @__PURE__ */ e($.Circle, { className: "w-3 h-3 text-slate-400 shrink-0" }),
          /* @__PURE__ */ e("span", { className: "font-mono font-bold", children: N.op })
        ] }),
        N.preview && /* @__PURE__ */ e("p", { className: `font-mono mt-0.5 pl-4 truncate ${g}`, children: N.preview }),
        /* @__PURE__ */ e("p", { className: `pl-4 ${N.status === "failed" ? "text-red-500" : g}`, children: N.message })
      ] }, `${N.index}-${N.preview}`)) })
    ] })
  ] });
}
const On = /* @__PURE__ */ new Set(["ext4", "ext3", "ext2", "ntfs"]);
function ca(a, i) {
  const n = a.start_mib ?? 1, o = a.end_mib ?? n;
  let m = i.size_bytes / (1024 * 1024);
  for (const T of i.partitions) {
    if (T.path === a.path) continue;
    const k = T.start_mib ?? 0;
    k > o + 0.5 && k < m + 0.5 && (m = k - 1);
  }
  for (const T of i.unallocated || []) {
    const k = T.start_mib, _ = T.end_mib;
    _ <= o + 0.5 || k <= o + 1 && _ > o && (m = Math.max(m, _));
  }
  const b = a.used_bytes ? Math.ceil(a.used_bytes / (1024 * 1024)) : 0, h = n + Math.max(64, Math.ceil(b * 1.12) + 32), C = (a.fstype || "").toLowerCase(), x = !C || On.has(C), s = !!(!a.is_mounted && x && h < o - 1), g = Math.floor(m), N = s ? Math.floor(h) : Math.ceil(o), f = g > o + 0.5;
  return {
    minEndMib: N,
    maxEndMib: g,
    currentEndMib: o,
    canExtend: f,
    canShrink: s,
    canResize: f || s
  };
}
function Wn(a, i, n) {
  const o = (a - i.left) / Math.max(1, i.width);
  return Math.round(Math.max(1, Math.min(n, o * n)));
}
function Hn(a, i) {
  return Math.max(i.minEndMib, Math.min(i.maxEndMib, Math.round(a)));
}
function Dn(a, i) {
  return i < a - 0.5;
}
const ma = {
  ext4: "bg-emerald-500",
  xfs: "bg-teal-500",
  btrfs: "bg-lime-500",
  vfat: "bg-sky-500",
  exfat: "bg-blue-500",
  ntfs: "bg-indigo-500",
  hfsplus: "bg-violet-500",
  swap: "bg-purple-500",
  lvm2: "bg-amber-500",
  unknown: "bg-slate-500"
};
function jn(a) {
  const i = (a || "unknown").toLowerCase();
  return ma[i] || ma.unknown;
}
function pa(a) {
  return a.label ? a.label : a.mountpoint ? a.mountpoint : a.name ? a.name : `#${a.number}`;
}
function Kn({
  layout: a,
  mapSegments: i,
  selectedPath: n,
  canMutate: o,
  canCreatePartition: c,
  isUninitialized: m,
  isDark: b,
  formatBytes: h,
  language: C,
  diskPath: x,
  tr: s,
  onSelectPartition: g,
  onClickFree: N,
  onDragResizeEnd: f
}) {
  const T = Kt(null), [k, _] = p(null), L = a.size_bytes / (1024 * 1024), E = K(
    (M, v) => {
      if (!o || !v.path || v.is_mounted) return;
      const A = ca(v, a);
      A.canResize && (M.stopPropagation(), M.preventDefault(), M.currentTarget.setPointerCapture(M.pointerId), _({
        partPath: v.path,
        previewEndMib: v.end_mib ?? A.minEndMib,
        bounds: A
      }));
    },
    [o, a]
  );
  Le(() => {
    if (!k) return;
    const M = (A) => {
      if (!T.current) return;
      const O = T.current.getBoundingClientRect(), F = Wn(A.clientX, O, L);
      _(
        (G) => G ? { ...G, previewEndMib: Hn(F, G.bounds) } : null
      );
    }, v = () => {
      _((A) => {
        if (A) {
          const O = a.partitions.find((G) => G.path === A.partPath), F = O?.end_mib ?? 0;
          O && Math.abs(A.previewEndMib - F) > 0.5 && f(O, A.previewEndMib);
        }
        return null;
      });
    };
    return window.addEventListener("pointermove", M), window.addEventListener("pointerup", v), () => {
      window.removeEventListener("pointermove", M), window.removeEventListener("pointerup", v);
    };
  }, [k, L, a.partitions, f]);
  const j = k ? a.partitions.find((M) => M.path === k.partPath) : null;
  return /* @__PURE__ */ r("div", { children: [
    /* @__PURE__ */ r(
      "div",
      {
        ref: T,
        className: `rounded-xl border p-2 shadow-inner ${b ? "border-slate-700/80 bg-slate-950" : "border-slate-200 bg-white"}`,
        children: [
          /* @__PURE__ */ e("div", { className: "flex h-16 gap-0.5 overflow-hidden rounded-lg relative", children: i.map((M) => {
            if (M.kind === "free") {
              const P = M.gap;
              return /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  disabled: !c || !P,
                  onClick: () => P && N(P.start_mib, P.end_mib),
                  style: { width: `${M.widthPct}%` },
                  className: `relative min-w-[2px] h-full flex items-center justify-center text-[9px] font-bold border border-dashed transition ${c && P ? b ? "bg-slate-900 border-cyan-700/50 text-cyan-400 hover:bg-cyan-950/50 cursor-pointer" : "bg-slate-100 border-cyan-300 text-cyan-700 hover:bg-cyan-50 cursor-pointer" : b ? "bg-slate-900 border-slate-600 text-slate-500" : "bg-slate-100 border-slate-300 text-slate-400"}`,
                  title: m ? s.rawDiskLabel : s.unallocated,
                  children: /* @__PURE__ */ e("span", { className: "truncate px-0.5 hidden sm:inline", children: m ? s.rawDiskLabel : s.unallocated })
                },
                M.key
              );
            }
            const v = M.part, A = v.path === n, O = v.used_percent ?? 0, F = k?.partPath === v.path, G = ca(v, a), ee = A && o && !v.is_mounted && G.canResize;
            let U = M.widthPct;
            if (F && j && k && a.size_bytes) {
              const P = k.previewEndMib * 1024 * 1024, te = (v.start_mib ?? 0) * 1024 * 1024;
              U = Math.max(0.5, (P - te) / a.size_bytes * 100);
            }
            return /* @__PURE__ */ r(
              "div",
              {
                style: { width: `${U}%` },
                className: `relative min-w-[24px] h-full ${F ? "z-20" : ""}`,
                children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: () => v.path && g(v.path),
                      className: `relative w-full h-full text-left overflow-hidden transition ring-2 ${A ? "ring-amber-400 z-10" : "ring-transparent hover:ring-cyan-500/50"} ${b ? "bg-slate-800" : "bg-slate-100"} ${F ? "ring-cyan-400" : ""}`,
                      title: `${pa(v)} · ${v.fstype_label || v.fstype || "—"}`,
                      children: [
                        /* @__PURE__ */ e("div", { className: `absolute inset-x-0 bottom-0 h-1.5 ${jn(v.fstype)} opacity-80` }),
                        /* @__PURE__ */ e(
                          "div",
                          {
                            className: "absolute inset-x-0 bottom-1.5 h-2 bg-cyan-500/70",
                            style: { width: `${Math.min(100, O)}%` }
                          }
                        ),
                        /* @__PURE__ */ r("div", { className: "relative p-1 h-full flex flex-col justify-between", children: [
                          /* @__PURE__ */ e("span", { className: `text-[9px] font-bold truncate leading-tight ${b ? "text-white" : "text-slate-800"}`, children: pa(v) }),
                          /* @__PURE__ */ r("span", { className: `text-[8px] font-mono truncate ${b ? "text-slate-400" : "text-slate-500"}`, children: [
                            v.fstype_label || v.fstype || "—",
                            v.size_bytes ? ` · ${h(v.size_bytes, C)}` : ""
                          ] }),
                          v.is_boot && /* @__PURE__ */ e($.Flag, { className: "absolute top-1 right-1 w-2.5 h-2.5 text-amber-400" })
                        ] })
                      ]
                    }
                  ),
                  ee && /* @__PURE__ */ e(
                    "div",
                    {
                      role: "separator",
                      "aria-orientation": "vertical",
                      onPointerDown: (P) => E(P, v),
                      className: `absolute top-0 right-0 w-2 h-full cursor-ew-resize z-30 flex items-center justify-center ${b ? "hover:bg-cyan-500/40" : "hover:bg-cyan-500/30"}`,
                      title: s.dragResizeHint,
                      children: /* @__PURE__ */ e("div", { className: `w-0.5 h-8 rounded-full ${b ? "bg-cyan-400" : "bg-cyan-600"}` })
                    }
                  )
                ]
              },
              M.key
            );
          }) }),
          /* @__PURE__ */ r("div", { className: `mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono ${b ? "text-slate-500" : "text-slate-400"}`, children: [
            /* @__PURE__ */ r("span", { children: [
              x,
              " · ",
              h(a.size_bytes, C)
            ] }),
            k && j && /* @__PURE__ */ e("span", { className: b ? "text-cyan-400" : "text-cyan-700", children: Dn(j.end_mib ?? 0, k.previewEndMib) ? s.shrinkPreview(k.previewEndMib) : s.extendPreview(k.previewEndMib) })
          ] })
        ]
      }
    ),
    o && !k && /* @__PURE__ */ e("p", { className: `mt-1 text-[9px] ${b ? "text-slate-500" : "text-slate-400"}`, children: s.dragResizeHint })
  ] });
}
function Un() {
  return `op-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
function ua(a) {
  return {
    op: a.op,
    disk_name: a.disk_name,
    device: a.device,
    confirm_token: a.confirm_token,
    params: a.params
  };
}
const Wt = [
  { value: "ext4", label: "ext4" },
  { value: "xfs", label: "XFS" },
  { value: "btrfs", label: "Btrfs" },
  { value: "vfat", label: "FAT32" },
  { value: "exfat", label: "exFAT" },
  { value: "ntfs", label: "NTFS" },
  { value: "hfsplus", label: "HFS+" }
], ba = [
  { value: "linux", labelKey: "typeLinux" },
  { value: "efi", labelKey: "typeEfi" },
  { value: "swap", labelKey: "typeSwap" },
  { value: "ntfs", labelKey: "typeNtfs" },
  { value: "lvm", labelKey: "typeLvm" }
];
function Ht(a, i, n) {
  const o = i.find((x) => x.name === a);
  if (!o) return null;
  const c = o.partitions || [];
  let m = 1;
  const b = c.map((x, s) => {
    const g = n.find((k) => k.device === x.path), N = x.size_bytes / (1024 * 1024), f = m, T = f + N;
    return m = T, {
      number: s + 1,
      name: x.name,
      path: x.path,
      start_mib: f,
      end_mib: T,
      size_bytes: x.size_bytes,
      fstype: x.fstype,
      fstype_label: x.fstype_label,
      mountpoint: x.mountpoint,
      flags: [],
      is_boot: !1,
      label: null,
      used_percent: g?.percent ?? null,
      used_bytes: g?.used ?? null,
      free_bytes: g?.free ?? null,
      is_mounted: !!x.mountpoint
    };
  }), h = o.size_bytes / (1024 * 1024), C = [];
  return m < h - 1 && C.push({ start_mib: m, end_mib: h, size_mib: h - m }), {
    disk: a,
    is_system_disk: o.is_system_disk,
    size_bytes: o.size_bytes,
    model: o.model,
    partition_table: void 0,
    disk_state: c.length ? "partitioned" : "uninitialized",
    partitions: b,
    unallocated: C
  };
}
function qn(a) {
  const i = a instanceof Error ? a.message : String(a), n = i.toLowerCase();
  return n.includes("could not resolve partition number") || n.includes("confirmation must match") ? !1 : i === "Not Found" || i.includes("API route not found") || n.includes("service unavailable") || n.includes("parted") && n.includes("not found");
}
function Qn(a) {
  return a.label ? a.label : a.mountpoint ? a.mountpoint : a.name ? a.name : `#${a.number}`;
}
function Xn({
  disks: a,
  volumes: i,
  language: n,
  isDark: o,
  actionLoading: c,
  actionErr: m,
  formatBytes: b,
  fetchJson: h,
  runAction: C,
  postJson: x,
  tr: s
}) {
  const [g, N] = p(""), [f, T] = p(null), [k, _] = p(!1), [L, E] = p(null), [j, M] = p(null), [v, A] = p(null), [O, F] = p("1MiB"), [G, ee] = p("100%"), [U, P] = p("linux"), [te, ae] = p("gpt"), [pe, ue] = p(""), [be, he] = p(""), [ie, _e] = p("ext4"), [q, Ye] = p(""), [Se, Pe] = p(""), [Ee, Ze] = p("100%"), [Je, ht] = p(!0), [et, tt] = p(!0), [Te, Be] = p(""), [Ne, Ie] = p(""), [Me, at] = p(""), [ze, nt] = p(""), [Re, rt] = p(""), [Ve, Ge] = p("/mnt/data"), [gt, lt] = p("ntfs"), [xt, Q] = p(!0), st = Kt(null), [ne, Oe] = p([]), [We, St] = p([]), [ot, He] = p(!1), [De, de] = p(null), Y = K((d) => {
    Oe((y) => [...y, { ...d, id: Un() }]), de(null), A(null);
  }, []), Pt = K((d) => {
    Oe((y) => y.filter((R) => R.id !== d)), de(null);
  }, []), ft = K(() => {
    Oe([]), de(null);
  }, []), Tt = K(async () => {
    if (ne.length !== 0) {
      He(!0), de(null);
      try {
        const d = await x(
          "/api/storage_manager/operations/validate",
          { operations: ne.map(ua) }
        );
        de(
          d.valid ? `${s.queue.validationOk} — ${d.summary}` : `${s.queue.validationFailed} — ${d.summary}`
        );
      } catch (d) {
        de(d instanceof Error ? d.message : String(d));
      } finally {
        He(!1);
      }
    }
  }, [ne, x, s.queue.validationFailed, s.queue.validationOk]), it = K((d) => {
    he(d);
    const y = f?.unallocated?.[0];
    y ? (F(`${Math.ceil(y.start_mib)}MiB`), ee(`${Math.floor(y.end_mib)}MiB`)) : (F("1MiB"), ee("100%"));
  }, [a, f]);
  Le(() => {
    !g && a.length > 0 && N(a[0].name);
  }, [a, g]);
  const Ae = K(async (d) => {
    if (d) {
      if (_(!0), E(null), st.current === !1) {
        const y = Ht(d, a, i);
        T(y ?? null), y || E("Failed to load layout"), _(!1);
        return;
      }
      try {
        const y = await h(
          `/api/storage_manager/disks/${encodeURIComponent(d)}/partitions`
        );
        st.current = !0;
        const R = a.find((Ue) => Ue.name === d), I = (y.partitions?.length ?? 0) === 0, mt = (R?.partitions?.length ?? 0) > 0;
        if (I && mt) {
          const Ue = Ht(d, a, i);
          T(Ue ?? y);
        } else
          T(y);
      } catch (y) {
        if (qn(y)) {
          st.current = !1;
          const R = Ht(d, a, i);
          if (R) {
            T(R);
            return;
          }
        }
        T(null), E(y instanceof Error ? y.message : "Failed to load layout");
      } finally {
        _(!1);
      }
    }
  }, [h, a, i]);
  Le(() => {
    g && (M(null), Ae(g));
  }, [g, Ae]);
  const u = fe(
    () => f?.partitions.find((d) => d.path === j) ?? null,
    [f, j]
  ), je = fe(
    () => a.find((d) => d.name === g),
    [a, g]
  ), H = f && !f.is_system_disk, dt = f?.disk_state ?? (!f?.partition_table && !f?.partitions?.length ? "uninitialized" : f?.partitions?.length ? "partitioned" : "empty_table"), ce = dt === "uninitialized", Mt = dt === "empty_table", ct = H && !ce, ge = !!(u?.path && u?.name), re = (d) => {
    if (d === "initDisk") {
      if (!H) return;
      ue(""), ae("gpt"), A(d);
      return;
    }
    if (!(!H && d !== "mount" && d !== "unmount") && !(d === "create" && ce) && !(d !== "create" && !ge) && (A(d), u?.name && (Pe(""), nt(""), Be(""), at(""), rt(""), Ze("100%"), Ie(u.label || "")), d === "create" && (it(g), P("linux")), d === "mount" && u)) {
      const y = u.fstype || "ntfs";
      lt(Wt.some((I) => I.value === y) ? y : "ntfs");
      const R = u.name || u.path?.replace("/dev/", "") || "data";
      Ge(`/mnt/${R}`), Q(!1);
    }
  }, le = () => A(null), vt = K((d, y) => {
    !H || ce || (F(`${Math.ceil(d)}MiB`), ee(`${Math.floor(y)}MiB`), he(g), P("linux"), A("create"));
  }, [g, H, ce]), zt = K((d, y) => {
    if (!d.name || !d.path) return;
    const R = d.end_mib ?? 0, I = y < R - 0.5;
    Y({
      op: "resize",
      device: d.path,
      confirm_token: d.name,
      params: {
        end: `${y}MiB`,
        grow_filesystem: !I,
        shrink_filesystem: I
      },
      summary: I ? `${s.shrinkPartition}: ${d.name} → ${y}MiB` : `${s.resizePartition}: ${d.name} → ${y}MiB`
    }), M(d.path);
  }, [Y, s.resizePartition, s.shrinkPartition]), Ke = K(async () => {
    if (ne.length !== 0) {
      He(!0), de(null);
      try {
        const d = await x("/api/storage_manager/operations/apply", {
          operations: ne.map(ua)
        });
        St(
          (d.log || []).map((y) => ({
            index: y.index,
            op: y.op,
            status: y.status === "success" ? "success" : "failed",
            preview: y.preview,
            message: y.message
          }))
        ), d.completed ? (Oe([]), de(s.queue.validationOk), await Ae(g)) : de(
          `${s.queue.validationFailed} — ${d.applied}/${ne.length}`
        );
      } catch (d) {
        de(d instanceof Error ? d.message : String(d));
      } finally {
        He(!1);
      }
    }
  }, [g, Ae, ne, x, s.queue.validationFailed, s.queue.validationOk]), Rt = fe(() => v ? {
    initDisk: s.initializeDiskTitle,
    create: s.createPartition,
    format: s.formatPartition,
    delete: s.deletePartition,
    resize: s.resizePartition,
    label: s.changeLabel,
    boot: s.setBoot,
    mount: s.mountVolume,
    unmount: s.unmountVolume
  }[v] : void 0, [v, s]), se = async (d) => {
    await C(async () => {
      const R = await d();
      return await Ae(g), R;
    }) && le();
  }, At = fe(() => {
    if (!f || !f.size_bytes) return [];
    const d = f.size_bytes, y = [];
    for (const R of f.partitions) {
      const I = R.size_bytes || 0;
      y.push({
        key: R.path || `p${R.number}`,
        kind: "part",
        start: R.start_mib ?? 0,
        widthPct: Math.max(0.5, I / d * 100),
        part: R,
        label: Qn(R)
      });
    }
    for (const R of f.unallocated || []) {
      const I = R.size_mib * 1024 * 1024;
      y.push({
        key: `free-${R.start_mib}`,
        kind: "free",
        start: R.start_mib,
        widthPct: Math.max(0.5, I / d * 100),
        gap: R,
        label: ce ? s.rawDiskLabel : s.unallocated
      });
    }
    return y.sort((R, I) => R.start - I.start);
  }, [f, s.unallocated, s.rawDiskLabel, ce]), D = (d, y, R, I, mt) => /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      disabled: I || c,
      onClick: R,
      className: `flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[11px] font-medium transition ${I ? o ? "cursor-not-allowed opacity-40 text-slate-500" : "cursor-not-allowed opacity-40 text-slate-400" : mt ? o ? "text-red-300 hover:bg-red-950/40" : "text-red-600 hover:bg-red-50" : o ? "text-slate-200 hover:bg-slate-800/70" : "text-slate-700 hover:bg-black/[0.04]"}`,
      children: [
        d,
        /* @__PURE__ */ e("span", { children: y })
      ]
    }
  );
  return a.length === 0 ? /* @__PURE__ */ e("p", { className: `p-8 text-center text-xs ${o ? "text-slate-500" : "text-slate-400"}`, children: s.noDisks }) : /* @__PURE__ */ r("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ e("div", { className: `shrink-0 border-b px-3 py-2 ${o ? "border-slate-800 bg-slate-950/30" : "border-slate-200/90 bg-[#ececf0]/50"}`, children: /* @__PURE__ */ e("div", { className: `inline-flex max-w-full flex-wrap gap-0.5 rounded-lg p-0.5 ${o ? "bg-slate-900/80" : "bg-black/[0.06]"}`, children: a.map((d) => {
      const y = d.name === g;
      return /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => N(d.name),
          className: `rounded-md px-3 py-1.5 text-[11px] font-medium transition ${y ? o ? "bg-slate-700 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm" : o ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"}`,
          children: [
            /* @__PURE__ */ e("span", { className: "font-mono font-semibold", children: d.name }),
            /* @__PURE__ */ e("span", { className: "ml-1.5 font-normal opacity-70", children: b(d.size_bytes, n) }),
            d.is_system_disk && /* @__PURE__ */ e("span", { className: `ml-1 rounded px-1 text-[9px] ${y ? o ? "bg-white/15" : "bg-slate-100" : o ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"}`, children: s.systemDisk })
          ]
        },
        d.name
      );
    }) }) }),
    /* @__PURE__ */ r("div", { className: "flex min-h-0 flex-1 flex-col lg:flex-row", children: [
      /* @__PURE__ */ r("aside", { className: `w-full shrink-0 space-y-0.5 border-b p-2 lg:w-44 lg:border-b-0 lg:border-r xl:w-48 ${o ? "border-slate-800 bg-slate-950/25" : "border-slate-200/90 bg-[#ececf0]/40"}`, children: [
        /* @__PURE__ */ e("p", { className: `text-[10px] font-bold uppercase tracking-wider mb-2 ${o ? "text-slate-500" : "text-slate-400"}`, children: s.diskOperations }),
        D(
          /* @__PURE__ */ e($.HardDrive, { className: "w-3.5 h-3.5" }),
          s.initializeDisk,
          () => re("initDisk"),
          !H || dt === "partitioned",
          !1
        ),
        /* @__PURE__ */ e("p", { className: `text-[10px] font-bold uppercase tracking-wider mb-2 mt-3 pt-2 border-t ${o ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-200"}`, children: s.operations }),
        D(/* @__PURE__ */ e($.Plus, { className: "w-3.5 h-3.5" }), s.createPartition, () => re("create"), !ct),
        D(/* @__PURE__ */ e($.Eraser, { className: "w-3.5 h-3.5" }), s.formatPartition, () => re("format"), !H || !ge || u?.is_mounted),
        D(/* @__PURE__ */ e($.Trash2, { className: "w-3.5 h-3.5" }), s.deletePartition, () => re("delete"), !H || !ge || u?.is_mounted, !0),
        D(/* @__PURE__ */ e($.MoveHorizontal, { className: "w-3.5 h-3.5" }), s.resizePartition, () => re("resize"), !H || !ge),
        D(/* @__PURE__ */ e($.Tag, { className: "w-3.5 h-3.5" }), s.changeLabel, () => re("label"), !H || !ge || !u?.fstype),
        D(/* @__PURE__ */ e($.Flag, { className: "w-3.5 h-3.5" }), s.setBoot, () => re("boot"), !H || !ge),
        D(/* @__PURE__ */ e($.FolderOpen, { className: "w-3.5 h-3.5" }), s.mountVolume, () => re("mount"), !ge || u?.is_mounted || u?.mountable === !1),
        D(/* @__PURE__ */ e($.FolderMinus, { className: "w-3.5 h-3.5" }), s.unmountVolume, () => re("unmount"), !ge || !u?.is_mounted),
        f?.is_system_disk && /* @__PURE__ */ e("p", { className: `text-[10px] mt-3 px-1 ${o ? "text-amber-400/80" : "text-amber-700"}`, children: s.protectedNote })
      ] }),
      /* @__PURE__ */ r("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: [
        /* @__PURE__ */ r("div", { className: `shrink-0 border-b p-3 ${o ? "border-slate-800" : "border-slate-200/90"}`, children: [
          /* @__PURE__ */ r("div", { className: "flex items-center justify-between gap-2 mb-3", children: [
            /* @__PURE__ */ e("p", { className: `text-[10px] font-bold uppercase tracking-wider ${o ? "text-slate-500" : "text-slate-400"}`, children: s.diskMap }),
            je && /* @__PURE__ */ r("span", { className: `text-[10px] truncate ${o ? "text-slate-400" : "text-slate-500"}`, children: [
              je.model,
              " · ",
              ce ? s.rawDiskLabel : f?.partition_table?.toUpperCase() || "—"
            ] })
          ] }),
          !k && !L && ce && /* @__PURE__ */ r("div", { className: `mb-3 rounded-xl border px-3 py-2.5 text-[11px] leading-relaxed ${o ? "border-amber-500/40 bg-amber-950/30 text-amber-100" : "border-amber-200 bg-amber-50 text-amber-900"}`, children: [
            /* @__PURE__ */ e("p", { className: "font-bold", children: s.uninitializedBanner }),
            /* @__PURE__ */ e("p", { className: "opacity-90 mt-1", children: s.uninitializedStep })
          ] }),
          !k && !L && Mt && /* @__PURE__ */ e("div", { className: `mb-3 rounded-xl border px-3 py-2.5 text-[11px] ${o ? "border-cyan-500/30 bg-cyan-950/20 text-cyan-100" : "border-cyan-200 bg-cyan-50 text-cyan-900"}`, children: s.emptyTableStep }),
          k ? /* @__PURE__ */ e("p", { className: `text-xs ${o ? "text-slate-500" : "text-slate-400"}`, children: s.loadingLayout }) : L ? /* @__PURE__ */ e("p", { className: "text-xs text-red-500", children: L }) : f && /* @__PURE__ */ e(
            Kn,
            {
              layout: f,
              mapSegments: At,
              selectedPath: j,
              canMutate: !!H,
              canCreatePartition: !!ct,
              isUninitialized: ce,
              isDark: o,
              formatBytes: b,
              language: n,
              diskPath: je?.path || `/dev/${g}`,
              tr: {
                unallocated: s.unallocated,
                rawDiskLabel: s.rawDiskLabel,
                dragResizeHint: s.dragResizeHint,
                extendPreview: s.extendPreview,
                shrinkPreview: s.shrinkPreview
              },
              onSelectPartition: M,
              onClickFree: vt,
              onDragResizeEnd: zt
            }
          )
        ] }),
        /* @__PURE__ */ r("div", { className: "min-h-0 flex-1 overflow-auto", children: [
          /* @__PURE__ */ e("p", { className: `px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider ${o ? "text-slate-500" : "text-slate-400"}`, children: s.partitionList }),
          /* @__PURE__ */ r("table", { className: "w-full text-left text-xs", children: [
            /* @__PURE__ */ e("thead", { className: `sticky top-0 z-10 uppercase tracking-wider text-[10px] font-bold ${o ? "bg-slate-900 text-slate-400" : "bg-[#f5f5f7] text-slate-500"}`, children: /* @__PURE__ */ r("tr", { children: [
              /* @__PURE__ */ e("th", { className: "p-2 pl-4", children: "#" }),
              /* @__PURE__ */ e("th", { className: "p-2", children: s.capacity }),
              /* @__PURE__ */ e("th", { className: "p-2", children: s.unused }),
              /* @__PURE__ */ e("th", { className: "p-2", children: "FS" }),
              /* @__PURE__ */ e("th", { className: "p-2", children: s.type }),
              /* @__PURE__ */ e("th", { className: "p-2", children: s.status })
            ] }) }),
            /* @__PURE__ */ e("tbody", { className: `divide-y ${o ? "divide-slate-800" : "divide-slate-100"}`, children: (f?.partitions || []).map((d) => {
              const y = d.path === j, R = d.used_percent;
              return /* @__PURE__ */ r(
                "tr",
                {
                  onClick: () => M(d.path || null),
                  className: `cursor-pointer transition ${y ? o ? "bg-cyan-950/40" : "bg-cyan-50" : o ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`,
                  children: [
                    /* @__PURE__ */ r("td", { className: "p-2 pl-4 font-mono font-bold", children: [
                      d.label || d.name || d.number,
                      d.mountpoint && /* @__PURE__ */ e("span", { className: `block text-[9px] font-normal ${o ? "text-slate-500" : "text-slate-400"}`, children: d.mountpoint })
                    ] }),
                    /* @__PURE__ */ e("td", { className: "p-2 font-mono", children: b(d.size_bytes || 0, n) }),
                    /* @__PURE__ */ e("td", { className: "p-2", children: R != null ? /* @__PURE__ */ r("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e("div", { className: `w-16 h-1.5 rounded-full overflow-hidden ${o ? "bg-slate-800" : "bg-slate-200"}`, children: /* @__PURE__ */ e("div", { className: "h-full bg-cyan-500 rounded-full", style: { width: `${100 - R}%` } }) }),
                      /* @__PURE__ */ r("span", { className: "font-mono text-[10px]", children: [
                        100 - R,
                        "%"
                      ] })
                    ] }) : "—" }),
                    /* @__PURE__ */ e("td", { className: "p-2", children: d.fstype_label || d.fstype || "—" }),
                    /* @__PURE__ */ r("td", { className: "p-2 text-[10px]", children: [
                      (d.flags || []).join(", ") || "—",
                      d.is_boot && /* @__PURE__ */ e("span", { className: "ml-1 text-amber-500", children: s.boot })
                    ] }),
                    /* @__PURE__ */ e("td", { className: "p-2", children: /* @__PURE__ */ e("span", { className: `text-[10px] px-1.5 py-0.5 rounded border font-bold ${d.is_mounted ? o ? "border-emerald-500/30 text-emerald-400" : "border-emerald-200 text-emerald-700" : o ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`, children: d.is_mounted ? s.mounted : s.unmounted }) })
                  ]
                },
                d.path || d.number
              );
            }) })
          ] }),
          !k && (f?.partitions.length || 0) === 0 && /* @__PURE__ */ e("p", { className: `p-4 text-xs ${o ? "text-slate-500" : "text-slate-400"}`, children: s.selectPartition })
        ] }),
        u && /* @__PURE__ */ r("div", { className: `grid shrink-0 grid-cols-2 gap-2 border-t px-3 py-2 text-[11px] md:grid-cols-4 ${o ? "border-slate-800 bg-slate-950/30" : "border-slate-200/90 bg-[#ececf0]/30"}`, children: [
          /* @__PURE__ */ r("div", { children: [
            /* @__PURE__ */ r("span", { className: "opacity-60", children: [
              s.properties,
              ":"
            ] }),
            " ",
            /* @__PURE__ */ e("span", { className: "font-mono", children: u.path })
          ] }),
          /* @__PURE__ */ r("div", { children: [
            /* @__PURE__ */ r("span", { className: "opacity-60", children: [
              s.partitionTable,
              ":"
            ] }),
            " ",
            f?.partition_table || "—"
          ] }),
          /* @__PURE__ */ r("div", { children: [
            /* @__PURE__ */ r("span", { className: "opacity-60", children: [
              s.capacity,
              ":"
            ] }),
            " ",
            b(u.size_bytes || 0, n)
          ] }),
          /* @__PURE__ */ r("div", { children: [
            /* @__PURE__ */ e("span", { className: "opacity-60", children: "Label:" }),
            " ",
            u.label || "—"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e(
        Gn,
        {
          queue: ne,
          log: We,
          isDark: o,
          busy: ot || c,
          validationSummary: De,
          tr: s.queue,
          onRemove: Pt,
          onClear: ft,
          onValidate: Tt,
          onApply: Ke
        }
      )
    ] }),
    /* @__PURE__ */ e(Vn, { open: !!v, onClose: le, title: Rt, maxWidth: "md", children: /* @__PURE__ */ r("div", { className: "space-y-4 p-5 max-h-[70vh] overflow-y-auto text-sm", children: [
      v === "initDisk" && /* @__PURE__ */ r(J, { children: [
        /* @__PURE__ */ e("p", { className: "text-[11px] opacity-70", children: s.initializeDiskHint }),
        /* @__PURE__ */ r("p", { className: "text-[11px] font-mono", children: [
          je?.path,
          " · ",
          b(f?.size_bytes || 0, n)
        ] }),
        /* @__PURE__ */ e("p", { className: "text-[11px] text-red-500", children: s.initWipeWarning }),
        /* @__PURE__ */ r("fieldset", { className: "space-y-2 text-[11px]", children: [
          /* @__PURE__ */ r("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ e("input", { type: "radio", name: "tableType", checked: te === "gpt", onChange: () => ae("gpt") }),
            s.tableGpt
          ] }),
          /* @__PURE__ */ r("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ e("input", { type: "radio", name: "tableType", checked: te === "msdos", onChange: () => ae("msdos") }),
            s.tableMbr
          ] })
        ] }),
        /* @__PURE__ */ r("label", { className: "block text-[11px] space-y-1", children: [
          s.confirmDiskName,
          /* @__PURE__ */ e("input", { value: pe, onChange: (d) => ue(d.target.value), placeholder: g, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` })
        ] }),
        g && /* @__PURE__ */ r("p", { className: "text-[10px] opacity-60 font-mono", children: [
          n === "vi" ? "Gõ:" : "Type:",
          " ",
          g
        ] }),
        m && /* @__PURE__ */ e("p", { className: "text-[11px] text-red-500 whitespace-pre-wrap", children: m }),
        /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: le, className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-slate-700" : "border-slate-200"}`, children: s.cancel }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || pe.trim() !== g,
              onClick: () => Y({
                op: "initialize",
                disk_name: g,
                confirm_token: pe.trim(),
                params: { table_type: te },
                summary: `${s.initializeDisk}: ${g} (${te.toUpperCase()})`
              }),
              className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-amber-700 text-amber-300" : "border-amber-300 text-amber-800"}`,
              children: s.addToQueue
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || pe.trim() !== g,
              onClick: () => se(() => x(`/api/storage_manager/disks/${encodeURIComponent(g)}/initialize`, {
                disk_name: g,
                table_type: te,
                confirm_token: pe.trim()
              })),
              className: "flex-1 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white disabled:opacity-50",
              children: s.runAction
            }
          )
        ] })
      ] }),
      v === "create" && /* @__PURE__ */ r(J, { children: [
        /* @__PURE__ */ e("h3", { className: "font-bold", children: s.createPartition }),
        /* @__PURE__ */ r("p", { className: "text-[11px] opacity-70", children: [
          s.selectDisk,
          ": ",
          /* @__PURE__ */ e("span", { className: "font-mono", children: g })
        ] }),
        /* @__PURE__ */ r("label", { className: "block text-[11px] space-y-1", children: [
          s.start,
          /* @__PURE__ */ e("input", { value: O, onChange: (d) => F(d.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` })
        ] }),
        /* @__PURE__ */ r("label", { className: "block text-[11px] space-y-1", children: [
          s.end,
          /* @__PURE__ */ e("input", { value: G, onChange: (d) => ee(d.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` })
        ] }),
        /* @__PURE__ */ r("label", { className: "block text-[11px] space-y-1", children: [
          s.partitionType,
          /* @__PURE__ */ e(
            "select",
            {
              value: U,
              onChange: (d) => P(d.target.value),
              className: `w-full rounded-lg border px-3 py-2 text-xs ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}`,
              children: ba.map((d) => /* @__PURE__ */ e("option", { value: d.value, children: s[d.labelKey] }, d.value))
            }
          )
        ] }),
        /* @__PURE__ */ r("label", { className: "block text-[11px] space-y-1", children: [
          s.confirmDiskName,
          /* @__PURE__ */ e("input", { value: be, onChange: (d) => he(d.target.value), placeholder: g, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` })
        ] }),
        /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: le, className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-slate-700" : "border-slate-200"}`, children: s.cancel }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || be !== g,
              onClick: () => Y({
                op: "create",
                disk_name: g,
                confirm_token: be,
                params: { start: O, end: G, partition_type: U },
                summary: `${s.createPartition}: ${g} ${s[ba.find((d) => d.value === U)?.labelKey || "typeLinux"]} (${O} → ${G})`
              }),
              className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-cyan-700 text-cyan-300" : "border-cyan-300 text-cyan-800"}`,
              children: s.addToQueue
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || be !== g,
              onClick: () => se(() => x("/api/storage_manager/partitions/create", {
                disk_name: g,
                start: O,
                end: G,
                partition_type: U,
                initialize_gpt: !1,
                confirm_token: be
              })),
              className: "flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50",
              children: s.runAction
            }
          )
        ] })
      ] }),
      v === "format" && u && /* @__PURE__ */ r(J, { children: [
        /* @__PURE__ */ e("h3", { className: "font-bold", children: s.formatPartition }),
        /* @__PURE__ */ e("p", { className: "text-[11px] text-red-500", children: s.dataLossWarning }),
        /* @__PURE__ */ e("p", { className: "text-[11px] font-mono", children: u.path }),
        /* @__PURE__ */ e("select", { value: ie, onChange: (d) => _e(d.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}`, children: Wt.map((d) => /* @__PURE__ */ e("option", { value: d.value, children: d.label }, d.value)) }),
        /* @__PURE__ */ e("input", { value: q, onChange: (d) => Ye(d.target.value), placeholder: s.labelOptional, className: `w-full rounded-lg border px-3 py-2 text-xs ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` }),
        /* @__PURE__ */ e("input", { value: Se, onChange: (d) => Pe(d.target.value), placeholder: s.confirmPartName, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` }),
        /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: le, className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-slate-700" : "border-slate-200"}`, children: s.cancel }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || Se !== u.name,
              onClick: () => Y({
                op: "format",
                device: u.path,
                confirm_token: Se,
                params: { fstype: ie, label: q || void 0 },
                summary: `${s.formatPartition}: ${u.name} → ${ie}`
              }),
              className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-red-800 text-red-300" : "border-red-300 text-red-800"}`,
              children: s.addToQueue
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || Se !== u.name,
              onClick: () => se(() => x("/api/storage_manager/format", {
                device: u.path,
                fstype: ie,
                label: q || void 0,
                confirm_token: Se
              })),
              className: "flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 text-white disabled:opacity-50",
              children: s.runAction
            }
          )
        ] })
      ] }),
      v === "delete" && u && /* @__PURE__ */ r(J, { children: [
        /* @__PURE__ */ e("h3", { className: "font-bold text-red-500", children: s.deletePartition }),
        /* @__PURE__ */ e("p", { className: "text-[11px]", children: s.deleteWarning }),
        /* @__PURE__ */ e("p", { className: "text-[11px] font-mono", children: u.path }),
        /* @__PURE__ */ e("input", { value: ze, onChange: (d) => nt(d.target.value), placeholder: s.confirmPartName, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` }),
        u.name && /* @__PURE__ */ r("p", { className: "text-[10px] opacity-60 font-mono", children: [
          n === "vi" ? "Gõ:" : "Type:",
          " ",
          u.name
        ] }),
        m && /* @__PURE__ */ e("p", { className: "text-[11px] text-red-500 whitespace-pre-wrap", children: m }),
        /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: le, className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-slate-700" : "border-slate-200"}`, children: s.cancel }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || ze.trim() !== (u.name || ""),
              onClick: () => Y({
                op: "delete",
                device: u.path,
                confirm_token: ze.trim(),
                params: { partition_number: u.number || null },
                summary: `${s.deletePartition}: ${u.name}`
              }),
              className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-red-800 text-red-300" : "border-red-300 text-red-800"}`,
              children: s.addToQueue
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || ze.trim() !== (u.name || ""),
              onClick: () => se(() => x("/api/storage_manager/partitions/delete", {
                device: u.path,
                confirm_token: ze.trim(),
                partition_number: u.number || null
              })),
              className: "flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 text-white disabled:opacity-50",
              children: s.runAction
            }
          )
        ] })
      ] }),
      v === "resize" && u && /* @__PURE__ */ r(J, { children: [
        /* @__PURE__ */ e("h3", { className: "font-bold", children: s.resizePartition }),
        /* @__PURE__ */ e("p", { className: "text-[11px] opacity-70", children: s.resizeHint }),
        /* @__PURE__ */ e("p", { className: "text-[11px] font-mono", children: u.path }),
        /* @__PURE__ */ r("label", { className: "block text-[11px] space-y-1", children: [
          s.end,
          /* @__PURE__ */ e("input", { value: Ee, onChange: (d) => Ze(d.target.value), placeholder: "100%", className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` })
        ] }),
        /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-[11px]", children: [
          /* @__PURE__ */ e("input", { type: "checkbox", checked: Je, onChange: (d) => ht(d.target.checked) }),
          s.growFilesystem
        ] }),
        /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-[11px]", children: [
          /* @__PURE__ */ e("input", { type: "checkbox", checked: et, onChange: (d) => tt(d.target.checked) }),
          s.shrinkFilesystem
        ] }),
        /* @__PURE__ */ e("p", { className: "text-[10px] opacity-60", children: s.shrinkHint }),
        /* @__PURE__ */ e("input", { value: Te, onChange: (d) => Be(d.target.value), placeholder: s.confirmPartName, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` }),
        /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: le, className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-slate-700" : "border-slate-200"}`, children: s.cancel }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || Te !== u.name,
              onClick: () => Y({
                op: "resize",
                device: u.path,
                confirm_token: Te,
                params: { end: Ee, grow_filesystem: Je, shrink_filesystem: et },
                summary: `${s.resizePartition}: ${u.name} → ${Ee}`
              }),
              className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-cyan-700 text-cyan-300" : "border-cyan-300 text-cyan-800"}`,
              children: s.addToQueue
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || Te !== u.name,
              onClick: () => se(() => x("/api/storage_manager/partitions/resize", {
                device: u.path,
                end: Ee,
                grow_filesystem: Je,
                shrink_filesystem: et,
                confirm_token: Te
              })),
              className: "flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50",
              children: s.runAction
            }
          )
        ] })
      ] }),
      v === "label" && u && /* @__PURE__ */ r(J, { children: [
        /* @__PURE__ */ e("h3", { className: "font-bold", children: s.changeLabel }),
        /* @__PURE__ */ e("p", { className: "text-[11px] font-mono", children: u.path }),
        /* @__PURE__ */ e("input", { value: Ne, onChange: (d) => Ie(d.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` }),
        /* @__PURE__ */ e("input", { value: Me, onChange: (d) => at(d.target.value), placeholder: s.confirmPartName, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` }),
        /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: le, className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-slate-700" : "border-slate-200"}`, children: s.cancel }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || Me !== u.name || !Ne.trim(),
              onClick: () => Y({
                op: "label",
                device: u.path,
                confirm_token: Me,
                params: { label: Ne.trim() },
                summary: `${s.changeLabel}: ${u.name} → ${Ne.trim()}`
              }),
              className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-cyan-700 text-cyan-300" : "border-cyan-300 text-cyan-800"}`,
              children: s.addToQueue
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || Me !== u.name || !Ne.trim(),
              onClick: () => se(() => x("/api/storage_manager/partitions/label", {
                device: u.path,
                label: Ne.trim(),
                confirm_token: Me
              })),
              className: "flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50",
              children: s.runAction
            }
          )
        ] })
      ] }),
      v === "boot" && u && /* @__PURE__ */ r(J, { children: [
        /* @__PURE__ */ e("h3", { className: "font-bold", children: s.setBoot }),
        /* @__PURE__ */ e("p", { className: "text-[11px] font-mono", children: u.path }),
        /* @__PURE__ */ e("p", { className: "text-[10px] opacity-70", children: n === "vi" ? "GPT: FAT32 → EFI (esp), ext4/xfs/btrfs → legacy_boot. exFAT/NTFS không hỗ trợ." : "GPT: FAT32 → EFI (esp), ext4/xfs/btrfs → legacy_boot. exFAT/NTFS not supported." }),
        /* @__PURE__ */ e("input", { value: Re, onChange: (d) => rt(d.target.value), placeholder: s.confirmPartName, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` }),
        u.name && /* @__PURE__ */ r("p", { className: "text-[10px] opacity-60 font-mono", children: [
          n === "vi" ? "Gõ:" : "Type:",
          " ",
          u.name
        ] }),
        m && /* @__PURE__ */ e("p", { className: "text-[11px] text-red-500 whitespace-pre-wrap", children: m }),
        /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: le, className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-slate-700" : "border-slate-200"}`, children: s.cancel }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || Re.trim() !== (u.name || ""),
              onClick: () => Y({
                op: "set_boot",
                device: u.path,
                confirm_token: Re.trim(),
                params: { active: !0, partition_number: u.number || null },
                summary: `${s.setBoot}: ${u.name}`
              }),
              className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-cyan-700 text-cyan-300" : "border-cyan-300 text-cyan-800"}`,
              children: s.addToQueue
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || Re.trim() !== (u.name || ""),
              onClick: () => se(() => x("/api/storage_manager/partitions/boot", {
                device: u.path,
                active: !0,
                confirm_token: Re.trim(),
                partition_number: u.number || null
              })),
              className: "flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50",
              children: s.runAction
            }
          )
        ] })
      ] }),
      v === "mount" && u && /* @__PURE__ */ r(J, { children: [
        /* @__PURE__ */ e("h3", { className: "font-bold", children: s.mountVolume }),
        /* @__PURE__ */ e("p", { className: "text-[11px] font-mono", children: u.path }),
        u.parttype_label && !u.fstype && /* @__PURE__ */ r("p", { className: "text-[11px] text-amber-600 dark:text-amber-400", children: [
          u.parttype_label,
          n === "vi" ? " — chọn NTFS/exFAT bên dưới. Nếu ổ trống, Format trước rồi Mount." : " — pick NTFS/exFAT below. If empty, Format first, then Mount."
        ] }),
        m && /* @__PURE__ */ e("p", { className: "text-[11px] text-red-500 whitespace-pre-wrap", children: m }),
        /* @__PURE__ */ r("label", { className: "block text-[11px] space-y-1", children: [
          n === "vi" ? "Loại filesystem" : "Filesystem type",
          /* @__PURE__ */ e(
            "select",
            {
              value: gt,
              onChange: (d) => lt(d.target.value),
              className: `w-full rounded-lg border px-3 py-2 text-xs ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}`,
              children: Wt.map((d) => /* @__PURE__ */ e("option", { value: d.value, children: d.label }, d.value))
            }
          )
        ] }),
        /* @__PURE__ */ e("input", { value: Ve, onChange: (d) => Ge(d.target.value), placeholder: s.mountpoint, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${o ? "bg-slate-950 border-slate-700" : "border-slate-200"}` }),
        /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-[11px]", children: [
          /* @__PURE__ */ e("input", { type: "checkbox", checked: xt, onChange: (d) => Q(d.target.checked) }),
          s.persistFstab
        ] }),
        /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: le, className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-slate-700" : "border-slate-200"}`, children: s.cancel }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c || !Ve.trim() || !Ve.trim().startsWith("/"),
              onClick: () => se(() => x("/api/storage_manager/mount", {
                device: u.path,
                mountpoint: Ve.trim(),
                fstype: gt,
                options: "defaults",
                persist_fstab: xt
              })),
              className: "flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50",
              children: s.runAction
            }
          )
        ] })
      ] }),
      v === "unmount" && u?.mountpoint && /* @__PURE__ */ r(J, { children: [
        /* @__PURE__ */ e("h3", { className: "font-bold", children: s.unmountVolume }),
        /* @__PURE__ */ e("p", { className: "text-[11px] font-mono", children: u.mountpoint }),
        /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: le, className: `flex-1 py-2 rounded-xl text-xs font-bold border ${o ? "border-slate-700" : "border-slate-200"}`, children: s.cancel }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: c,
              onClick: () => se(() => x("/api/storage_manager/unmount", {
                mountpoint: u.mountpoint,
                remove_fstab: !1
              })),
              className: "flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50",
              children: s.runAction
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
function Yn(a) {
  return {
    panel: a ? "bg-slate-900 border-slate-700/80 text-slate-100" : "bg-[#f5f5f7] border-slate-200/90 text-slate-900",
    muted: a ? "text-slate-400" : "text-slate-500",
    hoverNav: a ? "hover:bg-slate-800/80" : "hover:bg-black/[0.04]",
    activeNav: a ? "bg-cyan-500/15 text-cyan-300 shadow-sm shadow-cyan-500/10" : "bg-white text-cyan-700 shadow-sm border border-slate-200/80",
    btn: a ? "border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-slate-200" : "border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700",
    btnPrimary: "bg-cyan-600 hover:bg-cyan-500 text-white border-transparent",
    surface: a ? "bg-slate-950/50 border-slate-800" : "bg-white border-slate-200/90 shadow-sm",
    section: a ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/90",
    headerBorder: a ? "border-slate-700/80" : "border-slate-200/90",
    sidebar: a ? "bg-slate-950/40 border-slate-800" : "bg-[#ececf0]/80 border-slate-200/90"
  };
}
const Sa = [
  { value: "ext4", label: "ext4 (Linux)" },
  { value: "xfs", label: "XFS (Linux)" },
  { value: "btrfs", label: "Btrfs (Linux)" },
  { value: "vfat", label: "FAT32 / VFAT" },
  { value: "exfat", label: "exFAT" },
  { value: "ntfs", label: "NTFS (Windows)" },
  { value: "hfsplus", label: "HFS+ (macOS)" }
], Zn = [
  ...Sa,
  { value: "apfs", label: "APFS (Apple, read-only)" }
];
function ha(a) {
  return a.fstype_label || a.fstype || "—";
}
function Jn(a, i) {
  if (a == null) return "—";
  const n = Math.floor(a / 24);
  return i === "vi" ? `${a.toLocaleString("vi-VN")} giờ (~${n.toLocaleString("vi-VN")} ngày)` : `${a.toLocaleString("en-US")} h (~${n.toLocaleString("en-US")} days)`;
}
function ga(a) {
  return a == null ? "—" : a >= 1024 ? `${(a / 1024).toFixed(2)} TB` : `${a.toFixed(2)} GB`;
}
function er(a) {
  return a == null ? "—" : `${a.toFixed(1)} MiB/s`;
}
const tr = ["/", "/boot", "/boot/efi", "/usr", "/var"], ar = [
  "/api/storage_manager/version",
  "/api/storage_manager/partitions/delete",
  "/api/storage_manager/partitions/create",
  "/api/storage_manager/disks/{disk_name}/initialize",
  "/api/storage_manager/format",
  "/api/storage_manager/mount",
  "/api/storage_manager/operations/validate",
  "/api/storage_manager/operations/apply"
];
function nr(a) {
  return !!(tr.includes(a) || a.startsWith("/opt/copanel"));
}
function xa(a, i) {
  const n = a.error;
  return n?.message ? n.message : typeof a.detail == "string" ? a.detail === "Not Found" ? "API route not found (404). Restart copanel service or reinstall the module from AppStore." : a.detail.toLowerCase().includes("filesystem type") ? `${a.detail} Format the partition first, then mount.` : a.detail : typeof a.message == "string" ? a.message : i === 404 ? "API route not found (404). Restart copanel service or reinstall the module from AppStore." : `HTTP ${i}`;
}
function xe(a, i) {
  if (!Number.isFinite(a) || a <= 0) return "0 B";
  const n = i === "vi" ? ["B", "KB", "MB", "GB", "TB", "PB"] : ["B", "KB", "MB", "GB", "TB", "PB"];
  let o = a, c = 0;
  for (; o >= 1024 && c < n.length - 1; )
    o /= 1024, c += 1;
  return `${o >= 100 || c === 0 ? o.toFixed(0) : o.toFixed(1)} ${n[c]}`;
}
function rr(a, i) {
  return a === "critical" ? {
    ring: i ? "border-red-500/40 bg-red-950/30" : "border-red-200 bg-red-50",
    icon: i ? "text-red-400" : "text-red-600",
    text: i ? "text-red-200" : "text-red-800",
    badge: "bg-red-500/15 border-red-500/30 text-red-500"
  } : a === "warning" ? {
    ring: i ? "border-amber-500/40 bg-amber-950/20" : "border-amber-200 bg-amber-50",
    icon: i ? "text-amber-400" : "text-amber-600",
    text: i ? "text-amber-100" : "text-amber-900",
    badge: "bg-amber-500/15 border-amber-500/30 text-amber-500"
  } : {
    ring: i ? "border-emerald-500/40 bg-emerald-950/20" : "border-emerald-200 bg-emerald-50",
    icon: i ? "text-emerald-400" : "text-emerald-600",
    text: i ? "text-emerald-100" : "text-emerald-900",
    badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-500"
  };
}
function lr(a, i) {
  const n = a?.status || "unknown";
  return n === "healthy" || a?.passed === !0 ? { label: "Healthy", cls: i ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-emerald-700 bg-emerald-50 border-emerald-200" } : n === "critical" || a?.passed === !1 ? { label: "Critical", cls: i ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-red-700 bg-red-50 border-red-200" } : { label: "Unknown", cls: i ? "text-slate-400 bg-slate-800/60 border-slate-700" : "text-slate-600 bg-slate-100 border-slate-200" };
}
function pr() {
  const { theme: a, language: i } = Ut(), n = a === "dark", o = localStorage.getItem("copanel_token"), [c, m] = p("disks"), [b, h] = p(!0), [C, x] = p(null), [s, g] = p(null), [N, f] = p([]), [T, k] = p([]), [_, L] = p(null), [E, j] = p([]), [M, v] = p(null), [A, O] = p(null), [F, G] = p(!1), [ee, U] = p(null), [P, te] = p(!1), [ae, pe] = p(""), [ue, be] = p("1MiB"), [he, ie] = p("100%"), [_e, q] = p(!1), [Ye, Se] = p(""), [Pe, Ee] = p(""), [Ze, Je] = p("ext4"), [ht, et] = p(""), [tt, Te] = p(""), [Be, Ne] = p(""), [Ie, Me] = p("/mnt/data"), [at, ze] = p("ext4"), [nt, Re] = p("defaults"), [rt, Ve] = p(!0), [Ge, gt] = p(""), [lt, xt] = p(!1), [Q, st] = p(null), [ne, Oe] = p("data-vg"), [We, St] = p([]), [ot, He] = p(""), [De, de] = p(""), [Y, Pt] = p("data-lv"), [ft, Tt] = p("100%FREE"), [it, Ae] = p(""), [u, je] = p(""), [H, dt] = p(""), [ce, Mt] = p("100%FREE"), [ct, ge] = p(!0), [re, le] = p(""), [vt, zt] = p(1), [Ke, Rt] = p([]), [se, At] = p(""), [D, d] = p(null), [y, R] = p([]), [I, mt] = p(""), [Ue, Pa] = p("short"), [Ft, Ta] = p(""), [Lt, Ma] = p(""), [yt, za] = p(""), [Et, Ra] = p(!1), [Bt, Aa] = p(""), [Fa, La] = p({}), [Ea, Xt] = p(null), [Ba, Ia] = p(null), [Va, wt] = p(null), [It, Ga] = p("quick"), l = {
    en: {
      title: "Storage Manager",
      desc: "Monitor physical drives, mounted volumes, and SMART disk health on this server.",
      overview: "Overview",
      disks: "Disks",
      volumes: "Volumes",
      healthy: "Healthy",
      warning: "Warning",
      critical: "Critical",
      systemHealthy: "System is healthy.",
      refresh: "Refresh",
      loading: "Loading storage data...",
      totalDisks: "Physical disks",
      totalVolumes: "Mounted volumes",
      totalCapacity: "Raw disk capacity",
      smartMonitored: "SMART monitored",
      volumeUsage: "Volume usage",
      noVolumes: "No mounted volumes detected.",
      noDisks: "No physical block devices found.",
      diskName: "Disk",
      model: "Model",
      size: "Size",
      transport: "Bus",
      health: "Health",
      systemDisk: "System",
      partitions: "Partitions",
      mount: "Mount",
      fstype: "Filesystem",
      used: "Used",
      free: "Free",
      temperature: "Temperature",
      powerOn: "Power-on hours",
      reallocated: "Reallocated sectors",
      smartMsg: "SMART message",
      toolsMissing: "Optional tools not installed on this server:",
      lsblk: "lsblk (util-linux)",
      smartctl: "smartmontools (smartctl)",
      parted: "parted",
      adminNote: "Destructive actions require superadmin. System disks and mounts (/ , /boot, CoPanel) are protected.",
      manage: "Manage",
      adminOnly: "Superadmin only",
      createPartition: "Create partition",
      formatPartition: "Format partition",
      mountVolume: "Mount volume",
      unmountVolume: "Unmount volume",
      selectDisk: "Select disk",
      selectPartition: "Select partition",
      selectMount: "Select mount point",
      start: "Start",
      end: "End",
      initGpt: "Initialize GPT on empty disk",
      confirmDiskName: "Type disk name to confirm",
      confirmPartName: "Type partition name to confirm",
      labelOptional: "Label (optional)",
      mountpoint: "Mount point",
      options: "Mount options",
      persistFstab: "Add to /etc/fstab",
      removeFstab: "Remove from /etc/fstab",
      runAction: "Run",
      fstabTitle: "/etc/fstab entries",
      dataLossWarning: "Formatting erases all data on the partition permanently.",
      success: "Success",
      noCandidateDisk: "No non-system disks available.",
      noCandidatePart: "No unmounted partitions on data disks.",
      pools: "Pools",
      lvmTitle: "LVM storage pools",
      raidTitle: "Software RAID (mdadm)",
      volumeGroups: "Volume groups",
      logicalVolumes: "Logical volumes",
      physicalVolumes: "Physical volumes",
      raidArrays: "RAID arrays",
      noVg: "No volume groups yet.",
      noLv: "No logical volumes yet.",
      noRaid: "No RAID arrays detected.",
      createVg: "Create volume group",
      createLv: "Create logical volume",
      extendLv: "Extend logical volume",
      createRaid: "Create RAID array",
      vgName: "Volume group name",
      lvName: "Logical volume name",
      lvSize: "Size (100G or 100%FREE)",
      selectDevices: "Select devices",
      raidLevel: "RAID level",
      confirmVgName: "Type VG name to confirm",
      confirmLvPath: "Type vg_name/lv_name to confirm",
      confirmRaid: "Type CREATE-RAID to confirm",
      growFilesystem: "Grow filesystem after extend",
      vgFree: "free",
      raidConfirmWarning: "Creating RAID will erase data on selected devices.",
      lvm: "lvm2",
      mdadm: "mdadm",
      maintenance: "Maintenance",
      maintenanceTitle: "Drive health checks & scrub",
      smartTest: "SMART self-test",
      smartShort: "Short test (~2 min)",
      smartLong: "Long test (hours)",
      btrfsScrub: "Btrfs scrub",
      raidCheck: "RAID parity check",
      runTest: "Start test",
      runScrub: "Start scrub",
      runRaidCheck: "Start check",
      maintenanceHistory: "Recent maintenance",
      noHistory: "No maintenance actions yet.",
      activeAlerts: "Active alerts",
      noAlerts: "No storage alerts.",
      selectDrive: "Select drive",
      healthPercent: "Health",
      hostReads: "Host reads",
      hostWrites: "Host writes",
      powerCycles: "Power cycles",
      diskBenchmark: "Disk speed test",
      benchmarkHint: "Sequential & 4K random read/write (CrystalDiskMark-style). Write tests use an unmounted data partition.",
      runBenchmark: "Run speed test",
      benchmarkRunning: "Benchmark running…",
      seqRead: "Seq. read",
      seqWrite: "Seq. write",
      rand4kRead: "4K random read",
      rand4kWrite: "4K random write",
      benchmarkSkipped: "Skipped",
      profileQuick: "Quick (~30s)",
      profileStandard: "Standard (~60s)",
      refreshSmart: "Refresh SMART",
      fsckTitle: "Filesystem check (fsck)",
      fsckCheck: "Check only (read-only)",
      fsckRepair: "Repair errors automatically",
      fsckConfirm: "Type partition name to confirm",
      fsckUnmountNote: "Partition must be unmounted. System disk partitions are blocked.",
      runFsck: "Run check",
      selectPartitionFsck: "Select unmounted partition",
      noFsckCandidates: "No unmounted partitions with a supported filesystem.",
      diskMap: "Disk map",
      partitionList: "Partition list",
      operations: "Operations",
      unallocated: "Unallocated",
      deletePartition: "Delete partition",
      resizePartition: "Move / resize",
      changeLabel: "Change label",
      setBoot: "Set boot / ESP",
      clearBoot: "Clear boot flag",
      properties: "Device",
      partitionTable: "Table",
      capacity: "Capacity",
      unused: "Unused",
      type: "Type",
      status: "Status",
      mounted: "Mounted",
      unmounted: "Unmounted",
      boot: "Boot",
      deleteWarning: "Deleting a partition erases all data on it permanently.",
      resizeHint: "New end position (e.g. 100% or 500GiB). Unmount first to shrink.",
      cancel: "Cancel",
      loadingLayout: "Loading partition layout…",
      protectedNote: "System disk — partition changes blocked.",
      apiStaleBanner: "Backend API is outdated (missing routes after module update). Run: sudo systemctl restart copanel — or use AppStore «Restart CoPanel».",
      backendVersionLabel: (t) => `Backend module v${t}`,
      diskOperations: "Disk",
      initializeDisk: "Initialize partition table",
      initializeDiskTitle: "Initialize disk (step 1)",
      initializeDiskHint: "Create a GPT or MBR partition table on a raw/unformatted disk before creating partitions.",
      tableGpt: "GPT — recommended for UEFI and disks over 2 TB",
      tableMbr: "MBR (msdos) — legacy BIOS, max 4 primary partitions",
      uninitializedBanner: "This disk has no partition table (raw / unformatted).",
      uninitializedStep: "Step 1: Initialize disk (GPT or MBR). Step 2: Create partition. Step 3: Format.",
      emptyTableStep: "Partition table ready — step 2: create a partition in the free space, then format.",
      rawDiskLabel: "Raw disk",
      initWipeWarning: "Erases any existing partition table on this disk. All data will be lost.",
      addToQueue: "Add to queue",
      partitionType: "Partition type",
      typeLinux: "Linux data (ext4)",
      typeEfi: "EFI System (FAT32)",
      typeSwap: "Linux swap",
      typeNtfs: "Microsoft NTFS",
      typeLvm: "LVM physical volume",
      dragResizeHint: "Select a partition, drag the right edge to extend or shrink (unmounted only; ext4/ntfs shrink).",
      extendPreview: (t) => `Extend to ${t} MiB`,
      shrinkPreview: (t) => `Shrink to ${t} MiB`,
      shrinkPartition: "Shrink partition",
      shrinkFilesystem: "Shrink filesystem before partition shrink",
      shrinkHint: "Shrink requires the partition to be unmounted. ext4/ntfs supported; XFS cannot shrink.",
      queue: {
        pendingOps: "Pending operations",
        pendingEmpty: "Queue empty — use «Add to queue» in dialogs.",
        applyAll: "Apply all",
        validate: "Validate",
        clearQueue: "Clear queue",
        operationLog: "Operation log",
        logEmpty: "No operations applied yet.",
        remove: "Remove",
        validating: "Validating…",
        applying: "Applying…",
        validationOk: "Validation passed",
        validationFailed: "Validation failed"
      }
    },
    vi: {
      title: "Quản lý Lưu trữ",
      desc: "Theo dõi ổ đĩa vật lý, volume đã mount và sức khỏe SMART trên máy chủ.",
      overview: "Tổng quan",
      disks: "Ổ đĩa",
      volumes: "Volume",
      healthy: "Khỏe mạnh",
      warning: "Cảnh báo",
      critical: "Nguy hiểm",
      systemHealthy: "Hệ thống lưu trữ khỏe mạnh.",
      refresh: "Làm mới",
      loading: "Đang tải dữ liệu lưu trữ...",
      totalDisks: "Ổ đĩa vật lý",
      totalVolumes: "Volume đã mount",
      totalCapacity: "Dung lượng ổ thô",
      smartMonitored: "Đang giám sát SMART",
      volumeUsage: "Dung lượng volume",
      noVolumes: "Không phát hiện volume đã mount.",
      noDisks: "Không tìm thấy block device vật lý.",
      diskName: "Ổ đĩa",
      model: "Model",
      size: "Dung lượng",
      transport: "Bus",
      health: "Sức khỏe",
      systemDisk: "Hệ thống",
      partitions: "Phân vùng",
      mount: "Mount",
      fstype: "Hệ thống tệp",
      used: "Đã dùng",
      free: "Còn trống",
      temperature: "Nhiệt độ",
      powerOn: "Giờ hoạt động",
      reallocated: "Sector tái phân bổ",
      smartMsg: "Thông báo SMART",
      toolsMissing: "Thiếu công cụ tùy chọn trên máy chủ:",
      lsblk: "lsblk (util-linux)",
      smartctl: "smartmontools (smartctl)",
      parted: "parted",
      adminNote: "Thao tác phá hoại cần superadmin. Ổ hệ thống và mount (/, /boot, CoPanel) được bảo vệ.",
      manage: "Quản lý",
      adminOnly: "Chỉ superadmin",
      createPartition: "Tạo phân vùng",
      formatPartition: "Định dạng phân vùng",
      mountVolume: "Mount volume",
      unmountVolume: "Gỡ mount",
      selectDisk: "Chọn ổ đĩa",
      selectPartition: "Chọn phân vùng",
      selectMount: "Chọn điểm mount",
      start: "Bắt đầu",
      end: "Kết thúc",
      initGpt: "Khởi tạo GPT cho ổ mới",
      confirmDiskName: "Nhập tên ổ để xác nhận",
      confirmPartName: "Nhập tên phân vùng để xác nhận",
      labelOptional: "Nhãn (tùy chọn)",
      mountpoint: "Điểm mount",
      options: "Tùy chọn mount",
      persistFstab: "Thêm vào /etc/fstab",
      removeFstab: "Xóa khỏi /etc/fstab",
      runAction: "Thực hiện",
      fstabTitle: "Mục /etc/fstab",
      dataLossWarning: "Định dạng sẽ xóa vĩnh viễn mọi dữ liệu trên phân vùng.",
      success: "Thành công",
      noCandidateDisk: "Không có ổ dữ liệu khả dụng.",
      noCandidatePart: "Không có phân vùng chưa mount trên ổ dữ liệu.",
      pools: "Pool",
      lvmTitle: "Pool lưu trữ LVM",
      raidTitle: "RAID phần mềm (mdadm)",
      volumeGroups: "Volume group",
      logicalVolumes: "Logical volume",
      physicalVolumes: "Physical volume",
      raidArrays: "Mảng RAID",
      noVg: "Chưa có volume group.",
      noLv: "Chưa có logical volume.",
      noRaid: "Không phát hiện mảng RAID.",
      createVg: "Tạo volume group",
      createLv: "Tạo logical volume",
      extendLv: "Mở rộng logical volume",
      createRaid: "Tạo mảng RAID",
      vgName: "Tên volume group",
      lvName: "Tên logical volume",
      lvSize: "Dung lượng (100G hoặc 100%FREE)",
      selectDevices: "Chọn thiết bị",
      raidLevel: "Cấp RAID",
      confirmVgName: "Nhập tên VG để xác nhận",
      confirmLvPath: "Nhập vg_name/lv_name để xác nhận",
      confirmRaid: "Nhập CREATE-RAID để xác nhận",
      growFilesystem: "Mở rộng filesystem sau extend",
      vgFree: "còn trống",
      raidConfirmWarning: "Tạo RAID sẽ xóa dữ liệu trên các thiết bị đã chọn.",
      lvm: "lvm2",
      mdadm: "mdadm",
      maintenance: "Bảo trì",
      maintenanceTitle: "Kiểm tra sức khỏe ổ & scrub",
      smartTest: "SMART self-test",
      smartShort: "Test ngắn (~2 phút)",
      smartLong: "Test dài (nhiều giờ)",
      btrfsScrub: "Btrfs scrub",
      raidCheck: "Kiểm tra RAID",
      runTest: "Bắt đầu test",
      runScrub: "Bắt đầu scrub",
      runRaidCheck: "Bắt đầu kiểm tra",
      maintenanceHistory: "Bảo trì gần đây",
      noHistory: "Chưa có thao tác bảo trì.",
      activeAlerts: "Cảnh báo đang hoạt động",
      noAlerts: "Không có cảnh báo lưu trữ.",
      selectDrive: "Chọn ổ đĩa",
      healthPercent: "Sức khỏe",
      hostReads: "Đã đọc",
      hostWrites: "Đã ghi",
      powerCycles: "Chu kỳ nguồn",
      diskBenchmark: "Test tốc độ ổ đĩa",
      benchmarkHint: "Đọc/ghi tuần tự & ngẫu nhiên 4K (kiểu CrystalDiskMark). Ghi dùng phân vùng dữ liệu chưa mount.",
      runBenchmark: "Chạy test tốc độ",
      benchmarkRunning: "Đang chạy benchmark…",
      seqRead: "Đọc tuần tự",
      seqWrite: "Ghi tuần tự",
      rand4kRead: "Đọc 4K ngẫu nhiên",
      rand4kWrite: "Ghi 4K ngẫu nhiên",
      benchmarkSkipped: "Bỏ qua",
      profileQuick: "Nhanh (~30 giây)",
      profileStandard: "Đầy đủ (~60 giây)",
      refreshSmart: "Làm mới SMART",
      fsckTitle: "Kiểm tra / sửa lỗi filesystem (fsck)",
      fsckCheck: "Chỉ kiểm tra (read-only)",
      fsckRepair: "Tự động sửa lỗi",
      fsckConfirm: "Nhập tên phân vùng để xác nhận",
      fsckUnmountNote: "Phân vùng phải đã gỡ mount. Phân vùng ổ hệ thống bị chặn.",
      runFsck: "Chạy kiểm tra",
      selectPartitionFsck: "Chọn phân vùng chưa mount",
      noFsckCandidates: "Không có phân vùng chưa mount hỗ trợ fsck.",
      diskMap: "Sơ đồ ổ đĩa",
      partitionList: "Danh sách phân vùng",
      operations: "Thao tác",
      unallocated: "Chưa phân bổ",
      deletePartition: "Xóa phân vùng",
      resizePartition: "Di chuyển / thay đổi kích thước",
      changeLabel: "Đổi nhãn",
      setBoot: "Đặt boot / ESP",
      clearBoot: "Bỏ cờ boot",
      properties: "Thiết bị",
      partitionTable: "Bảng phân vùng",
      capacity: "Dung lượng",
      unused: "Còn trống",
      type: "Loại",
      status: "Trạng thái",
      mounted: "Đã mount",
      unmounted: "Chưa mount",
      boot: "Boot",
      deleteWarning: "Xóa phân vùng sẽ xóa vĩnh viễn mọi dữ liệu trên đó.",
      resizeHint: "Vị trí kết thúc mới (vd. 100% hoặc 500GiB). Gỡ mount trước khi thu nhỏ.",
      cancel: "Hủy",
      loadingLayout: "Đang tải bố cục phân vùng…",
      protectedNote: "Ổ hệ thống — không cho sửa phân vùng.",
      apiStaleBanner: "API backend đã cũ (thiếu route sau khi cập nhật module). Chạy: sudo systemctl restart copanel — hoặc bấm «Restart CoPanel» trong AppStore.",
      backendVersionLabel: (t) => `Module backend v${t}`,
      diskOperations: "Ổ đĩa",
      initializeDisk: "Khởi tạo bảng phân vùng",
      initializeDiskTitle: "Khởi tạo ổ đĩa (bước 1)",
      initializeDiskHint: "Tạo bảng phân vùng GPT hoặc MBR trên ổ trống/chưa định dạng trước khi tạo phân vùng.",
      tableGpt: "GPT — khuyến nghị cho UEFI và ổ trên 2 TB",
      tableMbr: "MBR (msdos) — BIOS cũ, tối đa 4 phân vùng primary",
      uninitializedBanner: "Ổ đĩa chưa có bảng phân vùng (raw / chưa định dạng).",
      uninitializedStep: "Bước 1: Khởi tạo ổ (GPT hoặc MBR). Bước 2: Tạo phân vùng. Bước 3: Định dạng.",
      emptyTableStep: "Đã có bảng phân vùng — bước 2: tạo phân vùng trong vùng trống, rồi định dạng.",
      rawDiskLabel: "Ổ thô",
      initWipeWarning: "Xóa mọi bảng phân vùng hiện có. Mất toàn bộ dữ liệu trên ổ.",
      addToQueue: "Thêm vào hàng đợi",
      partitionType: "Loại phân vùng",
      typeLinux: "Linux dữ liệu (ext4)",
      typeEfi: "EFI System (FAT32)",
      typeSwap: "Linux swap",
      typeNtfs: "Microsoft NTFS",
      typeLvm: "LVM physical volume",
      dragResizeHint: "Chọn phân vùng, kéo cạnh phải để mở rộng hoặc thu nhỏ (chưa mount; ext4/ntfs).",
      extendPreview: (t) => `Mở rộng tới ${t} MiB`,
      shrinkPreview: (t) => `Thu nhỏ tới ${t} MiB`,
      shrinkPartition: "Thu nhỏ phân vùng",
      shrinkFilesystem: "Thu nhỏ filesystem trước khi thu phân vùng",
      shrinkHint: "Thu nhỏ cần unmount phân vùng. Hỗ trợ ext4/ntfs; XFS không thu nhỏ được.",
      queue: {
        pendingOps: "Thao tác chờ",
        pendingEmpty: "Hàng đợi trống — dùng «Thêm vào hàng đợi» trong hộp thoại.",
        applyAll: "Áp dụng tất cả",
        validate: "Kiểm tra",
        clearQueue: "Xóa hàng đợi",
        operationLog: "Nhật ký thao tác",
        logEmpty: "Chưa áp dụng thao tác nào.",
        remove: "Xóa",
        validating: "Đang kiểm tra…",
        applying: "Đang áp dụng…",
        validationOk: "Kiểm tra OK",
        validationFailed: "Kiểm tra thất bại"
      }
    }
  }[i || "en"], qe = fe(() => {
    const t = {};
    return o && (t.Authorization = `Bearer ${o}`), t;
  }, [o]), Z = K(async (t) => {
    const w = await fetch(t, { headers: qe }), z = await w.json().catch(() => ({}));
    if (!w.ok)
      throw new Error(xa(z, w.status));
    return z.data;
  }, [qe]), X = K(async (t, w) => {
    const z = await fetch(t, {
      method: "POST",
      headers: { ...qe, "Content-Type": "application/json" },
      body: JSON.stringify(w)
    }), V = await z.json().catch(() => ({}));
    if (!z.ok)
      throw new Error(xa(V, z.status));
    return V.data;
  }, [qe]), Nt = K(async () => {
    h(!0), x(null);
    const t = [], w = await Promise.allSettled([
      Z("/api/storage_manager/overview"),
      Z("/api/storage_manager/disks"),
      Z("/api/storage_manager/volumes"),
      Z("/api/storage_manager/fstab"),
      Z("/api/storage_manager/pools"),
      Z("/api/storage_manager/maintenance"),
      Z("/api/storage_manager/alerts")
    ]), [z, V, Fe, me, ra, la, sa] = w;
    z.status === "fulfilled" ? g(z.value) : t.push(z.reason instanceof Error ? z.reason.message : "overview failed"), V.status === "fulfilled" ? f(V.value) : (f([]), t.push(V.reason instanceof Error ? V.reason.message : "disks failed")), Fe.status === "fulfilled" ? k(Fe.value) : (k([]), t.push(Fe.reason instanceof Error ? Fe.reason.message : "volumes failed")), j(me.status === "fulfilled" ? me.value : []), st(ra.status === "fulfilled" ? ra.value : null), d(la.status === "fulfilled" ? la.value : null), R(sa.status === "fulfilled" ? sa.value?.alerts || [] : []), t.length > 0 && x(t.join(" · "));
    try {
      const [Gt, ke] = await Promise.allSettled([
        Z("/api/storage_manager/version"),
        fetch("/api/modules", { headers: qe }).then(async (_t) => {
          const Ka = await _t.json().catch(() => ({}));
          if (!_t.ok) throw new Error("modules list failed");
          return Ka;
        })
      ]);
      Gt.status === "fulfilled" ? U(Gt.value.version) : U(null);
      const oa = ke.status === "fulfilled" ? ke.value.modules?.storage_manager?.routes || [] : [], Ha = ke.status === "fulfilled" ? ke.value.modules?.storage_manager?.route_count ?? oa.length : 0, Da = ke.status === "fulfilled" && ke.value.modules?.storage_manager != null && typeof ke.value.modules == "object" && !Array.isArray(ke.value.modules) && Ha > 0 ? ar.some((_t) => !oa.includes(_t)) : !1, ja = Gt.status !== "fulfilled";
      te(ja || Da);
    } catch {
      U(null), te(!0);
    }
    h(!1);
  }, [Z, qe]);
  Le(() => {
    Nt();
  }, [Nt, i]);
  const Vt = K(async (t) => {
    Xt(t);
    try {
      const w = await Z(`/api/storage_manager/disks/${encodeURIComponent(t)}/smart`);
      La((z) => ({ ...z, [t]: w }));
    } catch {
    } finally {
      Xt(null);
    }
  }, [Z]);
  Le(() => {
    _ && Vt(_);
  }, [_, Vt]);
  const Yt = K(async (t) => {
    const w = await Z(
      `/api/storage_manager/disks/${encodeURIComponent(t)}/benchmark`
    );
    return wt(w), w;
  }, [Z]), Oa = K(async (t) => {
    Ia(t), wt({ status: "running", progress: 5 });
    try {
      await X(`/api/storage_manager/disks/${encodeURIComponent(t)}/benchmark`, {
        profile: It
      });
      const w = async () => {
        try {
          (await Yt(t)).status === "running" && window.setTimeout(w, 1500);
        } catch (z) {
          wt({
            status: "failed",
            error: z instanceof Error ? z.message : "Benchmark poll failed"
          });
        }
      };
      w();
    } catch (w) {
      wt({
        status: "failed",
        error: w instanceof Error ? w.message : "Failed to start benchmark"
      });
    }
  }, [It, Yt, X]), ye = s?.health || "healthy", pt = rr(ye, n), Zt = ye === "critical" ? l.critical : ye === "warning" ? l.warning : l.healthy, Wa = [
    { id: "overview", label: l.overview, icon: $.LayoutDashboard },
    { id: "disks", label: l.disks, icon: $.HardDrive },
    { id: "volumes", label: l.volumes, icon: $.Database },
    { id: "pools", label: l.pools, icon: $.Layers },
    { id: "maintenance", label: l.maintenance, icon: $.Stethoscope },
    { id: "manage", label: l.manage, icon: $.Settings2 }
  ], Jt = fe(
    () => new Set((Q?.lvm.physical_volumes || []).map((t) => t.pv_name)),
    [Q]
  ), ea = (t, w, z) => {
    z(w.includes(t) ? w.filter((V) => V !== t) : [...w, t]);
  }, kt = fe(() => N.filter((t) => !t.is_system_disk), [N]), Ct = fe(() => kt.flatMap(
    (t) => t.partitions.filter((w) => !w.mountpoint).map((w) => ({ ...w, diskName: t.name }))
  ), [kt]), ta = fe(
    () => Ct.filter((t) => !Jt.has(t.path)),
    [Ct, Jt]
  ), aa = fe(
    () => T.filter((t) => !nr(t.mountpoint)),
    [T]
  ), oe = async (t) => {
    G(!0), O(null), v(null);
    try {
      const w = await t();
      return v(w.message || l.success), await Nt(), !0;
    } catch (w) {
      return O(w instanceof Error ? w.message : "Action failed"), !1;
    } finally {
      G(!1);
    }
  }, $t = s ? [
    s.tools.lsblk ? null : l.lsblk,
    s.tools.smartctl ? null : l.smartctl,
    s.tools.parted === !1 ? l.parted : null,
    s.tools.lvm === !1 ? l.lvm : null,
    s.tools.mdadm === !1 ? l.mdadm : null
  ].filter(Boolean) : [], na = Qt(), W = Yn(n);
  return /* @__PURE__ */ e(
    En,
    {
      constrained: !0,
      className: `h-full min-h-0 ${na ? "p-0" : "p-3 md:p-4"}`,
      children: /* @__PURE__ */ r(
        "div",
        {
          className: `flex h-full min-h-0 flex-col overflow-hidden border ${W.panel} ${na ? "rounded-none border-0" : "rounded-xl shadow-sm"}`,
          children: [
            /* @__PURE__ */ r("header", { className: `flex shrink-0 items-center gap-3 border-b px-4 py-2.5 ${W.headerBorder}`, children: [
              /* @__PURE__ */ e("div", { className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${n ? "bg-cyan-500/15" : "bg-cyan-50"}`, children: /* @__PURE__ */ e($.HardDrive, { className: `h-5 w-5 ${n ? "text-cyan-400" : "text-cyan-600"}` }) }),
              /* @__PURE__ */ r("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e("h1", { className: "truncate text-sm font-semibold leading-tight", children: l.title }),
                /* @__PURE__ */ e("p", { className: `truncate text-[11px] ${W.muted}`, children: l.desc })
              ] }),
              /* @__PURE__ */ r("div", { className: "hidden items-center gap-2 sm:flex", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${pt.ring}`,
                    children: [
                      /* @__PURE__ */ e("span", { className: `h-1.5 w-1.5 rounded-full ${ye === "healthy" ? "bg-emerald-500" : ye === "warning" ? "bg-amber-500" : "bg-red-500"}` }),
                      Zt
                    ]
                  }
                ),
                s && /* @__PURE__ */ r("span", { className: `text-[10px] font-mono ${W.muted}`, children: [
                  s.disk_count,
                  " ",
                  l.disks.toLowerCase(),
                  " · ",
                  s.volume_count,
                  " ",
                  l.volumes.toLowerCase()
                ] })
              ] }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: Nt,
                  disabled: b,
                  className: `flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition ${W.btn}`,
                  children: [
                    /* @__PURE__ */ e($.RefreshCw, { className: `h-3.5 w-3.5 ${b ? "animate-spin" : ""}` }),
                    l.refresh
                  ]
                }
              )
            ] }),
            P && /* @__PURE__ */ e("div", { className: `shrink-0 border-b px-4 py-2 text-[11px] ${n ? "border-red-900/40 bg-red-950/30 text-red-200" : "border-red-200 bg-red-50 text-red-800"}`, children: l.apiStaleBanner }),
            C && /* @__PURE__ */ r("div", { className: `mx-3 mt-2 flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-[11px] ${n ? "border-red-800/50 bg-red-950/30 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`, children: [
              /* @__PURE__ */ e($.AlertCircle, { className: "h-3.5 w-3.5 shrink-0" }),
              /* @__PURE__ */ e("span", { className: "flex-1", children: C }),
              /* @__PURE__ */ e("button", { type: "button", onClick: () => x(null), className: W.muted, children: /* @__PURE__ */ e($.X, { className: "h-3.5 w-3.5" }) })
            ] }),
            /* @__PURE__ */ e(
              Bn,
              {
                isDark: n,
                mobileTitle: l.title,
                sidebar: /* @__PURE__ */ r("aside", { className: `flex h-full w-48 shrink-0 flex-col border-r xl:w-52 ${W.sidebar}`, children: [
                  /* @__PURE__ */ e("nav", { className: "flex-1 space-y-0.5 overflow-y-auto p-2", children: Wa.map((t) => {
                    const w = t.icon, z = c === t.id;
                    return /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        onClick: () => m(t.id),
                        className: `flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12px] font-medium transition ${z ? W.activeNav : `${W.muted} ${W.hoverNav}`}`,
                        children: [
                          /* @__PURE__ */ e(w, { className: `h-4 w-4 shrink-0 ${z ? n ? "text-cyan-400" : "text-cyan-600" : ""}` }),
                          /* @__PURE__ */ e("span", { className: "truncate", children: t.label })
                        ]
                      },
                      t.id
                    );
                  }) }),
                  /* @__PURE__ */ r("div", { className: `shrink-0 border-t p-2 text-[10px] leading-snug ${W.headerBorder} ${W.muted}`, children: [
                    /* @__PURE__ */ e("p", { children: l.adminNote }),
                    ee && /* @__PURE__ */ e("p", { className: "mt-1 font-mono opacity-70", children: l.backendVersionLabel(ee) }),
                    $t.length > 0 && /* @__PURE__ */ r("p", { className: `mt-1 ${n ? "text-amber-400/90" : "text-amber-700"}`, children: [
                      l.toolsMissing,
                      " ",
                      $t.join(", ")
                    ] })
                  ] })
                ] }),
                children: /* @__PURE__ */ e("main", { className: "flex min-h-0 min-w-0 flex-1 flex-col", children: b && !s ? /* @__PURE__ */ r("div", { className: `flex flex-1 flex-col items-center justify-center ${W.muted}`, children: [
                  /* @__PURE__ */ e($.Loader2, { className: "mb-2 h-8 w-8 animate-spin text-cyan-500" }),
                  /* @__PURE__ */ e("p", { className: "text-xs", children: l.loading })
                ] }) : /* @__PURE__ */ r("div", { className: `min-h-0 flex-1 ${c === "disks" ? "flex flex-col overflow-hidden" : "overflow-y-auto p-3"}`, children: [
                  c === "overview" && s && /* @__PURE__ */ r("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ r("div", { className: `rounded-xl border p-4 flex flex-col md:flex-row md:items-center gap-4 ${W.section}`, children: [
                      /* @__PURE__ */ e("div", { className: `w-16 h-16 rounded-full border-4 flex items-center justify-center shrink-0 ${ye === "healthy" ? n ? "border-emerald-500/50 bg-emerald-500/10" : "border-emerald-400 bg-emerald-100" : ye === "warning" ? n ? "border-amber-500/50 bg-amber-500/10" : "border-amber-400 bg-amber-100" : n ? "border-red-500/50 bg-red-500/10" : "border-red-400 bg-red-100"}`, children: ye === "healthy" ? /* @__PURE__ */ e($.CheckCircle2, { className: `w-8 h-8 ${pt.icon}` }) : /* @__PURE__ */ e($.AlertTriangle, { className: `w-8 h-8 ${pt.icon}` }) }),
                      /* @__PURE__ */ r("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ r("div", { className: "flex items-center gap-2 flex-wrap", children: [
                          /* @__PURE__ */ e("h2", { className: `text-xl font-extrabold ${pt.text}`, children: Zt }),
                          /* @__PURE__ */ e("span", { className: `text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${pt.badge}`, children: ye })
                        ] }),
                        /* @__PURE__ */ e("p", { className: `text-sm mt-1 ${n ? "text-slate-300" : "text-slate-600"}`, children: s.message || l.systemHealthy }),
                        s.issues.length > 0 && /* @__PURE__ */ e("ul", { className: `mt-2 text-xs space-y-1 ${n ? "text-slate-400" : "text-slate-500"}`, children: s.issues.map((t) => /* @__PURE__ */ r("li", { className: "flex items-start gap-1.5", children: [
                          /* @__PURE__ */ e("span", { className: "shrink-0 mt-0.5", children: "•" }),
                          /* @__PURE__ */ e("span", { children: t })
                        ] }, t)) })
                      ] })
                    ] }),
                    /* @__PURE__ */ e("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                      { label: l.totalDisks, value: String(s.disk_count), icon: $.HardDrive },
                      { label: l.totalVolumes, value: String(s.volume_count), icon: $.FolderOpen },
                      { label: l.totalCapacity, value: xe(s.total_disk_bytes, i || "en"), icon: $.Layers },
                      { label: l.smartMonitored, value: `${s.smart_passed}/${s.smart_monitored}`, icon: $.Activity }
                    ].map((t) => {
                      const w = t.icon;
                      return /* @__PURE__ */ r("div", { className: `rounded-xl border p-4 ${W.section}`, children: [
                        /* @__PURE__ */ r("div", { className: "flex items-center justify-between mb-2", children: [
                          /* @__PURE__ */ e("p", { className: `text-[10px] uppercase font-bold tracking-wider ${n ? "text-slate-500" : "text-slate-400"}`, children: t.label }),
                          /* @__PURE__ */ e(w, { className: `w-4 h-4 ${n ? "text-cyan-400" : "text-cyan-600"}` })
                        ] }),
                        /* @__PURE__ */ e("p", { className: `text-lg font-extrabold ${n ? "text-white" : "text-slate-800"}`, children: t.value })
                      ] }, t.label);
                    }) }),
                    $t.length > 0 && /* @__PURE__ */ r("div", { className: `rounded-xl border p-4 text-xs ${n ? "border-amber-800/40 bg-amber-950/20 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-900"}`, children: [
                      /* @__PURE__ */ e("p", { className: "font-bold mb-1", children: l.toolsMissing }),
                      /* @__PURE__ */ e("ul", { className: "list-disc pl-5 space-y-0.5", children: $t.map((t) => /* @__PURE__ */ e("li", { children: t }, t)) })
                    ] }),
                    /* @__PURE__ */ r("div", { children: [
                      /* @__PURE__ */ e("h3", { className: `text-sm font-bold mb-3 ${n ? "text-slate-200" : "text-slate-800"}`, children: l.volumeUsage }),
                      T.length === 0 ? /* @__PURE__ */ e("p", { className: `text-xs ${n ? "text-slate-500" : "text-slate-400"}`, children: l.noVolumes }) : /* @__PURE__ */ e("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: T.map((t) => /* @__PURE__ */ r("div", { className: `rounded-xl border p-4 space-y-3 ${n ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`, children: [
                        /* @__PURE__ */ r("div", { className: "flex items-start justify-between gap-2", children: [
                          /* @__PURE__ */ r("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ e("p", { className: `font-bold text-sm truncate ${n ? "text-slate-100" : "text-slate-800"}`, children: t.mountpoint }),
                            /* @__PURE__ */ r("p", { className: `text-[11px] font-mono truncate ${n ? "text-slate-500" : "text-slate-400"}`, children: [
                              t.device,
                              " · ",
                              ha(t)
                            ] })
                          ] }),
                          /* @__PURE__ */ e($.CheckCircle2, { className: `w-5 h-5 shrink-0 ${t.percent >= 95 ? "text-red-500" : t.percent >= 85 ? "text-amber-500" : n ? "text-emerald-400" : "text-emerald-600"}` })
                        ] }),
                        /* @__PURE__ */ e("div", { className: `h-2 rounded-full overflow-hidden ${n ? "bg-slate-800" : "bg-slate-100"}`, children: /* @__PURE__ */ e(
                          "div",
                          {
                            className: `h-full rounded-full transition-all ${t.percent >= 95 ? "bg-red-500" : t.percent >= 85 ? "bg-amber-500" : "bg-cyan-500"}`,
                            style: { width: `${Math.min(100, t.percent)}%` }
                          }
                        ) }),
                        /* @__PURE__ */ r("div", { className: `flex justify-between text-[11px] ${n ? "text-slate-400" : "text-slate-500"}`, children: [
                          /* @__PURE__ */ r("span", { children: [
                            xe(t.used, i || "en"),
                            " ",
                            l.used
                          ] }),
                          /* @__PURE__ */ r("span", { children: [
                            xe(t.free, i || "en"),
                            " ",
                            l.free
                          ] })
                        ] })
                      ] }, `${t.device}-${t.mountpoint}`)) })
                    ] })
                  ] }),
                  c === "disks" && /* @__PURE__ */ r("div", { className: "flex min-h-0 flex-1 flex-col", children: [
                    /* @__PURE__ */ e("div", { className: "flex min-h-0 flex-1 flex-col overflow-hidden", children: /* @__PURE__ */ e(
                      Xn,
                      {
                        disks: N,
                        volumes: T,
                        language: i || "en",
                        isDark: n,
                        actionLoading: F,
                        actionErr: A,
                        formatBytes: xe,
                        fetchJson: Z,
                        runAction: oe,
                        postJson: X,
                        tr: {
                          diskMap: l.diskMap,
                          partitionList: l.partitionList,
                          operations: l.operations,
                          unallocated: l.unallocated,
                          selectPartition: l.selectPartition,
                          capacity: l.capacity,
                          unused: l.unused,
                          type: l.type,
                          status: l.status,
                          mounted: l.mounted,
                          unmounted: l.unmounted,
                          boot: l.boot,
                          createPartition: l.createPartition,
                          formatPartition: l.formatPartition,
                          deletePartition: l.deletePartition,
                          resizePartition: l.resizePartition,
                          changeLabel: l.changeLabel,
                          setBoot: l.setBoot,
                          clearBoot: l.clearBoot,
                          mountVolume: l.mountVolume,
                          unmountVolume: l.unmountVolume,
                          properties: l.properties,
                          partitionTable: l.partitionTable,
                          confirmPartName: l.confirmPartName,
                          confirmDiskName: l.confirmDiskName,
                          dataLossWarning: l.dataLossWarning,
                          deleteWarning: l.deleteWarning,
                          resizeHint: l.resizeHint,
                          growFilesystem: l.growFilesystem,
                          runAction: l.runAction,
                          cancel: l.cancel,
                          labelOptional: l.labelOptional,
                          initGpt: l.initGpt,
                          start: l.start,
                          end: l.end,
                          noDisks: l.noDisks,
                          loadingLayout: l.loadingLayout,
                          systemDisk: l.systemDisk,
                          protectedNote: l.protectedNote,
                          selectDisk: l.selectDisk,
                          mountpoint: l.mountpoint,
                          persistFstab: l.persistFstab,
                          removeFstab: l.removeFstab,
                          diskOperations: l.diskOperations,
                          initializeDisk: l.initializeDisk,
                          initializeDiskTitle: l.initializeDiskTitle,
                          initializeDiskHint: l.initializeDiskHint,
                          tableGpt: l.tableGpt,
                          tableMbr: l.tableMbr,
                          uninitializedBanner: l.uninitializedBanner,
                          uninitializedStep: l.uninitializedStep,
                          emptyTableStep: l.emptyTableStep,
                          rawDiskLabel: l.rawDiskLabel,
                          initWipeWarning: l.initWipeWarning,
                          addToQueue: l.addToQueue,
                          partitionType: l.partitionType,
                          typeLinux: l.typeLinux,
                          typeEfi: l.typeEfi,
                          typeSwap: l.typeSwap,
                          typeNtfs: l.typeNtfs,
                          typeLvm: l.typeLvm,
                          dragResizeHint: l.dragResizeHint,
                          extendPreview: l.extendPreview,
                          shrinkPreview: l.shrinkPreview,
                          shrinkPartition: l.shrinkPartition,
                          shrinkFilesystem: l.shrinkFilesystem,
                          shrinkHint: l.shrinkHint,
                          queue: l.queue
                        }
                      }
                    ) }),
                    N.length > 0 && /* @__PURE__ */ r("div", { className: `shrink-0 border-t ${W.headerBorder} ${W.section}`, children: [
                      /* @__PURE__ */ r("div", { className: `px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2 ${n ? "border-slate-800" : "border-slate-200"}`, children: [
                        /* @__PURE__ */ r("p", { className: "text-xs font-bold uppercase tracking-wider opacity-70", children: [
                          "SMART & ",
                          l.diskBenchmark
                        ] }),
                        /* @__PURE__ */ e(
                          "select",
                          {
                            value: _ || N[0]?.name || "",
                            onChange: (t) => L(t.target.value),
                            className: `rounded-lg border px-3 py-1.5 text-[11px] font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-white border-slate-200"}`,
                            children: N.map((t) => /* @__PURE__ */ r("option", { value: t.name, children: [
                              t.name,
                              " — ",
                              t.model
                            ] }, t.name))
                          }
                        )
                      ] }),
                      (() => {
                        const t = _ || N[0]?.name, w = N.find((me) => me.name === t);
                        if (!w) return null;
                        const z = Fa[w.name] || w.smart, V = Ba === w.name ? Va : null, Fe = lr(w.smart, n);
                        return /* @__PURE__ */ r("div", { className: "p-4 grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
                          /* @__PURE__ */ r("div", { className: `rounded-xl border p-3 space-y-3 lg:col-span-2 ${n ? "border-slate-800" : "border-slate-200"}`, children: [
                            /* @__PURE__ */ r("div", { className: "flex items-center justify-between gap-2", children: [
                              /* @__PURE__ */ r("div", { className: "flex items-center gap-2", children: [
                                /* @__PURE__ */ e("span", { className: `inline-flex px-2 py-0.5 rounded-full border text-[10px] font-bold ${Fe.cls}`, children: Fe.label }),
                                /* @__PURE__ */ e("span", { className: "font-mono text-xs font-bold", children: w.name })
                              ] }),
                              /* @__PURE__ */ e(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => Vt(w.name),
                                  className: `text-[10px] font-bold px-2 py-1 rounded-lg border ${n ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"}`,
                                  children: Ea === w.name ? "…" : l.refreshSmart
                                }
                              )
                            ] }),
                            z.health_percent != null && /* @__PURE__ */ r("div", { children: [
                              /* @__PURE__ */ r("div", { className: "flex justify-between text-[10px] mb-1", children: [
                                /* @__PURE__ */ e("span", { className: "opacity-60", children: l.healthPercent }),
                                /* @__PURE__ */ r("span", { className: "font-bold", children: [
                                  z.health_percent,
                                  "%"
                                ] })
                              ] }),
                              /* @__PURE__ */ e("div", { className: `h-2 rounded-full overflow-hidden ${n ? "bg-slate-800" : "bg-slate-200"}`, children: /* @__PURE__ */ e(
                                "div",
                                {
                                  className: `h-full rounded-full ${z.health_percent >= 80 ? "bg-emerald-500" : z.health_percent >= 50 ? "bg-amber-500" : "bg-red-500"}`,
                                  style: { width: `${Math.min(100, z.health_percent)}%` }
                                }
                              ) })
                            ] }),
                            /* @__PURE__ */ r("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px]", children: [
                              /* @__PURE__ */ r("div", { children: [
                                /* @__PURE__ */ r("span", { className: "opacity-60", children: [
                                  l.temperature,
                                  ":"
                                ] }),
                                " ",
                                z.temperature_c != null ? `${z.temperature_c}°C` : "—"
                              ] }),
                              /* @__PURE__ */ r("div", { children: [
                                /* @__PURE__ */ r("span", { className: "opacity-60", children: [
                                  l.powerOn,
                                  ":"
                                ] }),
                                " ",
                                Jn(z.power_on_hours, i || "en")
                              ] }),
                              /* @__PURE__ */ r("div", { children: [
                                /* @__PURE__ */ r("span", { className: "opacity-60", children: [
                                  l.powerCycles,
                                  ":"
                                ] }),
                                " ",
                                z.power_cycle_count ?? "—"
                              ] }),
                              /* @__PURE__ */ r("div", { children: [
                                /* @__PURE__ */ r("span", { className: "opacity-60", children: [
                                  l.hostReads,
                                  ":"
                                ] }),
                                " ",
                                ga(z.host_reads_gb)
                              ] }),
                              /* @__PURE__ */ r("div", { children: [
                                /* @__PURE__ */ r("span", { className: "opacity-60", children: [
                                  l.hostWrites,
                                  ":"
                                ] }),
                                " ",
                                ga(z.host_writes_gb)
                              ] }),
                              /* @__PURE__ */ r("div", { children: [
                                /* @__PURE__ */ r("span", { className: "opacity-60", children: [
                                  l.reallocated,
                                  ":"
                                ] }),
                                " ",
                                z.reallocated_sectors ?? "—"
                              ] })
                            ] })
                          ] }),
                          /* @__PURE__ */ r("div", { className: `rounded-xl border p-3 space-y-3 ${n ? "border-cyan-900/40 bg-cyan-950/10" : "border-cyan-200 bg-cyan-50/40"}`, children: [
                            /* @__PURE__ */ r("p", { className: "font-bold text-[11px] uppercase tracking-wider flex items-center gap-2", children: [
                              /* @__PURE__ */ e($.Gauge, { className: "w-4 h-4" }),
                              l.diskBenchmark
                            ] }),
                            /* @__PURE__ */ r("div", { className: "flex flex-wrap items-center gap-2", children: [
                              /* @__PURE__ */ r(
                                "select",
                                {
                                  value: It,
                                  onChange: (me) => Ga(me.target.value),
                                  className: `rounded-lg border px-3 py-1.5 text-[11px] ${n ? "bg-slate-950 border-slate-700" : "bg-white border-slate-200"}`,
                                  children: [
                                    /* @__PURE__ */ e("option", { value: "quick", children: l.profileQuick }),
                                    /* @__PURE__ */ e("option", { value: "standard", children: l.profileStandard })
                                  ]
                                }
                              ),
                              /* @__PURE__ */ e(
                                "button",
                                {
                                  type: "button",
                                  disabled: F || V?.status === "running",
                                  onClick: () => Oa(w.name),
                                  className: "px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-[11px] font-bold",
                                  children: V?.status === "running" ? l.benchmarkRunning : l.runBenchmark
                                }
                              )
                            ] }),
                            V && V.status !== "not_started" && /* @__PURE__ */ e("div", { className: "grid grid-cols-2 gap-2 text-[11px]", children: [
                              { label: l.seqRead, val: V.results?.seq_read_mibs },
                              { label: l.seqWrite, val: V.results?.seq_write_mibs, skip: V.results?.seq_write_skipped },
                              { label: l.rand4kRead, val: V.results?.rand4k_read_mibs },
                              { label: l.rand4kWrite, val: V.results?.rand4k_write_mibs, skip: V.results?.rand4k_write_skipped }
                            ].map((me) => /* @__PURE__ */ r("div", { className: `rounded-lg border p-2 ${n ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-white"}`, children: [
                              /* @__PURE__ */ e("div", { className: "opacity-60 text-[10px]", children: me.label }),
                              /* @__PURE__ */ e("div", { className: "font-mono font-bold text-sm mt-0.5", children: me.skip ? l.benchmarkSkipped : er(me.val ?? null) })
                            ] }, me.label)) })
                          ] })
                        ] });
                      })()
                    ] })
                  ] }),
                  c === "volumes" && /* @__PURE__ */ e("div", { className: `overflow-hidden rounded-xl border ${W.section}`, children: T.length === 0 ? /* @__PURE__ */ e("p", { className: `p-8 text-center text-xs ${n ? "text-slate-500" : "text-slate-400"}`, children: l.noVolumes }) : /* @__PURE__ */ e("div", { className: "overflow-x-auto", children: /* @__PURE__ */ r("table", { className: "w-full text-left text-xs", children: [
                    /* @__PURE__ */ e("thead", { className: `uppercase tracking-wider text-[10px] font-bold ${n ? "bg-slate-950/70 text-slate-400" : "bg-slate-50 text-slate-500"}`, children: /* @__PURE__ */ r("tr", { children: [
                      /* @__PURE__ */ e("th", { className: "p-3", children: l.mount }),
                      /* @__PURE__ */ e("th", { className: "p-3", children: l.diskName }),
                      /* @__PURE__ */ e("th", { className: "p-3", children: l.fstype }),
                      /* @__PURE__ */ e("th", { className: "p-3", children: l.used }),
                      /* @__PURE__ */ e("th", { className: "p-3", children: l.free }),
                      /* @__PURE__ */ e("th", { className: "p-3", children: "%" })
                    ] }) }),
                    /* @__PURE__ */ e("tbody", { className: `divide-y ${n ? "divide-slate-800" : "divide-slate-100"}`, children: T.map((t) => /* @__PURE__ */ r("tr", { className: n ? "hover:bg-slate-800/30" : "hover:bg-slate-50", children: [
                      /* @__PURE__ */ e("td", { className: `p-3 font-bold ${n ? "text-slate-100" : "text-slate-800"}`, children: t.mountpoint }),
                      /* @__PURE__ */ e("td", { className: "p-3 font-mono", children: t.device }),
                      /* @__PURE__ */ e("td", { className: "p-3", children: ha(t) }),
                      /* @__PURE__ */ e("td", { className: "p-3 font-mono", children: xe(t.used, i || "en") }),
                      /* @__PURE__ */ e("td", { className: "p-3 font-mono", children: xe(t.free, i || "en") }),
                      /* @__PURE__ */ e("td", { className: "p-3", children: /* @__PURE__ */ r("span", { className: `font-bold ${t.percent >= 95 ? "text-red-500" : t.percent >= 85 ? "text-amber-500" : n ? "text-cyan-400" : "text-cyan-700"}`, children: [
                        t.percent.toFixed(1),
                        "%"
                      ] }) })
                    ] }, `${t.device}-${t.mountpoint}`)) })
                  ] }) }) }),
                  c === "pools" && /* @__PURE__ */ e("div", { className: "space-y-4", children: Q ? /* @__PURE__ */ r(J, { children: [
                    (M || A) && /* @__PURE__ */ e("div", { className: `p-3 rounded-xl border text-xs ${A ? n ? "bg-red-950/30 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-700" : n ? "bg-emerald-950/30 border-emerald-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`, children: A || M }),
                    /* @__PURE__ */ r("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-4 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ r("h3", { className: "text-sm font-bold flex items-center gap-2", children: [
                          /* @__PURE__ */ e($.Layers, { className: "w-4 h-4" }),
                          l.lvmTitle
                        ] }),
                        /* @__PURE__ */ r("div", { children: [
                          /* @__PURE__ */ e("p", { className: "text-[11px] font-bold uppercase opacity-60 mb-2", children: l.volumeGroups }),
                          Q.lvm.volume_groups.length === 0 ? /* @__PURE__ */ e("p", { className: "text-xs opacity-60", children: l.noVg }) : /* @__PURE__ */ e("div", { className: "space-y-2", children: Q.lvm.volume_groups.map((t) => /* @__PURE__ */ r("div", { className: `rounded-lg border px-3 py-2 text-xs ${n ? "border-slate-800" : "border-slate-100"}`, children: [
                            /* @__PURE__ */ e("div", { className: "font-bold", children: t.vg_name }),
                            /* @__PURE__ */ r("div", { className: `font-mono ${n ? "text-slate-400" : "text-slate-500"}`, children: [
                              xe(t.vg_size_bytes, i || "en"),
                              " · ",
                              l.vgFree,
                              " ",
                              xe(t.vg_free_bytes, i || "en")
                            ] })
                          ] }, t.vg_name)) })
                        ] }),
                        /* @__PURE__ */ r("div", { children: [
                          /* @__PURE__ */ e("p", { className: "text-[11px] font-bold uppercase opacity-60 mb-2", children: l.logicalVolumes }),
                          Q.lvm.logical_volumes.length === 0 ? /* @__PURE__ */ e("p", { className: "text-xs opacity-60", children: l.noLv }) : /* @__PURE__ */ e("div", { className: "space-y-2", children: Q.lvm.logical_volumes.map((t) => /* @__PURE__ */ r("div", { className: `rounded-lg border px-3 py-2 text-xs font-mono ${n ? "border-slate-800" : "border-slate-100"}`, children: [
                            /* @__PURE__ */ r("div", { className: "font-bold", children: [
                              t.vg_name,
                              "/",
                              t.lv_name
                            ] }),
                            /* @__PURE__ */ r("div", { className: "opacity-70", children: [
                              xe(t.lv_size_bytes, i || "en"),
                              " · ",
                              t.mountpoint || "—",
                              " · ",
                              t.fstype || "—"
                            ] })
                          ] }, t.lv_path)) })
                        ] })
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-4 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ r("h3", { className: "text-sm font-bold flex items-center gap-2", children: [
                          /* @__PURE__ */ e($.Shield, { className: "w-4 h-4" }),
                          l.raidTitle
                        ] }),
                        Q.raid.arrays.length === 0 ? /* @__PURE__ */ e("p", { className: "text-xs opacity-60", children: l.noRaid }) : /* @__PURE__ */ e("div", { className: "space-y-2", children: Q.raid.arrays.map((t) => /* @__PURE__ */ r("div", { className: `rounded-lg border px-3 py-2 text-xs ${n ? "border-slate-800" : "border-slate-100"}`, children: [
                          /* @__PURE__ */ r("div", { className: "font-bold font-mono", children: [
                            t.path,
                            " · ",
                            t.level
                          ] }),
                          /* @__PURE__ */ r("div", { className: "opacity-70", children: [
                            t.state,
                            " · ",
                            t.health,
                            " · ",
                            xe(t.size_bytes, i || "en")
                          ] }),
                          /* @__PURE__ */ e("div", { className: "font-mono opacity-60 mt-1", children: t.devices.join(", ") })
                        ] }, t.path)) })
                      ] })
                    ] }),
                    /* @__PURE__ */ r("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ e("h4", { className: "text-xs font-bold", children: l.createVg }),
                        /* @__PURE__ */ e("input", { value: ne, onChange: (t) => Oe(t.target.value), placeholder: l.vgName, className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ e("p", { className: "text-[11px] opacity-60", children: l.selectDevices }),
                        /* @__PURE__ */ e("div", { className: "max-h-28 overflow-y-auto space-y-1", children: ta.map((t) => /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-xs font-mono", children: [
                          /* @__PURE__ */ e("input", { type: "checkbox", checked: We.includes(t.path), onChange: () => ea(t.path, We, St) }),
                          t.path
                        ] }, t.path)) }),
                        /* @__PURE__ */ e("input", { value: ot, onChange: (t) => He(t.target.value), placeholder: l.confirmVgName, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ e("button", { disabled: F || !ne || We.length === 0 || ot !== ne, onClick: () => oe(() => X("/api/storage_manager/pools/lvm/vg/create", { vg_name: ne, devices: We, confirm_token: ot })), className: "w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl", children: l.runAction })
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ e("h4", { className: "text-xs font-bold", children: l.createLv }),
                        /* @__PURE__ */ r("select", { value: De, onChange: (t) => de(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ e("option", { value: "", children: l.vgName }),
                          Q.lvm.volume_groups.map((t) => /* @__PURE__ */ e("option", { value: t.vg_name, children: t.vg_name }, t.vg_name))
                        ] }),
                        /* @__PURE__ */ e("input", { value: Y, onChange: (t) => Pt(t.target.value), placeholder: l.lvName, className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ e("input", { value: ft, onChange: (t) => Tt(t.target.value), placeholder: l.lvSize, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ e("input", { value: it, onChange: (t) => Ae(t.target.value), placeholder: l.confirmLvPath, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ e("button", { disabled: F || !De || !Y || it !== `${De}/${Y}`, onClick: () => oe(() => X("/api/storage_manager/pools/lvm/lv/create", { vg_name: De, lv_name: Y, size: ft, confirm_token: it })), className: "w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl", children: l.runAction })
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ e("h4", { className: "text-xs font-bold", children: l.extendLv }),
                        /* @__PURE__ */ r("select", { value: u, onChange: (t) => je(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ e("option", { value: "", children: l.vgName }),
                          Q.lvm.volume_groups.map((t) => /* @__PURE__ */ e("option", { value: t.vg_name, children: t.vg_name }, t.vg_name))
                        ] }),
                        /* @__PURE__ */ r("select", { value: H, onChange: (t) => dt(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ e("option", { value: "", children: l.lvName }),
                          Q.lvm.logical_volumes.filter((t) => !u || t.vg_name === u).map((t) => /* @__PURE__ */ e("option", { value: t.lv_name, children: t.lv_name }, t.lv_path))
                        ] }),
                        /* @__PURE__ */ e("input", { value: ce, onChange: (t) => Mt(t.target.value), placeholder: l.lvSize, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-xs", children: [
                          /* @__PURE__ */ e("input", { type: "checkbox", checked: ct, onChange: (t) => ge(t.target.checked) }),
                          l.growFilesystem
                        ] }),
                        /* @__PURE__ */ e("input", { value: re, onChange: (t) => le(t.target.value), placeholder: l.confirmLvPath, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ e("button", { disabled: F || !u || !H || re !== `${u}/${H}`, onClick: () => oe(() => X("/api/storage_manager/pools/lvm/lv/extend", { vg_name: u, lv_name: H, size: ce, grow_filesystem: ct, confirm_token: re })), className: "w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl", children: l.runAction })
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-red-900/40 bg-red-950/10" : "border-red-200 bg-red-50/40"}`, children: [
                        /* @__PURE__ */ e("h4", { className: "text-xs font-bold text-red-500", children: l.createRaid }),
                        /* @__PURE__ */ e("p", { className: "text-[11px] text-red-500", children: l.raidConfirmWarning }),
                        /* @__PURE__ */ r("select", { value: vt, onChange: (t) => zt(Number(t.target.value)), className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ e("option", { value: 1, children: "RAID 1 (mirror)" }),
                          /* @__PURE__ */ e("option", { value: 5, children: "RAID 5" }),
                          /* @__PURE__ */ e("option", { value: 10, children: "RAID 10" })
                        ] }),
                        /* @__PURE__ */ e("div", { className: "max-h-28 overflow-y-auto space-y-1", children: ta.map((t) => /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-xs font-mono", children: [
                          /* @__PURE__ */ e("input", { type: "checkbox", checked: Ke.includes(t.path), onChange: () => ea(t.path, Ke, Rt) }),
                          t.path
                        ] }, `raid-${t.path}`)) }),
                        /* @__PURE__ */ e("input", { value: se, onChange: (t) => At(t.target.value), placeholder: l.confirmRaid, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ e("button", { disabled: F || Ke.length < 2 || se !== "CREATE-RAID", onClick: () => oe(() => X("/api/storage_manager/pools/raid/create", { level: vt, devices: Ke, confirm_token: se })), className: "w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl", children: l.runAction })
                      ] })
                    ] })
                  ] }) : /* @__PURE__ */ e("p", { className: `text-xs ${n ? "text-slate-500" : "text-slate-400"}`, children: l.loading }) }),
                  c === "maintenance" && /* @__PURE__ */ r("div", { className: "space-y-4", children: [
                    (M || A) && /* @__PURE__ */ e("div", { className: `p-3 rounded-xl border text-xs ${A ? n ? "bg-red-950/30 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-700" : n ? "bg-emerald-950/30 border-emerald-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`, children: A || M }),
                    /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                      /* @__PURE__ */ e("h3", { className: "text-sm font-bold mb-2", children: l.activeAlerts }),
                      y.length === 0 ? /* @__PURE__ */ e("p", { className: "text-xs opacity-60", children: l.noAlerts }) : /* @__PURE__ */ e("ul", { className: "space-y-1.5 text-xs", children: y.map((t, w) => /* @__PURE__ */ r("li", { className: `flex gap-2 ${t.level === "critical" ? "text-red-500" : "text-amber-500"}`, children: [
                        /* @__PURE__ */ e($.AlertTriangle, { className: "w-3.5 h-3.5 shrink-0 mt-0.5" }),
                        /* @__PURE__ */ e("span", { children: t.message })
                      ] }, `${t.message}-${w}`)) })
                    ] }),
                    /* @__PURE__ */ e("p", { className: `text-xs ${n ? "text-slate-400" : "text-slate-500"}`, children: l.maintenanceTitle }),
                    /* @__PURE__ */ r("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ e("h4", { className: "text-xs font-bold", children: l.smartTest }),
                        /* @__PURE__ */ r("select", { value: I, onChange: (t) => mt(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ e("option", { value: "", children: l.selectDrive }),
                          (D?.targets.smart_disks || []).map((t) => /* @__PURE__ */ r("option", { value: t.name, children: [
                            t.name,
                            " — ",
                            t.model
                          ] }, t.name))
                        ] }),
                        /* @__PURE__ */ r("select", { value: Ue, onChange: (t) => Pa(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ e("option", { value: "short", children: l.smartShort }),
                          /* @__PURE__ */ e("option", { value: "long", children: l.smartLong })
                        ] }),
                        /* @__PURE__ */ e(
                          "button",
                          {
                            disabled: F || !I,
                            onClick: () => oe(() => X("/api/storage_manager/maintenance/smart-test", { disk_name: I, test_type: Ue })),
                            className: "w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl",
                            children: l.runTest
                          }
                        )
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ e("h4", { className: "text-xs font-bold", children: l.btrfsScrub }),
                        /* @__PURE__ */ r("select", { value: Ft, onChange: (t) => Ta(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ e("option", { value: "", children: l.mount }),
                          (D?.targets.btrfs_volumes || []).map((t) => /* @__PURE__ */ e("option", { value: t.mountpoint, children: t.mountpoint }, t.mountpoint))
                        ] }),
                        /* @__PURE__ */ e(
                          "button",
                          {
                            disabled: F || !Ft,
                            onClick: () => oe(() => X("/api/storage_manager/maintenance/scrub/btrfs", { mountpoint: Ft })),
                            className: "w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl",
                            children: l.runScrub
                          }
                        )
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ e("h4", { className: "text-xs font-bold", children: l.raidCheck }),
                        /* @__PURE__ */ r("select", { value: Lt, onChange: (t) => Ma(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ e("option", { value: "", children: "RAID" }),
                          (D?.targets.raid_arrays || []).map((t) => /* @__PURE__ */ r("option", { value: t.path, children: [
                            t.path,
                            " (",
                            t.level,
                            ")"
                          ] }, t.path))
                        ] }),
                        /* @__PURE__ */ e(
                          "button",
                          {
                            disabled: F || !Lt,
                            onClick: () => oe(() => X("/api/storage_manager/maintenance/scrub/raid", { md_device: Lt })),
                            className: "w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl",
                            children: l.runRaidCheck
                          }
                        )
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 xl:col-span-2 ${n ? "border-amber-900/40 bg-amber-950/10" : "border-amber-200 bg-amber-50/40"}`, children: [
                        /* @__PURE__ */ r("h4", { className: "text-xs font-bold flex items-center gap-2", children: [
                          /* @__PURE__ */ e($.Wrench, { className: "w-4 h-4" }),
                          l.fsckTitle
                        ] }),
                        /* @__PURE__ */ e("p", { className: "text-[11px] opacity-70", children: l.fsckUnmountNote }),
                        (D?.targets.fsck_partitions || []).length === 0 ? /* @__PURE__ */ e("p", { className: "text-xs opacity-60", children: l.noFsckCandidates }) : /* @__PURE__ */ r(J, { children: [
                          /* @__PURE__ */ r(
                            "select",
                            {
                              value: yt,
                              onChange: (t) => za(t.target.value),
                              className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`,
                              children: [
                                /* @__PURE__ */ e("option", { value: "", children: l.selectPartitionFsck }),
                                (D?.targets.fsck_partitions || []).map((t) => /* @__PURE__ */ r("option", { value: t.path, children: [
                                  t.path,
                                  " — ",
                                  t.fstype_label || t.fstype
                                ] }, t.path))
                              ]
                            }
                          ),
                          /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-xs", children: [
                            /* @__PURE__ */ e("input", { type: "checkbox", checked: Et, onChange: (t) => Ra(t.target.checked) }),
                            l.fsckRepair
                          ] }),
                          !Et && /* @__PURE__ */ e("p", { className: "text-[10px] opacity-60", children: l.fsckCheck }),
                          /* @__PURE__ */ e(
                            "input",
                            {
                              value: Bt,
                              onChange: (t) => Aa(t.target.value),
                              placeholder: l.fsckConfirm,
                              className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`
                            }
                          ),
                          /* @__PURE__ */ e(
                            "button",
                            {
                              disabled: F || !yt || Bt !== yt.replace("/dev/", ""),
                              onClick: () => oe(() => X("/api/storage_manager/maintenance/fsck", {
                                device: yt,
                                repair: Et,
                                confirm_token: Bt
                              })),
                              className: "w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl",
                              children: l.runFsck
                            }
                          )
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                      /* @__PURE__ */ e("h4", { className: "text-sm font-bold mb-3", children: l.maintenanceHistory }),
                      D?.history?.length ? /* @__PURE__ */ e("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: D.history.map((t, w) => /* @__PURE__ */ r("div", { className: `text-[11px] font-mono border-b pb-2 ${n ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-600"}`, children: [
                        /* @__PURE__ */ e("span", { className: "font-bold", children: t.action }),
                        " · ",
                        t.target,
                        " — ",
                        t.result
                      ] }, `${t.at}-${w}`)) }) : /* @__PURE__ */ e("p", { className: "text-xs opacity-60", children: l.noHistory })
                    ] })
                  ] }),
                  c === "manage" && /* @__PURE__ */ r("div", { className: "space-y-4", children: [
                    (M || A) && /* @__PURE__ */ e("div", { className: `p-3 rounded-xl border text-xs ${A ? n ? "bg-red-950/30 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-700" : n ? "bg-emerald-950/30 border-emerald-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`, children: A || M }),
                    /* @__PURE__ */ r("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ r("h3", { className: "text-sm font-bold flex items-center gap-2", children: [
                          /* @__PURE__ */ e($.Plus, { className: "w-4 h-4" }),
                          l.createPartition
                        ] }),
                        /* @__PURE__ */ e("p", { className: `text-[11px] ${n ? "text-slate-500" : "text-slate-400"}`, children: l.adminOnly }),
                        kt.length === 0 ? /* @__PURE__ */ e("p", { className: "text-xs opacity-60", children: l.noCandidateDisk }) : /* @__PURE__ */ r(J, { children: [
                          /* @__PURE__ */ r("select", { value: ae, onChange: (t) => pe(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                            /* @__PURE__ */ e("option", { value: "", children: l.selectDisk }),
                            kt.map((t) => /* @__PURE__ */ r("option", { value: t.name, children: [
                              t.name,
                              " — ",
                              t.model
                            ] }, t.name))
                          ] }),
                          /* @__PURE__ */ r("div", { className: "grid grid-cols-2 gap-2", children: [
                            /* @__PURE__ */ e("input", { value: ue, onChange: (t) => be(t.target.value), placeholder: l.start, className: `rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                            /* @__PURE__ */ e("input", { value: he, onChange: (t) => ie(t.target.value), placeholder: l.end, className: `rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` })
                          ] }),
                          /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-xs", children: [
                            /* @__PURE__ */ e("input", { type: "checkbox", checked: _e, onChange: (t) => q(t.target.checked) }),
                            l.initGpt
                          ] }),
                          /* @__PURE__ */ e("input", { value: Ye, onChange: (t) => Se(t.target.value), placeholder: l.confirmDiskName, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                          /* @__PURE__ */ e(
                            "button",
                            {
                              disabled: F || !ae || Ye !== ae,
                              onClick: () => oe(() => X("/api/storage_manager/partitions/create", {
                                disk_name: ae,
                                start: ue,
                                end: he,
                                initialize_gpt: _e,
                                confirm_token: Ye
                              })),
                              className: "w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl",
                              children: l.runAction
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-red-900/40 bg-red-950/10" : "border-red-200 bg-red-50/40"}`, children: [
                        /* @__PURE__ */ r("h3", { className: "text-sm font-bold flex items-center gap-2 text-red-500", children: [
                          /* @__PURE__ */ e($.Eraser, { className: "w-4 h-4" }),
                          l.formatPartition
                        ] }),
                        /* @__PURE__ */ e("p", { className: "text-[11px] text-red-500", children: l.dataLossWarning }),
                        Ct.length === 0 ? /* @__PURE__ */ e("p", { className: "text-xs opacity-60", children: l.noCandidatePart }) : /* @__PURE__ */ r(J, { children: [
                          /* @__PURE__ */ r("select", { value: Pe, onChange: (t) => Ee(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                            /* @__PURE__ */ e("option", { value: "", children: l.selectPartition }),
                            Ct.map((t) => /* @__PURE__ */ e("option", { value: t.path, children: t.path }, t.path))
                          ] }),
                          /* @__PURE__ */ e("select", { value: Ze, onChange: (t) => Je(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: Sa.map((t) => /* @__PURE__ */ e("option", { value: t.value, children: t.label }, t.value)) }),
                          /* @__PURE__ */ e("input", { value: ht, onChange: (t) => et(t.target.value), placeholder: l.labelOptional, className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                          /* @__PURE__ */ e("input", { value: tt, onChange: (t) => Te(t.target.value), placeholder: l.confirmPartName, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                          /* @__PURE__ */ e(
                            "button",
                            {
                              disabled: F || !Pe || tt !== Pe.replace("/dev/", ""),
                              onClick: () => oe(() => X("/api/storage_manager/format", {
                                device: Pe,
                                fstype: Ze,
                                label: ht || null,
                                confirm_token: tt
                              })),
                              className: "w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl",
                              children: l.runAction
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ r("h3", { className: "text-sm font-bold flex items-center gap-2", children: [
                          /* @__PURE__ */ e($.FolderInput, { className: "w-4 h-4" }),
                          l.mountVolume
                        ] }),
                        /* @__PURE__ */ e("input", { value: Be, onChange: (t) => Ne(t.target.value), placeholder: "/dev/sdb1", className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ e("input", { value: Ie, onChange: (t) => Me(t.target.value), placeholder: l.mountpoint, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ r("select", { value: at, onChange: (t) => ze(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ r("option", { value: "", children: [
                            l.fstype,
                            " (auto)"
                          ] }),
                          Zn.map((t) => /* @__PURE__ */ e("option", { value: t.value, children: t.label }, t.value))
                        ] }),
                        /* @__PURE__ */ e("input", { value: nt, onChange: (t) => Re(t.target.value), placeholder: l.options, className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}` }),
                        /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-xs", children: [
                          /* @__PURE__ */ e("input", { type: "checkbox", checked: rt, onChange: (t) => Ve(t.target.checked) }),
                          l.persistFstab
                        ] }),
                        /* @__PURE__ */ e(
                          "button",
                          {
                            disabled: F || !Be || !Ie,
                            onClick: () => oe(() => X("/api/storage_manager/mount", {
                              device: Be,
                              mountpoint: Ie,
                              fstype: at || null,
                              options: nt,
                              persist_fstab: rt
                            })),
                            className: "w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl",
                            children: l.runAction
                          }
                        )
                      ] }),
                      /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 space-y-3 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                        /* @__PURE__ */ r("h3", { className: "text-sm font-bold flex items-center gap-2", children: [
                          /* @__PURE__ */ e($.FolderOutput, { className: "w-4 h-4" }),
                          l.unmountVolume
                        ] }),
                        aa.length === 0 ? /* @__PURE__ */ e("p", { className: "text-xs opacity-60", children: l.noVolumes }) : /* @__PURE__ */ r("select", { value: Ge, onChange: (t) => gt(t.target.value), className: `w-full rounded-lg border px-3 py-2 text-xs font-mono ${n ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`, children: [
                          /* @__PURE__ */ e("option", { value: "", children: l.selectMount }),
                          aa.map((t) => /* @__PURE__ */ r("option", { value: t.mountpoint, children: [
                            t.mountpoint,
                            " (",
                            t.device,
                            ")"
                          ] }, t.mountpoint))
                        ] }),
                        /* @__PURE__ */ r("label", { className: "flex items-center gap-2 text-xs", children: [
                          /* @__PURE__ */ e("input", { type: "checkbox", checked: lt, onChange: (t) => xt(t.target.checked) }),
                          l.removeFstab
                        ] }),
                        /* @__PURE__ */ e(
                          "button",
                          {
                            disabled: F || !Ge,
                            onClick: () => oe(() => X("/api/storage_manager/unmount", {
                              mountpoint: Ge,
                              remove_fstab: lt
                            })),
                            className: "w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl",
                            children: l.runAction
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ r("div", { className: `rounded-2xl border p-4 ${n ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`, children: [
                      /* @__PURE__ */ e("h3", { className: "text-sm font-bold mb-3", children: l.fstabTitle }),
                      E.length === 0 ? /* @__PURE__ */ e("p", { className: `text-xs ${n ? "text-slate-500" : "text-slate-400"}`, children: "—" }) : /* @__PURE__ */ e("div", { className: "overflow-x-auto", children: /* @__PURE__ */ r("table", { className: "w-full text-left text-[11px] font-mono", children: [
                        /* @__PURE__ */ e("thead", { className: n ? "text-slate-500" : "text-slate-400", children: /* @__PURE__ */ r("tr", { children: [
                          /* @__PURE__ */ e("th", { className: "p-2", children: "spec" }),
                          /* @__PURE__ */ e("th", { className: "p-2", children: "mount" }),
                          /* @__PURE__ */ e("th", { className: "p-2", children: "fstype" }),
                          /* @__PURE__ */ e("th", { className: "p-2", children: "options" })
                        ] }) }),
                        /* @__PURE__ */ e("tbody", { children: E.map((t) => /* @__PURE__ */ r("tr", { className: n ? "border-t border-slate-800" : "border-t border-slate-100", children: [
                          /* @__PURE__ */ e("td", { className: "p-2", children: t.spec }),
                          /* @__PURE__ */ e("td", { className: "p-2", children: t.mountpoint }),
                          /* @__PURE__ */ e("td", { className: "p-2", children: t.fstype }),
                          /* @__PURE__ */ e("td", { className: "p-2", children: t.options })
                        ] }, t.raw)) })
                      ] }) })
                    ] })
                  ] })
                ] }) })
              }
            )
          ]
        }
      )
    }
  );
}
export {
  pr as default
};
