import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking, Platform } from 'react-native';

import {
  getAppScreenMockProps,
  resetAppScreenMock,
} from '@/testing/mocks/app-screen.mock';
import '@/testing/mocks/expo-ui.mock';
import '@/testing/mocks/icons.mock';
import '@/testing/mocks/react-i18next.mock';

import { ProfileScreen } from './ProfileScreen';

const mockPush = jest.fn();
const mockSignOut = jest.fn();
const mockShowToast = jest.fn();
const mockShowSheet = jest.fn();
const mockUseUserStore = jest.fn();
const mockOpenURL = jest.fn();

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: '1.2.3',
      ios: { buildNumber: '42' },
      android: { versionCode: 7 },
    },
  },
}));

jest.mock('@/src/i18n', () => ({
  __esModule: true,
  default: {
    t: (key: string) => `t:${key}`,
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/src/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}));

jest.mock('@/src/shared/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('@/src/shared/hooks/useBottomSheet', () => ({
  useBottomSheet: () => ({ showSheet: mockShowSheet }),
}));

jest.mock('@/src/shared/hooks/useUserStore', () => ({
  useUserStore: (selector: any) => selector(mockUseUserStore()),
}));

jest.mock('@/src/features/auth/components/UnauthenticatedSheet', () => ({
  UnauthenticatedSheet: ({ title }: { title: string }) => {
    const mockReact = jest.requireActual('react');
    return mockReact.createElement('Text', { testID: 'unauth-sheet' }, title);
  },
}));

jest.mock('../components/ProfileButton', () => ({
  ProfileButton: ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => {
    const mockReact = jest.requireActual('react');
    return mockReact.createElement(
      'Pressable',
      { testID: `profile-button-${title}`, onPress },
      mockReact.createElement('Text', null, title),
    );
  },
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppScreenMock();
    mockUseUserStore.mockReturnValue({
      isLoggedIn: true,
      name: 'John Doe',
      email: 'john@example.com',
    });
    jest.spyOn(Platform, 'select').mockReturnValue('42');
    jest.spyOn(Linking, 'openURL').mockImplementation(mockOpenURL);
  });

  it('should render app screen, logged user info and version', () => {
    render(<ProfileScreen />);

    const { appBar, preset } = getAppScreenMockProps() as {
      appBar: { title: string; showLeading: boolean };
      preset: string;
    };

    expect(appBar).toEqual({
      title: 't:profile.profileScreen.appBarTitle',
      showLeading: false,
    });
    expect(preset).toBe('fixed');
    expect(screen.getByText('JO')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('john@example.com')).toBeTruthy();
    expect(screen.getByText('v1.2.3 (42)')).toBeTruthy();
  });

  it('should navigate to edit profile and open delete account link for logged user', () => {
    render(<ProfileScreen />);

    fireEvent.press(
      screen.getByTestId(
        'profile-button-t:profile.profileScreen.actions.editProfile',
      ),
    );
    fireEvent.press(
      screen.getByTestId(
        'profile-button-t:profile.profileScreen.actions.deleteAccount',
      ),
    );

    expect(mockPush).toHaveBeenCalledWith('/edit-profile');
    expect(mockOpenURL).toHaveBeenCalledWith(
      'https://forms.gle/B146NgcPA1fFiqpn9',
    );
  });

  it('should navigate to report bug for logged user', () => {
    render(<ProfileScreen />);

    fireEvent.press(
      screen.getByTestId(
        'profile-button-t:profile.profileScreen.actions.reportBug',
      ),
    );

    expect(mockPush).toHaveBeenCalledWith('/report-bug');
    expect(mockShowSheet).not.toHaveBeenCalled();
  });

  it('should sign out and show success toast for logged user', () => {
    render(<ProfileScreen />);

    fireEvent.press(
      screen.getByText('t:profile.profileScreen.actions.signOut'),
    );

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'success',
      title: 't:profile.profileScreen.toasts.signOutSuccess',
    });
  });

  it('should render guest state and route to auth when sign in is pressed', () => {
    mockUseUserStore.mockReturnValue({
      isLoggedIn: false,
      name: '',
      email: null,
    });

    render(<ProfileScreen />);

    expect(screen.getByText('t:shared.user.guestName')).toBeTruthy();
    expect(
      screen.getByText('t:profile.profileScreen.signInToAccount'),
    ).toBeTruthy();
    expect(
      screen.queryByText('t:profile.profileScreen.sections.account'),
    ).toBeNull();

    fireEvent.press(screen.getByText('t:profile.profileScreen.actions.signIn'));

    expect(mockPush).toHaveBeenCalledWith('/auth');
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('should show unauthenticated sheet when guest tries to report a bug', () => {
    mockUseUserStore.mockReturnValue({
      isLoggedIn: false,
      name: '',
      email: null,
    });

    render(<ProfileScreen />);

    fireEvent.press(
      screen.getByTestId(
        'profile-button-t:profile.profileScreen.actions.reportBug',
      ),
    );

    expect(mockShowSheet).toHaveBeenCalledWith(expect.any(Object), {
      showHandleIndicator: false,
    });
  });
});
