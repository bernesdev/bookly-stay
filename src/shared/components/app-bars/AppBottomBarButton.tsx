import { useEffect } from 'react';

import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg';

import { AppText } from '../AppText';

import type { ColorToken } from '../../theme/colors';

type AppBottomBarButtonProps = {
  title: string;
  ActiveIcon: React.FC<SvgProps>;
  InactiveIcon: React.FC<SvgProps>;
  isActive: boolean;
  color: ColorToken;
};

/**
 * AppBottomBarButton component that renders an individual button for the AppBottomBar.
 */
export function AppBottomBarButton({
  title,
  ActiveIcon,
  InactiveIcon,
  isActive,
  color,
}: AppBottomBarButtonProps) {
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 300 });
  }, [isActive, progress]);

  const activeIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    position: 'absolute',
  }));

  const inactiveIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    overflow: 'hidden',
    opacity: progress.value,
    height: 22 * progress.value,
    transform: [{ translateY: 5 * (1 - progress.value) }],
  }));

  return (
    <View className="items-center justify-center w-[80px] flex-1">
      <View className="items-center justify-center w-[24px] h-[24px]">
        <Animated.View style={activeIconStyle}>
          <ActiveIcon width={24} height={24} fill={color} />
        </Animated.View>
        <Animated.View style={inactiveIconStyle}>
          <InactiveIcon width={24} height={24} stroke={color} />
        </Animated.View>
      </View>
      <Animated.View style={labelStyle}>
        <AppText size={10} color={color} weight="medium" className="mt-[4px]">
          {title}
        </AppText>
      </Animated.View>
    </View>
  );
}
