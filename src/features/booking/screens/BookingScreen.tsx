import { useRef, useState } from 'react';

import { FlashListRef } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppScreen } from '@/src/shared/components/AppScreen';

import { Booking, BookingStatus } from '../api/booking.types';
import { BookingList } from '../components/BookingList';
import { BookingStatusSwitch } from '../components/BookingStatusSwitch';

export function BookingScreen() {
  const { t } = useTranslation();

  const bookingListRef = useRef<FlashListRef<Booking>>(null);
  const [status, setStatus] = useState<BookingStatus>(BookingStatus.active);

  return (
    <AppScreen
      preset="list"
      appBar={{
        title: t('booking.bookingScreen.appBarTitle'),
        showLeading: false,
        FooterComponent: (
          <View className="px-6 mt-3 mb-2 w-full">
            <BookingStatusSwitch status={status} onChange={setStatus} />
          </View>
        ),
        footerHeight: 64,
        collapsableFooter: true,
      }}
    >
      {({ onScroll, topBarHeight }) => (
        <BookingList
          status={status}
          onScroll={onScroll}
          topBarHeight={topBarHeight}
          listRef={bookingListRef}
        />
      )}
    </AppScreen>
  );
}
