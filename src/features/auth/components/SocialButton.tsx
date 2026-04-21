import { BouncyRipplePressable } from '@/src/shared/components/animations/BouncyRipplePressable';

type SocialButtonProps = {
  onPress: () => void;
  Icon: React.ElementType;
  className?: string;
};

export function SocialButton({ onPress, Icon, className }: SocialButtonProps) {
  return (
    <BouncyRipplePressable
      onPress={onPress}
      className={`w-[70px] h-[50px] justify-center items-center rounded-lg bg-white ${className}`}
      rippleOpacity={0.04}
      activeScale={0.95}
    >
      <Icon width={24} height={24} />
    </BouncyRipplePressable>
  );
}
