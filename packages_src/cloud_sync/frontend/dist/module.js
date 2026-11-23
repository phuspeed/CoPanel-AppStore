import { jsx as o, jsxs as i, Fragment as te } from "react/jsx-runtime";
import { createContext as $e, useContext as Ve, useState as f, useEffect as ie, useRef as He, useLayoutEffect as dt, useCallback as ue, useMemo as De } from "react";
import { useOutletContext as ut } from "react-router-dom";
import * as T from "lucide-react";
import { createPortal as pt } from "react-dom";
const mt = $e(null);
function ht() {
  return Ve(mt);
}
const gt = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function ke() {
  const e = ht(), r = ut();
  return e || (r?.theme ? {
    theme: r.theme,
    setTheme: r.setTheme ?? (() => {
    }),
    language: r.language ?? "en",
    setLanguage: r.setLanguage ?? (() => {
    })
  } : gt);
}
const bt = $e(null);
function Be() {
  return Ve(bt);
}
function Se() {
  return Be()?.isWindowed === !0;
}
function Fe(e) {
  var r, t, s = "";
  if (typeof e == "string" || typeof e == "number") s += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var d = e.length;
    for (r = 0; r < d; r++) e[r] && (t = Fe(e[r])) && (s && (s += " "), s += t);
  } else for (t in e) e[t] && (s && (s += " "), s += t);
  return s;
}
function ft() {
  for (var e, r, t = 0, s = "", d = arguments.length; t < d; t++) (e = arguments[t]) && (r = Fe(e)) && (s && (s += " "), s += r);
  return s;
}
const _e = "-", xt = (e) => {
  const r = yt(e), {
    conflictingClassGroups: t,
    conflictingClassGroupModifiers: s
  } = e;
  return {
    getClassGroupId: (c) => {
      const l = c.split(_e);
      return l[0] === "" && l.length !== 1 && l.shift(), Je(l, r) || wt(c);
    },
    getConflictingClassGroupIds: (c, l) => {
      const h = t[c] || [];
      return l && s[c] ? [...h, ...s[c]] : h;
    }
  };
}, Je = (e, r) => {
  if (e.length === 0)
    return r.classGroupId;
  const t = e[0], s = r.nextPart.get(t), d = s ? Je(e.slice(1), s) : void 0;
  if (d)
    return d;
  if (r.validators.length === 0)
    return;
  const a = e.join(_e);
  return r.validators.find(({
    validator: c
  }) => c(a))?.classGroupId;
}, We = /^\[(.+)\]$/, wt = (e) => {
  if (We.test(e)) {
    const r = We.exec(e)[1], t = r?.substring(0, r.indexOf(":"));
    if (t)
      return "arbitrary.." + t;
  }
}, yt = (e) => {
  const {
    theme: r,
    prefix: t
  } = e, s = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Nt(Object.entries(e.classGroups), t).forEach(([a, c]) => {
    Ne(c, s, a, r);
  }), s;
}, Ne = (e, r, t, s) => {
  e.forEach((d) => {
    if (typeof d == "string") {
      const a = d === "" ? r : Ue(r, d);
      a.classGroupId = t;
      return;
    }
    if (typeof d == "function") {
      if (vt(d)) {
        Ne(d(s), r, t, s);
        return;
      }
      r.validators.push({
        validator: d,
        classGroupId: t
      });
      return;
    }
    Object.entries(d).forEach(([a, c]) => {
      Ne(c, Ue(r, a), t, s);
    });
  });
}, Ue = (e, r) => {
  let t = e;
  return r.split(_e).forEach((s) => {
    t.nextPart.has(s) || t.nextPart.set(s, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), t = t.nextPart.get(s);
  }), t;
}, vt = (e) => e.isThemeGetter, Nt = (e, r) => r ? e.map(([t, s]) => {
  const d = s.map((a) => typeof a == "string" ? r + a : typeof a == "object" ? Object.fromEntries(Object.entries(a).map(([c, l]) => [r + c, l])) : a);
  return [t, d];
}) : e, Ct = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, t = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  const d = (a, c) => {
    t.set(a, c), r++, r > e && (r = 0, s = t, t = /* @__PURE__ */ new Map());
  };
  return {
    get(a) {
      let c = t.get(a);
      if (c !== void 0)
        return c;
      if ((c = s.get(a)) !== void 0)
        return d(a, c), c;
    },
    set(a, c) {
      t.has(a) ? t.set(a, c) : d(a, c);
    }
  };
}, Ke = "!", kt = (e) => {
  const {
    separator: r,
    experimentalParseClassName: t
  } = e, s = r.length === 1, d = r[0], a = r.length, c = (l) => {
    const h = [];
    let w = 0, _ = 0, P;
    for (let b = 0; b < l.length; b++) {
      let N = l[b];
      if (w === 0) {
        if (N === d && (s || l.slice(b, b + a) === r)) {
          h.push(l.slice(_, b)), _ = b + a;
          continue;
        }
        if (N === "/") {
          P = b;
          continue;
        }
      }
      N === "[" ? w++ : N === "]" && w--;
    }
    const k = h.length === 0 ? l : l.substring(_), v = k.startsWith(Ke), E = v ? k.substring(1) : k, S = P && P > _ ? P - _ : void 0;
    return {
      modifiers: h,
      hasImportantModifier: v,
      baseClassName: E,
      maybePostfixModifierPosition: S
    };
  };
  return t ? (l) => t({
    className: l,
    parseClassName: c
  }) : c;
}, St = (e) => {
  if (e.length <= 1)
    return e;
  const r = [];
  let t = [];
  return e.forEach((s) => {
    s[0] === "[" ? (r.push(...t.sort(), s), t = []) : t.push(s);
  }), r.push(...t.sort()), r;
}, _t = (e) => ({
  cache: Ct(e.cacheSize),
  parseClassName: kt(e),
  ...xt(e)
}), At = /\s+/, Tt = (e, r) => {
  const {
    parseClassName: t,
    getClassGroupId: s,
    getConflictingClassGroupIds: d
  } = r, a = [], c = e.trim().split(At);
  let l = "";
  for (let h = c.length - 1; h >= 0; h -= 1) {
    const w = c[h], {
      modifiers: _,
      hasImportantModifier: P,
      baseClassName: k,
      maybePostfixModifierPosition: v
    } = t(w);
    let E = !!v, S = s(E ? k.substring(0, v) : k);
    if (!S) {
      if (!E) {
        l = w + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (S = s(k), !S) {
        l = w + (l.length > 0 ? " " + l : l);
        continue;
      }
      E = !1;
    }
    const b = St(_).join(":"), N = P ? b + Ke : b, A = N + S;
    if (a.includes(A))
      continue;
    a.push(A);
    const W = d(S, E);
    for (let O = 0; O < W.length; ++O) {
      const G = W[O];
      a.push(N + G);
    }
    l = w + (l.length > 0 ? " " + l : l);
  }
  return l;
};
function Pt() {
  let e = 0, r, t, s = "";
  for (; e < arguments.length; )
    (r = arguments[e++]) && (t = qe(r)) && (s && (s += " "), s += t);
  return s;
}
const qe = (e) => {
  if (typeof e == "string")
    return e;
  let r, t = "";
  for (let s = 0; s < e.length; s++)
    e[s] && (r = qe(e[s])) && (t && (t += " "), t += r);
  return t;
};
function Et(e, ...r) {
  let t, s, d, a = c;
  function c(h) {
    const w = r.reduce((_, P) => P(_), e());
    return t = _t(w), s = t.cache.get, d = t.cache.set, a = l, l(h);
  }
  function l(h) {
    const w = s(h);
    if (w)
      return w;
    const _ = Tt(h, t);
    return d(h, _), _;
  }
  return function() {
    return a(Pt.apply(null, arguments));
  };
}
const C = (e) => {
  const r = (t) => t[e] || [];
  return r.isThemeGetter = !0, r;
}, Xe = /^\[(?:([a-z-]+):)?(.+)\]$/i, zt = /^\d+\/\d+$/, Gt = /* @__PURE__ */ new Set(["px", "full", "screen"]), It = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Mt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Ot = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Rt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, jt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, D = (e) => oe(e) || Gt.has(e) || zt.test(e), V = (e) => re(e, "length", Bt), oe = (e) => !!e && !Number.isNaN(Number(e)), ve = (e) => re(e, "number", oe), ae = (e) => !!e && Number.isInteger(Number(e)), Lt = (e) => e.endsWith("%") && oe(e.slice(0, -1)), m = (e) => Xe.test(e), H = (e) => It.test(e), Dt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Wt = (e) => re(e, Dt, Ye), Ut = (e) => re(e, "position", Ye), $t = /* @__PURE__ */ new Set(["image", "url"]), Vt = (e) => re(e, $t, Jt), Ht = (e) => re(e, "", Ft), le = () => !0, re = (e, r, t) => {
  const s = Xe.exec(e);
  return s ? s[1] ? typeof r == "string" ? s[1] === r : r.has(s[1]) : t(s[2]) : !1;
}, Bt = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Mt.test(e) && !Ot.test(e)
), Ye = () => !1, Ft = (e) => Rt.test(e), Jt = (e) => jt.test(e), Kt = () => {
  const e = C("colors"), r = C("spacing"), t = C("blur"), s = C("brightness"), d = C("borderColor"), a = C("borderRadius"), c = C("borderSpacing"), l = C("borderWidth"), h = C("contrast"), w = C("grayscale"), _ = C("hueRotate"), P = C("invert"), k = C("gap"), v = C("gradientColorStops"), E = C("gradientColorStopPositions"), S = C("inset"), b = C("margin"), N = C("opacity"), A = C("padding"), W = C("saturate"), O = C("scale"), G = C("sepia"), K = C("skew"), R = C("space"), q = C("translate"), ne = () => ["auto", "contain", "none"], B = () => ["auto", "hidden", "clip", "visible", "scroll"], X = () => ["auto", m, r], x = () => [m, r], Y = () => ["", D, V], j = () => ["auto", oe, m], F = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Q = () => ["solid", "dashed", "dotted", "double", "none"], J = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], Z = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], U = () => ["", "0", m], se = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], z = () => [oe, m];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [le],
      spacing: [D, V],
      blur: ["none", "", H, m],
      brightness: z(),
      borderColor: [e],
      borderRadius: ["none", "", "full", H, m],
      borderSpacing: x(),
      borderWidth: Y(),
      contrast: z(),
      grayscale: U(),
      hueRotate: z(),
      invert: U(),
      gap: x(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Lt, V],
      inset: X(),
      margin: X(),
      opacity: z(),
      padding: x(),
      saturate: z(),
      scale: z(),
      sepia: U(),
      skew: z(),
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
        aspect: ["auto", "square", "video", m]
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
        columns: [H]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": se()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": se()
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
        object: [...F(), m]
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
        overscroll: ne()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": ne()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": ne()
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
        z: ["auto", ae, m]
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
        flex: ["1", "auto", "initial", "none", m]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: U()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: U()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", ae, m]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [le]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", ae, m]
        }, m]
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
        "grid-rows": [le]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [ae, m]
        }, m]
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
        "auto-cols": ["auto", "min", "max", "fr", m]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", m]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [k]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [k]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [k]
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
        p: [A]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [A]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [A]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [A]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [A]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [A]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [A]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [A]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [A]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", m, r]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [m, r, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [m, r, "none", "full", "min", "max", "fit", "prose", {
          screen: [H]
        }, H]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [m, r, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [m, r, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [m, r, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [m, r, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", H, V]
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
        font: [le]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", m]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", oe, ve]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", D, m]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", m]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", m]
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
        "placeholder-opacity": [N]
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
        "text-opacity": [N]
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
        decoration: ["auto", "from-font", D, V]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", D, m]
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
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", m]
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
        content: ["none", m]
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
        "bg-opacity": [N]
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
        bg: [...F(), Ut]
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
        bg: ["auto", "cover", "contain", Wt]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Vt]
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
        from: [E]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [E]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [E]
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
        "border-opacity": [N]
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
        "divide-opacity": [N]
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
        border: [d]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [d]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [d]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [d]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [d]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [d]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [d]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [d]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [d]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [d]
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
        "outline-offset": [D, m]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [D, V]
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
        ring: Y()
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
        "ring-opacity": [N]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [D, V]
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
        shadow: ["", "inner", "none", H, Ht]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [le]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [N]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...J(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": J()
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
        blur: [t]
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
        "drop-shadow": ["", "none", H, m]
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
        "hue-rotate": [_]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [P]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [W]
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
        "backdrop-blur": [t]
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
        "backdrop-grayscale": [w]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [_]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [P]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [N]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [W]
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
        "border-spacing": [c]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [c]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [c]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", m]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: z()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", m]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: z()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", m]
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
        scale: [O]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [O]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [O]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [ae, m]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [q]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [q]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [K]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [K]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", m]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", m]
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
        "will-change": ["auto", "scroll", "contents", "transform", m]
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
        stroke: [D, V, ve]
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
}, qt = /* @__PURE__ */ Et(Kt);
function u(...e) {
  return qt(ft(e));
}
const Xt = "copanel_mobile_desktop_site";
function Yt() {
  try {
    return localStorage.getItem(Xt) === "1";
  } catch {
    return !1;
  }
}
function Ce(e = window.innerWidth) {
  return Yt() || e >= 1024;
}
function Qt({ children: e, className: r, constrained: t = !1 }) {
  const { theme: s } = ke(), d = Se(), a = s === "dark", c = !d && !Ce();
  return /* @__PURE__ */ o(
    "div",
    {
      className: u(
        "flex flex-col transition-colors duration-200",
        d ? "h-full min-h-0" : c ? "min-h-0" : "min-h-screen",
        a ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !d && t && "mx-auto max-w-7xl",
        r
      ),
      children: e
    }
  );
}
function Zt({
  isDark: e,
  sidebar: r,
  children: t,
  mobileTitle: s,
  className: d
}) {
  const a = Se(), [c, l] = f(!1), [h, w] = f(() => Ce());
  ie(() => {
    const k = () => w(Ce());
    return window.addEventListener("resize", k), () => window.removeEventListener("resize", k);
  }, []);
  const _ = !a && !h;
  ie(() => {
    h && l(!1);
  }, [h]);
  const P = () => l(!1);
  return _ ? /* @__PURE__ */ i("div", { className: u("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", d), children: [
    /* @__PURE__ */ i(
      "div",
      {
        className: u(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2.5",
          e ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white"
        ),
        children: [
          /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              onClick: () => l(!0),
              className: u(
                "inline-flex items-center justify-center rounded-lg p-2",
                e ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ o(T.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          s ? /* @__PURE__ */ o("span", { className: u("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: s }) : null
        ]
      }
    ),
    c ? /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: P
      }
    ) : null,
    /* @__PURE__ */ o(
      "div",
      {
        className: u(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          c ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: P,
        children: r
      }
    ),
    /* @__PURE__ */ o("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: t })
  ] }) : /* @__PURE__ */ i("div", { className: u("flex h-full min-h-0 flex-1 overflow-hidden", d), children: [
    r,
    /* @__PURE__ */ o("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: t })
  ] });
}
const eo = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function pe({
  open: e,
  onClose: r,
  children: t,
  title: s,
  className: d,
  maxWidth: a = "lg",
  closeOnBackdropClick: c = !0
}) {
  const { theme: l } = ke(), h = l === "dark", w = Be(), _ = He(null), [P, k] = f(null);
  dt(() => {
    if (w?.isWindowed) return;
    const A = _.current?.closest(".module-window-viewport");
    k(A instanceof HTMLElement ? A : null);
  }, [w?.isWindowed, e]);
  const v = /* @__PURE__ */ o("span", { ref: _, hidden: !0, "aria-hidden": "true" });
  if (!e) return v;
  const E = !!(w?.isWindowed || P), S = /* @__PURE__ */ o(
    "div",
    {
      className: u(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        E ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: c ? r : void 0,
      children: /* @__PURE__ */ i(
        "div",
        {
          className: u(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            eo[a],
            h ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            d
          ),
          onClick: (A) => A.stopPropagation(),
          children: [
            s && /* @__PURE__ */ i(
              "div",
              {
                className: u(
                  "flex items-center justify-between border-b px-4 py-3",
                  h ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ o("h3", { className: "text-sm font-bold", children: s }),
                  /* @__PURE__ */ o("button", { type: "button", onClick: r, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ o(T.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            t
          ]
        }
      )
    }
  ), b = (w?.isWindowed ? w.viewportRef.current : null) || P || document.body, N = pt(S, b);
  return /* @__PURE__ */ i(te, { children: [
    v,
    N
  ] });
}
const to = [{ id: "google_drive", label: "Google Drive", icon: T.HardDrive }];
function ao() {
  const { theme: e, language: r } = ke(), t = e === "dark", s = Se(), [d, a] = f([]), [c, l] = f(null), [h, w] = f("overview"), [_, P] = f([]), [k, v] = f(null), [E, S] = f(!1), [b, N] = f(!1), [A, W] = f(null), [O, G] = f(null), [K, R] = f(!1), [q, ne] = f(""), [B, X] = f(""), [x, Y] = f(""), [j, F] = f(!1), [Q, J] = f(!1), [Z, U] = f(""), [se, z] = f("upload"), [Ae, me] = f(""), [Te, Pe] = f(""), [Ee, Qe] = f(!0), [ze, Ze] = f(4), [et, he] = f(!1), [Ge, tt] = f("/"), [ot, rt] = f([]), [ge, Ie] = f(null), [Me, ce] = f([]), de = He(null), be = typeof window < "u" ? localStorage.getItem("copanel_token") : null, I = ue(
    () => ({ ...be ? { Authorization: `Bearer ${be}` } : {}, "Content-Type": "application/json" }),
    [be]
  ), p = De(
    () => ({
      en: {
        title: "Cloud Sync",
        subtitle: "Sync folders with Google Drive",
        addAccount: "Add cloud account",
        overview: "Overview",
        tasks: "Task List",
        upToDate: "Ready to sync",
        upToDateHint: "Select a folder sync task or create a new one.",
        cloudType: "Cloud type",
        accountName: "Account",
        noAccounts: "No cloud accounts yet.",
        noAccountsHint: "Click + to connect Google Drive.",
        connectGoogle: "Connect Google Drive",
        connecting: "Opening Google sign-in…",
        providersTitle: "Cloud Providers",
        providersDesc: "Select a cloud service to connect.",
        newTask: "Create sync task",
        runNow: "Run now",
        pairName: "Task name",
        upload: "Upload (NAS → cloud)",
        download: "Download (cloud → NAS)",
        localPath: "Local folder",
        remotePath: "Cloud folder path",
        syncDeletions: "Sync deletions",
        transfers: "Parallel transfers",
        save: "Save",
        cancel: "Cancel",
        browse: "Browse",
        noTasks: "No sync tasks for this account.",
        oauthError: "Could not start Google sign-in.",
        oauthSetupTitle: "Google API setup (one time)",
        oauthSetupDesc: "Create an OAuth client in Google Cloud Console (Web application), add the redirect URI below, then paste Client ID and Secret. After saving, Connect opens Google sign-in.",
        oauthClientId: "Client ID",
        oauthClientSecret: "Client Secret",
        oauthRedirectUri: "Authorized redirect URI",
        oauthSave: "Save & continue",
        oauthCopy: "Copy",
        oauthCopied: "Copied"
      },
      vi: {
        title: "Cloud Sync",
        subtitle: "Đồng bộ thư mục với Google Drive",
        addAccount: "Thêm tài khoản cloud",
        overview: "Tổng quan",
        tasks: "Danh sách tác vụ",
        upToDate: "Sẵn sàng đồng bộ",
        upToDateHint: "Chọn tác vụ đồng bộ hoặc tạo mới.",
        cloudType: "Loại cloud",
        accountName: "Tài khoản",
        noAccounts: "Chưa có tài khoản cloud.",
        noAccountsHint: "Nhấn + để kết nối Google Drive.",
        connectGoogle: "Kết nối Google Drive",
        connecting: "Đang mở đăng nhập Google…",
        providersTitle: "Nhà cung cấp Cloud",
        providersDesc: "Chọn dịch vụ cloud để kết nối.",
        newTask: "Tạo tác vụ đồng bộ",
        runNow: "Chạy ngay",
        pairName: "Tên tác vụ",
        upload: "Upload (NAS → cloud)",
        download: "Download (cloud → NAS)",
        localPath: "Thư mục máy chủ",
        remotePath: "Đường dẫn trên cloud",
        syncDeletions: "Đồng bộ xóa",
        transfers: "Luồng song song",
        save: "Lưu",
        cancel: "Hủy",
        browse: "Duyệt",
        noTasks: "Chưa có tác vụ cho tài khoản này.",
        oauthError: "Không thể mở đăng nhập Google.",
        oauthSetupTitle: "Cấu hình Google API (một lần)",
        oauthSetupDesc: "Tạo OAuth client trên Google Cloud Console (Web application), thêm redirect URI bên dưới, rồi dán Client ID và Secret. Sau khi lưu, Connect sẽ mở đăng nhập Google.",
        oauthClientId: "Client ID",
        oauthClientSecret: "Client Secret",
        oauthRedirectUri: "Authorized redirect URI",
        oauthSave: "Lưu và tiếp tục",
        oauthCopy: "Sao chép",
        oauthCopied: "Đã sao chép"
      }
    })[r === "vi" ? "vi" : "en"],
    [r]
  ), ee = u(
    "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500",
    t ? "border-slate-800 bg-slate-950 text-slate-200" : "border-slate-200 bg-white text-slate-800"
  ), Oe = u("rounded-2xl border p-5 shadow-sm", t ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"), fe = ue(async () => {
    const y = (await (await fetch("/api/cloud_sync/accounts", { headers: I() })).json()).data || [];
    return a(y), y.length && !c && l(y[0].remote_name), y;
  }, [I, c]), Re = ue(async () => {
    const g = await (await fetch("/api/cloud_sync/pairs", { headers: I() })).json();
    P(g.data || []);
  }, [I]);
  ie(() => {
    fe(), Re();
  }, []), ie(() => {
    const n = async (g) => {
      const y = g.data;
      !y || y.type !== "copanel_google_oauth" || (N(!1), S(!1), y.ok && y.remote_name ? (await fe(), l(y.remote_name), v({ text: `Google Drive connected: ${y.remote_name}`, isError: !1 })) : v({ text: String(y.error || p.oauthError), isError: !0 }));
    };
    return window.addEventListener("message", n), () => window.removeEventListener("message", n);
  }, [fe, p.oauthError]), ie(() => {
    de.current && (de.current.scrollTop = de.current.scrollHeight);
  }, [Me]);
  const xe = De(
    () => c ? _.filter((n) => n.remote_name === c) : [],
    [_, c]
  ), nt = ue(async () => {
    const n = window.location.origin, g = `${n}/api/cloud_sync/oauth/google/callback`;
    Y(g);
    try {
      const L = await (await fetch(
        `/api/cloud_sync/oauth/google/config?redirect_origin=${encodeURIComponent(n)}`,
        { headers: I() }
      )).json(), M = !!L?.data?.configured;
      return G(M), R(!M), L?.data?.redirect_uri && Y(L.data.redirect_uri), M;
    } catch {
      return G(!1), R(!0), !1;
    }
  }, [I]), je = async () => {
    S(!0), W(null), v(null), await nt();
  }, Le = async () => {
    N(!0), v(null);
    try {
      const n = await fetch("/api/cloud_sync/oauth/google/connect", {
        method: "POST",
        headers: I(),
        body: JSON.stringify({ redirect_origin: window.location.origin })
      }), g = await n.json();
      if (!n.ok || !g?.data?.auth_url) {
        const $ = g?.error?.code || "", ye = g?.error?.message || g?.detail || g?.message || p.oauthError;
        (n.status === 503 || $ === "OAUTH_NOT_CONFIGURED") && (G(!1), R(!0), Y(`${window.location.origin}/api/cloud_sync/oauth/google/callback`)), v({ text: ye, isError: !0 }), N(!1);
        return;
      }
      G(!0), R(!1);
      const y = g.data.auth_url;
      W(y), window.open(y, "_blank", "width=520,height=720,noopener,noreferrer") || (v({
        text: r === "vi" ? "Trình duyệt đã chặn cửa sổ đăng nhập. Hãy nhấn nút “Mở đăng nhập Google”." : "Your browser blocked the popup. Click “Open Google sign‑in”.",
        isError: !0
      }), N(!1)), window.setTimeout(() => N(!1), 6e4);
    } catch {
      v({ text: p.oauthError, isError: !0 }), N(!1);
    }
  }, st = async () => {
    if (!q.trim() || !B.trim()) {
      v({
        text: r === "vi" ? "Nhập Client ID và Client Secret." : "Enter Client ID and Client Secret.",
        isError: !0
      });
      return;
    }
    F(!0), v(null);
    try {
      const n = await fetch("/api/cloud_sync/oauth/google/config", {
        method: "POST",
        headers: I(),
        body: JSON.stringify({
          client_id: q.trim(),
          client_secret: B.trim(),
          redirect_uri: x,
          redirect_origin: window.location.origin
        })
      }), g = await n.json();
      if (!n.ok || !g?.data?.configured) {
        const y = g?.error?.message || g?.detail || g?.message || p.oauthError;
        v({ text: y, isError: !0 }), F(!1);
        return;
      }
      G(!0), R(!1), X(""), F(!1), await Le();
    } catch {
      v({ text: p.oauthError, isError: !0 }), F(!1);
    }
  }, at = async () => {
    if (O === !1 || K) {
      R(!0);
      return;
    }
    await Le();
  }, we = async (n) => {
    const y = await (await fetch(`/api/cloud_sync/explore?path=${encodeURIComponent(n)}`, { headers: I() })).json();
    rt(y.data && y.data.data || []), tt(y.data && y.data.current_path || n);
  }, lt = async () => {
    if (!c) return;
    (await fetch("/api/cloud_sync/pairs", {
      method: "POST",
      headers: I(),
      body: JSON.stringify({
        pair_name: Z.trim(),
        direction: se,
        local_path: Ae.trim(),
        remote_name: c,
        remote_path: Te.trim(),
        sync_deletions: Ee,
        transfers: ze,
        active: !0
      })
    })).ok && (J(!1), U(""), me(""), Pe(""), Re(), w("tasks"));
  }, it = (n) => {
    Ie(n), ce([]);
    const g = localStorage.getItem("copanel_token") || "", y = g ? `?access_token=${encodeURIComponent(g)}` : "", L = new EventSource(`/api/cloud_sync/stream_pair/${n.id}${y}`);
    L.onmessage = (M) => {
      try {
        const $ = JSON.parse(M.data);
        ce((ye) => [...ye, { text: $.msg || M.data, isError: !!$.error }]), ($.done || $.error) && L.close();
      } catch {
        ce(($) => [...$, { text: M.data, isError: !1 }]);
      }
    }, L.onerror = () => {
      ce((M) => [...M, { text: "Connection lost.", isError: !0 }]), L.close();
    };
  }, ct = d.find((n) => n.remote_name === c);
  return /* @__PURE__ */ i(Qt, { className: "flex min-h-0 flex-col overflow-hidden", children: [
    /* @__PURE__ */ o(
      Zt,
      {
        isDark: t,
        mobileTitle: p.title,
        className: t ? "text-slate-100" : "text-slate-900",
        sidebar: /* @__PURE__ */ i("aside", { className: u("flex h-full w-[220px] shrink-0 flex-col border-r", t ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-slate-50/95"), children: [
          /* @__PURE__ */ i("div", { className: u("flex items-center justify-between border-b px-3 py-3", t ? "border-slate-800" : "border-slate-200"), children: [
            /* @__PURE__ */ i("div", { className: "flex min-w-0 items-center gap-2", children: [
              /* @__PURE__ */ o(T.Cloud, { className: "h-5 w-5 shrink-0 text-indigo-500" }),
              /* @__PURE__ */ o("span", { className: "truncate text-sm font-semibold", children: p.title })
            ] }),
            /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                title: p.addAccount,
                onClick: je,
                className: "flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500",
                children: /* @__PURE__ */ o(T.Plus, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ o("nav", { className: "flex-1 space-y-0.5 overflow-y-auto p-2", children: d.length === 0 ? /* @__PURE__ */ i("p", { className: u("px-2 py-4 text-center text-[11px]", t ? "text-slate-500" : "text-slate-400"), children: [
            p.noAccounts,
            /* @__PURE__ */ o("br", {}),
            p.noAccountsHint
          ] }) : d.map((n) => {
            const g = c === n.remote_name;
            return /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                onClick: () => l(n.remote_name),
                className: u(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs transition",
                  g ? t ? "bg-slate-800 text-white" : "bg-white text-slate-900 shadow-sm" : t ? "text-slate-300 hover:bg-slate-900/70" : "text-slate-700 hover:bg-white/80"
                ),
                children: [
                  /* @__PURE__ */ o(T.HardDrive, { className: u("h-4 w-4 shrink-0", g ? "text-blue-500" : "text-slate-400") }),
                  /* @__PURE__ */ o("span", { className: "min-w-0 flex-1 truncate font-medium", children: n.remote_name }),
                  n.connected && /* @__PURE__ */ o(T.CheckCircle2, { className: "h-3.5 w-3.5 shrink-0 text-emerald-500" })
                ]
              },
              n.remote_name
            );
          }) })
        ] }),
        children: /* @__PURE__ */ o("div", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: c ? /* @__PURE__ */ i(te, { children: [
          /* @__PURE__ */ o("div", { className: u("flex shrink-0 gap-1 border-b px-4 pt-3", t ? "border-slate-800" : "border-slate-200"), children: ["overview", "tasks"].map((n) => /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              onClick: () => w(n),
              className: u(
                "rounded-t-lg px-4 py-2 text-xs font-bold transition",
                h === n ? t ? "bg-slate-800 text-white" : "bg-white text-slate-900 shadow-sm" : t ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"
              ),
              children: n === "overview" ? p.overview : p.tasks
            },
            n
          )) }),
          /* @__PURE__ */ i("main", { className: u("min-h-0 flex-1 overflow-y-auto", s ? "p-4" : "p-4 md:p-6"), children: [
            k && /* @__PURE__ */ i(
              "div",
              {
                className: u(
                  "mb-4 flex items-center gap-2 rounded-xl border p-3 text-xs",
                  k.isError ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-green-500/30 bg-green-500/10 text-green-600"
                ),
                children: [
                  k.isError ? /* @__PURE__ */ o(T.AlertTriangle, { className: "h-4 w-4" }) : /* @__PURE__ */ o(T.CheckCircle, { className: "h-4 w-4" }),
                  k.text
                ]
              }
            ),
            h === "overview" && /* @__PURE__ */ i("div", { className: Oe, children: [
              /* @__PURE__ */ i("div", { className: "mb-6 flex items-start gap-4", children: [
                /* @__PURE__ */ o("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15", children: /* @__PURE__ */ o(T.CheckCircle2, { className: "h-7 w-7 text-emerald-500" }) }),
                /* @__PURE__ */ i("div", { children: [
                  /* @__PURE__ */ o("h2", { className: "text-lg font-bold", children: p.upToDate }),
                  /* @__PURE__ */ o("p", { className: u("text-sm", t ? "text-slate-400" : "text-slate-500"), children: p.upToDateHint })
                ] })
              ] }),
              /* @__PURE__ */ i("dl", { className: u("grid gap-3 text-sm", t ? "text-slate-300" : "text-slate-700"), children: [
                /* @__PURE__ */ i("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ o("dt", { className: "w-28 shrink-0 font-semibold", children: p.cloudType }),
                  /* @__PURE__ */ o("dd", { children: "Google Drive" })
                ] }),
                /* @__PURE__ */ i("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ o("dt", { className: "w-28 shrink-0 font-semibold", children: p.accountName }),
                  /* @__PURE__ */ o("dd", { className: "font-mono", children: ct?.remote_name })
                ] }),
                /* @__PURE__ */ i("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ o("dt", { className: "w-28 shrink-0 font-semibold", children: "Tasks" }),
                  /* @__PURE__ */ o("dd", { children: xe.length })
                ] })
              ] })
            ] }),
            h === "tasks" && /* @__PURE__ */ i("div", { className: Oe, children: [
              /* @__PURE__ */ i("div", { className: "mb-4 flex items-center justify-between", children: [
                /* @__PURE__ */ o("h3", { className: "text-sm font-bold", children: p.tasks }),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    onClick: () => J(!0),
                    className: "rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500",
                    children: [
                      /* @__PURE__ */ o(T.Plus, { className: "mr-1 inline h-3.5 w-3.5" }),
                      p.newTask
                    ]
                  }
                )
              ] }),
              xe.length === 0 ? /* @__PURE__ */ o("p", { className: u("py-8 text-center text-sm", t ? "text-slate-500" : "text-slate-400"), children: p.noTasks }) : /* @__PURE__ */ o("div", { className: "space-y-2", children: xe.map((n) => /* @__PURE__ */ i(
                "div",
                {
                  className: u("rounded-xl border p-4", t ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"),
                  children: [
                    /* @__PURE__ */ o("p", { className: "text-sm font-bold", children: n.pair_name }),
                    /* @__PURE__ */ o("p", { className: u("mt-1 font-mono text-[11px]", t ? "text-slate-400" : "text-slate-600"), children: n.direction === "upload" ? /* @__PURE__ */ i(te, { children: [
                      /* @__PURE__ */ o("span", { className: "text-indigo-400", children: n.local_path }),
                      " → ",
                      /* @__PURE__ */ o("span", { className: "text-emerald-500", children: n.remote_path })
                    ] }) : /* @__PURE__ */ i(te, { children: [
                      /* @__PURE__ */ o("span", { className: "text-emerald-500", children: n.remote_path }),
                      " → ",
                      /* @__PURE__ */ o("span", { className: "text-indigo-400", children: n.local_path })
                    ] }) }),
                    /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        onClick: () => it(n),
                        className: "mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500",
                        children: [
                          /* @__PURE__ */ o(T.Play, { className: "mr-1 inline h-3 w-3" }),
                          p.runNow
                        ]
                      }
                    )
                  ]
                },
                n.id
              )) })
            ] })
          ] })
        ] }) : /* @__PURE__ */ i("main", { className: u("flex min-h-0 flex-1 flex-col items-center justify-center p-8 text-center", t ? "text-slate-400" : "text-slate-500"), children: [
          /* @__PURE__ */ o(T.CloudOff, { className: "mb-3 h-12 w-12 opacity-50" }),
          /* @__PURE__ */ o("p", { className: "text-sm font-medium", children: p.noAccounts }),
          /* @__PURE__ */ o("p", { className: "mb-4 text-xs", children: p.noAccountsHint }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: je,
              className: "rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500",
              children: [
                /* @__PURE__ */ o(T.Plus, { className: "mr-1 inline h-4 w-4" }),
                p.connectGoogle
              ]
            }
          )
        ] }) })
      }
    ),
    /* @__PURE__ */ o(
      pe,
      {
        open: E,
        onClose: () => !b && !j && S(!1),
        title: K ? p.oauthSetupTitle : p.providersTitle,
        maxWidth: "lg",
        children: /* @__PURE__ */ i("div", { className: "space-y-4 p-4", children: [
          K ? /* @__PURE__ */ i(te, { children: [
            /* @__PURE__ */ o("p", { className: u("text-xs leading-relaxed", t ? "text-slate-400" : "text-slate-500"), children: p.oauthSetupDesc }),
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ o("label", { className: u("mb-1 block text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.oauthRedirectUri }),
              /* @__PURE__ */ i("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ o("input", { value: x, readOnly: !0, className: u(ee, "font-mono text-[11px]") }),
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    onClick: async () => {
                      try {
                        await navigator.clipboard.writeText(x), v({ text: p.oauthCopied, isError: !1 });
                      } catch {
                      }
                    },
                    className: "shrink-0 rounded-lg border px-3 text-xs font-bold",
                    children: p.oauthCopy
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ o("label", { className: u("mb-1 block text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.oauthClientId }),
              /* @__PURE__ */ o(
                "input",
                {
                  value: q,
                  onChange: (n) => ne(n.target.value),
                  className: ee,
                  autoComplete: "off",
                  placeholder: "xxxx.apps.googleusercontent.com"
                }
              )
            ] }),
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ o("label", { className: u("mb-1 block text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.oauthClientSecret }),
              /* @__PURE__ */ o(
                "input",
                {
                  type: "password",
                  value: B,
                  onChange: (n) => X(n.target.value),
                  className: ee,
                  autoComplete: "off"
                }
              )
            ] }),
            /* @__PURE__ */ i("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  disabled: j,
                  onClick: () => S(!1),
                  className: u("rounded-lg px-3 py-2 text-xs font-bold", t ? "text-slate-300" : "text-slate-600"),
                  children: p.cancel
                }
              ),
              /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  disabled: j || b,
                  onClick: st,
                  className: "rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-60",
                  children: [
                    j ? /* @__PURE__ */ o(T.Loader2, { className: "mr-1 inline h-3.5 w-3.5 animate-spin" }) : null,
                    p.oauthSave
                  ]
                }
              )
            ] })
          ] }) : /* @__PURE__ */ i(te, { children: [
            /* @__PURE__ */ o("p", { className: u("text-xs", t ? "text-slate-400" : "text-slate-500"), children: p.providersDesc }),
            /* @__PURE__ */ o("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: to.map(({ id: n, label: g, icon: y }) => /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                disabled: b,
                onClick: at,
                className: u(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition hover:border-indigo-500 hover:bg-indigo-500/5",
                  t ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50",
                  b && "opacity-60"
                ),
                children: [
                  /* @__PURE__ */ o(y, { className: "h-10 w-10 text-blue-500" }),
                  /* @__PURE__ */ o("span", { className: "text-xs font-semibold", children: g })
                ]
              },
              n
            )) }),
            b && /* @__PURE__ */ i("p", { className: u("flex items-center gap-2 text-xs", t ? "text-indigo-300" : "text-indigo-600"), children: [
              /* @__PURE__ */ o(T.Loader2, { className: "h-4 w-4 animate-spin" }),
              p.connecting
            ] }),
            !b && A && /* @__PURE__ */ o("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ o(
              "a",
              {
                href: A,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500",
                children: r === "vi" ? "Mở đăng nhập Google" : "Open Google sign‑in"
              }
            ) })
          ] }),
          k && E && /* @__PURE__ */ o("p", { className: u("text-xs", k.isError ? "text-rose-500" : "text-emerald-600"), children: k.text })
        ] })
      }
    ),
    /* @__PURE__ */ i(pe, { open: Q, onClose: () => J(!1), title: p.newTask, maxWidth: "xl", className: "max-h-[85vh] max-w-xl", children: [
      /* @__PURE__ */ i("div", { className: "space-y-4 p-4", children: [
        /* @__PURE__ */ i("div", { children: [
          /* @__PURE__ */ o("label", { className: u("text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.pairName }),
          /* @__PURE__ */ o("input", { value: Z, onChange: (n) => U(n.target.value), className: ee })
        ] }),
        /* @__PURE__ */ o("div", { className: "grid grid-cols-2 gap-2", children: ["upload", "download"].map((n) => /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            onClick: () => z(n),
            className: u(
              "rounded-xl border px-3 py-2 text-xs font-bold",
              se === n ? "border-indigo-500 bg-indigo-500/10" : t ? "border-slate-800" : "border-slate-300"
            ),
            children: n === "upload" ? p.upload : p.download
          },
          n
        )) }),
        /* @__PURE__ */ i("div", { children: [
          /* @__PURE__ */ o("label", { className: u("text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.localPath }),
          /* @__PURE__ */ i("div", { className: "mt-1 flex gap-2", children: [
            /* @__PURE__ */ o("input", { value: Ae, onChange: (n) => me(n.target.value), className: u(ee, "flex-1 font-mono"), placeholder: "/var/www" }),
            /* @__PURE__ */ o("button", { type: "button", onClick: () => {
              we("/"), he(!0);
            }, className: "rounded-lg bg-indigo-600 px-3 text-white", children: /* @__PURE__ */ o(T.FolderSearch, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ i("div", { children: [
          /* @__PURE__ */ o("label", { className: u("text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.remotePath }),
          /* @__PURE__ */ o("input", { value: Te, onChange: (n) => Pe(n.target.value), className: u(ee, "font-mono"), placeholder: "Backups/MySite" })
        ] }),
        /* @__PURE__ */ i("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ i("label", { className: u("flex items-center justify-between rounded-xl border p-3 text-xs", t ? "border-slate-800" : "border-slate-200"), children: [
            p.syncDeletions,
            /* @__PURE__ */ o("input", { type: "checkbox", checked: Ee, onChange: (n) => Qe(n.target.checked), className: "accent-indigo-600" })
          ] }),
          /* @__PURE__ */ i("div", { className: u("flex items-center justify-between rounded-xl border p-3 text-xs", t ? "border-slate-800" : "border-slate-200"), children: [
            p.transfers,
            /* @__PURE__ */ o(
              "input",
              {
                type: "number",
                min: 1,
                max: 32,
                value: ze,
                onChange: (n) => Ze(Math.max(1, parseInt(n.target.value, 10) || 4)),
                className: u("w-16 rounded border px-2 py-1 text-center font-mono", t ? "border-slate-700 bg-slate-950" : "border-slate-300")
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i("div", { className: u("flex justify-end gap-2 border-t p-3", t ? "border-slate-800" : "border-slate-200"), children: [
        /* @__PURE__ */ o("button", { type: "button", onClick: () => J(!1), className: u("rounded-xl border px-4 py-2 text-xs font-bold", t ? "border-slate-700" : "border-slate-300"), children: p.cancel }),
        /* @__PURE__ */ o("button", { type: "button", onClick: lt, className: "rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500", children: p.save })
      ] })
    ] }),
    /* @__PURE__ */ i(pe, { open: et, onClose: () => he(!1), title: p.browse, maxWidth: "2xl", className: "flex h-[70vh] max-w-2xl flex-col overflow-hidden", children: [
      /* @__PURE__ */ i("div", { className: u("flex items-center gap-2 border-b p-2 font-mono text-xs", t ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-100"), children: [
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            onClick: () => {
              const n = Ge.replace(/\\/g, "/").split("/").filter(Boolean);
              n.pop(), we("/" + n.join("/") || "/");
            },
            className: "rounded p-1 hover:bg-slate-500/20",
            children: /* @__PURE__ */ o(T.CornerLeftUp, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ o("span", { className: "truncate", children: Ge })
      ] }),
      /* @__PURE__ */ o("div", { className: "flex-1 overflow-y-auto p-2", children: ot.map((n) => /* @__PURE__ */ i(
        "div",
        {
          onClick: () => n.type === "folder" && we(n.path),
          className: u("flex cursor-pointer items-center justify-between rounded-lg p-2.5", t ? "hover:bg-slate-800" : "hover:bg-slate-100"),
          children: [
            /* @__PURE__ */ i("div", { className: "flex min-w-0 items-center gap-2", children: [
              n.type === "folder" ? /* @__PURE__ */ o(T.Folder, { className: "h-5 w-5 text-yellow-500" }) : /* @__PURE__ */ o(T.File, { className: "h-5 w-5 text-slate-400" }),
              /* @__PURE__ */ o("span", { className: "truncate text-xs", children: n.name })
            ] }),
            n.type === "folder" && /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                onClick: (g) => {
                  g.stopPropagation(), me(n.path), he(!1);
                },
                className: "rounded bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white",
                children: "Select"
              }
            )
          ]
        },
        n.path
      )) })
    ] }),
    ge && /* @__PURE__ */ o(pe, { open: !!ge, onClose: () => Ie(null), title: `${p.runNow} — ${ge.pair_name}`, maxWidth: "2xl", children: /* @__PURE__ */ o("div", { ref: de, className: u("m-4 h-64 overflow-y-auto rounded-xl border p-3 font-mono text-[10px] text-green-400", t ? "border-slate-800 bg-slate-950" : "bg-slate-900"), children: Me.map((n, g) => /* @__PURE__ */ o("div", { className: n.isError ? "text-red-400" : "", children: n.text }, g)) }) })
  ] });
}
export {
  ao as default
};
