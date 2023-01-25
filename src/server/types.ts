import http from 'node:http';
import { IOperation, TOperationResponse } from '../types/operation.types';
import { IHttpConfig, IHttpServer } from './http/types';
import { IWsConfig, IWsServer } from './ws/types';

export interface IInputConnectionConfig {
  transport: TTransport;
  http: IHttpConfig;
  ws: IWsConfig;
}
export type TTransport = 'http' | 'ws';

export interface IInputConnection {
  start(): Promise<void>;
  onOperation(
    cb: (operation: IOperation) => Promise<TOperationResponse>
  ): void;
  setUnavailable(service?: TServerService): void;
  getServer(): IServer;
  sendMessage?: IConnectionService['sendMessage'];
}

export type IServer = IHttpServer | IWsServer;
export type TServerService = 'static' | 'api';
export type IRequest = http.IncomingMessage;
export interface IConnectionService {
  sendMessage: (
    data: TOperationResponse, connectionIds?: Set<number>,
  ) => boolean;
}
