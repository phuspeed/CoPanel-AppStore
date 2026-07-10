import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppShellContext } from '../../core/hooks/useAppShellContext';
import ModuleViewport from '../../core/shell/ModuleViewport';
import * as Icons from 'lucide-react';
import { api } from '../../core/platform';

interface BrowserStatus {
  playwright_installed: boolean;
  chromium_installed: boolean;
  running: boolean;
  current_url: string;
  viewport: { width: number; height: number };
  connected: boolean;
}

interface InstallJob {
  id: string;
  status: string;
  progress: number;
  message?: string;
  error?: string;
  logs?: Array<{ line: string }>;
}

function wsUrl(): string {
  const token = localStorage.getItem('copanel_token') || '';
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  const q = new URLSearchParams({ access_token: token });
  return `${proto}//${host}${port}/api/web_browser/ws?${q.toString()}`;
}

export default function WebBrowser() {
  const { theme, language } = useAppShellContext();
  const isDark = theme === 'dark';

  const [status, setStatus] = useState<BrowserStatus | null>(null);
  const [urlInput, setUrlInput] = useState('http://192.168.1.1');
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [wsState, setWsState] = useState<'idle' | 'connecting' | 'open' | 'closed' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [installJob, setInstallJob] = useState<InstallJob | null>(null);
  const [busy, setBusy] = useState(false);

  const [selectMenu, setSelectMenu] = useState<{
    x: number;
    y: number;
    left: number;
    top: number;
    selectedIndex: number;
    options: Array<{ text: string; disabled?: boolean }>;
  } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  // Live server-side viewport (drives click/scroll coordinate scaling).
  const serverViewportRef = useRef<{ width: number; height: number }>({ width: 1280, height: 720 });
  // Last left-click: server coords (x,y) + display coords within container (left,top).
  const lastClickRef = useRef<{ x: number; y: number; left: number; top: number }>({ x: 0, y: 0, left: 0, top: 0 });

  const tr = {
    en: {
      title: 'Web Browser',
      desc: 'Headless Chromium runs on this VPS and can reach LAN services (router, internal apps) that your PC cannot. Superadmin only. One shared session.',
      installPlaywright: 'Install the Web Browser module from App Store (includes Playwright).',
      installChromium: 'Install Chromium',
      installing: 'Installing Chromium…',
      start: 'Start',
      stop: 'Stop',
      connect: 'Connect stream',
      disconnect: 'Disconnect',
      go: 'Go',
      back: 'Back',
      forward: 'Forward',
      reload: 'Reload',
      notReady: 'Chromium not ready — install browser binary first.',
      wsOpen: 'Stream connected',
      wsClosed: 'Stream disconnected',
      superadminOnly: 'Superadmin only.',
      focusHint: 'Click the viewport, then type. Use toolbar for navigation.',
    },
    vi: {
      title: 'Trình duyệt Web',
      desc: 'Chromium headless chạy trên VPS, truy cập dịch vụ LAN (router, webapp nội bộ) mà máy bạn không vào được. Chỉ superadmin. Một phiên dùng chung.',
      installPlaywright: 'Cài module Web Browser từ App Store (có Playwright).',
      installChromium: 'Cài Chromium',
      installing: 'Đang cài Chromium…',
      start: 'Bật',
      stop: 'Tắt',
      connect: 'Kết nối stream',
      disconnect: 'Ngắt',
      go: 'Đi',
      back: 'Lùi',
      forward: 'Tiến',
      reload: 'Tải lại',
      notReady: 'Chưa có Chromium — cài binary trước.',
      wsOpen: 'Đã kết nối stream',
      wsClosed: 'Đã ngắt stream',
      superadminOnly: 'Chỉ superadmin.',
      focusHint: 'Click vùng xem, gõ phím. Dùng thanh công cụ để điều hướng.',
    },
  }[language === 'vi' ? 'vi' : 'en'];

  const refreshStatus = useCallback(async () => {
    try {
      const st = await api<BrowserStatus>('/api/web_browser/status');
      setStatus(st);
      if (st.current_url) setUrlInput(st.current_url);
    } catch (e: any) {
      setMessage(e?.message || 'Failed to load status');
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const pollInstall = useCallback(async (jobId: string) => {
    const data = await api<{ job: InstallJob | null; chromium_installed: boolean }>(
      `/api/web_browser/install?job_id=${encodeURIComponent(jobId)}`
    );
    if (data.job) setInstallJob(data.job);
    if (data.chromium_installed) {
      await refreshStatus();
      return true;
    }
    return data.job?.status === 'success' || data.job?.status === 'failed';
  }, [refreshStatus]);

  useEffect(() => {
    if (!installJob || ['success', 'failed', 'cancelled'].includes(installJob.status)) return;
    const t = setInterval(async () => {
      try {
        const done = await pollInstall(installJob.id);
        if (done) clearInterval(t);
      } catch {
        clearInterval(t);
      }
    }, 2000);
    return () => clearInterval(t);
  }, [installJob, pollInstall]);

  const runInstallChromium = async () => {
    setBusy(true);
    try {
      const res = await api<{ job_id: string }>('/api/web_browser/install', { method: 'POST' });
      await pollInstall(res.job_id);
    } catch (e: any) {
      setMessage(e?.message || 'Install failed');
    } finally {
      setBusy(false);
    }
  };

  const startBrowser = async () => {
    setBusy(true);
    try {
      const res = await api<{ current_url: string }>('/api/web_browser/start', {
        method: 'POST',
        body: { width: 1280, height: 720, url: urlInput },
      });
      if (res.current_url) setUrlInput(res.current_url);
      await refreshStatus();
    } catch (e: any) {
      setMessage(e?.message || 'Start failed');
    } finally {
      setBusy(false);
    }
  };

  const stopBrowser = async () => {
    disconnectWs();
    setBusy(true);
    try {
      await api('/api/web_browser/stop', { method: 'POST' });
      setFrameSrc(null);
      await refreshStatus();
    } catch (e: any) {
      setMessage(e?.message || 'Stop failed');
    } finally {
      setBusy(false);
    }
  };

  const sendWs = (payload: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  const sendResize = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const w = Math.max(320, Math.min(Math.round(el.clientWidth), 1920));
    const h = Math.max(240, Math.min(Math.round(el.clientHeight), 1080));
    serverViewportRef.current = { width: w, height: h };
    sendWs({ type: 'resize', width: w, height: h });
  }, []);

  const connectWs = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsState('connecting');
    const ws = new WebSocket(wsUrl());
    wsRef.current = ws;
    ws.onopen = () => {
      setWsState('open');
      sendResize();
    };
    ws.onclose = () => setWsState('closed');
    ws.onerror = () => setWsState('error');
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'frame' && msg.data) {
          setFrameSrc(`data:image/jpeg;base64,${msg.data}`);
        } else if (msg.type === 'url' && msg.url) {
          setUrlInput(msg.url);
        } else if (msg.type === 'select') {
          const lc = lastClickRef.current;
          setSelectMenu({
            x: msg.x ?? lc.x,
            y: msg.y ?? lc.y,
            left: lc.left,
            top: lc.top,
            selectedIndex: msg.selectedIndex ?? -1,
            options: Array.isArray(msg.options) ? msg.options : [],
          });
        } else if (msg.type === 'error') {
          setMessage(msg.message || 'Stream error');
        } else if (msg.type === 'ready') {
          if (msg.url) setUrlInput(msg.url);
          if (msg.viewport?.width && msg.viewport?.height) {
            serverViewportRef.current = { width: msg.viewport.width, height: msg.viewport.height };
          }
          sendResize();
        }
      } catch {
        /* ignore */
      }
    };
  };

  const disconnectWs = () => {
    wsRef.current?.close();
    wsRef.current = null;
    setWsState('idle');
    setSelectMenu(null);
  };

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (wsState !== 'open') return;
    const ro = new ResizeObserver(() => sendResize());
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [wsState, sendResize]);

  const scaleCoords = (clientX: number, clientY: number) => {
    const img = imgRef.current;
    if (!img) return { x: 0, y: 0 };
    const rect = img.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
    const { width: vw, height: vh } = serverViewportRef.current;
    const x = ((clientX - rect.left) / rect.width) * vw;
    const y = ((clientY - rect.top) / rect.height) * vh;
    return {
      x: Math.max(0, Math.min(x, vw - 1)),
      y: Math.max(0, Math.min(y, vh - 1)),
    };
  };

  const onNavigate = () => {
    if (wsState === 'open') {
      sendWs({ type: 'navigate', url: urlInput });
    } else {
      startBrowser();
    }
  };

  const needsPlaywright = Boolean(status && !status.playwright_installed);
  const needsChromium = Boolean(status && status.playwright_installed && !status.chromium_installed);

  return (
    <ModuleViewport constrained>
    <div className={`p-4 md:p-6 space-y-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Icons.Globe className="w-7 h-7 text-blue-500" />
          {tr.title}
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{tr.desc}</p>
        <p className={`text-xs mt-1 ${isDark ? 'text-amber-400/90' : 'text-amber-700'}`}>{tr.superadminOnly}</p>
      </div>

      {message && (
        <div className={`text-sm px-3 py-2 rounded-lg ${isDark ? 'bg-red-950/50 text-red-300' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {needsPlaywright && (
        <div className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <p>{tr.installPlaywright}</p>
        </div>
      )}

      {needsChromium && (
        <div className={`rounded-xl border p-4 space-y-3 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <p>{tr.notReady}</p>
          <button
            type="button"
            disabled={busy}
            onClick={runInstallChromium}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {busy ? tr.installing : tr.installChromium}
          </button>
          {installJob && (
            <div className="text-xs space-y-1">
              <div>
                {installJob.status} — {installJob.progress}%
                {installJob.message ? `: ${installJob.message}` : ''}
              </div>
              {installJob.error && <div className="text-red-400">{installJob.error}</div>}
            </div>
          )}
        </div>
      )}

      {status && !needsPlaywright && (
        <>
          <div className={`flex flex-wrap gap-2 items-center rounded-xl border p-3 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <button type="button" onClick={() => sendWs({ type: 'back' })} className="p-2 rounded-lg hover:bg-slate-800/50" title={tr.back}>
              <Icons.ArrowLeft className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => sendWs({ type: 'forward' })} className="p-2 rounded-lg hover:bg-slate-800/50" title={tr.forward}>
              <Icons.ArrowRight className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => sendWs({ type: 'reload' })} className="p-2 rounded-lg hover:bg-slate-800/50" title={tr.reload}>
              <Icons.RotateCw className="w-4 h-4" />
            </button>
            <input
              className={`flex-1 min-w-[12rem] px-3 py-2 rounded-lg text-sm border ${isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate()}
            />
            <button
              type="button"
              onClick={onNavigate}
              disabled={busy || needsChromium}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50"
            >
              {tr.go}
            </button>
            {!status.running ? (
              <button type="button" onClick={startBrowser} disabled={busy || needsChromium} className="px-3 py-2 rounded-lg border text-sm">
                {tr.start}
              </button>
            ) : (
              <button type="button" onClick={stopBrowser} disabled={busy} className="px-3 py-2 rounded-lg border text-sm">
                {tr.stop}
              </button>
            )}
            {wsState === 'open' ? (
              <button type="button" onClick={disconnectWs} className="px-3 py-2 rounded-lg border text-sm">
                {tr.disconnect}
              </button>
            ) : (
              <button
                type="button"
                onClick={connectWs}
                disabled={!status.running || needsChromium}
                className="px-3 py-2 rounded-lg border text-sm"
              >
                {tr.connect}
              </button>
            )}
            <span className={`text-xs ${wsState === 'open' ? 'text-green-500' : isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              {wsState === 'open' ? tr.wsOpen : tr.wsClosed}
            </span>
          </div>

          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{tr.focusHint}</p>

          <div
            ref={viewportRef}
            tabIndex={0}
            className={`relative w-full rounded-xl border overflow-hidden min-h-[420px] h-[calc(100vh-280px)] flex items-center justify-center ${isDark ? 'border-slate-700 bg-black' : 'border-slate-300 bg-slate-100'}`}
            onMouseDown={(e) => {
              if (wsState !== 'open') return;
              viewportRef.current?.focus();
              if (selectMenu) setSelectMenu(null);
              const { x, y } = scaleCoords(e.clientX, e.clientY);
              const contRect = viewportRef.current?.getBoundingClientRect();
              lastClickRef.current = {
                x,
                y,
                left: contRect ? e.clientX - contRect.left : 0,
                top: contRect ? e.clientY - contRect.top : 0,
              };
              sendWs({ type: 'click', x, y, button: e.button === 2 ? 'right' : 'left' });
            }}
            onContextMenu={(e) => e.preventDefault()}
            onMouseMove={(e) => {
              if (wsState !== 'open' || e.buttons === 0) return;
              const { x, y } = scaleCoords(e.clientX, e.clientY);
              sendWs({ type: 'mousemove', x, y });
            }}
            onWheel={(e) => {
              if (wsState !== 'open') return;
              e.preventDefault();
              const { x, y } = scaleCoords(e.clientX, e.clientY);
              sendWs({ type: 'wheel', x, y, deltaY: e.deltaY });
            }}
            onKeyDown={(e) => {
              if (wsState !== 'open') return;
              if (selectMenu) {
                e.preventDefault();
                if (e.key === 'Escape') setSelectMenu(null);
                return;
              }
              e.preventDefault();
              // Single printable character → insert as text; everything else
              // (Enter, Backspace, Tab, arrows, shortcuts) → key press.
              if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                sendWs({ type: 'type', text: e.key });
              } else {
                sendWs({ type: 'key', key: e.key });
              }
            }}
          >
            {frameSrc ? (
              <img ref={imgRef} src={frameSrc} alt="Remote browser" className="max-w-full max-h-full object-contain select-none" draggable={false} />
            ) : (
              <div className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {status.running ? 'Connect stream to view' : 'Start browser first'}
              </div>
            )}

            {selectMenu && (
              <div
                className={`absolute z-20 max-h-64 overflow-auto rounded-md border shadow-xl text-sm ${isDark ? 'bg-slate-900 border-slate-600' : 'bg-white border-slate-300'}`}
                style={{ left: selectMenu.left, top: selectMenu.top, minWidth: 160 }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {selectMenu.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      sendWs({ type: 'select_option', x: selectMenu.x, y: selectMenu.y, index: idx });
                      setSelectMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 whitespace-nowrap disabled:opacity-40 ${
                      idx === selectMenu.selectedIndex
                        ? 'bg-blue-600 text-white'
                        : isDark
                        ? 'hover:bg-slate-700 text-slate-200'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    {opt.text || '\u00A0'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
    </ModuleViewport>
  );
}
