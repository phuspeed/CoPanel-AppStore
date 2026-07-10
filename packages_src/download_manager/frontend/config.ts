import DownloadManager from './index';

export default {
  name: 'Download Manager',
  icon: 'Download',
  path: '/download-manager',
  component: DownloadManager,
  description: 'Direct links, Google Drive, custom file hosting, BitTorrent via aria2.',
  windowMode: true,
  defaultWindowSize: { width: 1120, height: 720 },
  singleton: true,
};
