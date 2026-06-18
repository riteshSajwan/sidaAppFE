import { useEffect, useState } from 'react';
import { getAsyncStorageItem } from 'src/common/utils/getAsyncStorageItem';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';

const useLangInfo = () => {
  const [langCode, setLangCode] = useState<string>('');

  const getLangInfo = () => {
    getAsyncStorageItem(AsyncStorageKey.LANGUAGE_KEY)
      .then((storedLang) => {
        if (storedLang) {
          setLangCode(storedLang);
        }
      })
      .catch(() => {
      });
  };

  useEffect(() => {
    getLangInfo();
  }, []);

  return { langCode };
};

export default useLangInfo;
