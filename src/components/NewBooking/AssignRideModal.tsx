import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomModal from 'src/common/components/CustomModal/CustomModal';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { RenderImage } from 'src/common/components/Image/Image';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { formatToDateMonthYearAndTime } from 'src/common/utils/dateUtil';
import { Icon } from 'src/submodules/iconlibrary/src';
import { formatBookingDateTime } from 'src/components/Booking/Add/BookingDetailUtil';

interface AssignRideModalProps {
  visible: boolean;
  isReassignFlow: boolean;
  bookingId?: number | null;
  riderId?: number | null;
  riderName?: string | null;
  riderImage?: string | null;
  scheduledTime?: string | null;
  hasScheduleConflict: boolean;
  scheduleLoading: boolean;
  assignLoading: boolean;
  scheduleError?: string | null;
  onCancel: () => void;
  onProceed: () => void;
}

const AssignRideModal = ({
  visible,
  isReassignFlow,
  bookingId,
  riderId,
  riderName,
  riderImage,
  scheduledTime,
  hasScheduleConflict,
  scheduleLoading,
  assignLoading,
  scheduleError,
  onCancel,
  onProceed,
}: AssignRideModalProps) => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const formStyle = useFormStyle();
  const layout = useLayoutStyle();
  const hasRiderName = Boolean(riderName?.trim());
  const hasRiderDetails = hasRiderName || Boolean(riderId) || Boolean(riderImage);

  return (
    <CustomModal
      visible={visible}
      dismissOutside={true}
      title={TranslateMessage(
        isReassignFlow
          ? 'Admin.Delivery.App.Reassign.Driver'
          : 'Admin.Delivery.App.Assign.Ride'
      )}
      bodyContent={[]}
      onCancel={onCancel}
      onSave={onProceed}
      isConfirmDisabled={scheduleLoading || Boolean(scheduleError)}
      confirmBtnTitle={TranslateMessage('Admin.Delivery.App.Proceed')}
      cancelBtnTitle={TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
    >
      <View style={formStyle.formRow}>
        <View style={[formStyle.formCol, layout.assignRideModalContent]}>
          <Typography variant='body'>
            {TranslateMessage(
              isReassignFlow
                ? 'Admin.Delivery.App.Reassign.Driver.Confirmation'
                : 'Admin.Delivery.App.Assign.Ride.Confirmation'
            )}
          </Typography>
          {hasRiderDetails ? (
            <View style={[layout.flexDirectionRow, layout.alignItemCenter, { marginTop: theme.spacing.md, gap: theme.spacing.sm }]}>
              {riderImage ? (
                <RenderImage
                  uri={riderImage}
                  style={{ width: 52, height: 52, borderRadius: 26 }}
                />
              ) : null}
              <View style={{ gap: theme.spacing.xs, flexShrink: 1 }}>
                {hasRiderName ? (
                  <Typography variant='body' fontWeight='medium'>
                    {`${TranslateMessage('Admin.Delivery.App.Rider')}: ${riderName}`}
                  </Typography>
                ) : null}
                {riderId ? (
                  <Typography variant='body' fontWeight='medium'>
                    {`${TranslateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.DriverId')} ${riderId}`}
                  </Typography>
                ) : null}
              </View>
            </View>
          ) : null}
          <View style={{ marginTop: theme.spacing.md, gap: theme.spacing.sm }}>
            <Typography variant='body' fontWeight='medium'>
              {`${TranslateMessage('Admin.Delivery.App.Ride')}: #${bookingId ?? '-'}`}
            </Typography>
            {scheduledTime ? (
              <Typography variant='body' fontWeight='medium'>
                {`${TranslateMessage('Admin.Delivery.App.Assignment.Date')}: ${formatBookingDateTime(scheduledTime) ?? scheduledTime}`}
              </Typography>
            ) : null}
          </View>
          {hasScheduleConflict ? (
            <View style={layout.scheduleConflictWarning}>
              <View style={[layout.flexDirectionRow, layout.alignItemCenter, { gap: theme.spacing.xs }]}>
                <Icon name='timer' size={16} color={theme.colors.textErrorDark} />
                <Typography variant='body' fontWeight='semiBold' color={theme.colors.textErrorDark}>
                  {TranslateMessage('Admin.Delivery.App.Note.Label')}
                </Typography>
              </View>
              <Typography variant='textLabel' color={theme.colors.textErrorDark} spacing={{ top: 4 }}>
                {TranslateMessage('Admin.Delivery.App.Assign.Ride.Schedule.Conflict.Note')}
              </Typography>
            </View>
          ) : null}
          {scheduleError && !scheduleLoading ? (
            <ErrorMessageContainer message={scheduleError} />
          ) : null}
          {(scheduleLoading || assignLoading) ? (
            <View style={layout.assignRideModalOverlayLoader}>
              <View style={layout.assignRideModalLoader}>
                <Loader loading={true} styles={layout.scheduleConflictLoader} />
                <Typography variant='textLabel' color={theme.colors.textNeutral}>
                  {TranslateMessage(
                    scheduleLoading
                      ? 'Admin.Delivery.App.Assignment.Loading'
                      : 'Admin.Delivery.App.Assigning.Driver'
                  )}
                </Typography>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </CustomModal>
  );
};

export default AssignRideModal;
