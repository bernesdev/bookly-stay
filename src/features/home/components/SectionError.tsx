import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/src/shared/components/AppText';
import { OutlinedButton } from '@/src/shared/components/buttons/OutlinedButton';

type SectionErrorProps = {
  title: string;
  onRetry: () => void;
  className?: string;
};

export function SectionError({ title, onRetry, className }: SectionErrorProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className={`flex-1 ${className} items-center`}
    >
      <AppText size={14}>{title}</AppText>
      <OutlinedButton
        title={t('home.actions.retry')}
        onPress={onRetry}
        className="mx-auto mt-6"
      />
    </Animated.View>
  );
}
