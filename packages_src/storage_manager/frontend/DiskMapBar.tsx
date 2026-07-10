import { useCallback, useEffect, useRef, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  clampEndMib,
  clientXToEndMib,
  computeResizeBounds,
  isShrinkEnd,
} from './diskMapUtils';
import type { DiskPartitionDetail, WizardPartition } from './partitionTypes';

const FS_COLORS: Record<string, string> = {
  ext4: 'bg-emerald-500',
  xfs: 'bg-teal-500',
  btrfs: 'bg-lime-500',
  vfat: 'bg-sky-500',
  exfat: 'bg-blue-500',
  ntfs: 'bg-indigo-500',
  hfsplus: 'bg-violet-500',
  swap: 'bg-purple-500',
  lvm2: 'bg-amber-500',
  unknown: 'bg-slate-500',
};

function fsColor(fstype?: string | null): string {
  const key = (fstype || 'unknown').toLowerCase();
  return FS_COLORS[key] || FS_COLORS.unknown;
}

function displayName(part: WizardPartition): string {
  if (part.label) return part.label;
  if (part.mountpoint) return part.mountpoint;
  if (part.name) return part.name;
  return `#${part.number}`;
}

export interface MapSegment {
  key: string;
  kind: 'part' | 'free';
  start: number;
  widthPct: number;
  part?: WizardPartition;
  gap?: { start_mib: number; end_mib: number; size_mib: number };
  label: string;
}

export interface DiskMapBarStrings {
  unallocated: string;
  rawDiskLabel: string;
  dragResizeHint: string;
  extendPreview: (mib: number) => string;
  shrinkPreview: (mib: number) => string;
}

interface DiskMapBarProps {
  layout: DiskPartitionDetail;
  mapSegments: MapSegment[];
  selectedPath: string | null;
  canMutate: boolean;
  canCreatePartition: boolean;
  isUninitialized: boolean;
  isDark: boolean;
  formatBytes: (bytes: number, language: 'en' | 'vi') => string;
  language: 'en' | 'vi';
  diskPath: string;
  tr: DiskMapBarStrings;
  onSelectPartition: (path: string) => void;
  onClickFree: (startMib: number, endMib: number) => void;
  onDragResizeEnd: (part: WizardPartition, newEndMib: number) => void;
}

