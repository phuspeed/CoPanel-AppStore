/** Shared partition layout types for storage_manager frontend. */

export interface WizardPartition {
  number: number;
  name?: string | null;
  path?: string | null;
  start_mib?: number | null;
  end_mib?: number | null;
  size_bytes?: number | null;
  fstype?: string | null;
  fstype_label?: string | null;
  mountpoint?: string | null;
  flags?: string[];
  is_boot?: boolean;
  label?: string | null;
  used_percent?: number | null;
  used_bytes?: number | null;
  free_bytes?: number | null;
  is_mounted?: boolean;
  mountable?: boolean;
  parttype_label?: string | null;
}

export interface DiskPartitionDetail {
  disk: string;
  is_system_disk: boolean;
  size_bytes: number;
  model?: string;
  partition_table?: string;
  disk_state?: 'uninitialized' | 'empty_table' | 'partitioned';
  partitions: WizardPartition[];
  unallocated: Array<{ start_mib: number; end_mib: number; size_mib: number }>;
}

export type CreatePartitionType = 'linux' | 'efi' | 'swap' | 'ntfs' | 'lvm';
