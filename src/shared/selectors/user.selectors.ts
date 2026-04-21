import i18n from '@/src/i18n';

import { UserStore } from '../store/user.store';

export const selectUserName = ({ name, isLoggedIn }: UserStore) =>
  isLoggedIn ? name : i18n.t('shared.user.guestName');

export const selectUserNameInitials = ({ name }: UserStore) =>
  name ? name.slice(0, 2).toUpperCase() : i18n.t('shared.user.guestInitials');
