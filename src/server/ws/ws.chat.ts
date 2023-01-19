import { IWsConnection } from './types';

export class WsChats {
  private connectionChats = new Map<IWsConnection, Set<number>>();
  private chatConnections = new Map<number, Set<IWsConnection>>();

  getChatConnections(chatId: number, connection: IWsConnection) {
    this.addChatToConnection(chatId, connection);
    return this.addConnectionToChat(connection, chatId);
  }

  private addChatToConnection(chatId: number, connection: IWsConnection) {
    const chats = this.connectionChats.get(connection);
    if (chats) chats.add(chatId);
    else this.connectionChats.set(connection, new Set([chatId]));
  }

  private addConnectionToChat(connection: IWsConnection, chatId: number) {
    let connections = this.chatConnections.get(chatId);
    if (connections) connections.add(connection);
    else {
      connections = new Set([connection]);
      this.chatConnections.set(chatId, connections);
    }
    return connections;
  }

  removeConnection(connection: IWsConnection) {
    logger.debug('WS CONNECTION REMOVE');
    const chatIds = this.connectionChats.get(connection);
    if (!chatIds) return;
    for (const chatId of chatIds)
      this.removeConnectionFromChat(connection, chatId);
    this.connectionChats.delete(connection);
  }

  private removeConnectionFromChat(connection: IWsConnection, chatId: number) {
    logger.fatal('REMOVE CONNECTION FRON CHAT');
    const chatConnections = this.chatConnections.get(chatId);
    if (chatConnections!.size > 1) {
      chatConnections!.delete(connection);
    } else {
      this.chatConnections.delete(chatId);
    }
  }
}
