import { ActivityIndicator, PressableProps } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

import { Colors } from '@/src/shared/theme/colors';

import { BouncyRipplePressable } from '../animations/BouncyRipplePressable';
import { AppText } from '../AppText';

type SolidButtonProps = PressableProps & {
  title: string;
  className?: string;
  isLoading?: boolean;
};

export function SolidButton({
  title,
  onPress,
  onPressIn,
  onPressOut,
  className,
  isLoading,
  ...props
}: SolidButtonProps) {
  return (
    <BouncyRipplePressable
      className={`flex-row rounded-xl h-[50px] w-full bg-primary justify-center items-center ${className}`}
      onPress={onPress}
      activeScale={0.98}
      {...props}
    >
      <Animated.View layout={LinearTransition.duration(220)}>
        <AppText color={Colors.white} weight="bold" size={16}>
          {title}
        </AppText>
      </Animated.View>

      {isLoading && (
        <Animated.View
          className="ml-2"
          layout={LinearTransition.duration(220)}
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(220)}
        >
          <ActivityIndicator color={Colors.white} size="small" />
        </Animated.View>
      )}
    </BouncyRipplePressable>
  );
}
