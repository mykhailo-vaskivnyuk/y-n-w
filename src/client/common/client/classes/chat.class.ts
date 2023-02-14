/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis, TNetChatIdsMap } from '../types';
import { AppStatus } from '../constants';

type IApp = Pick<IClientAppThis,
  | 'api'
  | 'getState'
  | 'setStatus'
  | 'setError'
  | 'changes'
  | 'emit'
>;

export class Chat {
  private userChatId?: number;
  private netChatIds: TNetChatIdsMap;
  private messages: Map<number, T.IChatMessage[]>;

  constructor(private app: IApp) {
    this.setMessage = this.setMessage.bind(this);
    this.reset();
  }

  reset() {
    this.userChatId = undefined;
    this.netChatIds = new Map();
    this.messages = new Map();
  }

  getChatState() {
    return {
      messages: this.messages,
      chatIds: this.netChatIds,
    };
  }

  private setNetChatIds(netChatIds: TNetChatIdsMap) {
    this.netChatIds = netChatIds;
  }

  async connectAll() {
    await this.app.api.chat.connect.user();
    const allChatIds = await this.app.api.chat.connect.nets();
    const netChatIdsMap = new Map<number, T.INetChatIds>();
    allChatIds.forEach(({ net_id: netId, ...netChatIds }) => {
      netChatIdsMap.set(netId, netChatIds);
    });
    this.setNetChatIds(netChatIdsMap);
  }

  async getMessages(chatId: number, index = 1) {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const { node_id: nodeId } = this.app.getState().net!;
      const messages = await this.app.api.chat
        .getMessages({ node_id: nodeId, chatId, index });
      this.setAllMessages(chatId, messages);
      this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async sendMessage(message: string, chatId: number) {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const { net } = this.app.getState();
      const { node_id: nodeId } = net!;
      chatId && await this.app.api.chat
        .sendMessage({ node_id: nodeId, chatId, message });
        this.app.setStatus(AppStatus.READY);
      return true;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  getChatId(netView: T.NetViewKeys) {
    const { net } = this.app.getState();
    return this.netChatIds.get(net!.net_id)?.[netView];
  }

  private setAllMessages(chatId: number, messages: T.IChatMessage[]) {
    if (!messages.length) return;
    const curChatMessages = this.messages.get(chatId);
    let chatMessages: T.IChatMessage[];
    if (curChatMessages) {
      chatMessages = [...curChatMessages, ...messages]
        .sort(({ index: a }, { index: b }) => a - b)
        .filter(({ index }, i, arr) => index !== arr[i + 1]?.index);
    } else chatMessages = [...messages];
    this.messages.set(chatId, chatMessages);
    this.app.emit('message', chatId);
  }

  setMessage<T extends T.MessageTypeKeys>(
    messageData: T.IMessage<T>,
  ) {
    if (!messageData) return;

    if (this.app.changes.isNewEvents(messageData))
      return this.app.changes.read();
    if (this.app.changes.isEvent(messageData))
      return this.app.changes.update([messageData]);

    const { chatId } = messageData;

    const chatMessages = this.messages.get(chatId);
    if (chatMessages) {
      const lastMessage = chatMessages.at(-1);
      const { index = 1 } = lastMessage || {};
      if (messageData.index > index + 1)
        this.getMessages(chatId, index + 1);
      chatMessages.push(messageData as T.IChatMessage);
    } else this.messages.set(chatId, [messageData as T.IChatMessage]);
    this.app.emit('message', chatId);
  }

}
