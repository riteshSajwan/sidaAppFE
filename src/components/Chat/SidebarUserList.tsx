import moment from 'moment';
import React from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { RenderImage } from 'src/common/components/Image/Image';
import { useAppTheme } from 'src/common/context/AppTheme';
import { getUserIconName, IChatMemberItem, ISuppportListProps } from 'src/components/Chat/ChatUtils';
import { useSupportStyle } from 'src/components/Chat/SupportStyle';
import Menustyle from 'src/components/Menu/Menustyle';
import { translateMessage } from 'src/i18n/createTranslation';
import { Icon } from 'src/submodules/iconlibrary/src';



const SidebarUserList = ({ users, onUserSelect, onEndReached, selectedUser }: ISuppportListProps) => {
  const layout = useLayoutStyle();
  const supportStyles = useSupportStyle();
  const { theme } = useAppTheme();
  const renderUserItem = ({ item }: { item: IChatMemberItem }) => {
    const isActive = item.id === selectedUser?.id;

    return (
      <Pressable
        onPress={() => onUserSelect(item)}
        style={[
          supportStyles.userItem,
          isActive && supportStyles.activeUserItem,
        ]}
      >
         <RenderImage
            uri={ item.firstUserProfileUrl ??'' }
            style={[Menustyle.Avatarimage, Menustyle.roundimage]}
          />
        <View style={layout.flexCol}>
          <View style={[layout.flexDirectionRow, supportStyles.firstContainer]}>
            <Text style={[supportStyles.username, isActive && supportStyles.activeUsername]} numberOfLines={1} ellipsizeMode='tail' >
              {item?.firstUserName?.charAt(0).toUpperCase() + item?.firstUserName?.slice(1)}
            </Text>
            <Icon name={getUserIconName(item.firstUserRole ?? '')} size={14} color={theme.colors.themeIcon} />
          </View>
          <View style={supportStyles.secondContainer}>
            <Text style={[supportStyles.username, supportStyles.userMessage]} numberOfLines={1} ellipsizeMode='tail' >
              {item.lastMsg ?? translateMessage('Admin.Delivery.App.ConnectNow') }
            </Text>
            <Text style={[supportStyles.username, supportStyles.userDateTime]}>
              {
                item.updatedAt
                  ? moment.utc(item.updatedAt).local().isSame(moment(), 'day')
                    ? moment.utc(item.updatedAt).local().format('HH:mm')
                    : moment.utc(item.updatedAt).local().format('DD/MM/YY')
                  : null
              }
            </Text>

          </View>
        </View>
      </Pressable>
    );
  };


  return (
    <View style={[supportStyles.sidebar, supportStyles.borderColorWidth]}>
      <FlatList
        showsHorizontalScrollIndicator={true}
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </View>
  );
}


export default SidebarUserList;
