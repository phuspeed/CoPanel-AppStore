/** Shared Deepin / macOS-style surface tokens for Storage Manager. */

export interface StorageTheme {
  panel: string;
  muted: string;
  hoverNav: string;
  activeNav: string;
  btn: string;
  btnPrimary: string;
  surface: string;
  section: string;
  headerBorder: string;
  sidebar: string;
}

export function storageTheme(isDark: boolean): StorageTheme {
  return {
    panel: isDark
      ? 'bg-slate-900 border-slate-700/80 text-slate-100'
      : 'bg-[#f5f5f7] border-slate-200/90 text-slate-900',
    muted: isDark ? 'text-slate-400' : 'text-slate-500',
    hoverNav: isDark ? 'hover:bg-slate-800/80' : 'hover:bg-black/[0.04]',
    activeNav: isDark
      ? 'bg-cyan-500/15 text-cyan-300 shadow-sm shadow-cyan-500/10'
      : 'bg-white text-cyan-700 shadow-sm border border-slate-200/80',
    btn: isDark
      ? 'border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
      : 'border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700',
    btnPrimary: 'bg-cyan-600 hover:bg-cyan-500 text-white border-transparent',
    surface: isDark
      ? 'bg-slate-950/50 border-slate-800'
      : 'bg-white border-slate-200/90 shadow-sm',
    section: isDark
      ? 'bg-slate-900/60 border-slate-800'
      : 'bg-white border-slate-200/90',
    headerBorder: isDark ? 'border-slate-700/80' : 'border-slate-200/90',
    sidebar: isDark
      ? 'bg-slate-950/40 border-slate-800'
      : 'bg-[#ececf0]/80 border-slate-200/90',
  };
}
