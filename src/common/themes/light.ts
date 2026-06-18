import { lightThemeColor } from 'src/common/assets/styles/variables/colors';
import { lightThemeIconColor } from 'src/common/assets/styles/variables/iconColors';
import { lightThemeTile } from 'src/common/assets/styles/variables/mapTile';
import defaultTheme from 'src/common/themes/default';

const lightTheme = {
  ...defaultTheme,
  colors: {
    ...lightThemeColor
  },
  fontSize: {
    ...defaultTheme.fontSize,
  },
  fontFamily: {
    ...defaultTheme.fontFamily,
  },
  iconColor: {
    ...lightThemeIconColor
  },
  mapTileURL: {
    ...lightThemeTile
  },
};

export default lightTheme;
