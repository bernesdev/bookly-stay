import React, { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';

import { makeAccommodation } from '@/testing/factories/accommodation.factory';

import {
  getAccommodations,
  getAccommodationById,
} from './accommodation.client';
import { accommodationKeys } from './accommodation.keys';
import {
  useAccommodationsQuery,
  useAccommodationQuery,
} from './accommodation.queries';

jest.mock('./accommodation.client');

const mockGetAccommodations = getAccommodations as jest.Mock;
const mockGetAccommodationById = getAccommodationById as jest.Mock;

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client }, children);
  }
  Wrapper.displayName = 'TestQueryWrapper';
  return Wrapper;
}

describe('useAccommodationQuery', () => {
  it('should fetch accommodation by id and return data', async () => {
    const accommodation = makeAccommodation({ id: 'acc-1' });
    mockGetAccommodationById.mockResolvedValue(accommodation);

    const { result } = renderHook(() => useAccommodationQuery('acc-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(accommodation);
    expect(mockGetAccommodationById).toHaveBeenCalledWith('acc-1');
  });

  it('should use the correct query key', () => {
    expect(accommodationKeys.accommodationKey('acc-1')).toEqual([
      'accommodation',
      'acc-1',
    ]);
  });
});

describe('useAccommodationsQuery', () => {
  it('should fetch first page and expose hasNextPage', async () => {
    const page = {
      items: [makeAccommodation()],
      meta: { nextCursor: 'cursor-2' },
    };
    mockGetAccommodations.mockResolvedValue(page);

    const { result } = renderHook(
      () => useAccommodationsQuery({ locationId: 'loc-1', limit: 10 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0]).toEqual(page);
    expect(result.current.hasNextPage).toBe(true);
    expect(mockGetAccommodations).toHaveBeenCalledWith(
      expect.objectContaining({
        locationId: 'loc-1',
        limit: 10,
        cursor: undefined,
      }),
    );
  });

  it('should report no next page when nextCursor is null', async () => {
    const page = { items: [], meta: { nextCursor: null } };
    mockGetAccommodations.mockResolvedValue(page);

    const { result } = renderHook(
      () => useAccommodationsQuery({ locationId: 'loc-1', limit: 10 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });
});
