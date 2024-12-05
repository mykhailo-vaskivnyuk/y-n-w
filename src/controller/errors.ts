import { ValidationErrorItem } from 'joi';
import { TOperationResponse } from '../types/operation.types';

export const CONTROLLER_ERROR_MAP = {
  CONTROLLER_ERROR: 'CONTROLLER ERROR',
  ENDPOINTS_CREATE_ERROR: "CAN'T CREATE ENDPOINTS",
  CANT_FIND_ENDPOINT: "CAN'T FIND ENDPOINT",
  MODULE_ERROR: 'MODULE ERROR',
  SERVICE_ERROR: 'SERVICE ERROR',
  DOMAIN_ERROR: 'DOMAIN ERROR',
  HANDLER_ERROR: "CAN'T HANDLE OPERATION",
  TASK_ERROR: "CAN'T START TASK",
  REDIRECT: 'REDIRECT',
  UNAUTHORIZED: "USER ISN'T AUTHORIZED",
  NOT_CONFIRMED: "USER ISN'T CONFIRMED",
  FORBIDDEN: "USER ISN'T INSIDE NET OR MEMBER PARENT NET",
} as const;
export type ControllerErrorCode = keyof typeof CONTROLLER_ERROR_MAP;
export type TControllerErrorDetails = ControllerError['details'];

export class ControllerError extends Error {
  public code: ControllerErrorCode;
  public details?: TOperationResponse;

  constructor(code: ControllerErrorCode, details: TOperationResponse = null) {
    super(CONTROLLER_ERROR_MAP[code]);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}

export const HANDLER_ERROR_MAP = {
  REDIRECT: 'REDIRECT',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: "USER ISN'T AUTHORIZED",
  NOT_CONFIRMED: "USER ISN'T CONFIRMED",
  FORBIDDEN: "USER ISN'T INSIDE NET OR MEMBER PARENT NET",
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
