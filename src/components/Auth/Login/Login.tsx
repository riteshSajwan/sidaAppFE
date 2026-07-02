import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Pressable,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useFormStyle } from 'src/common/assets/styles/form';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { LoginAuthMessages, LoginErrorMessage } from 'src/common/components/ErrorMessage/errorMsg';
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
import type { IconName } from 'src/submodules/iconlibrary/src/assets/icons/index';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_WIDE = SCREEN_WIDTH >= 900;

const getSearchParamValue = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

// Feature items shown on the left panel
const FEATURES: { icon: IconName; label: string }[] = [
  { icon: 'page', label: 'Building Permit Applications' },
  { icon: 'home', label: 'Occupancy Certificates' },
  { icon: 'pinAlt', label: 'Map & Layout Approval' },
  { icon: 'building', label: 'Property Registration' },
];

const STATS = [
  { value: '2M+', label: 'Citizens' },
  { value: '50K+', label: 'Applications' },
  { value: '99.9%', label: 'Uptime' },
];

const LoginContainer = () => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const formStyle = useFormStyle();

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
    admin: true,
  });
  const [validationErrors, setValidationErrors] = useState({ username: '', password: '' });
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
      if (isMounted) setResolvedTenantId(tenantId);
    });
    return () => { isMounted = false; };
  }, [resolveTenantId]);

  useEffect(() => {
    if (loginState.success && userDetails) {
      setLoading(false);
      try { router.replace(Routes.DASHBOARD); } catch { }
    }
  }, [loginState, userDetails]);

  useEffect(() => {
    if (showValidationError) {
      const checkValidation = LoginFormValidation(loginForm);
      const isValid = Object.keys(checkValidation).length === 0;
      const isLoginError = !!loginError;
      if (!isValid) {
        if (!isLoginError) setValidationErrors({ ...checkValidation });
        else setShowValidationError(false);
      } else {
        if (!isLoginError) setValidationErrors({ ...checkValidation });
        setShowValidationError(false);
      }
    }
  }, [loginForm, loginError, showValidationError]);

  useEffect(() => {
    if (loginState.error) {
      const errorCode = loginState.error;
      let customMessage = '';
      if (errorCode.code === 'auth.blocked.user') {
        customMessage = loginState.error.message;
      } else {
        customMessage =
          TranslateMessage(LoginErrorMessage[errorCode.code as LoginAuthMessages] as string) ||
          'Something went wrong. Try Again';
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
      setValidationErrors({ ...checkValidation });
      if (!isValid) return;
      setLoading(true);
      const payload = {
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

  useEffect(() => { initializeLanguage(); }, []);

  const styles = StyleSheet.create({
    // Full-screen wrapper with blue gradient background
    screenWrapper: {
      flex: 1,
      backgroundColor: '#1a3fbd',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100%',
    },
    // The centered card that holds both panels
    card: {
      flexDirection: IS_WIDE ? 'row' : 'column',
      borderRadius: 20,
      overflow: 'hidden',
      width: IS_WIDE ? 860 : '92%',
      maxWidth: 900,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 16,
    },
    // ── Left panel ──────────────────────────────────────────
    leftPanel: {
      flex: IS_WIDE ? 1 : undefined,
      backgroundColor: '#0D2580',
      padding: IS_WIDE ? 40 : 28,
      justifyContent: 'space-between',
    },
    leftPanelContent: {
      flex: 1,
    },
    leftTitle: {
      fontSize: IS_WIDE ? 28 : 22,
      fontFamily: theme.fontFamily.bold,
      color: '#FFFFFF',
      lineHeight: IS_WIDE ? 38 : 30,
      marginBottom: 16,
    },
    leftSubtitle: {
      fontSize: 14,
      fontFamily: theme.fontFamily.regular,
      color: 'rgba(255,255,255,0.75)',
      lineHeight: 22,
      marginBottom: 32,
    },
    featureList: {
      gap: 14,
      marginBottom: 40,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    featureIconBox: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: 'rgba(255,255,255,0.12)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureLabel: {
      fontSize: 14,
      fontFamily: theme.fontFamily.medium,
      color: 'rgba(255,255,255,0.9)',
    },
    statsRow: {
      flexDirection: 'row',
      gap: IS_WIDE ? 32 : 20,
      marginTop: IS_WIDE ? 0 : 8,
    },
    statItem: {
      alignItems: 'flex-start',
    },
    statValue: {
      fontSize: 22,
      fontFamily: theme.fontFamily.bold,
      color: '#FFFFFF',
      lineHeight: 28,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: theme.fontFamily.regular,
      color: 'rgba(255,255,255,0.65)',
    },
    // ── Right panel ─────────────────────────────────────────
    rightPanel: {
      flex: IS_WIDE ? 1 : undefined,
      backgroundColor: '#FFFFFF',
      padding: IS_WIDE ? 44 : 28,
      justifyContent: 'center',
    },
    brandName: {
      fontSize: 32,
      fontFamily: theme.fontFamily.bold,
      color: '#1a237e',
      letterSpacing: 1,
      marginBottom: 6,
    },
    welcomeHeading: {
      fontSize: 22,
      fontFamily: theme.fontFamily.bold,
      color: '#151515',
      marginBottom: 4,
    },
    welcomeSubtitle: {
      fontSize: 14,
      fontFamily: theme.fontFamily.regular,
      color: '#838383',
      marginBottom: 28,
    },
    fieldLabel: {
      fontSize: 11,
      fontFamily: theme.fontFamily.semiBold,
      color: '#555',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    fieldWrapper: {
      marginBottom: 18,
    },
    passwordRow: {
      position: 'relative',
    },
    eyeBtn: {
      position: 'absolute',
      right: 10,
      top: 12,
    },
    forgotRow: {
      alignItems: 'flex-end',
      marginTop: 6,
      marginBottom: 24,
    },
    forgotText: {
      fontSize: 13,
      fontFamily: theme.fontFamily.semiBold,
      color: '#1a3fbd',
    },
    signInBtn: {
      backgroundColor: '#1a3fbd',
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 18,
    },
    signInBtnText: {
      fontSize: 16,
      fontFamily: theme.fontFamily.semiBold,
      color: '#FFFFFF',
    },
    registerRow: {
      alignItems: 'center',
      marginBottom: 24,
    },
    registerText: {
      fontSize: 13,
      fontFamily: theme.fontFamily.regular,
      color: '#838383',
    },
    registerLink: {
      fontSize: 13,
      fontFamily: theme.fontFamily.semiBold,
      color: '#1a3fbd',
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
    },
    footerLink: {
      fontSize: 12,
      fontFamily: theme.fontFamily.regular,
      color: '#A7A7A7',
    },
  });

  return (
    <>
      <Loader loading={loading} />
      <ScrollView
        contentContainerStyle={styles.screenWrapper}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* ── Left panel ── */}
          <View style={styles.leftPanel}>
            <View style={styles.leftPanelContent}>
              <Text style={styles.leftTitle}>
                Smart City{'\n'}Building Services
              </Text>
              <Text style={styles.leftSubtitle}>
                Apply for Building Permits, Occupancy Certificates, Map Approvals, and Property
                Registration — all in one secure digital platform.
              </Text>

              <View style={styles.featureList}>
                {FEATURES.map((feature) => (
                  <View key={feature.label} style={styles.featureItem}>
                    <View style={styles.featureIconBox}>
                      <Icon name={feature.icon} size={18} color="#FFFFFF" spacing={0} />
                    </View>
                    <Text style={styles.featureLabel}>{feature.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.statsRow}>
              {STATS.map((stat) => (
                <View key={stat.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Right panel ── */}
          <View style={styles.rightPanel}>
            <Text style={styles.brandName}>SIDA</Text>
            <Text style={styles.welcomeHeading}>Welcome back</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to your citizen account</Text>

            {/* Username / Email */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>
                {TranslateMessage('Admin.Sida.App.LogIn.UserEmail')}
              </Text>
              <TextInput
                style={[
                  formStyle.inputField,
                  validationErrors.username !== '' && formStyle.errorBorderColor,
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
                activeOutlineColor="#1a3fbd"
                outlineColor={theme.colors.borderMedium}
                placeholder={TranslateMessage('Admin.Sida.App.LogIn.UserEmailPlaceholder', {
                  type: 'johndoe@example.com',
                })}
                contentStyle={formStyle.textInputLabel}
                outlineStyle={formStyle.inputFieldOuline}
              />
              <ErrorMessageContainer message={validationErrors.username} />
            </View>

            {/* Password */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>
                {TranslateMessage('Admin.Sida.App.LogIn.PasswordLabel')}
              </Text>
              <View style={styles.passwordRow}>
                <TextInput
                  ref={passwordRef}
                  style={[
                    formStyle.inputField,
                    validationErrors.password !== '' && formStyle.errorBorderColor,
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
                  activeOutlineColor="#1a3fbd"
                  outlineColor={theme.colors.borderMedium}
                  placeholder={TranslateMessage('Admin.Sida.App.LogIn.PasswordPlaceholder', {
                    type: 'YourSecurePassword123',
                  })}
                  contentStyle={formStyle.textInputLabel}
                  outlineStyle={formStyle.inputFieldOuline}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <Icon
                    name={showPassword ? 'eye' : 'eyeOff'}
                    size={22}
                    color={theme.colors.iconBase}
                    spacing={0}
                  />
                </Pressable>
              </View>
              <ErrorMessageContainer message={validationErrors.password} />
            </View>

            {/* Forgot password */}
            <View style={styles.forgotRow}>
              <Pressable accessibilityRole="button">
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            {/* Login error */}
            {!!loginError && <ErrorMessageContainer message={loginError} />}

            {/* Sign In button */}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.signInBtn,
                pressed && { opacity: 0.85 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Sign In Securely"
            >
              <Text style={styles.signInBtnText}>
                {TranslateMessage('Admin.Sida.App.LogIn.Continue')}
              </Text>
            </Pressable>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>
                New citizen?{' '}
                <Text style={styles.registerLink}>Register here</Text>
              </Text>
            </View>

            {/* Footer links */}
            <View style={styles.footerRow}>
              <Pressable accessibilityRole="link">
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </Pressable>
              <Pressable accessibilityRole="link">
                <Text style={styles.footerLink}>Terms of Use</Text>
              </Pressable>
              <Pressable accessibilityRole="link">
                <Text style={styles.footerLink}>Help</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default LoginContainer;
