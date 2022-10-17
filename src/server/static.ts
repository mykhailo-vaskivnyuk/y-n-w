'use strict';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { IRequest, IResponse } from './types';

const MIME_TYPES = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const toBool = [() => true, () => false];

interface IPreparedFile {
  found: boolean;
  mimeType: string;
  stream: Readable;
}

export type TStaticServer = ReturnType<typeof createStaticServer>;

const createStaticServer = (staticPath: string) => {
  const prepareFile = async (url = '/'): Promise<IPreparedFile> => {
    const paths = [staticPath, url];
    if (url.endsWith('/')) paths.push('index.html');
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(staticPath);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : staticPath + '/404.html';
    const ext = path.extname(streamPath).substring(1).toLowerCase() as keyof typeof MIME_TYPES;
    const mimeType = MIME_TYPES[ext] || MIME_TYPES.default;
    const stream = fs.createReadStream(streamPath);
    return { found, mimeType, stream };
  };

  return async (req: IRequest, res: IResponse): Promise<void> => {
    const { found, mimeType, stream } = await prepareFile(req.url);
    const statusCode = found ? 200 : 404;
    res.writeHead(statusCode, { 'Content-Type': mimeType });
    stream.pipe(res);
  };
}

export default createStaticServer;
