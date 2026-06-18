import { LocaleConfig } from 'react-native-calendars';
import { fallbackLang, getCurrentLang } from 'src/i18n/i18nUtils';
import { LOCALES } from 'src/i18n/locales';
 
LocaleConfig.locales.en = LocaleConfig.locales[''];
LocaleConfig.locales.fr = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ],
  monthNamesShort: [
    'Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'
  ],
  dayNames: [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
    'Jeudi', 'Vendredi', 'Samedi'
  ],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
};
 
export const setCalendarLocale = () => {
  const language = getCurrentLang();
  LocaleConfig.defaultLocale = Object.values(LOCALES).includes(language) ? language : fallbackLang;
};