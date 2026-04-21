import type { LocationStatus } from '../../core/services/location/location.types';
import type { StayData, StayLocation } from '../types/stay.types';

type StayState = {
  locationStatus: LocationStatus;
  geoLocation?: StayLocation;
  stay: StayData;
};

type StayActions = {
  setGeoLocation: () => Promise<LocationStatus>;
  setStay: (stay: Partial<StayData>) => void;
};

export type StayStore = StayState & StayActions;
