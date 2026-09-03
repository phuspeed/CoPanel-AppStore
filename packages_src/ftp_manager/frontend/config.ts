import FtpManager from './index';

export default {
  name: 'FTP / SFTP Manager',
  icon: 'Server',
  path: '/ftp-manager',
  description: 'Manage external FTP, FTPS, and SFTP connections; browse and transfer files.',
  component: FtpManager,
  windowMode: true,
  defaultWindowSize: { width: 1100, height: 720 },
  singleton: true,
};
