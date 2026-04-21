import { useEffect, useRef } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText } from '@/src/shared/components/AppText';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { Colors } from '@/src/shared/theme/colors';
import { errorMessages } from '@/src/shared/utils/messages.utils';

import { useAccommodationQuery } from '../api/accommodation.queries';
import { AccommodationAppBar } from '../components/AccommodationAppBar';
import { AccommodationBookingSheet } from '../components/AccommodationBookingSheet';
import { AccommodationContent } from '../components/AccommodationContent';
import { AccommodationSkeleton } from '../components/AccommodationSkeleton';

const SNAP_POINTS = ['75%', '100%'];

export function AccommodationScreen() {
  const { t } = useTranslation();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { topInset } = useLayout();

  const { id, title, image } = useLocalSearchParams<{
    id: string;
    title: string;
    image: string;
  }>();

  const {
    data: accommodation,
    isLoading,
    error,
    refetch,
  } = useAccommodationQuery(id);

  useEffect(() => {
    if (error) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [error]);

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <View className="absolute top-[-22px] left-0 right-0 z-0">
        <Animated.Image
          source={{ uri: image }}
          className="w-full h-[370px]"
          sharedTransitionTag={`accommodation-image-${id}`}
        />
        <LinearGradient
          colors={['rgba(16,16,16, 1)', 'rgba(0,0,0,0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          style={styles.gradient}
        />
      </View>
      <AccommodationAppBar />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={SNAP_POINTS}
        topInset={topInset + 64}
        backgroundStyle={{
          borderRadius: 16,
          backgroundColor: Colors.background,
        }}
        handleIndicatorStyle={{ height: 0 }}
        animateOnMount={false}
        enableOverDrag={false}
        enableHandlePanningGesture={!error}
        enableContentPanningGesture={!error}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className="px-6 rounded-3xl bg-background">
            {error && (
              <ErrorMessage
                title={t('accommodation.screen.loadErrorTitle')}
                message={errorMessages.getDefaultError(error?.message)}
                onPress={refetch}
                className="flex-1 mt-4 mb-40 px-0"
              />
            )}
            {!error && (
              <AppText size={22} weight="bold" className="mt-1">
                {title}
              </AppText>
            )}
            {isLoading && <AccommodationSkeleton />}
            {accommodation && <AccommodationContent {...accommodation} />}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
      {accommodation && (
        <AccommodationBookingSheet accommodation={accommodation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 370,
  },
});
