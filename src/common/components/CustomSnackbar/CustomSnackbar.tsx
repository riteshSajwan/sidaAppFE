import React, { FunctionComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { SNACKBAR_DEFAULT_DURATION } from 'src/constants';

interface ICustomSnackbarProps {
  visible: boolean;
  message: string;
  duration?: number;
  type?:string;
  onDismiss: () => void;
  onOkPress?: () => void;
}

 export enum SnackbarType {
  SUCCESS = 'Success',
  WARNING = 'Warning',
}

const CustomSnackbar: FunctionComponent<ICustomSnackbarProps> = (props) => {
  const { visible, message, duration = SNACKBAR_DEFAULT_DURATION, type=SnackbarType.SUCCESS, onDismiss } = props;
  const button = useButtonStyle();
  if (!visible) {
    return null;
  }
  function renderStyle(){
    return type === SnackbarType.SUCCESS ? button.btnSuccess : button.btnDanger
  }
  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={duration}
        //in future we may need it
        // action={{
        //   label: 'OK',
        //   onPress: () => {
        //     if (onOkPress) {
        //       onOkPress(); // Call the navigation function
        //     }
        //     onDismiss(); // Dismiss the snackbar
        //   },
        // }}
        style={[renderStyle()]}
      >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    zIndex: 999,
  },
});

export default CustomSnackbar;
