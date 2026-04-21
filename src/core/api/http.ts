import axios from 'axios';

import { authInterceptor, errorInterceptor } from './interceptors';

type HttpOptions = {
  baseURL?: string;
};

export const http = ({ baseURL }: HttpOptions = {}) => {
  const instance = axios.create({
    baseURL: baseURL ?? process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(authInterceptor);

  instance.interceptors.response.use((response) => response, errorInterceptor);

  return instance;
};
