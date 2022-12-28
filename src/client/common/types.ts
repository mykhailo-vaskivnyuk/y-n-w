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

// export type DbRecordOrNull<T> =
//   | { [key in keyof T]: T[key] }
//   | { [key in keyof T]: null };

export type DbRecordOrNull<T> = { [key in keyof T]: T[key] | null };
