/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../server/types/types';
// import {
//   INITIAL_NETS, INets, IMember, TNetChatIdsMap,
// } from './types';
// import { ITableBoardMessages } from '../../local/imports';
import { IMember } from './types';
import { AppStatus } from './constants';
import { HttpResponseError } from './connection/errors';
import { EventEmitter } from './event.emitter';
import { getApi, IClientApi } from '../server/client.api';
import { Account } from './classes/account.class';
import { UserNets } from './classes/user.nets.class';
import { Net } from './classes/net.class';
import { Chat } from './classes/chat.class';
import { Changes } from './classes/changes.class';
import { getMemberMethods } from './methods/member';
import { getConnection as getHttpConnection } from './connection/http';
import { getConnection as getWsConnection } from './connection/ws';

export class ClientApp extends EventEmitter {
  private baseUrl = '';
  private api: IClientApi | null;
  private status: AppStatus = AppStatus.INITING;
  private error: HttpResponseError | null = null;
  private memberData?: IMember;
  // private netChatIds: TNetChatIdsMap;
  // private netChanges: T.IEvents;
  // private boardMessages: ITableBoardMessages[];

  account: Account;
  net: Net;
  userNets: UserNets;
  chat: Chat;
  changes: Changes;
  member: ReturnType<typeof getMemberMethods>;

  constructor() {
    super();
    this.baseUrl = process.env.API || `${window.location.origin}/api`;
    this.account = new Account(this as any);
    this.net = new Net(this as any);
    this.chat = new Chat(this as any);
    this.changes = new Changes(this as any);
    this.member = getMemberMethods(this as any);
    this.setInitialValues();
  }

  getState() {
    return {
      status: this.status,
      error: this.error,
      user: this.account.getUser(),
      memberData: this.memberData,
      ...this.userNets.getUserNetsState(),
      ...this.net.getNetState(),
      ...this.chat.getChatState(),
      changes: this.changes.getChanges(),
    };
  }

  async init() {
    try {
      const connection = getHttpConnection(this.baseUrl);
      this.api = getApi(connection);
      await this.api.health();
    } catch (e: any) {
      if (!(e instanceof HttpResponseError)) return this.setError(e);
      if (e.statusCode !== 503) return this.setError(e);
      try {
        const baseUrl = this.baseUrl.replace('http', 'ws');
        const connection = getWsConnection(
          baseUrl,
          this.handleConnect.bind(this),
          this.chat.setMessage,
        );
        this.api = getApi(connection);
        await this.api.health();
      } catch (err: any) {
        return this.setError(err);
      }
    }
    await this.account.readUser();
    this.setStatus(AppStatus.INITED);
  }

  private setInitialValues() {
    this.userNets = new UserNets(this as any);
    this.chat.reset();
    this.changes = new Changes(this as any);
  }

  private setStatus(status: AppStatus) {
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
    this.status = status;
    return this.emit('statuschanged', this.status);
  }

  private setError(e: HttpResponseError) {
    this.error = e;
    this.setStatus(AppStatus.ERROR);
  }

  private handleConnect() {
    if (this.status === AppStatus.INITING) return;
    this.chat.reset();
    this.chat.connectAll().catch((e) => this.setError(e));
    this.changes.read(true).catch((e) => this.setError(e));
  }
  
  private async setUser(user: T.IUserResponse, readChanges = true) {
    if (user && user.user_status !== 'NOT_CONFIRMED') {
      await this.userNets.getAllNets();
      this.userNets.getNets();
      readChanges && await this.changes.read(true);
    } else this.setInitialValues();
    this.emit('user', user);
  }

  private setMember(memberData?: IMember) {
    this.memberData = memberData;
  }

  // private handleConnect() {
  //   if (this.status === AppStatus.INITING) return;
  //   this.netChatIds = new Map();
  //   this.messages = new Map();
  //   this.chat.connectAll().catch((e) => this.setError(e));
  //   this.changes.read(true).catch((e) => this.setError(e));
  // }

  // protected setNetChatIds(netChatIds: TNetChatIdsMap) {
  //   this.netChatIds = netChatIds;
  // }

  // protected setMessage<T extends T.MessageTypeKeys>(
  //   messageData: T.IMessage<T>,
  // ) {
  //   if (!messageData) return;
  //   if (this.changes.isNewEvents(messageData)) return this.changes.read();
  //   if (this.changes.isEvent(messageData))
  //     return this.changes.update([messageData]);

  //   const { chatId } = messageData;
  //   // if (!messageData.message) return;
  //   const chatMessages = this.messages.get(chatId);
  //   if (chatMessages) {
  //     const lastMessage = chatMessages.at(-1);
  //     const { index = 1 } = lastMessage || {};
  //     if (messageData.index > index + 1)
  //       this.chat.getMessages(chatId, index + 1);
  //     chatMessages.push(messageData as T.IChatMessage);
  //   } else this.messages.set(chatId, [messageData as T.IChatMessage]);
  //   this.emit('message', chatId);
  // }

  // protected setAllMessages(chatId: number, messages: T.IChatMessage[]) {
  //   if (!messages.length) return;
  //   const curChatMessages = this.messages.get(chatId);
  //   let chatMessages: T.IChatMessage[];
  //   if (curChatMessages) {
  //     chatMessages = [...curChatMessages, ...messages]
  //       .sort(({ index: a }, { index: b }) => a - b)
  //       .filter(({ index }, i, arr) => index !== arr[i + 1]?.index);
  //   } else chatMessages = [...messages];
  //   this.messages.set(chatId, chatMessages);
  //   this.emit('message', chatId);
  // }

  // protected setBoardMessages(messages: ITableBoardMessages[] = []) {
  //   this.boardMessages = messages;
  // }

  // protected setChanges(changes: T.IEvents) {
  //   this.netChanges = changes;
  //   this.emit('changes', changes);
  // }
}

export const app = new ClientApp();
