import { View } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';

import { Colors } from '../theme/colors';

import { AppText } from './AppText';

type AppToastProps = {
  title?: string;
  description?: string;
  type: 'success' | 'error' | 'info';
};

function AppToast({ title, description, type }: AppToastProps) {
  let typeBackgroundColor = '';
  let typeBorderColor = '';

  switch (type) {
    case 'error':
      typeBackgroundColor = 'bg-state-error';
      typeBorderColor = 'border-state-error';
      break;
    case 'info':
      typeBackgroundColor = 'bg-primary';
      typeBorderColor = 'border-primary';
      break;
    default:
      typeBackgroundColor = 'bg-state-success';
      typeBorderColor = 'border-state-success';
      break;
  }

  return (
    <View className="w-full px-6">
      <View
        className={`${typeBorderColor} flex-row bg-white border rounded-xl overflow-hidden`}
        style={{
          shadowColor: Colors.black,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        <View className={`w-[8px] h-[100%] ${typeBackgroundColor}`} />
        <View className="py-4 px-4 flex-1">
          <AppText size={14} weight={'medium'}>
            {title}
          </AppText>
          {description && (
            <AppText
              size={12}
              weight={'medium'}
              color={Colors.gray[100]}
              className="mt-1"
            >
              {description}
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <AppToast title={text1} description={text2} type="success" />
  ),
  error: ({ text1, text2 }) => (
    <AppToast title={text1} description={text2} type="error" />
  ),
  info: ({ text1, text2 }) => (
    <AppToast title={text1} description={text2} type="info" />
  ),
};
