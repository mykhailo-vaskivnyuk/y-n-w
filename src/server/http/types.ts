import http from 'node:http';
import { IOperation, TOperationResponse } from '../../app/types';
import { HTTP_MODULES } from './constants';

export interface IInputConnectionConfig {
  transport: 'http' | 'ws';
  http: {
    path: string;
    paths: {
      public: string;
      api: string;
    };
    modules: (keyof typeof HTTP_MODULES)[];
    host: string;
    port: number;
  };
  ws: {
    path: string;
    host: string;
    port: number;
  };
}

export type IRequest = http.IncomingMessage;
export type IResponse = http.ServerResponse;
export type IServer = http.Server;

export type THttpModule<T = any> = (config?: T) =>
  (req: IRequest, res: IResponse) => boolean;

export interface IInputConnection {
  onOperation(fn:
    (operation: IOperation) => Promise<TOperationResponse>
  ): this;
  start(): Promise<void>;
}
  

  