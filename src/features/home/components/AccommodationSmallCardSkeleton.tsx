import { View } from 'react-native';

import { AppSkeleton } from '../../../shared/components/AppSkeleton';

export function AccommodationSmallCardSkeleton() {
  return (
    <View className="flex-row h-[80px] items-start">
      <AppSkeleton width={80} height={80} radius={8} className="mr-3" />
      <View className="flex-1 justify-between h-full py-1 mt-1">
        <AppSkeleton width="70%" height={15} radius={4} />
        <AppSkeleton width={100} height={14} radius={4} />
        <AppSkeleton width={80} height={16} radius={4} className="mb-1" />
      </View>
      <View className="flex-row items-center py-1 mt-1">
        <AppSkeleton width={40} height={14} radius={4} />
      </View>
    </View>
  );
}
