import { TWsResModule } from '../types';

export const sendChatMessage: TWsResModule = () =>
  async function sendChatMessage(connections, _, data) {
    if (!Array.isArray(connections)) return true;
    const response = {
      status: 200,
      error: null,
      data,
    };
    const responseMessage = JSON.stringify(response);

    return new Promise((rv) => {
      let needed = connections.length;
      const cb = (e?: Error) => {
        if (!needed) return;
        needed--;
        if (e) {
          needed = 0;
          rv(false);
        } else {
          if (needed) return;
          rv(true);
        }
      };
      for (const connection of connections) {
        connection.send(responseMessage, { binary: false }, cb);
      }
    });
  };
