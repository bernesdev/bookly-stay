import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useLayout() {
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === 'android' ? insets.top + 8 : insets.top;
  const topOffset = topInset + 24;

  const bottomInset =
    Platform.OS === 'android' ? Math.max(insets.bottom, 16) : 16;
  const bottomSpacing = 24;
  const bottomOffset = bottomInset + bottomSpacing;

  const topBarHeight = 55;

  const tabBarHeight = 60;
  const tabBarFullHeight = tabBarHeight + bottomInset;

  return {
    topInset,
    topOffset,
    bottomInset,
    bottomSpacing,
    bottomOffset,
    tabBarHeight,
    tabBarFullHeight,
    topBarHeight,
  };
}
