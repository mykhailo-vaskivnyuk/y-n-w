import { IChatResponseMessage } from './chat.types';
import { IEventMessage, INewEventsMessage } from './events.types';

const MESSAGE_TYPE_MAP = [
  'CHAT',
  'EVENT',
  'NEW_EVENTS',
] as const;
export type MessageTypeKeys = typeof MESSAGE_TYPE_MAP[number];

interface IMessagesMap {
  CHAT: IChatResponseMessage;
  EVENT: IEventMessage;
  NEW_EVENTS: INewEventsMessage;
}

export type IMessage<T extends MessageTypeKeys> = IMessagesMap[T];
