import http from 'node:http';
import { IRequest } from '../types';

export type IHttpServer = http.Server;
export type IResponse = http.ServerResponse;
export type IHeaders = http.OutgoingHttpHeaders;

export type THttpModule<T = any> =
  (config: T) => (
    req: IRequest,
    res: IResponse,
    context: IHttpModulsContext,
  ) => Promise<boolean>;

export interface IHttpModulsContext {
  staticUnavailable: boolean;
  apiUnavailable: boolean;
}
