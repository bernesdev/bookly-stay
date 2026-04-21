type UserState = {
  id?: string;
  name?: string;
  email?: string;
  provider?: 'email' | 'google' | 'apple';
  isLoggedIn: boolean;
};

type UserActions = {
  setCredentials: (credentials: Omit<UserState, 'isLoggedIn'>) => void;
  clearCredentials: () => void;
};

export type UserStore = UserState & UserActions;
