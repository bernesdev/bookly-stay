import { getAuth, getIdToken } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Reactotron from 'reactotron-react-native';

import { UnauthenticatedSheet } from '@/src/features/auth/components/UnauthenticatedSheet';
import i18n from '@/src/i18n';

import { useBottomSheetStore } from '../shared/hooks/useBottomSheetStore';

import { setOnUnauthorizedHandler } from './api/interceptors';
import { setHttpTokenProvider } from './api/interceptors/auth.interceptor';
import { initializeErrorHandling } from './services/error.handler';

/**
 * Initialize developer tools early
 */
if (__DEV__) {
  Reactotron.configure({}).useReactNative().connect();
}

/**
 * Main application initialization pipeline.
 */
export function initializeApp() {
  initializeErrorHandling();

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  setHttpTokenProvider(async () => {
    const user = getAuth().currentUser;

    if (user) return getIdToken(user);

    return null;
  });

  setOnUnauthorizedHandler(() => {
    useBottomSheetStore
      .getState()
      .showSheet(
        <UnauthenticatedSheet
          title={i18n.t('core.init.sessionExpiredOrInvalid')}
        />,
        {
          showHandleIndicator: false,
        },
      );
  });
}
