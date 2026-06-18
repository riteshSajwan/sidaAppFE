import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    alignSelf: 'center',
    maxWidth: 430,
    width: '100%',
    margin:'auto',
    paddingVertical: 40,
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    top: 10,
    left: 0,
    zIndex: 32,
  },
  loginBtn: {
    marginTop: '10%',
  },
  backgroundImg: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
  },
  wentWrongError: {
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default styles;
