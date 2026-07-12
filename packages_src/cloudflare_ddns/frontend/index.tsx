import { useCallback, useEffect, useState } from 'react';
import { useAppShellContext } from '../../core/hooks/useAppShellContext';
import ModuleViewport from '../../core/shell/ModuleViewport';
import WindowModal from '../../core/shell/WindowModal';
import * as Icons from 'lucide-react';
import { api } from '../../core/platform';

type Tab = 'settings' | 'ddns' | 'records' | 'tunnels';
type ConfirmKind = 'record' | 'ddns' | 'tunnel';

interface Config {
  api_token_set: boolean;
  api_token_hint: string;
  account_id: string;
  account_name: string;
  cloudflared_installed: boolean;
  cloudflared_path: string;
  config_dir: string;
}

interface Zone {
  id: string;
  name: string;
  status: string;
  paused?: boolean;
}

interface DnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied?: boolean;
}

interface DdnsProfile {
  id: string;
  name: string;
  zone_id: string;
  zone_name: string;
  record_name: string;
  record_type: 'A' | 'AAAA';
  proxied: boolean;
  ttl: number;
  ip_source: 'public' | 'interface' | 'custom_url';
  interface_name: string;
  custom_ip_url: string;
  interval_minutes: number;
  enabled: boolean;
  last_ip?: string;
  last_run?: number;
  last_status?: string;
  last_error?: string;
}

interface Tunnel {
  id: string;
  name: string;
  status: string;
  local_configured?: boolean;
}

interface IngressRule {
  hostname: string;
  service: string;
  path: string;
}

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS'];
const EMPTY_DDNS: Partial<DdnsProfile> = {
  name: '',
  record_name: '@',
  record_type: 'A',
  proxied: false,
  ttl: 1,
  ip_source: 'public',
  interface_name: 'eth0',
  custom_ip_url: '',
  interval_minutes: 5,
  enabled: true,
};

