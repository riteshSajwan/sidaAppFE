import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, Pressable, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useUserStyle } from 'src/common/assets/styles/user';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import {
    ChangePasswordError
} from 'src/common/components/ErrorMessage/errorMsg';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { NewPassword } from 'src/common/model/changePassword/changePassword';
import { logout } from 'src/common/service/auth/action';
import { changePasswordAction } from 'src/common/service/profile/action';
import { resetChangePassword } from 'src/common/service/profile/slice';
import styles from 'src/components/Profile/ChangePassword/ChangePasswordStyle';
import { IPasswordError } from 'src/components/Profile/ChangePassword/ChangePasswordUtil';
import { validateForm } from 'src/components/Profile/ChangePassword/validationChangePassword';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const ChangePassword = () => {
  const { t: TranslateMessage } = useTranslation();
  const userStyle = useUserStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const {theme} = useAppTheme();
  const dispatch: AppDispatch = useDispatch();
  const [flag, setFlag] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState<NewPassword>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordError, setPasswordError] = useState<IPasswordError>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    apiError: '',
  });
  const {isPasswordChanged, loading, error} = useSelector((state: RootState) => state.profile.changePassword);

  useEffect(() => {
    if (flag) {
      let newError = validateForm(password);
      setPasswordError({ ...newError.errors });
    }
  }, [password]);

  function checkOldPassword() {
    setPasswordError((prevState) => ({
      ...prevState,
      oldPassword: TranslateMessage('Admin.Delivery.App.Old.Password.Wrong'),
    }));
  }

  function checkSomethingWentWrong() {
    setPasswordError((prevState) => ({
      ...prevState,
      apiError: TranslateMessage('Admin.Delivery.App.SomethingWentWrong'),
    }));
  }

  const handleTextChange = (fieldName: string) => (text: string) => {
    setPassword({ ...password, [fieldName]: text });
  };

  const reject = (error: string) => {
    if (error === ChangePasswordError.OLD_PASSWORD) {
      checkOldPassword();
    }

    if (error === ChangePasswordError.SOMETHING_WRONG) {
      checkSomethingWentWrong();
    }
  };
  const resolve = () => {
    setPassword({
      ...password,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setFlag(false);
    dispatch(logout());
    router.replace(Routes.LOGIN);
  };

  const handleChangePassword = async () => {
    if (loading) return;
    setFlag(true);
    let newError = validateForm(password);

    if (!newError.isErrorPresent) {
        dispatch(changePasswordAction(password));
     
    } else {
      setPasswordError({ ...newError.errors });
    }
  };

  useEffect(()=>{
    if(isPasswordChanged){
        resolve();
    }

    return () =>{
      dispatch(resetChangePassword())
    }

  },[isPasswordChanged])

    useEffect(()=>{
    if(error){
        reject(error);
    }

  },[error])

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }

  function renderInputField(
    label: string,
    name: string,
    error: string,
    values: string,
    showPassword: boolean,
    toggleShow: () => void
  ) {
    return (
      <View style={[formStyle.formRow, formStyle.noMargin]}>
        <View style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>{label}</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={[userStyle.formInput, error != '' && formStyle.errorBorderColor]}
              placeholder={label}
              placeholderTextColor={theme.colors.textNeutral}
              mode='outlined'
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderErrorInverse}
              outlineColor={theme.colors.borderMedium}
              value={values}
              onChangeText={handleTextChange(name)}
              secureTextEntry={!showPassword}
              contentStyle={formStyle.inputPlaceholderLabel}
            />
            <Pressable onPress={toggleShow} style={userStyle.iconButton}>
              <Icon name={showPassword ? 'eye' : 'eyeOff'} size={25} color={theme.colors.iconBase} spacing={5} />
            </Pressable>
          </View>
          {renderErrorMsgSection(error)}
        </View>
      </View>
    );
  }

  function renderSomethingWentWrong() {
    return (
      <View style={styles.wentWrongError}>
        {passwordError.apiError ? (
          <ErrorMessageContainer message={passwordError.apiError} />
        ) : null}
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('src/common/assets/images/bg-image.png')}
      resizeMode='cover'
      style={userStyle.backgroundImg}
    >
      <View style={styles.main}>
        <View style={userStyle.formLayout}>
          <Loader loading={loading} />
          <Text style={userStyle.heading}>{TranslateMessage('Admin.Delivery.App.Restaurants.ChangePassword')}</Text>
          {renderInputField(
            TranslateMessage('Admin.Delivery.App.Restaurants.CurrentPassword'),
            'oldPassword',
            passwordError.oldPassword,
            password.oldPassword,
            showOldPassword,
            () => setShowOldPassword(!showOldPassword)
          )}
          {renderInputField(
            TranslateMessage('Admin.Delivery.App.Restaurants.NewPassword'),
            'newPassword',
            passwordError.newPassword,
            password.newPassword,
            showNewPassword,
            () => setShowNewPassword(!showNewPassword)
          )}
          {renderInputField(
            TranslateMessage('Admin.Delivery.App.Restaurants.Confirm Password'),
            'confirmNewPassword',
            passwordError.confirmNewPassword,
            password.confirmNewPassword,
            showConfirmPassword,
            () => setShowConfirmPassword(!showConfirmPassword)
          )}
          {renderSomethingWentWrong()}

          <Pressable style={styles.loginBtn} onPress={handleChangePassword}>
            <Text style={[button.btn, button.btnPrimary]}>{ TranslateMessage('Admin.Delivery.App.Submit')}</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ChangePassword;
