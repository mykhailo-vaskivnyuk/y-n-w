import { MODULES, MODULES_RESPONSE } from '../constants';
import { IRouterConfig } from '../types';

export function applyModules(config: IRouterConfig) {
  const { modules, modulesConfig } = config;
  return modules.map(
    (module) => {
      const moduleConfig = modulesConfig[module];
      const moduleExport = require(MODULES[module]).default;
      return moduleExport(moduleConfig);
    });
}

export const applyResponseModules = (config: IRouterConfig) => {
  const { responseModules, modulesConfig } = config;
  return responseModules.map(
    (module) => {
      const moduleConfig = modulesConfig[module];
      const moduleExport = require(MODULES_RESPONSE[module]).default;
      return moduleExport(moduleConfig);
    });
};
