import React from 'react';

import { screen } from '@testing-library/react-native';

import {
  getAppScreenMockProps,
  resetAppScreenMock,
} from '@/testing/mocks/app-screen.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { AuthScreen } from './AuthScreen';

jest.mock('../components/AuthHeader', () => ({
  AuthHeader: () => {
    const mockReact = jest.requireActual('react');
    return mockReact.createElement('Text', { testID: 'auth-header' }, 'header');
  },
}));

jest.mock('../components/AuthForm', () => ({
  AuthForm: () => {
    const mockReact = jest.requireActual('react');
    return mockReact.createElement('Text', { testID: 'auth-form' }, 'form');
  },
}));

describe('AuthScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();
  });

  it('should render app screen with translated title and keyboard avoiding', () => {
    renderWithProviders(<AuthScreen />);

    expect(screen.getByTestId('app-screen')).toBeTruthy();
    expect(screen.getByTestId('auth-header')).toBeTruthy();
    expect(screen.getByTestId('auth-form')).toBeTruthy();
    expect(getAppScreenMockProps().keyboardAvoiding).toBe(true);
    expect(getAppScreenMockProps().appBar).toEqual({
      title: 't:auth.authScreen.title',
    });
  });

  it('should render the screen content container', () => {
    renderWithProviders(<AuthScreen />);

    expect(screen.getByTestId('auth-header')).toBeTruthy();
    expect(screen.getByTestId('auth-form')).toBeTruthy();
  });
});
