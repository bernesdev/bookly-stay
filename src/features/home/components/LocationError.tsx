import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';

import { AppText } from '@/src/shared/components/AppText';
import { OutlinedButton } from '@/src/shared/components/buttons/OutlinedButton';
import { TextButton } from '@/src/shared/components/buttons/TextButton';
import { useStayStore } from '@/src/shared/hooks/useStayStore';
import { errorMessages } from '@/src/shared/utils/messages.utils';

type LocationErrorProps = {
  onRetry: () => void;
};

export function LocationError({ onRetry }: LocationErrorProps) {
  const { t } = useTranslation();

  const locationStatus = useStayStore((state) => state.locationStatus);
  const setGeoLocation = useStayStore((state) => state.setGeoLocation);

  return (
    <View className="px-6 py-4 items-center border border-border rounded-xl border-dashed">
      <AppText className="text-center">
        {errorMessages.getLocationError(locationStatus)}
      </AppText>

      {locationStatus === 'always_denied' && (
        <TextButton
          className="mt-4 mx-auto"
          onPress={() => Linking.openSettings()}
        >
          {t('home.locationError.openSettings')}
        </TextButton>
      )}

      <OutlinedButton
        title={
          locationStatus === 'denied'
            ? t('home.locationError.allowLocation')
            : t('home.actions.retry')
        }
        className="mt-6 mx-auto"
        onPress={async () => {
          const status = await setGeoLocation();

          if (status === 'granted') {
            onRetry();
          }
        }}
      />
    </View>
  );
}
