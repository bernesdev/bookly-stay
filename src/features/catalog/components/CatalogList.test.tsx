import React from 'react';

import { act, fireEvent, screen } from '@testing-library/react-native';

import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import { getDefaultErrorMock } from '@/testing/mocks/messages-utils.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useCatalog } from '../hooks/useCatalog';
import { useCatalogStore } from '../hooks/useCatalogStore';

import { CatalogList } from './CatalogList';

const mockUseCatalog = useCatalog as jest.Mock;
const mockUseCatalogStore = useCatalogStore as jest.Mock;
const mockRefetch = jest.fn();
const mockFetchNextPage = jest.fn();
let mockFlashListProps: Record<string, unknown> = {};
let mockSortOption: string | undefined;
let mockNewSearch: unknown;

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
      { testID: 'catalog-list' },
      ...data.map((item) => renderItem({ item })),
      ListFooterComponent?.(),
    );
  },
}));

jest.mock('@/src/shared/components/cards/AccommodationLargeCard', () => ({
  AccommodationLargeCard: ({ id }: { id: string }) => {
    const React = jest.requireActual('react');
    return React.createElement('Text', { testID: 'accommodation-card' }, id);
  },
}));

jest.mock('./CatalogItemSkeleton', () => ({
  CatalogItemSkeleton: () => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'catalog-skeleton' },
      'skeleton',
    );
  },
}));

jest.mock('../hooks/useCatalog', () => ({
  useCatalog: jest.fn(),
}));

jest.mock('../hooks/useCatalogStore', () => ({
  useCatalogStore: jest.fn(),
}));

describe('CatalogList', () => {
  const items = [
    makeAccommodation({ id: 'acc-1' }),
    makeAccommodation({ id: 'acc-2' }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFlashListProps = {};
    mockSortOption = 'price_asc';
    mockNewSearch = undefined;

    mockUseCatalogStore.mockImplementation((selector: any) =>
      selector({
        sortOption: mockSortOption,
        newSearch: mockNewSearch,
      }),
    );

    getDefaultErrorMock.mockReturnValue('default-error-message');
    mockUseCatalog.mockReturnValue({
      items,
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      sortOption: 'price_asc',
      newSearch: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render error state and retry when query fails and not loading', () => {
    mockUseCatalog.mockReturnValue({
      items: [],
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      sortOption: 'price_asc',
      newSearch: false,
      error: { message: '500' },
      refetch: mockRefetch,
    });

    renderWithProviders(
      <CatalogList onScroll={jest.fn() as any} topBarHeight={64} />,
    );

    expect(screen.getByTestId('error-message')).toBeTruthy();
    expect(
      screen.getByText('t:catalog.errors.loadAccommodations'),
    ).toBeTruthy();
    expect(screen.getByText('default-error-message')).toBeTruthy();

    fireEvent.press(screen.getByTestId('error-message-press'));

    expect(getDefaultErrorMock).toHaveBeenCalledWith('500');
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render loading/sorting skeleton state', () => {
    mockUseCatalog.mockReturnValue({
      items,
      fetchNextPage: mockFetchNextPage,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      sortOption: 'price_asc',
      newSearch: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(
      <CatalogList onScroll={jest.fn() as any} topBarHeight={64} />,
    );

    expect(screen.getAllByTestId('catalog-skeleton')).toHaveLength(5);
    expect(screen.queryByTestId('catalog-list')).toBeNull();
  });

  it('should render list after sorting delay, reset scrollY and handle pagination', () => {
    const scrollY = { value: 123 };
    const onScroll = jest.fn() as any;
    mockSortOption = 'distance';
    mockNewSearch = { location: { id: 'loc-1' } };

    mockUseCatalog.mockReturnValue({
      items,
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: true,
      hasNextPage: true,
      sortOption: 'distance',
      newSearch: true,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(
      <CatalogList
        onScroll={onScroll}
        topBarHeight={64}
        scrollY={scrollY as any}
      />,
    );

    expect(scrollY.value).toBe(0);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('catalog-list')).toBeTruthy();
    expect(screen.getAllByTestId('accommodation-card')).toHaveLength(2);
    expect(screen.getAllByTestId('catalog-skeleton')).toHaveLength(1);
    expect(mockFlashListProps.onScroll).toBe(onScroll);

    (mockFlashListProps.onEndReached as () => void)();

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });
});
