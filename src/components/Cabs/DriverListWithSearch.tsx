import { Image } from 'expo-image';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View } from 'react-native';
import { Searchbar, } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import { RenderImage } from 'src/common/components/Image/Image';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchCabsDriverListingAction, fetchCabsDriverListingLoadMoreAction } from 'src/common/service/driver/action';
import { resetCabsDriverListing } from 'src/common/service/driver/slice';
import { getVehicleImageByCategory, IDriverForCabs, IVEHICLECATEGORY } from 'src/components/Cabs/CabsUtil';
import { generateInitialFilterData } from 'src/components/DriverDetailPage/DriverListUtil';
import { getTranslatedVehicleCategory } from 'src/components/NewBooking/NewBookingListUtil';
import { DEBOUNCE_TIME } from 'src/constants';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const getDateOnly = (value?: string | null) => value?.trim().slice(0, 10) ?? null;

interface DriverListWithSearchProps {
  onDriverSelect: (driver: IDriverForCabs) => void;
  selectedDriverId?: number | null;
  pinnedDriver?: IDriverForCabs | null;
  showHeader?: boolean;
  headerTitle?: string;
  pageSize?: number;
  showCheckboxes?: boolean;
  selectedCheckboxDriverId?: number | null;
  onCheckboxChange?: (driver: IDriverForCabs) => void;
  onAssignPress?: () => void;
  isAssignDisabled?: boolean;
  assignButtonTitle?: string;
  onSchedulePress?: (driver: IDriverForCabs) => void;
  scheduleCalendarDate?: string | null;
  scheduleMarkedDates?: Record<string, { selected?: boolean; marked?: boolean; selectedColor?: string }>;
  scheduleLoading?: boolean;
  scheduleError?: string | null;
  scheduleDriverId?: number | null;
  scheduleOpenSignal?: number;
  selectedRideDate?: string | null;
  onScheduleDateSelect?: (driver: IDriverForCabs, date: string) => void;
}

