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
import { fetchBusinessListingAction, resetPlanState, toggleBusinessStatus } from 'src/common/service/business/action';
import { resetToggleSuccess } from 'src/common/service/business/slice';
import { resetCouponListing, setCouponSnackbar } from 'src/common/service/coupon/slice';
import { BusinessStatusOptions, DateType, generateInitialFilterData, generateInitialTempFilterData, IBusinessListFilter, IBusinessListTempFilter, IMinuteOption } from 'src/components/Business/BusinessListUtils';
import BuisnessListTable from 'src/components/Business/Table/BusinessListTable';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';


const BusinessList = ({ isDashboard }: IDashboardProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();

  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<IBusinessListFilter>({
    ...generateInitialFilterData(),
  });
  const [tempFilter, setTempFilter] = useState<IBusinessListTempFilter>({
    ...generateInitialTempFilterData(),
  });
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () => { setVisible(true), setTempFilter({ ...tempFilter, active: filter.active }) };
  const hideModal = () => setVisible(false);
  const focus = useIsFocused();
  const { theme } = useAppTheme();
  const {data,loading,error,snackbarVisible,toggleSuccess} = useSelector((state: RootState) => state.business.businessListing);
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

  useEffect(() => {
    if (toggleSuccess) {
      fetchRequestList(false);
      dispatch(resetToggleSuccess());
    }
  }, [toggleSuccess]);


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
    return Boolean(filter.active || filter.createdAt);
  }, [filter.status, filter.createdAt, filter.active]);

  const onChangeDropdown = (item: IMinuteOption) => {
    setTempFilter({ ...tempFilter, active: item.value });
  };

  const onFilterChange = (value: string, fieldName: string) => () => {
    setFilter({ ...filter, [fieldName]: value });
  };

  const onChangeExpireDate = (createdAt: DateType) => {
    setTempFilter({ ...tempFilter, createdAt });
  };;

  const fetchRequestList = async (isFilterChanged: boolean) => {
    const newPage = isFilterChanged ? 0 : page;
    dispatch(fetchBusinessListingAction(filter,newPage,DEFAULT_TABLE_SIZE)
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
  const handleEditPress = (activePlanId: number) => () => {
    router.push(`${Routes.BUSINESS}${Routes.PLANS}/${activePlanId}`);
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleAddNewPress = () => {
    dispatch(resetPlanState());
    router.push(`${Routes.BUSINESS}${Routes.PLANS}`);
  };
  const reset = () => {
    setFilter({ ...generateInitialFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setPage(0);
  };

  const handleViewDetailsPress = (id: string) => () => {
    router.push(`${Routes.BUSINESS}/${id}`);
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
          {/* <Pressable
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
          </Pressable> */}
          <Pressable onPress={handleAddNewPress}>
            <Text style={[
              button.btn,
              button.btnOutlineDefault,
              {
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 0,
                height: 42,
                lineHeight: 40

              }]}>
              <Icon name='addLargeLine' color={theme.colors.iconBase} size={10} spacing={5} />
              {TranslateMessage('Admin.Delivery.App.AddNewBusiness')}
            </Text>
          </Pressable>

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
              data={BusinessStatusOptions()}
              selectedValue={{ label: '', value: tempFilter.active }}
              onChange={onChangeDropdown}
              style={{ height: 37 }}
            />
          </View>
        </View>
      </View>
    );
  }

  const onActionPress = (id: number) => (isActive: boolean) => {
    dispatch(toggleBusinessStatus(id, isActive));
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
        <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.BusinessManagement.Heading')}</Typography>
        <View style={styles.breadcrumbContainer}>
          <Text style={styles.breadcrumb}>{TranslateMessage(
            'Admin.Delivery.App.Home'
          )}</Text>
          <Text style={styles.breadcrumb}>/</Text>
          <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
            {TranslateMessage(
              'Admin.Delivery.App.Business.BusinessManager'
            )}
          </Text>
        </View>
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
                      <BuisnessListTable
                        businessListData={data}
                        page={page}
                        handleSort={handleSort}
                        filter={filter}
                        handlePageChange={handlePageChange}
                        handleViewDetailsPress={handleViewDetailsPress}
                        error={error??''}
                        isDashboard={isDashboard}
                        handleEditPress={handleEditPress}
                        handleTogglePress={onActionPress}
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

export default BusinessList;
