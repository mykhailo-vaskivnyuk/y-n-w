import { IInputConnection } from '../types';
import { IHttpServer } from '../http/types';
import { THandleOperation } from '../../types/operation.types';

class LinkConnection implements IInputConnection {
  private static exec?: THandleOperation;

  static handleRequest(
    name: string, params: Record<string, any> = {},
  ): Promise<any> {
    return LinkConnection.exec!({
      options: {
        sessionKey: 'sessionKey',
        origin: 'origin',
      },
      names: name.split('/'),
      data: { params },
    });
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
