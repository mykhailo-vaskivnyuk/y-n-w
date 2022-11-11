import { IMailService, IRouterConfig } from '../types';
import { SERVICES } from '../constants';
import { createPathResolve } from '../../utils/utils';

export const getServices = (config: IRouterConfig) => {
  const { servicesPath, services, modulesConfig } = config;
  const resolvePath = createPathResolve(servicesPath);
  return services.reduce(
    (contextObj, service) => {
      const moduleConfig = modulesConfig[service];
      const servicePath = resolvePath(SERVICES[service]);
      const moduleExport = require(servicePath).default;
      contextObj[service] = moduleExport(moduleConfig);
      return contextObj;
    }, {} as { mailService: IMailService });
};
