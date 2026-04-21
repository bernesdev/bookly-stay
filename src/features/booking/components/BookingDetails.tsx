import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import BuildingIcon from '@/assets/icons/building.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import GuestIcon from '@/assets/icons/guest.svg';
import { getGuestsLabel } from '@/src/features/booking/utils/booking.utils';
import { AppText } from '@/src/shared/components/AppText';
import { AccommodationSmallCard } from '@/src/shared/components/cards/AccommodationSmallCard';
import { Colors } from '@/src/shared/theme/colors';

import { Booking } from '../api/booking.types';

type BookingDetailsProps = {
  booking: Booking;
  className?: string;
};

export function BookingDetails({ booking, className }: BookingDetailsProps) {
  const { t } = useTranslation();

  return (
    <View className={className}>
      <AppText size={19} weight={'bold'} className="mb-5">
        {t('booking.bookingDetails.title', { orderId: booking.orderId })}
      </AppText>
      <AccommodationSmallCard {...booking.accommodation} readyOnly />
      <View className="w-full mt-5 p-4 bg-white rounded-2xl border border-gray-300">
        <AppText
          size={14}
          color={Colors.primary}
          weight="semibold"
          className="mb-6"
        >
          {t('booking.bookingDetails.sections.reservation')}
        </AppText>
        <View className="flex-row mb-4">
          <CalendarIcon width={18} height={18} stroke={Colors.gray[100]} />
          <AppText size={14} className="ml-3">
            {t('booking.bookingDetails.fields.checkIn')}
          </AppText>
          <AppText size={14} className="ml-auto">
            {booking.dates.checkInFormatted}
          </AppText>
        </View>
        <View className="flex-row mb-4">
          <CalendarIcon width={18} height={18} stroke={Colors.gray[100]} />
          <AppText size={14} className="ml-3">
            {t('booking.bookingDetails.fields.checkOut')}
          </AppText>
          <AppText size={14} className="ml-auto">
            {booking.dates.checkOutFormatted}
          </AppText>
        </View>
        <View className="flex-row mb-4">
          <BuildingIcon width={18} height={18} stroke={Colors.gray[100]} />
          <AppText size={14} className="ml-3">
            {t('booking.bookingDetails.fields.rooms')}
          </AppText>
          <AppText size={14} className="ml-auto">
            {booking.occupancy.rooms}
          </AppText>
        </View>
        <View className="flex-row">
          <GuestIcon width={18} height={18} stroke={Colors.gray[100]} />
          <AppText size={14} className="ml-3">
            {t('booking.bookingDetails.fields.guests')}
          </AppText>
          <AppText size={14} className="ml-auto">
            {getGuestsLabel(booking.occupancy, t)}
          </AppText>
        </View>
        <View className="w-full mt-8 mb-6 border-t border-dashed border-border" />
        <AppText
          size={14}
          color={Colors.primary}
          weight="semibold"
          className="mb-6"
        >
          {t('booking.bookingDetails.sections.price')}
        </AppText>
        <View className="flex-row">
          <AppText size={14}>
            {t('booking.bookingDetails.price.nightUnit', {
              count: booking.nights,
            })}
          </AppText>
          <AppText size={14} className="ml-auto">
            ${booking.price.oldTotalPrice ?? booking.price.currentTotalPrice}
          </AppText>
        </View>
        {booking.price.totalDiscount && (
          <View className="flex-row mt-4">
            <AppText size={14}>
              {t('booking.bookingDetails.price.discount')}
            </AppText>
            <AppText size={14} className="ml-auto" color={Colors.state.success}>
              -${booking.price.totalDiscount}
            </AppText>
          </View>
        )}
        <View className="flex-row mt-6">
          <AppText size={16} color={Colors.secondary} weight={'semibold'}>
            {t('booking.bookingDetails.price.total')}
          </AppText>
          <AppText
            size={18}
            color={Colors.secondary}
            weight={'semibold'}
            className="ml-auto"
          >
            ${booking.price.currentTotalPrice}
          </AppText>
        </View>
      </View>
    </View>
  );
}
