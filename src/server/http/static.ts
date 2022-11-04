'use strict';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { INDEX, MIME_TYPES, NOT_FOUND } from './constants';
import { ErrorStatusCodeMap, ServerErrorMap } from './errors';
import { IRequest, IResponse } from './types';
import { getLog, getUrlInstance } from './utils';

interface IPreparedFile {
  found: boolean;
  mimeType?: string;
  stream?: Readable;
}

export type TStaticServer = ReturnType<typeof createStaticServer>;

const createStaticServer = (staticPath: string) => {
  const prepareFile = async (url: string): Promise<IPreparedFile> => {
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
      if (!ext) return { found };
      filePath = path.join(staticPath, NOT_FOUND);
    }
    const ext = path.extname(filePath).substring(1).toLowerCase() as keyof typeof MIME_TYPES;
    const mimeType = MIME_TYPES[ext] || MIME_TYPES.default;
    const stream = fs.createReadStream(filePath);
    return { found, mimeType, stream };
  };

  return async (req: IRequest, res: IResponse): Promise<void> => {
    const { pathname } = getUrlInstance(req.url, req.headers.host);
    const path = pathname.replace(/\/$/, '');
    const { found, mimeType, stream } = await prepareFile(path);
    if (!found && !mimeType) {
      const statusCode = ErrorStatusCodeMap['E_REDIRECT'];
      const resLog = statusCode + ' ' + ServerErrorMap['E_REDIRECT'];
      logger.error(getLog(req, resLog));
      res.writeHead(statusCode || 301, { location: '/' });
      res.end();
      return;
    }
    const statusCode = found ? 200 : ErrorStatusCodeMap['E_NOT_FOUND'] || 404;
    const resLog = found ? 'OK' : statusCode + ' ' + ServerErrorMap['E_NOT_FOUND']
    const log = getLog(req, resLog);
    found ? logger.info(log) : logger.error(log);
    res.writeHead(statusCode, { 'Content-Type': mimeType });
    stream?.pipe(res);
  };
}

export default createStaticServer;
