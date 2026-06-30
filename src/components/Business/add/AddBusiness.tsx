import { useIsFocused } from '@react-navigation/native';
import { getCountryData, getEmojiFlag, TCountryCode } from 'countries-list';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { Divider, List, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUploadImageStyle } from 'src/common/assets/styles/uploadimage';
import { IBlobType, IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import CustomDocumentWrapper from 'src/common/components/CustomDocumentWrapper/CustomDocumentWrapper';
import { CustomGooglePlacesAutocomplete } from 'src/common/components/CustomGooglePlacesAutocomplete/CustomGooglePlacesAutocomplete';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import CustomText from 'src/common/components/CustomText/CustomText';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { addBusiness, clearAddBusiness, fetchBusinessDataDetailsAction } from 'src/common/service/business/action';
import { IAddBusinessPayload } from 'src/common/service/business/api';
import { resetBusinessDetails } from 'src/common/service/business/slice';
import { fetchAllCountriesListAction } from 'src/common/service/country/action';
import { generateBusinessInitiaData, generateBusinessInitialErrorsData, IAddBusiness, ICountryOption, IErrorInfo, validateBusinessInfo } from 'src/components/Business/add/addBusinessUtils';
import SaveAndProceedBtn from 'src/components/Business/add/SaveAndProceedBtn/SaveAndProceedBtn';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { translateMessage } from 'src/i18n/createTranslation';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';



const AddBusinessPage = () => {
    const layout = useLayoutStyle();
    const formStyle = useFormStyle();
    const button = useButtonStyle();
    const style = useRestroStyle();
    const uploadimage = useUploadImageStyle();
    const { theme } = useAppTheme();
    const { t: TranslateMessage } = useTranslation();
    const dispatch: AppDispatch = useDispatch();
    const selectedPlan = useSelector((state: RootState) => state.business.selectedPlan);
    const {data:businessDetails,error:businessDetailsError,loading:businessDetailsLoading} = useSelector((state: RootState) => state.business.businessDetails);
    const { loading: addBusinessLoading, error: addBusinessError, success: addBusinessSuccess } = useSelector((state: RootState) => state.business.addBusiness);
    const { loading: countriesLoading, allUnregisteredCountrylist: allCountriesList } = useSelector((state: RootState) => state.country.countryDetails);
    const focus = useIsFocused();
    console.log(allCountriesList,'allCountriesList');
    
    const [images, setImages] = useState<IFilesData[]>([]);
    const [businessData, setBusinessData] = useState<IAddBusiness>({ ...generateBusinessInitiaData() });
    const [infoError, setInfoError] = useState<IErrorInfo>({ ...generateBusinessInitialErrorsData() });
    const [selectedCountryCode, setSelectedCountryCode] = useState<ICountryOption>({
        label: getEmojiFlag('IN'),
        value: 'IN',
    });
    const { businessId, planId, rideLimit } = useLocalSearchParams<{businessId: string; planId: string; rideLimit: string;}>();
    const [activeCountry, setActiveCountry] = useState<ICountryOption[]>([]);
    const [showCountryList, setShowCountryList] = useState<boolean>(false);
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
    const [snackbarType, setSnackbarType] = useState<SnackbarType>(SnackbarType.SUCCESS);

    function renderErrorMsgSection(error: string) {
        return <ErrorMessageContainer message={error} />;
    }
    useEffect(() => {

        if(businessId && focus) {
            fetchBusinessData(businessId)
        };
        if (!focus) {
            reset();
        }
    }, [focus]);

    useFocusEffect(
        useCallback(() => {
            if (!selectedPlan && !businessId) {
                router.push(`${Routes.BUSINESS}${Routes.PLANS}`);
            }
        }, [selectedPlan])
    );
    const fetchBusinessData = async (id: string) => {
            dispatch(fetchBusinessDataDetailsAction(businessId));
    };
    useEffect(() => {
        if (businessDetails) {
        setBusinessData(businessDetails);
        }
    }, [businessDetails]);

    useEffect(() => {
        if (addBusinessSuccess) {
            setSnackbarType(SnackbarType.SUCCESS);
            setSnackbarVisible(true);
            setTimeout(() => {
                dispatch(clearAddBusiness());
                router.push(Routes.BUSINESS);
            }, 2000);
        }
        if (addBusinessError) {
            setInfoError((prev) => ({
                ...prev,
                apiError: addBusinessError,
            }));
        }
    }, [addBusinessSuccess, addBusinessError]);
    const reset = () => {
        setImages([]);
        setSnackbarVisible(false);
        setBusinessData({ ...generateBusinessInitiaData() });
        setInfoError({ ...generateBusinessInitialErrorsData() });
        dispatch(clearAddBusiness());
        dispatch(resetBusinessDetails());
    };



    const onSelectImage = (blobs: IBlobType, newImages: IFilesData[]) => {
        setBusinessData((prevState) => ({
            ...prevState,
            file: blobs as Blob,
        }));
        setImages(newImages);
    };

    const removeImage = (index: number) => {
        if (!images || index >= images.length) {
            return;
        }
        setBusinessData((prevState) => ({
            ...prevState,
            file: null,
        }));
        setImages([]);
    };
    const capitalizeFirstLetter = (text: string) => {
        if (!text) {
            return text;
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const handleTextChange = (fieldName: string) => (text: string) => {
        const value = fieldName === 'businessName' ? capitalizeFirstLetter(text) : text;
        setBusinessData((prevState) => ({ ...prevState, [fieldName]: value }));
    };



    const handleSubmit = () => {
        const { isValid, errors: businessError } = validateBusinessInfo(businessData, selectedCountryCode.value);
        setInfoError(businessError);
        if (!isValid) {
            setInfoError(businessError);
            return false;
        }
        const payload: IAddBusinessPayload = {
            id: businessData.id,
            businessName: businessData.businessName, 
            businessEmail: businessData.businessEmail,
            phoneNumber: businessData.phoneNumber,
            fleetSize: Number(businessData.fleetSize),
            riderLimit: Number(businessData.riderLimit),
            businessAddress: businessData.businessAddress,
        };
        if (planId) {
            payload.planId = planId;
        }
        dispatch(addBusiness(payload));
        return true;
    };

    function renderErrorMsg(addressError: string) {
        if (addressError) {
            return <ErrorMessageContainer message={addressError} />;
        }
        return null;
    }
    function renderTitle() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <CustomText
                    text={translateMessage('Admin.Delivery.App.Business.Information')}
                />
                <Image
                    source={require('src/common/assets/images/EvonLogo.png')}
                    resizeMode='contain'
                    style={{ width: 72, height: 52 }}
                />
            </View>
        );
    }
    function renderBusinessTitle() {
        return (
            <View style={{ justifyContent: 'space-between' }}>
                <View>
                    <CustomText
                        text={translateMessage('Admin.Delivery.App.Business.BusinessManager')}
                    />
                </View>
            </View>
        );
    }
  const handlePlaceSelect = async (
    formatted_address: string,
    lat: number,
    lng: number
  ) => {
    setBusinessData((prevState) => ({
      ...prevState,
      businessAddress: formatted_address,
    }));
  };

    function renderName() {
        return (
            <View style={formStyle.width48}>
                <View>
                    <Typography variant='body' spacing={{ bottom: 10 }}>{translateMessage('Admin.Delivery.App.Business.NamePlaceHolder')}
                    <Typography variant='textLabel' color={theme.colors.textErrorDark}>*</Typography>
                    </Typography>
                </View>
                <View>
                    <TextInput
                        style={[
                            formStyle.inputField,
                            infoError.businessName !== '' && formStyle.errorBorderColor,

                        ]}
                        value={businessData.businessName}
                        mode='outlined'
                        autoCapitalize='sentences'
                        activeOutlineColor={theme.colors.borderErrorInverse}
                        outlineColor={theme.colors.borderMedium}
                        contentStyle={formStyle.inputPlaceholderLabel}
                        placeholderTextColor={theme.colors.textNeutral}
                        maxLength={100}
                        placeholder={translateMessage('Admin.Delivery.App.Business.NamePlaceHolder')}
                        onChangeText={handleTextChange('businessName')}

                    />
                    {infoError.businessName ? renderErrorMsgSection(infoError.businessName) : null}
                </View>
            </View>
        )
    }
    function renderAddress() {
        return (
            <View style={[formStyle.width48, { zIndex: 10 }]}>
                <View>
                    <Typography variant='body' spacing={{ bottom: 10 }}>{translateMessage('Admin.Delivery.App.BusinessAddress')}
                    <Typography variant='textLabel' color={theme.colors.textErrorDark}>*</Typography>
                    </Typography>
                </View>
                <View>
                    <CustomGooglePlacesAutocomplete
                        onPlaceSelect={handlePlaceSelect}
                        initialAddress={businessData.businessAddress}
                        error={infoError.businessAddress}
                        countryBound={selectedCountryCode.value}
                        onClear={() => handleTextChange('businessAddress')('')}
                    />
                    {infoError.businessAddress ? renderErrorMsgSection(infoError.businessAddress) : null}
                </View>
            </View>
        )
    }
    function renderFleetSize() {
        return (
            <View style={formStyle.width48}>
                <View>
                    <Typography variant='body' spacing={{ bottom: 10 }}>{translateMessage('Admin.Delivery.App.Business.FleetSize')}
                    <Typography variant='textLabel' color={theme.colors.textErrorDark}>*</Typography>
                    </Typography>
                </View>
                <View>
                    <TextInput
                        style={[
                            formStyle.inputField,
                            infoError.fleetSize !== '' && formStyle.errorBorderColor,

                        ]}
                        value={String(businessData.fleetSize)}
                        mode='outlined'
                        autoCapitalize='none'
                        activeOutlineColor={theme.colors.borderErrorInverse}
                        outlineColor={theme.colors.borderMedium}
                        contentStyle={formStyle.inputPlaceholderLabel}
                        placeholderTextColor={theme.colors.textNeutral}
                        maxLength={100}
                        placeholder={translateMessage('Admin.Delivery.App.Business.FleetSize')}
                        onChangeText={handleTextChange('fleetSize')}

                    />
                    {infoError.fleetSize ? renderErrorMsgSection(infoError.fleetSize) : null}
                </View>
            </View>
        )
    }
    function renderNumberOfDriver() {
        return (
            <View style={formStyle.width48}>
                <View>
                    <Typography variant='body' spacing={{ bottom: 10 }}>{translateMessage('Admin.Delivery.App.Business.NumberOfDriver')}
                    <Typography variant='textLabel' color={theme.colors.textErrorDark}>*</Typography>
                    </Typography>
                </View>
                <View>
                    <TextInput
                        style={[
                            formStyle.inputField,
                            infoError.riderLimit !== '' && formStyle.errorBorderColor,

                        ]}
                        value={String(businessData.riderLimit)}
                        mode='outlined'
                        autoCapitalize='none'
                        activeOutlineColor={theme.colors.borderErrorInverse}
                        outlineColor={theme.colors.borderMedium}
                        contentStyle={formStyle.inputPlaceholderLabel}
                        placeholderTextColor={theme.colors.textNeutral}
                        maxLength={100}
                        placeholder={translateMessage('Admin.Delivery.App.Business.NumberOfDriver')}
                        onChangeText={handleTextChange('riderLimit')}

                    />
                    {infoError.riderLimit ? renderErrorMsgSection(infoError.riderLimit) : null}
                </View>
            </View>
        )
    }


    useEffect(() => {
        dispatch(fetchAllCountriesListAction());
    }, []);

    useEffect(() => {
        if (allCountriesList && allCountriesList.length > 0) {
            const transformedData: ICountryOption[] = allCountriesList.map((item) => {
                const countryCode = item.countryISO as TCountryCode;
                return {
                    label: `${getEmojiFlag(countryCode)} ${item.countryName}`,
                    value: countryCode,
                };
            });
            setActiveCountry(transformedData);
        }
    }, [allCountriesList]);

    function renderPhone() {

        return (
            <View style={formStyle.width48}>
                <Typography variant='body' spacing={{ bottom: 10 }}>
                    {TranslateMessage('Admin.Delivery.App.Business.PhoneLabel')}
                    <Typography variant='textLabel' color={theme.colors.textErrorDark}>*</Typography>
                </Typography>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable onPress={() => setShowCountryList(!showCountryList)} style={formStyle.flag}>
                        <Typography variant='body' style={{ fontSize: 20 }}>{selectedCountryCode.label}</Typography>
                    </Pressable>
                    <View style={[formStyle.formCol]}>
                        <TextInput
                            mode='outlined'
                            autoCapitalize='none'
                            outlineColor='transparent'
                            activeOutlineColor='transparent'
                            value={`+${String(getCountryData(selectedCountryCode?.value as TCountryCode).phone?.[0])}`}
                            style={[formStyle.inputFieldAfix]}
                            contentStyle={[formStyle.inputPlaceholderLabel, {
                                paddingTop: 0, paddingRight: 0, paddingLeft: 10, lineHeight: 15
                            }]}
                            editable={false}
                        />

                        <TextInput
                            style={[
                                formStyle.inputField,
                                { paddingStart: 65, borderWidth: 0, borderRadius: 8, height: 50 },
                            ]}
                            placeholder={TranslateMessage('Admin.Delivery.App.PhonePlaceholder')}
                            mode='outlined'
                            keyboardType='phone-pad'
                            autoCapitalize='none'
                            activeOutlineColor={theme.colors.borderErrorInverse}
                            outlineColor={theme.colors.borderMedium}
                            value={businessData.phoneNumber}
                            onChangeText={handleTextChange('phoneNumber')}
                            contentStyle={formStyle.inputPlaceholderLabel}
                            returnKeyType='done'
                            blurOnSubmit={true}
                        />
                    </View>
                </View>

                {infoError.phoneNumber ? renderErrorMsgSection(infoError.phoneNumber) : null}
                {showCountryList && (
                    <>
                        <Pressable
                            style={formStyle.countryFlagContainer}
                            onPress={() => setShowCountryList(false)}
                        />
                        <View style={formStyle.countryFlagList}>
                            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                                <List.Section>
                                    {activeCountry?.map((country) => (
                                        <List.Item
                                            key={country.value}
                                            title={country.label}
                                            onPress={() => {
                                                const flag = getEmojiFlag(country.value as TCountryCode);
                                                setSelectedCountryCode({
                                                    label: flag,
                                                    value: country.value,
                                                });
                                                setShowCountryList(false);
                                            }}
                                        />
                                    ))}
                                </List.Section>
                            </ScrollView>
                        </View>
                    </>
                )}
            </View>
        );
    }



    function renderBusinessEmail() {
        return (
            <View style={formStyle.width48}>
                <View>
                    <Typography  variant='body' spacing={{ bottom: 10 }}>
                        {TranslateMessage('Admin.Delivery.App.Business.EmailLabel')}
                        <Typography variant='textLabel' color={theme.colors.textErrorDark}>*</Typography>
                    </Typography>
                </View>
                <View>
                    <TextInput
                        style={[
                            formStyle.inputField,
                            infoError.businessEmail != '' && formStyle.errorBorderColor,
                        ]}
                        mode='outlined'
                        placeholderTextColor={theme.colors.textNeutral}
                        autoCapitalize='none'
                        activeOutlineColor={theme.colors.borderErrorInverse}
                        outlineColor={theme.colors.borderMedium}
                        contentStyle={formStyle.inputPlaceholderLabel}
                        value={businessData.businessEmail}
                        placeholder={TranslateMessage(
                            'Admin.Delivery.App.Business.EmailLabel',
                        )}
                        onChangeText={handleTextChange('businessEmail')}
                    />
                    {infoError.businessEmail
                        ? renderErrorMsgSection(infoError.businessEmail)
                        : null}
                </View>
            </View>
        );
    }

    function renderImage() {
        return (
            <View style={[layout.cardBody, { padding: 0, marginBottom: 16 }]}>
                <View style={[uploadimage.uploaddirection,]}>
                    <CustomDocumentWrapper
                        label={TranslateMessage('Admin.Delivery.App.Company.LogoTitle')}
                        onSelect={onSelectImage}
                        type={['image/png', 'image/jpeg', 'image/jpg']}
                        multiple={false}
                        files={images}
                        handleRemoveFile={removeImage}
                    />
                </View>
                <Typography variant='body' color={theme.colors.textNeutral} spacing={{ top: 5 }}>{TranslateMessage('Admin.Delivery.App.Restaurant.Image.Type')}</Typography>

                {infoError.file ? renderErrorMsgSection(infoError.file) : null}
            </View>
        );
    }
    function renderHeading() {
        return (
            <><View
                style={[
                    layout.container,
                    style.headerContainer,
                    layout.paddingTop26,
                    { marginHorizontal: theme.spacing.md }
                ]}
            >
                <View style={style.filterrow}>
                    <Typography variant='subHeading'>
                        {TranslateMessage('Admin.Delivery.App.BusinessManagement.Heading')}
                    </Typography>
                </View>
            </View><Divider style={[layout.DividerSperator, { marginBottom: 30 }]} /></>
        )
    }
    return (
        <>
            <View style={{ flex: 1 }}>
                {renderHeading()}
                <Loader loading={addBusinessLoading || countriesLoading || businessDetailsLoading} />
                <ScrollView
                    keyboardShouldPersistTaps={"always"}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={[layout.cardBox, { flex: 1, margin: theme.spacing.sm }]}>
                        <View >
                            <View style={[layout.cardHeader, { marginBottom: 10 }]}>
                                {renderTitle()}
                            </View>
                            <View style={formStyle.formBoxLayout}>
                                {/* {renderImage()} */}
                                <View style={formStyle.formRow}>
                                    {renderName()}
                                    {renderBusinessEmail()}
                                </View>
                                <View style={formStyle.formRow}>
                                    {renderPhone()}
                                    {renderAddress()}
                                </View>
                            </View>
                            {/* <View style={{ zIndex: -10 }}>
                                <View style={[layout.cardHeader, { marginBottom: 10 }]}>
                                    {renderBusinessTitle()}
                                </View>
                                <View style={formStyle.formRow}>
                                    {renderFleetSize()}
                                    {renderNumberOfDriver()}
                                </View>
                                <View style={formStyle.formRow}>
                                    {renderAddress()}
                                </View>
                            </View> */}
                            <View style={[layout.btnRgt, { zIndex: -1000 }]}>
                                <SaveAndProceedBtn
                                    onClick={() => handleSubmit()}
                                    btnTitle={businessId?TranslateMessage('Admin.Delivery.App.EditBusiness'):TranslateMessage('Admin.Delivery.App.AddBusiness')}
                                    disabled={addBusinessLoading}
                                />
                            </View>
                        </View>

                        <View>
                            {renderErrorMsg(infoError.apiError)}
                        </View>
                        <CustomSnackbar
                            visible={snackbarVisible}
                            message={translateMessage('Admin.Delivery.App.Business.AddSuccessMessage')}
                            type={snackbarType}
                            onDismiss={() => setSnackbarVisible(false)}
                        />
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

export default AddBusinessPage;
