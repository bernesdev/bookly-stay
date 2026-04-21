import React, { useMemo } from 'react';

import { useRouter } from 'expo-router';

import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useTopDestinationsQuery } from '@/src/features/location/api/location.queries';
import { Destination } from '@/src/features/location/api/location.types';
import { AppSkeleton } from '@/src/shared/components/AppSkeleton';
import { DestinationCard } from '@/src/shared/components/cards/DestinationCard';
import { SectionTitle } from '@/src/shared/components/SectionTitle';

import { SectionError } from './SectionError';

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<Destination>,
);

export function TopDestinationsList() {
  const { t } = useTranslation();

  const router = useRouter();

  const { data, isLoading, error, refetch } = useTopDestinationsQuery({
    limit: 5,
  });

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const onSeeAll = () => {
    if (error) return;
    router.push('/destinations');
  };

  return (
    <>
      <SectionTitle
        title={t('home.sections.topDestinations')}
        buttonText={t('home.actions.seeAll')}
        onButtonPress={onSeeAll}
        className="mt-8 mb-6 px-6"
      />

      {isLoading && (
        <Animated.View
          exiting={FadeOut.duration(300)}
          className="flex-row ml-[24px]"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <AppSkeleton
              key={index}
              width={158}
              height={220}
              radius={12}
              className="mr-3"
            />
          ))}
        </Animated.View>
      )}

      {error && (
        <SectionError
          title={t('home.errors.topDestinationsLoad')}
          onRetry={refetch}
          className="px-6"
        />
      )}

      {items && (
        <AnimatedFlashList
          entering={FadeIn.duration(300)}
          data={items}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={({ item }) => <DestinationCard {...item} />}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />
      )}
    </>
  );
}
