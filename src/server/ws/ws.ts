/* eslint-disable max-lines */
import { Server, WebSocket } from 'ws';
import { IInputConnection, IRequest } from '../types';
import { IWsConfig, IWsServer } from './types';
import { IOperation, TOperationResponse } from '../../types/operation.types';
import { IHttpServer } from '../http/types';
import { ServerError } from '../errors';
import { getLog } from './methods/utils';
import { getSessionKey } from '../utils';
import { handleError } from './methods/handle.error';

const chats = new Map<number, WebSocket[]>();

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
      connection.send(responseMessage, { binary: false });
      logger.info(getLog(pathname, 'OK'));
      this.sendChatMessage(data, connection);
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

  private sendChatMessage(data: TOperationResponse, curConnection: WebSocket) {
    const connections = this.getChatConnections(data, curConnection);
    if (!connections) return;
    const chatResponse = {
      status: 200,
      error: null,
      data,
    };
    const chatResponseMessage = JSON.stringify(chatResponse);
    for (const connection of connections) {
      // if (connection === curConnection) continue;
      connection.send(chatResponseMessage, { binary: false });
    }
  }

  private getChatConnections(
    data: TOperationResponse, connection: WebSocket
  ): WebSocket[] | null {
    const { chatId } = data as { chatId: number } || {};
    if (!chatId) return null;
    let chat = chats.get(chatId);
    let client: WebSocket;
    if (!chat) {
      client = connection;
      chat =  [client];
      chats.set(chatId, chat);
    } else {
      const clientExists = chat.includes(connection);
      if (!clientExists) chat.push(connection);
    }
    return chat;
  }
}

export = WsConnection;
