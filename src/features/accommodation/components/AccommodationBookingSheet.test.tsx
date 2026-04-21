import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { AccommodationBookingSheet } from './AccommodationBookingSheet';

const mockPush = jest.fn();
const mockShowSheet = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/src/shared/components/buttons/SolidButton', () => ({
  SolidButton: ({
    title,
    onPress,
  }: {
    title: string;
    onPress?: () => void;
  }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Pressable',
      { onPress },
      React.createElement('Text', null, title),
    );
  },
}));

jest.mock('@/src/shared/hooks/useStayStore', () => ({
  useStayStore: (selector?: (state: any) => any) => {
    const state = {
      stay: {
        dates: {
          checkIn: '2026-04-20',
          checkOut: '2026-04-23',
        },
      },
    };

    return selector ? selector(state) : state;
  },
}));

jest.mock('@/src/shared/selectors/stay.selectors', () => ({
  selectNights: () => 3,
}));

jest.mock('@/src/shared/hooks/useBottomSheet', () => ({
  useBottomSheet: () => ({ showSheet: mockShowSheet }),
}));

jest.mock('@/src/features/auth/components/UnauthenticatedSheet', () => ({
  UnauthenticatedSheet: () => null,
}));

const mockIsLoggedIn = jest.fn();

jest.mock('@/src/shared/hooks/useUserStore', () => ({
  useUserStore: (selector?: (state: any) => any) => {
    const state = { isLoggedIn: mockIsLoggedIn() };

    return selector ? selector(state) : state;
  },
}));

describe('AccommodationBookingSheet', () => {
  const accommodation = makeAccommodation({
    id: 'acc-1',
    price: {
      currentPrice: 100,
      oldPrice: 120,
      discount: 20,
      discountPercentage: 16.67,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render total price based on nights', () => {
    mockIsLoggedIn.mockReturnValue(true);

    renderWithProviders(
      <AccommodationBookingSheet accommodation={accommodation} />,
    );

    expect(screen.getByText('$300')).toBeTruthy();
    expect(
      screen.getByText('t:accommodation.bookingSheet.totalPrice'),
    ).toBeTruthy();
  });

  it('should navigate to checkout when logged in and book now is pressed', () => {
    mockIsLoggedIn.mockReturnValue(true);

    renderWithProviders(
      <AccommodationBookingSheet accommodation={accommodation} />,
    );

    fireEvent.press(screen.getByText('t:accommodation.bookingSheet.bookNow'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/checkout',
      params: { id: 'acc-1' },
    });
    expect(mockShowSheet).not.toHaveBeenCalled();
  });

  it('should show unauthenticated sheet when not logged in and book now is pressed', () => {
    mockIsLoggedIn.mockReturnValue(false);

    renderWithProviders(
      <AccommodationBookingSheet accommodation={accommodation} />,
    );

    fireEvent.press(screen.getByText('t:accommodation.bookingSheet.bookNow'));

    expect(mockShowSheet).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
