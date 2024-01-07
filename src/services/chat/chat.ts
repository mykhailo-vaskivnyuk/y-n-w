/* eslint-disable max-lines */
import * as T from '../../client/common/server/types/types';
import { IChatMapValue } from './types';
import { IMemberNode } from '../../domain/types/member.types';
import {
  MAX_CHAT_INDEX,
  MAX_CHAT_MESSAGE_COUNT,
  MAX_CHAT_MESSAGE_INDEX,
} from '../../constants/constants';

export class ChatService {
  private messages = new Map<number, T.IChatMessage[]>();
  private counter = 0;
  private connectionChats = new Map<number, Set<number>>();
  private chatConnections = new Map<number, Set<number>>();
  private userConnections = new Map<number, Set<number>>();
  private connectionUser = new Map<number, number>();
  private userChats = new Map<number, Set<number>>();
  private netChats = new Map<number, number>();
  private nodeChats = new Map<number, number>();
  private chatUsers = new Map<number, Set<number>>();
  private chatNetOrNode = new Map<number, IChatMapValue>();
  private getChatMap = {
    net: this.getNetChatId.bind(this),
    tree: this.getTreeChatId.bind(this),
    circle: this.getCircleChatId.bind(this),
  };

  private genChatId() {
    this.counter = (this.counter % MAX_CHAT_INDEX) + 1;
    return this.counter;
  }

  addUserConnection(user_id: number, connectionId: number) {
    let connections = this.userConnections.get(user_id);
    if (connections) connections.add(connectionId);
    else {
      connections = new Set([connectionId]);
      this.userConnections.set(user_id, connections);
    }
    this.connectionUser.set(connectionId, user_id);
  }

  getUserConnections(user_id: number) {
    return this.userConnections.get(user_id);
  }

  getChatsForUserNet(user_id: number, node: IMemberNode, connectionId: number) {
    const { net_id } = node;
    const netChatIds: T.IChatConnectAll[number] = { net_id };
    for (const netView of T.NET_VIEW_MAP) {
      const chatId = this.getChatMap[netView](node);
      if (!chatId) continue;
      netChatIds[netView] = chatId;
      if (!connectionId) continue;
      this.addChatAndUser(chatId, user_id);
      this.addChatAndConnection(chatId, connectionId);
    }
    return netChatIds;
  }

  removeChatsForUserNet() {
    // user_id: number, node: IMemberNode
    // todo
  }

  getNetConnections(net_id: number) {
    const chatId = this.netChats.get(net_id);
    if (!chatId) return;
    return this.getChatConnections(chatId);
  }

  removeConnection(connectionId?: number) {
    if (!connectionId) return;
    const user_id = this.connectionUser.get(connectionId);
    if (!user_id) return;
    this.connectionUser.delete(connectionId);
    const connections = this.userConnections.get(user_id);
    if (!connections) return;
    connections.delete(connectionId);
    const userDisconnect = !connections.size;
    if (userDisconnect) {
      this.userConnections.delete(user_id);
      this.userChats.delete(user_id);
    }
    const chatIds = this.connectionChats.get(connectionId);
    if (!chatIds) return;
    this.connectionChats.delete(connectionId);
    for (const chatId of chatIds) {
      userDisconnect && this.removeUserFromChat(user_id, chatId);
      this.removeConnectionFromChat(connectionId, chatId);
    }
  }

  persistMessage(user_id: number, messageData: T.IChatSendMessage) {
    const { chatId, message } = messageData;
    if (!this.checkUserChat(user_id, chatId)) return [];
    const chatMessages = this.messages.get(chatId);
    let index: number;
    if (chatMessages) {
      const { index: lastIndex } = chatMessages.at(-1)!;
      index = (lastIndex % MAX_CHAT_MESSAGE_INDEX) + 1;
      chatMessages.push({ user_id, chatId, index, message });
      chatMessages.length > MAX_CHAT_MESSAGE_COUNT && chatMessages.shift();
    } else {
      index = 1;
      this.messages.set(chatId, [{ user_id, chatId, index, message }]);
    }
    const connectionIds = this.getChatConnections(chatId);
    const responseMessage = { chatId, user_id, index, message };
    return [responseMessage, connectionIds] as const;
  }

  getMessages(user_id: number, { chatId, index = 1 }: T.IChatGetMessages) {
    if (!this.checkUserChat(user_id, chatId)) return [];
    const chatMessages = this.messages.get(chatId);
    if (!chatMessages) return [];
    const { index: lastIndex } = chatMessages.at(-1)!;
    const count = lastIndex - index + 1;
    if (count < 1) return [];
    const allCount = chatMessages.length;
    const messages = chatMessages.slice(-Math.min(count, allCount));
    return messages;
  }

  private getChatConnections(chatId: number) {
    return this.chatConnections.get(chatId);
  }

  private checkUserChat(user_id: number, chatId: number) {
    const userChats = this.userChats.get(user_id);
    return userChats?.has(chatId) || false;
  }

  private getNetChatId({ net_id }: IMemberNode) {
    let chatId = this.netChats.get(net_id);
    if (chatId) return chatId;
    chatId = this.genChatId();
    this.netChats.set(net_id, chatId);
    this.chatNetOrNode.set(chatId, { net_id });
    return chatId;
  }

  private getTreeChatId({ node_id }: IMemberNode) {
    return this.getNodeChatId(node_id);
  }

  private getCircleChatId({ parent_node_id }: IMemberNode) {
    return this.getNodeChatId(parent_node_id);
  }

  private getNodeChatId(node_id: number | null) {
    if (!node_id) return null;
    let chatId = this.nodeChats.get(node_id);
    if (chatId) return chatId;
    chatId = this.genChatId();
    this.nodeChats.set(node_id, chatId);
    this.chatNetOrNode.set(chatId, { node_id });
    return chatId;
  }

  private addChatAndUser(chatId: number, user_id: number) {
    const chats = this.userChats.get(user_id);
    if (chats) chats.add(chatId);
    else this.userChats.set(user_id, new Set([chatId]));

    const users = this.chatUsers.get(chatId);
    if (users) users.add(chatId);
    else this.chatUsers.set(chatId, new Set([user_id]));
  }

  private addChatAndConnection(chatId: number, connection: number) {
    this.addChatToConnection(chatId, connection);
    this.addConnectionToChat(connection, chatId);
  }

  private addChatToConnection(chatId: number, connection: number) {
    const chats = this.connectionChats.get(connection);
    if (chats) chats.add(chatId);
    else this.connectionChats.set(connection, new Set([chatId]));
  }

  private addConnectionToChat(connection: number, chatId: number) {
    const connections = this.chatConnections.get(chatId);
    if (connections) connections.add(connection);
    else this.chatConnections.set(chatId, new Set([connection]));
  }

  private removeUserFromChat(user_id: number, chatId: number) {
    const chatUsers = this.chatUsers.get(chatId);
    chatUsers!.delete(user_id);
    if (chatUsers!.size) return;
    this.chatUsers.delete(chatId);
  }

  private removeConnectionFromChat(connection: number, chatId: number) {
    const chatConnections = this.chatConnections.get(chatId);
    chatConnections!.delete(connection);
    if (chatConnections!.size) return;
    this.chatConnections.delete(chatId);
    this.removeChat(chatId);
  }

  private removeChat(chatId: number) {
    const { net_id, node_id } = this.chatNetOrNode.get(chatId) || {};
    net_id && this.netChats.delete(net_id);
    node_id && this.nodeChats.delete(node_id);
  }
}

export default () => new ChatService();
