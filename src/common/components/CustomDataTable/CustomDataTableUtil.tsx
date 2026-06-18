import { ReactNode } from 'react';
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { Icon } from 'src/submodules/iconlibrary/src';

interface TableColumn<T> {
  flex?: number;
  minWidth?: number;
  width?: number;
  key: keyof T | 'actions';
  title: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  style?: ViewStyle;
  cellTextStyle?: StyleProp<TextStyle>;
}

function renderStatus(activeStatus: boolean, tablestyle: ReturnType<typeof useTableStyle>) {
  return (
    <Text
      style={[
        tablestyle.statusText,
        activeStatus ? tablestyle.statusActive : tablestyle.statusInactive,
      ]}
    >
      {activeStatus ? 'Active' : 'InActive'}
    </Text>
  );
}

// function renderToggle(isServiceable: boolean, onActionPress: (id: number) => (newValue: boolean) => void, id: number) {
//   return <Switch
//     value={isServiceable}
//     color={color.color_EB3C36.color}
//     onValueChange={onActionPress(id)}
//   />

// }

function renderEditButton(handleEditPress: (id: number) => () => void, id: number, theme: ReturnType<typeof useAppTheme>['theme']) {
  return <Pressable onPress={handleEditPress(id)}>
    <Icon name='edit' color={theme.colors.iconBase} size={25} />
  </Pressable>
}


function renderLinkPress(handleCountryPress: (id: string) => () => void, name: string, id: string, theme: ReturnType<typeof useAppTheme>['theme']) {
  return (
    <Text
      style={{ color: theme.colors.textLinkDark, textDecorationLine: 'underline' }}
      onPress={handleCountryPress(id)}
    >
      {name}
    </Text>
  )
}

function renderViewDetails(
  id: string,
  onPress: (id: string) => () => void,
  tablestyle: ReturnType<typeof useTableStyle>,
  theme: ReturnType<typeof useAppTheme>['theme']
) {
  return (
    <Pressable
      style={tablestyle.actionContainer}
      onPress={onPress(id)}
    >
      <Icon name='infoOutline' color={theme.colors.iconBase} size={25} />
    </Pressable>
  );
}

function renderErrorMsgSection(error: string) {
  return <ErrorMessageContainer message={error} />;
}

function renderSortIcon(fieldName: string, sortField: string = '', sortOrder: string = '', tablestyle: ReturnType<typeof useTableStyle>) {
  return (
    sortField === fieldName && (
      <Text style={tablestyle.sortIcon}>
        {sortOrder == 'asc' ? '▲' : '▼'}
      </Text>
    )
  );
}

const DEFAULT_TABLE_SIZE = 10;

export { DEFAULT_TABLE_SIZE, renderEditButton, renderErrorMsgSection, renderLinkPress, renderSortIcon, renderStatus, renderViewDetails, TableColumn };

