import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppText } from '@/src/shared/components/AppText';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { StayOccupancy } from '@/src/shared/types/stay.types';

import { QuantitySelector } from './QuantitySelector';

type OccupancySheetProps = {
  initialOccupancy: StayOccupancy;
  onApply: (occupancy: StayOccupancy) => void;
};

export function OccupancySheet({
  initialOccupancy,
  onApply,
}: OccupancySheetProps) {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState(initialOccupancy.rooms);
  const [adults, setAdults] = useState(initialOccupancy.adults);
  const [children, setChildren] = useState(initialOccupancy.children);

  const { hideSheet } = useBottomSheet();

  return (
    <View className="px-6">
      <AppText size={16} weight="semibold" className="text-center mb-12">
        {t('stay.occupancySheet.title')}
      </AppText>
      <View className="flex-row justify-between items-center mb-6">
        <AppText size={14} weight="medium">
          {t('stay.occupancySheet.rooms')}
        </AppText>
        <QuantitySelector min={1} value={rooms} onChange={setRooms} />
      </View>
      <View className="flex-row justify-between items-center mb-6">
        <AppText size={14} weight="medium">
          {t('stay.occupancySheet.adults')}
        </AppText>
        <QuantitySelector min={1} value={adults} onChange={setAdults} />
      </View>
      <View className="flex-row justify-between items-center mb-10">
        <AppText size={14} weight="medium">
          {t('stay.occupancySheet.children')}
        </AppText>
        <QuantitySelector min={0} value={children} onChange={setChildren} />
      </View>
      <SolidButton
        title={t('stay.actions.apply')}
        onPress={() => {
          onApply({ rooms, adults, children });
          hideSheet();
        }}
      />
    </View>
  );
}
