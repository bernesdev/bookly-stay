import React from 'react';

import { screen } from '@testing-library/react-native';

import {
  getAppScreenMockProps,
  resetAppScreenMock,
  setAppScreenMockRenderProps,
} from '@/testing/mocks/app-screen.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { DestinationsScreen } from './DestinationsScreen';

const mockDestinationsList = jest.fn();
const mockOnScroll = jest.fn();

describe('DestinationsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();
    setAppScreenMockRenderProps({
      onScroll: mockOnScroll,
      topBarHeight: 96,
    });
  });

  it('should render app screen with destinations app bar configuration', () => {
    renderWithProviders(<DestinationsScreen />);

    expect(screen.getByTestId('app-screen')).toBeTruthy();
    expect(screen.getByTestId('destinations-list')).toBeTruthy();

    expect(getAppScreenMockProps().preset).toBe('list');
    expect(getAppScreenMockProps().appBar).toEqual({
      title: 't:location.destinationsScreen.appBarTitle',
      showLeading: true,
    });
  });

  it('should pass app screen render props to destinations list', () => {
    renderWithProviders(<DestinationsScreen />);

    expect(mockDestinationsList).toHaveBeenCalledWith(
      expect.objectContaining({
        onScroll: mockOnScroll,
        topBarHeight: 96,
      }),
    );
  });
});

jest.mock('../components/DestinationsList', () => ({
  DestinationsList: (props: any) => {
    mockDestinationsList(props);
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');

    return React.createElement(
      Text,
      { testID: 'destinations-list' },
      'destinations-list',
    );
  },
}));
