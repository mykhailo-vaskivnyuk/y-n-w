import { IRequest } from '../../types';
import { IResponse } from '../types';
import { REQ_MIME_TYPES_ENUM } from '../constants';
import { ServerError, ServerErrorMap } from '../../errors';
import { getLog } from './utils';

export const handleError = (e: any, req: IRequest, res: IResponse) => {
  let error = e;
  if (e.name !== ServerError.name) {
    error = new ServerError('SERVER_ERROR', e.details);
  }
  const { code, statusCode = 500, details } = error as ServerError;
  res.statusCode = statusCode;
  if (code === 'REDIRECT') {
    res.setHeader('location', details?.location || '/');
  }
  if (details) {
    res.setHeader('content-type', REQ_MIME_TYPES_ENUM['application/json']);
  }
  const resLog = statusCode + ' ' + ServerErrorMap[code];
  logger.error(getLog(req, resLog));

  res.end(error.getMessage());

  if (e.name !== ServerError.name) throw e;
  if (e.code === 'SERVER_ERROR') throw e;
};
