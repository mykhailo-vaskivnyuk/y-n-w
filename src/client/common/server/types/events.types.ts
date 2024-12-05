/* eslint-disable import/no-cycle */
import { ITableEvents } from '../../../local/imports';
import { MessageTypeKeys } from './messages.types';
import { NetViewKeys } from './net.types';

export const NET_EVENT_MAP = {
  LEAVE: 'leave',
  LEAVE_CONNECTED: 'leave_connected',
  CONNECT: 'connect',
  CONFIRM: 'confirm',
  CONNECT_AND_CONFIRM: 'connect_and_confirm',
  REFUSE: 'refuse',
  DISLIKE: 'dislike',
  DISLIKE_DISCONNECT: 'dislike_disconnect',
  VOTE: 'vote',
  LEAVE_VOTE: 'leave_vote',
  LEAVE_DISVOTE: 'leave_disvote',
  CONNECT_VOTE: 'connect_vote',
  CONNECT_DISVOTE: 'connect_disvote',
  UNACTIVE_DISCONNECT: 'unactive_disconnect',
  NOT_VOTE: 'not_vote',
  NOT_VOTE_DISCONNECT: 'not_vote_disconnect',
  BOARD_MESSAGE: 'board_message',
  TIGHTEN: 'tighten',
  WAIT: 'wait',
};
export type NetEventKeys = keyof typeof NET_EVENT_MAP;

export type IEvent = Omit<ITableEvents, 'net_view' | 'event_type'> & {
  net_view: NetViewKeys | null;
  event_type: NetEventKeys;
};
export type IEventRecord = Omit<
  IEvent,
  'event_id' | 'event_type' | 'net_id' | 'date'
> & { net_id?: null };
export type IEvents = IEvent[];

export type IEventMessage = {
  type: Extract<MessageTypeKeys, 'EVENT'>;
} & IEvent;

export interface INewEventsMessage {
  type: Extract<MessageTypeKeys, 'NEW_EVENTS'>;
}
