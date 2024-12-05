import { createEnumFromMap } from '../../../local/imports';

export const HTTP_RESPONSE_ERROR_MAP = {
  400: 'BadRequest',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'NotFound',
  409: 'Conflict',
  500: 'InternalServerError',
  503: 'ServiceUnavailable',
} as const;
export type HttpResponseErrorCode = keyof typeof HTTP_RESPONSE_ERROR_MAP;

export const httpResponseErrorEnum = createEnumFromMap(HTTP_RESPONSE_ERROR_MAP);

export class HttpResponseError extends Error {
  statusCode: HttpResponseErrorCode;

  constructor(code: number) {
    const statusCode = (code in HTTP_RESPONSE_ERROR_MAP ? code : 500) as HttpResponseErrorCode;
    super(HTTP_RESPONSE_ERROR_MAP[statusCode]);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export const isHttpResponseError = (error?: Error | null): error is HttpResponseError =>
  error instanceof HttpResponseError;
