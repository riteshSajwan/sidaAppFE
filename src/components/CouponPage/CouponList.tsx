import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import FilterModal from 'src/common/components/FilterModal/FilterModal';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { fetchCouponListingAction, updateCouponStatusAction } from 'src/common/service/coupon/action';
import { resetCouponListing, setCouponSnackbar } from 'src/common/service/coupon/slice';
import { MenuType } from 'src/common/utils/permissionUtils';
import { DateType, IMinuteOption } from 'src/components/Business/BusinessListUtils';
import { couponStatusOptions, generateInitialFilterData, generateInitialTempFilterData, ICouponListFilter, ICouponListTempFilter } from 'src/components/CouponPage/CouponListUtil';
import CouponListTable from 'src/components/CouponPage/Table/CouponListTable';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';


const CouponList = ({ isDashboard }: IDashboardProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const { canEdit } = usePermission(MenuType.COUPON);

  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<ICouponListFilter>({
    ...generateInitialFilterData(),
  });
  const [tempFilter, setTempFilter] = useState<ICouponListTempFilter>({
    ...generateInitialTempFilterData(),
  });
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () => { setVisible(true), setTempFilter({ ...tempFilter, isActive: filter.isActive }) };
  const hideModal = () => setVisible(false);
  const focus = useIsFocused();
  const { theme } = useAppTheme();
  const {data,loading,error,snackbarVisible} = useSelector((state: RootState) => state.coupon.couponListing);
  const dispatch = useDispatch<AppDispatch>();
  const debouncedSearch = useCallback(
    debounce((searchKey:string) => {
      setFilter({ ...filter, searchKey });
    }, DEBOUNCE_TIME),
    []
  );
  useEffect(() => {
    if (focus)
      fetchRequestList(true);
    return(()=>{
      dispatch(resetCouponListing())
    })
  }, [filter, focus]);


  useEffect(() => {
    if (focus) {
      fetchRequestList(false);
    } else {
      reset();
    }
  }, [page, focus]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);


  const handleSearch = (searchKey: string) => {
    setTempFilter({ ...tempFilter, searchKey });
    debouncedSearch(searchKey);
    setTempFilter({
      ...tempFilter,
      searchKey,
      createdAt: null
    });
  };
  const handleDismiss = () => {
    dispatch(setCouponSnackbar(false));
  };

  const handleSort = (sortField: string) => {
    const sortOrder =
      sortField === filter.sortField
        ? filter.sortOrder === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc';
    setFilter({ ...filter, sortField, sortOrder });
  };

  const isFilterSet = useMemo(() => {
    return Boolean(filter.isActive || filter.createdAt);
  }, [filter.status, filter.createdAt, filter.isActive]);

  const onChangeDropdown = (item: IMinuteOption) => {
    setTempFilter({ ...tempFilter, isActive: item.value });
  };

  const onFilterChange = (value: string, fieldName: string) => () => {
    setFilter({ ...filter, [fieldName]: value });
  };

  const onChangeExpireDate = (createdAt: DateType) => {
    setTempFilter({ ...tempFilter, createdAt });
  };;

  const fetchRequestList = async (isFilterChanged: boolean) => {
    const newPage = isFilterChanged ? 0 : page;
    dispatch(fetchCouponListingAction(filter,newPage,DEFAULT_TABLE_SIZE)
    );
  
    if (isFilterChanged) {
      setPage(0);
    }
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
  const handleEditPress = (id: number) => () => {
    router.push(`${Routes.COUPON}/${id}`);
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleAddNewPress = () => {
    router.push(`${Routes.COUPON}${Routes.ADD}`);
  };
  const reset = () => {
    setFilter({ ...generateInitialFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setPage(0);
  };

  const handleViewDetailsPress = (id: string) => () => {
    router.push(`${Routes.COUPON}/${id}`);
  }

  function renderFilters() {
    return (
      <View style={[styles.filterContainer, layout.containerPadding]}>
        {/* <Text style={[layout.accordionTitle, layout.fs20]}> {TranslateMessage(
          'Admin.Delivery.App.Coupon.List'
        )}</Text> */}
        <View style={styles.searchFilterContainer}>
          <Searchbar
            placeholder={TranslateMessage(
              'Admin.Delivery.App.SearchLabel'
            )}
            placeholderTextColor={theme.colors.textNeutral}
            iconColor={theme.colors.iconBase}
            mode='bar'
            value={tempFilter.searchKey}
            onChangeText={handleSearch}
            inputStyle={styles.searchbarInput}
            style={styles.searchbar}
            rippleColor={'transparent'}
          />
          <Pressable
            style={[
              button.btnfilter,
              button.btnOutlineDefault
            ]}
            onPress={showModal}
          >
            <Icon name='filter' size={22} color={
              isFilterSet
                ? theme.colors.iconBase
                : theme.colors.iconDisabled
            } />
          </Pressable>
          {canEdit && (
            <Pressable onPress={handleAddNewPress}>
              <Text style={[
                button.btn,
                button.btnOutlineDefault,
               ]}>
                <Icon name='addLargeLine' color={theme.colors.iconBase} size={10} spacing={5} />
                {TranslateMessage('Admin.Delivery.App.AddNewCoupon')}
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[
              button.btnfilter,
              button.btnOutlineDefault
            ]}
            onPress={reset} >
            <Icon name='refresh' size={20} color={theme.colors.iconBase} />
          </Pressable>
        </View>
      </View>
    );
  }
  function renderStatusDriver() {
    return (
      <View style={layout.containerPadding}>
        <View style={layout.flexmarginBottom}>
          <View style={layout.flexCol}>
            <View>
              <Text style={formStyle.labelTitle}>
                {TranslateMessage(
                  'Admin.Delivery.App.Coupon.Status'
                )}
              </Text>
            </View>
            <Customdropdown
              data={couponStatusOptions()}
              selectedValue={{ label: '', value: tempFilter.isActive }}
              onChange={onChangeDropdown}
              style={{ height: 37 }}
            />
          </View>
        </View>
      </View>
    );
  }

  const onActionPress = (id: number) => async (isActive: boolean) => {
    dispatch(updateCouponStatusAction(id, isActive));
  };
  function renderFilterModal() {
    return (
      <FilterModal
        visible={visible}
        hideModal={hideModal}
        title={TranslateMessage('Admin.Delivery.App.Filter')}
        onClear={onFilterCancel}
        onSave={onFilterSave}>
        <View style={layout.flexmarginBottom}>
          <View style={layout.flexCol}>
            {renderStatusDriver()}
          </View>
        </View>
      </FilterModal>
    );
  }

  function renderHeading() {
    return (
      <><View
        style={[
          layout.container,
          styles.headerContainer,
          layout.paddingTop26,
        ]}
      >
        <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.CouponManagement.Heading')}</Typography>
      </View><Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.xxl }]} /></>
    )
  }
  return (
    <>
      <Loader loading={loading} />
      <ScrollView>
        <View style={[layout.containerPadding, isDashboard && { paddingHorizontal: 0 }]}>
          {!isDashboard ? renderHeading() : null}
          {!isDashboard ? renderFilters() : null}
          <View style={[layout.cardBox, layout.tableContainer, isDashboard && { marginBottom: 0, paddingVertical: 0 }]}>
            
            <View style={[tablestyle.container]}>
              <View style={{ flex: 1 }}>
                <ScrollView
                  horizontal={true}
                  style={layout.flexCol}
                  contentContainerStyle={{ flex: 1 }}
                >
                  {!loading ? (
                    data && data.data.length > 0 ? (
                      <CouponListTable
                        couponListData={data}
                        page={page}
                        handleSort={handleSort}
                        filter={filter}
                        handlePageChange={handlePageChange}
                        handleViewDetailsPress={handleViewDetailsPress}
                        error={error??''}
                        isDashboard={isDashboard}
                        handleEditPress={handleEditPress}
                        handleTogglePress={onActionPress}
                        canEdit={canEdit}
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
        {renderFilterModal()}
      </ScrollView>
      <CustomSnackbar
        visible={snackbarVisible}
        message={TranslateMessage('Admin.Delivery.App.Snackbar.DataSaved')}
        onDismiss={handleDismiss}
        type={SnackbarType.SUCCESS}
      />
    </>
  );
};

export default CouponList;
