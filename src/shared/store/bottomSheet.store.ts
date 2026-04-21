import { RefObject } from 'react';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

type BottomSheetState = {
  ref: RefObject<BottomSheetModal | null> | null;
  body: React.ReactNode;
  showHandleIndicator: boolean;
  preventDismiss: boolean;
  fullHeight: boolean;
};

type BottomSheetActions = {
  showSheet: (
    body: React.ReactNode,
    options?: Partial<
      Pick<
        BottomSheetState,
        'showHandleIndicator' | 'preventDismiss' | 'fullHeight'
      >
    >,
  ) => void;
  hideSheet: () => void;
  setRef: (ref: RefObject<BottomSheetModal | null>) => void;
};

export type BottomSheetStore = BottomSheetState & BottomSheetActions;
