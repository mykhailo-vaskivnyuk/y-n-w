/* eslint-disable max-lines */
import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { TPromiseExecutor } from '../../types/types';
import { IOperation, TOperationResponse } from '../../types/operation.types';
import {
  IInputConnection, IRequest, TServerService } from '../types';
import {
  IResponse, IHttpServer,
  THttpReqModule, THttpResModule, IHttpConfig } from './types';
import { ServerError } from '../errors';
import { handleError } from './methods/handle.error';
import {
  applyReqModules, applyResModules,
  getLog, runReqModules, runResModules } from './methods/utils';

class HttpConnection implements IInputConnection {
  private config: IHttpConfig;
  private server: IHttpServer;
  private exec?: (operation: IOperation) => Promise<TOperationResponse>;
  private reqModules: ReturnType<THttpReqModule>[] = [];
  private resModules: ReturnType<THttpResModule>[] = [];
  private staticUnavailable = false;
  private apiUnavailable = false;

  constructor(config: IHttpConfig) {
    this.config = config;
    this.server = createServer(this.handleRequest.bind(this));
  }

  onOperation(cb: (operation: IOperation) => Promise<TOperationResponse>) {
    this.exec = cb;
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
      const e = new ServerError('NO_CALLBACK');
      logger.error(e);
      throw e;
    }
    try {
      this.reqModules = applyReqModules(this.config);
      this.resModules = applyResModules(this.config);
    } catch (e: any) {
      logger.error(e);
      throw new ServerError('SERVER_ERROR');
    }
    const executor: TPromiseExecutor<void> = (rv, rj) => {
      const { port } = this.config;
      try {
        this.server.listen(port, rv);
      } catch (e: any) {
        logger.error(e);
        rj(new ServerError('LISTEN_ERROR'));
      }
    };
    return new Promise<void>(executor);
  }

  async stop() {
    this.server.close();
  }

  private async handleRequest(req: IRequest, res: IResponse) {
    const contextParams = {
      staticUnavailable: this.staticUnavailable,
      apiUnavailable: this.apiUnavailable,
    };
    try {
      const context = await runReqModules(
        req, res, this.reqModules, contextParams,
      );
      if (!context) return;
      if (this.apiUnavailable) throw new ServerError('SERVICE_UNAVAILABLE');
      const { ...operation } = context;

      let response = await this.exec!(operation);

      if (!(response instanceof Readable)) response = JSON.stringify(response);
      const { data: { params } } = operation;
      const password = 'password' in params ? '*****' : undefined;
      res.on('finish',
        () => logger.info({ ...params, password }, getLog(req, 'OK')),
      );

      await runResModules(res, response, this.resModules);
    } catch (e) {
      handleError(e, req, res);
    }
  }

  getConnectionService() {
    return {
      sendMessage: () => false,
      sendNotification: () => false,
    };
  }
}

export = HttpConnection;
