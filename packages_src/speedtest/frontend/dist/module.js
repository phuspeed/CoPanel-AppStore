var Ee = Object.defineProperty;
var je = (e, t, r) => t in e ? Ee(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var M = (e, t, r) => je(e, typeof t != "symbol" ? t + "" : t, r);
import { jsx as u, jsxs as h } from "react/jsx-runtime";
import { createContext as xe, useContext as we, useState as B, useRef as Ae, useCallback as pe, useEffect as fe, useMemo as K } from "react";
import { useOutletContext as Pe } from "react-router-dom";
const Ie = xe(null);
function Le() {
  return we(Ie);
}
const Re = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function ve() {
  const e = Le(), t = Pe();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : Re);
}
function ke(e) {
  var t, r, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (t = 0; t < s; t++) e[t] && (r = ke(e[t])) && (o && (o += " "), o += r);
  } else for (r in e) e[r] && (o && (o += " "), o += r);
  return o;
}
function Ge() {
  for (var e, t, r = 0, o = "", s = arguments.length; r < s; r++) (e = arguments[r]) && (t = ke(e)) && (o && (o += " "), o += t);
  return o;
}
const ne = "-", $e = (e) => {
  const t = Fe(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (i) => {
      const a = i.split(ne);
      return a[0] === "" && a.length !== 1 && a.shift(), Se(a, t) || Ve(i);
    },
    getConflictingClassGroupIds: (i, a) => {
      const d = r[i] || [];
      return a && o[i] ? [...d, ...o[i]] : d;
    }
  };
}, Se = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], o = t.nextPart.get(r), s = o ? Se(e.slice(1), o) : void 0;
  if (s)
    return s;
  if (t.validators.length === 0)
    return;
  const n = e.join(ne);
  return t.validators.find(({
    validator: i
  }) => i(n))?.classGroupId;
}, ge = /^\[(.+)\]$/, Ve = (e) => {
  if (ge.test(e)) {
    const t = ge.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, Fe = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, o = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return We(Object.entries(e.classGroups), r).forEach(([n, i]) => {
    te(i, o, n, t);
  }), o;
}, te = (e, t, r, o) => {
  e.forEach((s) => {
    if (typeof s == "string") {
      const n = s === "" ? t : be(t, s);
      n.classGroupId = r;
      return;
    }
    if (typeof s == "function") {
      if (Oe(s)) {
        te(s(o), t, r, o);
        return;
      }
      t.validators.push({
        validator: s,
        classGroupId: r
      });
      return;
    }
    Object.entries(s).forEach(([n, i]) => {
      te(i, be(t, n), r, o);
    });
  });
}, be = (e, t) => {
  let r = e;
  return t.split(ne).forEach((o) => {
    r.nextPart.has(o) || r.nextPart.set(o, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(o);
  }), r;
}, Oe = (e) => e.isThemeGetter, We = (e, t) => t ? e.map(([r, o]) => {
  const s = o.map((n) => typeof n == "string" ? t + n : typeof n == "object" ? Object.fromEntries(Object.entries(n).map(([i, a]) => [t + i, a])) : n);
  return [r, s];
}) : e, Ue = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  const s = (n, i) => {
    r.set(n, i), t++, t > e && (t = 0, o = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(n) {
      let i = r.get(n);
      if (i !== void 0)
        return i;
      if ((i = o.get(n)) !== void 0)
        return s(n, i), i;
    },
    set(n, i) {
      r.has(n) ? r.set(n, i) : s(n, i);
    }
  };
}, Ce = "!", Be = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, o = t.length === 1, s = t[0], n = t.length, i = (a) => {
    const d = [];
    let m = 0, y = 0, v;
    for (let p = 0; p < a.length; p++) {
      let w = a[p];
      if (m === 0) {
        if (w === s && (o || a.slice(p, p + n) === t)) {
          d.push(a.slice(y, p)), y = p + n;
          continue;
        }
        if (w === "/") {
          v = p;
          continue;
        }
      }
      w === "[" ? m++ : w === "]" && m--;
    }
    const S = d.length === 0 ? a : a.substring(y), C = S.startsWith(Ce), k = C ? S.substring(1) : S, b = v && v > y ? v - y : void 0;
    return {
      modifiers: d,
      hasImportantModifier: C,
      baseClassName: k,
      maybePostfixModifierPosition: b
    };
  };
  return r ? (a) => r({
    className: a,
    parseClassName: i
  }) : i;
}, He = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((o) => {
    o[0] === "[" ? (t.push(...r.sort(), o), r = []) : r.push(o);
  }), t.push(...r.sort()), t;
}, De = (e) => ({
  cache: Ue(e.cacheSize),
  parseClassName: Be(e),
  ...$e(e)
}), qe = /\s+/, Je = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: o,
    getConflictingClassGroupIds: s
  } = t, n = [], i = e.trim().split(qe);
  let a = "";
  for (let d = i.length - 1; d >= 0; d -= 1) {
    const m = i[d], {
      modifiers: y,
      hasImportantModifier: v,
      baseClassName: S,
      maybePostfixModifierPosition: C
    } = r(m);
    let k = !!C, b = o(k ? S.substring(0, C) : S);
    if (!b) {
      if (!k) {
        a = m + (a.length > 0 ? " " + a : a);
        continue;
      }
      if (b = o(S), !b) {
        a = m + (a.length > 0 ? " " + a : a);
        continue;
      }
      k = !1;
    }
    const p = He(y).join(":"), w = v ? p + Ce : p, N = w + b;
    if (n.includes(N))
      continue;
    n.push(N);
    const A = s(b, k);
    for (let T = 0; T < A.length; ++T) {
      const c = A[T];
      n.push(w + c);
    }
    a = m + (a.length > 0 ? " " + a : a);
  }
  return a;
};
function Ye() {
  let e = 0, t, r, o = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = Ne(t)) && (o && (o += " "), o += r);
  return o;
}
const Ne = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (t = Ne(e[o])) && (r && (r += " "), r += t);
  return r;
};
function Xe(e, ...t) {
  let r, o, s, n = i;
  function i(d) {
    const m = t.reduce((y, v) => v(y), e());
    return r = De(m), o = r.cache.get, s = r.cache.set, n = a, a(d);
  }
  function a(d) {
    const m = o(d);
    if (m)
      return m;
    const y = Je(d, r);
    return s(d, y), y;
  }
  return function() {
    return n(Ye.apply(null, arguments));
  };
}
const f = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, Te = /^\[(?:([a-z-]+):)?(.+)\]$/i, Ze = /^\d+\/\d+$/, Ke = /* @__PURE__ */ new Set(["px", "full", "screen"]), Qe = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, et = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, tt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, rt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ot = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, z = (e) => L(e) || Ke.has(e) || Ze.test(e), E = (e) => R(e, "length", ut), L = (e) => !!e && !Number.isNaN(Number(e)), Q = (e) => R(e, "number", L), $ = (e) => !!e && Number.isInteger(Number(e)), nt = (e) => e.endsWith("%") && L(e.slice(0, -1)), l = (e) => Te.test(e), j = (e) => Qe.test(e), st = /* @__PURE__ */ new Set(["length", "size", "percentage"]), it = (e) => R(e, st, _e), at = (e) => R(e, "position", _e), lt = /* @__PURE__ */ new Set(["image", "url"]), ct = (e) => R(e, lt, ft), dt = (e) => R(e, "", pt), V = () => !0, R = (e, t, r) => {
  const o = Te.exec(e);
  return o ? o[1] ? typeof t == "string" ? o[1] === t : t.has(o[1]) : r(o[2]) : !1;
}, ut = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  et.test(e) && !tt.test(e)
), _e = () => !1, pt = (e) => rt.test(e), ft = (e) => ot.test(e), gt = () => {
  const e = f("colors"), t = f("spacing"), r = f("blur"), o = f("brightness"), s = f("borderColor"), n = f("borderRadius"), i = f("borderSpacing"), a = f("borderWidth"), d = f("contrast"), m = f("grayscale"), y = f("hueRotate"), v = f("invert"), S = f("gap"), C = f("gradientColorStops"), k = f("gradientColorStopPositions"), b = f("inset"), p = f("margin"), w = f("opacity"), N = f("padding"), A = f("saturate"), T = f("scale"), c = f("sepia"), P = f("skew"), ie = f("space"), ae = f("translate"), J = () => ["auto", "contain", "none"], Y = () => ["auto", "hidden", "clip", "visible", "scroll"], X = () => ["auto", l, t], g = () => [l, t], le = () => ["", z, E], W = () => ["auto", L, l], ce = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], U = () => ["solid", "dashed", "dotted", "double", "none"], de = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], Z = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], G = () => ["", "0", l], ue = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], _ = () => [L, l];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [V],
      spacing: [z, E],
      blur: ["none", "", j, l],
      brightness: _(),
      borderColor: [e],
      borderRadius: ["none", "", "full", j, l],
      borderSpacing: g(),
      borderWidth: le(),
      contrast: _(),
      grayscale: G(),
      hueRotate: _(),
      invert: G(),
      gap: g(),
      gradientColorStops: [e],
      gradientColorStopPositions: [nt, E],
      inset: X(),
      margin: X(),
      opacity: _(),
      padding: g(),
      saturate: _(),
      scale: _(),
      sepia: G(),
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
        aspect: ["auto", "square", "video", l]
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
        columns: [j]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": ue()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": ue()
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
        object: [...ce(), l]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: Y()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": Y()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": Y()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: J()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": J()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": J()
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
        z: ["auto", $, l]
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
        flex: ["1", "auto", "initial", "none", l]
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
        order: ["first", "last", "none", $, l]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [V]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", $, l]
        }, l]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": W()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": W()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [V]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [$, l]
        }, l]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": W()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": W()
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
        "auto-cols": ["auto", "min", "max", "fr", l]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", l]
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
        justify: ["normal", ...Z()]
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
        content: ["normal", ...Z(), "baseline"]
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
        "place-content": [...Z(), "baseline"]
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
        p: [N]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [N]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [N]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [N]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [N]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [N]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [N]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [N]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [N]
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
        "space-x": [ie]
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
        "space-y": [ie]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", l, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [l, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [l, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [j]
        }, j]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [l, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [l, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [l, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [l, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", j, E]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Q]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [V]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", l]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", L, Q]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", z, l]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", l]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", l]
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
        decoration: [...U(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", z, E]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", z, l]
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
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", l]
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
        content: ["none", l]
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
        bg: [...ce(), at]
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
        bg: ["auto", "cover", "contain", it]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, ct]
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
        from: [k]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [k]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [k]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [C]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [C]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [C]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [n]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [n]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [n]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [n]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [n]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [n]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [n]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [n]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [n]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [n]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [n]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [n]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [n]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [n]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [n]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [a]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [a]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [a]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [a]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [a]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [a]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [a]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [a]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [a]
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
        border: [...U(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [a]
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
        "divide-y": [a]
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
        divide: U()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [s]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [s]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [s]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [s]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [s]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [s]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [s]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [s]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [s]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [s]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...U()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [z, l]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [z, E]
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
        "ring-opacity": [w]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [z, E]
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
        shadow: ["", "inner", "none", j, dt]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [V]
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
        "mix-blend": [...de(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": de()
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
        contrast: [d]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", j, l]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [m]
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
        invert: [v]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [A]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [c]
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
        "backdrop-contrast": [d]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [m]
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
        "backdrop-invert": [v]
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
        "backdrop-saturate": [A]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [c]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", l]
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
        ease: ["linear", "in", "out", "in-out", l]
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
        animate: ["none", "spin", "ping", "pulse", "bounce", l]
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
        rotate: [$, l]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [ae]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [ae]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [P]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [P]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", l]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", l]
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
        "will-change": ["auto", "scroll", "contents", "transform", l]
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
        stroke: [z, E, Q]
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
}, bt = /* @__PURE__ */ Xe(gt);
function x(...e) {
  return bt(Ge(e));
}
const ht = "copanel_mobile_desktop_site";
function mt() {
  try {
    return localStorage.getItem(ht) === "1";
  } catch {
    return !1;
  }
}
function yt(e = window.innerWidth) {
  return mt() || e >= 1024;
}
const xt = xe(null);
function wt() {
  return we(xt);
}
function vt() {
  return wt()?.isWindowed === !0;
}
function kt({ children: e, className: t, constrained: r = !1 }) {
  const { theme: o } = ve(), s = vt(), n = o === "dark", i = !s && !yt();
  return /* @__PURE__ */ u(
    "div",
    {
      className: x(
        "flex flex-col transition-colors duration-200",
        s ? "h-full min-h-0" : i ? "min-h-0" : "min-h-screen",
        n ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !s && r && "mx-auto max-w-7xl",
        t
      ),
      children: e
    }
  );
}
class re extends Error {
  constructor(r, o, s, n) {
    super(o);
    M(this, "code");
    M(this, "status");
    M(this, "details");
    this.code = r, this.status = s, this.details = n;
  }
}
async function H(e, t = {}) {
  const r = typeof window < "u" ? localStorage.getItem("copanel_token") : null, o = {
    "Content-Type": "application/json",
    ...t.headers || {}
  };
  r && (o.Authorization = `Bearer ${r}`);
  const s = {
    method: t.method || "GET",
    headers: o,
    signal: t.signal
  };
  t.body !== void 0 && (s.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body));
  const n = await fetch(e, s);
  let i = null;
  const a = await n.text();
  if (a)
    try {
      i = JSON.parse(a);
    } catch {
      i = a;
    }
  if (t.raw)
    return i;
  if (!n.ok) {
    const d = i && typeof i == "object" && i.error ? i.error : { code: `HTTP_${n.status}`, message: typeof i == "string" ? i : i?.detail || n.statusText };
    throw new re(d.code || `HTTP_${n.status}`, d.message || "Request failed", n.status, d.details);
  }
  if (i && typeof i == "object" && "status" in i) {
    if (i.status === "success")
      return i.data !== void 0 ? i.data : i;
    if (i.status === "error" && i.error)
      throw new re(i.error.code, i.error.message, n.status, i.error.details);
  }
  return i;
}
const St = "copanel-platform-sse-degraded", F = 2e3, Ct = 6e4, Nt = 3;
class Tt {
  constructor() {
    M(this, "source", null);
    M(this, "handlers", /* @__PURE__ */ new Map());
    M(this, "retryDelay", F);
    M(this, "retryTimer", null);
    M(this, "failureCount", 0);
  }
  on(t, r) {
    let o = this.handlers.get(t);
    return o || (o = /* @__PURE__ */ new Set(), this.handlers.set(t, o)), o.add(r), this.ensureConnected(), () => {
      o.delete(r), o.size === 0 && this.handlers.delete(t), this.teardownIfIdle();
    };
  }
  emit(t, r) {
    const o = this.handlers.get(t);
    o && o.forEach((s) => {
      try {
        s(r);
      } catch (n) {
        console.error("event handler failed", t, n);
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
        this.failureCount = 0, this.retryDelay = F;
      }), this.source.addEventListener("jobs", (r) => {
        this.onStreamMessage(), this.parseAndEmit("jobs", r.data);
      }), this.source.addEventListener("notifications", (r) => {
        this.onStreamMessage(), this.parseAndEmit("notifications", r.data);
      }), this.source.addEventListener("message", () => {
        this.onStreamMessage();
      }), this.source.onerror = () => {
        this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Nt && window.dispatchEvent(new CustomEvent(St)), this.scheduleRetry();
      };
    }
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = F;
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
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), Ct), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = F);
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = F, this.handlers.size > 0 && this.ensureConnected();
  }
}
const se = new Tt();
function _t() {
  se.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || _t();
});
function Me(e) {
  let t = e;
  const r = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (o) => {
      const s = typeof o == "function" ? o(t) : o;
      if (!s || Object.keys(s).length === 0) return;
      let n = !1;
      for (const i of Object.keys(s))
        if (t[i] !== s[i]) {
          n = !0;
          break;
        }
      n && (t = { ...t, ...s }, r.forEach((i) => i()));
    },
    subscribe: (o) => (r.add(o), () => r.delete(o))
  };
}
const ze = Me({ jobs: {}, order: [], lastFetch: 0 });
function Mt() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function he(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function I(e, t, r) {
  if (!e || typeof e != "object") return;
  const o = he(e[t], r);
  if (o) return o;
  const s = he(e[`${t}_i18n`], r);
  if (s) return s;
  const n = e[`${t}_${r}`];
  if (typeof n == "string" && n) return n;
  const i = e[`${t}_en`];
  if (typeof i == "string" && i) return i;
  const a = e[`${t}_vi`];
  if (typeof a == "string" && a) return a;
}
function zt(e) {
  const t = Mt(), r = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: I(e, "title", t) || I(r, "title", t) || e?.title || "",
    message: I(e, "message", t) || I(r, "message", t) || e?.message,
    error: I(e, "error", t) || I(r, "error", t) || e?.error || null
  };
}
function me(e) {
  const t = zt(e);
  ze.setState((r) => {
    const o = { ...r.jobs, [t.id]: { ...r.jobs[t.id], ...t } };
    let s = r.order;
    return s.includes(t.id) || (s = [t.id, ...s].slice(0, 200)), { jobs: o, order: s };
  });
}
se.on("jobs", (e) => {
  if (e?.job) {
    me(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = ze.getState().jobs[e.job_id];
    t && me({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const oe = Me({ inbox: [], unread: 0, toasts: [] }), Et = 6e3;
function jt() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function ye(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function D(e, t, r) {
  if (!e || typeof e != "object") return;
  const o = ye(e[t], r);
  if (o) return o;
  const s = ye(e[`${t}_i18n`], r);
  if (s) return s;
  const n = e[`${t}_${r}`];
  if (typeof n == "string" && n) return n;
  const i = e[`${t}_en`];
  if (typeof i == "string" && i) return i;
  const a = e[`${t}_vi`];
  if (typeof a == "string" && a) return a;
}
function At(e) {
  const t = jt(), r = e?.payload && typeof e.payload == "object" ? e.payload : {}, o = D(e, "title", t) || D(r, "title", t) || e?.title || "", s = D(e, "body", t) || D(r, "body", t) || e?.body || null;
  return {
    ...e,
    title: o,
    body: s
  };
}
function Pt(e) {
  oe.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    oe.setState((t) => ({ toasts: t.toasts.filter((r) => r.id !== e.id) }));
  }, Et);
}
se.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = At(e.notification);
    Pt({ ...t, ephemeral: !0 }), oe.setState((r) => ({
      inbox: [t, ...r.inbox].slice(0, 200),
      unread: r.unread + 1
    }));
  }
});
const It = {
  en: {
    title: "Speedtest",
    subtitle: "Measure this VPS uplink — download, upload, and latency.",
    go: "GO",
    again: "Test again",
    stopHint: "Test runs on the server, not your browser.",
    ping: "Ping",
    jitter: "Jitter",
    download: "Download",
    upload: "Upload",
    mbps: "Mbps",
    ms: "ms",
    phaseIdle: "Ready",
    phasePing: "Measuring latency…",
    phaseDownload: "Testing download…",
    phaseUpload: "Testing upload…",
    phaseDone: "Complete",
    history: "Recent results",
    noHistory: "No tests yet — press GO to start.",
    server: "Server",
    client: "VPS egress",
    error: "Test failed",
    running: "Running",
    busy: "A test is already running.",
    clearHint: "Results stay on this VPS only."
  },
  vi: {
    title: "Speedtest",
    subtitle: "Đo tốc độ mạng của VPS — tải xuống, tải lên và độ trễ.",
    go: "BẮT ĐẦU",
    again: "Kiểm tra lại",
    stopHint: "Bài test chạy trên server, không phải trình duyệt của bạn.",
    ping: "Ping",
    jitter: "Jitter",
    download: "Tải xuống",
    upload: "Tải lên",
    mbps: "Mbps",
    ms: "ms",
    phaseIdle: "Sẵn sàng",
    phasePing: "Đang đo độ trễ…",
    phaseDownload: "Đang đo tải xuống…",
    phaseUpload: "Đang đo tải lên…",
    phaseDone: "Hoàn tất",
    history: "Kết quả gần đây",
    noHistory: "Chưa có bài test — nhấn BẮT ĐẦU.",
    server: "Máy chủ",
    client: "IP ra của VPS",
    error: "Kiểm tra thất bại",
    running: "Đang chạy",
    busy: "Đang có bài test khác chạy.",
    clearHint: "Kết quả chỉ lưu trên VPS này."
  }
};
function Lt(e, t) {
  switch (e) {
    case "ping":
      return t.phasePing;
    case "download":
      return t.phaseDownload;
    case "upload":
      return t.phaseUpload;
    case "done":
      return t.phaseDone;
    default:
      return t.phaseIdle;
  }
}
function O(e) {
  return e == null || !Number.isFinite(e) ? "—" : e >= 100 ? e.toFixed(0) : e >= 10 ? e.toFixed(1) : e.toFixed(2);
}
function ee(e) {
  return e == null || !Number.isFinite(e) ? "—" : e < 10 ? e.toFixed(1) : e.toFixed(0);
}
function Rt(e) {
  if (!e) return "—";
  try {
    return new Date(e * 1e3).toLocaleString();
  } catch {
    return "—";
  }
}
function Gt(e) {
  if (e == null || e <= 0) return 0;
  const t = Math.min(1e3, e);
  return Math.min(100, Math.log10(t + 1) / Math.log10(1001) * 100);
}
function $t({
  value: e,
  label: t,
  unit: r,
  isDark: o,
  active: s
}) {
  const n = Gt(e), i = 88, a = 2 * Math.PI * i, d = a * 0.75, m = d - n / 100 * d, y = o ? "#1e293b" : "#e2e8f0", v = s ? "#0ea5e9" : o ? "#38bdf8" : "#0284c7";
  return /* @__PURE__ */ h("div", { className: "relative mx-auto h-56 w-56 sm:h-64 sm:w-64", children: [
    /* @__PURE__ */ h("svg", { viewBox: "0 0 220 220", className: "h-full w-full -rotate-[135deg]", children: [
      /* @__PURE__ */ u(
        "circle",
        {
          cx: "110",
          cy: "110",
          r: i,
          fill: "none",
          stroke: y,
          strokeWidth: "14",
          strokeLinecap: "round",
          strokeDasharray: `${d} ${a}`
        }
      ),
      /* @__PURE__ */ u(
        "circle",
        {
          cx: "110",
          cy: "110",
          r: i,
          fill: "none",
          stroke: v,
          strokeWidth: "14",
          strokeLinecap: "round",
          strokeDasharray: `${d} ${a}`,
          strokeDashoffset: m,
          className: x("transition-[stroke-dashoffset] duration-300", s && "animate-pulse")
        }
      )
    ] }),
    /* @__PURE__ */ h("div", { className: "absolute inset-0 flex rotate-0 flex-col items-center justify-center pt-2", children: [
      /* @__PURE__ */ u(
        "span",
        {
          className: x(
            "text-4xl font-bold tabular-nums tracking-tight sm:text-5xl",
            o ? "text-slate-50" : "text-slate-900"
          ),
          children: O(e)
        }
      ),
      /* @__PURE__ */ u("span", { className: x("mt-1 text-xs font-semibold uppercase tracking-[0.2em]", o ? "text-slate-400" : "text-slate-500"), children: r }),
      /* @__PURE__ */ u("span", { className: x("mt-2 text-sm", o ? "text-slate-400" : "text-slate-500"), children: t })
    ] })
  ] });
}
function q({
  label: e,
  value: t,
  unit: r,
  isDark: o,
  accent: s
}) {
  return /* @__PURE__ */ h(
    "div",
    {
      className: x(
        "flex min-w-0 flex-1 flex-col gap-1 rounded-2xl border px-4 py-3",
        o ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white"
      ),
      children: [
        /* @__PURE__ */ u("span", { className: x("text-[11px] font-semibold uppercase tracking-wider", o ? "text-slate-500" : "text-slate-400"), children: e }),
        /* @__PURE__ */ h("div", { className: "flex items-baseline gap-1.5", children: [
          /* @__PURE__ */ u("span", { className: x("text-2xl font-bold tabular-nums", s || (o ? "text-slate-50" : "text-slate-900")), children: t }),
          /* @__PURE__ */ u("span", { className: x("text-xs font-medium", o ? "text-slate-500" : "text-slate-400"), children: r })
        ] })
      ]
    }
  );
}
function Ut() {
  const { theme: e, language: t } = ve(), r = e === "dark", s = It[t === "vi" ? "vi" : "en"], [n, i] = B(null), [a, d] = B([]), [m, y] = B(null), [v, S] = B(!1), C = Ae(null), k = pe(async () => {
    try {
      const c = await H("/api/speedtest/history?limit=8");
      d(Array.isArray(c) ? c : []);
    } catch {
    }
  }, []);
  fe(() => {
    k(), H("/api/speedtest/status").then((c) => {
      c && (c.status === "running" || c.status === "queued") && i(c);
    }).catch(() => {
    });
  }, [k]);
  const b = pe(() => {
    C.current != null && (window.clearInterval(C.current), C.current = null);
  }, []);
  fe(() => {
    if (!n || n.status !== "running" && n.status !== "queued") {
      b();
      return;
    }
    return b(), C.current = window.setInterval(() => {
      H(`/api/speedtest/status?job_id=${encodeURIComponent(n.id)}`).then((c) => {
        i(c), (c.status === "done" || c.status === "error") && (b(), k(), c.status === "error" && y(c.error || s.error));
      }).catch(() => {
      });
    }, 400), b;
  }, [n?.id, n?.status, k, b, s.error]);
  const p = n?.status === "running" || n?.status === "queued" || v, w = K(() => n ? n.phase === "download" ? n.live_mbps ?? n.download_mbps : n.phase === "upload" ? n.live_mbps ?? n.upload_mbps : n.phase === "done" ? n.download_mbps : null : null, [n]), N = K(() => n ? Lt(n.phase, s) : s.phaseIdle, [n, s]), A = async () => {
    if (!p) {
      y(null), S(!0);
      try {
        const c = await H("/api/speedtest/run", { method: "POST", body: {} });
        i(c);
      } catch (c) {
        const P = c instanceof re ? c.code === "SPEEDTEST_BUSY" ? s.busy : c.message : s.error;
        y(P);
      } finally {
        S(!1);
      }
    }
  }, T = K(() => {
    const c = n?.meta;
    if (!c) return null;
    const P = [c.client_ip, c.colo, c.city, c.country].filter(Boolean);
    return P.length ? P.join(" · ") : null;
  }, [n?.meta]);
  return /* @__PURE__ */ u(kt, { constrained: !0, className: "overflow-hidden", children: /* @__PURE__ */ h("div", { className: x("flex h-full min-h-0 flex-col", r ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"), children: [
    /* @__PURE__ */ h(
      "header",
      {
        className: x(
          "shrink-0 border-b px-5 py-4",
          r ? "border-slate-800 bg-slate-950/80" : "border-slate-200 bg-white/80"
        ),
        children: [
          /* @__PURE__ */ u("h1", { className: "text-lg font-bold tracking-tight", children: s.title }),
          /* @__PURE__ */ u("p", { className: x("mt-0.5 text-sm", r ? "text-slate-400" : "text-slate-500"), children: s.subtitle })
        ]
      }
    ),
    /* @__PURE__ */ u("main", { className: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6", children: /* @__PURE__ */ h("div", { className: "mx-auto flex w-full max-w-xl flex-col items-center gap-6", children: [
      /* @__PURE__ */ u(
        $t,
        {
          value: w,
          label: N,
          unit: s.mbps,
          isDark: r,
          active: p && (n?.phase === "download" || n?.phase === "upload")
        }
      ),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          onClick: A,
          disabled: p,
          className: x(
            "relative flex h-20 w-20 items-center justify-center rounded-full text-sm font-bold tracking-wide transition",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
            p ? r ? "cursor-not-allowed bg-slate-800 text-slate-500" : "cursor-not-allowed bg-slate-200 text-slate-400" : "bg-sky-500 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 active:scale-[0.98]"
          ),
          children: p ? "…" : n?.status === "done" ? s.again : s.go
        }
      ),
      /* @__PURE__ */ u("p", { className: x("text-center text-xs", r ? "text-slate-500" : "text-slate-400"), children: s.stopHint }),
      m && /* @__PURE__ */ u(
        "div",
        {
          className: x(
            "w-full rounded-xl border px-4 py-3 text-sm",
            r ? "border-rose-900/60 bg-rose-950/40 text-rose-300" : "border-rose-200 bg-rose-50 text-rose-700"
          ),
          children: m
        }
      ),
      /* @__PURE__ */ h("div", { className: "grid w-full grid-cols-2 gap-3 sm:grid-cols-4", children: [
        /* @__PURE__ */ u(
          q,
          {
            label: s.ping,
            value: ee(n?.ping_ms),
            unit: s.ms,
            isDark: r,
            accent: r ? "text-emerald-400" : "text-emerald-600"
          }
        ),
        /* @__PURE__ */ u(
          q,
          {
            label: s.jitter,
            value: ee(n?.jitter_ms),
            unit: s.ms,
            isDark: r
          }
        ),
        /* @__PURE__ */ u(
          q,
          {
            label: s.download,
            value: O(n?.download_mbps),
            unit: s.mbps,
            isDark: r,
            accent: r ? "text-sky-400" : "text-sky-600"
          }
        ),
        /* @__PURE__ */ u(
          q,
          {
            label: s.upload,
            value: O(n?.upload_mbps),
            unit: s.mbps,
            isDark: r,
            accent: r ? "text-violet-400" : "text-violet-600"
          }
        )
      ] }),
      (n?.server_name || T) && /* @__PURE__ */ h(
        "div",
        {
          className: x(
            "w-full rounded-2xl border px-4 py-3 text-sm",
            r ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"
          ),
          children: [
            n?.server_name && /* @__PURE__ */ h("p", { children: [
              /* @__PURE__ */ h("span", { className: r ? "text-slate-500" : "text-slate-400", children: [
                s.server,
                ": "
              ] }),
              n.server_name
            ] }),
            T && /* @__PURE__ */ h("p", { className: "mt-1", children: [
              /* @__PURE__ */ h("span", { className: r ? "text-slate-500" : "text-slate-400", children: [
                s.client,
                ": "
              ] }),
              T
            ] })
          ]
        }
      ),
      /* @__PURE__ */ h("section", { className: "w-full", children: [
        /* @__PURE__ */ h("div", { className: "mb-2 flex items-baseline justify-between", children: [
          /* @__PURE__ */ u("h2", { className: "text-sm font-semibold", children: s.history }),
          /* @__PURE__ */ u("span", { className: x("text-[11px]", r ? "text-slate-600" : "text-slate-400"), children: s.clearHint })
        ] }),
        a.length === 0 ? /* @__PURE__ */ u("p", { className: x("rounded-2xl border border-dashed px-4 py-6 text-center text-sm", r ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"), children: s.noHistory }) : /* @__PURE__ */ u("ul", { className: "flex flex-col gap-2", children: a.map((c) => /* @__PURE__ */ h(
          "li",
          {
            className: x(
              "flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm",
              r ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"
            ),
            children: [
              /* @__PURE__ */ h("div", { className: "min-w-0", children: [
                /* @__PURE__ */ u("p", { className: "truncate font-medium", children: c.server_name || "Cloudflare" }),
                /* @__PURE__ */ u("p", { className: x("text-[11px]", r ? "text-slate-500" : "text-slate-400"), children: Rt(c.finished_at) })
              ] }),
              /* @__PURE__ */ h("div", { className: "flex gap-3 tabular-nums", children: [
                /* @__PURE__ */ h("span", { title: s.ping, children: [
                  /* @__PURE__ */ u("span", { className: r ? "text-slate-500" : "text-slate-400", children: "P " }),
                  ee(c.ping_ms)
                ] }),
                /* @__PURE__ */ h("span", { title: s.download, className: r ? "text-sky-400" : "text-sky-600", children: [
                  "↓ ",
                  O(c.download_mbps)
                ] }),
                /* @__PURE__ */ h("span", { title: s.upload, className: r ? "text-violet-400" : "text-violet-600", children: [
                  "↑ ",
                  O(c.upload_mbps)
                ] })
              ] })
            ]
          },
          c.id
        )) })
      ] })
    ] }) })
  ] }) });
}
export {
  Ut as default
};
