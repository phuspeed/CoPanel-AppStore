/**
 * Speedtest — AppStore module (Classic + Desktop Dual UI).
 * Runs network tests on the VPS host and shows live Mbps / latency.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppShellContext } from '../../core/hooks/useAppShellContext';
import ModuleViewport from '../../core/shell/ModuleViewport';
import { cn } from '../../lib/utils';
import { api, PlatformError } from '../../core/platform';
import { TEXT, type Lang } from './i18n';

type Phase = 'idle' | 'ping' | 'download' | 'upload' | 'done';

type Job = {
  id: string;
  status: 'queued' | 'running' | 'done' | 'error';
  phase: Phase;
  server_id: string;
  server_name: string;
  ping_ms: number | null;
  jitter_ms: number | null;
  download_mbps: number | null;
  upload_mbps: number | null;
  download_progress: number;
  upload_progress: number;
  live_mbps: number | null;
  meta: {
    client_ip?: string;
    colo?: string;
    city?: string;
    country?: string;
    asn?: number | string;
  };
  error: string | null;
  started_at: number | null;
  finished_at: number | null;
};

type HistoryItem = {
  id: string;
  server_name?: string;
  ping_ms?: number | null;
  jitter_ms?: number | null;
  download_mbps?: number | null;
  upload_mbps?: number | null;
  finished_at?: number;
  meta?: Job['meta'];
};

function phaseLabel(phase: Phase, tr: (typeof TEXT)['en']): string {
  switch (phase) {
    case 'ping':
      return tr.phasePing;
    case 'download':
      return tr.phaseDownload;
    case 'upload':
      return tr.phaseUpload;
    case 'done':
      return tr.phaseDone;
    default:
      return tr.phaseIdle;
  }
}

function formatMbps(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  if (n >= 100) return n.toFixed(0);
  if (n >= 10) return n.toFixed(1);
  return n.toFixed(2);
}

function formatMs(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return n < 10 ? n.toFixed(1) : n.toFixed(0);
}

function formatWhen(ts?: number): string {
  if (!ts) return '—';
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return '—';
  }
}

/** Map Mbps to 0–100 arc fill (log-ish curve up to ~1 Gbps). */
function speedToPercent(mbps: number | null | undefined): number {
  if (mbps == null || mbps <= 0) return 0;
  const capped = Math.min(1000, mbps);
  return Math.min(100, (Math.log10(capped + 1) / Math.log10(1001)) * 100);
}

function SpeedGauge({
  value,
  label,
  unit,
  isDark,
  active,
}: {
  value: number | null;
  label: string;
  unit: string;
  isDark: boolean;
  active: boolean;
}) {
  const percent = speedToPercent(value);
  const r = 88;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75;
  const offset = arc - (percent / 100) * arc;
  const track = isDark ? '#1e293b' : '#e2e8f0';
  const stroke = active ? '#0ea5e9' : isDark ? '#38bdf8' : '#0284c7';

  return (
    <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-[135deg]">
        <circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke={track}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${c}`}
        />
        <circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${c}`}
          strokeDashoffset={offset}
          className={cn('transition-[stroke-dashoffset] duration-300', active && 'animate-pulse')}
        />
      </svg>
      <div className="absolute inset-0 flex rotate-0 flex-col items-center justify-center pt-2">
        <span
          className={cn(
            'text-4xl font-bold tabular-nums tracking-tight sm:text-5xl',
            isDark ? 'text-slate-50' : 'text-slate-900'
          )}
        >
          {formatMbps(value)}
        </span>
        <span className={cn('mt-1 text-xs font-semibold uppercase tracking-[0.2em]', isDark ? 'text-slate-400' : 'text-slate-500')}>
          {unit}
        </span>
        <span className={cn('mt-2 text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>{label}</span>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  isDark,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  isDark: boolean;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-1 rounded-2xl border px-4 py-3',
        isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white'
      )}
    >
      <span className={cn('text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-500' : 'text-slate-400')}>
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className={cn('text-2xl font-bold tabular-nums', accent || (isDark ? 'text-slate-50' : 'text-slate-900'))}>
          {value}
        </span>
        <span className={cn('text-xs font-medium', isDark ? 'text-slate-500' : 'text-slate-400')}>{unit}</span>
      </div>
    </div>
  );
}

