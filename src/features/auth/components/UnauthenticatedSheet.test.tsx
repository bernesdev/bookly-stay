import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { UnauthenticatedSheet } from './UnauthenticatedSheet';

const mockPush = jest.fn();
const mockHideSheet = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/src/shared/hooks/useBottomSheet', () => ({
  useBottomSheet: () => ({
    hideSheet: mockHideSheet,
  }),
}));

jest.mock('@/src/shared/components/buttons/IconButton', () => ({
  IconButton: ({ onPress }: { onPress?: () => void }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Pressable',
      { onPress, testID: 'close-button' },
      React.createElement('Text', null, 'close'),
    );
  },
}));

jest.mock('@/src/shared/components/buttons/SolidButton', () => ({
  SolidButton: ({
    title,
    onPress,
  }: {
    title: string;
    onPress?: () => void;
  }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Pressable',
      { onPress, testID: 'action-button' },
      React.createElement('Text', null, title),
    );
  },
}));

describe('UnauthenticatedSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render translated title, provided description and action label', () => {
    renderWithProviders(<UnauthenticatedSheet title="Session expired" />);

    expect(screen.getByText('t:auth.unauthenticatedSheet.title')).toBeTruthy();
    expect(screen.getByText('Session expired')).toBeTruthy();
    expect(screen.getByText('t:auth.unauthenticatedSheet.action')).toBeTruthy();
  });

  it('should hide sheet when close button is pressed', () => {
    renderWithProviders(<UnauthenticatedSheet title="Session expired" />);

    fireEvent.press(screen.getByTestId('close-button'));

    expect(mockHideSheet).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should hide sheet and navigate to auth when action button is pressed', () => {
    renderWithProviders(<UnauthenticatedSheet title="Session expired" />);

    fireEvent.press(screen.getByTestId('action-button'));

    expect(mockHideSheet).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/auth');
  });
});
