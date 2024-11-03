import { IOperation } from '../../types/operation.types';
import { IAppThis } from '../types';
import { handleOperationError } from '../errors';
import { ServerError } from '../../server/errors';

export const createSetInputConnection = (parent: IAppThis) => () => {
  const { env } = parent.config;

  const { inConnection } = parent.config;
  const { transport } = inConnection;
  const httpConfig = inConnection['http'];
  const apiConfig = transport !== 'http' && inConnection[transport];

  const HttpConnection = require(httpConfig.path);
  parent.server = new HttpConnection(httpConfig);
  env.STATIC_UNAVAILABLE && parent.server!.setUnavailable(true);
  const httpServer = parent.server!.getServer();

  if (apiConfig) {
    const ApiConnection = require(apiConfig.path);
    parent.apiServer = new ApiConnection(apiConfig, httpServer);
  }

  let handleOperation;
  if (env.API_UNAVAILABLE) {
    handleOperation = () => {
      throw new ServerError('SERVICE_UNAVAILABLE');
    };
  } else {
    handleOperation = async (operation: IOperation) => {
      try {
        return await parent.controller!.exec(operation);
      } catch (e: any) {
        return handleOperationError(e);
      }
    };
  }
  if (parent.apiServer) {
    parent.apiServer.onOperation(handleOperation);
  } else {
    parent.server!.onOperation(handleOperation);
  }
};
