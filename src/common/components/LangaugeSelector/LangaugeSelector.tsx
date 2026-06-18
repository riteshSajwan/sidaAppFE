import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import langaugeStyle from 'src/common/components/LangaugeSelector/LangaugeStyle';
import { getInitialValueOfLang, ILangInfo } from 'src/common/components/LangaugeSelector/LanguageSelectorUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import useAuthStatus from 'src/common/hook/useAuthStatus';
import useLangInfo from 'src/common/hook/useLangInfo';
import { getProfileDetail } from 'src/common/service/profile/action';
import { saveSettingsInfo } from 'src/common/service/profile/api';
import { getUserToken } from 'src/common/utils/tokenUtils';
import { getFirstAvailableValue } from 'src/common/utils/valueUtils';
import { IMinuteOption } from 'src/components/Business/BusinessListUtils';
import { setUserLanguage } from 'src/i18n/i18nUtils';
import { LOCALES } from 'src/i18n/locales';
import { AppDispatch, RootState } from 'src/store';

const LangaugeSelectorDropdown = () => {
  const userDetails = useSelector((state: RootState) => state.profile.data);
  const { langCode: initialLangCode } = useLangInfo();
  const { theme } = useAppTheme();
  const isAuthUser = useAuthStatus();
  const langCodeValue = getFirstAvailableValue(
    userDetails?.language,
    initialLangCode
  );
  const [langInfo, setLangInfo] = useState<ILangInfo>({
    ...getInitialValueOfLang(langCodeValue),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const languages = Object.entries(LOCALES).map(([key, value]) => ({
    label: key,
    value: value,
  }));
const dispatch: AppDispatch=useDispatch()
  const onChangeDropdown = (item: IMinuteOption) => {
    const langInfo = {
      langCode: item.value,
      language: item.label,
    };
    setLangInfo(langInfo);
    saveLangInfo(item);
  };

  useEffect(() => {
    setLangInfo({ ...getInitialValueOfLang(langCodeValue) });
  }, [langCodeValue]);

  // useEffect(() => {
  //   saveLangInfo();
  // }, [langInfo]);

function saveLangInfo(item: IMinuteOption) {
  const langInfo = {
    langCode: item.value,
    language: item.label,
  };

  setLoading(true);

  if (isAuthUser) {
    saveSettingsInfo(langInfo)
      .then((profile) => {
        // dispatch(profileData(profile));
        getUserToken()
      .then((token) => {
        if (token) {
          dispatch(getProfileDetail(token));
      }})})
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  } else {
    setLoading(false);
  }

  setUserLanguage(langInfo.langCode);
}


  return (
    <View style={langaugeStyle.cursor_Pointer}>
      <Customdropdown
        data={languages}
        selectedValue={{ label: '', value: langInfo.langCode }}
        onChange={onChangeDropdown}
        style={{ maxHeight: 40, width: 120, backgroundColor: theme.colors.surfaceInverse }}
      />
    </View>
  );
};

export default LangaugeSelectorDropdown;

