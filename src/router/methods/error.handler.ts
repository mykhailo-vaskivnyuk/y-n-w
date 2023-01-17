import { DatabaseError } from '../../db/errors';
import {
  HandlerError, RouterError, InputValidationError,
  OutputValidationError, HandlerErrorCode,
} from '../errors';
import { GetStreamError } from '../modules/get.stream';
import { SessionError } from '../modules/set.session';

const HANDLER_ERRORS_MAP = {
  REDIRECT: (e: any) => {
    throw new RouterError('REDIRECT', e.details);
  },
  NOT_FOUND: (e: any) => {
    throw new RouterError('CANT_FIND_ROUTE', e.details);
  },
  UNAUTHORIZED: (e: any) => {
    throw new RouterError('UNAUTHORIZED', e.message);
  },
  NOT_CONFIRMED: (e: any) => {
    throw new RouterError('NOT_CONFIRMED', e.message);
  },
  FORBIDDEN: (e: any) => {
    throw new RouterError('FORBIDDEN', e.message);
  },
};

const ROUTER_ERRORS_MAP = {
  [DatabaseError.name]: (e: any) => {
    throw new RouterError('HANDLER_ERROR', e.message);
  },
  [HandlerError.name]: (e: any) => {
    handleHandlerError(e);
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

const handleHandlerError = (e: any) =>
  HANDLER_ERRORS_MAP[e.code as HandlerErrorCode]?.(e);
const handleError = (e: any) => ROUTER_ERRORS_MAP[e.name]?.(e);

export const errorHandler = (e: any): never => {
  handleError(e);
  logger.error(e);
  const { message, details } = e;
  throw new RouterError('ROUTER_ERROR', details || message);
};
