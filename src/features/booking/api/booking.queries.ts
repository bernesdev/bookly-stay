import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getBookingById, getBookings } from './booking.client';
import { bookingKeys } from './booking.keys';
import { BookingQuery } from './booking.types';

export function useBookingsQuery(
  query: Omit<BookingQuery, 'cursor'> & { enabled?: boolean },
) {
  return useInfiniteQuery({
    queryKey: bookingKeys.bookingsKey(query.limit, query.status, undefined),
    queryFn: ({ pageParam }) => getBookings({ ...query, cursor: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor ?? undefined;
    },
    initialPageParam: undefined as string | undefined,
    enabled: query.enabled ?? true,
  });
}

export function useBookingQuery(id: string) {
  return useQuery({
    queryKey: bookingKeys.bookingKey(id),
    queryFn: () => getBookingById(id),
  });
}
