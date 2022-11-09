import http from 'node:http';
import { IOperation, TOperationResponse } from '../app/types';
import { IHttpConfig, IHttpServer } from './http/types';
import { IWsConfig, IWsServer } from './ws/types';

export interface IInputConnectionConfig {
  transport: 'http' | 'ws';
  http: IHttpConfig;
  ws: IWsConfig;
}

export type IServer = IHttpServer | IWsServer;
export type IRequest = http.IncomingMessage;

export interface IInputConnection {
  onOperation(fn:
    (operation: IOperation) => Promise<TOperationResponse>
  ): this;
  setUnavailable(service?: TServerService): void;
  getServer(): IServer;
  start(): Promise<void>;
}

export type TServerService = 'static' | 'api';
