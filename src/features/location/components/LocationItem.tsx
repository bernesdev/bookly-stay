import { Pressable, View } from 'react-native';

import ChevronRight from '@/assets/icons/chevron-right.svg';
import { AppText } from '@/src/shared/components/AppText';
import { Colors } from '@/src/shared/theme/colors';

import { useLocationStore } from '../hooks/useLocationStore';

import type { Location } from '../api/location.types';
import type { StayLocation } from '@/src/shared/types/stay.types';

type LocationItemProps = {
  location: Location;
  onSelect: (location: StayLocation) => void;
};

export function LocationItem({ location, onSelect }: LocationItemProps) {
  const saveSearch = useLocationStore((state) => state.saveSearchHistory);

  return (
    <Pressable
      className="flex-row items-center justify-center h-[50px] border-b border-border"
      onPress={() => {
        saveSearch(location);
        onSelect({
          id: location.id,
          city: location.city,
          country: location.country,
          lat: location.lat,
          lng: location.lng,
        });
      }}
    >
      <View className="flex-1 items-center flex-row">
        <AppText size={14} color={Colors.text} weight="semibold">
          {location.city},
        </AppText>
        <AppText size={14} color={Colors.gray[100]} weight="medium">
          &nbsp;{location.country}
        </AppText>
      </View>
      <ChevronRight width={18} height={18} stroke={Colors.text} />
    </Pressable>
  );
}