const COPY = {
  en: {
    category: 'Network',
    title: 'Cloudflare DDNS',
    subtitle:
      'Dynamic DNS updates, DNS record management, and Cloudflare Tunnel (cloudflared). Requires API Token with Zone:DNS:Edit and Account:Cloudflare Tunnel permissions.',
    tabs: { settings: 'API', ddns: 'DDNS', records: 'DNS Records', tunnels: 'Tunnel' },
    apiToken: 'Cloudflare API Token',
    apiTokenHintBefore: 'Create a token at ',
    apiTokenHintAfter: '. Permissions: Zone → DNS → Edit, Account → Cloudflare Tunnel → Edit.',
    tokenSaved: 'Token saved:',
    tokenOptional: '(leave blank to keep current)',
    accountId: 'Account ID (optional)',
    accountIdPlaceholder: 'Auto-detect on verify',
    saveVerify: 'Save & Verify',
    verifyAgain: 'Verify again',
    tokenValid: 'Token valid ·',
    accounts: 'account(s)',
    cronTitle: 'DDNS Cron',
    cronOk: 'OK — crontab synced',
    cronCheck: 'Needs attention',
    cronProfiles: 'enabled profile(s) ·',
    cronIntervals: 'interval(s)',
    cronDaemon: 'daemon',
    cronRunning: 'running',
    cronStopped: 'stopped',
    cronPlayHint:
      'Play button = run once via API (not cron). Scheduled runs require enabled profiles and OS cron daemon.',
    cronNoLines: 'No cron lines (disabled profiles or not synced).',
    cronSync: 'Install cron & sync',
    cronMissingScript: 'Missing run_update.py — upgrade module.',
    addDdns: 'Add DDNS profile',
    selectZone: 'Select zone',
    profileName: 'Profile name',
    recordName: 'Record (@, home, …)',
    publicIp: 'Public IP',
    networkIface: 'Network interface',
    customUrl: 'Custom URL',
    intervalMin: 'Interval (minutes)',
    proxied: 'Proxied (orange cloud)',
    add: 'Add',
    ddnsProfiles: 'DDNS profiles',
    pending: 'pending',
    disabled: 'disabled',
    every: 'every',
    min: 'min',
    lastRun: 'Last run:',
    noProfiles: 'No DDNS profiles yet.',
    runNow: 'Run now',
    enable: 'Enable',
    disable: 'Disable',
    zones: 'Zones',
    noZones: 'No zones loaded — configure API token first.',
    selectZoneRecords: 'Select a zone to view/edit DNS records.',
    addRecord: 'Add',
    noRecords: 'No records.',
    proxiedLabel: 'proxied',
    cloudflared: 'cloudflared',
    installed: 'Installed:',
    notInstalled: 'cloudflared not installed. Install Cloudflare package before using Tunnel.',
    service: 'Service:',
    tunnels: 'Tunnels',
    selectTunnel: 'Select a tunnel to configure ingress rules.',
    hostname: 'hostname (e.g. app.example.com)',
    serviceUrl: 'http://localhost:80',
    remove: 'Remove',
    addRule: '+ Add rule',
    catchAll404: '+ Catch-all 404',
    saveConfig: 'Save config.yml',
    installService: 'Install systemd service',
    configPath: 'Config saved at',
    configHint: 'After saving, run "Install systemd service" to register cloudflared (Linux).',
    noTunnels: 'No tunnels yet.',
    confirmDeleteRecord: 'Delete this DNS record?',
    confirmDeleteDdns: 'Delete this DDNS profile?',
    confirmDeleteTunnel: 'Delete this tunnel from Cloudflare?',
    cancel: 'Cancel',
    delete: 'Delete',
    api404:
      'Cloudflare DDNS API not found (404) — backend module not loaded. Run: systemctl restart copanel. Previously saved token remains at /var/lib/copanel/cloudflare_ddns.json unless manually deleted.',
    loadFailed: 'Load failed',
    loadZonesFailed: 'Failed to load zones',
    cronSyncFailed: 'Cron sync failed',
    saveFailed: 'Save failed',
    verifyFailed: 'Verify failed',
    loadRecordsFailed: 'Failed to load records',
    addRecordFailed: 'Add record failed',
    deleteFailed: 'Delete failed',
    createDdnsFailed: 'Create DDNS failed',
    runFailed: 'Run failed',
    updateFailed: 'Update failed',
    createTunnelFailed: 'Create tunnel failed',
    saveTunnelFailed: 'Save tunnel config failed',
    installFailed: 'Install service failed',
    deleteTunnelFailed: 'Delete tunnel failed',
  },
  vi: {
    category: 'Network',
    title: 'Cloudflare DDNS',
    subtitle:
      'Cập nhật IP động lên Cloudflare DNS, quản lý bản ghi DNS, và cấu hình Cloudflare Tunnel (cloudflared). Cần API Token với quyền Zone:DNS:Edit và Account:Cloudflare Tunnel.',
    tabs: { settings: 'API', ddns: 'DDNS', records: 'DNS Records', tunnels: 'Tunnel' },
    apiToken: 'Cloudflare API Token',
    apiTokenHintBefore: 'Tạo token tại ',
    apiTokenHintAfter: '. Quyền: Zone → DNS → Edit, Account → Cloudflare Tunnel → Edit.',
    tokenSaved: 'Token đã lưu:',
    tokenOptional: '(để trống nếu không đổi)',
    accountId: 'Account ID (tùy chọn)',
    accountIdPlaceholder: 'Auto-detect khi verify',
    saveVerify: 'Lưu & Verify',
    verifyAgain: 'Verify lại',
    tokenValid: 'Token hợp lệ ·',
    accounts: 'account(s)',
    cronTitle: 'Cron DDNS',
    cronOk: 'OK — crontab đã sync',
    cronCheck: 'Cần kiểm tra',
    cronProfiles: 'profile bật ·',
    cronIntervals: 'interval',
    cronDaemon: 'daemon',
    cronRunning: 'đang chạy',
    cronStopped: 'tắt',
    cronPlayHint:
      'Nút ▶ (Play) = chạy ngay một lần qua API, không phụ thuộc cron. Lịch tự động cần profile bật và daemon cron OS đang chạy.',
    cronNoLines: 'Chưa có dòng cron (profile disabled hoặc chưa sync).',
    cronSync: 'Cài cron & sync',
    cronMissingScript: 'Thiếu run_update.py — cập nhật module lên bản mới.',
    addDdns: 'Thêm DDNS profile',
    selectZone: 'Chọn zone',
    profileName: 'Tên profile',
    recordName: 'Record (@, home, …)',
    publicIp: 'Public IP',
    networkIface: 'Network interface',
    customUrl: 'Custom URL',
    intervalMin: 'Interval (phút)',
    proxied: 'Proxied (orange cloud)',
    add: 'Thêm',
    ddnsProfiles: 'DDNS profiles',
    pending: 'pending',
    disabled: 'disabled',
    every: 'mỗi',
    min: 'p',
    lastRun: 'Lần chạy:',
    noProfiles: 'Chưa có profile DDNS.',
    runNow: 'Chạy ngay',
    enable: 'Bật',
    disable: 'Tắt',
    zones: 'Zones',
    noZones: 'Chưa load zones — cấu hình API token trước.',
    selectZoneRecords: 'Chọn zone để xem/sửa DNS records.',
    addRecord: 'Add',
    noRecords: 'Không có record.',
    proxiedLabel: 'proxied',
    cloudflared: 'cloudflared',
    installed: 'Đã cài:',
    notInstalled: 'Chưa cài cloudflared. Cài từ package Cloudflare trước khi dùng Tunnel.',
    service: 'Service:',
    tunnels: 'Tunnels',
    selectTunnel: 'Chọn tunnel để cấu hình ingress rules.',
    hostname: 'hostname (vd: app.example.com)',
    serviceUrl: 'http://localhost:80',
    remove: 'Xóa',
    addRule: '+ Thêm rule',
    catchAll404: '+ Catch-all 404',
    saveConfig: 'Lưu config.yml',
    installService: 'Cài systemd service',
    configPath: 'Config lưu tại',
    configHint: 'Sau khi lưu, chạy "Cài systemd service" để đăng ký cloudflared (Linux).',
    noTunnels: 'Chưa có tunnel.',
    confirmDeleteRecord: 'Delete this record?',
    confirmDeleteDdns: 'Delete this DDNS profile?',
    confirmDeleteTunnel: 'Delete this tunnel from Cloudflare?',
    cancel: 'Hủy',
    delete: 'Xóa',
    api404:
      'API Cloudflare DDNS không tìm thấy (404) — module backend chưa load. Chạy: systemctl restart copanel. Token cấu hình trước đó vẫn nằm tại /var/lib/copanel/cloudflare_ddns.json trên server (trừ khi file bị xóa thủ công).',
    loadFailed: 'Load failed',
    loadZonesFailed: 'Failed to load zones',
    cronSyncFailed: 'Cron sync failed',
    saveFailed: 'Save failed',
    verifyFailed: 'Verify failed',
    loadRecordsFailed: 'Failed to load records',
    addRecordFailed: 'Add record failed',
    deleteFailed: 'Delete failed',
    createDdnsFailed: 'Create DDNS failed',
    runFailed: 'Run failed',
    updateFailed: 'Update failed',
    createTunnelFailed: 'Create tunnel failed',
    saveTunnelFailed: 'Save tunnel config failed',
    installFailed: 'Install service failed',
    deleteTunnelFailed: 'Delete tunnel failed',
  },
};

