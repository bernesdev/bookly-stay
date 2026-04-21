import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useLocationStore } from '../hooks/useLocationStore';

import { HistoryList } from './HistoryList';

const mockUseLocationStore = useLocationStore as jest.Mock;
const mockHistoryItem = jest.fn();
let mockSearchHistory: any[] = [];

jest.mock('../hooks/useLocationStore', () => ({
  useLocationStore: jest.fn(),
}));

jest.mock('@/src/shared/components/SectionTitle', () => ({
  SectionTitle: ({ title }: { title: string }) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');

    return React.createElement(
      Text,
      { testID: 'history-section-title' },
      title,
    );
  },
}));

jest.mock('./HistoryItem', () => ({
  HistoryItem: ({
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
    mockHistoryItem({ location, onSelect });
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');

    return React.createElement(
      Pressable,
      {
        testID: `history-item-${location.id}`,
        onPress: () => onSelect(location),
      },
      React.createElement(Text, null, `${location.city}, ${location.country}`),
    );
  },
}));

describe('HistoryList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchHistory = [];
    mockUseLocationStore.mockImplementation((selector: any) =>
      selector({
        searchHistory: mockSearchHistory,
      }),
    );
  });

  it('should render empty message when search history is empty', () => {
    mockSearchHistory = [];

    renderWithProviders(<HistoryList onSelect={jest.fn()} />);

    expect(screen.getByText('t:location.historyList.empty')).toBeTruthy();
    expect(screen.queryByTestId('history-section-title')).toBeNull();
  });

  it('should render section title and history items when there is search history', () => {
    mockSearchHistory = [
      {
        id: 'loc-1',
        city: 'Rio',
        country: 'Brazil',
        lat: '-22.9',
        lng: '-43.2',
      },
      {
        id: 'loc-2',
        city: 'Tokyo',
        country: 'Japan',
        lat: '35.7',
        lng: '139.7',
      },
    ];

    renderWithProviders(<HistoryList onSelect={jest.fn()} />);

    expect(screen.getByTestId('history-section-title')).toBeTruthy();
    expect(
      screen.getByText('t:location.historyList.sectionTitle'),
    ).toBeTruthy();
    expect(screen.getByTestId('history-item-loc-1')).toBeTruthy();
    expect(screen.getByTestId('history-item-loc-2')).toBeTruthy();
    expect(mockHistoryItem).toHaveBeenCalledTimes(2);
  });

  it('should forward onSelect to history items', () => {
    const onSelect = jest.fn();
    const historyItem = {
      id: 'loc-1',
      city: 'Rio',
      country: 'Brazil',
      lat: '-22.9',
      lng: '-43.2',
    };

    mockSearchHistory = [historyItem];

    renderWithProviders(<HistoryList onSelect={onSelect} />);

    fireEvent.press(screen.getByTestId('history-item-loc-1'));

    expect(onSelect).toHaveBeenCalledWith(historyItem);
  });
});
