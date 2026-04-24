import React from 'react';

import { FlashListRef } from '@shopify/flash-list';
import { fireEvent, screen } from '@testing-library/react-native';

import {
  Booking,
  BookingStatus,
} from '@/src/features/booking/api/booking.types';
import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import { getDefaultErrorMock } from '@/testing/mocks/messages-utils.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useBookingsQuery } from '../api/booking.queries';

import { BookingList } from './BookingList';

const mockPush = jest.fn();
const mockUseUserStore = jest.fn();
const mockBookingCard = jest.fn();
const mockRefetch = jest.fn();
const mockFetchNextPage = jest.fn();
const mockScrollToTop = jest.fn();
let mockFlashListProps: Record<string, unknown> = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/src/shared/hooks/useUserStore', () => ({
  useUserStore: (selector: any) => selector(mockUseUserStore()),
}));

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({
    data,
    renderItem,
    ListFooterComponent,
    ...props
  }: {
    data: any[];
    renderItem: ({ item }: { item: any }) => React.ReactNode;
    ListFooterComponent?: () => React.ReactNode;
  }) => {
    const React = jest.requireActual('react');
    mockFlashListProps = { ...props, data };

    return React.createElement(
      'View',
      { testID: 'flash-list' },
      ...data.map((item) => renderItem({ item })),
      ListFooterComponent?.(),
    );
  },
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
    return React.createElement(
      'Pressable',
      { testID: 'outlined-button', onPress },
      React.createElement('Text', null, title),
    );
  },
}));

jest.mock('./BookingCard', () => ({
  BookingCard: (props: any) => {
    mockBookingCard(props);
    const React = jest.requireActual('react');
    return React.createElement('Text', { testID: 'booking-card' }, props.id);
  },
}));

jest.mock('./BookingItemSkeleton', () => ({
  BookingItemSkeleton: ({ className }: { className?: string }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'booking-skeleton', className },
      'skeleton',
    );
  },
}));

jest.mock('../api/booking.queries', () => ({
  useBookingsQuery: jest.fn(),
}));

describe('BookingList', () => {
  const mockUseBookingsQuery = useBookingsQuery as jest.Mock;
  const booking = {
    id: 'booking-1',
    orderId: 'order-1',
    accommodation: makeAccommodation(),
    nights: 2,
    dates: {
      checkInFormatted: 'Mon, Apr 21',
      checkOutFormatted: 'Wed, Apr 23',
    },
    occupancy: {
      rooms: 1,
      adults: 2,
      children: 0,
    },
    price: {
      oldTotalPrice: undefined,
      currentTotalPrice: 800,
      totalDiscount: undefined,
      discountPercentage: undefined,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFlashListProps = {};
    mockUseUserStore.mockReturnValue({ isLoggedIn: true });
    getDefaultErrorMock.mockReturnValue('default-error-message');
  });

  it('should render error state and allow retry', () => {
    mockUseBookingsQuery.mockReturnValue({
      data: undefined,
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      error: { message: '500' },
      refetch: mockRefetch,
    });

    renderWithProviders(
      <BookingList
        status={BookingStatus.active}
        onScroll={jest.fn() as any}
        topBarHeight={64}
      />,
    );

    expect(screen.getByTestId('error-message')).toBeTruthy();
    expect(screen.getByText('t:booking.bookingList.errorTitle')).toBeTruthy();
    expect(screen.getByText('default-error-message')).toBeTruthy();

    fireEvent.press(screen.getByTestId('error-message-press'));

    expect(getDefaultErrorMock).toHaveBeenCalledWith('500');
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render loading state with five skeletons', () => {
    mockUseBookingsQuery.mockReturnValue({
      data: undefined,
      fetchNextPage: mockFetchNextPage,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(
      <BookingList
        status={BookingStatus.active}
        onScroll={jest.fn() as any}
        topBarHeight={64}
      />,
    );

    expect(screen.getAllByTestId('booking-skeleton')).toHaveLength(5);
    expect(screen.queryByTestId('flash-list')).toBeNull();
  });

  it('should render logged out empty state and navigate to auth', () => {
    mockUseUserStore.mockReturnValue({ isLoggedIn: false });
    mockUseBookingsQuery.mockReturnValue({
      data: { pages: [] },
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(
      <BookingList
        status={BookingStatus.active}
        onScroll={jest.fn() as any}
        topBarHeight={64}
      />,
    );

    expect(
      screen.getByText('t:booking.bookingList.empty.loggedOut'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:booking.bookingList.actions.signIn'),
    ).toBeTruthy();
    expect(mockUseBookingsQuery).toHaveBeenCalledWith({
      userId: '',
      status: BookingStatus.active,
      limit: 10,
      enabled: false,
    });

    fireEvent.press(screen.getByTestId('outlined-button'));
    expect(mockPush).toHaveBeenCalledWith('/auth');
  });

  it('should render logged in empty state without sign in action', () => {
    mockUseBookingsQuery.mockReturnValue({
      data: { pages: [] },
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(
      <BookingList
        status={BookingStatus.completed}
        onScroll={jest.fn() as any}
        topBarHeight={64}
      />,
    );

    expect(
      screen.getByText('t:booking.bookingList.empty.loggedIn'),
    ).toBeTruthy();
    expect(screen.queryByTestId('outlined-button')).toBeNull();
  });

  it('should render list, fetch next page and reset scroll on status change', () => {
    mockUseBookingsQuery.mockReturnValue({
      data: { pages: [{ data: [booking] }] },
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: true,
      hasNextPage: true,
      error: null,
      refetch: mockRefetch,
    });

    const onScroll = jest.fn() as any;
    const listRef = {
      current: {
        scrollToTop: mockScrollToTop,
      },
    } as unknown as React.RefObject<FlashListRef<Booking> | null>;

    const { rerender } = renderWithProviders(
      <BookingList
        status={BookingStatus.active}
        onScroll={onScroll}
        topBarHeight={64}
        listRef={listRef}
      />,
    );

    expect(screen.getByTestId('flash-list')).toBeTruthy();
    expect(screen.getByTestId('booking-card')).toBeTruthy();
    expect(screen.getAllByTestId('booking-skeleton')).toHaveLength(1);
    expect(mockBookingCard).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'booking-1' }),
    );
    expect(mockFlashListProps.onScroll).toBe(onScroll);
    expect(mockScrollToTop).toHaveBeenCalledTimes(1);

    (mockFlashListProps.onEndReached as () => void)();
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);

    rerender(
      <BookingList
        status={BookingStatus.completed}
        onScroll={onScroll}
        topBarHeight={64}
        listRef={listRef}
      />,
    );

    expect(mockScrollToTop).toHaveBeenCalledTimes(2);
  });
});
