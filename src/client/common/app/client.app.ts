/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../api/types/types';
import { INITIAL_NETS, INets, IMember, INetChatIds } from './types';
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

  private user: T.IUserResponse = null;
  private allNets: T.INetsResponse = [];
  private messages = new Map<number, T.IChatMessage[]>();
  private userNetData: T.IUserNetDataResponse | null = null;
  private nets: INets = INITIAL_NETS;
  private userNet: T.INetResponse = null;
  private circle: IMember[] = [];
  private tree: IMember[] = [];
  private netView?: T.NetViewEnum;
  private memberData?: IMember;
  private chatIds = new Map<number, INetChatIds>();

  account: ReturnType<typeof getAccountMethods>;
  net: ReturnType<typeof getNetMethods>;
  member: ReturnType<typeof getMemberMethods>;
  chat: ReturnType<typeof getChatMethods>;

  constructor() {
    super();
    this.baseUrl = process.env.API || `${window.location.origin}/api`;
    this.account = getAccountMethods(this as any);
    this.net = getNetMethods(this as any);
    this.member = getMemberMethods(this as any);
    this.chat = getChatMethods(this as any);
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
      chatIds: this.chatIds,
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
          this.setMessage.bind(this),
          this.handleConnect.bind(this),
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

  protected async setUser(user: T.IUserResponse) {
    if (this.user === user) return;
    this.user = user;
    if (user && user.user_status !== 'NOT_CONFIRMED') {
      await this.net.getAllNets();
      this.net.getNets();
    } else {
      this.nets = INITIAL_NETS;
      this.allNets = [];
      this.messages = new Map();
    }
    this.emit('user', user);
  }

  protected async setNet(userNet: T.INetResponse = null) {
    if (this.userNet === userNet) return;
    this.userNet = userNet;
    if (userNet) {
      await this.net.getUserData(userNet.net_node_id);
      this.user!.user_status = this.userNetData!.confirmed ?
        'INSIDE_NET' :
        'INVITING';
      await this.net.getCircle();
      await this.net.getTree();
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
    this.net.getNets();
    this.emit('net', userNet);
  }

  protected setUserNetData(
    userNetData: T.IUserNetDataResponse | null = null,
  ) {
    if (this.userNetData === userNetData) return;
    this.userNetData = userNetData;
  }

  protected setAllNets(nets: T.INetsResponse) {
    if (this.allNets === nets) return;
    this.allNets = nets;
  }

  protected setNets(nets: INets) {
    if (this.nets === nets) return;
    this.nets = nets;
    this.emit('nets', this.nets);
  }

  protected setNetView(netView?: T.NetViewEnum) {
    this.netView = netView;
  }

  protected setCircle(circle: IMember[] = []) {
    if (this.circle === circle) return;
    this.circle = circle;
    this.emit('circle', circle);
  }

  protected setTree(tree: IMember[] = []) {
    if (this.tree === tree) return;
    this.tree = tree;
    this.emit('tree', tree);
  }

  protected setMember(memberData?: IMember) {
    this.memberData = memberData;
  }

  private handleConnect() {
    if (this.status === AppStatus.INITING) return;
    this.chat.connectAll();
  }

  protected setChatId(
    netNodeId: number,
    netView: T.NetViewKeys,
    message: T.IChatConnectResponse,
  ) {
    if (!message) return;
    const { chatId } = message;
    const netChatIds = this.chatIds.get(netNodeId);
    if (netChatIds) netChatIds[netView] = chatId;
    else this.chatIds.set(netNodeId, { [netView]: chatId });
    return chatId;
  }

  protected setMessage(messageData: T.IChatResponseMessage) {
    if (!messageData) return;
    const { chatId, ...message } = messageData;
    if (!message.message) return;
    const chatMessages = this.messages.get(chatId);
    if (chatMessages) {
      const lastMessage = chatMessages.at(-1);
      const { index = 1 } = lastMessage || {};
      if (message.index > index + 1) this.chat.getMessages(chatId, index + 1);
      chatMessages.push(message as T.IChatMessage);
    } else this.messages.set(chatId, [message as T.IChatMessage]);
    this.emit('message', chatId);
  }

  protected setAllMessages(chatId: number, messages: T.IChatMessage[]) {
    if (!messages.length) return;
    const curChatMessages = this.messages.get(chatId);
    let chatMessages: T.IChatMessage[];
    if (curChatMessages) {
      chatMessages = [...curChatMessages, ...messages]
        .sort(({ index: a }, { index: b }) => a - b)
        .filter(({ index }, i, arr) => index !== arr[i + 1]?.index);
    } else chatMessages = [...messages];
    this.messages.set(chatId, chatMessages);
    this.emit('message', chatId);
  }
}

export const app = new ClientApp();
