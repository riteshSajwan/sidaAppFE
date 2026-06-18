import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
// import StyleSheet from 'react-native-media-query';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const media = StyleSheet.create({
  leftSideBar: {
    // width: 0,
    // backgroundColor: color.sidebar_bg_color.color,
    // position: 'absolute',
    // zIndex: 100,
    // minHeight: screenHeight,
    // top: 0,
    // paddingVertical: 60,
  },
  rightColMob: {
    flex: 1,
    paddingTop: 24,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default media;
