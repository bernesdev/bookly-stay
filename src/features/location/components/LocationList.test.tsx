import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useLocation } from '../hooks/useLocation';

import { LocationList } from './LocationList';

const mockUseLocation = useLocation as jest.Mock;
const mockLocationItem = jest.fn();

jest.mock('../hooks/useLocation', () => ({
  useLocation: jest.fn(),
}));

jest.mock('@/src/shared/components/SectionTitle', () => ({
  SectionTitle: ({ title }: { title: string }) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');

    return React.createElement(
      Text,
      { testID: 'location-list-section-title' },
      title,
    );
  },
}));

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({
    data,
    renderItem,
  }: {
    data: any[];
    renderItem: ({ item }: { item: any }) => React.ReactNode;
  }) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');

    return React.createElement(
      View,
      { testID: 'location-list' },
      ...data.map((item) => renderItem({ item })),
    );
  },
}));

jest.mock('./LocationItem', () => ({
  LocationItem: ({
    location,
    onSelect,
  }: {
    location: {
      id: string;
      city: string;
      country: string;
      lat: string;
      lng: string;
    };
    onSelect: (location: unknown) => void;
  }) => {
    mockLocationItem({ location, onSelect });
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');

    return React.createElement(
      Pressable,
      {
        testID: `location-item-${location.id}`,
        onPress: () => onSelect(location),
      },
      React.createElement(Text, null, `${location.city}, ${location.country}`),
    );
  },
}));

jest.mock('./LocationItemSkeleton', () => ({
  LocationItemSkeleton: () => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');

    return React.createElement(
      Text,
      { testID: 'location-item-skeleton' },
      'skeleton',
    );
  },
}));

describe('LocationList', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocation.mockReturnValue({
      hasItems: true,
      items: [
        {
          id: 'loc-1',
          city: 'Rio',
          country: 'Brazil',
          lat: '-22.9',
          lng: '-43.2',
        },
      ],
      isLoading: false,
      error: null,
      isFetched: true,
    });
  });

  it('should render section title and location items when hasItems is true', () => {
    renderWithProviders(<LocationList query="ri" onSelect={jest.fn()} />);

    expect(screen.getByTestId('location-list-section-title')).toBeTruthy();
    expect(
      screen.getByText('t:location.locationList.sectionTitle'),
    ).toBeTruthy();
    expect(screen.getByTestId('location-list')).toBeTruthy();
    expect(screen.getByTestId('location-item-loc-1')).toBeTruthy();

    expect(mockUseLocation).toHaveBeenCalledWith('ri');
    expect(mockLocationItem).toHaveBeenCalledTimes(1);
  });

  it('should render load error message when hook has error', () => {
    mockUseLocation.mockReturnValue({
      hasItems: false,
      items: [],
      isLoading: false,
      error: new Error('failed'),
      isFetched: true,
    });

    renderWithProviders(<LocationList query="ri" onSelect={jest.fn()} />);

    expect(screen.getByText('t:location.locationList.loadError')).toBeTruthy();
    expect(screen.queryByTestId('location-list')).toBeNull();
  });

  it('should render skeletons while loading', () => {
    mockUseLocation.mockReturnValue({
      hasItems: false,
      items: [],
      isLoading: true,
      error: null,
      isFetched: false,
    });

    renderWithProviders(<LocationList query="ri" onSelect={jest.fn()} />);

    expect(screen.getAllByTestId('location-item-skeleton')).toHaveLength(10);
    expect(screen.queryByText('t:location.locationList.empty')).toBeNull();
  });

  it('should render empty message when fetched with no items and no error', () => {
    mockUseLocation.mockReturnValue({
      hasItems: false,
      items: [],
      isLoading: false,
      error: null,
      isFetched: true,
    });

    renderWithProviders(<LocationList query="ri" onSelect={jest.fn()} />);

    expect(screen.getByText('t:location.locationList.empty')).toBeTruthy();
    expect(screen.queryByTestId('location-list')).toBeNull();
  });

  it('should forward onSelect to LocationItem', () => {
    const onSelect = jest.fn();

    renderWithProviders(<LocationList query="ri" onSelect={onSelect} />);

    fireEvent.press(screen.getByTestId('location-item-loc-1'));

    expect(onSelect).toHaveBeenCalledWith({
      id: 'loc-1',
      city: 'Rio',
      country: 'Brazil',
      lat: '-22.9',
      lng: '-43.2',
    });
  });
});
