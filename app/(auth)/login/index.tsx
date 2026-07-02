import { StyleSheet, View } from 'react-native';
import LoginContainer from 'src/components/Auth/Login/Login';

export default function LoginPage() {
  return (
    <View style={styles.fill}>
      <LoginContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#1a3fbd',
  },
});
