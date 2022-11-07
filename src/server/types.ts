import http from 'node:http';
import ws from 'ws';
import { THttpModulesKeys } from './http/constants';
import { IOperation, TOperationResponse } from '../app/types';

export interface IInputConnectionConfig {
  transport: 'http' | 'ws';
  http: {
    path: string;
    paths: {
      public: string;
      api: string;
    };
    modules: THttpModulesKeys[];
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
export type IServer = http.Server | ws.Server;
export type IHeaders = http.OutgoingHttpHeaders;
export type TServerService = 'static' | 'api';

export type THttpModule<T = any> =
  (config: T) => (
    req: IRequest,
    res: IResponse,
    context: IHttpModulsContext,
  ) => Promise<boolean>;

export interface IInputConnection {
  onOperation(fn:
    (operation: IOperation) => Promise<TOperationResponse>
  ): this;
  setUnavailable(service: TServerService): void;
  start(): Promise<void>;
}

export interface IHttpModulsContext {
  staticUnavailable: boolean;
  apiUnavailable: boolean;
}
