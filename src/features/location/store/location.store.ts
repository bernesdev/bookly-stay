import { createStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { appStorage } from '@/src/core/storage/appStorage';

import { LocationHistory } from '../types';

const LOCATION_HISTORY_KEY = '@location/history';

const MAX_HISTORY_ITEMS = 5;

type LocationState = {
  searchHistory: LocationHistory[];
};

type LocationActions = {
  saveSearchHistory: (location: LocationHistory) => void;
};

export type LocationStore = LocationState & LocationActions;

export const createLocationStore = () =>
  createStore<LocationStore>()(
    persist(
      (set) => ({
        // states
        searchHistory: [],

        // actions
        saveSearchHistory: (location) =>
          set((state) => {
            const filteredHistory = state.searchHistory.filter(
              (item) => item.id !== location.id,
            );

            const updatedHistory = [location, ...filteredHistory];

            const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

            return { searchHistory: limitedHistory };
          }),
      }),
      {
        name: LOCATION_HISTORY_KEY,
        storage: createJSONStorage(() => ({
          getItem: (key) => appStorage.getString(key) ?? null,
          setItem: (key, value) => appStorage.set(key, value),
          removeItem: (key) => appStorage.remove(key),
        })),
      },
    ),
  );
