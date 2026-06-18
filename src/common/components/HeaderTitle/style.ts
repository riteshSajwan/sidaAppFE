import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
export const useAppbarStyle = () => {
  const {theme} = useAppTheme();
return StyleSheet.create({
  appbarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'transparent',
    // borderColor: theme.colors.borderMedium,
    // borderStyle: 'solid',
    // borderBottomWidth: 1,
    padding: 0,
    marginBottom: theme.spacing.xxl,
  },
  appbarTitle: {
    fontSize: theme.fontSize.textHeadingLarge,
    color: theme.colors.textBody,
    fontFamily: theme.fontFamily.semiBold,
    lineHeight: theme.fontSize.textHeadingLarge * 1.4,
  },
});

}
