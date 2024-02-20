/* eslint-disable max-lines */
import * as T from '../../client/common/server/types/types';
import { IServices } from '../../controller/types';
import { IConnectionService } from '../../server/types';
import { ChatService } from '../chat/chat';

type IInstantEvent = Omit<T.IEventMessage, 'type' | 'event_id' | 'date'>;

export class NotificationService {
  private connection: IConnectionService;
  private messenger: IConnectionService;
  private chat: ChatService;
  private notifDates = new Map<number, string>();
  private notifsToSend: number[] = [];
  private eventsToSend: IInstantEvent[] = [];
  private sendingEvents = false;
  private sendingNotifications = false;

  constructor(services: IServices) {
    const { chatService } = services;
    this.connection = connectionService;
    this.messenger = messengerService;
    this.chat = chatService!;
  }

  addNotification(user_id: number, date: string) {
    const availableDate = this.notifDates.get(user_id);
    if (availableDate) {
      const isNewDate = new Date(date) > new Date(availableDate);
      if (isNewDate) this.notifDates.set(user_id, date);
    } else {
      this.notifDates.set(user_id, date);
      this.notifsToSend.push(user_id);
    }
    this.sendNotifs();
  }

  addEvent(event: IInstantEvent) {
    this.eventsToSend.push(event);
    this.sendEvents();
  }

  private async sendNotifs() {
    if (this.sendingNotifications) return;
    const user_id = this.notifsToSend.shift();
    if (!user_id) return;
    const date = this.notifDates.get(user_id)!;
    this.notifDates.delete(user_id);
    this.commitEvents(user_id, date);
    this.sendNotifs();
  }

  private async sendEvents() {
    if (this.sendingEvents) return;
    const event = this.eventsToSend.shift();
    if (!event) return;
    const { user_id } = event;
    const message: T.IEventMessage = {
      type: 'EVENT',
      event_id: 0,
      date: '',
      ...event,
    };
    if (!user_id) {
      await this.sendNetEvent(message);
      this.sendEvents();
      return;
    }
    const connectionIds = this.chat.getUserConnections(user_id);
    if (connectionIds) {
      await this.connection.sendMessage(message, connectionIds);
    }
    this.sendEvents();
  }

  private sendNetEvent(message: T.IEventMessage) {
    const { net_id } = message;
    if (!net_id) return;
    const connectionIds = chatService.getNetConnections(net_id);
    return connectionService.sendMessage(message, connectionIds);
  }

  private async commitEvents(user_id: number, date: string) {
    const connectionIds = this.chat.getUserConnections(user_id);
    if (!connectionIds) return this.sendNotification(user_id, date);
    const message: T.INewEventsMessage = { type: 'NEW_EVENTS' };
    await this.connection.sendMessage(message, connectionIds);
    this.sendNotifs();
  }

  private async sendNotification(user_id: number, date: string) {
    const [user] = await execQuery.user.get([user_id]);
    const tgChatId = user?.chat_id;
    if (!tgChatId) {
      this.sendNotifs();
      return;
    }
    await this.messenger!.sendNotification(tgChatId);
    await execQuery.user.events.write([user_id, date]); // згадати для чого
    this.sendNotifs();
  }
}

export default (config: unknown, services: IServices) =>
  new NotificationService(services);
