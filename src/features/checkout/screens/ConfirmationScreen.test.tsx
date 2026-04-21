import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';

import { useBookingQuery } from '@/src/features/booking/api/booking.queries';
import {
  getAppScreenMockProps,
  resetAppScreenMock,
} from '@/testing/mocks/app-screen.mock';
import { getBookingConfirmationErrorMock } from '@/testing/mocks/messages-utils.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { ConfirmationScreen } from './ConfirmationScreen';

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@/src/features/booking/api/booking.queries', () => ({
  useBookingQuery: jest.fn(),
}));

jest.mock('@/src/shared/components/buttons/IconButton', () => ({
  IconButton: ({ onPress }: { onPress?: () => void }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');
    return React.createElement(
      Pressable,
      { testID: 'close-button', onPress },
      React.createElement(Text, null, 'close'),
    );
  },
}));

jest.mock('@/src/features/booking/components/BookingDetails', () => ({
  BookingDetails: ({ booking }: { booking: { id: string } }) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, { testID: 'booking-details' }, booking.id);
  },
}));

const mockUseBookingQuery = useBookingQuery as jest.Mock;

describe('ConfirmationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();

    mockUseLocalSearchParams.mockReturnValue({ id: 'booking-1' });
    getBookingConfirmationErrorMock.mockReturnValue('mapped-booking-error');

    mockUseBookingQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
  });

  it('should render loading state and hide close action while loading', () => {
    mockUseBookingQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<ConfirmationScreen />);

    expect(screen.getByTestId('app-screen')).toBeTruthy();
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(screen.queryByTestId('close-button')).toBeNull();
    expect(getAppScreenMockProps().appBar).toEqual(
      expect.objectContaining({
        showLeading: false,
        showLogo: true,
      }),
    );
    expect(mockUseBookingQuery).toHaveBeenCalledWith('booking-1');
  });

  it('should render error state and navigate to bookings when pressing error action', () => {
    mockUseBookingQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: '404' },
    });

    renderWithProviders(<ConfirmationScreen />);

    expect(screen.getByTestId('error-message')).toBeTruthy();
    expect(
      screen.getByText('t:checkout.confirmationScreen.errorTitle'),
    ).toBeTruthy();
    expect(screen.getByText('mapped-booking-error')).toBeTruthy();
    expect(
      screen.getByText('t:checkout.confirmationScreen.errorButton'),
    ).toBeTruthy();
    expect(getBookingConfirmationErrorMock).toHaveBeenCalledWith('404');

    fireEvent.press(screen.getByTestId('error-button'));

    expect(mockReplace).toHaveBeenCalledWith('/bookings');
  });

  it('should render booking details and allow close and reservation actions', () => {
    mockUseBookingQuery.mockReturnValue({
      data: { id: 'booking-1' },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<ConfirmationScreen />);

    expect(
      screen.getByText('t:checkout.confirmationScreen.thanks'),
    ).toBeTruthy();
    expect(screen.getByTestId('booking-details')).toBeTruthy();
    expect(screen.getByText('booking-1')).toBeTruthy();
    expect(screen.getByTestId('close-button')).toBeTruthy();

    fireEvent.press(screen.getByTestId('close-button'));
    expect(mockBack).toHaveBeenCalledTimes(1);

    fireEvent.press(
      screen.getByText(
        't:checkout.confirmationScreen.actions.checkReservation',
      ),
    );
    expect(mockReplace).toHaveBeenCalledWith('/bookings');
  });
});
