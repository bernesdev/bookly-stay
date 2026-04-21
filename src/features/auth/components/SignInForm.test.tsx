import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';
import { Keyboard, Platform } from 'react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { SignInForm } from './SignInForm';

const mockBack = jest.fn();
const mockShowToast = jest.fn();
const mockSignInWithEmail = jest.fn();
const mockSignInWithGoogle = jest.fn();
const mockSignInWithApple = jest.fn();
const mockOnSwitchToSignUp = jest.fn();

const mockHandleSubmitData = {
  email: 'john@example.com',
  password: '123456',
};

const mockUseForm = jest.fn(() => ({
  control: { __mock: 'control' },
  formState: { errors: {} },
  handleSubmit:
    (cb: (data: { email: string; password: string }) => void) => () =>
      cb(mockHandleSubmitData),
}));

const mockControlledTextField = jest.fn((props: any) => {
  const mockReact = jest.requireActual('react');
  const ReactNative = jest.requireActual('react-native');

  return mockReact.createElement(
    ReactNative.Text,
    { testID: `controlled-${props.name}` },
    props.placeholder,
  );
});

const mockPasswordControlledTextField = jest.fn((props: any) => {
  const mockReact = jest.requireActual('react');
  const ReactNative = jest.requireActual('react-native');

  return mockReact.createElement(
    ReactNative.Text,
    { testID: `password-${props.name}` },
    props.placeholder,
  );
});

const mockSocialButton = jest.fn((props: any) => {
  const mockReact = jest.requireActual('react');
  const ReactNative = jest.requireActual('react-native');

  return mockReact.createElement(
    ReactNative.Pressable,
    { onPress: props.onPress, testID: 'social-button' },
    mockReact.createElement(ReactNative.Text, null, 'social-button'),
  );
});

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => mockUseForm(),
}));

jest.mock('@/src/shared/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    isLoading: false,
    signInWithEmail: mockSignInWithEmail,
    signInWithGoogle: mockSignInWithGoogle,
    signInWithApple: mockSignInWithApple,
  }),
}));

jest.mock('@/src/shared/components/buttons/SolidButton', () => ({
  SolidButton: ({
    title,
    onPress,
    disabled,
    isLoading,
  }: {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  }) => {
    const mockReact = jest.requireActual('react');
    return mockReact.createElement(
      'Pressable',
      {
        onPress,
        disabled,
        testID: 'solid-button',
        accessibilityState: { disabled, busy: isLoading },
      },
      mockReact.createElement('Text', null, title),
    );
  },
}));

jest.mock(
  '@/src/shared/components/fields/controlled/ControlledTextField',
  () => ({
    ControlledTextField: (props: any) => mockControlledTextField(props),
  }),
);

jest.mock('./PasswordControlledTextField', () => ({
  PasswordControlledTextField: (props: any) =>
    mockPasswordControlledTextField(props),
}));

jest.mock('./SocialButton', () => ({
  SocialButton: (props: any) => mockSocialButton(props),
}));

describe('SignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleSubmitData.email = 'john@example.com';
    mockHandleSubmitData.password = '123456';
    jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());
  });

  it('should render fields and actions with translated labels', () => {
    renderWithProviders(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

    expect(screen.getByTestId('controlled-email')).toBeTruthy();
    expect(screen.getByTestId('password-password')).toBeTruthy();
    expect(
      screen.getByText('t:auth.signInForm.actions.forgotPassword'),
    ).toBeTruthy();
    expect(screen.getByText('t:auth.signInForm.actions.signIn')).toBeTruthy();
    expect(
      screen.getByText('t:auth.signInForm.actions.switchPrefix'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:auth.signInForm.actions.switchAction'),
    ).toBeTruthy();

    expect(mockControlledTextField).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'email',
        readOnly: false,
      }),
    );
  });

  it('should submit with email and handle success', () => {
    mockSignInWithEmail.mockImplementation(({ onSuccess }: any) => onSuccess());

    renderWithProviders(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

    fireEvent.press(screen.getByTestId('solid-button'));

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    expect(mockSignInWithEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'john@example.com',
        password: '123456',
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'success',
      title: 't:auth.signInForm.toasts.successTitle',
    });
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should show error toast when email sign in fails', () => {
    const error = { message: 'Invalid credential' };
    mockSignInWithEmail.mockImplementation(({ onError }: any) =>
      onError(error),
    );

    renderWithProviders(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

    fireEvent.press(screen.getByTestId('solid-button'));

    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'error',
      title: 't:auth.signInForm.toasts.errorTitle',
      description: 'Invalid credential',
    });
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('should not submit when email or password is empty', () => {
    mockHandleSubmitData.email = '';

    renderWithProviders(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

    fireEvent.press(screen.getByTestId('solid-button'));

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    expect(mockSignInWithEmail).not.toHaveBeenCalled();
  });

  it('should trigger social sign in handlers', () => {
    mockSignInWithGoogle.mockImplementation(({ onSuccess }: any) =>
      onSuccess(),
    );
    mockSignInWithApple.mockImplementation(({ onError }: any) =>
      onError({ message: 'Apple failed' }),
    );

    renderWithProviders(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

    const socialButtons = screen.getAllByTestId('social-button');
    fireEvent.press(socialButtons[0]);

    expect(mockSignInWithGoogle).toHaveBeenCalledWith(
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'success',
      title: 't:auth.signInForm.toasts.successTitle',
    });

    if (Platform.OS === 'ios') {
      fireEvent.press(socialButtons[1]);
      expect(mockSignInWithApple).toHaveBeenCalledWith(
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      );
      expect(mockShowToast).toHaveBeenCalledWith({
        type: 'error',
        title: 't:auth.signInForm.toasts.errorTitle',
        description: 'Apple failed',
      });
    }
  });

  it('should dismiss keyboard and switch to sign up', () => {
    renderWithProviders(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

    fireEvent.press(screen.getByText('t:auth.signInForm.actions.switchAction'));

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    expect(mockOnSwitchToSignUp).toHaveBeenCalledTimes(1);
  });
});
