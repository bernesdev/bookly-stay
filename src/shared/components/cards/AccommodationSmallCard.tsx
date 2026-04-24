import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import LocationIcon from '@/assets/icons/location.svg';
import StarIcon from '@/assets/icons/star.svg';
import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';
import { Colors } from '@/src/shared/theme/colors';

import { BouncyPressable } from '../animations/BouncyPressable';
import { AppImage } from '../AppImage';
import { AppText } from '../AppText';

type AccommodationSmallCardProps = Accommodation & {
  className?: string;
  readyOnly?: boolean;
};

export function AccommodationSmallCard({
  id,
  image,
  name: title,
  location,
  price,
  rating,
  readyOnly = false,
}: AccommodationSmallCardProps) {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <BouncyPressable
      className="flex-row items-start h-[80px]"
      activeScale={0.98}
      disabled={readyOnly}
      onPress={() => {
        return router.push({
          pathname: '/accommodation',
          params: { id, title, image },
        });
      }}
    >
      <AppImage
        source={{ uri: image }}
        className="w-[80px] h-[80px] mr-3 rounded-lg"
        showSkeleton
      />
      <View className="flex-1 min-w-0 py-1 h-full justify-between">
        <AppText
          className="flex-shrink"
          size={14}
          color={Colors.text}
          weight="semibold"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </AppText>
        <View className="flex-row items-center min-w-0">
          <LocationIcon width={14} height={14} stroke={Colors.gray[100]} />
          <AppText
            className="ml-1 flex-1"
            size={12}
            color={Colors.gray[100]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location.city}, {location.country}
          </AppText>
        </View>
        <View className="flex-row">
          <AppText size={16} color={Colors.secondary} weight="semibold">
            ${price.currentPrice}
          </AppText>
          <AppText className="ml-1" size={14} color={Colors.text}>
            {t('shared.accommodationSmallCard.perNight')}
          </AppText>
        </View>
      </View>
      <View className="flex-row items-center py-1 shrink-0 ml-2">
        <StarIcon width={16} height={16} fill={Colors.accent[200]} />
        <AppText
          className="ml-1"
          size={12}
          color={Colors.text}
          weight="semibold"
        >
          {rating}
        </AppText>
      </View>
    </BouncyPressable>
  );
}
