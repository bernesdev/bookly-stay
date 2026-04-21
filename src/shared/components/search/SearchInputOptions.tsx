import { useState } from 'react';

import { View } from 'react-native';

import CalendarIcon from '@/assets/icons/calendar-blank.svg';
import SearchIcon from '@/assets/icons/search.svg';
import UserIcon from '@/assets/icons/user.svg';
import { LocationSheet } from '@/src/features/location/components/LocationSheet';
import { CalendarSheet, OccupancySheet } from '@/src/features/stay';
import i18n from '@/src/i18n';
import { RipplePressable } from '@/src/shared/components/animations/RipplePressable';
import { AppText } from '@/src/shared/components/AppText';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { useStayStore } from '@/src/shared/hooks/useStayStore';
import { Colors } from '@/src/shared/theme/colors';
import {
  StayData,
  StayDates,
  StayLocation,
  StayOccupancy,
} from '@/src/shared/types/stay.types';

import { SearchButton } from './SearchButton';

const selectLocationLabel = (
  selectedLocation?: StayLocation,
  geoLocation?: StayLocation,
) => {
  if (geoLocation && !selectedLocation) {
    return i18n.t('shared.searchInputOptions.aroundCurrentLocation');
  }

  if (selectedLocation) {
    return `${selectedLocation.city}, ${selectedLocation.country}`;
  }

  return i18n.t('shared.searchInputOptions.selectLocation');
};

const selectDatesLabel = (dates: StayDates) => {
  const { checkIn, checkOut } = dates;

  return `${checkIn.format('ddd, D MMM')} - ${checkOut.format('ddd, D MMM')}`;
};

export const selectOccupancyLabel = (occupancy: StayOccupancy) => {
  const { rooms, adults, children } = occupancy;

  const roomsLabel = i18n.t('shared.stay.roomUnit', { count: rooms });
  const adultsLabel = i18n.t('shared.stay.adultUnit', { count: adults });
  const childrenLabel =
    children > 0
      ? i18n.t('shared.stay.childUnit', { count: children })
      : i18n.t('shared.searchInputOptions.noChildren');

  return `${roomsLabel} · ${adultsLabel} · ${childrenLabel}`;
};

type SearchInputOptionsProps = {
  className?: string;
  onSubmit: (stay: StayData) => void;
};

export function SearchInputOptions({
  className,
  onSubmit,
}: SearchInputOptionsProps) {
  const geoLocation = useStayStore((state) => state.geoLocation);
  const setStay = useStayStore((state) => state.setStay);
  const stay = useStayStore((state) => state.stay);

  const { showSheet, hideSheet } = useBottomSheet();

  const [location, setLocation] = useState<StayLocation | undefined>(
    stay.location,
  );
  const [dates, setDates] = useState<StayDates>(stay.dates);
  const [occupancy, setOccupancy] = useState<StayOccupancy>(stay.occupancy);

  return (
    <View className={`w-full rounded-xl bg-white shadow-sm  ${className}`}>
      <RipplePressable
        className="border-b border-gray-300 items-center w-full flex-row px-4 h-[50px] rounded-tl-xl rounded-tr-xl"
        rippleOpacity={0.04}
        onPress={() =>
          showSheet(
            <LocationSheet
              onSelect={(selected) => {
                setLocation(selected);
                hideSheet();
              }}
            />,
            {
              showHandleIndicator: false,
              fullHeight: true,
              preventDismiss: true,
            },
          )
        }
      >
        <SearchIcon width={20} height={20} stroke={Colors.gray[100]} />
        <AppText className="ml-2" size={14} color={Colors.gray[100]}>
          {selectLocationLabel(location, geoLocation)}
        </AppText>
      </RipplePressable>

      <RipplePressable
        className="border-b border-gray-300 items-center w-full flex-row px-4 h-[50px]"
        rippleOpacity={0.04}
        onPress={() =>
          showSheet(<CalendarSheet initialDates={dates} onApply={setDates} />)
        }
      >
        <CalendarIcon width={20} height={20} stroke={Colors.gray[100]} />
        <AppText className="ml-2" size={14} color={Colors.gray[100]}>
          {selectDatesLabel(dates)}
        </AppText>
      </RipplePressable>

      <RipplePressable
        className="items-center w-full flex-row px-4 h-[50px]"
        rippleOpacity={0.04}
        onPress={() =>
          showSheet(
            <OccupancySheet
              initialOccupancy={occupancy}
              onApply={setOccupancy}
            />,
          )
        }
      >
        <UserIcon width={20} height={20} stroke={Colors.gray[100]} />
        <AppText className="ml-2" size={14} color={Colors.gray[100]}>
          {selectOccupancyLabel(occupancy)}
        </AppText>
      </RipplePressable>
      <SearchButton
        onPress={() => {
          const activeLocation = location || geoLocation;

          if (!activeLocation) return;

          const stay = { location: activeLocation, dates, occupancy };
          setStay(stay);

          onSubmit(stay);
        }}
      />
    </View>
  );
}
