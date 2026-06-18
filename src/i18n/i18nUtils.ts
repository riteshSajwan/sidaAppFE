import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';
import en from 'src/i18n/languages/en-US';
import fr from 'src/i18n/languages/fr';
import { LOCALES } from 'src/i18n/locales';

export const languageResources = {
  en: { translation: en[LOCALES['English']] },
  fr: { translation: fr[LOCALES['French']] }
};

function initializeLanguage() {
  return AsyncStorage.getItem(AsyncStorageKey.LANGUAGE_KEY)
    .then((savedLanguage) => {
      if (savedLanguage) {
        i18next.changeLanguage(savedLanguage);
        return;
      }
      const deviceLanguage = Localization.getLocales()[0].languageCode;
      if (deviceLanguage) {
        i18next.changeLanguage(deviceLanguage);
      }
    })
    .catch((err) => {
      console.error('Error initializing language:', err);
    });
}


function setUserLanguage(languageCode: string) {
  return AsyncStorage.setItem(AsyncStorageKey.LANGUAGE_KEY, languageCode)
    .then(() => {
      i18next.changeLanguage(languageCode);
    })
    .catch((err) => {
      console.error('Error setting user language:', err);
    });
}


async function updateUserLang(profileLang?: string) {
  const currentLanguage = i18next.language;
  if (profileLang?.length && profileLang != currentLanguage) {
    setUserLanguage(profileLang);
  }
}

function getCurrentLang() {
    return i18next.language;
}
const fallbackLang = LOCALES['English']
 

export { fallbackLang, getCurrentLang, initializeLanguage, setUserLanguage, updateUserLang };

