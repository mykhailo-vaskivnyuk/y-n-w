import { RouterError, RouterErrorEnum } from '../router/errors';
import { ServerError, ServerErrorEnum } from '../server/http/errors';
import { getEnumFromMap } from '../utils/utils';

export const AppErrorMap = {
  E_START: 'CAN\'T START APP',
  E_SETUP: 'WRONG APP SETUP',
  E_ROUTER: 'ROUTER ERROR',
} as const;

export const AppErrorEnum = getEnumFromMap(AppErrorMap);

type AppErrorCode = keyof typeof AppErrorMap;

export class AppError extends Error {
  public code: AppErrorCode;

  constructor(code: AppErrorCode, message = '') {
    super(message || AppErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export const handleOperationError = (e: any): never => {
  const errors: Partial<Record<
    keyof typeof RouterErrorEnum,
    (details: RouterError['details']) => never
  >> = {
    [RouterErrorEnum.E_NO_ROUTE]: (details: RouterError['details']) => {
      throw new ServerError(ServerErrorEnum.E_NOT_FOUND, details) },
    [RouterErrorEnum.E_MODULE]: (details: ServerError['details']) => {
      throw new ServerError(ServerErrorEnum.E_BED_REQUEST, details) },
    [RouterErrorEnum.E_REDIRECT]: (details: ServerError['details']) => {
      throw new ServerError(ServerErrorEnum.E_REDIRECT, details) },
  };
  if (e instanceof RouterError) {
    const { code, details } = e;
    code in errors && errors[code]!(details || {});
  }
  else logger.error(e);
  throw new AppError(AppErrorEnum.E_ROUTER, e.message);
}
