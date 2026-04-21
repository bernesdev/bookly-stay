import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import { getDefaultErrorMock } from '@/testing/mocks/messages-utils.mock';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { useAccommodationQuery } from '../api/accommodation.queries';

import { AccommodationScreen } from './AccommodationScreen';

const mockUseLocalSearchParams = jest.fn();
const mockUseAccommodationQuery = useAccommodationQuery as jest.Mock;
const mockRefetch = jest.fn();
const mockSnapToIndex = jest.fn();
let mockBottomSheetProps: Record<string, unknown> = {};

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockUseLocalSearchParams(),
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
    return React.createElement(
      'Pressable',
      { onPress },
      React.createElement('Text', null, title),
    );
  },
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const React = jest.requireActual('react');

  const BottomSheet = React.forwardRef(
    (
      props: { children: unknown },
      ref: React.Ref<{ snapToIndex: (index: number) => void }>,
    ) => {
      mockBottomSheetProps = props as unknown as Record<string, unknown>;
      React.useImperativeHandle(ref, () => ({
        snapToIndex: mockSnapToIndex,
      }));
      return React.createElement(
        'View',
        { testID: 'bottom-sheet' },
        props.children,
      );
    },
  );
  BottomSheet.displayName = 'MockBottomSheet';

  const BottomSheetScrollView = ({ children }: { children: unknown }) =>
    React.createElement('View', null, children);

  return {
    __esModule: true,
    default: BottomSheet,
    BottomSheetScrollView,
  };
});

jest.mock('../api/accommodation.queries', () => ({
  useAccommodationQuery: jest.fn(),
}));

jest.mock('../components/AccommodationAppBar', () => ({
  AccommodationAppBar: () => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'accommodation-app-bar' },
      'app-bar',
    );
  },
}));

jest.mock('../components/AccommodationSkeleton', () => ({
  AccommodationSkeleton: () => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'accommodation-skeleton' },
      'skeleton',
    );
  },
}));

jest.mock('../components/AccommodationContent', () => ({
  AccommodationContent: ({ name }: { name: string }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'accommodation-content' },
      name,
    );
  },
}));

jest.mock('../components/AccommodationBookingSheet', () => ({
  AccommodationBookingSheet: ({
    accommodation,
  }: {
    accommodation: { id: string };
  }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Text',
      { testID: 'accommodation-booking-sheet' },
      accommodation.id,
    );
  },
}));

describe('AccommodationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockBottomSheetProps = {};
    mockUseLocalSearchParams.mockReturnValue({
      id: 'acc-1',
      title: 'Ocean View Hotel',
      image: 'https://example.com/ocean-view.jpg',
    });
    getDefaultErrorMock.mockReturnValue('default-error-message');
  });

  it('should render initial and loading state correctly', () => {
    mockUseAccommodationQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AccommodationScreen />);

    expect(screen.getByTestId('accommodation-app-bar')).toBeTruthy();
    expect(screen.getByText('Ocean View Hotel')).toBeTruthy();
    expect(screen.getByTestId('accommodation-skeleton')).toBeTruthy();
    expect(screen.queryByTestId('accommodation-content')).toBeNull();
    expect(screen.queryByTestId('accommodation-booking-sheet')).toBeNull();
    expect(mockBottomSheetProps.topInset).toBe(84);
    expect(mockBottomSheetProps.enableHandlePanningGesture).toBe(true);
    expect(mockBottomSheetProps.enableContentPanningGesture).toBe(true);
  });

  it('should render content and booking sheet when data is loaded', () => {
    const accommodation = makeAccommodation({
      id: 'acc-77',
      name: 'Mountain Lodge',
    });

    mockUseAccommodationQuery.mockReturnValue({
      data: accommodation,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AccommodationScreen />);

    expect(screen.getByTestId('accommodation-content')).toBeTruthy();
    expect(screen.getByText('Mountain Lodge')).toBeTruthy();
    expect(screen.getByTestId('accommodation-booking-sheet')).toBeTruthy();
    expect(screen.getByText('acc-77')).toBeTruthy();
    expect(screen.queryByTestId('accommodation-skeleton')).toBeNull();
  });

  it('should render error state, disable gestures, and allow retry', () => {
    mockUseAccommodationQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: '500' },
      refetch: mockRefetch,
    });

    renderWithProviders(<AccommodationScreen />);

    expect(
      screen.getByText('t:accommodation.screen.loadErrorTitle'),
    ).toBeTruthy();
    expect(screen.getByText('default-error-message')).toBeTruthy();
    expect(screen.queryByText('Ocean View Hotel')).toBeNull();
    expect(mockBottomSheetProps.enableHandlePanningGesture).toBe(false);
    expect(mockBottomSheetProps.enableContentPanningGesture).toBe(false);
    expect(mockSnapToIndex).toHaveBeenCalledWith(0);

    fireEvent.press(screen.getByText('t:shared.errorMessage.retry'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(getDefaultErrorMock).toHaveBeenCalledWith('500');
  });
});
