import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  InteractionManager,
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
import { useUploadImageStyle } from 'src/common/assets/styles/uploadimage';
import { IBlobType } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import CustomDocumentWrapper from 'src/common/components/CustomDocumentWrapper/CustomDocumentWrapper';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import FileViewer from 'src/common/components/FilesViewer/FilesViewer';
import { getFileName } from 'src/common/components/FilesViewer/FilesViewerUtil';
import { Loader } from 'src/common/components/Loader/Loader';
import {
  fetchLegalDataAction,
  removeImgData,
  updateLegalInformationAction,
  updateLegalInformationUpdatedAction,
  uploadInsuranceImg,
  uploadLicenseImg,
  uploadRegistrationImg,
} from 'src/common/service/onboarding/action';
import {
  convertToMilliseconds,
  getTomorrowDate,
} from 'src/common/utils/dateUtil';
import {
  generateLegalIntialErrorMsg,
  getInitialLegalData,
  IImageRes,
  ILegalInfo,
  ILegalInfoErrors,
  isLicenseObjectEmpty,
  validateLicenceData,
} from 'src/components/DriverOnboarding/LegalDocuments/LegalDocumentUtil';
import {
  IVehicleOption,
  vehicleOptions,
  vehicleOptionsCategory,
} from 'src/components/DriverOnboarding/PersonalInformation/PersonalInfoUtil';
import { AppThunk, AppThunkDispatch, RootState } from 'src/store';

import { useFocusEffect } from 'expo-router';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';
import type { TextInput as RNTextInput } from 'react-native';
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import CustomSnackbar from 'src/common/components/CustomSnackbar/CustomSnackbar';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { IAPIError } from 'src/common/service/ApiUtil';
import { logout } from 'src/common/service/auth/action';
import {
  resetLegalData,
  resetLegalUpdateSuccess,
} from 'src/common/service/onboarding/slice';
import { getDeviceToken } from 'src/common/utils/getDeviceToken';
import { getUserRefreshToken } from 'src/common/utils/setRefreshTokenUtil';
import { Icon } from 'src/submodules/iconlibrary/src';
import { ALLOW_EMAIL_INPUT_SIZE } from '../constant';
import { useOnBoardingStyle } from '../onBoardingstyle';
import { IApiErrorResponse, IFilesData } from '../util/OnBoardingUtil';
import { useTenantId } from 'src/common/hooks/useTenantId';
import { getTenantHeaders } from 'src/common/service/restService/restService';

