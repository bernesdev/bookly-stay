import { appStorage } from '@/src/core/storage/appStorage';

import { createLocationStore } from './location.store';

import type { LocationHistory } from '../types';

jest.mock('@/src/core/storage/appStorage', () => ({
  appStorage: {
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  },
}));

const mockedAppStorage = appStorage as jest.Mocked<typeof appStorage>;

const makeHistoryItem = (id: string, city = `City ${id}`): LocationHistory => ({
  id,
  city,
  country: 'Brazil',
  lat: '-23.5505',
  lng: '-46.6333',
});

describe('location.store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAppStorage.getString.mockReturnValue(undefined);
  });

  it('should start with empty history when there is no persisted value', () => {
    const store = createLocationStore();

    expect(store.getState().searchHistory).toEqual([]);
    expect(mockedAppStorage.getString).toHaveBeenCalledWith(
      '@location/history',
    );
  });

  it('should hydrate search history from persisted storage', () => {
    const persistedHistory = [makeHistoryItem('1'), makeHistoryItem('2')];
    mockedAppStorage.getString.mockReturnValue(
      JSON.stringify({
        state: { searchHistory: persistedHistory },
        version: 0,
      }),
    );

    const store = createLocationStore();

    expect(store.getState().searchHistory).toEqual(persistedHistory);
  });

  it('should prepend item, remove duplicates and keep only five latest items', () => {
    const store = createLocationStore();

    store.getState().saveSearchHistory(makeHistoryItem('1'));
    store.getState().saveSearchHistory(makeHistoryItem('2'));
    store.getState().saveSearchHistory(makeHistoryItem('3'));
    store.getState().saveSearchHistory(makeHistoryItem('4'));
    store.getState().saveSearchHistory(makeHistoryItem('5'));
    store.getState().saveSearchHistory(makeHistoryItem('2', 'Updated City 2'));
    store.getState().saveSearchHistory(makeHistoryItem('6'));

    expect(store.getState().searchHistory).toEqual([
      makeHistoryItem('6'),
      makeHistoryItem('2', 'Updated City 2'),
      makeHistoryItem('5'),
      makeHistoryItem('4'),
      makeHistoryItem('3'),
    ]);

    const lastPersistedValue = mockedAppStorage.set.mock.calls.at(-1)?.[1];

    expect(mockedAppStorage.set).toHaveBeenCalledWith(
      '@location/history',
      expect.any(String),
    );

    expect(lastPersistedValue).toBeDefined();

    const parsed = JSON.parse(lastPersistedValue as string);

    expect(parsed.state.searchHistory).toEqual([
      makeHistoryItem('6'),
      makeHistoryItem('2', 'Updated City 2'),
      makeHistoryItem('5'),
      makeHistoryItem('4'),
      makeHistoryItem('3'),
    ]);
  });
});
