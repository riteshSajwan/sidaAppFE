import AsyncStorage from '@react-native-async-storage/async-storage';

function setUserToken(tokenValue: string) {
  return AsyncStorage.setItem('token', tokenValue)
    .then(() => true)
    .catch((err) => {
      console.error('Error setting the token:', err);
      return null;
    });
}

function getUserToken() {
  return AsyncStorage.getItem('token')
    .then((token) => token)
    .catch((err) => {
      console.error('Error fetching the token:', err);
      return null;
    });
}

function removeUserToken() {
  return AsyncStorage.removeItem('token')
    .then(() => true)
    .catch((err) => {
      console.error('Error removing the token:', err);
      return null;
    });
}

export { getUserToken, removeUserToken, setUserToken };

