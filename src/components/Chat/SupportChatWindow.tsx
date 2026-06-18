 import moment from 'moment';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useAppTheme } from 'src/common/context/AppTheme';
import { ChatMessage, convertUTCToLocalMessageDate, GroupedMessage } from 'src/components/Chat/ChatUtils';
import { useSupportStyle } from 'src/components/Chat/SupportStyle';
import { RootState } from 'src/store';

const SupportChatWindow = ({ scrollToBottomTrigger, onEnd, messages, showSenderName = false }: { scrollToBottomTrigger: boolean, onEnd: () => void; messages: ChatMessage[], showSenderName?: boolean }) => {
  const flatListRef = useRef<FlatList>(null);
  const userDetails = useSelector((state: RootState) => state.profile);
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const supportStyles = useSupportStyle();
  const {theme} = useAppTheme();

  const groupedMessages = useMemo(() => {
    if (!messages || messages.length === 0) return [];
  
    const groupedMap = new Map<
      string,
      { sortKey: string; date: string; messages: ChatMessage[] }
    >();
  
    messages.forEach((msg: ChatMessage) => {
      const date = convertUTCToLocalMessageDate(msg.timestamp); 
      const sortKey = moment(msg.timestamp).local().format('DD-MM-YYYY'); 
  
      if (!groupedMap.has(date)) {
        groupedMap.set(date, { sortKey, date, messages: [] });
      }
  
      groupedMap.get(date)!.messages.push(msg);
    });
  
    return Array.from(groupedMap.entries())
      .map(([_, value]) => ({
        date: value.date,
        sortKey: value.sortKey,
        messages: value.messages.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      }))
      .sort((a, b) => {
        const aDate = moment(a.sortKey, 'DD-MM-YYYY').toDate();
        const bDate = moment(b.sortKey, 'DD-MM-YYYY').toDate();
        return bDate.getTime() - aDate.getTime();
      });
  }, [messages]);
  

  useEffect(() => {
    if (scrollToBottomTrigger) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollToBottomTrigger]);

  const isSenderMe = (nickname: string) => {
    return nickname === userDetails.data?.id.toString();
  }

  const formatDate = (date: Date) => {
    return moment(date).format('MMM DD, YYYY');
  };
  const checkDate = (date: string) => date === formatDate(new Date()) ? TranslateMessage('Admin.Delivery.App.Date.Today') : date;

  return (
    <View
      style={[layout.flexCol, { marginVertical: 10, paddingHorizontal: 10, flex: 1 }]}
    >
      <FlatList
        ref={flatListRef}
        data={groupedMessages}
        inverted
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: GroupedMessage) => item.date}
        renderItem={({ item }: { item: GroupedMessage }) => (
          <>
            {item.messages.map((chat: ChatMessage, chatIndex: number) => (
              <View
                key={chat.id}
                style={[
                  supportStyles.message_item,
                  isSenderMe(chat.nickname)
                    ? supportStyles.ownMessageView
                    : supportStyles.otherMessageView,
                ]}
              >
                <View style={layout.flexCol}>
                  {showSenderName && chat.Pname?.name ? (
                    <Text
                      style={[
                        isSenderMe(chat.nickname)
                          ? { ...supportStyles.ownMessageView, marginRight: theme.spacing.xs }
                          : { ...supportStyles.otherMessageView, marginLeft: theme.spacing.xs },
                        { fontFamily: theme.fontFamily.bold, fontSize: theme.fontSize.textBodyMedium, color: theme.colors.textLinkDark },
                      ]}
                    >
                      {chat.Pname.name}
                    </Text>
                  ) : null}
                  <Text
                    style={[
                      isSenderMe(chat.nickname)
                        ? { ...supportStyles.ownMessageView, marginRight: theme.spacing.xs }
                        : { ...supportStyles.otherMessageView, marginLeft: theme.spacing.xs },
                        {fontFamily: theme.fontFamily.medium,fontSize:theme.fontSize.textBodyMedium, color: theme.colors.textBody}
                    ]}
                  >
                    {moment.utc(chat.timestamp).local().format('HH:mm')}
                  </Text>
                  <View
                    style={[
                      layout.flexDirectionRow,
                      { gap: 0 },
                      isSenderMe(chat.nickname)
                        ? supportStyles.ownMessageView
                        : supportStyles.otherMessageView,
                    ]}
                  >
                    <View
                      style={
                        isSenderMe(chat.nickname)
                          ? supportStyles.ownMessage
                          : supportStyles.otherMessage
                      }
                    >
                      <Text
                        style={[
                          {
                            color: theme.colors.textBody,
                            fontFamily: theme.fontFamily.medium,
                          },
                         
                        ]}
                      >
                        {chat.text}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            <View style={[layout.alignItemsCenter, { marginBottom: theme.spacing.sm }]}>
              <Text
                selectable
                style={[
                  supportStyles.dateText,
                  {fontFamily: theme.fontFamily.medium}
                ]}
              >
                {checkDate(item.date)}
              </Text>
            </View>
          </>
        )}
        onEndReached={onEnd}
        onEndReachedThreshold={0.1}
      />

    </View>
  );
};

export default SupportChatWindow;