import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageStyle, Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { returnBlobForSingleFileNew } from 'src/common/components/CustomDocumentPicker/DocumentPickerUtil';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import FileViewer from 'src/common/components/FilesViewer/FilesViewer';
import { RenderImage } from 'src/common/components/Image/Image';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { useTenantId } from 'src/common/hooks/useTenantId';
import { driverRequestApprovalRejectionAction, fetchDriverDetailsAction } from 'src/common/service/driver/action';
import { resetDriverDetails } from 'src/common/service/driver/slice';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { MenuType } from 'src/common/utils/permissionUtils';
import { getMediaDetails, IMinuteOption } from 'src/components/Business/add/addBusinessUtils';
import { BLOCK_REASON_CHARACTER_LIMIT } from 'src/components/CustomerDetailPage/Add/CustomDetailUtil';
import { VehicleCategoryLabelKeys } from 'src/components/RateTier/Cities/rateTierList/add/AddRateTierUtil';
import { generateIntialDriverData, IDriver } from 'src/components/RequestManagement/RequestDetails/DriverRequests/Onboarding/DriverOnboardingRequestUtil';
import RejectRequestModal from 'src/components/RequestManagement/RequestDetails/RejectRequestModal/RejectRequestModal';
import { renderRequestRejectionButton } from 'src/components/RequestManagement/RequestDetails/RejectRequestModal/RequestRejectButton';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';
import { useManageStyle } from 'src/components/RequestManagement/Style';
import ImageModal from 'src/components/Restaurant/ProfilePreview/ImagePreviewer';
import { checkIfEmpty } from 'src/components/Restaurant/ProfilePreview/ProfilePreviewUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';

