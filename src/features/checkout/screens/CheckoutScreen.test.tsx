import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';

import { useCreateBookingMutation } from '@/src/features/booking/api/booking.mutations';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { useStayStore } from '@/src/shared/hooks/useStayStore';
import {
  selectCheckInLabel,
  selectCheckOutLabel,
  selectGuestsLabel,
  selectRoomsLabel,
} from '@/src/shared/selectors/stay.selectors';
import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import {
  getAppScreenMockProps,
  resetAppScreenMock,
} from '@/testing/mocks/app-screen.mock';
import { getDefaultErrorMock } from '@/testing/mocks/messages-utils.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useCheckout } from '../hooks/useCheckout';

import { CheckoutScreen } from './CheckoutScreen';

const mockShowSheet = jest.fn();
const mockCreateBooking = jest.fn();

jest.mock('@/src/features/booking/api/booking.mutations', () => ({
  useCreateBookingMutation: jest.fn(),
}));

jest.mock('@/src/shared/hooks/useBottomSheet', () => ({
  useBottomSheet: jest.fn(),
}));

jest.mock('@/src/shared/hooks/useStayStore', () => ({
  useStayStore: jest.fn(),
}));

jest.mock('@/src/shared/selectors/stay.selectors', () => ({
  selectCheckInLabel: jest.fn(),
  selectCheckOutLabel: jest.fn(),
  selectGuestsLabel: jest.fn(),
  selectRoomsLabel: jest.fn(),
}));

jest.mock('../components/CheckoutLoadingSheet', () => ({
  CheckoutLoadingSheet: () => null,
}));

jest.mock('../hooks/useCheckout', () => ({
  useCheckout: jest.fn(),
}));

const mockUseCheckout = useCheckout as jest.Mock;
const mockUseBottomSheet = useBottomSheet as unknown as jest.Mock;
const mockUseCreateBookingMutation = useCreateBookingMutation as jest.Mock;
const mockUseStayStore = useStayStore as unknown as jest.Mock;

const mockSelectCheckInLabel = selectCheckInLabel as jest.Mock;
const mockSelectCheckOutLabel = selectCheckOutLabel as jest.Mock;
const mockSelectGuestsLabel = selectGuestsLabel as jest.Mock;
const mockSelectRoomsLabel = selectRoomsLabel as jest.Mock;

describe('CheckoutScreen', () => {
  const accommodation = makeAccommodation({ id: 'acc-1' });
  const stayStore = {
    stay: {
      location: { city: 'NYC' },
      dates: {
        checkIn: null,
        checkOut: null,
      },
      occupancy: {
        rooms: 1,
        adults: 2,
        children: 0,
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();
    getDefaultErrorMock.mockReturnValue('default-error-message');

    mockUseBottomSheet.mockReturnValue({ showSheet: mockShowSheet });
    mockUseCreateBookingMutation.mockReturnValue({
      mutateAsync: mockCreateBooking,
    });
    mockUseStayStore.mockReturnValue(stayStore);

    mockSelectCheckInLabel.mockReturnValue('Fri, 1 May');
    mockSelectCheckOutLabel.mockReturnValue('Mon, 4 May');
    mockSelectRoomsLabel.mockReturnValue('1 room');
    mockSelectGuestsLabel.mockReturnValue('2 adults');

    mockUseCheckout.mockReturnValue({
      totalDiscount: 30,
      totalOldPrice: 600,
      totalCurrentPrice: 450,
      nights: 3,
      accommodation,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('should render fixed screen config and loading state', () => {
    mockUseCheckout.mockReturnValue({
      totalDiscount: null,
      totalOldPrice: null,
      totalCurrentPrice: 0,
      nights: 1,
      accommodation: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<CheckoutScreen />);

    expect(screen.getByTestId('app-screen')).toBeTruthy();
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(getAppScreenMockProps()).toEqual(
      expect.objectContaining({
        preset: 'fixed',
        appBar: expect.objectContaining({
          title: 't:checkout.checkoutScreen.appBarTitle',
        }),
      }),
    );
  });

  it('should render error state and call refetch on retry', () => {
    const refetch = jest.fn();

    mockUseCheckout.mockReturnValue({
      totalDiscount: null,
      totalOldPrice: null,
      totalCurrentPrice: 0,
      nights: 1,
      accommodation: undefined,
      isLoading: false,
      error: new Error('Request failed'),
      refetch,
    });

    renderWithProviders(<CheckoutScreen />);

    expect(screen.getByTestId('error-message')).toBeTruthy();
    expect(
      screen.getByText('t:checkout.checkoutScreen.errorTitle'),
    ).toBeTruthy();

    fireEvent.press(screen.getByTestId('error-retry'));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('should render checkout details and open loading sheet when confirming booking', () => {
    renderWithProviders(<CheckoutScreen />);

    expect(
      screen.getByText('t:checkout.checkoutScreen.sections.dates'),
    ).toBeTruthy();
    expect(screen.getByText('Fri, 1 May')).toBeTruthy();
    expect(screen.getByText('Mon, 4 May')).toBeTruthy();
    expect(screen.getByText('1 room')).toBeTruthy();
    expect(screen.getByText('2 adults')).toBeTruthy();
    expect(screen.getByText('$600')).toBeTruthy();
    expect(screen.getByText('-$30')).toBeTruthy();
    expect(screen.getByText('$450')).toBeTruthy();

    fireEvent.press(
      screen.getByText('t:checkout.checkoutScreen.actions.confirmBooking'),
    );

    expect(mockShowSheet).toHaveBeenCalledTimes(1);

    const [sheet, options] = mockShowSheet.mock.calls[0];

    expect(sheet.props.accommodation).toBe(accommodation);
    expect(sheet.props.stayStore).toBe(stayStore);
    expect(sheet.props.createBooking).toBe(mockCreateBooking);
    expect(options).toEqual({
      showHandleIndicator: false,
      preventDismiss: true,
    });
  });

  it('should hide discount row when there is no discount', () => {
    mockUseCheckout.mockReturnValue({
      totalDiscount: null,
      totalOldPrice: 450,
      totalCurrentPrice: 450,
      nights: 3,
      accommodation,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<CheckoutScreen />);

    expect(
      screen.queryByText('t:checkout.checkoutScreen.details.discount'),
    ).toBeNull();
  });
});
