import { useContext } from 'react';

import { useStore } from 'zustand';

import { CatalogContext } from '../contexts/CatalogContext';
import { CatalogStore } from '../store/catalog.store';

export function useCatalogStore<T>(selector: (state: CatalogStore) => T): T {
  const storeContext = useContext(CatalogContext);

  if (!storeContext) {
    throw new Error('useCatalogStore must be used within a CatalogProvider');
  }

  return useStore(storeContext, selector);
}
