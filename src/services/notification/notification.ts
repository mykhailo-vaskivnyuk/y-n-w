/* eslint-disable max-lines */
import * as T from '../../client/common/server/types/types';
import { IServices } from '../../router/types';
import { IConnectionService } from '../../server/types';
import { ChatService } from '../chat/chat';

type IInstantEvent = Pick<T.IEventMessage,
  'event_type' | 'net_id' | 'net_view'
> & { user_id?: number };

export class NotificationService {
  private connection: IConnectionService;
  private messenger: IConnectionService;
  private chat?: ChatService;
  private notifDates = new Map<number, string>();
  private notifsToSend: number[] = [];
  private eventsToSend: IInstantEvent[] = [];

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
    if (!user_id) {
      this.sendNetEvent(event);
      this.sendEvents();
      return;
    }
    const chatId = chatService.getChatIdOfUser(user_id);
    if (!chatId) return;
    const message: T.IEventMessage = {
      type: 'EVENT',
      event_id: 0,
      user_id: 0,
      from_node_id: null,
      message: '',
      date: '',
      ...event,
    };
    const connectionIds = chatService.getChatConnections(chatId);
    connectionService.sendMessage(message, connectionIds);
    this.sendEvents();
  }

  private sendNetEvent(event: IInstantEvent) {
    const { net_id } = event;
    if (!net_id) return;
    const chatId = chatService.getChatIdOfNet(net_id);
    if (!chatId) return;
    const message: T.IEventMessage = {
      type: 'EVENT',
      event_id: 0,
      user_id: 0,
      from_node_id: null, // ?
      message: '',
      date: '',
      ...event,
    };
    const connectionIds = chatService.getChatConnections(chatId);
    connectionService.sendMessage(message, connectionIds);
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
