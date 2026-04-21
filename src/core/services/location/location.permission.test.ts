import * as Location from 'expo-location';

import {
  getCurrentDeviceCoordinates,
  hasLocationServicesEnabled,
  isLocationEnabled,
  requestLocationPermission,
} from './location.permission';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  hasServicesEnabledAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(),
}));

const mockRequestForegroundPermissionsAsync =
  Location.requestForegroundPermissionsAsync as jest.Mock;
const mockHasServicesEnabledAsync =
  Location.hasServicesEnabledAsync as jest.Mock;
const mockGetCurrentPositionAsync =
  Location.getCurrentPositionAsync as jest.Mock;
const mockGetForegroundPermissionsAsync =
  Location.getForegroundPermissionsAsync as jest.Mock;

describe('location.permission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestLocationPermission', () => {
    it('should return granted when permission is granted', async () => {
      mockRequestForegroundPermissionsAsync.mockResolvedValue({
        status: 'granted',
        canAskAgain: true,
      });

      const result = await requestLocationPermission();

      expect(result).toBe('granted');
    });

    it('should return denied when permission is not granted and can ask again', async () => {
      mockRequestForegroundPermissionsAsync.mockResolvedValue({
        status: 'denied',
        canAskAgain: true,
      });

      const result = await requestLocationPermission();

      expect(result).toBe('denied');
    });

    it('should return always_denied when permission is not granted and cannot ask again', async () => {
      mockRequestForegroundPermissionsAsync.mockResolvedValue({
        status: 'denied',
        canAskAgain: false,
      });

      const result = await requestLocationPermission();

      expect(result).toBe('always_denied');
    });
  });

  describe('hasLocationServicesEnabled', () => {
    it('should return location services availability', async () => {
      mockHasServicesEnabledAsync.mockResolvedValue(true);

      const result = await hasLocationServicesEnabled();

      expect(result).toBe(true);
      expect(mockHasServicesEnabledAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCurrentDeviceCoordinates', () => {
    it('should map position coords to latitude and longitude', async () => {
      mockGetCurrentPositionAsync.mockResolvedValue({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
        },
      });

      const result = await getCurrentDeviceCoordinates();

      expect(mockGetCurrentPositionAsync).toHaveBeenCalledWith({});
      expect(result).toEqual({
        latitude: -23.5505,
        longitude: -46.6333,
      });
    });
  });

  describe('isLocationEnabled', () => {
    it('should return true when foreground permission is granted', async () => {
      mockGetForegroundPermissionsAsync.mockResolvedValue({
        status: 'granted',
      });

      const result = await isLocationEnabled();

      expect(result).toBe(true);
    });

    it('should return false when foreground permission is not granted', async () => {
      mockGetForegroundPermissionsAsync.mockResolvedValue({
        status: 'denied',
      });

      const result = await isLocationEnabled();

      expect(result).toBe(false);
    });
  });
});
