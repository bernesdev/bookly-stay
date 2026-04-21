import { act, renderHook } from '@testing-library/react-native';
import dayjs from 'dayjs';

import { useCalendar } from './useCalendar';

import type { StayDates } from '@/src/shared/types/stay.types';

jest.mock('@marceloterreiro/flash-calendar', () => ({
  fromDateId: (dateId: string) => new Date(`${dateId}T00:00:00.000Z`),
  toDateId: (date: Date) =>
    jest.requireActual('dayjs')(date).format('YYYY-MM-DD'),
}));

describe('useCalendar', () => {
  const initialDates: StayDates = {
    checkIn: dayjs('2026-06-10'),
    checkOut: dayjs('2026-06-15'),
  };

  it('should initialize month and selected dates from input', () => {
    const { result } = renderHook(() => useCalendar(initialDates));

    expect(result.current.month).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.current.startDate).toBe('2026-06-10');
    expect(result.current.endDate).toBe('2026-06-15');
  });

  it('should change month when selectMonth is called', () => {
    const { result } = renderHook(() => useCalendar(initialDates));
    const initialMonth = result.current.month;

    act(() => {
      result.current.selectMonth(1);
    });

    expect(result.current.month).toBe(
      dayjs(initialMonth).add(1, 'month').format('YYYY-MM-DD'),
    );

    act(() => {
      result.current.selectMonth(-2);
    });

    expect(result.current.month).toBe(
      dayjs(initialMonth).add(-1, 'month').format('YYYY-MM-DD'),
    );
  });

  it('should restart selection when start and end are already selected', () => {
    const { result } = renderHook(() => useCalendar(initialDates));

    act(() => {
      result.current.selectDate('2026-06-20');
    });

    expect(result.current.startDate).toBe('2026-06-20');
    expect(result.current.endDate).toBeUndefined();
  });

  it('should swap start and end when selecting a date before current start', () => {
    const { result } = renderHook(() => useCalendar(initialDates));

    act(() => {
      result.current.selectDate('2026-06-20');
    });

    act(() => {
      result.current.selectDate('2026-06-12');
    });

    expect(result.current.startDate).toBe('2026-06-12');
    expect(result.current.endDate).toBe('2026-06-20');
  });

  it('should set end date when selecting a date after current start', () => {
    const { result } = renderHook(() => useCalendar(initialDates));

    act(() => {
      result.current.selectDate('2026-06-12');
    });

    act(() => {
      result.current.selectDate('2026-06-18');
    });

    expect(result.current.startDate).toBe('2026-06-12');
    expect(result.current.endDate).toBe('2026-06-18');
  });

  it('should return null from getStayDates when range is incomplete', () => {
    const { result } = renderHook(() => useCalendar(initialDates));

    act(() => {
      result.current.selectDate('2026-06-20');
    });

    expect(result.current.getStayDates()).toBeNull();
  });

  it('should return dayjs dates from getStayDates when range is complete', () => {
    const { result } = renderHook(() => useCalendar(initialDates));

    act(() => {
      result.current.selectDate('2026-06-12');
    });

    act(() => {
      result.current.selectDate('2026-06-18');
    });

    const stayDates = result.current.getStayDates();

    expect(stayDates).not.toBeNull();
    expect(stayDates?.checkIn.format('YYYY-MM-DD')).toBe('2026-06-12');
    expect(stayDates?.checkOut.format('YYYY-MM-DD')).toBe('2026-06-18');
  });
});