const DriverOnboardingRequest = () => {
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const ManageStyle = useManageStyle();
  const timing = useTimingStyle();
  const {theme} = useAppTheme();
  const { canEdit } = usePermission(MenuType.REQUEST);
  const { tenantId } = useTenantId();
  const { t: TranslateMessage } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string; }>();
  const [requestRejectReason, setRequestRejectReason] = useState<string | null>(null);
 const dispatch = useDispatch<AppDispatch>();
    const [driverData, setDriverData] = useState<IDriver>({
    ...generateIntialDriverData(),
  });
  const {data, loading , error, blockStatus} = useSelector((state: RootState) => state.driver.driverDetails);
  const [uploadLicenceProof, setUploadLicenceProof] = useState<IFilesData[]>([]);
  const [uploadRegistrationProof, setUploadRegistrationProof] = useState<IFilesData[]>([]);
  const [uploadInsuranceProof, setUploadInsuranceProof] = useState<IFilesData[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const focus = useIsFocused();
  const [requestRejectReasonError, setRequestRejectReasonError] = useState<string>('');

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setRequestRejectReason('');
    setRequestRejectReasonError('');
  };

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };



  const handleChange = (text: string) => {
    if (text.length > BLOCK_REASON_CHARACTER_LIMIT) {
      setRequestRejectReasonError(TranslateMessage('Admin.Delivery.App.Customer.Error.MaxLength', { blockreasonLimit: BLOCK_REASON_CHARACTER_LIMIT }));
      return;
    }
    if (text.trim() === '') {
      setRequestRejectReasonError(TranslateMessage('Admin.Delivery.App.Customer.Error.Mandatory.Field'));
    } else {
      setRequestRejectReasonError('');
    }
    setRequestRejectReason(text);
  };

  const customerStatus = [
    { label: 'Active', value: 'active' },
    { label: 'Blocked', value: 'blocked' },

  ];

  const onChangeDropdown = (item: IMinuteOption, key: string) => {
    setDriverData((prev) => ({
      ...prev,
      [key]: item.value, 
    }));
  };

  const handleRequestApproveOrRejection = async (status: RequestType, comment: string | null) => {
         dispatch(driverRequestApprovalRejectionAction(id,
               status,
               comment || null));
  }

  const processDriverImages = (driverData: IDriver) => {
    Promise.all(
      driverData?.licenseImages?.map((img) =>
        returnBlobForSingleFileNew(img.fileUrl,tenantId??'').then((blob) => {
          const [file] = getMediaDetails(blob);
          return file;
        })
      )
    )
      .then((files) => setUploadLicenceProof(files))
      .catch(() => {});
  
    Promise.all(
      driverData?.registrationImages?.map((img) =>
        returnBlobForSingleFileNew(img.fileUrl,tenantId??'').then((blob) => {
          const [file] = getMediaDetails(blob);
          return file;
        })
      )
    )
      .then((files) => setUploadRegistrationProof(files))
      .catch(() => {});
  
    Promise.all(
      driverData?.insuranceImages?.map((img) =>
        returnBlobForSingleFileNew(img.fileUrl,tenantId??'').then((blob) => {
          const [file] = getMediaDetails(blob);
          return file;
        })
      )
    )
      .then((files) => setUploadInsuranceProof(files))
      .catch(() => {});
  };

  const getOnboardingDetails = async () => {
          dispatch(fetchDriverDetailsAction(Number(id), true));
  };

  useEffect(() => {
    if (focus)
      getOnboardingDetails();
      return () => {dispatch(resetDriverDetails());}
  }, [focus]);

  useEffect(() => {
    if (!data) return;
  
    setDriverData(data);
    processDriverImages(data);
    
  }, [data]);

    useEffect(()=>{
      if(data){
        setDriverData(data);
      }
    },[data])
  
    useEffect(() => {
      if (blockStatus!==null) {
          router.push(Routes.REQUESTS)
      }
    }, [blockStatus]);

  function renderHeading(label: string) {
    return (
      <View style={formStyle.formRow}>
        <View style={formStyle.formCol}>
          <Text style={formStyle.labelHeadTitle}>{label}</Text>
        </View>
      </View>
    );
  }

  function renderInputField(label: string, value: string) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>{label}</Text>
        <TextInput
          style={[formStyle.inputField, formStyle.inputDisabled]}
          value={value}
          placeholderTextColor={theme.colors.textNeutral}
          mode='outlined'
          autoCapitalize='none'
          secureTextEntry={false}
          editable={false}
          disabled
          contentStyle={formStyle.inputLabel}
        />
      </View>
    );
  }
  function renderCustomDropDown(label: string, value: string) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>{label}</Text>
        <Customdropdown
          data={customerStatus}
          selectedValue={{
            label: customerStatus.find((item) => item.value === driverData.activeStatus)?.label || '',
            value: driverData.activeStatus,
          }}
          onChange={(item) => onChangeDropdown(item, 'acriveStatus')}
        />
      </View>
    );
  }
  function renderRestaurantLogo(label: string, value: string) {
    return (
      <View style={[formStyle.formRow, { flexDirection: 'column', gap: 0 }]}>
        <View style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>{label}</Text>
        </View>
        <View style={ManageStyle.userImage}>
          <Pressable onPress={() => openImage(value)}>
            <RenderImage
                uri={value}
                style={[ManageStyle.userImageImg as ImageStyle]}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }

  const renderContent = () => {

    return renderRequestRejectionButton(
      driverData.approvalRequestStatus,
      toggleModal,
      handleRequestApproveOrRejection,
      canEdit
    )
  };
  function renderDocumentField(label: string, files: IFilesData[]) {
    return (
      <View style={formStyle.formRow}>
        <View style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>{label}</Text>
          <FileViewer filesData={files} showDefaultImage={true} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[layout.flexCol, layout.sectionSpace, layout.paddinghor17]}>
        <View style={layout.loaderonboard}>
          <Loader loading={loading} />

        </View>
        {isModalVisible && (
          <RejectRequestModal
            isModalVisible={isModalVisible}
            toggleModal={toggleModal}
            handleChange={handleChange}
            loading={loading}
            description={requestRejectReason}
            handleRequestRejection={() => handleRequestApproveOrRejection(RequestType.REJECTED, requestRejectReason)}
            error={requestRejectReasonError}
          />
        )}
        <View
          style={[
            layout.container,
            styles.headerContainer,
            layout.paddingTop26,
            { flexWrap: 'wrap' },
          ]}
        >
          <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.DriverManagement.Heading')}</Typography>
        </View>
        <Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.xxl }]} />
        <View style={[layout.cardBox, layout.flexCol]}>
          <View style={[formStyle.formRow, layout.alignCenter]}>
            <View style={formStyle.formCol}>
              <Text style={[formStyle.labelHeadTitle, layout.mb0]}>{renderHeading(
                TranslateMessage('Admin.Delivery.App.Driver.Detail')
              )}</Text>
            </View>
            {renderContent()}
          </View>

          <View style={formStyle.formRow}>
            {renderRestaurantLogo(
              TranslateMessage('Admin.Delivery.App.Customer.Profile.Name'),
              driverData.profileUrl
            )}

          </View>
          <View style={formStyle.formRow}>

            {renderInputField(
              TranslateMessage(
                'Admin.Delivery.App.Customer.Driver.Name'
              ),
              driverData.firstName
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Customer.Email'),
              driverData.email
            )}

          </View>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Customer.Phone.Number'),
              driverData.phoneNumber
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Customer.Registeration.Date'),
              driverData.createdAt &&
              formatToDateMonthYear(driverData.createdAt)
            )}
          </View>
          <View style={formStyle.formRow}>

            {renderInputField(
              TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Status'),
              driverData.isBlocked ? TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Block') : TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Unblock')
            )}
          </View>
          {
            driverData.approvalRequestStatus === RequestType.REJECTED && driverData.comment ?
              <View style={formStyle.formRow}>
                {renderInputField(
                  TranslateMessage('Admin.Delivery.App.Rejected.Reason'),
                  driverData?.comment
                )}
              </View>
              : null
          }
          <Text style={formStyle.labelHeadTitle}>{TranslateMessage('Admin.Delivery.App.Driver.License.Details')}</Text>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.License.Registration.Number'),
              checkIfEmpty(driverData?.riderVehicleRegistration?.registrationNumber)
            )}
          </View>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.Vehicle.Type'),
              checkIfEmpty(driverData?.riderVehicleRegistration?.vehicleType)
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Restaurant.Created.At'),
              driverData?.riderVehicleRegistration?.createdAt && formatToDateMonthYear(driverData?.riderVehicleRegistration?.createdAt)
            )}
          </View>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Vehicle.Category'),
              TranslateMessage(VehicleCategoryLabelKeys[checkIfEmpty(driverData?.riderVehicleRegistration?.vehicleCategory) as keyof typeof VehicleCategoryLabelKeys] ?? checkIfEmpty(driverData?.riderVehicleRegistration?.vehicleCategory))
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Vehicle.Name'),
              checkIfEmpty(driverData?.riderVehicleRegistration?.vehicleName)
            )}
          </View>
          <View style={[formStyle.formRow]}>
            {renderDocumentField(
              TranslateMessage('Admin.Delivery.App.Restaurant.Vehicle.Proff'),
              uploadRegistrationProof
            )}
          </View>

          <Text style={formStyle.labelHeadTitle}>{TranslateMessage('Admin.Delivery.App.Restaurant.Licence.Document')}</Text>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Restaurant.Licence.Number'),
              driverData?.riderLicense?.licenseNumber
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Restaurant.Expiry.Date'),
              driverData?.riderLicense?.expiryDate && formatToDateMonthYear(driverData?.riderLicense?.expiryDate)
            )}
          </View>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Restaurant.Created.At'),
              driverData?.riderLicense?.createdAt && formatToDateMonthYear(driverData?.riderLicense?.createdAt)
            )}

          </View>
          {/* licence Proof */}
          <View style={[formStyle.formRow]}>
            {renderDocumentField(
              TranslateMessage('Admin.Delivery.App.OnboardingRequest.LicenseProof'),
              uploadLicenceProof
            )}
          </View>

          {/* emergency detail */}

          <Text style={formStyle.labelHeadTitle}>{TranslateMessage('Admin.Delivery.App.Driver.Emergency.Details')}</Text>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.Full.Name'),
              driverData?.emergencyContactDto?.fullName
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Customer.Phone.Number'),
              driverData?.emergencyContactDto?.phoneNumber
            )}
          </View>
          <View style={formStyle.formRow}>

            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.Relationship'),
              driverData?.emergencyContactDto?.relationship
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Restaurants.AddressTitle'),
              driverData?.emergencyContactDto?.address
            )}
          </View>

          {/* Bank Details */}

          {/* <Text style={formStyle.labelHeadTitle}>{TranslateMessage('Admin.Delivery.App.Driver.Bank.Details')}</Text>
          <Text style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Driver.BankTransfer')}
            {driverData?.bankDetailsResponse?.paymentMethod === PaymentOptions.BANKTRANSFER
              ? ` (${TranslateMessage('Admin.Delivery.App.Default')})`
              : ''}
          </Text> */}
          {/* <View style={formStyle.formRow}> */}
            {/* {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.ifscCode'),
              driverData?.bankDetailsResponse?.ifscCode
            )} */}
            {/* {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.AccountHolderName'),
              driverData?.bankDetailsResponse?.accountHolderName
            )} */}
          {/* </View> */}
          {/* <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.Account.Number'),
              driverData?.bankDetailsResponse?.accountNumber
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.Payment.Method'),
              driverData?.bankDetailsResponse?.paymentMethod
            )}
          </View> */}
          {/* <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.RibNumber'),
              driverData?.bankDetailsResponse?.ribNumber
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.MobileNumber'),
              driverData?.bankDetailsResponse?.mobileNumber
            )}
          </View> */}
          {/* Insurance Details */}

          <View style={formStyle.formCol}>
            <Text style={formStyle.labelHeadTitle}>{TranslateMessage('Admin.Delivery.App.Driver.Vehicle.Insurance.Details')}</Text>

            <View style={formStyle.formRow}>
              {renderInputField(
                TranslateMessage('Admin.Delivery.App.Driver.Vehicle.Insurance.Number'),
                driverData?.vehicleInsurance?.insuranceNumber
              )}
              {/* {renderInputField(
                TranslateMessage('Admin.Delivery.App.Restaurant.Expiry.Date'),
                (driverData?.vehicleInsurance?.expiryDate && formatToDateMonthYear(driverData?.vehicleInsurance?.expiryDate))
              )} */}
              {renderInputField(
                TranslateMessage('Admin.Delivery.App.Restaurant.Created.At'),
                driverData?.vehicleInsurance?.createdAt && formatToDateMonthYear(driverData?.vehicleInsurance?.createdAt)
              )}
            </View>

            <View style={[formStyle.formRow]}>
            {renderDocumentField(
              TranslateMessage('Admin.Delivery.App.Restaurant.Insurance.Proof'),
              uploadInsuranceProof
            )}
          </View>
          </View>



          {renderErrorMsgSection(error ?? '')}
        </View>
        <View >
          <ImageModal setModalVisible={setModalVisible} selectedImage={selectedImage} modalVisible={modalVisible} />
        </View>
      </View>
    </ScrollView>
  );
};

export default DriverOnboardingRequest;
