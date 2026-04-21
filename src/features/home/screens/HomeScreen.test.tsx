import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { useStayStore } from '@/src/shared/hooks/useStayStore';
import {
  getAppScreenMockProps,
  resetAppScreenMock,
} from '@/testing/mocks/app-screen.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { HomeScreen } from './HomeScreen';

const mockPush = jest.fn();
const mockSetGeoLocation = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/src/shared/hooks/useStayStore', () => ({
  useStayStore: jest.fn(),
}));

jest.mock('@/src/shared/components/search/SearchInputOptions', () => ({
  SearchInputOptions: ({ onSubmit }: { onSubmit?: () => void }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');

    return React.createElement(
      Pressable,
      { testID: 'search-input-options', onPress: onSubmit },
      React.createElement(Text, null, 'search-input-options'),
    );
  },
}));

jest.mock('../components/TopDestinationsList', () => ({
  TopDestinationsList: () => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(
      Text,
      { testID: 'top-destinations-list-section' },
      'top-destinations-list',
    );
  },
}));

jest.mock('../components/CloseToYouList', () => ({
  CloseToYouList: () => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(
      Text,
      { testID: 'close-to-you-list-section' },
      'close-to-you-list',
    );
  },
}));

const mockUseStayStore = useStayStore as unknown as jest.Mock;

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();

    mockUseStayStore.mockImplementation((selector: any) =>
      selector({
        setGeoLocation: mockSetGeoLocation,
      }),
    );
  });

  it('should render app screen with expected app bar and home sections', () => {
    renderWithProviders(<HomeScreen />);

    expect(screen.getByTestId('app-screen')).toBeTruthy();
    expect(screen.getByTestId('search-input-options')).toBeTruthy();
    expect(screen.getByTestId('top-destinations-list-section')).toBeTruthy();
    expect(screen.getByTestId('close-to-you-list-section')).toBeTruthy();
    expect(getAppScreenMockProps().appBar).toEqual({
      showLogo: true,
      showLeading: false,
    });
  });

  it('should request geo location on mount', () => {
    renderWithProviders(<HomeScreen />);

    expect(mockSetGeoLocation).toHaveBeenCalledTimes(1);
  });

  it('should navigate to catalog when search is submitted', () => {
    renderWithProviders(<HomeScreen />);

    fireEvent.press(screen.getByTestId('search-input-options'));

    expect(mockPush).toHaveBeenCalledWith('/catalog');
  });
});
