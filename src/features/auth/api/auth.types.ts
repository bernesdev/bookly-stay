export type AuthProvider = 'email' | 'google' | 'apple';

export type UserCredentials = {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
};
