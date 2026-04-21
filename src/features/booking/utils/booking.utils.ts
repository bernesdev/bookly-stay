import { TFunction } from 'i18next';

import { BookingOccupancy } from '@/src/features/booking/api/booking.types';

export const getGuestsLabel = (
  { adults, children }: BookingOccupancy,
  t: TFunction,
) => {
  const adultsLabel = t('booking.common.adultUnit', { count: adults });
  const childrenLabel =
    children > 0
      ? ` · ${t('booking.common.childUnit', { count: children })}`
      : '';

  return `${adultsLabel}${childrenLabel}`;
};
