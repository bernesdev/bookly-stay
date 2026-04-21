import { BookingStatus } from './booking.types';

export const bookingKeys = {
  all: ['booking'] as const,
  bookingKey: (id: string) => [...bookingKeys.all, id] as const,
  bookingsKey: (limit: number, status: BookingStatus, cursor?: string) =>
    [...bookingKeys.all, limit, status, cursor] as const,
};
