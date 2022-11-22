import { HttpResponseErrorCode } from './errors';

export type TFetch = <T>(
  pathname: string, options?: Record<string, any>,
) => Promise<T>;

export interface IWsResponse {
  requestId: number;
  status: HttpResponseErrorCode | 200;
  error: any;
  data: any;
}

export type OmitNull<T> = T extends null ? never : T;
