import { RipplePressable } from '@/src/shared/components/animations/RipplePressable';
import { AppText } from '@/src/shared/components/AppText';

interface ProfileButtonProps {
  title: string;
  onPress: () => void;
}

export function ProfileButton({ title, onPress }: ProfileButtonProps) {
  return (
    <RipplePressable
      className="h-[60px] px-6 justify-center border-b border-border"
      onPress={onPress}
      rippleOpacity={0.04}
    >
      <AppText size={14} weight="medium">
        {title}
      </AppText>
    </RipplePressable>
  );
}
