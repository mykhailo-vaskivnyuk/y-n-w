import { IInputConnection } from '../types';
import { IHttpServer } from '../http/types';
import {
  IOperation, THandleOperation
} from '../../types/operation.types';

class LinkConnection implements IInputConnection {
  private static exec?: THandleOperation;

  static handleOperation(operation: IOperation) {
    return LinkConnection.exec?.(operation);
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

  getConnectionService() {
    return {
      sendMessage: () => false,
    };
  }
}

export = LinkConnection;
