import { Trans } from 'react-i18next';
import i18n from 'src/i18n/i18nConfig';

type TranslationOptions = Record<string, string>;

export const translateMessage = (
  key: string,
  options: TranslationOptions = {},
): string => {
  const result = i18n.t(key, options);
  return typeof result === 'string' ? result : '';
};

export const translateMessageWithReactElement = (
  key: string,
  components = {},
  options = {},
) => {
  const props = {
    i18nKey: key,
    values: { ...options },
    components: { ...components },
  };

  return <Trans {...props} />;
};
