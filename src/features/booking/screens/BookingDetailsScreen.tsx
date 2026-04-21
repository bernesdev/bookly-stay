import { useLocalSearchParams } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import { AppScreen } from '@/src/shared/components/AppScreen';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { Colors } from '@/src/shared/theme/colors';
import { errorMessages } from '@/src/shared/utils/messages.utils';

import { useBookingQuery } from '../api/booking.queries';
import { BookingDetails } from '../components/BookingDetails';

export function BookingDetailsScreen() {
  const { t } = useTranslation();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: booking, isLoading, error, refetch } = useBookingQuery(id);

  return (
    <AppScreen
      appBar={{
        title: t('booking.bookingDetailsScreen.appBarTitle'),
      }}
    >
      <View className="px-6 pt-6 pb-10">
        {isLoading && <ActivityIndicator color={Colors.primary} size="small" />}

        {error && (
          <ErrorMessage
            title={t('booking.bookingDetailsScreen.errorTitle')}
            message={errorMessages.getDefaultError(error?.message)}
            onPress={refetch}
            className="px-0"
          />
        )}

        {booking && <BookingDetails booking={booking} />}
      </View>
    </AppScreen>
  );
}
