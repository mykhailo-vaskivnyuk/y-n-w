import { IOperation } from '../../types/operation.types';
import { IAppThis } from '../types';
import { handleOperationError } from '../errors';

export const createSetInputConnection = (parent: IAppThis) => () => {
  const { env } = parent.config;

  const handleOperation = async (operation: IOperation) => {
    try {
      return await parent.router!.exec(operation);
    } catch (e: any) {
      return handleOperationError(e);
    }
  };

  const { inConnection } = parent.config;
  const { transport } = inConnection;
  const serverConfig = inConnection['http'];
  const apiServerConfig = transport !== 'http' && inConnection[transport];

  const InConnection = require(serverConfig.path);
  const InApiConnection = apiServerConfig && require(apiServerConfig.path);
  parent.server = new InConnection(serverConfig);
  parent.apiServer = InApiConnection &&
      new InApiConnection(apiServerConfig, parent.server!.getServer());

  if (parent.apiServer) {
    parent.server!.setUnavailable('api');
    parent.apiServer.onOperation(handleOperation);
    env.API_UNAVAILABLE && parent.apiServer.setUnavailable('api');
  } else {
    parent.server!.onOperation(handleOperation);
    env.API_UNAVAILABLE && parent.server!.setUnavailable('api');
  }

  env.STATIC_UNAVAILABLE && parent.server!.setUnavailable('static');
};
