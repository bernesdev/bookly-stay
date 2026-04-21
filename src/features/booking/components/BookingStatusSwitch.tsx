import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '@/src/shared/components/AppText';
import { Colors } from '@/src/shared/theme/colors';

import { BookingStatus } from '../api/booking.types';

type BookingStatusSwitchProps = {
  status: BookingStatus;
  onChange: (status: BookingStatus) => void;
  className?: string;
};

export function BookingStatusSwitch({
  status,
  onChange,
  className,
}: BookingStatusSwitchProps) {
  const { t } = useTranslation();

  const isHistory = status === BookingStatus.completed;

  const animatedThumbStyle = useAnimatedStyle(() => ({
    left: withSpring(isHistory ? '51%' : '1%', {
      damping: 20,
      stiffness: 200,
      mass: 0.5,
    }),
  }));

  return (
    <View
      className={`h-[50px] flex-row rounded-full items-center p-1 relative ${className}`}
      style={{ backgroundColor: Colors.gray[400] }}
    >
      <Animated.View
        className="absolute top-1 bottom-1 rounded-full bg-white"
        style={[{ width: '50%' }, animatedThumbStyle, styles.shadow]}
      />

      <Pressable
        className="flex-1 items-center justify-center z-10 h-full"
        onPress={() => onChange(BookingStatus.active)}
      >
        <AppText
          size={14}
          weight="medium"
          color={!isHistory ? Colors.text : Colors.gray[100]}
        >
          {t('booking.bookingStatusSwitch.booked')}
        </AppText>
      </Pressable>

      <Pressable
        className="flex-1 items-center justify-center z-10 h-full"
        onPress={() => onChange(BookingStatus.completed)}
      >
        <AppText
          size={14}
          weight="medium"
          color={isHistory ? Colors.text : Colors.gray[100]}
        >
          {t('booking.bookingStatusSwitch.history')}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
});
