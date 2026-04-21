import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import {
  getAppScreenMockProps,
  resetAppScreenMock,
} from '@/testing/mocks/app-screen.mock';
import { getDefaultErrorMock } from '@/testing/mocks/messages-utils.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useBookingQuery } from '../api/booking.queries';

import { BookingDetailsScreen } from './BookingDetailsScreen';

const mockUseLocalSearchParams = jest.fn();
const mockRefetch = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('../components/BookingDetails', () => ({
  BookingDetails: ({ booking }: { booking: { id: string } }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'booking-details' },
      booking.id,
    );
  },
}));

jest.mock('../api/booking.queries', () => ({
  useBookingQuery: jest.fn(),
}));

describe('BookingDetailsScreen', () => {
  const mockUseBookingQuery = useBookingQuery as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();
    mockUseLocalSearchParams.mockReturnValue({ id: 'booking-1' });
    getDefaultErrorMock.mockReturnValue('default-error-message');
  });

  it('should render loading state with app bar title', () => {
    mockUseBookingQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<BookingDetailsScreen />);

    expect(screen.getByTestId('app-screen')).toBeTruthy();
    expect(getAppScreenMockProps().appBar).toEqual({
      title: 't:booking.bookingDetailsScreen.appBarTitle',
    });
    expect(
      screen.UNSAFE_getByType(require('react-native').ActivityIndicator),
    ).toBeTruthy();
    expect(mockUseBookingQuery).toHaveBeenCalledWith('booking-1');
  });

  it('should render error state and allow retry when query fails', () => {
    mockUseBookingQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: '404' },
      refetch: mockRefetch,
    });

    renderWithProviders(<BookingDetailsScreen />);

    expect(screen.getByTestId('error-message')).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingDetailsScreen.errorTitle'),
    ).toBeTruthy();
    expect(screen.getByText('default-error-message')).toBeTruthy();
    expect(getDefaultErrorMock).toHaveBeenCalledWith('404');

    fireEvent.press(screen.getByTestId('error-message-press'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render booking details when booking is loaded', () => {
    mockUseBookingQuery.mockReturnValue({
      data: { id: 'booking-1' },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<BookingDetailsScreen />);

    expect(screen.getByTestId('booking-details')).toBeTruthy();
    expect(screen.getByText('booking-1')).toBeTruthy();
    expect(screen.queryByTestId('error-message')).toBeNull();
  });
});
