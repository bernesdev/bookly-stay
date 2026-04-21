import type { LocationHistory } from '@/src/features/location/storage/location.types';

export function makeHistoryItem(
  id: string,
  city = `City ${id}`,
): LocationHistory {
  return {
    id,
    city,
    country: 'Brazil',
    lat: '-23.5505',
    lng: '-46.6333',
  };
}
