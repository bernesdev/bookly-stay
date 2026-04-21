import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg';

import { Colors } from '../theme/colors';
import { withOpacity } from '../utils/colors.utils';

import { BouncyPressable } from './animations/BouncyPressable';
import { AppText } from './AppText';

type ChipProps = {
  title: string;
  Icon?: React.FC<SvgProps>;
  onPress?: () => void;
  active?: boolean;
  className?: string;
};

export function Chip({
  title,
  Icon,
  onPress,
  active = false,
  className,
}: ChipProps) {
  const activeColor = withOpacity(Colors.primary, 0.2);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(active ? 1 : 0, { duration: 300 }),
  }));

  return (
    <BouncyPressable onPress={onPress} className={className}>
      <View
        className={`h-[45px] px-3 flex-row items-center justify-center rounded-xl bg-white border border-gray-300`}
      >
        <Animated.View
          className="rounded-xl"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: activeColor },
            animatedOverlayStyle,
          ]}
        />
        {Icon && <Icon width={24} height={24} style={{ marginRight: 8 }} />}
        <AppText size={14} weight="medium">
          {title}
        </AppText>
      </View>
    </BouncyPressable>
  );
}
