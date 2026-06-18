import { darkThemeColor } from 'src/common/assets/styles/variables/colors';
import { darkThemeIconColor } from 'src/common/assets/styles/variables/iconColors';
import defaultTheme from 'src/common/themes/default';
import { darkThemeTile } from '../assets/styles/variables/mapTile';

const darkTheme = {
  ...defaultTheme,
  colors: {
    ...darkThemeColor,
  },
  fontSize: {
    ...defaultTheme.fontSize,
  },
  fontFamily: {
    ...defaultTheme.fontFamily,
  },
  iconColor: {
    ...darkThemeIconColor
  },
  mapTileURL: {
    ...darkThemeTile
  },
};

export default darkTheme;