enum NavigationScreen {
  PROFILE = 'profile',
  LEGAL = 'legal',
  NAVIGATIONFROM = 'navigationFrom',
}
type Props = {
  handleNextStep: () => void;
};
const LegalDocuments: React.FC<Props> = ({ handleNextStep }) => {
  const layout = useLayoutStyle();
  const button = useButtonStyle();
  const formStyle = useFormStyle();
  const uploadimage = useUploadImageStyle();
  const { theme } = useAppTheme();
  const dispatch: AppThunkDispatch = useDispatch();
  const { tenantId } = useTenantId();
  // Redux state selectors
  const {
    data: legalDataFromRedux,
    loading,
    error,
    isUpdating,
    updateSuccess,
  } = useSelector((state: RootState) => state.onboarding.legalData);

  const [licenseData, setLicenceData] = useState<ILegalInfo>(
    getInitialLegalData(),
  );
  const [initialLicenseData, setInitialLicenceData] = useState<ILegalInfo>(
    getInitialLegalData(),
  );
  const [riderLicenseId, setRiderLicenseId] = useState<string>('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [vehicleInsuranceId, setVehicleInsuranceId] = useState<string>('');
  const [licenseProof, setLicenseProof] = useState<IFilesData[]>([]);
  const [registrationPapers, setRegistrationPapers] = useState<IFilesData[]>(
    [],
  );
  const onboardingStyle = useOnBoardingStyle();
  const [insuranceDocument, setInsuranceDocument] = useState<IFilesData[]>([]);
  const [fromProfile, setFromProfile] = useState<boolean>(false);
  const [fromLegal, setFromLegal] = useState<boolean>(false);
  const [errorsMsg, setErrorsMsg] = useState<ILegalInfoErrors>(
    generateLegalIntialErrorMsg(),
  );
  const licenseProofRef = useRef<IFilesData[]>([]);
  const registrationRef = useRef<IFilesData[]>([]);
  const insuranceRef = useRef<IFilesData[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [enrolledOffers, setEnrolledOffers] = useState<boolean>(true);
  const { t: TranslateMessage } = useTranslation();
  const [registrationPapersUploading, setRegistrationPapersUploading] =
    useState<boolean>(false);
  const [licensePapersUploading, setLicensePapersUploading] =
    useState<boolean>(false);
  const [insurancePapersUploading, setInsurancePapersUploading] =
    useState<boolean>(false);
  const blockedStatus = false;
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch legal data on component mount
  useFocusEffect(
    useCallback(() => {
      if (id) dispatch(fetchLegalDataAction(id));
      return () => {
        dispatch(resetLegalData());
      };
    }, [dispatch, id]),
  );

  // Process legal data when it's loaded
  useEffect(() => {
    if (legalDataFromRedux && legalDataFromRedux.userId) {
      processLegalData(legalDataFromRedux);
    }
  }, [legalDataFromRedux]);

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
        TranslateMessage('Admin.Delivery.App.Document.Success'),
      );
      dispatch(resetLegalUpdateSuccess());
    }
  }, [updateSuccess, loading, error, TranslateMessage, dispatch]);

  const processLegalData = useCallback((fetchedLegalData: any) => {
    try {
      if (fetchedLegalData?.userId) {
        if (fetchedLegalData?.licenseExpiryDate) {
          setRiderLicenseId(String(fetchedLegalData?.riderLicenseId));
          setVehicleId(String(fetchedLegalData?.vehicleId));
          setVehicleInsuranceId(String(fetchedLegalData?.vehicleInsuranceId));
          setEnrolledOffers(fetchedLegalData.backgroundConsent);
          let newDate = '';
          if (fetchedLegalData?.licenseExpiryDate) {
            newDate = fetchedLegalData.licenseExpiryDate;
          }
          const licenceApiData = {
            licenseNumber: fetchedLegalData.licenseNumber,
            vehicleType: fetchedLegalData.vehicleType,
            licenseExpiryDate: newDate,
            registrationNumber: fetchedLegalData.registrationNumber,
            insuranceNumber: fetchedLegalData.insuranceNumber,
            vehicleCategory: fetchedLegalData.vehicleCategory,
            vehicleName: fetchedLegalData.vehicleName,
          };
          if (
            fetchedLegalData?.vehicleType &&
            fetchedLegalData?.vehicleCategory
          ) {
            setSelectedValue({
              ...selectedValue,
              label: fetchedLegalData?.vehicleType,
            });
            setSelectedCategory({
              ...selectedValue,
              label: fetchedLegalData?.vehicleCategory,
              value: fetchedLegalData?.vehicleCategory
            });
          }
          setLicenceData(licenceApiData);
          setInitialLicenceData(licenceApiData);
        }

        if (
          Array.isArray(fetchedLegalData?.licenseImages) &&
          fetchedLegalData.licenseImages.length > 0
        ) {
          setLicensePapersUploading(true);
          const licenseProofItems: IFilesData[] =
            fetchedLegalData.licenseImages.map((item: IImageRes) => ({
              id: item.id,
              fileId: item.fileId,
              fileName: item.fileName,
              uri: item.fileUrl,
              fileType: item.fileType,
              userId: item.userId,
            }));

          setLicenseProof(licenseProofItems);
          setLicensePapersUploading(false);
        }
        if (
          Array.isArray(fetchedLegalData?.registrationImages) &&
          fetchedLegalData.registrationImages.length > 0
        ) {
          setRegistrationPapersUploading(true);
          const registrationProofItems: IFilesData[] =
            fetchedLegalData.registrationImages.map((item: IImageRes) => ({
              id: item.id,
              fileId: item.fileId,
              fileName: item.fileName,
              uri: item.fileUrl,
              fileType: item.fileType,
              userId: item.userId,
            }));
          setRegistrationPapers(registrationProofItems);
          setRegistrationPapersUploading(false);
        }
        if (
          Array.isArray(fetchedLegalData?.insuranceImages) &&
          fetchedLegalData.insuranceImages.length > 0
        ) {
          setInsurancePapersUploading(true);
          const insuranceProofItems: IFilesData[] =
            fetchedLegalData.insuranceImages.map((item: IImageRes) => ({
              id: item.id,
              fileId: item.fileId,
              fileName: item.fileName,
              uri: item.fileUrl,
              fileType: item.fileType,
              userId: item.userId,
            }));
          setInsuranceDocument(insuranceProofItems);
          setInsurancePapersUploading(false);
        }
      }
    } catch (err) {
      console.error('Error processing legal data:', err);
    }
  }, []);

  const searchParams = useSearchParams();
  useEffect(() => {
    const profileRedirect = searchParams.get(NavigationScreen?.NAVIGATIONFROM);
    if (profileRedirect === NavigationScreen.PROFILE) {
      setFromProfile(true);
    } else if (profileRedirect === NavigationScreen.LEGAL) {
      setFromLegal(true);
    }
  }, [NavigationScreen?.NAVIGATIONFROM]);

  const resetErrorMsg = (fieldName: string) => {
    setErrorsMsg((prevState) => ({
      ...prevState,
      [fieldName]: '',
    }));
  };
  const [selectedValue, setSelectedValue] = useState<IVehicleOption>({
    label: '',
    value: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<IVehicleOption>({
    label: '',
    value: '',
  });
  const onChangeDropdown = (item: IVehicleOption) => {
    resetErrorMsg('vehicleTypeError');
    setLicenceData((prevState) => ({
      ...prevState,
      vehicleType: item.label,
    }));
    setSelectedValue({ ...selectedValue, label: item.label });
  };

  const onChangeCategoryDropdown = (item: IVehicleOption) => {
    resetErrorMsg('vehicleCategoryTypeError');
    setLicenceData((prevState) => ({
      ...prevState,
      vehicleCategory: item.value,
    }));
    setSelectedCategory({ ...selectedCategory, label: item.label });
  };

  const onChangeExpiryDate = (expiryDate: string) => {
    resetErrorMsg('licenseExpiryError');
    setLicenceData((prevState) => ({
      ...prevState,
      licenseExpiryDate: expiryDate,
    }));
  };

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }
  const setApiError = (error: IAPIError) => {
    const apiError =
      error?.errors?.[0]?.split(' | ')?.[0] ??
      error?.errors?.[0] ??
      TranslateMessage('Admin.Delivery.App.SomethingWentWrong');
    let err: string;
    setErrorsMsg((prevState) => ({
      ...prevState,
      apiError,
    }));
  };
  const onDismissSnackBar = () => {
    if (
      snackbarMessage ===
      TranslateMessage('Admin.Delivery.App.Document.Success')
    ) {
      handleNextStep();
    }
    setSnackbarMessage('');
  };
  const getSnackbarDuration = (message: string) => {
    if (message === TranslateMessage('Admin.Delivery.App.Document.Success')) {
      return 3000;
    }
    return undefined;
  };

  const submitDocument = () => {
    resetErrorMsg('apiError');
    const validatedInfo = validateLicenceData(licenseData, enrolledOffers);

    const isEmpty = isLicenseObjectEmpty(validatedInfo);
    if (!isEmpty) {
      setErrorsMsg(validatedInfo);
      return;
    }

    const {
      licenseNumber,
      vehicleType,
      licenseExpiryDate,
      registrationNumber,
      insuranceNumber,
      vehicleCategory,
      vehicleName,
    } = licenseData;

    if (
      typeof riderLicenseId === 'string' &&
      riderLicenseId.trim() !== '' &&
      riderLicenseId.trim() !== 'null' &&
      typeof vehicleId === 'string' &&
      vehicleId.trim() !== '' &&
      vehicleId.trim() !== 'null' &&
      typeof vehicleInsuranceId === 'string' &&
      vehicleInsuranceId.trim() !== '' &&
      vehicleInsuranceId.trim() !== 'null'
    ) {
      if (
        JSON.stringify(initialLicenseData) !== JSON.stringify(licenseData) &&
        licenseExpiryDate !== null
      ) {
        const payload = {
          riderLicenseId,
          licenseNumber,
          licenseExpiryDate: String(convertToMilliseconds(licenseExpiryDate)),
          riderRegistrationId: vehicleId,
          registrationNumber,
          vehicleType,
          vehicleInsuranceId,
          insuranceNumber,
          userId: id,
          backgroundConsent: enrolledOffers,
          vehicleId: Number(vehicleId),
          vehicleCategory,
          vehicleName,
        };

        dispatch(updateLegalInformationUpdatedAction(payload));
      } else {
        setSnackbarMessage(
          TranslateMessage('Admin.Delivery.App.Document.Success'),
        );
      }
    } else {
      if (
        typeof riderLicenseId === 'string' &&
        riderLicenseId.trim() !== '' &&
        riderLicenseId.trim() !== 'null' &&
        licenseExpiryDate !== null
      ) {
        let payload: ILegalInfo = {
          userId: id ?? '',
          riderLicenseId,
          licenseNumber,
          vehicleType,
          licenseExpiryDate: String(convertToMilliseconds(licenseExpiryDate)),
          registrationNumber,
          insuranceNumber,
          backgroundConsent: enrolledOffers,
          vehicleCategory,
          vehicleName,
        };

        if (typeof vehicleId === 'number' && !isNaN(vehicleId)) {
          payload = { ...payload, vehicleId };
        }
        dispatch(updateLegalInformationAction(payload));
      } else if (licenseExpiryDate !== null) {
        const payload = {
          userId: id,
          licenseNumber,
          vehicleType,
          licenseExpiryDate: String(convertToMilliseconds(licenseExpiryDate)),
          registrationNumber,
          insuranceNumber,
          backgroundConsent: enrolledOffers,
          vehicleCategory,
          vehicleName,
        };

        dispatch(updateLegalInformationAction(payload));
      }
    }
  };

  const handleCheckboxChange = () => {
    resetErrorMsg('enrolledOffersError');
    setEnrolledOffers((prevState) => !prevState);
  };

  const handleInput = (key: keyof ILegalInfo) => (text: string) => {
    resetErrorMsg('apiError');
    resetErrorMsg('vehicleRegistrationError');
    setErrorsMsg((prevState) => ({
      ...prevState,
      [`${key}Error`]: '',
    }));

    setLicenceData((prevState) => ({
      ...prevState,
      [key]: text.toUpperCase(),
    }));
  };

  const isNewData = (
    data: Array<{ id?: number | string }>,
    removedImages: Array<number | string>,
  ) => {
    return data.some((item) => !item.id) || removedImages.length > 0;
  };

  const getMimeType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'doc':
        return 'application/msword';
      default:
        return 'application/octet-stream'; // Default MIME type
    }
  };
  const uploadSelectImage = async (
    formData: FormData,
    key: string,
    uploadFunction: (data: FormData) => AppThunk<Promise<IImageRes>>,
    setState: React.Dispatch<React.SetStateAction<IFilesData[]>>,
  ) => {

try {
  const headers = getTenantHeaders(tenantId);
  const response: IImageRes = await dispatch(uploadFunction(formData));
  const responseImg = await fetch(response.fileUrl, { headers });
  if (!responseImg.ok) {
    throw new Error(`Image fetch failed: ${responseImg.status}`);
  }
  const blob = await responseImg.blob();
  const filename = getFileName(response.fileUrl);
  const { fileId, userId, id } = response;
  const item = {
    uri: response.fileUrl,
    fileName: filename,
    blob,
    fileId,
    userId,
    id,
  };
      setState((prevState) => [...prevState, item]);
      setRegistrationPapersUploading(false);
      setLicensePapersUploading(false);
      setInsurancePapersUploading(false);
    } catch (error) {
      setRegistrationPapersUploading(false);
      setLicensePapersUploading(false);
      setInsurancePapersUploading(false);
      setApiError(error as IApiErrorResponse);
    } finally {
      setRegistrationPapersUploading(false);
      setLicensePapersUploading(false);
      setInsurancePapersUploading(false);
    }
  };

  const onSelectImage = async (
    key: 'licenseProof' | 'registrationPapers' | 'insuranceDocument',
    blobs: IBlobType,
    results: IFilesData[],
  ) => {
    resetErrorMsg('imageUplodFieldError');
    resetErrorMsg('apiError');
    setErrorsMsg((prevState) => ({
      ...prevState,
      [`${key}Error`]: '',
    }));
    const formData = new FormData();

    results.forEach((image) => {
      if (!image?.id && image.blob) {
        formData.append('file', image.blob);

        formData.append(
          'userId',
          new Blob([id], {
            type: 'application/json',
          }),
        );
      }
    });

    switch (key) {
      case 'licenseProof':
        setLicensePapersUploading(true);
        // await dispatch(lockScreen(true));
        await uploadSelectImage(
          formData,
          key,
          uploadLicenseImg,
          setLicenseProof,
        );
        resetErrorMsg('licenseProofError');
        setSnackbarMessage(
          TranslateMessage('Admin.Delivery.App.License.Success'),
        );
        break;

      case 'registrationPapers':
        setRegistrationPapersUploading(true);
        // await dispatch(lockScreen(true));
        await uploadSelectImage(
          formData,
          key,
          uploadRegistrationImg,
          setRegistrationPapers,
        );
        resetErrorMsg('registrationPaperError');
        setSnackbarMessage(
          TranslateMessage('Admin.Delivery.App.Registration.Success'),
        );
        break;
      case 'insuranceDocument':
        setInsurancePapersUploading(true);
        // await dispatch(lockScreen(true));
        await uploadSelectImage(
          formData,
          key,
          uploadInsuranceImg,
          setInsuranceDocument,
        );
        resetErrorMsg('insuranceDocumentError');
        setSnackbarMessage(
          TranslateMessage('Admin.Delivery.App.Insurance.Success'),
        );
        break;
      default:
        console.warn(`Unhandled key: ${key}`);
    }
  };
  useEffect(() => {
    licenseProofRef.current = licenseProof;
    registrationRef.current = registrationPapers;
    insuranceRef.current = insuranceDocument;
  }, [licenseProof, registrationPapers, insuranceDocument]);
  const removeImages = async (fileToRemove: IFilesData) => {
    if (fileToRemove?.id && fileToRemove?.userId && fileToRemove?.fileId) {
      await dispatch(
        removeImgData({
          id: fileToRemove.id,
          fileId: fileToRemove.fileId,
          userId: fileToRemove.userId,
        }),
      );
    }
  };
  const removeImage = (
    key: 'licenseProof' | 'registrationPapers' | 'insuranceDocument',
    index: number,
  ) => {
    let fileToRemove;
    switch (key) {
      case 'licenseProof':
        fileToRemove = licenseProof[index];
        setLicenseProof((prevState) =>
          prevState.filter((_, idx) => idx !== index),
        );
        break;
      case 'registrationPapers':
        fileToRemove = registrationPapers[index];
        setRegistrationPapers((prevState) =>
          prevState.filter((_, idx) => idx !== index),
        );
        break;
      case 'insuranceDocument':
        fileToRemove = insuranceDocument[index];
        setInsuranceDocument((prevState) =>
          prevState.filter((_, idx) => idx !== index),
        );
        break;
      default:
        console.warn(`Unhandled key: ${key}`);
    }
    if (fileToRemove?.id && fileToRemove?.userId && fileToRemove?.fileId) {
      removeImages(fileToRemove);
    } else {
      console.warn('File to remove has no valid ID');
    }
  };

  function renderLicenseProof() {
    return (
      <View style={uploadimage.uploadImageContainer}>
        <View style={[layout.flexCol,layout.marBottom20]}>
        <Text allowFontScaling={false} style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.License.Proof.Title')}
        </Text>
        {licenseProof.length <= 1 ? (
          <View
            style={
              licensePapersUploading
                ? { pointerEvents: 'none', opacity: 0.5 }
                : null
            }
          >
            <CustomDocumentWrapper
              onSelect={(blobs, results) =>
                onSelectImage('licenseProof', blobs, results)
              }
              type={[
                'image/png',
                'image/jpeg',
                'image/jpg',
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              ]}
              files={licenseProof}
              multiple={false}
              maxImages={2}
              handleRemoveFile={(index: number) =>
                removeImage('licenseProof', index)
              }
            />
          </View>
        ) : (
          <View style={onboardingStyle.itemImageContainer}>
            <FileViewer
              filesData={licenseProof}
              removeFile={(idx) => removeImage('licenseProof', idx)}
            />
          </View>
        )}
        {licenseProof.length <= 1 && (
          <Text allowFontScaling={false} style={onboardingStyle.labelText}>
            {TranslateMessage('Admin.Delivery.App.Legal.Upload')}
          </Text>
        )}
        </View>
      </View>
    );
  }
  function renderRegistrationPaper() {
    return (
      <View style={uploadimage.uploadImageContainer}>
        <View style={[layout.flexCol,layout.marBottom20]}>
        <Text allowFontScaling={false} style={formStyle.labelTitle}>
          {TranslateMessage('Admin.Delivery.App.Registration.Papers.Title')}
        </Text>
        {registrationPapers.length <= 1 ? (
          <View
            style={
              registrationPapersUploading
                ? { pointerEvents: 'none', opacity: 0.5 }
                : null
            }
          >
            <CustomDocumentWrapper
              files={registrationPapers}
              onSelect={(blobs, results) =>
                onSelectImage('registrationPapers', blobs, results)
              }
              type={[
                'image/png',
                'image/jpeg',
                'image/jpg',
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              ]}
              multiple={false}
              maxImages={2}
              handleRemoveFile={(index: number) =>
                removeImage('registrationPapers', index)
              }
            />
          </View>
        ) : (
          <View style={[onboardingStyle.itemImageContainer]}>
            <FileViewer
              filesData={registrationPapers}
              removeFile={(idx) => removeImage('registrationPapers', idx)}
            />
          </View>
        )}
        {registrationPapers.length <= 1 && (
          <Text allowFontScaling={false} style={onboardingStyle.labelText}>
            {TranslateMessage('Admin.Delivery.App.Legal.Upload')}
          </Text>
        )}
        </View>
      </View>
    );
  }

  function renderInsuranceDocument() {
    return (
      <View style={uploadimage.uploadImageContainer}>
          <View style={[layout.flexCol,layout.marBottom20]}>
        <Text allowFontScaling={false} style={formStyle.labelTitle}>
          {TranslateMessage('Admin.Delivery.App.Insurance.Document.Title')}
        </Text>
        {insuranceDocument.length <= 1 ? (
          <View
            style={
              insurancePapersUploading
                ? { pointerEvents: 'none', opacity: 0.5 }
                : null
            }
          >
            <CustomDocumentWrapper
              files={insuranceDocument}
              onSelect={(blobs, results) =>
                onSelectImage('insuranceDocument', blobs, results)
              }
              type={[
                'image/png',
                'image/jpeg',
                'image/jpg',
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              ]}
              multiple={false}
              maxImages={2}
              handleRemoveFile={(index: number) =>
                removeImage('insuranceDocument', index)
              }
            />
          </View>
        ) : (
          <View style={[onboardingStyle.itemImageContainer]}>
            <FileViewer
              filesData={insuranceDocument}
              removeFile={(idx) => removeImage('insuranceDocument', idx)}
            />
          </View>
        )}
        {insuranceDocument.length <= 1 && (
          <Text allowFontScaling={false} style={onboardingStyle.labelText}>
            {TranslateMessage('Admin.Delivery.App.Legal.Upload')}
          </Text>
        )}
        </View>
      </View>
    );
  }
  const licNumberInputRef = useRef<RNTextInput | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading && !blockedStatus) {
      InteractionManager.runAfterInteractions(() => {
        timeoutRef.current = setTimeout(() => {
          licNumberInputRef.current?.focus();
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
  function renderLicenseNumber() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Vehicle.License.Number')}
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
            autoCapitalize="characters"
            keyboardType="default"
            activeOutlineColor={theme.colors.borderLinkInverse}
            outlineColor={
              errorsMsg.licenseNumberError
                ? theme.colors.borderErrorInverse
                : theme.colors.borderMedium
            }
            placeholder="ABCD1234"
            value={licenseData.licenseNumber ?? ''}
            placeholderTextColor={theme.colors.textNeutral}
            contentStyle={formStyle.textInputLabel}
            onChangeText={handleInput('licenseNumber')}
            maxLength={ALLOW_EMAIL_INPUT_SIZE}
            ref={licNumberInputRef}
            outlineStyle={formStyle.inputFieldOuline}
          />
          {renderErrorMsgSection(errorsMsg.licenseNumberError)}
        </View>
      </View>
    );
  }

  function renderVehicleInsurance() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Vehicle.Number')}
          </Text>
          <TextInput
            style={[formStyle.inputField]}
            mode="outlined"
            autoCapitalize="characters"
            keyboardType="default"
            activeOutlineColor={theme.colors.borderLinkInverse}
            outlineColor={
              errorsMsg.insuranceNumberError
                ? theme.colors.borderErrorInverse
                : theme.colors.borderMedium
            }
            placeholder="54213957841252236"
            disabled={false}
            value={licenseData.insuranceNumber ?? ''}
            placeholderTextColor={theme.colors.textNeutral}
            contentStyle={formStyle.textInputLabel}
            onChangeText={handleInput('insuranceNumber')}
            maxLength={ALLOW_EMAIL_INPUT_SIZE}
            outlineStyle={formStyle.inputFieldOuline}
          />
          {renderErrorMsgSection(errorsMsg.insuranceNumberError)}
        </View>
      </View>
    );
  }

  function renderVehicleNumber() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Vehicle.Registration.Number')}
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
            autoCapitalize="characters"
            keyboardType="default"
            activeOutlineColor={theme.colors.borderLinkInverse}
            outlineColor={
              errorsMsg.vehicleRegistrationError
                ? theme.colors.borderErrorInverse
                : theme.colors.borderMedium
            }
            placeholder="ABC JK 1234"
            value={licenseData.registrationNumber ?? ''}
            onChangeText={handleInput('registrationNumber')}
            placeholderTextColor={theme.colors.textNeutral}
            contentStyle={formStyle.textInputLabel}
            maxLength={ALLOW_EMAIL_INPUT_SIZE}
            outlineStyle={formStyle.inputFieldOuline}
          />
          {renderErrorMsgSection(errorsMsg.vehicleRegistrationError)}
        </View>
      </View>
    );
  }

  function renderLicenseExpiry() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={[formStyle.formCol]}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.License.Expiry.Date')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
          <CustomInputDatePicker
            date={licenseData.licenseExpiryDate}
            onDateSelect={onChangeExpiryDate}
            minDate={getTomorrowDate()}
            placeholder={TranslateMessage(
              'Admin.Delivery.App.License.Expiry.Date.Select',
            )}
          />
          {renderErrorMsgSection(errorsMsg.licenseExpiryError)}
        </View>
      </View>
    );
  }

  function renderVehicle() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Vehicle.Type')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
          <Customdropdown
            data={vehicleOptions()}
            // title={TranslateMessage(
            //   'Admin.Delivery.App.Vehicle.Type.Placeholder',
            // )}
            selectedValue={selectedValue}
            onChange={onChangeDropdown}
          />
          {renderErrorMsgSection(errorsMsg.vehicleTypeError)}
        </View>
      </View>
    );
  }

  function renderVehicleCategory() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Vehicle.Type.Category')}
            <Text
              allowFontScaling={false}
              style={{ color: theme.colors.textErrorDark }}
            >
              *
            </Text>
          </Text>
          <Customdropdown
            data={vehicleOptionsCategory()}
            // title={TranslateMessage(
            //   'Admin.Delivery.App.Vehicle.Type.Placeholder.Category',
            // )}
            selectedValue={selectedCategory}
            onChange={onChangeCategoryDropdown}
          />
          {renderErrorMsgSection(errorsMsg.vehicleCategoryTypeError)}
        </View>
      </View>
    );
  }

  function renderVehicleName() {
    return (
      <View style={[formStyle.formRow]}>
        <View style={formStyle.formCol}>
          <Text allowFontScaling={false} style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Vehicle.Name')}
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
            autoCapitalize="characters"
            keyboardType="default"
            activeOutlineColor={theme.colors.borderLinkInverse}
            outlineColor={
              errorsMsg.vehicleNameError
                ? theme.colors.borderErrorInverse
                : theme.colors.borderMedium
            }
            placeholder="Indigo"
            value={licenseData.vehicleName ?? ''}
            onChangeText={handleInput('vehicleName')}
            placeholderTextColor={theme.colors.textNeutral}
            contentStyle={formStyle.textInputLabel}
            maxLength={ALLOW_EMAIL_INPUT_SIZE}
          />
          {renderErrorMsgSection(errorsMsg.vehicleNameError)}
        </View>
      </View>
    );
  }

  function renderSubmitButton() {
    return (
      <View style={[layout.container, onboardingStyle.boxShadow]}>
        <View style={[formStyle.formRow, { marginTop: theme.spacing.xs }]}>
          <View style={[formStyle.checkBoxItem]}>
            <Pressable onPress={handleCheckboxChange}>
              <Icon
                name={enrolledOffers ? 'checkboxChecked' : 'checkboxBlank'}
                size={24}
                color={
                  enrolledOffers
                    ? theme.colors.themeIcon
                    : theme.colors.iconBase
                }
              />
            </Pressable>
            <Text allowFontScaling={false} style={formStyle.checkBoxlabel}>
              {TranslateMessage('Admin.Delivery.App.TermsLabel')}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: -theme.spacing.sm,
            marginBottom: theme.spacing.sm,
          }}
        >
          {renderErrorMsgSection(errorsMsg.enrolledOffersError)}
        </View>
        <Pressable
          onPress={isUpdating ? null : submitDocument}
          style={layout.mb10}
        >
          {isUpdating ? (
            <View style={[button.btn, button.btnPrimary]}>
              <Loader loading={isUpdating} color={theme.colors.textInverse} />
            </View>
          ) : (
            <Text
              allowFontScaling={false}
              style={[button.btnPrimary, button.btn]}
            >
              {!fromLegal
                ? TranslateMessage('Admin.Delivery.App.LogIn.Continue')
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

  const screenHeight = Dimensions.get('window').height;
  return (
    <>
      {loading && !legalDataFromRedux ? (
        <View style={onboardingStyle.pageLoader}>
          <Loader loading={loading} color={theme.colors.iconBase} />
        </View>
      ) : (
        <>
          <View style={[layout.flexCol]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={layout.container}>
                <Typography
                  variant="subHeading"
                  style={{ marginBottom: theme.spacing.lg }}
                >
                  {TranslateMessage('Admin.Delivery.App.LegalDocument')}
                </Typography>

                <View>
                  {renderLicenseNumber()}
                  {renderVehicle()}
                  {renderVehicleCategory()}
                  {renderVehicleName()}
                  {renderLicenseProof()}
                  {renderLicenseExpiry()}
                  {renderVehicleNumber()}
                  {renderRegistrationPaper()}
                  {renderVehicleInsurance()}
                  {renderInsuranceDocument()}
                </View>
              </View>
            </ScrollView>
            {renderErrorMsgSection(errorsMsg.apiError)}
            <CustomSnackbar
              visible={!!snackbarMessage}
              message={snackbarMessage}
              onDismiss={onDismissSnackBar}
              duration={getSnackbarDuration(snackbarMessage)}
            />
            {renderSubmitButton()}
          </View>
        </>
      )}
    </>
  );
};

export default LegalDocuments;
