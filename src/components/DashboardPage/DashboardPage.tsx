import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Pressable, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { usePermission } from 'src/common/hooks/usePermission';
import { useTenantId } from 'src/common/hooks/useTenantId';
import { fetchCustomerLastMonthCountAction, fetchDashboardIndicatorsAction, fetchTotalWalletBalanceAction, fetchTransactionInitiatedCountAction } from 'src/common/service/report/action';
import { resetReport } from 'src/common/service/report/slice';
import { MenuType } from 'src/common/utils/permissionUtils';
import CustomerList from 'src/components/CustomerDetailPage/CustomerList';
import DashboardCard from 'src/components/DashboardPage/DashBoardCard';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { generateInitialData } from 'src/components/DashboardPage/DashboardUtil';
import { TopPerformerPage } from 'src/components/DashboardPage/topPerformer/TopPerformer';
import WalletBalanceModal from 'src/components/DashboardPage/WalletBalanceModal';
import DriverList from 'src/components/DriverDetailPage/DriverList';
import SalesProfitChart from 'src/components/ReportsPage/chart/SalesProfitChart';
import { getDefaultStartAndEndMonth } from 'src/components/ReportsPage/ReportUtil';
import RequestList from 'src/components/RequestManagement/RequestList';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import BusinessAdminDashboard from './BusinessAdminDashboard';


