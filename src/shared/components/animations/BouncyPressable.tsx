import React from 'react';

import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface BouncyPressableProps extends PressableProps {
  children?: React.ReactNode;
  Icon?: React.ReactNode;
  activeScale?: number;
  className?: string;
}

export function BouncyPressable({
  children,
  activeScale = 0.95,
  className,
  style,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: BouncyPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  const handlePressIn = (event: any) => {
    if (disabled) return;
    scale.value = withTiming(activeScale, { duration: 100 });
    if (onPressIn) onPressIn(event);
  };

  const handlePressOut = (event: any) => {
    if (disabled) return;
    scale.value = withTiming(1, { duration: 150 });
    if (onPressOut) onPressOut(event);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
      className={className}
      disabled={disabled}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
