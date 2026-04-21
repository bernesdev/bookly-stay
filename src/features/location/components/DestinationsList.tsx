import { useMemo } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ScrollHandlerProcessed,
} from 'react-native-reanimated';

import { useTopDestinationsQuery } from '@/src/features/location/api/location.queries';
import { Destination } from '@/src/features/location/api/location.types';
import { DestinationCard } from '@/src/shared/components/cards/DestinationCard';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { errorMessages } from '@/src/shared/utils/messages.utils';

import { DestinationSkeleton } from './DestinationSkeleton';

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<Destination>,
);

type DestinationsListProps = {
  topBarHeight: number;
  onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
};

export function DestinationsList({
  topBarHeight,
  onScroll,
}: DestinationsListProps) {
  const { t } = useTranslation();

  const { bottomOffset } = useLayout();

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
  } = useTopDestinationsQuery({
    limit: 8,
  });

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const topBarOffset = topBarHeight + 24;

  if (error && !isLoading) {
    return (
      <ErrorMessage
        title={t('location.destinationsList.loadErrorTitle')}
        message={errorMessages.getDefaultError(error?.message)}
        onPress={refetch}
        className="mt-24"
      />
    );
  }

  if (isLoading) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={{ paddingTop: topBarOffset }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <DestinationSkeleton key={index} />
        ))}
      </Animated.View>
    );
  }

  return (
    <AnimatedFlashList
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      data={items}
      scrollEventThrottle={16}
      onScroll={onScroll}
      numColumns={2}
      keyExtractor={(item) => item.id}
      onEndReached={() => fetchNextPage()}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingTop: topBarOffset,
        paddingBottom: bottomOffset,
      }}
      ItemSeparatorComponent={() => <View className="h-2" />}
      ListFooterComponent={() => {
        return isFetchingNextPage && hasNextPage ? (
          <DestinationSkeleton className="mt-2" />
        ) : null;
      }}
      renderItem={({ item, index }) => {
        const isLeftColumn = index % 2 === 0;

        return (
          <View
            style={{
              flex: 1,
              paddingRight: isLeftColumn ? 4 : 0,
              paddingLeft: isLeftColumn ? 0 : 4,
            }}
          >
            <DestinationCard {...item} className="w-full" />
          </View>
        );
      }}
    />
  );
}
