import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { useTopDestinationsQuery } from '@/src/features/location/api/location.queries';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { TopDestinationsList } from './TopDestinationsList';

const mockPush = jest.fn();
const mockRefetch = jest.fn();
const mockUseTopDestinationsQuery = useTopDestinationsQuery as jest.Mock;

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/src/features/location/api/location.queries', () => ({
  useTopDestinationsQuery: jest.fn(),
}));

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({
    data,
    renderItem,
    ItemSeparatorComponent,
  }: {
    data: any[];
    renderItem: ({ item }: { item: any }) => React.ReactNode;
    ItemSeparatorComponent?: () => React.ReactNode;
  }) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');

    return React.createElement(
      View,
      { testID: 'top-destinations-list' },
      ...data.flatMap((item, index) => {
        const nodes = [renderItem({ item })];
        if (index < data.length - 1 && ItemSeparatorComponent) {
          nodes.push(ItemSeparatorComponent());
        }
        return nodes;
      }),
    );
  },
}));

jest.mock('@/src/shared/components/SectionTitle', () => ({
  SectionTitle: ({
    title,
    buttonText,
    onButtonPress,
  }: {
    title: string;
    buttonText: string;
    onButtonPress?: () => void;
  }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text, View } = jest.requireActual('react-native');

    return React.createElement(
      View,
      { testID: 'section-title' },
      React.createElement(Text, null, title),
      React.createElement(
        Pressable,
        { testID: 'see-all-button', onPress: onButtonPress },
        React.createElement(Text, null, buttonText),
      ),
    );
  },
}));

jest.mock('./SectionError', () => ({
  SectionError: ({
    title,
    onRetry,
  }: {
    title: string;
    onRetry?: () => void;
  }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text, View } = jest.requireActual('react-native');

    return React.createElement(
      View,
      { testID: 'section-error' },
      React.createElement(Text, null, title),
      React.createElement(
        Pressable,
        { testID: 'section-error-retry', onPress: onRetry },
        React.createElement(Text, null, 'retry'),
      ),
    );
  },
}));

jest.mock('@/src/shared/components/AppSkeleton', () => ({
  AppSkeleton: () => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, { testID: 'destination-skeleton' }, 's');
  },
}));

jest.mock('@/src/shared/components/cards/DestinationCard', () => ({
  DestinationCard: ({ id }: { id: string }) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, { testID: 'destination-card' }, id);
  },
}));

describe('TopDestinationsList', () => {
  const items = [
    { id: 'dest-1', city: 'Rio' },
    { id: 'dest-2', city: 'Tokyo' },
  ] as any[];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTopDestinationsQuery.mockReturnValue({
      data: { pages: [{ data: items }] },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  it('should render title and destination list when query succeeds', () => {
    renderWithProviders(<TopDestinationsList />);

    expect(screen.getByTestId('section-title')).toBeTruthy();
    expect(screen.getByText('t:home.sections.topDestinations')).toBeTruthy();
    expect(screen.getByText('t:home.actions.seeAll')).toBeTruthy();
    expect(screen.getByTestId('top-destinations-list')).toBeTruthy();
    expect(screen.getByText('dest-1')).toBeTruthy();
    expect(screen.getByText('dest-2')).toBeTruthy();

    expect(mockUseTopDestinationsQuery).toHaveBeenCalledWith({ limit: 5 });
  });

  it('should navigate to destinations when pressing see all without error', () => {
    renderWithProviders(<TopDestinationsList />);

    fireEvent.press(screen.getByTestId('see-all-button'));

    expect(mockPush).toHaveBeenCalledWith('/destinations');
  });

  it('should not navigate when query has error and see all is pressed', () => {
    mockUseTopDestinationsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('load failed'),
      refetch: mockRefetch,
    });

    renderWithProviders(<TopDestinationsList />);

    fireEvent.press(screen.getByTestId('see-all-button'));

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should render loading skeletons while loading', () => {
    mockUseTopDestinationsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<TopDestinationsList />);

    expect(screen.getAllByTestId('destination-skeleton')).toHaveLength(5);
  });

  it('should render section error and call retry when query fails', () => {
    mockUseTopDestinationsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('load failed'),
      refetch: mockRefetch,
    });

    renderWithProviders(<TopDestinationsList />);

    expect(screen.getByTestId('section-error')).toBeTruthy();
    expect(screen.getByText('t:home.errors.topDestinationsLoad')).toBeTruthy();

    fireEvent.press(screen.getByTestId('section-error-retry'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render an empty list when there is no data', () => {
    mockUseTopDestinationsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<TopDestinationsList />);

    expect(screen.getByTestId('top-destinations-list')).toBeTruthy();
    expect(screen.queryByTestId('destination-card')).toBeNull();
  });
});