function fmtTime(ts?: number) {
  if (!ts) return '—';
  return new Date(ts * 1000).toLocaleString();
}

function statusPill(status?: string) {
  const s = (status || '').toLowerCase();
  if (s === 'updated' || s === 'created')
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
  if (s === 'unchanged') return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
  if (s === 'error') return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300';
  return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300';
}

export default function CloudflareDdns() {
  const { theme, language } = useAppShellContext();
  const isDark = theme === 'dark';
  const t = COPY[language === 'vi' ? 'vi' : 'en'];

  const [tab, setTab] = useState<Tab>('settings');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<{ kind: ConfirmKind; id: string } | null>(null);

  const [config, setConfig] = useState<Config | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [accountId, setAccountId] = useState('');
  const [verifyInfo, setVerifyInfo] = useState<any>(null);

  const [zones, setZones] = useState<Zone[]>([]);
  const [recordsZone, setRecordsZone] = useState<Zone | null>(null);
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [recordDraft, setRecordDraft] = useState({ type: 'A', name: '@', content: '', ttl: 1, proxied: false });

  const [profiles, setProfiles] = useState<DdnsProfile[]>([]);
  const [cronStatus, setCronStatus] = useState<any>(null);
  const [ddnsDraft, setDdnsDraft] = useState<Partial<DdnsProfile>>(EMPTY_DDNS);
  const [ddnsZone, setDdnsZone] = useState<Zone | null>(null);

  const [tunnels, setTunnels] = useState<Tunnel[]>([]);
  const [tunnelName, setTunnelName] = useState('');
  const [activeTunnel, setActiveTunnel] = useState<Tunnel | null>(null);
  const [ingress, setIngress] = useState<IngressRule[]>([{ hostname: '', service: 'http://localhost:80', path: '' }]);
  const [tunnelStatus, setTunnelStatus] = useState<any>(null);

  const panel = isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-200';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputCls = isDark
    ? 'bg-slate-950/40 border-slate-700 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';
  const btnSecondary = isDark
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';

  const loadZones = useCallback(async () => {
    const list = await api<Zone[]>('/api/cloudflare_ddns/zones');
    setZones(list || []);
    return list || [];
  }, []);

  const loadProfiles = useCallback(async () => {
    const list = await api<DdnsProfile[]>('/api/cloudflare_ddns/ddns');
    setProfiles(list || []);
  }, []);

  const loadCronStatus = useCallback(async () => {
    const status = await api('/api/cloudflare_ddns/ddns/cron-status');
    setCronStatus(status);
  }, []);

  const loadTunnels = useCallback(async () => {
    const [list, status] = await Promise.all([
      api<Tunnel[]>('/api/cloudflare_ddns/tunnels'),
      api('/api/cloudflare_ddns/tunnels/service/status'),
    ]);
    setTunnels(list || []);
    setTunnelStatus(status);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const cfg = await api<Config>('/api/cloudflare_ddns/config');
      setConfig(cfg);
      setAccountId(cfg.account_id || '');
      if (cfg.api_token_set) {
        try {
          await loadZones();
        } catch (err: any) {
          setError(err?.message || t.loadZonesFailed);
        }
      } else {
        setZones([]);
      }
      await loadProfiles();
      await loadCronStatus();
      if (tab === 'tunnels' && cfg.api_token_set) await loadTunnels();
    } catch (err: any) {
      const status = err?.status;
      const msg = err?.message || t.loadFailed;
      if (status === 404) {
        setError(t.api404);
      } else {
        setError(msg);
      }
    }
  }, [loadCronStatus, loadProfiles, loadTunnels, loadZones, tab, t.api404, t.loadFailed, t.loadZonesFailed]);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if ((tab === 'ddns' || tab === 'records') && config?.api_token_set) {
      loadZones().catch((err: any) => setError(err?.message || t.loadZonesFailed));
    }
    if (tab === 'ddns') {
      loadCronStatus().catch(() => undefined);
    }
    if (tab === 'tunnels' && config?.api_token_set) {
      loadTunnels().catch((err: any) => setError(err?.message || t.loadFailed));
    }
  }, [tab, config?.api_token_set, loadCronStatus, loadTunnels, loadZones, t.loadFailed, t.loadZonesFailed]);

  async function syncCron() {
    setBusy(true);
    try {
      await api('/api/cloudflare_ddns/ddns/cron-sync', { method: 'POST' });
      setError(null);
      await loadCronStatus();
    } catch (err: any) {
      setError(err?.message || t.cronSyncFailed);
    } finally {
      setBusy(false);
    }
  }

  async function saveToken() {
    setBusy(true);
    try {
      const cfg = await api<Config>('/api/cloudflare_ddns/config', {
        method: 'PUT',
        body: { api_token: tokenInput || undefined, account_id: accountId },
      });
      setConfig(cfg);
      setTokenInput('');
      setError(null);
      const verify = await api('/api/cloudflare_ddns/config/verify', { method: 'POST' });
      setVerifyInfo(verify);
      await loadZones();
      await loadCronStatus();
    } catch (err: any) {
      setError(err?.message || t.saveFailed);
    } finally {
      setBusy(false);
    }
  }

  async function verifyToken() {
    setBusy(true);
    try {
      const verify = await api('/api/cloudflare_ddns/config/verify', { method: 'POST' });
      setVerifyInfo(verify);
      setError(null);
    } catch (err: any) {
      setError(err?.message || t.verifyFailed);
    } finally {
      setBusy(false);
    }
  }

  async function openRecordsZone(z: Zone) {
    setRecordsZone(z);
    try {
      const list = await api<DnsRecord[]>(`/api/cloudflare_ddns/zones/${z.id}/records`);
      setRecords(list || []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || t.loadRecordsFailed);
    }
  }

  async function addRecord() {
    if (!recordsZone || !recordDraft.content.trim()) return;
    try {
      await api(`/api/cloudflare_ddns/zones/${recordsZone.id}/records`, {
        method: 'POST',
        body: recordDraft,
      });
      setRecordDraft({ ...recordDraft, content: '' });
      openRecordsZone(recordsZone);
    } catch (err: any) {
      setError(err?.message || t.addRecordFailed);
    }
  }

  async function deleteRecord(rid: string) {
    if (!recordsZone) return;
    try {
      await api(`/api/cloudflare_ddns/zones/${recordsZone.id}/records/${rid}`, { method: 'DELETE' });
      openRecordsZone(recordsZone);
    } catch (err: any) {
      setError(err?.message || t.deleteFailed);
    }
  }

  async function createDdns() {
    if (!ddnsZone || !ddnsDraft.name?.trim()) return;
    try {
      await api('/api/cloudflare_ddns/ddns', {
        method: 'POST',
        body: {
          ...ddnsDraft,
          zone_id: ddnsZone.id,
          zone_name: ddnsZone.name,
        },
      });
      setDdnsDraft(EMPTY_DDNS);
      await loadProfiles();
      await loadCronStatus();
    } catch (err: any) {
      setError(err?.message || t.createDdnsFailed);
    }
  }

  async function runDdns(id: string) {
    try {
      await api(`/api/cloudflare_ddns/ddns/${id}/run`, { method: 'POST' });
      await loadProfiles();
    } catch (err: any) {
      setError(err?.message || t.runFailed);
    }
  }

  async function toggleDdns(p: DdnsProfile) {
    try {
      await api(`/api/cloudflare_ddns/ddns/${p.id}`, {
        method: 'PUT',
        body: { enabled: !p.enabled },
      });
      await loadProfiles();
      await loadCronStatus();
    } catch (err: any) {
      setError(err?.message || t.updateFailed);
    }
  }

  async function deleteDdns(id: string) {
    try {
      await api(`/api/cloudflare_ddns/ddns/${id}`, { method: 'DELETE' });
      await loadProfiles();
      await loadCronStatus();
    } catch (err: any) {
      setError(err?.message || t.deleteFailed);
    }
  }

  async function createTunnel() {
    if (!tunnelName.trim()) return;
    try {
      await api('/api/cloudflare_ddns/tunnels', { method: 'POST', body: { name: tunnelName.trim() } });
      setTunnelName('');
      await loadTunnels();
    } catch (err: any) {
      setError(err?.message || t.createTunnelFailed);
    }
  }

  async function openTunnel(tun: Tunnel) {
    setActiveTunnel(tun);
    try {
      const cfg = await api<any>(`/api/cloudflare_ddns/tunnels/${tun.id}/config`);
      setIngress(
        (cfg.ingress?.length ? cfg.ingress : [{ hostname: '', service: 'http://localhost:80', path: '' }]) as IngressRule[],
      );
    } catch {
      setIngress([{ hostname: '', service: 'http://localhost:80', path: '' }]);
    }
  }

  async function saveTunnelConfig() {
    if (!activeTunnel) return;
    try {
      await api(`/api/cloudflare_ddns/tunnels/${activeTunnel.id}/config`, {
        method: 'PUT',
        body: { tunnel_id: activeTunnel.id, tunnel_name: activeTunnel.name, ingress },
      });
      await loadTunnels();
      setError(null);
    } catch (err: any) {
      setError(err?.message || t.saveTunnelFailed);
    }
  }

  async function installTunnel() {
    if (!activeTunnel) return;
    try {
      const status = await api(`/api/cloudflare_ddns/tunnels/${activeTunnel.id}/install`, { method: 'POST' });
      setTunnelStatus(status);
    } catch (err: any) {
      setError(err?.message || t.installFailed);
    }
  }

  async function deleteTunnel(id: string) {
    try {
      await api(`/api/cloudflare_ddns/tunnels/${id}`, { method: 'DELETE' });
      if (activeTunnel?.id === id) setActiveTunnel(null);
      await loadTunnels();
    } catch (err: any) {
      setError(err?.message || t.deleteTunnelFailed);
    }
  }

  async function handleConfirmDelete() {
    if (!confirm) return;
    const { kind, id } = confirm;
    setConfirm(null);
    if (kind === 'record') await deleteRecord(id);
    else if (kind === 'ddns') await deleteDdns(id);
    else if (kind === 'tunnel') await deleteTunnel(id);
  }

  const tabs: { id: Tab; label: string; icon: keyof typeof Icons }[] = [
    { id: 'settings', label: t.tabs.settings, icon: 'Key' },
    { id: 'ddns', label: t.tabs.ddns, icon: 'RefreshCw' },
    { id: 'records', label: t.tabs.records, icon: 'Globe' },
    { id: 'tunnels', label: t.tabs.tunnels, icon: 'Route' },
  ];

  const confirmTitle =
    confirm?.kind === 'record'
      ? t.confirmDeleteRecord
      : confirm?.kind === 'ddns'
        ? t.confirmDeleteDdns
        : confirm?.kind === 'tunnel'
          ? t.confirmDeleteTunnel
          : '';

  return (
    <ModuleViewport constrained>
      <div className={`flex flex-col h-full min-h-0 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        <header
          className={`shrink-0 px-4 py-3 border-b flex items-center justify-between gap-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-orange-500 font-bold">{t.category}</p>
            <h1 className="text-lg font-semibold truncate">{t.title}</h1>
            <p className={`text-xs mt-0.5 line-clamp-2 ${muted}`}>{t.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            className={`shrink-0 p-2 rounded-lg border ${btnSecondary}`}
            title="Refresh"
          >
            <Icons.RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {error && (
          <div className="shrink-0 mx-4 mt-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 px-4 py-3 text-sm text-red-600 dark:text-red-300 flex justify-between gap-2">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="shrink-0">
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-1 min-h-0">
          <aside
            className={`w-44 shrink-0 border-r flex flex-col ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}
          >
            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {tabs.map((item) => {
                const Icon = Icons[item.icon] as React.ComponentType<{ className?: string }>;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${
                      active
                        ? isDark
                          ? 'bg-orange-600/25 text-orange-300 font-semibold'
                          : 'bg-orange-50 text-orange-700 font-semibold'
                        : `hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} ${muted}`
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-h-0 overflow-y-auto p-4">
            {tab === 'settings' && (
              <section className={`rounded-2xl border p-5 space-y-4 ${panel}`}>
                <h2 className="text-sm font-bold">{t.apiToken}</h2>
                <p className={`text-xs ${muted}`}>
                  {t.apiTokenHintBefore}
                  <a
                    href="https://dash.cloudflare.com/profile/api-tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-500 underline"
                  >
                    Cloudflare Dashboard
                  </a>
                  {t.apiTokenHintAfter}
                </p>

                {config?.api_token_set && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {t.tokenSaved} <span className="font-mono">{config.api_token_hint}</span>
                    {config.account_name && (
                      <>
                        {' '}
                        · Account: <strong>{config.account_name}</strong>
                      </>
                    )}
                  </p>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                  <label className={`block text-xs font-semibold ${muted}`}>
                    API Token {config?.api_token_set && t.tokenOptional}
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="Cloudflare API Token"
                      className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm font-mono ${inputCls}`}
                    />
                  </label>
                  <label className={`block text-xs font-semibold ${muted}`}>
                    {t.accountId}
                    <input
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      placeholder={t.accountIdPlaceholder}
                      className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm font-mono ${inputCls}`}
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={saveToken}
                    disabled={busy}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold disabled:opacity-50"
                  >
                    {t.saveVerify}
                  </button>
                  <button
                    type="button"
                    onClick={verifyToken}
                    disabled={busy || !config?.api_token_set}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-50 ${btnSecondary}`}
                  >
                    {t.verifyAgain}
                  </button>
                </div>

                {verifyInfo?.valid && (
                  <div className={`text-xs space-y-1 ${muted}`}>
                    <p>
                      {t.tokenValid} {verifyInfo.accounts?.length || 0} {t.accounts}
                    </p>
                    <ul className="list-disc pl-4">
                      {(verifyInfo.accounts || []).map((a: any) => (
                        <li key={a.id} className="font-mono">
                          {a.name} ({a.id})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {tab === 'ddns' && (
              <div className="space-y-4">
                {cronStatus && (
                  <section
                    className={`rounded-2xl border p-4 text-xs ${
                      cronStatus.sync_ok
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30'
                        : 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30'
                    }`}
                  >
                    <h2 className="text-sm font-bold mb-2">{t.cronTitle}</h2>
                    {!cronStatus.supported && <p>{cronStatus.message}</p>}
                    {cronStatus.supported && (
                      <>
                        <p>
                          <strong>{cronStatus.sync_ok ? t.cronOk : t.cronCheck}</strong>
                          {' · '}
                          {cronStatus.enabled_profiles} {t.cronProfiles} {cronStatus.intervals_minutes?.length || 0}{' '}
                          {t.cronIntervals}
                          {cronStatus.cron_daemon?.service && (
                            <>
                              {' '}
                              · {t.cronDaemon} {cronStatus.cron_daemon.service}:{' '}
                              {cronStatus.cron_service_active ? t.cronRunning : t.cronStopped}
                            </>
                          )}
                        </p>
                        <p className={`mt-1 ${muted}`}>{t.cronPlayHint}</p>
                        {(cronStatus.cron_entries || []).length > 0 ? (
                          <ul className="mt-2 font-mono space-y-1 text-[11px]">
                            {cronStatus.cron_entries.map((line: string, i: number) => (
                              <li key={i} className="break-all">
                                {line}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className={`mt-1 ${muted}`}>{t.cronNoLines}</p>
                        )}
                        {!cronStatus.crontab_available && cronStatus.install_hint && (
                          <p className="mt-2 text-amber-800 dark:text-amber-200">{cronStatus.install_hint}</p>
                        )}
                        {cronStatus.crontab_available && cronStatus.cron_service_active === false && cronStatus.install_hint && (
                          <p className="mt-2 text-amber-800 dark:text-amber-200">{cronStatus.install_hint}</p>
                        )}
                        {!cronStatus.sync_ok && (
                          <button
                            type="button"
                            onClick={syncCron}
                            disabled={busy}
                            className="mt-3 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold disabled:opacity-50"
                          >
                            {t.cronSync}
                          </button>
                        )}
                        {cronStatus.scheduler_sync?.message && (
                          <p className={`mt-2 ${muted}`}>{cronStatus.scheduler_sync.message}</p>
                        )}
                        {!cronStatus.run_script_exists && (
                          <p className="mt-1 text-red-600">{t.cronMissingScript}</p>
                        )}
                        {(cronStatus.log_files || []).map(
                          (lf: any) =>
                            lf.tail?.length > 0 && (
                              <details key={lf.path} className="mt-2">
                                <summary className="cursor-pointer">
                                  Log {lf.interval_minutes}p — {lf.path}
                                </summary>
                                <pre className="mt-1 whitespace-pre-wrap text-[10px] opacity-80">{lf.tail.join('\n')}</pre>
                              </details>
                            ),
                        )}
                      </>
                    )}
                  </section>
                )}

                <section className={`rounded-2xl border p-5 space-y-3 ${panel}`}>
                  <h2 className="text-sm font-bold">{t.addDdns}</h2>
                  <div className="grid gap-2 md:grid-cols-4">
                    <select
                      value={ddnsZone?.id || ''}
                      onChange={(e) => setDdnsZone(zones.find((z) => z.id === e.target.value) || null)}
                      className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                    >
                      <option value="">{t.selectZone}</option>
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </select>
                    <input
                      value={ddnsDraft.name || ''}
                      onChange={(e) => setDdnsDraft({ ...ddnsDraft, name: e.target.value })}
                      placeholder={t.profileName}
                      className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                    />
                    <input
                      value={ddnsDraft.record_name || '@'}
                      onChange={(e) => setDdnsDraft({ ...ddnsDraft, record_name: e.target.value })}
                      placeholder={t.recordName}
                      className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                    />
                    <select
                      value={ddnsDraft.record_type || 'A'}
                      onChange={(e) => setDdnsDraft({ ...ddnsDraft, record_type: e.target.value as 'A' | 'AAAA' })}
                      className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                    >
                      <option value="A">A</option>
                      <option value="AAAA">AAAA</option>
                    </select>
                  </div>
                  <div className="grid gap-2 md:grid-cols-4">
                    <select
                      value={ddnsDraft.ip_source || 'public'}
                      onChange={(e) => setDdnsDraft({ ...ddnsDraft, ip_source: e.target.value as DdnsProfile['ip_source'] })}
                      className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                    >
                      <option value="public">{t.publicIp}</option>
                      <option value="interface">{t.networkIface}</option>
                      <option value="custom_url">{t.customUrl}</option>
                    </select>
                    {ddnsDraft.ip_source === 'interface' && (
                      <input
                        value={ddnsDraft.interface_name || ''}
                        onChange={(e) => setDdnsDraft({ ...ddnsDraft, interface_name: e.target.value })}
                        placeholder="eth0"
                        className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                      />
                    )}
                    {ddnsDraft.ip_source === 'custom_url' && (
                      <input
                        value={ddnsDraft.custom_ip_url || ''}
                        onChange={(e) => setDdnsDraft({ ...ddnsDraft, custom_ip_url: e.target.value })}
                        placeholder="https://…"
                        className={`md:col-span-2 rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                      />
                    )}
                    <input
                      type="number"
                      min={1}
                      max={1440}
                      value={ddnsDraft.interval_minutes || 5}
                      onChange={(e) => setDdnsDraft({ ...ddnsDraft, interval_minutes: Number(e.target.value) })}
                      placeholder={t.intervalMin}
                      className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                    />
                    <label className="flex items-center gap-2 text-sm px-2">
                      <input
                        type="checkbox"
                        checked={!!ddnsDraft.proxied}
                        onChange={(e) => setDdnsDraft({ ...ddnsDraft, proxied: e.target.checked })}
                      />
                      {t.proxied}
                    </label>
                    <button
                      type="button"
                      onClick={createDdns}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4"
                    >
                      {t.add}
                    </button>
                  </div>
                </section>

                <section className={`rounded-2xl border p-5 ${panel}`}>
                  <h2 className="text-sm font-bold mb-3">
                    {t.ddnsProfiles} ({profiles.length})
                  </h2>
                  <ul className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {profiles.map((p) => (
                      <li key={p.id} className="py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{p.name}</span>
                            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${statusPill(p.last_status)}`}>
                              {p.last_status || t.pending}
                            </span>
                            {!p.enabled && (
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                {t.disabled}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-mono mt-1 ${muted}`}>
                            {p.record_name}.{p.zone_name} · {p.record_type} · {p.ip_source} · {t.every} {p.interval_minutes}
                            {t.min}
                          </p>
                          <p className={`text-xs mt-0.5 ${muted}`}>
                            IP: {p.last_ip || '—'} · {t.lastRun} {fmtTime(p.last_run)}
                            {p.last_error && <span className="text-red-500 ml-2">{p.last_error}</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => runDdns(p.id)}
                            className={`p-2 rounded-lg border ${btnSecondary}`}
                            title={t.runNow}
                          >
                            <Icons.Play className="w-4 h-4 text-emerald-500" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleDdns(p)}
                            className={`p-2 rounded-lg border ${btnSecondary}`}
                            title={p.enabled ? t.disable : t.enable}
                          >
                            {p.enabled ? <Icons.Pause className="w-4 h-4" /> : <Icons.PlayCircle className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirm({ kind: 'ddns', id: p.id })}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Icons.Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </li>
                    ))}
                    {profiles.length === 0 && (
                      <li className={`py-4 text-xs ${muted}`}>
                        {t.noProfiles}
                      </li>
                    )}
                  </ul>
                </section>
              </div>
            )}

            {tab === 'records' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                <aside className={`rounded-2xl border p-4 ${panel}`}>
                  <h2 className="text-sm font-bold mb-3">{t.zones}</h2>
                  <ul className="space-y-1 max-h-64 lg:max-h-none overflow-y-auto">
                    {zones.map((z) => (
                      <li key={z.id}>
                        <button
                          type="button"
                          onClick={() => openRecordsZone(z)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${
                            recordsZone?.id === z.id
                              ? isDark
                                ? 'bg-orange-600/20 text-orange-300'
                                : 'bg-orange-50 text-orange-700'
                              : isDark
                                ? 'hover:bg-slate-800'
                                : 'hover:bg-slate-100'
                          }`}
                        >
                          {z.name}
                        </button>
                      </li>
                    ))}
                    {zones.length === 0 && <li className={`text-xs ${muted}`}>{t.noZones}</li>}
                  </ul>
                </aside>

                <section className={`lg:col-span-2 rounded-2xl border p-4 ${panel}`}>
                  {!recordsZone ? (
                    <p className={`text-sm ${muted}`}>{t.selectZoneRecords}</p>
                  ) : (
                    <div className="space-y-4">
                      <h2 className="text-base font-bold">{recordsZone.name}</h2>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        <select
                          value={recordDraft.type}
                          onChange={(e) => setRecordDraft({ ...recordDraft, type: e.target.value })}
                          className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                        >
                          {RECORD_TYPES.map((rt) => (
                            <option key={rt}>{rt}</option>
                          ))}
                        </select>
                        <input
                          value={recordDraft.name}
                          onChange={(e) => setRecordDraft({ ...recordDraft, name: e.target.value })}
                          placeholder="name"
                          className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                        />
                        <input
                          value={recordDraft.content}
                          onChange={(e) => setRecordDraft({ ...recordDraft, content: e.target.value })}
                          placeholder="content"
                          className={`md:col-span-2 rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                        />
                        <button
                          type="button"
                          onClick={addRecord}
                          className="rounded-xl bg-emerald-600 text-white text-sm font-bold"
                        >
                          {t.addRecord}
                        </button>
                      </div>
                      <ul className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                        {records.map((r) => (
                          <li key={r.id} className="flex items-center justify-between py-2 text-sm gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300 mr-2">
                                {r.type}
                              </span>
                              <span className="font-mono">{r.name}</span>
                              <span className={`mx-1 ${muted}`}>→</span>
                              <span className="font-mono break-all">{r.content}</span>
                              {r.proxied && <span className="ml-2 text-[10px] text-orange-500">{t.proxiedLabel}</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => setConfirm({ kind: 'record', id: r.id })}
                              className="shrink-0 text-slate-400 hover:text-red-500"
                            >
                              <Icons.Trash2 className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                        {records.length === 0 && <li className={`py-2 text-xs ${muted}`}>{t.noRecords}</li>}
                      </ul>
                    </div>
                  )}
                </section>
              </div>
            )}

            {tab === 'tunnels' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <aside className="space-y-4">
                  <section className={`rounded-2xl border p-4 ${panel}`}>
                    <h2 className="text-sm font-bold mb-2">{t.cloudflared}</h2>
                    <p className={`text-xs ${muted}`}>
                      {tunnelStatus?.installed ? (
                        <>
                          {t.installed} <span className="font-mono">{tunnelStatus.cloudflared_path}</span>
                        </>
                      ) : (
                        t.notInstalled
                      )}
                    </p>
                    {tunnelStatus?.installed && (
                      <p className="text-xs mt-1">
                        {t.service}{' '}
                        <span className={tunnelStatus.active ? 'text-emerald-500' : muted}>
                          {tunnelStatus.message || 'unknown'}
                        </span>
                      </p>
                    )}
                  </section>

                  <section className={`rounded-2xl border p-4 ${panel}`}>
                    <h2 className="text-sm font-bold mb-3">{t.tunnels}</h2>
                    <div className="flex gap-2 mb-3">
                      <input
                        value={tunnelName}
                        onChange={(e) => setTunnelName(e.target.value)}
                        placeholder="my-tunnel"
                        className={`flex-1 rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                      />
                      <button
                        type="button"
                        onClick={createTunnel}
                        className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                    <ul className="space-y-1 max-h-48 overflow-y-auto">
                      {tunnels.map((tun) => (
                        <li key={tun.id} className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openTunnel(tun)}
                            className={`flex-1 text-left px-3 py-2 rounded-xl text-sm transition ${
                              activeTunnel?.id === tun.id
                                ? isDark
                                  ? 'bg-orange-600/20 text-orange-300'
                                  : 'bg-orange-50 text-orange-700'
                                : isDark
                                  ? 'hover:bg-slate-800'
                                  : 'hover:bg-slate-100'
                            }`}
                          >
                            <span className="font-semibold">{tun.name}</span>
                            <span className={`block text-[10px] ${muted}`}>{tun.status}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirm({ kind: 'tunnel', id: tun.id })}
                            className="p-2 text-slate-400 hover:text-red-500"
                          >
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                      {tunnels.length === 0 && <li className={`text-xs ${muted}`}>{t.noTunnels}</li>}
                    </ul>
                  </section>
                </aside>

                <section className={`lg:col-span-2 rounded-2xl border p-4 ${panel}`}>
                  {!activeTunnel ? (
                    <p className={`text-sm ${muted}`}>{t.selectTunnel}</p>
                  ) : (
                    <div className="space-y-4">
                      <header className="flex items-center justify-between">
                        <h2 className="text-base font-bold">{activeTunnel.name}</h2>
                        <span className={`text-[10px] font-mono ${muted}`}>{activeTunnel.id}</span>
                      </header>

                      <div className="space-y-2">
                        {ingress.map((rule, idx) => (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input
                              value={rule.hostname}
                              onChange={(e) => {
                                const next = [...ingress];
                                next[idx] = { ...rule, hostname: e.target.value };
                                setIngress(next);
                              }}
                              placeholder={t.hostname}
                              className={`rounded-xl border px-3 py-2 text-sm ${inputCls}`}
                            />
                            <input
                              value={rule.service}
                              onChange={(e) => {
                                const next = [...ingress];
                                next[idx] = { ...rule, service: e.target.value };
                                setIngress(next);
                              }}
                              placeholder={t.serviceUrl}
                              className={`md:col-span-2 rounded-xl border px-3 py-2 text-sm font-mono ${inputCls}`}
                            />
                            <button
                              type="button"
                              onClick={() => setIngress(ingress.filter((_, i) => i !== idx))}
                              className="text-red-500 text-sm"
                              disabled={ingress.length <= 1}
                            >
                              {t.remove}
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setIngress([...ingress, { hostname: '', service: 'http://localhost:8080', path: '' }])}
                          className="text-xs text-orange-500 font-semibold"
                        >
                          {t.addRule}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIngress([...ingress, { hostname: '', service: 'http_status:404', path: '' }])}
                          className={`text-xs ml-3 ${muted}`}
                        >
                          {t.catchAll404}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          type="button"
                          onClick={saveTunnelConfig}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold"
                        >
                          {t.saveConfig}
                        </button>
                        <button
                          type="button"
                          onClick={installTunnel}
                          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold"
                        >
                          {t.installService}
                        </button>
                      </div>

                      <p className={`text-xs ${muted}`}>
                        {t.configPath} <span className="font-mono">{config?.config_dir}/config.yml</span>. {t.configHint}
                      </p>
                    </div>
                  )}
                </section>
              </div>
            )}
          </main>
        </div>

        <WindowModal open={!!confirm} onClose={() => setConfirm(null)} title={confirmTitle} maxWidth="sm">
          <div className="p-4 flex justify-end gap-2">
            <button type="button" onClick={() => setConfirm(null)} className={`px-4 py-2 rounded-lg border text-sm ${btnSecondary}`}>
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold"
            >
              {t.delete}
            </button>
          </div>
        </WindowModal>
      </div>
    </ModuleViewport>
  );
}
