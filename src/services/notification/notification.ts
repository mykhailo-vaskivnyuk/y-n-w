/* eslint-disable max-lines */
import * as T from '../../client/common/server/types/types';
import { IMemberNode } from '../../db/types/member.types';
import { IServices } from '../../router/types';
import { IConnectionService } from '../../server/types';
import { ChatService } from '../chat/chat';

type IInstantEvent = Pick<
  T.IEventMessage,
  'event_type' | 'user_id' | 'net_id' | 'net_view'
>;

type IInstantNetEvent = Pick<
  T.IEventMessage,
  'event_type' | 'message'
>;

export class NotificationService {
  private connection: IConnectionService;
  private messenger: IConnectionService;
  private chat?: ChatService;
  private notifDates = new Map<number, string>();
  private notifsToSend: number[] = [];
  private eventsToSend: IInstantEvent[] = [];
  private netEventsToSend: (readonly [IInstantNetEvent, IMemberNode])[] = [];

  constructor(services: IServices) {
    const { chatService } = services;
    this.connection = connectionService;
    this.messenger = messengerService;
    this.chat = chatService;
  }

  addNotification(user_id: number, date: string) {
    const availableDate = this.notifDates.get(user_id);
    if (availableDate) {
      const newDate = new Date(date) > new Date(availableDate) ? date : null;
      if (newDate) this.notifDates.set(user_id, date);
    } else {
      this.notifDates.set(user_id, date);
      this.notifsToSend.push(user_id);
    }
  }

  addEvent(event: IInstantEvent) {
    this.eventsToSend.push(event);
  }

  addNetEvent(event: IInstantNetEvent, member: IMemberNode) {
    this.netEventsToSend.push([event, member]);
  }

  public async sendNotifs() {
    const user_id = this.notifsToSend.shift();
    if (!user_id) return;
    const date = this.notifDates.get(user_id)!;
    this.notifDates.delete(user_id);
    this.commitEvents(user_id, date);
    this.sendNotifs();
  }

  public async sendEvents() {
    const event = this.eventsToSend.shift();
    if (!event) return;
    const { user_id } = event;
    const chatId = chatService.getChatIdOfUser(user_id);
    if (!chatId) return;
    const message: T.IEventMessage = {
      type: 'EVENT',
      event_id: 0,
      from_node_id: null,
      message: '',
      date: '',
      ...event,
    };
    const connectionIds = chatService.getChatConnections(chatId);
    connectionService.sendMessage(message, connectionIds);
    this.sendEvents();
  }

  public async sendNetEvents() {
    const eventItem = this.netEventsToSend.shift();
    if (!eventItem) return;
    const [event, member] = eventItem;
    const { net: chatId } = chatService.getChatIdsOfNet(member);
    if (!chatId) return;
    const message: T.IEventMessage = {
      type: 'EVENT',
      event_id: 0,
      user_id: 0,
      net_id: member.net_id,
      net_view: 'net',
      from_node_id: member.node_id,
      date: '',
      ...event,
    };
    const connectionIds = chatService.getChatConnections(chatId);
    connectionService.sendMessage(message, connectionIds);
    this.sendEvents();
  }

  private commitEvents(user_id: number, date: string) {
    const chatId = this.chat?.getChatIdOfUser(user_id);
    if (!chatId) return this.sendNotification(user_id, date);
    const connectionIds = this.chat?.getChatConnections(chatId);
    const message: T.INewEventsMessage = { type: 'NEW_EVENTS' };
    this.connection.sendMessage(message, connectionIds);
  }

  private async sendNotification(user_id: number, date: string) {
    const [user] = await execQuery.user.get([user_id]);
    const tgChatId = user?.chat_id;
    if (!tgChatId) return;
    this.messenger!.sendNotification(tgChatId);
    execQuery.user.events.write([user_id, date]); // згадати для чого
  }
}

export default (config: unknown, services: IServices) =>
  new NotificationService(services);
