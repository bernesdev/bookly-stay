import { useTranslation } from 'react-i18next';

import { AppScreen } from '@/src/shared/components/AppScreen';

import { DestinationsList } from '../components/DestinationsList';

export function DestinationsScreen() {
  const { t } = useTranslation();

  return (
    <AppScreen
      preset="list"
      appBar={{
        title: t('location.destinationsScreen.appBarTitle'),
        showLeading: true,
      }}
    >
      {({ onScroll, topBarHeight }) => (
        <DestinationsList onScroll={onScroll} topBarHeight={topBarHeight} />
      )}
    </AppScreen>
  );
}
