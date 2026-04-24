import { TouchableOpacity } from 'react-native';

import { Colors, type ColorToken } from '@/src/shared/theme/colors';

import { AppText, Weight } from '../AppText';

type TextButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  size?: number;
  color?: ColorToken;
  children?: React.ReactNode;
  weight?: Weight;
};

export function TextButton({
  onPress,
  disabled,
  className,
  size = 14,
  color = Colors.primary,
  weight = 'medium',
  children,
}: TextButtonProps) {
  return (
    <TouchableOpacity
      className={className}
      onPress={onPress}
      disabled={disabled}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <AppText size={size} color={color} weight={weight}>
        {children}
      </AppText>
    </TouchableOpacity>
  );
}
