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
      className={`items-center mx-6 px-6 py-4 border border-border rounded-xl border-dashed ${className}`}
    >
      <AppText size={14} className="text-center">
        {title}
      </AppText>
      <OutlinedButton
        title={t('home.actions.retry')}
        onPress={onRetry}
        className="mt-6 mx-auto"
      />
    </Animated.View>
  );
}
