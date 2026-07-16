import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppShellContext } from '../../../copanel/frontend/src/core/hooks/useAppShellContext';
import { useIsWindowedModule } from '../../../copanel/frontend/src/core/shell/WindowViewportContext';
import ModuleViewport from '../../../copanel/frontend/src/core/shell/ModuleViewport';
import WindowModal from '../../../copanel/frontend/src/core/shell/WindowModal';
import * as Icons from 'lucide-react';

type PairDirection = 'upload' | 'download';

interface RemoteInfo { name: string; type: string }
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

type TabId = 'pairs' | 'remotes' | 'cloud_setup';

export default function CloudSync() {
  const { theme, language } = useAppShellContext();
  const isDark = theme === 'dark';
  const windowed = useIsWindowedModule();

  const [tab, setTab] = useState<TabId>('pairs');
  const [pairs, setPairs] = useState<PairItem[]>([]);
  const [remotes, setRemotes] = useState<RemoteInfo[]>([]);
  const [remotesConfigPath, setRemotesConfigPath] = useState('');
  const [streamingPair, setStreamingPair] = useState<PairItem | null>(null);
  const [streamLogs, setStreamLogs] = useState<{ text: string; isError: boolean }[]>([]);
  const streamLogsRef = useRef<HTMLDivElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('copanel_token') : null;

  const authHeaders = useCallback(() => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json' }), [token]);

  const t = useMemo(() => ({
    en: {
      title: 'Cloud Sync',
      subtitle: 'Google Drive connections and folder sync pairs',
      pairs: 'Sync Pairs',
      remotes: 'Cloud Remotes',
      cloudSetup: 'Cloud Setup',
      newPair: 'Create Sync Pair',
      runNow: 'Run Now',
      pairName: 'Pair name',
      direction: 'Direction',
      upload: 'Upload (local → cloud)',
      download: 'Download (cloud → local)',
      localPath: 'Local folder',
      remote: 'Remote',
      remotePath: 'Remote path',
      syncDeletions: 'Sync deletions',
      transfers: 'Parallel transfers',
      save: 'Save',
      cancel: 'Cancel',
      browse: 'Browse',
      configFile: 'Detected config file',
      noRemotes: 'No rclone remotes detected.',
      noRemotesHint: 'Open Cloud Setup to connect Google Drive.',
      startOAuth: 'Connect Google Drive',
      oauthRemote: 'Remote Name',
      oauthClientId: 'Google OAuth Client ID',
      oauthClientSecret: 'Google OAuth Client Secret',
      oauthRedirect: 'Authorized Redirect URI',
    },
    vi: {
      title: 'Cloud Sync',
      subtitle: 'Kết nối Google Drive và thiết lập cặp đồng bộ',
      pairs: 'Cặp đồng bộ',
      remotes: 'Cloud Remotes',
      cloudSetup: 'Cloud Setup',
      newPair: 'Tạo cặp đồng bộ',
      runNow: 'Chạy ngay',
      pairName: 'Tên cặp',
      direction: 'Chiều đồng bộ',
      upload: 'Upload (máy chủ → cloud)',
      download: 'Download (cloud → máy chủ)',
      localPath: 'Thư mục máy chủ',
      remote: 'Remote',
      remotePath: 'Đường dẫn cloud',
      syncDeletions: 'Đồng bộ xoá',
      transfers: 'Luồng song song',
      save: 'Lưu',
      cancel: 'Hủy',
      browse: 'Duyệt',
      configFile: 'File cấu hình phát hiện',
      noRemotes: 'Không có rclone remote nào.',
      noRemotesHint: 'Mở Cloud Setup để kết nối Google Drive.',
      startOAuth: 'Kết nối Google Drive',
      oauthRemote: 'Remote Name',
      oauthClientId: 'Google OAuth Client ID',
      oauthClientSecret: 'Google OAuth Client Secret',
      oauthRedirect: 'Authorized Redirect URI',
    }
  }), [language]);
  const tr = t[language === 'vi' ? 'vi' : 'en'];

  // UI classes
  const input = `w-full px-3 py-2.5 rounded-lg border text-sm focus:border-indigo-500 outline-none transition ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'}`;
  const card = `border p-5 rounded-2xl shadow-sm ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`;

  // Data loaders
  const fetchPairs = async () => {
    const r = await fetch('/api/cloud_sync/pairs', { headers: authHeaders() });
    const d = await r.json();
    setPairs(d.data || []);
  };
  const fetchRemotes = async () => {
    const r = await fetch('/api/cloud_sync/remotes', { headers: authHeaders() });
    const d = await r.json();
    setRemotes((d.data && d.data.data) || []);
    setRemotesConfigPath((d.data && d.data.config_path) || '');
  };
  useEffect(() => {
    fetchPairs();
    fetchRemotes();
  }, []);

  useEffect(() => {
    if (streamLogsRef.current) {
      streamLogsRef.current.scrollTop = streamLogsRef.current.scrollHeight;
    }
  }, [streamLogs]);

  // Create Pair modal
  const [wizardOpen, setWizardOpen] = useState(false);
  const [pairName, setPairName] = useState('');
  const [direction, setDirection] = useState<PairDirection>('upload');
  const [localPath, setLocalPath] = useState('');
  const [remoteName, setRemoteName] = useState('');
  const [remotePath, setRemotePath] = useState('');
  const [syncDeletions, setSyncDeletions] = useState(true);
  const [transfers, setTransfers] = useState(4);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [explorerPath, setExplorerPath] = useState('/');
  const [explorerItems, setExplorerItems] = useState<{ name: string; path: string; type: string }[]>([]);

  const loadExplorer = async (path: string) => {
    const r = await fetch(`/api/cloud_sync/explore?path=${encodeURIComponent(path)}`, { headers: authHeaders() });
    const d = await r.json();
    setExplorerItems((d.data && d.data.data) || []);
    setExplorerPath((d.data && d.data.current_path) || path);
  };

  const savePair = async () => {
    const body = {
      pair_name: pairName.trim(),
      direction,
      local_path: localPath.trim(),
      remote_name: remoteName.trim(),
      remote_path: remotePath.trim(),
      sync_deletions: syncDeletions,
      transfers,
      active: true,
    };
    const r = await fetch('/api/cloud_sync/pairs', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
    if (r.ok) {
      setWizardOpen(false);
      setPairName('');
      setLocalPath('');
      setRemoteName('');
      setRemotePath('');
      fetchPairs();
    }
  };

  const startStream = (p: PairItem) => {
    setStreamingPair(p);
    setStreamLogs([]);
    const es = new EventSource(`/api/cloud_sync/stream_pair/${p.id}`);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStreamLogs((prev) => [...prev, { text: data.msg || event.data, isError: !!data.error }]);
        if (data.done || data.error) {
          es.close();
        }
      } catch {
        setStreamLogs((prev) => [...prev, { text: event.data, isError: false }]);
      }
    };
    es.onerror = () => {
      setStreamLogs((prev) => [...prev, { text: 'Connection lost.', isError: true }]);
      es.close();
    };
  };

  const Sidebar = () => (
    <aside className={`flex w-[248px] shrink-0 flex-col border-r ${isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-slate-50/95'}`}>
      <div className={`${isDark ? 'border-slate-800' : 'border-slate-200'} border-b px-5 py-4`}>
        <div className="flex items-center gap-3">
          <div className={`${isDark ? 'bg-slate-800' : 'border border-slate-200 bg-white shadow-sm'} flex h-10 w-10 items-center justify-center rounded-lg`}>
            <Icons.Cloud className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="min-w-0">
            <h1 className={`${isDark ? 'text-slate-100' : 'text-slate-900'} truncate text-base font-semibold`}>{tr.title}</h1>
            <p className={`${isDark ? 'text-slate-500' : 'text-slate-500'} line-clamp-2 text-[11px] leading-snug`}>{tr.subtitle}</p>
          </div>
        </div>
      </div>
      {(['pairs', 'remotes', 'cloud_setup'] as TabId[]).map((id) => {
        const active = tab === id;
        const map: Record<TabId, string> = { pairs: tr.pairs, remotes: tr.remotes, cloud_setup: tr.cloudSetup };
        const Icon = id === 'pairs' ? Icons.ArrowLeftRight : id === 'remotes' ? Icons.Cloud : Icons.Settings;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex w-full items-center gap-3 rounded-md border-l-2 py-2.5 pl-[10px] pr-3 text-left text-sm transition-colors ${
              active
                ? isDark
                  ? 'border-indigo-500 bg-slate-800 text-white'
                  : 'border-indigo-600 bg-white text-slate-900 shadow-sm'
                : isDark
                  ? 'border-transparent text-slate-300 hover:bg-slate-900/70'
                  : 'border-transparent text-slate-700 hover:bg-white/90'
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-indigo-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className="flex-1 truncate font-medium">{map[id]}</span>
          </button>
        );
      })}
    </aside>
  );

  const renderPairs = () => (
    <div className={card}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`${isDark ? 'text-slate-100' : 'text-slate-900'} text-sm font-bold`}>{tr.pairs}</h3>
        <button type="button" onClick={() => setWizardOpen(true)} className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500">
          <Icons.Plus className="mr-1 inline h-4 w-4" />
          {tr.newPair}
        </button>
      </div>
      {pairs.length === 0 ? (
        <div className={`${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'} rounded-xl border-2 border-dashed p-10 text-center`}>
          <Icons.ArrowLeftRight className="mx-auto mb-2 h-10 w-10 opacity-60" />
          <p className="text-sm">No pairs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pairs.map((p) => (
            <div key={p.id} className={`${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-xl border p-4`}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={`${isDark ? 'text-slate-100' : 'text-slate-900'} truncate text-sm font-bold`}>{p.pair_name}</p>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-[11px] font-mono`}>
                    {p.direction === 'upload' ? (
                      <>
                        <span className="text-indigo-400">{p.local_path}</span> → <span className="text-emerald-500">{p.remote_name}:{p.remote_path}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-emerald-500">{p.remote_name}:{p.remote_path}</span> → <span className="text-indigo-400">{p.local_path}</span>
                      </>
                    )}
                  </p>
                </div>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${p.active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>{p.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center gap-2 pt-3">
                <button onClick={() => startStream(p)} className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500">
                  <Icons.Play className="mr-1 inline h-3.5 w-3.5" /> {tr.runNow}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRemotes = () => (
    <div className={card}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`${isDark ? 'text-slate-100' : 'text-slate-900'} text-sm font-bold`}>{tr.remotes}</h3>
        <button type="button" onClick={fetchRemotes} className={`${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'} rounded-lg border px-3 py-1.5 text-xs font-bold`}>
          <Icons.RefreshCw className="mr-1 inline h-3.5 w-3.5" /> Refresh
        </button>
      </div>
      {remotesConfigPath && <p className={`${isDark ? 'text-slate-600' : 'text-slate-400'} mb-2 text-[10px] font-mono`}>{tr.configFile}: {remotesConfigPath}</p>}
      {remotes.length === 0 ? (
        <div className={`${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'} rounded-xl border-2 border-dashed p-8 text-center`}>
          <p className="text-sm font-medium">{tr.noRemotes}</p>
          <p className="text-xs">{tr.noRemotesHint}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {remotes.map((r) => (
            <div key={r.name} className={`${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-lg border p-3`}>
              <div className="flex items-center gap-2">
                <Icons.Cloud className="h-4 w-4 text-indigo-500" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <p className="text-[10px] text-slate-500">type: {r.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const [oauthForm, setOauthForm] = useState({ remote_name: '', client_id: '', client_secret: '', redirect_uri: `${window.location.origin}/api/cloud_sync/oauth/google/callback` });
  const [oauthLoading, setOauthLoading] = useState(false);
  const [manualTokenJson, setManualTokenJson] = useState('');
  const [copyCmdLoading, setCopyCmdLoading] = useState(false);
  const startOAuth = async () => {
    setOauthLoading(true);
    const r = await fetch('/api/cloud_sync/oauth/google/start', { method: 'POST', headers: authHeaders(), body: JSON.stringify(oauthForm) });
    const d = await r.json();
    setOauthLoading(false);
    const url = d.data?.auth_url;
    if (url) window.open(url, '_blank', 'width=640,height=760');
  };
  const copyRcloneAuthorize = async () => {
    const cmd = `rclone authorize "drive" "${oauthForm.client_id.trim() || 'YOUR_CLIENT_ID'}" "${oauthForm.client_secret.trim() || 'YOUR_CLIENT_SECRET'}"`;
    setCopyCmdLoading(true);
    await navigator.clipboard.writeText(cmd);
    setCopyCmdLoading(false);
  };
  const applyManual = async () => {
    await fetch('/api/cloud_sync/oauth/google/manual-token', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ remote_name: oauthForm.remote_name, token_json: manualTokenJson, client_id: oauthForm.client_id, client_secret: oauthForm.client_secret, redirect_uri: oauthForm.redirect_uri })
    });
    fetchRemotes();
  };

  const renderCloudSetup = () => (
    <div className={card}>
      <div className="space-y-3">
        <input value={oauthForm.remote_name} onChange={(e) => setOauthForm({ ...oauthForm, remote_name: e.target.value })} placeholder={tr.oauthRemote} className={input} />
        <input value={oauthForm.client_id} onChange={(e) => setOauthForm({ ...oauthForm, client_id: e.target.value })} placeholder={tr.oauthClientId} className={input} />
        <input type="password" value={oauthForm.client_secret} onChange={(e) => setOauthForm({ ...oauthForm, client_secret: e.target.value })} placeholder={tr.oauthClientSecret} className={input} />
        <input value={oauthForm.redirect_uri} onChange={(e) => setOauthForm({ ...oauthForm, redirect_uri: e.target.value })} placeholder={tr.oauthRedirect} className={input} />
        <div className="flex gap-2">
          <button type="button" onClick={startOAuth} disabled={oauthLoading} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-60">
            <Icons.Link className="mr-1 inline h-4 w-4" /> {tr.startOAuth}
          </button>
          <button type="button" onClick={copyRcloneAuthorize} disabled={copyCmdLoading} className={`${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'} rounded-xl border px-3 py-2 text-xs font-bold`}>
            {copyCmdLoading ? 'Copying…' : 'Copy command'}
          </button>
        </div>
        <textarea value={manualTokenJson} onChange={(e) => setManualTokenJson(e.target.value)} placeholder='{"access_token":"...","refresh_token":"...","token_type":"Bearer","expiry":"2026-05-06T10:00:00Z"}' rows={5} className={`${input} font-mono text-[11px]`} />
        <div className="flex justify-end">
          <button type="button" onClick={applyManual} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500">Apply Manual Token</button>
        </div>
      </div>
    </div>
  );

  // Explorer modal
  const Explorer = () => {
    const parentPath = (() => {
      const parts = explorerPath.replace(/\\/g, '/').split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/') || '/';
    })();
    return (
      <WindowModal open={explorerOpen} onClose={() => setExplorerOpen(false)} title={tr.browse} maxWidth="2xl" className="flex h-[70vh] max-w-2xl flex-col overflow-hidden">
        <div className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} flex items-center justify-between border-b p-2 text-xs font-mono`}>
          <button onClick={() => loadExplorer(parentPath)} className="rounded p-1 hover:bg-slate-500/20" title="Up"><Icons.CornerLeftUp className="h-4 w-4" /></button>
          <span className="truncate">{explorerPath}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {explorerItems.map((it) => (
            <div key={it.path} onClick={() => it.type === 'folder' && loadExplorer(it.path)} className={`${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} flex cursor-pointer items-center justify-between rounded-lg p-2.5`}>
              <div className="flex min-w-0 items-center gap-3">
                {it.type === 'folder' ? <Icons.Folder className="h-5 w-5 text-yellow-500" /> : <Icons.File className="h-5 w-5 text-slate-400" />}
                <span className="truncate text-xs font-medium">{it.name}</span>
              </div>
              {it.type === 'folder' && (
                <button onClick={(e) => { e.stopPropagation(); setLocalPath(it.path); setExplorerOpen(false); }} className="rounded bg-indigo-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-indigo-500">Select</button>
              )}
            </div>
          ))}
        </div>
      </WindowModal>
    );
  };

  const CreatePairModal = () => (
    <WindowModal open={wizardOpen} onClose={() => setWizardOpen(false)} title={tr.newPair} maxWidth="xl" className="max-h-[85vh] max-w-xl">
      <div className="space-y-4 p-4">
        <div className="space-y-1">
          <label className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs font-bold`}>{tr.pairName}</label>
          <input value={pairName} onChange={(e) => setPairName(e.target.value)} className={input} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['upload', 'download'] as PairDirection[]).map((d) => (
            <button key={d} type="button" onClick={() => setDirection(d)} className={`rounded-xl border px-3 py-2 text-xs font-bold ${direction === d ? 'border-indigo-500 bg-indigo-500/10' : isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}>
              {d === 'upload' ? tr.upload : tr.download}
            </button>
          ))}
        </div>
        <div className="space-y-1">
          <label className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs font-bold`}>{tr.localPath}</label>
          <div className="flex gap-2">
            <input value={localPath} onChange={(e) => setLocalPath(e.target.value)} placeholder="/var/www" className={`${input} font-mono flex-1`} />
            <button type="button" onClick={() => { loadExplorer('/'); setExplorerOpen(true); }} className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500">
              <Icons.FolderSearch className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs font-bold`}>{tr.remote}</label>
          <select value={remoteName} onChange={(e) => setRemoteName(e.target.value)} className={input}>
            <option value="">-- Select Remote --</option>
            {remotes.map((r) => <option key={r.name} value={r.name}>{r.name} ({r.type})</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs font-bold`}>{tr.remotePath}</label>
          <input value={remotePath} onChange={(e) => setRemotePath(e.target.value)} placeholder="Backups/SiteA" className={`${input} font-mono`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className={`${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'} flex items-center justify-between rounded-xl border p-3 text-xs`}>
            <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{tr.syncDeletions}</span>
            <input type="checkbox" checked={syncDeletions} onChange={(e) => setSyncDeletions(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
          </label>
          <div className={`${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'} flex items-center justify-between rounded-xl border p-3 text-xs`}>
            <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{tr.transfers}</span>
            <input type="number" min={1} max={32} value={transfers} onChange={(e) => setTransfers(Math.max(1, parseInt(e.target.value) || 4))} className={`${isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'} w-20 rounded-lg border px-2 py-1 text-center font-mono outline-none focus:border-indigo-500`} />
          </div>
        </div>
      </div>
      <div className={`${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'} flex justify-end gap-2 border-t p-3`}>
        <button onClick={() => setWizardOpen(false)} className={`${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'} rounded-xl border px-4 py-2 text-xs font-bold`}>{tr.cancel}</button>
        <button onClick={savePair} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500">{tr.save}</button>
      </div>
    </WindowModal>
  );

  const StreamModal = () => {
    if (!streamingPair) return null;
    return (
      <WindowModal open={!!streamingPair} onClose={() => setStreamingPair(null)} title={`${tr.runNow} — ${streamingPair.pair_name}`} maxWidth="2xl" className="max-h-[85vh] max-w-2xl">
        <div className="space-y-3 p-4">
          <div ref={streamLogsRef} className={`${isDark ? 'bg-slate-950 text-green-400 border-slate-800' : 'bg-slate-900 text-green-400 border-slate-800'} h-64 overflow-y-auto rounded-xl border p-3 font-mono text-[10px]`}>
            {streamLogs.map((log, i) => (<div key={i} className={log.isError ? 'text-red-400' : ''}>{log.text}</div>))}
          </div>
        </div>
      </WindowModal>
    );
  };

  return (
    <ModuleViewport className="flex min-h-0 flex-col overflow-hidden">
      <div className={`${isDark ? 'text-slate-100' : 'text-slate-900'} flex h-full min-h-0`}>
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className={`min-h-0 flex-1 overflow-y-auto ${windowed ? 'p-5' : 'p-5 md:p-8'}`}>
            {tab === 'pairs' && renderPairs()}
            {tab === 'remotes' && renderRemotes()}
            {tab === 'cloud_setup' && renderCloudSetup()}
          </main>
        </div>
      </div>
      <CreatePairModal />
      <Explorer />
      <StreamModal />
    </ModuleViewport>
  );
}

