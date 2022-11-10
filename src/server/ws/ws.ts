import { Server, WebSocket } from 'ws';
import { IInputConnection, IRequest } from '../types';
import { IWsConfig, IWsServer } from './types';
import { IOperation, TOperationResponse } from '../../app/types';
import { IHttpServer } from '../http/types';
import { ServerError } from '../errors';
import { getLog } from './utils';
import { getSessionKey } from '../utils';
import { handleError } from './errorHandler';

class WsConnection implements IInputConnection {
  private config: IWsConfig;
  private server: IWsServer;
  private exec?: (operation: IOperation) => Promise<TOperationResponse>;
  private apiUnavailable = false;

  constructor(config: IWsConfig, server: IHttpServer) {
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
    const e = new ServerError('NO_CALLBACK');
    logger.error(e);
    throw e;
  }

  private handleConnection(connection: WebSocket, req: IRequest) {
    const options = this.getRequestParams(req);
    const handleRequest = async (message: Buffer) =>
      await this.handleRequest(message, options, connection);
    connection.on('message', handleRequest);
  }

  private async handleRequest(
    message: Buffer, options: IOperation['options'], connection: WebSocket,
  ) {
    try {
      if (this.apiUnavailable) throw new ServerError('SERVICE_UNAVAILABLE');
      const operation = await this.getOperation(message, options);
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
      handleError(e, options, connection);
      throw e;
    }
  }

  private getRequestParams(req: IRequest): IOperation['options'] {
    const { origin } = req.headers;
    const options: IOperation['options'] = {} as IOperation['options'];
    options.sessionKey = getSessionKey(req);
    options.origin = origin || '';
    return options;
  }

  private async getOperation(
    message: Buffer, { ...options }: IOperation['options'],
  ) {
    const request = JSON.parse(message.toString());
    const { requestId, pathname, data: params } = request;
    const names = ((pathname as string)
      .slice(1) || 'index')
      .split('/')
      .filter((path) => Boolean(path));
    options.requestId = requestId;
    options.pathname = pathname;
    const data = { params } as IOperation['data'];
    return { options, names, data };
  }
}

export = WsConnection;
