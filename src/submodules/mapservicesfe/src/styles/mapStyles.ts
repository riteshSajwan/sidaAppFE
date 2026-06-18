import { Dimensions, StyleSheet } from 'react-native';
import color from '../common/assets/styles/color';
import { isIOSPlatform } from '../common/utils/platformUtil';
import { ITheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const mapStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.color_F5F5F5.color,
    },
    map: {
      flex: 1,
    },
    traveledCard: {
      position: 'absolute',
      top: 20,
      alignSelf: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: 12,
      borderRadius: 12,
      elevation: 5,
      shadowColor: color.color_000000.color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    traveledText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: color.color_007BFF.color
    },
    errorText: {
      textAlign: 'center',
      fontSize: 18,
      color: 'red',
      margin: 20,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
      backgroundColor: color.color_ffffff.color,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      margin: 20,
      maxWidth: '80%',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18
    },
    buttonContainer: {
      backgroundColor: color.color_2196F3.color,
      borderRadius: 20,
      padding: 10
    },
    buttonText: {
      color: color.color_ffffff.color,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingHorizontal: 20
    },
    mapCommonLayout:{
        backgroundColor: color.color_ffffff.color,
        overflow: 'hidden',
        flex:1
    },
    NoDeliveryMaplayout: {
      height: isIOSPlatform() ? screenHeight * 0.69 : screenHeight * 0.76,
    },
    maplayout: {
      width: '100%',
      height: isIOSPlatform() ? screenHeight * 0.61 : screenHeight * 0.59,
      backgroundColor: '#fff',
      overflow: 'hidden',
      flex: 1,
    },
    sourceIconView:{
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -24,
      marginTop: -48,
    },
    suggestionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      width: screenWidth - 52,
    },
    searchTxtWrap: {
      flex: 1,
    },
    mainText: {
      fontSize: 16,
      color: '#000000',
      fontFamily: 'Barlow500',
    },
    secondaryText: {
      fontSize: 16,
      color: '#6B6B6B',
      fontFamily: 'Barlow400',
    },
    iconContainer: {
      position: 'absolute',
      left: 10,
      top: 15,
      zIndex: 1,
    },
    suggestionicon: {
      marginRight: 10,
      marginLeft: -10,
    },
    textInput: {
      flex: 1,
      height: 50,
      paddingLeft: 40,
      paddingRight: 10,
      borderWidth: 1,
      borderColor: '#A6A6A6',
      borderRadius: 8,
      backgroundColor: '#fff',
      fontSize: 16,
      fontFamily:'Barlow400',
    },
    customGoogleListView: {
      position: 'absolute',
      top: 50,
      zIndex: 5,
    },
    addressList: {
      position: 'absolute',
      top: 52,
      left: 0,
      right: 0,
      zIndex: 999,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      maxHeight: 140,
      paddingVertical: 4,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      paddingBottom: 20
    },
    inputPlaceholderLabel: {
      color: color.color_676767.color,
      fontFamily: 'Barlow400',
      fontSize: 16,
      borderRadius: 4
    },
    inputField: {
      borderColor: color.textfield_border_color.color,
      backgroundColor: color.textfield_bg_color.color,
      fontFamily: 'Barlow400',
      fontSize: 16,
      color: color.text_primary.color,
      lineHeight: 18,
      borderRadius: 4,
      height: 48,
    },
    flexCol: {
      flex: 1,
    },
    flexColumn:{
      flexdirection:'column'
    },
    mt30:{
      marginTop: 30
    },
    p10:{
      padding: 10
    },
    bothAddressBox:{
      borderStyle: 'solid',
      borderColor: color.color_000000.color,
      borderWidth: 1,
      paddingVertical: 20,
      margin: 10,
      padding:10,
      borderRadius: 6,
      gap: 20,
      position:'relative',
      backgroundColor:color.color_ffffff.color
    }
});

export default mapStyles;
