import { http } from '@/src/core/api/http';

import { createBooking, getBookingById, getBookings } from './booking.client';
import { BookingStatus } from './booking.types';

const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('@/src/core/api/http', () => ({
  http: jest.fn(),
}));

describe('booking.client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (http as unknown as jest.Mock).mockReturnValue({
      get: mockGet,
      post: mockPost,
    });
  });

  it('should get bookings list with pagination params', async () => {
    const page = {
      data: [{ id: 'booking-1' }],
      meta: {
        limit: 10,
        itemCount: 1,
        hasNextPage: true,
        nextCursor: 'cursor-2',
      },
    };
    mockGet.mockResolvedValue({ data: page });

    const result = await getBookings({
      limit: 10,
      cursor: 'cursor-1',
      status: BookingStatus.active,
    });

    expect(http).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/bookings', {
      params: {
        limit: 10,
        cursor: 'cursor-1',
        status: BookingStatus.active,
      },
    });
    expect(result).toEqual(page);
  });

  it('should get booking by id', async () => {
    const booking = { id: 'booking-7' };
    mockGet.mockResolvedValue({ data: booking });

    const result = await getBookingById('booking-7');

    expect(http).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/bookings/booking-7');
    expect(result).toEqual(booking);
  });

  it('should create booking with expected payload', async () => {
    const createdBooking = { id: 'booking-9' };
    const payload = {
      accommodationId: 'acc-1',
      checkIn: '2026-04-20',
      checkOut: '2026-04-23',
      rooms: 2,
      adults: 3,
      children: 1,
    };
    mockPost.mockResolvedValue({ data: createdBooking });

    const result = await createBooking(payload);

    expect(http).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith('/bookings', payload);
    expect(result).toEqual(createdBooking);
  });
});
