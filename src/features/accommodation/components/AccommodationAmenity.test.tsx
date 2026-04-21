import React from 'react';

import { screen } from '@testing-library/react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { AccommodationAmenity } from './AccommodationAmenity';

describe('AccommodationAmenity', () => {
  it('should render the amenity name', () => {
    renderWithProviders(<AccommodationAmenity name="Pool" icon="<svg/>" />);

    expect(screen.getByText('Pool')).toBeTruthy();
  });
});
