import http from 'node:http';
import { Readable } from 'node:stream';
import { IOperation } from '../../types/operation.types';
import { IRequest } from '../types';
import {
  ResMimeTypeKeys,
  THttpReqModulesKeys,
  THttpResModulesKeys,
} from './constants';

export interface IHttpConfig {
  path: string;
  modulesPath: string;
  staticPath: string;
  apiPathname: string;
  reqModules: THttpReqModulesKeys[];
  resModules: THttpResModulesKeys[];
  host: string;
  port: number;
}

export type IHttpServer = http.Server;
export type IResponse = http.ServerResponse;
export type IHeaders = http.OutgoingHttpHeaders;

export type THttpReqModule<T = any> = (
  config: T,
) => (
  req: IRequest,
  res: IResponse,
  context: IHttpContext,
) => Promise<IHttpContext | null>;

export type THttpResModule<T = any> = (
  config: T,
) => (res: IResponse, body: string | Readable) => Promise<boolean>;

export type IHttpContext = IOperation & {
  contextParams: IHttpContextParams;
};

export interface IHttpContextParams {
  unavailable: boolean;
}

export interface IPreparedFile {
  found: boolean;
  ext: ResMimeTypeKeys;
  stream: Readable;
}

export type TStaticServer = (
  req: IRequest,
  res: IResponse,
  context: IHttpContext,
) => Promise<void>;
