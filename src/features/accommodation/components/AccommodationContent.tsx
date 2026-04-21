import { AppleMaps, GoogleMaps } from 'expo-maps';

import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import LocationIcon from '@/assets/icons/location.svg';
import StarIcon from '@/assets/icons/star.svg';
import { Accommodation } from '@/src/features/accommodation/api/accommodation.types';
import { CalendarSheet, OccupancySheet } from '@/src/features/stay';
import { BouncyPressable } from '@/src/shared/components/animations/BouncyPressable';
import { AppText } from '@/src/shared/components/AppText';
import { DateCard } from '@/src/shared/components/DateCard';
import { selectOccupancyLabel } from '@/src/shared/components/search/SearchInputOptions';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { useStayStore } from '@/src/shared/hooks/useStayStore';
import {
  selectCheckInLabel,
  selectCheckOutLabel,
} from '@/src/shared/selectors/stay.selectors';
import { Colors } from '@/src/shared/theme/colors';

import { AccommodationAmenity } from './AccommodationAmenity';
import { AccommodationDescription } from './AccommodationDescription';
import { AccommodationDivider } from './AccommodationDivider';

export function AccommodationContent(accommodation: Accommodation) {
  const { t } = useTranslation();

  const stayDates = useStayStore((state) => state.stay.dates);
  const stayOccupancy = useStayStore((state) => state.stay.occupancy);
  const checkInLabel = useStayStore(selectCheckInLabel);
  const checkOutLabel = useStayStore(selectCheckOutLabel);
  const setStay = useStayStore((state) => state.setStay);

  const { showSheet } = useBottomSheet();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <View className="flex-row mt-4 items-center">
        <StarIcon width={18} height={18} stroke={Colors.accent[200]} />
        <AppText size={14} weight="semibold" className="ml-2">
          {accommodation!.rating}
        </AppText>
      </View>
      <AccommodationDivider />
      <AppText size={16} weight="semibold">
        {t('accommodation.content.sections.highlights')}
      </AppText>
      <View className="flex-row justify-between mt-6">
        {Array.from({ length: 4 }).map((_, index) => {
          const amenity = accommodation!.details.amenities[index];

          if (amenity) {
            return (
              <AccommodationAmenity
                key={amenity.id}
                name={amenity.name}
                icon={amenity.icon}
              />
            );
          }

          return <View key={index} className="w-[65px]" />;
        })}
      </View>
      <AccommodationDivider />
      <View>
        <View className="flex-row items-center gap-4">
          <DateCard
            title={t('accommodation.content.fields.checkIn')}
            date={checkInLabel}
            onPress={() =>
              showSheet(
                <CalendarSheet
                  initialDates={stayDates}
                  onApply={(dates) => setStay({ dates })}
                />,
              )
            }
            className="flex-1"
          />
          <DateCard
            title={t('accommodation.content.fields.checkOut')}
            date={checkOutLabel}
            onPress={() =>
              showSheet(
                <CalendarSheet
                  initialDates={stayDates}
                  onApply={(dates) => setStay({ dates })}
                />,
              )
            }
            className="flex-1"
          />
        </View>
        <AppText size={14} weight="medium" className="ml-2 mt-8">
          {t('accommodation.content.sections.searchSummary')}
        </AppText>
        <BouncyPressable
          activeScale={0.98}
          onPress={() =>
            showSheet(
              <OccupancySheet
                initialOccupancy={stayOccupancy}
                onApply={(occupancy) => setStay({ occupancy })}
              />,
            )
          }
        >
          <AppText
            size={14}
            weight="medium"
            className="mt-6 ml-2"
            color={Colors.primary}
          >
            {selectOccupancyLabel(stayOccupancy)}
          </AppText>
        </BouncyPressable>
      </View>
      <AccommodationDivider />
      <AppText size={16} weight="semibold">
        {t('accommodation.content.sections.location')}
      </AppText>
      <View className="bg-white px-1 pt-1 pb-3 rounded-xl mt-6">
        <View className="h-[160px] w-full rounded-xl overflow-hidden">
          {Platform.OS === 'android' && (
            <GoogleMaps.View
              style={{ width: '100%', height: '100%' }}
              cameraPosition={{
                coordinates: {
                  latitude: accommodation!.location.coordinates.lat,
                  longitude: accommodation!.location.coordinates.lng,
                },
                zoom: 15,
              }}
              markers={[
                {
                  coordinates: {
                    latitude: accommodation!.location.coordinates.lat,
                    longitude: accommodation!.location.coordinates.lng,
                  },
                  title: accommodation!.name,
                },
              ]}
            />
          )}
          {Platform.OS === 'ios' && (
            <AppleMaps.View
              style={{ width: '100%', height: '100%' }}
              cameraPosition={{
                coordinates: {
                  latitude: accommodation!.location.coordinates.lat,
                  longitude: accommodation!.location.coordinates.lng,
                },
                zoom: 15,
              }}
              markers={[
                {
                  coordinates: {
                    latitude: accommodation!.location.coordinates.lat,
                    longitude: accommodation!.location.coordinates.lng,
                  },
                  title: accommodation!.name,
                },
              ]}
            />
          )}
        </View>
        <View className="flex-row items-center mt-3">
          <LocationIcon width={16} height={16} stroke={Colors.gray[100]} />
          <AppText size={14} color={Colors.gray[100]} className="ml-1">
            {`${accommodation!.location.address.number} ${accommodation!.location.address.street}`}
          </AppText>
        </View>
      </View>
      <AccommodationDivider />
      <AppText size={16} weight="semibold">
        {t('accommodation.content.sections.description')}
      </AppText>
      <AccommodationDescription
        description={accommodation!.details.description}
        className="mt-6"
      />
    </Animated.View>
  );
}
