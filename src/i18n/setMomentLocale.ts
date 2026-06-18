import moment from 'moment';
import 'src/i18n/momentLocaleIndex';

export function setMomentLocale (locale: string | undefined) {
    moment.locale(locale || 'en'); 
};

  