import { useOutletContext } from 'react-router-dom';

export default function PingProDashboard() {
  const { theme } = useOutletContext<{ theme: 'dark' | 'light' }>();
  const isDark = theme === 'dark';

  return (
    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
      <h2 className="text-xl font-bold mb-3">Ping Pro Diagnostic Tool</h2>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Advanced connectivity testing and network latency diagnostics for CoPanel VPS instances.
      </p>
    </div>
  );
}
