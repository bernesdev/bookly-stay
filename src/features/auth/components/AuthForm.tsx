import { useState } from 'react';

import { Keyboard, View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

type AuthMode = 'signin' | 'signup';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <View className="mt-auto w-full px-6">
      <Animated.View
        key={mode}
        className="w-full"
        entering={FadeInUp.duration(260).delay(220)}
        exiting={FadeOutDown.duration(220)}
      >
        {mode === 'signin' ? (
          <SignInForm
            onSwitchToSignUp={() => {
              Keyboard.dismiss();
              setMode('signup');
            }}
          />
        ) : (
          <SignUpForm
            onSwitchToSignIn={() => {
              Keyboard.dismiss();
              setMode('signin');
            }}
          />
        )}
      </Animated.View>
    </View>
  );
}
