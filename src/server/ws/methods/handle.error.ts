import { WebSocket } from 'ws';
import { IOperation } from '../../../types/operation.types';
import { ServerError, ServerErrorMap } from '../../errors';
import { getLog } from './utils';

export const handleError = (
  e: any,
  options: IOperation['options'],
  connection: WebSocket,
) => {
  let error = e;
  if (e.name !== ServerError.name) {
    logger.error(e);
    error = new ServerError('SERVER_ERROR', e.details);
  }
  const { code, statusCode = 500 } = error as ServerError;
  const { requestId, pathname } = options;
  const resLog = statusCode + ' ' + ServerErrorMap[code];
  logger.error(getLog(pathname, resLog));
  const response = {
    requestId,
    status: statusCode,
    error: error.getMessage(),
    data: null,
  };
  const responseMessage = JSON.stringify(response);
  connection.send(responseMessage);

  if (e.name !== ServerError.name) throw e;
  if (e.code === 'SERVER_ERROR') throw e;
};
