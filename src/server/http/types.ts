import http from 'node:http';
import { Readable } from 'node:stream';
import { IOperation } from '../../app/types';
import { IRequest } from '../types';
import { ResMimeTypeKeys } from './constants';

export type IHttpServer = http.Server;
export type IResponse = http.ServerResponse;
export type IHeaders = http.OutgoingHttpHeaders;

export type THttpModule<T = any> =
  (config: T) => (
    req: IRequest,
    res: IResponse,
    context: IHttpContext,
  ) => Promise<IHttpContext | null>;

export type IHttpContext = IOperation & {
  contextParams: IHttpContextParams;
}

export interface IHttpContextParams {
  staticUnavailable: boolean;
  apiUnavailable: boolean;
}

export interface IPreparedFile {
  found: boolean;
  ext: ResMimeTypeKeys;
  stream: Readable;
}

export type TStaticServer = (
  req: IRequest, res: IResponse, context: IHttpContext,
) => Promise<void>;
