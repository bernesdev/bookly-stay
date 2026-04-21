jest.mock('react-i18next', () => {
  const t = (key: string) => `t:${key}`;

  return {
    useTranslation: () => ({ t }),
  };
});
