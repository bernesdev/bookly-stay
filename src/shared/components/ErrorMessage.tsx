import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import ChevronDown from '@/assets/icons/chevron-down.svg';
import WarningIcon from '@/assets/icons/warning.svg';

import { Colors } from '../theme/colors';

import { AppText } from './AppText';
import { SolidButton } from './buttons/SolidButton';

export type ErrorMessageProps = {
  title: string;
  message: string;
  buttonTitle?: string;
  onPress?: () => void;
  className?: string;
};

export function ErrorMessage({
  title,
  message,
  buttonTitle,
  onPress,
  className,
}: ErrorMessageProps) {
  const { t } = useTranslation();

  const resolvedButtonTitle = buttonTitle ?? t('shared.errorMessage.retry');

  return (
    <Animated.View
      className={`justify-center items-center px-4 mb-10 ${className}`}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <View className="w-[62px] h-[62px] rounded-full bg-white items-center justify-center mb-10">
        <WarningIcon width={40} height={40} stroke={Colors.text} />
      </View>

      <AppText size={16} weight="bold" className="mb-8">
        {t('shared.errorMessage.title')}
      </AppText>

      <AppText size={14} className="mb-10">
        {title}
      </AppText>

      <View className="flex-row items-center py-4 mb-6 border-y border-border justify-between w-full">
        <AppText>{t('shared.errorMessage.detailsLabel')}</AppText>
        <ChevronDown width={20} height={20} stroke={Colors.text} />
      </View>

      <AppText size={14} color={Colors.gray[100]} className="mb-6">
        {message}
      </AppText>

      {onPress && (
        <SolidButton
          title={resolvedButtonTitle}
          onPress={onPress}
          className="mt-8"
        />
      )}
    </Animated.View>
  );
}