export default function SpeedtestApp() {
  const { theme, language } = useAppShellContext();
  const isDark = theme === 'dark';
  const lang: Lang = language === 'vi' ? 'vi' : 'en';
  const tr = TEXT[lang];

  const [job, setJob] = useState<Job | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const pollRef = useRef<number | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const items = await api<HistoryItem[]>('/api/speedtest/history?limit=8');
      setHistory(Array.isArray(items) ? items : []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadHistory();
    api<Job | null>('/api/speedtest/status')
      .then((active) => {
        if (active && (active.status === 'running' || active.status === 'queued')) {
          setJob(active);
        }
      })
      .catch(() => undefined);
  }, [loadHistory]);

  const stopPoll = useCallback(() => {
    if (pollRef.current != null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!job || (job.status !== 'running' && job.status !== 'queued')) {
      stopPoll();
      return;
    }
    stopPoll();
    pollRef.current = window.setInterval(() => {
      api<Job>(`/api/speedtest/status?job_id=${encodeURIComponent(job.id)}`)
        .then((next) => {
          setJob(next);
          if (next.status === 'done' || next.status === 'error') {
            stopPoll();
            loadHistory();
            if (next.status === 'error') {
              setError(next.error || tr.error);
            }
          }
        })
        .catch(() => undefined);
    }, 400);
    return stopPoll;
  }, [job?.id, job?.status, loadHistory, stopPoll, tr.error]);

  const running = job?.status === 'running' || job?.status === 'queued' || starting;

  const gaugeValue = useMemo(() => {
    if (!job) return null;
    if (job.phase === 'download') return job.live_mbps ?? job.download_mbps;
    if (job.phase === 'upload') return job.live_mbps ?? job.upload_mbps;
    if (job.phase === 'done') return job.download_mbps;
    return null;
  }, [job]);

  const gaugeLabel = useMemo(() => {
    if (!job) return tr.phaseIdle;
    return phaseLabel(job.phase, tr);
  }, [job, tr]);

  const startTest = async () => {
    if (running) return;
    setError(null);
    setStarting(true);
    try {
      const next = await api<Job>('/api/speedtest/run', { method: 'POST', body: {} });
      setJob(next);
    } catch (err) {
      const msg =
        err instanceof PlatformError
          ? err.code === 'SPEEDTEST_BUSY'
            ? tr.busy
            : err.message
          : tr.error;
      setError(msg);
    } finally {
      setStarting(false);
    }
  };

  const metaLine = useMemo(() => {
    const meta = job?.meta;
    if (!meta) return null;
    const parts = [meta.client_ip, meta.colo, meta.city, meta.country].filter(Boolean);
    return parts.length ? parts.join(' · ') : null;
  }, [job?.meta]);

  return (
    <ModuleViewport constrained className="overflow-hidden">
      <div className={cn('flex h-full min-h-0 flex-col', isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900')}>
        <header
          className={cn(
            'shrink-0 border-b px-5 py-4',
            isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white/80'
          )}
        >
          <h1 className="text-lg font-bold tracking-tight">{tr.title}</h1>
          <p className={cn('mt-0.5 text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>{tr.subtitle}</p>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
            <SpeedGauge
              value={gaugeValue}
              label={gaugeLabel}
              unit={tr.mbps}
              isDark={isDark}
              active={running && (job?.phase === 'download' || job?.phase === 'upload')}
            />

            <button
              type="button"
              onClick={startTest}
              disabled={running}
              className={cn(
                'relative flex h-20 w-20 items-center justify-center rounded-full text-sm font-bold tracking-wide transition',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2',
                running
                  ? isDark
                    ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                    : 'cursor-not-allowed bg-slate-200 text-slate-400'
                  : 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 active:scale-[0.98]'
              )}
            >
              {running ? '…' : job?.status === 'done' ? tr.again : tr.go}
            </button>

            <p className={cn('text-center text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{tr.stopHint}</p>

            {error && (
              <div
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-sm',
                  isDark ? 'border-rose-900/60 bg-rose-950/40 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700'
                )}
              >
                {error}
              </div>
            )}

            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard
                label={tr.ping}
                value={formatMs(job?.ping_ms)}
                unit={tr.ms}
                isDark={isDark}
                accent={isDark ? 'text-emerald-400' : 'text-emerald-600'}
              />
              <MetricCard
                label={tr.jitter}
                value={formatMs(job?.jitter_ms)}
                unit={tr.ms}
                isDark={isDark}
              />
              <MetricCard
                label={tr.download}
                value={formatMbps(job?.download_mbps)}
                unit={tr.mbps}
                isDark={isDark}
                accent={isDark ? 'text-sky-400' : 'text-sky-600'}
              />
              <MetricCard
                label={tr.upload}
                value={formatMbps(job?.upload_mbps)}
                unit={tr.mbps}
                isDark={isDark}
                accent={isDark ? 'text-violet-400' : 'text-violet-600'}
              />
            </div>

            {(job?.server_name || metaLine) && (
              <div
                className={cn(
                  'w-full rounded-2xl border px-4 py-3 text-sm',
                  isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'
                )}
              >
                {job?.server_name && (
                  <p>
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{tr.server}: </span>
                    {job.server_name}
                  </p>
                )}
                {metaLine && (
                  <p className="mt-1">
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{tr.client}: </span>
                    {metaLine}
                  </p>
                )}
              </div>
            )}

            <section className="w-full">
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold">{tr.history}</h2>
                <span className={cn('text-[11px]', isDark ? 'text-slate-600' : 'text-slate-400')}>{tr.clearHint}</span>
              </div>
              {history.length === 0 ? (
                <p className={cn('rounded-2xl border border-dashed px-4 py-6 text-center text-sm', isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400')}>
                  {tr.noHistory}
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {history.map((h) => (
                    <li
                      key={h.id}
                      className={cn(
                        'flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm',
                        isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{h.server_name || 'Cloudflare'}</p>
                        <p className={cn('text-[11px]', isDark ? 'text-slate-500' : 'text-slate-400')}>
                          {formatWhen(h.finished_at)}
                        </p>
                      </div>
                      <div className="flex gap-3 tabular-nums">
                        <span title={tr.ping}>
                          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>P </span>
                          {formatMs(h.ping_ms)}
                        </span>
                        <span title={tr.download} className={isDark ? 'text-sky-400' : 'text-sky-600'}>
                          ↓ {formatMbps(h.download_mbps)}
                        </span>
                        <span title={tr.upload} className={isDark ? 'text-violet-400' : 'text-violet-600'}>
                          ↑ {formatMbps(h.upload_mbps)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </main>
      </div>
    </ModuleViewport>
  );
}
