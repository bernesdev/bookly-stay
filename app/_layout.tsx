import { useEffect } from 'react';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Toast from 'react-native-toast-message';
import 'react-native-reanimated';

import { queryClient } from '@/src/core/api/queryClient';
import { useAppBootstrap } from '@/src/core/hooks/useAppBootstrap';
import { initializeApp } from '@/src/core/init';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { AppBottomSheet } from '@/src/shared/components/AppBottomSheet';
import { toastConfig } from '@/src/shared/components/AppToast';
import { FontErrorFallback } from '@/src/shared/components/FontErrorFallback';

// Import global styles
import '../global.css';

initializeApp();

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const { fontsLoaded, fontError } = useAppBootstrap();

  const { initializeUser } = useAuth();

  // Get user credentials on app start
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  if (fontError) {
    return <FontErrorFallback />;
  }

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView>
      <StatusBar style="dark" />
      <BottomSheetModalProvider>
        <KeyboardProvider>
          <ThemeProvider value={DefaultTheme}>
            <QueryClientProvider client={queryClient}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <AppBottomSheet />
              <Toast config={toastConfig} />
            </QueryClientProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
