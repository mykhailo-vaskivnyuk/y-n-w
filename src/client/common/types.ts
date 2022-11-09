import { HttpResponseErrorCode } from './errors';

export interface IWsResponse {
  requestId: number;
  status: HttpResponseErrorCode | 200;
  error: any;
  data: any;
}

export type TParameter<T extends any[]> = T[0];
export type TPromiseExecutor<T> = TParameter<ConstructorParameters<typeof Promise<T>>>;
