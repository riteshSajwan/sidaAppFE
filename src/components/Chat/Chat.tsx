import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useTenantId } from 'src/common/hooks/useTenantId';
import { fetchSupportListAction } from 'src/common/service/chat/action';
import { sendMessageEvent, updateLatestMessage } from 'src/common/service/chat/api';
import chatService from 'src/common/service/chat/chat';
import { getUserCredentails } from 'src/common/utils/credentialsUtil';
import { ChatMessage, DEFAULT_USER_LIST_SIZE, generateError, generateSupportListData, IChatMemberItem, IChatResponse, IErrorState } from 'src/components/Chat/ChatUtils';
import SidebarUserList from 'src/components/Chat/SidebarUserList';
import Support from 'src/components/Chat/Support';
import { useSupportStyle } from 'src/components/Chat/SupportStyle';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { AppDispatch, RootState } from 'src/store';



const Chat = () => {
  const { t: TranslateMessage } = useTranslation();
  const supportStyles = useSupportStyle();
  const layout = useLayoutStyle();
  const styles = useRestroStyle();
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IChatMemberItem>();
  const [messageMap, setMessageMap] = useState<{ [key: string]: ChatMessage[] }>({});
  const [connectionEstablised, setConnectionEstablised] = useState<boolean>(false)
  const userDetails = useSelector((state: RootState) => state.profile);
  const [text, setText] = useState<string>('');
  const [scrollToBottomTrigger, setScrollToBottomTrigger] = useState<boolean>(false);
  const [error, setError] = useState<IErrorState>(generateError());
  const [supportListData, setSupportListData] = useState<IChatResponse>({
    ...generateSupportListData(),
  });
  const supportListRef = useRef<IChatResponse>({
    ...generateSupportListData(),
  })
  const dispatch = useDispatch<AppDispatch>();
  const {tenantId} = useTenantId();
  const {data,loading:mainLoading} = useSelector((state: RootState) => state.support.supportListing);
  const hasMore = supportListData?.data.length < supportListData?.total;
  useEffect(() => {
    setSupportListData(data);

  }, [data]);
  useEffect(() => {
    supportListRef.current = supportListData;
  },[supportListData])
  
  const reset = () => {
    setError(generateError());
    setPage(0);
    setLoading(false);
    chatService.disconnectJitsi()
    setMessageMap({})
    supportListRef.current = { ...generateSupportListData() };
  };


useEffect(() => {
  dispatch(fetchSupportListAction(page, DEFAULT_USER_LIST_SIZE));
}, [page]);



const moreUser = () => {
  if (!loading && hasMore) {
    setPage(prev => prev + 1);
  }
};

  useEffect(() => {
    if (supportListData.data.length > 0) {
      setSelectedUser(supportListData.data[0])
    }
  }, [supportListData.total])

  const onConnectionFailed = () => {
    setConnectionEstablised(false)
  }
  
  // Use useRef to store the current tenantId to avoid stale closure issues
  const tenantIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    tenantIdRef.current = tenantId;
  }, [tenantId]);

  const universalMessage = useCallback((msg: any) => {
    const roomId = msg?.room;
    const roomTenantId = roomId.split('=tenantid=')[1];

    // Use the ref to get the current tenantId value
    if (tenantIdRef.current !== roomTenantId) {
      return;
    }
    
    const existingRoom = supportListRef.current.data.find((item: any) => item.id === roomId);
    if (existingRoom) {
      setSupportListData((prevData) => {
        const filteredList = prevData.data.filter((item: any) => item.id !== roomId);
        const updatedRoom = {
          ...existingRoom,
          lastMsg: msg?.text || '',
          updatedAt: msg.time,
          firstUserProfileUrl: msg?.Pname?.profileUrl != null ? msg.Pname.profileUrl : existingRoom.firstUserProfileUrl,
        };
        
        return {
          ...prevData,
          data: [updatedRoom, ...filteredList],
        };
      });
      
    } else {
      const newRoom = {
        id: msg?.room || '',
        firstUser: msg?.firstUser || null,
        firstUserName: msg?.Pname?.name || 'User',
        sellerName: msg?.Pname?.restaurantName || '',
        firstUserProfileUrl: msg?.Pname?.profileUrl || null,
        secondUser: msg?.secondUser || null,
        secondUserName: msg?.secondUserName || null,
        firstUserRole:msg?.Pname?.userType, 
        lastMsg: msg?.text || '', 
        createdAt: msg?.time,
        updatedAt: msg?.time
      };
  
      setSupportListData((prevData) => ({
        ...prevData,
        data: [newRoom, ...prevData.data],
      }));
    }
  }, []);
  
  const onConnectionEstablised = () => {
    setConnectionEstablised(true)
  }
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);
      getUserCredentails()
        .then((userCredentials) => {
          if (!isActive) return;
          chatService.initJitsi(
            onConnectionEstablised,
            onConnectionFailed,
            universalMessage,
            userCredentials || null
          );
        })
        .catch((error) => {
          if (!isActive) return;
          chatService.initJitsi(
            onConnectionEstablised,
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
    }, [])
  );

  useEffect(() => {
    if (connectionEstablised && userDetails.data?.id && supportListData.data.length > 0) {
      setLoading(true)
      try {
        chatService.addRoom(
          selectedUser?.id as string,
          userDetails.data?.id?.toString() as string,
          onMessageReceived
        );
      } catch (error) {
        setError(prev => ({
          ...prev,
          jitsiError: TranslateMessage('Admin.Delivery.App.SomethingWentWrong')
        }));

      }
      finally {
        setLoading(false)
      }
    }
  }, [connectionEstablised, selectedUser, userDetails.data?.id]);

  const onMessageReceived = (roomName: string, message: ChatMessage) => {
    setMessageMap((prev) => {
      const chats = prev[roomName] || [];
      let isArchived = false;

      const lastMessage = chatService.getLastArchivedTime(roomName);
      if (lastMessage) {
        const messageTime = new Date(message.timestamp).getTime();
        const lastMTime = lastMessage.getTime();
        if (messageTime < lastMTime)
          isArchived = true
      }
      if (selectedUser?.id === roomName && !isArchived) {
        setSupportListData((prev) => ({
          ...prev,
          data: prev.data.map((item) =>
            item.id === roomName ? { ...item, lastMsg: message.text } : item
          )
        }));
      }
      if (isArchived) {
        return {
          ...prev,
          [roomName]: [message, ...chats],
        };
      } else {
        return {
          ...prev,
          [roomName]: [...chats, message],
        };
      }
    });
  }

  

  const handleSendMessage = async (message: string) => {
   
    
    if (message.trim() === '') return;
    chatService.getChatRoom(selectedUser?.id as string)?.sendMessage(message, 'text', 'message');
    setText('')
    setScrollToBottomTrigger(true);
    setTimeout(() => {
      setScrollToBottomTrigger(false);
    }, 100);
    try{
      updateLatestMessage(selectedUser?.id as string, message,userDetails?.data?.id )
    }
    catch(e){
    }
    try{
      sendMessageEvent(selectedUser?.id as string, message)
    }
    catch(e){
    }
  };

  const handleUserSelect = (user: IChatMemberItem) => {
    setSelectedUser(user)
  };

  const loadMore = () => {
    const messages = messageMap[selectedUser?.id as string] as ChatMessage[];
    if (messages && messages.length > 20) {
      const lastMessage = messages[0];
      if (!lastMessage) return;
      setLoading(true);
      chatService.getArchivedMessages(selectedUser?.id as string, lastMessage.timestamp)
        .finally(() => {
          setLoading(false);
        });
    }
  };
  

  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }
  
  if (mainLoading) {
    return (
      <>
        <Loader loading={mainLoading} />
      </>
    )
  }

  return (
    <View style={[layout.containerPadding, layout.flexCol]}>
      <View
        style={[
          layout.container,
          styles.headerContainer,
          layout.paddingTop26,
          layout.flexWrap,
        ]}
      >
        <View style={styles.filterrow}>
          <Text style={[layout.Adminh1Title]}>
            {TranslateMessage('Admin.Delivery.App.Support.Manager')}
          </Text>
        </View>
        <View style={styles.breadcrumbContainer}>
          <Text style={styles.breadcrumb}>
            {TranslateMessage('Admin.Delivery.App.Home')}
          </Text>
          <Text style={styles.breadcrumb}>/</Text>
          <Text style={styles.breadcrumb}>
            {TranslateMessage('Admin.Delivery.App.Support.Manager')}
          </Text>
        </View>
      </View>
      <Divider style={[layout.DividerSperator, layout.marBottom30]} />
      {
        error.apiError ?
          <View style={supportStyles.messaagesOuterContainer}>
            {renderErrorMsg(error.apiError)}
          </View>
          :
          (supportListData.total === 0 && !mainLoading) ? (
            <View style={[supportStyles.messaagesOuterContainer, supportStyles.alignTextCenter]}>
              <Typography variant='body'>{TranslateMessage('Admin.Delivery.App.No.Support')}</Typography>
            </View>
          )
            :
            <View style={supportStyles.outerContainer}>
              <View style={supportStyles.loaderContainer} pointerEvents='none'>
                <Loader loading={loading} />
              </View>
              <SidebarUserList
                users={supportListData.data}
                selectedUser={selectedUser}
                onUserSelect={handleUserSelect}
                onEndReached={moreUser}
              />

              <View style={supportStyles.chatViewConatiner}>
                {
                  error.jitsiError ? (
                    <View
                      style={[
                        layout.flexCol,
                        supportStyles.errorView
                      ]}
                    >
                      <Text style={supportStyles.errorText}>
                        {TranslateMessage('Admin.Delivery.App.Chat.Error')}
                      </Text>
                    </View>
                  ) :
                    (
                      <Support
                        setText={setText}
                        text={text}
                        selectedUser={selectedUser}
                        initialMessages={messageMap[selectedUser?.id as string] as ChatMessage[]}
                        onSendMessage={(message) => handleSendMessage(message)}
                        scrollToBottomTrigger={scrollToBottomTrigger}
                        loadMore={loadMore}
                      />
                    )
                }
              </View>
            </View>
      }
    </View>
  );
};

export default Chat;

