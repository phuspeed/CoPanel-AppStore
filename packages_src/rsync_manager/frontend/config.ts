/**
 * Rsync Manager — VPS move/clone/sync wizard (optional AppStore module).
 */
import RsyncManager from './index';

export default {
  name: 'Rsync Manager',
  icon: 'RefreshCw',
  path: '/rsync_manager',
  description: 'Wizard to move, clone, or sync files from this VPS to another over SSH (rsync).',
  component: RsyncManager,
  windowMode: true,
  defaultWindowSize: { width: 1100, height: 720 },
  singleton: true,
};
