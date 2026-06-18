import SendDiagonal from "./send-diagonal.svg";
import BellOutline from "./bell-outline.svg";
import Language from "./language.svg";
import Earth from "./globe.svg";
import Send from "./send.svg";
import Mail from "./mail.svg";
import Forward from "./arrow-email-forward.svg";
import Bell from './bell.svg'
import Phone from './phone.svg'
import ChatEmpty from './chat-bubble-empty.svg'
import ChatLine from './chat-lines.svg'
import MultiChat from './multi-bubble.svg'
import MessageOutline from './message.svg'
import Message from './message-text.svg'

export const communicationIcons = {
	sendDiagonal: SendDiagonal,
	bellOutline: BellOutline,
	language: Language,
	earth: Earth,
	send: Send,
	mail: Mail,
	forward: Forward,
	bell: Bell,
	phone: Phone,
	chatEmpty: ChatEmpty,
	chatLine: ChatLine,
	multiChat: MultiChat,
	messageOutline: MessageOutline,
	message: Message,

} as const;

export type SystemIconName = keyof typeof communicationIcons;