import { HttpResponseErrorCode } from './errors';

export type TFetch = <T>(pathname: string, options?: Record<string, any>) => Promise<T>;

export interface IWsResponse {
  requestId?: number;
  chatId?: number;
  status: HttpResponseErrorCode | 200;
  error: any;
  data: any;
}
