import { useFocusEffect } from '@react-navigation/core';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { sendMessageEvent, updateLatestMessage } from 'src/common/service/chat/api';
import chatService from 'src/common/service/chat/chat';
import { getUserCredentails } from 'src/common/utils/credentialsUtil';
import {
  ChatMessage,
  generateError,
  IChatMemberItem,
  IErrorState,
} from 'src/components/Chat/ChatUtils';
import Support from 'src/components/Chat/Support';
import { useSupportStyle } from 'src/components/Chat/SupportStyle';
import { RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const TripChat = () => {
  const { t: TranslateMessage } = useTranslation();
  const supportStyles = useSupportStyle();
  const layout = useLayoutStyle();
  const { theme } = useAppTheme();

  const { roomId, passengerName, driverName } = useLocalSearchParams<{
    roomId: string;
    passengerName: string;
    driverName: string;
  }>();

  const resolvedPassengerName = passengerName || 'Unknown Passenger';
  const resolvedDriverName = driverName || 'Unknown Driver';

  const userDetails = useSelector((state: RootState) => state.profile);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionEstablished, setConnectionEstablished] = useState(false);
  const [text, setText] = useState('');
  const [scrollToBottomTrigger, setScrollToBottomTrigger] = useState(false);
  const [error, setError] = useState<IErrorState>(generateError());
  const [loading, setLoading] = useState(false);

  // Synthetic IChatMemberItem to satisfy Support's selectedUser prop
  const selectedUser: IChatMemberItem = {
    id: roomId ?? '',
    firstUser: 0,
    firstUserName: resolvedPassengerName,
    firstUserProfileUrl: null,
    secondUser: 0,
    secondUserName: resolvedDriverName,
    lastMsg: '',
    createdAt: null,
    updatedAt: null,
  };

  const reset = () => {
    setError(generateError());
    setLoading(false);
    chatService.disconnectJitsi();
    setMessages([]);
    setConnectionEstablished(false);
  };

  const onConnectionFailed = () => {
    setConnectionEstablished(false);
    setError((prev) => ({
      ...prev,
      jitsiError: TranslateMessage('Admin.Delivery.App.Chat.Error'),
    }));
  };

  const onConnectionEstablished = () => {
    setConnectionEstablished(true);
  };

  // universalMessage is required by initJitsi but not used for sidebar in TripChat
  const universalMessage = (_msg: any) => {};

  useFocusEffect(
    useCallback(() => {
      if (!roomId) {
        setError((prev) => ({
          ...prev,
          jitsiError: TranslateMessage('Admin.Delivery.App.Chat.Error'),
        }));
        return;
      }

      let isActive = true;
      setLoading(true);

      getUserCredentails()
        .then((userCredentials) => {
          if (!isActive) return;
          chatService.initJitsi(
            onConnectionEstablished,
            onConnectionFailed,
            universalMessage,
            userCredentials || null
          );
        })
        .catch(() => {
          if (!isActive) return;
          chatService.initJitsi(
            onConnectionEstablished,
            onConnectionFailed,
            universalMessage,
            null
          );
        })
        .finally(() => {
          if (isActive) setLoading(false);
        });

      return () => {
        isActive = false;
        reset();
      };
    }, [roomId])
  );

  // Join the room once connection is established
  useEffect(() => {
    if (!connectionEstablished || !roomId || !userDetails.data?.id) return;

    setLoading(true);
    try {
      chatService.addRoom(
        roomId,
        userDetails.data.id.toString(),
        onMessageReceived
      );
    } catch {
      setError((prev) => ({
        ...prev,
        jitsiError: TranslateMessage('Admin.Delivery.App.SomethingWentWrong'),
      }));
    } finally {
      setLoading(false);
    }
  }, [connectionEstablished, roomId, userDetails.data?.id]);

  const onMessageReceived = (roomName: string, message: ChatMessage) => {
    setMessages((prev) => {
      const lastArchivedTime = chatService.getLastArchivedTime(roomName);
      if (lastArchivedTime) {
        const messageTime = new Date(message.timestamp).getTime();
        if (messageTime < lastArchivedTime.getTime()) {
          // archived message — prepend
          return [message, ...prev];
        }
      }
      return [...prev, message];
    });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !roomId) return;

    const room = chatService.getChatRoom(roomId);
    if (!room) return;

    room.sendMessage(message, 'text', 'message');
    setText('');
    setScrollToBottomTrigger(true);
    setTimeout(() => setScrollToBottomTrigger(false), 100);

    try {
      updateLatestMessage(roomId, message, userDetails?.data?.id);
    } catch {}
    try {
      sendMessageEvent(roomId, message);
    } catch {}
  };

  const loadMore = () => {
    if (!roomId || messages.length <= 20) return;
    const lastMessage = messages[0];
    if (!lastMessage) return;
    setLoading(true);
    chatService
      .getArchivedMessages(roomId, lastMessage.timestamp)
      .finally(() => setLoading(false));
  };

  function renderHeader() {
    return (
      <View style={supportStyles.tripChatHeader}>
        {/* Passenger */}
        <View style={supportStyles.tripChatUserSection}>
          <View style={supportStyles.adminBadge}>
            <Typography variant='subTitle' color={theme.colors.textInverse}>
              {resolvedPassengerName.substring(0, 2).toUpperCase()}
            </Typography>
          </View>
          <View>
            <Typography variant='textLabel' color={theme.colors.textBodyLight}>
              {TranslateMessage('Admin.Delivery.App.Customer')}
            </Typography>
            <Typography variant='subTitle'>{resolvedPassengerName}</Typography>
          </View>
        </View>

        {/* Divider icon */}
        <Icon name='dataTransferVertical' size={16} color={theme.colors.iconNeutral} />

        {/* Driver */}
        <View style={supportStyles.tripChatUserSection}>
          <View style={supportStyles.adminBadge}>
            <Typography variant='subTitle' color={theme.colors.textInverse}>
              {resolvedDriverName.substring(0, 2).toUpperCase()}
            </Typography>
          </View>
          <View>
            <Typography variant='textLabel' color={theme.colors.textBodyLight}>
              {TranslateMessage('Admin.Delivery.App.Driver') || 'Driver'}
            </Typography>
            <Typography variant='subTitle'>{resolvedDriverName}</Typography>
          </View>
        </View>
      </View>
    );
  }

  if (!roomId) {
    return (
      <View style={[supportStyles.messaagesOuterContainer, supportStyles.alignTextCenter]}>
        <Typography variant='body'>
          {TranslateMessage('Admin.Delivery.App.Chat.Error')}
        </Typography>
      </View>
    );
  }

  return (
    <View style={[layout.containerPadding, layout.flexCol, layout.flexOne]}>
      <View style={supportStyles.loaderContainer} pointerEvents='none'>
        <Loader loading={loading} />
      </View>

      {renderHeader()}

      <View style={[supportStyles.chatViewConatiner, layout.marginTopMd]}>
        {error.jitsiError ? (
          <View style={[layout.flexCol, supportStyles.errorView]}>
            <Text style={supportStyles.errorText}>
              {TranslateMessage('Admin.Delivery.App.Chat.Error')}
            </Text>
          </View>
        ) : (
          <Support
            setText={setText}
            text={text}
            selectedUser={selectedUser}
            initialMessages={messages}
            onSendMessage={handleSendMessage}
            scrollToBottomTrigger={scrollToBottomTrigger}
            loadMore={loadMore}
            readOnly={true}
            showSenderName={true}
          />
        )}
      </View>
    </View>
  );
};

export default TripChat;
