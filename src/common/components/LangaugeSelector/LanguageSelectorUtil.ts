import { LOCALES } from 'src/i18n/locales';

export interface ILangInfo {
    langCode: string;
    language: string;
}

export interface ILangInfoData{
    optionLabel: string;
}  

function getInitialLangInfo() {
    return Object.entries(LOCALES)[0];
}

function getInitialValueOfLang(langCodeValue: string): ILangInfo {

    const langInfo = Object.entries(LOCALES).find(([_, val]) => val === langCodeValue);
    const [language, langCode] = langInfo || getInitialLangInfo();

    return {
        langCode,
        language,
    };
}


export enum LanguageConvert {
    ENGLISH = 'en',
    FRENCH = 'fr',
  }
export {
    getInitialValueOfLang,
    getInitialLangInfo,
}
