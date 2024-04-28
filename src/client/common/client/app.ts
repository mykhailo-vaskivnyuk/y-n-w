/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../server/types/types';
import { TPromiseExecutor } from '../types';
import { AppStatus } from './constants';
import { HttpResponseError } from './connection/errors';
import { EventEmitter } from './lib/event.emitter';
import { getApi, IClientApi } from '../server/client.api';
import { Account } from './classes/account.class';
import { UserNets } from './classes/user.nets.class';
import { Net } from './classes/net.class';
import { Chat } from './classes/chat.class';
import { Events } from './classes/events.class';
import { getConnection as getHttpConnection } from './connection/http';
import { getConnection as getWsConnection } from './connection/ws';

export class ClientApp extends EventEmitter {
  private baseUrl = '';
  private api: IClientApi | null;
  private status: AppStatus = AppStatus.INITING;
  private error: Error | null = null;
  private userStatus: T.UserStatusKeys = 'NOT_LOGGEDIN';
  private loadingQueue: (Parameters<TPromiseExecutor<void>>)[] = [];

  account: Account;
  userNets: UserNets;
  userEvents: Events;
  net: Net;
  chat: Chat;

  constructor() {
    super();
    this.baseUrl = process.env.API || `${window.location.origin}/api`;
    this.account = new Account(this as any);
    this.net = new Net(this as any);
    this.chat = new Chat(this as any);
    this.userEvents = new Events(this as any);
    this.setInitialValues();
  }

  getState() {
    return {
      status: this.status,
      error: this.error,
      ...this.account.getState(),
      userStatus: this.userStatus,
      nets: this.userNets.getUserNets(),
      events: this.userEvents.getEvents(),
      ...this.net.getNetState(),
      ...this.chat.getChatState(),
    };
  }

  async init() {
    try {
      const connection = getHttpConnection(this.baseUrl);
      this.api = getApi(connection);
      await this.api.health();
    } catch (e: any) {
      try {
        if (e.statusCode !== 503) throw new HttpResponseError(503);
        const baseUrl = this.baseUrl.replace('http', 'ws');
        const connection = getWsConnection(
          baseUrl,
          this.handleConnect.bind(this),
          this.setMessage.bind(this),
        );
        this.api = getApi(connection);
        await this.api.health();
      } catch (error: any) {
        return this.setError(error);
      }
    }

    try {
      await this.account.init();
      await this.setStatus(AppStatus.INITED);
      await this.setStatus(AppStatus.READY);
    } catch (e: any) {
      this.setError(e);
    }
  }

  private setInitialValues() {
    this.userNets = new UserNets(this as any);
    this.chat = new Chat(this as any);
    this.userEvents = new Events(this as any);
  }

  private async setStatus(status: AppStatus): Promise<void> {
    if (this.status === status) return;
    if (status === AppStatus.ERROR) {
      this.status = status;
      const e = new Error('break');
      this.loadingQueue.forEach(([, rj]) => rj(e));
      this.loadingQueue = [];
      this.emit('error', this.error);
      return this.emit('statuschanged', this.status);
    }
    this.error = null;
    if (status === AppStatus.INITED) {
      this.status = status;
      return this.emit('statuschanged', this.status);
    }
    if (this.status === AppStatus.INITING) return;
    if (status === AppStatus.READY) {
      if (this.loadingQueue.length) {
        const [rv] = this.loadingQueue.shift()!;
        return rv();
      }
      this.status = status;
      return this.emit('statuschanged', this.status);
    }
    const executor: TPromiseExecutor<void> = (rv, rj) => {
      if (this.loadingQueue.length) {
        this.loadingQueue.push([rv, rj]);
        return;
      }
      this.status = status;
      this.emit('statuschanged', this.status);
      rv();
    };
    return new Promise(executor);
  }

  private setError(e: HttpResponseError) {
    if (this.error) return;
    this.error = e;
    this.setStatus(AppStatus.ERROR);
  }

  private handleConnect() {
    if (this.status === AppStatus.INITING) return;
    this.chat.connectAll().catch((e) => this.setError(e));
    this.userEvents.read(true).catch((e) => this.setError(e));
  }

  private async onNewUser(readChanges = true) {
    const { user } = this.getState();
    if (!user) this.setInitialValues();
    else if (user.user_status === 'LOGGEDIN') {
      await this.onNewNets();
      readChanges && await this.userEvents.read(true);
    }
    this.setUserStatus();
    this.emit('user', user);
  }

  private setUserStatus() {
    const { user } = this.account.getState();
    this.userStatus = 'NOT_LOGGEDIN';
    if (!user) return;
    const { net, userNetData } = this.net.getNetState();
    if (!net) {
      this.userStatus = user.user_status;
      return;
    }
    const { confirmed } = userNetData || {};
    if (confirmed) this.userStatus = 'INSIDE_NET';
    else this.userStatus = 'INVITING';
  }

  private async onNewNets() {
    await this.userNets.getAllNets();
    await this.chat.connectAll();
  }

  private onNewNet() {
    this.userNets.getNets();
    this.setUserStatus();
  }

  private async onNewEvents(events: T.IEvents) {
    const { net } = this.getState();
    const { net_id } = net || {};
    let updateUser = false;
    let updateNet = false;
    for (const event of events) {
      const { net_id: eventNetId, net_view: netView, message } = event;
      if (!netView) {
        updateUser = true;
        break;
      }
      if (eventNetId === net_id) updateNet = true;
      if (!message) this.userEvents.drop(event);
    }
    if (updateUser)
      await this.onNewUser(false).catch(console.log);
    if (updateNet)
      await this.net.enter(net_id!, true).catch(console.log);
    this.emit('events', this.userEvents.getEvents());
  }

  setMessage<T extends T.MessageTypeKeys>(
    messageData: T.IMessage<T>,
  ) {
    if (!messageData) return;

    if (this.userEvents.isEventMessage(messageData)) {
      return this.userEvents.newEventMessage(messageData);
    }

    this.chat.setMessage(messageData);
  }
}

export const app = new ClientApp();
