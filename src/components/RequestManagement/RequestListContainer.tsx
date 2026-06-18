import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import DriverRequestList from 'src/components/RequestManagement/DriverRequest/DriverRequestList';
import { generateInitialFilterData, IRequestListFilter } from 'src/components/RequestManagement/RequestListUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { WalletType } from 'src/components/DriverDetailPage/DriverWallet/DriverWalletListUtil';



const RequestListContainer = ({ isDashboard }: IDashboardProps) => {
  const layout = useLayoutStyle();
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const styles = useRestroStyle();
  const theme = useAppTheme();

  const [filter, setFilter] = useState<IRequestListFilter>({
    ...generateInitialFilterData(),
  });
  const renderView = () => {
    return (
      <>
      <View
        style={[
          styles.headerContainer,
          layout.paddingTop26,
        ]}
      >
          <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.RequestManagementList.Heading')}</Typography>
      </View>
      <Divider style={[layout.DividerSperator, { marginBottom: 30 }]} />
      </>
    );
  }
  const onFilterChange = (value: string, fieldName: string) => () => {
    setFilter({ ...filter, [fieldName]: value });
  };

  function renderHeadingTabs() {
    return (
      <View style={[DashboardStyle.tabFlexRow, layout.mb10]}>
        {/* <Text
          onPress={onFilterChange(WalletType.RESTAURANT, 'type')}
          style={[
            DashboardStyle.segmentedButton,
            filter.type === WalletType.RESTAURANT && DashboardStyle.activeTab,
          ]}
        >
          {TranslateMessage(
            'Admin.Delivery.App.RequestManagementList.RestaurantRequests'
          )}
        </Text> */}
         {/* require in future */}
        <Text
          onPress={onFilterChange(WalletType.DRIVER, 'type')}
          style={[
            DashboardStyle.segmentedButton,
            filter.type === WalletType.DRIVER && DashboardStyle.activeTab,
          ]}
        >
          {TranslateMessage(
            'Admin.Delivery.App.RequestManagementList.DriverRequests'
          )}
        </Text>
      </View>
    );
  }
 return (
    <ScrollView>
     <View style={layout.containerPadding}>
         {!isDashboard ? renderView() : null}
         {/* Main Section */}
         {renderHeadingTabs()}
         {/* {filter.type === WalletType.RESTAURANT ? <RequestList /> :<DriverRequestList isDashboard={true} />  } */}
       {<DriverRequestList isDashboard={true} />}
     </View>
     </ScrollView>
 )
  
};

export default RequestListContainer;
