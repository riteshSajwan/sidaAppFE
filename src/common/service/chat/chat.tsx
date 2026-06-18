// import { SuperAdminProperties } from 'src/common/model/auth/login';
// import { ChatMessage } from 'src/components/Chat/ChatUtils';
// import { SUPPORT_CHAT_CONFIG } from 'src/constants';

// const JitsiMeetJS = require('lib/jitsi/lib-jitsi-meet.min.js');

// const initOptions = {
//     disableAudioLevels: false,
// };


// export const confOptions = {
//     openBridgeChannel: 'websocket',
//     p2p: {
//         enabled: true,
//         stunServers: {
//             urls: 'stun:meet-jit-si-turnrelay.jitsi.net:443',
//         },
//         backToP2PDelay: 5,
//     },
//     enableTalkWhileMuted: true,
//     enableNoAudioDetection: true,
// };

// class ChatService {
//     /**
//      * entry time 
//      */
//     entryTime = new Date().getTime();


//     public jitsi_connection: any = null;

//     public chatRooms: { [key: string]: any } = {}
//     private lastArchivedTime: { [key: string]: Date } = {}

//     /**
//      * @param roomName - name of room
//      * @param roomConnection - jitsi chat room connection
//      */
//     public addChatRoom = (roomName: string, roomConnection: any) => {
//         this.chatRooms[roomName] = roomConnection;
//     }

//     /**
//      * @param roomName - name of room 
//      * @returns - jitsi room connection associated with roomname
//      */
//     public getChatRoom = (roomName: string) => {

//         return this.chatRooms[roomName];
//     }

//     /**
//      * 
//      * @param jitsi_connection - jitsi connection
//      */
//     public setJitsiConnection = (jitsi_connection: any) => {
//         this.jitsi_connection = jitsi_connection;
//         this.entryTime = new Date().getTime();
//     }
//     /**
//      * 
//      */

//     public disconnectJitsi = () => {
//         this.jitsi_connection?.disconnect();
//         this.jitsi_connection = null;
//         this.chatRooms = {}
//         this.lastArchivedTime = {}
//     }

//     /**
//      * get archived Messages
//      */
//     public getArchivedMessages = async (roomName: string, lastMessageTime: string) => {
        
//         const dateTime = new Date(lastMessageTime);
//         const lastArchivedTs = this.lastArchivedTime[roomName]
//         if (lastArchivedTs && dateTime.getTime() >= lastArchivedTs.getTime()) {
//             /**
//              * already called for archived message for this
//              * time stamp
//              */
//             return;
//         }
//         this.lastArchivedTime[roomName] = dateTime;
//         await this.getChatRoom(roomName).getArchivedMessages(lastMessageTime);

//     }
//     /**
//      * get last archvied message ts
//      */
//     public getLastArchivedTime(roomName: string) {
//         return this.lastArchivedTime[roomName];
//     }
//     initJitsi(
//         onConnectionEstablised: () => void,
//         onConnectionFailed: () => void,
//         universalMessage: (msg: any) => void ,
//         userDetails:SuperAdminProperties |null
//       ) {
//         JitsiMeetJS.init(initOptions);
//         JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
//         this.jitsi_connection = new JitsiMeetJS.JitsiConnection(null, null, SUPPORT_CHAT_CONFIG);
//         this.setConnectionListeners(onConnectionEstablised, onConnectionFailed, universalMessage);
//         if (userDetails?.id && userDetails?.password) {
//             this.jitsi_connection.connect({
//               id: userDetails.id,
//               password: userDetails.password,
//             });
//           } else {
//             this.jitsi_connection.connect();
//           }
//       }
      
//     setConnectionListeners = (onConnectionEstablised: () => void, onConnectionFailed: () => void, universalMessage: (msg: any) => void) => {
//         this.jitsi_connection.addEventListener(
//             JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
//             () => {
//                 console.log('Connection Established')  // will remove after testing
//                 onConnectionEstablised()
//             },
//         );
//         this.jitsi_connection.addEventListener(
//             JitsiMeetJS.events.connection.PRIVATE_MESSAGE_RECEIVED, 
//                 (msg:any) => {
//                     universalMessage(msg)
//             }),
//         this.jitsi_connection.addEventListener(
//             JitsiMeetJS.events.connection.CONNECTION_FAILED,
//             () => {
//                 console.log('connection failed');  // will remove after testing
//                 onConnectionFailed();
//             },
//         );
//         this.jitsi_connection.addEventListener(
//             JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
//             () => {
//                 console.log('disc');  // will remove after testing
//                 onConnectionFailed();
//             },
//         );
//     };


//     addRoom(roomName: string, userName: string, onMessageReceived: (roomName: string, message: ChatMessage) => void) {
//         if (this.getChatRoom(roomName)) return;

//         const chatroom = this.jitsi_connection.initJitsiChatroom(roomName, userName, confOptions);


//         chatroom.on(JitsiMeetJS.events.chatroom.MESSAGE_RECEIVED, (text: string, message: ChatMessage) => {
//             onMessageReceived(roomName, message)

//         })

//         chatroom.room.join()


//         this.addChatRoom(roomName, chatroom)

//     }

// }

// export default new ChatService();