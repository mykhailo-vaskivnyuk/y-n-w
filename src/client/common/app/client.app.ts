/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import {
  IChatMessage, IChatResponseMessage, INetResponse,
  INetsResponse, IUserNetDataResponse, IUserResponse, NetViewKeys,
} from '../api/types/types';
import { INITIAL_NETS, INets, IMember } from './types';
import { OmitNull } from '../types';
import { AppStatus } from '../constants';
import { HttpResponseError } from '../errors';
import { EventEmitter } from '../event.emitter';
import { getApi, IClientApi } from '../api/client.api';
import { getAccountMethods } from './methods/account';
import { getNetMethods } from './methods/net';
import { getMemberMethods } from './methods/member';
import { getChatMethods } from './methods/chat';
import { getConnection as getHttpConnection } from '../client.http';
import { getConnection as getWsConnection } from '../client.ws';

export class ClientApp extends EventEmitter {
  private baseUrl = '';
  protected api: IClientApi | null;

  private status: AppStatus = AppStatus.INITING;
  private error: HttpResponseError | null = null;

  private user: IUserResponse = null;
  private allNets: INetsResponse = [];
  private messages = new Map<number, IChatMessage[]>();
  private userNetData: IUserNetDataResponse | null = null;
  private nets: INets = INITIAL_NETS;
  private userNet: INetResponse = null;
  private circle: IMember[] = [];
  private tree: IMember[] = [];
  private netView?: NetViewKeys;
  private memberData?: IMember;

  account: ReturnType<typeof getAccountMethods>;
  netMethods: ReturnType<typeof getNetMethods>;
  member: ReturnType<typeof getMemberMethods>;
  chat: ReturnType<typeof getChatMethods>;

  constructor() {
    super();
    this.account = getAccountMethods(this as any);
    this.netMethods = getNetMethods(this as any);
    this.member = getMemberMethods(this as any);
    this.chat = getChatMethods(this as any);
    this.baseUrl = process.env.API || `${window.location.origin}/api`;
  }

  getState() {
    return {
      status: this.status,
      error: this.error,
      user: this.user,
      userNetData: this.userNetData,
      net: this.userNet,
      circle: this.circle,
      tree: this.tree,
      allNets: this.allNets,
      nets: this.nets,
      netView: this.netView,
      memberData: this.memberData,
      messages: this.messages,
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
          baseUrl, this.chat.onMessage.bind(this),
        );
        this.api = getApi(connection);
        await this.api.health();
      } catch (err: any) {
        return this.setError(err);
      }
    }
    await this.readUser();
    this.setStatus(AppStatus.INITED);
  }

  protected async setUser(user: IUserResponse) {
    if (this.user === user) return;
    this.user = user;
    if (user && user.user_status !== 'NOT_CONFIRMED') {
      await this.netMethods.getAllNets();
      this.netMethods.getNets();
    } else {
      this.nets = INITIAL_NETS;
      this.allNets = [];
      this.messages = new Map();
    }
    this.emit('user', user);
  }

  protected async setNet(userNet: INetResponse | null = null) {
    if (this.userNet === userNet) return;
    this.userNet = userNet;
    if (userNet) {
      await this.netMethods.getUserData(userNet.net_node_id);
      this.user!.user_status = this.userNetData!.confirmed ?
        'INSIDE_NET' :
        'INVITING';
      await this.netMethods.getCircle();
      await this.netMethods.getTree();
      this.emit('user', { ...this.user });
    } else {
      this.setUserNetData();
      this.setCircle();
      this.setTree();
      this.setNetView();
      this.setMember();
      if (this.user) {
        this.user!.user_status = 'LOGGEDIN';
        this.emit('user', { ...this.user });
      }
    }
    this.netMethods.getNets();
    this.emit('net', userNet);
  }

  protected setUserNetData(
    userNetData: IUserNetDataResponse | null = null,
  ) {
    if (this.userNetData === userNetData) return;
    this.userNetData = userNetData;
  }

  protected setAllNets(nets: INetsResponse) {
    if (this.allNets === nets) return;
    this.allNets = nets;
  }

  protected setNets(nets: INets) {
    if (this.nets === nets) return;
    this.nets = nets;
    this.emit('nets', this.nets);
  }

  protected setCircle(circle: IMember[] = []) {
    if (this.circle === circle) return;
    this.circle = circle;
    this.emit('circle', circle);
  }

  protected setNetView(netView?: NetViewKeys) {
    this.netView = netView;
  }

  setMember(memberData?: IMember) {
    this.memberData = memberData;
  }

  protected setTree(tree: IMember[] = []) {
    if (this.tree === tree) return;
    this.tree = tree;
    this.emit('tree', tree);
  }

  protected setStatus(status: AppStatus) {
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

  protected setError(e: HttpResponseError) {
    this.error = e;
    this.setStatus(AppStatus.ERROR);
  }

  protected async setMessage(messageData: OmitNull<IChatResponseMessage>) {
    const { chatId, ...message } = messageData;
    if (!message.message) return;
    const chatMessages = this.messages.get(chatId);
    if (chatMessages) {
      const lastMessage = chatMessages.at(-1);
      const { index = 0 } = lastMessage || {};
      if (message.index > index + 1)
        await this.chat.getMessages(chatId, index + 1);
      chatMessages.push(message as IChatMessage);
    } else  this.messages.set(chatId, [message as IChatMessage]);
    this.emit('message', chatId);
  }

  protected setAllMessages(chatId: number, messages: IChatMessage[]) {
    if (!messages.length) return;
    let chatMessages: IChatMessage[] = messages.map(
      ({ user_id, message, index }) => ({ user_id, message, index })
    );
    const curChatMessages = this.messages.get(chatId);
    console.log(chatId, this.messages.size, curChatMessages?.length);
    if (curChatMessages) {
      chatMessages = [...curChatMessages, ...chatMessages]
        .sort(({ index: a }, { index: b }) => a - b)
        .filter(({ index }, i, arr) => index !== arr[i + 1]?.index);
    }
    this.messages.set(chatId, [...chatMessages]);
  }

  private async readUser() {
    this.setStatus(AppStatus.LOADING);
    try {
      const user = await this.api!.user.read();
      await this.setUser(user);
      this.setStatus(AppStatus.READY);
      return user;
    } catch (e: any) {
      this.setError(e);
    }
  }
}

export const app = new ClientApp();
