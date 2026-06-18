import { useIsFocused } from '@react-navigation/native';
import { getCountryData, TCountryCode } from 'countries-list';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUserStyle } from 'src/common/assets/styles/user';
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import CustomProfileImagePicker, {
  IBlobType,
  IFilesData,
} from 'src/common/components/CustomProfileImagePicker/CustomProfileImagePicker';
import CustomSnackbar from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { logout } from 'src/common/service/auth/action';
import { fetchCitiesByCountryAction } from 'src/common/service/city/action';
import { resetAllCitiesByCountry } from 'src/common/service/city/slice';
import { fetchAllActiveCountriesAction } from 'src/common/service/country/action';
import {
  fetchProfileDataAction,
  updateOnboardingStep,
  updatePersonalInformationAction,
} from 'src/common/service/onboarding/action';
import {
  resetProfileData,
  resetUpdateSuccess,
} from 'src/common/service/onboarding/slice';
import { areObjectEmpty } from 'src/common/utils/areObjectEmpty';
import { convertToMilliseconds } from 'src/common/utils/dateUtil';
import { getDeviceToken } from 'src/common/utils/getDeviceToken';
import { getUserRefreshToken } from 'src/common/utils/setRefreshTokenUtil';
import {
  ALLOW_ADDRESS_INPUT_SIZE,
  ALLOW_EMAIL_INPUT_SIZE,
  ALLOW_NAME_INPUT_SIZE,
} from 'src/components/DriverOnboarding/constant/index';
import {
  generateEditIntialErrorMsg,
  getInitialPersonalData,
  ICity,
  IEditProfile,
  IEditProfileErrors,
  IProfileResponse,
  IRiderRequestDto,
  validateProfileData,
} from 'src/components/DriverOnboarding/PersonalInformation/PersonalInfoUtil';
import {
  IAddressSelected,
  ICountries,
  ICountryDetails,
} from 'src/components/DriverOnboarding/util/OnBoardingUtil';
import { checkIfEmpty } from 'src/components/Restaurant/ProfilePreview/ProfilePreviewUtil';
import { Routes } from 'src/routing/paths';
import { AppThunkDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
import CountryListModal from '../CountryPickerModal/CountryPickerModal';
import { useOnBoardingStyle } from '../onBoardingstyle';
import { getCountryAndCallingCodeByPhoneNumber } from '../util/getCountryCallingCodeUtil';
import { removeCallingCode } from '../util/removeCallingCodeUtil';

// Web-compatible components

enum NavigationScreen {
  PROFILE = 'profile',
  LEGAL = 'legal',
  NAVIGATIONFROM = 'navigationFrom',
}

type Props = {
  handleNextStep: () => void;
};

const PersonalInformation: React.FC<Props> = ({ handleNextStep }) => {
  const layout = useLayoutStyle();
  const button = useButtonStyle();
  const formStyle = useFormStyle();
  const userStyle = useUserStyle();
  const onBoardingStyle = useOnBoardingStyle();
  const { theme } = useAppTheme();
  const dispatch: AppThunkDispatch = useDispatch();
  const focus = useIsFocused();

  // Redux state selectors
  const {
    data: profileData,
    loading,
    error,
    updateSuccess,
    isUpdating,
  } = useSelector((state: RootState) => state.onboarding.profileData);
  const { list: countries } = useSelector(
    (state: RootState) => state.country.activeCountryListing,
  );
  const { list: activeCities, loading: citiesLoading } = useSelector(
    (state: RootState) => state.city.allCityList,
  );

  // Local state
  const [uploadProfileData, setUploadProfileData] = useState<string>('');
  const [profileImage, setProfileImage] = useState<IFilesData[]>([]);
  const [countryId, setCountryId] = useState<string>('');
  const [countryEmergencyId, setCountryEmergencyId] = useState<string>('');
  const [countryUserId, setCountryUserId] = useState<string>('');
  const [cityId, setCityId] = useState<number>(0);
  const [editprofileData, setEditProfileData] = useState<IEditProfile>(
    getInitialPersonalData(),
  );
  const [editprofileDataInitial, setEditProfileDataInitial] =
    useState<IEditProfile>(getInitialPersonalData());
  const [checkMobileLogin, setCheckMobileLogin] = useState<boolean>(false);
  const [errorsMsg, setErrorsMsg] = useState<IEditProfileErrors>(
    generateEditIntialErrorMsg(),
  );
  const [imageError, setImageError] = useState<string>('');
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [fromProfile, setFromProfile] = useState<boolean>(false);
  const [fromLegal, setFromLegal] = useState<boolean>(false);
  const [emergencyId, setEmergencyId] = useState<string>('');
  const [isModalVisibleCountry, setModalVisibleCountry] = useState(false);
  const [isModalVisibleCountryUser, setModalVisibleCountryUser] =
    useState(false);
  const [isModalVisibleCountryEmergency, setModalVisibleCountryEmergency] =
    useState(false);
  const [isModalVisibleCity, setModalVisibleCity] = useState(false);
  const [selectedValue, setSelectedValue] = useState<IAddressSelected>({
    country: { label: '', value: '' },
    city: { label: '', value: '' },
  });
  const [cityTouched, setCityTouched] = useState<boolean>(false);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { t: TranslateMessage } = useTranslation();

  // Transform countries data for dropdown
  const transformedCountries = useMemo(() => {
    return [
      {
        label: TranslateMessage('Admin.Delivery.App.Select'),
        value: '',
      },
      ...countries
        .filter((country) => country.label !== 'All')
        .map((country) => ({
          label: country.label,
          value: country.id.toString(),
        })),
    ];
  }, [countries, TranslateMessage]);

  // Transform cities data for dropdown
  const transformedCities = useMemo(() => {
    return activeCities.map((city) => ({
      label: city.cityName,
      value: city.id.toString(),
    }));
  }, [activeCities]);

  // Fetch profile data and countries on component mount/focus
  useFocusEffect(
    useCallback(() => {
      if (!focus) {
        return;
      }
      dispatch(fetchAllActiveCountriesAction());
      return () => {
        // Cleanup if needed
        dispatch(resetProfileData());
      };
    }, [focus, dispatch]),
  );

  useFocusEffect(
    useCallback(() => {
      if (id) {
        dispatch(fetchProfileDataAction(id));
      }
    }, [id]),
  );

  // Fetch cities when country changes
  useEffect(() => {
    if (countryId) {
      console.log('Fetching cities for countryId:', countryId);
      dispatch(fetchCitiesByCountryAction(countryId));
    }
  }, [countryId, dispatch]);

  // Set selected city value after cities are loaded
  useEffect(() => {
    if (
      !citiesLoading &&
      activeCities.length > 0 &&
      editprofileData.city &&
      !selectedValue.city.value
    ) {
      const cityMatch = activeCities.find(
        (c) => c.cityName === editprofileData.city,
      );
      if (cityMatch) {
        setSelectedValue((prevState) => ({
          ...prevState,
          city: {
            label: cityMatch.cityName,
            value: cityMatch.id.toString(),
          },
        }));
        setCityId(cityMatch.id);
      }
    }
  }, [
    citiesLoading,
    activeCities,
    editprofileData.city,
    selectedValue.city.value,
  ]);

  // Handle errors from Redux
  useEffect(() => {
    if (error) {
      setErrorsMsg((prevState) => ({
        ...prevState,
        apiError: error,
      }));
    }
  }, [error]);

  // Handle successful update - only show success message on UPDATE, not on initial FETCH
  useEffect(() => {
    if (updateSuccess && !loading && !error) {
      setSnackbarMessage(
        TranslateMessage('Admin.Delivery.App.Information.Success'),
      );
      // Reset the flag after showing the message
    }
  }, [updateSuccess, loading, error, TranslateMessage, dispatch]);

  const processProfileData = useCallback(
    async (fetchedProfileData: IProfileResponse) => {
      try {
        if (fetchedProfileData?.id && fetchedProfileData?.emergencyContactDto) {
          let newDate: string | null = null;
          if (fetchedProfileData?.dob) {
            newDate = fetchedProfileData.dob;
          }

          const phoneCode = getCountryAndCallingCodeByPhoneNumber(
            fetchedProfileData?.phoneNumber,
          );
          const emergencyPhoneCode = getCountryAndCallingCodeByPhoneNumber(
            fetchedProfileData?.emergencyContactDto?.phoneNumber,
          );

          const phoneNumberWithoutCallingCode =
            phoneCode?.callingCode && fetchedProfileData?.phoneNumber
              ? removeCallingCode(
                  fetchedProfileData?.phoneNumber,
                  phoneCode.callingCode,
                )
              : fetchedProfileData?.phoneNumber;

          const emergencyPhoneNumberWithoutCallingCode =
            emergencyPhoneCode?.callingCode &&
            fetchedProfileData?.emergencyContactDto?.phoneNumber
              ? removeCallingCode(
                  fetchedProfileData?.emergencyContactDto?.phoneNumber,
                  emergencyPhoneCode.callingCode,
                )
              : fetchedProfileData?.emergencyContactDto?.phoneNumber;

          const profileFormData = {
            profileUrl: fetchedProfileData.profileUrl,
            email: fetchedProfileData?.email,
            phoneNumber: phoneNumberWithoutCallingCode,
            address: fetchedProfileData?.address || '',
            country: fetchedProfileData?.country,
            city: fetchedProfileData?.city,
            firstName: fetchedProfileData?.firstName,
            emergencyName: fetchedProfileData?.emergencyContactDto.fullName,
            relationship:
              fetchedProfileData?.emergencyContactDto?.relationship || '',
            emergencyAddress:
              fetchedProfileData?.emergencyContactDto?.address || '',
            dob: newDate ? newDate : '',
            callingCode: phoneCode.callingCode,
            countryCode: phoneCode.countryCode,
            emergencycallingCode: emergencyPhoneCode.callingCode,
            emergencyCountryCode: emergencyPhoneCode.countryCode,
            emergencyNumber: emergencyPhoneNumberWithoutCallingCode,
            id: fetchedProfileData.id,
            countryId: countryId,
          };

          setEditProfileDataInitial(profileFormData);
          setEditProfileData(profileFormData);
          setEmergencyId(fetchedProfileData?.emergencyContactDto?.id);
          setUploadProfileData(fetchedProfileData?.profileUrl);

          // Set country and trigger city fetch
          if (fetchedProfileData?.country) {
            const countryMatch = countries.find(
              (c) => c.label === fetchedProfileData?.country,
            );
            if (countryMatch) {
              console.log('Country matched:', countryMatch);
              setCountryId(countryMatch.id.toString());
              // Set selected country value for dropdown
              setSelectedValue((prevState) => ({
                ...prevState,
                country: {
                  label: countryMatch.label,
                  value: countryMatch.value,
                },
              }));
              // Cities will be fetched automatically by useEffect
            } else {
              console.log(
                'Country not found in list:',
                fetchedProfileData?.country,
                'Available countries:',
                countries.length,
              );
            }
          }
        }
      } catch (err) {
        console.error('Error processing profile data:', err);
      }
    },
    [countries],
  );

  // Process profile data when it's loaded AND countries are available
  useEffect(() => {
    if (profileData && profileData.id && countries.length > 0) {
      processProfileData(profileData);
    }
  }, [profileData, countries, processProfileData]);

  const resetErrorMsg = (fieldName?: string) => {
    setErrorsMsg((prevState) => {
      if (!fieldName) {
        return generateEditIntialErrorMsg();
      }
      return {
        ...prevState,
        [fieldName]: '',
      };
    });
  };

  const onChangeDateOfBirth = (birthDate: string) => {
    setEditProfileData((prevState) => ({
      ...prevState,
      dob: birthDate,
    }));
  };

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }

  const handleImageChange = async (results: string) => {
    resetErrorMsg('profileImageError');
    setUploadProfileData(results);
    setSnackbarMessage(TranslateMessage('Admin.Delivery.App.Profile.Success'));
    setIsModalVisible(false);
  };

  const onDismissSnackBar = async () => {
    if (
      snackbarMessage ===
      TranslateMessage('Admin.Delivery.App.Information.Success')
    ) {
      if (!id && profileData) {
        dispatch(updateOnboardingStep('step2'));
        router.push(`${Routes.DRIVER}${Routes.ONBOARDING}/${profileData.id}`);
      } else handleNextStep();
    }
    setSnackbarMessage('');
    dispatch(resetUpdateSuccess());
  };

  const updateAccount = () => {
    resetErrorMsg('apiError');
    resetErrorMsg('profileImageError');
    resetErrorMsg('');

    const validatedInfo = validateProfileData(
      editprofileData,
      uploadProfileData,
    );

    if (!areObjectEmpty(validatedInfo)) {
      setErrorsMsg(validatedInfo);
      return;
    }

    // if (
    //   JSON.stringify(editprofileDataInitial) ===
    //     JSON.stringify(editprofileData) &&
    //   profileImage.length == 0
    // ) {
    //   handleNextStep();
    //   return;
    // }

    let riderData: IRiderRequestDto = {
      ...(editprofileData.id && {
        id: editprofileData.id,
      }),
      firstName: editprofileData.firstName.trim(),
      phoneNumber: `+${editprofileData.callingCode}${editprofileData.phoneNumber}`,
      email: editprofileData.email,
      address: checkIfEmpty(editprofileData.address),
      countryId: countryId,
      dob: editprofileData.dob
        ? String(convertToMilliseconds(editprofileData.dob))
        : null,
      country: editprofileData.country ?? '',
      city: editprofileData.city ?? '',
      emergencyContactDto: {
        fullName: editprofileData.emergencyName ?? '',
        phoneNumber: editprofileData.emergencyNumber
          ? `+${editprofileData.emergencycallingCode}${editprofileData.emergencyNumber}`
          : '',
        relationship: checkIfEmpty(editprofileData.relationship),
        address: checkIfEmpty(editprofileData.emergencyAddress),
        deleted: false,
      },
    };

    if (emergencyId) {
      riderData.emergencyContactDto.id = emergencyId;
    }
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(riderData)], {
        type: 'application/json',
      }),
    );
    if (profileImage[0]?.blob) formData.append('file', profileImage[0]?.blob);
    // Dispatch reactive action - no await needed
    dispatch(updatePersonalInformationAction(formData));
  };

  function toggleModal(modalVisibility: boolean) {
    setIsModalVisible(modalVisibility);
  }

  const onChangeProfileImage = (
    blob: IBlobType,
    uploadedData: IFilesData[],
  ) => {
    setProfileImage(uploadedData);
    resetErrorMsg('profileImageError');
    // setSnackbarMessage(TranslateMessage('Admin.Delivery.App.Profile.Success'));
  };

  function showProfileImage() {
    let profileUrl = profileImage?.[0]?.uri;
    return profileUrl
      ? { uri: profileUrl }
      : editprofileData.profileUrl
        ? { uri: editprofileData.profileUrl }
        : { uri: '' };
  }

  function renderImage() {
    return (
      <View style={{ marginBottom: theme.spacing.md }}>
        <View style={{ position: 'relative', alignSelf: 'center' }}>
          <Image source={showProfileImage()} style={userStyle.imageprofile} />
          <CustomProfileImagePicker
            onSelect={onChangeProfileImage}
            type={['image/*']}
          />
        </View>
      </View>
    );
  }

  const handleInput = (key: keyof IEditProfile) => (text: string) => {
    const keysToValidate = ['emergencyAddress', 'address', 'relationship'];
    const trimmedText = key === 'email' ? text.trim() : text;

    if (keysToValidate.includes(key) && text !== '' && text.trim() === '') {
      return;
    }

    if (
      (key === 'phoneNumber' || key === 'emergencyNumber') &&
      text.length > 20
    ) {
      return;
    }

    setErrorsMsg((prevState) => ({
      ...prevState,
      [`${key}Error`]: '',
    }));

    setEditProfileData((prevState) => ({
      ...prevState,
      [key]: trimmedText,
    }));
  };
  const toggleModalCountry = () => {
    setModalVisibleCountry((prev) => !prev);

    if (isModalVisibleCountryUser) {
      setModalVisibleCountryUser(false);
    }
    if (isModalVisibleCountryEmergency) {
      setModalVisibleCountryEmergency(false);
    }
  };

  const toggleModalCity = () => {
    setModalVisibleCity((prev) => !prev);
  };
  function renderCountryModal() {
    setModalVisibleCountry(true);
  }

  function renderCountryModalUser() {
    setModalVisibleCountryUser(true);
    setModalVisibleCountry(true);
  }

  function renderCountryModalEmergency() {
    setModalVisibleCountryEmergency(true);
    setModalVisibleCountry(true);
  }

  function renderCityModal() {
    if (countryId) {
      setModalVisibleCity(true);
    } else {
      setCityTouched(true);
    }
  }
  // function renderCountryPickerModal() {
  //   return (
  //     <CountrySelectModal
  //       modalVisibleCountry={isModalVisibleCountry}
  //       disable={false}
  //       toggleModalCountry={toggleModalCountry}
  //       onCountryUpdate={handleCountryUpdate}
  //       countryId={countryId}
  //     />
  //   );
  // }

  // function renderCountryPickerModalUser() {
  //   return (
  //     <CountrySelectModal
  //       modalVisibleCountry={isModalVisibleCountry}
  //       disable={false}
  //       toggleModalCountry={toggleModalCountry}
  //       onCountryUpdate={handleCountryUpdateUser}
  //       countryUserId={countryUserId}
  //     />
  //   );
  // }

  // function renderCountryPickerModalEmergency() {
  //   return (
  //     <CountrySelectModal
  //       modalVisibleCountry={isModalVisibleCountry}
  //       disable={false}
  //       toggleModalCountry={toggleModalCountry}
  //       onCountryUpdate={handleCountryUpdateEmergency}
  //       countryEmergencyId={countryEmergencyId}
  //     />
  //   );
  // }

  // function renderCityPickerModal() {
  //   return (
  //     <CitySelectModal
  //       modalVisibleCity={isModalVisibleCity}
  //       disable={!countryId}
  //       toggleModalCity={toggleModalCity}
  //       countryId={countryId}
  //       onCityUpdate={handleCityUpdate}
  //       cityId={cityId}
  //     />
  //   );
  // }
  // Country picker functions - keeping for phone number country code selection
  function renderCountryPickerUser() {
    return (
      <CountryListModal
        countryCode={(editprofileData.countryCode as TCountryCode) ?? 'IN'}
        onSelect={userHandleSelectCountry}
        disable={id ? true : false}
      />
    );
  }

  function renderCountryPickerEmergency() {
    return (
      <CountryListModal
        countryCode={
          (editprofileData.emergencyCountryCode as TCountryCode) ?? 'IN'
        }
        onSelect={emergencyHandleSelectCountry}
      />
    );
  }

  const userHandleSelectCountry = (selectedCountry: {
    name: string;
    native: string;
    code: TCountryCode;
    callingCodes?: number[];
  }) => {
    setEditProfileData((prevState) => ({
      ...prevState,
      callingCode: String(selectedCountry.callingCodes?.[0]),
      countryCode: selectedCountry.code,
    }));
  };

  const emergencyHandleSelectCountry = (selectedCountry: {
    name: string;
    native: string;
    code: TCountryCode;
    callingCodes?: number[];
  }) => {
    setEditProfileData((prevState) => ({
      ...prevState,
      emergencycallingCode: String(selectedCountry.callingCodes?.[0]),
      emergencyCountryCode: selectedCountry.code,
    }));
  };

  const onChangeDropdown = (item: ICountries, name: string) => {
    setSelectedValue((prevState) => ({
      ...prevState,
      [name]: { label: item.label, value: item.value },
      city: { label: '', value: '' },
    }));
    setEditProfileData((prevState) => ({
      ...prevState,
      country: item.label,
      city: '',
    }));

    dispatch(resetAllCitiesByCountry());
    setCityId(0);
    // Set countryId to trigger city fetch via useEffect
    setCountryId(item.value);
  };
  const handleCountryUpdate = (newCountry: ICountryDetails) => {
    setEditProfileData((prevState) => ({
      ...prevState,
      country: newCountry.name,
      city: '',
    }));
    setCityId(0);
    setCountryId(newCountry.id);
  };
  const handleCountryUpdateUser = (newCountry: ICountryDetails) => {
    const locationCallingCode = String(
      getCountryData(newCountry.countryCode).phone?.[0],
    );
    setEditProfileData((prevState) => ({
      ...prevState,
      callingCode: locationCallingCode,
      countryCode: newCountry.countryCode,
    }));
    setCountryUserId(newCountry.id);
  };
  const handleCityUpdate = (newCity: ICity) => {
    const result = newCity.name.split(',')[0];
    setEditProfileData((prevState) => ({
      ...prevState,
      city: result,
    }));
    setCityId(newCity.id);
  };
  const handleCountryUpdateEmergency = (newCountry: ICountryDetails) => {
    const locationCallingCode = String(
      getCountryData(newCountry.countryCode).phone?.[0],
    );
    setEditProfileData((prevState) => ({
      ...prevState,
      emergencycallingCode: locationCallingCode,
      emergencyCountryCode: newCountry.countryCode,
    }));
    setCountryEmergencyId(newCountry.id);
  };
  useEffect(() => {
    setErrorsMsg((prevState) => ({
      ...prevState,
      countryError: editprofileData.country ? '' : prevState.countryError,
      cityError: editprofileData.city ? '' : prevState.cityError,
    }));
  }, [editprofileData.country, editprofileData.city]);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  function renderName(userType: 'user' | 'emergency') {
    const value =
      userType === 'user'
        ? editprofileData.firstName
        : editprofileData.emergencyName;
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.FullName')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
          <TextInput
            style={[formStyle.inputField]}
            mode="outlined"
            activeOutlineColor={theme.colors.borderLinkInverse}
            outlineColor={
              userType === 'user'
                ? errorsMsg.firstNameError
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
                : errorsMsg.emergencyNameError
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
            }
            placeholder={TranslateMessage('Admin.Delivery.App.FullName')}
            value={value}
            maxLength={ALLOW_NAME_INPUT_SIZE}
            placeholderTextColor={theme.colors.textNeutral}
            onChangeText={handleInput(
              userType === 'user' ? 'firstName' : 'emergencyName',
            )}
            // ref={userType === 'user' ? nameInputRef : undefined}
          />
          {userType === 'user' &&
            renderErrorMsgSection(errorsMsg.firstNameError)}
          {userType === 'emergency' &&
            renderErrorMsgSection(errorsMsg.emergencyNameError)}
        </View>
      </View>
    );
  }

  function renderPhoneNumber(userType: 'user' | 'emergency') {
    const callingCode =
      userType === 'user'
        ? `+${editprofileData.callingCode}`
        : `+${editprofileData.emergencycallingCode}`;
    const isDisabled = userType === 'user' && id ? true : false;
    return (
      <View style={[formStyle.formCol, { marginTop: -5 }]}>
        <TextInput
          label={TranslateMessage('Admin.Delivery.App.Mobile.Number')}
          style={[formStyle.inputField, { paddingLeft: theme.spacing.sm }]}
          mode="outlined"
          keyboardType="phone-pad"
          activeOutlineColor={theme.colors.borderLinkInverse}
          outlineColor={theme.colors.borderMedium}
          value={
            userType === 'user'
              ? (editprofileData.phoneNumber ?? '')
              : (editprofileData.emergencyNumber ?? '')
          }
          onChangeText={handleInput(
            userType === 'user' ? 'phoneNumber' : 'emergencyNumber',
          )}
          placeholderTextColor={theme.colors.textNeutral}
          editable={!isDisabled}
          left={
            <TextInput.Icon
              icon={() => (
                <Text
                  allowFontScaling={false}
                  style={onBoardingStyle.inputAfexIcon}
                >
                  {callingCode ?? ''}
                </Text>
              )}
              style={onBoardingStyle.inputAfex}
            />
          }
        />
        {userType === 'user' &&
          renderErrorMsgSection(errorsMsg.phoneNumberError)}
        {userType === 'emergency' &&
          renderErrorMsgSection(errorsMsg.emergencyNumberError)}
      </View>
    );
  }

  function renderEmail() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Email')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
          <TextInput
            style={[formStyle.inputField]}
            mode="outlined"
            activeOutlineColor={theme.colors.borderLinkInverse}
            outlineColor={
              errorsMsg.emailError
                ? theme.colors.borderErrorInverse
                : theme.colors.borderMedium
            }
            placeholder={TranslateMessage('Admin.Delivery.App.Add.Email')}
            value={editprofileData.email}
            placeholderTextColor={theme.colors.textNeutral}
            onChangeText={handleInput('email')}
            editable={true}
            maxLength={ALLOW_EMAIL_INPUT_SIZE}
          />
          {renderErrorMsgSection(errorsMsg.emailError)}
        </View>
      </View>
    );
  }

  function renderAddress(userType: 'user' | 'emergency') {
    const value =
      userType === 'user'
        ? editprofileData.address
        : editprofileData.emergencyAddress;

    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Address')}
          </Text>
          <TextInput
            style={[formStyle.inputField]}
            mode="outlined"
            activeOutlineColor={theme.colors.borderLinkInverse}
            outlineColor={theme.colors.borderMedium}
            placeholder={TranslateMessage('Admin.Delivery.App.Address')}
            value={value}
            maxLength={ALLOW_ADDRESS_INPUT_SIZE}
            placeholderTextColor={theme.colors.textNeutral}
            onChangeText={handleInput(
              userType === 'user' ? 'address' : 'emergencyAddress',
            )}
          />
        </View>
      </View>
    );
  }

  function renderRelationship() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Relationship')}
          </Text>
          <TextInput
            style={[formStyle.inputField]}
            mode="outlined"
            activeOutlineColor={theme.colors.borderLinkInverse}
            outlineColor={theme.colors.borderMedium}
            placeholder={TranslateMessage('Admin.Delivery.App.Relationship')}
            value={editprofileData.relationship}
            placeholderTextColor={theme.colors.textNeutral}
            onChangeText={handleInput('relationship')}
            maxLength={ALLOW_EMAIL_INPUT_SIZE}
          />
        </View>
      </View>
    );
  }

  function renderBirthDate() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={[formStyle.formCol]}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.DateOfBirth')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
          <CustomInputDatePicker
            date={editprofileData?.dob ? editprofileData.dob.toString() : ''}
            onDateSelect={onChangeDateOfBirth}
            maxDate={
              new Date(Date.now() - 16 * 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0]
            }
            placeholder={TranslateMessage('Admin.Delivery.App.DateOfBirth')}
          />
          {renderErrorMsgSection(errorsMsg.dobError)}
        </View>
      </View>
    );
  }

  // Simplified country/city selection for web
  function renderCountryCity() {
    return (
      <View style={formStyle.formRow}>
        <View style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Assigned.Country')}
            <Text style={{ color: theme.colors.textErrorDark }}>*</Text>
          </Text>

          <Customdropdown
            data={transformedCountries}
            selectedValue={selectedValue.country}
            onChange={(item) => onChangeDropdown(item, 'country')}
            error={errorsMsg.countryError}
          />

          {renderErrorMsgSection(errorsMsg.countryError)}
        </View>

        <View style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Assigned.City')}
            <Text style={{ color: theme.colors.textErrorDark }}>*</Text>
          </Text>

          <Customdropdown
            data={transformedCities}
            selectedValue={selectedValue.city}
            onChange={(item) => {
              setSelectedValue((prevState) => ({
                ...prevState,
                city: { label: item.label, value: item.value },
              }));
              setEditProfileData((prevState) => ({
                ...prevState,
                city: item.label,
              }));
              setCityId(Number(item.value));
            }}
            error={errorsMsg.cityError}
          />
          {renderErrorMsgSection(errorsMsg.cityError)}
        </View>
      </View>
    );
  }

  function renderSubmitButton() {
    return (
      <View style={[layout.container, layout.mb10]}>
        <Pressable onPress={isUpdating ? null : updateAccount}>
          {isUpdating ? (
            <View style={[button.btn, button.btnPrimary]}>
              <Loader loading={isUpdating} color={theme.colors.iconInverse} />
            </View>
          ) : (
            <Text
              allowFontScaling={false}
              style={[button.btnPrimary, button.btn]}
            >
              {!fromProfile
                ? TranslateMessage('Admin.Delivery.App.Submit')
                : TranslateMessage('Admin.Delivery.App.Save')}
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  const handleLogoutClick = async () => {
    const deviceToken = await getDeviceToken();
    const refreshToken = await getUserRefreshToken();
    if (deviceToken && refreshToken) {
      const payload = { deviceToken, refreshToken };
      dispatch(logout(payload));
    }
  };

  return (
    <>
      {loading && !profileData ? (
        <View style={onBoardingStyle.pageLoader}>
          <Loader loading={loading || citiesLoading} />
        </View>
      ) : (
        <>
          <View
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[layout.flexCol]}
            >
              <View style={[layout.container]}>
                <Typography
                  variant="subHeading"
                  style={{ marginTop: theme.spacing.md }}
                >
                  {TranslateMessage('Admin.Delivery.App.PersonalInfoTitle')}
                </Typography>
                <View style={onBoardingStyle.mt20}>
                  {renderImage()}
                  <View style={[layout.alignItemCenter, onBoardingStyle.my10]}>
                    {renderErrorMsgSection(errorsMsg.profileImageError)}
                    {imageError ? (
                      <ErrorMessageContainer message={imageError} />
                    ) : null}
                  </View>
                  {renderName('user')}
                  {/* <Text allowFontScaling={false} style={formStyle.labelTitle}>
                    {TranslateMessage('Admin.Delivery.App.Phone.Number')}
                    <Text
                      allowFontScaling={false}
                      style={{ color: theme.colors.textErrorDark }}
                    >
                      *
                    </Text>
                  </Text>
                  <View
                    style={[
                      formStyle.formRow,
                      onboardingStyle.card,
                      onboardingStyle.alignItemsStart,
                      onboardingStyle.countryModalView,
                    ]}
                  >
                    <Pressable
                      onPress={() =>
                        !checkMobileLogin ? renderCountryModalUser() : null
                      }
                      disabled={checkMobileLogin}
                      style={[userStyle.flagPickerCustom, { width: '25%' }]}
                    >
                      <View style={{ height: 70 }}>
                        {editprofileData.countryCode ? (
                          <Text style={formStyle.flag}>
                            {getEmojiFlag(
                              editprofileData.countryCode as TCountryCode,
                            )}
                          </Text>
                        ) : (
                          <Text style={onboardingStyle.countryText}>
                            {TranslateMessage(
                              'Admin.Delivery.App.Select.Country.Label',
                            )}
                          </Text>
                        )}
                      </View>
                      <Icon
                        name="dropDown"
                        size={8}
                        color={theme.colors.iconBase}
                      />
                    </Pressable>

                    {renderPhoneNumber('user')}
                  </View> */}
                  <View style={formStyle.formCol}>
                    <Text allowFontScaling={false} style={formStyle.labelTitle}>
                      {TranslateMessage('Admin.Delivery.App.Phone.Number')}
                      <Text
                        allowFontScaling={false}
                        style={{ color: theme.colors.textErrorDark }}
                      >
                        *
                      </Text>
                    </Text>
                    <View style={[formStyle.formRow]}>
                      <View style={onBoardingStyle.countryView}>
                        {renderCountryPickerUser()}
                        <Icon
                          name="dropDown"
                          size={8}
                          color={theme.colors.iconBase}
                        />
                      </View>
                      <View style={{ marginBottom: 0, flex: 1 }}>
                        {renderPhoneNumber('user')}
                      </View>
                    </View>
                  </View>
                </View>
                {renderEmail()}
                {renderAddress('user')}
                {renderBirthDate()}
                {renderCountryCity()}
                {/* {!isModalVisibleCountryEmergency &&
                  !isModalVisibleCountryUser &&
                  isModalVisibleCountry &&
                  renderCountryPickerModal()}

                {countryId && isModalVisibleCity && renderCityPickerModal()} */}

                {cityTouched && !countryId && (
                  <Text style={formStyle.errorMessage}>
                    {TranslateMessage(
                      'Admin.Delivery.App.Please.Select.Country',
                    )}
                  </Text>
                )}
              </View>
              <View style={[layout.container]}>
                <Typography
                  variant="subHeading"
                  style={{ marginTop: theme.spacing.md }}
                >
                  {TranslateMessage('Admin.Delivery.App.EmergencyInfoTitle')}
                </Typography>

                <View style={[onBoardingStyle.mb30, onBoardingStyle.mt20]}>
                  {renderName('emergency')}
                  {/* <Text allowFontScaling={false} style={formStyle.labelTitle}>
                    {TranslateMessage('Admin.Delivery.App.Phone.Number')}
                    <Text
                      allowFontScaling={false}
                      style={{ color: theme.colors.textErrorDark }}
                    >
                      *
                    </Text>
                  </Text>
                  <View
                    style={[
                      formStyle.formRow,
                      onboardingStyle.card,
                      onboardingStyle.alignItemsStart,
                      onboardingStyle.countryModalView,
                    ]}
                  >
                    <Pressable
                      onPress={() =>
                        !checkMobileLogin ? renderCountryModalEmergency() : null
                      }
                      disabled={checkMobileLogin}
                      style={[userStyle.flagPickerCustom, { width: '25%' }]}
                    >
                      <View style={{ height: 70 }}>
                        {editprofileData.countryCode ? (
                          <Text style={formStyle.flag}>
                            {getEmojiFlag(
                              editprofileData.countryCode as TCountryCode,
                            )}
                          </Text>
                        ) : (
                          <Text style={onboardingStyle.countryText}>
                            {TranslateMessage(
                              'Admin.Delivery.App.Select.Country.Label',
                            )}
                          </Text>
                        )}
                      </View>
                      <Icon
                        name="dropDown"
                        size={8}
                        color={theme.colors.iconBase}
                      />
                    </Pressable>
                    {renderPhoneNumber('emergency')}
                  </View> */}
                  <View style={formStyle.formCol}>
                    <Text allowFontScaling={false} style={formStyle.labelTitle}>
                      {TranslateMessage('Admin.Delivery.App.Phone.Number')}
                      <Text
                        allowFontScaling={false}
                        style={{ color: theme.colors.textErrorDark }}
                      >
                        *
                      </Text>
                    </Text>
                    <View style={[formStyle.formRow]}>
                      <View style={onBoardingStyle.countryView}>
                        {renderCountryPickerEmergency()}
                        <Icon
                          name="dropDown"
                          size={8}
                          color={theme.colors.iconBase}
                        />
                      </View>
                      <View style={{ marginBottom: 0, flex: 1 }}>
                        {renderPhoneNumber('emergency')}
                      </View>
                    </View>
                  </View>
                  {renderRelationship()}
                  {renderAddress('emergency')}
                </View>
              </View>
            </ScrollView>
            <View style={[layout.alignItemsCenter, layout.mb10]}>
              {renderErrorMsgSection(errorsMsg.apiError)}
            </View>
            {renderSubmitButton()}
          </View>
          <View style={{ height: 1 }}>
            <CustomSnackbar
              visible={!!snackbarMessage}
              message={snackbarMessage}
              onDismiss={onDismissSnackBar}
            />
          </View>
        </>
      )}
    </>
  );
};

export default PersonalInformation;
