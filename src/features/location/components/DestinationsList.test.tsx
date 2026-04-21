import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { useTopDestinationsQuery } from '@/src/features/location/api/location.queries';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { getDefaultErrorMock } from '@/testing/mocks/messages-utils.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { DestinationsList } from './DestinationsList';

const mockUseTopDestinationsQuery = useTopDestinationsQuery as jest.Mock;
const mockUseLayout = useLayout as jest.Mock;
const mockFetchNextPage = jest.fn();
const mockRefetch = jest.fn();
const mockOnScroll = jest.fn();
let mockFlashListProps: Record<string, unknown> = {};

jest.mock('@/src/features/location/api/location.queries', () => ({
  useTopDestinationsQuery: jest.fn(),
}));

jest.mock('@/src/shared/hooks/useLayout', () => ({
  useLayout: jest.fn(),
}));

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({
    data,
    renderItem,
    ItemSeparatorComponent,
    ListFooterComponent,
    ...props
  }: {
    data: any[];
    renderItem: ({
      item,
      index,
    }: {
      item: any;
      index: number;
    }) => React.ReactNode;
    ItemSeparatorComponent?: () => React.ReactNode;
    ListFooterComponent?: () => React.ReactNode;
  }) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');

    mockFlashListProps = { ...props, data };

    return React.createElement(
      View,
      { testID: 'destinations-list' },
      ...data.flatMap((item, index) => {
        const nodes = [renderItem({ item, index })];
        if (index < data.length - 1 && ItemSeparatorComponent) {
          nodes.push(ItemSeparatorComponent());
        }
        return nodes;
      }),
      ListFooterComponent?.(),
    );
  },
}));

jest.mock('@/src/shared/components/cards/DestinationCard', () => ({
  DestinationCard: ({ id }: { id: string }) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, { testID: 'destination-card' }, id);
  },
}));

jest.mock('./DestinationSkeleton', () => ({
  DestinationSkeleton: ({ className }: { className?: string }) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(
      Text,
      { testID: 'destination-skeleton', className },
      'skeleton',
    );
  },
}));

describe('DestinationsList', () => {
  const items = [
    { id: 'dest-1', city: 'Rio' },
    { id: 'dest-2', city: 'Tokyo' },
  ] as any[];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFlashListProps = {};

    mockUseLayout.mockReturnValue({
      bottomOffset: 20,
    });

    getDefaultErrorMock.mockReturnValue('default-error-message');

    mockUseTopDestinationsQuery.mockReturnValue({
      data: { pages: [{ data: items }] },
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  it('should render list and pass expected flash list handlers and props', () => {
    renderWithProviders(
      <DestinationsList topBarHeight={100} onScroll={mockOnScroll as any} />,
    );

    expect(screen.getByTestId('destinations-list')).toBeTruthy();
    expect(screen.getAllByTestId('destination-card')).toHaveLength(2);
    expect(screen.getByText('dest-1')).toBeTruthy();
    expect(screen.getByText('dest-2')).toBeTruthy();

    expect(mockUseTopDestinationsQuery).toHaveBeenCalledWith({ limit: 8 });
    expect(mockFlashListProps.onScroll).toBe(mockOnScroll);
    expect(mockFlashListProps.numColumns).toBe(2);
    expect(mockFlashListProps.onEndReachedThreshold).toBe(0.5);
    expect(mockFlashListProps.contentContainerStyle).toEqual({
      paddingHorizontal: 12,
      paddingTop: 124,
      paddingBottom: 20,
    });
  });

  it('should call fetchNextPage when list reaches end', () => {
    renderWithProviders(
      <DestinationsList topBarHeight={100} onScroll={mockOnScroll as any} />,
    );

    (mockFlashListProps.onEndReached as () => void)();

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('should render loading skeletons while loading', () => {
    mockUseTopDestinationsQuery.mockReturnValue({
      data: undefined,
      fetchNextPage: mockFetchNextPage,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(
      <DestinationsList topBarHeight={100} onScroll={mockOnScroll as any} />,
    );

    expect(screen.getAllByTestId('destination-skeleton')).toHaveLength(5);
    expect(screen.queryByTestId('destinations-list')).toBeNull();
  });

  it('should render error state and retry when query fails and not loading', () => {
    mockUseTopDestinationsQuery.mockReturnValue({
      data: undefined,
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      error: { message: '500' },
      refetch: mockRefetch,
    });

    renderWithProviders(
      <DestinationsList topBarHeight={100} onScroll={mockOnScroll as any} />,
    );

    expect(screen.getByTestId('error-message')).toBeTruthy();
    expect(
      screen.getByText('t:location.destinationsList.loadErrorTitle'),
    ).toBeTruthy();
    expect(screen.getByText('default-error-message')).toBeTruthy();
    expect(getDefaultErrorMock).toHaveBeenCalledWith('500');

    fireEvent.press(screen.getByTestId('error-retry'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render footer skeleton when fetching next page and has next page', () => {
    mockUseTopDestinationsQuery.mockReturnValue({
      data: { pages: [{ data: items }] },
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
      isFetchingNextPage: true,
      hasNextPage: true,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(
      <DestinationsList topBarHeight={100} onScroll={mockOnScroll as any} />,
    );

    expect(screen.getAllByTestId('destination-skeleton')).toHaveLength(1);
  });
});
