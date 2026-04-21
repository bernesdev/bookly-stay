import { queryClient } from '@/src/core/api/queryClient';
import { locationCoordinatesQueryOptions } from '@/src/features/location/api/location.queries';

import {
  getCurrentDeviceCoordinates,
  hasLocationServicesEnabled,
  requestLocationPermission,
} from './location.permission';
import { getUserCurrentLocation } from './location.resolver';

jest.mock('./location.permission', () => ({
  requestLocationPermission: jest.fn(),
  hasLocationServicesEnabled: jest.fn(),
  getCurrentDeviceCoordinates: jest.fn(),
}));

jest.mock('@/src/core/api/queryClient', () => ({
  queryClient: {
    ensureQueryData: jest.fn(),
  },
}));

jest.mock('@/src/features/location/api/location.queries', () => ({
  locationCoordinatesQueryOptions: jest.fn(),
}));

const mockRequestLocationPermission = requestLocationPermission as jest.Mock;
const mockHasLocationServicesEnabled = hasLocationServicesEnabled as jest.Mock;
const mockGetCurrentDeviceCoordinates =
  getCurrentDeviceCoordinates as jest.Mock;
const mockEnsureQueryData = queryClient.ensureQueryData as jest.Mock;
const mockLocationCoordinatesQueryOptions =
  locationCoordinatesQueryOptions as jest.Mock;

describe('location.resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationCoordinatesQueryOptions.mockReturnValue({
      queryKey: ['location'],
    });
  });

  it('should return permission status when permission is not granted', async () => {
    mockRequestLocationPermission.mockResolvedValue('denied');

    const result = await getUserCurrentLocation();

    expect(result).toEqual({ status: 'denied' });
    expect(mockHasLocationServicesEnabled).not.toHaveBeenCalled();
    expect(mockEnsureQueryData).not.toHaveBeenCalled();
  });

  it('should return disabled when location services are turned off', async () => {
    mockRequestLocationPermission.mockResolvedValue('granted');
    mockHasLocationServicesEnabled.mockResolvedValue(false);

    const result = await getUserCurrentLocation();

    expect(result).toEqual({ status: 'disabled' });
    expect(mockGetCurrentDeviceCoordinates).not.toHaveBeenCalled();
  });

  it('should return unavailable when coordinates cannot be resolved to a location', async () => {
    mockRequestLocationPermission.mockResolvedValue('granted');
    mockHasLocationServicesEnabled.mockResolvedValue(true);
    mockGetCurrentDeviceCoordinates.mockResolvedValue({
      latitude: -23.5505,
      longitude: -46.6333,
    });
    mockEnsureQueryData.mockResolvedValue(null);

    const result = await getUserCurrentLocation();

    expect(mockLocationCoordinatesQueryOptions).toHaveBeenCalledWith({
      lat: '-23.5505',
      lng: '-46.6333',
    });
    expect(result).toEqual({ status: 'unavailable' });
  });

  it('should return granted with mapped location when all steps succeed', async () => {
    mockRequestLocationPermission.mockResolvedValue('granted');
    mockHasLocationServicesEnabled.mockResolvedValue(true);
    mockGetCurrentDeviceCoordinates.mockResolvedValue({
      latitude: -23.5505,
      longitude: -46.6333,
    });
    mockEnsureQueryData.mockResolvedValue({
      id: 'loc-1',
      city: 'Sao Paulo',
      country: 'Brazil',
      lat: '-23.5505',
      lng: '-46.6333',
      ignored: true,
    });

    const result = await getUserCurrentLocation();

    expect(result).toEqual({
      status: 'granted',
      location: {
        id: 'loc-1',
        city: 'Sao Paulo',
        country: 'Brazil',
        lat: '-23.5505',
        lng: '-46.6333',
      },
    });
  });

  it('should return disabled when resolver throws service unavailable error', async () => {
    const error = new Error('location services unavailable');
    mockRequestLocationPermission.mockRejectedValue(error);

    const result = await getUserCurrentLocation();

    expect(result).toEqual({ status: 'disabled', error });
  });

  it('should return error when resolver throws unknown error', async () => {
    const error = new Error('unexpected failure');
    mockRequestLocationPermission.mockRejectedValue(error);

    const result = await getUserCurrentLocation();

    expect(result).toEqual({ status: 'error', error });
  });
});
