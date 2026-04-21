import { getLocales } from 'expo-localization';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: getLocales()[0]?.languageCode ?? 'en',
  defaultNS: 'translation',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
