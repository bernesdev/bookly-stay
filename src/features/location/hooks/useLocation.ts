import { useDebouncedValue } from '@/src/shared/utils/useDebouncedValue';

import { useLocationSearchQuery } from '../api/location.queries';

import type { Location } from '../api/location.types';

const EMPTY_ITEMS: Location[] = [];

export function useLocation(text: string) {
  const debounced = useDebouncedValue({ value: text, delayMs: 300 });

  const { data, isLoading, error, isFetched } = useLocationSearchQuery({
    query: debounced,
    limit: 10,
  });

  const items = data?.data ?? EMPTY_ITEMS;

  return {
    hasItems: items.length > 0,
    items,
    isLoading,
    error,
    isFetched,
  };
}
