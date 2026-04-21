import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import VisaIcon from '@/assets/icons/brand-visa.svg';
import BuildingIcon from '@/assets/icons/building.svg';
import GuestIcon from '@/assets/icons/guest.svg';
import { useCreateBookingMutation } from '@/src/features/booking/api/booking.mutations';
import { AppScreen } from '@/src/shared/components/AppScreen';
import { AppText } from '@/src/shared/components/AppText';
import { OutlinedButton } from '@/src/shared/components/buttons/OutlinedButton';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { DateCard } from '@/src/shared/components/DateCard';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { useStayStore } from '@/src/shared/hooks/useStayStore';
import {
  selectCheckInLabel,
  selectCheckOutLabel,
  selectGuestsLabel,
  selectRoomsLabel,
} from '@/src/shared/selectors/stay.selectors';
import { Colors } from '@/src/shared/theme/colors';
import { errorMessages } from '@/src/shared/utils/messages.utils';

import { CheckoutLoadingSheet } from '../components/CheckoutLoadingSheet';
import { useCheckout } from '../hooks/useCheckout';

export function CheckoutScreen() {
  const { t } = useTranslation();

  const stayStore = useStayStore();

  const { showSheet } = useBottomSheet();

  const { mutateAsync: createBooking } = useCreateBookingMutation();

  const {
    totalDiscount,
    totalOldPrice,
    totalCurrentPrice,
    nights,
    accommodation,
    isLoading,
    error,
    refetch,
  } = useCheckout();

  return (
    <AppScreen
      preset="fixed"
      appBar={{ title: t('checkout.checkoutScreen.appBarTitle') }}
    >
      {isLoading && (
        <ActivityIndicator
          color={Colors.primary}
          size="small"
          className="mt-6"
        />
      )}

      {error && (
        <ErrorMessage
          title={t('checkout.checkoutScreen.errorTitle')}
          message={errorMessages.getDefaultError(error?.message)}
          onPress={refetch}
          className="mt-6"
        />
      )}

      {accommodation && (
        <View className="flex-1 px-6">
          <AppText size={16} weight={'semibold'} className="my-6">
            {t('checkout.checkoutScreen.sections.dates')}
          </AppText>
          <View className="flex-row items-center justify-between">
            <DateCard
              title={t('checkout.checkoutScreen.fields.checkIn')}
              date={selectCheckInLabel(stayStore)}
              className="mr-4 flex-1"
            />
            <DateCard
              title={t('checkout.checkoutScreen.fields.checkOut')}
              date={selectCheckOutLabel(stayStore)}
              className="ml-4 flex-1"
            />
          </View>

          <AppText size={16} weight={'semibold'} className="my-6">
            {t('checkout.checkoutScreen.sections.guestsAndRooms')}
          </AppText>
          <View className="flex-row items-center">
            <BuildingIcon
              width={18}
              height={18}
              className="mr-4"
              stroke={Colors.gray[100]}
            />
            <AppText size={14} className="flex-1 ml-3">
              {t('checkout.checkoutScreen.fields.rooms')}
            </AppText>
            <AppText size={14}>{selectRoomsLabel(stayStore)}</AppText>
          </View>
          <View className="flex-row items-center mt-3">
            <GuestIcon
              width={18}
              height={18}
              className="mr-4"
              stroke={Colors.gray[100]}
            />
            <AppText size={14} className="flex-1 ml-3">
              {t('checkout.checkoutScreen.fields.guests')}
            </AppText>
            <AppText size={14}>{selectGuestsLabel(stayStore)}</AppText>
          </View>

          <AppText size={16} weight={'semibold'} className="my-6">
            {t('checkout.checkoutScreen.sections.payment')}
          </AppText>
          <View className="flex-row items-center px-2 py-3 bg-white border border-gray-300 rounded-2xl">
            <View className="h-[40px] w-[40px] rounded-full bg-gray-400 items-center justify-center">
              <VisaIcon width={28} height={28} />
            </View>
            <View className="ml-4">
              <AppText size={12} weight={'medium'} className="flex-1">
                {t('checkout.checkoutScreen.fields.creditCard')}
              </AppText>
              <AppText size={14} weight={'medium'}>
                •••• •••• •••• 1234
              </AppText>
            </View>
            <OutlinedButton
              title={t('checkout.checkoutScreen.actions.edit')}
              onPress={() => {}}
              className="ml-auto"
            />
          </View>

          <AppText size={16} weight={'semibold'} className="my-6">
            {t('checkout.checkoutScreen.sections.details')}
          </AppText>
          <View className="flex-row items-center justify-between">
            <AppText size={14}>
              {t('checkout.checkoutScreen.details.nightUnit', {
                count: nights,
              })}
            </AppText>
            <AppText size={16}>${totalOldPrice}</AppText>
          </View>
          {totalDiscount && (
            <View className="flex-row items-center justify-between mt-3">
              <AppText size={14}>
                {t('checkout.checkoutScreen.details.discount')}
              </AppText>
              <AppText size={16} color={Colors.state.success}>
                -${totalDiscount}
              </AppText>
            </View>
          )}
          <View className="flex-row items-center justify-between border-t-[0.2px] border-gray-200 mt-6 pt-4">
            <AppText size={16} color={Colors.secondary} weight={'semibold'}>
              {t('checkout.checkoutScreen.details.total')}
            </AppText>
            <AppText size={20} color={Colors.secondary} weight={'semibold'}>
              ${totalCurrentPrice}
            </AppText>
          </View>
          <SolidButton
            title={t('checkout.checkoutScreen.actions.confirmBooking')}
            onPress={() => {
              showSheet(
                <CheckoutLoadingSheet
                  accommodation={accommodation}
                  stayStore={stayStore}
                  createBooking={createBooking}
                />,
                {
                  showHandleIndicator: false,
                  preventDismiss: true,
                },
              );
            }}
            className="mt-auto"
          />
        </View>
      )}
    </AppScreen>
  );
}
