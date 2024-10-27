import { TWsResModule } from '../types';
import { getLog } from '../methods/utils';

export const sendResponse: TWsResModule = () =>
  async function sendResponse(connection, options, data) {
    if (!options) return true;
    if (Array.isArray(connection)) return true;
    const { requestId, pathname } = options;
    const response = {
      requestId,
      status: 200,
      error: null,
      data,
    };
    const responseMessage = JSON.stringify(response);
    await new Promise((rv, rj) => {
      const cb = (e?: Error) => {
        e ? rj(e) : rv(true);
      };
      connection.send(responseMessage, { binary: false }, cb);
    });
    logger.info(getLog(pathname, 'OK'));
    return true;
  };
