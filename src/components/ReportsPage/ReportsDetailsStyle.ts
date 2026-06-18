import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useReportStyle = () => {
	const { theme } = useAppTheme();
	return StyleSheet.create({
	container: {

	},
	reportCardBox: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		columnGap: theme.spacing.xxl,
		justifyContent: 'space-between',
		marginTop: theme.spacing.lg,
		marginBottom: theme.spacing.lg * 2,
	},
	downLoadBtnCol: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},

	progressRevenChart: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: theme.spacing.lg * 2,
	},
	progressHeader: {
		flexDirection: 'row',
		columnGap: theme.spacing.xxl,
		justifyContent: 'space-between',
		marginBottom: theme.spacing.xl,
	},
	headTitle: {
		fontSize: theme.fontSize.S1Subtitle,
		fontFamily: theme.fontFamily.semiBold,
		color: theme.colors.textBody,
	},
	chartCol: {
		minWidth: 400,
		flex:1
	},
	profitTitleBar: {
		flexDirection: 'row',
		gap: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dataIndicator: {
		width: 10,
		height: 10,
		borderRadius: theme.roundness.md,
		backgroundColor: theme.colors.surfaceErrorBase
	},
	dataIndicatorTitle: {
		fontSize: theme.fontSize.S2Subtitle,
		color: theme.colors.textBody,
		fontFamily: theme.fontFamily.semiBold,
	},
	});
}
