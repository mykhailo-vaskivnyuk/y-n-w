import { DatabaseError } from '../../db/errors';
import { HandlerError, RouterError } from '../errors';
import { ValidationResponseError } from '../modules.response/validate.response';
import { GetStreamError } from '../modules/get.stream';
import { SessionError } from '../modules/set.session';
import { ValidationError } from '../modules/validate';

export const errorHandler = (e: any): never => {
  const { message, code, details } = e;

  if (e.name === DatabaseError.name) {
    throw new RouterError('E_HANDLER', message);
  }

  if (e instanceof HandlerError) {
    if (code === 'E_REDIRECT') {
      throw new RouterError('E_REDIRECT', details);
    }
    throw new RouterError('E_HANDLER', message);
  }

  if (e instanceof SessionError)
    throw new RouterError('E_ROUTER', message);
  if (e instanceof ValidationError)
    throw new RouterError('E_MODULE', details);
  if (e instanceof GetStreamError)
    throw new RouterError('E_MODULE', message);
  if (e instanceof ValidationResponseError)
    throw new RouterError('E_MODULE', message);

  logger.error(e, e.message);
  throw new RouterError('E_ROUTER', details || message);
};
