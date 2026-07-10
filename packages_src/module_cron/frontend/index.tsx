import { useAppShellContext } from '../../core/hooks/useAppShellContext';
import ModuleViewport from '../../core/shell/ModuleViewport';

export default function CloudBackupDashboard() {
  const { theme } = useAppShellContext();
  const isDark = theme === 'dark';

  return (
    <ModuleViewport constrained>
    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
      <h2 className="text-xl font-bold mb-3">Cloud Backup Extension</h2>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Adds a cloud backup scheduler that can be extended with S3, Google Drive, or other upload providers.
      </p>
    </div>
    </ModuleViewport>
  );
}
