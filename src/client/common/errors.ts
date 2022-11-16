export const HttpResponseErrorMap = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  500: 'Internal server error',
  503: 'Service unavailable',
};
export type HttpResponseErrorCode = keyof typeof HttpResponseErrorMap;

export class HttpResponseError extends Error {
  statusCode: HttpResponseErrorCode;

  constructor(code: number) {
    const statusCode = (
      code in HttpResponseErrorMap ? code : 500
    ) as HttpResponseErrorCode;
    super(HttpResponseErrorMap[statusCode]);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
