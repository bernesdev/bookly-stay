import { http } from '@/src/core/api/http';
import { makeAccommodation } from '@/testing/factories/accommodation.factory';

import {
  getAccommodations,
  getAccommodationById,
} from './accommodation.client';

jest.mock('@/src/core/api/http');

const mockGet = jest.fn();
(http as jest.Mock).mockReturnValue({ get: mockGet });

describe('accommodation.client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (http as jest.Mock).mockReturnValue({ get: mockGet });
  });

  describe('getAccommodations', () => {
    it('should call the correct endpoint with params and return data', async () => {
      const page = { items: [makeAccommodation()], nextCursor: null };
      mockGet.mockResolvedValue({ data: page });

      const result = await getAccommodations({
        limit: 10,
        cursor: undefined,
        locationId: 'loc-1',
        sortBy: 'price_asc',
      });

      expect(mockGet).toHaveBeenCalledWith('/accommodations', {
        params: {
          limit: 10,
          cursor: undefined,
          locationId: 'loc-1',
          sortBy: 'price_asc',
        },
      });
      expect(result).toEqual(page);
    });
  });

  describe('getAccommodationById', () => {
    it('should call the correct endpoint and return data', async () => {
      const accommodation = makeAccommodation({ id: 'acc-42' });
      mockGet.mockResolvedValue({ data: accommodation });

      const result = await getAccommodationById('acc-42');

      expect(mockGet).toHaveBeenCalledWith('/accommodations/acc-42');
      expect(result).toEqual(accommodation);
    });
  });
});
