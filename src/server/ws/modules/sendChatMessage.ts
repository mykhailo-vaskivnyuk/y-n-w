import { TWsResModule } from '../types';

export const sendChatMessage: TWsResModule = () =>
  function sendChatMessage(
    connections, _, data) {
    if (!Array.isArray(connections)) return true;
    const response = {
      status: 200,
      error: null,
      data,
    };
    const responseMessage = JSON.stringify(response);
    for (const connection of connections)
      connection.send(responseMessage, { binary: false });
    return true;
  };
