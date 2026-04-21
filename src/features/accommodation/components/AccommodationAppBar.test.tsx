import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { AccommodationAppBar } from './AccommodationAppBar';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('@/src/shared/components/animations/BouncyPressable', () => ({
  BouncyPressable: ({
    children,
    onPress,
  }: {
    children: React.ReactNode;
    onPress?: () => void;
  }) => {
    const { Pressable } = require('react-native');
    return (
      <Pressable testID="bouncy-pressable" onPress={onPress}>
        {children}
      </Pressable>
    );
  },
}));

describe('AccommodationAppBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the title', () => {
    renderWithProviders(<AccommodationAppBar />);

    expect(screen.getByText('t:accommodation.appBar.title')).toBeTruthy();
  });

  it('should navigate back when back button is pressed', () => {
    renderWithProviders(<AccommodationAppBar />);

    fireEvent.press(screen.getByTestId('bouncy-pressable'));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
