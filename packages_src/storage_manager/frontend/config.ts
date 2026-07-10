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
  defaultWindowSize: { width: 1280, height: 720 },
  singleton: true,
};
