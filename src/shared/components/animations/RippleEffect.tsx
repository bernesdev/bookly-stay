import { useImperativeHandle, type Ref } from 'react';

import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type RippleEffectRef = {
  play: () => void;
  stop: () => void;
};

type RippleEffectProps = {
  color: string;
  size?: number;
  ref?: Ref<RippleEffectRef>;
};

export function RippleEffect({ color, size = 400, ref }: RippleEffectProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    play: () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);

      scale.value = 0;
      opacity.value = 1;

      scale.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.ease),
      });
    },
    stop: () => {
      opacity.value = withTiming(0, { duration: 300 });
    },
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { justifyContent: 'center', alignItems: 'center', zIndex: 0 },
      ]}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
