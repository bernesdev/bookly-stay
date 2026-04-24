import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import BedIcon from '@/assets/icons/bed.svg';
import LocationIcon from '@/assets/icons/location.svg';
import StarIcon from '@/assets/icons/star.svg';
import BathIcon from '@/assets/icons/tub.svg';
import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';
import { Colors } from '@/src/shared/theme/colors';
import { withOpacity } from '@/src/shared/utils/colors.utils';

import { BouncyPressable } from '../animations/BouncyPressable';
import { AppImage } from '../AppImage';
import { AppText } from '../AppText';

type AccommodationLargeCardProps = Accommodation & {
  className?: string;
};

export function AccommodationLargeCard({
  id,
  image,
  name: title,
  location,
  details,
  rating,
  price,
  className,
}: AccommodationLargeCardProps) {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <BouncyPressable
      className={`w-full ${className}`}
      activeScale={0.98}
      onPress={() =>
        router.push({
          pathname: '/accommodation',
          params: { id, title, image },
        })
      }
    >
      <AppImage
        source={{ uri: image }}
        className="w-full h-[170px] rounded-lg"
        showSkeleton
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />
      <BlurView
        intensity={20}
        tint="light"
        className="absolute top-[10px] left-[12px] rounded-full h-[24px] px-2 flex-row items-center overflow-hidden"
        style={{ backgroundColor: withOpacity(Colors.white, 0.12) }}
      >
        <StarIcon width={16} height={16} fill={Colors.accent[200]} />
        <AppText
          color={Colors.white}
          size={12}
          weight="medium"
          className="ml-1"
        >
          {rating}
        </AppText>
      </BlurView>
      {details.hasBreakfast && (
        <BlurView
          intensity={20}
          tint="light"
          className="absolute top-[10px] right-[12px] rounded-full h-[24px] px-2 flex-row items-center overflow-hidden"
          style={{ backgroundColor: withOpacity(Colors.white, 0.12) }}
        >
          <AppText
            color={Colors.white}
            size={12}
            weight="medium"
            className="ml-1"
          >
            {t('shared.accommodationLargeCard.breakfastIncluded')}
          </AppText>
        </BlurView>
      )}
      <View className="flex-row items-center justify-between mt-3">
        <View>
          <AppText size={16} weight="bold">
            {title}
          </AppText>
          <View className="flex-row items-center mt-2">
            <LocationIcon width={14} height={14} stroke={Colors.gray[100]} />
            <AppText className="ml-1" size={12} color={Colors.gray[100]}>
              {location.city}
            </AppText>
            <AppText size={12} className="mx-1">
              ·
            </AppText>
            <AppText size={12} color={Colors.gray[100]}>
              {location.distanceToCenter === 0
                ? t('shared.accommodationLargeCard.inCityCenter')
                : t('shared.accommodationLargeCard.distanceFromCenter', {
                    distance: location.distanceToCenter,
                  })}
            </AppText>
          </View>
          <View className="flex-row items-center mt-2">
            <BedIcon width={14} height={14} stroke={Colors.text} />
            <AppText className="ml-2" size={14}>
              {t('shared.accommodationLargeCard.bedUnit', {
                count: details.beds,
              })}
            </AppText>
            <AppText size={14} className="mx-2">
              ·
            </AppText>
            <BathIcon width={14} height={14} stroke={Colors.text} />
            <AppText className="ml-2" size={14}>
              {t('shared.accommodationLargeCard.bathroomUnit', {
                count: details.bathrooms,
              })}
            </AppText>
          </View>
        </View>
        <View className="h-full items-end">
          {price.oldPrice && (
            <AppText
              size={14}
              color={Colors.gray[100]}
              className="line-through"
            >
              ${price.oldPrice}
            </AppText>
          )}
          <AppText
            size={20}
            color={Colors.secondary}
            weight="semibold"
            className="mt-1"
          >
            ${price.currentPrice}
          </AppText>
          <AppText size={12} color={Colors.gray[200]} className="mt-2">
            {t('shared.accommodationLargeCard.perNight')}
          </AppText>
        </View>
      </View>
    </BouncyPressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 170,
    borderRadius: 8,
  },
});
