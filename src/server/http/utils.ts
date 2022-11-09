import { format } from 'node:util';
import { Readable } from 'node:stream';
import { join } from 'node:path';
import { HTTP_REQ_MODULES, HTTP_RES_MODULES } from './constants';
import { IHttpConfig, IRequest } from '../types';
import {
  IHttpContext, IHttpContextParams,
  IResponse, THttpReqModule, THttpResModule } from './types';
import { IOperation } from '../../app/types';

export const getUrlInstance = (
  pathnameWithSearchString = '/',
  host = 'somehost',
) => new URL(pathnameWithSearchString, `http://${host}`);

export const getLog = (req: IRequest, resLog = '') => {
  const { pathname } = getUrlInstance(req.url, req.headers.host);
  return format('%s %s', req.method, pathname, '-', resLog);
};

export const getJson = async (stream: Readable) => {
  const buffers: Uint8Array[] = [];
  for await (const chunk of stream) buffers.push(chunk as any);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

export const getisApi = (api: string) => (url = '') => {
  const regExp = new RegExp(`^/${api}(/.*)?$`);
  return regExp.test(url);
};

export const applyReqModules = (config: IHttpConfig) => {
  const { reqModules, modulesPath } = config;
  return reqModules.map(
    (moduleName) => {
      const moduleFileName = HTTP_REQ_MODULES[moduleName];
      const modulePath = join(modulesPath, moduleFileName);
      return require(modulePath)[moduleName](config);
    });
};

export const applyResModules = (config: IHttpConfig) => {
  const { resModules, modulesPath } = config;
  return resModules.map(
    (moduleName) => {
      const moduleFileName = HTTP_RES_MODULES[moduleName];
      const modulePath = join(modulesPath, moduleFileName);
      return require(modulePath)[moduleName](config);
    });
};

export const runReqModules = async (
  req: IRequest,
  res: IResponse,
  reqModules: ReturnType<THttpReqModule>[],
  contextParams: IHttpContextParams,
): Promise<IHttpContext | null> => {
  const operation = {
    options: {}, data: { params: {} },
  } as IOperation;
  let context: IHttpContext | null = { ...operation, contextParams };
  for (const module of reqModules) {
    context = await module(req, res, context);
    if (!context) return null;
  }
  return context;
};

export const runResModules = async (
  res: IResponse,
  resModules: ReturnType<THttpResModule>[],
  body: string | Readable,
) => {
  for (const module of resModules) {
    const next = await module(res, body);
    if (!next) return false;
  }
  return true;
};
