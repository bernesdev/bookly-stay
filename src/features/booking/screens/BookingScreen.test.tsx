import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { BookingStatus } from '@/src/features/booking/api/booking.types';
import {
  getAppScreenMockProps,
  resetAppScreenMock,
  setAppScreenMockRenderProps,
} from '@/testing/mocks/app-screen.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { BookingScreen } from './BookingScreen';

const mockBookingList = jest.fn();
const mockOnScroll = jest.fn();

jest.mock('../components/BookingList', () => ({
  BookingList: (props: any) => {
    mockBookingList(props);
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'booking-list' },
      props.status,
    );
  },
}));

jest.mock('../components/BookingStatusSwitch', () => ({
  BookingStatusSwitch: ({
    status,
    onChange,
  }: {
    status: BookingStatus;
    onChange: (status: BookingStatus) => void;
  }) => {
    const React = jest.requireActual('react');
    const { BookingStatus } = jest.requireActual('../api/booking.types');
    return React.createElement(
      'Pressable',
      {
        testID: 'booking-status-switch',
        onPress: () => onChange(BookingStatus.completed),
      },
      React.createElement('Text', null, status),
    );
  },
}));

describe('BookingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();
    setAppScreenMockRenderProps({
      onScroll: mockOnScroll,
      topBarHeight: 88,
    });
  });

  it('should render AppScreen with booking app bar config and footer switch', () => {
    renderWithProviders(<BookingScreen />);

    expect(screen.getByTestId('app-screen')).toBeTruthy();
    expect(screen.getByTestId('booking-list')).toBeTruthy();
    expect(screen.getByTestId('booking-status-switch')).toBeTruthy();
    expect(getAppScreenMockProps().preset).toBe('list');
    expect(getAppScreenMockProps().appBar).toEqual(
      expect.objectContaining({
        title: 't:booking.bookingScreen.appBarTitle',
        showLeading: false,
        footerHeight: 64,
        collapsableFooter: true,
        FooterComponent: expect.any(Object),
      }),
    );
  });

  it('should render active bookings initially and update list status when switch changes', () => {
    renderWithProviders(<BookingScreen />);

    expect(mockBookingList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: BookingStatus.active,
        onScroll: mockOnScroll,
        topBarHeight: 88,
        listRef: expect.objectContaining({ current: null }),
      }),
    );

    fireEvent.press(screen.getByTestId('booking-status-switch'));

    expect(mockBookingList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: BookingStatus.completed,
      }),
    );
  });
});
