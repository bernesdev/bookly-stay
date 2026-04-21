import { useTranslation } from 'react-i18next';

import { RipplePressable } from '@/src/shared/components/animations/RipplePressable';
import { AppText } from '@/src/shared/components/AppText';
import { Colors } from '@/src/shared/theme/colors';

type SearchButtonProps = {
  onPress?: () => void;
};

export function SearchButton({ onPress }: SearchButtonProps) {
  const { t } = useTranslation();

  return (
    <RipplePressable
      className="bg-primary justify-center items-center h-[58px] w-full rounded-b-xl"
      onPress={onPress}
    >
      <AppText size={16} color={Colors.white} weight="bold">
        {t('shared.searchButton.label')}
      </AppText>
    </RipplePressable>
  );
}
