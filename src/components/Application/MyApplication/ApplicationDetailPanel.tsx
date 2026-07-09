import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';
import { ApplicationItem, AppStatus } from './ApplicationListPanel';
import { useMyApplicationStyle } from './MyApplicationStyle';

// ─── Types ──────────────────────────────────────────────────────────────────

export type TimelineStepStatus = 'completed' | 'active' | 'pending';

export interface TimelineStep {
  id: string;
  name: string;
  description: string;
  date?: string;
  status: TimelineStepStatus;
  alert?: string; // optional highlighted note inside the step
  inProgress?: boolean; // shows the "IN PROGRESS" pill
}

export interface ApplicationDetail extends ApplicationItem {
  submittedDate: string;
  expectedDate: string;
  timeline: TimelineStep[];
}

interface ApplicationDetailPanelProps {
  detail: ApplicationDetail;
}

// ─── Status badge config (same as list panel) ────────────────────────────────

const STATUS_CONFIG: Record<AppStatus, { color: string; bg: string }> = {
  'Under Review':     { color: '#2563EB', bg: '#EFF6FF' },
  Approved:           { color: '#16A34A', bg: '#F0FDF4' },
  Draft:              { color: '#6B7280', bg: '#F9FAFB' },
  'Objection Raised': { color: '#D97706', bg: '#FFFBEB' },
  Submitted:          { color: '#0891B2', bg: '#ECFEFF' },
  Rejected:           { color: '#DC2626', bg: '#FEF2F2' },
};

// ─── ApplicationHeaderCard ──────────────────────────────────────────────────
// Top section of the right panel — shows APP ID, status badge, meta info, action buttons

const ApplicationHeaderCard: React.FC<{ detail: ApplicationDetail }> = ({
  detail,
}) => {
  const styles = useMyApplicationStyle();
  const { theme } = useAppTheme();
  const statusCfg = STATUS_CONFIG[detail.status];

  return (
    <View style={styles.appHeaderCard}>
      {/* Row 1: App ID + status + action buttons */}
      <View style={styles.appHeaderTopRow}>
        <View style={styles.appHeaderLeft}>
          <Text style={styles.appHeaderId}>{detail.id}</Text>
          {/* Status badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusCfg.bg },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusCfg.color },
              ]}
            />
            <Text style={[styles.statusText, { color: statusCfg.color }]}>
              {detail.status}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.appHeaderActions}>
          <Pressable
            style={styles.btnOutline}
            accessibilityRole="button"
            accessibilityLabel="Download application"
          >
            <Icon
              name="import"
              size={16}
              color={theme.colors.textBody}
              spacing={0}
            />
            <Text style={styles.btnOutlineText}>Download</Text>
          </Pressable>

          <Pressable
            style={styles.btnPrimary}
            accessibilityRole="button"
            accessibilityLabel="View certificate"
          >
            <Icon
              name="page"
              size={16}
              color={theme.colors.textInverse}
              spacing={0}
            />
            <Text style={styles.btnPrimaryText}>View Certificate</Text>
          </Pressable>
        </View>
      </View>

      {/* Row 2: Service · Submitted · Expected */}
      <View style={styles.appMetaRow}>
        <Text style={styles.appMetaText}>
          Service:{' '}
          <Text style={styles.appMetaBold}>{detail.service}</Text>
        </Text>
        <Text style={styles.appMetaDivider}> · </Text>
        <Text style={styles.appMetaText}>
          Submitted:{' '}
          <Text style={styles.appMetaBold}>{detail.submittedDate}</Text>
        </Text>
        <Text style={styles.appMetaDivider}> · </Text>
        <Text style={styles.appMetaText}>
          Expected:{' '}
          <Text style={styles.appMetaBold}>{detail.expectedDate}</Text>
        </Text>
      </View>
    </View>
  );
};

// ─── ApplicationTimelineCard ─────────────────────────────────────────────────
// Bottom section — vertical timeline of processing steps

const ApplicationTimelineCard: React.FC<{ timeline: TimelineStep[] }> = ({
  timeline,
}) => {
  const styles = useMyApplicationStyle();
  const { theme } = useAppTheme();

  return (
    <View style={styles.timelineCard}>
      <Text style={styles.timelineTitle}>Application Timeline</Text>

      {timeline.map((step, index) => {
        const isLast = index === timeline.length - 1;
        const isCompleted = step.status === 'completed';
        const isActive = step.status === 'active';
        const isPending = step.status === 'pending';

        return (
          <View key={step.id} style={styles.timelineStep}>
            {/* Icon column + connector line */}
            <View style={styles.timelineConnector}>
              {/* Circle icon */}
              <View
                style={[
                  styles.timelineCircle,
                  isCompleted && styles.timelineCircleCompleted,
                  isActive && styles.timelineCircleActive,
                  isPending && styles.timelineCirclePending,
                ]}
              >
                {(isCompleted || isActive) ? (
                  <Icon
                    name="tick"
                    size={14}
                    color={theme.colors.textInverse}
                    spacing={0}
                  />
                ) : (
                  <Icon
                    name="clock"
                    size={14}
                    color={theme.colors.textNeutral}
                    spacing={0}
                  />
                )}
              </View>

              {/* Connector line (hidden on last item) */}
              {!isLast && (
                <View
                  style={[
                    styles.timelineLine,
                    isCompleted && styles.timelineLineCompleted,
                  ]}
                />
              )}
            </View>

            {/* Content column */}
            <View style={styles.timelineContent}>
              {/* Step name row */}
              <View style={styles.timelineStepTopRow}>
                <View style={styles.timelineStepLeft}>
                  <Text
                    style={[
                      styles.timelineStepName,
                      isPending && styles.timelineStepNamePending,
                    ]}
                  >
                    {step.name}
                  </Text>
                  {/* IN PROGRESS pill */}
                  {step.inProgress && (
                    <View style={styles.inProgressBadge}>
                      <Text style={styles.inProgressText}>In Progress</Text>
                    </View>
                  )}
                </View>
                {step.date && (
                  <Text style={styles.timelineStepDate}>{step.date}</Text>
                )}
              </View>

              {/* Description */}
              <Text style={styles.timelineStepDesc}>{step.description}</Text>

              {/* Optional alert box */}
              {step.alert && (
                <View style={styles.alertBox}>
                  <Icon
                    name="legal"
                    size={16}
                    color="#D97706"
                    spacing={0}
                  />
                  <Text style={styles.alertText}>{step.alert}</Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

// ─── ApplicationDetailPanel ──────────────────────────────────────────────────
// Composes the two functional components above into the right-side panel

const ApplicationDetailPanel: React.FC<ApplicationDetailPanelProps> = ({
  detail,
}) => {
  const styles = useMyApplicationStyle();

  return (
    <View style={styles.rightPanel}>
      {/* Above the timeline: APP-2024 header card */}
      <ApplicationHeaderCard detail={detail} />

      {/* Below: timeline card */}
      <ApplicationTimelineCard timeline={detail.timeline} />
    </View>
  );
};

export default ApplicationDetailPanel;
