import React from 'react';

import { act, fireEvent, screen } from '@testing-library/react-native';

import { toCreateBookingDto } from '@/src/features/booking/api/booking.mapper';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import '@/testing/mocks';
import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { CheckoutLoadingSheet } from './CheckoutLoadingSheet';

const mockDismissAll = jest.fn();
const mockPush = jest.fn();
const mockHideSheet = jest.fn();
const mockCreateBooking = jest.fn();
const mockToCreateBookingDto = toCreateBookingDto as jest.Mock;

jest.mock('expo-router', () => ({
  useRouter: () => ({
    dismissAll: mockDismissAll,
    push: mockPush,
  }),
}));

jest.mock('@/src/shared/hooks/useBottomSheet', () => ({
  useBottomSheet: jest.fn(),
}));

jest.mock('@/src/features/booking/api/booking.mapper', () => ({
  toCreateBookingDto: jest.fn(),
}));

jest.mock('@/src/shared/components/buttons/OutlinedButton', () => ({
  OutlinedButton: ({
    title,
    onPress,
  }: {
    title: string;
    onPress?: () => void;
  }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');
    return React.createElement(
      Pressable,
      { testID: 'try-again-button', onPress },
      React.createElement(Text, null, title),
    );
  },
}));

jest.mock('@/src/shared/components/buttons/TextButton', () => ({
  TextButton: ({
    children,
    onPress,
  }: {
    children: React.ReactNode;
    onPress?: () => void;
  }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');
    return React.createElement(
      Pressable,
      { testID: 'cancel-button', onPress },
      React.createElement(Text, null, children),
    );
  },
}));

describe('CheckoutLoadingSheet', () => {
  const accommodation = makeAccommodation({ id: 'acc-1' });
  const stayStore = {
    stay: {
      dates: {
        checkIn: { format: () => '2026-05-01' },
        checkOut: { format: () => '2026-05-03' },
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
    jest.useFakeTimers();
    (useBottomSheet as unknown as jest.Mock).mockReturnValue({
      hideSheet: mockHideSheet,
    });
    mockToCreateBookingDto.mockReturnValue({
      accommodationId: 'acc-1',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render loading state and call createBooking with mapped payload', () => {
    mockCreateBooking.mockReturnValue(new Promise(() => {}));

    renderWithProviders(
      <CheckoutLoadingSheet
        accommodation={accommodation}
        stayStore={stayStore}
        createBooking={mockCreateBooking}
      />,
    );

    expect(
      screen.getByText('t:checkout.checkoutLoadingSheet.loading.title'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:checkout.checkoutLoadingSheet.loading.description'),
    ).toBeTruthy();
    expect(mockToCreateBookingDto).toHaveBeenCalledWith(
      accommodation,
      stayStore,
    );
    expect(mockCreateBooking).toHaveBeenCalledWith({
      accommodationId: 'acc-1',
    });
  });

  it('should show success state and navigate to confirmation after delay when booking succeeds', async () => {
    mockCreateBooking.mockResolvedValue({ id: 'booking-1' });

    renderWithProviders(
      <CheckoutLoadingSheet
        accommodation={accommodation}
        stayStore={stayStore}
        createBooking={mockCreateBooking}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(3000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(
      screen.getByText('t:checkout.checkoutLoadingSheet.success.title'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:checkout.checkoutLoadingSheet.success.description'),
    ).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(1500);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockHideSheet).toHaveBeenCalledTimes(1);
    expect(mockDismissAll).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/confirmation',
      params: { id: 'booking-1' },
    });
  });

  it('should show error state, retry request and allow cancel when booking fails', async () => {
    mockCreateBooking.mockRejectedValueOnce(new Error('Booking failed'));

    renderWithProviders(
      <CheckoutLoadingSheet
        accommodation={accommodation}
        stayStore={stayStore}
        createBooking={mockCreateBooking}
      />,
    );

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(
      screen.getByText('t:checkout.checkoutLoadingSheet.error.title'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:checkout.checkoutLoadingSheet.error.description'),
    ).toBeTruthy();
    expect(screen.getByText('Booking failed')).toBeTruthy();
    expect(
      screen.getByText('t:checkout.checkoutLoadingSheet.actions.tryAgain'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:checkout.checkoutLoadingSheet.actions.cancel'),
    ).toBeTruthy();

    fireEvent.press(screen.getByTestId('cancel-button'));
    expect(mockHideSheet).toHaveBeenCalledTimes(1);

    mockCreateBooking.mockRejectedValueOnce(new Error('Retry failed'));
    fireEvent.press(screen.getByTestId('try-again-button'));

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockCreateBooking).toHaveBeenCalledTimes(2);

    act(() => {
      jest.runOnlyPendingTimers();
    });
  });
});
