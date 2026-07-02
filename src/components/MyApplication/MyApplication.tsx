import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';
import ApplicationDetailPanel, {
    ApplicationDetail,
} from './ApplicationDetailPanel';
import ApplicationListPanel, { ApplicationItem } from './ApplicationListPanel';
import { useMyApplicationStyle } from './MyApplicationStyle';

// ─── Static mock data (replace with Redux selectors / API calls) ─────────────

const MOCK_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'APP-2024-0048',
    service: 'Building Permit',
    date: '01 Jun 2024',
    location: 'Sector 22, CHD',
    status: 'Under Review',
    progress: 57,
  },
  {
    id: 'APP-2024-0047',
    service: 'Occupancy Certificate',
    date: '25 May 2024',
    location: 'Sector 22, CHD',
    status: 'Approved',
    progress: 100,
  },
  {
    id: 'APP-2024-0046',
    service: 'Map Approval',
    date: '20 May 2024',
    location: 'Sector 22, CHD',
    status: 'Draft',
  },
  {
    id: 'APP-2024-0045',
    service: 'Building Permit',
    date: '15 May 2024',
    location: 'Sector 22, CHD',
    status: 'Objection Raised',
    progress: 43,
  },
];

const MOCK_DETAILS: Record<string, ApplicationDetail> = {
  'APP-2024-0048': {
    ...MOCK_APPLICATIONS[0],
    submittedDate: '01 Jun 2024',
    expectedDate: '22 Jun 2024',
    timeline: [
      {
        id: 't1',
        name: 'Submitted',
        description: 'Application received and acknowledgement sent',
        date: '01 Jun 2024 · 10:32 AM',
        status: 'completed',
      },
      {
        id: 't2',
        name: 'Scrutiny',
        description: 'Documents verified by Revenue Officer',
        date: '03 Jun 2024 · 02:15 PM',
        status: 'completed',
      },
      {
        id: 't3',
        name: 'Technical Review',
        description: 'Building plan checked against bylaws',
        date: '06 Jun 2024 · 11:00 AM',
        status: 'completed',
      },
      {
        id: 't4',
        name: 'Site Inspection',
        description: 'Field officer assigned — inspection pending',
        date: '10 Jun 2024 · 09:45 AM',
        status: 'active',
        inProgress: true,
        alert: 'Inspection scheduled for 15 Jun 2024 between 10 AM – 12 PM',
      },
      {
        id: 't5',
        name: 'Fee Verification',
        description: 'Payment receipt verification',
        status: 'pending',
      },
      {
        id: 't6',
        name: 'Approval',
        description: 'Final approval by sanctioning authority',
        status: 'pending',
      },
      {
        id: 't7',
        name: 'Certificate Generated',
        description: 'Building permit certificate issued',
        status: 'pending',
      },
    ],
  },
  'APP-2024-0047': {
    ...MOCK_APPLICATIONS[1],
    submittedDate: '25 May 2024',
    expectedDate: '15 Jun 2024',
    timeline: [
      {
        id: 't1',
        name: 'Submitted',
        description: 'Application received and acknowledgement sent',
        date: '25 May 2024 · 09:00 AM',
        status: 'completed',
      },
      {
        id: 't2',
        name: 'Scrutiny',
        description: 'Documents verified by Revenue Officer',
        date: '27 May 2024 · 11:30 AM',
        status: 'completed',
      },
      {
        id: 't3',
        name: 'Technical Review',
        description: 'Building plan checked against bylaws',
        date: '29 May 2024 · 10:00 AM',
        status: 'completed',
      },
      {
        id: 't4',
        name: 'Site Inspection',
        description: 'Inspection completed successfully',
        date: '02 Jun 2024 · 10:00 AM',
        status: 'completed',
      },
      {
        id: 't5',
        name: 'Fee Verification',
        description: 'Payment receipt verified',
        date: '05 Jun 2024 · 03:00 PM',
        status: 'completed',
      },
      {
        id: 't6',
        name: 'Approval',
        description: 'Final approval granted by sanctioning authority',
        date: '10 Jun 2024 · 02:00 PM',
        status: 'completed',
      },
      {
        id: 't7',
        name: 'Certificate Generated',
        description: 'Occupancy certificate issued',
        date: '12 Jun 2024 · 04:00 PM',
        status: 'completed',
      },
    ],
  },
  'APP-2024-0046': {
    ...MOCK_APPLICATIONS[2],
    submittedDate: '20 May 2024',
    expectedDate: 'N/A',
    timeline: [
      {
        id: 't1',
        name: 'Draft Saved',
        description: 'Application saved as draft — not yet submitted',
        date: '20 May 2024 · 08:00 AM',
        status: 'active',
        inProgress: false,
      },
      {
        id: 't2',
        name: 'Scrutiny',
        description: 'Pending submission',
        status: 'pending',
      },
      {
        id: 't3',
        name: 'Technical Review',
        description: 'Pending submission',
        status: 'pending',
      },
    ],
  },
  'APP-2024-0045': {
    ...MOCK_APPLICATIONS[3],
    submittedDate: '15 May 2024',
    expectedDate: '05 Jun 2024',
    timeline: [
      {
        id: 't1',
        name: 'Submitted',
        description: 'Application received and acknowledgement sent',
        date: '15 May 2024 · 10:00 AM',
        status: 'completed',
      },
      {
        id: 't2',
        name: 'Scrutiny',
        description: 'Documents verified by Revenue Officer',
        date: '17 May 2024 · 01:00 PM',
        status: 'completed',
      },
      {
        id: 't3',
        name: 'Objection Raised',
        description: 'Plan does not comply with setback requirements',
        date: '20 May 2024 · 03:30 PM',
        status: 'active',
        inProgress: true,
        alert: 'Please resubmit revised drawings addressing the setback objection',
      },
      {
        id: 't4',
        name: 'Technical Review',
        description: 'Awaiting resubmission',
        status: 'pending',
      },
      {
        id: 't5',
        name: 'Fee Verification',
        description: 'Pending',
        status: 'pending',
      },
      {
        id: 't6',
        name: 'Approval',
        description: 'Pending',
        status: 'pending',
      },
    ],
  },
};

