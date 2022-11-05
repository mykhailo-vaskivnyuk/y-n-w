'use strict';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import {
  INDEX, RES_MIME_TYPES, NOT_FOUND,
  ResMimeTypeKeys, UNAVAILABLE,
} from './constants';
import { ErrorStatusCode, ErrorStatusCodeMap, ServerErrorMap } from './errors';
import { IHeaders, IHttpModulsContext, IRequest, IResponse } from './types';
import { getLog, getUrlInstance } from './utils';

interface IPreparedFile {
  found: boolean;
  mimeType?: string;
  stream?: Readable;
}

export type TStaticServer = ReturnType<typeof createStaticServer>;

export const createStaticServer = (staticPath: string) => {
  const prepareFile = async (url: string, unavailable: boolean): Promise<IPreparedFile> => {
    const paths = [staticPath, url || INDEX];
    let filePath = path.join(...paths);
    const notTraversal = filePath.startsWith(staticPath);
    const found = notTraversal &&
    await fs.promises
      .stat(filePath)
      .then((file) => file.isFile())
      .catch(() => false);
    if (!found) {
      const ext = path.extname(filePath);
      if (!ext) return { found: false };
      filePath = path.join(staticPath, NOT_FOUND);
    } else if (unavailable) {
      filePath = path.join(staticPath, UNAVAILABLE);
    }
    const ext = path.extname(filePath).substring(1).toLowerCase() as ResMimeTypeKeys;
    const mimeType = RES_MIME_TYPES[ext] || RES_MIME_TYPES.default;
    const stream = fs.createReadStream(filePath);
    return { found, mimeType, stream };
  };

  return async (req: IRequest, res: IResponse, context: IHttpModulsContext): Promise<void> => {
    const { staticUnavailable } = context;
    const { url, headers } = req;
    const pathname = getUrlInstance(url, headers.host).pathname;
    const path = pathname.replace(/\/$/, '');
    const { found, mimeType, stream } = await prepareFile(path, staticUnavailable);
    let errCode = '' as ErrorStatusCode;
    let resHeaders = { 'Content-Type': mimeType } as IHeaders;

    if (!found && !mimeType) { 
      errCode = 'E_REDIRECT';
      resHeaders = { location: '/' };
    }
    else if (!found) errCode = 'E_NOT_FOUND';
    else if (staticUnavailable) errCode = 'E_UNAVAILABLE';

    const statusCode = errCode ? ErrorStatusCodeMap[errCode]! : 200;
    const resLog = errCode ? statusCode + ' ' + ServerErrorMap[errCode] : 'OK';
    const log = getLog(req, resLog);
    errCode ? logger.error(log) : logger.info(log);
    res.writeHead(statusCode, resHeaders);
    stream?.pipe(res);
  };
};
