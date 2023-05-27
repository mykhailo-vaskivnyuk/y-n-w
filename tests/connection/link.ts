import { IInputConnection } from '../../src/server/types';
import { IHttpServer } from '../../src/server/http/types';
import {
  IOperation, TOperationResponse,
} from '../../src/types/operation.types';

type THandleOperation = (operation: IOperation) => Promise<TOperationResponse>;

class Connection implements IInputConnection {
  private static exec?: THandleOperation;

  static handleOperation(operation: IOperation) {
    return Connection.exec?.(operation);
  }

  onOperation(cb: THandleOperation) {
    Connection.exec = cb;
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

export = Connection;
