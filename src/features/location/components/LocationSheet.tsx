import { QueryClientProvider } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import CloseIcon from '@/assets/icons/x.svg';
import { queryClient } from '@/src/core/api/queryClient';
import { AppText } from '@/src/shared/components/AppText';
import { IconButton } from '@/src/shared/components/buttons/IconButton';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { useLayout } from '@/src/shared/hooks/useLayout';

import { LocationProvider } from '../contexts/LocationContext';

import { HistoryList } from './HistoryList';
import { LocationList } from './LocationList';
import { SearchField } from './SearchField';

import type { SearchInputOptionsValues } from '../types';
import type { StayLocation } from '@/src/shared/types/stay.types';

type LocationSheetProps = {
  onSelect: (location: StayLocation) => void;
};

export function LocationSheet({ onSelect }: LocationSheetProps) {
  const { t } = useTranslation();

  const { hideSheet } = useBottomSheet();

  const { bottomOffset, topInset } = useLayout();

  const searchForm = useForm<SearchInputOptionsValues>({
    defaultValues: { location: '' },
  });

  const query = useWatch({ control: searchForm.control, name: 'location' });

  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <View
          className="flex-1 px-6"
          style={{ paddingBottom: bottomOffset, paddingTop: topInset }}
        >
          <View className="flex-row items-center mb-2">
            <IconButton Icon={CloseIcon} onPress={hideSheet} />
            <AppText weight="medium" className="text-lg font-medium mx-auto">
              {t('location.locationSheet.title')}
            </AppText>
            <View className="w-[24px]" />
          </View>

          <SearchField form={searchForm} />

          {query.length === 0 && <HistoryList onSelect={onSelect} />}

          {query.length > 0 && (
            <LocationList query={query} onSelect={onSelect} />
          )}
        </View>
      </LocationProvider>
    </QueryClientProvider>
  );
}
