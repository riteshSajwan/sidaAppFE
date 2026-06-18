import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from 'src/i18n/languages/en-US';
import fr from 'src/i18n/languages/fr';
import { LOCALES } from 'src/i18n/locales';

export const languageResources = {
  en: { translation: en[LOCALES['English']] },
  fr: { translation: fr[LOCALES['French']] },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  resources: languageResources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
