/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis, TNetChatIdsMap } from '../types';
import { AppStatus } from '../constants';
import { OmitNull } from '../../server/types/types';

type IApp = IClientAppThis;

export class Chat {
  private netChatIds: TNetChatIdsMap = new Map();
  private messages: Map<number, T.IChatMessage[]> = new Map();

  constructor(private app: IApp) {}

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
    this.netChatIds = new Map();
    await this.app.api.chat.connect.user();
    const allChatIds = await this.app.api.chat.connect.nets();
    this.netChatIds = new Map<number, T.INetChatIds>();
    allChatIds.forEach(({ net_id, ...netChatIds }) => {
      this.netChatIds.set(net_id, netChatIds);
    });
  }

  async getMessages(chatId: number, index = 1) {
    await this.app.setStatus(AppStatus.LOADING);
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
    await this.app.setStatus(AppStatus.LOADING);
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
    messageData: OmitNull<T.IChatResponseMessage>,
  ) {
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
