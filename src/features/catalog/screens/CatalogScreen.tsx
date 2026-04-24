import { useRef } from 'react';

import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import ChevronLeft from '@/assets/icons/chevron-left.svg';
import { AppScreen } from '@/src/shared/components/AppScreen';
import { TextField } from '@/src/shared/components/fields/TextField';
import { useStayStore } from '@/src/shared/hooks/useStayStore';
import { selectLocationDatesLabel } from '@/src/shared/selectors/stay.selectors';

import { CatalogAppBarSortList } from '../components/CatalogAppBarSortList';
import { CatalogList } from '../components/CatalogList';
import { SearchOptionsSheet } from '../components/SearchOptionsSheet';

import type { SearchOptionsRef } from '../components/SearchOptionsSheet';
import type { FlashListRef } from '@shopify/flash-list';

export function CatalogScreen() {
  const { t } = useTranslation();

  const catalogListRef = useRef<FlashListRef<any>>(null);
  const searchOptionsRef = useRef<SearchOptionsRef>(null);

  const router = useRouter();

  const locationDatesLabel = useStayStore(selectLocationDatesLabel);

  return (
    <>
      <AppScreen
        preset="list"
        appBar={{
          title: t('catalog.screen.title'),
          headerHeight: 65,
          HeaderComponent: (
            <View className="px-6 mt-3">
              <TextField
                PrefixIcon={ChevronLeft}
                value={locationDatesLabel}
                onPress={() => searchOptionsRef.current?.present()}
                readOnly={true}
                onPrefixIconPress={() => router.back()}
              />
            </View>
          ),
          FooterComponent: <CatalogAppBarSortList />,
          footerHeight: 56,
          collapsableFooter: true,
        }}
      >
        {({ onScroll, topBarHeight, scrollY }) => (
          <CatalogList
            onScroll={onScroll}
            topBarHeight={topBarHeight}
            scrollY={scrollY}
            ref={catalogListRef}
          />
        )}
      </AppScreen>
      <SearchOptionsSheet sheetRef={searchOptionsRef} />
    </>
  );
}
