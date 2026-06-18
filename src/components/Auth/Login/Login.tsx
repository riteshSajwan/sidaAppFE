import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Pressable,
    TextInput as RNTextInput,
    Text,
    View
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import BrandLogo from 'src/common/assets/images/brandLogo.svg';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useUserStyle } from 'src/common/assets/styles/user';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { LoginAuthMessages, LoginErrorMessage } from 'src/common/components/ErrorMessage/errorMsg';
import LangaugeSelectorDropdown from 'src/common/components/LangaugeSelector/LangaugeSelector';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { SignInRequestDto } from 'src/common/model/auth/login';
import { clearLoginErrors, loginRequest } from 'src/common/service/auth/action';
import { ILoginData } from 'src/common/service/auth/slice';
import { getTenantInfo } from 'src/common/service/tenant/api';
import { getDeviceToken } from 'src/common/utils/getDeviceToken';
import { getTenantId, setTenantId } from 'src/common/utils/tenantUtils';
import { LoginFormValidation } from 'src/components/Auth/Login/LoginValidations';
import { BUNDLE_ID, IS_SAAS } from 'src/constants';
import { initializeLanguage } from 'src/i18n/i18nUtils';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store/index';
import { Icon } from 'src/submodules/iconlibrary/src';

const getSearchParamValue = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const LoginContainer = () => {
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
  const [resolvedTenantId, setResolvedTenantId] = useState<string | null | undefined>(null);

  const passwordRef = useRef<RNTextInput>(null);

  const resolveTenantId = useCallback(() => {
    if (!IS_SAAS || !tenantLookupId) {
      return Promise.resolve<string | null>(null);
    }

    return getTenantInfo(tenantLookupId)
      .then((response) => {
        if (response.success && response.tenantId) {
          return setTenantId(response.tenantId).then(() => response.tenantId);
        }

        return getTenantId();
      })
      .catch(() => getTenantId());
  }, [tenantLookupId]);

  useEffect(() => {
    let isMounted = true;

    resolveTenantId().then((tenantId) => {
      if (isMounted) {
        setResolvedTenantId(tenantId);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [resolveTenantId]);

  useEffect(() => {
    if (loginState.success && userDetails) {
      setLoading(false);
      
      try {
          router.replace(Routes.DASHBOARD);
      } catch { }
    }
  }, [loginState, userDetails]);

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

  useEffect(() => {
    if (loginState.error) {
      const errorCode = loginState.error;
      let customMessage = '';
      if (
        errorCode.code === 'auth.blocked.user'
      ) {
        customMessage = loginState.error.message;
      } else {
        customMessage = TranslateMessage(LoginErrorMessage[errorCode.code as LoginAuthMessages] as string) || TranslateMessage(LoginErrorMessage[errorCode.code as LoginAuthMessages] as string) || 'Something went wrong.Try Again';
      }
      setLoginError(customMessage);
      setLoginForm({ username: '', password: '', deviceToken: '', admin: true });
    } else {
      setLoginError('');
    }

    setLoading(false);
  }, [loginState.error, loginState.code, TranslateMessage]);

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
      setShowValidationError(true);
      dispatch(clearLoginErrors());
      const checkValidation = LoginFormValidation(loginForm);
      const isValid = Object.keys(checkValidation).length === 0;
      
      setValidationErrors({
        ...checkValidation,
      });

      if (!isValid) {
        return;
      }

      setLoading(true);

      let payload = {
        username: loginForm.username.trim(),
        password: loginForm.password.trim(),
        deviceToken: getDeviceToken() ?? '',
        admin: true,
      };
      const loginWithTenant = (tenantId: string | null | undefined) => {
        dispatch(loginRequest(payload, tenantId));
      };

      if (tenantLookupId && !resolvedTenantId) {
        resolveTenantId()
          .then((tenantId) => {
            setResolvedTenantId(tenantId);
            loginWithTenant(tenantId);
          })
          .catch(() => loginWithTenant(null));
        return;
      }

      loginWithTenant(resolvedTenantId);
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
      <Loader loading={loading} />
        <View style={userStyle.languageSelector}>
          <LangaugeSelectorDropdown />
        </View>

        <View style={userStyle.loginMain}>
          <View style={userStyle.logoHeader}>
          <BrandLogo width={500} height={100} color={theme.colors.iconBase} />
          </View>
          <View style={userStyle.formLayout}>
            <View>
              <Text style={userStyle.heading}>
                {TranslateMessage('Admin.Delivery.App.LogIn.Label')}
              </Text>

              <View style={[formStyle.formRow, {marginBottom: theme.spacing.xxl}]}>
                <View style={formStyle.formCol}>
                  <Text style={formStyle.labelTitle}>
                    {TranslateMessage('Admin.Delivery.App.LogIn.UserEmail')}
                  </Text>
                  <TextInput
                    style={[
                      formStyle.inputField,
                      validationErrors.username !== undefined &&
                      validationErrors.username !== '' &&
                      formStyle.errorBorderColor,
                    ]}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                    returnKeyType="next"
                    placeholderTextColor={theme.colors.textNeutral}
                    value={loginForm.username}
                    onChangeText={onEmailChange}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    autoCapitalize="none"
                    mode="outlined"
                    activeOutlineColor={theme.colors.borderErrorInverse}
                    outlineColor={theme.colors.borderMedium}
                    placeholder={TranslateMessage('Admin.Delivery.App.Example', {
                      type: 'johndoe@example.com',
                    })}
                    contentStyle={[
                      formStyle.textInputLabel
                    ]}
                    outlineStyle={formStyle.inputFieldOuline}
                  />
                  {renderErrorMsgSection(validationErrors.username)}
                </View>
              </View>

              <View style={[formStyle.formRow, formStyle.noMargin]}>
                <View style={formStyle.formCol}>
                  <Text style={formStyle.labelTitle}>
                    {TranslateMessage('Admin.Delivery.App.LogIn.PasswordLabel')}
                  </Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      ref={passwordRef}
                      style={[
                        formStyle.inputField,
                        validationErrors.username !== undefined &&
                        validationErrors.password !== '' &&
                        formStyle.errorBorderColor,
                      ]}
                      autoComplete="off"
                      textContentType="none"
                      importantForAutofill="no"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                      placeholderTextColor={theme.colors.textNeutral}
                      secureTextEntry={!showPassword}
                      value={loginForm.password}
                      onChangeText={onPasswordChange}
                      autoCapitalize="none"
                      mode="outlined"
                    activeOutlineColor={theme.colors.borderErrorInverse}
                    outlineColor={theme.colors.borderMedium}
                      placeholder={TranslateMessage('Admin.Delivery.App.Example', {
                        type: 'YourSecurePassword123',
                      })}
                      contentStyle={[
                        formStyle.textInputLabel
                      ]}
                      outlineStyle={formStyle.inputFieldOuline}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} style={userStyle.iconButton}>
                      <Icon name={showPassword ? 'eye' : 'eyeOff'} size={25} color={theme.colors.iconBase} spacing={5}/>
                    </Pressable>
                  </View>
                  {renderErrorMsgSection(validationErrors.password)}
                </View>
              </View>
            </View>

            {renderErrorMsgSection(loginError)}

            <View style={userStyle.loginBtn}>
              <Pressable onPress={handleSubmit}>
                <Text style={[button.btnBase, button.btnPrimary]}>
                  {TranslateMessage('Admin.Delivery.App.LogIn.Continue')}
                </Text>
              </Pressable>
            </View>
         </View>
        </View>
    </>
  );
};

export default LoginContainer;
