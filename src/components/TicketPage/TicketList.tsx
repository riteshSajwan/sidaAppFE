import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageStyle, Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import FilterModal from 'src/common/components/FilterModal/FilterModal';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { fetchTicketListingAction } from 'src/common/service/ticket/action';
import { resetTicketListing } from 'src/common/service/ticket/slice';
import { MenuType } from 'src/common/utils/permissionUtils';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { IMinuteOption } from 'src/components/Restaurant/utils/RestaurantUtil';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import TicketListTable from 'src/components/TicketPage/Table/TicketListTable';
import { IStatusType } from 'src/components/TicketPage/TicketDetailUtil';
import { generateInitialFilterData, generateInitialTempFilterData, ITicketListFilter, ITicketListTempFilter, orderStatusOptions } from 'src/components/TicketPage/TicketListUtil';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const TicketList = ({ isDashboard }: IDashboardProps) => {
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const DashboardStyle = useDashboardStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const { t: TranslateMessage } = useTranslation();
  const { canEdit } = usePermission(MenuType.TICKET);
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<ITicketListFilter>({
    ...generateInitialFilterData(),
  });
  const [searchText, setSearchText] = useState<string>('');
  const [tempFilter, setTempFilter] = useState<ITicketListTempFilter>({
    ...generateInitialTempFilterData(),
  });
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () => {setVisible(true),setTempFilter({...tempFilter,ticketStatus:filter.ticketStatus??''})};
  const hideModal = () => setVisible(false);
  const focus = useIsFocused();
  const {theme} = useAppTheme();
  const {data,loading,error} = useSelector((state: RootState) => state.ticket.ticketListing);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (focus)
      fetchRequestList(true);
    return(()=>{
      dispatch(resetTicketListing())
    })
  }, [filter, focus]);


  useEffect(() => {
    if (focus) {
      fetchRequestList(false);
    } else {
      reset();
    }
  }, [page, focus]);


  const isFilterSet = useMemo(() => {
    return Boolean(filter.ticketStatus && filter.ticketStatus !== IStatusType.ALL);
  }, [filter.ticketStatus]);


  const onChangeDropdown = (item: IMinuteOption) => {
    setTempFilter({ ...tempFilter, ticketStatus: item.value });
  };

  const onFilterChange = (value: string, fieldName: string) => () => {
    setFilter({ ...filter, [fieldName]: value });
  };

  const debouncedSearch = useCallback(
    debounce((searchKey: string) => {
      setFilter((prev) => ({ ...prev, searchKey }));
    }, DEBOUNCE_TIME),
    []
  )

   const handleSort = (sortField: string) => {
    const sortOrder =
      sortField === filter.sortField
        ? filter.sortOrder === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc';
    setFilter({ ...filter, sortField, sortOrder });
  };
  const fetchRequestList = async (isFilterChanged: boolean) => {
    const newPage = isFilterChanged ? 0 : page;
    dispatch(fetchTicketListingAction(filter,newPage,DEFAULT_TABLE_SIZE)
    );
  
    if (isFilterChanged) {
      setPage(0);
    }
  };

   useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
    }, [debouncedSearch]);

  const handleSearch = (searchKey: string) => {
    setSearchText(searchKey);
    setTempFilter({ ...tempFilter, searchKey });
    debouncedSearch(searchKey);
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

  const reset = () => {
    setFilter({ ...generateInitialFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setPage(0);
  };

  const handleViewDetailsPress = (id: string) => () => {
    router.push(`${Routes.TICKET}/${id}`);
  }

  function renderFilters() {
    return (
      <View style={[styles.filterContainer, layout.containerPadding]}>
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
                  'Admin.Delivery.App.RequestManagementList.Filter.RequestStatus'
                )}
              </Text>
            </View>
            <Customdropdown
              data={orderStatusOptions()}
              selectedValue={{ label: '', value: tempFilter.ticketStatus?? '' }}
              onChange={onChangeDropdown}
              style={{ height: 37 }}
            />
          </View>
        </View>
      </View>
    );
  }

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
        <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.TicketManagement.Heading')}</Typography>
      </View>
      <Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.xxl }]} /></>
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
                  data?.data?.length > 0 ? (
                      <TicketListTable
                        ticketListData={data}
                        page={page}
                        handleSort={handleSort}
                        // filter={filter}
                        handlePageChange={handlePageChange}
                        handleViewDetailsPress={handleViewDetailsPress}
                        canEdit={canEdit}
                        error={error??''}
                        isDashboard={isDashboard}
                      />
                    ) : isDashboard ? (
                      <Image
                        source={require('src/common/assets/images/requestmanage.png')}
                        resizeMode='contain'
                        style={[DashboardStyle.imageGraph as ImageStyle]}
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
    </>
  );
};

export default TicketList;
