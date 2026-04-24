import { useEffect } from 'react';

import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors, ColorToken } from '@/src/shared/theme/colors';

import { AppText } from '../AppText';

type AnimatedLoadingDotsProps = {
  color?: ColorToken;
  size?: number;
};

export function AnimatedLoadingDots({
  color = Colors.gray[100],
  size = 12,
}: AnimatedLoadingDotsProps) {
  const dot1Opacity = useSharedValue(0);
  const dot2Opacity = useSharedValue(0);
  const dot3Opacity = useSharedValue(0);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1Opacity.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2Opacity.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3Opacity.value }));

  useEffect(() => {
    // Animate dot 1
    dot1Opacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 500,
          easing: Easing.in(Easing.ease),
        }),
        withTiming(1, { duration: 1000 }),
        withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        }),
      ),
      -1,
      false,
    );

    // Animate dot 2
    dot2Opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, {
          duration: 500,
          easing: Easing.in(Easing.ease),
        }),
        withTiming(1, { duration: 500 }),
        withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        }),
      ),
      -1,
      false,
    );

    // Animate dot 3
    dot3Opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000 }),
        withTiming(1, {
          duration: 500,
          easing: Easing.in(Easing.ease),
        }),
        withTiming(1, { duration: 0 }),
        withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        }),
      ),
      -1,
      false,
    );
  }, []);

  return (
    <View className="flex-row items-center">
      <Animated.View style={dot1Style}>
        <AppText size={size} color={color}>
          .
        </AppText>
      </Animated.View>
      <Animated.View style={dot2Style}>
        <AppText size={size} color={color}>
          .
        </AppText>
      </Animated.View>
      <Animated.View style={dot3Style}>
        <AppText size={size} color={color}>
          .
        </AppText>
      </Animated.View>
    </View>
  );
}
