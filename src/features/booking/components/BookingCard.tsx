import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

import CalendarIcon from '@/assets/icons/calendar.svg';
import LocationIcon from '@/assets/icons/location.svg';
import { Booking } from '@/src/features/booking/api/booking.types';
import { BouncyPressable } from '@/src/shared/components/animations/BouncyPressable';
import { AppText } from '@/src/shared/components/AppText';
import { Colors } from '@/src/shared/theme/colors';

type BookingCardProps = Booking & {
  className?: string;
};

export function BookingCard({
  id,
  accommodation,
  dates,
  price,
  nights,
  className,
}: BookingCardProps) {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <BouncyPressable
      className={`w-full border border-gray-300 bg-white rounded-2xl p-3 ${className}`}
      activeScale={0.98}
      onPress={() =>
        router.push({
          pathname: '/booking',
          params: { id },
        })
      }
    >
      <View className="flex-row gap-3">
        <Image
          source={{ uri: accommodation.image }}
          className="w-[100px] h-full rounded-lg"
        />
        <View className="flex-1 min-w-0 gap-2 py-1">
          <AppText
            className="flex-shrink"
            size={16}
            weight="semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {accommodation.name}
          </AppText>
          <View className="flex-row gap-1 items-center min-w-0">
            <LocationIcon stroke={Colors.gray[100]} width={14} height={14} />
            <AppText
              className="flex-1"
              size={12}
              color={Colors.gray[100]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {accommodation.location.city}, {accommodation.location.country}
            </AppText>
          </View>
          <View className="flex-row gap-1">
            <AppText size={16} color={Colors.secondary} weight="semibold">
              ${price.currentTotalPrice}
            </AppText>
            <AppText size={14}>
              &nbsp;/{t('booking.bookingCard.nightUnit', { count: nights })}
            </AppText>
          </View>
        </View>
      </View>
      <View className="border-t border-gray-300 my-4" />
      <View className="flex-row gap-2 items-center">
        <CalendarIcon stroke={Colors.gray[100]} width={18} height={18} />
        <AppText size={14}>{t('booking.bookingCard.checkIn')}</AppText>
        <AppText size={14} className="ml-auto">
          {dates.checkInFormatted}
        </AppText>
      </View>
      <View className="flex-row gap-2 mt-4 items-center">
        <CalendarIcon stroke={Colors.gray[100]} width={18} height={18} />
        <AppText size={14}>{t('booking.bookingCard.checkOut')}</AppText>
        <AppText size={14} className="ml-auto">
          {dates.checkOutFormatted}
        </AppText>
      </View>
    </BouncyPressable>
  );
}
