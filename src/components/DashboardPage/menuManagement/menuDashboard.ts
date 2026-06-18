import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
export const useMenuDashboardStyle = () => {
  const {theme} = useAppTheme();
return StyleSheet.create({
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
    flexWrap: 'wrap',
    marginBottom: theme.spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  paginationTitle: {
    fontSize: theme.spacing.lg,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.textBody,
  },
  menuItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex:1,
  },
  itemImg: {
    height: 60,
    borderRadius: theme.roundness.sm,
    width:60,
    maxWidth:'100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.colors.borderMedium,
    backgroundColor: theme.colors.surfaceBase,
    justifyContent:'center',
    alignItems:'center',
    display:'flex',
  },
  itemTitle: {
    fontSize: theme.fontSize.textBodyMedium,
    fontFamily: theme.fontFamily.medium,
    lineHeight: theme.fontSize.textBodyMedium * 1.4,
    color: theme.colors.textBody,
    marginBottom: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: theme.fontSize.textBodyMedium,
    fontFamily: theme.fontFamily.regular,
    lineHeight: theme.fontSize.textBodyMedium * 1.4,
    color: theme.colors.textBody,
  },
  itemLabelContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
  },
  itemLabel: {
    flexDirection: 'row',
    gap: 2,
    backgroundColor: theme.colors.surfaceWarningBase,
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.roundness.xl,
  },
  itemLabelText: {
    fontSize: theme.fontSize.textLabelTiny,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.textBody,
  },
});
}
