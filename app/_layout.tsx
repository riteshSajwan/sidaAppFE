import { useJsApiLoader } from '@react-google-maps/api';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
    Platform,
    SafeAreaView,
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { AppThemeProvider, useAppTheme } from 'src/common/context/AppTheme';
import { useCredentials } from 'src/common/hook/useCredentials';
import i18next from 'src/i18n/i18nConfig';
import { initializeLanguage } from 'src/i18n/i18nUtils';
import { store } from 'src/store';

const GOOGLE_LIBRARIES: ['places'] = ['places'];

// Only mounts when apiKey is available — prevents calling useJsApiLoader with empty key
const GoogleMapsLoader = ({ apiKey }: { apiKey: string }) => {
  useJsApiLoader({ googleMapsApiKey: apiKey, libraries: GOOGLE_LIBRARIES });
  return null;
};

// Load fonts once on app start
async function loadFont() {
   Font.loadAsync({
    Poppins300: require('src/common/assets/font/Poppins-Light.ttf'),
    Poppins400: require('src/common/assets/font/Poppins-Regular.ttf'),
    Poppins500: require('src/common/assets/font/Poppins-Medium.ttf'),
    Poppins600: require('src/common/assets/font/Poppins-SemiBold.ttf'),
    Poppins700: require('src/common/assets/font/Poppins-Bold.ttf'),
    Poppins800: require('src/common/assets/font/Poppins-ExtraBold.ttf'),
  });
}
loadFont();

const MainLayout = () => {
  const credentials = useCredentials();
  const googlePlaceApiKey = credentials?.googleApiKey;

  useEffect(() => {
    initializeLanguage();

    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      const css = `
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #edebeb inset; 
        }
      `;
      style.innerHTML = css;
      document.head.append(style);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18next}>
        <AppThemeProvider>
          <PaperProvider settings={{ rippleEffectEnabled: false }}>
            <Provider store={store}>
              {googlePlaceApiKey ? <GoogleMapsLoader apiKey={googlePlaceApiKey} /> : null}
              <InnerLayout />
            </Provider>
          </PaperProvider>
        </AppThemeProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};

const InnerLayout = () => {
   const { theme } = useAppTheme();
  const layout = useLayoutStyle();
  const defaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background:   theme.colors.surfaceLow
   
    },
  };
   
  return (
    <SafeAreaView style={layout.safeAreaView}>
      <ThemeProvider value={defaultTheme}>
        <Slot />
      </ThemeProvider>
    </SafeAreaView>
  );
};

export default MainLayout;
