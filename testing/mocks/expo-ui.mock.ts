jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: () => null,
}));

jest.mock('moti/skeleton', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');

  return {
    Skeleton: ({ children, ...props }: { children?: React.ReactNode }) =>
      React.createElement(View, { ...props }, children),
  };
});

jest.mock('react-native-reanimated', () => {
  const { Image, View } = jest.requireActual('react-native');

  const makeBuilder = () => ({
    duration: () => makeBuilder(),
    delay: () => makeBuilder(),
  });

  return {
    __esModule: true,
    default: {
      Image,
      View,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: <T>(initial: T) => ({ value: initial }),
    withTiming: (
      value: unknown,
      _config?: unknown,
      callback?: (finished?: boolean) => void,
    ) => {
      callback?.(true);
      return value;
    },
    withSequence: (...values: unknown[]) => values.at(-1),
    cancelAnimation: jest.fn(),
    Easing: {
      in: (fn: unknown) => fn,
      out: (fn: unknown) => fn,
      cubic: 'cubic',
    },
    useAnimatedStyle: (updater: () => object) => updater(),
    withSpring: (value: unknown) => value,
    FadeIn: makeBuilder(),
    FadeInUp: makeBuilder(),
    FadeOut: makeBuilder(),
    FadeOutDown: makeBuilder(),
    SlideInDown: makeBuilder(),
    LinearTransition: makeBuilder(),
  };
});

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (callback: () => void) => callback(),
}));
