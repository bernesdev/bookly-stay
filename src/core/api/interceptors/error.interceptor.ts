let onUnauthorizedHandler: (() => void) | null = null;

/**
 * Set the handler function that will be called when a 401 (Unauthorized) response is received.
 */
export const setOnUnauthorizedHandler = (handler: () => void) => {
  onUnauthorizedHandler = handler;
};

/**
 * Axios interceptor to handle errors globally.
 */
export const errorInterceptor = (error: any) => {
  if (error.response?.status === 401 && onUnauthorizedHandler) {
    onUnauthorizedHandler();
  }
  return Promise.reject(error);
};
