import { createStore } from 'zustand';

import { StayData } from '@/src/shared/types/stay.types';

import { AccommodationSortOption } from '../../accommodation/api/accommodation.types';

type CatalogState = {
  sortOption: AccommodationSortOption | undefined;
  newSearch: StayData | undefined;
};

type CatalogActions = {
  setSortOption: (option: AccommodationSortOption | undefined) => void;
  setNewSearch: (search: StayData | undefined) => void;
};

export type CatalogStore = CatalogState & CatalogActions;

export const createCatalogStore = () =>
  createStore<CatalogStore>((set) => ({
    // states
    sortOption: undefined,
    newSearch: undefined,

    // actions
    setSortOption: (sortOption) => set({ sortOption }),
    setNewSearch: (newSearch) => set({ newSearch }),
  }));
