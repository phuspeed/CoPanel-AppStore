export type Lang = 'en' | 'vi';

export const TEXT: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    go: string;
    again: string;
    stopHint: string;
    ping: string;
    jitter: string;
    download: string;
    upload: string;
    mbps: string;
    ms: string;
    phaseIdle: string;
    phasePing: string;
    phaseDownload: string;
    phaseUpload: string;
    phaseDone: string;
    history: string;
    noHistory: string;
    server: string;
    client: string;
    error: string;
    running: string;
    busy: string;
    clearHint: string;
  }
> = {
  en: {
    title: 'Speedtest',
    subtitle: 'Measure this VPS uplink — download, upload, and latency.',
    go: 'GO',
    again: 'Test again',
    stopHint: 'Test runs on the server, not your browser.',
    ping: 'Ping',
    jitter: 'Jitter',
    download: 'Download',
    upload: 'Upload',
    mbps: 'Mbps',
    ms: 'ms',
    phaseIdle: 'Ready',
    phasePing: 'Measuring latency…',
    phaseDownload: 'Testing download…',
    phaseUpload: 'Testing upload…',
    phaseDone: 'Complete',
    history: 'Recent results',
    noHistory: 'No tests yet — press GO to start.',
    server: 'Server',
    client: 'VPS egress',
    error: 'Test failed',
    running: 'Running',
    busy: 'A test is already running.',
    clearHint: 'Results stay on this VPS only.',
  },
  vi: {
    title: 'Speedtest',
    subtitle: 'Đo tốc độ mạng của VPS — tải xuống, tải lên và độ trễ.',
    go: 'BẮT ĐẦU',
    again: 'Kiểm tra lại',
    stopHint: 'Bài test chạy trên server, không phải trình duyệt của bạn.',
    ping: 'Ping',
    jitter: 'Jitter',
    download: 'Tải xuống',
    upload: 'Tải lên',
    mbps: 'Mbps',
    ms: 'ms',
    phaseIdle: 'Sẵn sàng',
    phasePing: 'Đang đo độ trễ…',
    phaseDownload: 'Đang đo tải xuống…',
    phaseUpload: 'Đang đo tải lên…',
    phaseDone: 'Hoàn tất',
    history: 'Kết quả gần đây',
    noHistory: 'Chưa có bài test — nhấn BẮT ĐẦU.',
    server: 'Máy chủ',
    client: 'IP ra của VPS',
    error: 'Kiểm tra thất bại',
    running: 'Đang chạy',
    busy: 'Đang có bài test khác chạy.',
    clearHint: 'Kết quả chỉ lưu trên VPS này.',
  },
};
