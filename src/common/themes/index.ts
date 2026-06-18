import darkTheme from 'src/common/themes/dark';
import lightTheme from 'src/common/themes/light';


export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeType = typeof lightTheme;
