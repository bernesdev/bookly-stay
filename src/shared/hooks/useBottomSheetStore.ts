import { create } from 'zustand';

import { BottomSheetStore } from '../store/bottomSheet.store';

export const useBottomSheetStore = create<BottomSheetStore>((set, get) => ({
  // state
  ref: null,
  body: null,
  showHandleIndicator: true,
  preventDismiss: false,
  fullHeight: false,

  // actions
  setRef: (ref) => set({ ref }),
  showSheet: (
    body,
    options = {
      showHandleIndicator: true,
      preventDismiss: false,
      fullHeight: false,
    },
  ) => {
    const { showHandleIndicator, preventDismiss, fullHeight } = options;
    set({ body, showHandleIndicator, preventDismiss, fullHeight });
    get().ref?.current?.present();
  },
  hideSheet: () => get().ref?.current?.dismiss({ duration: 300 }),
}));
