import http from 'node:http';
import { THttpReqModulesKeys, THttpResModulesKeys } from './http/constants';
import { IOperation, TOperationResponse } from '../app/types';
import { IHttpServer } from './http/types';
import { IWsServer } from './ws/types';

export interface IInputConnectionConfig {
  transport: 'http' | 'ws';
  http: {
    path: string;
    modulesPath: string;
    paths: {
      public: string;
      api: string;
    };
    reqModules: THttpReqModulesKeys[];
    resModules: THttpResModulesKeys[];
    host: string;
    port: number;
  };
  ws: {
    path: string;
  };
}
export type IHttpConfig = IInputConnectionConfig['http'];
export type IWsConfig = IInputConnectionConfig['ws'];

export type IServer = IHttpServer | IWsServer;
export type IRequest = http.IncomingMessage;
export type TServerService = 'static' | 'api';

export interface IInputConnection {
  onOperation(fn:
    (operation: IOperation) => Promise<TOperationResponse>
  ): this;
  setUnavailable(service?: TServerService): void;
  getServer(): IServer;
  start(): Promise<void>;
}
