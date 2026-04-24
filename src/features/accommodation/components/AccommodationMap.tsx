import { useEffect, useState } from 'react';

import { AppleMaps, GoogleMaps } from 'expo-maps';

import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import LocationIcon from '@/assets/icons/location.svg';
import { AnimatedLoadingDots } from '@/src/shared/components/animations/AnimatedLoadingDots';
import { AppSkeleton } from '@/src/shared/components/AppSkeleton';
import { AppText } from '@/src/shared/components/AppText';
import { Colors } from '@/src/shared/theme/colors';

type AccommodationMapProps = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  addressNumber: string;
  addressStreet: string;
};

export function AccommodationMap({
  id,
  name,
  latitude,
  longitude,
  addressNumber,
  addressStreet,
}: AccommodationMapProps) {
  const { t } = useTranslation();
  const [isMapLoading, setIsMapLoading] = useState(Platform.OS === 'android');

  useEffect(() => {
    setIsMapLoading(Platform.OS === 'android');
  }, [id]);

  return (
    <View className="bg-white px-1 pt-1 pb-3 rounded-xl mt-6">
      <View className="h-[160px] w-full rounded-xl overflow-hidden">
        {Platform.OS === 'android' && (
          <GoogleMaps.View
            onMapLoaded={() => setIsMapLoading(false)}
            style={{ width: '100%', height: '100%' }}
            cameraPosition={{
              coordinates: {
                latitude,
                longitude,
              },
              zoom: 15,
            }}
            markers={[
              {
                coordinates: {
                  latitude,
                  longitude,
                },
                title: name,
              },
            ]}
          />
        )}
        {Platform.OS === 'ios' && (
          <AppleMaps.View
            style={{ width: '100%', height: '100%' }}
            cameraPosition={{
              coordinates: {
                latitude,
                longitude,
              },
              zoom: 15,
            }}
            markers={[
              {
                coordinates: {
                  latitude,
                  longitude,
                },
                title: name,
              },
            ]}
          />
        )}
        {isMapLoading && (
          <Animated.View
            exiting={FadeOut.duration(300)}
            testID="accommodation-map-loading"
            className="absolute inset-0 items-center justify-center"
          >
            <View className="absolute inset-0">
              <AppSkeleton width="100%" height="100%" radius={10} />
            </View>
            <View className="flex-row items-center gap-1">
              <AppText size={12} color={Colors.gray[100]}>
                {t('accommodation.map.loading')}
              </AppText>
              <AnimatedLoadingDots color={Colors.gray[100]} size={12} />
            </View>
          </Animated.View>
        )}
      </View>
      <View className="flex-row items-center mt-3">
        <LocationIcon width={16} height={16} stroke={Colors.gray[100]} />
        <AppText size={14} color={Colors.gray[100]} className="ml-1">
          {`${addressNumber} ${addressStreet}`}
        </AppText>
      </View>
    </View>
  );
}
