import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { useStayStore } from '@/src/shared/hooks/useStayStore';
import {
  getAppScreenMockProps,
  resetAppScreenMock,
  setAppScreenMockRenderProps,
} from '@/testing/mocks/app-screen.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { CatalogScreen } from './CatalogScreen';

const mockBack = jest.fn();
const mockUseStayStore = useStayStore as unknown as jest.Mock;
const mockSearchOptionsPresent = jest.fn();
const mockCatalogList = jest.fn();
const mockOnScroll = jest.fn();
const mockScrollY = { value: 0 };

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock('@/src/shared/hooks/useStayStore', () => ({
  useStayStore: jest.fn(),
}));

jest.mock('@/src/shared/selectors/stay.selectors', () => ({
  selectLocationDatesLabel: jest.fn(() => 'Rio de Janeiro · 1 Jan - 2 Jan'),
}));

jest.mock('@/src/shared/components/fields/TextField', () => ({
  TextField: ({
    value,
    onPress,
    onPrefixIconPress,
  }: {
    value?: string;
    onPress?: () => void;
    onPrefixIconPress?: () => void;
  }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'View',
      { testID: 'catalog-search-field' },
      React.createElement(
        'Pressable',
        { testID: 'catalog-search-open', onPress },
        React.createElement('Text', null, value),
      ),
      React.createElement(
        'Pressable',
        { testID: 'catalog-search-back', onPress: onPrefixIconPress },
        React.createElement('Text', null, 'back'),
      ),
    );
  },
}));

jest.mock('../components/CatalogAppBarSortList', () => ({
  CatalogAppBarSortList: () => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'catalog-sort-list' },
      'sort-list',
    );
  },
}));

jest.mock('../components/CatalogList', () => ({
  CatalogList: (props: any) => {
    mockCatalogList(props);
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'catalog-list' },
      'catalog-list',
    );
  },
}));

jest.mock('../components/SearchOptionsSheet', () => ({
  SearchOptionsSheet: ({
    sheetRef,
  }: {
    sheetRef?: { current: { present: () => void } | null };
  }) => {
    const React = jest.requireActual('react');
    if (sheetRef) {
      sheetRef.current = { present: mockSearchOptionsPresent };
    }
    return React.createElement(
      'Text',
      { testID: 'search-options-sheet' },
      'sheet',
    );
  },
}));

describe('CatalogScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();
    setAppScreenMockRenderProps({
      onScroll: mockOnScroll,
      topBarHeight: 72,
      scrollY: mockScrollY,
    });
    mockUseStayStore.mockImplementation((selector: any) =>
      selector({
        stay: {
          location: { title: 'Rio de Janeiro' },
        },
      }),
    );
  });

  it('should render AppScreen with app bar components and screen content', () => {
    renderWithProviders(<CatalogScreen />);

    expect(screen.getByTestId('app-screen')).toBeTruthy();
    expect(screen.getByTestId('catalog-search-field')).toBeTruthy();
    expect(screen.getByTestId('catalog-sort-list')).toBeTruthy();
    expect(screen.getByTestId('catalog-list')).toBeTruthy();
    expect(screen.getByTestId('search-options-sheet')).toBeTruthy();

    expect(getAppScreenMockProps().preset).toBe('list');
    expect(getAppScreenMockProps().appBar).toEqual(
      expect.objectContaining({
        title: 't:catalog.screen.title',
        footerHeight: 56,
        collapsableFooter: true,
        HeaderComponent: expect.any(Object),
        FooterComponent: expect.any(Object),
      }),
    );
  });

  it('should pass render props to CatalogList and wire search field actions', () => {
    renderWithProviders(<CatalogScreen />);

    expect(mockCatalogList).toHaveBeenCalledWith(
      expect.objectContaining({
        onScroll: mockOnScroll,
        topBarHeight: 72,
        scrollY: mockScrollY,
        ref: expect.objectContaining({ current: null }),
      }),
    );

    fireEvent.press(screen.getByTestId('catalog-search-back'));
    expect(mockBack).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByTestId('catalog-search-open'));
    expect(mockSearchOptionsPresent).toHaveBeenCalledTimes(1);
  });
});
