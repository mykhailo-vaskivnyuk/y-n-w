import { ValidationErrorItem } from 'joi';
import { TOperationResponse } from '../types/operation.types';

export const ROUTER_ERROR_MAP = {
  ROUTER_ERROR: 'ROUTER ERROR',
  ROUTES_CREATE_ERROR: 'CAN\'T CREATE ROUTES',
  CANT_FIND_ROUTE: 'CAN\'T FIND ROUTE',
  MODULE_ERROR: 'MODULE ERROR',
  SERVICE_ERROR: 'SERVICE ERROR',
  HANDLER_ERROR: 'CAN\'T HANDLE OPERATION',
  REDIRECT: 'REDIRECT',
  UNAUTHORIZED: 'USER ISN\'T AUTHORIZED',
  NOT_CONFIRMED: 'USER ISN\'T CONFIRMED',
} as const;
export type RouterErrorCode = keyof typeof ROUTER_ERROR_MAP;
export type TRouterErrorDetails = RouterError['details'];

export class RouterError extends Error {
  public code: RouterErrorCode;
  public details?: TOperationResponse;

  constructor(code: RouterErrorCode, details: TOperationResponse = null) {
    super(ROUTER_ERROR_MAP[code]);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}

export const HANDLER_ERROR_MAP = {
  REDIRECT: 'REDIRECT',
  UNAUTHORIZED: 'USER ISN\'T AUTHORIZED',
  NOT_CONFIRMED: 'USER ISN\'T CONFIRMED',
} as const;
export type HandlerErrorCode = keyof typeof HANDLER_ERROR_MAP;

export class HandlerError extends Error {
  public code: HandlerErrorCode;
  public details?: TOperationResponse;

  constructor(code: HandlerErrorCode, details: TOperationResponse = null) {
    super(HANDLER_ERROR_MAP[code]);
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