const DriverListWithSearch: React.FC<DriverListWithSearchProps> = ({
  onDriverSelect,
  selectedDriverId,
  pinnedDriver,
  showHeader = true,
  headerTitle,
  pageSize = 10,
  showCheckboxes = false,
  selectedCheckboxDriverId,
  onCheckboxChange,
  onAssignPress,
  isAssignDisabled = false,
  assignButtonTitle,
  onSchedulePress,
  scheduleCalendarDate,
  scheduleMarkedDates,
  scheduleLoading = false,
  scheduleError,
  scheduleDriverId,
  scheduleOpenSignal = 0,
  selectedRideDate,
  onScheduleDateSelect,
}) => {

  const { t: TranslateMessage } = useTranslation();
  const button = useButtonStyle();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const { theme } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();

  const [driverSearchKey, setDriverSearchKey] = useState('');
  const [driverPage, setDriverPage] = useState(0);

  const { data: driverData, loading: driverLoading, error: driverError, hasMore, isLoadingMore } = useSelector(
    (state: RootState) => state.driver.cabsDriverListing
  );

  // Debounced search function
  const debouncedDriverSearch = useCallback(
    debounce((searchKey: string) => {
      setDriverPage(0); // Reset page when searching

      // Fetch new data with search
      const driverFilter = {
        ...generateInitialFilterData(),
        searchKey: searchKey || '',
      };
      dispatch(fetchCabsDriverListingAction(driverFilter, 0, pageSize));
    }, DEBOUNCE_TIME),
    [dispatch, pageSize]
  );

  const handleDriverSearch = (searchKey: string) => {
    setDriverSearchKey(searchKey || '');
    debouncedDriverSearch(searchKey || '');
  };

  // Load more drivers function
  const loadMoreDrivers = () => {
    if (hasMore && !isLoadingMore && !driverLoading && !driverError) {
      const nextPage = driverPage + 1;
      setDriverPage(nextPage);

      const driverFilter = {
        ...generateInitialFilterData(),
        searchKey: driverSearchKey,
      };
      dispatch(fetchCabsDriverListingLoadMoreAction(driverFilter, nextPage, pageSize));
    }
  };

  useEffect(() => {
    const driverFilter = generateInitialFilterData();
    dispatch(fetchCabsDriverListingAction(driverFilter, 0, pageSize));
    return () => {
      dispatch(resetCabsDriverListing());
      debouncedDriverSearch.cancel();
    };
  }, [dispatch, debouncedDriverSearch, pageSize]);
  const driversForList: IDriverForCabs[] = React.useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) return [];

    return driverData.data.map((driver) => {
      if (!driver) return null;

      return {
        id: driver.id || 0,
        firstName: driver.firstName || TranslateMessage('Admin.Delivery.App.Unknown'),
        email: driver.email || '',
        phoneNumber: driver.phoneNumber || '',
        registrationNumber: driver.registrationNumber || driver.riderVehicleRegistration?.registrationNumber || '',
        profileUrl: driver.profileUrl || undefined,
        activeStatus: driver.activeStatus || TranslateMessage('Admin.Delivery.App.Unknown'),
        isBlocked: Boolean(driver.isBlocked),
        latitude: driver.latitude,
        longitude: driver.longitude,
        vehicleCategory: driver.vehicleCategory || driver.vehicleType || IVEHICLECATEGORY.FULL_SIZE,
        scheduledTimes: Array.isArray(driver.scheduledTimes) ? driver.scheduledTimes : [],
      };
    }).filter(Boolean) as IDriverForCabs[];
  }, [driverData?.data, TranslateMessage]);

  function renderDriverItem({ item }: { item: IDriverForCabs }) {
    if (!item) return null;

    const isSelected = selectedDriverId === item.id;
    const isCheckboxSelected = selectedCheckboxDriverId === item.id;
    const isScheduleDriver = scheduleDriverId === item.id;
    const normalizedSelectedRideDate = getDateOnly(selectedRideDate);
    const hasScheduleConflict = Boolean(
      normalizedSelectedRideDate &&
      item.scheduledTimes?.some((scheduledTime) => getDateOnly(scheduledTime) === normalizedSelectedRideDate)
    );

    const translatedVehicleCategory = getTranslatedVehicleCategory(
      item.vehicleCategory || item.vehicleType,
      TranslateMessage
    );
    const vehicleImageSource = getVehicleImageByCategory(item.vehicleCategory, item.vehicleType);
    const driverNameColor = hasScheduleConflict ? theme.colors.textErrorDark : theme.colors.textBody;
    const secondaryTextColor = hasScheduleConflict ? theme.colors.textBodyLight : theme.colors.textNeutral;

    return (
      <Pressable
        onPress={() => onDriverSelect(item)}
        style={[
          layout.listItem,
          layout.driverCard,
          isSelected && layout.listItemActive,
          hasScheduleConflict && layout.driverCardConflict,
        ]}>
        <View style={layout.driverCardRow}>
          <View style={layout.driverCardContent}>
            {showCheckboxes ? (
              <Pressable onPress={() => onCheckboxChange?.(item)} style={[formStyle.checkBox, isCheckboxSelected && formStyle.checkBoxChecked, layout.driverCardCheckbox]}>
                {isCheckboxSelected ? (
                  <Icon name='tick' size={16} color={theme.colors.iconInverse} />
                ) : null}
              </Pressable>
            ) : null}
            {/* Avatar */}
            <View style={layout.driverCardAvatarWrap}>
              <RenderImage
                uri={item.profileUrl}
                style={[
                  layout.riderImage,
                  layout.driverCardAvatar,
                  hasScheduleConflict && { borderColor: theme.colors.borderErrorInverse },
                ]}
              />
            </View>
            <View style={[layout.flexCol, layout.driverCardTextWrap]}>
              <View style={[layout.flexDirectionRow, layout.alignItemCenter, layout.justifyBetween, { gap: theme.spacing.xs }]}>
                <Typography
                  variant='body'
                  fontWeight='medium'
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  color={driverNameColor}
                  style={layout.driverCardName}
                >
                  {item.firstName || TranslateMessage('Admin.Delivery.App.UnknownDriver')}
                </Typography>
              </View>
              {/* Phone */}
              <Typography
                variant='textLabel'
                color={secondaryTextColor}
                numberOfLines={1}
                ellipsizeMode='tail'
                style={layout.driverCardPhone}
              >
                {item.phoneNumber || TranslateMessage('Admin.Delivery.App.NoPhone')}
              </Typography>
              {/* Registration */}
              {item.registrationNumber ? (
                <Typography
                  variant='textLabel'
                  color={secondaryTextColor}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={layout.driverCardEmail}
                >
                  {item.registrationNumber}
                </Typography>
              ) : null}
              {/* Vehicle category */}
              <Typography
                variant='textLabel'
                color={secondaryTextColor}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {translatedVehicleCategory}
              </Typography>
            </View>
          </View>
          {/* Right side: schedule + vehicle image */}
          <View style={layout.driverCardScheduleWrap}>
            {onSchedulePress ? (
              <CustomInputDatePicker
                date={isScheduleDriver ? (scheduleCalendarDate ?? null) : null}
                onDateSelect={(date) => onScheduleDateSelect?.(item, date)}
                placeholder={TranslateMessage('Admin.Delivery.App.Driver.Schedule')}
                markedDates={isScheduleDriver ? scheduleMarkedDates : undefined}
                showIconOnly={true}
                onOpen={() => onSchedulePress(item)}
                waitForOpenSignal={true}
                openSignal={isScheduleDriver ? scheduleOpenSignal : 0}
                disableYearDropdown={true}
                disabled={scheduleLoading && isScheduleDriver}
                riderName={item.firstName}
                riderId={item.id}
              />
            ) : null}
            <Image
              source={vehicleImageSource}
              contentFit='contain'
              style={layout.driverCardVehicleImage}
            />
          </View>
        </View>
      </Pressable>
    );
  }

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={{ padding: theme.spacing.md, alignItems: 'center' }}>
        <Loader />
      </View>
    );
  };

  return (
    <View style={[layout.listItemContainer, { flex: 1 }]}>
      {showHeader && (
        <View
          style={layout.searchHeader}
        >
          <View style={layout.headerTitleRow}>
            <Typography variant="subTitle">
              {headerTitle || TranslateMessage('Admin.Delivery.App.Drivers')}
            </Typography>
            {showCheckboxes && onAssignPress ? (
              <Pressable
                onPress={onAssignPress}
                disabled={isAssignDisabled}
              >
                <Typography
                  variant='body'
                  fontWeight='semiBold'
                  color={isAssignDisabled ? theme.colors.textDisabled : theme.colors.textInverse}
                  style={[
                    button.btnBase,
                    button.btnPrimary,
                    button.btnMd,
                    isAssignDisabled && button.btnDisabled,
                  ]}
                >
                  {assignButtonTitle || TranslateMessage('Admin.Delivery.App.Assign.Ride')}
                </Typography>
              </Pressable>
            ) : null}
          </View>

          <View>
            <Searchbar
              value={driverSearchKey}
              onChangeText={handleDriverSearch}
              placeholder={TranslateMessage('Admin.Delivery.App.SearchDriver')}
              placeholderTextColor={theme.colors.textNeutral}
              iconColor={theme.colors.iconBase}
              mode="bar"
              inputStyle={layout.inputStyle}
              style={[
                layout.searchBar,
              ]}
              rippleColor={'transparent'}
            />
          </View>

        </View>
      )}
      <View style={{ flex: 1, minHeight: 0 }}>
        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: theme.spacing.sm, paddingBottom: theme.spacing.lg }}
          data={driversForList}
          renderItem={renderDriverItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreDrivers}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={{ padding: theme.spacing.lg, alignItems: 'center' }}>
              <Typography color={theme.colors.textErrorDark}>
                {driverLoading
                  ? renderFooter()
                  : driverError
                    ? `${driverError}`
                    : TranslateMessage('Admin.Delivery.App.NoDriversFound')}
              </Typography>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default DriverListWithSearch;
