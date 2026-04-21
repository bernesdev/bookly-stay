import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Keyboard } from 'react-native';

import '@/testing/mocks/react-i18next.mock';
import '@/testing/mocks/useLayout.mock';

import {
  getAppScreenMockProps,
  resetAppScreenMock,
} from '@/testing/mocks/app-screen.mock';
import '@/testing/mocks/icons.mock';

import { EditProfileScreen } from './EditProfileScreen';

const mockUpdateUserProfile = jest.fn();
const mockShowToast = jest.fn();
const mockUseAuth = jest.fn();
const mockUseUserStore = jest.fn();
const mockUseForm = jest.fn();
const mockControlledTextField = jest.fn();
const mockPasswordControlledTextField = jest.fn();

const mockHandleSubmitData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: '123456',
  confirmPassword: '123456',
};

jest.mock('react-hook-form', () => ({
  useForm: (config: unknown) => {
    mockUseForm(config);

    return {
      control: { __mock: 'control' },
      formState: { errors: {} },
      handleSubmit:
        (
          callback: (data: typeof mockHandleSubmitData) => void | Promise<void>,
        ) =>
        () =>
          callback(mockHandleSubmitData),
    };
  },
}));

jest.mock('../../auth/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/src/shared/hooks/useUserStore', () => ({
  useUserStore: (selector: any) => selector(mockUseUserStore()),
}));

jest.mock('@/src/shared/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock(
  '@/src/shared/components/fields/controlled/ControlledTextField',
  () => ({
    ControlledTextField: (props: unknown) => {
      const mockReact = jest.requireActual('react');
      mockControlledTextField(props);

      const ReactNative = jest.requireActual('react-native');
      const typedProps = props as { name: string; placeholder: string };

      return mockReact.createElement(
        ReactNative.Text,
        { testID: `field-${typedProps.name}` },
        typedProps.placeholder,
      );
    },
  }),
);

jest.mock('@/src/features/auth/components/PasswordControlledTextField', () => ({
  PasswordControlledTextField: (props: unknown) => {
    const mockReact = jest.requireActual('react');
    mockPasswordControlledTextField(props);

    const ReactNative = jest.requireActual('react-native');
    const typedProps = props as { name: string; placeholder: string };

    return mockReact.createElement(
      ReactNative.Text,
      { testID: `password-${typedProps.name}` },
      typedProps.placeholder,
    );
  },
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
  }) =>
    jest.requireActual('react').createElement(
      'Pressable',
      {
        testID: 'save-button',
        onPress,
        disabled,
        accessibilityState: { disabled, busy: isLoading },
      },
      jest.requireActual('react').createElement('Text', null, title),
    ),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => () => ({ values: mockHandleSubmitData, errors: {} }),
}));

describe('EditProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();

    mockUseAuth.mockReturnValue({
      updateUserProfile: mockUpdateUserProfile,
      isLoading: false,
    });

    mockUseUserStore.mockReturnValue({
      name: 'John Doe',
      email: 'john@example.com',
      provider: 'email',
    });

    jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());
  });

  it('should configure app screen and form default values', () => {
    render(<EditProfileScreen />);

    const { appBar, preset, keyboardAvoiding } = getAppScreenMockProps() as {
      appBar: { title: string };
      preset: string;
      keyboardAvoiding: boolean;
    };

    expect(appBar.title).toBe('t:profile.editProfileScreen.appBarTitle');
    expect(preset).toBe('scroll');
    expect(keyboardAvoiding).toBe(true);
    expect(mockUseForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          name: 'John Doe',
          email: 'john@example.com',
          password: '',
          confirmPassword: '',
        },
      }),
    );
  });

  it('should render text fields and enable password editing for email provider', () => {
    render(<EditProfileScreen />);

    expect(screen.getByTestId('field-name')).toBeTruthy();
    expect(screen.getByTestId('field-email')).toBeTruthy();
    expect(screen.getByTestId('password-password')).toBeTruthy();
    expect(screen.getByTestId('password-confirmPassword')).toBeTruthy();

    expect(mockControlledTextField).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ editable: false, selectTextOnFocus: false }),
    );
    expect(mockPasswordControlledTextField).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ editable: true, readOnly: false }),
    );
    expect(mockPasswordControlledTextField).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ editable: true, readOnly: false }),
    );
  });

  it('should disable password editing and save button while loading for non-email provider', () => {
    mockUseAuth.mockReturnValue({
      updateUserProfile: mockUpdateUserProfile,
      isLoading: true,
    });
    mockUseUserStore.mockReturnValue({
      name: 'John Doe',
      email: 'john@example.com',
      provider: 'google',
    });

    render(<EditProfileScreen />);

    expect(mockPasswordControlledTextField).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ editable: false, readOnly: true }),
    );
    expect(mockPasswordControlledTextField).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ editable: false, readOnly: true }),
    );
    expect(screen.getByTestId('save-button').props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true, busy: true }),
    );
  });

  it('should dismiss keyboard and call updateUserProfile on save', async () => {
    mockUpdateUserProfile.mockResolvedValue(undefined);

    render(<EditProfileScreen />);
    fireEvent.press(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(Keyboard.dismiss).toHaveBeenCalled();
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          password: '123456',
          provider: 'email',
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      );
    });
  });

  it('should show success toast when update succeeds', async () => {
    mockUpdateUserProfile.mockImplementation(
      async ({ onSuccess }: { onSuccess: () => void }) => {
        onSuccess();
      },
    );

    render(<EditProfileScreen />);
    fireEvent.press(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        type: 'success',
        title: 't:profile.editProfileScreen.toasts.updateSuccessTitle',
      });
    });
  });

  it('should show error toast when update fails', async () => {
    mockUpdateUserProfile.mockImplementation(
      async ({
        onError,
      }: {
        onError: (error: { message: string }) => void;
      }) => {
        onError({ message: 'Something went wrong' });
      },
    );

    render(<EditProfileScreen />);
    fireEvent.press(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        type: 'error',
        title: 't:profile.editProfileScreen.toasts.errorTitle',
        description: 'Something went wrong',
      });
    });
  });
});
