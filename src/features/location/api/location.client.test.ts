import { http } from '@/src/core/api/http';

import {
  getLocationByCoordinates,
  getLocationById,
  getLocationsByQuery,
  getTopDestinations,
} from './location.client';

const mockGet = jest.fn();

jest.mock('@/src/core/api/http', () => ({
  http: jest.fn(),
}));

describe('location.client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (http as unknown as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it('should get locations by search query with limit and signal', async () => {
    const signal = new AbortController().signal;
    const page = {
      data: [{ id: 'loc-1', city: 'Rio', country: 'BR' }],
      meta: {
        limit: 5,
        itemCount: 1,
        hasNextPage: false,
        nextCursor: null,
      },
    };

    mockGet.mockResolvedValue({ data: page });

    const result = await getLocationsByQuery({
      query: 'ri',
      limit: 5,
      signal,
    });

    expect(http).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/locations/search', {
      params: { query: 'ri', limit: 5 },
      signal,
    });
    expect(result).toEqual(page);
  });

  it('should get location by id', async () => {
    const location = { id: 'loc-7', city: 'Tokyo', country: 'JP' };
    mockGet.mockResolvedValue({ data: location });

    const result = await getLocationById('loc-7');

    expect(http).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/locations/loc-7');
    expect(result).toEqual(location);
  });

  it('should get location by coordinates', async () => {
    const location = { id: 'loc-9', city: 'Lisbon', country: 'PT' };
    mockGet.mockResolvedValue({ data: location });

    const result = await getLocationByCoordinates({
      lat: '-22.9068',
      lng: '-43.1729',
    });

    expect(http).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/locations/coordinates', {
      params: { lat: '-22.9068', lng: '-43.1729' },
    });
    expect(result).toEqual(location);
  });

  it('should get top destinations with default limit when not provided', async () => {
    const page = {
      data: [{ id: 'dest-1', city: 'Paris' }],
      meta: {
        limit: 10,
        itemCount: 1,
        hasNextPage: true,
        nextCursor: 'cursor-2',
      },
    };

    mockGet.mockResolvedValue({ data: page });

    const result = await getTopDestinations({ cursor: 'cursor-1', limit: 10 });

    expect(http).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/locations/top-destinations', {
      params: { limit: 10, cursor: 'cursor-1' },
    });
    expect(result).toEqual(page);
  });

  it('should get top destinations with explicit limit and cursor', async () => {
    const page = {
      data: [{ id: 'dest-2', city: 'Rome' }],
      meta: {
        limit: 3,
        itemCount: 1,
        hasNextPage: false,
        nextCursor: null,
      },
    };

    mockGet.mockResolvedValue({ data: page });

    const result = await getTopDestinations({ limit: 3, cursor: undefined });

    expect(http).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/locations/top-destinations', {
      params: { limit: 3, cursor: undefined },
    });
    expect(result).toEqual(page);
  });
});
