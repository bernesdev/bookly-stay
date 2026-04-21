import { View } from 'react-native';

import { AppSkeleton } from '@/src/shared/components/AppSkeleton';

export function BookingItemSkeleton({ className }: { className?: string }) {
  return (
    <View
      className={`w-full border border-gray-300 bg-white rounded-xl p-3 ${className}`}
    >
      <View className="flex-row gap-3">
        <AppSkeleton width={100} height={78} radius={8} />
        <View className="flex-1 gap-2 py-1">
          <AppSkeleton className="pt-1" width="80%" height={14} />
          <AppSkeleton className="pt-1" width="60%" height={12} />
          <AppSkeleton className="pt-2" width="45%" height={14} />
        </View>
      </View>
      <View className="border-t border-gray-300 my-4" />
      <View className="flex-row gap-2 items-center ml-1">
        <AppSkeleton width={18} height={18} />
        <AppSkeleton width={80} height={18} />
        <AppSkeleton width={80} height={18} className="ml-auto" />
      </View>
      <View className="flex-row gap-2 mt-4 items-center ml-1">
        <AppSkeleton width={18} height={18} />
        <AppSkeleton width={80} height={18} />
        <AppSkeleton width={80} height={18} className="ml-auto" />
      </View>
    </View>
  );
}
