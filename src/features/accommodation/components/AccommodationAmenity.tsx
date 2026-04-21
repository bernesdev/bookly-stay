import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { AppText } from '@/src/shared/components/AppText';
import { Colors } from '@/src/shared/theme/colors';

type AccommodationAmenityProps = {
  name: string;
  icon: string;
};

export function AccommodationAmenity({
  name,
  icon,
}: AccommodationAmenityProps) {
  return (
    <View className="items-center w-[65px]">
      <View className="w-[50px] h-[50px] rounded-full bg-secondary items-center justify-center">
        <SvgXml xml={icon} width={22} height={22} stroke={Colors.white} />
      </View>
      <AppText
        size={12}
        weight="medium"
        color={Colors.gray[100]}
        className="mt-2 text-center"
      >
        {name}
      </AppText>
    </View>
  );
}
