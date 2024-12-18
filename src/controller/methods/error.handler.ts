import { DatabaseError } from '../../db/errors';
import { DomainError, DomainErrorCode } from '../../domain/errors';
import {
  HandlerError,
  ControllerError,
  InputValidationError,
  OutputValidationError,
  HandlerErrorCode,
} from '../errors';
import { GetStreamError } from '../modules/get.stream';
import { SessionError } from '../modules/set.session';

const DOMAIN_ERRORS_MAP = {
  NOT_FOUND: (e: any) => {
    throw new ControllerError('CANT_FIND_ENDPOINT', e.details);
  },
  FORBIDDEN: (e: any) => {
    throw new ControllerError('FORBIDDEN', e.message);
  },
};

const HANDLER_ERRORS_MAP = {
  REDIRECT: (e: any) => {
    throw new ControllerError('REDIRECT', e.details);
  },
  NOT_FOUND: (e: any) => {
    throw new ControllerError('CANT_FIND_ENDPOINT', e.details);
  },
  UNAUTHORIZED: (e: any) => {
    throw new ControllerError('UNAUTHORIZED', e.message);
  },
  NOT_CONFIRMED: (e: any) => {
    throw new ControllerError('NOT_CONFIRMED', e.message);
  },
  FORBIDDEN: (e: any) => {
    throw new ControllerError('FORBIDDEN', e.message);
  },
};

const CONTROLLER_ERRORS_MAP = {
  [DomainError.name]: (e: any) => {
    handleDomainError(e);
    throw new ControllerError('DOMAIN_ERROR', e.message);
  },
  [DatabaseError.name]: (e: any) => {
    throw new ControllerError('HANDLER_ERROR', e.message);
  },
  [HandlerError.name]: (e: any) => {
    handleHandlerError(e);
    throw new ControllerError('HANDLER_ERROR', e.message);
  },
  [SessionError.name]: (e: any) => {
    throw new ControllerError('CONTROLLER_ERROR', e.message);
  },
  [InputValidationError.name]: (e: any) => {
    throw new ControllerError('MODULE_ERROR', e.details);
  },
  [GetStreamError.name]: (e: any) => {
    throw new ControllerError('MODULE_ERROR', e.message);
  },
  [OutputValidationError.name]: (e: any) => {
    throw new ControllerError('MODULE_ERROR', e.message);
  },
};

const handleDomainError = (e: any) =>
  DOMAIN_ERRORS_MAP[e.code as DomainErrorCode]?.(e);
const handleHandlerError = (e: any) =>
  HANDLER_ERRORS_MAP[e.code as HandlerErrorCode]?.(e);
const handleError = (e: any) => CONTROLLER_ERRORS_MAP[e.name]?.(e);

export const errorHandler = (e: any): never => {
  handleError(e);
  logger.error(e);
  const { message, details } = e;
  throw new ControllerError('CONTROLLER_ERROR', details || message);
};
