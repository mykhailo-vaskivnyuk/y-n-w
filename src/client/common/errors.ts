export const HttpResponseErrorMap = {
  400: 'Bad request',
  404: 'Not found',
  409: 'Conflict',
  500: 'Internal server error',
  503: 'Service unavailable',
};
export type ErrorCodeType = keyof typeof HttpResponseErrorMap;

export class HttpResponseError extends Error {
  statusCode = 500;

  constructor(code: ErrorCodeType) {
    super(HttpResponseErrorMap[code]);
    this.statusCode = code;
    this.name = this.constructor.name;
  }
}
