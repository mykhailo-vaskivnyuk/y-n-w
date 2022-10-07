import { IInputConnection, IOperation, IOperationResponce } from '../app/types';
import http = require('http');
import { ServerError, ServerErrorCode, ServerErrorEnum, ServerErrorMap } from './errors';

const CRUD = {
  get: 'read',
  post: 'create',
  put: 'update',
  delete: 'delete',
}

class HttpConnection implements IInputConnection {
  private server: http.Server;
  private onOperationCb?: ((operation: IOperation) => Promise<IOperationResponce>);

  constructor() {
    this.server = http.createServer((req, res) => this.onRequest(req, res));
  }

  onOperation(cb: (operation: IOperation) => Promise<IOperationResponce>): this {
    this.onOperationCb = cb;
    return this;
  }

  start() {
    if (!this.onOperationCb) throw this.error(ServerErrorEnum.E_NO_CALLBACK);
    const cb = (...[rv, rj]: any) => {
      try {
        this.server.listen(8000, rv);
      } catch (e: any) {
        logger.error(e);
        rj(this.error(ServerErrorEnum.E_LISTEN));
      }
    }
    return new Promise(cb);
  }

  private async onRequest(...[req, res]: Parameters<http.RequestListener>) {
    const { method, url } = req;
    const names = (url || '').slice(1).split('/');
    const crud = CRUD[method?.toLowerCase() as keyof typeof CRUD];
    crud && names.push(crud);
    const data = {};
    const operation = { names, data };
        
    logger.info(operation, 'OPERATION');

    let result;
    try {
      result = await this.onOperationCb!(operation);
    } catch (e) {
      this.onError(e, res);
    }

    res.end(JSON.stringify(result));
  }

  private onError(e: any, res: Parameters<http.RequestListener>[1]) {
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
      throw e;
    }
  }

  error(code: ServerErrorCode, message?: string) {
    return new ServerError(code, message);
  }
}

export = new HttpConnection();
