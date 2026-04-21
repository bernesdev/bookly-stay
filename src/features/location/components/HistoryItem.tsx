import { View } from 'react-native';

import ClockIcon from '@/assets/icons/clock.svg';
import { BouncyPressable } from '@/src/shared/components/animations/BouncyPressable';
import { AppText } from '@/src/shared/components/AppText';
import { Colors } from '@/src/shared/theme/colors';

import { Location } from '../api/location.types';
import { useLocationStore } from '../hooks/useLocationStore';

import type { StayLocation } from '@/src/shared/types/stay.types';

type HistoryItemProps = {
  location: Location;
  onSelect: (location: StayLocation) => void;
};

export function HistoryItem({ location, onSelect }: HistoryItemProps) {
  const saveSearch = useLocationStore((state) => state.saveSearchHistory);

  return (
    <BouncyPressable
      className="flex-row items-center justify-center h-[40px]"
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
      activeScale={0.98}
    >
      <ClockIcon width={18} height={18} stroke={Colors.gray[200]} />
      <View className="flex-1 items-center flex-row ml-3">
        <AppText size={14} color={Colors.text} weight="semibold">
          {location.city},
        </AppText>
        <AppText size={14} color={Colors.gray[100]} weight="medium">
          &nbsp;{location.country}
        </AppText>
      </View>
    </BouncyPressable>
  );
}
