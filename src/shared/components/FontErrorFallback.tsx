import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export function FontErrorFallback() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      <Text className="text-xl text-text text-center">
        {t('core.init.fontLoadError')}
      </Text>
    </View>
  );
}
