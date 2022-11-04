import { SERVICES } from '../constants';
import { IMailService, IRouterConfig } from '../types';

export const getServices = (config: IRouterConfig) => {
  const { services, modulesConfig } = config;
  return services.reduce(
    (contextObj, service) => {
      const moduleConfig = modulesConfig[service];
      const moduleExport = require(SERVICES[service]).default;
      contextObj[service] = moduleExport(moduleConfig);
      return contextObj;
    }, {} as { mailService: IMailService });
};
