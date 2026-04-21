import { useEffect } from 'react';

import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

const FONTS = {
  'PlusJakartaSans-Light': require('../../../assets/fonts/PlusJakartaSans-Light.ttf'),
  'PlusJakartaSans-Regular': require('../../../assets/fonts/PlusJakartaSans-Regular.ttf'),
  'PlusJakartaSans-Medium': require('../../../assets/fonts/PlusJakartaSans-Medium.ttf'),
  'PlusJakartaSans-SemiBold': require('../../../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
  'PlusJakartaSans-Bold': require('../../../assets/fonts/PlusJakartaSans-Bold.ttf'),
  'PlusJakartaSans-ExtraBold': require('../../../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
};

void SplashScreen.preventAutoHideAsync();

/**
 * Custom hook to handle app bootstrap logic.
 */
export function useAppBootstrap() {
  const [fontsLoaded, fontError] = useFonts(FONTS);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return { fontsLoaded, fontError };
}
