import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import CenterIcon from '@/assets/icons/center.svg';
import ChartDownIcon from '@/assets/icons/chart-down.svg';
import ChartUpIcon from '@/assets/icons/chart-up.svg';
import { AccommodationSortOption } from '@/src/features/accommodation/api/accommodation.types';
import { Chip } from '@/src/shared/components/Chip';

import { useCatalogStore } from '../hooks/useCatalogStore';

export function CatalogAppBarSortList() {
  const { t } = useTranslation();

  const sortOption = useCatalogStore((state) => state.sortOption);
  const setSortOption = useCatalogStore((state) => state.setSortOption);

  const sortOptions: {
    id: AccommodationSortOption;
    title: string;
    Icon?: React.FC;
  }[] = useMemo(
    () => [
      { id: 'price_asc', title: t('catalog.sort.price'), Icon: ChartUpIcon },
      { id: 'price_desc', title: t('catalog.sort.price'), Icon: ChartDownIcon },
      { id: 'distance', title: t('catalog.sort.distance'), Icon: CenterIcon },
    ],
    [t],
  );

  return (
    <ScrollView
      className="mt-2"
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 21 }}
    >
      {sortOptions.map((item, index) => (
        <View key={item.id} className={index !== 0 ? 'ml-3' : ''}>
          <Chip
            title={item.title}
            Icon={item.Icon}
            className="mb-2"
            onPress={() =>
              setSortOption(sortOption === item.id ? undefined : item.id)
            }
            active={sortOption === item.id}
          />
        </View>
      ))}
    </ScrollView>
  );
}
