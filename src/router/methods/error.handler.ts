import { DatabaseError } from '../../db/errors';
import { HandlerError, RouterError } from '../errors';
import { ValidationResponseError } from '../modules.response/validate.response';
import { GetStreamError } from '../modules/get.stream';
import { SessionError } from '../modules/set.session';
import { ValidationError } from '../modules/validate';

const ROUTER_ERRORS_MAP = {
  [DatabaseError.name]: (e: any) => {
    throw new RouterError('E_HANDLER', e.message);
  },
  [HandlerError.name]: (e: any) => {
    if (e.code === 'E_REDIRECT') {
      throw new RouterError('E_REDIRECT', e.details);
    }
    throw new RouterError('E_HANDLER', e.message);
  },
  [SessionError.name]: (e: any) => {
    throw new RouterError('E_ROUTER', e.message);
  },
  [ValidationError.name]: (e: any) => {
    throw new RouterError('E_MODULE', e.details);
  },
  [GetStreamError.name]: (e: any) => {
    throw new RouterError('E_MODULE', e.message);
  },
  [ValidationResponseError.name]: (e: any) => {
    throw new RouterError('E_MODULE', e.message);
  },
};

const throwError = (e: any) => ROUTER_ERRORS_MAP[e.name]?.(e);

export const errorHandler = (e: any): never => {
  throwError(e);
  logger.error(e);
  const { message, details } = e;
  throw new RouterError('E_ROUTER', details || message);
};