// ─── MyApplicationContainer ──────────────────────────────────────────────────

const MyApplicationContainer = () => {
  const styles = useMyApplicationStyle();
  const { theme } = useAppTheme();

  const [selectedId, setSelectedId] = useState<string>(MOCK_APPLICATIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter list by search query
  const filteredApplications = MOCK_APPLICATIONS.filter(
    (app) =>
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDetail = MOCK_DETAILS[selectedId];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Page header: title + search ── */}
      <View style={styles.pageHeader}>
        <View style={styles.headingBlock}>
          <Text style={styles.pageTitle}>My Applications</Text>
          <Text style={styles.pageSubtitle}>
            Track status and progress of all your applications
          </Text>
        </View>

        {/* Search box */}
        <View style={styles.searchBox}>
          <Icon
            name="search"
            size={16}
            color={theme.colors.textNeutral}
            spacing={0}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search application ID..."
            placeholderTextColor={theme.colors.textNeutral}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="characters"
            autoCorrect={false}
            accessibilityLabel="Search applications"
          />
        </View>
      </View>

      {/* ── Two-panel layout ── */}
      <View style={styles.panelRow}>
        {/* Left panel — application list */}
        <ApplicationListPanel
          applications={filteredApplications}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {/* Right panel — application detail (header + timeline) */}
        {selectedDetail ? (
          <ApplicationDetailPanel detail={selectedDetail} />
        ) : (
          <View style={[styles.rightPanel, styles.emptyState]}>
            <Icon
              name="page"
              size={40}
              color={theme.colors.textNeutral}
              spacing={0}
            />
            <Text style={styles.emptyStateText}>
              Select an application to view details
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default MyApplicationContainer;
