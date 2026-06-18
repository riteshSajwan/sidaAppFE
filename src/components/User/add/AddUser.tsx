import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUserStyle } from 'src/common/assets/styles/user';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import CustomSnackbar, {
    SnackbarType,
} from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchRolesDropdownAction } from 'src/common/service/role/action';
import { resetRoleDropdown } from 'src/common/service/role/slice';
import {
    createUserAction,
    fetchUserDetailsAction,
} from 'src/common/service/user/action';
import {
    resetUserCreate,
    resetUserDetails,
    resetUserSuccess,
} from 'src/common/service/user/slice';
import { IMinuteOption } from 'src/components/Business/BusinessListUtils';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { IAddUserFormData, IAddUserFormErrors, ICreateUserRequest, generateInitialAddUserFormData, generateInitialAddUserFormErrors } from 'src/components/User/add/AddUserUtil';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const AddUser = () => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const userStyle = useUserStyle();
  const dispatch = useDispatch<AppDispatch>();
  const focus = useIsFocused();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const userId = id ? String(id) : null;
  const { data: roles, loading: rolesLoading } = useSelector(
    (state: RootState) => state.role.roleDropdown,
  );

  const {
    data: userDetails,
    loading: userDetailsLoading,
    error: userDetailsError,
  } = useSelector((state: RootState) => state.user.userDetails);

  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = useSelector((state: RootState) => state.user.userCreate);

  const [formData, setFormData] = useState<IAddUserFormData>(generateInitialAddUserFormData());
  const [errors, setErrors] = useState<IAddUserFormErrors>(generateInitialAddUserFormErrors());
  const [showSnackbar, setShowSnackbar] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (focus) {
        dispatch(fetchRolesDropdownAction());
        if (userId) {
          dispatch(fetchUserDetailsAction(userId));
        }
      }
      return () => {
        dispatch(resetRoleDropdown());
        dispatch(resetUserCreate());
        dispatch(resetUserDetails());
      };
    }, [focus, dispatch, userId]),
  );

  useEffect(() => {
    if (createError) {
      setErrors((prev) => ({ ...prev, apiError: createError }));
    }
  }, [createError]);

  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        username: userDetails.username,
        selectedRole: userDetails.roleId,
        email: userDetails.email,
      }));
    }
    return () => {
      setFormData(generateInitialAddUserFormData());
    };
  }, [userDetails]);

  useEffect(() => {
    if (createSuccess) {
      setShowSnackbar(true);
    }
  }, [createSuccess]);

  const handleDismiss = () => {
    setShowSnackbar(false);
    dispatch(resetUserSuccess());
    router.push(Routes.USERS);
  };

  const validatePassword = (pwd: string): string => {
    const errors: string[] = [];

    if (pwd.length < 6) {
      errors.push(TranslateMessage('Admin.Delivery.App.Password.MinLength'));
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push(TranslateMessage('Admin.Delivery.App.Password.UpperCase'));
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push(TranslateMessage('Admin.Delivery.App.Password.LowerCase'));
    }
    if (!/\d/.test(pwd)) {
      errors.push(TranslateMessage('Admin.Delivery.App.Password.Digit'));
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push(TranslateMessage('Admin.Delivery.App.Password.SpecialChar'));
    }

    return errors.join('\n');
  };

  const validateForm = (): boolean => {
    const newErrors: IAddUserFormErrors = generateInitialAddUserFormErrors();

    if (!formData.username.trim()) {
      newErrors.username = TranslateMessage('Admin.Delivery.App.Name.required');
    }
    if (!formData.email.trim()) {
      newErrors.email = TranslateMessage('Admin.Delivery.App.Email.required');
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      newErrors.email = TranslateMessage('Admin.Delivery.App.Invalid.Email');
    }
    if (!userId) {
      if (!formData.password.trim()) {
        newErrors.password = TranslateMessage(
          'Admin.Delivery.App.Password.Required',
        );
      } else {
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          newErrors.password = passwordError;
        }
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = TranslateMessage(
          'Admin.Delivery.App.Password.Confirm.Required',
        );
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = TranslateMessage(
          'Admin.Delivery.App.Password.Mismatch',
        );
      }
    } else {
      if (formData.password.trim()) {
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          newErrors.password = passwordError;
        }
      }

      if (formData.password.trim() && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = TranslateMessage(
          'Admin.Delivery.App.Password.Mismatch',
        );
      }
    }

    if (!formData.selectedRole) {
      newErrors.role = TranslateMessage('Admin.Delivery.App.Role.Required');
    }

    setErrors(newErrors);
    return (
      !newErrors.username &&
      !newErrors.password &&
      !newErrors.confirmPassword &&
      !newErrors.role &&
      !newErrors.email
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload: ICreateUserRequest = {
      ...(userId && { id: Number(userId) }),
      username: formData.username.trim(),
      roleId: formData.selectedRole!,
      email: formData.email.trim(),
    };

    if (formData.password.trim()) {
      payload.password = formData.password.trim();
    }

    dispatch(createUserAction(payload));
  };

  const handleCancel = () => {
    router.push(Routes.USERS);
  };

  const handleRoleChange = (item: IMinuteOption) => {
    setFormData((prev) => ({ ...prev, selectedRole: Number(item.value) }));
    setErrors((prev) => ({ ...prev, role: '' }));
  };

  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }

  function renderUsername() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Profile.Username')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Profile.Username')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, username: text }));
            setErrors((prev) => ({ ...prev, username: '' }));
          }}
          value={formData.username}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={
            errors.username
              ? theme.colors.borderErrorInverse
              : theme.colors.borderMedium
          }
          secureTextEntry={false}
          contentStyle={formStyle.inputPlaceholderLabel}
          maxLength={40}
        />
        {renderErrorMsg(errors.username)}
      </View>
    );
  }
  function renderEmail() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.User.Email')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.User.Email')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, email: text }));
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
          value={formData.email}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={
            errors.email
              ? theme.colors.borderErrorInverse
              : theme.colors.borderMedium
          }
          secureTextEntry={false}
          contentStyle={formStyle.inputPlaceholderLabel}
          maxLength={40}
        />
        {renderErrorMsg(errors.email)}
      </View>
    );
  }


  function renderPassword() {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {TranslateMessage('Admin.Delivery.App.Restaurants.NewPassword')}
          {!userId && <Text style={formStyle.asteriskTxt}>*</Text>}
        </Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[formStyle.inputField]}
            value={formData.password}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, password: text }));
              setErrors((prev) => ({ ...prev, password: '' }));
            }}
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={
              errors.password
                ? theme.colors.borderErrorInverse
                : theme.colors.borderMedium
            }
            placeholderTextColor={theme.colors.textNeutral}
            mode='outlined'
            autoCapitalize='none'
            secureTextEntry={!formData.showPassword}
            contentStyle={formStyle.inputLabel}
            placeholder={TranslateMessage(
              'Admin.Delivery.App.Restaurants.NewPassword',
            )}
            maxLength={50}
          />
          <Pressable 
            onPress={() => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))} 
            style={userStyle.iconButton}
          >
            <Icon 
              name={formData.showPassword ? 'eye' : 'eyeOff'} 
              size={22} 
              color={theme.colors.iconBase} 
            />
          </Pressable>
        </View>
        {renderErrorMsg(errors.password)}
      </View>
    );
  }

  function renderConfirmPassword() {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {TranslateMessage('Admin.Delivery.App.Restaurants.Confirm Password')}
          {!userId && <Text style={formStyle.asteriskTxt}>*</Text>}
        </Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[formStyle.inputField]}
            value={formData.confirmPassword}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, confirmPassword: text }));
              setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={
              errors.confirmPassword
                ? theme.colors.borderErrorInverse
                : theme.colors.borderMedium
            }
            placeholderTextColor={theme.colors.textNeutral}
            mode='outlined'
            autoCapitalize='none'
            secureTextEntry={!formData.showConfirmPassword}
            contentStyle={formStyle.inputLabel}
            placeholder={TranslateMessage(
              'Admin.Delivery.App.Restaurants.Confirm Password',
            )}
            maxLength={50}
          />
          <Pressable 
            onPress={() => setFormData((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))} 
            style={userStyle.iconButton}
          >
            <Icon 
              name={formData.showConfirmPassword ? 'eye' : 'eyeOff'} 
              size={22} 
              color={theme.colors.iconBase} 
            />
          </Pressable>
        </View>
        {renderErrorMsg(errors.confirmPassword)}
      </View>
    );
  }

  function renderRoleDropdown() {
    const roleOptions =
      roles?.map((role) => ({
        label: role.name,
        value: role.id.toString(),
      })) || [];

    const selectedRoleOption = roleOptions.find(
      (opt) => opt.value === formData.selectedRole?.toString(),
    );

    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {TranslateMessage('Admin.Delivery.App.Role')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <Customdropdown
          data={roleOptions}
          selectedValue={
            selectedRoleOption || {
              label: TranslateMessage('Admin.Delivery.App.Select.Role'),
              value: '',
            }
          }
          onChange={handleRoleChange}
          style={{ height: 37 }}
        />
        {renderErrorMsg(errors.role)}
      </View>
    );
  }

  return (
    <>
      <ScrollView>
        <View style={[layout.containerPadding]}>
          <Loader
            loading={rolesLoading || createLoading || userDetailsLoading}
          />
          <View
            style={[
              layout.container,
              styles.headerContainer,
              layout.paddingTop26,
              layout.flexWrap,
            ]}
          >
            <Typography variant='subHeading'>
              {userId
                ? TranslateMessage('Admin.Delivery.App.Edit.User.Details')
                : TranslateMessage('Admin.Delivery.App.Dashboard.AddNewUser')}
            </Typography>
            <View style={styles.breadcrumbContainer}>
              <Text style={styles.breadcrumb}>
                {TranslateMessage('Admin.Delivery.App.Home')}
              </Text>
              <Text style={styles.breadcrumb}>/</Text>
              <Text style={[styles.breadcrumb]}>
                {TranslateMessage(
                  'Admin.Delivery.App.Dashboard.UserManagement',
                )}
              </Text>
              <Text style={styles.breadcrumb}>/</Text>
              <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
                {userId
                  ? TranslateMessage('Admin.Delivery.App.Edit')
                  : TranslateMessage(
                      'Admin.Delivery.App.Restaurants.AddNewTitle',
                    )}
              </Text>
            </View>
          </View>
          <Divider style={[layout.DividerSperator, layout.marBottom30]} />
          <View style={layout.cardBox}>
            <View style={styles.headerContainer}>
              <Text style={[layout.accordionTitle, layout.marBottom30]}>
                {TranslateMessage('Admin.Delivery.App.User.Details')}
              </Text>
            </View>
            <View>
              <View style={[formStyle.formRow]}>
                {renderUsername()}
                {renderEmail()}
                </View>
              <View style={[formStyle.formRow]}>
                {renderPassword()}
                {renderConfirmPassword()}
                </View>
              <View style={[formStyle.formRow]}>
                {renderRoleDropdown()}
              </View>
            </View>
            {renderErrorMsg(errors.apiError)}
            <View style={[formStyle.formRow, layout.justifyEnd]}>
              <View
                style={[
                  formStyle.formCol50,
                  formStyle.formRow,
                  layout.justifyEnd,
                ]}
              >
                <View style={[formStyle.formCol50]}>
                  <Pressable onPress={createLoading ? null : handleSubmit}>
                    {createLoading ? (
                      <View style={[button.btnBase, button.btnPrimary]}>
                        <Loader
                          loading={createLoading}
                          color={theme.colors.textInverse}
                        />
                      </View>
                    ) : (
                      <Text style={[button.btnBase, button.btnPrimary]}>
                        {userId
                          ? TranslateMessage('Admin.Delivery.App.Update.Label')
                          : TranslateMessage('Admin.Delivery.App.Create.Label')}
                      </Text>
                    )}
                  </Pressable>
                </View>
                <View style={[formStyle.formCol50]}>
                  <Pressable onPress={handleCancel}>
                    <Text style={[button.btnBase, button.btnOutlineDanger]}>
                      {TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
        <CustomSnackbar
          visible={showSnackbar}
          message={TranslateMessage('Admin.Delivery.App.Snackbar.DataSaved')}
          onDismiss={handleDismiss}
          type={SnackbarType.SUCCESS}
        />
      </ScrollView>
    </>
  );
};

export default AddUser;
