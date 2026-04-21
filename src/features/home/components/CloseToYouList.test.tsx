import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { useAccommodationsQuery } from '@/src/features/accommodation';
import { useStayStore } from '@/src/shared/hooks/useStayStore';
import '@/testing/mocks';
import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { CloseToYouList } from './CloseToYouList';

const mockPush = jest.fn();
const mockUseLocalSearchParams = jest.fn();
const mockSetStay = jest.fn();
const mockRefetch = jest.fn();
const mockUseAccommodationsQuery = useAccommodationsQuery as jest.Mock;
const mockUseStayStore = useStayStore as unknown as jest.Mock;

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@/src/features/accommodation', () => ({
  useAccommodationsQuery: jest.fn(),
}));

jest.mock('@/src/shared/hooks/useStayStore', () => ({
  useStayStore: jest.fn(),
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
      { testID: 'close-to-you-list' },
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

jest.mock('./LocationError', () => ({
  LocationError: ({ onRetry }: { onRetry?: () => void }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');

    return React.createElement(
      Pressable,
      { testID: 'location-error', onPress: onRetry },
      React.createElement(Text, null, 'location-error'),
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

jest.mock('./AccommodationSmallCardSkeleton', () => ({
  AccommodationSmallCardSkeleton: () => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(
      Text,
      { testID: 'accommodation-small-card-skeleton' },
      'skeleton',
    );
  },
}));

jest.mock('@/src/shared/components/cards/AccommodationSmallCard', () => ({
  AccommodationSmallCard: ({ id }: { id: string }) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(
      Text,
      { testID: 'accommodation-small-card' },
      id,
    );
  },
}));

describe('CloseToYouList', () => {
  const geoLocation = { id: 'loc-1', city: 'Rio' } as any;
  const items = [
    makeAccommodation({ id: 'acc-1' }),
    makeAccommodation({ id: 'acc-2' }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStayStore.mockImplementation((selector: any) =>
      selector({
        geoLocation,
        locationStatus: 'granted',
        setStay: mockSetStay,
      }),
    );

    mockUseAccommodationsQuery.mockReturnValue({
      data: { pages: [{ data: items }] },
      status: 'success',
      error: null,
      refetch: mockRefetch,
    });
  });

  it('should render section title and list items when location is granted and query succeeds', () => {
    renderWithProviders(<CloseToYouList />);

    expect(screen.getByTestId('section-title')).toBeTruthy();
    expect(screen.getByText('t:home.sections.closeToYou')).toBeTruthy();
    expect(screen.getByText('t:home.actions.seeAll')).toBeTruthy();
    expect(screen.getByTestId('close-to-you-list')).toBeTruthy();
    expect(screen.getByText('acc-1')).toBeTruthy();
    expect(screen.getByText('acc-2')).toBeTruthy();

    expect(mockUseAccommodationsQuery).toHaveBeenCalledWith({
      locationId: 'loc-1',
      limit: 5,
    });
  });

  it('should set stay location and navigate to catalog when pressing see all without error', () => {
    renderWithProviders(<CloseToYouList />);

    fireEvent.press(screen.getByTestId('see-all-button'));

    expect(mockSetStay).toHaveBeenCalledWith({ location: geoLocation });
    expect(mockPush).toHaveBeenCalledWith('/catalog');
  });

  it('should not navigate when query has error and see all is pressed', () => {
    mockUseAccommodationsQuery.mockReturnValue({
      data: undefined,
      status: 'error',
      error: new Error('load failed'),
      refetch: mockRefetch,
    });

    renderWithProviders(<CloseToYouList />);

    fireEvent.press(screen.getByTestId('see-all-button'));

    expect(mockSetStay).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should render location error and retry when location is denied', () => {
    mockUseStayStore.mockImplementation((selector: any) =>
      selector({
        geoLocation,
        locationStatus: 'denied',
        setStay: mockSetStay,
      }),
    );

    renderWithProviders(<CloseToYouList />);

    expect(screen.getByTestId('location-error')).toBeTruthy();

    fireEvent.press(screen.getByTestId('location-error'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render an empty list while loading when location is granted', () => {
    mockUseAccommodationsQuery.mockReturnValue({
      data: undefined,
      status: 'pending',
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<CloseToYouList />);

    expect(
      screen.queryByTestId('accommodation-small-card-skeleton'),
    ).toBeNull();
    expect(screen.getByTestId('close-to-you-list')).toBeTruthy();
  });

  it('should render skeletons when location status is undetermined', () => {
    mockUseStayStore.mockImplementation((selector: any) =>
      selector({
        geoLocation,
        locationStatus: 'undetermined',
        setStay: mockSetStay,
      }),
    );

    renderWithProviders(<CloseToYouList />);

    expect(
      screen.getAllByTestId('accommodation-small-card-skeleton'),
    ).toHaveLength(5);
  });

  it('should render section error and retry when query fails with granted location', () => {
    mockUseAccommodationsQuery.mockReturnValue({
      data: undefined,
      status: 'error',
      error: new Error('load failed'),
      refetch: mockRefetch,
    });

    renderWithProviders(<CloseToYouList />);

    expect(screen.getByTestId('section-error')).toBeTruthy();
    expect(screen.getByText('t:home.errors.closeToYouLoad')).toBeTruthy();

    fireEvent.press(screen.getByTestId('section-error-retry'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
