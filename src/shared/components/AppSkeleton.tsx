import { Skeleton } from 'moti/skeleton';
import { DimensionValue, View } from 'react-native';

type AppSkeletonProps = {
  width: number | DimensionValue;
  height: number | DimensionValue;
  radius?: number;
  className?: string;
};

export function AppSkeleton({
  width,
  height,
  radius = 4,
  className = '',
}: AppSkeletonProps) {
  return (
    <View className={className}>
      <Skeleton
        colorMode="light"
        width={width}
        height={height}
        radius={radius}
        colors={['#E1E1E1', '#F2F2F2', '#E1E1E1']}
      />
    </View>
  );
}
