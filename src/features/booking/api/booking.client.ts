import { http } from '@/src/core/api/http';
import { Page } from '@/src/core/types/page.types';

import { Booking, BookingQuery, CreateBookingDto } from './booking.types';

export async function getBookings({
  limit,
  cursor,
  status,
}: BookingQuery): Promise<Page<Booking>> {
  const res = await http().get<Page<Booking>>('/bookings', {
    params: { limit, cursor, status },
  });
  return res.data;
}

export async function getBookingById(id: string): Promise<Booking> {
  const res = await http().get<Booking>(`/bookings/${id}`);
  return res.data;
}

export async function createBooking({
  accommodationId,
  checkIn,
  checkOut,
  rooms,
  adults,
  children,
}: CreateBookingDto): Promise<Booking> {
  const res = await http().post<Booking>('/bookings', {
    accommodationId,
    checkIn,
    checkOut,
    rooms,
    adults,
    children,
  });
  return res.data;
}
