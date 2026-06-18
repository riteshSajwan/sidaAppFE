import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useAppTheme } from 'src/common/context/AppTheme';

enum LoaderSizeType {
  SMALL = 'small',
  LARGE = 'large',
}

type LoaderSize = LoaderSizeType | number;

interface ILoaderProps {
  loading?: boolean;
  size?: LoaderSize;
  color?:string,
  styles?:object,
  
 

}

export const Loader = ({
  loading,
  size = LoaderSizeType.LARGE,
  styles,
  color
}: ILoaderProps) => {
  // const { primary } = theme.colors;
  const { theme } = useAppTheme();
  const layout = useLayoutStyle();
  return (
    loading ? <View style={[styles ?? layout.loader]}>
      <ActivityIndicator animating={loading} color={color || theme.colors.themeIcon} size={size} hidesWhenStopped={!loading} />
    </View> : null

  );
};
