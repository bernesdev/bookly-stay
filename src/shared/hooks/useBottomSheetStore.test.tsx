import React from 'react';

import { useBottomSheetStore } from './useBottomSheetStore';

describe('useBottomSheetStore', () => {
  beforeEach(() => {
    useBottomSheetStore.setState({
      ref: null,
      body: null,
      showHandleIndicator: true,
      preventDismiss: false,
      fullHeight: false,
    });
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const state = useBottomSheetStore.getState();

    expect(state.ref).toBeNull();
    expect(state.body).toBeNull();
    expect(state.showHandleIndicator).toBe(true);
    expect(state.preventDismiss).toBe(false);
    expect(state.fullHeight).toBe(false);
  });

  it('should set ref using setRef', () => {
    const ref = {
      current: {
        present: jest.fn(),
        dismiss: jest.fn(),
      },
    } as any;

    useBottomSheetStore.getState().setRef(ref);

    expect(useBottomSheetStore.getState().ref).toBe(ref);
  });

  it('should show sheet with default options and present modal', () => {
    const present = jest.fn();
    const ref = { current: { present, dismiss: jest.fn() } } as any;
    const body = React.createElement('Text', null, 'sheet body');

    useBottomSheetStore.getState().setRef(ref);
    useBottomSheetStore.getState().showSheet(body);

    const state = useBottomSheetStore.getState();
    expect(state.body).toBe(body);
    expect(state.showHandleIndicator).toBe(true);
    expect(state.preventDismiss).toBe(false);
    expect(state.fullHeight).toBe(false);
    expect(present).toHaveBeenCalledTimes(1);
  });

  it('should show sheet with custom options', () => {
    const present = jest.fn();
    const ref = { current: { present, dismiss: jest.fn() } } as any;
    const body = React.createElement('Text', null, 'custom body');

    useBottomSheetStore.getState().setRef(ref);
    useBottomSheetStore.getState().showSheet(body, {
      showHandleIndicator: false,
      preventDismiss: true,
      fullHeight: true,
    });

    const state = useBottomSheetStore.getState();
    expect(state.body).toBe(body);
    expect(state.showHandleIndicator).toBe(false);
    expect(state.preventDismiss).toBe(true);
    expect(state.fullHeight).toBe(true);
    expect(present).toHaveBeenCalledTimes(1);
  });

  it('should not throw when showing sheet without ref', () => {
    const body = React.createElement('Text', null, 'no ref');

    expect(() => useBottomSheetStore.getState().showSheet(body)).not.toThrow();
    expect(useBottomSheetStore.getState().body).toBe(body);
  });

  it('should hide sheet and dismiss modal with duration', () => {
    const dismiss = jest.fn();
    const ref = { current: { present: jest.fn(), dismiss } } as any;

    useBottomSheetStore.getState().setRef(ref);
    useBottomSheetStore.getState().hideSheet();

    expect(dismiss).toHaveBeenCalledWith({ duration: 300 });
  });

  it('should not throw when hiding sheet without ref', () => {
    expect(() => useBottomSheetStore.getState().hideSheet()).not.toThrow();
  });
});
