import { PageQuery } from '@/src/core/types/page.types';
import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';

export interface Booking {
  id: string;
  orderId: string;
  accommodation: Accommodation;
  nights: number;
  dates: BookingDates;
  occupancy: BookingOccupancy;
  price: BookingPrice;
}

export interface BookingDates {
  checkInFormatted: string;
  checkOutFormatted: string;
}

export interface BookingOccupancy {
  rooms: number;
  adults: number;
  children: number;
}

export interface BookingPrice {
  oldTotalPrice: number | undefined;
  currentTotalPrice: number;
  totalDiscount: number | undefined;
  discountPercentage: number | undefined;
}

export enum BookingStatus {
  active = 'active',
  completed = 'completed',
}

export interface BookingQuery extends PageQuery {
  status: BookingStatus;
}

export interface CreateBookingDto {
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
}
