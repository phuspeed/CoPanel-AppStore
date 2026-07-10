import CloudflareDdns from './index';

export default {
  name: 'Cloudflare DDNS',
  icon: 'Cloud',
  path: '/cloudflare-ddns',
  component: CloudflareDdns,
  description: 'Dynamic DNS, Cloudflare DNS records, and Cloudflare Tunnel.',
  windowMode: true,
  defaultWindowSize: { width: 1000, height: 680 },
  singleton: true,
};
