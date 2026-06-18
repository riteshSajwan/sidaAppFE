import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomBarChart from 'src/common/components/CustomChart/Web/BarGraph';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchDriverGraphAction } from 'src/common/service/report/action';
import { useReportStyle } from 'src/components/ReportsPage/ReportsDetailsStyle';
import {NewChartProps,} from 'src/components/ReportsPage/ReportUtil';
import { AppDispatch, RootState } from 'src/store';

const NewDriversChart = (props: NewChartProps) => {
  const { startMonth, endMonth } = props;
  const { t: TranslateMessage } = useTranslation();
  const focus = useIsFocused();
  const ReportStyle = useReportStyle();
  const {theme} = useAppTheme();
  const { data:drivers } = useSelector((state: RootState) => state.report.driverGraph);
	const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (focus) {
      dispatch(fetchDriverGraphAction(startMonth, endMonth));
    }
  }, [focus, startMonth, endMonth]);

  return (
    <View style={{ backgroundColor: theme.colors.surfaceBase, borderRadius: theme.roundness.lg }}>
      <View style={ReportStyle.progressHeader}>
        <Text style={ReportStyle.headTitle}>
          {TranslateMessage('Admin.Delivery.App.New.Drivers')}
        </Text>
      </View>
      {drivers.length > 0
        ? 
        <CustomBarChart
            data={drivers}
            frontColor={theme.colors.surfaceInverse}
            roundedTop
            valuePosition={'outside'}
            height={220}
          />
        : null}
    </View>
  );
};

export default NewDriversChart;
