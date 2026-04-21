import React from 'react';

import { fireEvent } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { SearchField } from './SearchField';

const mockUseQueryClient = jest.fn();
const mockCancelQueries = jest.fn();
const mockControlledTextField = jest.fn();
const mockBlur = jest.fn();
const mockUseWatch = jest.fn();

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useWatch: (...args: unknown[]) => mockUseWatch(...args),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: () => mockUseQueryClient(),
}));

jest.mock(
  '@/src/shared/components/fields/controlled/ControlledTextField',
  () => ({
    ControlledTextField: (props: any) => {
      mockControlledTextField(props);

      if (props.ref && typeof props.ref === 'object') {
        props.ref.current = {
          blur: mockBlur,
        };
      }

      const React = jest.requireActual('react');
      const { Pressable, View } = jest.requireActual('react-native');

      return (
        <View testID="controlled-text-field">
          {props.SuffixIcon ? (
            <Pressable
              testID="suffix-icon-press"
              onPress={props.onSuffixIconPress}
            >
              <View />
            </Pressable>
          ) : null}
        </View>
      );
    },
  }),
);

describe('SearchField', () => {
  const control = { _id: 'control' } as any;
  const errors = {};
  const setValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseQueryClient.mockReturnValue({
      cancelQueries: mockCancelQueries,
    });
    mockUseWatch.mockReturnValue('');
  });

  it('should render ControlledTextField with expected base props', () => {
    const form = {
      setValue,
      control,
      formState: { errors },
    } as any;

    renderWithProviders(<SearchField form={form} />);

    expect(mockControlledTextField).toHaveBeenCalledTimes(1);

    const props = mockControlledTextField.mock.calls[0][0];

    expect(props.placeholder).toBe('t:location.searchField.placeholder');
    expect(props.name).toBe('location');
    expect(props.control).toBe(control);
    expect(props.errors).toBe(errors);
    expect(props.PrefixIcon).toBeDefined();
    expect(props.SuffixIcon).toBeUndefined();
  });

  it('should show suffix icon when location has text and clear input on suffix press', () => {
    mockUseWatch.mockReturnValue('rio');

    const form = {
      setValue,
      control,
      formState: { errors },
    } as any;

    const { getByTestId } = renderWithProviders(<SearchField form={form} />);

    const props = mockControlledTextField.mock.calls[0][0];

    expect(props.SuffixIcon).toBeDefined();

    fireEvent.press(getByTestId('suffix-icon-press'));

    expect(setValue).toHaveBeenCalledWith('location', '');
    expect(mockBlur).toHaveBeenCalledTimes(1);
    expect(mockCancelQueries).toHaveBeenCalledWith({
      queryKey: ['location'],
    });
  });

  it('should not render suffix press action when location is empty', () => {
    const form = {
      setValue,
      control,
      formState: { errors },
    } as any;

    const { queryByTestId } = renderWithProviders(<SearchField form={form} />);

    expect(queryByTestId('suffix-icon-press')).toBeNull();
  });
});
