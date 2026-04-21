import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppScreen } from '@/src/shared/components/AppScreen';
import { useLayout } from '@/src/shared/hooks/useLayout';

import { AuthForm } from '../components/AuthForm';
import { AuthHeader } from '../components/AuthHeader';

export function AuthScreen() {
  const { t } = useTranslation();

  const { bottomOffset } = useLayout();

  return (
    <AppScreen keyboardAvoiding appBar={{ title: t('auth.authScreen.title') }}>
      <View
        className="flex-1 items-center justify-center"
        style={{ marginBottom: bottomOffset }}
      >
        <AuthHeader />
        <AuthForm />
      </View>
    </AppScreen>
  );
}
