import { IRequest } from '../types';
import { IResponse } from './types';
import { REQ_MIME_TYPES_ENUM } from './constants';
import { ServerError, ServerErrorMap } from '../errors';
import { getLog } from './utils';

export const handleError = (e: any, req: IRequest, res: IResponse) => {
  let error = e;
  if (e.name !== ServerError.name) {
    logger.error(e, e.message);
    error = new ServerError('E_SERVER_ERROR', e.details);
  }
  const { code, statusCode = 500, details } = error as ServerError;
  res.statusCode = statusCode;
  if (code === 'E_REDIRECT') {
    res.setHeader('location', details?.location || '/');
  }
  if (details) {
    res.setHeader('content-type', REQ_MIME_TYPES_ENUM['application/json']);
  }
  logger.error({}, getLog(req, statusCode + ' ' + ServerErrorMap[code]));

  res.end(error.getMessage());

  if (e.name !== ServerError.name) throw e;
  if (e.code === 'E_SERVER_ERROR') throw e;
};
