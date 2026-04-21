import type { StayLocation } from '@/src/shared/types/stay.types';

export type LocationStatus =
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'always_denied'
  | 'disabled'
  | 'unavailable'
  | 'error';

export interface LocationResult {
  location?: StayLocation;
  status: LocationStatus;
  error?: unknown;
}

export const LOCATION_STATUSES: LocationStatus[] = [
  'undetermined',
  'granted',
  'denied',
  'always_denied',
  'disabled',
  'unavailable',
  'error',
];
