import {
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import { PageQuery } from '@/src/core/types/page.types';

import {
  getLocationByCoordinates,
  getLocationById,
  getLocationsByQuery,
  getTopDestinations,
} from './location.client';
import { locationKeys } from './location.keys';

import type { LocationCoordinatesQuery, LocationQuery } from './location.types';

export function locationCoordinatesQueryOptions({
  lat,
  lng,
}: LocationCoordinatesQuery) {
  return queryOptions({
    queryKey: locationKeys.coordinatesKey(lat, lng),
    queryFn: () => getLocationByCoordinates({ lat, lng }),
  });
}

export function useLocationSearchQuery({ query, limit = 10 }: LocationQuery) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: locationKeys.locationsKey(trimmed, limit),
    queryFn: ({ signal }) =>
      getLocationsByQuery({ query: trimmed, limit, signal }),
    enabled: trimmed.length >= 2,
  });
}

export function useLocationCoordinatesQuery({
  lat,
  lng,
}: LocationCoordinatesQuery) {
  return useQuery(locationCoordinatesQueryOptions({ lat, lng }));
}

export function useLocationQuery(id: string) {
  return useQuery({
    queryKey: locationKeys.locationKey(id),
    queryFn: () => getLocationById(id),
  });
}

export function useTopDestinationsQuery(query: Omit<PageQuery, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: locationKeys.topDestinationsKey(query.limit),
    queryFn: ({ pageParam }) =>
      getTopDestinations({ ...query, cursor: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor ?? undefined;
    },
    initialPageParam: undefined as string | undefined,
  });
}
