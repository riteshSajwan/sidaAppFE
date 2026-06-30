import { router } from 'expo-router';
import { useTranslation } from 'node_modules/react-i18next';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import CustomLineChart from 'src/common/components/CustomChart/Web/LineGraph';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { Routes } from 'src/routing/paths';
import { Icon } from 'src/submodules/iconlibrary/src';
import DashboardCards from './DashboardCards';
import NotificationCard from './NotificationCard';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: number;
  trend: string;
  trendPositive: boolean;
  iconName: string;
  iconBg: string;
}

interface NotifItem {
  id: string;
  title: string;
  sub: string;
  time: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

// ─── Static data (replace with Redux selectors as needed) ─────────────────────

const STAT_CARDS: StatCard[] = [
  { label: 'Total Applications', value: 48, trend: '+12% this month', trendPositive: true,  iconName: 'page',            iconBg: '#EEF2FF' },
  { label: 'Draft Applications', value: 7,  trend: '+2 this month',   trendPositive: true,  iconName: 'edit',            iconBg: '#FFF8E6' },
  { label: 'Submitted',          value: 23, trend: '+5 this month',   trendPositive: true,  iconName: 'statsDownSquare', iconBg: '#E8F4FD' },
  { label: 'Approved',           value: 14, trend: '+8% this month',  trendPositive: true,  iconName: 'tick',            iconBg: '#E8F8EE' },
  { label: 'Objections Raised',  value: 3,  trend: '-1 this month',   trendPositive: false, iconName: 'legal',           iconBg: '#FFF3E0' },
  { label: 'Rejected',           value: 1,  trend: '0 this month',    trendPositive: true,  iconName: 'closeAlt',        iconBg: '#FEEDED' },
];

// Simulated monthly bar heights (0–1 scale) for Submitted vs Approved
const CHART_DATA = [
  { month: 'Jan', submitted: 0.55, approved: 0.45 },
  { month: 'Feb', submitted: 0.65, approved: 0.50 },
  { month: 'Mar', submitted: 0.75, approved: 0.60 },
  { month: 'Apr', submitted: 0.60, approved: 0.55 },
  { month: 'May', submitted: 0.80, approved: 0.65 },
  { month: 'Jun', submitted: 0.70, approved: 0.60 },
];

const NOTIFICATIONS: NotifItem[] = [
  {
    id: '1',
    title: 'Application Approved',
    sub: 'APP-2024-0042 — Occupancy Cert',
    time: '2h ago',
    iconName: 'tickCircle',
    iconBg: '#E8F8EE',
    iconColor: '#0C9B25',
  },
  {
    id: '2',
    title: 'Document Required',
    sub: 'APP-2024-0038 — Upload Structure',
    time: '5h ago',
    iconName: 'document',
    iconBg: '#FFF8E6',
    iconColor: '#FF6100',
  },
  {
    id: '3',
    title: 'Fee Payment Due',
    sub: 'APP-2024-0045 — ₹4,250 pending',
    time: '1d ago',
    iconName: 'coin',
    iconBg: '#EEF2FF',
    iconColor: '#032B8E',
  },
  {
    id: '4',
    title: 'Inspection Scheduled',
    sub: 'APP-2024-0045 — Site visit on 15 J',
    time: '1d ago',
    iconName: 'calendar',
    iconBg: '#E8F4FD',
    iconColor: '#0369A1',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardPageMenu = () => {
  const styles = useDashboardStyle();
  const { theme } = useAppTheme();
   const { t: TranslateMessage } = useTranslation();

  // ── Welcome Banner ────────────────────────────────────────────────
  function renderBanner() {
    return (
      <View
        style={[
          styles.banner,
          { backgroundColor: theme.colors.surfaceInverse },
        ]}
      >
        <Typography
          variant="textLabel"
          style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}
        >
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Typography>
        <Typography
          variant="subHeading"
          style={{ color: theme.colors.textInverse, fontSize: 22 }}
        >
         {TranslateMessage('Admin.Sida.App.Dasboard.Greeting')}
        </Typography>
        <Text style={styles.bannerSubText}>
          You have 3 pending actions and 1 fee payment due today.
        </Text>
        <View style={styles.bannerActions}>
          <Pressable
            style={styles.bannerBtnPrimary}
            onPress={() => router.push(Routes.NEWBOOKING as any)}
            accessibilityRole="button"
          >
            <Icon name="addLargeLine" size={14} color={theme.colors.surfaceInverse} />
            <Text style={styles.bannerBtnPrimaryText}>New Application</Text>
          </Pressable>
          <Pressable
            style={styles.bannerBtnSecondary}
            onPress={() => router.push(Routes.BOOKING as any)}
            accessibilityRole="button"
          >
            <Text style={styles.bannerBtnSecondaryText}>Track Application</Text>
            <Icon name="chevronRight" size={14} color={theme.colors.textInverse} />
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Stat Cards ────────────────────────────────────────────────────
  function renderStatCards() {
    return (
      <View style={styles.statsRow}>
        {STAT_CARDS.map((card) => (
          <View key={card.label} style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: card.iconBg }]}>
              <Icon name={card.iconName as any} size={18} color={theme.colors.surfaceInverse} />
            </View>
            <Text style={styles.statValue}>{card.value}</Text>
            <Text style={styles.statLabel}>{card.label}</Text>
            <View style={styles.statTrend}>
              <Icon
                name={card.trendPositive ? 'chevronUp' : 'chevronDown'}
                size={12}
                color={card.trendPositive ? theme.colors.textSuccessDark : theme.colors.textErrorDark}
              />
              <Text
                style={
                  card.trendPositive
                    ? styles.statTrendTextPos
                    : styles.statTrendTextNeg
                }
              >
                {card.trend}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  // ── Bar Chart (static visual) ─────────────────────────────────────
  // function renderChart() {
  //   const maxHeight = 140;
  //   return (
  //     <View style={styles.chartCard}>
  //       <View style={styles.chartHeader}>
  //         <View>
  //           <Typography variant="subTitle" fontWeight="semiBold">
  //             Application Trends
  //           </Typography>
  //           <Typography variant="textLabel" style={{ color: theme.colors.textNeutral }}>
  //             Monthly overview · 2024
  //           </Typography>
  //         </View>
  //         <View style={styles.chartLegend}>
  //           <View style={styles.legendItem}>
  //             <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
  //             <Text style={styles.legendLabel}>Submitted</Text>
  //           </View>
  //           <View style={styles.legendItem}>
  //             <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
  //             <Text style={styles.legendLabel}>Approved</Text>
  //           </View>
  //         </View>
  //       </View>

  //       {/* Simple bar chart */}
  //       <View style={styles.chartArea}>
  //         {CHART_DATA.map((d) => (
  //           <View
  //             key={d.month}
  //             style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}
  //           >
  //             <View
  //               style={[
  //                 styles.chartBar,
  //                 {
  //                   height: d.submitted * maxHeight,
  //                   backgroundColor: '#3B82F6',
  //                   opacity: 0.85,
  //                 },
  //               ]}
  //             />
  //             <View
  //               style={[
  //                 styles.chartBar,
  //                 {
  //                   height: d.approved * maxHeight,
  //                   backgroundColor: '#22C55E',
  //                   opacity: 0.85,
  //                 },
  //               ]}
  //             />
  //           </View>
  //         ))}
  //       </View>
  //       <View style={styles.chartXLabels}>
  //         {CHART_DATA.map((d) => (
  //           <Text key={d.month} style={styles.chartXLabel}>{d.month}</Text>
  //         ))}
  //       </View>
  //     </View>
  //   );
  // }

  // ── Notifications ─────────────────────────────────────────────────
  // function renderNotifications() {
  //   return (
  //     <View style={styles.notifCard}>
  //       <View style={styles.notifHeader}>
  //         <Typography variant="subTitle" fontWeight="semiBold">
  //           Notifications
  //         </Typography>
  //         <Pressable
  //           onPress={() => router.push(Routes.TICKET as any)}
  //           accessibilityRole="link"
  //         >
  //           <Text style={styles.viewAllText}>View all →</Text>
  //         </Pressable>
  //       </View>

  //       {NOTIFICATIONS.map((n, index) => (
  //         <View
  //           key={n.id}
  //           style={[
  //             styles.notifItem,
  //             index === NOTIFICATIONS.length - 1 && { borderBottomWidth: 0 },
  //           ]}
  //         >
  //           <View style={[styles.notifIconWrap, { backgroundColor: n.iconBg }]}>
  //             <Icon name={n.iconName as any} size={16} color={n.iconColor} />
  //           </View>
  //           <View style={styles.notifContent}>
  //             <Text style={styles.notifTitle}>{n.title}</Text>
  //             <Text style={styles.notifSub}>{n.sub}</Text>
  //             <Text style={styles.notifTime}>{n.time}</Text>
  //           </View>
  //         </View>
  //       ))}
  //     </View>
  //   );
  // }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.surfaceLow }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {renderBanner()}
      {/* {renderStatCards()} */}
      <DashboardCards/>
      <View style={styles.bottomRow}>
        {/* {renderChart()} */}
        <CustomLineChart
         data={[]}
          data2={[]}
          frontColor={'red'}
          secondaryColor={'blue'}
          firstLabel={'Test1'}
          secondLabel={'Test2'}
          height={400}
        />
        {/* {renderNotifications()} */}
        <NotificationCard/>
      </View>
    </ScrollView>
  );
};

export default DashboardPageMenu;
