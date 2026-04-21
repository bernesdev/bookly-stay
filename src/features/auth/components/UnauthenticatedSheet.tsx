import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import CloseIcon from '@/assets/icons/x.svg';
import { AppText } from '@/src/shared/components/AppText';
import { IconButton } from '@/src/shared/components/buttons/IconButton';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { Colors } from '@/src/shared/theme/colors';

type UnauthenticatedSheetProps = {
  title: string;
};

export function UnauthenticatedSheet({ title }: UnauthenticatedSheetProps) {
  const { t } = useTranslation();

  const router = useRouter();

  const { hideSheet } = useBottomSheet();

  return (
    <View className="px-6 pt-4">
      <View className="flex-row justify-between items-center">
        <AppText size={20} weight="semibold">
          {t('auth.unauthenticatedSheet.title')}
        </AppText>
        <IconButton Icon={CloseIcon} onPress={hideSheet} />
      </View>

      <AppText size={14} color={Colors.gray[100]} className="mt-8 mb-10">
        {title}
      </AppText>

      <SolidButton
        title={t('auth.unauthenticatedSheet.action')}
        onPress={() => {
          hideSheet();
          router.push('/auth');
        }}
      />
    </View>
  );
}
