import SpeedtestApp from './index';

export default {
  name: 'Speedtest',
  icon: 'Gauge',
  path: '/speedtest',
  description: 'Measure VPS download, upload, and latency like a classic speed test.',
  component: SpeedtestApp,
  windowMode: true,
  defaultWindowSize: { width: 720, height: 640 },
  singleton: true,
};
