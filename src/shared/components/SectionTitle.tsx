import { View } from 'react-native';

import { Colors } from '@/src/shared/theme/colors';

import { AppText } from './AppText';
import { TextButton } from './buttons/TextButton';

type SectionTitleProps = {
  title: string;
  buttonText?: string;
  onButtonPress?: () => void;
  className?: string;
};

export function SectionTitle({
  title,
  buttonText,
  onButtonPress,
  className,
}: SectionTitleProps) {
  return (
    <View
      className={`w-full flex-row justify-between items-center ${className}`}
    >
      <AppText size={16} color={Colors.text} weight="semibold">
        {title}
      </AppText>
      {buttonText && onButtonPress && (
        <TextButton onPress={onButtonPress}>{buttonText}</TextButton>
      )}
    </View>
  );
}
