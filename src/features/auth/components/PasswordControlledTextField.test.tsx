import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { PasswordControlledTextField } from './PasswordControlledTextField';

const mockControlledTextField = jest.fn((props: any) => {
  const mockReact = jest.requireActual('react');
  const ReactNative = jest.requireActual('react-native');

  return mockReact.createElement(
    ReactNative.Pressable,
    { testID: 'suffix-icon-button', onPress: props.onSuffixIconPress },
    mockReact.createElement(
      ReactNative.Text,
      { testID: 'secure-text-entry-value' },
      String(props.secureTextEntry),
    ),
  );
});

jest.mock(
  '@/src/shared/components/fields/controlled/ControlledTextField',
  () => ({
    ControlledTextField: (props: any) => mockControlledTextField(props),
  }),
);

describe('PasswordControlledTextField', () => {
  const baseProps = {
    name: 'password' as const,
    control: {} as any,
    errors: {} as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with secure mode enabled and forward base props', () => {
    renderWithProviders(
      <PasswordControlledTextField
        {...baseProps}
        placeholder="Password"
        returnKeyType="done"
      />,
    );

    const call = mockControlledTextField.mock.calls[0][0];

    expect(screen.getByTestId('suffix-icon-button')).toBeTruthy();
    expect(screen.getByTestId('secure-text-entry-value').props.children).toBe(
      'true',
    );

    expect(call.name).toBe('password');
    expect(call.control).toBe(baseProps.control);
    expect(call.errors).toBe(baseProps.errors);
    expect(call.placeholder).toBe('Password');
    expect(call.returnKeyType).toBe('done');
    expect(call.PrefixIcon).toBeTruthy();
    expect(call.SuffixIcon).toBeTruthy();
    expect(call.secureTextEntry).toBe(true);
  });

  it('should toggle secure mode when suffix icon is pressed', () => {
    renderWithProviders(<PasswordControlledTextField {...baseProps} />);

    const firstCall = mockControlledTextField.mock.calls[0][0];

    fireEvent.press(screen.getByTestId('suffix-icon-button'));

    const secondCall = mockControlledTextField.mock.calls[1][0];

    expect(firstCall.secureTextEntry).toBe(true);
    expect(secondCall.secureTextEntry).toBe(false);
    expect(firstCall.SuffixIcon).not.toBe(secondCall.SuffixIcon);
    expect(screen.getByTestId('secure-text-entry-value').props.children).toBe(
      'false',
    );
  });

  it('should not toggle when editable is false', () => {
    renderWithProviders(
      <PasswordControlledTextField {...baseProps} editable={false} />,
    );

    fireEvent.press(screen.getByTestId('suffix-icon-button'));

    expect(mockControlledTextField).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('secure-text-entry-value').props.children).toBe(
      'true',
    );
    expect(mockControlledTextField.mock.calls[0][0].editable).toBe(false);
  });
});
