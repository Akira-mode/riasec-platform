import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { BACKEND_API_BASE_URL, WEB_API_BASE_URL } from './config';

export class ApiClientError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

type CreateInstanceOptions = {
  withCredentials?: boolean;
};

function extractErrorMessage(error: AxiosError<any>): string {
  const payload = error.response?.data;

  if (payload) {
    if (typeof payload.message === 'string') {
      return payload.message;
    }

    if (Array.isArray(payload.message)) {
      return payload.message.join(', ');
    }
  }

  return error.message || 'Erreur inattendue.';
}

function createAxiosInstance(
  baseURL: string,
  options: CreateInstanceOptions = {}
): AxiosInstance {
  const instance = axios.create({
    baseURL,
    withCredentials: options.withCredentials ?? false,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
      const status = error.response?.status;
      const data = error.response?.data;
      const message = extractErrorMessage(error);
      return Promise.reject(new ApiClientError(message, status, data));
    }
  );

  return instance;
}

function attachAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token?: string
): InternalAxiosRequestConfig {
  if (!token) {
    return config;
  }

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set('Authorization', `Bearer ${token}`);
    return config;
  }

  const headers = new AxiosHeaders(config.headers ?? {});
  headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;

  return config;
}

export const webApiClient = createAxiosInstance(WEB_API_BASE_URL, {
  withCredentials: true,
});

export function createBackendApiClient(accessToken?: string): AxiosInstance {
  const client = createAxiosInstance(BACKEND_API_BASE_URL);

  client.interceptors.request.use((config) =>
    attachAuthorizationHeader(config, accessToken)
  );

  return client;
}

export const backendApiClient = createBackendApiClient();

