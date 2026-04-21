import i18n from '@/src/i18n';

import type { InternalAxiosRequestConfig } from 'axios';

export let tokenProvider: (() => Promise<string | null>) | null = null;

/**
 * Set the provider function that will be called to retrieve the auth token.
 */
export const setHttpTokenProvider = (
  provider: () => Promise<string | null>,
) => {
  tokenProvider = provider;
};

/**
 * Axios interceptor to attach the authentication token to outgoing requests.
 */
export const authInterceptor = async (config: InternalAxiosRequestConfig) => {
  if (tokenProvider) {
    try {
      const token = await tokenProvider();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(i18n.t('core.api.failedToGetAuthToken'), error);
    }
  }

  return config;
};
