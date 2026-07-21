import AudioStation from './index';

export default {
  name: 'Audio Player',
  icon: 'Music',
  path: '/audio-player',
  description: 'Music library — browse folders, play audio, scan metadata.',
  component: AudioStation,
  windowMode: true,
  keepMountedOnMinimize: true,
  defaultWindowSize: { width: 1200, height: 760 },
  singleton: true,
};
