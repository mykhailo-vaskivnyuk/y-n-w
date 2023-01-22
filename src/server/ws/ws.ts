/* eslint-disable max-lines */
import { Server } from 'ws';
import { IInputConnection, IRequest } from '../types';
import { IWsConfig, IWsConnection, IWsServer, TWsResModule } from './types';
import { WsChats } from './ws.chat';
import { IOperation, TOperationResponse } from '../../types/operation.types';
import { IHttpServer } from '../http/types';
import { ServerError } from '../errors';
import { handleError } from './methods/handle.error';
import { applyResModules, runResModules } from './methods/utils';
import { getSessionKey } from '../utils';
import { PINGS_INTERVAL } from './constants';

class WsConnection implements IInputConnection {
  private config: IWsConfig;
  private server: IWsServer;
  private wsChats = new WsChats();
  private exec?: (operation: IOperation) => Promise<TOperationResponse>;
  private resModules: ReturnType<TWsResModule>[] = [];
  private apiUnavailable = false;

  constructor(config: IWsConfig, server: IHttpServer) {
    this.config = config;
    this.server = new Server({ server });
    this.sendMessage = this.sendMessage.bind(this);
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
    if (!this.exec && !this.apiUnavailable) {
      const e = new ServerError('NO_CALLBACK');
      logger.error(e);
      throw e;
    }
    try {
      this.resModules = applyResModules(this.config);
      this.server.on('connection', this.handleConnection.bind(this));
      this.doPings();
    } catch (e: any) {
      logger.error(e);
      throw new ServerError('SERVER_ERROR');
    }
  }

  private handleConnection(connection: IWsConnection, req: IRequest) {
    connection.isAlive = true;

    const options = this.getRequestParams(req);
    const handleMessage = (message: Buffer) => this
      .handleRequest(message, options, connection);

    const wsChats = this.wsChats;
    const exec = this.exec!;
    const handleClose = function(this: IWsConnection) {
      const chatsToDelete = wsChats.removeConnection(this);
      const operation: IOperation = {
        options: { sessionKey: 'admin', origin: '', isAdmin: true },
        names: ['chat', 'remove'],
        data: { params: { chatsToDelete } },
      };
      try {
        exec(operation);
      } catch (e) {
        logger.error(e);
      }
    };

    connection
      .on('message', handleMessage)
      .on('pong', this.handlePong)
      .on('close', handleClose);
  }

  private async handleRequest(
    message: Buffer,
    options: IOperation['options'],
    connection: IWsConnection,
  ) {
    try {
      if (this.apiUnavailable) throw new ServerError('SERVICE_UNAVAILABLE');
      const operation = await this.getOperation(message, options);
      options = operation.options;
      const data = await this.exec!(operation);
      runResModules(
        connection,
        options,
        data,
        this.resModules,
        this.wsChats,
      );
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

  private doPings() {
    const sendPing = () => {
      const connections = this.server.clients;
      for (const connection of connections) {
        if (connection.isAlive === false) {
          connection.terminate();
          return;
        }
        connection.isAlive = false;
        connection.send('ping', { binary: false });
        connection.ping();
      }
    };

    const interval = setInterval(sendPing, PINGS_INTERVAL);
    this.server.on('close', () => clearInterval(interval));
  }

  private handlePong(this: IWsConnection) {
    this.isAlive = true;
  }

  sendMessage(data: TOperationResponse) {
    try {
      runResModules(
        null,
        null,
        data,
        this.resModules,
        this.wsChats,
      );
      return true;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }
}

export = WsConnection;
