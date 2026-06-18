import { appFontFamily } from 'src/common/assets/styles/variables/fonts';

const defaultTheme = {
  
  fontSize: {
    textHeadingLarge: 28,
    textHeadingMedium: 24,
    S1Subtitle: 18,
    S2Subtitle: 16,
    textBodyLarge: 16,
    textBodyMedium: 14,
    textCaptionS: 12,
    textCaptionTiny: 10,
    textLabelSmall: 12,
    textLabelTiny: 10,
    textButtonLarge: 16,
    textButtonMedium: 14,
    textButtonSmall: 12,
    textButtonTiny: 10,
  },
  fontFamily: {
    ...appFontFamily
  },
  spacing: {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 25,
    xxl: 30,
  },
  roundness:{
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  }
};

export default defaultTheme;
