import React, { useEffect } from 'react';

import { useRouter } from 'expo-router';

import { View } from 'react-native';

import { AppScreen } from '@/src/shared/components/AppScreen';
import { useStayStore } from '@/src/shared/hooks/useStayStore';

import { SearchInputOptions } from '../../../shared/components/search/SearchInputOptions';
import { CloseToYouList } from '../components/CloseToYouList';
import { TopDestinationsList } from '../components/TopDestinationsList';

export function HomeScreen() {
  const router = useRouter();

  const setGeoLocation = useStayStore((state) => state.setGeoLocation);

  useEffect(() => {
    setGeoLocation();
  }, [setGeoLocation]);

  return (
    <AppScreen appBar={{ showLogo: true, showLeading: false }}>
      <View className="px-6 mt-6">
        <SearchInputOptions onSubmit={() => router.push('/catalog')} />
      </View>
      <TopDestinationsList />
      <CloseToYouList />
      <View style={{ height: 24 }} />
    </AppScreen>
  );
}
