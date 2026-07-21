import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppShellContext } from '../../core/hooks/useAppShellContext';
import { useIsWindowedModule } from '../../core/shell/WindowViewportContext';
import ModuleViewport from '../../core/shell/ModuleViewport';
import ModuleSidebarLayout from '../../core/shell/ModuleSidebarLayout';
import WindowModal from '../../core/shell/WindowModal';
import { cn } from '../../lib/utils';
import * as Icons from 'lucide-react';

type PairDirection = 'upload' | 'download';
type MainTab = 'overview' | 'tasks';

interface Account {
  remote_name: string;
  provider: string;
  type: string;
  connected: boolean;
  expiry?: string;
  updated_at?: string;
}

interface PairItem {
  id: number;
  pair_name: string;
  direction: PairDirection;
  local_path: string;
  remote_name: string;
  remote_path: string;
  sync_deletions: number;
  transfers: number;
  active: number;
}

const PROVIDERS = [{ id: 'google_drive', label: 'Google Drive', icon: Icons.HardDrive }] as const;

export default function CloudSync() {
  const { theme, language } = useAppShellContext();
  const isDark = theme === 'dark';
  const windowed = useIsWindowedModule();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<MainTab>('overview');
  const [pairs, setPairs] = useState<PairItem[]>([]);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [providerOpen, setProviderOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [oauthConfigured, setOauthConfigured] = useState<boolean | null>(null);
  const [oauthSetup, setOauthSetup] = useState(false);
  const [oauthClientId, setOauthClientId] = useState('');
  const [oauthClientSecret, setOauthClientSecret] = useState('');
  const [oauthRedirectUri, setOauthRedirectUri] = useState('');
  const [savingOauth, setSavingOauth] = useState(false);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [pairName, setPairName] = useState('');
  const [direction, setDirection] = useState<PairDirection>('upload');
  const [localPath, setLocalPath] = useState('');
  const [remotePath, setRemotePath] = useState('');
  const [syncDeletions, setSyncDeletions] = useState(true);
  const [transfers, setTransfers] = useState(4);

  const [explorerOpen, setExplorerOpen] = useState(false);
  const [explorerPath, setExplorerPath] = useState('/');
  const [explorerItems, setExplorerItems] = useState<{ name: string; path: string; type: string }[]>([]);

  const [streamingPair, setStreamingPair] = useState<PairItem | null>(null);
  const [streamLogs, setStreamLogs] = useState<{ text: string; isError: boolean }[]>([]);
  const streamLogsRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('copanel_token') : null;
  const authHeaders = useCallback(
    () => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json' }),
    [token],
  );

  const tr = useMemo(
    () =>
      ({
        en: {
          title: 'Cloud Sync',
          subtitle: 'Sync folders with Google Drive',
          addAccount: 'Add cloud account',
          overview: 'Overview',
          tasks: 'Task List',
          upToDate: 'Ready to sync',
          upToDateHint: 'Select a folder sync task or create a new one.',
          cloudType: 'Cloud type',
          accountName: 'Account',
          noAccounts: 'No cloud accounts yet.',
          noAccountsHint: 'Click + to connect Google Drive.',
          connectGoogle: 'Connect Google Drive',
          connecting: 'Opening Google sign-in…',
          providersTitle: 'Cloud Providers',
          providersDesc: 'Select a cloud service to connect.',
          newTask: 'Create sync task',
          runNow: 'Run now',
          pairName: 'Task name',
          upload: 'Upload (NAS → cloud)',
          download: 'Download (cloud → NAS)',
          localPath: 'Local folder',
          remotePath: 'Cloud folder path',
          syncDeletions: 'Sync deletions',
          transfers: 'Parallel transfers',
          save: 'Save',
          cancel: 'Cancel',
          browse: 'Browse',
          noTasks: 'No sync tasks for this account.',
          oauthError: 'Could not start Google sign-in.',
          oauthSetupTitle: 'Google API setup (one time)',
          oauthSetupDesc:
            'Create an OAuth client in Google Cloud Console (Web application), add the redirect URI below, then paste Client ID and Secret. After saving, Connect opens Google sign-in.',
          oauthClientId: 'Client ID',
          oauthClientSecret: 'Client Secret',
          oauthRedirectUri: 'Authorized redirect URI',
          oauthSave: 'Save & continue',
          oauthCopy: 'Copy',
          oauthCopied: 'Copied',
        },
        vi: {
          title: 'Cloud Sync',
          subtitle: 'Đồng bộ thư mục với Google Drive',
          addAccount: 'Thêm tài khoản cloud',
          overview: 'Tổng quan',
          tasks: 'Danh sách tác vụ',
          upToDate: 'Sẵn sàng đồng bộ',
          upToDateHint: 'Chọn tác vụ đồng bộ hoặc tạo mới.',
          cloudType: 'Loại cloud',
          accountName: 'Tài khoản',
          noAccounts: 'Chưa có tài khoản cloud.',
          noAccountsHint: 'Nhấn + để kết nối Google Drive.',
          connectGoogle: 'Kết nối Google Drive',
          connecting: 'Đang mở đăng nhập Google…',
          providersTitle: 'Nhà cung cấp Cloud',
          providersDesc: 'Chọn dịch vụ cloud để kết nối.',
          newTask: 'Tạo tác vụ đồng bộ',
          runNow: 'Chạy ngay',
          pairName: 'Tên tác vụ',
          upload: 'Upload (NAS → cloud)',
          download: 'Download (cloud → NAS)',
          localPath: 'Thư mục máy chủ',
          remotePath: 'Đường dẫn trên cloud',
          syncDeletions: 'Đồng bộ xóa',
          transfers: 'Luồng song song',
          save: 'Lưu',
          cancel: 'Hủy',
          browse: 'Duyệt',
          noTasks: 'Chưa có tác vụ cho tài khoản này.',
          oauthError: 'Không thể mở đăng nhập Google.',
          oauthSetupTitle: 'Cấu hình Google API (một lần)',
          oauthSetupDesc:
            'Tạo OAuth client trên Google Cloud Console (Web application), thêm redirect URI bên dưới, rồi dán Client ID và Secret. Sau khi lưu, Connect sẽ mở đăng nhập Google.',
          oauthClientId: 'Client ID',
          oauthClientSecret: 'Client Secret',
          oauthRedirectUri: 'Authorized redirect URI',
          oauthSave: 'Lưu và tiếp tục',
          oauthCopy: 'Sao chép',
          oauthCopied: 'Đã sao chép',
        },
      })[language === 'vi' ? 'vi' : 'en'],
    [language],
  );

  const input = cn(
    'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500',
    isDark ? 'border-slate-800 bg-slate-950 text-slate-200' : 'border-slate-200 bg-white text-slate-800',
  );
  const card = cn('rounded-2xl border p-5 shadow-sm', isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white');

  const fetchAccounts = useCallback(async () => {
    const r = await fetch('/api/cloud_sync/accounts', { headers: authHeaders() });
    const d = await r.json();
    const list: Account[] = d.data || [];
    setAccounts(list);
    if (list.length && !selectedAccount) setSelectedAccount(list[0].remote_name);
    return list;
  }, [authHeaders, selectedAccount]);

  const fetchPairs = useCallback(async () => {
    const r = await fetch('/api/cloud_sync/pairs', { headers: authHeaders() });
    const d = await r.json();
    setPairs(d.data || []);
  }, [authHeaders]);

  useEffect(() => {
    fetchAccounts();
    fetchPairs();
  }, []);

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== 'copanel_google_oauth') return;
      setConnecting(false);
      setProviderOpen(false);
      if (data.ok && data.remote_name) {
        const list = await fetchAccounts();
        setSelectedAccount(data.remote_name);
        setMsg({ text: `Google Drive connected: ${data.remote_name}`, isError: false });
      } else {
        setMsg({ text: String(data.error || tr.oauthError), isError: true });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [fetchAccounts, tr.oauthError]);

  useEffect(() => {
    if (streamLogsRef.current) streamLogsRef.current.scrollTop = streamLogsRef.current.scrollHeight;
  }, [streamLogs]);

  const accountPairs = useMemo(
    () => (selectedAccount ? pairs.filter((p) => p.remote_name === selectedAccount) : []),
    [pairs, selectedAccount],
  );

  const refreshOauthConfig = useCallback(async () => {
    const origin = window.location.origin;
    const redirect = `${origin}/api/cloud_sync/oauth/google/callback`;
    setOauthRedirectUri(redirect);
    try {
      const r = await fetch(
        `/api/cloud_sync/oauth/google/config?redirect_origin=${encodeURIComponent(origin)}`,
        { headers: authHeaders() },
      );
      const d = await r.json();
      const configured = Boolean(d?.data?.configured);
      setOauthConfigured(configured);
      setOauthSetup(!configured);
      if (d?.data?.redirect_uri) setOauthRedirectUri(d.data.redirect_uri);
      return configured;
    } catch {
      setOauthConfigured(false);
      setOauthSetup(true);
      return false;
    }
  }, [authHeaders]);

  const openProviderModal = async () => {
    setProviderOpen(true);
    setAuthUrl(null);
    setMsg(null);
    await refreshOauthConfig();
  };

  const startGoogleConnect = async () => {
    setConnecting(true);
    setMsg(null);
    try {
      const r = await fetch('/api/cloud_sync/oauth/google/connect', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ redirect_origin: window.location.origin }),
      });
      const d = await r.json();
      if (!r.ok || !d?.data?.auth_url) {
        const code = d?.error?.code || '';
        const detail = d?.error?.message || d?.detail || d?.message || tr.oauthError;
        if (r.status === 503 || code === 'OAUTH_NOT_CONFIGURED') {
          setOauthConfigured(false);
          setOauthSetup(true);
          setOauthRedirectUri(`${window.location.origin}/api/cloud_sync/oauth/google/callback`);
        }
        setMsg({ text: detail, isError: true });
        setConnecting(false);
        return;
      }
      setOauthConfigured(true);
      setOauthSetup(false);
      const url = d.data.auth_url as string;
      setAuthUrl(url);
      const features = 'width=520,height=720,noopener,noreferrer';
      const popup = window.open(url, '_blank', features);
      if (!popup) {
        setMsg({
          text:
            language === 'vi'
              ? 'Trình duyệt đã chặn cửa sổ đăng nhập. Hãy nhấn nút “Mở đăng nhập Google”.'
              : 'Your browser blocked the popup. Click “Open Google sign‑in”.',
          isError: true,
        });
        setConnecting(false);
      }
      window.setTimeout(() => setConnecting(false), 60000);
    } catch {
      setMsg({ text: tr.oauthError, isError: true });
      setConnecting(false);
    }
  };

  const saveOauthConfig = async () => {
    if (!oauthClientId.trim() || !oauthClientSecret.trim()) {
      setMsg({
        text: language === 'vi' ? 'Nhập Client ID và Client Secret.' : 'Enter Client ID and Client Secret.',
        isError: true,
      });
      return;
    }
    setSavingOauth(true);
    setMsg(null);
    try {
      const r = await fetch('/api/cloud_sync/oauth/google/config', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          client_id: oauthClientId.trim(),
          client_secret: oauthClientSecret.trim(),
          redirect_uri: oauthRedirectUri,
          redirect_origin: window.location.origin,
        }),
      });
      const d = await r.json();
      if (!r.ok || !d?.data?.configured) {
        const detail = d?.error?.message || d?.detail || d?.message || tr.oauthError;
        setMsg({ text: detail, isError: true });
        setSavingOauth(false);
        return;
      }
      setOauthConfigured(true);
      setOauthSetup(false);
      setOauthClientSecret('');
      setSavingOauth(false);
      await startGoogleConnect();
    } catch {
      setMsg({ text: tr.oauthError, isError: true });
      setSavingOauth(false);
    }
  };

  const connectGoogleDrive = async () => {
    if (oauthConfigured === false || oauthSetup) {
      setOauthSetup(true);
      return;
    }
    await startGoogleConnect();
  };

  const loadExplorer = async (path: string) => {
    const r = await fetch(`/api/cloud_sync/explore?path=${encodeURIComponent(path)}`, { headers: authHeaders() });
    const d = await r.json();
    setExplorerItems((d.data && d.data.data) || []);
    setExplorerPath((d.data && d.data.current_path) || path);
  };

  const savePair = async () => {
    if (!selectedAccount) return;
    const r = await fetch('/api/cloud_sync/pairs', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        pair_name: pairName.trim(),
        direction,
        local_path: localPath.trim(),
        remote_name: selectedAccount,
        remote_path: remotePath.trim(),
        sync_deletions: syncDeletions,
        transfers,
        active: true,
      }),
    });
    if (r.ok) {
      setWizardOpen(false);
      setPairName('');
      setLocalPath('');
      setRemotePath('');
      fetchPairs();
      setMainTab('tasks');
    }
  };

  const startStream = (p: PairItem) => {
    setStreamingPair(p);
    setStreamLogs([]);
    const authToken = localStorage.getItem('copanel_token') || '';
    const streamQs = authToken ? `?access_token=${encodeURIComponent(authToken)}` : '';
    const es = new EventSource(`/api/cloud_sync/stream_pair/${p.id}${streamQs}`);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStreamLogs((prev) => [...prev, { text: data.msg || event.data, isError: !!data.error }]);
        if (data.done || data.error) es.close();
      } catch {
        setStreamLogs((prev) => [...prev, { text: event.data, isError: false }]);
      }
    };
    es.onerror = () => {
      setStreamLogs((prev) => [...prev, { text: 'Connection lost.', isError: true }]);
      es.close();
    };
  };

  const selectedMeta = accounts.find((a) => a.remote_name === selectedAccount);

  return (
    <ModuleViewport className="flex min-h-0 flex-col overflow-hidden">
      <ModuleSidebarLayout
        isDark={isDark}
        mobileTitle={tr.title}
        className={isDark ? 'text-slate-100' : 'text-slate-900'}
        sidebar={
        <aside className={cn('flex h-full w-[220px] shrink-0 flex-col border-r', isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-slate-50/95')}>
          <div className={cn('flex items-center justify-between border-b px-3 py-3', isDark ? 'border-slate-800' : 'border-slate-200')}>
            <div className="flex min-w-0 items-center gap-2">
              <Icons.Cloud className="h-5 w-5 shrink-0 text-indigo-500" />
              <span className="truncate text-sm font-semibold">{tr.title}</span>
            </div>
            <button
              type="button"
              title={tr.addAccount}
              onClick={openProviderModal}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <Icons.Plus className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
            {accounts.length === 0 ? (
              <p className={cn('px-2 py-4 text-center text-[11px]', isDark ? 'text-slate-500' : 'text-slate-400')}>
                {tr.noAccounts}
                <br />
                {tr.noAccountsHint}
              </p>
            ) : (
              accounts.map((acc) => {
                const active = selectedAccount === acc.remote_name;
                return (
                  <button
                    key={acc.remote_name}
                    type="button"
                    onClick={() => setSelectedAccount(acc.remote_name)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs transition',
                      active
                        ? isDark
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-slate-900 shadow-sm'
                        : isDark
                          ? 'text-slate-300 hover:bg-slate-900/70'
                          : 'text-slate-700 hover:bg-white/80',
                    )}
                  >
                    <Icons.HardDrive className={cn('h-4 w-4 shrink-0', active ? 'text-blue-500' : 'text-slate-400')} />
                    <span className="min-w-0 flex-1 truncate font-medium">{acc.remote_name}</span>
                    {acc.connected && <Icons.CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
                  </button>
                );
              })
            )}
          </nav>
        </aside>
        }
      >
        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {selectedAccount ? (
            <>
              <div className={cn('flex shrink-0 gap-1 border-b px-4 pt-3', isDark ? 'border-slate-800' : 'border-slate-200')}>
                {(['overview', 'tasks'] as MainTab[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMainTab(id)}
                    className={cn(
                      'rounded-t-lg px-4 py-2 text-xs font-bold transition',
                      mainTab === id
                        ? isDark
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-slate-900 shadow-sm'
                        : isDark
                          ? 'text-slate-400 hover:text-slate-200'
                          : 'text-slate-500 hover:text-slate-800',
                    )}
                  >
                    {id === 'overview' ? tr.overview : tr.tasks}
                  </button>
                ))}
              </div>

              <main className={cn('min-h-0 flex-1 overflow-y-auto', windowed ? 'p-4' : 'p-4 md:p-6')}>
                {msg && (
                  <div
                    className={cn(
                      'mb-4 flex items-center gap-2 rounded-xl border p-3 text-xs',
                      msg.isError ? 'border-red-500/30 bg-red-500/10 text-red-500' : 'border-green-500/30 bg-green-500/10 text-green-600',
                    )}
                  >
                    {msg.isError ? <Icons.AlertTriangle className="h-4 w-4" /> : <Icons.CheckCircle className="h-4 w-4" />}
                    {msg.text}
                  </div>
                )}

                {mainTab === 'overview' && (
                  <div className={card}>
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                        <Icons.CheckCircle2 className="h-7 w-7 text-emerald-500" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">{tr.upToDate}</h2>
                        <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>{tr.upToDateHint}</p>
                      </div>
                    </div>
                    <dl className={cn('grid gap-3 text-sm', isDark ? 'text-slate-300' : 'text-slate-700')}>
                      <div className="flex gap-2">
                        <dt className="w-28 shrink-0 font-semibold">{tr.cloudType}</dt>
                        <dd>Google Drive</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-28 shrink-0 font-semibold">{tr.accountName}</dt>
                        <dd className="font-mono">{selectedMeta?.remote_name}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-28 shrink-0 font-semibold">Tasks</dt>
                        <dd>{accountPairs.length}</dd>
                      </div>
                    </dl>
                  </div>
                )}

                {mainTab === 'tasks' && (
                  <div className={card}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold">{tr.tasks}</h3>
                      <button
                        type="button"
                        onClick={() => setWizardOpen(true)}
                        className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                      >
                        <Icons.Plus className="mr-1 inline h-3.5 w-3.5" />
                        {tr.newTask}
                      </button>
                    </div>
                    {accountPairs.length === 0 ? (
                      <p className={cn('py-8 text-center text-sm', isDark ? 'text-slate-500' : 'text-slate-400')}>{tr.noTasks}</p>
                    ) : (
                      <div className="space-y-2">
                        {accountPairs.map((p) => (
                          <div
                            key={p.id}
                            className={cn('rounded-xl border p-4', isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50')}
                          >
                            <p className="text-sm font-bold">{p.pair_name}</p>
                            <p className={cn('mt-1 font-mono text-[11px]', isDark ? 'text-slate-400' : 'text-slate-600')}>
                              {p.direction === 'upload' ? (
                                <>
                                  <span className="text-indigo-400">{p.local_path}</span> → <span className="text-emerald-500">{p.remote_path}</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-emerald-500">{p.remote_path}</span> → <span className="text-indigo-400">{p.local_path}</span>
                                </>
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => startStream(p)}
                              className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                            >
                              <Icons.Play className="mr-1 inline h-3 w-3" />
                              {tr.runNow}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </main>
            </>
          ) : (
            <main className={cn('flex min-h-0 flex-1 flex-col items-center justify-center p-8 text-center', isDark ? 'text-slate-400' : 'text-slate-500')}>
              <Icons.CloudOff className="mb-3 h-12 w-12 opacity-50" />
              <p className="text-sm font-medium">{tr.noAccounts}</p>
              <p className="mb-4 text-xs">{tr.noAccountsHint}</p>
              <button
                type="button"
                onClick={openProviderModal}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500"
              >
                <Icons.Plus className="mr-1 inline h-4 w-4" />
                {tr.connectGoogle}
              </button>
            </main>
          )}
        </div>
      </ModuleSidebarLayout>

      {/* Provider picker — Synology-style; one-time Google API setup when needed */}
      <WindowModal
        open={providerOpen}
        onClose={() => !connecting && !savingOauth && setProviderOpen(false)}
        title={oauthSetup ? tr.oauthSetupTitle : tr.providersTitle}
        maxWidth="lg"
      >
        <div className="space-y-4 p-4">
          {oauthSetup ? (
            <>
              <p className={cn('text-xs leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-500')}>{tr.oauthSetupDesc}</p>
              <div>
                <label className={cn('mb-1 block text-xs font-bold', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  {tr.oauthRedirectUri}
                </label>
                <div className="flex gap-2">
                  <input value={oauthRedirectUri} readOnly className={cn(input, 'font-mono text-[11px]')} />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(oauthRedirectUri);
                        setMsg({ text: tr.oauthCopied, isError: false });
                      } catch {
                        /* ignore */
                      }
                    }}
                    className="shrink-0 rounded-lg border px-3 text-xs font-bold"
                  >
                    {tr.oauthCopy}
                  </button>
                </div>
              </div>
              <div>
                <label className={cn('mb-1 block text-xs font-bold', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  {tr.oauthClientId}
                </label>
                <input
                  value={oauthClientId}
                  onChange={(e) => setOauthClientId(e.target.value)}
                  className={input}
                  autoComplete="off"
                  placeholder="xxxx.apps.googleusercontent.com"
                />
              </div>
              <div>
                <label className={cn('mb-1 block text-xs font-bold', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  {tr.oauthClientSecret}
                </label>
                <input
                  type="password"
                  value={oauthClientSecret}
                  onChange={(e) => setOauthClientSecret(e.target.value)}
                  className={input}
                  autoComplete="off"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={savingOauth}
                  onClick={() => setProviderOpen(false)}
                  className={cn('rounded-lg px-3 py-2 text-xs font-bold', isDark ? 'text-slate-300' : 'text-slate-600')}
                >
                  {tr.cancel}
                </button>
                <button
                  type="button"
                  disabled={savingOauth || connecting}
                  onClick={saveOauthConfig}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {savingOauth ? <Icons.Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" /> : null}
                  {tr.oauthSave}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>{tr.providersDesc}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PROVIDERS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    disabled={connecting}
                    onClick={connectGoogleDrive}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border p-4 transition hover:border-indigo-500 hover:bg-indigo-500/5',
                      isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50',
                      connecting && 'opacity-60',
                    )}
                  >
                    <Icon className="h-10 w-10 text-blue-500" />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                ))}
              </div>
              {connecting && (
                <p className={cn('flex items-center gap-2 text-xs', isDark ? 'text-indigo-300' : 'text-indigo-600')}>
                  <Icons.Loader2 className="h-4 w-4 animate-spin" />
                  {tr.connecting}
                </p>
              )}
              {!connecting && authUrl && (
                <div className="flex items-center justify-end">
                  <a
                    href={authUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                  >
                    {language === 'vi' ? 'Mở đăng nhập Google' : 'Open Google sign‑in'}
                  </a>
                </div>
              )}
            </>
          )}
          {msg && providerOpen && (
            <p className={cn('text-xs', msg.isError ? 'text-rose-500' : 'text-emerald-600')}>{msg.text}</p>
          )}
        </div>
      </WindowModal>

      {/* Create sync task */}
      <WindowModal open={wizardOpen} onClose={() => setWizardOpen(false)} title={tr.newTask} maxWidth="xl" className="max-h-[85vh] max-w-xl">
        <div className="space-y-4 p-4">
          <div>
            <label className={cn('text-xs font-bold', isDark ? 'text-slate-400' : 'text-slate-600')}>{tr.pairName}</label>
            <input value={pairName} onChange={(e) => setPairName(e.target.value)} className={input} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['upload', 'download'] as PairDirection[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                className={cn(
                  'rounded-xl border px-3 py-2 text-xs font-bold',
                  direction === d ? 'border-indigo-500 bg-indigo-500/10' : isDark ? 'border-slate-800' : 'border-slate-300',
                )}
              >
                {d === 'upload' ? tr.upload : tr.download}
              </button>
            ))}
          </div>
          <div>
            <label className={cn('text-xs font-bold', isDark ? 'text-slate-400' : 'text-slate-600')}>{tr.localPath}</label>
            <div className="mt-1 flex gap-2">
              <input value={localPath} onChange={(e) => setLocalPath(e.target.value)} className={cn(input, 'flex-1 font-mono')} placeholder="/var/www" />
              <button type="button" onClick={() => { loadExplorer('/'); setExplorerOpen(true); }} className="rounded-lg bg-indigo-600 px-3 text-white">
                <Icons.FolderSearch className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <label className={cn('text-xs font-bold', isDark ? 'text-slate-400' : 'text-slate-600')}>{tr.remotePath}</label>
            <input value={remotePath} onChange={(e) => setRemotePath(e.target.value)} className={cn(input, 'font-mono')} placeholder="Backups/MySite" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className={cn('flex items-center justify-between rounded-xl border p-3 text-xs', isDark ? 'border-slate-800' : 'border-slate-200')}>
              {tr.syncDeletions}
              <input type="checkbox" checked={syncDeletions} onChange={(e) => setSyncDeletions(e.target.checked)} className="accent-indigo-600" />
            </label>
            <div className={cn('flex items-center justify-between rounded-xl border p-3 text-xs', isDark ? 'border-slate-800' : 'border-slate-200')}>
              {tr.transfers}
              <input
                type="number"
                min={1}
                max={32}
                value={transfers}
                onChange={(e) => setTransfers(Math.max(1, parseInt(e.target.value, 10) || 4))}
                className={cn('w-16 rounded border px-2 py-1 text-center font-mono', isDark ? 'border-slate-700 bg-slate-950' : 'border-slate-300')}
              />
            </div>
          </div>
        </div>
        <div className={cn('flex justify-end gap-2 border-t p-3', isDark ? 'border-slate-800' : 'border-slate-200')}>
          <button type="button" onClick={() => setWizardOpen(false)} className={cn('rounded-xl border px-4 py-2 text-xs font-bold', isDark ? 'border-slate-700' : 'border-slate-300')}>
            {tr.cancel}
          </button>
          <button type="button" onClick={savePair} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500">
            {tr.save}
          </button>
        </div>
      </WindowModal>

      {/* Folder explorer */}
      <WindowModal open={explorerOpen} onClose={() => setExplorerOpen(false)} title={tr.browse} maxWidth="2xl" className="flex h-[70vh] max-w-2xl flex-col overflow-hidden">
        <div className={cn('flex items-center gap-2 border-b p-2 font-mono text-xs', isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100')}>
          <button
            type="button"
            onClick={() => {
              const parts = explorerPath.replace(/\\/g, '/').split('/').filter(Boolean);
              parts.pop();
              loadExplorer('/' + parts.join('/') || '/');
            }}
            className="rounded p-1 hover:bg-slate-500/20"
          >
            <Icons.CornerLeftUp className="h-4 w-4" />
          </button>
          <span className="truncate">{explorerPath}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {explorerItems.map((it) => (
            <div
              key={it.path}
              onClick={() => it.type === 'folder' && loadExplorer(it.path)}
              className={cn('flex cursor-pointer items-center justify-between rounded-lg p-2.5', isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100')}
            >
              <div className="flex min-w-0 items-center gap-2">
                {it.type === 'folder' ? <Icons.Folder className="h-5 w-5 text-yellow-500" /> : <Icons.File className="h-5 w-5 text-slate-400" />}
                <span className="truncate text-xs">{it.name}</span>
              </div>
              {it.type === 'folder' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocalPath(it.path);
                    setExplorerOpen(false);
                  }}
                  className="rounded bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white"
                >
                  Select
                </button>
              )}
            </div>
          ))}
        </div>
      </WindowModal>

      {/* Stream log */}
      {streamingPair && (
        <WindowModal open={!!streamingPair} onClose={() => setStreamingPair(null)} title={`${tr.runNow} — ${streamingPair.pair_name}`} maxWidth="2xl">
          <div ref={streamLogsRef} className={cn('m-4 h-64 overflow-y-auto rounded-xl border p-3 font-mono text-[10px] text-green-400', isDark ? 'border-slate-800 bg-slate-950' : 'bg-slate-900')}>
            {streamLogs.map((log, i) => (
              <div key={i} className={log.isError ? 'text-red-400' : ''}>
                {log.text}
              </div>
            ))}
          </div>
        </WindowModal>
      )}
    </ModuleViewport>
  );
}
