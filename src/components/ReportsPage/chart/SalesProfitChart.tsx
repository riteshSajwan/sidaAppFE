import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomLineChart from 'src/common/components/CustomChart/Web/LineGraph';
import { getSaleProfitGraphAction } from 'src/common/service/report/action';
import { useReportStyle } from 'src/components/ReportsPage/ReportsDetailsStyle';
import {NewChartProps,} from 'src/components/ReportsPage/ReportUtil';
import { AppDispatch, RootState } from 'src/store';

const SalesProfitChart = (props: NewChartProps) => {
  const { t: TranslateMessage } = useTranslation();
  const { startMonth, endMonth } = props;
  const focus = useIsFocused();
  const ReportStyle = useReportStyle();
  const { data } = useSelector((state: RootState) => state.report.saleProfitGraph);
	const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (focus) {
      dispatch(getSaleProfitGraphAction(startMonth, endMonth));
    }
  }, [focus, startMonth, endMonth]);

  return (
    <View>
      <View style={ReportStyle.progressHeader}>
        <Text style={ReportStyle.headTitle}>
          {TranslateMessage('Admin.Delivery.App.Sale')}
        </Text>
      </View>
      {data?.sales.length > 0 && data?.profit.length > 0? 
        <CustomLineChart
          	data={data?.sales}
          	data2={data?.profit}
          	height={220}
          	firstLabel={TranslateMessage('Admin.Delivery.App.Sales')}
          	secondLabel={TranslateMessage('Admin.Delivery.App.Profit')}
          />
        : null}
    </View>
  );
};

export default SalesProfitChart;
