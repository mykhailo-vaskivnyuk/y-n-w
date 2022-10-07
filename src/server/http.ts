import http = require('http');
import { IInputConnection, IOperation, IOperationResponce } from '../app/types';
import { promiseExecutor } from '../types';
import { ServerError, ServerErrorEnum, ServerErrorMap } from './errors';

const CRUD = {
  get: 'read',
  post: 'create',
  put: 'update',
  delete: 'delete',
}

class HttpConnection implements IInputConnection {
  private server: http.Server;
  private onOperationCb?: (operation: IOperation) => Promise<IOperationResponce>;

  constructor() {
    this.server = http.createServer(this.onRequest.bind(this));
  }

  onOperation(cb: (operation: IOperation) => Promise<IOperationResponce>) {
    this.onOperationCb = cb;
    return this;
  }

  start() {
    if (!this.onOperationCb) {
      throw new ServerError(ServerErrorEnum.E_NO_CALLBACK);
    }
    const cb: promiseExecutor = (rv, rj) => {
      try {
        this.server.listen(8000, () => rv(null));
      } catch (e: any) {
        logger.error(e);
        rj(new ServerError(ServerErrorEnum.E_LISTEN));
      }
    }
    return new Promise(cb);
  }

  private async onRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const { method = 'GET', url = '/', headers } = req;
    const urlObj = new URL(url, `http://${headers.host}`);
    const { pathname, searchParams } = urlObj;
    const crudMethod = CRUD[method?.toLowerCase() as keyof typeof CRUD];
    const names = pathname.slice(1).split('/');
    crudMethod && names.push(crudMethod);

    try {
      const data = await this.getBody(req);
      const queryParams = searchParams.entries();
      for (const [key, value] of queryParams) data[key] = value;
      const operation = { names, data };
      logger.info(operation, 'OPERATION');

      await this.onOperationCb!(operation)
        .then(JSON.stringify)
        .then((data) => res.end(data));
    } catch (e) {
      this.onError(e, res);
    }
  }

  private onError(e: any, res: http.ServerResponse) {
    switch(e?.code) {
    case ServerErrorEnum.E_NOT_FOUND:
      res.statusCode = 404;
      res.end(ServerErrorMap.E_NOT_FOUND);
      break;
    case ServerErrorEnum.E_BED_REQUEST:
      res.statusCode = 409;
      res.end(ServerErrorMap.E_BED_REQUEST);
      break;
    case ServerErrorEnum.E_UNAVAILABLE:
      res.statusCode = 503;
      res.end(ServerErrorMap.E_UNAVAILABLE);
      break;
    default:
      res.statusCode = 500;
      res.end(ServerErrorMap.E_SERVER_ERROR);
      logger.error(e);
      throw e;
    }
  }

  private async getBody(req: http.IncomingMessage) {
    try {
      const buffers: Uint8Array[] = [];
      for await (const chunk of req) buffers.push(chunk as any);
      const data = Buffer.concat(buffers).toString();
      return JSON.parse(data);
    } catch (e: any) {
      logger.error(e);
      throw new ServerError(ServerErrorEnum.E_BED_REQUEST);
    }
  }
}

export = new HttpConnection();
