import { screen, fireEvent } from '@testing-library/react-native';

import { makeAccommodation } from '@/testing/factories/accommodation.factory';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { AccommodationContent } from './AccommodationContent';

const mockShowSheet = jest.fn();
const mockSetStay = jest.fn();

jest.mock('expo-maps', () => ({
  AppleMaps: { View: () => null },
  GoogleMaps: { View: () => null },
}));

jest.mock('@/src/shared/hooks/useBottomSheet', () => ({
  useBottomSheet: () => ({ showSheet: mockShowSheet }),
}));

jest.mock('@/src/shared/hooks/useStayStore', () => ({
  useStayStore: (selector?: (state: any) => any) => {
    const state = {
      stay: {
        dates: { startDate: '2026-04-20', endDate: '2026-04-23' },
        occupancy: { adults: 2, children: 0, rooms: 1 },
      },
      setStay: mockSetStay,
    };

    return selector ? selector(state) : state;
  },
}));

jest.mock('@/src/shared/selectors/stay.selectors', () => ({
  selectCheckInLabel: () => 'Apr 20',
  selectCheckOutLabel: () => 'Apr 23',
  selectNights: () => 3,
}));

jest.mock('@/src/shared/components/search/SearchInputOptions', () => ({
  selectOccupancyLabel: () => '2 adults · 1 room',
}));

jest.mock('@/src/shared/components/animations/BouncyPressable', () => ({
  BouncyPressable: ({
    children,
    onPress,
  }: {
    children: unknown;
    onPress?: () => void;
  }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Pressable',
      { onPress, testID: 'bouncy-pressable' },
      children,
    );
  },
}));

jest.mock('../components/AccommodationAmenity', () => ({
  AccommodationAmenity: ({ name }: { name: string }) => {
    const React = jest.requireActual('react');
    return React.createElement('Text', { testID: 'amenity' }, name);
  },
}));

jest.mock('../components/AccommodationDescription', () => ({
  AccommodationDescription: ({ description }: { description: string }) => {
    const React = jest.requireActual('react');
    return React.createElement('Text', { testID: 'description' }, description);
  },
}));

jest.mock('../components/AccommodationDivider', () => ({
  AccommodationDivider: () => null,
}));

jest.mock('@/src/shared/components/DateCard', () => ({
  DateCard: ({
    title,
    date,
    onPress,
  }: {
    title: string;
    date: string;
    onPress: () => void;
  }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'Pressable',
      { onPress, testID: `date-card-${title}` },
      React.createElement('Text', null, date),
    );
  },
}));

jest.mock('@/src/features/stay', () => ({
  CalendarSheet: () => null,
  OccupancySheet: () => null,
}));

describe('AccommodationContent', () => {
  const accommodation = makeAccommodation({
    rating: '4.8',
    details: {
      amenities: [
        { id: 'a1', name: 'Pool', icon: '<svg/>' },
        { id: 'a2', name: 'Wifi', icon: '<svg/>' },
      ],
      description: 'A beautiful place.',
      bathrooms: 1,
      beds: 2,
      hasBreakfast: true,
    },
    location: {
      address: { number: '42', street: 'Ocean Drive' },
      coordinates: { lat: 0, lng: 0 },
      city: 'Miami',
      country: 'USA',
      distanceToCenter: 0.5,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render rating, amenities, dates, occupancy, address and description', () => {
    renderWithProviders(<AccommodationContent {...accommodation} />);

    expect(screen.getByText('4.8')).toBeTruthy();
    expect(screen.getAllByTestId('amenity').length).toBeGreaterThan(0);
    expect(screen.getByText('Apr 20')).toBeTruthy();
    expect(screen.getByText('Apr 23')).toBeTruthy();
    expect(screen.getByText('2 adults · 1 room')).toBeTruthy();
    expect(screen.getByText('42 Ocean Drive')).toBeTruthy();
    expect(screen.getByTestId('description')).toBeTruthy();
  });

  it('should open calendar sheet when check-in date is pressed', () => {
    renderWithProviders(<AccommodationContent {...accommodation} />);

    fireEvent.press(
      screen.getByTestId('date-card-t:accommodation.content.fields.checkIn'),
    );

    expect(mockShowSheet).toHaveBeenCalledTimes(1);
  });

  it('should open calendar sheet when check-out date is pressed', () => {
    renderWithProviders(<AccommodationContent {...accommodation} />);

    fireEvent.press(
      screen.getByTestId('date-card-t:accommodation.content.fields.checkOut'),
    );

    expect(mockShowSheet).toHaveBeenCalledTimes(1);
  });

  it('should open occupancy sheet when occupancy label is pressed', () => {
    renderWithProviders(<AccommodationContent {...accommodation} />);

    fireEvent.press(screen.getByTestId('bouncy-pressable'));

    expect(mockShowSheet).toHaveBeenCalledTimes(1);
  });
});
