import { getEnumFromMap } from "../utils/utils";

export const ServerErrorMap = {
  404: 'Not found',
  409: 'Bad request',
  500: 'Internal server error',
  503: 'Service unavailable',
  E_NO_CALLBACK: 'onOperation callback is not set',
  E_LISTEN: 'CAN\'T start server',
} as const;

export const ServerErrorEnum = getEnumFromMap(ServerErrorMap);

export type ServerErrorCode = keyof typeof ServerErrorMap;

export class ServerError extends Error {
  public code: ServerErrorCode;

  constructor(code: ServerErrorCode, message: string = '') {
    super(message || ServerErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}
