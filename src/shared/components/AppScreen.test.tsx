import React from 'react';

import { act, render, screen } from '@testing-library/react-native';
import { Keyboard, TouchableWithoutFeedback, View, Text } from 'react-native';

import { AppScreen } from './AppScreen';

const mockUseLayout = jest.fn();
const mockAppTopBar = jest.fn();

jest.mock('../hooks/useLayout', () => ({
  useLayout: () => mockUseLayout(),
}));

jest.mock('./app-bars/AppTopBar', () => ({
  AppTopBar: (props: unknown) => {
    const React = jest.requireActual('react');
    const { View: MockView } = jest.requireActual('react-native');

    mockAppTopBar(props);

    return React.createElement(MockView, { testID: 'app-top-bar' });
  },
}));

jest.mock('react-native-keyboard-controller', () => {
  const React = jest.requireActual('react');
  const { View: MockView } = jest.requireActual('react-native');

  return {
    KeyboardAwareScrollView: ({ children, ...props }: any) =>
      React.createElement(
        MockView,
        { testID: 'keyboard-aware-scroll-view', ...props },
        children,
      ),
    KeyboardAvoidingView: ({ children, ...props }: any) =>
      React.createElement(
        MockView,
        { testID: 'keyboard-avoiding-view', ...props },
        children,
      ),
  };
});

jest.mock('react-native-reanimated', () => {
  const { View: MockView } = jest.requireActual('react-native');

  return {
    __esModule: true,
    default: {
      View: MockView,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: jest.fn((value) => ({ value })),
    useAnimatedScrollHandler: jest.fn((handlers) => handlers.onScroll),
  };
});

describe('AppScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLayout.mockReturnValue({
      topInset: 12,
      bottomOffset: 24,
      topBarHeight: 70,
    });
  });

  it('should render scroll preset by default and update scrollY on scroll', () => {
    render(
      <AppScreen
        appBar={{
          title: 'Titulo',
          FooterComponent: <Text>Rodape</Text>,
          footerHeight: 30,
        }}
      >
        <Text>Conteudo</Text>
      </AppScreen>,
    );

    const root = screen.UNSAFE_getAllByType(View)[0];
    expect(root.props.style).toEqual({ paddingTop: 12 });

    const scroll = screen.getByTestId('keyboard-aware-scroll-view');
    expect(scroll.props.enabled).toBe(false);
    expect(scroll.props.bottomOffset).toBe(24);
    expect(scroll.props.contentContainerStyle).toEqual({
      flexGrow: 1,
      paddingTop: 100,
    });

    const appTopBarProps = mockAppTopBar.mock.calls[0][0] as {
      title: string;
      scrollY: { value: number };
    };

    expect(appTopBarProps.title).toBe('Titulo');
    expect(appTopBarProps.scrollY.value).toBe(0);

    scroll.props.onScroll({ contentOffset: { y: 45 } });

    expect(appTopBarProps.scrollY.value).toBe(45);
  });

  it('should apply zero safe area padding when disableSafeArea is true', () => {
    render(
      <AppScreen appBar={{ title: 'Titulo' }} disableSafeArea>
        <Text>Conteudo</Text>
      </AppScreen>,
    );

    const root = screen.UNSAFE_getAllByType(View)[0];

    expect(root.props.style).toEqual({ paddingTop: 0 });
  });

  it('should render fixed preset and dismiss keyboard on outside press', () => {
    const dismissSpy = jest
      .spyOn(Keyboard, 'dismiss')
      .mockImplementation(jest.fn());

    render(
      <AppScreen appBar={{ title: 'Titulo' }} preset="fixed" keyboardAvoiding>
        <Text>Conteudo fixo</Text>
      </AppScreen>,
    );

    const avoiding = screen.getByTestId('keyboard-avoiding-view');
    expect(avoiding.props.enabled).toBe(true);

    const touchable = screen.UNSAFE_getByType(TouchableWithoutFeedback);
    touchable.props.onPress();

    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should render list preset with function child and update topBarHeight only once', () => {
    const child = jest.fn(({ topBarHeight }: { topBarHeight: number }) => (
      <Text>{String(topBarHeight)}</Text>
    ));

    render(
      <AppScreen
        appBar={{
          title: 'Titulo',
          FooterComponent: <Text>Rodape</Text>,
          footerHeight: 20,
        }}
        preset="list"
      >
        {child}
      </AppScreen>,
    );

    expect(screen.getByText('90')).toBeTruthy();

    const layoutContainer = screen
      .UNSAFE_getAllByType(View)
      .find((view) => typeof view.props.onLayout === 'function');

    expect(layoutContainer).toBeTruthy();

    act(() => {
      layoutContainer!.props.onLayout({
        nativeEvent: { layout: { height: 130 } },
      });
    });

    expect(screen.getByText('130')).toBeTruthy();

    act(() => {
      layoutContainer!.props.onLayout({
        nativeEvent: { layout: { height: 200 } },
      });
    });

    expect(screen.queryByText('200')).toBeNull();
    expect(screen.getByText('130')).toBeTruthy();
    expect(child).toHaveBeenCalled();
  });

  it('should throw when using function children with unsupported presets', () => {
    const renderScroll = () =>
      render(
        <AppScreen appBar={{ title: 'Titulo' }} preset="scroll">
          {() => <Text>Func</Text>}
        </AppScreen>,
      );

    const renderFixed = () =>
      render(
        <AppScreen appBar={{ title: 'Titulo' }} preset="fixed">
          {() => <Text>Func</Text>}
        </AppScreen>,
      );

    expect(renderScroll).toThrow(
      'Preset "fixed" and "scroll" do not support function as children.',
    );
    expect(renderFixed).toThrow(
      'Preset "fixed" and "scroll" do not support function as children.',
    );
  });
});
