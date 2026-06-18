import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageStyle, Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { RenderImage } from 'src/common/components/Image/Image';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchTicketDetailsAction, updateTicketStatusAction } from 'src/common/service/ticket/action';
import { resetTicketDetails, resetTicketStatus } from 'src/common/service/ticket/slice';
import { IMinuteOption } from 'src/components/Business/BusinessListUtils';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import ImageModal from 'src/components/Restaurant/ProfilePreview/ImagePreviewer';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTicketStyle } from 'src/components/TicketPage/TicketDetailStyle';
import { generateIntialTicketData, getTicketLabelByKey, IStatusType, ITicket, ITicketStatusRequest, ticketStatusLabel } from 'src/components/TicketPage/TicketDetailUtil';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';

const TicketDetailPage = () => {
  const layout = useLayoutStyle();
  const TicketDetailStyle = useTicketStyle();
  const DashboardStyle = useDashboardStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const timing = useTimingStyle();
  const { t: TranslateMessage } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [requestRejectReason, setRequestRejectReason] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  // const [error, setError] = useState<string>('');
  const [ticketData, setTicketData] = useState<ITicket>({
    ...generateIntialTicketData(),
  });
  const [updateTicketData, setUpdateTicketData] = useState<ITicket>({
    ...generateIntialTicketData(),
  });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const focus = useIsFocused();
  const [blockReasonError, setBlockReasonError] = useState<string>('');
  const { theme } = useAppTheme();
  const handleChange = (text: string) => {
    setRequestRejectReason(text);
  };
  const dispatch = useDispatch<AppDispatch>();
  const { data: ticketDetails, loading, error } = useSelector((state: RootState) => state.ticket.ticketDetails);
  const { success, loading: statusUpdateLoading, error: statusChangeError } = useSelector((state: RootState) => state.ticket.ticketStatusUpdate);
  const ticketStatus = [
    {
      label: TranslateMessage(
        'Admin.Delivery.App.OrderList.Filter.OPEN'
      ),
      value: IStatusType.OPEN
    },
    {
      label: TranslateMessage(
        'Admin.Delivery.App.OrderList.Filter.Close'
      ),
      value: IStatusType.CLOSED
    },
  ];
  useEffect(() => {
    if (ticketDetails) {
      setTicketData(ticketDetails);
      setRequestRejectReason(ticketDetails.comments)
      setUpdateTicketData((prev) => ({
        ...prev,
        ticketStatus: ticketDetails.ticketStatus,
      }));
    }
  }, [ticketDetails]);

  useEffect(() => {
    if (success) {
      setSnackbarVisible(true);
    }
  }, [success])

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setRequestRejectReason('');
    setBlockReasonError('')
  };


  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };
  const getRestaurantDetails = async () => {
    dispatch(fetchTicketDetailsAction(id));
  };

  useEffect(() => {
    if (focus) {
      getRestaurantDetails();
    } else {
      reset();
      return (() => {
        dispatch(resetTicketDetails());
        dispatch(resetTicketStatus());
      })
    }
  }, [focus]);

  const handleSaveAndProceed = () => {
    // const isStatusChanged = updateTicketData.ticketStatus !== ticketData.ticketStatus && updateTicketData.ticketStatus !== '';
    // const isCommentChanged = (requestRejectReason || '').trim() !== (ticketData.comments || '').trim();
    handleTicketStatus(updateTicketData.ticketStatus, requestRejectReason);
    // router.push(Routes.TICKET);

    // if (isStatusChanged || isCommentChanged) {
    // } else {
    // }
  };



  const reset = () => {
    setTicketData({ ...generateIntialTicketData() });
    setUpdateTicketData({ ...generateIntialTicketData() });
    // setError('');
    setSnackbarVisible(false);
    setRequestRejectReason(null)
  };
  const handleTicketStatus = async (ticketStatus: string, comments: string | null) => {
    const payloadData = { id, ticketStatus, comments: comments?.trim() } as ITicketStatusRequest
    dispatch(updateTicketStatusAction(payloadData))
  }
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
          value={getTicketLabelByKey(value)}
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
  function renderDescriptionField(label: string, value: string) {
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
          multiline
          contentStyle={[formStyle.inputLabel, { paddingTop: theme.spacing.md }]}
        />
      </View>
    );
  }
  function renderCommentField(label: string, value: string) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>{label}</Text>
        <TextInput
          style={[
            formStyle.inputField,
            { height: 'auto', paddingVertical: theme.spacing.sm },
          ]}
          value={requestRejectReason || ''}
          onChangeText={handleChange}
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          placeholderTextColor={theme.colors.textNeutral}
          mode='outlined'
          autoCapitalize='none'
          secureTextEntry={false}
          editable={true}
          multiline={true}
          contentStyle={formStyle.inputLabel}
          numberOfLines={5}
          placeholder={TranslateMessage(
            'Admin.Delivery.Request.Rejection.CommentPlaceHolder'
          )}
          maxLength={90}
        />
      </View>
    );
  }

  const onChangeDropdown = (item: IMinuteOption, key: string) => {
    setUpdateTicketData((prev) => ({
      ...prev,
      [key]: item.value,
    }));
  };

  function renderTicketStatusDropdown(label: string, value: string) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>{label}</Text>
        <Customdropdown
          data={ticketStatus}
          selectedValue={{
            label: ticketStatus.find((item) => item.value === ticketData.ticketStatus)?.label || '',
            value: updateTicketData.ticketStatus,
          }}
          onChange={(item) => onChangeDropdown(item, 'ticketStatus')}
        />
      </View>
    );
  }

  function renderTicketStatus(item: ITicket) {
    return (
      <View style={[item.ticketStatus===IStatusType.CLOSED ? DashboardStyle.pickedUpColor:DashboardStyle.rejected,TicketDetailStyle.padding_5]}>
        <Text style={[TicketDetailStyle.fontSize_16,item.ticketStatus===IStatusType.CLOSED ?{color: theme.colors.textSuccessDark}:{color: theme.colors.textErrorDark},TicketDetailStyle.padding_5]}>
          {TranslateMessage(ticketStatusLabel[item.ticketStatus as IStatusType] as string)}
        </Text>
      </View>
    );
  }

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }
  function renderImage(url: string, label: string) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>{label}</Text>
        <View style={styles.userImage}>
          <Pressable onPress={() => openImage(url)}>
            <RenderImage
              uri={url}
              style={[TicketDetailStyle.userImageImg as ImageStyle]}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  const handleDismiss = () => {
    setSnackbarVisible(false);
    router.push(Routes.TICKET);
  };


  function renderButton(item: ITicket, label: string) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>{label}</Text>
        <TextInput
          style={[formStyle.inputField, formStyle.inputDisabled]}
          value={TranslateMessage(ticketStatusLabel[item.ticketStatus as IStatusType] as string)}
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
  const handleBack = () => {
    router.push(`${Routes.TICKET}`);
  };
  const isStatusChanged =
    updateTicketData.ticketStatus !== ticketData.ticketStatus &&
    updateTicketData.ticketStatus !== '';

  const handleOrderDetailsPage = () => {
    router.push(`${Routes.BOOKING}${Routes.BOOKINGDETAILS}/${ticketData.orderId}`);
  }

  return (
    <>
      <ScrollView>
        <View style={[layout.flexCol, layout.sectionSpace, layout.paddinghor17]}>
          <View
            style={[
              layout.container,
              styles.headerContainer,
              layout.paddingTop26,
              { flexWrap: 'wrap' },
            ]}
          >
            <View style={styles.filterrow}>
              {/* <Pressable >
                <IconButton
                  icon='chevron-left'
                  style={button.btnIcon}
                  size={40}
                  onPress={() => router.push(Routes.TICKET)}
                  iconColor={theme.colors.iconBase}
                />
              </Pressable> */}
              <Text style={[layout.Adminh1Title]}>
                {TranslateMessage(
                  'Admin.Delivery.App.Add.Ticket'
                )}
              </Text>

            </View>
          </View>
          <Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.xxl }]} />
          <View style={[layout.cardBox, layout.flexCol]}>
            <View style={[formStyle.formRow, layout.alignCenter, layout.mb10]}>
              <View style={formStyle.formCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Text style={[formStyle.labelHeadTitle, layout.mb0]}>
                    {TranslateMessage('Admin.Delivery.App.Ticket.Detail')}
                  </Text>
                </View>
              </View>
              {
                ticketData.orderId ?
                  <Pressable onPress={handleOrderDetailsPage}>
                    <Text style={[button.btn, button.btnPrimary]}>
                      {TranslateMessage('Admin.Driver.Delivery.App.View.Booking.Details')}
                    </Text>
                  </Pressable>
                  : null
              }
              {renderTicketStatus(ticketData)}
            </View>
            <View >
              <ImageModal setModalVisible={setModalVisible} selectedImage={selectedImage} modalVisible={modalVisible} />
            </View>
            <View style={formStyle.formRow}>
              {renderInputField(
                TranslateMessage('Admin.Delivery.App.Orders.Table.RequestId'),
                ticketData.transactionId || ticketData.orderId
              )}
              {renderInputField(
                TranslateMessage('Admin.Delivery.App.Ticket.Table.TicketIssueType'),
                ticketData.ticketType
              )}
            </View>
            <View style={formStyle.formRow}>

              {renderButton(ticketData, TranslateMessage('Admin.Delivery.App.TicketStatus'))}


              {renderDescriptionField(
                TranslateMessage('Admin.Delivery.App.Ticket.Table.Description'),
                ticketData.description
              )}
            </View>
            <View style={formStyle.formRow}>

              {
                ticketData?.ticketImageUrl ?
                  renderImage(ticketData?.ticketImageUrl ?? '', TranslateMessage('Admin.Delivery.App.Ticket.Issue.Image'))
                  : null
              }

            </View>

            <View style={[formStyle.formRow]}>
              {renderCommentField(
                TranslateMessage('Admin.Delivery.App.Ticket.Table.Comment'),
                ticketData.comments as string
              )}
              {renderTicketStatusDropdown(
                TranslateMessage('Admin.Delivery.App.Ticket.Table.ChangeTicketStatus'),
                ticketData.ticketType
              )}
            </View>
            <View style={[formStyle.formRow, { justifyContent: 'flex-end' }]}>
              <View style={[formStyle.formBtnRow, layout.alignRight]}>
                <View>
                  <Pressable onPress={handleBack}>
                    <Text
                      style={[button.btn, button.btnOutlineDefault, { minWidth: 250 }]}
                    >
                      {TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View style={[formStyle.formBtnRow, layout.alignRight]}>
                <View>
                  <Pressable onPress={handleSaveAndProceed}>
                    <Text style={[button.btn, button.btnPrimary, { minWidth: 250 }]}>
                      {TranslateMessage('Admin.Delivery.App.SaveBtnTitle')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
            {renderErrorMsgSection(error || statusChangeError || '')}
          </View>
        </View>
      </ScrollView>
      <CustomSnackbar
        visible={snackbarVisible}
        message={TranslateMessage('Admin.Delivery.App.Ticket.DataSaved')}
        onDismiss={handleDismiss}
        type={SnackbarType.SUCCESS}
      />
    </>
  );
};

export default TicketDetailPage;
