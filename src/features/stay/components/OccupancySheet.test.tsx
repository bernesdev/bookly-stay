import { act, fireEvent, render, screen } from '@testing-library/react-native';

import '@/testing/mocks/react-i18next.mock';

import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';

import { OccupancySheet } from './OccupancySheet';

const mockUseBottomSheet = useBottomSheet as unknown as jest.Mock;
const mockHideSheet = jest.fn();
const mockQuantitySelector = jest.fn();

jest.mock('@/src/shared/hooks/useBottomSheet', () => ({
  useBottomSheet: jest.fn(),
}));

jest.mock('./QuantitySelector', () => ({
  QuantitySelector: (props: unknown) => {
    mockQuantitySelector(props);

    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');

    return React.createElement(Text, null, 'quantity-selector');
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

describe('OccupancySheet', () => {
  const initialOccupancy = {
    rooms: 2,
    adults: 3,
    children: 1,
  };
  const onApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBottomSheet.mockReturnValue({ hideSheet: mockHideSheet });
  });

  it('should render title, labels and initialize selectors with occupancy values', () => {
    render(
      <OccupancySheet initialOccupancy={initialOccupancy} onApply={onApply} />,
    );

    expect(screen.getByText('t:stay.occupancySheet.title')).toBeTruthy();
    expect(screen.getByText('t:stay.occupancySheet.rooms')).toBeTruthy();
    expect(screen.getByText('t:stay.occupancySheet.adults')).toBeTruthy();
    expect(screen.getByText('t:stay.occupancySheet.children')).toBeTruthy();
    expect(screen.getByText('t:stay.actions.apply')).toBeTruthy();

    expect(mockQuantitySelector).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        min: 1,
        value: 2,
        onChange: expect.any(Function),
      }),
    );
    expect(mockQuantitySelector).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        min: 1,
        value: 3,
        onChange: expect.any(Function),
      }),
    );
    expect(mockQuantitySelector).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        min: 0,
        value: 1,
        onChange: expect.any(Function),
      }),
    );
  });

  it('should apply initial values and hide sheet when pressing apply', () => {
    render(
      <OccupancySheet initialOccupancy={initialOccupancy} onApply={onApply} />,
    );

    fireEvent.press(screen.getByTestId('apply-button'));

    expect(onApply).toHaveBeenCalledWith(initialOccupancy);
    expect(mockHideSheet).toHaveBeenCalledTimes(1);
  });

  it('should apply updated values after quantity changes', () => {
    render(
      <OccupancySheet initialOccupancy={initialOccupancy} onApply={onApply} />,
    );

    const roomsSelector = mockQuantitySelector.mock.calls[0][0] as {
      onChange: (value: number) => void;
    };
    const adultsSelector = mockQuantitySelector.mock.calls[1][0] as {
      onChange: (value: number) => void;
    };
    const childrenSelector = mockQuantitySelector.mock.calls[2][0] as {
      onChange: (value: number) => void;
    };

    act(() => {
      roomsSelector.onChange(4);
      adultsSelector.onChange(5);
      childrenSelector.onChange(2);
    });

    fireEvent.press(screen.getByTestId('apply-button'));

    expect(onApply).toHaveBeenCalledWith({
      rooms: 4,
      adults: 5,
      children: 2,
    });
    expect(mockHideSheet).toHaveBeenCalledTimes(1);
  });
});
