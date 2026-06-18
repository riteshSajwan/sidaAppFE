import { getCountryData, TCountryCode } from 'countries-list';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextInput as RNTextInput } from 'react-native';
import {
  InteractionManager,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomModal from 'src/common/components/CustomModal/CustomModal';
import CustomSnackbar from 'src/common/components/CustomSnackbar/CustomSnackbar';
import CustomText from 'src/common/components/CustomText/CustomText';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import {
  fetchBankDataAction,
  updateBankDataAction,
} from 'src/common/service/onboarding/action';
import {
  verifyOtpBankingDetails
} from 'src/common/service/onboarding/api';
import {
  resetBankData,
  resetBankUpdateSuccess,
} from 'src/common/service/onboarding/slice';
import { isIOSPlatform } from 'src/common/utils/isMobilePlatform';
import {
  generateBankIntialErrorMsg,
  IBankDataResponse,
  IBankErrors,
  IBankInfo,
  IBankTransfer,
  IBankTransferErrors,
  IMobilePayment,
  IMobilePaymentErrors,
  OtpCodes,
  PaymentOptions,
} from 'src/components/DriverOnboarding/BankDetails/BankDetailsUtil';
import { validateBankingDetails } from 'src/components/DriverOnboarding/BankDetails/BankingDetailsValidationUtil';
import {
  ALLOW_EMAIL_INPUT_SIZE,
  ALLOW_MIN_INPUT_SIZE,
} from 'src/components/DriverOnboarding/constant/index';
import { getCountryAndCallingCodeByPhoneNumber } from 'src/components/DriverOnboarding/util/getCountryCallingCodeUtil';
import { getCustomTwiloMessageFromCode } from 'src/components/DriverOnboarding/util/getCustomTwiloMessageFromCode';
import {
  IApiErrorAuthResponse,
  IApiErrorDetailResponse,
  IApiErrorResponse,
} from 'src/components/DriverOnboarding/util/OnBoardingUtil';
import { removeCallingCode } from 'src/components/DriverOnboarding/util/removeCallingCodeUtil';
import { AppThunkDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
import { ICountryData } from '../CountryPickerModal/AllCountryList';
import CountryListModal from '../CountryPickerModal/CountryPickerModal';
import CustomSegmentButton from '../CustomSegmentButton/CustomSegmentButton';
import { useOnBoardingStyle } from '../onBoardingstyle';

type Props = {
  handleNextStep: () => void;
};
const BankDetails: React.FC<Props> = ({ handleNextStep }) => {
  const layout = useLayoutStyle();
  const button = useButtonStyle();
  const formStyle = useFormStyle();
  const { theme } = useAppTheme();
  const onBoardingStyle = useOnBoardingStyle();
  const dispatch: AppThunkDispatch = useDispatch();
  const { t: TranslateMessage } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Redux state selectors
  const {
    data: bankDataFromRedux,
    loading,
    error,
    isUpdating,
    updateSuccess,
  } = useSelector((state: RootState) => state.onboarding.bankData);

  const userDetails = useSelector((state: RootState) => state.profile);

  // Local state
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');
  const [verifyOtp, setVerifyOtp] = useState<string>('');
  const [errorsMsg, setErrorsMsg] = useState<IBankErrors>(
    generateBankIntialErrorMsg(),
  );

  // const phoneCode = userDetails?.phoneNumber
  const phoneCode = +918057186041
    ? // ? getCountryAndCallingCodeByPhoneNumber(userDetails?.phoneNumber)
      getCountryAndCallingCodeByPhoneNumber('+918057186041')
    : {
        countryName: null,
        callingCode: null,
        countryCode: 'AD',
      };
  const validCountryCode = (phoneCode.countryCode ?? 'AD') as TCountryCode;
  const [bankData, setBankData] = useState<IBankInfo>({
    selectedPayment: PaymentOptions.BANKTRANSFER,
    bankTransfer: {
      accountHolderName: '',
      ribNumber: '',
      confirmRibNumber: '',
      isPrimary: false,
      paymentMethod: '',
      primaryAccount: false,
    },
    orangeTransfer: {
      accountHolderName: '',
      mobileNumber: '',
      confirmMobileNumber: '',
      isPrimary: false,
      paymentMethod: '',
      countryCode: validCountryCode,
      callingCode: String(getCountryData(validCountryCode).phone?.[0]),
      primaryAccount: false,
    },
    wave: {
      accountHolderName: '',
      mobileNumber: '',
      confirmMobileNumber: '',
      isPrimary: false,
      paymentMethod: '',
      countryCode: validCountryCode,
      callingCode: String(getCountryData(validCountryCode).phone?.[0]),
      primaryAccount: false,
    },
  });
  const bankDataRef = useRef(null);
  const blockedStatus = false;

  // Fetch bank data on component mount
  useFocusEffect(
    useCallback(() => {
      if (id) {
        dispatch(fetchBankDataAction(id));
      }
      return () => {
        dispatch(resetBankData());
      };
    }, [dispatch, id]),
  );

  // Process bank data when it's loaded from Redux
  useEffect(() => {
    if (bankDataFromRedux && bankDataFromRedux.length > 0) {
      processBankData(bankDataFromRedux);
    }
  }, [bankDataFromRedux]);

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
        TranslateMessage('Admin.Delivery.App.Bank.Details.Success'),
      );
      dispatch(resetBankUpdateSuccess());
    }
  }, [updateSuccess, loading, error, TranslateMessage, dispatch]);

  const processBankData = useCallback(
    (response: IBankDataResponse[]) => {
      const fallbackCountryCode = 'AD' as TCountryCode;
      const safeCountryCode = (phoneCode.countryCode ??
        fallbackCountryCode) as TCountryCode;
      const formattedData: IBankInfo = {
        selectedPayment: PaymentOptions.BANKTRANSFER,
        bankTransfer: {
          accountHolderName: '',
          ribNumber: '',
          confirmRibNumber: '',
          isPrimary: false,
          paymentMethod: '',
          primaryAccount: false,
        },
        orangeTransfer: {
          accountHolderName: '',
          mobileNumber: '',
          confirmMobileNumber: '',
          isPrimary: false,
          paymentMethod: '',
          countryCode: (phoneCode.countryCode ??
            fallbackCountryCode) as TCountryCode,
          callingCode: String(getCountryData(safeCountryCode).phone?.[0] ?? ''),
          primaryAccount: false,
        },
        wave: {
          accountHolderName: '',
          mobileNumber: '',
          confirmMobileNumber: '',
          isPrimary: false,
          paymentMethod: '',
          countryCode: (phoneCode.countryCode ??
            fallbackCountryCode) as TCountryCode,
          callingCode: String(getCountryData(safeCountryCode).phone?.[0] ?? ''),
          primaryAccount: false,
        },
      };
      response.forEach((item: IBankDataResponse) => {
        if (item.paymentMethod === PaymentOptions.BANKTRANSFER) {
          formattedData.bankTransfer = {
            accountHolderName: item.accountHolderName,
            ribNumber: item.ribNumber || '',
            confirmRibNumber: item.ribNumber || '',
            isPrimary: item.isPrimary,
            paymentMethod: item.paymentMethod,
            primaryAccount: item.isPrimary,
          };
          if (item.isPrimary) {
            formattedData.selectedPayment = PaymentOptions.BANKTRANSFER;
          }
        } else if (item.paymentMethod === PaymentOptions.ORANGETRANSFER) {
          if (item?.mobileNumber) {
            const phoneCode = getCountryAndCallingCodeByPhoneNumber(
              item?.mobileNumber,
            );
            const phoneNumberWithoutCallingCode =
              phoneCode?.callingCode && item?.mobileNumber
                ? removeCallingCode(item?.mobileNumber, phoneCode.callingCode)
                : item?.mobileNumber;
            const countryCode = (phoneCode.countryCode ?? 'AD') as TCountryCode;
            const callingCode = phoneCode.callingCode ?? '';
            formattedData.orangeTransfer = {
              accountHolderName: item.accountHolderName,
              mobileNumber: phoneNumberWithoutCallingCode || '',
              confirmMobileNumber: phoneNumberWithoutCallingCode || '',
              isPrimary: item.isPrimary,
              paymentMethod: item.paymentMethod,
              countryCode: countryCode,
              callingCode: callingCode,
              primaryAccount: item.isPrimary,
            };
          }
          if (item.isPrimary) {
            formattedData.selectedPayment = PaymentOptions.ORANGETRANSFER;
          }
        } else if (item.paymentMethod === PaymentOptions.WAVE) {
          if (item?.mobileNumber) {
            const phoneCode = getCountryAndCallingCodeByPhoneNumber(
              item?.mobileNumber,
            );
            const phoneNumberWithoutCallingCode =
              phoneCode?.callingCode && item?.mobileNumber
                ? removeCallingCode(item?.mobileNumber, phoneCode.callingCode)
                : item?.mobileNumber;
            const countryCode = (phoneCode.countryCode ?? 'AD') as TCountryCode;
            const callingCode = phoneCode.callingCode ?? '';
            formattedData.wave = {
              accountHolderName: item.accountHolderName,
              mobileNumber: phoneNumberWithoutCallingCode || '',
              confirmMobileNumber: phoneNumberWithoutCallingCode || '',
              isPrimary: item.isPrimary,
              paymentMethod: item.paymentMethod,
              countryCode: countryCode,
              callingCode: callingCode,
              primaryAccount: item.isPrimary,
            };
          }
          if (item.isPrimary) {
            formattedData.selectedPayment = PaymentOptions.WAVE;
          }
        }
      });

      setBankData(formattedData);
      if (!bankDataRef.current) {
        bankDataRef.current = JSON.parse(JSON.stringify(formattedData));
      }
    },
    [phoneCode],
  );

  useEffect(() => {
    const primaryMethods = getPrimaryPaymentMethods();
  }, [bankData]);

  const onBtnClick = () => {
    if (validateForm()) {
      setErrorsMsg(generateBankIntialErrorMsg);
    }
  };

  const isModified = () => {
    if (!bankDataRef.current || !bankData) return false;
    const currentBankData = bankDataRef.current as IBankInfo;
    const newBankData = bankData as IBankInfo;
    const { selectedPayment: _1, ...currentRest } = currentBankData;
    const { selectedPayment: _2, ...newRest } = newBankData;
    return JSON.stringify(currentRest) !== JSON.stringify(newRest);
  };

  const validateForm = () => {
    const result = validateBankingDetails(bankData);
    setErrorsMsg(result.errors);
    return result.isValid;
  };

  function toggleModal(modalVisibility: boolean) {
    setIsModalVisible(modalVisibility);
  }

  const submitData = () => {
    setErrorsMsg(generateBankIntialErrorMsg);
    Keyboard.dismiss();
    const validatedInfo = validateForm();
    if (validatedInfo) {
      // if (isModified()) {
      // setOtpLoading(true);
      // setErrorsMsg(generateBankIntialErrorMsg);
      // sendOtpBankingDetails()
      //   .then((response) => {
      //     if (response) {
      //       setOtpLoading(false);
      //       setIsOTPModalVisible(true);
      //     }
      //   })
      //   .catch((error) => {
      //     setOtpLoading(false);
      //     setOtpApiError(error as IApiErrorDetailResponse);
      //   });
      // } else {
      //   router.push(Routes.DRIVER)
      // }
      updateAccount();
    }
  };

  function onCancelHandler() {
    setModalError('');
    setIsOTPModalVisible(!isOTPModalVisible);
    setVerifyOtp('');
  }

  const closeOTPModal = () => {
    setVerifyOtp('');
    setModalError('');
    setIsOTPModalVisible(false);
  };

  const accountInputRef = useRef<RNTextInput | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading && !blockedStatus) {
      InteractionManager.runAfterInteractions(() => {
        timeoutRef.current = setTimeout(() => {
          accountInputRef.current?.focus();
        }, 100);
      });
    }
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [loading, blockedStatus]);

  const handleSave = () => {
    if (!verifyOtp) {
      setModalError(TranslateMessage('Admin.Delivery.App.OTP.Required'));
      return;
    }

    verifyOtpBankingDetails(verifyOtp, '+918057186041')
      .then((response) => {
        if (response) {
          setIsOTPModalVisible(!isOTPModalVisible);
          if (true) {
            handleYes();
          } else {
          }
        } else {
          setModalError(TranslateMessage('Admin.Delivery.App.Incorrect.OTP'));
          return;
        }
      })
      .catch((error) => {
        const errorMessage = error as IApiErrorResponse;
        if (errorMessage.code === OtpCodes.OTP_EXPIRED) {
          setModalError(TranslateMessage('Admin.Delivery.App.Otp.Invalid'));
        } else {
          setModalError(TranslateMessage('Admin.Delivery.App.Otp.Error'));
        }
      });
  };

  const toggleModalValue = () => {
    toggleModal(!isModalVisible);
    setVerifyOtp('');
  };

  function toggleOTPModalValue() {
    toggleModal(!isOTPModalVisible);
    setIsOTPModalVisible(false);
  }

  const handleNo = () => {
    toggleModal(false);
    setVerifyOtp('');
  };
  const setApiError = (error: IApiErrorAuthResponse) => {
    const apiError = error.message;
    setErrorsMsg((prevState) => ({
      ...prevState,
      apiError,
    }));
  };

  const setOtpApiError = (error: IApiErrorDetailResponse) => {
    if (error.details[0]) {
      const apiError = error.details[0];
      setErrorsMsg((prevState) => ({
        ...prevState,
        apiError,
      }));
    } else if (error?.code) {
      const customMessage = getCustomTwiloMessageFromCode(error.code);
      setErrorsMsg((prevState) => ({
        ...prevState,
        apiError: customMessage,
      }));
    } else {
      setErrorsMsg((prevState) => ({
        ...prevState,
        apiError: TranslateMessage('Admin.Delivery.App.Otp.Error'),
      }));
    }
  };

  const updateAccount = () => {
    const bankDetailsPayload = [];
    if (bankData.bankTransfer.accountHolderName) {
      bankDetailsPayload.push({
        accountHolderName: bankData.bankTransfer.accountHolderName,
        paymentMethod: PaymentOptions.BANKTRANSFER,
        ribNumber: bankData.bankTransfer.ribNumber,
        isPrimary: bankData.bankTransfer.primaryAccount,
        userId: id,
      });
    }

    if (bankData.orangeTransfer.accountHolderName) {
      bankDetailsPayload.push({
        accountHolderName: bankData.orangeTransfer.accountHolderName,
        paymentMethod: PaymentOptions.ORANGETRANSFER,
        mobileNumber: `+${bankData.orangeTransfer.callingCode}${bankData.orangeTransfer.mobileNumber}`,
        isPrimary: bankData.orangeTransfer.primaryAccount,
        userId: id,
      });
    }

    if (bankData.wave.accountHolderName) {
      bankDetailsPayload.push({
        accountHolderName: bankData.wave.accountHolderName,
        paymentMethod: PaymentOptions.WAVE,
        mobileNumber: `+${bankData.wave.callingCode}${bankData.wave.mobileNumber}`,
        isPrimary: bankData.wave.primaryAccount,
        userId: id,
      });
    }

    dispatch(updateBankDataAction(bankDetailsPayload));
    setVerifyOtp('');
    setModalError('');
  };

  function handleYes() {
    toggleModal(false);
    updateAccount();
  }
  const handleOtp = (text: string) => {
    setModalError('');
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= ALLOW_MIN_INPUT_SIZE) {
      setVerifyOtp(numericText);
    }
  };

  const getPrimaryPaymentMethods = () => {
    const primaryMethod = Object.values(bankData).find(
      (sectionData) => sectionData?.isPrimary === true,
    );

    return primaryMethod ? primaryMethod.paymentMethod : null;
  };

  const handleInput =
    (section: keyof IBankInfo, key: string, clearSection: keyof IBankErrors) =>
    (text: string) => {
      if (
        (key === 'mobileNumber' || key === 'confirmMobileNumber') &&
        text.length > 20
      ) {
        return;
      }

      setErrorsMsg((prevState) => ({
        ...prevState,
        [section]: {
          ...((prevState[clearSection] as IBankTransferErrors) ||
            (prevState[clearSection] as IMobilePaymentErrors)),
          [`${key}Error`]: '',
        },
      }));

      setBankData((prevState) => ({
        ...prevState,
        [section]: {
          ...((prevState[section] as IBankTransfer) ||
            (prevState[section] as IMobilePayment)),
          [key]: text,
        },
      }));
    };
  const onDismissSnackBar = () => {
    handleNextStep();
    setSnackbarMessage('');
    const timeoutId = setTimeout(() => {}, 3000);
    clearTimeout(timeoutId);
  };
  const primaryAccountHandler =
    (section: keyof Omit<IBankInfo, 'paymentMode'>) => () => {
      setBankData((prevState) => {
        const newState = JSON.parse(JSON.stringify(prevState));
        const isCurrentlyPrimary = newState[section]?.primaryAccount === true;
        Object.keys(newState).forEach((key) => {
          if (typeof newState[key] === 'object') {
            newState[key].primaryAccount = false;
          }
        });
        if (!isCurrentlyPrimary) {
          newState[section].primaryAccount = true;
        }
        return newState as IBankInfo;
      });
      type Section = Exclude<keyof IBankInfo, 'selectedPayment'>;

      setErrorsMsg((prevState) => ({
        ...prevState,
        [section as Section]: {
          ...prevState[section as Section],
          primaryAccountError: '',
        },
      }));
    };

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }

  function renderTitle() {
    return (
      <View style={[formStyle.formHeader]}>
        <CustomText
          text={TranslateMessage('Admin.Delivery.App.Banking.Details')}
        />
      </View>
    );
  }

  function renderNote() {
    return (
      <View
        style={[
          layout.flexDirectionRow,
          layout.alignItemCenter,
          {
            marginBottom: theme.spacing.md,
            marginTop: theme.spacing.xs,
            gap: isIOSPlatform() ? 4 : 6,
          },
        ]}
      >
        <Text allowFontScaling={false} style={onBoardingStyle.noteText}>
          <Text allowFontScaling={false} style={onBoardingStyle.noteInnerText}>
            {TranslateMessage('Admin.Delivery.App.Note.Label')}:{' '}
          </Text>
          {TranslateMessage('Admin.Delivery.App.OTP.Limit')}
        </Text>
      </View>
    );
  }

  const setPaymentMode = (value: string) => {
    setBankData((prev) => ({
      ...prev,
      selectedPayment: value,
    }));
  };

  function renderPaymentMethod() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Bank.Payment.Title')}
          </Text>
          <CustomSegmentButton
            value={bankData.selectedPayment}
            setValue={setPaymentMode}
            buttons={[
              {
                value: PaymentOptions.BANKTRANSFER,
                label: TranslateMessage('Admin.Delivery.BANKTRANSFER'),
              },
              {
                value: PaymentOptions.ORANGETRANSFER,
                label: TranslateMessage('Admin.Delivery.ORANGETRANSFER'),
              },
              {
                value: PaymentOptions.WAVE,
                label: TranslateMessage('Admin.Delivery.WAVE'),
              },
            ]}
          />
          {renderErrorMsgSection(errorsMsg.paymentModeError)}
        </View>
      </View>
    );
  }

  function renderBankTransferSection() {
    return (
      <>
        <View style={[formStyle.formRow]}>
          <View style={formStyle.formCol}>
            <Text allowFontScaling={false} style={formStyle.labelTitle}>
              {TranslateMessage('Admin.Delivery.App.Bank.Name')}
              <Text
                allowFontScaling={false}
                style={{ color: theme.colors.textErrorDark }}
              >
                *
              </Text>
            </Text>
            <TextInput
              style={[formStyle.inputField]}
              mode='outlined'
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderLinkInverse}
              outlineColor={
                errorsMsg.bankTransfer.accountHolderNameError
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
              }
              placeholder={TranslateMessage('Admin.Delivery.App.Bank.Name')}
              value={bankData.bankTransfer.accountHolderName ?? ''}
              onChangeText={handleInput(
                'bankTransfer',
                'accountHolderName',
                'bankTransfer',
              )}
              placeholderTextColor={theme.colors.textNeutral}
              contentStyle={formStyle.textInputLabel}
              maxLength={ALLOW_EMAIL_INPUT_SIZE}
              ref={accountInputRef}
              outlineStyle={formStyle.inputFieldOuline}
            />
            {renderErrorMsgSection(
              errorsMsg.bankTransfer.accountHolderNameError,
            )}
          </View>
        </View>
        <View style={[formStyle.formRow]}>
          <View style={formStyle.formCol}>
            <Text allowFontScaling={false} style={formStyle.labelTitle}>
              {TranslateMessage('Admin.Delivery.App.RIB.Number')}
              <Text
                allowFontScaling={false}
                style={{ color: theme.colors.textErrorDark }}
              >
                *
              </Text>
            </Text>
            <TextInput
              style={[formStyle.inputField]}
              mode='outlined'
              autoCapitalize='none'
              keyboardType='phone-pad'
              activeOutlineColor={theme.colors.borderLinkInverse}
              outlineColor={
                errorsMsg.bankTransfer.ribNumberError
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
              }
              placeholder={TranslateMessage('Admin.Delivery.App.RIB.Number')}
              value={bankData.bankTransfer.ribNumber ?? ''}
              onChangeText={handleInput(
                'bankTransfer',
                'ribNumber',
                'bankTransfer',
              )}
              placeholderTextColor={theme.colors.textNeutral}
              contentStyle={formStyle.textInputLabel}
              outlineStyle={formStyle.inputFieldOuline}
            />
            {renderErrorMsgSection(errorsMsg.bankTransfer.ribNumberError)}
          </View>
        </View>
        <View style={[formStyle.formRow]}>
          <View style={formStyle.formCol}>
            <Text allowFontScaling={false} style={formStyle.labelTitle}>
              {TranslateMessage('Admin.Delivery.App.RIB.ReRIB.Number')}
              <Text
                allowFontScaling={false}
                style={{ color: theme.colors.textErrorDark }}
              >
                *
              </Text>
            </Text>
            <TextInput
              style={[formStyle.inputField]}
              mode='outlined'
              keyboardType='phone-pad'
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderLinkInverse}
              outlineColor={
                errorsMsg.bankTransfer.confirmRibNumberError
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
              }
              placeholder={TranslateMessage(
                'Admin.Delivery.App.RIB.ReRIB.Number',
              )}
              value={bankData.bankTransfer.confirmRibNumber ?? ''}
              onChangeText={handleInput(
                'bankTransfer',
                'confirmRibNumber',
                'bankTransfer',
              )}
              placeholderTextColor={theme.colors.textNeutral}
              contentStyle={formStyle.textInputLabel}
              outlineStyle={formStyle.inputFieldOuline}
            />
            {renderErrorMsgSection(
              errorsMsg.bankTransfer.confirmRibNumberError,
            )}
          </View>
        </View>

        <View
          style={[formStyle.formRow, layout.mb0, { gap: theme.spacing.sm }]}
        >
          <Pressable onPress={primaryAccountHandler('bankTransfer')}>
            <Icon
              name={
                bankData.bankTransfer.primaryAccount
                  ? 'checkboxChecked'
                  : 'checkboxBlank'
              }
              size={24}
              color={theme.colors.iconBase}
            />
          </Pressable>
          <Text allowFontScaling={false} style={formStyle.checkBoxlabel}>
            {TranslateMessage('Admin.Delivery.App.Set.Primary.Account')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
        </View>
        {renderNote()}
        {renderErrorMsgSection(errorsMsg.bankTransfer.primaryAccountError)}
      </>
    );
  }
  function renderPhoneNumberInput() {
    return (
      <>
        {/* <TextInput
          mode='outlined'
          autoCapitalize='none'
          outlineColor='transparent'
          activeOutlineColor='transparent'
          value={bankData.selectedPayment === PaymentOptions.ORANGETRANSFER ? `+${bankData.orangeTransfer.callingCode}` : `+${bankData.wave.callingCode}`}
          style={[formStyle.inputFieldAfix, { paddingLeft: 10 }]}
          contentStyle={[formStyle.formInput, { paddingHorizontal: 5 }]}
          placeholderTextColor={theme.colors.textNeutral}
          outlineStyle={formStyle.inputFieldOuline}

        /> */}
        {renderMobileNumberContainer()}
      </>
    );
  }
  function renderMobileNumberContainer() {
    return bankData.selectedPayment === PaymentOptions.ORANGETRANSFER ? (
      <TextInput
        style={[formStyle.inputField, { paddingLeft: theme.spacing.sm }]}
        mode='outlined'
        autoCapitalize='none'
        keyboardType='phone-pad'
        activeOutlineColor={theme.colors.borderLinkInverse}
        outlineColor={
          errorsMsg.orangeTransfer.mobileNumberError
            ? theme.colors.borderErrorInverse
            : theme.colors.borderMedium
        }
        placeholder={TranslateMessage('Admin.Delivery.App.Mobile.Number')}
        value={bankData.orangeTransfer.mobileNumber ?? ''}
        onChangeText={handleInput(
          'orangeTransfer',
          'mobileNumber',
          'orangeTransfer',
        )}
        placeholderTextColor={theme.colors.textNeutral}
        contentStyle={formStyle.textInputLabel}
        outlineStyle={formStyle.inputFieldOuline}
        left={
          <TextInput.Icon
            icon={() => (
              <Text
                allowFontScaling={false}
                style={onBoardingStyle.inputAfexIcon}
              >
                {`+${bankData.orangeTransfer.callingCode}`}
              </Text>
            )}
            style={onBoardingStyle.inputAfex}
          />
        }
      />
    ) : bankData.selectedPayment === PaymentOptions.WAVE ? (
      <TextInput
        style={[formStyle.inputField, { paddingLeft: theme.spacing.sm }]}
        mode='outlined'
        autoCapitalize='none'
        keyboardType='phone-pad'
        activeOutlineColor={theme.colors.borderLinkInverse}
        outlineColor={
          errorsMsg.wave.mobileNumberError
            ? theme.colors.borderErrorInverse
            : theme.colors.borderMedium
        }
        placeholder={TranslateMessage('Admin.Delivery.App.Mobile.Number')}
        value={bankData.wave.mobileNumber ?? ''}
        onChangeText={handleInput('wave', 'mobileNumber', 'wave')}
        placeholderTextColor={theme.colors.textNeutral}
        contentStyle={formStyle.textInputLabel}
        outlineStyle={formStyle.inputFieldOuline}
        left={
          <TextInput.Icon
            icon={() => (
              <Text
                allowFontScaling={false}
                style={onBoardingStyle.inputAfexIcon}
              >
                {`+${bankData.wave.callingCode}`}
              </Text>
            )}
            style={onBoardingStyle.inputAfex}
          />
        }
      />
    ) : null;
  }
  const orangeTransferHandleSelectCountry = (selectedCountry: ICountryData) => {
    setBankData((prevState) => {
      return {
        ...prevState,
        orangeTransfer: {
          ...prevState.orangeTransfer,
          mobileNumber: '',
          countryCode: selectedCountry.code,
          callingCode: String(selectedCountry.callingCodes?.[0]),
        },
      };
    });
  };
  function renderWaveCountryPicker() {
    return (
      <CountryListModal
        countryCode={bankData.wave.countryCode}
        onSelect={waveHandleSelectCountry}
      />
    );
  }
  const waveHandleSelectCountry = (selectedCountry: ICountryData) => {
    setBankData((prevState: IBankInfo) => {
      return {
        ...prevState,
        wave: {
          ...prevState.wave,
          mobileNumber: '',
          countryCode: selectedCountry.code,
          callingCode: String(selectedCountry.callingCodes?.[0]),
        },
      };
    });
  };

  function renderOrangeCountryPicker() {
    return (
      <CountryListModal
        countryCode={bankData.orangeTransfer.countryCode}
        onSelect={orangeTransferHandleSelectCountry}
      />
    );
  }
  function renderOrangeTransferSection() {
    return (
      <>
        <View style={[formStyle.formRow]}>
          <View style={formStyle.formCol}>
            <Text allowFontScaling={false} style={formStyle.labelTitle}>
              {TranslateMessage('Admin.Delivery.App.Bank.Name')}
              <Text
                allowFontScaling={false}
                style={{ color: theme.colors.textErrorDark }}
              >
                *
              </Text>
            </Text>
            <TextInput
              style={[formStyle.inputField]}
              mode='outlined'
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderLinkInverse}
              outlineColor={
                errorsMsg.orangeTransfer.accountHolderNameError
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
              }
              placeholder={TranslateMessage('Admin.Delivery.App.Bank.Name')}
              value={bankData.orangeTransfer.accountHolderName ?? ''}
              onChangeText={handleInput(
                'orangeTransfer',
                'accountHolderName',
                'orangeTransfer',
              )}
              placeholderTextColor={theme.colors.textNeutral}
              contentStyle={formStyle.textInputLabel}
              maxLength={ALLOW_EMAIL_INPUT_SIZE}
              ref={accountInputRef}
              outlineStyle={formStyle.inputFieldOuline}
            />
            {renderErrorMsgSection(
              errorsMsg.orangeTransfer.accountHolderNameError,
            )}
          </View>
        </View>
        <View style={[formStyle.formRow, { marginBottom: 0 }]}>
          <View style={formStyle.formCol}>
            <Text allowFontScaling={false} style={formStyle.labelTitle}>
              {TranslateMessage('Admin.Delivery.App.Mobile.Number')}
              <Text
                allowFontScaling={false}
                style={{ color: theme.colors.textErrorDark }}
              >
                *
              </Text>
            </Text>
            <View style={[formStyle.formRow]}>
              <View style={onBoardingStyle.countryView}>
                {renderOrangeCountryPicker()}

                <Icon name='dropDown' size={8} color={theme.colors.iconBase} />
              </View>
              <View style={{ marginBottom: 0, flex: 1 }}>
                {renderPhoneNumberInput()}
              </View>
            </View>
            <View
              style={[
                onBoardingStyle.errorBankView,
                onBoardingStyle.phoneNumberError,
              ]}
            >
              {renderErrorMsgSection(
                errorsMsg.orangeTransfer.mobileNumberError,
              )}
            </View>
          </View>
        </View>
        <View style={[formStyle.formRow]}>
          <View style={formStyle.formCol}>
            <Text allowFontScaling={false} style={formStyle.labelTitle}>
              {TranslateMessage('Admin.Delivery.App.Re-Mobile.Number')}
              <Text
                allowFontScaling={false}
                style={{ color: theme.colors.textErrorDark }}
              >
                *
              </Text>
            </Text>
            <TextInput
              style={[formStyle.inputField]}
              mode='outlined'
              keyboardType='phone-pad'
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderLinkInverse}
              outlineColor={
                errorsMsg.orangeTransfer.confirmMobileNumberError
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
              }
              placeholder={TranslateMessage(
                'Admin.Delivery.App.Re-Mobile.Number',
              )}
              value={bankData.orangeTransfer.confirmMobileNumber ?? ''}
              onChangeText={handleInput(
                'orangeTransfer',
                'confirmMobileNumber',
                'orangeTransfer',
              )}
              placeholderTextColor={theme.colors.textNeutral}
              contentStyle={formStyle.textInputLabel}
              outlineStyle={formStyle.inputFieldOuline}
            />
            {renderErrorMsgSection(
              errorsMsg.orangeTransfer.confirmMobileNumberError,
            )}
          </View>
        </View>
        <View style={[formStyle.formRow, layout.mb0, { gap: 10 }]}>
          <Pressable onPress={primaryAccountHandler('orangeTransfer')}>
            <Icon
              name={
                bankData.orangeTransfer.primaryAccount
                  ? 'checkboxChecked'
                  : 'checkboxBlank'
              }
              size={24}
              color={theme.colors.iconBase}
            />
          </Pressable>
          <Text allowFontScaling={false} style={formStyle.checkBoxlabel}>
            {TranslateMessage('Admin.Delivery.App.Set.Primary.Account')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
        </View>
        {renderNote()}
        {renderErrorMsgSection(errorsMsg.orangeTransfer.primaryAccountError)}
      </>
    );
  }
  function renderWaveSection() {
    return (
      <>
        <View style={[formStyle.formRow]}>
          <View style={formStyle.formCol}>
            <Text allowFontScaling={false} style={formStyle.labelTitle}>
              {TranslateMessage('Admin.Delivery.App.Bank.Name')}
              <Text
                allowFontScaling={false}
                style={{ color: theme.colors.textErrorDark }}
              >
                *
              </Text>
            </Text>
            <TextInput
              style={[formStyle.inputField]}
              mode='outlined'
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderLinkInverse}
              outlineColor={
                errorsMsg.wave.accountHolderNameError
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
              }
              placeholder={TranslateMessage('Admin.Delivery.App.Bank.Name')}
              value={bankData.wave.accountHolderName ?? ''}
              onChangeText={handleInput('wave', 'accountHolderName', 'wave')}
              placeholderTextColor={theme.colors.textNeutral}
              contentStyle={formStyle.textInputLabel}
              maxLength={ALLOW_EMAIL_INPUT_SIZE}
              ref={accountInputRef}
              outlineStyle={formStyle.inputFieldOuline}
            />
            {renderErrorMsgSection(errorsMsg.wave.accountHolderNameError)}
          </View>
        </View>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Mobile.Number')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
          <View style={[formStyle.formRow]}>
            <View style={onBoardingStyle.countryView}>
              {renderWaveCountryPicker()}
              <Icon name='dropDown' size={8} color={theme.colors.iconBase} />
            </View>
            <View style={{ marginBottom: 0, flex: 1 }}>
              {renderPhoneNumberInput()}
            </View>
          </View>
        </View>
        <View
          style={[
            onBoardingStyle.errorBankView,
            onBoardingStyle.phoneNumberError,
          ]}
        >
          {renderErrorMsgSection(errorsMsg.wave.mobileNumberError)}
        </View>
        <View style={[formStyle.formRow]}>
          <View style={formStyle.formCol}>
            <Text allowFontScaling={false} style={formStyle.labelTitle}>
              {TranslateMessage('Admin.Delivery.App.Re-Mobile.Number')}
              <Text
                allowFontScaling={false}
                style={{ color: theme.colors.textErrorDark }}
              >
                *
              </Text>
            </Text>
            <TextInput
              style={[formStyle.inputField]}
              mode='outlined'
              keyboardType='phone-pad'
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderLinkInverse}
              outlineColor={
                errorsMsg.wave.confirmMobileNumberError
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
              }
              placeholder={TranslateMessage(
                'Admin.Delivery.App.Re-Mobile.Number',
              )}
              value={bankData.wave.confirmMobileNumber ?? ''}
              onChangeText={handleInput('wave', 'confirmMobileNumber', 'wave')}
              placeholderTextColor={theme.colors.textNeutral}
              contentStyle={formStyle.textInputLabel}
              outlineStyle={formStyle.inputFieldOuline}
            />
            {renderErrorMsgSection(errorsMsg.wave.confirmMobileNumberError)}
          </View>
        </View>
        <View
          style={[formStyle.formRow, layout.mb0, { gap: theme.spacing.xs }]}
        >
          <Pressable onPress={primaryAccountHandler('wave')}>
            <Icon
              name={
                bankData.wave.primaryAccount
                  ? 'checkboxChecked'
                  : 'checkboxBlank'
              }
              size={24}
              color={theme.colors.iconBase}
            />
          </Pressable>
          <Text allowFontScaling={false} style={formStyle.checkBoxlabel}>
            {TranslateMessage('Admin.Delivery.App.Set.Primary.Account')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
        </View>
        {renderNote()}
        <View style={{ paddingTop: theme.spacing.xs }}>
          {renderErrorMsgSection(errorsMsg.wave.primaryAccountError)}
        </View>
      </>
    );
  }

  return (
    <View>
      {
        <View
          style={[layout.flexCol]}
          // behavior={isIOSPlatform() ? 'padding' : 'height'}
          // keyboardVerticalOffset={0}
        >
          <View
            style={[
              layout.container,
              layout.flexCol,
              onBoardingStyle.bankMainView,
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={layout.flexCol}
            >
              <View
                style={[
                  layout.cardBody,
                  layout.flexCol,
                  { paddingHorizontal: 0 },
                ]}
              >
                <View style={layout.cardHeader}>{renderTitle()}</View>
                <View>
                  {renderPaymentMethod()}
                  {bankData.selectedPayment === PaymentOptions.BANKTRANSFER &&
                    renderBankTransferSection()}
                  {bankData.selectedPayment === PaymentOptions.ORANGETRANSFER &&
                    renderOrangeTransferSection()}
                  {bankData.selectedPayment === PaymentOptions.WAVE &&
                    renderWaveSection()}
                </View>
                {renderErrorMsgSection(errorsMsg.apiError)}
              </View>
            </ScrollView>
            {/* {
                !userDetails?.onboardingSubmitted ?
                  renderBackToLoginButton()
                  : null
              } */}
            <View style={layout.mb10}>
              <Pressable onPress={submitData}>
                {otpLoading || isUpdating ? (
                  <View style={[button.btnPrimary, button.btn, { height: 52 }]}>
                    <Loader
                      loading={otpLoading || isUpdating}
                      color={theme.colors.iconInverse}
                    />
                  </View>
                ) : (
                  <Text
                    allowFontScaling={false}
                    style={[
                      button.btnPrimary,
                      button.btn,
                      onBoardingStyle.mb20,
                    ]}
                  >
                    {TranslateMessage('Admin.Delivery.App.Submit')}
                  </Text>
                )}
              </Pressable>
            </View>
            <View>
              <CustomSnackbar
                visible={!!snackbarMessage}
                message={snackbarMessage}
                onDismiss={onDismissSnackBar}
                duration={3000}
              />
            </View>
            <CustomModal
              visible={isModalVisible}
              dismissOutside={false}
              title={TranslateMessage(
                'Admin.Delivery.App.LalaMoveConformation',
              )}
              bodyContent={[]}
              onCancel={handleNo}
              onSave={handleYes}
              confirmBtnTitle={TranslateMessage('Admin.Delivery.App.Yes')}
              cancelBtnTitle={TranslateMessage('Admin.Delivery.App.Cancel')}
              error={''}
            >
              <Text allowFontScaling={false} style={onBoardingStyle.reviewData}>
                {TranslateMessage('Admin.Delivery.App.Review.Data')}
              </Text>
              {/* <View style={[layout.container]}>
                  <View style={[onBoardingStyle.btnGroup]}>
                    <Pressable
                      onPress={handleYes}
                      style={layout.flexCol}
                    >
                      {loading ? (
                        <View style={[button.btn, button.btnOutlinePrimary, layout.flexCol]}>
                          <Loader loading={loading} color={theme.colors.iconBase} />
                        </View>
                      ) : (
                        <Text allowFontScaling={false} style={[button.btn, button.btnOutlinePrimary, layout.flexCol]}>{TranslateMessage('Admin.Delivery.App.Yes')}</Text>

                      )}
                    </Pressable>
                    <Pressable
                      onPress={()=>handleNo()}
                      style={layout.flexCol}
                    >
                      <Text allowFontScaling={false} style={[button.btnPrimary, button.btn, layout.flexCol]}>{TranslateMessage('Admin.Delivery.App.No')}</Text>
                    </Pressable>
                  </View>
                </View> */}
            </CustomModal>
            {/* <CustomModalSelector
                toggleModal={toggleModalValue}
                isModalVisible={isModalVisible}
                label={''}
              >
                <Text allowFontScaling={false} style={onBoardingStyle.reviewData}>
                  {TranslateMessage('Admin.Delivery.App.Review.Data')}
                </Text>
                <View style={[layout.container]}>
                  <View style={[onBoardingStyle.btnGroup]}>
                    <Pressable
                      onPress={handleYes}
                      style={layout.flexCol}
                    >
                      {loading ? (
                        <View style={[button.btn, button.btnOutlinePrimary, layout.flexCol]}>
                          <Loader loading={loading} color={theme.colors.iconBase} />
                        </View>
                      ) : (
                        <Text allowFontScaling={false} style={[button.btn, button.btnOutlinePrimary, layout.flexCol]}>{TranslateMessage('Admin.Delivery.App.Yes')}</Text>

                      )}
                    </Pressable>
                    <Pressable
                      onPress={()=>handleNo()}
                      style={layout.flexCol}
                    >
                      <Text allowFontScaling={false} style={[button.btnPrimary, button.btn, layout.flexCol]}>{TranslateMessage('Admin.Delivery.App.No')}</Text>
                    </Pressable>
                  </View>
                </View>
              </CustomModalSelector> */}
            <CustomModal
              visible={isOTPModalVisible}
              dismissOutside={false}
              title={TranslateMessage('Admin.Delivery.App.VerifyOtp')}
              bodyContent={[]}
              onCancel={onCancelHandler}
              onSave={handleSave}
              confirmBtnTitle={TranslateMessage('Admin.Delivery.App.Verify')}
              cancelBtnTitle={TranslateMessage(
                'Admin.Delivery.App.CancelBtnTitle',
              )}
              error={''}
            >
              <>
                {' '}
                <View style={layout.container}>
                  <View style={[formStyle.formRow]}>
                    <View style={formStyle.formCol}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          formStyle.labelTitle,
                          {
                            fontFamily: theme.fontFamily.bold,
                            fontSize: theme.fontSize.textBodyMedium,
                          },
                        ]}
                      >
                        {TranslateMessage('Admin.Delivery.App.Otp')}
                      </Text>
                      <TextInput
                        style={[formStyle.inputField]}
                        mode='outlined'
                        keyboardType='numeric'
                        autoCapitalize='none'
                        activeOutlineColor={theme.colors.borderErrorInverse}
                        outlineColor={
                          modalError
                            ? theme.colors.borderErrorInverse
                            : theme.colors.borderMedium
                        }
                        placeholder={TranslateMessage(
                          'Admin.Delivery.App.EnterOtp',
                        )}
                        value={verifyOtp ?? ''}
                        onChangeText={handleOtp}
                        placeholderTextColor={theme.colors.textNeutral}
                        contentStyle={formStyle.textInputLabel}
                        maxLength={ALLOW_MIN_INPUT_SIZE}
                        autoFocus={true}
                        outlineStyle={formStyle.inputFieldOuline}
                        editable={true}
                      />
                      {modalError ? renderErrorMsgSection(modalError) : null}
                    </View>
                  </View>
                </View>
                <View style={[layout.container]}>
                  <View style={[onBoardingStyle.btnGroup]}>
                    {/* <Pressable
                      onPress={handleSave}
                      style={layout.flexCol}
                    >
                      <Text allowFontScaling={false} style={[button.btnPrimary, button.btn]}>{TranslateMessage('Admin.Delivery.App.Verify')}</Text>
                    </Pressable> */}
                    {/* <Pressable
                      onPress={onCancelHandler}
                      style={layout.flexCol}
                    >
                      <Text allowFontScaling={false} style={[button.btn, button.btnOutlinePrimary]}>{TranslateMessage('Admin.Delivery.App.Cancel')}</Text>
                    </Pressable> */}
                  </View>
                </View>
              </>
            </CustomModal>
            {/* <CustomModalSelector
                toggleModal={closeOTPModal}
                isModalVisible={isOTPModalVisible}
                label={TranslateMessage('Admin.Delivery.App.Bank.Account.Holder.Otp.Title')}
                bankStyle={true}
              >
                <View style={layout.container}>
                  <View style={[formStyle.formRow]}>
                    <View style={formStyle.formCol}>
                      <Text allowFontScaling={false} style={[formStyle.labelTitle,{fontFamily: theme.fontFamily.bold, fontSize: theme.fontSize.textBodyMedium}]}>
                        {TranslateMessage('Admin.Delivery.App.EnterPin')}
                      </Text>
                      <TextInput
                        style={[formStyle.inputField]}
                        mode='outlined'
                        keyboardType='numeric'
                        autoCapitalize='none'
                        activeOutlineColor={theme.colors.borderErrorInverse}
                        outlineColor={
                          modalError ? theme.colors.borderErrorInverse : theme.colors.borderMedium
                        }
                        placeholder={TranslateMessage(
                          'Admin.Delivery.App.EnterPin'
                        )}
                        value={verifyOtp ?? ''}
                        onChangeText={handleOtp}
                        placeholderTextColor={theme.colors.textNeutral}
                        contentStyle={formStyle.textInputLabel}
                        maxLength={ALLOW_MIN_INPUT_SIZE}
                        autoFocus={true}
                        outlineStyle={formStyle.inputFieldOuline}
                        editable={true}
                      />
                      {modalError ? (
                        renderErrorMsgSection(modalError)
                      ) : null}
                    </View>
                  </View>
                </View>
                <View style={[layout.container]}>
                  <View style={[onBoardingStyle.btnGroup]}>
                    <Pressable
                      onPress={handleSave}
                      style={layout.flexCol}
                    >
                      <Text allowFontScaling={false} style={[button.btnPrimary, button.btn]}>{TranslateMessage('Admin.Delivery.App.Verify')}</Text>
                    </Pressable>
                    <Pressable
                      onPress={onCancelHandler}
                      style={layout.flexCol}
                    >
                      <Text allowFontScaling={false} style={[button.btn, button.btnOutlinePrimary]}>{TranslateMessage('Admin.Delivery.App.Cancel')}</Text>
                    </Pressable>
                  </View>
                </View>

              </CustomModalSelector> */}
          </View>
        </View>
      }
    </View>
  );
};

export default BankDetails;
