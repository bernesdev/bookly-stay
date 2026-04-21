import { appStorage } from '@/src/core/storage/appStorage';

import {
  getStoredLocationStatus,
  persistLocationStatus,
  setAutoLocationRequestBlocked,
  shouldSkipAutoLocationRequest,
} from './location.storage';

jest.mock('@/src/core/storage/appStorage', () => ({
  appStorage: {
    getBoolean: jest.fn(),
    getString: jest.fn(),
    set: jest.fn(),
  },
}));

const mockedAppStorage = appStorage as jest.Mocked<typeof appStorage>;

describe('location.storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shouldSkipAutoLocationRequest', () => {
    it('should return true when auto request flag is true', () => {
      mockedAppStorage.getBoolean.mockReturnValue(true);

      const result = shouldSkipAutoLocationRequest();

      expect(result).toBe(true);
      expect(mockedAppStorage.getBoolean).toHaveBeenCalledWith(
        'location_auto_request_blocked',
      );
    });

    it('should return false when auto request flag is false', () => {
      mockedAppStorage.getBoolean.mockReturnValue(false);

      const result = shouldSkipAutoLocationRequest();

      expect(result).toBe(false);
    });

    it('should return false when auto request flag is missing', () => {
      mockedAppStorage.getBoolean.mockReturnValue(undefined);

      const result = shouldSkipAutoLocationRequest();

      expect(result).toBe(false);
    });
  });

  describe('getStoredLocationStatus', () => {
    it('should return undefined when there is no stored status', () => {
      mockedAppStorage.getString.mockReturnValue(undefined);

      const result = getStoredLocationStatus();

      expect(result).toBeUndefined();
      expect(mockedAppStorage.getString).toHaveBeenCalledWith(
        'location_last_status',
      );
    });

    it('should return stored status when value is valid', () => {
      mockedAppStorage.getString.mockReturnValue('granted');

      const result = getStoredLocationStatus();

      expect(result).toBe('granted');
    });

    it('should return undefined when stored status is invalid', () => {
      mockedAppStorage.getString.mockReturnValue('invalid-status');

      const result = getStoredLocationStatus();

      expect(result).toBeUndefined();
    });
  });

  describe('persistLocationStatus', () => {
    it('should persist location status in storage', () => {
      persistLocationStatus('denied');

      expect(mockedAppStorage.set).toHaveBeenCalledWith(
        'location_last_status',
        'denied',
      );
    });
  });

  describe('setAutoLocationRequestBlocked', () => {
    it('should persist auto location request blocked flag', () => {
      setAutoLocationRequestBlocked(true);

      expect(mockedAppStorage.set).toHaveBeenCalledWith(
        'location_auto_request_blocked',
        true,
      );
    });
  });
});
