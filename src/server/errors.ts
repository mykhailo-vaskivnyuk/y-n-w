import { TOperationResponse } from '../app/types';

export const ServerErrorMap = {
  NOT_FOUND: 'Not found',
  BED_REQUEST: 'Bad request',
  REDIRECT: 'Redirect',
  SERVICE_UNAVAILABLE: 'Service unavailable',
  SERVER_ERROR: 'Internal server error',
  NO_CALLBACK: 'onOperation callback is not set',
  LISTEN_ERROR: 'Can\'t start server',
} as const;

export type ServerErrorCode = keyof typeof ServerErrorMap;

export const ErrorStatusCodeMap: Partial<Record<ServerErrorCode, number>> = {
  REDIRECT: 301,
  NOT_FOUND: 404,
  BED_REQUEST: 400,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
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
