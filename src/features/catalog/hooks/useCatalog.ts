import { useMemo } from 'react';

import { useStayStore } from '@/src/shared/hooks/useStayStore';

import { useAccommodationsQuery } from '../../accommodation';

import { useCatalogStore } from './useCatalogStore';

export function useCatalog() {
  const sortOption = useCatalogStore((state) => state.sortOption);
  const newSearch = useCatalogStore((state) => state.newSearch);
  const stay = useStayStore((state) => state.stay);

  const query = useAccommodationsQuery({
    locationId: newSearch?.location?.id ?? stay.location?.id ?? '',
    dates: newSearch?.dates,
    occupancy: newSearch?.occupancy,
    limit: 8,
    sortBy: sortOption,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );

  return {
    items,
    ...query,
  };
}
