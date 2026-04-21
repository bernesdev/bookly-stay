import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AppSkeleton } from '@/src/shared/components/AppSkeleton';

import { AccommodationDivider } from './AccommodationDivider';

export function AccommodationSkeleton() {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <View className="flex-row mt-3 items-center">
        <AppSkeleton width={50} height={18} />
      </View>
      <AccommodationDivider />
      <AppSkeleton width={150} height={14} className="mt-1" />
      <View className="flex-row justify-between mt-7">
        {Array.from({ length: 4 }).map((_, index) => {
          return (
            <View key={index} className="w-[65px] items-center">
              <AppSkeleton height={50} width={50} radius={999} />
              <AppSkeleton width={50} height={10} className="mt-3" />
            </View>
          );
        })}
      </View>
      <AccommodationDivider />
      <View className="flex-row items-center justify-between mt-4">
        <AppSkeleton
          width={'100%'}
          height={70}
          className="mr-4 flex-1"
          radius={16}
        />
        <AppSkeleton
          width={'100%'}
          height={70}
          className="ml-4 flex-1"
          radius={16}
        />
      </View>
      <AccommodationDivider />
      <AppSkeleton width={150} height={14} />
      <View className="bg-white px-1 pt-1 pb-3 rounded-xl mt-6">
        <View className="h-[140px] w-full rounded-xl overflow-hidden">
          <AppSkeleton width={'100%'} height={'100%'} />
        </View>
        <View className="flex-row items-center mt-3">
          <AppSkeleton width={16} height={14} />
          <AppSkeleton width={100} height={14} className="ml-1" />
        </View>
      </View>
    </Animated.View>
  );
}
