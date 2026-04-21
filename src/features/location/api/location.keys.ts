export const locationKeys = {
  all: ['location'] as const,
  locationsKey: (query: string, limit: number) =>
    [...locationKeys.all, query, limit] as const,
  locationKey: (id: string) => [...locationKeys.all, id] as const,
  coordinatesKey: (lat: string, lng: string) =>
    [...locationKeys.all, lat, lng] as const,
  topDestinationsKey: (limit: number) =>
    [...locationKeys.all, 'top-destinations', limit] as const,
};
