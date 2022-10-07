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
    } catch (e: any) {
      console.log(typeof ServerErrorEnum[404], typeof e.code);
      switch(e?.code) {
        case ServerErrorEnum[404]:
          // logger.fatal('HERE');
          res.statusCode = 404;
          res.end(ServerErrorMap[404]);
          break;
        case ServerErrorEnum[409]:
          res.statusCode = 409;
          res.end(ServerErrorMap[409]);
          break;
        case ServerErrorEnum[503]:
          res.statusCode = 503;
          res.end(ServerErrorMap[503]);
          break;
        default:
          res.statusCode = 500;
          res.end(ServerErrorMap[500]);
          throw e;
      }
    }

    res.end(JSON.stringify(result));
  }

  error(code: ServerErrorCode, message?: string) {
    return new ServerError(code, message);
  }
}

export = new HttpConnection();
