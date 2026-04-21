import { useEffect, useState } from 'react';

import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ScrollHandlerProcessed,
  SharedValue,
} from 'react-native-reanimated';

import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';
import { AccommodationLargeCard } from '@/src/shared/components/cards/AccommodationLargeCard';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { errorMessages } from '@/src/shared/utils/messages.utils';

import { useCatalog } from '../hooks/useCatalog';
import { useCatalogStore } from '../hooks/useCatalogStore';

import { CatalogItemSkeleton } from './CatalogItemSkeleton';

type CatalogListProps = {
  onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
  topBarHeight: number;
  scrollY?: SharedValue<number>;
  ref?: React.RefObject<FlashListRef<Accommodation> | null>;
};

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<Accommodation>,
);

export function CatalogList({
  onScroll,
  topBarHeight,
  scrollY,
  ref,
}: CatalogListProps) {
  const { t } = useTranslation();

  const { bottomOffset } = useLayout();

  const {
    items,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
  } = useCatalog();

  const newSearch = useCatalogStore((state) => state.newSearch);
  const sortOption = useCatalogStore((state) => state.sortOption);

  const [isSortingDelay, setIsSortingDelay] = useState(false);

  useEffect(() => {
    setIsSortingDelay(true);

    if (scrollY) {
      scrollY.value = 0;
    }

    const timeout = setTimeout(() => setIsSortingDelay(false), 500);

    return () => clearTimeout(timeout);
  }, [sortOption, newSearch, scrollY]);

  const paddingTop = topBarHeight + 24;

  if (error && !isLoading) {
    return (
      <ErrorMessage
        title={t('catalog.errors.loadAccommodations')}
        message={errorMessages.getDefaultError(error?.message)}
        onPress={refetch}
        className="mt-44"
      />
    );
  }

  if (isLoading || isSortingDelay) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        className="px-6"
        style={{ paddingTop }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <CatalogItemSkeleton
            key={index}
            className={index !== 0 ? 'mt-8' : ''}
          />
        ))}
      </Animated.View>
    );
  }

  return (
    <AnimatedFlashList
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      ref={ref}
      data={items}
      onScroll={onScroll}
      scrollEventThrottle={16}
      keyExtractor={(item) => item.id}
      onEndReached={() => fetchNextPage()}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop,
        paddingBottom: bottomOffset,
      }}
      ItemSeparatorComponent={() => <View className="h-8" />}
      ListFooterComponent={() => {
        return isFetchingNextPage && hasNextPage ? (
          <CatalogItemSkeleton className="mt-8" />
        ) : null;
      }}
      renderItem={({ item }) => <AccommodationLargeCard {...item} />}
    />
  );
}
