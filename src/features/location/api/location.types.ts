export interface Location {
  id: string;
  city: string;
  country: string;
  lat: string;
  lng: string;
}

export interface LocationQuery {
  query: string;
  limit: number;
  signal?: AbortSignal;
}

export interface LocationCoordinatesQuery {
  lat: string;
  lng: string;
}

export interface Destination extends Omit<Location, 'lat' | 'lng'> {
  image: string;
}
