import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageStyle, Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { RenderImage } from 'src/common/components/Image/Image';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { customerBlockUnblockAction, fetchCustomerDetailsAction } from 'src/common/service/customer/action';
import { resetCustomerDetails } from 'src/common/service/customer/slice';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { MenuType } from 'src/common/utils/permissionUtils';
import { BLOCK_REASON_CHARACTER_LIMIT, ICustomerStatusRequest } from 'src/components/CustomerDetailPage/Add/CustomDetailUtil';
import BlockRequestModal from 'src/components/CustomerDetailPage/BlockRequestModal/BlockRequestModal';
import { useManageStyle } from 'src/components/RequestManagement/Style';
import ImageModal from 'src/components/Restaurant/ProfilePreview/ImagePreviewer';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const CustomerDetailPage = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const ManageStyle = useManageStyle();
  const timing = useTimingStyle();
  const {theme} = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {data:customerData, loading , error, blockStatus} = useSelector((state: RootState) => state.customer.customerDetails);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [requestRejectReason, setRequestRejectReason] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const focus = useIsFocused();
  const [blockReasonError, setBlockReasonError] = useState<string>('');
  const { canEdit } = usePermission(MenuType.CUSTOMER);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setRequestRejectReason(''); 
    setBlockReasonError('')
  };
  const handleChange = (text: string) => {
    if (text.length > BLOCK_REASON_CHARACTER_LIMIT) {
      setBlockReasonError(TranslateMessage('Admin.Delivery.App.Customer.Error.MaxLength', { blockreasonLimit: BLOCK_REASON_CHARACTER_LIMIT }));
      return;
    }
    if (text.trim() === '') {
      setBlockReasonError(TranslateMessage('Admin.Delivery.App.Customer.Error.Mandatory.Field'));
    } else {
      setBlockReasonError('');
    }
    setRequestRejectReason(text);
  };

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };


  useEffect(() => {
    if (focus){
      dispatch(fetchCustomerDetailsAction(id))
    }
    return () => {dispatch(resetCustomerDetails());}
  }, [focus]);

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
  function renderRestaurantLogo(value: string) {
    return (
      <View style={[formStyle.formRow, { flexDirection: 'column', gap: 0 }]}>
        {/* <View style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>{label}</Text>
        </View> */}
        <View>
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

  const renderBlockUnblockButton = () => {
       if (!canEdit) {
      return null;
    }
    
    if (!customerData?.isBlocked) {
      return (
        <Pressable
          style={[button.btnBase, button.btnOutlineDanger, button.btnMd]}
          onPress={toggleModal}
        >
          <Typography
            variant="btnText"
            color={theme.colors.textErrorDark}
            style={{ paddingHorizontal: 0 }}
          >
            {!customerData?.isBlocked
              ? TranslateMessage('Admin.Delivery.App.Block')
              : TranslateMessage('Admin.Delivery.App.Unblock')}
          </Typography>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          style={[button.btnBase, button.btnOutlineSuccess, button.btnMd]}
          onPress={() => handleCustomerBlockUnblock(false, 'unblock')}
        >
          <Typography
            variant="btnText"
            color={theme.colors.textSuccessDark}
            style={{ paddingHorizontal: 0 }}
          >
            {!customerData.isBlocked
              ? TranslateMessage('Admin.Delivery.App.Block')
              : TranslateMessage('Admin.Delivery.App.Unblock')}
          </Typography>
        </Pressable>
      );
    }
  };
  useEffect(() => {
    if (blockStatus!==null) {
        router.push(Routes.CUSTOMER)
    }
  }, [blockStatus]);

  const handleCustomerBlockUnblock = async (isBlocked: boolean, blockedReason: string | null) => {
    const payloadData = { id, isBlocked, blockedReason } as ICustomerStatusRequest;
    dispatch(customerBlockUnblockAction(payloadData));
  }
  const handleBookingPage = () => {
    router.push({
      pathname: `${Routes.CUSTOMER}${Routes.BOOKINGHISTORY}/[id]`,
      params: {
        id: String(id),
        key: 'USER',
      },
    });
  };
  
  return (
    <ScrollView>
      <View style={[layout.flexCol, layout.sectionSpace, layout.paddinghor17]}>
        <Loader loading={loading} />
        {isModalVisible && (
          <BlockRequestModal
            isModalVisible={isModalVisible}
            toggleModal={toggleModal}
            handleChange={handleChange}
            description={requestRejectReason}
            handleRequestRejection={() => handleCustomerBlockUnblock(true, requestRejectReason)}
            error={blockReasonError}
            modalTitle={TranslateMessage('Admin.Delivery.App.Block.Reason')}
            loading={loading}
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
          <View style={[styles.filterrow, layout.alignCenter]}>
            {/* <Pressable>
              <IconButton
                icon='chevron-left'
                style={[button.btnfilter]}
                size={40}
                iconColor={theme.colors.iconBase}
                onPress={() => router.push(Routes.CUSTOMER)}
              />
            </Pressable> */}
            <Text style={[layout.Adminh1Title]}>
              {TranslateMessage(
                'Admin.Delivery.App.UserManagementList.Heading'
              )}
            </Text>
          </View>
        </View>
        <Divider style={[layout.DividerSperator, { marginBottom: 30 }]} />
         <View style={[layout.cardBox]}>
                  <View style={[layout.flexDirectionRow, layout.alignItemCenter, layout.flexWrap]}>
                    <View>
                      {renderRestaurantLogo(customerData?.profileUrl ??'')}
                    </View>
                    <View style={{alignItems: 'baseline'}}>
                      <Typography variant='subHeading' spacing={{bottom: 8}}>{customerData?.firstName}</Typography>
                      <Typography variant='textLabel' align='center' style={[layout.statusMessage, customerData?.isBlocked ? layout.cancelStatus : null]}>
                          {(
                            customerData?.isBlocked ? TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Block') : TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Unblock')
                          )}
                        </Typography>
                      
                    </View>
                     {/* Required in Future */}
                    {/* <Pressable style={[button.btn, button.btnMd, button.btnOutlinePrimary]} onPress={() => router.push(Routes.CHAT)}>
                      <View style={[layout.flexDirectionRow, layout.alignItemCenter, {gap: 5}]}>
                        <Icon name='messageOutline' color={theme.colors.iconBase} size={20}/>
                        <Typography variant='btnText' style={{paddingHorizontal: 0}} fontWeight='medium'>{TranslateMessage('Admin.Delivery.App.Message')}</Typography>
                      </View>
                    </Pressable> */}
                    <Pressable style={[button.btn, button.btnMd, button.btnOutlinePrimary]} onPress={handleBookingPage}>
                      <View style={[layout.flexDirectionRow, layout.alignItemCenter, { gap: 5 }]}>
                        <Icon name='steering' color={theme.colors.iconBase} size={25} />
                        <Typography variant='btnText' fontWeight='medium'  style={{ paddingHorizontal: 0 }}>{TranslateMessage('Admin.Delivery.App.Booking.History')}</Typography>
                      </View>
                    </Pressable>
                    {/* <Pressable style={[button.btn, button.btnMd, button.btnOutlineDanger]}>
                      <View style={[layout.flexDirectionRow, layout.alignItemCenter, { gap: 5 }]}>
                        <Icon name='cancel' color={theme.colors.iconErrorDark} size={25} />
                        <Typography variant='btnText' fontWeight='medium'  color={theme.colors.textErrorDark} style={{ paddingHorizontal: 0 }}>{TranslateMessage('Admin.Delivery.App.Booking.Suspend')}</Typography>
                      </View>
                    </Pressable> */}
                  </View>
                </View>
        <View style={[layout.cardBox, layout.flexCol]}>
          <View style={[formStyle.formRow, layout.alignCenter, layout.mb10]}>
            <View style={formStyle.formCol}>
              <Text style={[formStyle.labelHeadTitle, layout.mb0]}>
                {TranslateMessage('Admin.Delivery.App.Customer.Detail')}
              </Text>
            </View>

            {renderBlockUnblockButton()}
          </View>

          {/* <View style={formStyle.formRow}>
            {renderRestaurantLogo(
              customerData?.profileUrl ??''
            )}

          </View> */}
          <View >
            <ImageModal setModalVisible={setModalVisible} selectedImage={selectedImage} modalVisible={modalVisible} />
          </View>
          <View style={formStyle.formRow}>

            {renderInputField(
              TranslateMessage(
                'Admin.Delivery.App.Customer.Customer.Name'
              ),
              customerData?.firstName ??''
            )}

          </View>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Customer.Email'),
              customerData?.email ?? ''
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Customer.Phone.Number'),
              customerData?.phoneNumber ??''
            )}
          </View>
          <View style={[formStyle.formRow]}>
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Customer.Registeration.Date'),
              formatToDateMonthYear(customerData?.createdAt ??'')
            )}
            {renderInputField(
              TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Status'),
              customerData?.isBlocked ? TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Block') : TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Unblock')
            )}
          </View>
          {customerData?.isBlocked &&
            <View style={formStyle.formRow}>
              {renderInputField(
                TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Blocked.Reason'),
                customerData.blockedReason
              )}
            </View>
          }
          <View style={[formStyle.formRow]}>
          {customerData && renderInputField(TranslateMessage('Admin.Delivery.App.Customer.Subscription.Expiry.Date'),
            customerData.userSubscription.validTo && formatToDateMonthYear(customerData.userSubscription.validTo))
          }
          </View>
          {renderErrorMsgSection(error??'')}
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomerDetailPage;
