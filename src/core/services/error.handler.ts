import crashlytics from '@react-native-firebase/crashlytics';

import { AppError } from '../errors/app.error';

/**
 * Handle errors by reporting them to Crashlytics if necessary.
 * In development mode, errors are not reported to avoid noise.
 *
 * @param error - The error object to handle
 * @param isFatal - Whether the error is fatal (optional, defaults to false)
 */
export function handleError(error: Error, isFatal: boolean = false) {
  if (__DEV__) return;

  if (error instanceof AppError && error.shouldReport) {
    crashlytics().recordError(error);
    return;
  }

  if (isFatal) {
    crashlytics().recordError(error);
  }
}

/**
 * Initialize global error handling for the app.
 */
export function initializeErrorHandling() {
  const originalErrorHandler = ErrorUtils.getGlobalHandler?.();

  ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
    handleError(error, isFatal);

    if (originalErrorHandler) {
      originalErrorHandler(error, isFatal);
    }
  });
}
