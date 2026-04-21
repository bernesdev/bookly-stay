import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/src/core/api/queryClient';

import { createBooking } from './booking.client';
import { bookingKeys } from './booking.keys';
import { useCreateBookingMutation } from './booking.mutations';

const mockUseMutation = useMutation as unknown as jest.Mock;
const mockCreateBooking = createBooking as jest.Mock;

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
}));

jest.mock('./booking.client', () => ({
  createBooking: jest.fn(),
}));

jest.mock('@/src/core/api/queryClient', () => ({
  queryClient: {
    invalidateQueries: jest.fn(),
  },
}));

describe('booking.mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should configure useMutation with booking mutation handlers', async () => {
    const mutationReturn = { mutate: jest.fn() };
    mockUseMutation.mockReturnValue(mutationReturn);
    mockCreateBooking.mockResolvedValue({ id: 'booking-1' });

    const result = useCreateBookingMutation();
    const config = mockUseMutation.mock.calls[0][0];

    const payload = {
      accommodationId: 'acc-1',
      checkIn: '2026-05-01',
      checkOut: '2026-05-03',
      rooms: 1,
      adults: 2,
      children: 0,
    };

    await config.mutationFn(payload);
    config.onSuccess();

    expect(result).toBe(mutationReturn);
    expect(mockUseMutation).toHaveBeenCalledTimes(1);
    expect(mockCreateBooking).toHaveBeenCalledWith(payload);
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: bookingKeys.all,
    });
  });
});
