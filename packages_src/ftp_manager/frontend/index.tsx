/**
 * FTP / SFTP Manager — AppStore module (Classic + Desktop Dual UI).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppShellContext } from '../../core/hooks/useAppShellContext';
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
import { api } from '../../core/platform';
import { TEXT, type Lang } from './i18n';

type Protocol = 'ftp' | 'ftps' | 'sftp';
type AuthType = 'password' | 'key_path' | 'key_blob';

type Connection = {
  id: number;
  label: string;
  protocol: Protocol;
  host: string;
  port: number;
  username: string;
  auth_type: AuthType;
  remote_root: string;
  passive: boolean;
  timeout: number;
  password_set: boolean;
  key_set: boolean;
};

type RemoteItem = {
  name: string;
  path: string;
  is_dir: boolean;
  size: number;
  modified: number;
};

type FormState = {
  label: string;
  protocol: Protocol;
  host: string;
  port: string;
  username: string;
  auth_type: AuthType;
  password: string;
  key_path: string;
  key_blob: string;
  remote_root: string;
  passive: boolean;
  timeout: string;
};

const emptyForm = (): FormState => ({
  label: '',
  protocol: 'sftp',
  host: '',
  port: '22',
  username: '',
  auth_type: 'password',
  password: '',
  key_path: '',
  key_blob: '',
  remote_root: '/',
  passive: true,
  timeout: '30',
});

function formFromConn(c: Connection): FormState {
  return {
    label: c.label,
    protocol: c.protocol,
    host: c.host,
    port: String(c.port),
    username: c.username,
    auth_type: c.auth_type || 'password',
    password: '',
    key_path: '',
    key_blob: '',
    remote_root: c.remote_root || '/',
    passive: c.passive,
    timeout: String(c.timeout || 30),
  };
}

function defaultPort(protocol: Protocol): string {
  return protocol === 'sftp' ? '22' : '21';
}

function formatBytes(n: number): string {
  if (!n) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatTime(ts: number): string {
  if (!ts) return '—';
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return '—';
  }
}

export default function FtpManager() {
  const { theme, language } = useAppShellContext();
  const isDark = theme === 'dark';
  const lang: Lang = language === 'vi' ? 'vi' : 'en';
  const tr = TEXT[lang];

  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [remotePath, setRemotePath] = useState('/');
  const [items, setItems] = useState<RemoteItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RemoteItem | null>(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingBrowse, setLoadingBrowse] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const [transferOpen, setTransferOpen] = useState(false);
  const [transferDir, setTransferDir] = useState<'download' | 'upload'>('download');
  const [localPath, setLocalPath] = useState('/tmp');
  const [overwrite, setOverwrite] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmKind, setConfirmKind] = useState<'connection' | 'item'>('connection');

  const selected = useMemo(
    () => connections.find((c) => c.id === selectedId) || null,
    [connections, selectedId],
  );

  const loadConnections = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const data = await api<Connection[]>('/api/ftp_manager/connections');
      setConnections(Array.isArray(data) ? data : []);
      if (selectedId == null && Array.isArray(data) && data.length > 0) {
        setSelectedId(data[0].id);
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoadingList(false);
    }
  }, [selectedId]);

  const browse = useCallback(
    async (connId: number, path: string) => {
      setLoadingBrowse(true);
      setError(null);
      setSelectedItem(null);
      try {
        const data = await api<{ path: string; items: RemoteItem[] }>(
          `/api/ftp_manager/connections/${connId}/list?path=${encodeURIComponent(path)}`,
        );
        setRemotePath(data.path || path || '/');
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e: any) {
        setError(e?.message || String(e));
        setItems([]);
      } finally {
        setLoadingBrowse(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadConnections();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedId != null) {
      const root = connections.find((c) => c.id === selectedId)?.remote_root || '/';
      browse(selectedId, root);
    } else {
      setItems([]);
      setRemotePath('/');
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const crumbs = useMemo(() => {
    const parts = remotePath.split('/').filter(Boolean);
    const out: { label: string; path: string }[] = [{ label: '/', path: '/' }];
    let acc = '';
    for (const p of parts) {
      acc += `/${p}`;
      out.push({ label: p, path: acc });
    }
    return out;
  }, [remotePath]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setEditorOpen(true);
    setMsg(null);
    setError(null);
  };

  const openEdit = (c: Connection) => {
    setEditingId(c.id);
    setForm(formFromConn(c));
    setEditorOpen(true);
    setMsg(null);
    setError(null);
  };

  const onProtocolChange = (protocol: Protocol) => {
    setForm((f) => ({
      ...f,
      protocol,
      port: f.port === '21' || f.port === '22' || !f.port ? defaultPort(protocol) : f.port,
      auth_type: protocol === 'sftp' ? f.auth_type : 'password',
    }));
  };

  const saveConnection = async () => {
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      const payload: Record<string, unknown> = {
        label: form.label.trim(),
        protocol: form.protocol,
        host: form.host.trim(),
        port: Number(form.port) || 0,
        username: form.username.trim(),
        auth_type: form.auth_type,
        remote_root: form.remote_root.trim() || '/',
        passive: form.passive,
        timeout: Number(form.timeout) || 30,
      };
      if (form.password) payload.password = form.password;
      if (form.auth_type === 'key_path' && form.key_path) payload.key_path = form.key_path;
      if (form.auth_type === 'key_blob' && form.key_blob) payload.key_blob = form.key_blob;

      if (editingId == null) {
        const created = await api<Connection>('/api/ftp_manager/connections', {
          method: 'POST',
          body: payload,
        });
        setSelectedId(created.id);
      } else {
        await api(`/api/ftp_manager/connections/${editingId}`, {
          method: 'PATCH',
          body: payload,
        });
      }
      setEditorOpen(false);
      await loadConnections();
      setMsg(tr.save);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const testConnection = async (id?: number) => {
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      if (id != null) {
        await api(`/api/ftp_manager/connections/${id}/test`, { method: 'POST', body: {} });
      } else {
        await api('/api/ftp_manager/connections/test', {
          method: 'POST',
          body: {
            protocol: form.protocol,
            host: form.host.trim(),
            port: Number(form.port) || 0,
            username: form.username.trim(),
            auth_type: form.auth_type,
            password: form.password || undefined,
            key_path: form.key_path || undefined,
            key_blob: form.key_blob || undefined,
            remote_root: form.remote_root || '/',
            passive: form.passive,
            timeout: Number(form.timeout) || 30,
          },
        });
      }
      setMsg(tr.testOk);
    } catch (e: any) {
      setError(e?.message || tr.testFail);
    } finally {
      setBusy(false);
    }
  };

  const doDeleteConnection = async () => {
    if (selectedId == null) return;
    setBusy(true);
    try {
      await api(`/api/ftp_manager/connections/${selectedId}`, { method: 'DELETE' });
      setSelectedId(null);
      setConfirmOpen(false);
      await loadConnections();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const doMkdir = async () => {
    if (selectedId == null) return;
    const name = window.prompt(tr.namePrompt);
    if (!name || !name.trim()) return;
    const path = remotePath.replace(/\/$/, '') + '/' + name.trim();
    setBusy(true);
    try {
      await api(`/api/ftp_manager/connections/${selectedId}/mkdir`, {
        method: 'POST',
        body: { path },
      });
      await browse(selectedId, remotePath);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const doRename = async () => {
    if (selectedId == null || !selectedItem) return;
    const name = window.prompt(tr.renamePrompt, selectedItem.name);
    if (!name || !name.trim() || name.trim() === selectedItem.name) return;
    setBusy(true);
    try {
      await api(`/api/ftp_manager/connections/${selectedId}/rename`, {
        method: 'POST',
        body: { path: selectedItem.path, new_name: name.trim() },
      });
      await browse(selectedId, remotePath);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const doDeleteItem = async () => {
    if (selectedId == null || !selectedItem) return;
    setBusy(true);
    try {
      await api(`/api/ftp_manager/connections/${selectedId}/delete`, {
        method: 'POST',
        body: { path: selectedItem.path, recursive: selectedItem.is_dir },
      });
      setConfirmOpen(false);
      setSelectedItem(null);
      await browse(selectedId, remotePath);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const startTransfer = async () => {
    if (selectedId == null) return;
    const remote = selectedItem?.path || remotePath;
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      const data = await api<{ job_id: string }>('/api/ftp_manager/transfer_job', {
        method: 'POST',
        body: {
          connection_id: selectedId,
          direction: transferDir,
          remote_path: remote,
          local_path: localPath.trim(),
          overwrite,
        },
      });
      setTransferOpen(false);
      setMsg(`${tr.jobQueued}: ${data.job_id}`);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const fieldClass = cn(
    'w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500/40',
    isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100' : 'border-zinc-300 bg-white text-zinc-900',
  );
  const btnPrimary = cn(
    'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white',
    'bg-sky-600 hover:bg-sky-500 disabled:opacity-50',
  );
  const btnGhost = cn(
    'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium border',
    isDark
      ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
      : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100',
  );

  const sidebar = (
    <aside className={cn(chromeSidebar, 'flex h-full min-h-0 flex-col')}>
      <div className={chromeSidebarHeader}>
        <div className={chromeSidebarIconBox}>
          <Icons.Server className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className={chromeSidebarTitle}>{tr.title}</div>
          <div className={chromeSidebarSubtitle}>{tr.subtitle}</div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 pb-2">
        <span className="text-xs font-medium uppercase tracking-wide opacity-60">{tr.connections}</span>
        <button type="button" className={btnGhost + ' !px-2 !py-1 text-xs'} onClick={openCreate}>
          <Icons.Plus className="h-3.5 w-3.5" />
          {tr.add}
        </button>
      </div>
      <nav className={cn(chromeSidebarNav, 'min-h-0 flex-1 overflow-y-auto')}>
        {loadingList && (
          <div className="px-3 py-2 text-sm opacity-60">{tr.connecting}</div>
        )}
        {!loadingList && connections.length === 0 && (
          <div className="px-3 py-2 text-sm opacity-60">{tr.empty}</div>
        )}
        {connections.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              type="button"
              className={cn(chromeNavItem, active && 'bg-sky-500/15 text-sky-500')}
              onClick={() => setSelectedId(c.id)}
            >
              <Icons.HardDrive className={chromeNavIcon} />
              <span className="min-w-0 flex-1 truncate text-left">
                <span className="block truncate font-medium">{c.label}</span>
                <span className="block truncate text-xs opacity-60">
                  {c.protocol.toUpperCase()} · {c.host}:{c.port}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <ModuleViewport constrained className="overflow-hidden">
      <div className={cn('flex h-full min-h-0 flex-col', isDark ? 'text-zinc-100' : 'text-zinc-900')}>
        <ModuleSidebarLayout sidebar={sidebar} className="min-h-0 flex-1">
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <header
              className={cn(
                'flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-3',
                isDark ? 'border-zinc-800' : 'border-zinc-200',
              )}
            >
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-semibold">
                  {selected ? selected.label : tr.selectConnection}
                </h1>
                {selected && (
                  <p className="truncate text-xs opacity-60">
                    {selected.protocol.toUpperCase()}://{selected.username}@{selected.host}:{selected.port}
                  </p>
                )}
              </div>
              {selected && (
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={btnGhost} disabled={busy} onClick={() => testConnection(selected.id)}>
                    <Icons.ShieldCheck className="h-4 w-4" />
                    {busy ? tr.testing : tr.test}
                  </button>
                  <button type="button" className={btnGhost} onClick={() => openEdit(selected)}>
                    <Icons.Pencil className="h-4 w-4" />
                    {tr.edit}
                  </button>
                  <button
                    type="button"
                    className={btnGhost}
                    onClick={() => {
                      setConfirmKind('connection');
                      setConfirmOpen(true);
                    }}
                  >
                    <Icons.Trash2 className="h-4 w-4" />
                    {tr.delete}
                  </button>
                </div>
              )}
            </header>

            {(error || msg) && (
              <div
                className={cn(
                  'shrink-0 px-4 py-2 text-sm',
                  error
                    ? isDark
                      ? 'bg-red-950/40 text-red-300'
                      : 'bg-red-50 text-red-700'
                    : isDark
                      ? 'bg-emerald-950/40 text-emerald-300'
                      : 'bg-emerald-50 text-emerald-700',
                )}
              >
                {error || msg}
              </div>
            )}

            {!selected ? (
              <div className="flex flex-1 items-center justify-center p-8 text-sm opacity-60">{tr.empty}</div>
            ) : (
              <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div
                  className={cn(
                    'flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-2',
                    isDark ? 'border-zinc-800' : 'border-zinc-200',
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-sm">
                    {crumbs.map((c, i) => (
                      <span key={c.path} className="inline-flex items-center gap-1">
                        {i > 0 && <Icons.ChevronRight className="h-3.5 w-3.5 opacity-40" />}
                        <button
                          type="button"
                          className="truncate hover:text-sky-500"
                          onClick={() => browse(selected.id, c.path)}
                        >
                          {c.label}
                        </button>
                      </span>
                    ))}
                  </div>
                  <button type="button" className={btnGhost} disabled={loadingBrowse} onClick={() => browse(selected.id, remotePath)}>
                    <Icons.RefreshCw className={cn('h-4 w-4', loadingBrowse && 'animate-spin')} />
                    {tr.refresh}
                  </button>
                  <button type="button" className={btnGhost} onClick={doMkdir}>
                    <Icons.FolderPlus className="h-4 w-4" />
                    {tr.mkdir}
                  </button>
                  <button
                    type="button"
                    className={btnGhost}
                    disabled={!selectedItem}
                    onClick={doRename}
                  >
                    <Icons.TextCursorInput className="h-4 w-4" />
                    {tr.rename}
                  </button>
                  <button
                    type="button"
                    className={btnGhost}
                    disabled={!selectedItem}
                    onClick={() => {
                      setConfirmKind('item');
                      setConfirmOpen(true);
                    }}
                  >
                    <Icons.Trash2 className="h-4 w-4" />
                    {tr.deleteItem}
                  </button>
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => {
                      setTransferDir('download');
                      setLocalPath('/tmp');
                      setTransferOpen(true);
                    }}
                  >
                    <Icons.Download className="h-4 w-4" />
                    {tr.download}
                  </button>
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => {
                      setTransferDir('upload');
                      setLocalPath('/tmp');
                      setTransferOpen(true);
                    }}
                  >
                    <Icons.Upload className="h-4 w-4" />
                    {tr.upload}
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  <table className="w-full text-left text-sm">
                    <thead
                      className={cn(
                        'sticky top-0 z-10 border-b text-xs uppercase tracking-wide opacity-70',
                        isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50',
                      )}
                    >
                      <tr>
                        <th className="px-4 py-2 font-medium">{tr.name}</th>
                        <th className="px-4 py-2 font-medium">{tr.type}</th>
                        <th className="px-4 py-2 font-medium">{tr.size}</th>
                        <th className="px-4 py-2 font-medium">{tr.modified}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {remotePath !== '/' && (
                        <tr
                          className={cn(
                            'cursor-pointer border-b',
                            isDark ? 'border-zinc-800/80 hover:bg-zinc-900' : 'border-zinc-100 hover:bg-zinc-50',
                          )}
                          onDoubleClick={() => {
                            const parent = remotePath.replace(/\/+$/, '').split('/').slice(0, -1).join('/') || '/';
                            browse(selected.id, parent);
                          }}
                        >
                          <td className="px-4 py-2" colSpan={4}>
                            <span className="inline-flex items-center gap-2">
                              <Icons.CornerLeftUp className="h-4 w-4 opacity-60" />
                              ..
                            </span>
                          </td>
                        </tr>
                      )}
                      {!loadingBrowse && items.length === 0 && (
                        <tr>
                          <td className="px-4 py-8 text-center opacity-60" colSpan={4}>
                            {tr.noItems}
                          </td>
                        </tr>
                      )}
                      {items.map((item) => {
                        const active = selectedItem?.path === item.path;
                        return (
                          <tr
                            key={item.path}
                            className={cn(
                              'cursor-pointer border-b',
                              isDark ? 'border-zinc-800/80' : 'border-zinc-100',
                              active
                                ? 'bg-sky-500/15'
                                : isDark
                                  ? 'hover:bg-zinc-900'
                                  : 'hover:bg-zinc-50',
                            )}
                            onClick={() => setSelectedItem(item)}
                            onDoubleClick={() => {
                              if (item.is_dir) browse(selected.id, item.path);
                            }}
                          >
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center gap-2">
                                {item.is_dir ? (
                                  <Icons.Folder className="h-4 w-4 text-amber-500" />
                                ) : (
                                  <Icons.File className="h-4 w-4 opacity-60" />
                                )}
                                {item.name}
                              </span>
                            </td>
                            <td className="px-4 py-2 opacity-70">{item.is_dir ? tr.folder : tr.file}</td>
                            <td className="px-4 py-2 opacity-70">{item.is_dir ? '—' : formatBytes(item.size)}</td>
                            <td className="px-4 py-2 opacity-70">{formatTime(item.modified)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div
                  className={cn(
                    'flex shrink-0 items-center justify-between gap-2 border-t px-4 py-2 text-xs',
                    isDark ? 'border-zinc-800 opacity-70' : 'border-zinc-200 opacity-70',
                  )}
                >
                  <span>
                    {tr.path}: {remotePath}
                    {selectedItem ? ` · ${selectedItem.name}` : ''}
                  </span>
                  <Link
                    to={`/file-manager`}
                    className="inline-flex items-center gap-1 text-sky-500 hover:underline"
                  >
                    <Icons.FolderOpen className="h-3.5 w-3.5" />
                    {tr.openFileManager}
                  </Link>
                </div>
              </main>
            )}
          </div>
        </ModuleSidebarLayout>
      </div>

      <WindowModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editingId == null ? tr.add : tr.edit}
        maxWidth="xl"
        className="max-h-[85vh] max-w-xl"
      >
        <div className="space-y-3 p-1">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block opacity-70">{tr.label}</span>
              <input className={fieldClass} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block opacity-70">{tr.protocol}</span>
              <select
                className={fieldClass}
                value={form.protocol}
                onChange={(e) => onProtocolChange(e.target.value as Protocol)}
              >
                <option value="sftp">SFTP</option>
                <option value="ftp">FTP</option>
                <option value="ftps">FTPS</option>
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block opacity-70">{tr.host}</span>
              <input className={fieldClass} value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block opacity-70">{tr.port}</span>
              <input className={fieldClass} value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block opacity-70">{tr.username}</span>
              <input className={fieldClass} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </label>
            {form.protocol === 'sftp' && (
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block opacity-70">{tr.authType}</span>
                <select
                  className={fieldClass}
                  value={form.auth_type}
                  onChange={(e) => setForm({ ...form, auth_type: e.target.value as AuthType })}
                >
                  <option value="password">{tr.authPassword}</option>
                  <option value="key_path">{tr.authKeyPath}</option>
                  <option value="key_blob">{tr.authKeyBlob}</option>
                </select>
              </label>
            )}
            {(form.auth_type === 'password' || form.protocol !== 'sftp') && (
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block opacity-70">{tr.password}</span>
                <input
                  type="password"
                  className={fieldClass}
                  value={form.password}
                  placeholder={editingId != null ? tr.passwordKeep : ''}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>
            )}
            {form.protocol === 'sftp' && form.auth_type === 'key_path' && (
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block opacity-70">{tr.keyPath}</span>
                <input
                  className={fieldClass}
                  value={form.key_path}
                  placeholder={editingId != null ? tr.keyKeep : '~/.ssh/id_ed25519'}
                  onChange={(e) => setForm({ ...form, key_path: e.target.value })}
                />
              </label>
            )}
            {form.protocol === 'sftp' && form.auth_type === 'key_blob' && (
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block opacity-70">{tr.keyBlob}</span>
                <textarea
                  className={cn(fieldClass, 'min-h-[120px] font-mono text-xs')}
                  value={form.key_blob}
                  placeholder={editingId != null ? tr.keyKeep : '-----BEGIN OPENSSH PRIVATE KEY-----'}
                  onChange={(e) => setForm({ ...form, key_blob: e.target.value })}
                />
              </label>
            )}
            <label className="block text-sm">
              <span className="mb-1 block opacity-70">{tr.remoteRoot}</span>
              <input className={fieldClass} value={form.remote_root} onChange={(e) => setForm({ ...form, remote_root: e.target.value })} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block opacity-70">{tr.timeout}</span>
              <input className={fieldClass} value={form.timeout} onChange={(e) => setForm({ ...form, timeout: e.target.value })} />
            </label>
            {form.protocol !== 'sftp' && (
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.passive}
                  onChange={(e) => setForm({ ...form, passive: e.target.checked })}
                />
                {tr.passive}
              </label>
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <button type="button" className={btnGhost} onClick={() => setEditorOpen(false)}>
              {tr.cancel}
            </button>
            <button type="button" className={btnGhost} disabled={busy} onClick={() => testConnection()}>
              {busy ? tr.testing : tr.test}
            </button>
            <button
              type="button"
              className={btnPrimary}
              disabled={busy || !form.label.trim() || !form.host.trim() || !form.username.trim()}
              onClick={saveConnection}
            >
              {busy ? tr.saving : tr.save}
            </button>
          </div>
        </div>
      </WindowModal>

      <WindowModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title={transferDir === 'download' ? tr.download : tr.upload}
      >
        <div className="space-y-3 p-1">
          <label className="block text-sm">
            <span className="mb-1 block opacity-70">{tr.remotePath}</span>
            <input
              className={fieldClass}
              value={selectedItem?.path || remotePath}
              readOnly
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block opacity-70">{tr.localPath}</span>
            <input
              className={fieldClass}
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} />
            {tr.overwrite}
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className={btnGhost} onClick={() => setTransferOpen(false)}>
              {tr.cancel}
            </button>
            <button type="button" className={btnPrimary} disabled={busy || !localPath.trim()} onClick={startTransfer}>
              <Icons.Play className="h-4 w-4" />
              {tr.transferJob}
            </button>
          </div>
        </div>
      </WindowModal>

      <WindowModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={confirmKind === 'connection' ? tr.delete : tr.deleteItem}
      >
        <div className="space-y-4 p-1">
          <p className="text-sm opacity-80">
            {confirmKind === 'connection' ? tr.confirmDelete : tr.confirmDeleteItem}
          </p>
          <div className="flex justify-end gap-2">
            <button type="button" className={btnGhost} onClick={() => setConfirmOpen(false)}>
              {tr.cancel}
            </button>
            <button
              type="button"
              className={cn(btnPrimary, '!bg-red-600 hover:!bg-red-500')}
              disabled={busy}
              onClick={() => (confirmKind === 'connection' ? doDeleteConnection() : doDeleteItem())}
            >
              {tr.delete}
            </button>
          </div>
        </div>
      </WindowModal>
    </ModuleViewport>
  );
}
