import WebdavDashboard from './index';

export default {
  name: 'WebDAV SMB',
  icon: 'FolderSync',
  path: '/webdav',
  description: 'WebDAV and SMB file sharing with panel root login.',
  component: WebdavDashboard,
  windowMode: true,
  defaultWindowSize: { width: 960, height: 640 },
  singleton: true,
};
