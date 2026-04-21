import { renderHook } from '@testing-library/react-native';
import dayjs from 'dayjs';

import { useStayStore } from '@/src/shared/hooks/useStayStore';

import { useAccommodationsQuery } from '../../accommodation';

import { useCatalog } from './useCatalog';
import { useCatalogStore } from './useCatalogStore';

jest.mock('../../accommodation', () => ({
  useAccommodationsQuery: jest.fn(),
}));

jest.mock('./useCatalogStore', () => ({
  useCatalogStore: jest.fn(),
}));

jest.mock('@/src/shared/hooks/useStayStore', () => ({
  useStayStore: jest.fn(),
}));

const mockUseAccommodationsQuery = useAccommodationsQuery as jest.Mock;
const mockUseCatalogStore = useCatalogStore as jest.Mock;
const mockUseStayStore = useStayStore as unknown as jest.Mock;

describe('useCatalog', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const catalogState = {
      sortOption: 'recommended',
      newSearch: undefined,
    };

    mockUseCatalogStore.mockImplementation((selector) =>
      selector(catalogState),
    );
    mockUseStayStore.mockImplementation((selector) =>
      selector({
        stay: {
          location: { id: 'stay-location' },
        },
      }),
    );

    mockUseAccommodationsQuery.mockReturnValue({
      data: {
        pages: [
          { data: [{ id: 'a1' }, { id: 'a2' }] },
          { data: [{ id: 'a3' }] },
        ],
      },
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
    });
  });

  it('should use newSearch values when provided and flatten paginated items', () => {
    const newSearch = {
      location: { id: 'new-location' },
      dates: {
        checkIn: dayjs('2026-05-10'),
        checkOut: dayjs('2026-05-12'),
      },
      occupancy: { rooms: 2, adults: 3, children: 1 },
    };

    mockUseCatalogStore.mockImplementation((selector) =>
      selector({
        sortOption: 'price_asc',
        newSearch,
      }),
    );

    const { result } = renderHook(() => useCatalog());

    expect(mockUseAccommodationsQuery).toHaveBeenCalledWith({
      locationId: 'new-location',
      dates: newSearch.dates,
      occupancy: newSearch.occupancy,
      limit: 8,
      sortBy: 'price_asc',
    });
    expect(result.current.items).toEqual([
      { id: 'a1' },
      { id: 'a2' },
      { id: 'a3' },
    ]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should fallback to stay location when newSearch location is missing', () => {
    const { result } = renderHook(() => useCatalog());

    expect(mockUseAccommodationsQuery).toHaveBeenCalledWith({
      locationId: 'stay-location',
      dates: undefined,
      occupancy: undefined,
      limit: 8,
      sortBy: 'recommended',
    });
    expect(result.current.items).toEqual([
      { id: 'a1' },
      { id: 'a2' },
      { id: 'a3' },
    ]);
  });

  it('should send empty locationId when both newSearch and stay are missing', () => {
    mockUseStayStore.mockImplementation((selector) =>
      selector({
        stay: {
          location: undefined,
        },
      }),
    );

    renderHook(() => useCatalog());

    expect(mockUseAccommodationsQuery).toHaveBeenCalledWith({
      locationId: '',
      dates: undefined,
      occupancy: undefined,
      limit: 8,
      sortBy: 'recommended',
    });
  });
});
