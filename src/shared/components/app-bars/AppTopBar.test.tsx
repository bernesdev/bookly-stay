import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { renderWithProviders } from '@/testing/src/renderWithProviders';

import { AppTopBar } from './AppTopBar';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `t:${key}`,
  }),
}));

jest.mock('@/assets/icons/chevron-left.svg', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('react-native-reanimated', () => {
  const { View: MockView } = jest.requireActual('react-native');

  return {
    __esModule: true,
    default: {
      View: MockView,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    Extrapolation: { CLAMP: 'clamp' },
    interpolate: jest.fn((value: number, _input: number[], output: number[]) =>
      value > 0 ? output[1] : output[0],
    ),
    useSharedValue: jest.fn((value: number) => ({ value })),
    useAnimatedStyle: jest.fn((updater: () => object) => updater()),
    useAnimatedReaction: jest.fn(),
  };
});

jest.mock('@/src/shared/components/animations/BouncyRipplePressable', () => ({
  BouncyRipplePressable: ({
    children,
    onPress,
  }: {
    children: React.ReactNode;
    onPress?: () => void;
  }) => {
    const { Pressable } = require('react-native');

    return (
      <Pressable testID="icon-button" onPress={onPress}>
        {children}
      </Pressable>
    );
  },
}));

describe('AppTopBar', () => {
  const defaultProps = {
    scrollY: { value: 0 } as never,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title and back button by default', () => {
    renderWithProviders(<AppTopBar {...defaultProps} title="Minha tela" />);

    expect(screen.getByText('Minha tela')).toBeTruthy();
    expect(screen.getByTestId('icon-button')).toBeTruthy();
  });

  it('should navigate back when leading button is pressed', () => {
    renderWithProviders(<AppTopBar {...defaultProps} title="Minha tela" />);

    fireEvent.press(screen.getByTestId('icon-button'));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should hide leading button when showLeading is false', () => {
    renderWithProviders(
      <AppTopBar {...defaultProps} title="Minha tela" showLeading={false} />,
    );

    expect(screen.queryByTestId('icon-button')).toBeNull();
  });

  it('should render logo text when showLogo is true', () => {
    renderWithProviders(<AppTopBar {...defaultProps} showLogo />);

    expect(screen.getByText('t:shared.brand.appName')).toBeTruthy();
  });

  it('should render action and footer components', () => {
    renderWithProviders(
      <AppTopBar
        {...defaultProps}
        ActionButtonComponent={<Text>Acao</Text>}
        FooterComponent={<Text>Rodape</Text>}
        collapsableActionButton
        collapsableFooter
        footerHeight={48}
      />,
    );

    expect(screen.getByText('Acao')).toBeTruthy();
    expect(screen.getByText('Rodape')).toBeTruthy();
  });

  it('should render custom header when HeaderComponent is provided', () => {
    renderWithProviders(
      <AppTopBar
        {...defaultProps}
        title="Nao deve aparecer"
        HeaderComponent={<Text>Header custom</Text>}
      />,
    );

    expect(screen.getByText('Header custom')).toBeTruthy();
    expect(screen.queryByText('Nao deve aparecer')).toBeNull();
    expect(screen.queryByTestId('icon-button')).toBeNull();
  });
});
