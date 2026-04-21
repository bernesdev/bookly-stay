import React from 'react';

import { act, fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useCatalogStore } from '../hooks/useCatalogStore';

import { SearchOptionsRef, SearchOptionsSheet } from './SearchOptionsSheet';

const mockSetNewSearch = jest.fn();

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (callback: () => void) => callback(),
}));

jest.mock('../hooks/useCatalog', () => ({
  useCatalog: jest.fn(),
}));

jest.mock('../hooks/useCatalogStore', () => ({
  useCatalogStore: jest.fn(),
}));

jest.mock('@/src/shared/components/buttons/IconButton', () => ({
  IconButton: ({ onPress }: { onPress?: () => void }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Pressable',
      { testID: 'close-button', onPress },
      React.createElement('Text', null, 'close'),
    );
  },
}));

jest.mock('@/src/shared/components/search/SearchInputOptions', () => ({
  SearchInputOptions: ({ onSubmit }: { onSubmit: (stay: string) => void }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Pressable',
      {
        testID: 'search-options-submit',
        onPress: () => onSubmit('Rio de Janeiro'),
      },
      React.createElement('Text', null, 'search-options'),
    );
  },
}));

describe('SearchOptionsSheet', () => {
  const mockUseCatalogStore = useCatalogStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCatalogStore.mockImplementation((selector: any) =>
      selector({
        setNewSearch: mockSetNewSearch,
      }),
    );
  });

  it('should start closed and expose present/dismiss methods on ref', () => {
    const sheetRef = {
      current: null,
    } as unknown as React.RefObject<SearchOptionsRef | null>;

    renderWithProviders(<SearchOptionsSheet sheetRef={sheetRef} />);

    expect(screen.queryByText('t:catalog.searchSheet.title')).toBeNull();
    expect(sheetRef.current?.present).toBeDefined();
    expect(sheetRef.current?.dismiss).toBeDefined();
  });

  it('should open when present is called and close when pressing close button', () => {
    const sheetRef = {
      current: null,
    } as unknown as React.RefObject<SearchOptionsRef | null>;

    renderWithProviders(<SearchOptionsSheet sheetRef={sheetRef} />);

    act(() => {
      sheetRef.current?.present();
    });

    expect(screen.getByText('t:catalog.searchSheet.title')).toBeTruthy();
    expect(screen.getByTestId('search-options-submit')).toBeTruthy();

    fireEvent.press(screen.getByTestId('close-button'));

    expect(screen.queryByText('t:catalog.searchSheet.title')).toBeNull();
  });

  it('should dismiss and call setNewSearch when submitting search options', () => {
    const sheetRef = {
      current: null,
    } as unknown as React.RefObject<SearchOptionsRef | null>;

    renderWithProviders(<SearchOptionsSheet sheetRef={sheetRef} />);

    act(() => {
      sheetRef.current?.present();
    });

    fireEvent.press(screen.getByTestId('search-options-submit'));

    expect(mockSetNewSearch).toHaveBeenCalledWith('Rio de Janeiro');
    expect(screen.queryByText('t:catalog.searchSheet.title')).toBeNull();
  });

  it('should clear sheet ref on unmount', () => {
    const sheetRef = {
      current: null,
    } as unknown as React.RefObject<SearchOptionsRef | null>;

    const { unmount } = renderWithProviders(
      <SearchOptionsSheet sheetRef={sheetRef} />,
    );

    expect(sheetRef.current).not.toBeNull();

    unmount();

    expect(sheetRef.current).toBeNull();
  });
});
