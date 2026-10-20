var ze = Object.defineProperty;
var Pe = (e, t, r) => t in e ? ze(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var $ = (e, t, r) => Pe(e, typeof t != "symbol" ? t + "" : t, r);
import { jsx as l, jsxs as m } from "react/jsx-runtime";
import { createContext as xe, useContext as ye, Fragment as Ee, useState as _, useEffect as ve, useRef as de, useMemo as je, useCallback as $e } from "react";
import * as M from "lucide-react";
import { useOutletContext as Le } from "react-router-dom";
const Re = xe(null);
function Ie() {
  return ye(Re);
}
const Ge = {
  theme: localStorage.getItem("copanel_theme") || "light",
  setTheme: () => {
  },
  language: localStorage.getItem("copanel_lang") || "en",
  setLanguage: () => {
  }
};
function we() {
  const e = Ie(), t = Le();
  return e || (t?.theme ? {
    theme: t.theme,
    setTheme: t.setTheme ?? (() => {
    }),
    language: t.language ?? "en",
    setLanguage: t.setLanguage ?? (() => {
    })
  } : Ge);
}
class ue extends Error {
  constructor(r, o, s, n) {
    super(o);
    $(this, "code");
    $(this, "status");
    $(this, "details");
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
  let a = null;
  const i = await n.text();
  if (i)
    try {
      a = JSON.parse(i);
    } catch {
      a = i;
    }
  if (t.raw)
    return a;
  if (!n.ok) {
    const d = a && typeof a == "object" && a.error ? a.error : { code: `HTTP_${n.status}`, message: typeof a == "string" ? a : a?.detail || n.statusText };
    throw new ue(d.code || `HTTP_${n.status}`, d.message || "Request failed", n.status, d.details);
  }
  if (a && typeof a == "object" && "status" in a) {
    if (a.status === "success")
      return a.data !== void 0 ? a.data : a;
    if (a.status === "error" && a.error)
      throw new ue(a.error.code, a.error.message, n.status, a.error.details);
  }
  return a;
}
const Oe = "copanel-platform-sse-degraded", B = 2e3, We = 6e4, Ve = 3;
class Fe {
  constructor() {
    $(this, "source", null);
    $(this, "handlers", /* @__PURE__ */ new Map());
    $(this, "retryDelay", B);
    $(this, "retryTimer", null);
    $(this, "failureCount", 0);
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
        this.failureCount = 0, this.retryDelay = B;
      }), this.source.addEventListener("jobs", (r) => {
        this.onStreamMessage(), this.parseAndEmit("jobs", r.data);
      }), this.source.addEventListener("notifications", (r) => {
        this.onStreamMessage(), this.parseAndEmit("notifications", r.data);
      }), this.source.addEventListener("message", () => {
        this.onStreamMessage();
      }), this.source.onerror = () => {
        this.failureCount += 1, this.source?.close(), this.source = null, this.failureCount >= Ve && window.dispatchEvent(new CustomEvent(Oe)), this.scheduleRetry();
      };
    }
  }
  onStreamMessage() {
    this.failureCount = 0, this.retryDelay = B;
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
    this.retryDelay = Math.min(Math.round(this.retryDelay * 1.8), We), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.ensureConnected();
    }, t);
  }
  teardownIfIdle() {
    this.handlers.size > 0 || (this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.source && (this.source.close(), this.source = null), this.failureCount = 0, this.retryDelay = B);
  }
  /** Drop the SSE connection and open a new one if handlers exist and a token is present. */
  reconnect() {
    this.source && (this.source.close(), this.source = null), this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null), this.failureCount = 0, this.retryDelay = B, this.handlers.size > 0 && this.ensureConnected();
  }
}
const ne = new Fe();
function Ue() {
  ne.reconnect();
}
typeof document < "u" && document.addEventListener("visibilitychange", () => {
  document.hidden || Ue();
});
function ke(e) {
  let t = e;
  const r = /* @__PURE__ */ new Set();
  return {
    getState: () => t,
    setState: (o) => {
      const s = typeof o == "function" ? o(t) : o;
      if (!s || Object.keys(s).length === 0) return;
      let n = !1;
      for (const a of Object.keys(s))
        if (t[a] !== s[a]) {
          n = !0;
          break;
        }
      n && (t = { ...t, ...s }, r.forEach((a) => a()));
    },
    subscribe: (o) => (r.add(o), () => r.delete(o))
  };
}
const Ce = ke({ jobs: {}, order: [], lastFetch: 0 });
function Be() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function pe(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object") return e[t] || e.en || e.vi || e.default;
  }
}
function O(e, t, r) {
  if (!e || typeof e != "object") return;
  const o = pe(e[t], r);
  if (o) return o;
  const s = pe(e[`${t}_i18n`], r);
  if (s) return s;
  const n = e[`${t}_${r}`];
  if (typeof n == "string" && n) return n;
  const a = e[`${t}_en`];
  if (typeof a == "string" && a) return a;
  const i = e[`${t}_vi`];
  if (typeof i == "string" && i) return i;
}
function Ke(e) {
  const t = Be(), r = e?.payload && typeof e.payload == "object" ? e.payload : {};
  return {
    ...e,
    title: O(e, "title", t) || O(r, "title", t) || e?.title || "",
    message: O(e, "message", t) || O(r, "message", t) || e?.message,
    error: O(e, "error", t) || O(r, "error", t) || e?.error || null
  };
}
function me(e) {
  const t = Ke(e);
  Ce.setState((r) => {
    const o = { ...r.jobs, [t.id]: { ...r.jobs[t.id], ...t } };
    let s = r.order;
    return s.includes(t.id) || (s = [t.id, ...s].slice(0, 200)), { jobs: o, order: s };
  });
}
ne.on("jobs", (e) => {
  if (e?.job) {
    me(e.job);
    return;
  }
  if (e?.job_id && e?.event === "update") {
    const t = Ce.getState().jobs[e.job_id];
    t && me({
      ...t,
      progress: e.progress ?? t.progress,
      message: e.message ?? t.message,
      status: e.status ?? t.status
    });
  }
});
const re = ke({ inbox: [], unread: 0, toasts: [] }), De = 6e3;
function He() {
  return localStorage.getItem("copanel_lang") === "vi" ? "vi" : "en";
}
function he(e, t) {
  if (e) {
    if (typeof e == "string") return e;
    if (typeof e == "object")
      return e[t] || e.en || e.vi || e.default;
  }
}
function Y(e, t, r) {
  if (!e || typeof e != "object") return;
  const o = he(e[t], r);
  if (o) return o;
  const s = he(e[`${t}_i18n`], r);
  if (s) return s;
  const n = e[`${t}_${r}`];
  if (typeof n == "string" && n) return n;
  const a = e[`${t}_en`];
  if (typeof a == "string" && a) return a;
  const i = e[`${t}_vi`];
  if (typeof i == "string" && i) return i;
}
function qe(e) {
  const t = He(), r = e?.payload && typeof e.payload == "object" ? e.payload : {}, o = Y(e, "title", t) || Y(r, "title", t) || e?.title || "", s = Y(e, "body", t) || Y(r, "body", t) || e?.body || null;
  return {
    ...e,
    title: o,
    body: s
  };
}
function Je(e) {
  re.setState((t) => ({ toasts: [e, ...t.toasts].slice(0, 6) })), e.ephemeral !== !1 && setTimeout(() => {
    re.setState((t) => ({ toasts: t.toasts.filter((r) => r.id !== e.id) }));
  }, De);
}
ne.on("notifications", (e) => {
  if (e?.event === "new" && e.notification) {
    const t = qe(e.notification);
    Je({ ...t, ephemeral: !0 }), re.setState((r) => ({
      inbox: [t, ...r.inbox].slice(0, 200),
      unread: r.unread + 1
    }));
  }
});
function Ne(e) {
  var t, r, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (t = 0; t < s; t++) e[t] && (r = Ne(e[t])) && (o && (o += " "), o += r);
  } else for (r in e) e[r] && (o && (o += " "), o += r);
  return o;
}
function Xe() {
  for (var e, t, r = 0, o = "", s = arguments.length; r < s; r++) (e = arguments[r]) && (t = Ne(e)) && (o && (o += " "), o += t);
  return o;
}
const se = "-", Ye = (e) => {
  const t = Ze(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (a) => {
      const i = a.split(se);
      return i[0] === "" && i.length !== 1 && i.shift(), Se(i, t) || Qe(a);
    },
    getConflictingClassGroupIds: (a, i) => {
      const d = r[a] || [];
      return i && o[a] ? [...d, ...o[a]] : d;
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
  const n = e.join(se);
  return t.validators.find(({
    validator: a
  }) => a(n))?.classGroupId;
}, ge = /^\[(.+)\]$/, Qe = (e) => {
  if (ge.test(e)) {
    const t = ge.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, Ze = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, o = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return tt(Object.entries(e.classGroups), r).forEach(([n, a]) => {
    oe(a, o, n, t);
  }), o;
}, oe = (e, t, r, o) => {
  e.forEach((s) => {
    if (typeof s == "string") {
      const n = s === "" ? t : be(t, s);
      n.classGroupId = r;
      return;
    }
    if (typeof s == "function") {
      if (et(s)) {
        oe(s(o), t, r, o);
        return;
      }
      t.validators.push({
        validator: s,
        classGroupId: r
      });
      return;
    }
    Object.entries(s).forEach(([n, a]) => {
      oe(a, be(t, n), r, o);
    });
  });
}, be = (e, t) => {
  let r = e;
  return t.split(se).forEach((o) => {
    r.nextPart.has(o) || r.nextPart.set(o, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(o);
  }), r;
}, et = (e) => e.isThemeGetter, tt = (e, t) => t ? e.map(([r, o]) => {
  const s = o.map((n) => typeof n == "string" ? t + n : typeof n == "object" ? Object.fromEntries(Object.entries(n).map(([a, i]) => [t + a, i])) : n);
  return [r, s];
}) : e, rt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  const s = (n, a) => {
    r.set(n, a), t++, t > e && (t = 0, o = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(n) {
      let a = r.get(n);
      if (a !== void 0)
        return a;
      if ((a = o.get(n)) !== void 0)
        return s(n, a), a;
    },
    set(n, a) {
      r.has(n) ? r.set(n, a) : s(n, a);
    }
  };
}, Ae = "!", ot = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, o = t.length === 1, s = t[0], n = t.length, a = (i) => {
    const d = [];
    let u = 0, h = 0, N;
    for (let g = 0; g < i.length; g++) {
      let b = i[g];
      if (u === 0) {
        if (b === s && (o || i.slice(g, g + n) === t)) {
          d.push(i.slice(h, g)), h = g + n;
          continue;
        }
        if (b === "/") {
          N = g;
          continue;
        }
      }
      b === "[" ? u++ : b === "]" && u--;
    }
    const w = d.length === 0 ? i : i.substring(h), A = w.startsWith(Ae), S = A ? w.substring(1) : w, y = N && N > h ? N - h : void 0;
    return {
      modifiers: d,
      hasImportantModifier: A,
      baseClassName: S,
      maybePostfixModifierPosition: y
    };
  };
  return r ? (i) => r({
    className: i,
    parseClassName: a
  }) : a;
}, nt = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((o) => {
    o[0] === "[" ? (t.push(...r.sort(), o), r = []) : r.push(o);
  }), t.push(...r.sort()), t;
}, st = (e) => ({
  cache: rt(e.cacheSize),
  parseClassName: ot(e),
  ...Ye(e)
}), at = /\s+/, it = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: o,
    getConflictingClassGroupIds: s
  } = t, n = [], a = e.trim().split(at);
  let i = "";
  for (let d = a.length - 1; d >= 0; d -= 1) {
    const u = a[d], {
      modifiers: h,
      hasImportantModifier: N,
      baseClassName: w,
      maybePostfixModifierPosition: A
    } = r(u);
    let S = !!A, y = o(S ? w.substring(0, A) : w);
    if (!y) {
      if (!S) {
        i = u + (i.length > 0 ? " " + i : i);
        continue;
      }
      if (y = o(w), !y) {
        i = u + (i.length > 0 ? " " + i : i);
        continue;
      }
      S = !1;
    }
    const g = nt(h).join(":"), b = N ? g + Ae : g, k = b + y;
    if (n.includes(k))
      continue;
    n.push(k);
    const z = s(y, S);
    for (let P = 0; P < z.length; ++P) {
      const c = z[P];
      n.push(b + c);
    }
    i = u + (i.length > 0 ? " " + i : i);
  }
  return i;
};
function lt() {
  let e = 0, t, r, o = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = Me(t)) && (o && (o += " "), o += r);
  return o;
}
const Me = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (t = Me(e[o])) && (r && (r += " "), r += t);
  return r;
};
function ct(e, ...t) {
  let r, o, s, n = a;
  function a(d) {
    const u = t.reduce((h, N) => N(h), e());
    return r = st(u), o = r.cache.get, s = r.cache.set, n = i, i(d);
  }
  function i(d) {
    const u = o(d);
    if (u)
      return u;
    const h = it(d, r);
    return s(d, h), h;
  }
  return function() {
    return n(lt.apply(null, arguments));
  };
}
const f = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, Te = /^\[(?:([a-z-]+):)?(.+)\]$/i, dt = /^\d+\/\d+$/, ut = /* @__PURE__ */ new Set(["px", "full", "screen"]), pt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, mt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ht = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, gt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, bt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, L = (e) => W(e) || ut.has(e) || dt.test(e), R = (e) => V(e, "length", Nt), W = (e) => !!e && !Number.isNaN(Number(e)), ee = (e) => V(e, "number", W), K = (e) => !!e && Number.isInteger(Number(e)), ft = (e) => e.endsWith("%") && W(e.slice(0, -1)), p = (e) => Te.test(e), I = (e) => pt.test(e), xt = /* @__PURE__ */ new Set(["length", "size", "percentage"]), yt = (e) => V(e, xt, _e), vt = (e) => V(e, "position", _e), wt = /* @__PURE__ */ new Set(["image", "url"]), kt = (e) => V(e, wt, At), Ct = (e) => V(e, "", St), D = () => !0, V = (e, t, r) => {
  const o = Te.exec(e);
  return o ? o[1] ? typeof t == "string" ? o[1] === t : t.has(o[1]) : r(o[2]) : !1;
}, Nt = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  mt.test(e) && !ht.test(e)
), _e = () => !1, St = (e) => gt.test(e), At = (e) => bt.test(e), Mt = () => {
  const e = f("colors"), t = f("spacing"), r = f("blur"), o = f("brightness"), s = f("borderColor"), n = f("borderRadius"), a = f("borderSpacing"), i = f("borderWidth"), d = f("contrast"), u = f("grayscale"), h = f("hueRotate"), N = f("invert"), w = f("gap"), A = f("gradientColorStops"), S = f("gradientColorStopPositions"), y = f("inset"), g = f("margin"), b = f("opacity"), k = f("padding"), z = f("saturate"), P = f("scale"), c = f("sepia"), v = f("skew"), E = f("space"), T = f("translate"), C = () => ["auto", "contain", "none"], F = () => ["auto", "hidden", "clip", "visible", "scroll"], G = () => ["auto", p, t], x = () => [p, t], ae = () => ["", L, R], J = () => ["auto", W, p], ie = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], X = () => ["solid", "dashed", "dotted", "double", "none"], le = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], Z = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], U = () => ["", "0", p], ce = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], j = () => [W, p];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [D],
      spacing: [L, R],
      blur: ["none", "", I, p],
      brightness: j(),
      borderColor: [e],
      borderRadius: ["none", "", "full", I, p],
      borderSpacing: x(),
      borderWidth: ae(),
      contrast: j(),
      grayscale: U(),
      hueRotate: j(),
      invert: U(),
      gap: x(),
      gradientColorStops: [e],
      gradientColorStopPositions: [ft, R],
      inset: G(),
      margin: G(),
      opacity: j(),
      padding: x(),
      saturate: j(),
      scale: j(),
      sepia: U(),
      skew: j(),
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
        columns: [I]
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
        object: [...ie(), p]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: F()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": F()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": F()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: C()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": C()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": C()
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
        inset: [y]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [y]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [y]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [y]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [y]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [y]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [y]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [y]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [y]
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
        z: ["auto", K, p]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: G()
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
        order: ["first", "last", "none", K, p]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [D]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", K, p]
        }, p]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": J()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": J()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [D]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [K, p]
        }, p]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": J()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": J()
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
        gap: [w]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [w]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [w]
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
        m: [g]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [g]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [g]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [g]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [g]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [g]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [g]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [g]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [g]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [E]
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
        "space-y": [E]
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
          screen: [I]
        }, I]
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
        text: ["base", I, R]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", ee]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [D]
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
        "line-clamp": ["none", W, ee]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", L, p]
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
        "placeholder-opacity": [b]
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
        "text-opacity": [b]
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
        decoration: [...X(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", L, R]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", L, p]
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
        "bg-opacity": [b]
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
        bg: [...ie(), vt]
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
        bg: ["auto", "cover", "contain", yt]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, kt]
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
        from: [S]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [S]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [S]
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
        border: [i]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [i]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [i]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [i]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [i]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [i]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [i]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [i]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [i]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [b]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...X(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [i]
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
        "divide-y": [i]
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
        "divide-opacity": [b]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: X()
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
        outline: ["", ...X()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [L, p]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [L, R]
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
        ring: ae()
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
        "ring-opacity": [b]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [L, R]
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
        shadow: ["", "inner", "none", I, Ct]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [D]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [b]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...le(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": le()
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
        "drop-shadow": ["", "none", I, p]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [u]
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
        "backdrop-grayscale": [u]
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
        "backdrop-invert": [N]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [b]
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
        "border-spacing": [a]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [a]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [a]
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
        duration: j()
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
        delay: j()
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
        scale: [P]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [P]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [P]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [K, p]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [T]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [T]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [v]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [v]
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
        stroke: [L, R, ee]
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
}, Tt = /* @__PURE__ */ ct(Mt);
function _t(...e) {
  return Tt(Xe(e));
}
const zt = "copanel_mobile_desktop_site";
function Pt() {
  try {
    return localStorage.getItem(zt) === "1";
  } catch {
    return !1;
  }
}
function Et(e = window.innerWidth) {
  return Pt() || e >= 1024;
}
const jt = xe(null);
function $t() {
  return ye(jt);
}
function Lt() {
  return $t()?.isWindowed === !0;
}
function Rt({ children: e, className: t, constrained: r = !1 }) {
  const { theme: o } = we(), s = Lt(), n = o === "dark", a = !s && !Et();
  return /* @__PURE__ */ l(
    "div",
    {
      className: _t(
        "flex flex-col transition-colors duration-200",
        s ? "h-full min-h-0" : a ? "min-h-0" : "min-h-screen",
        n ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        !s && r && "mx-auto max-w-7xl",
        t
      ),
      children: e
    }
  );
}
const It = {
  title: "CoAgent",
  subtitle: "AI SysAdmin for your VPS",
  placeholder: "Ask CoAgent… e.g. Why is my site returning 502?",
  send: "Send",
  thinking: "CoAgent is thinking…",
  empty: "Ask anything about your VPS. CoAgent can inspect metrics, logs, and propose safe fixes.",
  approve: "Approve & Run",
  cancel: "Cancel",
  actionPending: "Action requires your confirmation",
  actionRunning: "Executing…",
  actionDone: "Action completed",
  actionFailed: "Action failed",
  actionCancelled: "Action cancelled",
  settings: "Settings",
  save: "Save",
  saved: "Settings saved",
  baseUrl: "API Base URL",
  apiKey: "API Key",
  model: "Model",
  enabled: "Enable CoAgent",
  apiKeyHint: "Leave blank to keep the current key",
  apiKeySet: "API key is configured",
  apiKeyMissing: "API key not set",
  close: "Close",
  clearChat: "Clear chat",
  you: "You",
  agent: "CoAgent",
  risk: "Risk",
  command: "Command preview",
  error: "Error",
  quickTitle: "Quick prompts"
}, Gt = {
  title: "CoAgent",
  subtitle: "AI SysAdmin cho VPS của bạn",
  placeholder: "Hỏi CoAgent… ví dụ: Vì sao trang web bị lỗi 502?",
  send: "Gửi",
  thinking: "CoAgent đang suy nghĩ…",
  empty: "Hỏi bất cứ điều gì về VPS. CoAgent có thể xem metrics, log và đề xuất thao tác an toàn.",
  approve: "Đồng ý thực thi",
  cancel: "Hủy bỏ",
  actionPending: "Thao tác cần bạn xác nhận",
  actionRunning: "Đang thực thi…",
  actionDone: "Thao tác hoàn tất",
  actionFailed: "Thao tác thất bại",
  actionCancelled: "Đã hủy thao tác",
  settings: "Cài đặt",
  save: "Lưu",
  saved: "Đã lưu cấu hình",
  baseUrl: "API Base URL",
  apiKey: "API Key",
  model: "Model",
  enabled: "Bật CoAgent",
  apiKeyHint: "Để trống nếu muốn giữ key hiện tại",
  apiKeySet: "Đã cấu hình API key",
  apiKeyMissing: "Chưa có API key",
  close: "Đóng",
  clearChat: "Xóa hội thoại",
  you: "Bạn",
  agent: "CoAgent",
  risk: "Mức rủi ro",
  command: "Lệnh / script sẽ chạy",
  error: "Lỗi",
  quickTitle: "Gợi ý nhanh"
}, q = { en: It, vi: Gt }, Ot = {
  en: [
    "Check current VPS resource usage",
    "Why might the website return 502/504?",
    "Optimize RAM and clear system cache",
    "Create a reverse proxy for app.domain.com pointing to port 8000"
  ],
  vi: [
    "Kiểm tra tài nguyên VPS hiện tại",
    "Vì sao trang web bị lỗi 502/504?",
    "Tối ưu RAM và dọn cache hệ thống",
    "Tạo Reverse Proxy cho domain app.domain.com trỏ về port 8000"
  ]
};
function Wt({
  action: e,
  language: t,
  onApprove: r,
  onCancel: o
}) {
  const s = q[t], n = e.status || "pending", a = (e.risk || "medium").toLowerCase(), i = a === "high" ? "text-red-600 dark:text-red-400" : a === "low" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400";
  return /* @__PURE__ */ l("div", { className: "mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 dark:bg-amber-500/10", children: /* @__PURE__ */ m("div", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ l(M.AlertTriangle, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-500" }),
    /* @__PURE__ */ m("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ l("div", { className: "text-sm font-semibold text-slate-900 dark:text-slate-100", children: s.actionPending }),
      /* @__PURE__ */ l("div", { className: "mt-1 text-sm text-slate-800 dark:text-slate-200", children: e.title }),
      /* @__PURE__ */ m("div", { className: `mt-1 text-xs font-medium ${i}`, children: [
        s.risk,
        ": ",
        a
      ] }),
      /* @__PURE__ */ m("div", { className: "mt-2", children: [
        /* @__PURE__ */ l("div", { className: "text-[11px] uppercase tracking-wide text-slate-500", children: s.command }),
        /* @__PURE__ */ l("pre", { className: "mt-1 overflow-x-auto rounded-lg bg-slate-900/90 p-2 text-xs text-emerald-300", children: e.command_preview })
      ] }),
      e.args && Object.keys(e.args).length > 0 && /* @__PURE__ */ l("pre", { className: "mt-2 overflow-x-auto rounded-lg bg-white/60 p-2 text-[11px] text-slate-700 dark:bg-black/30 dark:text-slate-300", children: JSON.stringify(e.args, null, 2) }),
      e.resultSummary && /* @__PURE__ */ l("div", { className: "mt-2 text-xs text-slate-700 dark:text-slate-300", children: e.resultSummary }),
      n === "pending" && /* @__PURE__ */ m("div", { className: "mt-3 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            onClick: () => r(e.action_id),
            className: "inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500",
            children: [
              /* @__PURE__ */ l(M.Check, { className: "h-3.5 w-3.5" }),
              s.approve
            ]
          }
        ),
        /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            onClick: () => o(e.action_id),
            className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
            children: [
              /* @__PURE__ */ l(M.X, { className: "h-3.5 w-3.5" }),
              s.cancel
            ]
          }
        )
      ] }),
      n === "running" && /* @__PURE__ */ m("div", { className: "mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300", children: [
        /* @__PURE__ */ l(M.Loader2, { className: "h-3.5 w-3.5 animate-spin" }),
        s.actionRunning
      ] }),
      n === "done" && /* @__PURE__ */ l("div", { className: "mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400", children: s.actionDone }),
      n === "failed" && /* @__PURE__ */ l("div", { className: "mt-2 text-xs font-medium text-red-600 dark:text-red-400", children: s.actionFailed }),
      n === "cancelled" && /* @__PURE__ */ l("div", { className: "mt-2 text-xs text-slate-500", children: s.actionCancelled })
    ] })
  ] }) });
}
function Q(e, t) {
  const r = [], o = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let s = 0, n, a = 0;
  for (; (n = o.exec(e)) !== null; ) {
    n.index > s && r.push(e.slice(s, n.index));
    const i = n[0], d = `${t}-${a++}`;
    if (i.startsWith("**") && i.endsWith("**"))
      r.push(/* @__PURE__ */ l("strong", { children: i.slice(2, -2) }, d));
    else if (i.startsWith("`") && i.endsWith("`"))
      r.push(
        /* @__PURE__ */ l("code", { className: "rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px] dark:bg-slate-900", children: i.slice(1, -1) }, d)
      );
    else if (i.startsWith("*") && i.endsWith("*"))
      r.push(/* @__PURE__ */ l("em", { children: i.slice(1, -1) }, d));
    else if (i.startsWith("[")) {
      const u = i.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      u ? r.push(
        /* @__PURE__ */ l("a", { href: u[2], target: "_blank", rel: "noreferrer", className: "text-violet-600 underline dark:text-violet-300", children: u[1] }, d)
      ) : r.push(i);
    } else
      r.push(i);
    s = n.index + i.length;
  }
  return s < e.length && r.push(e.slice(s)), r;
}
function Vt({ content: e }) {
  const t = e.replace(/\r\n/g, `
`).split(`
`), r = [];
  let o = 0, s = 0;
  for (; o < t.length; ) {
    const n = t[o];
    if (n.trimStart().startsWith("```")) {
      const u = n.trimStart().slice(3).trim();
      o += 1;
      const h = [];
      for (; o < t.length && !t[o].trimStart().startsWith("```"); )
        h.push(t[o]), o += 1;
      o < t.length && (o += 1), r.push(
        /* @__PURE__ */ l(
          "pre",
          {
            className: "my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[12px] text-slate-100",
            "data-lang": u || void 0,
            children: /* @__PURE__ */ l("code", { children: h.join(`
`) })
          },
          `b${s++}`
        )
      );
      continue;
    }
    if (!n.trim()) {
      o += 1;
      continue;
    }
    const a = n.match(/^(#{1,3})\s+(.*)$/);
    if (a) {
      const d = a[1].length, u = Q(a[2], `h${s}`);
      d === 1 ? r.push(
        /* @__PURE__ */ l("h1", { className: "mb-2 mt-3 text-base font-bold", children: u }, `b${s++}`)
      ) : d === 2 ? r.push(
        /* @__PURE__ */ l("h2", { className: "mb-2 mt-3 text-sm font-bold", children: u }, `b${s++}`)
      ) : r.push(
        /* @__PURE__ */ l("h3", { className: "mb-1 mt-2 text-sm font-semibold", children: u }, `b${s++}`)
      ), o += 1;
      continue;
    }
    if (/^\s*[-*]\s+/.test(n)) {
      const d = [];
      for (; o < t.length && /^\s*[-*]\s+/.test(t[o]); )
        d.push(t[o].replace(/^\s*[-*]\s+/, "")), o += 1;
      r.push(
        /* @__PURE__ */ l("ul", { className: "my-2 list-disc space-y-0.5 pl-5", children: d.map((u, h) => /* @__PURE__ */ l("li", { children: Q(u, `ul${s}-${h}`) }, h)) }, `b${s++}`)
      );
      continue;
    }
    if (/^\s*\d+\.\s+/.test(n)) {
      const d = [];
      for (; o < t.length && /^\s*\d+\.\s+/.test(t[o]); )
        d.push(t[o].replace(/^\s*\d+\.\s+/, "")), o += 1;
      r.push(
        /* @__PURE__ */ l("ol", { className: "my-2 list-decimal space-y-0.5 pl-5", children: d.map((u, h) => /* @__PURE__ */ l("li", { children: Q(u, `ol${s}-${h}`) }, h)) }, `b${s++}`)
      );
      continue;
    }
    const i = [n];
    for (o += 1; o < t.length && t[o].trim() && !t[o].trimStart().startsWith("```") && !/^(#{1,3})\s+/.test(t[o]) && !/^\s*[-*]\s+/.test(t[o]) && !/^\s*\d+\.\s+/.test(t[o]); )
      i.push(t[o]), o += 1;
    r.push(
      /* @__PURE__ */ l("p", { className: "my-2 whitespace-pre-wrap", children: i.map((d, u) => /* @__PURE__ */ m(Ee, { children: [
        u > 0 ? `
` : null,
        Q(d, `p${s}-${u}`)
      ] }, u)) }, `b${s++}`)
    );
  }
  return /* @__PURE__ */ l("div", { className: "coagent-md text-[13px] leading-relaxed", children: r });
}
function Ft({
  message: e,
  language: t,
  onApprove: r,
  onCancel: o
}) {
  const s = q[t], n = e.role === "user";
  return /* @__PURE__ */ m("div", { className: `flex gap-2 ${n ? "justify-end" : "justify-start"}`, children: [
    !n && /* @__PURE__ */ l("div", { className: "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/15 text-violet-600 dark:text-violet-300", children: /* @__PURE__ */ l(M.Bot, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ m(
      "div",
      {
        className: `max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${n ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"}`,
        children: [
          /* @__PURE__ */ l("div", { className: `mb-1 text-[10px] font-semibold uppercase tracking-wide ${n ? "text-violet-100" : "text-slate-400"}`, children: n ? s.you : s.agent }),
          n ? /* @__PURE__ */ l("div", { className: "whitespace-pre-wrap", children: e.content }) : /* @__PURE__ */ l(Vt, { content: e.content }),
          !n && (e.pending_actions || []).map((a) => /* @__PURE__ */ l(
            Wt,
            {
              action: a,
              language: t,
              onApprove: r,
              onCancel: o
            },
            a.action_id
          ))
        ]
      }
    )
  ] });
}
function fe({
  language: e,
  disabled: t,
  onPick: r
}) {
  const o = q[e], s = Ot[e];
  return /* @__PURE__ */ m("div", { className: "space-y-2", children: [
    /* @__PURE__ */ l("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-slate-500", children: o.quickTitle }),
    /* @__PURE__ */ l("div", { className: "flex flex-wrap gap-2", children: s.map((n) => /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        disabled: t,
        onClick: () => r(n),
        className: "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-700 hover:border-violet-400 hover:text-violet-700 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-violet-400",
        children: n
      },
      n
    )) })
  ] });
}
function Ut({
  open: e,
  language: t,
  onClose: r
}) {
  const o = q[t], [s, n] = _(null), [a, i] = _(""), [d, u] = _(""), [h, N] = _(""), [w, A] = _(!0), [S, y] = _(!1), [g, b] = _(""), [k, z] = _("");
  if (ve(() => {
    e && (b(""), z(""), u(""), (async () => {
      try {
        const c = await H("/api/coagent/config");
        n(c), i(c.base_url || ""), N(c.model || ""), A(!!c.enabled);
      } catch (c) {
        z(c?.message || String(c));
      }
    })());
  }, [e]), !e) return null;
  const P = async () => {
    y(!0), b(""), z("");
    try {
      const c = {
        base_url: a,
        model: h,
        enabled: w
      };
      d.trim() && (c.api_key = d.trim());
      const v = await H("/api/coagent/config", { method: "POST", body: c });
      n(v), u(""), b(o.saved);
    } catch (c) {
      z(c?.message || String(c));
    } finally {
      y(!1);
    }
  };
  return /* @__PURE__ */ l("div", { className: "absolute inset-0 z-20 flex justify-end bg-black/30 backdrop-blur-[1px]", children: /* @__PURE__ */ m("div", { className: "flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900", children: [
    /* @__PURE__ */ m("div", { className: "flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700", children: [
      /* @__PURE__ */ m("div", { className: "flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100", children: [
        /* @__PURE__ */ l(M.Settings, { className: "h-4 w-4" }),
        o.settings
      ] }),
      /* @__PURE__ */ l("button", { type: "button", onClick: r, className: "rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800", children: /* @__PURE__ */ l(M.X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ m("div", { className: "flex-1 space-y-4 overflow-y-auto p-4", children: [
      /* @__PURE__ */ m("label", { className: "block space-y-1 text-sm", children: [
        /* @__PURE__ */ l("span", { className: "text-slate-600 dark:text-slate-300", children: o.baseUrl }),
        /* @__PURE__ */ l(
          "input",
          {
            value: a,
            onChange: (c) => i(c.target.value),
            className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800",
            placeholder: "https://api.domain.com/v1"
          }
        )
      ] }),
      /* @__PURE__ */ m("label", { className: "block space-y-1 text-sm", children: [
        /* @__PURE__ */ l("span", { className: "text-slate-600 dark:text-slate-300", children: o.apiKey }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "password",
            value: d,
            onChange: (c) => u(c.target.value),
            className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800",
            placeholder: s?.api_key_masked || "sk-..."
          }
        ),
        /* @__PURE__ */ m("span", { className: "text-xs text-slate-500", children: [
          s?.api_key_set ? o.apiKeySet : o.apiKeyMissing,
          " — ",
          o.apiKeyHint
        ] })
      ] }),
      /* @__PURE__ */ m("label", { className: "block space-y-1 text-sm", children: [
        /* @__PURE__ */ l("span", { className: "text-slate-600 dark:text-slate-300", children: o.model }),
        /* @__PURE__ */ l(
          "input",
          {
            value: h,
            onChange: (c) => N(c.target.value),
            className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800",
            placeholder: "gpt-4o-mini"
          }
        )
      ] }),
      /* @__PURE__ */ m("label", { className: "flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200", children: [
        /* @__PURE__ */ l("input", { type: "checkbox", checked: w, onChange: (c) => A(c.target.checked) }),
        o.enabled
      ] }),
      g && /* @__PURE__ */ l("div", { className: "rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300", children: g }),
      k && /* @__PURE__ */ l("div", { className: "rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300", children: k })
    ] }),
    /* @__PURE__ */ m("div", { className: "flex justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-700", children: [
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          onClick: r,
          className: "rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600",
          children: o.close
        }
      ),
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          disabled: S,
          onClick: P,
          className: "inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60",
          children: [
            S ? /* @__PURE__ */ l(M.Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ l(M.Save, { className: "h-4 w-4" }),
            o.save
          ]
        }
      )
    ] })
  ] }) });
}
function te() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function qt() {
  const { language: e } = we(), t = e === "vi" ? "vi" : "en", r = q[t], [o, s] = _([]), [n, a] = _(""), [i, d] = _(!1), [u, h] = _(""), [N, w] = _(!1), A = de(null), S = de(null);
  ve(() => {
    A.current?.scrollIntoView({ behavior: "smooth" });
  }, [o, i]);
  const y = je(
    () => o.filter((c) => c.role === "user" || c.role === "assistant").map((c) => ({ role: c.role, content: c.content })),
    [o]
  ), g = $e(
    (c, v) => {
      s(
        (E) => E.map((T) => T.pending_actions?.length ? {
          ...T,
          pending_actions: T.pending_actions.map(
            (C) => C.action_id === c ? { ...C, ...v } : C
          )
        } : T)
      );
    },
    []
  ), b = async (c) => {
    const v = c.trim();
    if (!v || i) return;
    h("");
    const E = { id: te(), role: "user", content: v }, T = [...y, { role: "user", content: v }];
    s((C) => [...C, E]), a(""), d(!0);
    try {
      const C = await H("/api/coagent/chat", {
        method: "POST",
        body: { messages: T }
      }), F = {
        id: te(),
        role: "assistant",
        content: C.reply || "",
        pending_actions: (C.pending_actions || []).map((G) => ({
          ...G,
          status: "pending"
        }))
      };
      s((G) => [...G, F]);
    } catch (C) {
      h(C?.message || String(C));
    } finally {
      d(!1), S.current?.focus();
    }
  }, k = async (c) => {
    g(c, { status: "running" });
    try {
      const v = await H("/api/coagent/execute-action", {
        method: "POST",
        body: { action_id: c }
      }), E = !!v?.result?.ok, T = v?.result?.summary || v?.result?.error || "";
      g(c, {
        status: E ? "done" : "failed",
        resultSummary: T
      }), s((C) => [
        ...C,
        {
          id: te(),
          role: "assistant",
          content: E ? `✅ **${v.title || "Action"}**

${T}` : `❌ **${v.title || "Action"}**

${T || r.actionFailed}`
        }
      ]);
    } catch (v) {
      g(c, {
        status: "failed",
        resultSummary: v?.message || String(v)
      }), h(v?.message || String(v));
    }
  }, z = async (c) => {
    try {
      await H("/api/coagent/cancel-action", {
        method: "POST",
        body: { action_id: c }
      });
    } catch {
    }
    g(c, { status: "cancelled" });
  }, P = (c) => {
    c.key === "Enter" && !c.shiftKey && (c.preventDefault(), b(n));
  };
  return /* @__PURE__ */ m(Rt, { className: "relative flex h-full min-h-0 flex-col bg-slate-50 dark:bg-slate-950", children: [
    /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80", children: [
      /* @__PURE__ */ m("div", { className: "flex min-w-0 items-center gap-3", children: [
        /* @__PURE__ */ l("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow", children: /* @__PURE__ */ l(M.Bot, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ m("div", { className: "min-w-0", children: [
          /* @__PURE__ */ l("div", { className: "truncate text-base font-semibold text-slate-900 dark:text-slate-50", children: r.title }),
          /* @__PURE__ */ l("div", { className: "truncate text-xs text-slate-500", children: r.subtitle })
        ] })
      ] }),
      /* @__PURE__ */ m("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            title: r.clearChat,
            onClick: () => {
              s([]), h("");
            },
            className: "rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
            children: /* @__PURE__ */ l(M.Trash2, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            title: r.settings,
            onClick: () => w(!0),
            className: "rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
            children: /* @__PURE__ */ l(M.Settings, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ m("div", { className: "flex min-h-0 flex-1 flex-col", children: [
      /* @__PURE__ */ m("div", { className: "flex-1 space-y-4 overflow-y-auto px-4 py-4", children: [
        o.length === 0 && !i && /* @__PURE__ */ m("div", { className: "mx-auto max-w-2xl space-y-4 pt-6 text-center", children: [
          /* @__PURE__ */ l("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-600", children: /* @__PURE__ */ l(M.Sparkles, { className: "h-7 w-7" }) }),
          /* @__PURE__ */ l("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: r.empty }),
          /* @__PURE__ */ l(fe, { language: t, disabled: i, onPick: (c) => void b(c) })
        ] }),
        o.map((c) => /* @__PURE__ */ l(
          Ft,
          {
            message: c,
            language: t,
            onApprove: k,
            onCancel: z
          },
          c.id
        )),
        i && /* @__PURE__ */ m("div", { className: "flex items-center gap-2 text-sm text-slate-500", children: [
          /* @__PURE__ */ l(M.Loader2, { className: "h-4 w-4 animate-spin" }),
          r.thinking
        ] }),
        u && /* @__PURE__ */ m("div", { className: "rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300", children: [
          /* @__PURE__ */ m("span", { className: "font-semibold", children: [
            r.error,
            ": "
          ] }),
          u
        ] }),
        /* @__PURE__ */ l("div", { ref: A })
      ] }),
      o.length > 0 && /* @__PURE__ */ l("div", { className: "border-t border-slate-200 px-4 py-2 dark:border-slate-800", children: /* @__PURE__ */ l(fe, { language: t, disabled: i, onPick: (c) => void b(c) }) }),
      /* @__PURE__ */ l("div", { className: "border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900", children: /* @__PURE__ */ m("div", { className: "flex items-end gap-2", children: [
        /* @__PURE__ */ l(
          "textarea",
          {
            ref: S,
            value: n,
            onChange: (c) => a(c.target.value),
            onKeyDown: P,
            rows: 2,
            disabled: i,
            placeholder: r.placeholder,
            className: "min-h-[44px] flex-1 resize-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          }
        ),
        /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            disabled: i || !n.trim(),
            onClick: () => void b(n),
            className: "inline-flex h-11 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50",
            children: [
              /* @__PURE__ */ l(M.Send, { className: "h-4 w-4" }),
              r.send
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ l(Ut, { open: N, language: t, onClose: () => w(!1) })
  ] });
}
export {
  qt as default
};
