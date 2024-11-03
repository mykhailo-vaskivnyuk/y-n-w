import { TOperationResponse } from '../types/operation.types';

export const DOMAIN_ERROR_MAP = {
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'USER ISN\'T INSIDE NET OR MEMBER OF PARENT NET',
} as const;
export type DomainErrorCode = keyof typeof DOMAIN_ERROR_MAP;

export class DomainError extends Error {
  public code: DomainErrorCode;
  public details?: TOperationResponse;

  constructor(code: DomainErrorCode, details: TOperationResponse = null) {
    super(DOMAIN_ERROR_MAP[code]);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}
