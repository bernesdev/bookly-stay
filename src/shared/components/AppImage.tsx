import { useState } from 'react';

import { Image, ImageProps } from 'expo-image';

import { View } from 'react-native';

import { AppSkeleton } from './AppSkeleton';

type AppImageProps = ImageProps & {
  className?: string;
  showSkeleton?: boolean;
};

export function AppImage({
  className,
  showSkeleton = false,
  cachePolicy = 'memory-disk',
  ...props
}: AppImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <View className={`relative ${className} overflow-hidden`}>
      {!loaded && showSkeleton && (
        <AppSkeleton width="100%" height="100%" className="absolute inset-0" />
      )}
      <Image
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%' }}
        cachePolicy={cachePolicy}
        {...props}
      />
    </View>
  );
}
