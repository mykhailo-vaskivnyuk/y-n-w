import http from 'node:http';
import { IOperation } from '../../app/types';
import { IRequest } from '../types';

export type IHttpServer = http.Server;
export type IResponse = http.ServerResponse;
export type IHeaders = http.OutgoingHttpHeaders;

export type THttpModule<T = any> =
  (config: T) => (
    req: IRequest,
    res: IResponse,
    options: IOperation['options'],
    context: IHttpModulsContext,
  ) => Promise<IOperation['options'] | null>;

export interface IHttpModulsContext {
  staticUnavailable: boolean;
  apiUnavailable: boolean;
}
