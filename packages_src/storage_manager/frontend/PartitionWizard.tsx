/**
 * MiniTool Partition Wizard–style disk map + partition table + action panel.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as Icons from 'lucide-react';
import WindowModal from '../../core/shell/WindowModal';
import OperationQueuePanel, { type OperationQueueStrings } from './OperationQueuePanel';
import DiskMapBar from './DiskMapBar';
import {
  newPendingId,
  toApiPayload,
  type OperationLogEntry,
  type PendingOperation,
} from './operationTypes';
import type { CreatePartitionType, DiskPartitionDetail, WizardPartition } from './partitionTypes';

export type { DiskPartitionDetail, WizardPartition } from './partitionTypes';

type FormatFsType = 'ext4' | 'xfs' | 'btrfs' | 'vfat' | 'exfat' | 'ntfs' | 'hfsplus';

const FORMAT_FS_OPTIONS: { value: FormatFsType; label: string }[] = [
  { value: 'ext4', label: 'ext4' },
  { value: 'xfs', label: 'XFS' },
  { value: 'btrfs', label: 'Btrfs' },
  { value: 'vfat', label: 'FAT32' },
  { value: 'exfat', label: 'exFAT' },
  { value: 'ntfs', label: 'NTFS' },
  { value: 'hfsplus', label: 'HFS+' },
];

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

interface DiskPartitionSummary {
  name: string;
  path: string;
  size_bytes: number;
  fstype?: string | null;
  fstype_label?: string | null;
  mountpoint?: string | null;
}

interface DiskSummary {
  name: string;
  path: string;
  size_bytes: number;
  model: string;
  is_system_disk: boolean;
  partitions?: DiskPartitionSummary[];
}

interface VolumeUsage {
  device: string;
  percent: number;
  used: number;
  free: number;
}

export interface PartitionWizardStrings {
  diskMap: string;
  partitionList: string;
  operations: string;
  unallocated: string;
  selectPartition: string;
  capacity: string;
  unused: string;
  type: string;
  status: string;
  mounted: string;
  unmounted: string;
  boot: string;
  createPartition: string;
  formatPartition: string;
  deletePartition: string;
  resizePartition: string;
  changeLabel: string;
  setBoot: string;
  clearBoot: string;
  mountVolume: string;
  unmountVolume: string;
  properties: string;
  partitionTable: string;
  confirmPartName: string;
  confirmDiskName: string;
  dataLossWarning: string;
  deleteWarning: string;
  resizeHint: string;
  growFilesystem: string;
  runAction: string;
  cancel: string;
  labelOptional: string;
  initGpt: string;
  start: string;
  end: string;
  noDisks: string;
  loadingLayout: string;
  systemDisk: string;
  protectedNote: string;
  selectDisk: string;
  mountpoint: string;
  persistFstab: string;
  removeFstab: string;
  diskOperations: string;
  initializeDisk: string;
  initializeDiskTitle: string;
  initializeDiskHint: string;
  tableGpt: string;
  tableMbr: string;
  uninitializedBanner: string;
  uninitializedStep: string;
  emptyTableStep: string;
  rawDiskLabel: string;
  initWipeWarning: string;
  addToQueue: string;
  partitionType: string;
  typeLinux: string;
  typeEfi: string;
  typeSwap: string;
  typeNtfs: string;
  typeLvm: string;
  dragResizeHint: string;
  extendPreview: (mib: number) => string;
  shrinkPreview: (mib: number) => string;
  shrinkPartition: string;
  shrinkFilesystem: string;
  shrinkHint: string;
  queue: OperationQueueStrings;
}

const PARTITION_TYPE_OPTIONS: { value: CreatePartitionType; labelKey: 'typeLinux' | 'typeEfi' | 'typeSwap' | 'typeNtfs' | 'typeLvm' }[] = [
  { value: 'linux', labelKey: 'typeLinux' },
  { value: 'efi', labelKey: 'typeEfi' },
  { value: 'swap', labelKey: 'typeSwap' },
  { value: 'ntfs', labelKey: 'typeNtfs' },
  { value: 'lvm', labelKey: 'typeLvm' },
];

interface PartitionWizardProps {
  disks: DiskSummary[];
  volumes: VolumeUsage[];
  language: 'en' | 'vi';
  isDark: boolean;
  actionLoading: boolean;
  actionErr?: string | null;
  formatBytes: (bytes: number, language: 'en' | 'vi') => string;
  fetchJson: <T>(path: string) => Promise<T>;
  runAction: (fn: () => Promise<{ message?: string }>) => Promise<boolean>;
  postJson: <T>(path: string, payload: unknown) => Promise<T>;
  tr: PartitionWizardStrings;
}

type ModalKind = 'initDisk' | 'create' | 'format' | 'delete' | 'resize' | 'label' | 'boot' | 'mount' | 'unmount' | null;

function fsColor(fstype?: string | null): string {
  const key = (fstype || 'unknown').toLowerCase();
  return FS_COLORS[key] || FS_COLORS.unknown;
}

function buildLayoutFromDisks(
  diskName: string,
  disks: DiskSummary[],
  volumes: VolumeUsage[],
): DiskPartitionDetail | null {
  const disk = disks.find((d) => d.name === diskName);
  if (!disk) return null;
  const parts = disk.partitions || [];
  let cursor = 1.0;
  const partitions: WizardPartition[] = parts.map((part, idx) => {
    const usage = volumes.find((v) => v.device === part.path);
    const sizeMib = part.size_bytes / (1024 * 1024);
    const start = cursor;
    const end = start + sizeMib;
    cursor = end;
    return {
      number: idx + 1,
      name: part.name,
      path: part.path,
      start_mib: start,
      end_mib: end,
      size_bytes: part.size_bytes,
      fstype: part.fstype,
      fstype_label: part.fstype_label,
      mountpoint: part.mountpoint,
      flags: [],
      is_boot: false,
      label: null,
      used_percent: usage?.percent ?? null,
      used_bytes: usage?.used ?? null,
      free_bytes: usage?.free ?? null,
      is_mounted: Boolean(part.mountpoint),
    };
  });
  const diskMib = disk.size_bytes / (1024 * 1024);
  const unallocated: DiskPartitionDetail['unallocated'] = [];
  if (cursor < diskMib - 1) {
    unallocated.push({ start_mib: cursor, end_mib: diskMib, size_mib: diskMib - cursor });
  }
  return {
    disk: diskName,
    is_system_disk: disk.is_system_disk,
    size_bytes: disk.size_bytes,
    model: disk.model,
    partition_table: undefined,
    disk_state: parts.length ? 'partitioned' : 'uninitialized',
    partitions,
    unallocated,
  };
}

function isPartitionsApiMissing(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  if (lower.includes('could not resolve partition number')) return false;
  if (lower.includes('confirmation must match')) return false;
  return (
    msg === 'Not Found'
    || msg.includes('API route not found')
    || lower.includes('service unavailable')
    || (lower.includes('parted') && lower.includes('not found'))
  );
}

function displayName(part: WizardPartition): string {
  if (part.label) return part.label;
  if (part.mountpoint) return part.mountpoint;
  if (part.name) return part.name;
  return `#${part.number}`;
}

export default function PartitionWizard({
  disks,
  volumes,
  language,
  isDark,
  actionLoading,
  actionErr,
  formatBytes,
  fetchJson,
  runAction,
  postJson,
  tr,
}: PartitionWizardProps) {
  const [activeDisk, setActiveDisk] = useState('');
  const [layout, setLayout] = useState<DiskPartitionDetail | null>(null);
  const [layoutLoading, setLayoutLoading] = useState(false);
  const [layoutErr, setLayoutErr] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);

  const [partStart, setPartStart] = useState('1MiB');
  const [partEnd, setPartEnd] = useState('100%');
  const [partType, setPartType] = useState<CreatePartitionType>('linux');
  const [initTableType, setInitTableType] = useState<'gpt' | 'msdos'>('gpt');
  const [initConfirm, setInitConfirm] = useState('');
  const [partConfirm, setPartConfirm] = useState('');

  const [formatFs, setFormatFs] = useState<FormatFsType>('ext4');
  const [formatLabel, setFormatLabel] = useState('');
  const [formatConfirm, setFormatConfirm] = useState('');

  const [resizeEnd, setResizeEnd] = useState('100%');
  const [resizeGrowFs, setResizeGrowFs] = useState(true);
  const [resizeShrinkFs, setResizeShrinkFs] = useState(true);
  const [resizeConfirm, setResizeConfirm] = useState('');

  const [labelText, setLabelText] = useState('');
  const [labelConfirm, setLabelConfirm] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [bootConfirm, setBootConfirm] = useState('');

  const [mountPoint, setMountPoint] = useState('/mnt/data');
  const [mountFs, setMountFs] = useState<FormatFsType>('ntfs');
  const [mountPersist, setMountPersist] = useState(true);
  const partitionsApiAvailable = useRef<boolean | null>(null);

  const [pendingQueue, setPendingQueue] = useState<PendingOperation[]>([]);
  const [opLog, setOpLog] = useState<OperationLogEntry[]>([]);
  const [queueBusy, setQueueBusy] = useState(false);
  const [validationSummary, setValidationSummary] = useState<string | null>(null);

  const enqueue = useCallback((entry: Omit<PendingOperation, 'id'>) => {
    setPendingQueue((prev) => [...prev, { ...entry, id: newPendingId() }]);
    setValidationSummary(null);
    setModal(null);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setPendingQueue((prev) => prev.filter((item) => item.id !== id));
    setValidationSummary(null);
  }, []);

  const clearQueue = useCallback(() => {
    setPendingQueue([]);
    setValidationSummary(null);
  }, []);

  const handleValidateQueue = useCallback(async () => {
    if (pendingQueue.length === 0) return;
    setQueueBusy(true);
    setValidationSummary(null);
    try {
      const data = await postJson<{ valid: boolean; summary: string }>(
        '/api/storage_manager/operations/validate',
        { operations: pendingQueue.map(toApiPayload) },
      );
      setValidationSummary(
        data.valid
          ? `${tr.queue.validationOk} — ${data.summary}`
          : `${tr.queue.validationFailed} — ${data.summary}`,
      );
    } catch (err) {
      setValidationSummary(err instanceof Error ? err.message : String(err));
    } finally {
      setQueueBusy(false);
    }
  }, [pendingQueue, postJson, tr.queue.validationFailed, tr.queue.validationOk]);

  const applyCreateDefaults = useCallback((diskName: string) => {
    setPartConfirm(diskName);
    const firstFree = layout?.unallocated?.[0];
    if (firstFree) {
      setPartStart(`${Math.ceil(firstFree.start_mib)}MiB`);
      setPartEnd(`${Math.floor(firstFree.end_mib)}MiB`);
    } else {
      setPartStart('1MiB');
      setPartEnd('100%');
    }
  }, [disks, layout]);

  useEffect(() => {
    if (!activeDisk && disks.length > 0) {
      setActiveDisk(disks[0].name);
    }
  }, [disks, activeDisk]);

  const loadLayout = useCallback(async (diskName: string) => {
    if (!diskName) return;
    setLayoutLoading(true);
    setLayoutErr(null);
    if (partitionsApiAvailable.current === false) {
      const fallback = buildLayoutFromDisks(diskName, disks, volumes);
      setLayout(fallback ?? null);
      if (!fallback) {
        setLayoutErr('Failed to load layout');
      }
      setLayoutLoading(false);
      return;
    }
    try {
      const data = await fetchJson<DiskPartitionDetail>(
        `/api/storage_manager/disks/${encodeURIComponent(diskName)}/partitions`,
      );
      partitionsApiAvailable.current = true;
      const disk = disks.find((d) => d.name === diskName);
      const apiEmpty = (data.partitions?.length ?? 0) === 0;
      const diskHasParts = (disk?.partitions?.length ?? 0) > 0;
      if (apiEmpty && diskHasParts) {
        const fallback = buildLayoutFromDisks(diskName, disks, volumes);
        setLayout(fallback ?? data);
      } else {
        setLayout(data);
      }
    } catch (err) {
      if (isPartitionsApiMissing(err)) {
        partitionsApiAvailable.current = false;
        const fallback = buildLayoutFromDisks(diskName, disks, volumes);
        if (fallback) {
          setLayout(fallback);
          return;
        }
      }
      setLayout(null);
      setLayoutErr(err instanceof Error ? err.message : 'Failed to load layout');
    } finally {
      setLayoutLoading(false);
    }
  }, [fetchJson, disks, volumes]);

  useEffect(() => {
    if (activeDisk) {
      setSelectedPath(null);
      loadLayout(activeDisk);
    }
  }, [activeDisk, loadLayout]);

  const selected = useMemo(
    () => layout?.partitions.find((p) => p.path === selectedPath) ?? null,
    [layout, selectedPath],
  );

  const diskMeta = useMemo(
    () => disks.find((d) => d.name === activeDisk),
    [disks, activeDisk],
  );

  const canMutate = layout && !layout.is_system_disk;
  const diskState = layout?.disk_state ?? (
    !layout?.partition_table && !(layout?.partitions?.length) ? 'uninitialized' : (
      !(layout?.partitions?.length) ? 'empty_table' : 'partitioned'
    )
  );
  const isUninitialized = diskState === 'uninitialized';
  const isEmptyTable = diskState === 'empty_table';
  const canCreatePartition = canMutate && !isUninitialized;
  const hasSelection = Boolean(selected?.path && selected?.name);

  const openModal = (kind: ModalKind) => {
    if (kind === 'initDisk') {
      if (!canMutate) return;
      setInitConfirm('');
      setInitTableType('gpt');
      setModal(kind);
      return;
    }
    if (!canMutate && kind !== 'mount' && kind !== 'unmount') return;
    if (kind === 'create' && isUninitialized) return;
    if (kind !== 'create' && !hasSelection) return;
    setModal(kind);
    if (selected?.name) {
      setFormatConfirm('');
      setDeleteConfirm('');
      setResizeConfirm('');
      setLabelConfirm('');
      setBootConfirm('');
      setResizeEnd('100%');
      setLabelText(selected.label || '');
    }
    if (kind === 'create') {
      applyCreateDefaults(activeDisk);
      setPartType('linux');
    }
    if (kind === 'mount' && selected) {
      const inferred = (selected.fstype as FormatFsType | null) || 'ntfs';
      setMountFs(FORMAT_FS_OPTIONS.some((o) => o.value === inferred) ? inferred : 'ntfs');
      const partName = selected.name || selected.path?.replace('/dev/', '') || 'data';
      setMountPoint(`/mnt/${partName}`);
      setMountPersist(false);
    }
  };

  const closeModal = () => setModal(null);

  const openCreateFromGap = useCallback((startMib: number, endMib: number) => {
    if (!canMutate || isUninitialized) return;
    setPartStart(`${Math.ceil(startMib)}MiB`);
    setPartEnd(`${Math.floor(endMib)}MiB`);
    setPartConfirm(activeDisk);
    setPartType('linux');
    setModal('create');
  }, [activeDisk, canMutate, isUninitialized]);

  const handleDragResizeEnd = useCallback((part: WizardPartition, newEndMib: number) => {
    if (!part.name || !part.path) return;
    const currentEnd = part.end_mib ?? 0;
    const shrink = newEndMib < currentEnd - 0.5;
    enqueue({
      op: 'resize',
      device: part.path,
      confirm_token: part.name,
      params: {
        end: `${newEndMib}MiB`,
        grow_filesystem: !shrink,
        shrink_filesystem: shrink,
      },
      summary: shrink
        ? `${tr.shrinkPartition}: ${part.name} → ${newEndMib}MiB`
        : `${tr.resizePartition}: ${part.name} → ${newEndMib}MiB`,
    });
    setSelectedPath(part.path);
  }, [enqueue, tr.resizePartition, tr.shrinkPartition]);

  const handleApplyQueue = useCallback(async () => {
    if (pendingQueue.length === 0) return;
    setQueueBusy(true);
    setValidationSummary(null);
    try {
      const data = await postJson<{
        applied: number;
        completed: boolean;
        log: Array<{ index: number; op: string; status: string; preview?: string; message: string }>;
      }>('/api/storage_manager/operations/apply', {
        operations: pendingQueue.map(toApiPayload),
      });
      setOpLog(
        (data.log || []).map((entry) => ({
          index: entry.index,
          op: entry.op,
          status: entry.status === 'success' ? 'success' as const : 'failed' as const,
          preview: entry.preview,
          message: entry.message,
        })),
      );
      if (data.completed) {
        setPendingQueue([]);
        setValidationSummary(tr.queue.validationOk);
        await loadLayout(activeDisk);
      } else {
        setValidationSummary(
          `${tr.queue.validationFailed} — ${data.applied}/${pendingQueue.length}`,
        );
      }
    } catch (err) {
      setValidationSummary(err instanceof Error ? err.message : String(err));
    } finally {
      setQueueBusy(false);
    }
  }, [activeDisk, loadLayout, pendingQueue, postJson, tr.queue.validationFailed, tr.queue.validationOk]);

  const modalTitle = useMemo(() => {
    if (!modal) return undefined;
    const titles: Record<NonNullable<ModalKind>, string> = {
      initDisk: tr.initializeDiskTitle,
      create: tr.createPartition,
      format: tr.formatPartition,
      delete: tr.deletePartition,
      resize: tr.resizePartition,
      label: tr.changeLabel,
      boot: tr.setBoot,
      mount: tr.mountVolume,
      unmount: tr.unmountVolume,
    };
    return titles[modal];
  }, [modal, tr]);

  const refreshAfter = async (fn: () => Promise<{ message?: string }>) => {
    const ok = await runAction(async () => {
      const result = await fn();
      await loadLayout(activeDisk);
      return result;
    });
    if (ok) closeModal();
  };

  const mapSegments = useMemo(() => {
    if (!layout || !layout.size_bytes) return [];
    const total = layout.size_bytes;
    type Seg = {
      key: string;
      kind: 'part' | 'free';
      start: number;
      widthPct: number;
      part?: WizardPartition;
      gap?: { start_mib: number; end_mib: number; size_mib: number };
      label: string;
    };
    const raw: Seg[] = [];

    for (const part of layout.partitions) {
      const size = part.size_bytes || 0;
      raw.push({
        key: part.path || `p${part.number}`,
        kind: 'part',
        start: part.start_mib ?? 0,
        widthPct: Math.max(0.5, (size / total) * 100),
        part,
        label: displayName(part),
      });
    }
    for (const gap of layout.unallocated || []) {
      const gapBytes = gap.size_mib * 1024 * 1024;
      raw.push({
        key: `free-${gap.start_mib}`,
        kind: 'free',
        start: gap.start_mib,
        widthPct: Math.max(0.5, (gapBytes / total) * 100),
        gap,
        label: isUninitialized ? tr.rawDiskLabel : tr.unallocated,
      });
    }
    return raw.sort((a, b) => a.start - b.start);
  }, [layout, tr.unallocated, tr.rawDiskLabel, isUninitialized]);

  const actionBtn = (
    icon: ReactNode,
    label: string,
    onClick: () => void,
    disabled?: boolean,
    danger?: boolean,
  ) => (
    <button
      type="button"
      disabled={disabled || actionLoading}
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[11px] font-semibold transition border ${
        disabled
          ? isDark ? 'opacity-40 border-slate-800 text-slate-500' : 'opacity-40 border-slate-100 text-slate-400'
          : danger
            ? isDark
              ? 'border-red-900/50 text-red-300 hover:bg-red-950/40'
              : 'border-red-200 text-red-700 hover:bg-red-50'
            : isDark
              ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (disks.length === 0) {
    return (
      <p className={`p-8 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{tr.noDisks}</p>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Disk tabs */}
      <div className={`flex flex-wrap gap-1 p-2 border-b ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
        {disks.map((disk) => {
          const active = disk.name === activeDisk;
          return (
            <button
              key={disk.name}
              type="button"
              onClick={() => setActiveDisk(disk.name)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                active
                  ? isDark ? 'bg-cyan-600 text-white' : 'bg-cyan-600 text-white'
                  : isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-white'
              }`}
            >
              <span className="font-mono">{disk.name}</span>
              <span className="opacity-70 ml-1.5 font-normal">
                {formatBytes(disk.size_bytes, language)}
              </span>
              {disk.is_system_disk && (
                <span className={`ml-1 text-[9px] px-1 rounded ${active ? 'bg-white/20' : isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {tr.systemDisk}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row min-h-[420px]">
        {/* Action panel */}
        <aside className={`w-full lg:w-52 shrink-0 border-b lg:border-b-0 lg:border-r p-3 space-y-1 ${isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-200 bg-slate-50/80'}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {tr.diskOperations}
          </p>
          {actionBtn(
            <Icons.HardDrive className="w-3.5 h-3.5" />,
            tr.initializeDisk,
            () => openModal('initDisk'),
            !canMutate || diskState === 'partitioned',
            false,
          )}
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 mt-3 pt-2 border-t ${isDark ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-200'}`}>
            {tr.operations}
          </p>
          {actionBtn(<Icons.Plus className="w-3.5 h-3.5" />, tr.createPartition, () => openModal('create'), !canCreatePartition)}
          {actionBtn(<Icons.Eraser className="w-3.5 h-3.5" />, tr.formatPartition, () => openModal('format'), !canMutate || !hasSelection || selected?.is_mounted)}
          {actionBtn(<Icons.Trash2 className="w-3.5 h-3.5" />, tr.deletePartition, () => openModal('delete'), !canMutate || !hasSelection || selected?.is_mounted, true)}
          {actionBtn(<Icons.MoveHorizontal className="w-3.5 h-3.5" />, tr.resizePartition, () => openModal('resize'), !canMutate || !hasSelection)}
          {actionBtn(<Icons.Tag className="w-3.5 h-3.5" />, tr.changeLabel, () => openModal('label'), !canMutate || !hasSelection || !selected?.fstype)}
          {actionBtn(<Icons.Flag className="w-3.5 h-3.5" />, tr.setBoot, () => openModal('boot'), !canMutate || !hasSelection)}
          {actionBtn(<Icons.FolderOpen className="w-3.5 h-3.5" />, tr.mountVolume, () => openModal('mount'), !hasSelection || selected?.is_mounted || selected?.mountable === false)}
          {actionBtn(<Icons.FolderMinus className="w-3.5 h-3.5" />, tr.unmountVolume, () => openModal('unmount'), !hasSelection || !selected?.is_mounted)}
          {layout?.is_system_disk && (
            <p className={`text-[10px] mt-3 px-1 ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>{tr.protectedNote}</p>
          )}
        </aside>

        {/* Main: disk map + table */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Disk map */}
          <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {tr.diskMap}
              </p>
              {diskMeta && (
                <span className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {diskMeta.model} · {isUninitialized ? tr.rawDiskLabel : (layout?.partition_table?.toUpperCase() || '—')}
                </span>
              )}
            </div>
            {!layoutLoading && !layoutErr && isUninitialized && (
              <div className={`mb-3 rounded-xl border px-3 py-2.5 text-[11px] leading-relaxed ${isDark ? 'border-amber-500/40 bg-amber-950/30 text-amber-100' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
                <p className="font-bold">{tr.uninitializedBanner}</p>
                <p className="opacity-90 mt-1">{tr.uninitializedStep}</p>
              </div>
            )}
            {!layoutLoading && !layoutErr && isEmptyTable && (
              <div className={`mb-3 rounded-xl border px-3 py-2.5 text-[11px] ${isDark ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-100' : 'border-cyan-200 bg-cyan-50 text-cyan-900'}`}>
                {tr.emptyTableStep}
              </div>
            )}
            {layoutLoading ? (
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{tr.loadingLayout}</p>
            ) : layoutErr ? (
              <p className="text-xs text-red-500">{layoutErr}</p>
            ) : layout && (
              <DiskMapBar
                layout={layout}
                mapSegments={mapSegments}
                selectedPath={selectedPath}
                canMutate={Boolean(canMutate)}
                canCreatePartition={Boolean(canCreatePartition)}
                isUninitialized={isUninitialized}
                isDark={isDark}
                formatBytes={formatBytes}
                language={language}
                diskPath={diskMeta?.path || `/dev/${activeDisk}`}
                tr={{
                  unallocated: tr.unallocated,
                  rawDiskLabel: tr.rawDiskLabel,
                  dragResizeHint: tr.dragResizeHint,
                  extendPreview: tr.extendPreview,
                  shrinkPreview: tr.shrinkPreview,
                }}
                onSelectPartition={setSelectedPath}
                onClickFree={openCreateFromGap}
                onDragResizeEnd={handleDragResizeEnd}
              />
            )}
          </div>

          {/* Partition table */}
          <div className="flex-1 overflow-x-auto">
            <p className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {tr.partitionList}
            </p>
            <table className="w-full text-left text-xs">
              <thead className={`uppercase tracking-wider text-[10px] font-bold ${isDark ? 'bg-slate-950/70 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                <tr>
                  <th className="p-2 pl-4">#</th>
                  <th className="p-2">{tr.capacity}</th>
                  <th className="p-2">{tr.unused}</th>
                  <th className="p-2">FS</th>
                  <th className="p-2">{tr.type}</th>
                  <th className="p-2">{tr.status}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {(layout?.partitions || []).map((part) => {
                  const rowSel = part.path === selectedPath;
                  const usedPct = part.used_percent;
                  return (
                    <tr
                      key={part.path || part.number}
                      onClick={() => setSelectedPath(part.path || null)}
                      className={`cursor-pointer transition ${
                        rowSel
                          ? isDark ? 'bg-cyan-950/40' : 'bg-cyan-50'
                          : isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-2 pl-4 font-mono font-bold">
                        {part.label || part.name || part.number}
                        {part.mountpoint && (
                          <span className={`block text-[9px] font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {part.mountpoint}
                          </span>
                        )}
                      </td>
                      <td className="p-2 font-mono">{formatBytes(part.size_bytes || 0, language)}</td>
                      <td className="p-2">
                        {usedPct != null ? (
                          <div className="flex items-center gap-2">
                            <div className={`w-16 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${100 - usedPct}%` }} />
                            </div>
                            <span className="font-mono text-[10px]">{100 - usedPct}%</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="p-2">{part.fstype_label || part.fstype || '—'}</td>
                      <td className="p-2 text-[10px]">
                        {(part.flags || []).join(', ') || '—'}
                        {part.is_boot && <span className="ml-1 text-amber-500">{tr.boot}</span>}
                      </td>
                      <td className="p-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                          part.is_mounted
                            ? isDark ? 'border-emerald-500/30 text-emerald-400' : 'border-emerald-200 text-emerald-700'
                            : isDark ? 'border-slate-600 text-slate-400' : 'border-slate-200 text-slate-500'
                        }`}>
                          {part.is_mounted ? tr.mounted : tr.unmounted}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!layoutLoading && (layout?.partitions.length || 0) === 0 && (
              <p className={`p-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{tr.selectPartition}</p>
            )}
          </div>

          {/* Properties strip */}
          {selected && (
            <div className={`px-4 py-3 border-t text-[11px] grid grid-cols-2 md:grid-cols-4 gap-2 ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/50'}`}>
              <div><span className="opacity-60">{tr.properties}:</span> <span className="font-mono">{selected.path}</span></div>
              <div><span className="opacity-60">{tr.partitionTable}:</span> {layout?.partition_table || '—'}</div>
              <div><span className="opacity-60">{tr.capacity}:</span> {formatBytes(selected.size_bytes || 0, language)}</div>
              <div><span className="opacity-60">Label:</span> {selected.label || '—'}</div>
            </div>
          )}
        </div>

        <OperationQueuePanel
          queue={pendingQueue}
          log={opLog}
          isDark={isDark}
          busy={queueBusy || actionLoading}
          validationSummary={validationSummary}
          tr={tr.queue}
          onRemove={removeFromQueue}
          onClear={clearQueue}
          onValidate={handleValidateQueue}
          onApply={handleApplyQueue}
        />
      </div>

      {/* Modals */}
      <WindowModal open={!!modal} onClose={closeModal} title={modalTitle} maxWidth="md">
        <div className="space-y-4 p-5 max-h-[70vh] overflow-y-auto text-sm">
            {modal === 'initDisk' && (
              <>
                <p className="text-[11px] opacity-70">{tr.initializeDiskHint}</p>
                <p className="text-[11px] font-mono">{diskMeta?.path} · {formatBytes(layout?.size_bytes || 0, language)}</p>
                <p className="text-[11px] text-red-500">{tr.initWipeWarning}</p>
                <fieldset className="space-y-2 text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tableType" checked={initTableType === 'gpt'} onChange={() => setInitTableType('gpt')} />
                    {tr.tableGpt}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tableType" checked={initTableType === 'msdos'} onChange={() => setInitTableType('msdos')} />
                    {tr.tableMbr}
                  </label>
                </fieldset>
                <label className="block text-[11px] space-y-1">
                  {tr.confirmDiskName}
                  <input value={initConfirm} onChange={(e) => setInitConfirm(e.target.value)} placeholder={activeDisk} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                </label>
                {activeDisk && (
                  <p className="text-[10px] opacity-60 font-mono">{language === 'vi' ? 'Gõ:' : 'Type:'} {activeDisk}</p>
                )}
                {actionErr && (
                  <p className="text-[11px] text-red-500 whitespace-pre-wrap">{actionErr}</p>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{tr.cancel}</button>
                  <button
                    type="button"
                    disabled={actionLoading || initConfirm.trim() !== activeDisk}
                    onClick={() => enqueue({
                      op: 'initialize',
                      disk_name: activeDisk,
                      confirm_token: initConfirm.trim(),
                      params: { table_type: initTableType },
                      summary: `${tr.initializeDisk}: ${activeDisk} (${initTableType.toUpperCase()})`,
                    })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-amber-700 text-amber-300' : 'border-amber-300 text-amber-800'}`}
                  >
                    {tr.addToQueue}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || initConfirm.trim() !== activeDisk}
                    onClick={() => refreshAfter(() => postJson(`/api/storage_manager/disks/${encodeURIComponent(activeDisk)}/initialize`, {
                      disk_name: activeDisk,
                      table_type: initTableType,
                      confirm_token: initConfirm.trim(),
                    }))}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white disabled:opacity-50"
                  >
                    {tr.runAction}
                  </button>
                </div>
              </>
            )}

            {modal === 'create' && (
              <>
                <h3 className="font-bold">{tr.createPartition}</h3>
                <p className="text-[11px] opacity-70">{tr.selectDisk}: <span className="font-mono">{activeDisk}</span></p>
                <label className="block text-[11px] space-y-1">
                  {tr.start}
                  <input value={partStart} onChange={(e) => setPartStart(e.target.value)} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                </label>
                <label className="block text-[11px] space-y-1">
                  {tr.end}
                  <input value={partEnd} onChange={(e) => setPartEnd(e.target.value)} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                </label>
                <label className="block text-[11px] space-y-1">
                  {tr.partitionType}
                  <select
                    value={partType}
                    onChange={(e) => setPartType(e.target.value as CreatePartitionType)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`}
                  >
                    {PARTITION_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{tr[opt.labelKey]}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-[11px] space-y-1">
                  {tr.confirmDiskName}
                  <input value={partConfirm} onChange={(e) => setPartConfirm(e.target.value)} placeholder={activeDisk} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{tr.cancel}</button>
                  <button
                    type="button"
                    disabled={actionLoading || partConfirm !== activeDisk}
                    onClick={() => enqueue({
                      op: 'create',
                      disk_name: activeDisk,
                      confirm_token: partConfirm,
                      params: { start: partStart, end: partEnd, partition_type: partType },
                      summary: `${tr.createPartition}: ${activeDisk} ${tr[PARTITION_TYPE_OPTIONS.find((o) => o.value === partType)?.labelKey || 'typeLinux']} (${partStart} → ${partEnd})`,
                    })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-cyan-700 text-cyan-300' : 'border-cyan-300 text-cyan-800'}`}
                  >
                    {tr.addToQueue}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || partConfirm !== activeDisk}
                    onClick={() => refreshAfter(() => postJson('/api/storage_manager/partitions/create', {
                      disk_name: activeDisk,
                      start: partStart,
                      end: partEnd,
                      partition_type: partType,
                      initialize_gpt: false,
                      confirm_token: partConfirm,
                    }))}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50"
                  >
                    {tr.runAction}
                  </button>
                </div>
              </>
            )}

            {modal === 'format' && selected && (
              <>
                <h3 className="font-bold">{tr.formatPartition}</h3>
                <p className="text-[11px] text-red-500">{tr.dataLossWarning}</p>
                <p className="text-[11px] font-mono">{selected.path}</p>
                <select value={formatFs} onChange={(e) => setFormatFs(e.target.value as FormatFsType)} className={`w-full rounded-lg border px-3 py-2 text-xs ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`}>
                  {FORMAT_FS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <input value={formatLabel} onChange={(e) => setFormatLabel(e.target.value)} placeholder={tr.labelOptional} className={`w-full rounded-lg border px-3 py-2 text-xs ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                <input value={formatConfirm} onChange={(e) => setFormatConfirm(e.target.value)} placeholder={tr.confirmPartName} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{tr.cancel}</button>
                  <button
                    type="button"
                    disabled={actionLoading || formatConfirm !== selected.name}
                    onClick={() => enqueue({
                      op: 'format',
                      device: selected.path,
                      confirm_token: formatConfirm,
                      params: { fstype: formatFs, label: formatLabel || undefined },
                      summary: `${tr.formatPartition}: ${selected.name} → ${formatFs}`,
                    })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-red-800 text-red-300' : 'border-red-300 text-red-800'}`}
                  >
                    {tr.addToQueue}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || formatConfirm !== selected.name}
                    onClick={() => refreshAfter(() => postJson('/api/storage_manager/format', {
                      device: selected.path,
                      fstype: formatFs,
                      label: formatLabel || undefined,
                      confirm_token: formatConfirm,
                    }))}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 text-white disabled:opacity-50"
                  >
                    {tr.runAction}
                  </button>
                </div>
              </>
            )}

            {modal === 'delete' && selected && (
              <>
                <h3 className="font-bold text-red-500">{tr.deletePartition}</h3>
                <p className="text-[11px]">{tr.deleteWarning}</p>
                <p className="text-[11px] font-mono">{selected.path}</p>
                <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={tr.confirmPartName} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                {selected.name && (
                  <p className="text-[10px] opacity-60 font-mono">
                    {language === 'vi' ? 'Gõ:' : 'Type:'} {selected.name}
                  </p>
                )}
                {actionErr && (
                  <p className="text-[11px] text-red-500 whitespace-pre-wrap">{actionErr}</p>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{tr.cancel}</button>
                  <button
                    type="button"
                    disabled={actionLoading || deleteConfirm.trim() !== (selected.name || '')}
                    onClick={() => enqueue({
                      op: 'delete',
                      device: selected.path,
                      confirm_token: deleteConfirm.trim(),
                      params: { partition_number: selected.number || null },
                      summary: `${tr.deletePartition}: ${selected.name}`,
                    })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-red-800 text-red-300' : 'border-red-300 text-red-800'}`}
                  >
                    {tr.addToQueue}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || deleteConfirm.trim() !== (selected.name || '')}
                    onClick={() => refreshAfter(() => postJson('/api/storage_manager/partitions/delete', {
                      device: selected.path,
                      confirm_token: deleteConfirm.trim(),
                      partition_number: selected.number || null,
                    }))}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 text-white disabled:opacity-50"
                  >
                    {tr.runAction}
                  </button>
                </div>
              </>
            )}

            {modal === 'resize' && selected && (
              <>
                <h3 className="font-bold">{tr.resizePartition}</h3>
                <p className="text-[11px] opacity-70">{tr.resizeHint}</p>
                <p className="text-[11px] font-mono">{selected.path}</p>
                <label className="block text-[11px] space-y-1">
                  {tr.end}
                  <input value={resizeEnd} onChange={(e) => setResizeEnd(e.target.value)} placeholder="100%" className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                </label>
                <label className="flex items-center gap-2 text-[11px]">
                  <input type="checkbox" checked={resizeGrowFs} onChange={(e) => setResizeGrowFs(e.target.checked)} />
                  {tr.growFilesystem}
                </label>
                <label className="flex items-center gap-2 text-[11px]">
                  <input type="checkbox" checked={resizeShrinkFs} onChange={(e) => setResizeShrinkFs(e.target.checked)} />
                  {tr.shrinkFilesystem}
                </label>
                <p className="text-[10px] opacity-60">{tr.shrinkHint}</p>
                <input value={resizeConfirm} onChange={(e) => setResizeConfirm(e.target.value)} placeholder={tr.confirmPartName} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{tr.cancel}</button>
                  <button
                    type="button"
                    disabled={actionLoading || resizeConfirm !== selected.name}
                    onClick={() => enqueue({
                      op: 'resize',
                      device: selected.path,
                      confirm_token: resizeConfirm,
                      params: { end: resizeEnd, grow_filesystem: resizeGrowFs, shrink_filesystem: resizeShrinkFs },
                      summary: `${tr.resizePartition}: ${selected.name} → ${resizeEnd}`,
                    })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-cyan-700 text-cyan-300' : 'border-cyan-300 text-cyan-800'}`}
                  >
                    {tr.addToQueue}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || resizeConfirm !== selected.name}
                    onClick={() => refreshAfter(() => postJson('/api/storage_manager/partitions/resize', {
                      device: selected.path,
                      end: resizeEnd,
                      grow_filesystem: resizeGrowFs,
                      shrink_filesystem: resizeShrinkFs,
                      confirm_token: resizeConfirm,
                    }))}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50"
                  >
                    {tr.runAction}
                  </button>
                </div>
              </>
            )}

            {modal === 'label' && selected && (
              <>
                <h3 className="font-bold">{tr.changeLabel}</h3>
                <p className="text-[11px] font-mono">{selected.path}</p>
                <input value={labelText} onChange={(e) => setLabelText(e.target.value)} className={`w-full rounded-lg border px-3 py-2 text-xs ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                <input value={labelConfirm} onChange={(e) => setLabelConfirm(e.target.value)} placeholder={tr.confirmPartName} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{tr.cancel}</button>
                  <button
                    type="button"
                    disabled={actionLoading || labelConfirm !== selected.name || !labelText.trim()}
                    onClick={() => enqueue({
                      op: 'label',
                      device: selected.path,
                      confirm_token: labelConfirm,
                      params: { label: labelText.trim() },
                      summary: `${tr.changeLabel}: ${selected.name} → ${labelText.trim()}`,
                    })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-cyan-700 text-cyan-300' : 'border-cyan-300 text-cyan-800'}`}
                  >
                    {tr.addToQueue}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || labelConfirm !== selected.name || !labelText.trim()}
                    onClick={() => refreshAfter(() => postJson('/api/storage_manager/partitions/label', {
                      device: selected.path,
                      label: labelText.trim(),
                      confirm_token: labelConfirm,
                    }))}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50"
                  >
                    {tr.runAction}
                  </button>
                </div>
              </>
            )}

            {modal === 'boot' && selected && (
              <>
                <h3 className="font-bold">{tr.setBoot}</h3>
                <p className="text-[11px] font-mono">{selected.path}</p>
                <p className="text-[10px] opacity-70">
                  {language === 'vi'
                    ? 'GPT: FAT32 → EFI (esp), ext4/xfs/btrfs → legacy_boot. exFAT/NTFS không hỗ trợ.'
                    : 'GPT: FAT32 → EFI (esp), ext4/xfs/btrfs → legacy_boot. exFAT/NTFS not supported.'}
                </p>
                <input value={bootConfirm} onChange={(e) => setBootConfirm(e.target.value)} placeholder={tr.confirmPartName} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                {selected.name && (
                  <p className="text-[10px] opacity-60 font-mono">{language === 'vi' ? 'Gõ:' : 'Type:'} {selected.name}</p>
                )}
                {actionErr && (
                  <p className="text-[11px] text-red-500 whitespace-pre-wrap">{actionErr}</p>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{tr.cancel}</button>
                  <button
                    type="button"
                    disabled={actionLoading || bootConfirm.trim() !== (selected.name || '')}
                    onClick={() => enqueue({
                      op: 'set_boot',
                      device: selected.path,
                      confirm_token: bootConfirm.trim(),
                      params: { active: true, partition_number: selected.number || null },
                      summary: `${tr.setBoot}: ${selected.name}`,
                    })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-cyan-700 text-cyan-300' : 'border-cyan-300 text-cyan-800'}`}
                  >
                    {tr.addToQueue}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || bootConfirm.trim() !== (selected.name || '')}
                    onClick={() => refreshAfter(() => postJson('/api/storage_manager/partitions/boot', {
                      device: selected.path,
                      active: true,
                      confirm_token: bootConfirm.trim(),
                      partition_number: selected.number || null,
                    }))}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50"
                  >
                    {tr.runAction}
                  </button>
                </div>
              </>
            )}

            {modal === 'mount' && selected && (
              <>
                <h3 className="font-bold">{tr.mountVolume}</h3>
                <p className="text-[11px] font-mono">{selected.path}</p>
                {selected.parttype_label && !selected.fstype && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    {selected.parttype_label}
                    {language === 'vi'
                      ? ' — chọn NTFS/exFAT bên dưới. Nếu ổ trống, Format trước rồi Mount.'
                      : ' — pick NTFS/exFAT below. If empty, Format first, then Mount.'}
                  </p>
                )}
                {actionErr && (
                  <p className="text-[11px] text-red-500 whitespace-pre-wrap">{actionErr}</p>
                )}
                <label className="block text-[11px] space-y-1">
                  {language === 'vi' ? 'Loại filesystem' : 'Filesystem type'}
                  <select
                    value={mountFs}
                    onChange={(e) => setMountFs(e.target.value as FormatFsType)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`}
                  >
                    {FORMAT_FS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <input value={mountPoint} onChange={(e) => setMountPoint(e.target.value)} placeholder={tr.mountpoint} className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-950 border-slate-700' : 'border-slate-200'}`} />
                <label className="flex items-center gap-2 text-[11px]">
                  <input type="checkbox" checked={mountPersist} onChange={(e) => setMountPersist(e.target.checked)} />
                  {tr.persistFstab}
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{tr.cancel}</button>
                  <button
                    type="button"
                    disabled={actionLoading || !mountPoint.trim() || !mountPoint.trim().startsWith('/')}
                    onClick={() => refreshAfter(() => postJson('/api/storage_manager/mount', {
                      device: selected.path,
                      mountpoint: mountPoint.trim(),
                      fstype: mountFs,
                      options: 'defaults',
                      persist_fstab: mountPersist,
                    }))}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50"
                  >
                    {tr.runAction}
                  </button>
                </div>
              </>
            )}

            {modal === 'unmount' && selected?.mountpoint && (
              <>
                <h3 className="font-bold">{tr.unmountVolume}</h3>
                <p className="text-[11px] font-mono">{selected.mountpoint}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>{tr.cancel}</button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => refreshAfter(() => postJson('/api/storage_manager/unmount', {
                      mountpoint: selected.mountpoint,
                      remove_fstab: false,
                    }))}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white disabled:opacity-50"
                  >
                    {tr.runAction}
                  </button>
                </div>
              </>
            )}
        </div>
      </WindowModal>
    </div>
  );
}
