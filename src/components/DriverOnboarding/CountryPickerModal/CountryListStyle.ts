import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useCountryStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    listItemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderMedium,
        margin: 0,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagIcon: {
        width: 26,
        height: 26,
        marginRight: theme.spacing.sm,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countryText: {
        fontSize: theme.fontSize.textBodyLarge,
        fontFamily: theme.fontFamily.regular,
        color: theme.colors.textBodyLight,
    },
    squareRadioButton: {
        width: 24,
        height: 24,
        borderRadius: theme.roundness.xxl,
        backgroundColor: theme.colors.textErrorDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flag: {
        fontSize: theme.fontSize.textHeadingMedium,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    clearButton: {
        position: 'absolute',
        left: 'auto',
        right: theme.spacing.md,
    },
    clearText: {
        fontSize: theme.fontSize.textBodyLarge,
        color: theme.colors.textNeutral,
    },
    })
}