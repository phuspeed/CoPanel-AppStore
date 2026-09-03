import FtpManager from './index';

export default {
  name: 'FTP Manager',
  icon: 'Server',
  path: '/ftp-manager',
  description: 'External FTP, FTPS, and SFTP connections.',
  component: FtpManager,
  windowMode: true,
  defaultWindowSize: { width: 1100, height: 720 },
  singleton: true,
};
