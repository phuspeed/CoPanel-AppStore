import { useOutletContext } from 'react-router-dom';

export default function RedisCacheDashboard() {
  const { theme, language } = useOutletContext<{ theme: 'dark' | 'light'; language: 'en' | 'vi' }>();
  const isDark = theme === 'dark';

  return (
    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
      <h2 className="text-xl font-bold mb-3">Redis Cache Manager</h2>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        This package adds a simple Redis status dashboard to CoPanel. It can be extended to show keys, memory, and cache health.
      </p>
    </div>
  );
}
