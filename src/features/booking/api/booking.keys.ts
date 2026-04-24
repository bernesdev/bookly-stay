import { BookingStatus } from './booking.types';

export const bookingKeys = {
  all: ['booking'] as const,
  bookingKey: (id: string) => [...bookingKeys.all, id] as const,
  bookingsKey: (
    userId: string,
    limit: number,
    status: BookingStatus,
    cursor?: string,
  ) => [...bookingKeys.all, userId, limit, status, cursor] as const,
};
