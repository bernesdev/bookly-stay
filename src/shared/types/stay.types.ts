import type { Dayjs } from 'dayjs';

export interface StayLocation {
  id: string;
  city: string;
  country: string;
  lat?: string;
  lng?: string;
}

export interface StayDates {
  checkIn: Dayjs;
  checkOut: Dayjs;
}

export interface StayOccupancy {
  rooms: number;
  adults: number;
  children: number;
}

export type StayData = {
  location?: StayLocation;
  dates: StayDates;
  occupancy: StayOccupancy;
};
