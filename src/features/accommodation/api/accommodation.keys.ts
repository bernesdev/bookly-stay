import { StayDates, StayOccupancy } from '@/src/shared/types/stay.types';

const serializeDates = (dates?: StayDates) =>
  dates
    ? `${dates.checkIn.toISOString()}_${dates.checkOut.toISOString()}`
    : undefined;

const serializeOccupancy = (occupancy?: StayOccupancy) =>
  occupancy
    ? `${occupancy.rooms}-${occupancy.adults}-${occupancy.children}`
    : undefined;

export const accommodationKeys = {
  all: ['accommodation'] as const,
  accommodationKey: (id: string) => [...accommodationKeys.all, id] as const,
  accommodationsKey: (
    locationId: string,
    limit: number,
    cursor?: string,
    sortBy?: string,
    dates?: StayDates,
    occupancy?: StayOccupancy,
  ) =>
    [
      ...accommodationKeys.all,
      locationId,
      limit,
      cursor,
      sortBy,
      serializeDates(dates),
      serializeOccupancy(occupancy),
    ] as const,
};
