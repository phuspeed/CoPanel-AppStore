/**
 * CoAgent Module - Configuration (AppStore extension)
 */
import CoAgentDashboard from './index';

export default {
  name: 'CoAgent',
  icon: 'Bot',
  path: '/coagent',
  description: 'AI SysAdmin assistant for diagnosing and managing your VPS with human-in-the-loop actions.',
  component: CoAgentDashboard,
  windowMode: true,
  defaultWindowSize: { width: 980, height: 700 },
  singleton: true,
};
