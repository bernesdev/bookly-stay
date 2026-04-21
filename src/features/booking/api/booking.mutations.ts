import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/src/core/api/queryClient';

import { createBooking } from './booking.client';
import { bookingKeys } from './booking.keys';
import { CreateBookingDto } from './booking.types';

export function useCreateBookingMutation() {
  return useMutation({
    mutationFn: (request: CreateBookingDto) => createBooking(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
