import { format } from 'node:util';
import { join } from 'node:path';
import { IWsConfig } from '../types';
import { WS_RES_MODULES } from '../constants';

export const getLog = (pathname: string | undefined, resLog: string) =>
  format('WS %s %s', pathname || '', '-', resLog);

export const applyResModules = (config: IWsConfig) => {
  const { resModules, modulesPath } = config;
  return resModules.map((moduleName) => {
    const moduleFileName = WS_RES_MODULES[moduleName];
    const modulePath = join(modulesPath, moduleFileName);
    return require(modulePath)[moduleName](config);
  });
};
