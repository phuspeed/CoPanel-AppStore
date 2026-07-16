import CloudSync from './index';

export default {
  name: 'Cloud Sync',
  icon: 'Cloud',
  path: '/cloud-sync',
  description: 'Connect Google Drive and set up folder sync pairs.',
  component: CloudSync,
  windowMode: true,
  defaultWindowSize: { width: 1024, height: 680 },
  singleton: true,
};

