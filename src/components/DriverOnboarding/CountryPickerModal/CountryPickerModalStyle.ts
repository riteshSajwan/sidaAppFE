import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useCountryPickerStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.colors.surfaceBase,
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right:0,
    top:theme.spacing.xs, 
   
  },
  searchbar: {
    marginBottom: theme.spacing.sm,
  },
  flatList: {
    flex: 1,
  },
  countryView: {

   height:'100%',
   width:'100%'
  },
  closetext:{
    color: theme.colors.textErrorDark,
    fontFamily:theme.fontFamily.medium,
    fontSize: theme.fontSize.textBodyLarge,
  },
  countrycheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surfaceLow,
  },
  countryflaglist: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderDisabled,
    minHeight: 60,
  },
  squareRadioButton: {
    width: 18,
    height: 18,
    borderRadius: theme.roundness.xxl,
    backgroundColor: theme.colors.surfaceErrorInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryName: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.textBodyLarge,
  },
  flag: {
    fontSize: theme.fontSize.textHeadingMedium,
  },
  tickMark: {
    color: theme.colors.surfaceSuccessInverse,
    fontSize: theme.fontSize.S1Subtitle,
    marginLeft: theme.spacing.sm,
  },
  listContent:{
   paddingVertical:theme.spacing.sm,
   paddingHorizontal:theme.spacing.xs
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginTop:theme.spacing.md,
  },
  clearButton: {
    position:'absolute',
    left: 'auto',
    right: theme.spacing.md,
  },
  clearText: {
    fontSize: theme.fontSize.textBodyLarge,
    color: theme.colors.textHeading,
  },
  deliveryHeading:{
    color:theme.colors.textHeading,
    fontSize:theme.fontSize.textHeadingMedium,
    fontFamily:theme.fontFamily.semiBold,
  },
  })
}