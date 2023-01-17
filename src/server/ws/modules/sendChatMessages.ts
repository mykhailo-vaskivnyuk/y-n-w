import { IWsConnection, TWsResModule } from '../types';
import { WsChats } from '../ws.chat';

const getChatConnections = (
  chatId: number, connection: IWsConnection, wsChats: WsChats
): IWsConnection[] | undefined => {
  const chatConnections = wsChats.addConnection(connection, chatId);
  return chatConnections && [...chatConnections];
};

export const sendChatMessages: TWsResModule = () =>
  function sendChatMessages(connection, options, data, wsChats) {
    const { chatId } = data as { chatId: number } || {};
    if (!chatId) return true;
    const chatConnections = getChatConnections(chatId, connection, wsChats);
    if (!chatConnections) return true;
    const chatResponse = {
      status: 200,
      error: null,
      data,
    };
    const chatResponseMessage = JSON.stringify(chatResponse);
    for (const connection of chatConnections)
      connection.send(chatResponseMessage, { binary: false });
    return true;
  };
