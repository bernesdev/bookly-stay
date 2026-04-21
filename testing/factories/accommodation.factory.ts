import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';

export function makeAccommodation(
  overrides: Partial<Accommodation> = {},
): Accommodation {
  return {
    id: 'acc-1',
    name: 'Bookly Hotel',
    image: 'https://example.com/hotel.jpg',
    rating: '4.8',
    price: {
      oldPrice: 500,
      currentPrice: 420,
      discount: 80,
      discountPercentage: 16,
    },
    details: {
      beds: 2,
      bathrooms: 1,
      hasBreakfast: true,
      amenities: [
        {
          id: 'wifi',
          name: 'Wi-Fi',
          icon: 'wifi',
        },
      ],
      description: 'Comfortable stay in the city center',
    },
    location: {
      city: 'Sao Paulo',
      country: 'Brazil',
      coordinates: {
        lat: -23.55,
        lng: -46.63,
      },
      distanceToCenter: 1.2,
      address: {
        street: 'Paulista Avenue',
        number: '1000',
      },
    },
    ...overrides,
  };
}
