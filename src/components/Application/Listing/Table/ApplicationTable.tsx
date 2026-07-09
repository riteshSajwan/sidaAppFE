import React from 'react';
import { Pressable, Text, View } from 'react-native';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import {
  DEFAULT_TABLE_SIZE,
  TableColumn,
} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';
import { useApplicationListingStyle } from '../ApplicationListingStyle';
import { IApplicationRow, STATUS_CONFIG } from '../ApplicationListingUtils';

interface IApplicationTableProps {
  data: IApplicationRow[];
  page?: number;
  onPageChange?: (page: number) => void;
  // Dashboard usage: no filter/export icons, no pagination footer — just a
  // "View All" link, showing the rows passed in as-is (no slicing).
  isDashboard?: boolean;
  onViewAllPress?: () => void;
}

const ApplicationTable = ({
  data,
  page = 0,
  onPageChange,
  isDashboard = false,
  onViewAllPress,
}: IApplicationTableProps) => {
  const styles = useApplicationListingStyle();
  const { theme } = useAppTheme();

  const numberOfPages = Math.max(1, Math.ceil(data.length / DEFAULT_TABLE_SIZE));
  const pagedData = isDashboard
    ? data
    : data.slice(page * DEFAULT_TABLE_SIZE, page * DEFAULT_TABLE_SIZE + DEFAULT_TABLE_SIZE);

  function renderApplicationId(item: IApplicationRow) {
    return <Text style={styles.applicationIdText}>{item.id}</Text>;
  }

  function renderApplicant(item: IApplicationRow) {
    return <Text style={styles.primaryCellText}>{item.applicantName}</Text>;
  }

  function renderBuildingNo(item: IApplicationRow) {
    return <Text style={styles.secondaryCellText}>{item.buildingNo}</Text>;
  }

  function renderSubmittedOn(item: IApplicationRow) {
    return <Text style={styles.secondaryCellText}>{item.submittedOn}</Text>;
  }

  function renderBuildingType(item: IApplicationRow) {
    return <Text style={styles.secondaryCellText}>{item.buildingType}</Text>;
  }

  function renderStatus(item: IApplicationRow) {
    const cfg = STATUS_CONFIG[item.status];
    return (
      <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
        <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
        <Text style={[styles.statusText, { color: cfg.color }]}>{item.status}</Text>
      </View>
    );
  }

  function renderActions() {
    return (
      <View style={styles.actionsCell}>
        <Pressable style={styles.actionIconBtn}>
          <Icon name="infoOutline" size={16} color={theme.colors.iconBase} />
        </Pressable>
        <Pressable style={styles.actionIconBtn}>
          <Icon name="edit" size={16} color={theme.colors.iconBase} />
        </Pressable>
      </View>
    );
  }

  const columns: TableColumn<IApplicationRow>[] = [
    { key: 'id', title: 'Application ID', render: renderApplicationId },
    { key: 'applicantName', title: 'Company / Applicant', render: renderApplicant },
    { key: 'buildingNo', title: 'Building No.', render: renderBuildingNo },
    { key: 'submittedOn', title: 'Submitted On', render: renderSubmittedOn },
    { key: 'buildingType', title: 'Building Type', render: renderBuildingType },
    { key: 'status', title: 'Status', render: renderStatus },
    { key: 'actions', title: 'Actions', render: renderActions },
  ];

  function renderCardHeader() {
    return (
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Recent Applications</Text>
          <Text style={styles.cardSubtitle}>
            Latest {data.length} {isDashboard ? 'submissions' : 'applications'}
          </Text>
        </View>
        {isDashboard ? (
          <Pressable style={styles.viewAllBtn} onPress={onViewAllPress}>
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="chevronRight" size={14} color={theme.colors.surfaceLinkInverse} />
          </Pressable>
        ) : (
          <View style={styles.cardHeaderActions}>
            <Pressable style={styles.iconBtn}>
              <Icon name="filter" size={18} color={theme.colors.iconBase} />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Icon name="upload" size={18} color={theme.colors.iconBase} />
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  function renderPaginationFooter() {
    if (isDashboard || !onPageChange) return null;

    const isPrevDisabled = page <= 0;
    const isNextDisabled = page >= numberOfPages - 1;

    return (
      <View style={styles.paginationRow}>
        <Text style={styles.paginationLabel}>
          Page {page + 1} of {numberOfPages}
        </Text>
        <View style={styles.paginationActions}>
          <Pressable
            style={[styles.paginationBtn, isPrevDisabled && styles.paginationBtnDisabled]}
            disabled={isPrevDisabled}
            onPress={() => onPageChange(page - 1)}
          >
            <Text style={styles.paginationBtnText}>Previous</Text>
          </Pressable>
          <Pressable
            style={[styles.paginationBtn, isNextDisabled && styles.paginationBtnDisabled]}
            disabled={isNextDisabled}
            onPress={() => onPageChange(page + 1)}
          >
            <Text style={styles.paginationBtnText}>Next</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {renderCardHeader()}
      <View style={styles.tableWrap}>
        <CustomDataTable
          data={pagedData}
          columns={columns}
          page={page}
          numberOfPages={numberOfPages}
          rowsPerPage={DEFAULT_TABLE_SIZE}
          totalItems={data.length}
          onPageChange={onPageChange ?? (() => {})}
          error=""
          hidePagination
          bodyMaxHeight={isDashboard ? undefined : 480}
        />
      </View>
      {renderPaginationFooter()}
    </View>
  );
};

export default ApplicationTable;
