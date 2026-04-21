import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';
import { Keyboard } from 'react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { SignUpForm } from './SignUpForm';

const mockBack = jest.fn();
const mockShowToast = jest.fn();
const mockSignUpWithEmail = jest.fn();
const mockOnSwitchToSignIn = jest.fn();
let mockIsLoading = false;

const mockHandleSubmitData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: '123456',
  confirmPassword: '123456',
};

const mockUseFormReturn = {
  control: { __mock: 'control' },
  formState: { errors: {} },
  handleSubmit:
    (
      cb: (data: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
      }) => void,
    ) =>
    () =>
      cb(mockHandleSubmitData),
};

const mockUseForm = jest.fn();

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

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock('react-hook-form', () => ({
  useForm: (config: unknown) => {
    mockUseForm(config);
    return mockUseFormReturn;
  },
}));

jest.mock('@/src/shared/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    isLoading: mockIsLoading,
    signUpWithEmail: mockSignUpWithEmail,
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

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsLoading = false;
    mockHandleSubmitData.name = 'John Doe';
    mockHandleSubmitData.email = 'john@example.com';
    mockHandleSubmitData.password = '123456';
    mockHandleSubmitData.confirmPassword = '123456';
    jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());
  });

  it('should render fields and actions with translated labels', () => {
    renderWithProviders(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

    expect(screen.getByTestId('controlled-name')).toBeTruthy();
    expect(screen.getByTestId('controlled-email')).toBeTruthy();
    expect(screen.getByTestId('password-password')).toBeTruthy();
    expect(screen.getByTestId('password-confirmPassword')).toBeTruthy();
    expect(screen.getByText('t:auth.signUpForm.actions.signUp')).toBeTruthy();
    expect(
      screen.getByText('t:auth.signUpForm.actions.switchPrefix'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:auth.signUpForm.actions.switchAction'),
    ).toBeTruthy();

    expect(mockControlledTextField).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'name', readOnly: false }),
    );
    expect(mockControlledTextField).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'email', readOnly: false }),
    );
    expect(mockPasswordControlledTextField).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'password', readOnly: false }),
    );
    expect(mockPasswordControlledTextField).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'confirmPassword', readOnly: false }),
    );

    expect(mockUseForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        resolver: expect.any(Function),
      }),
    );
  });

  it('should submit and handle success', () => {
    mockSignUpWithEmail.mockImplementation(({ onSuccess }: any) => onSuccess());

    renderWithProviders(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

    fireEvent.press(screen.getByTestId('solid-button'));

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    expect(mockSignUpWithEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'success',
      title: 't:auth.signUpForm.toasts.successTitle',
    });
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should show error toast when sign up fails', () => {
    const error = { message: 'Email already used' };
    mockSignUpWithEmail.mockImplementation(({ onError }: any) =>
      onError(error),
    );

    renderWithProviders(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

    fireEvent.press(screen.getByTestId('solid-button'));

    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'error',
      title: 't:auth.signUpForm.toasts.errorTitle',
      description: 'Email already used',
    });
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('should set readOnly and disable action while loading', () => {
    mockIsLoading = true;

    renderWithProviders(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

    expect(mockControlledTextField).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'name', readOnly: true }),
    );
    expect(mockPasswordControlledTextField).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'password', readOnly: true }),
    );

    const submitButton = screen.getByTestId('solid-button');
    expect(submitButton.props.accessibilityState).toEqual({
      disabled: true,
      busy: true,
    });
  });

  it('should dismiss keyboard and switch to sign in', () => {
    renderWithProviders(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

    fireEvent.press(screen.getByText('t:auth.signUpForm.actions.switchAction'));

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    expect(mockOnSwitchToSignIn).toHaveBeenCalledTimes(1);
  });
});
