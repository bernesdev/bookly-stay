import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getAccommodationById,
  getAccommodations,
} from './accommodation.client';
import { accommodationKeys } from './accommodation.keys';
import { AccommodationQuery } from './accommodation.types';

export function useAccommodationsQuery(
  query: Omit<AccommodationQuery, 'cursor'>,
) {
  return useInfiniteQuery({
    queryKey: accommodationKeys.accommodationsKey(
      query.locationId,
      query.limit,
      undefined,
      query.sortBy,
      query.dates,
      query.occupancy,
    ),
    queryFn: ({ pageParam }) =>
      getAccommodations({ ...query, cursor: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor ?? undefined;
    },
    initialPageParam: undefined as string | undefined,
  });
}

export function useAccommodationQuery(id: string) {
  return useQuery({
    queryKey: accommodationKeys.accommodationKey(id),
    queryFn: () => getAccommodationById(id),
  });
}
