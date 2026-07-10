import * as Icons from 'lucide-react';
import type { OperationLogEntry, PendingOperation } from './operationTypes';

export interface OperationQueueStrings {
  pendingOps: string;
  pendingEmpty: string;
  applyAll: string;
  validate: string;
  clearQueue: string;
  operationLog: string;
  logEmpty: string;
  remove: string;
  validating: string;
  applying: string;
  validationOk: string;
  validationFailed: string;
}

interface OperationQueuePanelProps {
  queue: PendingOperation[];
  log: OperationLogEntry[];
  isDark: boolean;
  busy: boolean;
  validationSummary: string | null;
  tr: OperationQueueStrings;
  onRemove: (id: string) => void;
  onClear: () => void;
  onValidate: () => void;
  onApply: () => void;
}

export default function OperationQueuePanel({
  queue,
  log,
  isDark,
  busy,
  validationSummary,
  tr,
  onRemove,
  onClear,
  onValidate,
  onApply,
}: OperationQueuePanelProps) {
  const border = isDark ? 'border-slate-800' : 'border-slate-200';
  const muted = isDark ? 'text-slate-500' : 'text-slate-400';

  return (
    <aside className={`flex w-full shrink-0 flex-col border-t lg:w-52 lg:border-l lg:border-t-0 xl:w-56 ${border} ${isDark ? 'bg-slate-950/25' : 'bg-[#ececf0]/35'}`}>
      <div className={`p-3 border-b ${border}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${muted}`}>{tr.pendingOps}</p>
        {queue.length === 0 ? (
          <p className={`text-[11px] ${muted}`}>{tr.pendingEmpty}</p>
        ) : (
          <ul className="space-y-1.5 max-h-40 overflow-y-auto">
            {queue.map((item, idx) => (
              <li
                key={item.id}
                className={`flex items-start gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] ${
                  isDark ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white'
                }`}
              >
                <span className={`shrink-0 font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                  {idx + 1}.
                </span>
                <span className="flex-1 leading-snug break-words">{item.summary}</span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onRemove(item.id)}
                  className={`shrink-0 p-0.5 rounded ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                  title={tr.remove}
                >
                  <Icons.X className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-1.5 mt-3">
          <button
            type="button"
            disabled={busy || queue.length === 0}
            onClick={onValidate}
            className={`w-full py-1.5 rounded-lg text-[10px] font-bold border ${
              isDark ? 'border-slate-600 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-white'
            } disabled:opacity-40`}
          >
            {busy ? tr.validating : tr.validate}
          </button>
          <button
            type="button"
            disabled={busy || queue.length === 0}
            onClick={onApply}
            className="w-full py-2 rounded-lg text-[10px] font-bold bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-40"
          >
            {busy ? tr.applying : tr.applyAll}
          </button>
          {queue.length > 0 && (
            <button
              type="button"
              disabled={busy}
              onClick={onClear}
              className={`w-full py-1 text-[10px] font-semibold ${muted} hover:underline disabled:opacity-40`}
            >
              {tr.clearQueue}
            </button>
          )}
        </div>
        {validationSummary && (
          <p className={`mt-2 text-[10px] leading-relaxed ${validationSummary.includes('error') ? 'text-red-500' : isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            {validationSummary}
          </p>
        )}
      </div>

      <div className="flex-1 p-3 min-h-[120px] overflow-y-auto">
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${muted}`}>{tr.operationLog}</p>
        {log.length === 0 ? (
          <p className={`text-[11px] ${muted}`}>{tr.logEmpty}</p>
        ) : (
          <ul className="space-y-2">
            {log.map((entry) => (
              <li key={`${entry.index}-${entry.preview}`} className="text-[10px] leading-relaxed">
                <div className="flex items-center gap-1.5">
                  {entry.status === 'success' ? (
                    <Icons.CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  ) : entry.status === 'failed' ? (
                    <Icons.XCircle className="w-3 h-3 text-red-500 shrink-0" />
                  ) : (
                    <Icons.Circle className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                  <span className="font-mono font-bold">{entry.op}</span>
                </div>
                {entry.preview && (
                  <p className={`font-mono mt-0.5 pl-4 truncate ${muted}`}>{entry.preview}</p>
                )}
                <p className={`pl-4 ${entry.status === 'failed' ? 'text-red-500' : muted}`}>{entry.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
