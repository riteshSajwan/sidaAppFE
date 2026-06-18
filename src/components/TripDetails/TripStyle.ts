import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useTripStyle = () => {
	const { theme } = useAppTheme();
	return StyleSheet.create({
		userImg:{
			width: 80,
			height: 80,
			borderRadius: theme.roundness.xl * 2,
			borderWidth: 2,
			borderStyle: 'solid',
			borderColor: theme.colors.borderMedium
		},
		tripDetail:{
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: theme.colors.borderMedium,
			borderRadius: theme.roundness.xs,
			padding: theme.spacing.md,
			flexDirection: 'row',
			columnGap: theme.spacing.md,
		},
		tripTimeCol:{
			height: '100%',
			justifyContent: 'space-between',
			paddingTop: theme.spacing.xs,
		},
		straightLine:{
			borderStyle: 'dashed',
			borderLeftWidth: 1,
			borderColor: theme.colors.borderMedium,
			transform: [{ rotate: '180deg' }],
			width: 1,
			flex: 1,
			marginLeft: theme.spacing.sm,
			marginVertical: theme.spacing.xs,
		},
		divider:{
			backgroundColor: theme.colors.borderDisabled,
			marginVertical: 10
		},
		billDetail:{
			rowGap: 10,
		},
		listItem: {
			paddingVertical: 0,
			paddingLeft: 0,
			paddingRight: 0,
		},
		destinationDetail: {
			flexDirection: 'row',
			columnGap: theme.spacing.md,
			alignItems: 'stretch',
		},
		destinationTimeline: {
			alignItems: 'center',
			paddingVertical: theme.spacing.xs,
			width: 30,
		},
		destinationLine: {
			flex: 1,
			borderLeftWidth: 1,
			borderStyle: 'dashed',
			borderColor: theme.colors.borderMedium,
			marginVertical: theme.spacing.xs,
		},
		destinationContent: {
			flex: 1,
			justifyContent: 'space-between',
		},
		destinationRow: {
			flexDirection: 'row',
			alignItems: 'center',
			columnGap: theme.spacing.sm,
		},
		locationStack: {
			rowGap: theme.spacing.sm,
		},
		locationItem: {
			flexDirection: 'row',
			columnGap: theme.spacing.md,
			alignItems: 'stretch',
		},
		locationMarkerWrap: {
			width: 30,
			alignItems: 'center',
			paddingTop: 4,
		},
		locationMarkerConnector: {
			flex: 1,
			borderLeftWidth: 1,
			borderStyle: 'dashed',
			borderColor: theme.colors.borderMedium,
			marginVertical: theme.spacing.xs,
		},
		locationMarkerBadge: {
			width: 22,
			height: 22,
			borderRadius: theme.roundness.xl,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: theme.colors.surfaceInverse,
		},
		locationBody: {
			flex: 1,
			paddingBottom: theme.spacing.sm,
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.borderDisabled,
		},
		locationBodyLast: {
			paddingBottom: 0,
			borderBottomWidth: 0,
		},
		locationMetaRow: {
			flexDirection: 'row',
			alignItems: 'center',
			columnGap: theme.spacing.sm,
			marginBottom: theme.spacing.xs,
		},
		chatButton: {
			borderRadius: theme.roundness.xxl,
			height: 40,
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: theme.spacing.sm,
			flexDirection: 'row',
			gap: theme.spacing.xs,
		},
		cancelButton: {
			backgroundColor: theme.colors.surfaceBase,
			borderColor: theme.colors.borderErrorInverse,
			borderWidth: 1,
			borderRadius: theme.roundness.xxl,
			height: 40,
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: theme.spacing.sm,
		},
		statusButton: {
			borderWidth: 1,
			borderRadius: theme.roundness.xxl,
			height: 40,
			paddingTop: theme.spacing.xs,
		},
	})
}
