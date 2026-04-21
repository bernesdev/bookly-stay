import {
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import {
  getLocationByCoordinates,
  getLocationById,
  getLocationsByQuery,
  getTopDestinations,
} from './location.client';
import { locationKeys } from './location.keys';
import {
  locationCoordinatesQueryOptions,
  useLocationCoordinatesQuery,
  useLocationSearchQuery,
  useLocationQuery,
  useTopDestinationsQuery,
} from './location.queries';

const mockUseInfiniteQuery = useInfiniteQuery as unknown as jest.Mock;
const mockUseQuery = useQuery as unknown as jest.Mock;
const mockQueryOptions = queryOptions as unknown as jest.Mock;

const mockGetLocationsByQuery = getLocationsByQuery as jest.Mock;
const mockGetLocationById = getLocationById as jest.Mock;
const mockGetLocationByCoordinates = getLocationByCoordinates as jest.Mock;
const mockGetTopDestinations = getTopDestinations as jest.Mock;

jest.mock('@tanstack/react-query', () => ({
  queryOptions: jest.fn((config) => config),
  useInfiniteQuery: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock('./location.client', () => ({
  getLocationsByQuery: jest.fn(),
  getLocationById: jest.fn(),
  getLocationByCoordinates: jest.fn(),
  getTopDestinations: jest.fn(),
}));

describe('location.queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build coordinates query options with expected key and query fn', async () => {
    const location = { id: 'loc-1', city: 'Rio' };
    mockGetLocationByCoordinates.mockResolvedValue(location);

    const config = locationCoordinatesQueryOptions({
      lat: '-22.9',
      lng: '-43.2',
    });
    const queryFn = config.queryFn;

    expect(queryFn).toBeDefined();

    const value = await queryFn!({
      queryKey: locationKeys.coordinatesKey('-22.9', '-43.2'),
    } as any);

    expect(mockQueryOptions).toHaveBeenCalledTimes(1);
    expect(config.queryKey).toEqual(
      locationKeys.coordinatesKey('-22.9', '-43.2'),
    );
    expect(mockGetLocationByCoordinates).toHaveBeenCalledWith({
      lat: '-22.9',
      lng: '-43.2',
    });
    expect(value).toBe(location);
  });

  it('should configure location search query with trimmed input and enabled=true', async () => {
    const queryResult = { data: [] };
    const locationsPage = {
      data: [{ id: 'loc-1' }],
      meta: { nextCursor: null },
    };
    mockUseQuery.mockReturnValue(queryResult);
    mockGetLocationsByQuery.mockResolvedValue(locationsPage);

    const result = useLocationSearchQuery({ query: '  rio  ', limit: 5 });
    const config = mockUseQuery.mock.calls[0][0];

    const signal = new AbortController().signal;
    const queryValue = await config.queryFn({ signal });

    expect(result).toBe(queryResult);
    expect(config.queryKey).toEqual(locationKeys.locationsKey('rio', 5));
    expect(config.enabled).toBe(true);
    expect(mockGetLocationsByQuery).toHaveBeenCalledWith({
      query: 'rio',
      limit: 5,
      signal,
    });
    expect(queryValue).toBe(locationsPage);
  });

  it('should disable location search query when trimmed input has less than two chars', () => {
    mockUseQuery.mockReturnValue({ data: undefined });

    useLocationSearchQuery({ query: ' a ', limit: 10 });

    const config = mockUseQuery.mock.calls[0][0];

    expect(config.queryKey).toEqual(locationKeys.locationsKey('a', 10));
    expect(config.enabled).toBe(false);
  });

  it('should configure location query by id and call client', async () => {
    const queryResult = { data: { id: 'loc-7' } };
    const location = { id: 'loc-7' };

    mockUseQuery.mockReturnValue(queryResult);
    mockGetLocationById.mockResolvedValue(location);

    const result = useLocationQuery('loc-7');
    const config = mockUseQuery.mock.calls[0][0];
    const queryValue = await config.queryFn();

    expect(result).toBe(queryResult);
    expect(config.queryKey).toEqual(locationKeys.locationKey('loc-7'));
    expect(mockGetLocationById).toHaveBeenCalledWith('loc-7');
    expect(queryValue).toBe(location);
  });

  it('should configure coordinates query hook using generated options', () => {
    const queryResult = { data: { id: 'loc-9' } };
    mockUseQuery.mockReturnValue(queryResult);

    const result = useLocationCoordinatesQuery({ lat: '-22.9', lng: '-43.2' });

    expect(result).toBe(queryResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: locationKeys.coordinatesKey('-22.9', '-43.2'),
      }),
    );
  });

  it('should configure top destinations infinite query with pagination handlers', async () => {
    const infiniteResult = { data: { pages: [] } };
    const page = {
      data: [{ id: 'dest-1' }],
      meta: { nextCursor: 'cursor-2' },
    };

    mockUseInfiniteQuery.mockReturnValue(infiniteResult);
    mockGetTopDestinations.mockResolvedValue(page);

    const result = useTopDestinationsQuery({ limit: 5 });
    const config = mockUseInfiniteQuery.mock.calls[0][0];

    const queryValue = await config.queryFn({ pageParam: 'cursor-1' });
    const nextCursor = config.getNextPageParam(page);

    expect(result).toBe(infiniteResult);
    expect(config.queryKey).toEqual(locationKeys.topDestinationsKey(5));
    expect(config.initialPageParam).toBeUndefined();
    expect(mockGetTopDestinations).toHaveBeenCalledWith({
      limit: 5,
      cursor: 'cursor-1',
    });
    expect(queryValue).toBe(page);
    expect(nextCursor).toBe('cursor-2');
  });

  it('should return undefined as next page cursor when top destinations has no next cursor', () => {
    mockUseInfiniteQuery.mockReturnValue({ data: undefined });

    useTopDestinationsQuery({ limit: 5 });

    const config = mockUseInfiniteQuery.mock.calls[0][0];

    expect(
      config.getNextPageParam({ meta: { nextCursor: null } }),
    ).toBeUndefined();
  });
});
