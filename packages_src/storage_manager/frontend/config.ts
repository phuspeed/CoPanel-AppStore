/**
 * Storage Manager Module - Configuration
 */
import StorageManagerDashboard from './index';

export default {
  name: 'Storage Manager',
  icon: 'HardDrive',
  path: '/storage-manager',
  description: 'Monitor disks, volumes, and drive health',
  component: StorageManagerDashboard,
  windowMode: true,
  defaultWindowSize: { width: 1100, height: 700 },
  singleton: true,
};
