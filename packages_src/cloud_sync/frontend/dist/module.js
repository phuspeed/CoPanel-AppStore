import { jsx as o, jsxs as c, Fragment as se } from "react/jsx-runtime";
import { createContext as He, useContext as Ve, useState as x, useEffect as ie, useRef as dt, useCallback as ue, useMemo as Le } from "react";
import { useOutletContext as ut } from "react-router-dom";
import * as A from "lucide-react";
import { createPortal as We } from "react-dom";
const pt = He(null);
function mt() {
  return Ve(pt);
}
const ht = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function ke() {
  const e = mt(), r = ut();
  return e || (r?.theme ? {
    theme: r.theme,
    setTheme: r.setTheme ?? (() => {
    }),
    language: r.language ?? "en",
    setLanguage: r.setLanguage ?? (() => {
    })
  } : ht);
}
const gt = He(null);
function Be() {
  return Ve(gt);
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
function bt() {
  for (var e, r, t = 0, s = "", d = arguments.length; t < d; t++) (e = arguments[t]) && (r = Fe(e)) && (s && (s += " "), s += r);
  return s;
}
const _e = "-", ft = (e) => {
  const r = wt(e), {
    conflictingClassGroups: t,
    conflictingClassGroupModifiers: s
  } = e;
  return {
    getClassGroupId: (i) => {
      const l = i.split(_e);
      return l[0] === "" && l.length !== 1 && l.shift(), Je(l, r) || xt(i);
    },
    getConflictingClassGroupIds: (i, l) => {
      const h = t[i] || [];
      return l && s[i] ? [...h, ...s[i]] : h;
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
    validator: i
  }) => i(a))?.classGroupId;
}, Ue = /^\[(.+)\]$/, xt = (e) => {
  if (Ue.test(e)) {
    const r = Ue.exec(e)[1], t = r?.substring(0, r.indexOf(":"));
    if (t)
      return "arbitrary.." + t;
  }
}, wt = (e) => {
  const {
    theme: r,
    prefix: t
  } = e, s = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return vt(Object.entries(e.classGroups), t).forEach(([a, i]) => {
    Ne(i, s, a, r);
  }), s;
}, Ne = (e, r, t, s) => {
  e.forEach((d) => {
    if (typeof d == "string") {
      const a = d === "" ? r : $e(r, d);
      a.classGroupId = t;
      return;
    }
    if (typeof d == "function") {
      if (yt(d)) {
        Ne(d(s), r, t, s);
        return;
      }
      r.validators.push({
        validator: d,
        classGroupId: t
      });
      return;
    }
    Object.entries(d).forEach(([a, i]) => {
      Ne(i, $e(r, a), t, s);
    });
  });
}, $e = (e, r) => {
  let t = e;
  return r.split(_e).forEach((s) => {
    t.nextPart.has(s) || t.nextPart.set(s, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), t = t.nextPart.get(s);
  }), t;
}, yt = (e) => e.isThemeGetter, vt = (e, r) => r ? e.map(([t, s]) => {
  const d = s.map((a) => typeof a == "string" ? r + a : typeof a == "object" ? Object.fromEntries(Object.entries(a).map(([i, l]) => [r + i, l])) : a);
  return [t, d];
}) : e, Nt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, t = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  const d = (a, i) => {
    t.set(a, i), r++, r > e && (r = 0, s = t, t = /* @__PURE__ */ new Map());
  };
  return {
    get(a) {
      let i = t.get(a);
      if (i !== void 0)
        return i;
      if ((i = s.get(a)) !== void 0)
        return d(a, i), i;
    },
    set(a, i) {
      t.has(a) ? t.set(a, i) : d(a, i);
    }
  };
}, Ke = "!", Ct = (e) => {
  const {
    separator: r,
    experimentalParseClassName: t
  } = e, s = r.length === 1, d = r[0], a = r.length, i = (l) => {
    const h = [];
    let y = 0, N = 0, T;
    for (let b = 0; b < l.length; b++) {
      let C = l[b];
      if (y === 0) {
        if (C === d && (s || l.slice(b, b + a) === r)) {
          h.push(l.slice(N, b)), N = b + a;
          continue;
        }
        if (C === "/") {
          T = b;
          continue;
        }
      }
      C === "[" ? y++ : C === "]" && y--;
    }
    const k = h.length === 0 ? l : l.substring(N), S = k.startsWith(Ke), E = S ? k.substring(1) : k, _ = T && T > N ? T - N : void 0;
    return {
      modifiers: h,
      hasImportantModifier: S,
      baseClassName: E,
      maybePostfixModifierPosition: _
    };
  };
  return t ? (l) => t({
    className: l,
    parseClassName: i
  }) : i;
}, kt = (e) => {
  if (e.length <= 1)
    return e;
  const r = [];
  let t = [];
  return e.forEach((s) => {
    s[0] === "[" ? (r.push(...t.sort(), s), t = []) : t.push(s);
  }), r.push(...t.sort()), r;
}, St = (e) => ({
  cache: Nt(e.cacheSize),
  parseClassName: Ct(e),
  ...ft(e)
}), _t = /\s+/, At = (e, r) => {
  const {
    parseClassName: t,
    getClassGroupId: s,
    getConflictingClassGroupIds: d
  } = r, a = [], i = e.trim().split(_t);
  let l = "";
  for (let h = i.length - 1; h >= 0; h -= 1) {
    const y = i[h], {
      modifiers: N,
      hasImportantModifier: T,
      baseClassName: k,
      maybePostfixModifierPosition: S
    } = t(y);
    let E = !!S, _ = s(E ? k.substring(0, S) : k);
    if (!_) {
      if (!E) {
        l = y + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (_ = s(k), !_) {
        l = y + (l.length > 0 ? " " + l : l);
        continue;
      }
      E = !1;
    }
    const b = kt(N).join(":"), C = T ? b + Ke : b, P = C + _;
    if (a.includes(P))
      continue;
    a.push(P);
    const W = d(_, E);
    for (let O = 0; O < W.length; ++O) {
      const G = W[O];
      a.push(C + G);
    }
    l = y + (l.length > 0 ? " " + l : l);
  }
  return l;
};
function Tt() {
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
function Pt(e, ...r) {
  let t, s, d, a = i;
  function i(h) {
    const y = r.reduce((N, T) => T(N), e());
    return t = St(y), s = t.cache.get, d = t.cache.set, a = l, l(h);
  }
  function l(h) {
    const y = s(h);
    if (y)
      return y;
    const N = At(h, t);
    return d(h, N), N;
  }
  return function() {
    return a(Tt.apply(null, arguments));
  };
}
const v = (e) => {
  const r = (t) => t[e] || [];
  return r.isThemeGetter = !0, r;
}, Xe = /^\[(?:([a-z-]+):)?(.+)\]$/i, Et = /^\d+\/\d+$/, zt = /* @__PURE__ */ new Set(["px", "full", "screen"]), Gt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, It = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Mt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Ot = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Rt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, L = (e) => te(e) || zt.has(e) || Et.test(e), H = (e) => oe(e, "length", Vt), te = (e) => !!e && !Number.isNaN(Number(e)), ve = (e) => oe(e, "number", te), ae = (e) => !!e && Number.isInteger(Number(e)), jt = (e) => e.endsWith("%") && te(e.slice(0, -1)), m = (e) => Xe.test(e), V = (e) => Gt.test(e), Dt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Lt = (e) => oe(e, Dt, Ye), Wt = (e) => oe(e, "position", Ye), Ut = /* @__PURE__ */ new Set(["image", "url"]), $t = (e) => oe(e, Ut, Ft), Ht = (e) => oe(e, "", Bt), le = () => !0, oe = (e, r, t) => {
  const s = Xe.exec(e);
  return s ? s[1] ? typeof r == "string" ? s[1] === r : r.has(s[1]) : t(s[2]) : !1;
}, Vt = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  It.test(e) && !Mt.test(e)
), Ye = () => !1, Bt = (e) => Ot.test(e), Ft = (e) => Rt.test(e), Jt = () => {
  const e = v("colors"), r = v("spacing"), t = v("blur"), s = v("brightness"), d = v("borderColor"), a = v("borderRadius"), i = v("borderSpacing"), l = v("borderWidth"), h = v("contrast"), y = v("grayscale"), N = v("hueRotate"), T = v("invert"), k = v("gap"), S = v("gradientColorStops"), E = v("gradientColorStopPositions"), _ = v("inset"), b = v("margin"), C = v("opacity"), P = v("padding"), W = v("saturate"), O = v("scale"), G = v("sepia"), K = v("skew"), R = v("space"), q = v("translate"), re = () => ["auto", "contain", "none"], B = () => ["auto", "hidden", "clip", "visible", "scroll"], X = () => ["auto", m, r], f = () => [m, r], Y = () => ["", L, H], j = () => ["auto", te, m], F = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Q = () => ["solid", "dashed", "dotted", "double", "none"], J = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], Z = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], U = () => ["", "0", m], ne = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], z = () => [te, m];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [le],
      spacing: [L, H],
      blur: ["none", "", V, m],
      brightness: z(),
      borderColor: [e],
      borderRadius: ["none", "", "full", V, m],
      borderSpacing: f(),
      borderWidth: Y(),
      contrast: z(),
      grayscale: U(),
      hueRotate: z(),
      invert: U(),
      gap: f(),
      gradientColorStops: [e],
      gradientColorStopPositions: [jt, H],
      inset: X(),
      margin: X(),
      opacity: z(),
      padding: f(),
      saturate: z(),
      scale: z(),
      sepia: U(),
      skew: z(),
      space: f(),
      translate: f()
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
        columns: [V]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": ne()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": ne()
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
        overscroll: re()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": re()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": re()
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
        inset: [_]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [_]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [_]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [_]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [_]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [_]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [_]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [_]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [_]
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
        p: [P]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [P]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [P]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [P]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [P]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [P]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [P]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [P]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [P]
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
          screen: [V]
        }, V]
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
        text: ["base", V, H]
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
        "line-clamp": ["none", te, ve]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", L, m]
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
        decoration: [...Q(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", L, H]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", L, m]
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
        indent: f()
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
        bg: [...F(), Wt]
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
        bg: ["auto", "cover", "contain", Lt]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, $t]
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
        from: [S]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [S]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [S]
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
        "border-opacity": [C]
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
        "divide-opacity": [C]
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
        "outline-offset": [L, m]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [L, H]
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
        "ring-opacity": [C]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [L, H]
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
        shadow: ["", "inner", "none", V, Ht]
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
        opacity: [C]
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
        "drop-shadow": ["", "none", V, m]
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
        "hue-rotate": [N]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [T]
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
        "backdrop-grayscale": [y]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [N]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [T]
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
        "scroll-m": f()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": f()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": f()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": f()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": f()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": f()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": f()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": f()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": f()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": f()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": f()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": f()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": f()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": f()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": f()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": f()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": f()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": f()
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
        stroke: [L, H, ve]
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
}, Kt = /* @__PURE__ */ Pt(Jt);
function u(...e) {
  return Kt(bt(e));
}
const qt = "copanel_mobile_desktop_site";
function Xt() {
  try {
    return localStorage.getItem(qt) === "1";
  } catch {
    return !1;
  }
}
function Ce(e = window.innerWidth) {
  return Xt() || e >= 1024;
}
function Yt({ children: e, className: r, constrained: t = !1 }) {
  const { theme: s } = ke(), d = Se(), a = s === "dark", i = !d && !Ce();
  return /* @__PURE__ */ o(
    "div",
    {
      className: u(
        "flex flex-col transition-colors duration-200",
        d ? "h-full min-h-0" : i ? "min-h-0" : "min-h-screen",
        a ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !d && t && "mx-auto max-w-7xl",
        r
      ),
      children: e
    }
  );
}
function Qt({
  isDark: e,
  sidebar: r,
  children: t,
  mobileTitle: s,
  className: d
}) {
  const a = Se(), [i, l] = x(!1), [h, y] = x(() => Ce());
  ie(() => {
    const k = () => y(Ce());
    return window.addEventListener("resize", k), () => window.removeEventListener("resize", k);
  }, []);
  const N = !a && !h;
  ie(() => {
    h && l(!1);
  }, [h]);
  const T = () => l(!1);
  return N ? /* @__PURE__ */ c("div", { className: u("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", d), children: [
    /* @__PURE__ */ c(
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
              children: /* @__PURE__ */ o(A.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          s ? /* @__PURE__ */ o("span", { className: u("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: s }) : null
        ]
      }
    ),
    i ? /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: T
      }
    ) : null,
    /* @__PURE__ */ o(
      "div",
      {
        className: u(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          i ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: T,
        children: r
      }
    ),
    /* @__PURE__ */ o("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: t })
  ] }) : /* @__PURE__ */ c("div", { className: u("flex h-full min-h-0 flex-1 overflow-hidden", d), children: [
    r,
    /* @__PURE__ */ o("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: t })
  ] });
}
const Zt = {
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
  closeOnBackdropClick: i = !0
}) {
  const { theme: l } = ke(), h = l === "dark", y = Be();
  if (!e) return null;
  const N = /* @__PURE__ */ o(
    "div",
    {
      className: u(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        y?.isWindowed ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: i ? r : void 0,
      children: /* @__PURE__ */ c(
        "div",
        {
          className: u(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            Zt[a],
            h ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            d
          ),
          onClick: (T) => T.stopPropagation(),
          children: [
            s && /* @__PURE__ */ c(
              "div",
              {
                className: u(
                  "flex items-center justify-between border-b px-4 py-3",
                  h ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ o("h3", { className: "text-sm font-bold", children: s }),
                  /* @__PURE__ */ o("button", { type: "button", onClick: r, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ o(A.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            t
          ]
        }
      )
    }
  );
  return y?.isWindowed && y.viewportRef.current ? We(N, y.viewportRef.current) : We(N, document.body);
}
const eo = [{ id: "google_drive", label: "Google Drive", icon: A.HardDrive }];
function so() {
  const { theme: e, language: r } = ke(), t = e === "dark", s = Se(), [d, a] = x([]), [i, l] = x(null), [h, y] = x("overview"), [N, T] = x([]), [k, S] = x(null), [E, _] = x(!1), [b, C] = x(!1), [P, W] = x(null), [O, G] = x(null), [K, R] = x(!1), [q, re] = x(""), [B, X] = x(""), [f, Y] = x(""), [j, F] = x(!1), [Q, J] = x(!1), [Z, U] = x(""), [ne, z] = x("upload"), [Ae, me] = x(""), [Te, Pe] = x(""), [Ee, Qe] = x(!0), [ze, Ze] = x(4), [et, he] = x(!1), [Ge, tt] = x("/"), [ot, rt] = x([]), [ge, Ie] = x(null), [Me, ce] = x([]), de = dt(null), be = typeof window < "u" ? localStorage.getItem("copanel_token") : null, I = ue(
    () => ({ ...be ? { Authorization: `Bearer ${be}` } : {}, "Content-Type": "application/json" }),
    [be]
  ), p = Le(
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
    const w = (await (await fetch("/api/cloud_sync/accounts", { headers: I() })).json()).data || [];
    return a(w), w.length && !i && l(w[0].remote_name), w;
  }, [I, i]), Re = ue(async () => {
    const g = await (await fetch("/api/cloud_sync/pairs", { headers: I() })).json();
    T(g.data || []);
  }, [I]);
  ie(() => {
    fe(), Re();
  }, []), ie(() => {
    const n = async (g) => {
      const w = g.data;
      !w || w.type !== "copanel_google_oauth" || (C(!1), _(!1), w.ok && w.remote_name ? (await fe(), l(w.remote_name), S({ text: `Google Drive connected: ${w.remote_name}`, isError: !1 })) : S({ text: String(w.error || p.oauthError), isError: !0 }));
    };
    return window.addEventListener("message", n), () => window.removeEventListener("message", n);
  }, [fe, p.oauthError]), ie(() => {
    de.current && (de.current.scrollTop = de.current.scrollHeight);
  }, [Me]);
  const xe = Le(
    () => i ? N.filter((n) => n.remote_name === i) : [],
    [N, i]
  ), nt = ue(async () => {
    const n = window.location.origin, g = `${n}/api/cloud_sync/oauth/google/callback`;
    Y(g);
    try {
      const D = await (await fetch(
        `/api/cloud_sync/oauth/google/config?redirect_origin=${encodeURIComponent(n)}`,
        { headers: I() }
      )).json(), M = !!D?.data?.configured;
      return G(M), R(!M), D?.data?.redirect_uri && Y(D.data.redirect_uri), M;
    } catch {
      return G(!1), R(!0), !1;
    }
  }, [I]), je = async () => {
    _(!0), W(null), S(null), await nt();
  }, De = async () => {
    C(!0), S(null);
    try {
      const n = await fetch("/api/cloud_sync/oauth/google/connect", {
        method: "POST",
        headers: I(),
        body: JSON.stringify({ redirect_origin: window.location.origin })
      }), g = await n.json();
      if (!n.ok || !g?.data?.auth_url) {
        const $ = g?.error?.code || "", ye = g?.error?.message || g?.detail || g?.message || p.oauthError;
        (n.status === 503 || $ === "OAUTH_NOT_CONFIGURED") && (G(!1), R(!0), Y(`${window.location.origin}/api/cloud_sync/oauth/google/callback`)), S({ text: ye, isError: !0 }), C(!1);
        return;
      }
      G(!0), R(!1);
      const w = g.data.auth_url;
      W(w), window.open(w, "_blank", "width=520,height=720,noopener,noreferrer") || (S({
        text: r === "vi" ? "Trình duyệt đã chặn cửa sổ đăng nhập. Hãy nhấn nút “Mở đăng nhập Google”." : "Your browser blocked the popup. Click “Open Google sign‑in”.",
        isError: !0
      }), C(!1)), window.setTimeout(() => C(!1), 6e4);
    } catch {
      S({ text: p.oauthError, isError: !0 }), C(!1);
    }
  }, st = async () => {
    if (!q.trim() || !B.trim()) {
      S({
        text: r === "vi" ? "Nhập Client ID và Client Secret." : "Enter Client ID and Client Secret.",
        isError: !0
      });
      return;
    }
    F(!0), S(null);
    try {
      const n = await fetch("/api/cloud_sync/oauth/google/config", {
        method: "POST",
        headers: I(),
        body: JSON.stringify({
          client_id: q.trim(),
          client_secret: B.trim(),
          redirect_uri: f,
          redirect_origin: window.location.origin
        })
      }), g = await n.json();
      if (!n.ok || !g?.data?.configured) {
        const w = g?.error?.message || g?.detail || g?.message || p.oauthError;
        S({ text: w, isError: !0 }), F(!1);
        return;
      }
      G(!0), R(!1), X(""), F(!1), await De();
    } catch {
      S({ text: p.oauthError, isError: !0 }), F(!1);
    }
  }, at = async () => {
    if (O === !1 || K) {
      R(!0);
      return;
    }
    await De();
  }, we = async (n) => {
    const w = await (await fetch(`/api/cloud_sync/explore?path=${encodeURIComponent(n)}`, { headers: I() })).json();
    rt(w.data && w.data.data || []), tt(w.data && w.data.current_path || n);
  }, lt = async () => {
    if (!i) return;
    (await fetch("/api/cloud_sync/pairs", {
      method: "POST",
      headers: I(),
      body: JSON.stringify({
        pair_name: Z.trim(),
        direction: ne,
        local_path: Ae.trim(),
        remote_name: i,
        remote_path: Te.trim(),
        sync_deletions: Ee,
        transfers: ze,
        active: !0
      })
    })).ok && (J(!1), U(""), me(""), Pe(""), Re(), y("tasks"));
  }, it = (n) => {
    Ie(n), ce([]);
    const g = localStorage.getItem("copanel_token") || "", w = g ? `?access_token=${encodeURIComponent(g)}` : "", D = new EventSource(`/api/cloud_sync/stream_pair/${n.id}${w}`);
    D.onmessage = (M) => {
      try {
        const $ = JSON.parse(M.data);
        ce((ye) => [...ye, { text: $.msg || M.data, isError: !!$.error }]), ($.done || $.error) && D.close();
      } catch {
        ce(($) => [...$, { text: M.data, isError: !1 }]);
      }
    }, D.onerror = () => {
      ce((M) => [...M, { text: "Connection lost.", isError: !0 }]), D.close();
    };
  }, ct = d.find((n) => n.remote_name === i);
  return /* @__PURE__ */ c(Yt, { className: "flex min-h-0 flex-col overflow-hidden", children: [
    /* @__PURE__ */ o(
      Qt,
      {
        isDark: t,
        mobileTitle: p.title,
        className: t ? "text-slate-100" : "text-slate-900",
        sidebar: /* @__PURE__ */ c("aside", { className: u("flex h-full w-[220px] shrink-0 flex-col border-r", t ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-slate-50/95"), children: [
          /* @__PURE__ */ c("div", { className: u("flex items-center justify-between border-b px-3 py-3", t ? "border-slate-800" : "border-slate-200"), children: [
            /* @__PURE__ */ c("div", { className: "flex min-w-0 items-center gap-2", children: [
              /* @__PURE__ */ o(A.Cloud, { className: "h-5 w-5 shrink-0 text-indigo-500" }),
              /* @__PURE__ */ o("span", { className: "truncate text-sm font-semibold", children: p.title })
            ] }),
            /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                title: p.addAccount,
                onClick: je,
                className: "flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500",
                children: /* @__PURE__ */ o(A.Plus, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ o("nav", { className: "flex-1 space-y-0.5 overflow-y-auto p-2", children: d.length === 0 ? /* @__PURE__ */ c("p", { className: u("px-2 py-4 text-center text-[11px]", t ? "text-slate-500" : "text-slate-400"), children: [
            p.noAccounts,
            /* @__PURE__ */ o("br", {}),
            p.noAccountsHint
          ] }) : d.map((n) => {
            const g = i === n.remote_name;
            return /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                onClick: () => l(n.remote_name),
                className: u(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs transition",
                  g ? t ? "bg-slate-800 text-white" : "bg-white text-slate-900 shadow-sm" : t ? "text-slate-300 hover:bg-slate-900/70" : "text-slate-700 hover:bg-white/80"
                ),
                children: [
                  /* @__PURE__ */ o(A.HardDrive, { className: u("h-4 w-4 shrink-0", g ? "text-blue-500" : "text-slate-400") }),
                  /* @__PURE__ */ o("span", { className: "min-w-0 flex-1 truncate font-medium", children: n.remote_name }),
                  n.connected && /* @__PURE__ */ o(A.CheckCircle2, { className: "h-3.5 w-3.5 shrink-0 text-emerald-500" })
                ]
              },
              n.remote_name
            );
          }) })
        ] }),
        children: /* @__PURE__ */ o("div", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: i ? /* @__PURE__ */ c(se, { children: [
          /* @__PURE__ */ o("div", { className: u("flex shrink-0 gap-1 border-b px-4 pt-3", t ? "border-slate-800" : "border-slate-200"), children: ["overview", "tasks"].map((n) => /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              onClick: () => y(n),
              className: u(
                "rounded-t-lg px-4 py-2 text-xs font-bold transition",
                h === n ? t ? "bg-slate-800 text-white" : "bg-white text-slate-900 shadow-sm" : t ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"
              ),
              children: n === "overview" ? p.overview : p.tasks
            },
            n
          )) }),
          /* @__PURE__ */ c("main", { className: u("min-h-0 flex-1 overflow-y-auto", s ? "p-4" : "p-4 md:p-6"), children: [
            k && /* @__PURE__ */ c(
              "div",
              {
                className: u(
                  "mb-4 flex items-center gap-2 rounded-xl border p-3 text-xs",
                  k.isError ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-green-500/30 bg-green-500/10 text-green-600"
                ),
                children: [
                  k.isError ? /* @__PURE__ */ o(A.AlertTriangle, { className: "h-4 w-4" }) : /* @__PURE__ */ o(A.CheckCircle, { className: "h-4 w-4" }),
                  k.text
                ]
              }
            ),
            h === "overview" && /* @__PURE__ */ c("div", { className: Oe, children: [
              /* @__PURE__ */ c("div", { className: "mb-6 flex items-start gap-4", children: [
                /* @__PURE__ */ o("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15", children: /* @__PURE__ */ o(A.CheckCircle2, { className: "h-7 w-7 text-emerald-500" }) }),
                /* @__PURE__ */ c("div", { children: [
                  /* @__PURE__ */ o("h2", { className: "text-lg font-bold", children: p.upToDate }),
                  /* @__PURE__ */ o("p", { className: u("text-sm", t ? "text-slate-400" : "text-slate-500"), children: p.upToDateHint })
                ] })
              ] }),
              /* @__PURE__ */ c("dl", { className: u("grid gap-3 text-sm", t ? "text-slate-300" : "text-slate-700"), children: [
                /* @__PURE__ */ c("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ o("dt", { className: "w-28 shrink-0 font-semibold", children: p.cloudType }),
                  /* @__PURE__ */ o("dd", { children: "Google Drive" })
                ] }),
                /* @__PURE__ */ c("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ o("dt", { className: "w-28 shrink-0 font-semibold", children: p.accountName }),
                  /* @__PURE__ */ o("dd", { className: "font-mono", children: ct?.remote_name })
                ] }),
                /* @__PURE__ */ c("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ o("dt", { className: "w-28 shrink-0 font-semibold", children: "Tasks" }),
                  /* @__PURE__ */ o("dd", { children: xe.length })
                ] })
              ] })
            ] }),
            h === "tasks" && /* @__PURE__ */ c("div", { className: Oe, children: [
              /* @__PURE__ */ c("div", { className: "mb-4 flex items-center justify-between", children: [
                /* @__PURE__ */ o("h3", { className: "text-sm font-bold", children: p.tasks }),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: () => J(!0),
                    className: "rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500",
                    children: [
                      /* @__PURE__ */ o(A.Plus, { className: "mr-1 inline h-3.5 w-3.5" }),
                      p.newTask
                    ]
                  }
                )
              ] }),
              xe.length === 0 ? /* @__PURE__ */ o("p", { className: u("py-8 text-center text-sm", t ? "text-slate-500" : "text-slate-400"), children: p.noTasks }) : /* @__PURE__ */ o("div", { className: "space-y-2", children: xe.map((n) => /* @__PURE__ */ c(
                "div",
                {
                  className: u("rounded-xl border p-4", t ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"),
                  children: [
                    /* @__PURE__ */ o("p", { className: "text-sm font-bold", children: n.pair_name }),
                    /* @__PURE__ */ o("p", { className: u("mt-1 font-mono text-[11px]", t ? "text-slate-400" : "text-slate-600"), children: n.direction === "upload" ? /* @__PURE__ */ c(se, { children: [
                      /* @__PURE__ */ o("span", { className: "text-indigo-400", children: n.local_path }),
                      " → ",
                      /* @__PURE__ */ o("span", { className: "text-emerald-500", children: n.remote_path })
                    ] }) : /* @__PURE__ */ c(se, { children: [
                      /* @__PURE__ */ o("span", { className: "text-emerald-500", children: n.remote_path }),
                      " → ",
                      /* @__PURE__ */ o("span", { className: "text-indigo-400", children: n.local_path })
                    ] }) }),
                    /* @__PURE__ */ c(
                      "button",
                      {
                        type: "button",
                        onClick: () => it(n),
                        className: "mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500",
                        children: [
                          /* @__PURE__ */ o(A.Play, { className: "mr-1 inline h-3 w-3" }),
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
        ] }) : /* @__PURE__ */ c("main", { className: u("flex min-h-0 flex-1 flex-col items-center justify-center p-8 text-center", t ? "text-slate-400" : "text-slate-500"), children: [
          /* @__PURE__ */ o(A.CloudOff, { className: "mb-3 h-12 w-12 opacity-50" }),
          /* @__PURE__ */ o("p", { className: "text-sm font-medium", children: p.noAccounts }),
          /* @__PURE__ */ o("p", { className: "mb-4 text-xs", children: p.noAccountsHint }),
          /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              onClick: je,
              className: "rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500",
              children: [
                /* @__PURE__ */ o(A.Plus, { className: "mr-1 inline h-4 w-4" }),
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
        onClose: () => !b && !j && _(!1),
        title: K ? p.oauthSetupTitle : p.providersTitle,
        maxWidth: "lg",
        children: /* @__PURE__ */ c("div", { className: "space-y-4 p-4", children: [
          K ? /* @__PURE__ */ c(se, { children: [
            /* @__PURE__ */ o("p", { className: u("text-xs leading-relaxed", t ? "text-slate-400" : "text-slate-500"), children: p.oauthSetupDesc }),
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ o("label", { className: u("mb-1 block text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.oauthRedirectUri }),
              /* @__PURE__ */ c("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ o("input", { value: f, readOnly: !0, className: u(ee, "font-mono text-[11px]") }),
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    onClick: async () => {
                      try {
                        await navigator.clipboard.writeText(f), S({ text: p.oauthCopied, isError: !1 });
                      } catch {
                      }
                    },
                    className: "shrink-0 rounded-lg border px-3 text-xs font-bold",
                    children: p.oauthCopy
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ o("label", { className: u("mb-1 block text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.oauthClientId }),
              /* @__PURE__ */ o(
                "input",
                {
                  value: q,
                  onChange: (n) => re(n.target.value),
                  className: ee,
                  autoComplete: "off",
                  placeholder: "xxxx.apps.googleusercontent.com"
                }
              )
            ] }),
            /* @__PURE__ */ c("div", { children: [
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
            /* @__PURE__ */ c("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  disabled: j,
                  onClick: () => _(!1),
                  className: u("rounded-lg px-3 py-2 text-xs font-bold", t ? "text-slate-300" : "text-slate-600"),
                  children: p.cancel
                }
              ),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  disabled: j || b,
                  onClick: st,
                  className: "rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-60",
                  children: [
                    j ? /* @__PURE__ */ o(A.Loader2, { className: "mr-1 inline h-3.5 w-3.5 animate-spin" }) : null,
                    p.oauthSave
                  ]
                }
              )
            ] })
          ] }) : /* @__PURE__ */ c(se, { children: [
            /* @__PURE__ */ o("p", { className: u("text-xs", t ? "text-slate-400" : "text-slate-500"), children: p.providersDesc }),
            /* @__PURE__ */ o("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: eo.map(({ id: n, label: g, icon: w }) => /* @__PURE__ */ c(
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
                  /* @__PURE__ */ o(w, { className: "h-10 w-10 text-blue-500" }),
                  /* @__PURE__ */ o("span", { className: "text-xs font-semibold", children: g })
                ]
              },
              n
            )) }),
            b && /* @__PURE__ */ c("p", { className: u("flex items-center gap-2 text-xs", t ? "text-indigo-300" : "text-indigo-600"), children: [
              /* @__PURE__ */ o(A.Loader2, { className: "h-4 w-4 animate-spin" }),
              p.connecting
            ] }),
            !b && P && /* @__PURE__ */ o("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ o(
              "a",
              {
                href: P,
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
    /* @__PURE__ */ c(pe, { open: Q, onClose: () => J(!1), title: p.newTask, maxWidth: "xl", className: "max-h-[85vh] max-w-xl", children: [
      /* @__PURE__ */ c("div", { className: "space-y-4 p-4", children: [
        /* @__PURE__ */ c("div", { children: [
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
              ne === n ? "border-indigo-500 bg-indigo-500/10" : t ? "border-slate-800" : "border-slate-300"
            ),
            children: n === "upload" ? p.upload : p.download
          },
          n
        )) }),
        /* @__PURE__ */ c("div", { children: [
          /* @__PURE__ */ o("label", { className: u("text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.localPath }),
          /* @__PURE__ */ c("div", { className: "mt-1 flex gap-2", children: [
            /* @__PURE__ */ o("input", { value: Ae, onChange: (n) => me(n.target.value), className: u(ee, "flex-1 font-mono"), placeholder: "/var/www" }),
            /* @__PURE__ */ o("button", { type: "button", onClick: () => {
              we("/"), he(!0);
            }, className: "rounded-lg bg-indigo-600 px-3 text-white", children: /* @__PURE__ */ o(A.FolderSearch, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ c("div", { children: [
          /* @__PURE__ */ o("label", { className: u("text-xs font-bold", t ? "text-slate-400" : "text-slate-600"), children: p.remotePath }),
          /* @__PURE__ */ o("input", { value: Te, onChange: (n) => Pe(n.target.value), className: u(ee, "font-mono"), placeholder: "Backups/MySite" })
        ] }),
        /* @__PURE__ */ c("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ c("label", { className: u("flex items-center justify-between rounded-xl border p-3 text-xs", t ? "border-slate-800" : "border-slate-200"), children: [
            p.syncDeletions,
            /* @__PURE__ */ o("input", { type: "checkbox", checked: Ee, onChange: (n) => Qe(n.target.checked), className: "accent-indigo-600" })
          ] }),
          /* @__PURE__ */ c("div", { className: u("flex items-center justify-between rounded-xl border p-3 text-xs", t ? "border-slate-800" : "border-slate-200"), children: [
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
      /* @__PURE__ */ c("div", { className: u("flex justify-end gap-2 border-t p-3", t ? "border-slate-800" : "border-slate-200"), children: [
        /* @__PURE__ */ o("button", { type: "button", onClick: () => J(!1), className: u("rounded-xl border px-4 py-2 text-xs font-bold", t ? "border-slate-700" : "border-slate-300"), children: p.cancel }),
        /* @__PURE__ */ o("button", { type: "button", onClick: lt, className: "rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500", children: p.save })
      ] })
    ] }),
    /* @__PURE__ */ c(pe, { open: et, onClose: () => he(!1), title: p.browse, maxWidth: "2xl", className: "flex h-[70vh] max-w-2xl flex-col overflow-hidden", children: [
      /* @__PURE__ */ c("div", { className: u("flex items-center gap-2 border-b p-2 font-mono text-xs", t ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-100"), children: [
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            onClick: () => {
              const n = Ge.replace(/\\/g, "/").split("/").filter(Boolean);
              n.pop(), we("/" + n.join("/") || "/");
            },
            className: "rounded p-1 hover:bg-slate-500/20",
            children: /* @__PURE__ */ o(A.CornerLeftUp, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ o("span", { className: "truncate", children: Ge })
      ] }),
      /* @__PURE__ */ o("div", { className: "flex-1 overflow-y-auto p-2", children: ot.map((n) => /* @__PURE__ */ c(
        "div",
        {
          onClick: () => n.type === "folder" && we(n.path),
          className: u("flex cursor-pointer items-center justify-between rounded-lg p-2.5", t ? "hover:bg-slate-800" : "hover:bg-slate-100"),
          children: [
            /* @__PURE__ */ c("div", { className: "flex min-w-0 items-center gap-2", children: [
              n.type === "folder" ? /* @__PURE__ */ o(A.Folder, { className: "h-5 w-5 text-yellow-500" }) : /* @__PURE__ */ o(A.File, { className: "h-5 w-5 text-slate-400" }),
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
  so as default
};
