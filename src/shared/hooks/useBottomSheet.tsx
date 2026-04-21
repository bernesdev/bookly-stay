import { useMemo } from 'react';

import { useBottomSheetStore } from './useBottomSheetStore';

export function useBottomSheet() {
  const showSheet = useBottomSheetStore((state) => state.showSheet);
  const hideSheet = useBottomSheetStore((state) => state.hideSheet);

  return useMemo(
    () => ({
      showSheet,
      hideSheet,
    }),
    [showSheet, hideSheet],
  );
}
