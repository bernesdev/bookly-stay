import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import CloseIcon from '@/assets/icons/x.svg';
import { useBookingQuery } from '@/src/features/booking/api/booking.queries';
import { BookingDetails } from '@/src/features/booking/components/BookingDetails';
import { AppScreen } from '@/src/shared/components/AppScreen';
import { AppText } from '@/src/shared/components/AppText';
import { IconButton } from '@/src/shared/components/buttons/IconButton';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { Colors } from '@/src/shared/theme/colors';
import { errorMessages } from '@/src/shared/utils/messages.utils';

export function ConfirmationScreen() {
  const { t } = useTranslation();

  const router = useRouter();

  const { bottomOffset } = useLayout();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: booking, isLoading, error } = useBookingQuery(id);

  return (
    <AppScreen
      appBar={{
        showLeading: false,
        showLogo: true,
        ActionButtonComponent: isLoading ? null : (
          <IconButton Icon={CloseIcon} onPress={() => router.back()} />
        ),
      }}
    >
      {isLoading && (
        <ActivityIndicator
          color={Colors.primary}
          size="small"
          className="pt-6"
        />
      )}

      {error && (
        <ErrorMessage
          title={t('checkout.confirmationScreen.errorTitle')}
          message={errorMessages.getBookingConfirmationError(error?.message)}
          onPress={() => router.replace('/bookings')}
          buttonTitle={t('checkout.confirmationScreen.errorButton')}
          className="pt-6"
        />
      )}

      {booking && (
        <View
          className="px-6 pt-6 flex-1"
          style={{ paddingBottom: bottomOffset }}
        >
          <AppText size={14} className="mb-8">
            {t('checkout.confirmationScreen.thanks')}
          </AppText>
          <BookingDetails booking={booking} />
          <View className="mt-auto">
            <SolidButton
              title={t('checkout.confirmationScreen.actions.checkReservation')}
              onPress={() => router.replace(`/bookings`)}
              className="w-full mt-4"
            />
          </View>
        </View>
      )}
    </AppScreen>
  );
}
