import { View } from 'react-native';

import CalendarIcon from '@/assets/icons/calendar.svg';

import { Colors } from '../theme/colors';

import { BouncyPressable } from './animations/BouncyPressable';
import { AppText } from './AppText';

type DateCardProps = {
  title: string;
  date: string;
  className?: string;
  onPress?: () => void;
};

export function DateCard({ title, date, className, onPress }: DateCardProps) {
  return (
    <BouncyPressable
      className={`h-[68px] rounded-2xl bg-white items-start justify-center border border-gray-300 py-3 px-4 ${className}`}
      onPress={onPress}
      activeScale={0.98}
      disabled={!onPress}
    >
      <View className="flex-row items-center">
        <CalendarIcon width={18} height={18} stroke={Colors.text} />
        <AppText size={12} weight="medium" className="ml-2">
          {title}
        </AppText>
      </View>
      <AppText
        size={14}
        weight="medium"
        className="mt-2"
        color={Colors.primary}
      >
        {date}
      </AppText>
    </BouncyPressable>
  );
}
