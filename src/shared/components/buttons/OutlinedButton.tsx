import { PressableProps } from 'react-native';

import { Colors } from '@/src/shared/theme/colors';

import { BouncyRipplePressable } from '../animations/BouncyRipplePressable';
import { AppText } from '../AppText';

type OutlinedButtonProps = PressableProps & {
  title: string;
  className?: string;
};

export function OutlinedButton({
  title,
  onPress,
  className,
  onPressIn,
  onPressOut,
  ...props
}: OutlinedButtonProps) {
  return (
    <BouncyRipplePressable
      className={`rounded-full bg-gray-500/5 px-4 py-2 border border-primary ${className}`}
      onPress={onPress}
      rippleOpacity={0.03}
      activeScale={0.98}
      {...props}
    >
      <AppText size={14} weight={'semibold'} color={Colors.primary}>
        {title}
      </AppText>
    </BouncyRipplePressable>
  );
}
