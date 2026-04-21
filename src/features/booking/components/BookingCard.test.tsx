import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';
import { Image } from 'react-native';

import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { BookingCard } from './BookingCard';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/src/shared/components/animations/BouncyPressable', () => ({
  BouncyPressable: ({
    children,
    onPress,
    className,
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
  }) => {
    const mockReact = jest.requireActual('react');
    return mockReact.createElement(
      'Pressable',
      { onPress, testID: 'booking-card-pressable', className },
      children,
    );
  },
}));

describe('BookingCard', () => {
  const booking = {
    id: 'booking-1',
    orderId: 'order-1',
    accommodation: makeAccommodation({
      name: 'Ocean View Hotel',
      image: 'https://example.com/ocean.jpg',
      location: {
        city: 'Rio de Janeiro',
        country: 'Brazil',
        coordinates: { lat: -22.9, lng: -43.2 },
        distanceToCenter: 2.1,
        address: {
          street: 'Atlantica',
          number: '1200',
        },
      },
    }),
    nights: 3,
    dates: {
      checkInFormatted: 'Mon, Apr 21',
      checkOutFormatted: 'Thu, Apr 24',
    },
    occupancy: {
      rooms: 1,
      adults: 2,
      children: 0,
    },
    price: {
      oldTotalPrice: undefined,
      currentTotalPrice: 900,
      totalDiscount: undefined,
      discountPercentage: undefined,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render booking information and translated labels', () => {
    renderWithProviders(<BookingCard {...booking} className="mt-4" />);

    expect(screen.getByText('Ocean View Hotel')).toBeTruthy();
    expect(screen.getByText('Rio de Janeiro, Brazil')).toBeTruthy();
    expect(screen.getByText('$900')).toBeTruthy();
    expect(screen.getByText('t:booking.bookingCard.checkIn')).toBeTruthy();
    expect(screen.getByText('t:booking.bookingCard.checkOut')).toBeTruthy();
    expect(screen.getByText('Mon, Apr 21')).toBeTruthy();
    expect(screen.getByText('Thu, Apr 24')).toBeTruthy();

    expect(screen.getByTestId('booking-card-pressable')).toBeTruthy();
  });

  it('should render accommodation image uri', () => {
    renderWithProviders(<BookingCard {...booking} />);

    const image = screen.UNSAFE_getByType(Image);

    expect(image.props.source).toEqual({
      uri: 'https://example.com/ocean.jpg',
    });
  });

  it('should navigate to booking screen with id when pressed', () => {
    renderWithProviders(<BookingCard {...booking} />);

    fireEvent.press(screen.getByTestId('booking-card-pressable'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/booking',
      params: { id: 'booking-1' },
    });
  });
});
