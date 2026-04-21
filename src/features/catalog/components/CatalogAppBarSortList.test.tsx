import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useCatalog } from '../hooks/useCatalog';
import { useCatalogStore } from '../hooks/useCatalogStore';

import { CatalogAppBarSortList } from './CatalogAppBarSortList';

const mockUseCatalog = useCatalog as jest.Mock;
const mockUseCatalogStore = useCatalogStore as jest.Mock;
const mockSetSortOption = jest.fn();
let mockFlashListProps: Record<string, unknown> = {};
let mockSortOption: string | undefined;

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({
    data,
    renderItem,
    ListHeaderComponent,
    ListFooterComponent,
    ...props
  }: {
    data: any[];
    renderItem: ({ item }: { item: any }) => React.ReactNode;
    ListHeaderComponent?: React.ReactNode;
    ListFooterComponent?: React.ReactNode;
  }) => {
    const React = jest.requireActual('react');
    mockFlashListProps = { ...props, data };

    return React.createElement(
      'View',
      { testID: 'sort-list' },
      ListHeaderComponent,
      ...data.map((item) => renderItem({ item })),
      ListFooterComponent,
    );
  },
}));

jest.mock('@/src/shared/components/Chip', () => ({
  Chip: ({
    title,
    onPress,
    active,
  }: {
    title: string;
    onPress?: () => void;
    active?: boolean;
  }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Pressable',
      { testID: 'sort-chip', onPress },
      React.createElement('Text', null, title),
      React.createElement('Text', { testID: 'chip-active' }, String(active)),
    );
  },
}));

jest.mock('../hooks/useCatalog', () => ({
  useCatalog: jest.fn(),
}));

jest.mock('../hooks/useCatalogStore', () => ({
  useCatalogStore: jest.fn(),
}));

describe('CatalogAppBarSortList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFlashListProps = {};
    mockSortOption = undefined;

    mockUseCatalogStore.mockImplementation((selector: any) =>
      selector({
        sortOption: mockSortOption,
        setSortOption: mockSetSortOption,
      }),
    );

    mockUseCatalog.mockReturnValue({
      sortOption: undefined,
      setSortOption: mockSetSortOption,
      error: null,
    });
  });

  it('should render sort list with three options and default list props', () => {
    renderWithProviders(<CatalogAppBarSortList />);

    expect(screen.getByTestId('sort-list')).toBeTruthy();
    expect(screen.getAllByTestId('sort-chip')).toHaveLength(3);
    expect(screen.getAllByText('t:catalog.sort.price')).toHaveLength(2);
    expect(screen.getByText('t:catalog.sort.distance')).toBeTruthy();
    expect(screen.getAllByTestId('chip-active')).toHaveLength(3);

    expect(mockFlashListProps.horizontal).toBe(true);
    expect(mockFlashListProps.showsHorizontalScrollIndicator).toBe(false);
    const keyExtractor = mockFlashListProps.keyExtractor as (item: {
      id: string;
    }) => string;
    expect(keyExtractor({ id: 'distance' })).toBe('distance');
  });

  it('should call setSortOption with selected option when pressing a different option', () => {
    mockSortOption = 'distance';
    mockUseCatalog.mockReturnValue({
      sortOption: 'distance',
      setSortOption: mockSetSortOption,
      error: null,
    });

    renderWithProviders(<CatalogAppBarSortList />);

    fireEvent.press(screen.getAllByTestId('sort-chip')[0]);

    expect(mockSetSortOption).toHaveBeenCalledTimes(1);
    expect(mockSetSortOption).toHaveBeenCalledWith('price_asc');
  });

  it('should clear sort option when pressing the same active option', () => {
    mockSortOption = 'price_asc';
    mockUseCatalog.mockReturnValue({
      sortOption: 'price_asc',
      setSortOption: mockSetSortOption,
      error: null,
    });

    renderWithProviders(<CatalogAppBarSortList />);

    fireEvent.press(screen.getAllByTestId('sort-chip')[0]);
    expect(mockSetSortOption).toHaveBeenCalledWith(undefined);
  });

  it('should not change sort option when catalog has error', () => {
    mockSortOption = 'distance';
    mockUseCatalog.mockReturnValue({
      sortOption: 'distance',
      setSortOption: mockSetSortOption,
      error: { message: 'network' },
    });

    renderWithProviders(<CatalogAppBarSortList />);

    fireEvent.press(screen.getAllByTestId('sort-chip')[1]);

    expect(mockSetSortOption).not.toHaveBeenCalled();
  });
});
