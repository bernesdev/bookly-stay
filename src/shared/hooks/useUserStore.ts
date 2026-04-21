import { create } from 'zustand';

import { UserStore } from '../store/user.store';

export const useUserStore = create<UserStore>()((set) => ({
  // state
  id: undefined,
  name: undefined,
  email: undefined,
  provider: undefined,
  isLoggedIn: false,

  // actions
  setCredentials: (credentials) => {
    return set({ ...credentials, isLoggedIn: !!credentials.id });
  },
  clearCredentials: () =>
    set({
      id: undefined,
      name: undefined,
      email: undefined,
      isLoggedIn: false,
    }),
}));
