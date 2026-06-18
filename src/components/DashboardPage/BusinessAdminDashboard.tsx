import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomBarChart from 'src/common/components/CustomChart/Web/BarGraph';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchBusinessListingAction, fetchBusinessSignupAnalyticsAction } from 'src/common/service/business/action';
import { generateInitialFilterData } from 'src/components/Business/BusinessListUtils';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { getDefaultStartAndEndMonth } from 'src/components/ReportsPage/ReportUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
const STATIC_TOTAL_REVENUE = 128_450;

// ── Component ─────────────────────────────────────────────────────────────────

const BusinessAdminDashboard = () => {
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const layout = useLayoutStyle();
  const styles = useRestroStyle();
  const { theme } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const focus = useIsFocused();

  const { data: businessListData, loading } = useSelector(
    (state: RootState) => state.business.businessListing
  );
  const {
    data: signupAnalytics,
    loading: signupAnalyticsLoading,
  } = useSelector((state: RootState) => state.business.businessSignupAnalytics);
  const defaultRange = getDefaultStartAndEndMonth();
  const startMonth = defaultRange.start;
  const endMonth = defaultRange.end;

  useEffect(() => {
    if (focus) {
      dispatch(fetchBusinessListingAction(generateInitialFilterData(), 0, 5));
      dispatch(fetchBusinessSignupAnalyticsAction(startMonth, endMonth));
    }
  }, [dispatch, focus, startMonth, endMonth]);

  const recentTenants = businessListData?.data ?? [];
  const totalTenants = businessListData?.total ?? 0;
  const formattedRevenue = `$${STATIC_TOTAL_REVENUE.toLocaleString()}`;

  return (
    <ScrollView>
      <View style={DashboardStyle.container}>
        {/* Header */}
        <View style={[styles.headerContainer, layout.paddingTop26]}>
          <View style={styles.filterrow}>
            <Text style={layout.Adminh1Title}>
              {TranslateMessage('Admin.Delivery.App.Home')}
            </Text>
          </View>
        </View>
        <Divider style={[layout.DividerSperator, layout.marBottom20]} />

        {/* Top stat cards */}
        <View style={[DashboardStyle.dashboardCardFlex, layout.businessDashboardCardRow]}>
          {/* Total Revenue */}
          {/* <View style={[layout.cardBox, DashboardStyle.cardDashImgFlex, layout.flexCol, layout.flexWrap]}>
            <View style={DashboardStyle.btnCircle}>
              <Icon name='wallet' size={30} color={theme.colors.themeIcon} />
            </View>
            <View style={layout.flexShrink}>
              <Text style={DashboardStyle.TextCard}>{formattedRevenue}</Text>
              <Text style={DashboardStyle.TextCardSubTitle}>{TranslateMessage('Admin.Delivery.App.Total.Revenue')}</Text>
            </View>
          </View> */}

          {/* Total Tenants — tappable, navigates to business listing */}
          <Pressable
            onPress={() => router.push(Routes.BUSINESS)}
            style={[layout.cardBox, DashboardStyle.cardDashImgFlex, layout.flexCol, layout.flexWrap]}
          >
            <View style={DashboardStyle.btnCircle}>
              <Icon name='building' size={30} color={theme.colors.themeIcon} />
            </View>
            <View style={layout.flexShrink}>
              <Text style={DashboardStyle.TextCard}>{totalTenants}</Text>
              <Text style={DashboardStyle.TextCardSubTitle}>{TranslateMessage('Admin.Delivery.App.Total.Tenants')}</Text>
            </View>
          </Pressable>
        </View>

        {/* Main content row */}
        <View style={[DashboardStyle.DashboardLeftRightLayout]}>
          {/* Left: Signups per month bar chart */}
          <View style={[layout.cardBox, layout.flexCol, layout.businessDashboardChartCard]}>
            <Text style={[DashboardStyle.TextcardHeader, layout.businessDashboardSectionTitle]}>
            {TranslateMessage('Admin.Delivery.App.SignUp.Per.Month')}
            </Text>
            {signupAnalyticsLoading ? (
              <Loader  color={theme.colors.themeIcon} styles={layout.dashboaradLoader} />
            ) : signupAnalytics.length > 0 ? (
              <CustomBarChart
                data={signupAnalytics}
                roundedTop={true}
                valuePosition='outside'
                height={260}
              />
            ) : (
              <Text style={layout.dashboardNoData}>
               {TranslateMessage('Admin.Delivery.App.Dashboard.NoDataAvailableYet')}
              </Text>
            )}
          </View>

          {/* Right: Recently added tenants */}
          <View style={[layout.cardBox, layout.flexCol, layout.businessDashboardTenantCard]}>
            <View style={[DashboardStyle.flexRow, layout.businessDashboardSectionTitle]}>
              <Text style={DashboardStyle.TextcardHeader}>{TranslateMessage('Admin.Delivery.App.Recenet.Tenants')}</Text>
            </View>

            {loading ? (
               <Loader  color={theme.colors.themeIcon} styles={layout.dashboaradLoader} />
            ) : recentTenants.length === 0 ? (
              <Text style={layout.dashboardNoData}>
               {TranslateMessage('Admin.Delivery.App.Dashboard.NoDataAvailableYet')}
              </Text>
            ) : (
              recentTenants.map((tenant, index) => (
                <View key={tenant.id}>
                  <View style={[DashboardStyle.flexRowCenter, layout.businessDashboardTenantRow]}>
                    <View style={layout.businessDashboardTenantInfo}>
                      <Text style={layout.businessDashboardTenantName}>
                        {tenant.businessName}
                      </Text>
                      <Text style={layout.tennantEmail} >
                        {tenant.businessEmail}
                      </Text>
                    </View>
                    <Text style={tenant.active ? DashboardStyle.pickedUpColor : DashboardStyle.rejected}>
                      {tenant.active ? TranslateMessage( 'Admin.Delivery.App.UserManagementList.Filter.Active') : TranslateMessage( 'Admin.Delivery.App.UserManagementList.Filter.Inactive')} 
                    </Text>
                  </View>
                  {index < recentTenants.length - 1 && (
                    <Divider style={layout.subtleDivider} />
                  )}
                </View>
              ))
            )}

            <Pressable onPress={() => router.push(Routes.BUSINESS)}>
              <Text style={DashboardStyle.viewAllStatus}>{TranslateMessage('Admin.Delivery.App.View.All')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BusinessAdminDashboard;
