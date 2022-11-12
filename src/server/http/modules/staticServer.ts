
import fs from 'node:fs';
import path from 'node:path';
import { IRequest } from '../../types';
import {
  IHeaders, IHttpConfig, IHttpContext,
  IPreparedFile, IResponse, THttpReqModule } from '../types';
import {
  INDEX, NOT_FOUND, ResMimeTypeKeys,
  RES_MIME_TYPES_MAP, UNAVAILABLE } from '../constants';
import {
  ErrorStatusCode, ErrorStatusCodeMap,
  ServerError, ServerErrorMap } from '../../errors';
import { makeIsApiPathname, getLog, getUrlInstance } from '../methods/utils';

export const staticServer: THttpReqModule = (config: IHttpConfig) => {
  const { staticPath, apiPathname } = config;
  const IsApiPathname = makeIsApiPathname(apiPathname);
  const httpStaticServer = createStaticServer(staticPath);

  return async function staticServer(
    req, res, { ...context },
  ) {
    if (IsApiPathname(req.url)) return context;
    await httpStaticServer(req, res, context);
    return null;
  };
};

export const createStaticServer = (staticPath: string) =>
  async (
    req: IRequest, res: IResponse, context: IHttpContext,
  ): Promise<void> => {
    const { staticUnavailable } = context.contextParams;
    const { url, headers } = req;
    const pathname = getUrlInstance(url, headers.host).pathname;
    const path = pathname.replace(/\/$/, '');
    const {
      found, ext, stream,
    } = await prepareFile(staticPath, path, staticUnavailable);
    let errCode = '' as ErrorStatusCode;
    let resHeaders = {
      'Content-Type': RES_MIME_TYPES_MAP[ext] || RES_MIME_TYPES_MAP.default,
    } as IHeaders;
    if (!found && !ext) {
      errCode = 'REDIRECT';
      resHeaders = { location: '/' };
    } else if (!found) errCode = 'NOT_FOUND';
    else if (staticUnavailable) errCode = 'SERVICE_UNAVAILABLE';
    const statusCode = errCode ? ErrorStatusCodeMap[errCode]! : 200;
    const resLog = errCode ? statusCode + ' ' + ServerErrorMap[errCode] : 'OK';
    const log = getLog(req, resLog);
    errCode ? logger.error(log) : logger.info(log);
    res.writeHead(statusCode, resHeaders);
    stream?.pipe(res);
  };

const prepareFile = async (
  staticPath: string,
  pathname: string,
  staticUnavailable: boolean,
): Promise<IPreparedFile> => {
  let filePath = path.join(staticPath, pathname || INDEX);
  let found = false;
  const ext = path
    .extname(filePath)
    .substring(1)
    .toLowerCase() as ResMimeTypeKeys;
  const notTraversal = filePath.startsWith(staticPath);
  try {
    if (!notTraversal) throw new ServerError('NOT_FOUND');
    const file = await fs.promises.stat(filePath);
    if (!file || !file.isFile()) throw new ServerError('NOT_FOUND');
    found = true;
    if (staticUnavailable)
      filePath = path.join(staticPath, UNAVAILABLE);
  } catch (e) {
    filePath = path.join(staticPath, NOT_FOUND);
  }
  const stream = fs.createReadStream(filePath);
  return { found, ext, stream };
};
