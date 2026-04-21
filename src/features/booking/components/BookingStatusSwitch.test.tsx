import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { BookingStatus } from '@/src/features/booking/api/booking.types';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { BookingStatusSwitch } from './BookingStatusSwitch';

describe('BookingStatusSwitch', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render booked as active by default', () => {
    renderWithProviders(
      <BookingStatusSwitch
        status={BookingStatus.active}
        onChange={mockOnChange}
        className="mt-6"
      />,
    );

    expect(
      screen.getByText('t:booking.bookingStatusSwitch.booked'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingStatusSwitch.history'),
    ).toBeTruthy();
  });

  it('should render history as active when status is completed', () => {
    renderWithProviders(
      <BookingStatusSwitch
        status={BookingStatus.completed}
        onChange={mockOnChange}
      />,
    );

    expect(
      screen.getByText('t:booking.bookingStatusSwitch.booked'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingStatusSwitch.history'),
    ).toBeTruthy();
  });

  it('should call onChange with active and completed when options are pressed', () => {
    renderWithProviders(
      <BookingStatusSwitch
        status={BookingStatus.active}
        onChange={mockOnChange}
      />,
    );

    fireEvent.press(screen.getByText('t:booking.bookingStatusSwitch.booked'));
    fireEvent.press(screen.getByText('t:booking.bookingStatusSwitch.history'));

    expect(mockOnChange).toHaveBeenNthCalledWith(1, BookingStatus.active);
    expect(mockOnChange).toHaveBeenNthCalledWith(2, BookingStatus.completed);
  });
});
