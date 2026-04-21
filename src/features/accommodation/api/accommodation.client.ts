import { http } from '@/src/core/api/http';
import { Page } from '@/src/core/types/page.types';

import { Accommodation, AccommodationQuery } from './accommodation.types';

export async function getAccommodations({
  limit,
  cursor,
  locationId,
  sortBy,
}: AccommodationQuery): Promise<Page<Accommodation>> {
  const res = await http().get<Page<Accommodation>>('/accommodations', {
    params: { limit, cursor, locationId, sortBy },
  });

  return res.data;
}

export async function getAccommodationById(id: string): Promise<Accommodation> {
  const res = await http().get<Accommodation>(`/accommodations/${id}`);

  return res.data;
}
