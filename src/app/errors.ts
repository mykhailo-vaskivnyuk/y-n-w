import { RouterError, RouterErrorCode } from '../router/errors';
import { ServerError } from '../server/http/errors';

export const AppErrorMap = {
  E_START: 'CAN\'T START APP',
  E_ROUTER: 'ROUTER ERROR',
  E_INIT: 'API IS NOT INITIALIZED OR SET UNAVAILABLE',
} as const;

type AppErrorCode = keyof typeof AppErrorMap;

export class AppError extends Error {
  public code: AppErrorCode;

  constructor(code: AppErrorCode, message = '') {
    super(message || AppErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}

type TRouterErrorDetails = RouterError['details'];

const errors: Partial<Record<
RouterErrorCode, (details: TRouterErrorDetails) => never
>> = {
  E_NO_ROUTE: (details: TRouterErrorDetails) => {
    throw new ServerError('E_NOT_FOUND', details);
  },
  E_MODULE: (details: TRouterErrorDetails) => {
    throw new ServerError('E_BED_REQUEST', details);
  },
  E_REDIRECT: (details: TRouterErrorDetails) => {
    throw new ServerError('E_REDIRECT', details);
  },
};

export const handleOperationError = (e: any): never => {
  if (e.name === RouterError.name) {
    const { code, details } = e;
    code in errors && errors[code as RouterErrorCode]!(details);
  } else logger.error(e, e.message);
  throw new AppError('E_ROUTER', e.message);
};
