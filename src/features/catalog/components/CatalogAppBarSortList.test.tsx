import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useCatalogStore } from '../hooks/useCatalogStore';

import { CatalogAppBarSortList } from './CatalogAppBarSortList';

const mockUseCatalogStore = useCatalogStore as jest.Mock;
const mockSetSortOption = jest.fn();
let mockSortOption: string | undefined;

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

jest.mock('../hooks/useCatalogStore', () => ({
  useCatalogStore: jest.fn(),
}));

describe('CatalogAppBarSortList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSortOption = undefined;

    mockUseCatalogStore.mockImplementation((selector: any) =>
      selector({
        sortOption: mockSortOption,
        setSortOption: mockSetSortOption,
      }),
    );
  });

  it('should render sort list with three options and default list props', () => {
    renderWithProviders(<CatalogAppBarSortList />);

    expect(screen.getAllByTestId('sort-chip')).toHaveLength(3);
    expect(screen.getAllByText('t:catalog.sort.price')).toHaveLength(2);
    expect(screen.getByText('t:catalog.sort.distance')).toBeTruthy();
    expect(screen.getAllByTestId('chip-active')).toHaveLength(3);
  });

  it('should call setSortOption with selected option when pressing a different option', () => {
    mockSortOption = 'distance';

    renderWithProviders(<CatalogAppBarSortList />);

    fireEvent.press(screen.getAllByTestId('sort-chip')[0]);

    expect(mockSetSortOption).toHaveBeenCalledTimes(1);
    expect(mockSetSortOption).toHaveBeenCalledWith('price_asc');
  });

  it('should clear sort option when pressing the same active option', () => {
    mockSortOption = 'price_asc';

    renderWithProviders(<CatalogAppBarSortList />);

    fireEvent.press(screen.getAllByTestId('sort-chip')[0]);
    expect(mockSetSortOption).toHaveBeenCalledWith(undefined);
  });

  it('should select tapped sort option when current option is different', () => {
    mockSortOption = 'distance';

    renderWithProviders(<CatalogAppBarSortList />);

    fireEvent.press(screen.getAllByTestId('sort-chip')[1]);

    expect(mockSetSortOption).toHaveBeenCalledTimes(1);
    expect(mockSetSortOption).toHaveBeenCalledWith('price_desc');
  });
});
