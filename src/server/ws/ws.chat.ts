import { IWsConnection } from './types';

export class WsChats {
  private connectionChats = new Map<IWsConnection, Set<number>>();
  private chatConnections = new Map<number, Set<IWsConnection>>();

  getChatConnections(chatId: number, connection: IWsConnection | null) {
    connection && this.addChatToConnection(chatId, connection);
    return this.addConnectionToChat(connection, chatId);
  }

  private addChatToConnection(chatId: number, connection: IWsConnection) {
    const chats = this.connectionChats.get(connection);
    if (chats) chats.add(chatId);
    else this.connectionChats.set(connection, new Set([chatId]));
  }

  private addConnectionToChat(
    connection: IWsConnection | null, chatId: number,
  ) {
    let connections = this.chatConnections.get(chatId);
    if (!connection) return connections;
    if (connections) connections.add(connection);
    else {
      connections = new Set([connection]);
      this.chatConnections.set(chatId, connections);
    }
    return connections;
  }

  removeConnection(connection: IWsConnection) {
    const chatsToDelete: number[] = [];
    const chatIds = this.connectionChats.get(connection);
    if (!chatIds) return chatsToDelete;
    for (const chatId of chatIds) {
      const chatToDelete = this.removeConnectionFromChat(connection, chatId);
      chatToDelete && chatsToDelete.push(chatToDelete);
    }
    this.connectionChats.delete(connection);
    return chatsToDelete;
  }

  private removeConnectionFromChat(connection: IWsConnection, chatId: number) {
    const chatConnections = this.chatConnections.get(chatId);
    if (chatConnections!.size > 1) {
      chatConnections!.delete(connection);
    } else {
      this.chatConnections.delete(chatId);
      return chatId;
    }
  }
}
