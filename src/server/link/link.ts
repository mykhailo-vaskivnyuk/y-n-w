import { IInputConnection } from '../types';
import { IHttpServer } from '../http/types';
import { THandleOperation } from '../../types/operation.types';
import { createUnicCode } from '../../utils/crypto';

class LinkConnection implements IInputConnection {
  private static exec?: THandleOperation;

  static getClient() {
    const sessionKey = createUnicCode(10);
    const handleRequest = (
      name: string, params: Record<string, any> = {},
    ): Promise<any> =>
      LinkConnection.exec!({
        options: {
          sessionKey,
          origin: 'http://localhost',
        },
        names: name.split('/').filter(Boolean),
        data: { params },
      });
    return handleRequest;
  }

  onOperation(cb: THandleOperation) {
    LinkConnection.exec = cb;
  }

  setUnavailable() {
    return;
  }

  getServer() {
    return {} as IHttpServer;
  }

  async start() {
    return;
  }

  async stop() {
    return;
  }

  getConnectionService() {
    return {
      sendMessage: () => false,
    };
  }
}

export = LinkConnection;
