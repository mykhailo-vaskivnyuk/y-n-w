import { TOperationResponse } from '../types/operation.types';

export const ServerErrorMap = {
  REDIRECT: 'Redirect',
  BED_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service unavailable',
  NO_CALLBACK: 'onOperation callback is not set',
  LISTEN_ERROR: "Can't start server",
} as const;
export type ServerErrorCode = keyof typeof ServerErrorMap;

export const ErrorStatusCodeMap: Partial<Record<ServerErrorCode, number>> = {
  REDIRECT: 301,
  BED_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
export type ErrorStatusCode = keyof typeof ErrorStatusCodeMap;

export class ServerError extends Error {
  public code: ServerErrorCode;
  public details: ({ location?: string } & TOperationResponse) | null;
  public statusCode: number | undefined;

  constructor(
    code: ServerErrorCode,
    details: TOperationResponse | null = null,
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
