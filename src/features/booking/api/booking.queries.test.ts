import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getBookingById, getBookings } from './booking.client';
import { bookingKeys } from './booking.keys';
import { useBookingQuery, useBookingsQuery } from './booking.queries';
import { BookingStatus } from './booking.types';

const mockUseInfiniteQuery = useInfiniteQuery as unknown as jest.Mock;
const mockUseQuery = useQuery as unknown as jest.Mock;
const mockGetBookings = getBookings as jest.Mock;
const mockGetBookingById = getBookingById as jest.Mock;

jest.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock('./booking.client', () => ({
  getBookings: jest.fn(),
  getBookingById: jest.fn(),
}));

describe('booking.queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should configure infinite bookings query with expected handlers', async () => {
    const infiniteResult = { data: { pages: [] } };
    const page = { meta: { nextCursor: 'next-cursor' } };
    mockUseInfiniteQuery.mockReturnValue(infiniteResult);
    mockGetBookings.mockResolvedValue(page);

    const result = useBookingsQuery({
      userId: 'user-1',
      limit: 10,
      status: BookingStatus.active,
    });

    const config = mockUseInfiniteQuery.mock.calls[0][0];

    const queryValue = await config.queryFn({ pageParam: 'cursor-1' });
    const nextCursor = config.getNextPageParam(page);

    expect(result).toBe(infiniteResult);
    expect(mockUseInfiniteQuery).toHaveBeenCalledTimes(1);
    expect(config.queryKey).toEqual(
      bookingKeys.bookingsKey('user-1', 10, BookingStatus.active, undefined),
    );
    expect(config.initialPageParam).toBeUndefined();
    expect(config.enabled).toBe(true);
    expect(mockGetBookings).toHaveBeenCalledWith({
      userId: 'user-1',
      limit: 10,
      status: BookingStatus.active,
      cursor: 'cursor-1',
    });
    expect(queryValue).toBe(page);
    expect(nextCursor).toBe('next-cursor');
  });

  it('should set enabled=false when query disables it', () => {
    mockUseInfiniteQuery.mockReturnValue({ data: undefined });

    useBookingsQuery({
      userId: 'user-2',
      limit: 5,
      status: BookingStatus.completed,
      enabled: false,
    });

    const config = mockUseInfiniteQuery.mock.calls[0][0];

    expect(config.enabled).toBe(false);
    expect(config.queryKey).toEqual(
      bookingKeys.bookingsKey('user-2', 5, BookingStatus.completed, undefined),
    );
  });

  it('should return undefined next page cursor when there is no next cursor', () => {
    mockUseInfiniteQuery.mockReturnValue({ data: undefined });

    useBookingsQuery({
      userId: 'user-3',
      limit: 10,
      status: BookingStatus.active,
    });

    const config = mockUseInfiniteQuery.mock.calls[0][0];

    expect(
      config.getNextPageParam({ meta: { nextCursor: null } }),
    ).toBeUndefined();
  });

  it('should configure booking-by-id query and call client with id', async () => {
    const queryResult = { data: { id: 'booking-7' } };
    const booking = { id: 'booking-7' };

    mockUseQuery.mockReturnValue(queryResult);
    mockGetBookingById.mockResolvedValue(booking);

    const result = useBookingQuery('booking-7');
    const config = mockUseQuery.mock.calls[0][0];
    const queryValue = await config.queryFn();

    expect(result).toBe(queryResult);
    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    expect(config.queryKey).toEqual(bookingKeys.bookingKey('booking-7'));
    expect(mockGetBookingById).toHaveBeenCalledWith('booking-7');
    expect(queryValue).toBe(booking);
  });
});
