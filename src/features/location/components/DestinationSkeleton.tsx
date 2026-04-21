import { View } from 'react-native';

import { AppSkeleton } from '@/src/shared/components/AppSkeleton';

export function DestinationSkeleton({ className }: { className?: string }) {
  return (
    <View className={`flex-row mb-2 px-3 ${className}`}>
      <View className="w-1/2 pr-1">
        <AppSkeleton width={'100%'} height={220} />
      </View>
      <View className="w-1/2 pl-1">
        <AppSkeleton width={'100%'} height={220} />
      </View>
    </View>
  );
}
