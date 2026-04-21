import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { AccommodationDescription } from './AccommodationDescription';

const description = 'A stunning beachfront property with ocean views.';

describe('AccommodationDescription', () => {
  it('should render description truncated with read more button', () => {
    renderWithProviders(<AccommodationDescription description={description} />);

    expect(screen.getByText(description)).toBeTruthy();
    expect(
      screen.getByText('t:accommodation.description.readMore'),
    ).toBeTruthy();
  });

  it('should expand description and hide read more button when pressed', () => {
    renderWithProviders(<AccommodationDescription description={description} />);

    fireEvent.press(screen.getByText('t:accommodation.description.readMore'));

    expect(screen.getByText(description)).toBeTruthy();
    expect(
      screen.queryByText('t:accommodation.description.readMore'),
    ).toBeNull();
  });
});
