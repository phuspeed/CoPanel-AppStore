import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppShellContext } from '../../core/hooks/useAppShellContext';
import ModuleViewport from '../../core/shell/ModuleViewport';
import * as Icons from 'lucide-react';
import { api, jobsApi } from '../../core/platform';

type TabId = 'overview' | 'scan' | 'detections' | 'quarantine' | 'settings';

interface OverviewData {
  platform: string;
  installed: boolean;
  engine: {
    selected: string | null;
    clamscan_available: boolean;
    clamdscan_available: boolean;
    freshclam_available: boolean;
    raw?: string | null;
    engine_version?: string | null;
    signature_version?: string | null;
    signature_date?: string | null;
  };
  signatures: {
    version?: string | null;
    updated_at?: string | null;
  };
  services: {
    clamd: { service?: string | null; status: string };
    freshclam: { service?: string | null; status: string };
  };
  settings: ClamAVSettings;
  recent_scans: Array<{
    id: string;
    status: string;
    path: string;
    engine?: string | null;
    infected_count: number;
    created_at: number;
    finished_at?: number | null;
  }>;
  stats: {
    total_detections: number;
    quarantined: number;
    pending_actions: number;
  };
}

interface ClamAVSettings {
  quarantine_dir: string;
  default_scan_targets: string[];
  exclude_paths: string[];
  retention_days: number;
  max_file_size_mb: number;
  include_archives: boolean;
  preferred_engine: 'auto' | 'clamscan' | 'clamdscan';
}

interface DetectionItem {
  id: string;
  scan_id: string;
  scan_path: string;
  scan_created_at: number;
  path: string;
  original_path?: string;
  signature: string;
  status: string;
  detected_at: number;
  quarantine_path?: string | null;
  quarantined_at?: number | null;
  restored_to?: string | null;
  action_error?: string | null;
}

interface ScanState {
  id: string;
  status: string;
  path: string;
  recursive: boolean;
  include_archives: boolean;
  max_file_size_mb: number;
  auto_quarantine: boolean;
  created_at: number;
  started_at?: number | null;
  finished_at?: number | null;
  engine?: string | null;
  summary: {
    infected_count: number;
    scanned_count: number;
    error_count: number;
  };
  detections: DetectionItem[];
  job?: {
    id: string;
    status: string;
    progress: number;
    message?: string;
    logs?: Array<{ ts: number; line: string; level: string }>;
    error?: string | null;
  } | null;
}

interface JobState {
  id: string;
  status: string;
  progress: number;
  message?: string;
  logs?: Array<{ ts: number; line: string; level: string }>;
  error?: string | null;
  result?: any;
}

