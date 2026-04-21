import { View } from 'react-native';

import { AppSkeleton } from '@/src/shared/components/AppSkeleton';

export function LocationItemSkeleton() {
  return (
    <View className="flex-row items-center justify-center h-[50px] border-b border-border">
      <View className="flex-1 items-center flex-row">
        <AppSkeleton width={130} height={15} />
      </View>
      <AppSkeleton width={15} height={15} />
    </View>
  );
}
