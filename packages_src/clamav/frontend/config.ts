import ClamAVDashboard from './index';

export default {
  name: 'ClamAV',
  icon: 'ShieldAlert',
  path: '/clamav',
  description: 'Antivirus status, signature updates, malware scans, and quarantine management.',
  component: ClamAVDashboard,
  windowMode: true,
  defaultWindowSize: { width: 960, height: 640 },
  singleton: true,
};
