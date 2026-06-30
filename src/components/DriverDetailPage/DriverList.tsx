import { useIsFocused } from '@react-navigation/native';
import { router, useFocusEffect } from 'expo-router';
import { debounce } from 'lodash';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    ImageStyle,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import FilterModal from 'src/common/components/FilterModal/FilterModal';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { fetchAllActiveCountriesAction } from 'src/common/service/country/action';
import { fetchDriverListingAction, uploadDriverFilePreviewAction } from 'src/common/service/driver/action';
import { resetDriverFileUpload, resetDriverListing } from 'src/common/service/driver/slice';
import { resetOnboardingStepAction } from 'src/common/service/onboarding/action';
import { MenuType } from 'src/common/utils/permissionUtils';
import { customerStatus } from 'src/components/CustomerDetailPage/Table/CustomerListTableUtil';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import {
    generateInitialFilterData,
    generateInitialTempFilterData,
    IDriverListFilter,
    IDriverListTempFilter,
} from 'src/components/DriverDetailPage/DriverListUtil';
import DriverListTable from 'src/components/DriverDetailPage/Table/DriverListTable';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';

import { IBlobType, IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import CustomDocumentWrapper from 'src/common/components/CustomDocumentWrapper/CustomDocumentWrapper';
import CustomModal from 'src/common/components/CustomModal/CustomModal';
import { IAddressSelected, IMinuteOption } from 'src/components/Business/add/addBusinessUtils';
import { DateType } from 'src/components/Business/BusinessListUtils';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const DriverList = ({ isDashboard }: IDashboardProps) => {
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const { theme } = useAppTheme();
  const { canEdit } = usePermission(MenuType.DRIVER);
  const [limitModalVisible, setLimitModalVisible] = useState<boolean>(false);
  const {exceeded: limitExceeded} = useSelector((state: RootState) => state.driver.onboardingLimit);
  const hideLimitModal = () => setLimitModalVisible(false);
  const [showFileModal, setShowFileModal] = useState<boolean>(false);
  const [uploadFilesData, setUploadFilesData] = useState<IFilesData[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarIsError, setSnackbarIsError] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const fileUploadState = useSelector((state: RootState) => state.driver.driverFileUpload);
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<IDriverListFilter>({
    ...generateInitialFilterData(),
  });
  const [tempFilter, setTempFilter] = useState<IDriverListTempFilter>({
    ...generateInitialTempFilterData(),
  });
  const [selectedValue, setSelectedValue] = useState<IAddressSelected>({
    country: { label: '', value: '' },
  });
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () => {
    (setVisible(true),
      setTempFilter({
        ...tempFilter,
        isBlockedFilter: filter.isBlockedFilter,
        createdAt: filter.createdAt,
        paymentMethod: filter.paymentMethod,
        country: filter.country,
      }));
  };
  const hideModal = () => setVisible(false);
  const focus = useIsFocused();
  const [paymentMethod, setPaymentMethod] = useState<IMinuteOption[]>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.driver.driverListing,
  );
  const { list: countries } = useSelector(
    (state: RootState) => state.country.activeCountryListing,
  );
  const isInitialMount = useRef(true);
  const dispatch = useDispatch<AppDispatch>();
  const debouncedSearch = useCallback(
    debounce((searchKey: string) => {
      setFilter({ ...filter, searchKey });
    }, DEBOUNCE_TIME),
    [],
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    fetchRequestList(false);
  }, [page]);

  useFocusEffect(
    useCallback(() => {
      if (!focus) {
        reset();
        return;
      }
      fetchRequestList(true);
      // dispatch(checkOnboardingLimitAction());
      return () => {
        dispatch(resetDriverListing());
      };
    }, [focus, filter]),
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (fileUploadState.success) {
      setSnackbarMessage(TranslateMessage('Admin.Delivery.App.DriversUploadedSuccessfully'));
      setSnackbarIsError(false);
      setSnackbarVisible(true);
      setShowFileModal(false);
      setUploadFilesData([]);
      dispatch(resetDriverFileUpload());
      fetchRequestList(false);
    }

    if (fileUploadState.error) {
      setShowFileModal(false);
      setSnackbarMessage(TranslateMessage('Admin.Delivery.App.FailedToFetchPreviewDrivers'));
      setSnackbarIsError(true);
      setSnackbarVisible(true);
    }
  }, [fileUploadState.success, fileUploadState.error]);

  const handleSearch = (searchKey: string) => {
    setTempFilter({ ...tempFilter, searchKey });
    debouncedSearch(searchKey);
    setTempFilter({
      ...tempFilter,
      searchKey,
      isBlockedFilter: '',
      createdAt: null,
    });
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
    return Boolean(
      filter.isBlockedFilter ||
      filter.createdAt ||
      filter.paymentMethod ||
      filter.country,
    );
  }, [
    filter.isBlockedFilter,
    filter.createdAt,
    filter.paymentMethod || filter.country,
  ]);

  const onChangeDropdown = (item: IMinuteOption) => {
    setTempFilter({ ...tempFilter, isBlockedFilter: item.value });
  };

  const onFilterChange = (value: string, fieldName: string) => () => {
    setFilter({ ...filter, [fieldName]: value });
  };

  const onChangeExpireDate = (createdAt: DateType) => {
    setTempFilter({ ...tempFilter, createdAt });
  };

  useEffect(() => {
    if (focus) {
      dispatch(fetchAllActiveCountriesAction());
    }
  }, [focus]);

  const fetchRequestList = async (isFilterChanged: boolean) => {
    const newPage = isFilterChanged ? 0 : page;

    dispatch(fetchDriverListingAction(filter, newPage, DEFAULT_TABLE_SIZE));

    if (isFilterChanged) {
      setPage(0);
    }
  };

  const onFilterSave = () => {
    setFilter((prevState) => ({
      ...prevState,
      country: selectedValue.country.value,
      paymentMethod: tempFilter.paymentMethod,
    }));
    setPage(0);
    hideModal();
  };

  const onFilterCancel = () => {
    setFilter({ ...filter, ...generateInitialTempFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setSelectedValue({
      country: { label: '', value: '' },
    });
    hideModal();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const reset = () => {
    setFilter({ ...generateInitialFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setPage(0);
    setSelectedValue({
      country: { label: '', value: '' },
    });
  };

  const handleViewDetailsPress = (id: string) => () => {
    router.push(`${Routes.DRIVER}${Routes.DRIVERDETAILS}/${id}`);
  };

  const handleAddDriver = () => {
    if (limitExceeded) {
      setLimitModalVisible(true);
      return;
    }
    dispatch(resetOnboardingStepAction());
    router.push(`${Routes.DRIVER}${Routes.ONBOARDING}${Routes.NEW}`);
  };

  const handleFileSelect = (blobs: IBlobType, result: IFilesData[]) => {
    setUploadFilesData(result);
  };

  const handleRemoveFile = (index: number) => {
    setUploadFilesData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadPreview = () => {
    if (!uploadFilesData.length || !uploadFilesData[0].blob) {
      setSnackbarMessage(TranslateMessage('Admin.Delivery.App.NoFileToUpload'));
      setSnackbarIsError(true);
      setSnackbarVisible(true);
      return;
    }
    const fileData = uploadFilesData[0];

    dispatch(uploadDriverFilePreviewAction(fileData, 0, DEFAULT_TABLE_SIZE))
      .then(() => {
        setShowFileModal(false);
        setUploadFilesData([]);
        router.push(`${Routes.DRIVER}${Routes.DRIVER_UPLOAD_PREVIEW}`);
      })
      .catch(() => {
        setShowFileModal(false);
        setSnackbarMessage(TranslateMessage('Admin.Delivery.App.FailedToFetchPreviewDrivers'));
        setSnackbarIsError(true);
        setSnackbarVisible(true);
      });
  };

  const handleCloseFileModal = () => {
    setShowFileModal(false);
    setUploadFilesData([]);
    dispatch(resetDriverFileUpload());
  };
  const handleUploadDriverFile = () => {
    if (limitExceeded) {
      setLimitModalVisible(true);
      return;
    }
    setShowFileModal(true);
  }
  function renderFilters() {
    return (
      <View style={[styles.filterContainer, layout.containerPadding]}>
        <Typography variant="subTitle">
          {TranslateMessage('Admin.Delivery.App.Driver.List')}
        </Typography>
        <View style={styles.searchFilterContainer}>
          <Searchbar
            placeholder={TranslateMessage('Admin.Delivery.App.SearchLabel')}
            placeholderTextColor={theme.colors.textNeutral}
            iconColor={theme.colors.iconBase}
            mode="bar"
            value={tempFilter.searchKey}
            onChangeText={handleSearch}
            inputStyle={styles.searchbarInput}
            style={styles.searchbar}
            rippleColor={'transparent'}
          />
          <Pressable
            style={[button.btnfilter, button.btnOutlineDefault]}
            onPress={showModal}
          >
            <Icon
              name="filter"
              size={22}
              color={
                isFilterSet ? theme.colors.iconBase : theme.colors.iconDisabled
              }
            />
            {/* <Icon name='filter' size={22} color={
              isFilterSet
                ? theme.colors.iconBase
                : theme.colors.iconDisabled
            } /> */}
          </Pressable>

          <Pressable
            style={[button.btnfilter, button.btnOutlineDefault]}
            onPress={reset}
          >
            <Icon name="refresh" size={20} color={theme.colors.iconBase} />
            {/* <Icon name='refresh' size={20} color={theme.colors.iconBase} /> */}
          </Pressable>
        </View>
        {canEdit && (
          <View>
            <Pressable onPress={handleAddDriver}>
              <Text style={[button.btnBase, button.btnPrimary]}>
                {TranslateMessage('Admin.Delivery.Add.Driver')}
              </Text>
            </Pressable>
          </View>
        )}
        {/* {canEdit && (
          <View>
            <Pressable onPress={handleUploadDriverFile}>
              <Text style={[button.btnBase, button.btnOutlineDefault]}>
                {TranslateMessage('Admin.Delivery.App.UploadDrivers')}
              </Text>
            </Pressable>
          </View>
        )} */}
      </View>
    );
  }
  const onChangePaymentDropdown = (item: IMinuteOption) => {
    setTempFilter({ ...tempFilter, paymentMethod: item.value });
  };
  function renderPaymentMethod() {
    return (
      <View style={layout.containerPadding}>
        <View style={layout.flexCol}>
          <View style={layout.flexmarginBottom}>
            <Text style={[formStyle.labelTitle, { marginBottom: 0 }]}>
              {' '}
              {TranslateMessage('Admin.Delivery.App.Driver.Payment.Method')}
            </Text>
          </View>
          <Customdropdown
            data={paymentMethod ?? []}
            selectedValue={{ label: '', value: tempFilter.paymentMethod ?? '' }}
            onChange={(item) => onChangePaymentDropdown(item)}
          />
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
                  'Admin.Delivery.App.RequestManagementList.Filter.RequestStatus',
                )}
              </Text>
            </View>
            <Customdropdown
              data={customerStatus()}
              selectedValue={{ label: '', value: tempFilter.isBlockedFilter }}
              onChange={onChangeDropdown}
              style={{ height: 37 }}
            />
          </View>
          <View style={layout.flexCol}>
            <View>
              <Text style={[formStyle.labelTitle, { marginBottom: 20 }]}>
                {TranslateMessage(
                  'Admin.Delivery.App.RequestManagementList.Filter.RequestCreationDate',
                )}
              </Text>
            </View>

            <CustomInputDatePicker
              date={
                tempFilter.createdAt
                  ? new Date(tempFilter.createdAt).toISOString().split('T')[0]
                  : null
              }
              onDateSelect={(dateStr) => onChangeExpireDate(new Date(dateStr))}
              maxDate={new Date().toISOString().split('T')[0]}
              placeholder={'Date (YYYY-MM-DD)'}
            />
          </View>
        </View>
      </View>
    );
  }

  const onChangeCountryDropdown = (item: IMinuteOption, name: string) => {
    setSelectedValue((prevState) => ({
      ...prevState,
      [name]: { label: item.label, value: item.value },
    }));
  };
  function renderCountries() {
    return (
      <View style={layout.containerPadding}>
        <View style={layout.flexCol}>
          <View style={layout.flexmarginBottom}>
            <Text style={[formStyle.labelTitle, { marginBottom: 0 }]}>
              {' '}
              {TranslateMessage('Admin.Delivery.App.Countrylabel')}
            </Text>
          </View>
          <Customdropdown
            data={countries}
            selectedValue={{
              label: tempFilter.country,
              value: tempFilter.country,
            }}
            onChange={(item) => onChangeCountryDropdown(item, 'country')}
          />
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
        onSave={onFilterSave}
      >
        <View style={layout.flexmarginBottom}>
          <View style={layout.flexCol}>
            {/* {renderStatusDriver()} */}
            {renderCountries()}
            {renderPaymentMethod()}
          </View>
        </View>
      </FilterModal>
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
          <View style={styles.filterrow}>
            <Text style={[layout.Adminh1Title, layout.serviceTopHeader]}>
              {TranslateMessage('Admin.Delivery.App.DriverManagement.Heading')}
            </Text>
          </View>
        </View>
        <Divider style={[layout.DividerSperator, { marginBottom: 30 }]} />
      </>
    );
  }
    
  function renderDriverFileSection() {
    return (
      <View style={[formStyle.formRow, { flex: 1 }]}>
        <View style={[layout.flexCol, layout.justifyCenter, layout.alignItemCenter]}>
          <CustomDocumentWrapper
            onSelect={handleFileSelect}
            files={uploadFilesData}
            handleRemoveFile={handleRemoveFile}
            disabled={fileUploadState.loading}
            type={[
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]}
          />
          <Text style={{ color: theme.colors.textNeutral, opacity: 0.7, marginTop: 6 }}>
            {TranslateMessage('Admin.Delivery.App.Upload.Excel')}
          </Text>
        </View>
        <Loader
          loading={fileUploadState.loading}
          styles={layout.sheetLoader}
        />
      </View>
    );
  }

  function renderFileUploadModal() {
    return (
      <CustomModal
        visible={showFileModal}
        dismissOutside={false}
        title={TranslateMessage('Admin.Delivery.App.UploadDriverFile')}
        bodyContent={[]}
        onCancel={handleCloseFileModal}
        onSave={handleUploadPreview}
        confirmBtnTitle={TranslateMessage('Admin.Delivery.App.Preview')}
        cancelBtnTitle={TranslateMessage('Admin.Delivery.App.Cancel')}
        error={fileUploadState.error || ''}
        isConfirmDisabled={uploadFilesData.length === 0 || fileUploadState.loading}
      >
        {renderDriverFileSection()}
      </CustomModal>
    );
  }

  function renderLimitExceededModal() {    return (
      <CustomModal
        visible={limitModalVisible}
        dismissOutside={true}
        title={TranslateMessage('Admin.Delivery.App.Driver.Limit.Exceeded.Title')}
        bodyContent={[]}
        onCancel={hideLimitModal}
        isHome={true}
      >
        <View style={[layout.containerPadding,layout.addDriverWarning,]}>
          <Icon name="warning" color={theme.colors.iconErrorDark} size={35}/>
          <Typography variant="body" style={[layout.textCenter,layout.mt10]}>
            {TranslateMessage('Admin.Delivery.App.Driver.Limit.Exceeded.Message')}
          </Typography>
        </View>
      </CustomModal>
    );
  }
  return (
    <>
      <Loader loading={loading} />
      <ScrollView>
        <View
          style={[
            layout.containerPadding,
            isDashboard && { paddingHorizontal: 0 },
          ]}
        >
          {!isDashboard ? renderHeading() : null}
          {!isDashboard ? renderFilters() : null}
          <View
            style={[
              layout.cardBox,
              layout.tableContainer,
              isDashboard && { marginBottom: 0, paddingVertical: 0 },
            ]}
          >
            <View style={[tablestyle.container]}>
              <View style={{ flex: 1 }}>
                <ScrollView
                  horizontal
                  style={layout.flexCol}
                  contentContainerStyle={{ flex: 1 }}
                >
                  {!loading ? (
                    data && data.data.length > 0 ? (
                      isDashboard ? (
                        <DriverListTable
                          DriverListData={data}
                          page={page}
                          handleSort={handleSort}
                          filter={filter}
                          handlePageChange={handlePageChange}
                          handleViewDetailsPress={handleViewDetailsPress}
                          error={error ?? ''}
                          isDashboard={isDashboard}
                        />
                      ) : (
                        <View style={tablestyle.tableScrollWidth}>
                          <DriverListTable
                            DriverListData={data}
                            page={page}
                            handleSort={handleSort}
                            filter={filter}
                            handlePageChange={handlePageChange}
                            handleViewDetailsPress={handleViewDetailsPress}
                            error={error ?? ''}
                            isDashboard={isDashboard}
                          />
                        </View>
                      )
                    ) : isDashboard ? (
                      <Image
                        source={require('src/common/assets/images/requestmanage.png')}
                        resizeMode="contain"
                        style={[DashboardStyle.imageGraph as ImageStyle]}
                      />
                    ) : (
                      <Text
                        style={[formStyle.labelTitle, formStyle.noRetroLabel]}
                      >
                        {TranslateMessage(
                          'Admin.Delivery.App.Driver.No.Data.Found',
                        )}
                      </Text>
                    )
                  ) : null}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {renderFilterModal()}
      {renderLimitExceededModal()}
      {renderFileUploadModal()}
    </>
  );
};

export default DriverList;
