import { useEffect, useRef } from 'react';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';

import { useBottomSheetStore } from '../hooks/useBottomSheetStore';
import { useLayout } from '../hooks/useLayout';
import { Colors } from '../theme/colors';

export function AppBottomSheet() {
  const { bottomInset } = useLayout();

  const ref = useRef<BottomSheetModal>(null);

  const body = useBottomSheetStore((state) => state.body);
  const showHandleIndicator = useBottomSheetStore(
    (state) => state.showHandleIndicator,
  );
  const preventDismiss = useBottomSheetStore((state) => state.preventDismiss);
  const fullHeight = useBottomSheetStore((state) => state.fullHeight);
  const setRef = useBottomSheetStore((state) => state.setRef);

  useEffect(() => setRef(ref), [setRef]);

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing={!fullHeight}
      snapPoints={['100%']}
      handleIndicatorStyle={
        showHandleIndicator ? styles.handleIndicator : { height: 0 }
      }
      backgroundStyle={styles.background}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior={preventDismiss ? 'none' : 'close'}
        />
      )}
    >
      <BottomSheetView style={{ paddingBottom: bottomInset + 16 }}>
        {body}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: Colors.border,
    width: 60,
    height: 5,
    marginTop: 18,
    marginBottom: 24,
  },
  background: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
