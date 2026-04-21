import { useContext } from 'react';

import { useStore } from 'zustand';

import { LocationContext } from '../contexts/LocationContext';
import { LocationStore } from '../store/location.store';

export function useLocationStore<T>(selector: (state: LocationStore) => T): T {
  const storeContext = useContext(LocationContext);

  if (!storeContext) {
    throw new Error('useLocationStore must be used within a LocationProvider');
  }

  return useStore(storeContext, selector);
}
