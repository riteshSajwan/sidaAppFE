import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, Icon, Modal, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import { useUserStyle } from 'src/common/assets/styles/user';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomDatePicker from 'src/common/components/CustomDatePicker/CustomDatePicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import useCurrencyFormatter from 'src/common/hook/useCurrencyFormator';
import { fetchDriverTotalEarningAction, fetchDriverWalletListingAction } from 'src/common/service/driver/action';
import { resetDriverTotalEarning, resetDriverWalletListing } from 'src/common/service/driver/slice';
import DriverWalletListTable from 'src/components/DriverDetailPage/DriverWallet/Table/DriverWalletListTable';
import { WalletTransactionStatus } from 'src/components/DriverDetailPage/DriverWallet/Table/DriverWalletListTableUtil';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { IMinuteOption } from 'src/components/Restaurant/utils/RestaurantUtil';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { generateInitialFilterData, generateInitialTempFilterData, IWalletListFilter, IWalletListTempFilter } from 'src/components/DriverDetailPage/DriverWallet/DriverWalletListUtil';


const DriverWalletList = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const userStyle = useUserStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const timing = useTimingStyle();
  const {theme} = useAppTheme();

  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<IWalletListFilter>({
    ...generateInitialFilterData(),
  });
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tempFilter, setTempFilter] = useState<IWalletListTempFilter>({
    ...generateInitialTempFilterData(),
  });
  const currencyFormate = useCurrencyFormatter();
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const focus = useIsFocused();
  const {userTransactionDto:walletListData, loading,error} = useSelector((state: RootState) => state.driver.driverWalletListing);
  const {data:totalWalletBalance,loading: totalWalletBalanceLoading} = useSelector((state: RootState) => state.driver.driverTotalEarning);
  const dispatch = useDispatch<AppDispatch>();
  const debouncedSearch = useCallback(
    debounce((searchKey:string) => {
      setFilter({ ...filter, searchKey });
    }, DEBOUNCE_TIME),
    []
  );
    const fetchRequestList = async (isFilterChanged: boolean) => {
      const newPage = isFilterChanged ? 0 : page;
      dispatch(fetchDriverWalletListingAction(id,filter,newPage,DEFAULT_TABLE_SIZE)
      );
      if (isFilterChanged) {
        setPage(0);
      }
    };
  useEffect(() => {
    if (focus) {
      fetchRequestList(true);
      fetchTotalWalletBalance();
    }
    return(()=>{
      resetDriverTotalEarning();
      resetDriverWalletListing();
    })
  }, [filter, focus]);


  useEffect(() => {
    if (focus) {
      fetchRequestList(false);
    }
  }, [page, focus]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const fetchTotalWalletBalance = async () => {
    dispatch(fetchDriverTotalEarningAction(id))
  };

  const handleSort = (sortField: string) => {
    const sortOrder =
      sortField === filter.sortField
        ? filter.sortOrder === 'desc'
          ? 'asc'
          : 'desc'
        : 'desc';
    setFilter({ ...filter, sortField, sortOrder });
  };

  const isFilterSet = useMemo(() => {
    return Boolean(filter.approvalRequestStatus || filter.createdAt);
  }, [filter.approvalRequestStatus, filter.createdAt]);

   const onChangeDropdown = (item: IMinuteOption) => {
     setTempFilter({ ...tempFilter, status: item.value });
     setFilter({ ...filter, status: item.value });
   };

  const onChangeExpireDate = (createdAt: DateType) => {
    setTempFilter({ ...tempFilter, createdAt });
  };


  const onFilterSave = () => {
    setFilter({ ...filter, ...tempFilter });
    hideModal();
  };

  const onFilterCancel = () => {
    setFilter({ ...filter, ...generateInitialTempFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    hideModal();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewDetailsPress = (id: string) => () => {
    router.push(`${Routes.CUSTOMER}${Routes.CUSTOMERDETAILS}/${id}`);
  }

  function renderFilters() {
    return (
      <View style={styles.filterContainer}>
        <View style={styles.flexDirectionRow}>
          <Text style={[layout.accordionTitle, {fontSize:20}]}>
          {TranslateMessage('Admin.Delivery.App.Dashboard.TotalWalletBalance')}: 
          </Text>
          <Text style={[layout.accordionTitle, styles.balance]}>
            {currencyFormate( totalWalletBalance?.amount ?? 0 , totalWalletBalance?.currency ?? '')}
          </Text>
        </View>
        <View style={[styles.searchFilterContainer,]}>   
        <Customdropdown
            data={WalletTransactionStatus()}
            selectedValue={{ label: '', value: filter.status }}
            onChange={onChangeDropdown}
            style={styles.dropDown}
          />
        </View>
      </View>
    );
  }

  function renderFilterModal() {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={userStyle.modalContainer}
        >
          <View style={userStyle.modalHeader}>
            <Text style={userStyle.modalTitle}>
              {TranslateMessage(
                'Admin.Delivery.App.RequestManagementList.Filter'
              )}
            </Text>
            <Pressable style={userStyle.closeButton} onPress={hideModal}>
              <Icon source='close' size={30} color={'#000000'}></Icon>
            </Pressable>
          </View>
          <View style={layout.containerPadding}>
            <View style={layout.flexmarginBottom}>
              <View style={layout.flexCol}>
                <View>
                  <Text style={formStyle.labelTitle}>
                    {TranslateMessage(
                      'Admin.Delivery.App.RequestManagementList.Table.Status'
                    )}
                  </Text>
                </View>
                <Customdropdown
                  data={WalletTransactionStatus()}
                  selectedValue={{ label: '', value: tempFilter.status }}
                  onChange={onChangeDropdown}
                  style={{ height: 37 }}
                />

                
              </View>
              <View style={layout.flexCol}>
                <View>
                  <Text style={[formStyle.labelTitle, { marginBottom: 20 }]}>
                    {TranslateMessage(
                      'Admin.Delivery.App.UserManagementList.Filter.Registration.Date'
                    )}
                  </Text>
                </View>
                <CustomDatePicker
                  value={tempFilter.createdAt as DateType}
                  onChange={onChangeExpireDate}
                  label='Date'
                  mode='outlined'
                  presentationStyle='overFullScreen'
                  inputMode='start'
                  activeOutlineColor={theme.colors.borderErrorInverse}
                  outlineColor='#EBEBEB'
                />
              </View>
            </View>
          </View>
          <View
            style={[
              formStyle.formRow,
              { justifyContent: 'center' },
              layout.paddingTop26,
            ]}>
            <View style={[formStyle.formBtnRow, layout.alignRight]}>
              <View>
                <Pressable onPress={onFilterCancel}>
                  <Text
                    style={[
                      button.btn,
                      button.btnOutlineDanger,
                      { minWidth: 250 },
                    ]}
                  >
                    {TranslateMessage('Admin.Delivery.App.ClearBtnTitle')}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={[formStyle.formBtnRow, layout.alignRight]}>
              <View>
                <Pressable onPress={onFilterSave}>
                  <Text
                    style={[button.btn, button.btnPrimary]}
                  >
                    {TranslateMessage('Admin.Delivery.App.SaveBtnTitle')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    );
  }

  return (
    <>
      <Loader loading={loading || totalWalletBalanceLoading} />
      <ScrollView>
        <View style={layout.containerPadding}>
          <View
            style={[
              layout.container,
              styles.headerContainer,
              layout.paddingTop26,
            ]}
          >
            <View style={styles.filterrow}>
            {/* <Pressable>
              <IconButton
                icon='chevron-left'
                style={button.btnfilter}
                size={40}
                iconColor={theme.colors.iconBase}
                onPress={() => router.push(Routes.DRIVER)}
              />
            </Pressable> */}
              <Text style={[layout.Adminh1Title]}>
                {TranslateMessage('Admin.Delivery.App.Driver.Wallet')}
              </Text>
            </View>
          </View>
          <Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.md }]} />
          {renderFilters()}
          <View style={[layout.cardBox, { paddingBottom: 0 }]}>
            
            <View style={[tablestyle.container]}>
              <View style={{ flex: 1 }}>
                <ScrollView
                  horizontal={true}
                  style={layout.flexCol}
                  contentContainerStyle={layout.flexCol}
                >
                  {
                    !loading ? (
                      walletListData.total > 0 ? (
                        <DriverWalletListTable
                          walletListData={walletListData}
                          page={page}
                          handleSort={handleSort}
                          handlePageChange={handlePageChange}
                          handleViewDetailsPress={handleViewDetailsPress}
                          error={error??''}
                        />)
                        :
                        (
                          <Text style={[formStyle.labelTitle, formStyle.noRetroLabel]}>
                            {TranslateMessage('Admin.Delivery.App.Driver.No.Transaction.Available')}
                          </Text>
                        )
                    )
                      : null
                  }
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
        {renderFilterModal()}
      </ScrollView>
    </>
  );
};

export default DriverWalletList;
