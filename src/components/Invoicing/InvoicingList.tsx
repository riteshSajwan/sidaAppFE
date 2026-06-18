import { useIsFocused } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { openPdfDocument } from 'src/common/components/FilesViewer/FilesViewerUtil';
import { Loader } from 'src/common/components/Loader/Loader';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchInvoiceListingAction, resendInvoiceAction, settleInvoiceListingAction } from 'src/common/service/invoicing/action';
import { resetInvoiceListing, setInvoiceSnackbar } from 'src/common/service/invoicing/slice';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import {
  generateInitialFilterData,
  getInvoiceFileName,
  IInvoice,
  IInvoiceListFilter,
  invoiceStatusOptions,
  InvoiceStatusType,
  normalizeInvoiceUrl,
} from 'src/components/Invoicing/InvoicingListUtil';
import InvoicingListTable from 'src/components/Invoicing/Table/InvoicingListTable';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
import { useTenantId } from 'src/common/hooks/useTenantId';
import { MenuType } from 'src/common/utils/permissionUtils';
import { usePermission } from 'src/common/hooks/usePermission';

const InvoicingList = ({ isDashboard }: IDashboardProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const DashboardStyle = useDashboardStyle();
  const focus = useIsFocused();
  const { theme } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<IInvoiceListFilter>({
    ...generateInitialFilterData(),
  });
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [isResendRequested, setIsResendRequested] = useState<boolean>(false);
  const { data, loading, settleLoading, resendLoading, error, snackbarVisible, snackbarMessage } = useSelector((state: RootState) => state.invoicing.invoiceListing);
  const {tenantId}=useTenantId();
  const { isProductAdmin } = usePermission(MenuType.INVOICING);
  
  const debouncedSearchRef = useRef(
    debounce((nextSearchKey: string) => {
      setPage(0);
      setSelectedInvoiceIds([]);
      setFilter((previousFilter) => ({
        ...previousFilter,
        searchKey: nextSearchKey,
      }));
    }, DEBOUNCE_TIME)
  );
  const debouncedSearch = debouncedSearchRef.current;

  useEffect(() => {
    if (!focus) {
      return;
    }

    dispatch(fetchInvoiceListingAction(filter, page, DEFAULT_TABLE_SIZE));
  }, [dispatch, filter, focus, page]);

  useEffect(() => {
    setSelectedInvoiceIds([]);
  }, [data.page, filter.status]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      dispatch(resetInvoiceListing());
    };
  }, [debouncedSearch, dispatch]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleStatusTabPress = (status: string) => {
    setPage(0);
    setSelectedInvoiceIds([]);
    setFilter((previousFilter) => ({
      ...previousFilter,
      status,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSelectedInvoiceIds([]);
    setPage(newPage);
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoiceIds((previousIds) =>
      previousIds.includes(invoiceId)
        ? previousIds.filter((id) => id !== invoiceId)
        : [...previousIds, invoiceId]
    );
  };

  const handleSettleSelected = () => {
    if (!selectedInvoiceIds.length) {
      return;
    }

    dispatch(settleInvoiceListingAction(selectedInvoiceIds)).then((isSuccess) => {
      if (!isSuccess) {
        return;
      }

      setSelectedInvoiceIds([]);
      dispatch(fetchInvoiceListingAction(filter, page, DEFAULT_TABLE_SIZE));
    });
  };

  const handleDismiss = () => {
    dispatch(setInvoiceSnackbar(false));
  };

  const reset = () => {
    const initialFilter = generateInitialFilterData();
    debouncedSearch.cancel();
    setPage(0);
    setSearchValue('');
    setSelectedInvoiceIds([]);
    setFilter({ ...initialFilter });
  };

  const handleDownloadPress = (invoice: IInvoice) => () => {
    const invoiceUrl = normalizeInvoiceUrl(invoice.invoiceUrl);
    const fileName = getInvoiceFileName(invoice.invoiceUrl) || `${invoice.invoiceId}.csv`;

    openPdfDocument(invoiceUrl, fileName,tenantId);
  };

  const handleResendPress = (invoice: IInvoice) => () => {
    setIsResendRequested(true);
    dispatch(resendInvoiceAction(invoice.invoiceId));
  };

  useEffect(() => {
    if (!isResendRequested || resendLoading) {
      return;
    }

    setIsResendRequested(false);
  }, [isResendRequested, resendLoading]);

  const showSettleAction = filter.status === InvoiceStatusType.REPORT_GENERATED;

  function renderFilters() {
    return (
      <View style={[styles.filterContainer, layout.containerPadding]}>
        {/* <View style={styles.searchFilterContainer}>
          <Searchbar
            placeholder={TranslateMessage('Admin.Delivery.App.SearchLabel')}
            placeholderTextColor={theme.colors.textNeutral}
            iconColor={theme.colors.iconBase}
            mode='bar'
            value={searchValue}
            onChangeText={handleSearch}
            inputStyle={styles.searchbarInput}
            style={styles.searchbar}
            rippleColor='transparent'
          />
          </View> */}
        <View
          style={[
            layout.mb10,
            layout.flexDirectionRow,
            layout.alignItemCenter,
            { width: '100%' }
          ]}
        >
          <View style={[DashboardStyle.tabFlexRow, layout.flexWrap, { gap: 8, flex: 1 }]}>
            {invoiceStatusOptions().map((status) => (
              <Pressable key={status.value} onPress={() => handleStatusTabPress(status.value)}>
                <Text
                  style={[
                    DashboardStyle.segmentedButton,
                    filter.status === status.value && DashboardStyle.activeTab,
                  ]}
                >
                  {status.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              { marginLeft: 'auto', gap: theme.spacing.sm, justifyContent: 'flex-end' },

            ]}
          >
            {showSettleAction && isProductAdmin ? (
              <Pressable
                onPress={handleSettleSelected}
                disabled={!selectedInvoiceIds.length || settleLoading || resendLoading}
              >
                <Text
                  style={[
                    button.btn,
                    button.btnOutlineDefault,
                    (!selectedInvoiceIds.length || settleLoading || resendLoading) && { opacity: 0.5 },
                  ]}
                >
                  {settleLoading
                    ? TranslateMessage('Admin.Delivery.App.InvoiceSettle.Loading')
                    : TranslateMessage('Admin.Delivery.App.InvoiceSettle.Selected', {
                        count: selectedInvoiceIds.length,
                      })}
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              style={[button.btnfilter, button.btnOutlineDefault]}
              onPress={reset}
            >
              <Icon name='refresh' size={20} color={theme.colors.iconBase} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  function renderHeading() {
    return (
      <>
        <View
          style={[
            layout.container,
            styles.headerContainer,
            layout.paddingTop26,
          ]}
        >
          <Typography variant='subHeading'>
            {TranslateMessage('Admin.Delivery.App.InvoiceManagement.Heading')}
          </Typography>
          <View style={styles.breadcrumbContainer}>
            <Text style={styles.breadcrumb}>{TranslateMessage('Admin.Delivery.App.Home')}</Text>
            <Text style={styles.breadcrumb}>/</Text>
            <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
              {TranslateMessage('Admin.Delivery.App.InvoiceManagement.Heading')}
            </Text>
          </View>
        </View>
        <Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.xxl }]} />
      </>
    );
  }

  return (
    <>
      <Loader loading={loading || settleLoading || resendLoading} />
      <ScrollView>
        <View style={[layout.containerPadding, isDashboard && { paddingHorizontal: 0 }]}> 
          {!isDashboard ? renderHeading() : null}
          {!isDashboard ? renderFilters() : null}
          <View style={[layout.cardBox, layout.tableContainer, isDashboard && { marginBottom: 0, paddingVertical: 0 }]}> 
            <View style={[tablestyle.container]}>
              <View style={{ flex: 1 }}>
                <ScrollView
                  horizontal
                  style={layout.flexCol}
                  contentContainerStyle={{ flex: 1 }}
                >
                  {!loading ? (
                    data && data.data.length > 0 ? (
                      <InvoicingListTable
                        invoiceListData={data}
                        page={page}
                        currentStatus={filter.status}
                        selectedInvoiceIds={selectedInvoiceIds}
                        handlePageChange={handlePageChange}
                        handleDownloadPress={handleDownloadPress}
                        handleResendPress={handleResendPress}
                        handleSelectInvoice={handleSelectInvoice}
                        error={error ?? ''}
                      />
                    ) : (
                      <Text style={[formStyle.labelTitle, formStyle.noRetroLabel]}>
                        {TranslateMessage('Admin.Delivery.App.Driver.No.Data.Found')}
                      </Text>
                    )
                  ) : null}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomSnackbar
        visible={snackbarVisible}
        message={snackbarMessage || TranslateMessage('Admin.Delivery.App.InvoiceSettle.Success')}
        onDismiss={handleDismiss}
        type={SnackbarType.SUCCESS}
      />
    </>
  );
};

export default InvoicingList;
