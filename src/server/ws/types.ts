import ws from 'ws';
import { WsChats } from './ws.chat';
import { IOperation, TOperationResponse } from '../../types/operation.types';
import { TWsResModulesKeys } from './constants';

export interface IWsConfig {
  path: string;
  modulesPath: string;
  resModules: TWsResModulesKeys[];
}

export type IWsServer = ws.Server<IWsConnection>;
export type IWsConnection = ws.WebSocket & { isAlive?: boolean };

export type TWsResModule<T = any> = (config: T) => (
  connection: IWsConnection | null,
  options: IOperation['options'] | null,
  data: TOperationResponse,
  wsChats: WsChats,
) => boolean;
