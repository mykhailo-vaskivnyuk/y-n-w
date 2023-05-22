import { IInputConnection } from '../../src/server/types';
import { IHttpServer } from '../../src/server/http/types';
import {
  IOperation, TOperationResponse,
} from '../../src/types/operation.types';
import { setCallback } from './connection.handleOperation';

class HttpConnection implements IInputConnection {
  private server: IHttpServer;

  constructor() {
    this.server = {} as IHttpServer;
  }

  onOperation(cb: (operation: IOperation) => Promise<TOperationResponse>) {
    setCallback(cb);
  }

  setUnavailable() {
    return;
  }

  getServer() {
    return this.server;
  }

  async start() {
    return;
  }

  getConnectionService() {
    return {
      sendMessage: () => false,
    };
  }
}

export = HttpConnection;
