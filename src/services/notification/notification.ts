/* eslint-disable max-lines */
import { Readable } from 'node:stream';
import * as T from '../../client/common/server/types/types';
import { IServices } from '../../controller/types';
import { IConnectionService } from '../../server/types';
import { ChatService } from '../chat/chat';
import { ITableUsers } from '../../domain/types/db.types';
import { IMeesageStream } from './notifications.types';

type IInstantEvent = Omit<T.IEventMessage, 'type' | 'event_id' | 'date'>;

export class NotificationService {
  private connection: IConnectionService;
  private tg: IConnectionService;
  private chat: ChatService;
  private tgInterval: number;
  private emailInterval: number;
  private messageStream: Readable & AsyncIterable<IMeesageStream>;
  private tgStream: Readable & AsyncIterable<ITableUsers>;
  private mailStream: Readable & AsyncIterable<ITableUsers>;

  constructor(services: IServices) {
    const { chatService } = services;
    this.connection = connectionService;
    this.tg = messengerService;
    this.chat = chatService!;
    this.tgInterval = Number(env.NOTIFICATION_INTERVAL);
    this.emailInterval = Number(env.NOTIFICATION_INTERVAL);
    this.messageStream = new Readable({ read: () => true, objectMode: true });
    this.tgStream = new Readable({ read: () => true, objectMode: true });
    this.mailStream = new Readable({ read: () => true, objectMode: true });
    this.sendingToClient();
    this.sendingToTelegram();
    this.sendingToEmail();
  }

  private async sendingToClient() {
    for await (const data of this.messageStream) {
      const { user_id, connectionIds, message } = data;
      // logger.warn('SEND TO CLIENT', { user_id, net_id });
      const success = await this.connection
        .sendMessage(message, connectionIds);
      if (success) continue;
      logger.warn('CANT\'T SEND TO CLIENT', user_id);
      let userId = user_id;
      if (!user_id) {
        const [connection] = connectionIds;
        userId = this.chat.getConnectionUser(connection!);
        if (!userId) {
          logger.warn('Cant find user by connection', connection);
          continue;
        }
      }
      this.sendToTgOrEmail(userId!)
        .catch(logger.error.bind(logger));
    }
  }

  private async sendingToTelegram() {
    for await (const user of this.tgStream) {
      const { user_id, chat_id } = user;
      // logger.warn('SEND TO TELEGRAM', user_id);
      const date = new Date().toUTCString();
      const success = await this.tg!
        .sendNotification(chat_id!);
      if (success) {
        await execQuery
          .user.events.write([user_id, date])
          .catch(logger.error.bind(logger));
      } else {
        logger.warn('CANT\'T SEND TO TELEGRAM', user_id);
        this.sendToEmail(user).catch(logger.error.bind(logger));
      }
    }
  }

  private async sendingToEmail() {
    for await (const user of this.mailStream) {
      const { user_id, email } = user;
      // logger.warn('SEND TO EMAIL', user_id, email);
      const date = new Date().toUTCString();
      let success = false;
      if (!env.TEST) {
        success = await mailService.notify(email!);
      }
      if (success) {
        await execQuery.user.events.write([user_id, date])
          .catch(logger.error.bind(logger));
      } else {
        logger.warn('CAN\'T SEND TO EMAIL', user_id, email);
      }
    }
  }

  async sendEventOrNotif(user_id: number) {
    const connectionIds = this.chat.getUserConnections(user_id);
    if (connectionIds) {
      const message: T.INewEventsMessage = { type: 'NEW_EVENTS' };
      this.messageStream.push({ user_id, connectionIds, message });
    } else {
      this.sendToTgOrEmail(user_id)
        .catch(logger.error.bind(logger));
    }
  }

  private async sendToTgOrEmail(user_id: number) {
    const [user] = await execQuery.user.get([user_id]);
    const { chat_id } = user!;
    if (chat_id) this.sendToTelegram(user!);
    else this.sendToEmail(user!);
  }

  private async sendToTelegram(user: ITableUsers) {
    const [userEvents] = await execQuery.user.events.get([user.user_id]);
    const prevNotifDateStr = userEvents?.notification_date || 0;
    const prevNotifDate = new Date(prevNotifDateStr).getTime();
    const curDate = new Date().getTime();
    if (prevNotifDate < curDate - this.tgInterval) return;
    this.tgStream.push(user);
  }

  private async sendToEmail(user: ITableUsers) {
    const [userEvents] = await execQuery.user.events.get([user.user_id]);
    const prevNotifDateStr = userEvents?.notification_date || 0;
    const prevNotifDate = new Date(prevNotifDateStr).getTime();
    const curDate = new Date().getTime();
    if (prevNotifDate < curDate - this.emailInterval) return;
    this.mailStream.push(user);
  }

  sendNetEventOrNotif(net_id: number, from_node_id: number | null) {
    this.sendNetEventOrNotifToTg(net_id, from_node_id)
      .catch(logger.error.bind(logger));
    this.sendNetEventOrNotifToEmail(net_id, from_node_id)
      .catch(logger.error.bind(logger));
  }

  async sendNetEventOrNotifToTg(
    net_id: number,
    from_node_id: number | null,
  ) {
    const prevNotifDate = new Date().getTime() - this.tgInterval;
    const prevNotifDateStr = new Date(prevNotifDate).toUTCString();
    const users = await execQuery
      .net.users.toNotifyOnTg([net_id, from_node_id, prevNotifDateStr]);

    for (const user of users) {
      const { user_id } = user!;
      const connectionIds = this.chat.getUserConnections(user_id);
      if (connectionIds) {
        const message: T.INewEventsMessage = { type: 'NEW_EVENTS' };
        this.messageStream.push({ user_id, connectionIds, message });
      } else this.tgStream.push(user);
    }
  }

  async sendNetEventOrNotifToEmail(
    net_id: number,
    from_node_id: number | null,
  ) {
    const prevNotifDate = new Date().getTime() - this.emailInterval;
    const prevNotifDateStr = new Date(prevNotifDate).toUTCString();
    const users = await execQuery
      .net.users.toNotifyOnEmail([net_id, from_node_id, prevNotifDateStr]);

    for (const user of users) {
      const { user_id } = user!;
      const connectionIds = this.chat.getUserConnections(user_id);
      if (connectionIds) {
        const message: T.INewEventsMessage = { type: 'NEW_EVENTS' };
        this.messageStream.push({ user_id, connectionIds, message });
      } this.mailStream.push(user);
    }
  }

  async sendEvent(event: IInstantEvent) {
    const { user_id, net_id } = event;
    let connectionIds: Set<number> | undefined;
    if (user_id) { // for user
      connectionIds = this.chat.getUserConnections(user_id);
    } else if (net_id) { // for users in net
      connectionIds = chatService.getNetConnections(net_id);
    }
    if (!connectionIds) return;

    const message: T.IEventMessage = {
      type: 'EVENT',
      event_id: 0,
      date: '',
      ...event,
    };
    this.messageStream.push({ user_id, net_id, connectionIds, message });
  }
}

export default (config: unknown, services: IServices) =>
  new NotificationService(services);
