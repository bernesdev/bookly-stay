import * as AppleAuthentication from 'expo-apple-authentication';

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
import { ResultAsync } from 'neverthrow';

import { AppError } from '@/src/core/errors/app.error';
import i18n from '@/src/i18n';

import { UserCredentials } from './auth.types';

function mapFirebaseAuthError(error: unknown): AppError {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  ) {
    const code = (error as { code: string }).code;

    return new AppError(
      code,
      i18n.t(`auth.errorMessages.${code}`, {
        defaultValue: i18n.t('auth.errorMessages.default'),
      }),
    );
  }

  return new AppError('auth/unknown', i18n.t('auth.errorMessages.default'));
}

function mapFirebaseProviderId(
  providerId: string,
): 'email' | 'google' | 'apple' {
  switch (providerId) {
    case 'google.com':
      return 'google';
    case 'apple.com':
      return 'apple';
    default:
      return 'email';
  }
}

export function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): ResultAsync<UserCredentials, AppError> {
  const auth = getAuth();

  return ResultAsync.fromPromise(
    createUserWithEmailAndPassword(auth, email, password).then(
      async ({ user }) => {
        await user.updateProfile({ displayName: name });

        return {
          id: user.uid,
          name: user.displayName ?? name,
          email: user.email ?? email,
          provider: 'email',
        };
      },
    ),
    mapFirebaseAuthError,
  );
}

export function signInWithEmail(
  email: string,
  password: string,
): ResultAsync<UserCredentials, AppError> {
  const auth = getAuth();

  return ResultAsync.fromPromise(
    signInWithEmailAndPassword(auth, email, password).then(
      async ({ user }): Promise<UserCredentials> => {
        return {
          id: user.uid,
          name: user.displayName ?? user.email?.split('@')[0] ?? '',
          email: user.email ?? email,
          provider: 'email',
        };
      },
    ),
    mapFirebaseAuthError,
  );
}

export function signInWithGoogle(): ResultAsync<UserCredentials, AppError> {
  const auth = getAuth();

  return ResultAsync.fromPromise(
    (async () => {
      try {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });

        const response = await GoogleSignin.signIn();
        const idToken = response.data?.idToken;

        if (!idToken) {
          return Promise.reject({ code: 'auth/no-id-token' });
        }

        const credential = GoogleAuthProvider.credential(idToken);
        const { user } = await signInWithCredential(auth, credential);

        return {
          id: user.uid,
          name: user.displayName ?? user.email?.split('@')[0] ?? '',
          email: user.email ?? '',
          provider: 'google',
        };
      } catch (error) {
        return Promise.reject(error);
      }
    })(),
    mapFirebaseAuthError,
  );
}

export function signInWithApple(): ResultAsync<UserCredentials, AppError> {
  const auth = getAuth();

  return ResultAsync.fromPromise(
    (async () => {
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        const { identityToken } = credential;

        if (!identityToken) {
          return Promise.reject({ code: 'auth/no-id-token' });
        }

        const firebaseCredential = AppleAuthProvider.credential(identityToken);
        const { user } = await signInWithCredential(auth, firebaseCredential);

        const fullName = [
          credential.fullName?.givenName,
          credential.fullName?.familyName,
        ]
          .filter(Boolean)
          .join(' ')
          .trim();

        return {
          id: user.uid,
          name: user.displayName ?? fullName ?? user.email?.split('@')[0] ?? '',
          email: user.email ?? '',
          provider: 'apple',
        };
      } catch (error) {
        return Promise.reject(error);
      }
    })(),
    mapFirebaseAuthError,
  );
}

export function signOut(): ResultAsync<void, AppError> {
  const auth = getAuth();

  return ResultAsync.fromPromise(firebaseSignOut(auth), mapFirebaseAuthError);
}

export function getCurrentUser(): UserCredentials | null {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const providerId = user.providerData[0]?.providerId ?? 'password';
  const provider = mapFirebaseProviderId(providerId);

  return {
    id: user.uid,
    name: user.displayName ?? user.email?.split('@')[0] ?? '',
    email: user.email ?? '',
    provider,
  };
}

export function updateUserProfile(
  name: string,
  password?: string,
  provider?: 'email' | 'google' | 'apple',
): ResultAsync<UserCredentials, AppError> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    // Return an error if there is no logged-in user
    return ResultAsync.fromPromise(
      Promise.reject({ code: 'auth/user-not-found' }),
      mapFirebaseAuthError,
    );
  }

  return ResultAsync.fromPromise(
    (async () => {
      // Update the display name
      await user.updateProfile({ displayName: name });

      // If a password is provided, update it
      if (password) {
        await user.updatePassword(password);
      }

      return {
        id: user.uid,
        name: name,
        email: user.email ?? '',
        provider: provider ?? 'email',
      };
    })(),
    mapFirebaseAuthError,
  );
}
