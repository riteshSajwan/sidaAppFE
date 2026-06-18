import React, { useState } from 'react';
import { Pressable, ScrollView, StyleProp, Text, TextStyle, useWindowDimensions, View, ViewStyle } from 'react-native';
import { DataTable, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import {
  renderErrorMsgSection,
  renderSortIcon,
  TableColumn,
} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';

// Base type that includes expected props
  export interface TableRowBase {
  id?: string | number;
  requestName?: string;
  textsDisabled?: boolean;
  emailsDisabled?: boolean;
}

interface CustomDataTableProps<T extends TableRowBase> {
  data: T[];
  columns: TableColumn<T>[];
  numberOfPages: number;
  page: number;
  rowsPerPage: number;
  totalItems: number;
  error: string;
  onPageChange: (page: number) => void;
  sortField?: string;
  sortOrder?: string;
  onSort?: (key: keyof T) => void;
  headerStyle?: ViewStyle;
  rowStyle?: ViewStyle;
  cellStyle?: StyleProp<TextStyle>;
  paginationLabel?: (from: number, to: number, total: number) => string;
  hidePagination?: boolean;
  renderRowDetails?: (id?: string | number, title?: string,textsDisabled ?:boolean,emailsDisabled?:boolean) => () => void;
  cellContentAlign?: 'left' | 'center';
  headerContentAlign?: 'left' | 'center';
}

const CustomDataTable = <T extends TableRowBase>({
  data,
  columns,
  page,
  rowsPerPage,
  sortField,
  totalItems,
  error,
  numberOfPages,
  onPageChange,
  sortOrder,
  onSort,
  headerStyle,
  rowStyle,
  hidePagination = false,
  cellStyle,
  paginationLabel = (from, to, total) => `${from}-${to} of ${total}`,
  renderRowDetails,
  cellContentAlign = 'left',
  headerContentAlign = 'left',
}: CustomDataTableProps<T>) => {
  const [hoveredItems, setHoveredItems] = useState<boolean[]>([]);

  const handleSort = (key: keyof T) => {
    if (onSort) onSort(key);
  };

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(item);
    }
    if (column.key === 'actions') {
      return null;
    }
    const value = item[column.key as keyof T];
    return value !== undefined && value !== null ? String(value) : null;
  };

  const handleMouseEnter = (index: number) => {
    const temp: boolean[] = [];
    temp[index] = true;
    setHoveredItems(temp);
  };
  

  const handleMouseLeave = () => {
    setHoveredItems([]);
  };
  const tablestyle = useTableStyle();
  const layout = useLayoutStyle();
  const {theme} = useAppTheme();
  const isCellContentCentered = cellContentAlign === 'center';
  const isHeaderContentCentered = headerContentAlign === 'center';
  const { width: screenWidth } = useWindowDimensions();
  const estimatedColumnWidth = 120;
  const contentWidth = columns.length * estimatedColumnWidth;
  const tableMinWidth =
    screenWidth < 1200
      ? Math.max(contentWidth, screenWidth)
      : '100%';
  const paginationTheme = {
    ...MD3LightTheme,
    colors: {
      primary: theme.colors.surfaceInverse,   // active page highlight
      onSurfaceVariant: theme.colors.textBody, // label text
      onSurface: theme.colors.iconBase,        // arrow icon color
      outline: theme.colors.borderMedium,       // disabled arrow
    }
  };
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={layout.flexCol} contentContainerStyle={layout.flexCol}>
      <DataTable style={{ minWidth: tableMinWidth }}>
        {/* Table Header */}
        <DataTable.Header style={{ padding: 0, borderBottomColor: theme.colors.borderDisabled, borderBottomWidth: 1 }}>
          {columns.map((column) => (
            <DataTable.Title
              key={String(column.key)}
              onPress={column.sortable ? () => handleSort(column.key as keyof T) : undefined}
              style={[
                column.style, 
                layout.checkBoxTableHeader,
                { justifyContent: isHeaderContentCentered ? 'center' : 'flex-start' },
                column.width !== undefined && { width: column.width, maxWidth: column.width },
                column.minWidth !== undefined && { minWidth: column.minWidth },
                column.flex !== undefined && { flex: column.flex }
   
              ]}
            >
              <Text
                style={[
                  tablestyle.headerText,
                  { width: '100%', textAlign: isHeaderContentCentered ? 'center' : 'left' }
                ]}
              >
                {column.title}
                {column.sortable && renderSortIcon(String(column.key), sortField, sortOrder, tablestyle)}
              </Text>
            </DataTable.Title>
          ))}
        </DataTable.Header>

        {/* Table Rows */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item, index) => (
            <Pressable
              key={index}
              onHoverIn={() => handleMouseEnter(index)}
              onHoverOut={handleMouseLeave}
              style={{ backgroundColor: hoveredItems[index] ? theme.colors.surfaceLow : 'transparent' }}
            >
              <DataTable.Row
                key={index}
                style={{
                  paddingVertical: theme.spacing.sm,
                  paddingHorizontal: 0,
                  borderBottomColor: theme.colors.borderDisabled,
                }}
                onPress={() => {
                  if (renderRowDetails) {
                    renderRowDetails(item.id, item.requestName, item.textsDisabled,item.emailsDisabled)?.();
                  }
                }}
              >
                {columns.map((column) => (
                  <DataTable.Cell key={String(column.key)}  style={[
                    layout.checkBoxTableHeader,
                    { justifyContent: isCellContentCentered ? 'center' : 'flex-start' },
                    column.width !== undefined && { width: column.width, maxWidth: column.width },
                    column.minWidth !== undefined && { minWidth: column.minWidth },
                    column.flex !== undefined && { flex: column.flex }
                  ]}>
                    <View
                      style={[{
                        width: '100%',
                        alignItems: isCellContentCentered ? 'center' : 'flex-start',
                        
                      },layout.justifyCenter]}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={[
                          tablestyle.cellStyle,
                          cellStyle,
                          column.cellTextStyle,
                          { width: '100%', textAlign: isCellContentCentered ? 'center' : 'left' }
                        ]}
                      >
                        {renderCell(item, column)}
                      </Text>
                    </View>
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            </Pressable>
          ))}
        </ScrollView>

        {/* Pagination */}
        {!hidePagination ? (
          <PaperProvider theme={paginationTheme}>
            <DataTable.Pagination
              page={page}
              numberOfPages={numberOfPages}
              onPageChange={onPageChange}
              label={paginationLabel(
                page * rowsPerPage + 1,
                Math.min((page + 1) * rowsPerPage, totalItems),
                totalItems
              )}
              style={tablestyle.pagination}
            />
          </PaperProvider>
        ):null}

        {renderErrorMsgSection(error)}
      </DataTable>
    </ScrollView>
  );
};

export default CustomDataTable;
