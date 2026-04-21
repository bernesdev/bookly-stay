import { View } from 'react-native';

import { AppSkeleton } from '@/src/shared/components/AppSkeleton';

export function CatalogItemSkeleton({ className }: { className?: string }) {
  return (
    <View className={className}>
      <AppSkeleton width={'100%'} height={170} radius={8} />
      <View className="flex-row items-center justify-between mt-4">
        <View>
          <AppSkeleton width={150} height={14} />
          <AppSkeleton width={220} height={14} className="mt-3" />
          <AppSkeleton width={180} height={14} className="mt-3" />
        </View>
        <View className="items-end">
          <AppSkeleton width={40} height={14} />
          <AppSkeleton width={50} height={20} className="mt-2" />
          <AppSkeleton width={50} height={10} className="mt-3" />
        </View>
      </View>
    </View>
  );
}
