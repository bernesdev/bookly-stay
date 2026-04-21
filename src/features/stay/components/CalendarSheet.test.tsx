import { fireEvent, render, screen } from '@testing-library/react-native';
import dayjs from 'dayjs';

import '@/testing/mocks/expo-ui.mock';
import '@/testing/mocks/icons.mock';
import '@/testing/mocks/react-i18next.mock';

import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';

import { useCalendar } from '../hooks/useCalendar';

import { CalendarSheet } from './CalendarSheet';

const mockUseBottomSheet = useBottomSheet as unknown as jest.Mock;
const mockUseCalendar = useCalendar as jest.Mock;
const mockHideSheet = jest.fn();
const mockSelectMonth = jest.fn();
const mockSelectDate = jest.fn();
const mockGetStayDates = jest.fn();
const mockCalendar = jest.fn();

jest.mock('@/src/shared/hooks/useBottomSheet', () => ({
  useBottomSheet: jest.fn(),
}));

jest.mock('../hooks/useCalendar', () => ({
  useCalendar: jest.fn(),
}));

jest.mock('@marceloterreiro/flash-calendar', () => ({
  Calendar: (props: unknown) => {
    const React = jest.requireActual('react');
    const { Pressable, Text, View } = jest.requireActual('react-native');
    const typedProps = props as {
      onCalendarDayPress: (dateId: string) => void;
    };

    mockCalendar(props);

    return React.createElement(
      View,
      { testID: 'calendar' },
      React.createElement(Text, null, 'calendar'),
      React.createElement(
        Pressable,
        {
          testID: 'calendar-day',
          onPress: () => typedProps.onCalendarDayPress('2026-06-15'),
        },
        React.createElement(Text, null, 'day'),
      ),
    );
  },
  fromDateId: jest.fn((dateId: string) => new Date(`${dateId}T00:00:00.000Z`)),
  toDateId: jest.fn(() => '2026-05-10'),
}));

jest.mock('@/src/shared/components/buttons/IconButton', () => ({
  IconButton: ({ onPress }: { onPress?: () => void }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');
    const index = mockCalendar.mock.calls.length;

    return React.createElement(
      Pressable,
      {
        testID: index === 0 ? 'previous-month-button' : 'next-month-button',
        onPress,
      },
      React.createElement(Text, null, 'icon-button'),
    );
  },
}));

jest.mock('@/src/shared/components/buttons/SolidButton', () => ({
  SolidButton: ({
    title,
    onPress,
  }: {
    title: string;
    onPress?: () => void;
  }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');

    return React.createElement(
      Pressable,
      { testID: 'apply-button', onPress },
      React.createElement(Text, null, title),
    );
  },
}));

describe('CalendarSheet', () => {
  const initialDates = {
    checkIn: dayjs('2026-06-10'),
    checkOut: dayjs('2026-06-15'),
  };
  const selectedDates = {
    checkIn: dayjs('2026-06-12'),
    checkOut: dayjs('2026-06-18'),
  };
  const onApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBottomSheet.mockReturnValue({ hideSheet: mockHideSheet });
    mockUseCalendar.mockReturnValue({
      month: '2026-05-01',
      startDate: '2026-06-10',
      endDate: '2026-06-15',
      selectMonth: mockSelectMonth,
      selectDate: mockSelectDate,
      getStayDates: mockGetStayDates,
    });
  });

  it('should render title, current month and calendar with selected range', () => {
    render(<CalendarSheet initialDates={initialDates} onApply={onApply} />);

    expect(mockUseCalendar).toHaveBeenCalledWith(initialDates);
    expect(screen.getByText('t:stay.calendarSheet.title')).toBeTruthy();
    expect(screen.getByText('May 2026')).toBeTruthy();
    expect(screen.getByTestId('calendar')).toBeTruthy();
    expect(screen.getByText('t:stay.actions.apply')).toBeTruthy();
    expect(mockCalendar).toHaveBeenCalledWith(
      expect.objectContaining({
        calendarMinDateId: '2026-05-10',
        calendarMonthId: '2026-05-01',
        calendarActiveDateRanges: [
          { startId: '2026-06-10', endId: '2026-06-15' },
        ],
        calendarMonthHeaderHeight: 0,
        onCalendarDayPress: mockSelectDate,
      }),
    );
  });

  it('should change month when pressing navigation buttons', () => {
    render(<CalendarSheet initialDates={initialDates} onApply={onApply} />);

    const buttons = screen.getAllByText('icon-button');
    fireEvent.press(buttons[0]);
    fireEvent.press(buttons[1]);

    expect(mockSelectMonth).toHaveBeenNthCalledWith(1, -1);
    expect(mockSelectMonth).toHaveBeenNthCalledWith(2, 1);
  });

  it('should forward selected day to the calendar hook', () => {
    render(<CalendarSheet initialDates={initialDates} onApply={onApply} />);

    fireEvent.press(screen.getByTestId('calendar-day'));

    expect(mockSelectDate).toHaveBeenCalledWith('2026-06-15');
  });

  it('should apply selected dates and hide sheet when dates are valid', () => {
    mockGetStayDates.mockReturnValue(selectedDates);

    render(<CalendarSheet initialDates={initialDates} onApply={onApply} />);
    fireEvent.press(screen.getByTestId('apply-button'));

    expect(onApply).toHaveBeenCalledWith(selectedDates);
    expect(mockHideSheet).toHaveBeenCalledTimes(1);
  });

  it('should not apply or hide sheet when no valid stay dates are available', () => {
    mockGetStayDates.mockReturnValue(null);

    render(<CalendarSheet initialDates={initialDates} onApply={onApply} />);
    fireEvent.press(screen.getByTestId('apply-button'));

    expect(onApply).not.toHaveBeenCalled();
    expect(mockHideSheet).not.toHaveBeenCalled();
  });
});
