var jt = Object.defineProperty;
var Ot = (e, t, r) => t in e ? jt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var I = (e, t, r) => Ot(e, typeof t != "symbol" ? t + "" : t, r);
import { jsx as o, jsxs as p } from "react/jsx-runtime";
import { createContext as dt, useContext as ut, useState as y, useEffect as q, useMemo as Bt, useCallback as Ht } from "react";
import { useOutletContext as $t, useSearchParams as Gt } from "react-router-dom";
import * as P from "lucide-react";
import { createPortal as nt } from "react-dom";
const Wt = dt(null);
function Ft() {
  return ut(Wt);
}
const Vt = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function Ae() {
  const e = Ft(), t = $t();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : Vt);
}
const Ut = dt(null);
function pt() {
  return ut(Ut);
}
function Ie() {
  return pt()?.isWindowed === !0;
}
function ht(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var i = e.length;
    for (t = 0; t < i; t++) e[t] && (r = ht(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function qt() {
  for (var e, t, r = 0, n = "", i = arguments.length; r < i; r++) (e = arguments[r]) && (t = ht(e)) && (n && (n += " "), n += t);
  return n;
}
const Le = "-", Jt = (e) => {
  const t = Qt(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (l) => {
      const d = l.split(Le);
      return d[0] === "" && d.length !== 1 && d.shift(), mt(d, t) || Xt(l);
    },
    getConflictingClassGroupIds: (l, d) => {
      const h = r[l] || [];
      return d && n[l] ? [...h, ...n[l]] : h;
    }
  };
}, mt = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], n = t.nextPart.get(r), i = n ? mt(e.slice(1), n) : void 0;
  if (i)
    return i;
  if (t.validators.length === 0)
    return;
  const a = e.join(Le);
  return t.validators.find(({
    validator: l
  }) => l(a))?.classGroupId;
}, ot = /^\[(.+)\]$/, Xt = (e) => {
  if (ot.test(e)) {
    const t = ot.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, Qt = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Yt(Object.entries(e.classGroups), r).forEach(([a, l]) => {
    Re(l, n, a, t);
  }), n;
}, Re = (e, t, r, n) => {
  e.forEach((i) => {
    if (typeof i == "string") {
      const a = i === "" ? t : st(t, i);
      a.classGroupId = r;
      return;
    }
    if (typeof i == "function") {
      if (Kt(i)) {
        Re(i(n), t, r, n);
        return;
      }
      t.validators.push({
        validator: i,
        classGroupId: r
      });
      return;
    }
    Object.entries(i).forEach(([a, l]) => {
      Re(l, st(t, a), r, n);
    });
  });
}, st = (e, t) => {
  let r = e;
  return t.split(Le).forEach((n) => {
    r.nextPart.has(n) || r.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(n);
  }), r;
}, Kt = (e) => e.isThemeGetter, Yt = (e, t) => t ? e.map(([r, n]) => {
  const i = n.map((a) => typeof a == "string" ? t + a : typeof a == "object" ? Object.fromEntries(Object.entries(a).map(([l, d]) => [t + l, d])) : a);
  return [r, i];
}) : e, Zt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  const i = (a, l) => {
    r.set(a, l), t++, t > e && (t = 0, n = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(a) {
      let l = r.get(a);
      if (l !== void 0)
        return l;
      if ((l = n.get(a)) !== void 0)
        return i(a, l), l;
    },
    set(a, l) {
      r.has(a) ? r.set(a, l) : i(a, l);
    }
  };
}, bt = "!", er = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, n = t.length === 1, i = t[0], a = t.length, l = (d) => {
    const h = [];
    let b = 0, v = 0, w;
    for (let S = 0; S < d.length; S++) {
      let _ = d[S];
      if (b === 0) {
        if (_ === i && (n || d.slice(S, S + a) === t)) {
          h.push(d.slice(v, S)), v = S + a;
          continue;
        }
        if (_ === "/") {
          w = S;
          continue;
        }
      }
      _ === "[" ? b++ : _ === "]" && b--;
    }
    const T = h.length === 0 ? d : d.substring(v), R = T.startsWith(bt), E = R ? T.substring(1) : T, C = w && w > v ? w - v : void 0;
    return {
      modifiers: h,
      hasImportantModifier: R,
      baseClassName: E,
      maybePostfixModifierPosition: C
    };
  };
  return r ? (d) => r({
    className: d,
    parseClassName: l
  }) : l;
}, tr = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((n) => {
    n[0] === "[" ? (t.push(...r.sort(), n), r = []) : r.push(n);
  }), t.push(...r.sort()), t;
}, rr = (e) => ({
  cache: Zt(e.cacheSize),
  parseClassName: er(e),
  ...Jt(e)
}), nr = /\s+/, or = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: i
  } = t, a = [], l = e.trim().split(nr);
  let d = "";
  for (let h = l.length - 1; h >= 0; h -= 1) {
    const b = l[h], {
      modifiers: v,
      hasImportantModifier: w,
      baseClassName: T,
      maybePostfixModifierPosition: R
    } = r(b);
    let E = !!R, C = n(E ? T.substring(0, R) : T);
    if (!C) {
      if (!E) {
        d = b + (d.length > 0 ? " " + d : d);
        continue;
      }
      if (C = n(T), !C) {
        d = b + (d.length > 0 ? " " + d : d);
        continue;
      }
      E = !1;
    }
    const S = tr(v).join(":"), _ = w ? S + bt : S, M = _ + C;
    if (a.includes(M))
      continue;
    a.push(M);
    const $ = i(C, E);
    for (let A = 0; A < $.length; ++A) {
      const J = $[A];
      a.push(_ + J);
    }
    d = b + (d.length > 0 ? " " + d : d);
  }
  return d;
};
function sr() {
  let e = 0, t, r, n = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = ft(t)) && (n && (n += " "), n += r);
  return n;
}
const ft = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = ft(e[n])) && (r && (r += " "), r += t);
  return r;
};
function ar(e, ...t) {
  let r, n, i, a = l;
  function l(h) {
    const b = t.reduce((v, w) => w(v), e());
    return r = rr(b), n = r.cache.get, i = r.cache.set, a = d, d(h);
  }
  function d(h) {
    const b = n(h);
    if (b)
      return b;
    const v = or(h, r);
    return i(h, v), v;
  }
  return function() {
    return a(sr.apply(null, arguments));
  };
}
const k = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, gt = /^\[(?:([a-z-]+):)?(.+)\]$/i, lr = /^\d+\/\d+$/, ir = /* @__PURE__ */ new Set(["px", "full", "screen"]), cr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, dr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ur = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, pr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, hr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, H = (e) => oe(e) || ir.has(e) || lr.test(e), V = (e) => se(e, "length", wr), oe = (e) => !!e && !Number.isNaN(Number(e)), Te = (e) => se(e, "number", oe), ie = (e) => !!e && Number.isInteger(Number(e)), mr = (e) => e.endsWith("%") && oe(e.slice(0, -1)), m = (e) => gt.test(e), U = (e) => cr.test(e), br = /* @__PURE__ */ new Set(["length", "size", "percentage"]), fr = (e) => se(e, br, yt), gr = (e) => se(e, "position", yt), yr = /* @__PURE__ */ new Set(["image", "url"]), xr = (e) => se(e, yr, Nr), vr = (e) => se(e, "", kr), ce = () => !0, se = (e, t, r) => {
  const n = gt.exec(e);
  return n ? n[1] ? typeof t == "string" ? n[1] === t : t.has(n[1]) : r(n[2]) : !1;
}, wr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  dr.test(e) && !ur.test(e)
), yt = () => !1, kr = (e) => pr.test(e), Nr = (e) => hr.test(e), Cr = () => {
  const e = k("colors"), t = k("spacing"), r = k("blur"), n = k("brightness"), i = k("borderColor"), a = k("borderRadius"), l = k("borderSpacing"), d = k("borderWidth"), h = k("contrast"), b = k("grayscale"), v = k("hueRotate"), w = k("invert"), T = k("gap"), R = k("gradientColorStops"), E = k("gradientColorStopPositions"), C = k("inset"), S = k("margin"), _ = k("opacity"), M = k("padding"), $ = k("saturate"), A = k("scale"), J = k("sepia"), ue = k("skew"), pe = k("space"), he = k("translate"), j = () => ["auto", "contain", "none"], Y = () => ["auto", "hidden", "clip", "visible", "scroll"], O = () => ["auto", m, t], x = () => [m, t], Z = () => ["", H, V], ee = () => ["auto", oe, m], te = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], G = () => ["solid", "dashed", "dotted", "double", "none"], X = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], Q = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], B = () => ["", "0", m], ae = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], f = () => [oe, m];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [ce],
      spacing: [H, V],
      blur: ["none", "", U, m],
      brightness: f(),
      borderColor: [e],
      borderRadius: ["none", "", "full", U, m],
      borderSpacing: x(),
      borderWidth: Z(),
      contrast: f(),
      grayscale: B(),
      hueRotate: f(),
      invert: B(),
      gap: x(),
      gradientColorStops: [e],
      gradientColorStopPositions: [mr, V],
      inset: O(),
      margin: O(),
      opacity: f(),
      padding: x(),
      saturate: f(),
      scale: f(),
      sepia: B(),
      skew: f(),
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
        columns: [U]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": ae()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": ae()
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
        object: [...te(), m]
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
        z: ["auto", ie, m]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: O()
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
        grow: B()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: B()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", ie, m]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [ce]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", ie, m]
        }, m]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": ee()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": ee()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [ce]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [ie, m]
        }, m]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": ee()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": ee()
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
        gap: [T]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [T]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [T]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...Q()]
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
        content: ["normal", ...Q(), "baseline"]
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
        "place-content": [...Q(), "baseline"]
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
        p: [M]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [M]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [M]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [M]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [M]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [M]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [M]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [M]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [M]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [S]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [S]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [S]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [S]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [S]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [S]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [S]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [S]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [S]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", m, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [m, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [m, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [U]
        }, U]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [m, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [m, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [m, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [m, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", U, V]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Te]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [ce]
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
        "line-clamp": ["none", oe, Te]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", H, m]
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
        "placeholder-opacity": [_]
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
        "text-opacity": [_]
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
        decoration: [...G(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", H, V]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", H, m]
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
        "bg-opacity": [_]
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
        bg: [...te(), gr]
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
        bg: ["auto", "cover", "contain", fr]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, xr]
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
        from: [R]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [R]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [R]
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
        border: [d]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [d]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [d]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [d]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [d]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [d]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [d]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [d]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [d]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [_]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...G(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [d]
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
        "divide-y": [d]
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
        "divide-opacity": [_]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: G()
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
        outline: ["", ...G()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [H, m]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [H, V]
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
        ring: Z()
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
        "ring-opacity": [_]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [H, V]
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
        shadow: ["", "inner", "none", U, vr]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [ce]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [_]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...X(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": X()
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
        contrast: [h]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", U, m]
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
        "hue-rotate": [v]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [w]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [$]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [J]
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
        "backdrop-hue-rotate": [v]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [w]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [_]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [$]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [J]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", m]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: f()
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
        delay: f()
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
        scale: [A]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [A]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [A]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [ie, m]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [he]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [he]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [ue]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [ue]
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
        stroke: [H, V, Te]
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
}, Sr = /* @__PURE__ */ ar(Cr);
function u(...e) {
  return Sr(qt(e));
}
const Pr = "copanel_mobile_desktop_site";
function Tr() {
  try {
    return localStorage.getItem(Pr) === "1";
  } catch {
    return !1;
  }
}
function Me(e = window.innerWidth) {
  return Tr() || e >= 1024;
}
function _r({ children: e, className: t, constrained: r = !1 }) {
  const { theme: n } = Ae(), i = Ie(), a = n === "dark", l = !i && !Me();
  return /* @__PURE__ */ o(
    "div",
    {
      className: u(
        "flex flex-col transition-colors duration-200",
        i ? "h-full min-h-0" : l ? "min-h-0" : "min-h-screen",
        a ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !i && r && "mx-auto max-w-7xl",
        t
      ),
      children: e
    }
  );
}
function Rr({
  isDark: e,
  sidebar: t,
  children: r,
  mobileTitle: n,
  className: i
}) {
  const a = Ie(), [l, d] = y(!1), [h, b] = y(() => Me());
  q(() => {
    const T = () => b(Me());
    return window.addEventListener("resize", T), () => window.removeEventListener("resize", T);
  }, []);
  const v = !a && !h;
  q(() => {
    h && d(!1);
  }, [h]);
  const w = () => d(!1);
  return v ? /* @__PURE__ */ p("div", { className: u("relative flex h-full min-h-0 flex-1 flex-col overflow-hidden", i), children: [
    /* @__PURE__ */ p(
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
              onClick: () => d(!0),
              className: u(
                "inline-flex items-center justify-center rounded-lg p-2",
                e ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
              ),
              "aria-label": "Open module menu",
              children: /* @__PURE__ */ o(P.PanelLeft, { className: "h-5 w-5" })
            }
          ),
          n ? /* @__PURE__ */ o("span", { className: u("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900"), children: n }) : null
        ]
      }
    ),
    l ? /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-[60] bg-black/45",
        "aria-label": "Close module menu",
        onClick: w
      }
    ) : null,
    /* @__PURE__ */ o(
      "div",
      {
        className: u(
          "fixed inset-y-0 left-0 z-[61] flex max-w-[min(85vw,280px)] transform shadow-xl transition-transform duration-200 ease-out",
          l ? "translate-x-0" : "-translate-x-full pointer-events-none"
        ),
        onClick: w,
        children: t
      }
    ),
    /* @__PURE__ */ o("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: r })
  ] }) : /* @__PURE__ */ p("div", { className: u("flex h-full min-h-0 flex-1 overflow-hidden", i), children: [
    t,
    /* @__PURE__ */ o("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: r })
  ] });
}
const Mr = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
};
function Er({
  open: e,
  onClose: t,
  children: r,
  title: n,
  className: i,
  maxWidth: a = "lg",
  closeOnBackdropClick: l = !0
}) {
  const { theme: d } = Ae(), h = d === "dark", b = pt();
  if (!e) return null;
  const v = /* @__PURE__ */ o(
    "div",
    {
      className: u(
        "z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        b?.isWindowed ? "absolute inset-0" : "fixed inset-0"
      ),
      onClick: l ? t : void 0,
      children: /* @__PURE__ */ p(
        "div",
        {
          className: u(
            "flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
            Mr[a],
            h ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900",
            i
          ),
          onClick: (w) => w.stopPropagation(),
          children: [
            n && /* @__PURE__ */ p(
              "div",
              {
                className: u(
                  "flex items-center justify-between border-b px-4 py-3",
                  h ? "border-slate-800" : "border-slate-200"
                ),
                children: [
                  /* @__PURE__ */ o("h3", { className: "text-sm font-bold", children: n }),
                  /* @__PURE__ */ o("button", { type: "button", onClick: t, className: "rounded-lg p-1 hover:bg-slate-800/50", "aria-label": "Close", children: /* @__PURE__ */ o(P.X, { className: "h-4 w-4" }) })
                ]
              }
            ),
            r
          ]
        }
      )
    }
  );
  return b?.isWindowed && b.viewportRef.current ? nt(v, b.viewportRef.current) : nt(v, document.body);
}
const xt = {
  blue: {
    border: { dark: "border-blue-500", light: "border-blue-600" },
    icon: "text-blue-500",
    badgeActive: {
      dark: "bg-blue-500/25 text-blue-200",
      light: "bg-blue-100 text-blue-700"
    },
    softBg: {
      dark: "bg-blue-500/15",
      light: "bg-blue-50"
    }
  },
  cyan: {
    border: { dark: "border-cyan-500", light: "border-cyan-600" },
    icon: "text-cyan-500",
    badgeActive: {
      dark: "bg-cyan-500/25 text-cyan-200",
      light: "bg-cyan-100 text-cyan-700"
    },
    softBg: {
      dark: "bg-cyan-500/15",
      light: "bg-cyan-50"
    }
  },
  teal: {
    border: { dark: "border-teal-500", light: "border-teal-600" },
    icon: "text-teal-500",
    badgeActive: {
      dark: "bg-teal-500/25 text-teal-200",
      light: "bg-teal-100 text-teal-700"
    },
    softBg: {
      dark: "bg-teal-500/15",
      light: "bg-teal-50"
    }
  },
  sky: {
    border: { dark: "border-sky-500", light: "border-sky-600" },
    icon: "text-sky-500",
    badgeActive: {
      dark: "bg-sky-500/25 text-sky-200",
      light: "bg-sky-100 text-sky-700"
    },
    softBg: {
      dark: "bg-sky-500/15",
      light: "bg-sky-50"
    }
  }
};
function Dr(e, t = "md") {
  return u(
    "flex h-full shrink-0 flex-col border-r",
    t === "sm" ? "w-[200px]" : "w-[220px]",
    e ? "border-slate-800 bg-slate-950/95" : "border-slate-200 bg-[#f4f6f8]"
  );
}
function zr(e) {
  return u("border-b px-4 py-3.5", e ? "border-slate-800" : "border-slate-200");
}
function Ar(e) {
  return u(
    "flex h-9 w-9 items-center justify-center rounded-lg",
    e ? "bg-slate-800" : "border border-slate-200 bg-white shadow-sm"
  );
}
function Ir(e) {
  return u("truncate text-sm font-semibold", e ? "text-slate-100" : "text-slate-900");
}
function Lr(e) {
  return u("line-clamp-2 text-[11px] leading-snug", "text-slate-500");
}
function jr() {
  return "flex-1 space-y-0.5 overflow-y-auto p-2";
}
function Or(e, t, r = "blue") {
  const n = xt[r];
  return u(
    "flex w-full items-center gap-2.5 rounded-md border-l-2 py-2.5 pl-[10px] pr-3 text-left text-sm transition-colors",
    t ? e ? u(n.border.dark, "bg-slate-800/90 text-white") : u(n.border.light, "bg-white text-slate-900 shadow-sm") : e ? "border-transparent text-slate-300 hover:bg-slate-900/70" : "border-transparent text-slate-700 hover:bg-white/90"
  );
}
function Br(e, t, r = "blue") {
  return u("h-4 w-4 shrink-0", t ? xt[r].icon : e ? "text-slate-500" : "text-slate-400");
}
class at extends Error {
  constructor(r, n, i, a) {
    super(n);
    I(this, "code");
    I(this, "status");
    I(this, "details");
    this.code = r, this.status = i, this.details = a;
  }
}
async function z(e, t = {}) {
  const r = typeof window < "u" ? localStorage.getItem("copanel_token") : null, n = {
    "Content-Type": "application/json",
    ...t.headers || {}
  };
  r && (n.Authorization = `Bearer ${r}`);
  const i = {
    method: t.method || "GET",
    headers: n,
    signal: t.signal
  };
  t.body !== void 0 && (i.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body));
  const a = await fetch(e, i);
  let l = null;
  const d = await a.text();
  if (d)
    try {
      l = JSON.parse(d);
    } catch {
      l = d;
    }
  if (t.raw)
    return l;
  if (!a.ok) {
    const h = l && typeof l == "object" && l.error ? l.error : { code: `HTTP_${a.status}`, message: typeof l == "string" ? l : l?.detail || a.statusText };
    throw new at(h.code || `HTTP_${a.status}`, h.message || "Request failed", a.status, h.details);
  }
  if (l && typeof l == "object" && "status" in l) {
    if (l.status === "success")
      return l.data !== void 0 ? l.data : l;
    if (l.status === "error" && l.error)
      throw new at(l.error.code, l.error.message, a.status, l.error.details);
  }
  return l;
}
function ye() {
  return typeof localStorage > "u" ? null : localStorage.getItem("copanel_token");
}
function Hr(e) {
  const t = {};
  e && new Headers(e).forEach((i, a) => {
    t[a] = i;
  });
  const r = ye();
  return r && (t.Authorization = `Bearer ${r}`), t;
}
function $r(e, t = {}) {
  const r = Hr(t.headers);
  return fetch(e, { ...t, headers: r });
}
async function Gr() {
  if (!ye()) return null;
  try {
    const e = await $r("/api/auth/stream-ticket", { method: "POST" });
    if (!e.ok) return null;
    const t = await e.json();
    return typeof t?.ticket == "string" ? t.ticket : null;
  } catch {
    return null;
  }
}
const Wr = "copanel-platform-sse-degraded", de = 2e3, Fr = 6e4, Vr = 3;
class Ur {
  constructor() {
    I(this, "source", null);
    I(this, "handlers", /* @__PURE__ */ new Map());
    I(this, "retryDelay", de);
    I(this, "retryTimer", null);
    I(this, "failureCount", 0);
    I(this, "connecting", !1);
  }
  on(t, r) {
    let n = this.handlers.get(t);
    return n || (n = /* @__PURE__ */ new Set(), this.handlers.set(t, n)), n.add(r), this.ensureConnected(), () => {
      n.delete(r), n.size === 0 && this.handlers.delete(t), this.teardownIfIdle();
    };
  }
  emit(t, r) {
    const n = this.handlers.get(t);
    n && n.forEach((i) => {
      try {
        i(r);
      } catch (a) {
        console.error("event handler failed", t, a);
      }
    });
  }
  async buildUrl() {
    if (!ye()) return null;
    const t = await Gr();
    return t ? `/api/platform/events?${new URLSearchParams({
      topics: "jobs,notifications",
      ticket: t
    }).toString()}` : null;
  }
  ensureConnected() {
    this.source || this.connecting || typeof document < "u" && document.hidden || ye() && (this.connecting = !0, this.buildUrl().then((t) => {
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
      this.failureCount = 0, this.retryDelay = de;
    }), this.source.addEventListener("jobs", (r) => {
      this.onStreamMessage(), this.parseAndEmit("jobs", r.data);
    }), this.source.addEventListener("notifications", (r) => {
      this.onStreamMessage(), this.parseAndEmit("notifications", r.data);
    }), this.source.addEventListener("message", () => {
      this.onStreamMessage();
    }), this.source.onerror = () => {
      this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Vr && window.dispatchEvent(new CustomEvent(Wr)), this.scheduleRetry();
    };
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = de;
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
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), Fr), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = de);
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = de, this.handlers.size > 0 && this.ensureConnected();
  }
}
const je = new Ur();
function qr() {
  je.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || qr();
});
function vt(e) {
  let t = e;
  const r = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (n) => {
      const i = typeof n == "function" ? n(t) : n;
      if (!i || Object.keys(i).length === 0) return;
      let a = !1;
      for (const l of Object.keys(i))
        if (t[l] !== i[l]) {
          a = !0;
          break;
        }
      a && (t = { ...t, ...i }, r.forEach((l) => l()));
    },
    subscribe: (n) => (r.add(n), () => r.delete(n))
  };
}
function Jr(e, t) {
  const [r, n] = y(() => e.getState());
  return q(() => e.subscribe(() => n(e.getState())), [e]), t(r);
}
const xe = vt({ jobs: {}, order: [], lastFetch: 0 });
function Xr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function lt(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function re(e, t, r) {
  if (!e || typeof e != "object") return;
  const n = lt(e[t], r);
  if (n) return n;
  const i = lt(e[`${t}_i18n`], r);
  if (i) return i;
  const a = e[`${t}_${r}`];
  if (typeof a == "string" && a) return a;
  const l = e[`${t}_en`];
  if (typeof l == "string" && l) return l;
  const d = e[`${t}_vi`];
  if (typeof d == "string" && d) return d;
}
function Ee(e) {
  const t = Xr(), r = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: re(e, "title", t) || re(r, "title", t) || e?.title || "",
    message: re(e, "message", t) || re(r, "message", t) || e?.message,
    error: re(e, "error", t) || re(r, "error", t) || e?.error || null
  };
}
function De(e) {
  const t = Ee(e);
  xe.setState((r) => {
    const n = { ...r.jobs, [t.id]: { ...r.jobs[t.id], ...t } };
    let i = r.order;
    return i.includes(t.id) || (i = [t.id, ...i].slice(0, 200)), { jobs: n, order: i };
  });
}
je.on("jobs", (e) => {
  if (e?.job) {
    De(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = xe.getState().jobs[e.job_id];
    t && De({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const _e = {
  async refresh(e = 50) {
    const t = await z(`/api/platform/jobs?limit=${e}`), r = Array.isArray(t) ? t : [];
    xe.setState(() => {
      const n = {}, i = [];
      for (const a of r) {
        if (!a || typeof a != "object" || !a.id) continue;
        const l = Ee(a);
        n[l.id] = l, i.push(l.id);
      }
      return { jobs: n, order: i, lastFetch: Date.now() };
    });
  },
  async get(e) {
    const t = await z(`/api/platform/jobs/${e}`), r = Ee(t);
    return De(r), r;
  },
  async cancel(e) {
    return z(`/api/platform/jobs/${e}/cancel`, { method: "POST" });
  }
};
function Qr(e) {
  return Jr(xe, (t) => e ? t.jobs[e] : void 0);
}
const ze = vt({ inbox: [], unread: 0, toasts: [] }), Kr = 6e3;
function Yr() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function it(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function ge(e, t, r) {
  if (!e || typeof e != "object") return;
  const n = it(e[t], r);
  if (n) return n;
  const i = it(e[`${t}_i18n`], r);
  if (i) return i;
  const a = e[`${t}_${r}`];
  if (typeof a == "string" && a) return a;
  const l = e[`${t}_en`];
  if (typeof l == "string" && l) return l;
  const d = e[`${t}_vi`];
  if (typeof d == "string" && d) return d;
}
function Zr(e) {
  const t = Yr(), r = e?.payload && typeof e.payload == "object" ? e.payload : {}, n = ge(e, "title", t) || ge(r, "title", t) || e?.title || "", i = ge(e, "body", t) || ge(r, "body", t) || e?.body || null;
  return {
    ...e,
    title: n,
    body: i
  };
}
function en(e) {
  ze.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    ze.setState((t) => ({ toasts: t.toasts.filter((r) => r.id !== e.id) }));
  }, Kr);
}
je.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = Zr(e.notification);
    en({ ...t, ephemeral: !0 }), ze.setState((r) => ({
      inbox: [t, ...r.inbox].slice(0, 200),
      unread: r.unread + 1
    }));
  }
});
const ne = ["mode", "target", "detect", "scope", "review", "done"], tn = {
  mode: P.Layers,
  target: P.Server,
  detect: P.ShieldCheck,
  scope: P.FolderSync,
  review: P.ClipboardCheck,
  done: P.Flag
};
function hn() {
  const { theme: e, language: t } = Ae(), r = e === "dark", n = t === "vi" ? "vi" : "en", i = Ie(), [a, l] = Gt(), [d, h] = y("mode"), [b, v] = y("clone"), [w, T] = y(""), [R, E] = y("22"), [C, S] = y("root"), [_, M] = y(""), [$, A] = y([]), [J, ue] = y({}), [pe, he] = y("copanel"), [j, Y] = y("/opt/copanel"), [O, x] = y("/opt/copanel"), [Z, ee] = y(!1), [te, G] = y(""), [X, Q] = y(!1), [B, ae] = y(""), [f, ve] = y(null), [we, Oe] = y(!1), [Be, He] = y(!1), [$e, Ge] = y(!1), [ke, We] = y(!1), [Fe, W] = y(null), [wt, le] = y(!1), [me, Ve] = y(!0), [K, Ne] = y(a.get("job")), be = Qr(K), [Ce, Ue] = y([]), [qe, Je] = y({}), c = Bt(() => an[n], [n]), kt = {
    mode: c.stepMode,
    target: c.stepTarget,
    detect: c.stepDetect,
    scope: c.stepScope,
    review: c.stepReview,
    done: c.stepDone
  }, Xe = {
    mode: { title: c.modeTitle, desc: c.modeDesc },
    target: { title: c.targetTitle, desc: c.targetDesc },
    detect: { title: c.detectTitle, desc: c.detectDesc },
    scope: { title: c.scopeTitle, desc: c.scopeDesc },
    review: { title: c.reviewTitle, desc: c.reviewDesc },
    done: { title: c.doneTitle, desc: c.doneDesc }
  }, Qe = Ht(() => {
    z("/api/rsync_manager/presets").then((s) => {
      ue(s || {});
      const g = s?.copanel;
      g?.excludes && G((g.excludes || []).join(`
`));
    }).catch(() => {
    }), z("/api/rsync_manager/ssh_hints").then((s) => A(s?.keys || [])).catch(() => A([]));
  }, []);
  q(() => {
    Qe();
  }, [Qe]), q(() => {
    const s = a.get("job");
    s && (Ne(s), h("review"));
  }, [a]), q(() => {
    if (!K) return;
    const s = setInterval(() => {
      _e.get(K).catch(() => {
      });
    }, 1500);
    return () => clearInterval(s);
  }, [K]), q(() => {
    be?.status === "success" && (h("done"), Ze());
  }, [be?.status]);
  const Nt = (s) => {
    he(s);
    const g = J[s];
    g && (g.local_path && Y(g.local_path), g.remote_path && x(g.remote_path), G((g.excludes || []).join(`
`)), Q(!!g.delete_default && b !== "clone"));
  }, Ke = () => {
    const s = [{ local_path: j.trim(), remote_path: O.trim() }];
    return Z && s.push({ local_path: "/var/www", remote_path: "/var/www" }), s;
  }, Se = () => ({
    host: w.trim(),
    port: parseInt(R, 10) || 22,
    user: C.trim(),
    identity_file: _.trim() || null
  }), Pe = async () => {
    W(null), Oe(!0), ve(null);
    try {
      const s = parseFloat(B.replace(",", ".")) || 0, g = Math.max(0, Math.floor(s * 1024 ** 3)), D = await z("/api/rsync_manager/compatibility", {
        method: "POST",
        body: {
          ...Se(),
          estimated_bytes: g,
          remote_path: O.trim() || "/opt/copanel"
        }
      });
      ve(D);
    } catch (s) {
      W(s instanceof Error ? s.message : "Error");
    } finally {
      Oe(!1);
    }
  }, Ct = async () => {
    W(null), He(!0);
    try {
      const s = await z("/api/rsync_manager/install_rsync", {
        method: "POST",
        body: Se()
      });
      s.ok || W(s.stderr_tail || c.installFail), await Pe();
    } catch (s) {
      W(s instanceof Error ? s.message : "Error");
    } finally {
      He(!1);
    }
  }, Ye = async () => {
    Ge(!0);
    try {
      const s = await z("/api/rsync_manager/estimate", {
        method: "POST",
        body: {
          local_path: j.trim(),
          excludes: te.split(`
`).map((g) => g.trim()).filter(Boolean)
        }
      });
      if (s.bytes > 0) {
        const g = s.bytes / 1073741824;
        ae(g >= 10 ? g.toFixed(1) : g.toFixed(2));
      }
    } catch {
    } finally {
      Ge(!1);
    }
  }, Ze = async () => {
    try {
      const s = await z("/api/rsync_manager/checklist", {
        method: "POST",
        body: { mode: b, scenario: f?.scenario || "target_rsync" }
      });
      Ue(n === "vi" ? s.vi || s.en : s.en || []);
    } catch {
      Ue([]);
    }
  }, St = async (s) => {
    W(null), We(!0), le(!1);
    try {
      if (!s && f?.can_proceed !== !0)
        throw new Error(c.cannotProceed);
      const g = await z("/api/rsync_manager/sync_job", {
        method: "POST",
        body: {
          ...Se(),
          paths: Ke(),
          excludes: te.split(`
`).map((D) => D.trim()).filter(Boolean),
          dry_run: s,
          delete: X && b !== "clone",
          mode: b
        }
      });
      Ne(g.job_id), l({ job: g.job_id }), h("review"), _e.refresh().catch(() => {
      }), _e.get(g.job_id).catch(() => {
      });
    } catch (g) {
      W(g instanceof Error ? g.message : "Error");
    } finally {
      We(!1);
    }
  }, et = () => {
    Ne(null), l({}), h("mode"), ve(null), Je({}), W(null);
  }, fe = ne.indexOf(d), Pt = () => d === "mode" ? !0 : d === "target" ? !!w.trim() && !!C.trim() : d === "detect" ? f?.can_proceed === !0 : d === "scope" ? !!j.trim() && !!O.trim() : !0, Tt = async () => {
    if (d === "detect" && !f) {
      await Pe();
      return;
    }
    d === "scope" && !B && Ye();
    const s = ne[Math.min(ne.length - 1, fe + 1)];
    h(s), s === "done" && Ze();
  }, tt = () => {
    const s = f?.scenario;
    return s ? {
      both_copanel: c.scenarioBoth,
      target_rsync: c.scenarioRsync,
      need_rsync: c.scenarioNeed,
      blocked: c.scenarioBlocked
    }[s] || s : null;
  }, _t = u(
    "rounded-2xl border p-4 md:p-5 space-y-4",
    r ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
  ), N = r ? "text-slate-400" : "text-slate-500", F = u(
    "w-full rounded-xl border px-3 py-2 text-sm font-mono",
    r ? "bg-slate-950 border-slate-700 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-900"
  ), Rt = () => /* @__PURE__ */ o("div", { className: "grid gap-3 md:grid-cols-3", children: [
    { id: "clone", icon: P.Copy, title: c.cloneTitle, desc: c.cloneDesc },
    { id: "sync", icon: P.RefreshCw, title: c.syncTitle, desc: c.syncDesc },
    { id: "move", icon: P.ArrowRightLeft, title: c.moveTitle, desc: c.moveDesc }
  ].map((s) => {
    const g = b === s.id, D = s.icon;
    return /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        onClick: () => {
          v(s.id), s.id === "clone" && Q(!1);
        },
        className: u(
          "text-left rounded-2xl border p-4 transition-colors",
          g ? r ? "border-sky-500/60 bg-sky-500/10" : "border-sky-400 bg-sky-50" : r ? "border-slate-800 hover:border-slate-700" : "border-slate-200 hover:border-slate-300"
        ),
        children: [
          /* @__PURE__ */ o(D, { className: u("w-6 h-6 mb-2", g ? "text-sky-500" : N) }),
          /* @__PURE__ */ o("div", { className: "font-bold text-sm", children: s.title }),
          /* @__PURE__ */ o("p", { className: u("text-xs mt-1 leading-relaxed", N), children: s.desc })
        ]
      },
      s.id
    );
  }) }), Mt = () => /* @__PURE__ */ p("div", { className: "space-y-4", children: [
    /* @__PURE__ */ p("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
      /* @__PURE__ */ p("label", { className: "space-y-1", children: [
        /* @__PURE__ */ o("span", { className: u("text-xs font-bold", N), children: c.host }),
        /* @__PURE__ */ o("input", { value: w, onChange: (s) => T(s.target.value), className: F, placeholder: "203.0.113.10" })
      ] }),
      /* @__PURE__ */ p("label", { className: "space-y-1", children: [
        /* @__PURE__ */ o("span", { className: u("text-xs font-bold", N), children: c.port }),
        /* @__PURE__ */ o("input", { value: R, onChange: (s) => E(s.target.value), className: F })
      ] }),
      /* @__PURE__ */ p("label", { className: "space-y-1 md:col-span-2", children: [
        /* @__PURE__ */ o("span", { className: u("text-xs font-bold", N), children: c.user }),
        /* @__PURE__ */ o("input", { value: C, onChange: (s) => S(s.target.value), className: F })
      ] }),
      /* @__PURE__ */ p("label", { className: "space-y-1 md:col-span-2", children: [
        /* @__PURE__ */ o("span", { className: u("text-xs font-bold", N), children: c.identity }),
        /* @__PURE__ */ o(
          "input",
          {
            value: _,
            onChange: (s) => M(s.target.value),
            className: F,
            placeholder: "/root/.ssh/id_ed25519"
          }
        ),
        /* @__PURE__ */ o("span", { className: u("text-[10px]", N), children: c.identityHint })
      ] })
    ] }),
    $.length > 0 && /* @__PURE__ */ p("div", { className: u("rounded-xl border p-3 space-y-2", r ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50"), children: [
      /* @__PURE__ */ o("p", { className: u("text-xs font-bold", N), children: c.keyHints }),
      $.slice(0, 3).map((s) => /* @__PURE__ */ p("div", { className: "space-y-1", children: [
        /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: u("text-xs font-mono underline", r ? "text-sky-400" : "text-sky-700"),
            onClick: () => M(s.identity_file),
            children: s.identity_file
          }
        ),
        s.public_key && /* @__PURE__ */ o("pre", { className: u("text-[10px] font-mono overflow-x-auto whitespace-pre-wrap break-all", N), children: s.public_key })
      ] }, s.identity_file)),
      /* @__PURE__ */ o("p", { className: u("text-[10px]", N), children: c.keyAuthHint })
    ] })
  ] }), Et = () => /* @__PURE__ */ p("div", { className: "space-y-4", children: [
    /* @__PURE__ */ p("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          onClick: () => void Pe(),
          disabled: we || !w.trim(),
          className: "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50",
          children: [
            we ? /* @__PURE__ */ o(P.Loader, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ o(P.ShieldCheck, { className: "w-4 h-4" }),
            we ? c.checking : c.check
          ]
        }
      ),
      f?.scenario === "need_rsync" && /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          onClick: () => void Ct(),
          disabled: Be,
          className: "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50",
          children: [
            Be ? /* @__PURE__ */ o(P.Loader, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ o(P.Download, { className: "w-4 h-4" }),
            c.installRsync
          ]
        }
      ),
      f && /* @__PURE__ */ p(
        "span",
        {
          className: u(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
            f.can_proceed ? r ? "bg-emerald-950/50 text-emerald-300" : "bg-emerald-100 text-emerald-800" : r ? "bg-red-950/50 text-red-300" : "bg-red-100 text-red-800"
          ),
          children: [
            f.can_proceed ? /* @__PURE__ */ o(P.Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ o(P.X, { className: "w-3.5 h-3.5" }),
            f.can_proceed ? c.canProceed : c.cannotProceed
          ]
        }
      ),
      f?.scenario && /* @__PURE__ */ o("span", { className: u("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border", r ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-700"), children: tt() })
    ] }),
    f && /* @__PURE__ */ p("div", { className: "grid gap-2 md:grid-cols-2", children: [
      /* @__PURE__ */ o(
        ct,
        {
          isDark: r,
          label: c.sourcePanel,
          value: f.local_copanel?.present ? `CoPanel ${f.local_copanel.version || ""}`.trim() : c.noCopanel,
          ok: !!f.local_copanel?.present
        }
      ),
      /* @__PURE__ */ o(
        ct,
        {
          isDark: r,
          label: c.targetPanel,
          value: f.remote_copanel?.present ? `CoPanel ${f.remote_copanel.version || ""}`.trim() : f.remote_rsync ? c.rsyncOnly : c.noRsync,
          ok: !!f.remote_copanel?.present || !!f.remote_rsync
        }
      )
    ] }),
    f?.items?.length ? /* @__PURE__ */ o("div", { className: "overflow-x-auto rounded-xl border border-slate-700/30", children: /* @__PURE__ */ p("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ o("thead", { children: /* @__PURE__ */ p("tr", { className: r ? "bg-slate-950/80" : "bg-slate-100", children: [
        /* @__PURE__ */ o("th", { className: "text-left p-2", children: c.tableItem }),
        /* @__PURE__ */ o("th", { className: "text-left p-2", children: c.source }),
        /* @__PURE__ */ o("th", { className: "text-left p-2", children: c.target }),
        /* @__PURE__ */ o("th", { className: "text-left p-2", children: "Status" })
      ] }) }),
      /* @__PURE__ */ o("tbody", { children: f.items.map((s) => /* @__PURE__ */ p("tr", { className: "border-t border-slate-700/20", children: [
        /* @__PURE__ */ p("td", { className: "p-2 align-top", children: [
          /* @__PURE__ */ o("span", { className: "font-mono font-bold", children: s.id }),
          /* @__PURE__ */ o("div", { className: u("mt-1", N), children: s.message })
        ] }),
        /* @__PURE__ */ o("td", { className: "p-2 font-mono align-top break-all", children: s.source || "—" }),
        /* @__PURE__ */ o("td", { className: "p-2 font-mono align-top break-all", children: s.target || "—" }),
        /* @__PURE__ */ o("td", { className: u("p-2 font-bold align-top", rn(s.severity, r)), children: s.severity })
      ] }, s.id)) })
    ] }) }) : /* @__PURE__ */ o("p", { className: u("text-sm", N), children: c.detectHint })
  ] }), Dt = () => /* @__PURE__ */ p("div", { className: "space-y-4", children: [
    /* @__PURE__ */ o("div", { className: "flex flex-wrap gap-2", children: Object.values(J).map((s) => /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        onClick: () => Nt(s.id),
        className: u(
          "rounded-xl border px-3 py-1.5 text-xs font-bold",
          pe === s.id ? "border-sky-500 text-sky-600 bg-sky-500/10" : r ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"
        ),
        children: n === "vi" ? s.label_vi : s.label_en
      },
      s.id
    )) }),
    /* @__PURE__ */ p("label", { className: "space-y-1 block", children: [
      /* @__PURE__ */ o("span", { className: u("text-xs font-bold", N), children: c.localPath }),
      /* @__PURE__ */ o("input", { value: j, onChange: (s) => Y(s.target.value), className: F })
    ] }),
    /* @__PURE__ */ p("label", { className: "space-y-1 block", children: [
      /* @__PURE__ */ o("span", { className: u("text-xs font-bold", N), children: c.remotePath }),
      /* @__PURE__ */ o("input", { value: O, onChange: (s) => x(s.target.value), className: F })
    ] }),
    /* @__PURE__ */ p("label", { className: "inline-flex items-center gap-2 text-sm cursor-pointer", children: [
      /* @__PURE__ */ o("input", { type: "checkbox", checked: Z, onChange: (s) => ee(s.target.checked), className: "rounded" }),
      c.alsoWeb
    ] }),
    /* @__PURE__ */ p("label", { className: "space-y-1 block", children: [
      /* @__PURE__ */ o("span", { className: u("text-xs font-bold", N), children: c.excludes }),
      /* @__PURE__ */ o(
        "textarea",
        {
          value: te,
          onChange: (s) => G(s.target.value),
          rows: 6,
          spellCheck: !1,
          className: u(F, "text-xs")
        }
      ),
      /* @__PURE__ */ o("span", { className: u("text-[10px]", N), children: c.excludesHint })
    ] }),
    b !== "clone" && /* @__PURE__ */ p("label", { className: "inline-flex items-start gap-2 text-sm cursor-pointer", children: [
      /* @__PURE__ */ o(
        "input",
        {
          type: "checkbox",
          checked: X,
          onChange: (s) => Q(s.target.checked),
          className: "rounded mt-1"
        }
      ),
      /* @__PURE__ */ p("span", { children: [
        /* @__PURE__ */ o("span", { className: "font-bold", children: c.deleteOpt }),
        /* @__PURE__ */ o("span", { className: u("block text-xs", N), children: c.deleteHint })
      ] })
    ] }),
    /* @__PURE__ */ p("div", { className: "flex flex-wrap items-end gap-3", children: [
      /* @__PURE__ */ p("label", { className: "space-y-1 block max-w-xs", children: [
        /* @__PURE__ */ o("span", { className: u("text-xs font-bold", N), children: c.estimateGb }),
        /* @__PURE__ */ o("input", { value: B, onChange: (s) => ae(s.target.value), className: F, placeholder: "20" })
      ] }),
      /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          onClick: () => void Ye(),
          disabled: $e,
          className: u("rounded-xl border px-3 py-2 text-xs font-bold", r ? "border-slate-700" : "border-slate-200"),
          children: $e ? c.estimating : c.autoEstimate
        }
      )
    ] })
  ] }), zt = () => K ? /* @__PURE__ */ o(nn, { job: be, isDark: r, onReset: et, tr: c }) : /* @__PURE__ */ p("div", { className: "space-y-3 text-sm", children: [
    /* @__PURE__ */ o(L, { k: c.modeLabel, v: b, isDark: r }),
    /* @__PURE__ */ o(L, { k: "SSH", v: `${C}@${w}:${R}`, isDark: r, mono: !0 }),
    /* @__PURE__ */ o(L, { k: c.localPath, v: j, isDark: r, mono: !0 }),
    /* @__PURE__ */ o(L, { k: c.remotePath, v: O, isDark: r, mono: !0 }),
    Z && /* @__PURE__ */ o(L, { k: "Extra", v: "/var/www → /var/www", isDark: r, mono: !0 }),
    /* @__PURE__ */ o(L, { k: "--delete", v: X && b !== "clone" ? "yes" : "no", isDark: r }),
    /* @__PURE__ */ o(L, { k: c.scenario, v: tt() || "—", isDark: r }),
    /* @__PURE__ */ o("p", { className: u("text-xs", N), children: c.warnDocker }),
    /* @__PURE__ */ o("p", { className: u("text-xs", N), children: c.sqlNote })
  ] }), At = () => /* @__PURE__ */ p("div", { className: "space-y-3", children: [
    be?.status === "success" && /* @__PURE__ */ o("p", { className: u("text-sm font-semibold", r ? "text-emerald-400" : "text-emerald-700"), children: c.jobSuccess }),
    (Ce.length ? Ce : []).map((s) => /* @__PURE__ */ p(
      "label",
      {
        className: u(
          "flex gap-3 rounded-xl border p-3 cursor-pointer",
          r ? "border-slate-800" : "border-slate-200",
          qe[s.id] && (r ? "bg-emerald-950/20" : "bg-emerald-50")
        ),
        children: [
          /* @__PURE__ */ o(
            "input",
            {
              type: "checkbox",
              checked: !!qe[s.id],
              onChange: (g) => Je((D) => ({ ...D, [s.id]: g.target.checked })),
              className: "mt-1 rounded"
            }
          ),
          /* @__PURE__ */ p("span", { children: [
            /* @__PURE__ */ o("span", { className: "text-sm font-bold block", children: s.title }),
            /* @__PURE__ */ o("span", { className: u("text-xs", N), children: s.detail })
          ] })
        ]
      },
      s.id
    )),
    !Ce.length && /* @__PURE__ */ o("p", { className: u("text-sm", N), children: c.doneHint }),
    /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        onClick: et,
        className: "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold border border-slate-300 dark:border-slate-700",
        children: [
          /* @__PURE__ */ o(P.RotateCcw, { className: "w-4 h-4" }),
          c.startOver
        ]
      }
    )
  ] }), It = () => {
    switch (d) {
      case "mode":
        return Rt();
      case "target":
        return Mt();
      case "detect":
        return Et();
      case "scope":
        return Dt();
      case "review":
        return zt();
      case "done":
        return At();
      default:
        return null;
    }
  }, Lt = /* @__PURE__ */ p("aside", { className: Dr(r), children: [
    /* @__PURE__ */ o("div", { className: zr(r), children: /* @__PURE__ */ p("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ o("div", { className: Ar(r), children: /* @__PURE__ */ o(P.RefreshCw, { className: "h-5 w-5 text-sky-500" }) }),
      /* @__PURE__ */ p("div", { className: "min-w-0", children: [
        /* @__PURE__ */ o("h1", { className: Ir(r), children: c.title }),
        /* @__PURE__ */ o("p", { className: Lr(r), children: c.subtitle })
      ] })
    ] }) }),
    /* @__PURE__ */ o("nav", { className: jr(), "aria-label": "Rsync wizard steps", children: ne.map((s) => {
      const g = tn[s], D = d === s, rt = ne.indexOf(s) < fe;
      return /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          disabled: !!K && s !== "review" && s !== "done",
          onClick: () => h(s),
          className: u(Or(r, D, "sky"), "disabled:opacity-50"),
          children: [
            /* @__PURE__ */ o(g, { className: u(Br(r, D, "sky"), !D && rt && "text-emerald-500") }),
            /* @__PURE__ */ o("span", { className: "flex-1 truncate font-medium", children: kt[s] }),
            rt && !D && /* @__PURE__ */ o(P.Check, { className: "h-3.5 w-3.5 shrink-0 text-emerald-500" })
          ]
        },
        s
      );
    }) })
  ] });
  return /* @__PURE__ */ p(_r, { className: "flex min-h-0 flex-col overflow-hidden", children: [
    /* @__PURE__ */ o(
      Rr,
      {
        isDark: r,
        mobileTitle: c.title,
        className: r ? "text-slate-100" : "text-slate-900",
        sidebar: Lt,
        children: /* @__PURE__ */ p("div", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: [
          /* @__PURE__ */ p("main", { className: u("min-h-0 flex-1 overflow-y-auto", i ? "p-5" : "p-5 md:p-8"), children: [
            /* @__PURE__ */ p("header", { className: "mb-6 space-y-1.5", children: [
              /* @__PURE__ */ o("h2", { className: u("text-lg font-bold", r ? "text-slate-100" : "text-slate-900"), children: Xe[d].title }),
              /* @__PURE__ */ o("p", { className: u("text-xs max-w-2xl", N), children: Xe[d].desc })
            ] }),
            /* @__PURE__ */ o("div", { className: _t, children: It() }),
            Fe && /* @__PURE__ */ p("p", { className: "mt-3 text-sm text-red-500 flex items-center gap-2", children: [
              /* @__PURE__ */ o(P.AlertCircle, { className: "w-4 h-4" }),
              " ",
              Fe
            ] })
          ] }),
          !K && d !== "done" && /* @__PURE__ */ p(
            "footer",
            {
              className: u(
                "shrink-0 flex items-center justify-between gap-3 border-t px-5 py-4",
                r ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-white/80"
              ),
              children: [
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    onClick: () => h(ne[Math.max(0, fe - 1)]),
                    disabled: fe === 0,
                    className: u(
                      "px-4 py-2 rounded-xl border text-sm font-bold disabled:opacity-40",
                      r ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"
                    ),
                    children: c.back
                  }
                ),
                d === "review" ? /* @__PURE__ */ p("div", { className: "flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ o(
                    "button",
                    {
                      type: "button",
                      disabled: ke,
                      onClick: () => {
                        Ve(!0), le(!0);
                      },
                      className: "px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold disabled:opacity-50",
                      children: c.dryRun
                    }
                  ),
                  /* @__PURE__ */ o(
                    "button",
                    {
                      type: "button",
                      disabled: ke || f?.can_proceed !== !0,
                      onClick: () => {
                        Ve(!1), le(!0);
                      },
                      className: "px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold disabled:opacity-50",
                      children: c.runSync
                    }
                  )
                ] }) : /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    onClick: () => void Tt(),
                    disabled: !Pt() && d !== "detect",
                    className: "px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold disabled:opacity-50",
                    children: d === "detect" && !f ? c.check : c.next
                  }
                )
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ o(
      Er,
      {
        open: wt,
        onClose: () => le(!1),
        title: me ? c.confirmDryTitle : c.confirmRealTitle,
        maxWidth: "md",
        children: /* @__PURE__ */ p("div", { className: "space-y-4 p-4", children: [
          /* @__PURE__ */ o("p", { className: u("text-sm", N), children: me ? c.confirmDryBody : c.confirmRealBody }),
          /* @__PURE__ */ p("div", { className: u("rounded-xl border p-3 text-xs space-y-1", r ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"), children: [
            /* @__PURE__ */ o(L, { k: "Mode", v: b, isDark: r }),
            /* @__PURE__ */ o(L, { k: "Target", v: `${C}@${w}`, isDark: r, mono: !0 }),
            /* @__PURE__ */ o(L, { k: "Paths", v: String(Ke().length), isDark: r }),
            !me && X && b !== "clone" && /* @__PURE__ */ o("p", { className: "text-amber-600 font-bold", children: "--delete enabled" })
          ] }),
          /* @__PURE__ */ p("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                onClick: () => le(!1),
                className: u("px-4 py-2 rounded-xl text-sm font-bold border", r ? "border-slate-700" : "border-slate-200"),
                children: c.cancel
              }
            ),
            /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                onClick: () => void St(me),
                disabled: ke,
                className: "px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-bold",
                children: c.confirm
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function rn(e, t) {
  return e === "block" ? t ? "text-red-400" : "text-red-600" : e === "warn" ? t ? "text-amber-400" : "text-amber-700" : t ? "text-emerald-400" : "text-emerald-700";
}
function ct({
  label: e,
  value: t,
  ok: r,
  isDark: n
}) {
  return /* @__PURE__ */ p(
    "div",
    {
      className: u(
        "rounded-xl border px-3 py-2 text-xs",
        r ? n ? "border-emerald-500/30 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50" : n ? "border-slate-700 bg-slate-950/40" : "border-slate-200 bg-slate-50"
      ),
      children: [
        /* @__PURE__ */ o("div", { className: u("font-bold uppercase tracking-wide", n ? "text-slate-400" : "text-slate-500"), children: e }),
        /* @__PURE__ */ o("div", { className: "mt-0.5 font-semibold", children: t })
      ]
    }
  );
}
function L({ k: e, v: t, isDark: r, mono: n }) {
  return /* @__PURE__ */ p("div", { className: "flex gap-3 text-xs", children: [
    /* @__PURE__ */ o("span", { className: u("w-28 shrink-0 font-bold", r ? "text-slate-400" : "text-slate-500"), children: e }),
    /* @__PURE__ */ o("span", { className: u("min-w-0 break-all", n && "font-mono"), children: t })
  ] });
}
function nn({
  job: e,
  isDark: t,
  onReset: r,
  tr: n
}) {
  const [i, a] = y("");
  if (q(() => {
    if (!e?.id) return;
    let b = !1;
    const v = () => {
      z(
        `/api/platform/jobs/${e.id}`
      ).then((T) => {
        b || Array.isArray(T.logs) && T.logs.length && a(
          T.logs.slice(-100).map((R) => R.line || "").filter(Boolean).join(`
`)
        );
      }).catch(() => {
      });
    };
    v();
    const w = setInterval(v, 2e3);
    return () => {
      b = !0, clearInterval(w);
    };
  }, [e?.id, e?.status, e?.progress]), !e)
    return /* @__PURE__ */ o("p", { className: u("text-sm", t ? "text-slate-400" : "text-slate-500"), children: n.submitting });
  const l = e.status === "failed", d = e.status === "success", h = e.status === "running" || e.status === "queued";
  return /* @__PURE__ */ p("div", { className: "space-y-4", children: [
    /* @__PURE__ */ p("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ o("h3", { className: "text-base font-bold", children: e.title }),
      /* @__PURE__ */ o("span", { className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-500", children: e.status })
    ] }),
    h && /* @__PURE__ */ o("div", { className: u("h-2 rounded-full overflow-hidden", t ? "bg-slate-800" : "bg-slate-200"), children: /* @__PURE__ */ o("div", { className: "h-full bg-sky-500 transition-all", style: { width: `${e.progress || 0}%` } }) }),
    e.message && /* @__PURE__ */ o("p", { className: u("text-xs", t ? "text-slate-400" : "text-slate-500"), children: e.message }),
    l && /* @__PURE__ */ o("p", { className: "text-sm text-red-500", children: e.error }),
    d && e.result?.summary && /* @__PURE__ */ o("p", { className: u("text-sm", t ? "text-emerald-400" : "text-emerald-700"), children: String(e.result.summary) }),
    i && /* @__PURE__ */ o(
      "pre",
      {
        className: u(
          "rounded-xl border p-3 text-[11px] font-mono overflow-auto max-h-64 whitespace-pre-wrap",
          t ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
        ),
        children: i
      }
    ),
    (d || l) && /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        onClick: r,
        className: u("rounded-xl border px-3 py-2 text-xs font-bold", t ? "border-slate-700" : "border-slate-200"),
        children: n.startOver
      }
    )
  ] });
}
const on = {
  title: "Rsync Manager",
  subtitle: "Move · Clone · Sync VPS",
  stepMode: "Mode",
  stepTarget: "Target",
  stepDetect: "Detect",
  stepScope: "Scope",
  stepReview: "Run",
  stepDone: "Checklist",
  modeTitle: "Choose migration mode",
  modeDesc: "Works when both servers have CoPanel, or the target already has rsync.",
  targetTitle: "Target SSH",
  targetDesc: "Key-based SSH from this panel to VPS 2 (BatchMode).",
  detectTitle: "Compatibility & CoPanel detect",
  detectDesc: "Detects remote CoPanel, rsync, arch, OS, and free disk.",
  scopeTitle: "Paths & excludes",
  scopeDesc: "Pick CoPanel / web presets or custom trees. Safer excludes skip config & data by default.",
  reviewTitle: "Review & run",
  reviewDesc: "Dry-run first, then real sync as a Task Center job with progress.",
  doneTitle: "Post-migrate checklist",
  doneDesc: "SQL, Docker, DNS/SSL, and cutover are manual — tick off as you finish.",
  modeLabel: "Mode",
  cloneTitle: "Clone",
  cloneDesc: "Copy trees to VPS 2 without deleting remote extras. Source stays online.",
  syncTitle: "Sync",
  syncDesc: "Incremental update. Optional --delete for a mirror.",
  moveTitle: "Move",
  moveDesc: "Full cutover workflow: sync files, then checklist for DNS/SQL/Docker.",
  host: "Host / IP",
  port: "Port",
  user: "User",
  identity: "Identity file (on this server)",
  identityHint: "Private key readable by the panel user.",
  keyHints: "Detected keys on this host",
  keyAuthHint: "Paste the public key into target ~/.ssh/authorized_keys, then select the identity path.",
  check: "Run detection",
  checking: "Checking…",
  installRsync: "Install rsync on target",
  installFail: "Could not install rsync on target (need root or passwordless sudo).",
  canProceed: "Ready",
  cannotProceed: "Blocked — fix red items",
  scenarioBoth: "Both sides: CoPanel",
  scenarioRsync: "Target: rsync ready",
  scenarioNeed: "Target: needs rsync",
  scenarioBlocked: "Blocked",
  sourcePanel: "Source",
  targetPanel: "Target",
  noCopanel: "No CoPanel tree",
  rsyncOnly: "rsync only (no CoPanel yet)",
  noRsync: "rsync missing",
  detectHint: "Run detection to see architecture, OS, CoPanel, and rsync status.",
  tableItem: "Check",
  source: "Source",
  target: "Target",
  localPath: "Local source path",
  remotePath: "Remote absolute path",
  alsoWeb: "Also sync /var/www",
  excludes: "Exclude patterns (one per line)",
  excludesHint: "Default CoPanel preset skips config/, backend/data/, venv, node_modules.",
  deleteOpt: "Mirror deletions (--delete)",
  deleteHint: "Removes files on target that are gone on source. Dangerous — confirm carefully.",
  estimateGb: "Estimated size (GB)",
  autoEstimate: "Auto du",
  estimating: "Estimating…",
  dryRun: "Dry run",
  runSync: "Run real sync",
  scenario: "Scenario",
  warnDocker: "Docker is not migrated; rebuild stacks on the new VPS.",
  sqlNote: "Databases: dump/restore separately (Database Manager).",
  jobSuccess: "Transfer job finished successfully.",
  doneHint: "Load checklist after a successful job, or continue manually.",
  startOver: "Start over",
  back: "Back",
  next: "Next",
  cancel: "Cancel",
  confirm: "Start",
  confirmDryTitle: "Start dry-run?",
  confirmDryBody: "No files will be written. Progress appears in Task Center.",
  confirmRealTitle: "Start real sync?",
  confirmRealBody: "Files will be copied over SSH. Ensure detection passed and excludes look correct.",
  submitting: "Submitting job…"
}, sn = {
  title: "Rsync Manager",
  subtitle: "Move · Clone · Sync VPS",
  stepMode: "Chế độ",
  stepTarget: "Máy đích",
  stepDetect: "Phát hiện",
  stepScope: "Phạm vi",
  stepReview: "Chạy",
  stepDone: "Checklist",
  modeTitle: "Chọn chế độ chuyển máy",
  modeDesc: "Dùng khi cả hai máy có CoPanel, hoặc máy đích đã có rsync.",
  targetTitle: "SSH máy đích",
  targetDesc: "SSH bằng khóa từ panel này sang VPS 2 (BatchMode).",
  detectTitle: "Tương thích & phát hiện CoPanel",
  detectDesc: "Phát hiện CoPanel remote, rsync, arch, OS và dung lượng trống.",
  scopeTitle: "Đường dẫn & loại trừ",
  scopeDesc: "Preset CoPanel / web hoặc tùy chỉnh. Mặc định bỏ config & data để an toàn.",
  reviewTitle: "Xem lại & chạy",
  reviewDesc: "Dry-run trước, rồi sync thật qua Task Center có tiến trình.",
  doneTitle: "Checklist sau migrate",
  doneDesc: "SQL, Docker, DNS/SSL và cutover làm thủ công — đánh dấu khi xong.",
  modeLabel: "Chế độ",
  cloneTitle: "Clone",
  cloneDesc: "Sao chép sang VPS 2, không xoá file thừa trên đích. Nguồn vẫn chạy.",
  syncTitle: "Sync",
  syncDesc: "Cập nhật tăng dần. Tuỳ chọn --delete để mirror.",
  moveTitle: "Move",
  moveDesc: "Quy trình cutover: sync file rồi checklist DNS/SQL/Docker.",
  host: "Host / IP",
  port: "Cổng",
  user: "User",
  identity: "File khóa (trên máy panel)",
  identityHint: "Private key user panel đọc được.",
  keyHints: "Khóa phát hiện trên máy này",
  keyAuthHint: "Dán public key vào ~/.ssh/authorized_keys trên đích, rồi chọn identity.",
  check: "Chạy phát hiện",
  checking: "Đang kiểm tra…",
  installRsync: "Cài rsync trên đích",
  installFail: "Không cài được rsync trên đích (cần root hoặc sudo không mật khẩu).",
  canProceed: "Sẵn sàng",
  cannotProceed: "Bị chặn — sửa mục đỏ",
  scenarioBoth: "Hai phía: có CoPanel",
  scenarioRsync: "Đích: đã có rsync",
  scenarioNeed: "Đích: thiếu rsync",
  scenarioBlocked: "Bị chặn",
  sourcePanel: "Nguồn",
  targetPanel: "Đích",
  noCopanel: "Không có cây CoPanel",
  rsyncOnly: "Chỉ rsync (chưa CoPanel)",
  noRsync: "Thiếu rsync",
  detectHint: "Chạy phát hiện để xem arch, OS, CoPanel và rsync.",
  tableItem: "Mục",
  source: "Nguồn",
  target: "Đích",
  localPath: "Đường dẫn nguồn",
  remotePath: "Đường dẫn đích (tuyệt đối)",
  alsoWeb: "Đồng bộ thêm /var/www",
  excludes: "Mẫu loại trừ (mỗi dòng một mẫu)",
  excludesHint: "Preset CoPanel mặc định bỏ config/, backend/data/, venv, node_modules.",
  deleteOpt: "Mirror xoá (--delete)",
  deleteHint: "Xoá file trên đích đã mất ở nguồn. Nguy hiểm — xác nhận kỹ.",
  estimateGb: "Dung lượng ước tính (GB)",
  autoEstimate: "Tự du",
  estimating: "Đang ước tính…",
  dryRun: "Chạy thử",
  runSync: "Đồng bộ thật",
  scenario: "Kịch bản",
  warnDocker: "Docker không được chuyển; dựng lại trên VPS mới.",
  sqlNote: "Database: dump/restore riêng (Database Manager).",
  jobSuccess: "Job chuyển file đã hoàn tất.",
  doneHint: "Checklist tải sau job thành công, hoặc làm thủ công.",
  startOver: "Bắt đầu lại",
  back: "Quay lại",
  next: "Tiếp",
  cancel: "Hủy",
  confirm: "Bắt đầu",
  confirmDryTitle: "Chạy dry-run?",
  confirmDryBody: "Không ghi file. Tiến trình hiện ở Task Center.",
  confirmRealTitle: "Chạy sync thật?",
  confirmRealBody: "File sẽ được copy qua SSH. Đảm bảo đã detect OK và excludes đúng.",
  submitting: "Đang gửi job…"
}, an = { en: on, vi: sn };
export {
  hn as default
};
