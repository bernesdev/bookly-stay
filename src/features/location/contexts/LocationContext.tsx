import { createContext, useRef } from 'react';

import { createLocationStore } from '../store/location.store';

export const LocationContext = createContext<ReturnType<
  typeof createLocationStore
> | null>(null);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = useRef<ReturnType<typeof createLocationStore>>(null);

  if (!storeRef.current) {
    storeRef.current = createLocationStore();
  }

  return (
    <LocationContext.Provider value={storeRef.current}>
      {children}
    </LocationContext.Provider>
  );
};
