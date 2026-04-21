import { SvgProps } from 'react-native-svg';

import { Colors } from '@/src/shared/theme/colors';

import { BouncyRipplePressable } from '../animations/BouncyRipplePressable';

type IconButtonProps = {
  onPress?: () => void;
  Icon: React.FC<SvgProps>;
  disabled?: boolean;
  iconColor?: string;
  iconSize?: number;
  className?: string;
  outlined?: boolean;
};

export function IconButton({
  onPress,
  Icon,
  disabled,
  iconColor = Colors.text,
  iconSize = 24,
  outlined = false,
  className,
}: IconButtonProps) {
  return (
    <BouncyRipplePressable
      disabled={disabled || !onPress}
      onPress={onPress}
      rippleSize={outlined ? undefined : 0}
      rippleOpacity={0.04}
      className={`justify-center items-center ${className}`}
      style={{
        width: outlined ? 34 : iconSize,
        height: outlined ? 34 : iconSize,
        borderWidth: outlined ? 1 : 0,
        borderColor: Colors.gray[200],
        borderRadius: outlined ? 10 : 0,
      }}
      activeScale={0.9}
      hitSlop={40 - iconSize}
    >
      <Icon
        width={iconSize}
        height={iconSize}
        stroke={disabled ? Colors.gray[200] : iconColor}
      />
    </BouncyRipplePressable>
  );
}
