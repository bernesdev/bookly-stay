import { useCallback, useState } from 'react';

import { AppError } from '@/src/core/errors/app.error';
import { useUserStore } from '@/src/shared/hooks/useUserStore';

import {
  signInWithApple as authSignInWithApple,
  signInWithEmail as authSignInWithEmail,
  signInWithGoogle as authSignInWithGoogle,
  signOut as authSignOut,
  signUpWithEmail as authSignUpWithEmail,
  updateUserProfile as authUpdateUserProfile,
  getCurrentUser,
} from '../api/auth.methods';

type AuthCallback = {
  onSuccess?: () => void;
  onError?: (error: AppError) => void;
};

type SignUpWithEmailParams = AuthCallback & {
  name: string;
  email: string;
  password: string;
};

type UpdateProfileParams = AuthCallback & {
  name: string;
  password: string | undefined;
  provider: 'email' | 'google' | 'apple' | undefined;
};

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const setCredentials = useUserStore((state) => state.setCredentials);
  const clearCredentials = useUserStore((state) => state.clearCredentials);

  const signUpWithEmail = useCallback(
    async ({
      name,
      email,
      password,
      onSuccess,
      onError,
    }: SignUpWithEmailParams) => {
      setIsLoading(true);

      await authSignUpWithEmail(name, email, password).match(
        (credentials) => {
          setCredentials(credentials);
          onSuccess?.();
        },
        (error) => {
          onError?.(error);
        },
      );

      setIsLoading(false);
    },
    [setCredentials],
  );

  const signInWithEmail = useCallback(
    async ({
      email,
      password,
      onSuccess,
      onError,
    }: Omit<SignUpWithEmailParams, 'name'>) => {
      setIsLoading(true);

      await authSignInWithEmail(email, password).match(
        (credentials) => {
          setCredentials(credentials);
          onSuccess?.();
        },
        (error) => {
          onError?.(error);
        },
      );

      setIsLoading(false);
    },
    [setCredentials],
  );

  const signInWithGoogle = useCallback(
    async ({ onSuccess, onError }: AuthCallback) => {
      setIsLoading(true);

      await authSignInWithGoogle().match(
        (credentials) => {
          setCredentials(credentials);
          onSuccess?.();
        },
        (error) => {
          onError?.(error);
        },
      );

      setIsLoading(false);
    },
    [setCredentials],
  );

  const signInWithApple = useCallback(
    async ({ onSuccess, onError }: AuthCallback) => {
      setIsLoading(true);

      await authSignInWithApple().match(
        (credentials) => {
          setCredentials(credentials);
          onSuccess?.();
        },
        (error) => {
          onError?.(error);
        },
      );

      setIsLoading(false);
    },
    [setCredentials],
  );

  const signOut = useCallback(() => {
    authSignOut();
    clearCredentials();
  }, [clearCredentials]);

  const updateUserProfile = useCallback(
    async ({
      name,
      password,
      provider,
      onSuccess,
      onError,
    }: UpdateProfileParams) => {
      setIsLoading(true);

      const result = await authUpdateUserProfile(name, password, provider);

      if (result.isOk()) {
        setCredentials(result.value);
        onSuccess?.();
      } else {
        onError?.(result.error);
      }

      setIsLoading(false);

      return result;
    },
    [setCredentials],
  );

  const initializeUser = useCallback(() => {
    const credentials = getCurrentUser();
    if (credentials) setCredentials(credentials);
  }, [setCredentials]);

  return {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    signOut,
    updateUserProfile,
    isLoading,
    initializeUser,
  };
}
