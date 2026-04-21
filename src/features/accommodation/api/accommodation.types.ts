import { PageQuery } from '@/src/core/types/page.types';
import { StayDates, StayOccupancy } from '@/src/shared/types/stay.types';

export interface Accommodation {
  id: string;
  name: string;
  price: AccommodationPrice;
  rating: string;
  image: string;
  details: AccommodationDetails;
  location: AccommodationLocation;
}

export interface AccommodationDetails {
  beds: number;
  bathrooms: number;
  hasBreakfast: boolean;
  amenities: AccommodationAmenity[];
  description: string;
}

export interface AccommodationAmenity {
  id: string;
  name: string;
  icon: string;
}

export interface AccommodationLocation {
  city: string;
  country: string;
  coordinates: AccommodationCoordinates;
  distanceToCenter: number;
  address: AccommodationAddress;
}

export interface AccommodationAddress {
  street: string;
  number: string;
}

export interface AccommodationCoordinates {
  lat: number;
  lng: number;
}

export interface AccommodationPrice {
  oldPrice: number | undefined;
  currentPrice: number;
  discount: number | undefined;
  discountPercentage: number | undefined;
}

export type AccommodationSortOption = 'price_asc' | 'price_desc' | 'distance';

export interface AccommodationQuery extends PageQuery {
  locationId: string;
  sortBy?: AccommodationSortOption;
  dates?: StayDates;
  occupancy?: StayOccupancy;
}