export default function DiskMapBar({
  layout,
  mapSegments,
  selectedPath,
  canMutate,
  canCreatePartition,
  isUninitialized,
  isDark,
  formatBytes,
  language,
  diskPath,
  tr,
  onSelectPartition,
  onClickFree,
  onDragResizeEnd,
}: DiskMapBarProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{
    partPath: string;
    previewEndMib: number;
    bounds: ReturnType<typeof computeResizeBounds>;
  } | null>(null);

  const diskMib = layout.size_bytes / (1024 * 1024);

  const startDrag = useCallback(
    (e: React.PointerEvent, part: WizardPartition) => {
      if (!canMutate || !part.path || part.is_mounted) return;
      const bounds = computeResizeBounds(part, layout);
      if (!bounds.canResize) return;
      e.stopPropagation();
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setDrag({
        partPath: part.path,
        previewEndMib: part.end_mib ?? bounds.minEndMib,
        bounds,
      });
    },
    [canMutate, layout],
  );

  useEffect(() => {
    if (!drag) return;

    const onMove = (e: PointerEvent) => {
      if (!mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      const absolute = clientXToEndMib(e.clientX, rect, diskMib);
      setDrag((prev) =>
        prev ? { ...prev, previewEndMib: clampEndMib(absolute, prev.bounds) } : null,
      );
    };

    const onUp = () => {
      setDrag((prev) => {
        if (prev) {
          const part = layout.partitions.find((p) => p.path === prev.partPath);
          const currentEnd = part?.end_mib ?? 0;
          if (part && Math.abs(prev.previewEndMib - currentEnd) > 0.5) {
            onDragResizeEnd(part, prev.previewEndMib);
          }
        }
        return null;
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [drag, diskMib, layout.partitions, onDragResizeEnd]);

  const previewPart = drag
    ? layout.partitions.find((p) => p.path === drag.partPath)
    : null;

  return (
    <div>
      <div
        ref={mapRef}
        className={`rounded-xl border p-2 shadow-inner ${isDark ? 'border-slate-700/80 bg-slate-950' : 'border-slate-200 bg-white'}`}
      >
        <div className="flex h-16 gap-0.5 overflow-hidden rounded-lg relative">
          {mapSegments.map((seg) => {
            if (seg.kind === 'free') {
              const gap = seg.gap;
              return (
                <button
                  key={seg.key}
                  type="button"
                  disabled={!canCreatePartition || !gap}
                  onClick={() => gap && onClickFree(gap.start_mib, gap.end_mib)}
                  style={{ width: `${seg.widthPct}%` }}
                  className={`relative min-w-[2px] h-full flex items-center justify-center text-[9px] font-bold border border-dashed transition ${
                    canCreatePartition && gap
                      ? isDark
                        ? 'bg-slate-900 border-cyan-700/50 text-cyan-400 hover:bg-cyan-950/50 cursor-pointer'
                        : 'bg-slate-100 border-cyan-300 text-cyan-700 hover:bg-cyan-50 cursor-pointer'
                      : isDark ? 'bg-slate-900 border-slate-600 text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}
                  title={isUninitialized ? tr.rawDiskLabel : tr.unallocated}
                >
                  <span className="truncate px-0.5 hidden sm:inline">
                    {isUninitialized ? tr.rawDiskLabel : tr.unallocated}
                  </span>
                </button>
              );
            }

            const part = seg.part!;
            const selectedHere = part.path === selectedPath;
            const used = part.used_percent ?? 0;
            const isDragging = drag?.partPath === part.path;
            const bounds = computeResizeBounds(part, layout);
            const showHandle = selectedHere && canMutate && !part.is_mounted && bounds.canResize;

            let displayWidthPct = seg.widthPct;
            if (isDragging && previewPart && drag && layout.size_bytes) {
              const previewBytes = drag.previewEndMib * 1024 * 1024;
              const startBytes = (part.start_mib ?? 0) * 1024 * 1024;
              displayWidthPct = Math.max(0.5, ((previewBytes - startBytes) / layout.size_bytes) * 100);
            }

            return (
              <div
                key={seg.key}
                style={{ width: `${displayWidthPct}%` }}
                className={`relative min-w-[24px] h-full ${isDragging ? 'z-20' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => part.path && onSelectPartition(part.path)}
                  className={`relative w-full h-full text-left overflow-hidden transition ring-2 ${
                    selectedHere
                      ? 'ring-amber-400 z-10'
                      : 'ring-transparent hover:ring-cyan-500/50'
                  } ${isDark ? 'bg-slate-800' : 'bg-slate-100'} ${isDragging ? 'ring-cyan-400' : ''}`}
                  title={`${displayName(part)} · ${part.fstype_label || part.fstype || '—'}`}
                >
                  <div className={`absolute inset-x-0 bottom-0 h-1.5 ${fsColor(part.fstype)} opacity-80`} />
                  <div
                    className="absolute inset-x-0 bottom-1.5 h-2 bg-cyan-500/70"
                    style={{ width: `${Math.min(100, used)}%` }}
                  />
                  <div className="relative p-1 h-full flex flex-col justify-between">
                    <span className={`text-[9px] font-bold truncate leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {displayName(part)}
                    </span>
                    <span className={`text-[8px] font-mono truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {part.fstype_label || part.fstype || '—'}
                      {part.size_bytes ? ` · ${formatBytes(part.size_bytes, language)}` : ''}
                    </span>
                    {part.is_boot && (
                      <Icons.Flag className="absolute top-1 right-1 w-2.5 h-2.5 text-amber-400" />
                    )}
                  </div>
                </button>
                {showHandle && (
                  <div
                    role="separator"
                    aria-orientation="vertical"
                    onPointerDown={(e) => startDrag(e, part)}
                    className={`absolute top-0 right-0 w-2 h-full cursor-ew-resize z-30 flex items-center justify-center ${
                      isDark ? 'hover:bg-cyan-500/40' : 'hover:bg-cyan-500/30'
                    }`}
                    title={tr.dragResizeHint}
                  >
                    <div className={`w-0.5 h-8 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-cyan-600'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className={`mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <span>{diskPath} · {formatBytes(layout.size_bytes, language)}</span>
          {drag && previewPart && (
            <span className={isDark ? 'text-cyan-400' : 'text-cyan-700'}>
              {isShrinkEnd(previewPart.end_mib ?? 0, drag.previewEndMib)
                ? tr.shrinkPreview(drag.previewEndMib)
                : tr.extendPreview(drag.previewEndMib)}
            </span>
          )}
        </div>
      </div>
      {canMutate && !drag && (
        <p className={`mt-1 text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {tr.dragResizeHint}
        </p>
      )}
    </div>
  );
}
