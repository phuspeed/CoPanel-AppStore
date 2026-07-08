import WebBrowser from './index';

export default {
  name: 'Web Browser',
  icon: 'Globe',
  path: '/web-browser',
  description:
    'Remote headless Chromium on the VPS — browse LAN-only services (router UI, internal webapps) from the panel.',
  component: WebBrowser,
};
