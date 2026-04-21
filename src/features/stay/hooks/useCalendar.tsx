import { useState } from 'react';

import { fromDateId, toDateId } from '@marceloterreiro/flash-calendar';
import dayjs from 'dayjs';

import { StayDates } from '@/src/shared/types/stay.types';

export function useCalendar(initialDates: StayDates) {
  const [month, setMonth] = useState(toDateId(new Date()));

  const [startDate, setStartDate] = useState<string | undefined>(
    toDateId(initialDates.checkIn.toDate()),
  );
  const [endDate, setEndDate] = useState<string | undefined>(
    toDateId(initialDates.checkOut.toDate()),
  );

  const selectMonth = (delta: number) => {
    const date = fromDateId(month);
    setMonth(toDateId(dayjs(date).add(delta, 'month').toDate()));
  };

  const selectDate = (dateId: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateId);
      setEndDate(undefined);
      return;
    }

    if (dayjs(fromDateId(dateId)).isBefore(fromDateId(startDate))) {
      setEndDate(startDate);
      setStartDate(dateId);
      return;
    }

    setEndDate(dateId);
  };

  const getStayDates = (): StayDates | null => {
    if (startDate && endDate) {
      return {
        checkIn: dayjs(fromDateId(startDate)),
        checkOut: dayjs(fromDateId(endDate)),
      };
    }

    return null;
  };

  return {
    month,
    startDate,
    endDate,
    selectMonth,
    selectDate,
    getStayDates,
  };
}
