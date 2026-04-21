jest.mock('@/src/shared/hooks/useLayout', () => ({
  useLayout: () => ({
    topInset: 20,
    bottomInset: 16,
    bottomSpacing: 24,
    bottomOffset: 40,
  }),
}));
