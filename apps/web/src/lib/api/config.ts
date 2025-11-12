function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return 'http://localhost:3000/api';
  }
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

const rawBackendUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api';

export const BACKEND_API_BASE_URL = normalizeBaseUrl(rawBackendUrl);
export const WEB_API_BASE_URL = '/api';

