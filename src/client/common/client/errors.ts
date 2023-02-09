export const HTTP_RESPONSE_ERROR_MAP = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  500: 'Internal server error',
  503: 'Service unavailable',
} as const;
export type HttpResponseErrorCode = keyof typeof HTTP_RESPONSE_ERROR_MAP;

export class HttpResponseError extends Error {
  statusCode: HttpResponseErrorCode;

  constructor(code: number) {
    const statusCode = (
      code in HTTP_RESPONSE_ERROR_MAP ? code : 500
    ) as HttpResponseErrorCode;
    super(HTTP_RESPONSE_ERROR_MAP[statusCode]);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
