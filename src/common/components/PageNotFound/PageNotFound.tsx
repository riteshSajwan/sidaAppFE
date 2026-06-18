import React from 'react';
import { View, Image } from 'react-native';
import styles from 'src/common/components/PageNotFound/PageNotFoundStyle';
const NotFound = () => {
  return (
    <View style={styles.container}>
      <Image source={require('src/common/assets/images/pageNotFound.png')}></Image>
    </View>
  );
};

export default NotFound;