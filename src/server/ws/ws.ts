/* eslint-disable max-lines */
import { Server } from 'ws';
import { IInputConnection, IRequest } from '../types';
import { IWsConfig, IWsConnection, IWsServer, TWsResModule } from './types';
import { IOperation, TOperationResponse } from '../../types/operation.types';
import { IHttpServer } from '../http/types';
import {
  IMessage,
  MessageTypeKeys,
} from '../../client/common/server/types/types';
import { PING_INTERVAL } from '../../client/common/server/constants';
import { MAX_CHAT_INDEX } from '../../constants/constants';
import { ServerError } from '../errors';
import { handleError } from './methods/handle.error';
import { applyResModules } from './methods/utils';
import { getSessionKey } from '../utils';
import { delay, excludeNullUndefined } from '../../utils/utils';

class WsConnection implements IInputConnection {
  private config: IWsConfig;
  private server: IWsServer;
  private counter = 0;
  private connections = new Map<number, IWsConnection>();
  private exec?: (operation: IOperation) => Promise<TOperationResponse>;
  private resModules: ReturnType<TWsResModule>[] = [];
  private unavailable = false;

  constructor(config: IWsConfig, server: IHttpServer) {
    this.config = config;
    this.server = new Server({ server });
  }

  onOperation(cb: (operation: IOperation) => Promise<TOperationResponse>) {
    this.exec = cb;
  }

  setUnavailable(value: boolean) {
    this.unavailable = value;
  }

  getServer() {
    return this.server;
  }

  async start() {
    if (!this.exec && !this.unavailable) {
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

  async stop() {
    this.server.close();
    while (this.connections.size) await delay(100);
  }

  private handleConnection(connection: IWsConnection, req: IRequest) {
    connection.isAlive = true;

    const options = this.getRequestParams(connection, req);

    const handleMessage = (message: Buffer) =>
      this.handleRequest(message, options, connection);

    connection
      .on('message', handleMessage)
      .on('pong', this.handlePong)
      .on('close', () => this.handleClose(options));
  }

  private handleClose(options: IOperation['options']) {
    const { connectionId } = options;
    this.connections.delete(connectionId!);
    const operation: IOperation = {
      options,
      names: ['chat', 'removeConnection'],
      data: { params: {} },
    };
    try {
      this.exec!(operation);
    } catch (e) {
      logger.error(e);
    }
  }

  private async handleRequest(
    message: Buffer,
    options: IOperation['options'],
    connection: IWsConnection,
  ) {
    try {
      if (connection.readyState === connection.CLOSED) return;
      if (this.unavailable) throw new ServerError('SERVICE_UNAVAILABLE');
      const operation = await this.getOperation(message, options);
      options = operation.options;
      const data = await this.exec!(operation);
      for (const module of this.resModules) {
        await module(connection, options, data);
      }
    } catch (e) {
      if (connection.readyState === connection.CLOSED) return;
      handleError(e, options, connection);
      throw e;
    }
  }

  private getConnectionId(connection: IWsConnection) {
    const connectionId = (this.counter = (this.counter % MAX_CHAT_INDEX) + 1);
    this.connections.set(connectionId, connection);
    return connectionId;
  }

  private getConnection(connectionId: number) {
    return this.connections.get(connectionId);
  }

  private getRequestParams(
    connection: IWsConnection,
    req: IRequest,
  ): IOperation['options'] {
    const { origin = '' } = req.headers;
    const options: IOperation['options'] = {
      sessionKey: getSessionKey(req),
      origin,
      connectionId: this.getConnectionId(connection),
    };
    return options;
  }

  private async getOperation(
    message: Buffer,
    { ...options }: IOperation['options'],
  ) {
    const request = JSON.parse(message.toString());
    const { requestId, pathname, data: params } = request;
    const names = ((pathname as string).slice(1) || 'index')
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

    const interval = setInterval(sendPing, PING_INTERVAL);
    this.server.on('close', () => clearInterval(interval));
  }

  private handlePong(this: IWsConnection) {
    this.isAlive = true;
  }

  private async sendMessage<T extends MessageTypeKeys>(
    data: IMessage<T>,
    connectionIds?: Set<number>,
  ) {
    try {
      if (!connectionIds) return false;
      const connections = [...connectionIds]
        .map((connectionId) => this.getConnection(connectionId))
        .filter(excludeNullUndefined);
      let result = true;
      for (const module of this.resModules) {
        const moduleResult = await module(connections, null, data);
        result = result && moduleResult;
      }
      return result;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  getConnectionService() {
    return {
      sendMessage: this.sendMessage.bind(this),
      sendNotification: () => Promise.resolve(false),
    };
  }
}

export = WsConnection;
