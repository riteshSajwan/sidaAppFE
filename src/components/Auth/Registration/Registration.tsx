import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useUserStyle } from 'src/common/assets/styles/user';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import LangaugeSelectorDropdown from 'src/common/components/LangaugeSelector/LangaugeSelector';
import { useAppTheme } from 'src/common/context/AppTheme';
import { SignInRequestDto } from 'src/common/model/auth/login';
import { clearLoginErrors } from 'src/common/service/auth/action';
import { ILoginData } from 'src/common/service/auth/slice';
import { LoginFormValidation } from 'src/components/Auth/Login/LoginValidations';
import { BUNDLE_ID } from 'src/constants';
import { initializeLanguage } from 'src/i18n/i18nUtils';
import { AppDispatch, RootState } from 'src/store/index';

const getSearchParamValue = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const Registration = () => {
  const { t: TranslateMessage } = useTranslation();
  const {theme} = useAppTheme();
  const userStyle = useUserStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();

  const dispatch: AppDispatch = useDispatch();
  const loginState = useSelector((state: RootState) => state.login) as ILoginData;
  const userDetails = useSelector((state: RootState) => state.profile.data);
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const routeBundleId = getSearchParamValue(id);
  const tenantLookupId = BUNDLE_ID || routeBundleId;

  const [loginForm, setLoginForm] = useState<SignInRequestDto>({
    username: '',
    password: '',
    deviceToken: '',
    admin: true
  });
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    password: '',
  });
  const [loginError, setLoginError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);





  useEffect(() => {
    if (showValidationError) {
      const checkValidation = LoginFormValidation(loginForm);
      const isValid = Object.keys(checkValidation).length === 0;
      const isLoginError = !!loginError;

      if (!isValid) {
        if (!isLoginError) {
          setValidationErrors({
            ...checkValidation,
          });
        } else {
          setShowValidationError(false);
        }
      } else {
        if (!isLoginError) {
          setValidationErrors({
            ...checkValidation,
          });
        }
        setShowValidationError(false);
      }
    }
  }, [loginForm, loginError, showValidationError]);


  const onEmailChange = (text: string) => {
    setLoginForm({ ...loginForm, username: text });
    dispatch(clearLoginErrors());
  };

  const onPasswordChange = (password: string) => {
    setLoginForm({ ...loginForm, password });
    dispatch(clearLoginErrors());
  };

  const handleSubmit = () => {
    try {
      

    } catch {
      setLoading(false);
    }
  };

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }

  useEffect(() => {
    initializeLanguage();
  }, [])

  return (
    <>
      
        <View style={userStyle.languageSelector}>
          <LangaugeSelectorDropdown />
        </View>

    </>
  );
};

export default Registration;
