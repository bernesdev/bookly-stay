import {
  Calendar,
  fromDateId,
  toDateId,
} from '@marceloterreiro/flash-calendar';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import ChevronLeft from '@/assets/icons/chevron-left.svg';
import ChevronRight from '@/assets/icons/chevron-right.svg';
import { AppText } from '@/src/shared/components/AppText';
import { IconButton } from '@/src/shared/components/buttons/IconButton';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { Colors } from '@/src/shared/theme/colors';
import { Font } from '@/src/shared/theme/font';
import { StayDates } from '@/src/shared/types/stay.types';

import { useCalendar } from '../hooks/useCalendar';

type CalendarSheetProps = {
  initialDates: StayDates;
  onApply: (dates: StayDates) => void;
};

export function CalendarSheet({ initialDates, onApply }: CalendarSheetProps) {
  const { t } = useTranslation();

  const { month, startDate, endDate, selectMonth, selectDate, getStayDates } =
    useCalendar(initialDates);

  const { hideSheet } = useBottomSheet();

  return (
    <View className="px-6">
      <AppText size={16} weight="semibold" className="text-center mb-12">
        {t('stay.calendarSheet.title')}
      </AppText>
      <View className="flex-row justify-between items-center mb-6">
        <IconButton
          onPress={() => selectMonth(-1)}
          outlined
          Icon={ChevronLeft}
          iconSize={20}
        />
        <AppText size={16} weight="medium">
          {dayjs(fromDateId(month)).format('MMMM YYYY')}
        </AppText>
        <IconButton
          onPress={() => selectMonth(1)}
          outlined
          Icon={ChevronRight}
          iconSize={20}
        />
      </View>
      <View className="mb-10">
        <Calendar
          calendarMinDateId={toDateId(new Date())}
          calendarMonthId={month}
          calendarActiveDateRanges={[{ startId: startDate, endId: endDate }]}
          onCalendarDayPress={selectDate}
          calendarMonthHeaderHeight={0}
          calendarDayHeight={38}
          theme={{
            itemWeekName: {
              content: {
                color: Colors.text,
                fontFamily: Font.primary.medium,
                fontSize: 12,
              },
            },
            itemDayContainer: {
              activeDayFiller: {
                backgroundColor: '#EBEDF3',
              },
            },
            itemDay: {
              base: ({ isDisabled, isPressed }) => ({
                container: {
                  borderWidth: 0,
                  backgroundColor: isPressed ? Colors.gray[300] : 'transparent',
                },
                content: {
                  color: !isDisabled ? Colors.text : Colors.gray[200],
                  fontFamily: Font.primary.medium,
                  fontSize: 12,
                },
              }),
              active: ({ isEndOfRange, isStartOfRange }) => {
                const isRangeMarker = isEndOfRange || isStartOfRange;

                return {
                  container: {
                    borderTopLeftRadius: isStartOfRange ? 8 : 0,
                    borderBottomLeftRadius: isStartOfRange ? 8 : 0,
                    borderTopRightRadius: isEndOfRange ? 8 : 0,
                    borderBottomRightRadius: isEndOfRange ? 8 : 0,
                    backgroundColor: isRangeMarker ? Colors.primary : '#EBEDF3',
                  },
                  content: {
                    color: isRangeMarker ? Colors.white : Colors.text,
                  },
                };
              },
            },
          }}
        />
      </View>
      <SolidButton
        title={t('stay.actions.apply')}
        onPress={() => {
          const stayDates = getStayDates();

          if (!stayDates) {
            return;
          }

          onApply(stayDates);
          hideSheet();
        }}
      />
    </View>
  );
}
