
import fs from 'node:fs';
import path from 'node:path';
import { IInputConnectionConfig, IRequest } from '../../types';
import {
  IHeaders, IHttpContext, IPreparedFile,
  IResponse, THttpModule,
} from '../types';
import {
  INDEX, NOT_FOUND, ResMimeTypeKeys,
  RES_MIME_TYPES_MAP, UNAVAILABLE,
} from '../constants';
import {
  ErrorStatusCode, ErrorStatusCodeMap, ServerError, ServerErrorMap,
} from '../../errors';
import { getifApi, getLog, getUrlInstance } from '../utils';

export const staticServer: THttpModule = (
  config: IInputConnectionConfig['http'],
) => {
  const { public: publicPath, api } = config.paths;
  const ifApi = getifApi(api);
  const httpStaticServer = createStaticServer(publicPath);

  return async function staticServer(
    req, res, context,
  ) {
    if (ifApi(req.url)) return context;
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
      errCode = 'E_REDIRECT';
      resHeaders = { location: '/' };
    } else if (!found) errCode = 'E_NOT_FOUND';
    else if (staticUnavailable) errCode = 'E_UNAVAILABLE';
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
    if (!notTraversal) throw new ServerError('E_NOT_FOUND');
    const file = await fs.promises.stat(filePath);
    if (!file || !file.isFile()) throw new ServerError('E_NOT_FOUND');
    found = true;
    if (staticUnavailable)
      filePath = path.join(staticPath, UNAVAILABLE);
  } catch (e) {
    filePath = path.join(staticPath, NOT_FOUND);
  }
  const stream = fs.createReadStream(filePath);
  return { found, ext, stream };
};
