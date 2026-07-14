import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import { fetchDistrictListingAction } from 'src/common/service/masterlocation/action';
import { AppDispatch, RootState } from 'src/store';
import { useApplicationListingStyle } from './ApplicationListingStyle';
import {
  AREA_OPTIONS,
  BUILDING_TYPE_OPTIONS,
  IOption, MOCK_APPLICATIONS,
  STATUS_OPTIONS
} from './ApplicationListingUtils';
import ApplicationTable from './Table/ApplicationTable';

// Hardcoded state ID for districts filter — this app operates within a single state (Uttarakhand).
const APPLICATION_LISTING_STATE_ID = 629;

const ALL_DISTRICTS_OPTION: IOption = { label: 'All Districts', value: '' };

// ─── Component ───────────────────────────────────────────────────────────

const ApplicationListing = () => {
  const styles = useApplicationListingStyle();
  const dispatch: AppDispatch = useDispatch();

  const districtListing = useSelector(
    (state: RootState) => state.masterlocation.districtListing,
  );
  const districtOptions = useMemo<IOption[]>(
    () => [
      ALL_DISTRICTS_OPTION,
      ...districtListing.data.map((item) => ({
        label: item.name,
        value: String(item.id),
      })),
    ],
    [districtListing.data],
  );

  useEffect(() => {
    dispatch(fetchDistrictListingAction(APPLICATION_LISTING_STATE_ID));
  }, [dispatch]);

  const [district, setDistrict] = useState<IOption>(ALL_DISTRICTS_OPTION);
  const [area, setArea] = useState<IOption>(AREA_OPTIONS[0]);
  const [buildingType, setBuildingType] = useState<IOption>(BUILDING_TYPE_OPTIONS[0]);
  const [status, setStatus] = useState<IOption>(STATUS_OPTIONS[0]);
  const [submittedDate, setSubmittedDate] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);

  const filteredApplications = MOCK_APPLICATIONS.filter((item) => {
    if (buildingType.value && item.buildingType !== buildingType.label) return false;
    if (status.value && item.status !== status.value) return false;
    if (submittedDate && item.submittedOn !== submittedDate) return false;
    return true;
  });

  function renderFilters() {
    return (
      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>District</Text>
          <Customdropdown data={districtOptions} selectedValue={district} onChange={setDistrict} />
        </View>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Industrial Area</Text>
          <Customdropdown data={AREA_OPTIONS} selectedValue={area} onChange={setArea} />
        </View>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Building Type</Text>
          <Customdropdown data={BUILDING_TYPE_OPTIONS} selectedValue={buildingType} onChange={setBuildingType} />
        </View>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Status</Text>
          <Customdropdown data={STATUS_OPTIONS} selectedValue={status} onChange={setStatus} />
        </View>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Date</Text>
          <CustomInputDatePicker
            date={submittedDate}
            onDateSelect={setSubmittedDate}
            placeholder="mm/dd/yyyy"
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {renderFilters()}
      <ApplicationTable data={filteredApplications} page={page} onPageChange={setPage} />
    </ScrollView>
  );
};

export default ApplicationListing;
