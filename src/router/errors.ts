import { TOperationResponse } from '../app/types';
import { getEnumFromMap } from '../utils/utils';

export const RouterErrorMap = {
  E_ROUTER: 'ROUTER ERROR',
  E_ROUTES: 'CAN\'T CREATE ROUTES',
  E_NO_ROUTE: 'CAN\'T FIND ROUTE',
  E_MODULE: 'MODULE ERROR',
  E_HANDLER: 'CAN\'T HANDLE OPERATION',
  E_REDIRECT: 'REDIRECT',
} as const;

export const RouterErrorEnum = getEnumFromMap(RouterErrorMap);

type RouterErrorCode = keyof typeof RouterErrorMap;

export class RouterError extends Error {
  public code: RouterErrorCode;
  public details?: TOperationResponse ;

  constructor(code: RouterErrorCode, details: TOperationResponse = null) {
    super(RouterErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}

export const HandlerErrorMap = {
  E_REDIRECT: 'REDIRECT',
} as const;

export const HandlerErrorEnum = getEnumFromMap(HandlerErrorMap);

type HandlerErrorCode = keyof typeof HandlerErrorMap;

export class HandlerError extends Error {
  public code: HandlerErrorCode;
  public details?: TOperationResponse ;

  constructor(code: HandlerErrorCode, details: TOperationResponse = null) {
    super(HandlerErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}
