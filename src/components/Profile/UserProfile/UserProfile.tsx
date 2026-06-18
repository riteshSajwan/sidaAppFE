import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUserStyle } from 'src/common/assets/styles/user';
import {
  IBlobType,
  IFilesData,
} from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import styles from 'src/components/Profile/UserProfile/UserProfileStyle';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';

import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CustomProfileImagePicker from 'src/common/components/CustomProfileImagePicker/CustomProfileImagePicker';
import CustomSnackbar, {
  SnackbarType,
} from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { RenderImage } from 'src/common/components/Image/Image';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { updateProfileImage } from 'src/common/service/profile/action';

const UserProfile = () => {
  const layout = useLayoutStyle();
  const userStyle = useUserStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const {theme} = useAppTheme();
  const { t: TranslateMessage } = useTranslation();
  const userDetails = useSelector((state: RootState) => state.profile.data);
  const [profileImage, setProfileImage] = useState<IFilesData[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const focus = useIsFocused();

  useEffect(() => {
    setProfileImage([]);
  }, [focus]);

  const handleDismiss = () => {
    setSnackbarVisible(false);
  };
  const onChangeProfileImage = (
    blob: IBlobType,
    uploadedData: IFilesData[]
  ) => {
    setProfileImage(uploadedData);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (profileImage[0]?.blob && userDetails) {
        const formData = new FormData();
        formData.append('file', profileImage[0]?.blob);
        setSubmitClicked(true);
        dispatch(updateProfileImage(formData, userDetails));
      }
    } catch (error) {
      setError('Something Went Wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(userDetails && submitClicked){
        setSnackbarVisible(true);
        setSubmitClicked(false);
    }
  },[userDetails])

  function showProfileImage() {
    let profileUrl = profileImage?.[0]?.uri;
    return profileUrl
      ? profileUrl
      : userDetails?.profileUrl
      ? userDetails.profileUrl
      : '';
  }

  function renderAvatarImage() {
    const profileImageUri = showProfileImage();

    return (
      <View>
        <View style={{ position: 'relative', alignSelf: 'center' }}>
          {profileImageUri ? (
            <RenderImage uri={profileImageUri} style={userStyle.imageprofile} />
          ) : (
            <Image
              source={require('src/common/assets/images/avatar.png')}
              style={userStyle.imageprofile}
              contentFit='cover'
            />
          )}
          <CustomProfileImagePicker
            onSelect={onChangeProfileImage}
            type={['image/*']}
          />
        </View>
      </View>
    );
  }

  function renderEmail() {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {TranslateMessage('Admin.Delivery.App.Profile.EmailAddress')}
        </Text>
        <TextInput
          style={[
            userStyle.formInput,
            { backgroundColor: true ? theme.colors.surfaceLow : theme.colors.surfaceBase },
          ]}
          autoComplete='off'
          returnKeyType='next'
          placeholderTextColor={theme.colors.textNeutral}
          contentStyle={formStyle.textInputLabel}
          value={userDetails?.username ? userDetails?.username : ''}
          disabled={true}
          autoCapitalize='none'
          mode='outlined'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          placeholder={TranslateMessage('Admin.Delivery.App.Profile.EmailAddress')}
          outlineStyle={formStyle.inputFieldOuline}
        />
      </View>
    );
  }

  function renderUsername() {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {TranslateMessage('Admin.Delivery.App.Profile.Username')}
        </Text>
        <TextInput
          style={[
            userStyle.formInput,
            { backgroundColor: true ? theme.colors.surfaceLow : theme.colors.surfaceBase },
          ]}
          autoComplete='off'
          returnKeyType='next'
          placeholderTextColor={theme.colors.textNeutral}
          contentStyle={formStyle.inputPlaceholderLabel}
          value={userDetails?.username ? userDetails?.username : ''}
          disabled={true}
          autoCapitalize='none'
          mode='outlined'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          placeholder={TranslateMessage('Admin.Delivery.App.Profile.Username')}
          outlineStyle={formStyle.inputFieldOuline}
        />
      </View>
    );
  }

  function renderChangePassword() {
    return (
      <View style={styles.loginBtn}>
        <Pressable
          onPress={() => {
            router.push(`${Routes.PROFILE}${Routes.CHANGE_PASSWORD}`);
          }}
          style={[button.btnBase, button.btnOutlinePrimary]}
        >
          <Typography variant='btnText' color={theme.colors.themeText}>{TranslateMessage('Admin.Delivery.App.Profile.ChangePassword')}</Typography>
        </Pressable>
      </View>
    );
  }

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }

  function renderUpdateButton() {
    return (
      <View style={styles.loginBtn}>
        <Pressable onPress={handleSubmit}>
          <View style={{ paddingHorizontal: theme.spacing.md }}>
            <Text style={[button.btnBase, button.btnPrimary]}>
              {TranslateMessage('Admin.Delivery.App.Profile.UpdateAccount')}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Loader loading={loading} />
      <View style={[layout.container]}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            {/* <Pressable>
              <IconButton
                icon='chevron-left'
                style={[button.btnIcon, { width: 30, height: 30 }]}
                size={40}
                iconColor={color.color_000000.color}
              />
            </Pressable> */}
          </View>
          <View>
            <Text style={layout.Adminh1Title}>
              {/* {TranslateMessage('Admin.Delivery.App.Profile.AccountTitle')} */}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.main]}>
        <View style={userStyle.formLayout}>
          {renderAvatarImage()}
          <View style={formStyle.formRow}>{renderUsername()}</View>
          <View style={formStyle.formRow}>{renderEmail()}</View>
          {renderChangePassword()}
          {renderErrorMsgSection(error)}
        </View>
        {renderUpdateButton()}
      </View>
      <CustomSnackbar
        visible={snackbarVisible}
        message={TranslateMessage('Admin.Delivery.App.Snackbar.DataSaved')}
        onDismiss={handleDismiss}
        type={SnackbarType.SUCCESS}
      />
    </>
  );
};
export default UserProfile;
