import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { getUserIconName, SharedChatProps } from 'src/components/Chat/ChatUtils';
import SupportChatWindow from 'src/components/Chat/SupportChatWindow';
import { useSupportStyle } from 'src/components/Chat/SupportStyle';
import { Icon } from 'src/submodules/iconlibrary/src';

const Support = ({
  initialMessages,
  selectedUser,
  onSendMessage,
  setText,
  text,
  scrollToBottomTrigger,
  loadMore,
  readOnly = false,
  showSenderName = false,
}: SharedChatProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const supportStyles = useSupportStyle();
  const {theme} = useAppTheme();
  const onEndReachedHandler = () => {
    loadMore();
  }

  function renderAdminDetails() {
    return (
      <>
        <View style={[layout.flexDirectionRow, layout.alignItemsCenter, { marginTop: theme.spacing.sm, marginLeft: theme.spacing.sm }]}>
        <View style={[supportStyles.adminBadge]}>
            <Typography variant='subTitle' color={theme.colors.textInverse}>
              {selectedUser?.firstUserName?.substring(0, 2).toUpperCase()}
            </Typography>
        </View>
        <View style={supportStyles.flexRow}>
          <View style={supportStyles.flexCol}>
          <View style={supportStyles.nameContainer}>
            <Typography variant='subTitle'>
            {selectedUser?.firstUserName
              ? selectedUser.firstUserName.charAt(0).toUpperCase() + selectedUser.firstUserName.slice(1)
              : ''}
            </Typography>
            {/* <Image source={getUserImage(selectedUser?.firstUserRole ?? '')}/> */}
            <Icon
              name={getUserIconName(selectedUser?.firstUserRole ?? '')}
              size={12}
              color={theme.colors.themeIcon}
            />
          </View>
          <View>
          <Text style={[supportStyles.username,{fontSize:12}]}>
            {selectedUser?.sellerName
              ? selectedUser.sellerName.charAt(0).toUpperCase() + selectedUser.sellerName.slice(1)
              : ''}
          </Text>
          </View>
          </View>
        </View>
      </View>
     </>
    );
  }
  function renderInputMessage() {
    return (
      <View
        style={supportStyles.inputContainer}
      >
        <TextInput
          style={[formStyle.inputField, layout.flexCol]}
          mode='outlined'
          placeholder={TranslateMessage('Admin.Delivery.App.Type.Your.Message')}
          value={text}
          onSubmitEditing={() => onSendMessage(text)}
          returnKeyType='send'
          blurOnSubmit={false}
          outlineColor={theme.colors.borderMedium}
          activeOutlineColor={theme.colors.borderErrorInverse}
          placeholderTextColor={theme.colors.textNeutral}
          contentStyle={formStyle.inputLabel}
          onChangeText={(val) =>
            setText(val)
          }
        />
        <Pressable onPress={() => { onSendMessage(text) }}>
          <Icon name='send' color={theme.colors.themeIcon} size={30} spacing={10}/>
        </Pressable>
      </View>
    );
  }
  return (
    <>
      <View style={[supportStyles.messaagesOuterContainer,supportStyles.borderColorWidth]}>
        <View style={{ flex: 1 }}>
          <View style={supportStyles.messagesContainer}>
            {!readOnly && renderAdminDetails()}
            <SupportChatWindow
              scrollToBottomTrigger={scrollToBottomTrigger}
              onEnd={onEndReachedHandler}
              messages={initialMessages ?? []}
              showSenderName={showSenderName}
            />
            {!readOnly && renderInputMessage()}
          </View>
        </View>
      </View>
    </>
  );
};

export default Support;
