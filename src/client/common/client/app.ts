/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../server/types/types';
import { AppStatus } from './constants';
import { HttpResponseError } from './connection/errors';
import { EventEmitter } from './event.emitter';
import { getApi, IClientApi } from '../server/client.api';
import { Account } from './classes/account.class';
import { UserNets } from './classes/user.nets.class';
import { Net } from './classes/net.class';
import { Chat } from './classes/chat.class';
import { Events } from './classes/events.class';
import { getConnection as getHttpConnection } from './connection/http';
import { getConnection as getWsConnection } from './connection/ws';
import { IEvents, UserStatusKeys } from '../server/types/types';

export class ClientApp extends EventEmitter {
  private baseUrl = '';
  private api: IClientApi | null;
  private status: AppStatus = AppStatus.INITING;
  private error: Error | null = null;
  private userStatus: UserStatusKeys = 'NOT_LOGGEDIN';

  account: Account;
  net: Net;
  userNets: UserNets;
  chat: Chat;
  userEvents: Events;

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
      user: this.account.getUser(),
      userStatus: this.userStatus,
      ...this.userNets.getUserNetsState(),
      ...this.net.getNetState(),
      ...this.chat.getChatState(),
      events: this.userEvents.getEvents(),
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
      this.setStatus(AppStatus.INITED);
    } catch (e: any) {
      this.setError(e);
    }
  }

  private setInitialValues() {
    this.userNets = new UserNets(this as any);
    this.chat = new Chat(this as any);
    this.userEvents = new Events(this as any);
  }

  private async setStatus(status: AppStatus) {
    if (this.status === status) return 
    if (status === AppStatus.ERROR) {
      this.status = status;
      this.emit('error', this.error);
      return this.emit('statuschanged', this.status);
    }
    this.error = null;
    if (status === AppStatus.INITED) {
      this.status = AppStatus.READY;
      return this.emit('statuschanged', this.status);
    }
    if (this.status === AppStatus.INITING) return;    
    if (status === AppStatus.READY) {
      this.status = status;
      return this.emit('statuschanged', this.status);
    }
    if (this.status === AppStatus.LOADING)
    await new Promise<void>((rv) => {
      this.once('statuschanged', rv);
    });
    this.status = AppStatus.LOADING
    return this.emit('statuschanged', this.status);
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
  }

  private setUserStatus() {
    const user = this.account.getUser();
    this.userStatus = 'NOT_LOGGEDIN';
    if (!user) return;
    const { net, userNetData } = this.net.getNetState();
    if (!net) {
      this.userStatus = user.user_status;
      return;
    }
    const { confirmed } = userNetData || {}
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

  async setEvents(events: IEvents) {
    const { net } = this.getState();
    const { net_id } = net || {};
    let updateUser = false;
    let updateNet = false;
    for (const event of events) {
      const { net_id: eventNetId } = event;
      if (!eventNetId) {
        updateUser = true;
        net_id && (updateNet = true);
        break;
      }
      if (eventNetId === net_id) updateNet = true;
    }
    if (updateUser) await this.onNewUser(false) // ?
      .catch(console.log);
    if (updateNet) await this.net.enter(net_id!, true)
      .catch(console.log);
  }

  setMessage<T extends T.MessageTypeKeys>(
    messageData: T.IMessage<T>,
  ) {
    if (!messageData) return;

    if (this.userEvents.isNewEvents(messageData))
      return this.userEvents.read();
    if (this.userEvents.isEvent(messageData))
      return this.setEvents([messageData]);

    this.chat.setMessage(messageData);
  }
}

export const app = new ClientApp();

/**
 *  status: this.status,
 *  error: this.error,
 *  user: this.account.getUser(),
 *  ...this.userNets.getUserNetsState(),
 *  - allNets: this.allNets,
 *  - nets: this.nets,
 *  ...this.net.getNetState(),
 *  - userNetData: this.userNetData,
 *  - net: this.userNet,
 *  - circle: this.circle,
 *  - tree: this.tree,
 *  - netView: this.netView,
 *  - boardMessages: this.board.getState(),
 *  - memberData: this.memberData,
 *  ...this.chat.getChatState(),
 *  - messages: this.messages,
 *  - chatIds: this.netChatIds,
 *  events: this.events.getEvents(),
 */
