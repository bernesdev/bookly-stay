import dayjs from 'dayjs';

import { getUserCurrentLocation } from '../../core/services/location/location.resolver';
import {
  getStoredLocationStatus,
  persistLocationStatus,
  setAutoLocationRequestBlocked,
  shouldSkipAutoLocationRequest,
} from '../../core/services/location/location.storage';

import { useStayStore } from './useStayStore';

jest.mock('../../core/services/location/location.resolver', () => ({
  getUserCurrentLocation: jest.fn(),
}));

jest.mock('../../core/services/location/location.storage', () => ({
  getStoredLocationStatus: jest.fn(),
  persistLocationStatus: jest.fn(),
  setAutoLocationRequestBlocked: jest.fn(),
  shouldSkipAutoLocationRequest: jest.fn(),
}));

const mockGetUserCurrentLocation = getUserCurrentLocation as jest.Mock;
const mockGetStoredLocationStatus = getStoredLocationStatus as jest.Mock;
const mockPersistLocationStatus = persistLocationStatus as jest.Mock;
const mockSetAutoLocationRequestBlocked =
  setAutoLocationRequestBlocked as jest.Mock;
const mockShouldSkipAutoLocationRequest =
  shouldSkipAutoLocationRequest as jest.Mock;

describe('useStayStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStayStore.setState({
      locationStatus: 'undetermined',
      geoLocation: undefined,
      stay: {
        location: undefined,
        dates: {
          checkIn: dayjs(),
          checkOut: dayjs().add(1, 'day'),
        },
        occupancy: {
          rooms: 1,
          adults: 1,
          children: 0,
        },
      },
    });

    mockShouldSkipAutoLocationRequest.mockReturnValue(false);
    mockGetStoredLocationStatus.mockReturnValue(undefined);
  });

  it('should initialize with default stay state', () => {
    const state = useStayStore.getState();

    expect(state.locationStatus).toBe('undetermined');
    expect(state.geoLocation).toBeUndefined();
    expect(state.stay.location).toBeUndefined();
    expect(state.stay.occupancy).toEqual({ rooms: 1, adults: 1, children: 0 });
    expect(state.stay.dates.checkIn.isValid()).toBe(true);
    expect(state.stay.dates.checkOut.isValid()).toBe(true);
  });

  it('should merge partial stay updates with setStay', () => {
    useStayStore.setState({
      stay: {
        location: {
          id: 'loc-1',
          city: 'Sao Paulo',
          country: 'Brazil',
          lat: '-23.55',
          lng: '-46.63',
        },
        dates: {
          checkIn: dayjs('2026-05-01'),
          checkOut: dayjs('2026-05-03'),
        },
        occupancy: { rooms: 1, adults: 2, children: 0 },
      },
    });

    useStayStore.getState().setStay({
      occupancy: { rooms: 2, adults: 3, children: 1 },
    });

    const state = useStayStore.getState();

    expect(state.stay.location?.id).toBe('loc-1');
    expect(state.stay.dates.checkIn.format('YYYY-MM-DD')).toBe('2026-05-01');
    expect(state.stay.occupancy).toEqual({ rooms: 2, adults: 3, children: 1 });
  });

  it('should skip auto request and set denied from stored status', async () => {
    mockShouldSkipAutoLocationRequest.mockReturnValue(true);
    mockGetStoredLocationStatus.mockReturnValue('denied');

    const result = await useStayStore.getState().setGeoLocation();

    expect(result).toBe('denied');
    expect(useStayStore.getState().locationStatus).toBe('denied');
    expect(mockGetUserCurrentLocation).not.toHaveBeenCalled();
    expect(mockPersistLocationStatus).not.toHaveBeenCalled();
  });

  it('should skip auto request and keep always_denied when stored status is always_denied', async () => {
    mockShouldSkipAutoLocationRequest.mockReturnValue(true);
    mockGetStoredLocationStatus.mockReturnValue('always_denied');

    const result = await useStayStore.getState().setGeoLocation();

    expect(result).toBe('always_denied');
    expect(useStayStore.getState().locationStatus).toBe('always_denied');
    expect(mockGetUserCurrentLocation).not.toHaveBeenCalled();
  });

  it('should persist status and store location on granted result', async () => {
    mockGetUserCurrentLocation.mockResolvedValue({
      status: 'granted',
      location: {
        id: 'loc-2',
        city: 'Rio',
        country: 'Brazil',
        lat: '-22.90',
        lng: '-43.20',
      },
    });

    const result = await useStayStore.getState().setGeoLocation();

    expect(result).toBe('granted');
    expect(mockPersistLocationStatus).toHaveBeenCalledWith('granted');
    expect(mockSetAutoLocationRequestBlocked).toHaveBeenCalledWith(false);
    expect(useStayStore.getState().locationStatus).toBe('granted');
    expect(useStayStore.getState().geoLocation).toEqual({
      id: 'loc-2',
      city: 'Rio',
      country: 'Brazil',
      lat: '-22.90',
      lng: '-43.20',
    });
    expect(useStayStore.getState().stay.location?.id).toBe('loc-2');
  });

  it('should persist denied status and block auto request when denied', async () => {
    mockGetUserCurrentLocation.mockResolvedValue({
      status: 'denied',
    });

    const result = await useStayStore.getState().setGeoLocation();

    expect(result).toBe('denied');
    expect(mockPersistLocationStatus).toHaveBeenCalledWith('denied');
    expect(mockSetAutoLocationRequestBlocked).toHaveBeenCalledWith(true);
    expect(useStayStore.getState().locationStatus).toBe('denied');
    expect(useStayStore.getState().geoLocation).toBeUndefined();
  });

  it('should set status without geo location when result has no location', async () => {
    mockGetUserCurrentLocation.mockResolvedValue({
      status: 'disabled',
    });

    const result = await useStayStore.getState().setGeoLocation();

    expect(result).toBe('disabled');
    expect(mockPersistLocationStatus).toHaveBeenCalledWith('disabled');
    expect(mockSetAutoLocationRequestBlocked).not.toHaveBeenCalled();
    expect(useStayStore.getState().locationStatus).toBe('disabled');
    expect(useStayStore.getState().geoLocation).toBeUndefined();
  });
});
