import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import { useApplicationListingStyle } from './ApplicationListingStyle';
import {
  AREA_OPTIONS,
  BUILDING_TYPE_OPTIONS,
  DISTRICT_OPTIONS,
  IOption, MOCK_APPLICATIONS,
  STATUS_OPTIONS
} from './ApplicationListingUtils';
import ApplicationTable from './Table/ApplicationTable';

// ─── Component ───────────────────────────────────────────────────────────

const ApplicationListing = () => {
  const styles = useApplicationListingStyle();

  const [district, setDistrict] = useState<IOption>(DISTRICT_OPTIONS[0]);
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
          <Customdropdown data={DISTRICT_OPTIONS} selectedValue={district} onChange={setDistrict} />
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
