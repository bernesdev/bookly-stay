import { useRef, useState, type ReactNode } from 'react';

import { Pressable, type PressableProps } from 'react-native';

import { withOpacity } from '@/src/shared/utils/colors.utils';

import { RippleEffect, type RippleEffectRef } from './RippleEffect';

type RipplePressableProps = PressableProps & {
  children?: ReactNode;
  rippleColor?: string;
  rippleOpacity?: number;
  rippleSize?: number;
  className?: string;
};

export function RipplePressable({
  children,
  rippleColor = '#000000',
  rippleOpacity = 0.1,
  rippleSize,
  className,
  onPressIn,
  onPressOut,
  onLayout,
  disabled,
  ...rest
}: RipplePressableProps) {
  const activeColor = withOpacity(rippleColor, rippleOpacity);
  const rippleRef = useRef<RippleEffectRef>(null);
  const [measuredRippleSize, setMeasuredRippleSize] = useState(400);

  const handlePressIn: NonNullable<PressableProps['onPressIn']> = (event) => {
    if (disabled) {
      onPressIn?.(event);
      return;
    }

    rippleRef.current?.play();
    onPressIn?.(event);
  };

  const handlePressOut: NonNullable<PressableProps['onPressOut']> = (event) => {
    if (disabled) {
      onPressOut?.(event);
      return;
    }

    rippleRef.current?.stop();
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
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={handleLayout}
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
    </Pressable>
  );
}
