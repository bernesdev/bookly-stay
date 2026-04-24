import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { StyleSheet, View } from 'react-native';

import { useStayStore } from '@/src/shared/hooks/useStayStore';
import { Colors } from '@/src/shared/theme/colors';

import { BouncyPressable } from '../animations/BouncyPressable';
import { AppImage } from '../AppImage';
import { AppText } from '../AppText';

type DestinationCardProps = {
  id: string;
  image: string;
  city: string;
  country: string;
  className?: string;
};

export function DestinationCard({
  id,
  image,
  city,
  country,
  className,
}: DestinationCardProps) {
  const router = useRouter();
  const setStay = useStayStore((state) => state.setStay);

  return (
    <BouncyPressable
      className={`w-[158px] h-[220px] rounded-xl overflow-hidden ${className}`}
      activeScale={0.98}
      onPress={() => {
        setStay({ location: { id, city, country } });
        router.push('/catalog');
      }}
    >
      <AppImage
        source={{ uri: image }}
        className="w-full h-full"
        showSkeleton
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />
      <View className="absolute w-full h-full px-3 pb-4 justify-end">
        <AppText size={16} color={Colors.white} weight="semibold">
          {city}
        </AppText>
        <AppText
          className="mt-2"
          size={12}
          color={Colors.white}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {country}
        </AppText>
      </View>
    </BouncyPressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
