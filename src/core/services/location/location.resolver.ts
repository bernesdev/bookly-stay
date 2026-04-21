import { queryClient } from '@/src/core/api/queryClient';
import { locationCoordinatesQueryOptions } from '@/src/features/location/api/location.queries';

import {
  getCurrentDeviceCoordinates,
  hasLocationServicesEnabled,
  requestLocationPermission,
} from './location.permission';

import type { LocationResult } from './location.types';

/**
 * Gets the user's current location, handling permissions and service availability.
 * @returns A promise that resolves to the user's location or an error status.
 */
export const getUserCurrentLocation = async (): Promise<LocationResult> => {
  try {
    const permissionStatus = await requestLocationPermission();

    if (permissionStatus !== 'granted') {
      return { status: permissionStatus };
    }

    const hasServicesEnabled = await hasLocationServicesEnabled();

    if (!hasServicesEnabled) {
      return { status: 'disabled' };
    }

    const { latitude, longitude } = await getCurrentDeviceCoordinates();

    const lat = latitude.toString();
    const lng = longitude.toString();

    const location = await queryClient.ensureQueryData(
      locationCoordinatesQueryOptions({ lat, lng }),
    );

    if (!location) {
      return { status: 'unavailable' };
    }

    return {
      location: {
        id: location.id,
        city: location.city,
        country: location.country,
        lat: location.lat,
        lng: location.lng,
      },
      status: 'granted',
    };
  } catch (error: any) {
    if (
      error.message?.includes('unavailable') ||
      error.message?.includes('disabled') ||
      error.message?.includes('enabled')
    ) {
      return { status: 'disabled', error };
    }

    return { status: 'error', error };
  }
};
