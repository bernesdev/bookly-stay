import { useCallback, useEffect, useState, type RefObject } from 'react';

import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import CloseIcon from '@/assets/icons/x.svg';
import { AppText } from '@/src/shared/components/AppText';
import { IconButton } from '@/src/shared/components/buttons/IconButton';
import { SearchInputOptions } from '@/src/shared/components/search/SearchInputOptions';
import { useLayout } from '@/src/shared/hooks/useLayout';

import { useCatalogStore } from '../hooks/useCatalogStore';

const SHEET_HEIGHT = 280;

export type SearchOptionsRef = {
  present: () => void;
  dismiss: () => void;
};

type SearchOptionsSheetProps = {
  sheetRef?: RefObject<SearchOptionsRef | null>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SearchOptionsSheet({ sheetRef }: SearchOptionsSheetProps) {
  const { t } = useTranslation();

  const { topInset } = useLayout();

  const setNewSearch = useCatalogStore((state) => state.setNewSearch);

  const [isOpen, setIsOpen] = useState(false);

  const translateY = useSharedValue(-SHEET_HEIGHT);
  const opacity = useSharedValue(0);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const animatedSheetBackgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const present = useCallback(() => {
    setIsOpen(true);
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [translateY, opacity]);

  const closeOnRN = useCallback(() => {
    setIsOpen(false);
  }, []);

  const dismiss = useCallback(() => {
    translateY.value = withTiming(
      -SHEET_HEIGHT,
      {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          scheduleOnRN(closeOnRN);
        }
      },
    );
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.in(Easing.cubic),
    });
  }, [closeOnRN, translateY, opacity]);

  useEffect(() => {
    if (!sheetRef) return;

    sheetRef.current = { present, dismiss };

    return () => {
      sheetRef.current = null;
    };
  }, [sheetRef, present, dismiss]);

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatedPressable
      className="absolute inset-0 z-[100] bg-black/20"
      onPress={dismiss}
      accessibilityRole="button"
      style={animatedSheetBackgroundStyle}
    >
      <AnimatedPressable
        className="absolute left-0 right-0 top-0 z-[101] bg-background shadow-lg"
        style={animatedSheetStyle}
      >
        <View
          className="flex-1 items-center justify-center w-full px-6 pb-3"
          style={{ paddingTop: topInset + 10 }}
        >
          <View className="flex-row items-center w-full mb-3">
            <IconButton Icon={CloseIcon} onPress={dismiss} />
            <AppText weight={'medium'} className="text-lg font-medium mx-auto">
              {t('catalog.searchSheet.title')}
            </AppText>
            <View className="w-[24px]" />
          </View>
          <SearchInputOptions
            onSubmit={(stay) => {
              dismiss();
              setNewSearch(stay);
            }}
          />
        </View>
      </AnimatedPressable>
    </AnimatedPressable>
  );
}
