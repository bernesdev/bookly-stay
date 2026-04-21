import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { useLayout } from '@/src/shared/hooks/useLayout';
import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { LocationSheet } from './LocationSheet';

const mockHideSheet = jest.fn();
const mockUseBottomSheet = useBottomSheet as unknown as jest.Mock;
const mockUseLayout = useLayout as jest.Mock;

const mockUseForm = jest.fn();
const mockUseWatch = jest.fn();

const mockHistoryList = jest.fn();
const mockLocationList = jest.fn();

jest.mock('react-hook-form', () => ({
  useForm: (...args: unknown[]) => mockUseForm(...args),
  useWatch: (...args: unknown[]) => mockUseWatch(...args),
}));

jest.mock('@/src/shared/hooks/useBottomSheet', () => ({
  useBottomSheet: jest.fn(),
}));

jest.mock('@/src/shared/hooks/useLayout', () => ({
  useLayout: jest.fn(),
}));

jest.mock('../contexts/LocationContext', () => ({
  LocationProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/src/shared/components/buttons/IconButton', () => ({
  IconButton: ({ onPress }: { onPress?: () => void }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');

    return React.createElement(
      Pressable,
      { testID: 'close-button', onPress },
      React.createElement(Text, null, 'close'),
    );
  },
}));

jest.mock('./SearchField', () => ({
  SearchField: ({ form }: { form: unknown }) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(
      Text,
      { testID: 'search-field' },
      form ? 'search-field' : 'missing-form',
    );
  },
}));

jest.mock('./HistoryList', () => ({
  HistoryList: ({ onSelect }: { onSelect: (location: unknown) => void }) => {
    mockHistoryList({ onSelect });
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(
      Text,
      { testID: 'history-list' },
      'history-list',
    );
  },
}));

jest.mock('./LocationList', () => ({
  LocationList: ({
    query,
    onSelect,
  }: {
    query: string;
    onSelect: (location: unknown) => void;
  }) => {
    mockLocationList({ query, onSelect });
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, { testID: 'location-list' }, query);
  },
}));

describe('LocationSheet', () => {
  const onSelect = jest.fn();
  const form = { control: { _id: 'control' } };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBottomSheet.mockReturnValue({ hideSheet: mockHideSheet });
    mockUseLayout.mockReturnValue({ bottomOffset: 16, topInset: 20 });
    mockUseForm.mockReturnValue(form);
    mockUseWatch.mockReturnValue('');
  });

  it('should render title, close button, search field and history list when query is empty', () => {
    renderWithProviders(<LocationSheet onSelect={onSelect} />);

    expect(screen.getByText('t:location.locationSheet.title')).toBeTruthy();
    expect(screen.getByTestId('close-button')).toBeTruthy();
    expect(screen.getByTestId('search-field')).toBeTruthy();
    expect(screen.getByTestId('history-list')).toBeTruthy();
    expect(screen.queryByTestId('location-list')).toBeNull();

    expect(mockUseForm).toHaveBeenCalledWith({
      defaultValues: { location: '' },
    });
    expect(mockUseWatch).toHaveBeenCalledWith({
      control: form.control,
      name: 'location',
    });
    expect(mockHistoryList).toHaveBeenCalledWith(
      expect.objectContaining({ onSelect }),
    );
  });

  it('should render location list with query when query has value', () => {
    mockUseWatch.mockReturnValue('rio');

    renderWithProviders(<LocationSheet onSelect={onSelect} />);

    expect(screen.getByTestId('location-list')).toBeTruthy();
    expect(screen.getByText('rio')).toBeTruthy();
    expect(screen.queryByTestId('history-list')).toBeNull();

    expect(mockLocationList).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'rio', onSelect }),
    );
  });

  it('should call hideSheet when pressing close button', () => {
    renderWithProviders(<LocationSheet onSelect={onSelect} />);

    fireEvent.press(screen.getByTestId('close-button'));

    expect(mockHideSheet).toHaveBeenCalledTimes(1);
  });
});
