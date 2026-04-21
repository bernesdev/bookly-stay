import React, { useMemo } from 'react';

import { useRouter } from 'expo-router';

import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useAccommodationsQuery } from '@/src/features/accommodation';
import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';
import { AccommodationSmallCardSkeleton } from '@/src/features/home/components/AccommodationSmallCardSkeleton';
import { AccommodationSmallCard } from '@/src/shared/components/cards/AccommodationSmallCard';
import { SectionTitle } from '@/src/shared/components/SectionTitle';
import { useStayStore } from '@/src/shared/hooks/useStayStore';

import { LocationError } from './LocationError';
import { SectionError } from './SectionError';

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<Accommodation>,
);

export function CloseToYouList() {
  const { t } = useTranslation();

  const router = useRouter();

  const geoLocation = useStayStore((state) => state.geoLocation);
  const locationStatus = useStayStore((state) => state.locationStatus);
  const setStay = useStayStore((state) => state.setStay);

  const { data, status, error, refetch } = useAccommodationsQuery({
    locationId: geoLocation?.id ?? '',
    limit: 5,
  });

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const onSeeAll = () => {
    if (error) return;
    setStay({ location: geoLocation });
    router.push('/catalog');
  };

  return (
    <View className="px-6">
      <SectionTitle
        title={t('home.sections.closeToYou')}
        buttonText={t('home.actions.seeAll')}
        onButtonPress={onSeeAll}
        className="mt-8 mb-6"
      />

      {locationStatus !== 'granted' && locationStatus !== 'undetermined' && (
        <LocationError onRetry={refetch} />
      )}

      {(status === 'pending' && locationStatus === 'granted') ||
        (locationStatus === 'undetermined' && (
          <View className="">
            {Array.from({ length: 5 }).map((_, index) => (
              <Animated.View
                key={`skeleton-${index}`}
                exiting={FadeOut.duration(300)}
              >
                <AccommodationSmallCardSkeleton />
                {index < 4 && <View className="my-4 border-b border-border" />}
              </Animated.View>
            ))}
          </View>
        ))}

      {error && locationStatus === 'granted' && (
        <SectionError
          title={t('home.errors.closeToYouLoad')}
          onRetry={refetch}
        />
      )}

      {locationStatus === 'granted' && items && (
        <AnimatedFlashList
          entering={FadeIn.duration(300)}
          data={items}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View className="my-4 border-b border-border" />
          )}
          renderItem={({ item }) => <AccommodationSmallCard {...item} />}
        />
      )}
    </View>
  );
}
