import { http } from '@/src/core/api/http';
import { Page, PageQuery } from '@/src/core/types/page.types';

import type {
  Destination,
  Location,
  LocationCoordinatesQuery,
  LocationQuery,
} from './location.types';

export async function getLocationsByQuery({
  query,
  limit,
  signal,
}: LocationQuery): Promise<Page<Location>> {
  const res = await http().get<Page<Location>>('/locations/search', {
    params: { query, limit },
    signal,
  });

  return res.data;
}

export async function getLocationById(id: string): Promise<Location> {
  const res = await http().get<Location>(`/locations/${id}`);

  return res.data;
}

export async function getLocationByCoordinates({
  lat,
  lng,
}: LocationCoordinatesQuery): Promise<Location> {
  const res = await http().get<Location>('/locations/coordinates', {
    params: { lat, lng },
  });

  return res.data;
}

export async function getTopDestinations({
  limit = 10,
  cursor,
}: PageQuery): Promise<Page<Destination>> {
  const res = await http().get<Page<Destination>>(
    '/locations/top-destinations',
    {
      params: { limit, cursor },
    },
  );

  return res.data;
}
