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
import CustomSnackbar, {
  SnackbarType,
} from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import {
  createRoleAction,
  fetchAllAdminMenusAction,
  fetchRoleDetailsAction,
} from 'src/common/service/role/action';
import {
  resetMenus,
  resetRoleCreate,
  resetRoleDetails,
  resetRoleSuccess,
} from 'src/common/service/role/slice';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import {
  IMenuPermission,
  permissionType,
} from 'src/components/Role/add/AddRoleUtil';
import PermissionListTable from 'src/components/Role/add/Table/PermissionListTable';
import { IPermissionSelection } from 'src/components/Role/add/Table/PermissionListTableUtil';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';

const AddRole = () => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const tablestyle = useTableStyle();
  const dispatch = useDispatch<AppDispatch>();
  const focus = useIsFocused();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const roleId = id ? String(id) : null;

  const {
    data: menus,
    loading: menusLoading,
    error: menusError,
  } = useSelector((state: RootState) => state.role.menus);

  const {
    data: roleDetails,
    loading: roleDetailsLoading,
    error: roleDetailsError,
  } = useSelector((state: RootState) => state.role.roleDetails);

  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = useSelector((state: RootState) => state.role.roleCreate);

  const [roleName, setRoleName] = useState<string>('');
  const [roleDescription, setRoleDescription] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<
    IPermissionSelection[]
  >([]);
  const [errors, setErrors] = useState({
    roleName: '',
    roleDescription: '',
    permissions: '',
    apiError: '',
  });
  const [showSnackbar, setShowSnackbar] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (focus) {
        dispatch(fetchAllAdminMenusAction());
        if (roleId) {
          dispatch(fetchRoleDetailsAction(roleId));
        }
      }
      return () => {
        dispatch(resetMenus());
        dispatch(resetRoleCreate());
        dispatch(resetRoleDetails());
      };
    }, [focus, dispatch, roleId]),
  );

  useEffect(() => {
    if (createError) {
      setErrors((prev) => ({ ...prev, apiError: createError }));
    }
  }, [createError]);

  useEffect(() => {
    if (roleDetails) {
      setRoleName(roleDetails.roleName);
      setRoleDescription(roleDetails.roleDescription);

      const permissions: IPermissionSelection[] =
        roleDetails.menuPermission.map((mp) => ({
          menuId: mp.menuId,
          view: true, // Always true if permission exists
          edit: mp.permission === permissionType.FULL,
        }));

      setSelectedPermissions(permissions);
    }
  }, [roleDetails]);

  useEffect(() => {
    if (createSuccess) {
      setShowSnackbar(true);
    }
  }, [createSuccess]);

  const handleDismiss = () => {
    setShowSnackbar(false);
    dispatch(resetRoleSuccess());
    router.push(Routes.ROLES);
  };

  const handlePermissionChange = (menuId: number, type: 'view' | 'edit') => {
    setErrors((prev) => ({ ...prev, permissions: '' }));

    setSelectedPermissions((prev) => {
      const existing = prev.find((p) => p.menuId === menuId);

      if (type === 'edit') {
        if (existing?.edit) {
          return prev.filter((p) => p.menuId !== menuId);
        } else {
          if (existing) {
            return prev.map((p) =>
              p.menuId === menuId ? { ...p, view: true, edit: true } : p,
            );
          } else {
            return [...prev, { menuId, view: true, edit: true }];
          }
        }
      } else {
        if (existing?.edit) {
          return prev;
        }

        if (existing?.view) {
          return prev.filter((p) => p.menuId !== menuId);
        } else {
          if (existing) {
            return prev.map((p) =>
              p.menuId === menuId ? { ...p, view: true } : p,
            );
          } else {
            return [...prev, { menuId, view: true, edit: false }];
          }
        }
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors = {
      roleName: '',
      roleDescription: '',
      permissions: '',
      apiError: '',
    };

    if (!roleName.trim()) {
      newErrors.roleName = TranslateMessage(
        'Admin.Delivery.App.Role.Name.Required',
      );
    }

    if (!roleDescription.trim()) {
      newErrors.roleDescription = TranslateMessage(
        'Admin.Delivery.App.Role.Description.Required',
      );
    }

    if (selectedPermissions.length === 0) {
      newErrors.permissions = TranslateMessage(
        'Admin.Delivery.App.Role.Permissions.Required',
      );
    }

    setErrors(newErrors);
    return (
      !newErrors.roleName &&
      !newErrors.roleDescription &&
      !newErrors.permissions
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const menuPermission: IMenuPermission[] = selectedPermissions.map((p) => ({
      menuId: p.menuId,
      permission: p.edit ? permissionType.FULL : permissionType.VIEW,
    }));

    const payload = {
      ...(roleId && { roleId: Number(roleId) }),
      roleName: roleName.trim(),
      roleDescription: roleDescription.trim(),
      menuPermission,
      customRole: true,
    };

    dispatch(createRoleAction(payload));
  };

  const handleCancel = () => {
    router.push(Routes.ROLES);
  };
  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }

  function renderRoleName() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Role.Name')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Role.Name')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => {
            setRoleName(text);
            setErrors((prev) => ({ ...prev, roleName: '' }));
          }}
          value={roleName}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={
            errors.roleName
              ? theme.colors.borderErrorInverse
              : theme.colors.borderMedium
          }
          secureTextEntry={false}
          contentStyle={formStyle.inputPlaceholderLabel}
          maxLength={40}
        />
        {renderErrorMsg(errors.roleName)}
      </View>
    );
  }

  function renderRoleDescription() {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {TranslateMessage('Admin.Delivery.App.Ticket.Table.Description')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[
            formStyle.inputField,
            { height: 'auto', paddingVertical: theme.spacing.sm },
          ]}
          value={roleDescription}
          onChangeText={(text) => {
            setRoleDescription(text);
            setErrors((prev) => ({ ...prev, roleDescription: '' }));
          }}
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={
            errors.roleDescription
              ? theme.colors.borderErrorInverse
              : theme.colors.borderMedium
          }
          placeholderTextColor={theme.colors.textNeutral}
          mode='outlined'
          autoCapitalize='none'
          secureTextEntry={false}
          editable={true}
          multiline={true}
          contentStyle={formStyle.inputLabel}
          numberOfLines={5}
          placeholder={TranslateMessage(
            'Admin.Delivery.Request.Rejection.DescriptionPlaceHolder',
          )}
          maxLength={200}
        />
        {renderErrorMsg(errors.roleDescription)}
      </View>
    );
  }
  return (
    <>
      <ScrollView>
        <View style={[layout.containerPadding]}>
          <Loader
            loading={menusLoading || createLoading || roleDetailsLoading}
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
              {roleId
                ? TranslateMessage('Admin.Delivery.App.Edit.Role')
                : TranslateMessage('Admin.Delivery.App.Create.Role')}
            </Typography>
          </View>
          <Divider style={[layout.DividerSperator, layout.marBottom30]} />
          <View style={layout.cardBox}>
            <View style={styles.headerContainer}>
              <Text style={[layout.accordionTitle, layout.marBottom30]}>
                {TranslateMessage('Admin.Delivery.App.Role.Details')}
              </Text>
            </View>
            <View>
              <View style={[formStyle.formRow]}>{renderRoleName()}</View>
              <View style={[formStyle.formRow]}>{renderRoleDescription()}</View>
            </View>
            <View style={[tablestyle.tableScrollWidth, layout.marBottom30]}>
              <PermissionListTable
                permissionListData={menus}
                selectedPermissions={selectedPermissions}
                onPermissionChange={handlePermissionChange}
                error={menusError || ''}
              />
              {renderErrorMsg(errors.permissions)}
            </View>
            {renderErrorMsg(errors.apiError)}
            <View style={[formStyle.formRow,layout.justifyEnd]}>
              <View
                style={[
                  formStyle.formCol50,
                  formStyle.formRow,
                  layout.justifyEnd ,
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
                        {roleId
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

export default AddRole;
