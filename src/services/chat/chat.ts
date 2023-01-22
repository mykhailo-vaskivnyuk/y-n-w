/* eslint-disable max-lines */
import * as T from '../../client/common/api/types/types';
import { IUserNet } from '../../router/types';
import {
  MAX_CHAT_MESSAGE_COUNT, MAX_CHAT_MESSAGE_INDEX,
} from '../../constants/constants';

interface IUserNetNode {
  user_id?: number;
  net_node_id?: number;
  node_id?: number;
}

export class ChatService {
  private messages = new Map<number, T.IChatMessage[]>();
  private counter = 0;
  private userChatIds = new Map<number, number>();
  private netChatIds = new Map<number, number>();
  private nodeChatIds = new Map<number, number>();
  private getChatIdMap = {
    net: this.getNetChatId.bind(this),
    tree: this.getTreeChatId.bind(this),
    circle: this.getCircleChatId.bind(this),
  };
  private chatIdUserNetNode = new Map<number, IUserNetNode>();

  getUserChatId(user_id: number) {
    let chatId = this.userChatIds.get(user_id);
    if (chatId) return chatId;
    chatId = ++this.counter;
    this.userChatIds.set(user_id, chatId);
    this.chatIdUserNetNode.set(chatId, { user_id });
    return chatId;
  }

  getChatIdOfNet(userNet: IUserNet, netView: T.NetViewKeys) {
    return this.getChatIdMap[netView](userNet);
  }

  getNetChatId({ net_node_id }: IUserNet) {
    let chatId = this.netChatIds.get(net_node_id);
    if (chatId) return chatId;
    chatId = ++this.counter;
    this.netChatIds.set(net_node_id, chatId);
    this.chatIdUserNetNode.set(chatId, { net_node_id });
    return chatId;
  }

  getNodeChatId(node_id: number | null) {
    if (!node_id) return null;
    let chatId = this.nodeChatIds.get(node_id);
    if (chatId) return chatId;
    chatId = ++this.counter;
    this.nodeChatIds.set(node_id, chatId);
    this.chatIdUserNetNode.set(chatId, { node_id });
    return chatId;
  }

  getTreeChatId({ node_id }: IUserNet) {
    return this.getNodeChatId(node_id);
  }

  getCircleChatId({ parent_node_id }: IUserNet) {
    return this.getNodeChatId(parent_node_id);
  }

  getUserNetNode(chatId: number) {
    return this.chatIdUserNetNode.get(chatId);
  }

  remove(chatId: number) {
    const { user_id, net_node_id, node_id } = this.getUserNetNode(chatId) || {};
    user_id && this.userChatIds.delete(user_id);
    net_node_id && this.netChatIds.delete(net_node_id);
    node_id && this.userChatIds.delete(node_id);
  }

  addMessage(user_id: number, messageData: T.IChatSendMessage) {
    const { chatId, message } = messageData;
    const chatMessages = this.messages.get(chatId);
    let index: number;
    if (chatMessages) {
      const { index: lastIndex } = chatMessages.at(-1)!;
      index = (lastIndex % MAX_CHAT_MESSAGE_INDEX) + 1;
      chatMessages.push({ user_id, index, message });
      chatMessages.length > MAX_CHAT_MESSAGE_COUNT && chatMessages.shift();
    } else {
      index = 1;
      this.messages.set(chatId, [{ user_id, index, message }]);
    }
    return { chatId, user_id, index, message };
  }

  getMessages({ chatId, index = 1 }: T.IChatGetMessages) {
    const chatMessages = this.messages.get(chatId);
    if (!chatMessages) return [];
    const { index: lastIndex } = chatMessages.at(-1)!;
    const count = lastIndex - index + 1;
    if (count < 1) return [];
    const allCount = chatMessages.length;
    const messages = chatMessages.slice(-Math.min(count, allCount));
    return messages;
  }
}

export default () => new ChatService();
