import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';
import { useMyApplicationStyle } from './MyApplicationStyle';

// ─── Types ─────────────────────────────────────────────────────────────────

export type AppStatus =
  | 'Under Review'
  | 'Approved'
  | 'Draft'
  | 'Objection Raised'
  | 'Submitted'
  | 'Rejected';

export interface ApplicationItem {
  id: string;
  service: string;
  date: string;
  location: string;
  status: AppStatus;
  progress?: number; // 0–100, shown only for some statuses
}

interface ApplicationListPanelProps {
  applications: ApplicationItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

// ─── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AppStatus,
  { color: string; bg: string; label: string }
> = {
  'Under Review': { color: '#2563EB', bg: '#EFF6FF', label: '● Under Review' },
  Approved:       { color: '#16A34A', bg: '#F0FDF4', label: '● Approved' },
  Draft:          { color: '#6B7280', bg: '#F9FAFB', label: '● Draft' },
  'Objection Raised': { color: '#D97706', bg: '#FFFBEB', label: '● Objection Raised' },
  Submitted:      { color: '#0891B2', bg: '#ECFEFF', label: '● Submitted' },
  Rejected:       { color: '#DC2626', bg: '#FEF2F2', label: '● Rejected' },
};

const PROGRESS_COLOR: Record<AppStatus, string> = {
  'Under Review':   '#2563EB',
  Approved:         '#16A34A',
  Draft:            '#6B7280',
  'Objection Raised': '#D97706',
  Submitted:        '#0891B2',
  Rejected:         '#DC2626',
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: AppStatus }> = ({ status }) => {
  const styles = useMyApplicationStyle();
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.statusText, { color: cfg.color }]}>{status}</Text>
    </View>
  );
};

// ─── Component ──────────────────────────────────────────────────────────────

const ApplicationListPanel: React.FC<ApplicationListPanelProps> = ({
  applications,
  selectedId,
  onSelect,
}) => {
  const styles = useMyApplicationStyle();
  const { theme } = useAppTheme();

  return (
    <View style={styles.leftPanel}>
      {/* Header */}
      <View style={styles.leftPanelHeader}>
        <Text style={styles.leftPanelTitle}>All Applications</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>
            {applications.length} total
          </Text>
        </View>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {applications.map((app) => {
          const isActive = app.id === selectedId;
          const showProgress =
            app.progress !== undefined && app.status !== 'Approved';

          return (
            <Pressable
              key={app.id}
              onPress={() => onSelect(app.id)}
              style={[
                styles.appCard,
                isActive && styles.appCardActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select application ${app.id}`}
            >
              {/* ID + status row */}
              <View style={styles.appCardRow}>
                <Text
                  style={[
                    styles.appCardId,
                    !isActive && styles.appCardIdInactive,
                  ]}
                >
                  {app.id}
                </Text>
                <StatusBadge status={app.status} />
              </View>

              {/* Service type */}
              <Text style={styles.appCardService}>{app.service}</Text>

              {/* Date + Location meta */}
              <View style={styles.appCardMeta}>
                <Icon
                  name="calendar"
                  size={12}
                  color={theme.colors.textNeutral}
                  spacing={0}
                />
                <Text style={styles.appCardMetaText}>{app.date}</Text>
                <Icon
                  name="position"
                  size={12}
                  color={theme.colors.textNeutral}
                  spacing={0}
                />
                <Text style={styles.appCardMetaText}>{app.location}</Text>
              </View>

              {/* Progress bar */}
              {showProgress && (
                <>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressPct}>{app.progress}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${app.progress}%` as any,
                          backgroundColor: PROGRESS_COLOR[app.status],
                        },
                      ]}
                    />
                  </View>
                </>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ApplicationListPanel;
