import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';
import { UnauthenticatedSheet } from '@/src/features/auth/components/UnauthenticatedSheet';
import { AppText } from '@/src/shared/components/AppText';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { useStayStore } from '@/src/shared/hooks/useStayStore';
import { useUserStore } from '@/src/shared/hooks/useUserStore';
import { selectNights } from '@/src/shared/selectors/stay.selectors';
import { Colors } from '@/src/shared/theme/colors';

type AccommodationBookingSheetProps = {
  accommodation: Accommodation;
};

export function AccommodationBookingSheet({
  accommodation,
}: AccommodationBookingSheetProps) {
  const { t } = useTranslation();

  const { bottomInset } = useLayout();

  const router = useRouter();

  const nights = useStayStore(selectNights);

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const { showSheet } = useBottomSheet();

  const totalPrice = accommodation.price.currentPrice * nights;

  return (
    <Animated.View
      entering={SlideInDown.duration(400)}
      className="bg-white flex-row justify-between absolute bottom-0 left-0 right-0 pt-6 px-6 items-center"
      style={{
        ...styles.container,
        paddingBottom: bottomInset + 16,
      }}
    >
      <View className="h-[100%] justify-between">
        <AppText size={12} color={Colors.gray[200]} weight="medium">
          {t('accommodation.bookingSheet.totalPrice')}
        </AppText>
        <AppText size={22} weight="bold" color={Colors.secondary}>
          ${totalPrice}
        </AppText>
      </View>
      <View className="w-[160px]">
        <SolidButton
          title={t('accommodation.bookingSheet.bookNow')}
          onPress={() => {
            if (!isLoggedIn) {
              showSheet(
                <UnauthenticatedSheet
                  title={t('accommodation.bookingSheet.unauthenticatedTitle')}
                />,
                {
                  showHandleIndicator: false,
                },
              );
              return;
            }

            return router.push({
              pathname: '/checkout',
              params: { id: accommodation.id },
            });
          }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 5,
  },
});
