import { useLocalSearchParams } from 'expo-router';

import { renderHook } from '@testing-library/react-native';
import dayjs from 'dayjs';

import { useAccommodationQuery } from '@/src/features/accommodation/api/accommodation.queries';
import { useStayStore } from '@/src/shared/hooks/useStayStore';

import { useCheckout } from './useCheckout';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@/src/features/accommodation/api/accommodation.queries', () => ({
  useAccommodationQuery: jest.fn(),
}));

jest.mock('@/src/shared/hooks/useStayStore', () => ({
  useStayStore: jest.fn(),
}));

const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockUseAccommodationQuery = useAccommodationQuery as jest.Mock;
const mockUseStayStore = useStayStore as unknown as jest.Mock;

const mockRefetch = jest.fn();

describe('useCheckout', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocalSearchParams.mockReturnValue({ id: 'acc-1' });
    mockUseStayStore.mockImplementation((selector: any) =>
      selector({
        stay: {
          dates: {
            checkIn: dayjs('2026-05-01'),
            checkOut: dayjs('2026-05-04'),
          },
        },
      }),
    );
    mockUseAccommodationQuery.mockReturnValue({
      data: {
        id: 'acc-1',
        price: {
          currentPrice: 150,
          oldPrice: 200,
          discount: 10,
        },
      },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  it('should return route params, query state and computed checkout totals', () => {
    const { result } = renderHook(() => useCheckout());

    expect(mockUseAccommodationQuery).toHaveBeenCalledWith('acc-1');
    expect(result.current.id).toBe('acc-1');
    expect(result.current.nights).toBe(3);
    expect(result.current.accommodation).toEqual({
      id: 'acc-1',
      price: {
        currentPrice: 150,
        oldPrice: 200,
        discount: 10,
      },
    });
    expect(result.current.totalDiscount).toBe(30);
    expect(result.current.totalOldPrice).toBe(600);
    expect(result.current.totalCurrentPrice).toBe(450);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.refetch).toBe(mockRefetch);
  });

  it('should fallback old price to current price and keep discount null when discount is missing', () => {
    mockUseAccommodationQuery.mockReturnValue({
      data: {
        id: 'acc-1',
        price: {
          currentPrice: 120,
          oldPrice: undefined,
          discount: undefined,
        },
      },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() => useCheckout());

    expect(result.current.totalDiscount).toBeNull();
    expect(result.current.totalOldPrice).toBe(360);
    expect(result.current.totalCurrentPrice).toBe(360);
  });

  it('should return safe defaults when accommodation is not available yet', () => {
    const error = new Error('Failed to load accommodation');

    mockUseAccommodationQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() => useCheckout());

    expect(result.current.accommodation).toBeUndefined();
    expect(result.current.totalDiscount).toBeNull();
    expect(result.current.totalOldPrice).toBeNull();
    expect(result.current.totalCurrentPrice).toBe(0);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(error);
    expect(result.current.refetch).toBe(mockRefetch);
  });
});
