import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AppText } from '@/src/shared/components/AppText';
import { SectionTitle } from '@/src/shared/components/SectionTitle';
import { Colors } from '@/src/shared/theme/colors';

import { useLocation } from '../hooks/useLocation';

import { LocationItem } from './LocationItem';
import { LocationItemSkeleton } from './LocationItemSkeleton';

import type { StayLocation } from '@/src/shared/types/stay.types';

type LocationListProps = {
  query: string;
  onSelect: (location: StayLocation) => void;
};

export function LocationList({ query, onSelect }: LocationListProps) {
  const { t } = useTranslation();

  const { hasItems, items, isLoading, error, isFetched } = useLocation(query);

  return (
    <>
      <SectionTitle
        title={t('location.locationList.sectionTitle')}
        className="mt-8 mb-6"
      />

      {error && <AppText>{t('location.locationList.loadError')}</AppText>}

      {(isLoading || !isFetched) && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          className="flex-1"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <LocationItemSkeleton key={index} />
          ))}
        </Animated.View>
      )}

      {!isLoading && !error && isFetched && !hasItems && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <AppText color={Colors.gray[100]} weight="light">
            {t('location.locationList.empty')}
          </AppText>
        </Animated.View>
      )}

      {!isLoading && !error && hasItems && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          className="flex-1"
        >
          <FlashList
            data={items}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <LocationItem location={item} onSelect={onSelect} />
            )}
          />
        </Animated.View>
      )}
    </>
  );
}