const DashboardPageMenu = () => {
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const layout = useLayoutStyle();
  const styles = useRestroStyle();
  const dispatch = useDispatch<AppDispatch>();
  const focus = useIsFocused();
  
  // Permission checks for different sections
  const dashboardPermission = usePermission(MenuType.DASHBOARD);
  const requestPermission = usePermission(MenuType.REQUEST);
  const driverPermission = usePermission(MenuType.DRIVER);
  const customerPermission = usePermission(MenuType.CUSTOMER);
  const chatPermission = usePermission(MenuType.CHAT);
  const { isProductAdmin } = usePermission(MenuType.DASHBOARD);
  const { isTenantView } = useTenantId();
  
  // const [transactionInitiatedCount, setTransactionInitiatedCount] = useState<TransactionInitiatedCount>(
  //   getInitialTransactionInitiatedCount()
  // );
  const {customerLastMonthCount, dashboardIndicators, totalWalletBalance, transactionInitiatedCount} = useSelector((state: RootState) => state.report);
  const [dashboardData, setDashboardData] = useState([
    ...generateInitialData()
  ]);
  const [walletModalVisible, setWalletModalVisible] = useState(false);
    const defaultRange = getDefaultStartAndEndMonth();
    
  
    const [startMonth, setStartMonth] = useState<string>(defaultRange.start);
    const [endMonth, setEndMonth] = useState<string>(defaultRange.end);


    useEffect(() => {
      if (totalWalletBalance.amount !== null) {
        setDashboardData(prev =>
          prev.map(item =>
            item.id === 1
              ? { ...item, amount: totalWalletBalance.amount ?? 0, currency: totalWalletBalance.currency ?? '' }
              : item
          )
        );
      }
    }, [totalWalletBalance]);

    useEffect(() => {
      if (dashboardIndicators) {
        // Update driver working today count (only if user has driver permission)
        if (driverPermission.hasAccess) {
          setDashboardData(prev =>
            prev.map(item =>
              item.id === 2
                ? { ...item, amount: dashboardIndicators?.driverWorkingToday ?? 0 }
                : item
            )
          );
        }
    
        // Update support request count (only if user has chat permission)
        if (chatPermission.hasAccess) {
          setDashboardData(prev =>
            prev.map(item =>
              item.id === 3
                ? { ...item, amount: dashboardIndicators?.supportRequestCount ?? 0 }
                : item
            )
          );
        }
      }
      return(()=>{
        resetReport()
      })
    }, [dashboardIndicators, driverPermission.hasAccess, chatPermission.hasAccess]);

  function handleAddNewPress(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
  }
  useEffect(() => {
    if (focus && !(isProductAdmin && !isTenantView)) {
        dispatch(fetchDashboardIndicatorsAction());
        dispatch(fetchCustomerLastMonthCountAction());
        dispatch(fetchTotalWalletBalanceAction());
        dispatch(fetchTransactionInitiatedCountAction());
    }
  }, [focus, isProductAdmin, isTenantView]);

  return (
    <>
      {isProductAdmin && !isTenantView ? (
        <BusinessAdminDashboard />
      ) : (
      <>
      <ScrollView>
        <View style={DashboardStyle.container}>
          <View style={[styles.headerContainer, layout.paddingTop26]}>
            <View style={styles.filterrow}>
              <Text style={layout.Adminh1Title}> {TranslateMessage('Admin.Delivery.App.Home')}</Text>
            </View>
          </View>
          <Divider style={[layout.DividerSperator, layout.marBottom20]} />
          {dashboardPermission.hasAccess && (
            <View
              style={[DashboardStyle.DashboardLeftRightLayout]}
            >
              <View style={[layout.flexCol, { minWidth: 400 }]}>
                <View style={[DashboardStyle.dashboardCardFlex]}>
                  {dashboardData
                    .filter((item) => {
                      // Filter cards based on permissions
                      if (item.id === 2 && !driverPermission.hasAccess) return false;
                      if (item.id === 3 && !chatPermission.hasAccess) return false;
                      return true;
                    })
                    .map((item) => (
                      <DashboardCard
                        key={item.id}
                        id={item.id}
                        amount={item.amount}
                        currency={item.currency ?? ''}
                        messageKey={item.messageKey}
                        // onPress={item.id === 1 ? () => setWalletModalVisible(true) : undefined}
                      />
                    ))}
                </View>
              <View style={DashboardStyle.RevenueBox}>
                <View style={[layout.flexCol, { minWidth: 400 }]}>

                  <View
                    style={[layout.cardBox, DashboardStyle.cardBoxLayout, layout.flexCol]}>
                    <View>
                      <Text style={[DashboardStyle.TextCardSubTitle]}>
                        {TranslateMessage('Admin.Delivery.App.New Customer')}
                      </Text>
                      <Text
                        style={[DashboardStyle.TextCard, DashboardStyle.heading2x, layout.textCenter]}
                      >
                        {customerLastMonthCount.data ?? ''}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[layout.cardBox, DashboardStyle.cardBoxLayout, layout.flexCol, DashboardStyle.mb12]}>
                    <View>
                      <Text style={[DashboardStyle.TextCardSubTitle]}>
                        {TranslateMessage('Admin.Delivery.App.Transaction.Initiated')}
                      </Text>
                      <Text
                        style={[DashboardStyle.TextCard, DashboardStyle.heading2x, layout.textCenter]} >
                        {transactionInitiatedCount?.totalCount ?? 0}
                      </Text>
                      
                    </View>
                  </View>
                </View>

                <View style={[layout.cardBox, layout.flexCol, { minWidth: 400,padding:8 }, DashboardStyle.mb12]}>
                  <SalesProfitChart startMonth={startMonth} endMonth={endMonth} />
                </View>
              </View>
              </View>
              <View style={[DashboardStyle.OuterWrap]}>
                <TopPerformerPage />
              </View>
            </View>
          )}
          {requestPermission.hasAccess  &&  (
            <View style={[layout.cardBox, layout.flexCol, DashboardStyle.mb12]}>
            <View style={[DashboardStyle.flexRow, layout.marBottom20]}>
              <Text style={[DashboardStyle.TextcardHeader]}>
                {TranslateMessage('Admin.Delivery.App.RequestManagementList.Heading')}
              </Text>
            </View>
            <RequestList isDashboard={true} />
            <Pressable onPress={() => router.push(Routes.REQUESTS)} >
              <Text style={DashboardStyle.viewAllStatus}>
                {TranslateMessage('Admin.Delivery.App.View.All')}
              </Text>
            </Pressable>
            </View>
          )}
          <View style={[layout.flexDirectionRow, layout.flexWrap]}>
            {driverPermission.hasAccess && !isProductAdmin && (
              <View style={[layout.cardBox, layout.flexCol, layout.cardTabSize]}>
              <View style={[DashboardStyle.flexRow, layout.marBottom20]}>
                <Text style={[DashboardStyle.TextcardHeader]}>
                  {TranslateMessage('Admin.Delivery.App.Driver.List')}
                </Text>
              </View>
              <DriverList isDashboard={true} />
              <Pressable onPress={() => router.push(Routes.DRIVER)} >
                <Text style={DashboardStyle.viewAllStatus}>
                  {TranslateMessage('Admin.Delivery.App.View.All')}
                </Text>
              </Pressable>
              </View>
            )}
            {customerPermission.hasAccess && (
              <View style={[layout.cardBox, layout.flexCol, layout.cardTabSize]}>
              <View style={[DashboardStyle.flexRow, layout.marBottom20]}>
                <Text style={[DashboardStyle.TextcardHeader]}>
                  {TranslateMessage('Admin.Delivery.App.Customer.List')}
                </Text>
              </View>
              <CustomerList isDashboard={true} />
              <Pressable onPress={() => router.push(Routes.CUSTOMER)} >
                <Text style={DashboardStyle.viewAllStatus}>
                  {TranslateMessage('Admin.Delivery.App.View.All')}
                </Text>
              </Pressable>
              </View>
            )}
          </View>
          {/* <View style={[layout.cardBox, layout.flexCol, DashboardStyle.flexbasis100]}>
            <View style={[DashboardStyle.flexRow, layout.marBottom20]}>
              <Text style={[DashboardStyle.TextcardHeader]}>
                {TranslateMessage('Admin.Delivery.App.Dashboard.RestaurantManagement')}
              </Text>
            </View>
            <RestaurantList isDashboard={true} />
            <Pressable onPress={() => router.push(Routes.RESTAURANTS)} >
              <Text style={DashboardStyle.viewAllStatus}>
                {TranslateMessage('Admin.Delivery.App.View.All')}
              </Text>
            </Pressable>
          </View> */}
        </View>
      </ScrollView>
      <WalletBalanceModal
        visible={walletModalVisible}
        available={totalWalletBalance.available}
        onClose={() => setWalletModalVisible(false)}
      />
      </>
      )}
    </>
  );
};
export default DashboardPageMenu;
