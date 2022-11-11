import { DatabaseError } from '../../db/errors';
import {
  HandlerError, RouterError,
  InputValidationError, OutputValidationError,
} from '../errors';

import { GetStreamError } from '../modules/get.stream';
import { SessionError } from '../modules/set.session';


const ROUTER_ERRORS_MAP = {
  [DatabaseError.name]: (e: any) => {
    throw new RouterError('HANDLER_ERROR', e.message);
  },
  [HandlerError.name]: (e: any) => {
    if (e.code === 'E_REDIRECT') {
      throw new RouterError('REDIRECT', e.details);
    }
    throw new RouterError('HANDLER_ERROR', e.message);
  },
  [SessionError.name]: (e: any) => {
    throw new RouterError('ROUTER_ERROR', e.message);
  },
  [InputValidationError.name]: (e: any) => {
    throw new RouterError('MODULE_ERROR', e.details);
  },
  [GetStreamError.name]: (e: any) => {
    throw new RouterError('MODULE_ERROR', e.message);
  },
  [OutputValidationError.name]: (e: any) => {
    throw new RouterError('MODULE_ERROR', e.message);
  },
};

const throwError = (e: any) => ROUTER_ERRORS_MAP[e.name]?.(e);

export const errorHandler = (e: any): never => {
  throwError(e);
  logger.error(e);
  const { message, details } = e;
  throw new RouterError('ROUTER_ERROR', details || message);
};
