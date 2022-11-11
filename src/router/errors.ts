import { ValidationErrorItem } from 'joi';
import { TOperationResponse } from '../types/operation.types';

export const RouterErrorMap = {
  ROUTER_ERROR: 'ROUTER ERROR',
  ROUTES_CREATE_ERROR: 'CAN\'T CREATE ROUTES',
  CANT_FIND_ROUTE: 'CAN\'T FIND ROUTE',
  MODULE_ERROR: 'MODULE ERROR',
  SERVICE_ERROR: 'SERVICE ERROR',
  HANDLER_ERROR: 'CAN\'T HANDLE OPERATION',
  REDIRECT: 'REDIRECT',
} as const;
export type RouterErrorCode = keyof typeof RouterErrorMap;
export type TRouterErrorDetails = RouterError['details'];

export class RouterError extends Error {
  public code: RouterErrorCode;
  public details?: TOperationResponse;

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
type HandlerErrorCode = keyof typeof HandlerErrorMap;

export class HandlerError extends Error {
  public code: HandlerErrorCode;
  public details?: TOperationResponse;

  constructor(code: HandlerErrorCode, details: TOperationResponse = null) {
    super(HandlerErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}

export class InputValidationError extends Error {
  public details: Record<string, unknown>[];
  constructor(details: ValidationErrorItem[]) {
    super('Validation error');
    this.name = this.constructor.name;
    this.details = details as unknown as Record<string, unknown>[];
  }
}

export class OutputValidationError extends Error {
  public details: Record<string, unknown>[];
  constructor(details: ValidationErrorItem[]) {
    super('Validation response error');
    this.name = this.constructor.name;
    this.details = details as unknown as Record<string, unknown>[];
  }
}
