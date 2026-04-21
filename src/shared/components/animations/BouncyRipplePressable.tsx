import { useRef, useState, type ReactNode } from 'react';

import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { withOpacity } from '@/src/shared/utils/colors.utils';

import { RippleEffect, type RippleEffectRef } from './RippleEffect';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type BouncyRipplePressableProps = PressableProps & {
  children?: ReactNode;
  activeScale?: number;
  rippleColor?: string;
  rippleOpacity?: number;
  rippleSize?: number;
  className?: string;
};

export function BouncyRipplePressable({
  children,
  activeScale = 0.95,
  rippleColor = '#000000',
  rippleOpacity = 0.1,
  rippleSize,
  className,
  style,
  onPressIn,
  onPressOut,
  onLayout,
  disabled,
  ...rest
}: BouncyRipplePressableProps) {
  const activeColor = withOpacity(rippleColor, rippleOpacity);
  const rippleRef = useRef<RippleEffectRef>(null);
  const scale = useSharedValue(1);
  const [measuredRippleSize, setMeasuredRippleSize] = useState(400);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn: NonNullable<PressableProps['onPressIn']> = (event) => {
    if (disabled) {
      onPressIn?.(event);
      return;
    }

    rippleRef.current?.play();
    scale.value = withTiming(activeScale, { duration: 100 });
    onPressIn?.(event);
  };

  const handlePressOut: NonNullable<PressableProps['onPressOut']> = (event) => {
    if (disabled) {
      onPressOut?.(event);
      return;
    }

    rippleRef.current?.stop();
    scale.value = withTiming(1, { duration: 150 });
    onPressOut?.(event);
  };

  const handleLayout: NonNullable<PressableProps['onLayout']> = (event) => {
    const { width, height } = event.nativeEvent.layout;
    const nextSize = Math.ceil(Math.sqrt(width * width + height * height));

    if (nextSize > 0) {
      setMeasuredRippleSize((currentSize) =>
        currentSize === nextSize ? currentSize : nextSize,
      );
    }

    onLayout?.(event);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={handleLayout}
      style={[animatedStyle, style]}
      className={`overflow-hidden ${className}`}
      disabled={disabled}
      {...rest}
    >
      <RippleEffect
        ref={rippleRef}
        color={activeColor}
        size={rippleSize ?? measuredRippleSize}
      />
      {children}
    </AnimatedPressable>
  );
}
