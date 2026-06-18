import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchDriverPreviewPageAction, uploadDriverFileAction } from 'src/common/service/driver/action';
import { resetDriverFileUpload, resetDriverPreviewListing } from 'src/common/service/driver/slice';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import DriverUploadPreviewTable from 'src/components/DriverDetailPage/DriverUploadPreview/DriverUploadPreviewTable';
import { IPreviewDriverRow } from 'src/components/DriverDetailPage/DriverUploadPreview/DriverUploadPreviewUtil';

interface ISnackbarState {
  visible: boolean;
  message: string;
  isError: boolean;
}

const DriverUploadPreview = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const tablestyle = useTableStyle();
  const button = useButtonStyle();
  const { theme } = useAppTheme();
  const styles = useRestroStyle();
  const [page, setPage] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<ISnackbarState>({ visible: false, message: '', isError: false });
  const fileUploadState = useSelector((state: RootState) => state.driver.driverFileUpload);
  const previewListingState = useSelector((state: RootState) => state.driver.driverPreviewListing);
  const { uploadFile } = fileUploadState;
  const dispatch = useDispatch<AppDispatch>();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showSnackbar = (message: string, isError: boolean = false) => {
    setSnackbar({ visible: true, message, isError });
  };

  useFocusEffect(
    useCallback(() => {
      if (fileUploadState.success) {
        return;
      }
      if (!uploadFile) {
        router.replace(Routes.DRIVER);
        return;
      }
      dispatch(fetchDriverPreviewPageAction(uploadFile, page, DEFAULT_TABLE_SIZE));
      return () => {
        dispatch(resetDriverPreviewListing());
      };
    }, [dispatch, uploadFile, fileUploadState.success, page])
  );

  useEffect(() => {
    if (fileUploadState.success) {
      showSnackbar(TranslateMessage('Admin.Delivery.App.DriversUploadedSuccessfully'));
      redirectTimerRef.current = setTimeout(() => {
        dispatch(resetDriverFileUpload());
        dispatch(resetDriverPreviewListing());
        router.push(Routes.DRIVER);
      }, 2000);
    }
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    };
  }, [TranslateMessage, dispatch, fileUploadState.success]);

  useEffect(() => {
    if (fileUploadState.error) {
      showSnackbar(fileUploadState.error, true);
    }
  }, [fileUploadState.error]);

  const handleSubmit = () => {
    if (!uploadFile) {
      showSnackbar(TranslateMessage('Admin.Delivery.App.NoFileToUpload'), true);
      return;
    }
    dispatch(uploadDriverFileAction(uploadFile));
  };

  const handleCancel = () => {
    dispatch(resetDriverFileUpload());
    dispatch(resetDriverPreviewListing());
    router.push(Routes.DRIVER);
  };

  const handlePageChange = (newPage: number) => {
    if (!uploadFile) return;
    setPage(newPage);
    dispatch(fetchDriverPreviewPageAction(uploadFile, newPage, DEFAULT_TABLE_SIZE));
  };

  return (
    <>
      <Loader loading={fileUploadState.loading || previewListingState.loading} />
      <ScrollView>
        <View style={layout.containerPadding}>
          {/* Heading */}
          <View style={[layout.container, styles.headerContainer, layout.paddingTop26]}>
            <View style={styles.filterrow}>
              <Text style={[layout.Adminh1Title, layout.serviceTopHeader]}>
                {TranslateMessage('Admin.Delivery.App.DriverUploadPreview')}
              </Text>
            </View>
            <View style={styles.breadcrumbContainer}>
              <Text style={styles.breadcrumb}>{TranslateMessage('Admin.Delivery.App.Home')}</Text>
              <Text style={styles.breadcrumb}>/</Text>
              <Text style={styles.breadcrumb}>{TranslateMessage('Admin.Delivery.App.DriverManagement.Heading')}</Text>
              <Text style={styles.breadcrumb}>/</Text>
              <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
                {TranslateMessage('Admin.Delivery.App.Preview')}
              </Text>
            </View>
          </View>
          <Divider style={[layout.DividerSperator, { marginBottom: 30 }]} />

          {/* Actions row */}
          <View style={[layout.flexDirectionRow, layout.justifyBetween, layout.alignItemCenter, layout.marBottom20]}>
            <Typography color={theme.colors.textNeutral}>
              {TranslateMessage('Admin.Delivery.App.ReviewDriversBeforeUpload')} ({previewListingState.data.total}{' '}
              {TranslateMessage('Admin.Delivery.App.Drivers')})
            </Typography>
            <View style={[layout.flexDirectionRow, { gap: 12 }]}>
              <Pressable
                style={[button.btnBase, button.btnOutlineDefault, button.btnMd]}
                onPress={handleCancel}
                disabled={fileUploadState.loading}
              >
                <Typography variant="body" color={theme.colors.textBody} fontWeight="semiBold">
                  {TranslateMessage('Admin.Delivery.App.Cancel')}
                </Typography>
              </Pressable>
              <Pressable
                style={[
                  button.btnBase,
                  button.btnSuccess,
                  button.btnMd,
                  fileUploadState.loading && { opacity: 0.5 },
                ]}
                onPress={handleSubmit}
                disabled={fileUploadState.loading}
              >
                <Typography variant="body" color={theme.colors.textInverse} fontWeight="semiBold">
                  {TranslateMessage('Admin.Delivery.App.SubmitDrivers')}
                </Typography>
              </Pressable>
            </View>
          </View>

          {/* Table */}
          <View style={[layout.cardBox, layout.tableContainer]}>
            <View style={tablestyle.container}>
              <View style={{ flex: 1 }}>
                <ScrollView horizontal style={layout.flexCol} contentContainerStyle={{ flex: 1 }}>
                  {previewListingState.error ? (
                    <View style={[layout.flexCol, layout.alignItemCenter, layout.justifyCenter, { padding: 20 }]}>
                      <Text style={[formStyle.errorMessage, { textAlign: 'center' }]}>
                        {previewListingState.error}
                      </Text>
                    </View>
                  ) : previewListingState.data.data.length > 0 ? (
                    <View style={tablestyle.tableScrollWidth}>
                      <DriverUploadPreviewTable
                        data={previewListingState.data.data as unknown as IPreviewDriverRow[]}
                        page={page}
                        total={previewListingState.data.total}
                        onPageChange={handlePageChange}
                      />
                    </View>
                  ) : (
                    <Text style={[formStyle.labelTitle, formStyle.noRetroLabel]}>
                      {TranslateMessage('Admin.Delivery.App.Driver.No.Data.Found')}
                    </Text>
                  )}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
        type={snackbar.isError ? SnackbarType.ERROR : SnackbarType.SUCCESS}
      />
    </>
  );
};

export default DriverUploadPreview;
