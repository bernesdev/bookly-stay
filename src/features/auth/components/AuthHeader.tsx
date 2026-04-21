import { useTranslation } from 'react-i18next';
import { View, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import LogoIcon from '@/assets/icons/logo.png';
import { AppText } from '@/src/shared/components/AppText';

export function AuthHeader() {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      className="mt-10 mb-6 items-center"
    >
      <View className="flex-row items-center">
        <Image className="w-[70px] h-[70px]" source={LogoIcon} />
        <AppText size={48} weight="extrabold" className="ml-3">
          {t('auth.authHeader.appName')}
        </AppText>
      </View>
      <AppText size={12} weight="light" className="mt-3">
        {t('auth.authHeader.subtitle')}
      </AppText>
    </Animated.View>
  );
}
