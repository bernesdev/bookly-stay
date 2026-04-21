import { act, renderHook } from '@testing-library/react-native';

import { useUserStore } from '@/src/shared/hooks/useUserStore';

import {
  getCurrentUser,
  signInWithApple as authSignInWithApple,
  signInWithEmail as authSignInWithEmail,
  signInWithGoogle as authSignInWithGoogle,
  signOut as authSignOut,
  signUpWithEmail as authSignUpWithEmail,
  updateUserProfile as authUpdateUserProfile,
} from '../api/auth.methods';

import { useAuth } from './useAuth';

const mockSetCredentials = jest.fn();
const mockClearCredentials = jest.fn();

const sampleCredentials = {
  id: 'user-1',
  name: 'John',
  email: 'john@example.com',
  provider: 'email' as const,
};

const makeOkResultAsync = <T,>(value: T) => ({
  match: async (onOk: (val: T) => void, _onErr: (err: unknown) => void) =>
    onOk(value),
});

const makeErrResultAsync = <E,>(error: E) => ({
  match: async (_onOk: (val: unknown) => void, onErr: (err: E) => void) =>
    onErr(error),
});

jest.mock('@/src/shared/hooks/useUserStore', () => ({
  useUserStore: jest.fn(),
}));

jest.mock('../api/auth.methods', () => ({
  signUpWithEmail: jest.fn(),
  signInWithEmail: jest.fn(),
  signInWithGoogle: jest.fn(),
  signInWithApple: jest.fn(),
  signOut: jest.fn(),
  updateUserProfile: jest.fn(),
  getCurrentUser: jest.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        setCredentials: mockSetCredentials,
        clearCredentials: mockClearCredentials,
      }),
    );
  });

  it('should sign up with email and handle success', async () => {
    const onSuccess = jest.fn();
    (authSignUpWithEmail as jest.Mock).mockReturnValue(
      makeOkResultAsync(sampleCredentials),
    );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signUpWithEmail({
        name: 'John',
        email: 'john@example.com',
        password: '123456',
        onSuccess,
      });
    });

    expect(authSignUpWithEmail).toHaveBeenCalledWith(
      'John',
      'john@example.com',
      '123456',
    );
    expect(mockSetCredentials).toHaveBeenCalledWith(sampleCredentials);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
  });

  it('should sign in with email and handle error when credentials are invalid', async () => {
    const error = { message: 'Invalid credentials' };
    const onError = jest.fn();

    (authSignInWithEmail as jest.Mock).mockReturnValue(
      makeErrResultAsync(error),
    );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signInWithEmail({
        email: 'john@example.com',
        password: 'wrong',
        onError,
      });
    });

    expect(authSignInWithEmail).toHaveBeenCalledWith(
      'john@example.com',
      'wrong',
    );
    expect(mockSetCredentials).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
    expect(result.current.isLoading).toBe(false);
  });

  it('should sign in with google and handle success', async () => {
    const onSuccess = jest.fn();
    (authSignInWithGoogle as jest.Mock).mockReturnValue(
      makeOkResultAsync(sampleCredentials),
    );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signInWithGoogle({ onSuccess });
    });

    expect(authSignInWithGoogle).toHaveBeenCalledTimes(1);
    expect(mockSetCredentials).toHaveBeenCalledWith(sampleCredentials);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('should sign in with apple and handle error when apple auth fails', async () => {
    const error = { message: 'Apple auth failed' };
    const onError = jest.fn();
    (authSignInWithApple as jest.Mock).mockReturnValue(
      makeErrResultAsync(error),
    );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signInWithApple({ onError });
    });

    expect(authSignInWithApple).toHaveBeenCalledTimes(1);
    expect(mockSetCredentials).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should sign out and clear credentials', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.signOut();
    });

    expect(authSignOut).toHaveBeenCalledTimes(1);
    expect(mockClearCredentials).toHaveBeenCalledTimes(1);
  });

  it('should update user profile and handle success', async () => {
    const onSuccess = jest.fn();
    const okResult = {
      isOk: () => true,
      value: sampleCredentials,
      error: undefined,
    };

    (authUpdateUserProfile as jest.Mock).mockResolvedValue(okResult);

    const { result } = renderHook(() => useAuth());

    let returned: unknown;
    await act(async () => {
      returned = await result.current.updateUserProfile({
        name: 'John Doe',
        password: 'new-pass',
        provider: 'email',
        onSuccess,
      });
    });

    expect(authUpdateUserProfile).toHaveBeenCalledWith(
      'John Doe',
      'new-pass',
      'email',
    );
    expect(mockSetCredentials).toHaveBeenCalledWith(sampleCredentials);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(returned).toBe(okResult);
  });

  it('should update user profile and handle error when update fails', async () => {
    const error = { message: 'Update failed' };
    const onError = jest.fn();
    const errResult = {
      isOk: () => false,
      value: undefined,
      error,
    };

    (authUpdateUserProfile as jest.Mock).mockResolvedValue(errResult);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.updateUserProfile({
        name: 'John Doe',
        password: undefined,
        provider: 'google',
        onError,
      });
    });

    expect(mockSetCredentials).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should initialize user from current credentials', () => {
    (getCurrentUser as jest.Mock).mockReturnValue(sampleCredentials);

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.initializeUser();
    });

    expect(getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockSetCredentials).toHaveBeenCalledWith(sampleCredentials);
  });

  it('should not set credentials when current user is null', () => {
    (getCurrentUser as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.initializeUser();
    });

    expect(getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockSetCredentials).not.toHaveBeenCalled();
  });
});
