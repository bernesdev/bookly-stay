import { appStorage } from '@/src/core/storage/appStorage';

import { LOCATION_STATUSES } from './location.types';

import type { LocationStatus } from './location.types';

const LOCATION_AUTO_REQUEST_BLOCKED_KEY = 'location_auto_request_blocked';
const LOCATION_LAST_STATUS_KEY = 'location_last_status';

export const shouldSkipAutoLocationRequest = (): boolean => {
  return appStorage.getBoolean(LOCATION_AUTO_REQUEST_BLOCKED_KEY) === true;
};

export const getStoredLocationStatus = (): LocationStatus | undefined => {
  const status = appStorage.getString(LOCATION_LAST_STATUS_KEY);

  if (!status) return undefined;

  return LOCATION_STATUSES.includes(status as LocationStatus)
    ? (status as LocationStatus)
    : undefined;
};

export const persistLocationStatus = (status: LocationStatus) => {
  appStorage.set(LOCATION_LAST_STATUS_KEY, status);
};

export const setAutoLocationRequestBlocked = (blocked: boolean) => {
  appStorage.set(LOCATION_AUTO_REQUEST_BLOCKED_KEY, blocked);
};
