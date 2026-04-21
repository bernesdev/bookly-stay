import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Image } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import ChevronLeft from '@/assets/icons/chevron-left.svg';
import LogoIcon from '@/assets/icons/logo.png';
import { Colors } from '@/src/shared/theme/colors';

import { AppText } from '../AppText';
import { IconButton } from '../buttons/IconButton';

export type AppTopBarProps = {
  title?: string;
  showLeading?: boolean;
  showLogo?: boolean;
  scrollY: SharedValue<number>;
  footerHeight?: number;
  collapsableFooter?: boolean;
  collapsableActionButton?: boolean;
  HeaderComponent?: React.ReactNode;
  FooterComponent?: React.ReactNode;
  ActionButtonComponent?: React.ReactNode;
};

/**
 * AppTopBar component that renders a customizable top bar for the app.
 * It supports an optional title, leading icon, logo, and action button.
 * The top bar can also have a collapsable footer that hides on scroll.
 */
export function AppTopBar({
  title,
  showLeading = true,
  showLogo = false,
  scrollY,
  FooterComponent,
  ActionButtonComponent,
  HeaderComponent,
  collapsableFooter = false,
  collapsableActionButton = false,
  footerHeight,
}: AppTopBarProps) {
  const { t } = useTranslation();

  const router = useRouter();

  const diffClamp = useSharedValue(0);

  useAnimatedReaction(
    () => scrollY.value,
    (current, previous) => {
      const diff = current - (previous ?? 0);

      if (current <= 0) {
        diffClamp.value = 0;
        return;
      }

      const newValue = diffClamp.value + diff;
      diffClamp.value = Math.max(0, Math.min(50, newValue));
    },
  );

  const animatedAppTopBar = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(
      scrollY.value,
      [0, 20],
      [0, 0.25],
      Extrapolation.CLAMP,
    ),
    elevation: interpolate(scrollY.value, [0, 20], [0, 5], Extrapolation.CLAMP),
  }));

  const animatedFooter = useAnimatedStyle(() => ({
    height: interpolate(
      diffClamp.value,
      [0, 50],
      [footerHeight ?? 0, 0],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(diffClamp.value, [0, 50], [1, 0], Extrapolation.CLAMP),
  }));

  const animatedActionButton = useAnimatedStyle(() => ({
    opacity: interpolate(diffClamp.value, [0, 50], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View
        className="flex w-full bg-background"
        style={[styles.appBar, animatedAppTopBar]}
      >
        <View className="z-20">
          {HeaderComponent ?? (
            <View className="h-[55px] w-full justify-between items-center flex-row px-6">
              {showLeading && (
                <IconButton
                  onPress={() => router.back()}
                  Icon={ChevronLeft}
                  iconSize={22}
                />
              )}
              {showLogo && (
                <View className="flex-row mr-auto items-center">
                  <Image className="w-[40px] h-[40px]" source={LogoIcon} />
                  <AppText
                    className="ml-2"
                    size={18}
                    color={Colors.text}
                    weight="bold"
                  >
                    {t('shared.brand.appName')}
                  </AppText>
                </View>
              )}
              {title && (
                <AppText
                  size={16}
                  color={Colors.text}
                  weight="bold"
                  className={`mx-auto ${showLeading && !ActionButtonComponent ? 'pr-[22px]' : ''}`}
                >
                  {title}
                </AppText>
              )}
              {ActionButtonComponent && (
                <Animated.View
                  style={
                    collapsableActionButton ? animatedActionButton : undefined
                  }
                >
                  {ActionButtonComponent}
                </Animated.View>
              )}
            </View>
          )}
        </View>
        {FooterComponent && (
          <Animated.View
            style={
              collapsableFooter
                ? [{ overflow: 'hidden' }, animatedFooter]
                : undefined
            }
          >
            {FooterComponent}
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    paddingBottom: 15,
    marginBottom: -15,
    zIndex: 10,
  },
  appBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.84,
  },
});
