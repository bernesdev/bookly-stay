import { createContext, ReactNode, useRef } from 'react';

import { createCatalogStore } from '../store/catalog.store';

export const CatalogContext = createContext<ReturnType<
  typeof createCatalogStore
> | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createCatalogStore>>(null);

  if (!storeRef.current) {
    storeRef.current = createCatalogStore();
  }

  return (
    <CatalogContext.Provider value={storeRef.current}>
      {children}
    </CatalogContext.Provider>
  );
}
