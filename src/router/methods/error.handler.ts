import { DatabaseError } from '../../db/errors';
import { HandlerError, HandlerErrorEnum, RouterError, RouterErrorEnum } from '../errors';
import { ValidationResponseError } from '../modules.response/validate.response';
import { GetStreamError } from '../modules/get.stream';
import { SessionError } from '../modules/set.session';
import { ValidationError } from '../modules/validate';

export const errorHandler = (e: any): never => {
  const { message, code, details } = e;
  if (e instanceof DatabaseError) {
    throw new RouterError(RouterErrorEnum.E_HANDLER, message);
  }

  if (e instanceof HandlerError) {
    if (code === HandlerErrorEnum.E_REDIRECT) {
      throw new RouterError(RouterErrorEnum.E_REDIRECT, details);
    }
    throw new RouterError(RouterErrorEnum.E_HANDLER, message);
  }
  
  if (e instanceof SessionError)
    throw new RouterError(RouterErrorEnum.E_ROUTER, message);
  if (e instanceof ValidationError)
    throw new RouterError(RouterErrorEnum.E_MODULE, details);
  if (e instanceof GetStreamError)
    throw new RouterError(RouterErrorEnum.E_MODULE, message);
  if (e instanceof ValidationResponseError)
    throw new RouterError(RouterErrorEnum.E_MODULE, message);

  logger.error(e);
  throw new RouterError(RouterErrorEnum.E_ROUTER, details || message);
};
