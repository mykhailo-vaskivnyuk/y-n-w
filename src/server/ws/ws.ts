import { Server, WebSocket } from 'ws';
import {
  IInputConnection, IInputConnectionConfig, IRequest,
} from '../types';
import { IWsServer } from './types';
import { IOperation, TOperationResponse } from '../../app/types';
import { ServerError, ServerErrorMap } from '../errors';
import { createUnicCode } from '../../utils/crypto';
import { IHttpServer } from '../http/types';
import { getLog } from './utils';

class WsConnection implements IInputConnection {
  private config: IInputConnectionConfig['ws'];
  private server: IWsServer;
  private exec?: (operation: IOperation) => Promise<TOperationResponse>;
  private apiUnavailable = false;

  constructor(config: IInputConnectionConfig['ws'], server: IHttpServer) {
    this.config = config;
    this.server = new Server({ server });
    this.server.on('connection', this.handleConnection.bind(this));
  }

  onOperation(fn: (operation: IOperation) => Promise<TOperationResponse>) {
    this.exec = fn;
    return this;
  }

  setUnavailable() {
    this.apiUnavailable = true;
  }

  getServer() {
    return this.server;
  }

  async start() {
    if (this.exec) return;
    const e = new ServerError('E_NO_CALLBACK');
    logger.error(e, e.message);
    throw e;
  }

  private handleConnection(connection: WebSocket, req: IRequest) {
    connection.on('message', async (
      message: string,
    ) => await this.onRequest(
      message.toString(), req, connection
    ));
  }

  private async onRequest(
    message: string, req: IRequest, connection: WebSocket,
  ) {
    let options = {} as IOperation['options'];
    try {
      if (this.apiUnavailable) throw new ServerError('E_UNAVAILABLE');
      const operation = await this.getOperation(message, req);
      ({ options } = operation);
      const { requestId, pathname } = options;

      const data = await this.exec!(operation);
      const response = {
        requestId,
        status: 200,
        error: null,
        data,
      };
      const responseMessage = JSON.stringify(response);
      logger.info({}, getLog(pathname, 'OK'));
      connection.send(responseMessage, { binary: false });
    } catch (e) {
      this.onError(e, options, connection);
      throw e;
    }
  }

  private async getOperation(message: string, req: IRequest) {
    const { options, names, params } = this.getRequestParams(message, req);
    const data = { params } as IOperation['data'];
    return { options, names, data };
  }

  private getRequestParams(message: string, req: IRequest) {
    const { origin, cookie } = req.headers;
    // throw new ServerError('E_SERVER_ERROR');
    const request = JSON.parse(message);
    const { requestId, pathname, data: params } = request;
    const names = ((pathname as string)
      .slice(1) || 'index')
      .split('/')
      .filter((path) => Boolean(path));

    const options: IOperation['options'] = {} as IOperation['options'];
    options.requestId = requestId;
    options.sessionKey = this.getSessionKey(cookie);
    options.origin = origin || '';
    options.pathname = pathname;

    return { options, names, params };
  }

  private getSessionKey(cookie?: string) {
    if (cookie) {
      const regExp = /sessionKey=([^\s]*)\s*;?/;
      const [, result] = cookie.match(regExp) || [];
      if (result) return result;
    }
    return createUnicCode(15);
  }

  private onError(
    e: any, options: IOperation['options'], connection: WebSocket,
  ) {
    let error = e;
    if (!(e instanceof ServerError)) {
      error = new ServerError('E_SERVER_ERROR', e.details);
    }
    const { code, statusCode = 500 } = error as ServerError;
    const { requestId, pathname } = options;
    const resLog = statusCode + ' ' + ServerErrorMap[code];
    logger.error({}, getLog(pathname, resLog));
    const response = {
      requestId,
      status: statusCode,
      error: error.getMessage(),
      data: null,
    };
    const responseMessage = JSON.stringify(response);
    connection.send(responseMessage);

    if (e.name !== ServerError.name) throw e;
    if (e.code === 'E_SERVER_ERROR') throw e;
  }
}

export = WsConnection;
