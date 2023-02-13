import { ITableEvents } from '../../../local/imports';
import { MessageTypeKeys } from './messages.types';

export type IEvent = ITableEvents;
export type IEvents = IEvent[];

export type IEventMessage = {
  type: Extract<MessageTypeKeys, 'EVENT'>;
} & IEvent;

export interface INewEventsMessage {
  type: Extract<MessageTypeKeys, 'NEW_EVENTS'>;
}
