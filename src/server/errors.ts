import { getEnumFromMap } from '../utils/utils';

export const ServerErrorMap = {
  E_NOT_FOUND: 'Not found',
  E_BED_REQUEST: 'Bad request',
  E_SERVER_ERROR: 'Internal server error',
  E_UNAVAILABLE: 'Service unavailable',
  E_NO_CALLBACK: 'onOperation callback is not set',
  E_LISTEN: 'CAN\'T start server',
} as const;

export const ServerErrorEnum = getEnumFromMap(ServerErrorMap);

export type ServerErrorCode = keyof typeof ServerErrorMap;

export class ServerError extends Error {
  public code: ServerErrorCode;

  constructor(code: ServerErrorCode, message = '') {
    super(message || ServerErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}
