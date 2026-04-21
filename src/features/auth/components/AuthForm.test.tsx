import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';
import { Keyboard } from 'react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { AuthForm } from './AuthForm';

jest.mock('./SignInForm', () => ({
  SignInForm: ({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) => {
    const mockReact = jest.requireActual('react');
    const ReactNative = jest.requireActual('react-native');
    return mockReact.createElement(
      ReactNative.Pressable,
      { onPress: onSwitchToSignUp, testID: 'go-to-signup' },
      mockReact.createElement(ReactNative.Text, null, 'sign-in-form'),
    );
  },
}));

jest.mock('./SignUpForm', () => ({
  SignUpForm: ({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) => {
    const mockReact = jest.requireActual('react');
    const ReactNative = jest.requireActual('react-native');
    return mockReact.createElement(
      ReactNative.Pressable,
      { onPress: onSwitchToSignIn, testID: 'go-to-signin' },
      mockReact.createElement(ReactNative.Text, null, 'sign-up-form'),
    );
  },
}));

describe('AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());
  });

  it('should render sign in mode by default', () => {
    renderWithProviders(<AuthForm />);

    expect(screen.getByText('sign-in-form')).toBeTruthy();
    expect(screen.queryByText('sign-up-form')).toBeNull();
  });

  it('should switch to sign up mode and dismiss keyboard', () => {
    renderWithProviders(<AuthForm />);

    fireEvent.press(screen.getByTestId('go-to-signup'));

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    expect(screen.getByText('sign-up-form')).toBeTruthy();
    expect(screen.queryByText('sign-in-form')).toBeNull();
  });

  it('should switch back to sign in mode and dismiss keyboard again', () => {
    renderWithProviders(<AuthForm />);

    fireEvent.press(screen.getByTestId('go-to-signup'));
    fireEvent.press(screen.getByTestId('go-to-signin'));

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(2);
    expect(screen.getByText('sign-in-form')).toBeTruthy();
    expect(screen.queryByText('sign-up-form')).toBeNull();
  });
});
