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
  const server = inConnection['http'];
  const apiServer = transport === 'ws' && inConnection['ws'];
  const InConnection = require(server.path);
  const InApiConnection = apiServer && require(apiServer.path);
  parent.server = new InConnection(server);
  parent.apiServer = InApiConnection &&
      new InApiConnection(apiServer, parent.server!.getServer());

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
