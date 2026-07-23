/**
 * Rsync Manager — VPS move / clone / sync wizard (AppStore module).
 * Desktop + Classic: ModuleSidebarLayout + windowMode.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppShellContext } from '../../core/hooks/useAppShellContext';
import { useIsWindowedModule } from '../../core/shell/WindowViewportContext';
import ModuleViewport from '../../core/shell/ModuleViewport';
import ModuleSidebarLayout from '../../core/shell/ModuleSidebarLayout';
import WindowModal from '../../core/shell/WindowModal';
import {
  chromeNavIcon,
  chromeNavItem,
  chromeSidebar,
  chromeSidebarHeader,
  chromeSidebarIconBox,
  chromeSidebarNav,
  chromeSidebarSubtitle,
  chromeSidebarTitle,
} from '../../core/desktopChrome';
import { cn } from '../../lib/utils';
import * as Icons from 'lucide-react';
import { api, jobsApi, useJob } from '../../core/platform';

type Lang = 'en' | 'vi';
type WizardStep = 'mode' | 'target' | 'detect' | 'scope' | 'review' | 'done';
type Mode = 'move' | 'clone' | 'sync';
type Scenario = 'both_copanel' | 'target_rsync' | 'need_rsync' | 'blocked' | string;

type CompItem = {
  id: string;
  severity: 'ok' | 'warn' | 'block';
  message: string;
  source?: string;
  target?: string;
};

type CompatResult = {
  items: CompItem[];
  can_proceed: boolean;
  scenario: Scenario;
  local_copanel?: { present?: boolean; version?: string; service?: string };
  remote_copanel?: { present?: boolean; version?: string; service?: string };
  remote_rsync?: boolean;
};

type Preset = {
  id: string;
  label_en: string;
  label_vi: string;
  local_path: string;
  remote_path: string;
  excludes: string[];
  delete_default?: boolean;
};

type ChecklistItem = { id: string; title: string; detail: string };

const STEP_ORDER: WizardStep[] = ['mode', 'target', 'detect', 'scope', 'review', 'done'];

const STEP_ICONS: Record<WizardStep, typeof Icons.Layers> = {
  mode: Icons.Layers,
  target: Icons.Server,
  detect: Icons.ShieldCheck,
  scope: Icons.FolderSync,
  review: Icons.ClipboardCheck,
  done: Icons.Flag,
};

export default function RsyncManager() {
  const { theme, language } = useAppShellContext();
  const isDark = theme === 'dark';
  const lang: Lang = language === 'vi' ? 'vi' : 'en';
  const windowed = useIsWindowedModule();
  const [searchParams, setSearchParams] = useSearchParams();

  const [step, setStep] = useState<WizardStep>('mode');
  const [mode, setMode] = useState<Mode>('clone');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('22');
  const [user, setUser] = useState('root');
  const [identityFile, setIdentityFile] = useState('');
  const [sshHints, setSshHints] = useState<{ identity_file: string; public_key: string }[]>([]);

  const [presets, setPresets] = useState<Record<string, Preset>>({});
  const [presetId, setPresetId] = useState('copanel');
  const [localPath, setLocalPath] = useState('/opt/copanel');
  const [remotePath, setRemotePath] = useState('/opt/copanel');
  const [extraWeb, setExtraWeb] = useState(false);
  const [excludes, setExcludes] = useState('');
  const [wantDelete, setWantDelete] = useState(false);
  const [estimateGb, setEstimateGb] = useState('');

  const [compat, setCompat] = useState<CompatResult | null>(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const [installLoading, setInstallLoading] = useState(false);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmDry, setConfirmDry] = useState(true);

  const [jobId, setJobId] = useState<string | null>(searchParams.get('job'));
  const job = useJob(jobId);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const tr = useMemo(() => TEXT[lang], [lang]);

  const labels: Record<WizardStep, string> = {
    mode: tr.stepMode,
    target: tr.stepTarget,
    detect: tr.stepDetect,
    scope: tr.stepScope,
    review: tr.stepReview,
    done: tr.stepDone,
  };

  const stepMeta: Record<WizardStep, { title: string; desc: string }> = {
    mode: { title: tr.modeTitle, desc: tr.modeDesc },
    target: { title: tr.targetTitle, desc: tr.targetDesc },
    detect: { title: tr.detectTitle, desc: tr.detectDesc },
    scope: { title: tr.scopeTitle, desc: tr.scopeDesc },
    review: { title: tr.reviewTitle, desc: tr.reviewDesc },
    done: { title: tr.doneTitle, desc: tr.doneDesc },
  };

  const loadMeta = useCallback(() => {
    api<Record<string, Preset>>('/api/rsync_manager/presets')
      .then((p) => {
        setPresets(p || {});
        const cop = p?.copanel;
        if (cop?.excludes) setExcludes((cop.excludes || []).join('\n'));
      })
      .catch(() => {});
    api<{ keys: { identity_file: string; public_key: string }[] }>('/api/rsync_manager/ssh_hints')
      .then((d) => setSshHints(d?.keys || []))
      .catch(() => setSshHints([]));
  }, []);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    const id = searchParams.get('job');
    if (id) {
      setJobId(id);
      setStep('review');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!jobId) return;
    const t = setInterval(() => {
      jobsApi.get(jobId).catch(() => {});
    }, 1500);
    return () => clearInterval(t);
  }, [jobId]);

  useEffect(() => {
    if (job?.status === 'success') {
      setStep('done');
      void loadChecklist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.status]);

  const applyPreset = (id: string) => {
    setPresetId(id);
    const p = presets[id];
    if (!p) return;
    if (p.local_path) setLocalPath(p.local_path);
    if (p.remote_path) setRemotePath(p.remote_path);
    setExcludes((p.excludes || []).join('\n'));
    setWantDelete(!!p.delete_default && mode !== 'clone');
  };

  const buildPaths = () => {
    const paths = [{ local_path: localPath.trim(), remote_path: remotePath.trim() }];
    if (extraWeb) {
      paths.push({ local_path: '/var/www', remote_path: '/var/www' });
    }
    return paths;
  };

  const sshPayload = () => ({
    host: host.trim(),
    port: parseInt(port, 10) || 22,
    user: user.trim(),
    identity_file: identityFile.trim() || null,
  });

  const runCompatibility = async () => {
    setError(null);
    setCheckLoading(true);
    setCompat(null);
    try {
      const est = parseFloat(estimateGb.replace(',', '.')) || 0;
      const estimated_bytes = Math.max(0, Math.floor(est * 1024 ** 3));
      const data = await api<CompatResult>('/api/rsync_manager/compatibility', {
        method: 'POST',
        body: {
          ...sshPayload(),
          estimated_bytes,
          remote_path: remotePath.trim() || '/opt/copanel',
        },
      });
      setCompat(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setCheckLoading(false);
    }
  };

  const installRsync = async () => {
    setError(null);
    setInstallLoading(true);
    try {
      const data = await api<{ ok: boolean; stderr_tail?: string }>('/api/rsync_manager/install_rsync', {
        method: 'POST',
        body: sshPayload(),
      });
      if (!data.ok) {
        setError(data.stderr_tail || tr.installFail);
      }
      await runCompatibility();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setInstallLoading(false);
    }
  };

  const runEstimate = async () => {
    setEstimateLoading(true);
    try {
      const data = await api<{ bytes: number }>('/api/rsync_manager/estimate', {
        method: 'POST',
        body: {
          local_path: localPath.trim(),
          excludes: excludes.split('\n').map((l) => l.trim()).filter(Boolean),
        },
      });
      if (data.bytes > 0) {
        const gb = data.bytes / 1024 ** 3;
        setEstimateGb(gb >= 10 ? gb.toFixed(1) : gb.toFixed(2));
      }
    } catch {
      /* ignore */
    } finally {
      setEstimateLoading(false);
    }
  };

  const loadChecklist = async () => {
    try {
      const data = await api<{ en: ChecklistItem[]; vi: ChecklistItem[] }>('/api/rsync_manager/checklist', {
        method: 'POST',
        body: { mode, scenario: compat?.scenario || 'target_rsync' },
      });
      setChecklist(lang === 'vi' ? data.vi || data.en : data.en || []);
    } catch {
      setChecklist([]);
    }
  };

  const submitJob = async (dryRun: boolean) => {
    setError(null);
    setSubmitting(true);
    setConfirmOpen(false);
    try {
      if (!dryRun && compat?.can_proceed !== true) {
        throw new Error(tr.cannotProceed);
      }
      const data = await api<{ job_id: string }>('/api/rsync_manager/sync_job', {
        method: 'POST',
        body: {
          ...sshPayload(),
          paths: buildPaths(),
          excludes: excludes.split('\n').map((l) => l.trim()).filter(Boolean),
          dry_run: dryRun,
          delete: wantDelete && mode !== 'clone',
          mode,
        },
      });
      setJobId(data.job_id);
      setSearchParams({ job: data.job_id });
      setStep('review');
      void jobsApi.refresh().catch(() => {});
      void jobsApi.get(data.job_id).catch(() => {});
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetWizard = () => {
    setJobId(null);
    setSearchParams({});
    setStep('mode');
    setCompat(null);
    setCheckedIds({});
    setError(null);
  };

  const stepIndex = STEP_ORDER.indexOf(step);
  const canNext = () => {
    if (step === 'mode') return true;
    if (step === 'target') return !!host.trim() && !!user.trim();
    if (step === 'detect') return compat?.can_proceed === true;
    if (step === 'scope') return !!localPath.trim() && !!remotePath.trim();
    return true;
  };

  const goNext = async () => {
    if (step === 'detect' && !compat) {
      await runCompatibility();
      return;
    }
    if (step === 'scope' && !estimateGb) {
      void runEstimate();
    }
    const next = STEP_ORDER[Math.min(STEP_ORDER.length - 1, stepIndex + 1)];
    setStep(next);
    if (next === 'done') void loadChecklist();
  };

  const scenarioBadge = () => {
    const s = compat?.scenario;
    if (!s) return null;
    const map: Record<string, string> = {
      both_copanel: tr.scenarioBoth,
      target_rsync: tr.scenarioRsync,
      need_rsync: tr.scenarioNeed,
      blocked: tr.scenarioBlocked,
    };
    return map[s] || s;
  };

  const card = cn(
    'rounded-2xl border p-4 md:p-5 space-y-4',
    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200',
  );
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputCls = cn(
    'w-full rounded-xl border px-3 py-2 text-sm font-mono',
    isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900',
  );

  const renderMode = () => (
    <div className="grid gap-3 md:grid-cols-3">
      {(
        [
          { id: 'clone' as Mode, icon: Icons.Copy, title: tr.cloneTitle, desc: tr.cloneDesc },
          { id: 'sync' as Mode, icon: Icons.RefreshCw, title: tr.syncTitle, desc: tr.syncDesc },
          { id: 'move' as Mode, icon: Icons.ArrowRightLeft, title: tr.moveTitle, desc: tr.moveDesc },
        ] as const
      ).map((m) => {
        const active = mode === m.id;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              if (m.id === 'clone') setWantDelete(false);
            }}
            className={cn(
              'text-left rounded-2xl border p-4 transition-colors',
              active
                ? isDark
                  ? 'border-sky-500/60 bg-sky-500/10'
                  : 'border-sky-400 bg-sky-50'
                : isDark
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-200 hover:border-slate-300',
            )}
          >
            <Icon className={cn('w-6 h-6 mb-2', active ? 'text-sky-500' : muted)} />
            <div className="font-bold text-sm">{m.title}</div>
            <p className={cn('text-xs mt-1 leading-relaxed', muted)}>{m.desc}</p>
          </button>
        );
      })}
    </div>
  );

  const renderTarget = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className={cn('text-xs font-bold', muted)}>{tr.host}</span>
          <input value={host} onChange={(e) => setHost(e.target.value)} className={inputCls} placeholder="203.0.113.10" />
        </label>
        <label className="space-y-1">
          <span className={cn('text-xs font-bold', muted)}>{tr.port}</span>
          <input value={port} onChange={(e) => setPort(e.target.value)} className={inputCls} />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className={cn('text-xs font-bold', muted)}>{tr.user}</span>
          <input value={user} onChange={(e) => setUser(e.target.value)} className={inputCls} />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className={cn('text-xs font-bold', muted)}>{tr.identity}</span>
          <input
            value={identityFile}
            onChange={(e) => setIdentityFile(e.target.value)}
            className={inputCls}
            placeholder="/root/.ssh/id_ed25519"
          />
          <span className={cn('text-[10px]', muted)}>{tr.identityHint}</span>
        </label>
      </div>
      {sshHints.length > 0 && (
        <div className={cn('rounded-xl border p-3 space-y-2', isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50')}>
          <p className={cn('text-xs font-bold', muted)}>{tr.keyHints}</p>
          {sshHints.slice(0, 3).map((k) => (
            <div key={k.identity_file} className="space-y-1">
              <button
                type="button"
                className={cn('text-xs font-mono underline', isDark ? 'text-sky-400' : 'text-sky-700')}
                onClick={() => setIdentityFile(k.identity_file)}
              >
                {k.identity_file}
              </button>
              {k.public_key && (
                <pre className={cn('text-[10px] font-mono overflow-x-auto whitespace-pre-wrap break-all', muted)}>
                  {k.public_key}
                </pre>
              )}
            </div>
          ))}
          <p className={cn('text-[10px]', muted)}>{tr.keyAuthHint}</p>
        </div>
      )}
    </div>
  );

  const renderDetect = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void runCompatibility()}
          disabled={checkLoading || !host.trim()}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50"
        >
          {checkLoading ? <Icons.Loader className="w-4 h-4 animate-spin" /> : <Icons.ShieldCheck className="w-4 h-4" />}
          {checkLoading ? tr.checking : tr.check}
        </button>
        {compat?.scenario === 'need_rsync' && (
          <button
            type="button"
            onClick={() => void installRsync()}
            disabled={installLoading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50"
          >
            {installLoading ? <Icons.Loader className="w-4 h-4 animate-spin" /> : <Icons.Download className="w-4 h-4" />}
            {tr.installRsync}
          </button>
        )}
        {compat && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold',
              compat.can_proceed
                ? isDark
                  ? 'bg-emerald-950/50 text-emerald-300'
                  : 'bg-emerald-100 text-emerald-800'
                : isDark
                  ? 'bg-red-950/50 text-red-300'
                  : 'bg-red-100 text-red-800',
            )}
          >
            {compat.can_proceed ? <Icons.Check className="w-3.5 h-3.5" /> : <Icons.X className="w-3.5 h-3.5" />}
            {compat.can_proceed ? tr.canProceed : tr.cannotProceed}
          </span>
        )}
        {compat?.scenario && (
          <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border', isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-700')}>
            {scenarioBadge()}
          </span>
        )}
      </div>

      {compat && (
        <div className="grid gap-2 md:grid-cols-2">
          <InfoPill
            isDark={isDark}
            label={tr.sourcePanel}
            value={
              compat.local_copanel?.present
                ? `CoPanel ${compat.local_copanel.version || ''}`.trim()
                : tr.noCopanel
            }
            ok={!!compat.local_copanel?.present}
          />
          <InfoPill
            isDark={isDark}
            label={tr.targetPanel}
            value={
              compat.remote_copanel?.present
                ? `CoPanel ${compat.remote_copanel.version || ''}`.trim()
                : compat.remote_rsync
                  ? tr.rsyncOnly
                  : tr.noRsync
            }
            ok={!!compat.remote_copanel?.present || !!compat.remote_rsync}
          />
        </div>
      )}

      {compat?.items?.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-700/30">
          <table className="w-full text-xs">
            <thead>
              <tr className={isDark ? 'bg-slate-950/80' : 'bg-slate-100'}>
                <th className="text-left p-2">{tr.tableItem}</th>
                <th className="text-left p-2">{tr.source}</th>
                <th className="text-left p-2">{tr.target}</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {compat.items.map((it) => (
                <tr key={it.id} className="border-t border-slate-700/20">
                  <td className="p-2 align-top">
                    <span className="font-mono font-bold">{it.id}</span>
                    <div className={cn('mt-1', muted)}>{it.message}</div>
                  </td>
                  <td className="p-2 font-mono align-top break-all">{it.source || '—'}</td>
                  <td className="p-2 font-mono align-top break-all">{it.target || '—'}</td>
                  <td className={cn('p-2 font-bold align-top', sevStyle(it.severity, isDark))}>{it.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={cn('text-sm', muted)}>{tr.detectHint}</p>
      )}
    </div>
  );

  const renderScope = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.values(presets).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.id)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-xs font-bold',
              presetId === p.id
                ? 'border-sky-500 text-sky-600 bg-sky-500/10'
                : isDark
                  ? 'border-slate-700 text-slate-300'
                  : 'border-slate-200 text-slate-600',
            )}
          >
            {lang === 'vi' ? p.label_vi : p.label_en}
          </button>
        ))}
      </div>
      <label className="space-y-1 block">
        <span className={cn('text-xs font-bold', muted)}>{tr.localPath}</span>
        <input value={localPath} onChange={(e) => setLocalPath(e.target.value)} className={inputCls} />
      </label>
      <label className="space-y-1 block">
        <span className={cn('text-xs font-bold', muted)}>{tr.remotePath}</span>
        <input value={remotePath} onChange={(e) => setRemotePath(e.target.value)} className={inputCls} />
      </label>
      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={extraWeb} onChange={(e) => setExtraWeb(e.target.checked)} className="rounded" />
        {tr.alsoWeb}
      </label>
      <label className="space-y-1 block">
        <span className={cn('text-xs font-bold', muted)}>{tr.excludes}</span>
        <textarea
          value={excludes}
          onChange={(e) => setExcludes(e.target.value)}
          rows={6}
          spellCheck={false}
          className={cn(inputCls, 'text-xs')}
        />
        <span className={cn('text-[10px]', muted)}>{tr.excludesHint}</span>
      </label>
      {mode !== 'clone' && (
        <label className="inline-flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={wantDelete}
            onChange={(e) => setWantDelete(e.target.checked)}
            className="rounded mt-1"
          />
          <span>
            <span className="font-bold">{tr.deleteOpt}</span>
            <span className={cn('block text-xs', muted)}>{tr.deleteHint}</span>
          </span>
        </label>
      )}
      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1 block max-w-xs">
          <span className={cn('text-xs font-bold', muted)}>{tr.estimateGb}</span>
          <input value={estimateGb} onChange={(e) => setEstimateGb(e.target.value)} className={inputCls} placeholder="20" />
        </label>
        <button
          type="button"
          onClick={() => void runEstimate()}
          disabled={estimateLoading}
          className={cn('rounded-xl border px-3 py-2 text-xs font-bold', isDark ? 'border-slate-700' : 'border-slate-200')}
        >
          {estimateLoading ? tr.estimating : tr.autoEstimate}
        </button>
      </div>
    </div>
  );

  const renderReview = () => {
    if (jobId) {
      return <RunPanel job={job} isDark={isDark} onReset={resetWizard} tr={tr} />;
    }
    return (
      <div className="space-y-3 text-sm">
        <Row k={tr.modeLabel} v={mode} isDark={isDark} />
        <Row k="SSH" v={`${user}@${host}:${port}`} isDark={isDark} mono />
        <Row k={tr.localPath} v={localPath} isDark={isDark} mono />
        <Row k={tr.remotePath} v={remotePath} isDark={isDark} mono />
        {extraWeb && <Row k="Extra" v="/var/www → /var/www" isDark={isDark} mono />}
        <Row k="--delete" v={wantDelete && mode !== 'clone' ? 'yes' : 'no'} isDark={isDark} />
        <Row k={tr.scenario} v={scenarioBadge() || '—'} isDark={isDark} />
        <p className={cn('text-xs', muted)}>{tr.warnDocker}</p>
        <p className={cn('text-xs', muted)}>{tr.sqlNote}</p>
      </div>
    );
  };

  const renderDone = () => (
    <div className="space-y-3">
      {job?.status === 'success' && (
        <p className={cn('text-sm font-semibold', isDark ? 'text-emerald-400' : 'text-emerald-700')}>{tr.jobSuccess}</p>
      )}
      {(checklist.length ? checklist : []).map((c) => (
        <label
          key={c.id}
          className={cn(
            'flex gap-3 rounded-xl border p-3 cursor-pointer',
            isDark ? 'border-slate-800' : 'border-slate-200',
            checkedIds[c.id] && (isDark ? 'bg-emerald-950/20' : 'bg-emerald-50'),
          )}
        >
          <input
            type="checkbox"
            checked={!!checkedIds[c.id]}
            onChange={(e) => setCheckedIds((s) => ({ ...s, [c.id]: e.target.checked }))}
            className="mt-1 rounded"
          />
          <span>
            <span className="text-sm font-bold block">{c.title}</span>
            <span className={cn('text-xs', muted)}>{c.detail}</span>
          </span>
        </label>
      ))}
      {!checklist.length && <p className={cn('text-sm', muted)}>{tr.doneHint}</p>}
      <button
        type="button"
        onClick={resetWizard}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold border border-slate-300 dark:border-slate-700"
      >
        <Icons.RotateCcw className="w-4 h-4" />
        {tr.startOver}
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 'mode':
        return renderMode();
      case 'target':
        return renderTarget();
      case 'detect':
        return renderDetect();
      case 'scope':
        return renderScope();
      case 'review':
        return renderReview();
      case 'done':
        return renderDone();
      default:
        return null;
    }
  };

  const sidebar = (
    <aside className={chromeSidebar(isDark)}>
      <div className={chromeSidebarHeader(isDark)}>
        <div className="flex items-center gap-3">
          <div className={chromeSidebarIconBox(isDark)}>
            <Icons.RefreshCw className="h-5 w-5 text-sky-500" />
          </div>
          <div className="min-w-0">
            <h1 className={chromeSidebarTitle(isDark)}>{tr.title}</h1>
            <p className={chromeSidebarSubtitle(isDark)}>{tr.subtitle}</p>
          </div>
        </div>
      </div>
      <nav className={chromeSidebarNav()} aria-label="Rsync wizard steps">
        {STEP_ORDER.map((id) => {
          const Icon = STEP_ICONS[id];
          const active = step === id;
          const doneIdx = STEP_ORDER.indexOf(id) < stepIndex;
          return (
            <button
              key={id}
              type="button"
              disabled={!!jobId && id !== 'review' && id !== 'done'}
              onClick={() => setStep(id)}
              className={cn(chromeNavItem(isDark, active, 'sky'), 'disabled:opacity-50')}
            >
              <Icon className={cn(chromeNavIcon(isDark, active, 'sky'), !active && doneIdx && 'text-emerald-500')} />
              <span className="flex-1 truncate font-medium">{labels[id]}</span>
              {doneIdx && !active && <Icons.Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <ModuleViewport className="flex min-h-0 flex-col overflow-hidden">
      <ModuleSidebarLayout
        isDark={isDark}
        mobileTitle={tr.title}
        className={isDark ? 'text-slate-100' : 'text-slate-900'}
        sidebar={sidebar}
      >
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className={cn('min-h-0 flex-1 overflow-y-auto', windowed ? 'p-5' : 'p-5 md:p-8')}>
            <header className="mb-6 space-y-1.5">
              <h2 className={cn('text-lg font-bold', isDark ? 'text-slate-100' : 'text-slate-900')}>
                {stepMeta[step].title}
              </h2>
              <p className={cn('text-xs max-w-2xl', muted)}>{stepMeta[step].desc}</p>
            </header>
            <div className={card}>{renderStepContent()}</div>
            {error && (
              <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
                <Icons.AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
          </main>

          {!jobId && step !== 'done' && (
            <footer
              className={cn(
                'shrink-0 flex items-center justify-between gap-3 border-t px-5 py-4',
                isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white/80',
              )}
            >
              <button
                type="button"
                onClick={() => setStep(STEP_ORDER[Math.max(0, stepIndex - 1)])}
                disabled={stepIndex === 0}
                className={cn(
                  'px-4 py-2 rounded-xl border text-sm font-bold disabled:opacity-40',
                  isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600',
                )}
              >
                {tr.back}
              </button>
              {step === 'review' ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      setConfirmDry(true);
                      setConfirmOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold disabled:opacity-50"
                  >
                    {tr.dryRun}
                  </button>
                  <button
                    type="button"
                    disabled={submitting || compat?.can_proceed !== true}
                    onClick={() => {
                      setConfirmDry(false);
                      setConfirmOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold disabled:opacity-50"
                  >
                    {tr.runSync}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void goNext()}
                  disabled={!canNext() && step !== 'detect'}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold disabled:opacity-50"
                >
                  {step === 'detect' && !compat ? tr.check : tr.next}
                </button>
              )}
            </footer>
          )}
        </div>
      </ModuleSidebarLayout>

      <WindowModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={confirmDry ? tr.confirmDryTitle : tr.confirmRealTitle}
        maxWidth="md"
      >
        <div className="space-y-4 p-4">
          <p className={cn('text-sm', muted)}>
            {confirmDry ? tr.confirmDryBody : tr.confirmRealBody}
          </p>
          <div className={cn('rounded-xl border p-3 text-xs space-y-1', isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50')}>
            <Row k="Mode" v={mode} isDark={isDark} />
            <Row k="Target" v={`${user}@${host}`} isDark={isDark} mono />
            <Row k="Paths" v={String(buildPaths().length)} isDark={isDark} />
            {!confirmDry && wantDelete && mode !== 'clone' && (
              <p className="text-amber-600 font-bold">--delete enabled</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className={cn('px-4 py-2 rounded-xl text-sm font-bold border', isDark ? 'border-slate-700' : 'border-slate-200')}
            >
              {tr.cancel}
            </button>
            <button
              type="button"
              onClick={() => void submitJob(confirmDry)}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-bold"
            >
              {tr.confirm}
            </button>
          </div>
        </div>
      </WindowModal>
    </ModuleViewport>
  );
}

function sevStyle(s: string, isDark: boolean) {
  if (s === 'block') return isDark ? 'text-red-400' : 'text-red-600';
  if (s === 'warn') return isDark ? 'text-amber-400' : 'text-amber-700';
  return isDark ? 'text-emerald-400' : 'text-emerald-700';
}

function InfoPill({
  label,
  value,
  ok,
  isDark,
}: {
  label: string;
  value: string;
  ok: boolean;
  isDark: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border px-3 py-2 text-xs',
        ok
          ? isDark
            ? 'border-emerald-500/30 bg-emerald-500/10'
            : 'border-emerald-200 bg-emerald-50'
          : isDark
            ? 'border-slate-700 bg-slate-950/40'
            : 'border-slate-200 bg-slate-50',
      )}
    >
      <div className={cn('font-bold uppercase tracking-wide', isDark ? 'text-slate-400' : 'text-slate-500')}>{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}

function Row({ k, v, isDark, mono }: { k: string; v: string; isDark: boolean; mono?: boolean }) {
  return (
    <div className="flex gap-3 text-xs">
      <span className={cn('w-28 shrink-0 font-bold', isDark ? 'text-slate-400' : 'text-slate-500')}>{k}</span>
      <span className={cn('min-w-0 break-all', mono && 'font-mono')}>{v}</span>
    </div>
  );
}

function RunPanel({
  job,
  isDark,
  onReset,
  tr,
}: {
  job: ReturnType<typeof useJob>;
  isDark: boolean;
  onReset: () => void;
  tr: (typeof TEXT)['en'];
}) {
  const [logs, setLogs] = useState<string>('');

  useEffect(() => {
    if (!job?.id) return;
    let cancelled = false;
    const tick = () => {
      api<{ logs?: { line?: string }[]; message?: string; result?: { summary?: string } }>(
        `/api/platform/jobs/${job.id}`,
      )
        .then((d) => {
          if (cancelled) return;
          if (Array.isArray(d.logs) && d.logs.length) {
            setLogs(
              d.logs
                .slice(-100)
                .map((l) => l.line || '')
                .filter(Boolean)
                .join('\n'),
            );
          }
        })
        .catch(() => {});
    };
    tick();
    const t = setInterval(tick, 2000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [job?.id, job?.status, job?.progress]);

  if (!job) {
    return <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>{tr.submitting}</p>;
  }
  const failed = job.status === 'failed';
  const done = job.status === 'success';
  const running = job.status === 'running' || job.status === 'queued';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-bold">{job.title}</h3>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-500">
          {job.status}
        </span>
      </div>
      {running && (
        <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-slate-800' : 'bg-slate-200')}>
          <div className="h-full bg-sky-500 transition-all" style={{ width: `${job.progress || 0}%` }} />
        </div>
      )}
      {job.message && <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>{job.message}</p>}
      {failed && <p className="text-sm text-red-500">{job.error}</p>}
      {done && job.result?.summary && (
        <p className={cn('text-sm', isDark ? 'text-emerald-400' : 'text-emerald-700')}>{String(job.result.summary)}</p>
      )}
      {logs && (
        <pre
          className={cn(
            'rounded-xl border p-3 text-[11px] font-mono overflow-auto max-h-64 whitespace-pre-wrap',
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800',
          )}
        >
          {logs}
        </pre>
      )}
      {(done || failed) && (
        <button
          type="button"
          onClick={onReset}
          className={cn('rounded-xl border px-3 py-2 text-xs font-bold', isDark ? 'border-slate-700' : 'border-slate-200')}
        >
          {tr.startOver}
        </button>
      )}
    </div>
  );
}

const TEXT = {
  en: {
    title: 'Rsync Manager',
    subtitle: 'Move · Clone · Sync VPS',
    stepMode: 'Mode',
    stepTarget: 'Target',
    stepDetect: 'Detect',
    stepScope: 'Scope',
    stepReview: 'Run',
    stepDone: 'Checklist',
    modeTitle: 'Choose migration mode',
    modeDesc: 'Works when both servers have CoPanel, or the target already has rsync.',
    targetTitle: 'Target SSH',
    targetDesc: 'Key-based SSH from this panel to VPS 2 (BatchMode).',
    detectTitle: 'Compatibility & CoPanel detect',
    detectDesc: 'Detects remote CoPanel, rsync, arch, OS, and free disk.',
    scopeTitle: 'Paths & excludes',
    scopeDesc: 'Pick CoPanel / web presets or custom trees. Safer excludes skip config & data by default.',
    reviewTitle: 'Review & run',
    reviewDesc: 'Dry-run first, then real sync as a Task Center job with progress.',
    doneTitle: 'Post-migrate checklist',
    doneDesc: 'SQL, Docker, DNS/SSL, and cutover are manual — tick off as you finish.',
    modeLabel: 'Mode',
    cloneTitle: 'Clone',
    cloneDesc: 'Copy trees to VPS 2 without deleting remote extras. Source stays online.',
    syncTitle: 'Sync',
    syncDesc: 'Incremental update. Optional --delete for a mirror.',
    moveTitle: 'Move',
    moveDesc: 'Full cutover workflow: sync files, then checklist for DNS/SQL/Docker.',
    host: 'Host / IP',
    port: 'Port',
    user: 'User',
    identity: 'Identity file (on this server)',
    identityHint: 'Private key readable by the panel user.',
    keyHints: 'Detected keys on this host',
    keyAuthHint: 'Paste the public key into target ~/.ssh/authorized_keys, then select the identity path.',
    check: 'Run detection',
    checking: 'Checking…',
    installRsync: 'Install rsync on target',
    installFail: 'Could not install rsync on target (need root or passwordless sudo).',
    canProceed: 'Ready',
    cannotProceed: 'Blocked — fix red items',
    scenarioBoth: 'Both sides: CoPanel',
    scenarioRsync: 'Target: rsync ready',
    scenarioNeed: 'Target: needs rsync',
    scenarioBlocked: 'Blocked',
    sourcePanel: 'Source',
    targetPanel: 'Target',
    noCopanel: 'No CoPanel tree',
    rsyncOnly: 'rsync only (no CoPanel yet)',
    noRsync: 'rsync missing',
    detectHint: 'Run detection to see architecture, OS, CoPanel, and rsync status.',
    tableItem: 'Check',
    source: 'Source',
    target: 'Target',
    localPath: 'Local source path',
    remotePath: 'Remote absolute path',
    alsoWeb: 'Also sync /var/www',
    excludes: 'Exclude patterns (one per line)',
    excludesHint: 'Default CoPanel preset skips config/, backend/data/, venv, node_modules.',
    deleteOpt: 'Mirror deletions (--delete)',
    deleteHint: 'Removes files on target that are gone on source. Dangerous — confirm carefully.',
    estimateGb: 'Estimated size (GB)',
    autoEstimate: 'Auto du',
    estimating: 'Estimating…',
    dryRun: 'Dry run',
    runSync: 'Run real sync',
    scenario: 'Scenario',
    warnDocker: 'Docker is not migrated; rebuild stacks on the new VPS.',
    sqlNote: 'Databases: dump/restore separately (Database Manager).',
    jobSuccess: 'Transfer job finished successfully.',
    doneHint: 'Load checklist after a successful job, or continue manually.',
    startOver: 'Start over',
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    confirm: 'Start',
    confirmDryTitle: 'Start dry-run?',
    confirmDryBody: 'No files will be written. Progress appears in Task Center.',
    confirmRealTitle: 'Start real sync?',
    confirmRealBody: 'Files will be copied over SSH. Ensure detection passed and excludes look correct.',
    submitting: 'Submitting job…',
  },
  vi: {
    title: 'Rsync Manager',
    subtitle: 'Move · Clone · Sync VPS',
    stepMode: 'Chế độ',
    stepTarget: 'Máy đích',
    stepDetect: 'Phát hiện',
    stepScope: 'Phạm vi',
    stepReview: 'Chạy',
    stepDone: 'Checklist',
    modeTitle: 'Chọn chế độ chuyển máy',
    modeDesc: 'Dùng khi cả hai máy có CoPanel, hoặc máy đích đã có rsync.',
    targetTitle: 'SSH máy đích',
    targetDesc: 'SSH bằng khóa từ panel này sang VPS 2 (BatchMode).',
    detectTitle: 'Tương thích & phát hiện CoPanel',
    detectDesc: 'Phát hiện CoPanel remote, rsync, arch, OS và dung lượng trống.',
    scopeTitle: 'Đường dẫn & loại trừ',
    scopeDesc: 'Preset CoPanel / web hoặc tùy chỉnh. Mặc định bỏ config & data để an toàn.',
    reviewTitle: 'Xem lại & chạy',
    reviewDesc: 'Dry-run trước, rồi sync thật qua Task Center có tiến trình.',
    doneTitle: 'Checklist sau migrate',
    doneDesc: 'SQL, Docker, DNS/SSL và cutover làm thủ công — đánh dấu khi xong.',
    modeLabel: 'Chế độ',
    cloneTitle: 'Clone',
    cloneDesc: 'Sao chép sang VPS 2, không xoá file thừa trên đích. Nguồn vẫn chạy.',
    syncTitle: 'Sync',
    syncDesc: 'Cập nhật tăng dần. Tuỳ chọn --delete để mirror.',
    moveTitle: 'Move',
    moveDesc: 'Quy trình cutover: sync file rồi checklist DNS/SQL/Docker.',
    host: 'Host / IP',
    port: 'Cổng',
    user: 'User',
    identity: 'File khóa (trên máy panel)',
    identityHint: 'Private key user panel đọc được.',
    keyHints: 'Khóa phát hiện trên máy này',
    keyAuthHint: 'Dán public key vào ~/.ssh/authorized_keys trên đích, rồi chọn identity.',
    check: 'Chạy phát hiện',
    checking: 'Đang kiểm tra…',
    installRsync: 'Cài rsync trên đích',
    installFail: 'Không cài được rsync trên đích (cần root hoặc sudo không mật khẩu).',
    canProceed: 'Sẵn sàng',
    cannotProceed: 'Bị chặn — sửa mục đỏ',
    scenarioBoth: 'Hai phía: có CoPanel',
    scenarioRsync: 'Đích: đã có rsync',
    scenarioNeed: 'Đích: thiếu rsync',
    scenarioBlocked: 'Bị chặn',
    sourcePanel: 'Nguồn',
    targetPanel: 'Đích',
    noCopanel: 'Không có cây CoPanel',
    rsyncOnly: 'Chỉ rsync (chưa CoPanel)',
    noRsync: 'Thiếu rsync',
    detectHint: 'Chạy phát hiện để xem arch, OS, CoPanel và rsync.',
    tableItem: 'Mục',
    source: 'Nguồn',
    target: 'Đích',
    localPath: 'Đường dẫn nguồn',
    remotePath: 'Đường dẫn đích (tuyệt đối)',
    alsoWeb: 'Đồng bộ thêm /var/www',
    excludes: 'Mẫu loại trừ (mỗi dòng một mẫu)',
    excludesHint: 'Preset CoPanel mặc định bỏ config/, backend/data/, venv, node_modules.',
    deleteOpt: 'Mirror xoá (--delete)',
    deleteHint: 'Xoá file trên đích đã mất ở nguồn. Nguy hiểm — xác nhận kỹ.',
    estimateGb: 'Dung lượng ước tính (GB)',
    autoEstimate: 'Tự du',
    estimating: 'Đang ước tính…',
    dryRun: 'Chạy thử',
    runSync: 'Đồng bộ thật',
    scenario: 'Kịch bản',
    warnDocker: 'Docker không được chuyển; dựng lại trên VPS mới.',
    sqlNote: 'Database: dump/restore riêng (Database Manager).',
    jobSuccess: 'Job chuyển file đã hoàn tất.',
    doneHint: 'Checklist tải sau job thành công, hoặc làm thủ công.',
    startOver: 'Bắt đầu lại',
    back: 'Quay lại',
    next: 'Tiếp',
    cancel: 'Hủy',
    confirm: 'Bắt đầu',
    confirmDryTitle: 'Chạy dry-run?',
    confirmDryBody: 'Không ghi file. Tiến trình hiện ở Task Center.',
    confirmRealTitle: 'Chạy sync thật?',
    confirmRealBody: 'File sẽ được copy qua SSH. Đảm bảo đã detect OK và excludes đúng.',
    submitting: 'Đang gửi job…',
  },
} as const;
