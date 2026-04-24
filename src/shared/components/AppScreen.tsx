import { useRef, useState } from 'react';

import {
  Keyboard,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAvoidingView as KeyboardControllerAvoidingView,
} from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  SharedValue,
} from 'react-native-reanimated';

import { useLayout } from '../hooks/useLayout';

import { AppTopBar, type AppTopBarProps } from './app-bars/AppTopBar';

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

type ScrollHandlerType = ReturnType<typeof useAnimatedScrollHandler>;

type ChildrenFunction = (props: {
  onScroll: ScrollHandlerType;
  topBarHeight: number;
  scrollY: SharedValue<number>;
}) => React.ReactNode;

type AppScreenProps = {
  appBar: Omit<AppTopBarProps, 'scrollY'>;
  bottomBar?: React.ReactNode;
  preset?: 'scroll' | 'list' | 'fixed';
  disableSafeArea?: boolean;
  keyboardAvoiding?: boolean;
  children: React.ReactNode | ChildrenFunction;
};

/**
 * AppScreen component that provides a consistent layout for screens in the app.
 * It supports different presets for handling content and keyboard interactions.
 *
 * Presets:
 * - 'scroll': Wraps content in a scroll view that adjusts for the keyboard.
 * - 'fixed': Uses a fixed layout with keyboard avoiding behavior.
 * - 'list': Renders content as is, without additional wrappers (useful for FlatList).
 */
export function AppScreen({
  children,
  appBar,
  disableSafeArea = false,
  keyboardAvoiding = false,
  preset = 'scroll',
}: AppScreenProps) {
  if (
    (preset === 'fixed' || preset === 'scroll') &&
    typeof children === 'function'
  ) {
    throw new Error(
      'Preset "fixed" and "scroll" do not support function as children.',
    );
  }

  const { topInset, bottomOffset, topBarHeight } = useLayout();
  const scrollY = useSharedValue(0);

  const initialHeaderHeight = appBar.headerHeight ?? topBarHeight;
  const initialTopBarHeight =
    initialHeaderHeight +
    (appBar.FooterComponent ? (appBar.footerHeight ?? 0) : 0);
  const [currentTopBarHeight, setTopBarHeight] = useState(initialTopBarHeight);

  const measuredTopBarOnce = useRef(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleAppBarLayout = (e: LayoutChangeEvent) => {
    if (!measuredTopBarOnce.current && e.nativeEvent.layout.height > 0) {
      measuredTopBarOnce.current = true;
      setTopBarHeight(e.nativeEvent.layout.height);
    }
  };

  const content =
    typeof children === 'function'
      ? children({
          onScroll: scrollHandler,
          topBarHeight: currentTopBarHeight,
          scrollY,
        })
      : children;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: disableSafeArea ? 0 : topInset }}
    >
      <View style={{ flex: 1 }}>
        {preset === 'scroll' && (
          <AnimatedKeyboardAwareScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            keyboardShouldPersistTaps="handled"
            bottomOffset={bottomOffset}
            enabled={keyboardAvoiding}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: currentTopBarHeight,
            }}
          >
            {content}
          </AnimatedKeyboardAwareScrollView>
        )}

        {preset === 'fixed' && (
          <KeyboardControllerAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            enabled={keyboardAvoiding}
          >
            <TouchableWithoutFeedback
              accessible={false}
              onPress={Keyboard.dismiss}
            >
              <View
                style={{
                  flex: 1,
                  paddingTop: currentTopBarHeight,
                  paddingBottom: bottomOffset,
                }}
              >
                {content}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardControllerAvoidingView>
        )}

        {preset === 'list' && <View style={{ flex: 1 }}>{content}</View>}

        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
          onLayout={handleAppBarLayout}
        >
          <AppTopBar {...appBar} scrollY={scrollY} />
        </View>
      </View>
    </View>
  );
}
