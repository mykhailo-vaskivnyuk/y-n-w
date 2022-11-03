import { TOperationResponse } from '../../app/types';
import { getEnumFromMap } from '../../utils/utils';

export const ServerErrorMap = {
  E_NOT_FOUND: 'Not found',
  E_BED_REQUEST: 'Bad request',
  E_SERVER_ERROR: 'Internal server error',
  E_UNAVAILABLE: 'Service unavailable',
  E_NO_CALLBACK: 'onOperation callback is not set',
  E_LISTEN: 'CAN\'T start server',
  E_REDIRECT: 'REDIRECT',
} as const;

export const ServerErrorEnum = getEnumFromMap(ServerErrorMap);

export const StatusCodeMap = {
  [ServerErrorEnum.E_REDIRECT]: 301,
  [ServerErrorEnum.E_NOT_FOUND]: 404,
  [ServerErrorEnum.E_BED_REQUEST]: 400,
  [ServerErrorEnum.E_SERVER_ERROR]: 500,
  [ServerErrorEnum.E_UNAVAILABLE]: 503,
}

export type ServerErrorCode = keyof typeof ServerErrorMap;

export class ServerError extends Error {
  public code: ServerErrorCode;
  public details: { location?: string } & TOperationResponse | null;
  public statusCode: number | undefined;
 
  constructor(code: ServerErrorCode, details: TOperationResponse | null = null) {
    super(ServerErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = StatusCodeMap[code];
    this.details = details;
  }

  getMessage(): TOperationResponse {
    return this.details ? JSON.stringify(this.details) : this.message;
  }
}
