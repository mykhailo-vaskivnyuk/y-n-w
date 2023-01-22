import { format } from 'node:util';
import { join } from 'node:path';
import { WsChats } from '../ws.chat';
import { IOperation, TOperationResponse } from '../../../types/operation.types';
import { IWsConfig, IWsConnection, TWsResModule } from '../types';
import { WS_RES_MODULES } from '../constants';

export const getLog = (
  pathname: string | undefined, resLog: string,
) => format('WS %s %s', pathname || '', '-', resLog);

export const applyResModules = (config: IWsConfig) => {
  const { resModules, modulesPath } = config;
  return resModules.map(
    (moduleName) => {
      const moduleFileName = WS_RES_MODULES[moduleName];
      const modulePath = join(modulesPath, moduleFileName);
      return require(modulePath)[moduleName](config);
    });
};

export function runResModules(
  connection: IWsConnection | null,
  options: IOperation['options'] | null,
  data: TOperationResponse,
  resModules: ReturnType<TWsResModule>[],
  wsChats: WsChats,
) {
  for (const module of resModules)
    module(connection, options, data, wsChats);
}
