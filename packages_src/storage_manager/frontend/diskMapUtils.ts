/** Disk map geometry helpers for bidirectional drag-resize. */

import type { DiskPartitionDetail, WizardPartition } from './partitionTypes';

const SHRINKABLE_FS = new Set(['ext4', 'ext3', 'ext2', 'ntfs']);

export interface ResizeBounds {
  minEndMib: number;
  maxEndMib: number;
  currentEndMib: number;
  canExtend: boolean;
  canShrink: boolean;
  canResize: boolean;
}

export function computeResizeBounds(
  part: WizardPartition,
  layout: DiskPartitionDetail,
): ResizeBounds {
  const startMib = part.start_mib ?? 1;
  const currentEnd = part.end_mib ?? startMib;
  const diskEndMib = layout.size_bytes / (1024 * 1024);
  let maxEnd = diskEndMib;

  for (const other of layout.partitions) {
    if (other.path === part.path) continue;
    const otherStart = other.start_mib ?? 0;
    if (otherStart > currentEnd + 0.5 && otherStart < maxEnd + 0.5) {
      maxEnd = otherStart - 1;
    }
  }

  for (const gap of layout.unallocated || []) {
    const gapStart = gap.start_mib;
    const gapEnd = gap.end_mib;
    if (gapEnd <= currentEnd + 0.5) continue;
    if (gapStart <= currentEnd + 1 && gapEnd > currentEnd) {
      maxEnd = Math.max(maxEnd, gapEnd);
    }
  }

  const usedMib = part.used_bytes ? Math.ceil(part.used_bytes / (1024 * 1024)) : 0;
  const minShrinkEnd = startMib + Math.max(64, Math.ceil(usedMib * 1.12) + 32);
  const fs = (part.fstype || '').toLowerCase();
  const canShrinkFs = !fs || SHRINKABLE_FS.has(fs);
  const canShrink = Boolean(!part.is_mounted && canShrinkFs && minShrinkEnd < currentEnd - 1);
  const maxEndMib = Math.floor(maxEnd);
  const minEndMib = canShrink ? Math.floor(minShrinkEnd) : Math.ceil(currentEnd);
  const canExtend = maxEndMib > currentEnd + 0.5;

  return {
    minEndMib,
    maxEndMib,
    currentEndMib: currentEnd,
    canExtend,
    canShrink,
    canResize: canExtend || canShrink,
  };
}

export function clientXToEndMib(
  clientX: number,
  mapRect: DOMRect,
  diskSizeMib: number,
): number {
  const ratio = (clientX - mapRect.left) / Math.max(1, mapRect.width);
  return Math.round(Math.max(1, Math.min(diskSizeMib, ratio * diskSizeMib)));
}

export function clampEndMib(value: number, bounds: ResizeBounds): number {
  return Math.max(bounds.minEndMib, Math.min(bounds.maxEndMib, Math.round(value)));
}

export function formatMibLabel(mib: number): string {
  if (mib >= 1024) {
    const gib = mib / 1024;
    return gib >= 10 ? `${Math.round(gib)}GiB` : `${gib.toFixed(1)}GiB`;
  }
  return `${mib}MiB`;
}

export function isShrinkEnd(currentEndMib: number, newEndMib: number): boolean {
  return newEndMib < currentEndMib - 0.5;
}
