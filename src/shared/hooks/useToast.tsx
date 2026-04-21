import Toast from 'react-native-toast-message';

import { useLayout } from './useLayout';

type ToastParams = {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
};

export function useToast() {
  const { bottomInset } = useLayout();

  const showToast = ({ title, description, type }: ToastParams) => {
    Toast.show({
      type,
      text1: title,
      text2: description,
      position: 'bottom',
      bottomOffset: bottomInset + 16,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  return { showToast };
}
