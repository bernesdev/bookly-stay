import React from 'react';

import { screen } from '@testing-library/react-native';

import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { BookingDetails } from './BookingDetails';

const mockAccommodationSmallCard = jest.fn((props: any) => {
  const mockReact = jest.requireActual('react');
  const ReactNative = jest.requireActual('react-native');

  return mockReact.createElement(
    ReactNative.Text,
    { testID: 'accommodation-small-card' },
    props.name,
  );
});

jest.mock('@/src/shared/components/cards/AccommodationSmallCard', () => ({
  AccommodationSmallCard: (props: any) => mockAccommodationSmallCard(props),
}));

describe('BookingDetails', () => {
  const booking = {
    id: 'booking-1',
    orderId: 'order-123',
    accommodation: makeAccommodation({
      name: 'Ocean View Hotel',
    }),
    nights: 3,
    dates: {
      checkInFormatted: 'Mon, Apr 21',
      checkOutFormatted: 'Thu, Apr 24',
    },
    occupancy: {
      rooms: 2,
      adults: 2,
      children: 1,
    },
    price: {
      oldTotalPrice: 1200,
      currentTotalPrice: 900,
      totalDiscount: 300,
      discountPercentage: 25,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render reservation and price details with discount', () => {
    renderWithProviders(<BookingDetails booking={booking} className="mt-6" />);

    expect(screen.getByText('t:booking.bookingDetails.title')).toBeTruthy();
    expect(screen.getByTestId('accommodation-small-card')).toBeTruthy();
    expect(screen.getByText('Ocean View Hotel')).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetails.sections.reservation'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetails.fields.checkIn'),
    ).toBeTruthy();
    expect(screen.getByText('Mon, Apr 21')).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetails.fields.checkOut'),
    ).toBeTruthy();
    expect(screen.getByText('Thu, Apr 24')).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetails.fields.rooms'),
    ).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetails.fields.guests'),
    ).toBeTruthy();
    expect(
      screen.getByText(
        't:booking.common.adultUnit · t:booking.common.childUnit',
      ),
    ).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetails.sections.price'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetails.price.nightUnit'),
    ).toBeTruthy();
    expect(screen.getByText('$1200')).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetails.price.discount'),
    ).toBeTruthy();
    expect(screen.getByText('-$300')).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetails.price.total'),
    ).toBeTruthy();
    expect(screen.getByText('$900')).toBeTruthy();

    expect(mockAccommodationSmallCard).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ocean View Hotel',
        readyOnly: true,
      }),
    );
  });

  it('should hide discount row when there is no discount', () => {
    renderWithProviders(
      <BookingDetails
        booking={{
          ...booking,
          price: {
            oldTotalPrice: undefined,
            currentTotalPrice: 900,
            totalDiscount: undefined,
            discountPercentage: undefined,
          },
          occupancy: {
            rooms: 1,
            adults: 2,
            children: 0,
          },
        }}
      />,
    );

    expect(screen.getByText('t:booking.common.adultUnit')).toBeTruthy();
    expect(
      screen.queryByText('t:booking.bookingDetails.price.discount'),
    ).toBeNull();
    expect(screen.queryByText('-$300')).toBeNull();
  });
});
