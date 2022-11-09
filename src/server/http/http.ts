import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { join } from 'node:path';
import { TPromiseExecutor } from '../../types/types';
import { IOperation, TOperationResponse } from '../../app/types';
import {
  IInputConnection, IInputConnectionConfig,
  IRequest, TServerService,
} from '../types';
import { IResponse, IHttpServer, THttpModule, IHttpContext } from './types';
import { HTTP_MODULES, REQ_MIME_TYPES_ENUM } from './constants';
import { ServerError } from '../errors';
import { handleError } from './error.handler';
import { getLog } from './utils';

class HttpConnection implements IInputConnection {
  private config: IInputConnectionConfig['http'];
  private server: IHttpServer;
  private exec?: (operation: IOperation) => Promise<TOperationResponse>;
  private modules: ReturnType<THttpModule>[] = [];
  private staticUnavailable = false;
  private apiUnavailable = false;

  constructor(config: IInputConnectionConfig['http']) {
    this.config = config;
    this.server = createServer(this.onRequest.bind(this));
  }

  onOperation(fn: (operation: IOperation) => Promise<TOperationResponse>) {
    this.exec = fn;
    return this;
  }

  setUnavailable(service: TServerService) {
    service === 'static' && (this.staticUnavailable = true);
    service === 'api' && (this.apiUnavailable = true);
  }

  getServer() {
    return this.server;
  }

  start() {
    if (!this.exec && !this.apiUnavailable) {
      const e = new ServerError('E_NO_CALLBACK');
      logger.error(e, e.message);
      throw e;
    }

    try {
      const { modules, modulesPath } = this.config;
      this.modules = modules.map(
        (moduleName) => {
          const moduleFileName = HTTP_MODULES[moduleName];
          const modulePath = join(modulesPath, moduleFileName);
          return require(modulePath)[moduleName](this.config);
        });
    } catch (e: any) {
      logger.error(e, e.message);
      throw new ServerError('E_SERVER_ERROR');
    }

    const executor: TPromiseExecutor<void> = (rv, rj) => {
      const { port } = this.config;
      try {
        this.server.listen(port, rv);
      } catch (e: any) {
        logger.error(e, e.message);
        rj(new ServerError('E_LISTEN'));
      }
    };

    return new Promise<void>(executor);
  }

  private async onRequest(req: IRequest, res: IResponse) {
    try {
      const context = await this.runModules(req, res);
      if (!context) return;
      if (this.apiUnavailable) throw new ServerError('E_UNAVAILABLE');
      const { ...operation } = context;
      const { data: { params } } = operation;
      const response = await this.exec!(operation);
      res.statusCode = 200;

      if (response instanceof Readable) {
        res.setHeader(
          'content-type',
          REQ_MIME_TYPES_ENUM['application/octet-stream'],
        );
        await new Promise((rv, rj) => {
          response.on('error', rj);
          response.on('end', rv);
          res.on('finish',
            () => logger.info(params, getLog(req, 'OK'))
          );
          response.pipe(res);
        });
        return;
      }

      const body = JSON.stringify(response);
      res.setHeader('content-type', REQ_MIME_TYPES_ENUM['application/json']);
      res.on('finish',
        () => logger.info(params, getLog(req, 'OK'))
      );
      res.end(body);

    } catch (e) {
      handleError(e, req, res);
    }
  }

  private async runModules(req: IRequest, res: IResponse) {
    const operation = {
      options: {},
      data: { params: {} },
    } as IOperation;
    const contextParams = {
      staticUnavailable: this.staticUnavailable,
      apiUnavailable: this.apiUnavailable,
    };
    let context: IHttpContext | null = { ...operation, contextParams,  };
    for (const module of this.modules) {
      context = await module(req, res, context);
      if (!context) return null;
    }
    return context;
  }
}

export = HttpConnection;
