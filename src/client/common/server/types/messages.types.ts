import { IChatResponseMessage } from './chat.types';
import { IEventMessage } from './events.types';

const MESSAGE_TYPE_MAP = [
  'CHAT',
  'EVENT',
] as const;
export type MessageTypeKeys = typeof MESSAGE_TYPE_MAP[number];

interface IMessagesMap {
  CHAT: IChatResponseMessage;
  EVENT: IEventMessage;
}

export type IMessage<T extends MessageTypeKeys> = IMessagesMap[T];
