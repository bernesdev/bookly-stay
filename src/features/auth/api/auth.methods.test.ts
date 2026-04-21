import {
  AppleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { AppError } from '@/src/core/errors/app.error';
import { makeUser, type MockUser } from '@/testing/factories/user.factory';

import {
  getCurrentUser,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
  updateUserProfile,
} from './auth.methods';

jest.mock('@/src/i18n', () => ({
  __esModule: true,
  default: {
    t: jest.fn((key: string) => key),
  },
}));

jest.mock('expo-apple-authentication', () => ({
  AppleAuthenticationScope: {
    FULL_NAME: 'FULL_NAME',
    EMAIL: 'EMAIL',
  },
  signInAsync: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/auth', () => ({
  AppleAuthProvider: {
    credential: jest.fn(),
  },
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
  createUserWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
  signInWithCredential: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

const mockAuth = {
  currentUser: null as MockUser | null,
};

async function resolveResult<T>(resultAsync: {
  match: (
    onOk: (value: T) => void,
    onErr: (error: AppError) => void,
  ) => Promise<void>;
}) {
  let value: T | undefined;
  let error: AppError | undefined;

  await resultAsync.match(
    (ok) => {
      value = ok;
    },
    (err) => {
      error = err;
    },
  );

  return { value, error };
}

describe('auth.methods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.currentUser = null;
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
  });

  it('signUpWithEmail should create user and update profile', async () => {
    const user = makeUser({ displayName: null, email: null });
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user });

    const { value, error } = await resolveResult(
      signUpWithEmail('Jane Doe', 'jane@example.com', '123456'),
    );

    expect(error).toBeUndefined();
    expect(value).toEqual({
      id: 'user-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      provider: 'email',
    });
    expect(user.updateProfile).toHaveBeenCalledWith({
      displayName: 'Jane Doe',
    });
  });

  it('signInWithEmail should return credentials', async () => {
    const user = makeUser({ displayName: null, email: 'jane@example.com' });
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user });

    const { value, error } = await resolveResult(
      signInWithEmail('jane@example.com', '123456'),
    );

    expect(error).toBeUndefined();
    expect(value).toEqual({
      id: 'user-1',
      name: 'jane',
      email: 'jane@example.com',
      provider: 'email',
    });
  });

  it('signInWithEmail should map unknown error', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error('boom'),
    );

    const { error } = await resolveResult(
      signInWithEmail('jane@example.com', '123456'),
    );

    expect(error).toBeInstanceOf(AppError);
    expect(error?.code).toBe('auth/unknown');
    expect(error?.message).toBe('auth.errorMessages.default');
  });

  it('signInWithGoogle should return credentials', async () => {
    const user = makeUser({ displayName: null, email: 'google@example.com' });
    (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(undefined);
    (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
      data: { idToken: 'google-token' },
    });
    (GoogleAuthProvider.credential as jest.Mock).mockReturnValue(
      'google-credential',
    );
    (signInWithCredential as jest.Mock).mockResolvedValue({ user });

    const { value, error } = await resolveResult(signInWithGoogle());

    expect(error).toBeUndefined();
    expect(value).toEqual({
      id: 'user-1',
      name: 'google',
      email: 'google@example.com',
      provider: 'google',
    });
    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledWith({
      showPlayServicesUpdateDialog: true,
    });
    expect(GoogleAuthProvider.credential).toHaveBeenCalledWith('google-token');
  });

  it('signInWithGoogle should fail when idToken is missing', async () => {
    (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(undefined);
    (GoogleSignin.signIn as jest.Mock).mockResolvedValue({ data: {} });

    const { error } = await resolveResult(signInWithGoogle());

    expect(error).toBeInstanceOf(AppError);
    expect(error?.code).toBe('auth/no-id-token');
  });

  it('signInWithApple should return credentials', async () => {
    const AppleAuthentication = jest.requireMock('expo-apple-authentication');
    const user = makeUser({ displayName: null, email: 'apple@example.com' });

    AppleAuthentication.signInAsync.mockResolvedValue({
      identityToken: 'apple-token',
      fullName: { givenName: 'Ana', familyName: 'Silva' },
    });
    (AppleAuthProvider.credential as jest.Mock).mockReturnValue(
      'apple-credential',
    );
    (signInWithCredential as jest.Mock).mockResolvedValue({ user });

    const { value, error } = await resolveResult(signInWithApple());

    expect(error).toBeUndefined();
    expect(value).toEqual({
      id: 'user-1',
      name: 'Ana Silva',
      email: 'apple@example.com',
      provider: 'apple',
    });
    expect(AppleAuthProvider.credential).toHaveBeenCalledWith('apple-token');
  });

  it('signInWithApple should fail when identityToken is missing', async () => {
    const AppleAuthentication = jest.requireMock('expo-apple-authentication');

    AppleAuthentication.signInAsync.mockResolvedValue({
      identityToken: null,
      fullName: null,
    });

    const { error } = await resolveResult(signInWithApple());

    expect(error).toBeInstanceOf(AppError);
    expect(error?.code).toBe('auth/no-id-token');
  });

  it('signOut should call firebaseSignOut', async () => {
    (firebaseSignOut as jest.Mock).mockResolvedValue(undefined);

    const { error } = await resolveResult(signOut());

    expect(error).toBeUndefined();
    expect(firebaseSignOut).toHaveBeenCalledWith(mockAuth);
  });

  it('getCurrentUser should return null when there is no user', () => {
    mockAuth.currentUser = null;

    const result = getCurrentUser();

    expect(result).toBeNull();
  });

  it('getCurrentUser should map provider ids', () => {
    mockAuth.currentUser = makeUser({
      providerData: [{ providerId: 'google.com' }],
    });
    expect(getCurrentUser()?.provider).toBe('google');

    mockAuth.currentUser = makeUser({
      providerData: [{ providerId: 'apple.com' }],
    });
    expect(getCurrentUser()?.provider).toBe('apple');

    mockAuth.currentUser = makeUser({
      providerData: [{ providerId: 'password' }],
    });
    expect(getCurrentUser()?.provider).toBe('email');
  });

  it('updateUserProfile should fail when no user exists', async () => {
    mockAuth.currentUser = null;

    const { error } = await resolveResult(updateUserProfile('Jane'));

    expect(error).toBeInstanceOf(AppError);
    expect(error?.code).toBe('auth/user-not-found');
  });

  it('updateUserProfile should update name and password', async () => {
    const user = makeUser({ email: 'jane@example.com' });
    mockAuth.currentUser = user;

    const { value, error } = await resolveResult(
      updateUserProfile('Jane Doe', 'new-pass', 'google'),
    );

    expect(error).toBeUndefined();
    expect(user.updateProfile).toHaveBeenCalledWith({
      displayName: 'Jane Doe',
    });
    expect(user.updatePassword).toHaveBeenCalledWith('new-pass');
    expect(value).toEqual({
      id: 'user-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      provider: 'google',
    });
  });
});
