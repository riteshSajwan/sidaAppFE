import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider, IconButton, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { driverRequestApprovalRejectionAction, fetchDriverDetailsAction } from 'src/common/service/driver/action';
import { resetDriverDetails } from 'src/common/service/driver/slice';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { MenuType } from 'src/common/utils/permissionUtils';
import { BLOCK_REASON_CHARACTER_LIMIT } from 'src/components/CustomerDetailPage/Add/CustomDetailUtil';
import { generateIntialDriverData, IDriver } from 'src/components/RequestManagement/RequestDetails/DriverRequests/Onboarding/DriverOnboardingRequestUtil';
import RejectRequestModal from 'src/components/RequestManagement/RequestDetails/RejectRequestModal/RejectRequestModal';
import { renderRequestRejectionButton } from 'src/components/RequestManagement/RequestDetails/RejectRequestModal/RequestRejectButton';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';
import { checkIfEmpty } from 'src/components/Restaurant/ProfilePreview/ProfilePreviewUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';

const DriverOnboardingRequest = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const timing = useTimingStyle();
  const {theme} = useAppTheme();

  const { id } = useLocalSearchParams<{ id: string }>();
  const [requestRejectReason, setRequestRejectReason] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
    const [driverData, setDriverData] = useState<IDriver>({
    ...generateIntialDriverData(),
  });
  const {data, loading , error, blockStatus} = useSelector((state: RootState) => state.driver.driverDetails);
  const [requestRejectReasonError, setRequestRejectReasonError] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const focus = useIsFocused();
  const { canEdit } = usePermission(MenuType.REQUEST);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setRequestRejectReason('');
    setRequestRejectReasonError('');
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
  };;

  const renderContent = () => {

    return renderRequestRejectionButton(
      driverData.approvalRequestStatus,
      toggleModal,
      handleRequestApproveOrRejection,
      canEdit
    )
  };

  const handleRequestApproveOrRejection = async (status: RequestType, comment: string | null) => {
   dispatch(driverRequestApprovalRejectionAction(id,
           status,
           comment || null));
  }

  const getVehicleDetails = async () => {
      dispatch(fetchDriverDetailsAction(Number(id), true));
  };

  useEffect(() => {
    if (focus)
      getVehicleDetails();
    return () => {dispatch(resetDriverDetails());}
  }, [focus]);

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

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[layout.flexCol, layout.sectionSpace, layout.paddinghor17]}>
        <Loader loading={loading} />

        {isModalVisible && (
          <RejectRequestModal
            isModalVisible={isModalVisible}
            toggleModal={toggleModal}
            handleChange={handleChange}
            description={requestRejectReason}
            handleRequestRejection={() => handleRequestApproveOrRejection(RequestType.REJECTED, requestRejectReason)}
            error={requestRejectReasonError}
            loading={loading?? false}
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
          <View style={styles.filterrow}>
            <Pressable>
              <IconButton
                icon='chevron-left'
                style={[button.btnfilter]}
                size={40}
                iconColor={theme.colors.iconBase}
                onPress={() => router.push(Routes.REQUESTS)}
              />
            </Pressable>
            <Text style={[layout.Adminh1Title, layout.serviceTopHeader]}>
              {TranslateMessage(
                'Admin.Delivery.App.DriverManagement.Heading'
              )}
            </Text>
          </View>
        </View>
        <Divider style={[layout.DividerSperator, { marginBottom: 30 }]} />
        <View style={[layout.cardBox, layout.flexCol]}>
          <View style={[formStyle.formRow, layout.alignCenter]}>
            <View style={formStyle.formCol}>
              <Text style={[formStyle.labelHeadTitle, layout.mb0]}>{renderHeading(
                TranslateMessage('Admin.Delivery.App.Driver.Detail')
              )}</Text>
            </View>
            {renderContent()}
          </View>
          <View style={formStyle.formCol}>
            <Text style={formStyle.labelHeadTitle}>{TranslateMessage('Admin.Delivery.App.Driver.License.Details')}</Text>

            <View style={formStyle.formRow}>
              {renderInputField(
                TranslateMessage('Admin.Delivery.App.Driver.License.Registration.Number'),
                checkIfEmpty(driverData?.riderVehicleRegistration?.registrationNumber)
              )}
              {renderInputField(
                TranslateMessage('Admin.Delivery.App.Restaurant.Expiry.Date'),
                driverData?.riderVehicleRegistration?.expiryDate && formatToDateMonthYear(driverData?.riderVehicleRegistration?.expiryDate)
              )}

            </View>
            <View style={formStyle.formRow}>
              {renderInputField(
                TranslateMessage('Admin.Delivery.App.Driver.Vehicle.Type'),
                checkIfEmpty(driverData?.riderVehicleRegistration?.vehicleType)
              )}
              {renderInputField(
                TranslateMessage('Admin.Delivery.App.Restaurant.Created.At'),
                formatToDateMonthYear(driverData?.riderVehicleRegistration?.createdAt)
              )}
            </View>
          </View>
          {renderErrorMsgSection(error ?? '')}
        </View>
      </View>
    </ScrollView>
  );
};

export default DriverOnboardingRequest;
