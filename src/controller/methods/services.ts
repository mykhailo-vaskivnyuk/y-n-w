import { IControllerConfig, IServices } from '../types';
import { SERVICES_MAP } from '../constants';
import { createPathResolve } from '../../utils/utils';

export const getServices = (config: IControllerConfig) => {
  const { servicesPath, services, modulesConfig } = config;
  const resolvePath = createPathResolve(servicesPath);
  return services.reduce<IServices>((contextObj, service) => {
    const moduleConfig = modulesConfig[service];
    const servicePath = resolvePath(SERVICES_MAP[service]);
    const moduleExport = require(servicePath).default;
    contextObj[service] = moduleExport(moduleConfig, contextObj);
    return contextObj;
  }, {});
};
