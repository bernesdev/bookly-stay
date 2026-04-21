import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppText } from '@/src/shared/components/AppText';
import { TextButton } from '@/src/shared/components/buttons/TextButton';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { Colors } from '@/src/shared/theme/colors';

type AccommodationDescriptionProps = {
  description: string;
  className?: string;
};

export function AccommodationDescription({
  description,
  className,
}: AccommodationDescriptionProps) {
  const { t } = useTranslation();

  const { bottomOffset } = useLayout();

  const [expanded, setExpanded] = useState(false);

  return (
    <View className={className} style={{ marginBottom: bottomOffset + 100 }}>
      {!expanded && (
        <>
          <AppText
            size={14}
            color={Colors.text}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {description}
          </AppText>
          <TextButton
            weight="bold"
            size={14}
            onPress={() => setExpanded(true)}
            color={Colors.primary}
          >
            {t('accommodation.description.readMore')}
          </TextButton>
        </>
      )}
      {expanded && (
        <AppText size={14} color={Colors.text}>
          {description}
        </AppText>
      )}
    </View>
  );
}
