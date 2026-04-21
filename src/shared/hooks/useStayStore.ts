import dayjs from 'dayjs';
import { create } from 'zustand';

import { getUserCurrentLocation } from '../../core/services/location/location.resolver';
import {
  getStoredLocationStatus,
  persistLocationStatus,
  setAutoLocationRequestBlocked,
  shouldSkipAutoLocationRequest,
} from '../../core/services/location/location.storage';
import { StayStore } from '../store/stay.store';

import type { StayData } from '../types/stay.types';

const defaultDates = {
  checkIn: dayjs(),
  checkOut: dayjs().add(1, 'day'),
};

const defaultOccupancy = {
  rooms: 1,
  adults: 1,
  children: 0,
};

export const useStayStore = create<StayStore>()((set, get) => ({
  // state
  locationStatus: 'undetermined',
  geoLocation: undefined,

  stay: {
    location: undefined,
    dates: { ...defaultDates },
    occupancy: { ...defaultOccupancy },
  },

  // actions
  setGeoLocation: async () => {
    const state = get();

    // Skip automatic location prompt on app start after an initial denial.
    if (
      state.locationStatus === 'undetermined' &&
      shouldSkipAutoLocationRequest()
    ) {
      const storedStatus = getStoredLocationStatus();
      const nextStatus =
        storedStatus === 'always_denied' ? 'always_denied' : 'denied';

      set(() => ({ locationStatus: nextStatus }));

      return nextStatus;
    }

    const { location, status } = await getUserCurrentLocation();

    persistLocationStatus(status);

    if (status === 'granted') {
      setAutoLocationRequestBlocked(false);
    }

    if (status === 'denied' || status === 'always_denied') {
      setAutoLocationRequestBlocked(true);
    }

    if (location) {
      set((state) => ({
        stay: { ...state.stay, location },
        geoLocation: location,
        locationStatus: status,
      }));
      return status;
    }

    set(() => ({ locationStatus: status }));

    return status;
  },

  setStay: (stay: Partial<StayData>) =>
    set((state) => ({
      stay: {
        location: stay.location ?? state.stay.location,
        dates: stay.dates ?? state.stay.dates,
        occupancy: stay.occupancy ?? state.stay.occupancy,
      },
    })),
}));
