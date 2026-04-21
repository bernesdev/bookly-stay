import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';

import { Colors } from '@/src/shared/theme/colors';

import { useLayout } from '../../hooks/useLayout';

/**
 * AppBottomBar component that renders a custom bottom tab bar for the app.
 */
export function AppBottomBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const layout = useLayout();

  return (
    <View className="bg-white" style={{ paddingBottom: layout.bottomInset }}>
      <View
        className="flex-row items-center justify-around bg-white border-t border-gray-300"
        style={{ height: layout.tabBarHeight }}
      >
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const options = descriptor.options;
          const isFocused = state.index === index;

          const color = isFocused
            ? (options.tabBarActiveTintColor ?? Colors.primary)
            : (options.tabBarInactiveTintColor ?? Colors.gray[100]);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
