import { useEffect, useMemo } from 'react';

import { useRouter } from 'expo-router';

import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ScrollHandlerProcessed,
} from 'react-native-reanimated';

import ReserveIcon from '@/assets/icons/reserve.svg';
import { AppText } from '@/src/shared/components/AppText';
import { OutlinedButton } from '@/src/shared/components/buttons/OutlinedButton';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { useUserStore } from '@/src/shared/hooks/useUserStore';
import { Colors } from '@/src/shared/theme/colors';
import { errorMessages } from '@/src/shared/utils/messages.utils';

import { useBookingsQuery } from '../api/booking.queries';
import { Booking, BookingStatus } from '../api/booking.types';

import { BookingCard } from './BookingCard';
import { BookingItemSkeleton } from './BookingItemSkeleton';

type BookingListProps = {
  status: BookingStatus;
  onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
  topBarHeight: number;
  listRef?: React.RefObject<FlashListRef<Booking> | null>;
};

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<Booking>);

export function BookingList({
  status,
  onScroll,
  topBarHeight,
  listRef,
}: BookingListProps) {
  const { t } = useTranslation();

  const router = useRouter();

  const { bottomSpacing } = useLayout();

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const userId = useUserStore((state) => state.id ?? '');

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
  } = useBookingsQuery({
    userId,
    status,
    limit: 10,
    enabled: isLoggedIn,
  });

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  useEffect(() => {
    if (listRef?.current) {
      listRef.current.scrollToTop({ animated: false });
    }
  }, [listRef, status]);

  const paddingTop = topBarHeight + 16;

  const statusLabel =
    status === BookingStatus.active
      ? t('booking.common.status.active')
      : t('booking.common.status.past');

  if (error) {
    return (
      <ErrorMessage
        title={t('booking.bookingList.errorTitle', { status: statusLabel })}
        message={errorMessages.getDefaultError(error?.message)}
        onPress={refetch}
        className={`mt-10 flex-1`}
      />
    );
  }

  if (isLoading) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        className="px-6"
        style={{ paddingTop }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <BookingItemSkeleton
            key={index}
            className={index !== 0 ? 'mt-4' : ''}
          />
        ))}
      </Animated.View>
    );
  }

  if (items.length === 0 || !isLoggedIn) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={{
          paddingTop,
          paddingHorizontal: 24,
          paddingBottom: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ReserveIcon width={30} height={30} stroke={Colors.text} />
        <AppText size={14} className="mt-3 mb-auto">
          {isLoggedIn
            ? t('booking.bookingList.empty.loggedIn', { status: statusLabel })
            : t('booking.bookingList.empty.loggedOut')}
        </AppText>
        {!isLoggedIn && (
          <OutlinedButton
            className="mt-8"
            title={t('booking.bookingList.actions.signIn')}
            onPress={() => {
              router.push('/auth');
            }}
          />
        )}
      </Animated.View>
    );
  }

  return (
    <AnimatedFlashList
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      ref={listRef}
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
        paddingBottom: bottomSpacing,
      }}
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListFooterComponent={() => {
        return isFetchingNextPage && hasNextPage ? (
          <BookingItemSkeleton className="mt-4" />
        ) : null;
      }}
      renderItem={({ item }) => <BookingCard {...item} />}
    />
  );
}
