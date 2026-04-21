import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AppText } from '@/src/shared/components/AppText';
import { SectionTitle } from '@/src/shared/components/SectionTitle';
import { Colors } from '@/src/shared/theme/colors';

import { useLocationStore } from '../hooks/useLocationStore';

import { HistoryItem } from './HistoryItem';

import type { StayLocation } from '@/src/shared/types/stay.types';

type HistoryListProps = {
  onSelect: (location: StayLocation) => void;
};

export function HistoryList({ onSelect }: HistoryListProps) {
  const { t } = useTranslation();

  const searchHistory = useLocationStore((state) => state.searchHistory);

  return (
    <>
      {searchHistory.length === 0 && (
        <AppText color={Colors.gray[100]} weight="light" className="mt-8">
          {t('location.historyList.empty')}
        </AppText>
      )}

      {searchHistory.length > 0 && (
        <>
          <SectionTitle
            title={t('location.historyList.sectionTitle')}
            className="mt-8 mb-6"
          />
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            className="flex-1"
          >
            {searchHistory.map((item) => (
              <HistoryItem key={item.id} location={item} onSelect={onSelect} />
            ))}
          </Animated.View>
        </>
      )}
    </>
  );
}
