import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import { BouncyPressable } from '@/src/shared/components/animations/BouncyPressable';
import { AppText } from '@/src/shared/components/AppText';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { Colors } from '@/src/shared/theme/colors';
import { withOpacity } from '@/src/shared/utils/colors.utils';

export function AccommodationAppBar() {
  const { t } = useTranslation();

  const { topInset } = useLayout();

  const router = useRouter();

  return (
    <View
      className="absolute top-0 right-0 left-0 mx-6 flex-row items-center justify-between h-[55px]"
      style={{ marginTop: topInset }}
    >
      <BouncyPressable
        onPress={() => router.back()}
        className="h-[48px] w-[48px] rounded-full items-center justify-center"
        style={{ backgroundColor: withOpacity(Colors.white, 0.4) }}
        activeScale={0.92}
      >
        <ChevronLeftIcon width={22} height={22} stroke={Colors.white} />
      </BouncyPressable>
      <AppText size={16} weight="bold" color={Colors.white}>
        {t('accommodation.appBar.title')}
      </AppText>
      <View className="w-[48px]" />
    </View>
  );
}
