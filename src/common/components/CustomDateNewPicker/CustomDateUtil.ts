import { useAppTheme } from "src/common/context/AppTheme";

export const useCalendarTheme = () => {
    const { theme } = useAppTheme();
  
    return {
    backgroundColor: theme.colors.surfaceBase,
    calendarBackground: theme.colors.surfaceBase,
    textSectionTitleColor: theme.colors.textNeutral,
    selectedDayBackgroundColor: theme.colors.textBody,
    selectedDayTextColor: theme.colors.textInverse,
    todayTextColor:theme.colors.textBody,
    dayTextColor: theme.colors.textBody,
    textDisabledColor: theme.colors.textOnDisabled,
    dotColor:theme.colors.textBody,
    selectedDotColor: theme.colors.textInverse,
    arrowColor: theme.colors.textBody,
    monthTextColor: theme.colors.textBody,
    indicatorColor:theme.colors.textBody,
    textDayFontFamily: theme.fontFamily.regular,
    textMonthFontFamily: theme.fontFamily.regular,
    textDayHeaderFontFamily: theme.fontFamily.regular,
    textDayFontSize: theme.spacing.sm,
    textMonthFontSize: theme.spacing.md,
    textDayHeaderFontSize: theme.spacing.sm,
};
}