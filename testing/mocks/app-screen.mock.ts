type AppScreenRenderProps = {
  onScroll: unknown;
  topBarHeight: number;
  scrollY: unknown;
};

const defaultRenderProps: AppScreenRenderProps = {
  onScroll: jest.fn(),
  topBarHeight: 80,
  scrollY: { value: 0 },
};

let mockAppScreenProps: Record<string, unknown> = {};
let mockAppScreenRenderProps: AppScreenRenderProps = { ...defaultRenderProps };

export const setAppScreenMockRenderProps = (
  props: Partial<AppScreenRenderProps>,
) => {
  mockAppScreenRenderProps = {
    ...mockAppScreenRenderProps,
    ...props,
  };
};

export const getAppScreenMockProps = () => mockAppScreenProps;

export const resetAppScreenMock = () => {
  mockAppScreenProps = {};
  mockAppScreenRenderProps = { ...defaultRenderProps };
};

jest.mock('@/src/shared/components/AppScreen', () => ({
  AppScreen: ({
    children,
    appBar,
    ...rest
  }: {
    children:
      | React.ReactNode
      | ((props: AppScreenRenderProps) => React.ReactNode);
    appBar?: {
      HeaderComponent?: React.ReactNode;
      FooterComponent?: React.ReactNode;
      ActionButtonComponent?: React.ReactNode;
    };
  }) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');

    mockAppScreenProps = {
      appBar,
      ...rest,
    };

    const content =
      typeof children === 'function'
        ? children(mockAppScreenRenderProps)
        : children;

    return React.createElement(
      View,
      { testID: 'app-screen' },
      appBar?.HeaderComponent,
      appBar?.FooterComponent,
      appBar?.ActionButtonComponent,
      content,
    );
  },
}));
