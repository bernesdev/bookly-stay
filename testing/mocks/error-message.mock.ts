jest.mock('@/src/shared/components/ErrorMessage', () => ({
  ErrorMessage: ({
    title,
    message,
    buttonTitle,
    onPress,
  }: {
    title: string;
    message: string;
    buttonTitle?: string;
    onPress?: () => void;
  }) => {
    const React = jest.requireActual('react');
    const { Pressable, Text, View } = jest.requireActual('react-native');
    const resolvedButtonTitle = buttonTitle ?? 't:shared.errorMessage.retry';

    return React.createElement(
      View,
      { testID: 'error-message' },
      React.createElement(Text, null, title),
      React.createElement(Text, null, message),
      React.createElement(
        Pressable,
        { testID: 'error-retry', onPress },
        React.createElement(Text, null, resolvedButtonTitle),
      ),
      React.createElement(Pressable, { testID: 'error-button', onPress }, null),
      React.createElement(
        Pressable,
        { testID: 'error-message-press', onPress },
        null,
      ),
    );
  },
}));
