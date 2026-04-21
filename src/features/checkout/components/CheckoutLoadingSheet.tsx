import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'expo-router';

import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import CheckIcon from '@/assets/icons/check.svg';
import ErrorIcon from '@/assets/icons/x.svg';
import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';
import { toCreateBookingDto } from '@/src/features/booking/api/booking.mapper';
import {
  Booking,
  CreateBookingDto,
} from '@/src/features/booking/api/booking.types';
import { AppText } from '@/src/shared/components/AppText';
import { OutlinedButton } from '@/src/shared/components/buttons/OutlinedButton';
import { TextButton } from '@/src/shared/components/buttons/TextButton';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { StayStore } from '@/src/shared/store/stay.store';
import { Colors } from '@/src/shared/theme/colors';

const LOADING_DURATION = 3000;
const STATUS_IN_DURATION = 500;
const STATUS_OUT_DURATION = 300;
const DELAY_BEFORE_NAVIGATE = 1500;

type CheckoutLoadingSheetProps = {
  accommodation: Accommodation;
  stayStore: StayStore;
  createBooking: UseMutateAsyncFunction<
    Booking,
    Error,
    CreateBookingDto,
    unknown
  >;
};

export function CheckoutLoadingSheet({
  accommodation,
  stayStore,
  createBooking,
}: CheckoutLoadingSheetProps) {
  const { t } = useTranslation();

  const savedBookingId = useRef<string | null>(null);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState(
    t('checkout.checkoutLoadingSheet.defaultErrorMessage'),
  );

  const router = useRouter();

  const [attempt, setAttempt] = useState(0);

  const isMounted = useRef(false);
  const navigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { hideSheet } = useBottomSheet();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  const fadeOutStyle = useAnimatedStyle(() => ({ opacity: 1 - opacity.value }));
  const fadeInStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const bouncyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    isMounted.current = true;

    setStatus('loading');

    const minimumLoadingPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, LOADING_DURATION);
    });

    const run = async () => {
      try {
        const booking = await createBooking(
          toCreateBookingDto(accommodation, stayStore),
        );
        savedBookingId.current = booking.id;
        await minimumLoadingPromise;
        setStatus('success');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : t('checkout.checkoutLoadingSheet.defaultErrorMessage'),
        );
        setStatus('error');
      }
    };

    run();

    return () => {
      isMounted.current = false;
    };
  }, [accommodation, attempt, createBooking, stayStore, t]);

  useEffect(() => {
    cancelAnimation(opacity);
    cancelAnimation(scale);

    if (status === 'loading') {
      opacity.value = 0;
      scale.value = 1;
      return;
    }

    const navigate = () => {
      if (!isMounted.current) return;
      navigateTimeoutRef.current = setTimeout(() => {
        hideSheet();
        router.dismissAll();
        router.push({
          pathname: '/confirmation',
          params: { id: savedBookingId.current },
        });
      }, DELAY_BEFORE_NAVIGATE);
    };

    opacity.value = withTiming(1, { duration: STATUS_IN_DURATION });

    scale.value = withSequence(
      withTiming(1.3, { duration: STATUS_IN_DURATION }),
      withTiming(1, { duration: STATUS_OUT_DURATION }, (finished) => {
        if (finished && status === 'success') {
          scheduleOnRN(navigate);
        }
      }),
    );

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(scale);
      if (navigateTimeoutRef.current) {
        clearTimeout(navigateTimeoutRef.current);
        navigateTimeoutRef.current = null;
      }
    };
  }, [hideSheet, opacity, router, scale, status]);

  return (
    <View className="px-6 pt-4 pb-4">
      <View className="flex-1 flex-row items-center justify-between">
        <View>
          {status === 'loading' && (
            <Animated.View exiting={FadeOut.duration(300)}>
              <AppText size={24} weight="bold" className="mb-6">
                {t('checkout.checkoutLoadingSheet.loading.title')}
              </AppText>
              <AppText size={14} color={Colors.gray[100]}>
                {t('checkout.checkoutLoadingSheet.loading.description')}
              </AppText>
            </Animated.View>
          )}

          {status !== 'loading' && (
            <Animated.View entering={FadeIn.duration(500)}>
              <AppText size={24} weight="bold" className="mb-6">
                {status === 'success'
                  ? t('checkout.checkoutLoadingSheet.success.title')
                  : t('checkout.checkoutLoadingSheet.error.title')}
              </AppText>
              <AppText size={14} color={Colors.gray[100]}>
                {status === 'success'
                  ? t('checkout.checkoutLoadingSheet.success.description')
                  : t('checkout.checkoutLoadingSheet.error.description')}
              </AppText>
            </Animated.View>
          )}
        </View>

        <View className="w-[40px] h-[40px] bg-gray-300 rounded-full items-center justify-center">
          <Animated.View
            className="rounded-full"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor:
                  status === 'success'
                    ? Colors.state.success
                    : Colors.state.error,
              },
              fadeInStyle,
              bouncyStyle,
            ]}
          />
          <Animated.View style={[{ opacity: 1 }, fadeOutStyle]}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </Animated.View>
          <Animated.View
            style={[
              {
                position: 'absolute',
                opacity: 0,
              },
              fadeInStyle,
              bouncyStyle,
            ]}
          >
            {status === 'success' ? (
              <CheckIcon width={24} height={24} stroke={Colors.white} />
            ) : (
              <ErrorIcon width={24} height={24} stroke={Colors.white} />
            )}
          </Animated.View>
        </View>
      </View>

      {status === 'error' && (
        <Animated.View
          className="p-3 bg-white border border-gray-300 rounded-xl mt-8"
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(300)}
        >
          <AppText size={12} color={Colors.gray[100]}>
            {errorMessage}
          </AppText>
        </Animated.View>
      )}

      {status === 'error' && (
        <Animated.View
          className="flex-row mt-8 items-center self-start"
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(300)}
        >
          <OutlinedButton
            title={t('checkout.checkoutLoadingSheet.actions.tryAgain')}
            onPress={() => setAttempt((prev) => prev + 1)}
          />
          <TextButton
            color={Colors.gray[100]}
            className="ml-5"
            onPress={hideSheet}
          >
            {t('checkout.checkoutLoadingSheet.actions.cancel')}
          </TextButton>
        </Animated.View>
      )}
    </View>
  );
}
