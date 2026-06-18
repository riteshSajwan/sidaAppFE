import { useIsFocused } from '@react-navigation/native';
import React, { useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomBarChart from 'src/common/components/CustomChart/Web/BarGraph';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchCustomerGraphAction } from 'src/common/service/report/action';
import { useReportStyle } from 'src/components/ReportsPage/ReportsDetailsStyle';
import {NewChartProps } from 'src/components/ReportsPage/ReportUtil';
import { AppDispatch, RootState } from 'src/store';

const NewCustomersChart = (props: NewChartProps) => {
	const { startMonth, endMonth } = props
	const { t: TranslateMessage } = useTranslation();
	const {theme} = useAppTheme();
	const ReportStyle = useReportStyle();
	const focus = useIsFocused();
	const { data:customers } = useSelector((state: RootState) => state.report.customerGraph);
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		if (focus) {
			dispatch(fetchCustomerGraphAction(startMonth, endMonth));
		}
	}, [focus, startMonth, endMonth]);

	return (
		<View style={{ backgroundColor: theme.colors.surfaceBase, borderRadius: theme.roundness.lg }}>
			<View style={ReportStyle.progressHeader}>
				<Text style={ReportStyle.headTitle}>{TranslateMessage('Admin.Delivery.App.New Customer')}</Text>
			</View>

			{
				customers.length > 0 ? 
					<CustomBarChart data={customers} valuePosition={'inside'} height={220} />
					: null
			}
		</View>
	);
};

export default NewCustomersChart;
