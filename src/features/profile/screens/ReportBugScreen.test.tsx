import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Keyboard } from 'react-native';

import {
  getAppScreenMockProps,
  resetAppScreenMock,
} from '@/testing/mocks/app-screen.mock';
import '@/testing/mocks/react-i18next.mock';
import '@/testing/mocks/useLayout.mock';

import { ReportBugScreen } from './ReportBugScreen';

const mockCreateBugReport = jest.fn();
const mockShowToast = jest.fn();
const mockUseUserStore = jest.fn();
const mockUseForm = jest.fn();
const mockReset = jest.fn();
const mockControlledTextField = jest.fn();
const mockControlledSelectField = jest.fn();

const mockHandleSubmitData = {
  whatWentWrong: 'App crashed when opening details',
  expectedToHappen: 'Details screen should open',
  issueCategory: 'appCrashOrFreeze',
  happenedWhere: 'HomeScreen',
  issueFrequency: 'always',
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
      reset: mockReset,
    };
  },
}));

jest.mock('../api/profile.mutations', () => ({
  useCreateBugReportMutation: () => ({
    mutate: mockCreateBugReport,
  }),
}));

jest.mock('@/src/shared/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('@/src/shared/hooks/useUserStore', () => ({
  useUserStore: (selector: any) => selector(mockUseUserStore()),
}));

jest.mock(
  '@/src/shared/components/fields/controlled/ControlledTextField',
  () => ({
    ControlledTextField: (props: unknown) => {
      const mockReact = jest.requireActual('react');
      const ReactNative = jest.requireActual('react-native');
      const typedProps = props as { name: string; label?: string };

      mockControlledTextField(props);

      return mockReact.createElement(
        ReactNative.Text,
        { testID: `text-field-${typedProps.name}` },
        typedProps.label,
      );
    },
  }),
);

jest.mock(
  '@/src/shared/components/fields/controlled/ControlledSelectField',
  () => ({
    ControlledSelectField: (props: unknown) => {
      const mockReact = jest.requireActual('react');
      const ReactNative = jest.requireActual('react-native');
      const typedProps = props as { name: string; label?: string };

      mockControlledSelectField(props);

      return mockReact.createElement(
        ReactNative.Text,
        { testID: `select-field-${typedProps.name}` },
        typedProps.label,
      );
    },
  }),
);

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
        testID: 'send-report-button',
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

describe('ReportBugScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();

    mockUseUserStore.mockReturnValue({ id: 'user-1' });

    jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());
  });

  it('should configure app screen, default values and translated select options', () => {
    render(<ReportBugScreen />);

    const { appBar, preset, keyboardAvoiding } = getAppScreenMockProps() as {
      appBar: { title: string };
      preset: string;
      keyboardAvoiding: boolean;
    };

    expect(appBar.title).toBe('t:profile.reportBugScreen.appBarTitle');
    expect(preset).toBe('scroll');
    expect(keyboardAvoiding).toBe(true);
    expect(mockUseForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          whatWentWrong: '',
          expectedToHappen: '',
          issueCategory: '',
          happenedWhere: '',
          issueFrequency: '',
        },
      }),
    );
    expect(mockControlledSelectField).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: 'issueCategory',
        options: [
          {
            label: 't:profile.reportBugScreen.issueCategoryOptions.visualIssue',
            value: 'visualIssue',
          },
          {
            label:
              't:profile.reportBugScreen.issueCategoryOptions.featureNotWorking',
            value: 'featureNotWorking',
          },
          {
            label:
              't:profile.reportBugScreen.issueCategoryOptions.appCrashOrFreeze',
            value: 'appCrashOrFreeze',
          },
          {
            label:
              't:profile.reportBugScreen.issueCategoryOptions.performanceIssue',
            value: 'performanceIssue',
          },
          {
            label: 't:profile.reportBugScreen.issueCategoryOptions.other',
            value: 'other',
          },
        ],
      }),
    );
    expect(mockControlledSelectField).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: 'issueFrequency',
        options: [
          {
            label: 't:profile.reportBugScreen.issueFrequencyOptions.once',
            value: 'once',
          },
          {
            label: 't:profile.reportBugScreen.issueFrequencyOptions.sometimes',
            value: 'sometimes',
          },
          {
            label: 't:profile.reportBugScreen.issueFrequencyOptions.always',
            value: 'always',
          },
        ],
      }),
    );
  });

  it('should render fields and privacy note', () => {
    render(<ReportBugScreen />);

    expect(screen.getByTestId('text-field-whatWentWrong')).toBeTruthy();
    expect(screen.getByTestId('text-field-expectedToHappen')).toBeTruthy();
    expect(screen.getByTestId('select-field-issueCategory')).toBeTruthy();
    expect(screen.getByTestId('text-field-happenedWhere')).toBeTruthy();
    expect(screen.getByTestId('select-field-issueFrequency')).toBeTruthy();
    expect(
      screen.getByText('t:profile.reportBugScreen.privacyNote.line1'),
    ).toBeTruthy();
    expect(
      screen.getByText('t:profile.reportBugScreen.privacyNote.line2'),
    ).toBeTruthy();
  });

  it('should submit report, dismiss keyboard and show loading state', async () => {
    mockCreateBugReport.mockImplementation(() => undefined);

    render(<ReportBugScreen />);
    fireEvent.press(screen.getByTestId('send-report-button'));

    await waitFor(() => {
      expect(Keyboard.dismiss).toHaveBeenCalled();
      expect(mockCreateBugReport).toHaveBeenCalledWith(
        {
          ...mockHandleSubmitData,
          userId: 'user-1',
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
          onSettled: expect.any(Function),
        }),
      );
    });

    expect(
      screen.getByTestId('send-report-button').props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: true, busy: true }));
    expect(mockControlledTextField).toHaveBeenLastCalledWith(
      expect.objectContaining({ readOnly: true }),
    );
  });

  it('should reset form and show success toast on successful submit', async () => {
    mockCreateBugReport.mockImplementation((_, options) => {
      options.onSuccess();
      options.onSettled();
    });

    render(<ReportBugScreen />);
    fireEvent.press(screen.getByTestId('send-report-button'));

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(mockShowToast).toHaveBeenCalledWith({
        type: 'success',
        title: 't:profile.reportBugScreen.toasts.successTitle',
        description: 't:profile.reportBugScreen.toasts.successDescription',
      });
    });
  });

  it('should show error toast and stop loading when submit fails', async () => {
    mockCreateBugReport.mockImplementation((_, options) => {
      options.onError();
      options.onSettled();
    });

    render(<ReportBugScreen />);
    fireEvent.press(screen.getByTestId('send-report-button'));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        type: 'error',
        title: 't:profile.reportBugScreen.toasts.errorTitle',
        description: 't:profile.reportBugScreen.toasts.errorDescription',
      });
    });

    expect(
      screen.getByTestId('send-report-button').props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: false, busy: false }));
  });
});
