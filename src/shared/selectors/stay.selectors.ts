import i18n from '@/src/i18n';

import { StayStore } from '../store/stay.store';

export const selectCheckInLabel = ({ stay }: StayStore) => {
  return stay.dates.checkIn.format('ddd, D MMM');
};

export const selectCheckOutLabel = ({ stay }: StayStore) => {
  return stay.dates.checkOut.format('ddd, D MMM');
};

export const selectRoomsLabel = ({ stay }: StayStore) => {
  return i18n.t('shared.stay.roomUnit', { count: stay.occupancy.rooms });
};

export const selectGuestsLabel = ({ stay }: StayStore) => {
  const { adults, children } = stay.occupancy;

  const adultsLabel = i18n.t('shared.stay.adultUnit', { count: adults });
  const childrenLabel =
    children > 0
      ? ` · ${i18n.t('shared.stay.childUnit', { count: children })}`
      : '';

  return `${adultsLabel}${childrenLabel}`;
};

export const selectLocationDatesLabel = ({ stay }: StayStore) => {
  const locationLabel = stay.location
    ? stay.location.city
    : i18n.t('shared.stay.currentLocation');
  const datesLabel = `${stay.dates.checkIn.format('D MMM')} - ${stay.dates.checkOut.format('D MMM')}`;

  return `${locationLabel} · ${datesLabel}`;
};

export const selectNights = ({ stay }: StayStore) => {
  const { checkIn, checkOut } = stay.dates;

  if (!checkIn || !checkOut) {
    return 1;
  }

  const nights = checkOut.diff(checkIn, 'day');

  return nights > 0 ? nights : 1;
};
