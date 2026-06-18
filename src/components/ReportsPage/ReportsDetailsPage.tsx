import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomMonthYearRangePicker from 'src/common/components/CustomMonthPicker/CustomMonthPicker';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import { fetchCustomerLastMonthCountAction, fetchDashboardIndicatorsAction, fetchTotalWalletBalanceAction } from 'src/common/service/report/action';
import { resetReport } from 'src/common/service/report/slice';
import DashboardCard from 'src/components/DashboardPage/DashBoardCard';
import WalletBalanceModal from 'src/components/DashboardPage/WalletBalanceModal';
import { generateInitialData, getDefaultStartAndEndMonth } from 'src/components/ReportsPage/ReportUtil';
import { useReportStyle } from 'src/components/ReportsPage/ReportsDetailsStyle';
import NewCustomersChart from 'src/components/ReportsPage/chart/NewCustomersChart';
import NewDriversChart from 'src/components/ReportsPage/chart/NewDriversChart';
import SalesProfitChart from 'src/components/ReportsPage/chart/SalesProfitChart';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { AppDispatch, RootState } from 'src/store';

const ReportsDetailsPage = () => {
  const layout = useLayoutStyle();
  const styles = useRestroStyle();
  const ReportStyle = useReportStyle();

  const { t: TranslateMessage } = useTranslation();
  const focus = useIsFocused();
  const [reportData, setReportData] = useState([
    ...generateInitialData()
  ]);
  const language = useSelector((state: RootState) => state.profile.data?.language);
  const defaultRange = getDefaultStartAndEndMonth();
  const {customerLastMonthCount,dashboardIndicators,customerGraph,driverGraph,saleProfitGraph,totalWalletBalance} = useSelector((state: RootState) => state.report);
  const dispatch = useDispatch<AppDispatch>();
  const [startMonth, setStartMonth] = useState<string>(defaultRange.start);
  const [endMonth, setEndMonth] = useState<string>(defaultRange.end);
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  useEffect(() => {
    if (totalWalletBalance.amount !== null) {
      setReportData(prev =>
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
      setReportData(prev =>
        prev.map(item =>
          item.id === 2
            ? { ...item, amount: dashboardIndicators?.driverWorkingToday ?? 0 }
            : item
        )
      );
  
      setReportData(prev =>
        prev.map(item =>
          item.id === 3
            ? { ...item, amount: dashboardIndicators?.supportRequestCount ?? 0 }
            : item
        )
      );
    }
  }, [dashboardIndicators]);
  
  const reset =()=>{
    setStartMonth(defaultRange.start);
    setEndMonth(defaultRange.end)
  }

  useEffect(() => {
    if (focus) {
      dispatch(fetchDashboardIndicatorsAction());
      dispatch(fetchCustomerLastMonthCountAction());
      dispatch(fetchTotalWalletBalanceAction());
    }
    else{
      reset()
    }
    return(()=>{
      dispatch(resetReport());
    })
  }, [focus]);

  const handleRangeSelect = (start: string, end: string) => {
    setStartMonth(start);
    setEndMonth(end);
  };

  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }
  return (
    <>
      <ScrollView>
        <View style={[layout.containerPadding]}>
          {/* <View
            style={[
              styles.headerContainer,
              layout.paddingTop26,
              { flexWrap: 'wrap' },
            ]}
          >
            <View style={styles.filterrow}>
              <Text style={[layout.Adminh1Title, layout.serviceTopHeader]}>
                {TranslateMessage('Admin.Delivery.App.Reports')}
              </Text>
            </View>
          </View>
          <Divider style={[layout.DividerSperator, {marginBottom: 15}]} /> */}
          {/* <View style={ReportStyle.downLoadBtnCol}>
            <Pressable>
              <Text style={[button.filterBtn, button.btnOutlineDanger, { paddingHorizontal: 22 }]}>
                <IconButton
                  style={[timing.icon, { width: 15, marginRight: 5}]}
                  icon='arrow-collapse-down'
                  size={15}
                  iconColor='#EB3C36'
                />
                {TranslateMessage('Admin.Delivery.App.Downoload.Reports')}
              </Text>
            </Pressable>
          </View> */}
          <View style={ReportStyle.reportCardBox}>
            {reportData.map((item) => (
              <DashboardCard
                key={item.id}
                id={item.id}
                amount={item.amount}
                currency={item.currency ?? ''}
                messageKey={item.messageKey}
                onPress={item.id === 1 ? () => setWalletModalVisible(true) : undefined}
              />
            ))}
          </View>
          <View style={[styles.filterContainer, layout.containerPadding, layout.justifyEnd]}>
            <View style={{width: 400}}>
              <CustomMonthYearRangePicker
                startMonthYear={startMonth}
                endMonthYear={endMonth}
                onRangeSelect={handleRangeSelect}
                placeholder={TranslateMessage('Admin.Delivery.App.Select.Month.Range')}
                locale={language ?? 'en'}
              />
            </View>
          </View>
          <Loader loading={customerLastMonthCount.loading || dashboardIndicators.loading || totalWalletBalance.loading || customerGraph.loading || driverGraph.loading || saleProfitGraph.loading}/>

          <View style={ReportStyle.progressRevenChart}>
            <View style={[layout.cardBox, layout.flexCol, ReportStyle.chartCol,{width:380}]}>
              <SalesProfitChart startMonth={startMonth} endMonth={endMonth}/>
            </View>
            <View style={[layout.cardBox, layout.flexCol, ReportStyle.chartCol,{width:380}]}>
              <NewCustomersChart startMonth={startMonth} endMonth={endMonth} />
            </View>
          </View>

          <View style={ReportStyle.progressRevenChart}>
            <View style={[layout.cardBox, layout.flexCol, ReportStyle.chartCol,{width:380}]}>
              <NewDriversChart startMonth={startMonth} endMonth={endMonth} />
            </View>
          </View>
        </View>
      </ScrollView>
      <WalletBalanceModal
        visible={walletModalVisible}
        available={totalWalletBalance.available}
        onClose={() => setWalletModalVisible(false)}
      />
      {renderErrorMsg(customerLastMonthCount?.error || dashboardIndicators?.error || totalWalletBalance.error || customerGraph.error || driverGraph.error || saleProfitGraph.error || '')}
    </>
  );
};

export default ReportsDetailsPage;
