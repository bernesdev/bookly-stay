import React from 'react';

import { screen } from '@testing-library/react-native';
import { Image, View } from 'react-native';

import '@/testing/mocks';
import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { AuthHeader } from './AuthHeader';

describe('AuthHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render logo and translated texts with expected layout', () => {
    renderWithProviders(<AuthHeader />);

    const appName = screen.getByText('t:auth.authHeader.appName');
    const subtitle = screen.getByText('t:auth.authHeader.subtitle');

    expect(appName).toBeTruthy();
    expect(subtitle).toBeTruthy();

    const views = screen.UNSAFE_getAllByType(View);
    const classNames = views
      .map((view) => view.props.className)
      .filter(Boolean);

    expect(classNames).toContain('flex-row items-center');

    const logo = screen.UNSAFE_getByType(Image);
    expect(logo.props.source).toBeTruthy();
    expect(logo.props.className).toBe('w-[70px] h-[70px]');
  });
});