export default function ClamAVDashboard() {
  const { theme, language } = useAppShellContext();
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<TabId>('overview');
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [settings, setSettings] = useState<ClamAVSettings | null>(null);
  const [detections, setDetections] = useState<DetectionItem[]>([]);
  const [quarantine, setQuarantine] = useState<DetectionItem[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanState | null>(null);
  const [scanPath, setScanPath] = useState('/home');
  const [scanRecursive, setScanRecursive] = useState(true);
  const [scanArchives, setScanArchives] = useState(true);
  const [scanMaxFileSize, setScanMaxFileSize] = useState(100);
  const [scanAutoQuarantine, setScanAutoQuarantine] = useState(false);
  const [updateJob, setUpdateJob] = useState<JobState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const t = {
    en: {
      title: 'ClamAV',
      desc: 'Antivirus signatures, malware scans, detections, and quarantine control.',
      overview: 'Overview',
      scan: 'Scan',
      detections: 'Detections',
      quarantine: 'Quarantine',
      settings: 'Settings',
      notInstalled: 'ClamAV binaries not detected yet. Install the AppStore package dependencies first.',
      installed: 'Installed',
      selectedEngine: 'Selected engine',
      signatures: 'Signatures',
      services: 'Services',
      quickScanHome: 'Quick scan /home',
      quickScanWeb: 'Quick scan /var/www',
      updateDb: 'Update signatures',
      scanPath: 'Scan path',
      recursive: 'Recursive',
      includeArchives: 'Include archives',
      maxFileSize: 'Max file size (MB)',
      autoQuarantine: 'Auto quarantine infected files',
      startScan: 'Start scan',
      stopScan: 'Stop scan',
      stopUpdate: 'Stop update',
      currentScan: 'Current scan',
      recentScans: 'Recent scans',
      infected: 'Infected',
      scanned: 'Scanned',
      errors: 'Errors',
      scanLogs: 'Scan logs',
      path: 'Path',
      signature: 'Signature',
      status: 'Status',
      actions: 'Actions',
      quarantineNow: 'Quarantine',
      restore: 'Restore',
      deleteForever: 'Delete forever',
      emptyDetections: 'No detections yet.',
      emptyQuarantine: 'Quarantine is empty.',
      quarantineDir: 'Quarantine directory',
      defaultTargets: 'Default scan targets (one per line)',
      excludePaths: 'Exclude paths (one per line)',
      retentionDays: 'Retention days',
      preferredEngine: 'Preferred engine',
      auto: 'Auto',
      saveSettings: 'Save settings',
      refresh: 'Refresh',
      lastUpdateJob: 'Signature update job',
      ready: 'Ready',
      active: 'Active',
      inactive: 'Inactive',
      queued: 'Queued',
      running: 'Running',
      completed: 'Completed',
      failed: 'Failed',
      cancelled: 'Cancelled',
      quarantinedState: 'Quarantined',
      restoredState: 'Restored',
      deletedState: 'Deleted',
      detectedState: 'Detected',
      browserHint: 'Use custom path for targeted scans (example: /home/site/public_html).',
      saveOk: 'Saved.',
      started: 'Started.',
      actionOk: 'Action completed.',
    },
    vi: {
      title: 'ClamAV',
      desc: 'Quản lý chữ ký antivirus, quét malware, danh sách phát hiện và khu cách ly.',
      overview: 'Tổng quan',
      scan: 'Quét',
      detections: 'Phát hiện',
      quarantine: 'Cách ly',
      settings: 'Cài đặt',
      notInstalled: 'Chưa thấy binary ClamAV. Hãy cài dependency của gói AppStore trước.',
      installed: 'Đã cài',
      selectedEngine: 'Engine đang dùng',
      signatures: 'Chữ ký',
      services: 'Dịch vụ',
      quickScanHome: 'Quét nhanh /home',
      quickScanWeb: 'Quét nhanh /var/www',
      updateDb: 'Cập nhật chữ ký',
      scanPath: 'Đường dẫn quét',
      recursive: 'Đệ quy',
      includeArchives: 'Quét file nén',
      maxFileSize: 'Cỡ file tối đa (MB)',
      autoQuarantine: 'Tự cách ly file nhiễm',
      startScan: 'Bắt đầu quét',
      stopScan: 'Dừng quét',
      stopUpdate: 'Dừng cập nhật',
      currentScan: 'Lần quét hiện tại',
      recentScans: 'Lần quét gần đây',
      infected: 'Nhiễm',
      scanned: 'Đã quét',
      errors: 'Lỗi',
      scanLogs: 'Log quét',
      path: 'Đường dẫn',
      signature: 'Chữ ký',
      status: 'Trạng thái',
      actions: 'Thao tác',
      quarantineNow: 'Cách ly',
      restore: 'Khôi phục',
      deleteForever: 'Xóa vĩnh viễn',
      emptyDetections: 'Chưa có phát hiện nào.',
      emptyQuarantine: 'Khu cách ly đang trống.',
      quarantineDir: 'Thư mục cách ly',
      defaultTargets: 'Mục tiêu quét mặc định (mỗi dòng một path)',
      excludePaths: 'Đường dẫn loại trừ (mỗi dòng một path)',
      retentionDays: 'Số ngày giữ',
      preferredEngine: 'Engine ưu tiên',
      auto: 'Tự động',
      saveSettings: 'Lưu cài đặt',
      refresh: 'Làm mới',
      lastUpdateJob: 'Job cập nhật chữ ký',
      ready: 'Sẵn sàng',
      active: 'Đang chạy',
      inactive: 'Không chạy',
      queued: 'Đang chờ',
      running: 'Đang chạy',
      completed: 'Hoàn tất',
      failed: 'Thất bại',
      cancelled: 'Đã hủy',
      quarantinedState: 'Đã cách ly',
      restoredState: 'Đã khôi phục',
      deletedState: 'Đã xóa',
      detectedState: 'Mới phát hiện',
      browserHint: 'Có thể nhập path riêng để quét mục tiêu cụ thể (ví dụ: /home/site/public_html).',
      saveOk: 'Đã lưu.',
      started: 'Đã bắt đầu.',
      actionOk: 'Đã thực hiện xong.',
    },
  }[language];

  const card = `${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-xl p-5`;
  const input = `w-full px-3 py-2 rounded-lg border text-sm ${
    isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300'
  }`;
  const label = `block text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`;

  const loadOverview = useCallback(async () => {
    const data = await api<OverviewData>('/api/clamav/overview');
    setOverview(data);
    setSettings(data.settings);
    if (!scanPath && data.settings.default_scan_targets[0]) {
      setScanPath(data.settings.default_scan_targets[0]);
    }
  }, [scanPath]);

  const loadDetections = useCallback(async () => {
    const data = await api<{ items: DetectionItem[]; quarantine: DetectionItem[] }>('/api/clamav/detections');
    setDetections(data.items || []);
    setQuarantine(data.quarantine || []);
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadOverview(), loadDetections()]);
  }, [loadDetections, loadOverview]);

  useEffect(() => {
    loadAll().catch((e) => setError(e.message));
  }, [loadAll]);

  useEffect(() => {
    if (!settings) return;
    setScanArchives(settings.include_archives);
    setScanMaxFileSize(settings.max_file_size_mb);
    if (!scanPath.trim() && settings.default_scan_targets[0]) {
      setScanPath(settings.default_scan_targets[0]);
    }
  }, [settings, scanPath]);

  useEffect(() => {
    if (!currentScan?.id || !currentScan.job || !['queued', 'running'].includes(currentScan.job.status)) return;
    const id = window.setInterval(() => {
      api<ScanState>(`/api/clamav/scan/${currentScan.id}`)
        .then((data) => {
          setCurrentScan(data);
          if (!data.job || !['queued', 'running'].includes(data.job.status)) {
            loadAll().catch(() => {});
          }
        })
        .catch(() => {});
    }, 2000);
    return () => window.clearInterval(id);
  }, [currentScan?.id, currentScan?.job?.status, loadAll]);

  useEffect(() => {
    if (!updateJob?.id || !['queued', 'running'].includes(updateJob.status)) return;
    const id = window.setInterval(() => {
      api<JobState>(`/api/platform/jobs/${updateJob.id}`)
        .then((data) => {
          setUpdateJob(data);
          if (!['queued', 'running'].includes(data.status)) {
            loadOverview().catch(() => {});
          }
        })
        .catch(() => {});
    }, 2000);
    return () => window.clearInterval(id);
  }, [updateJob?.id, updateJob?.status, loadOverview]);

  const statusTone = (value?: string | null) => {
    if (value === 'active' || value === 'success' || value === 'completed' || value === 'restored') return 'text-emerald-500';
    if (value === 'running' || value === 'queued' || value === 'quarantined') return 'text-blue-500';
    if (value === 'failed' || value === 'deleted' || value === 'quarantine_failed' || value === 'restore_failed') return 'text-red-500';
    if (value === 'cancelled') return 'text-slate-500';
    if (value === 'detected') return 'text-amber-500';
    return isDark ? 'text-slate-300' : 'text-slate-600';
  };

  const humanStatus = (value?: string | null) => {
    switch (value) {
      case 'active': return t.active;
      case 'inactive': return t.inactive;
      case 'queued': return t.queued;
      case 'running': return t.running;
      case 'completed':
      case 'success': return t.completed;
      case 'failed': return t.failed;
      case 'cancelled': return t.cancelled;
      case 'quarantined': return t.quarantinedState;
      case 'restored': return t.restoredState;
      case 'deleted': return t.deletedState;
      case 'detected': return t.detectedState;
      default: return value || '—';
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setBusy(true);
    setError(null);
    try {
      const saved = await api<ClamAVSettings>('/api/clamav/settings', {
        method: 'PUT',
        body: settings,
      });
      setSettings(saved);
      setMsg(t.saveOk);
      await loadOverview();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const startScan = async (pathOverride?: string) => {
    setBusy(true);
    setError(null);
    try {
      const result = await api<{ scan_id: string }>('/api/clamav/scan', {
        method: 'POST',
        body: {
          path: pathOverride || scanPath,
          recursive: scanRecursive,
          include_archives: scanArchives,
          max_file_size_mb: scanMaxFileSize,
          auto_quarantine: scanAutoQuarantine,
        },
      });
      const state = await api<ScanState>(`/api/clamav/scan/${result.scan_id}`);
      setCurrentScan(state);
      setTab('scan');
      setMsg(t.started);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const startUpdate = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await api<{ job_id: string }>('/api/clamav/update-signatures', {
        method: 'POST',
        body: { force: false },
      });
      const detail = await api<JobState>(`/api/platform/jobs/${result.job_id}`);
      setUpdateJob(detail);
      setMsg(t.started);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const stopJob = async (jobId?: string | null) => {
    if (!jobId) return;
    setBusy(true);
    setError(null);
    try {
      await jobsApi.cancel(jobId);
      setMsg(t.cancelled);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const actOnDetection = async (endpoint: string, detectionId: string) => {
    setBusy(true);
    setError(null);
    try {
      await api(endpoint, {
        method: 'POST',
        body: { detection_id: detectionId },
      });
      setMsg(t.actionOk);
      await loadDetections();
      await loadOverview();
      if (currentScan?.id) {
        const state = await api<ScanState>(`/api/clamav/scan/${currentScan.id}`);
        setCurrentScan(state);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const tabs: TabId[] = ['overview', 'scan', 'detections', 'quarantine', 'settings'];
  const scanJobActive = !!(currentScan?.job && ['queued', 'running'].includes(currentScan.job.status));
  const updateJobActive = !!(updateJob && ['queued', 'running'].includes(updateJob.status));
  const currentScanLogs = useMemo(() => currentScan?.job?.logs || [], [currentScan?.job?.logs]);

  return (
    <ModuleViewport constrained>
    <div className={`p-4 md:p-6 space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Icons.ShieldAlert className="w-7 h-7 text-emerald-500" />
            {t.title}
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.desc}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-3 py-2 rounded-lg border text-sm ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}
            onClick={() => loadAll().catch((e) => setError(e.message))}
          >
            {t.refresh}
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
            onClick={startUpdate}
            disabled={busy || updateJobActive}
          >
            {t.updateDb}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      {msg && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          {msg}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              tab === id ? 'bg-blue-600 text-white' : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t[id]}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          {!overview?.installed && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              {t.notInstalled}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: t.installed, value: overview?.installed ? t.ready : 'No', icon: Icons.ShieldCheck },
              { label: t.selectedEngine, value: overview?.engine?.selected || '—', icon: Icons.Cpu },
              { label: t.signatures, value: overview?.signatures?.version || '—', icon: Icons.Database },
              { label: t.detections, value: String(overview?.stats?.total_detections || 0), icon: Icons.Bug },
            ].map((item) => (
              <div key={item.label} className={card}>
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4 text-blue-500" />
                  <span className={`text-xs font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</span>
                </div>
                <p className="text-lg font-semibold break-all">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className={card}>
              <h2 className="font-semibold mb-3">{t.services}</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className={label}>clamd</span>
                  <span className={statusTone(overview?.services?.clamd?.status)}>{humanStatus(overview?.services?.clamd?.status)}</span>
                </p>
                <p>
                  <span className={label}>freshclam</span>
                  <span className={statusTone(overview?.services?.freshclam?.status)}>{humanStatus(overview?.services?.freshclam?.status)}</span>
                </p>
                <p>
                  <span className={label}>{t.signatures}</span>
                  <span>{overview?.signatures?.updated_at || '—'}</span>
                </p>
              </div>
            </div>

            <div className={card}>
              <h2 className="font-semibold mb-3">{t.recentScans}</h2>
              <div className="space-y-3">
                {(overview?.recent_scans || []).length === 0 && (
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>—</p>
                )}
                {(overview?.recent_scans || []).map((item) => (
                  <div key={item.id} className={`rounded-lg border p-3 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium break-all">{item.path}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{item.engine || '—'}</p>
                      </div>
                      <span className={`text-sm font-medium ${statusTone(item.status)}`}>{humanStatus(item.status)}</span>
                    </div>
                    <p className={`mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t.infected}: {item.infected_count}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'scan' && (
        <div className="space-y-4">
          <div className={card}>
            <div className="flex flex-wrap gap-2 mb-4">
              <button type="button" className="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm" onClick={() => startScan('/home')} disabled={busy}>
                {t.quickScanHome}
              </button>
              <button type="button" className="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm" onClick={() => startScan('/var/www')} disabled={busy}>
                {t.quickScanWeb}
              </button>
            </div>
            <label className={label}>{t.scanPath}</label>
            <input className={input} value={scanPath} onChange={(e) => setScanPath(e.target.value)} placeholder="/home/site/public_html" />
            <p className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.browserHint}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={scanRecursive} onChange={(e) => setScanRecursive(e.target.checked)} />
                {t.recursive}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={scanArchives} onChange={(e) => setScanArchives(e.target.checked)} />
                {t.includeArchives}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={scanAutoQuarantine} onChange={(e) => setScanAutoQuarantine(e.target.checked)} />
                {t.autoQuarantine}
              </label>
              <div>
                <label className={label}>{t.maxFileSize}</label>
                <input className={input} type="number" min={1} max={2048} value={scanMaxFileSize} onChange={(e) => setScanMaxFileSize(Number(e.target.value))} />
              </div>
            </div>

            <button type="button" className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50" disabled={busy || scanJobActive || !scanPath.trim()} onClick={() => startScan()}>
              {t.startScan}
            </button>
          </div>

          {currentScan && (
            <div className={card}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="font-semibold">{t.currentScan}</h2>
                <div className="flex items-center gap-2">
                  {scanJobActive && (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50"
                      disabled={busy}
                      onClick={() => stopJob(currentScan.job?.id)}
                    >
                      {t.stopScan}
                    </button>
                  )}
                  <span className={`text-sm font-medium ${statusTone(currentScan.job?.status || currentScan.status)}`}>
                    {humanStatus(currentScan.job?.status || currentScan.status)}
                  </span>
                </div>
              </div>
              <p className="text-sm break-all">{currentScan.path}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm">
                <div>{t.infected}: <strong>{currentScan.summary?.infected_count || 0}</strong></div>
                <div>{t.scanned}: <strong>{currentScan.summary?.scanned_count || 0}</strong></div>
                <div>{t.errors}: <strong>{currentScan.summary?.error_count || 0}</strong></div>
              </div>
              <div className={`mt-4 h-2 w-full overflow-hidden rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${currentScan.job?.progress || 0}%` }} />
              </div>
              <div className="mt-4">
                <div className={`mb-2 text-xs font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.scanLogs}</div>
                <pre className={`max-h-80 overflow-auto rounded-lg border p-3 text-[11px] whitespace-pre-wrap ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  {currentScanLogs.map((line) => line.line).join('\n') || '—'}
                </pre>
              </div>
            </div>
          )}

          {updateJob && (
            <div className={card}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="font-semibold">{t.lastUpdateJob}</h2>
                {updateJobActive && (
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50"
                    disabled={busy}
                    onClick={() => stopJob(updateJob.id)}
                  >
                    {t.stopUpdate}
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span>{humanStatus(updateJob.status)}</span>
                <span>{updateJob.progress || 0}%</span>
              </div>
              <pre className={`mt-3 max-h-52 overflow-auto rounded-lg border p-3 text-[11px] whitespace-pre-wrap ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                {(updateJob.logs || []).map((line) => line.line).join('\n') || updateJob.message || '—'}
              </pre>
            </div>
          )}
        </div>
      )}

      {tab === 'detections' && (
        <div className={card}>
          {(detections || []).length === 0 && <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.emptyDetections}</p>}
          <div className="space-y-3">
            {detections.filter((item) => item.status !== 'quarantined').map((item) => (
              <div key={item.id} className={`rounded-lg border p-3 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium break-all">{item.path}</p>
                    <p className={`text-sm ${statusTone(item.status)}`}>{item.signature}</p>
                    {item.action_error && <p className="text-xs text-red-500 mt-1">{item.action_error}</p>}
                  </div>
                  <span className={`text-sm font-medium ${statusTone(item.status)}`}>{humanStatus(item.status)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.status === 'detected' && (
                    <button type="button" className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium disabled:opacity-50" disabled={busy} onClick={() => actOnDetection('/api/clamav/detections/quarantine', item.id)}>
                      {t.quarantineNow}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'quarantine' && (
        <div className={card}>
          {quarantine.length === 0 && <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.emptyQuarantine}</p>}
          <div className="space-y-3">
            {quarantine.map((item) => (
              <div key={item.id} className={`rounded-lg border p-3 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium break-all">{item.original_path || item.path}</p>
                    <p className="text-sm text-amber-500">{item.signature}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{item.quarantine_path || '—'}</p>
                    {item.action_error && <p className="text-xs text-red-500 mt-1">{item.action_error}</p>}
                  </div>
                  <span className={`text-sm font-medium ${statusTone(item.status)}`}>{humanStatus(item.status)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.status === 'quarantined' && (
                    <>
                      <button type="button" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium disabled:opacity-50" disabled={busy} onClick={() => actOnDetection('/api/clamav/quarantine/restore', item.id)}>
                        {t.restore}
                      </button>
                      <button type="button" className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50" disabled={busy} onClick={() => actOnDetection('/api/clamav/quarantine/delete', item.id)}>
                        {t.deleteForever}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && settings && (
        <div className={card}>
          <div className="space-y-4">
            <div>
              <label className={label}>{t.quarantineDir}</label>
              <input className={input} value={settings.quarantine_dir} onChange={(e) => setSettings({ ...settings, quarantine_dir: e.target.value })} />
            </div>
            <div>
              <label className={label}>{t.defaultTargets}</label>
              <textarea className={`${input} min-h-28`} value={settings.default_scan_targets.join('\n')} onChange={(e) => setSettings({ ...settings, default_scan_targets: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })} />
            </div>
            <div>
              <label className={label}>{t.excludePaths}</label>
              <textarea className={`${input} min-h-28`} value={settings.exclude_paths.join('\n')} onChange={(e) => setSettings({ ...settings, exclude_paths: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={label}>{t.retentionDays}</label>
                <input className={input} type="number" min={1} max={365} value={settings.retention_days} onChange={(e) => setSettings({ ...settings, retention_days: Number(e.target.value) })} />
              </div>
              <div>
                <label className={label}>{t.maxFileSize}</label>
                <input className={input} type="number" min={1} max={2048} value={settings.max_file_size_mb} onChange={(e) => setSettings({ ...settings, max_file_size_mb: Number(e.target.value) })} />
              </div>
              <div>
                <label className={label}>{t.preferredEngine}</label>
                <select className={input} value={settings.preferred_engine} onChange={(e) => setSettings({ ...settings, preferred_engine: e.target.value as ClamAVSettings['preferred_engine'] })}>
                  <option value="auto">{t.auto}</option>
                  <option value="clamscan">clamscan</option>
                  <option value="clamdscan">clamdscan</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={settings.include_archives} onChange={(e) => setSettings({ ...settings, include_archives: e.target.checked })} />
              {t.includeArchives}
            </label>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50" disabled={busy} onClick={saveSettings}>
              {t.saveSettings}
            </button>
          </div>
        </div>
      )}
    </div>
    </ModuleViewport>
  );
}
