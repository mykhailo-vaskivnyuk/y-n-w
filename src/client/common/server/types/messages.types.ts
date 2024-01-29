/* eslint-disable import/no-cycle */
import { IChatResponseMessage } from './chat.types';
import { IEventMessage, INewEventsMessage } from './events.types';

export interface IMessagesMap {
  CHAT: IChatResponseMessage;
  EVENT: IEventMessage;
  NEW_EVENTS: INewEventsMessage;
}

export type MessageTypeKeys = keyof IMessagesMap;

export type IMessage<T extends MessageTypeKeys> = IMessagesMap[T];
