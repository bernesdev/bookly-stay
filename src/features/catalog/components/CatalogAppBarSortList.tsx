import { useMemo } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import CenterIcon from '@/assets/icons/center.svg';
import ChartDownIcon from '@/assets/icons/chart-down.svg';
import ChartUpIcon from '@/assets/icons/chart-up.svg';
import { AccommodationSortOption } from '@/src/features/accommodation/api/accommodation.types';
import { Chip } from '@/src/shared/components/Chip';

import { useCatalog } from '../hooks/useCatalog';
import { useCatalogStore } from '../hooks/useCatalogStore';

export function CatalogAppBarSortList() {
  const { t } = useTranslation();

  const { error } = useCatalog();

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
    <FlashList
      data={sortOptions}
      className="mt-2"
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View className="w-3" />}
      renderItem={({ item }) => (
        <Chip
          title={item.title}
          Icon={item.Icon}
          className="mb-2"
          onPress={() => {
            if (error) return;
            setSortOption(sortOption === item.id ? undefined : item.id);
          }}
          active={sortOption === item.id}
        />
      )}
      ListHeaderComponent={<View className="w-6" />}
      ListFooterComponent={<View className="w-6" />}
    />
  );
}
