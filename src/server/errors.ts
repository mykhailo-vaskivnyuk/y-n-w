import { TOperationResponse } from '../app/types';

export const ServerErrorMap = {
  E_NOT_FOUND: 'Not found',
  E_BED_REQUEST: 'Bad request',
  E_SERVER_ERROR: 'Internal server error',
  E_UNAVAILABLE: 'Service unavailable',
  E_NO_CALLBACK: 'onOperation callback is not set',
  E_LISTEN: 'Can\'t start server',
  E_REDIRECT: 'Redirect',
} as const;

export type ServerErrorCode = keyof typeof ServerErrorMap;

export const ErrorStatusCodeMap: Partial<Record<ServerErrorCode, number>> = {
  E_REDIRECT: 301,
  E_NOT_FOUND: 404,
  E_BED_REQUEST: 400,
  E_SERVER_ERROR: 500,
  E_UNAVAILABLE: 503,
};
export type ErrorStatusCode = keyof typeof ErrorStatusCodeMap;

export class ServerError extends Error {
  public code: ServerErrorCode;
  public details: { location?: string } & TOperationResponse | null;
  public statusCode: number | undefined;

  constructor(
    code: ServerErrorCode, details: TOperationResponse | null = null,
  ) {
    super(ServerErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = ErrorStatusCodeMap[code];
    this.details = details;
  }

  getMessage(): TOperationResponse {
    return this.details ? JSON.stringify(this.details) : this.message;
  }
}
