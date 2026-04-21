import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';
import { StayStore } from '@/src/shared/store/stay.store';

import { CreateBookingDto } from './booking.types';

export const toCreateBookingDto = (
  accommodation: Accommodation,
  { stay }: StayStore,
): CreateBookingDto => {
  return {
    accommodationId: accommodation.id,
    checkIn: stay.dates.checkIn.format('YYYY-MM-DD'),
    checkOut: stay.dates.checkOut.format('YYYY-MM-DD'),
    adults: stay.occupancy.adults,
    children: stay.occupancy.children,
    rooms: stay.occupancy.rooms,
  };
};
