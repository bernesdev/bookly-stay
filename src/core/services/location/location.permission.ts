import * as Location from 'expo-location';

import type { LocationStatus } from './location.types';

export const requestLocationPermission = async (): Promise<LocationStatus> => {
  const { status, canAskAgain } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    return canAskAgain ? 'denied' : 'always_denied';
  }

  return 'granted';
};

export const hasLocationServicesEnabled = async (): Promise<boolean> => {
  return Location.hasServicesEnabledAsync();
};

export const getCurrentDeviceCoordinates = async () => {
  const position = await Location.getCurrentPositionAsync({});

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
};

export const isLocationEnabled = async (): Promise<boolean> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
};
