import { IModulesContext, IRouterConfig } from '../../app/types';
import { loadModule } from '../../loader/loader';
import { MODULES, MODULES_RESPONSE } from '../constants';

export function applyModules(config: IRouterConfig, modulesContext: IModulesContext) {
  const { modules, modulesConfig } = config;
  return modules.map(
    (module) => {
      const moduleConfig = modulesConfig[module];
      const moduleExport = loadModule(MODULES[module], modulesContext).default;
      return moduleExport(moduleConfig);
    });
}

export const applyResponseModules = (config: IRouterConfig, modulesContext: IModulesContext) => {
  const { responseModules, modulesConfig } = config;
  return responseModules.map(
    (module) => {
      const moduleConfig = modulesConfig[module];
      const moduleExport = loadModule(MODULES_RESPONSE[module], modulesContext).default;
      return moduleExport(moduleConfig);
    });
};
