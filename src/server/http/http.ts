import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { format } from 'node:util';
import { JSON_TRANSFORM_LENGTH, MIME_TYPES_ENUM, MIME_TYPES_MAP } from '../../constants/constants';
import { IRequest, IResponse, IServer, THttpModule } from './types';
import { TPromiseExecutor } from '../../types/types';
import { IInputConnection, IInputConnectionConfig, IOperation, IParams, TOperationResponse } from '../../app/types';
import { ServerError, ServerErrorEnum, ServerErrorMap } from './errors';
import createStaticServer, { TStaticServer } from './static';
import { getUrlInstance } from './utils';
import { getEnumFromMap } from '../../utils/utils';
import { allowCors } from './modules/allowCors';
import { createUnicCode } from '../../utils/crypto';

export const HTTP_MODULES = {
  allowCors,
};

class HttpConnection implements IInputConnection {
  private config: IInputConnectionConfig['http'];
  private server: IServer;
  private staticServer: TStaticServer;
  private callback?: (operation: IOperation) => Promise<TOperationResponse>;
  private modules: ReturnType<THttpModule>[] = [];

  constructor(config: IInputConnectionConfig['http']) {
    this.config = config;
    this.server = createServer(this.onRequest.bind(this));
    this.staticServer = createStaticServer(this.config.paths.public);
  }

  onOperation(fn: (operation: IOperation) => Promise<TOperationResponse>) {
    this.callback = fn;
    return this;
  }

  start() {
    if (!this.callback) {
      const e = new ServerError(ServerErrorEnum.E_NO_CALLBACK);
      logger.error(e);
      throw e;
    }

    try {
      const { modules } = this.config;
      modules.map(
        (module) => this.modules.push(HTTP_MODULES[module]())
      );
    } catch (e: any) {
      logger.error(e);
      throw new ServerError(ServerErrorEnum.E_SERVER_ERROR);
    }

    const executor: TPromiseExecutor<void> = (rv, rj) => {
      const { port } = this.config;
      try {
        this.server.listen(port, rv);
      } catch (e: any) {
        logger.error(e);
        rj(new ServerError(ServerErrorEnum.E_LISTEN));
      }
    }

    return new Promise<void>(executor);
  }

  private async onRequest(req: IRequest, res: IResponse) {
    if (!this.runModules(req, res)) return;

    const { api } = this.config.paths;
    const ifApi = new RegExp(`^/${api}(/.*)?$`);
    if (!ifApi.test(req.url || ''))
      return this.staticServer(req, res);
    
    try {
      const operation = await this.getOperation(req);
      const { options, data: { params } } = operation;
      const { sessionKey } = options;
      sessionKey && res.setHeader(
        'set-cookie', `sessionKey=${sessionKey}; Path=/; httpOnly`
      );
        
      const response = await this.callback!(operation);
      
      res.statusCode = 200;

      if (response instanceof Readable) {
        res.setHeader('content-type', MIME_TYPES_ENUM['application/octet-stream']);
        await new Promise((rv, rj) => {
          response.on('error', rj);
          response.on('end', rv);
          res.on('finish',
            () => logger.info(params, this.getLog(req, 'OK'))
          );
          response.pipe(res);
        });
        return;
      }

      const data = JSON.stringify(response);
      res.setHeader('content-type', MIME_TYPES_ENUM['application/json']);
      res.on('finish',
        () => logger.info(params, this.getLog(req, 'OK'))
      );
      res.end(data);
        
    } catch (e) {
      this.onError(e, req, res);
    }
  }
  
  private runModules(req: IRequest, res: IResponse) {
    for (const module of this.modules) {
      const next = module(req, res);
      if (!next) return false;
    }
    return true;
  }

  private async getOperation(req: IRequest) {
    const { options, names, params } = this.getRequestParams(req);
    const data = { params } as IOperation['data'];
    const { headers } = req;
    const contentType = headers['content-type'] as (keyof typeof MIME_TYPES_MAP) | undefined;
    const length = +(headers['content-length'] || Infinity);

    if (!contentType) return { options, names, data };

    if (!MIME_TYPES_MAP[contentType]) {
      throw new ServerError(ServerErrorEnum.E_BED_REQUEST);
    }
    if (length > MIME_TYPES_MAP[contentType].maxLength) {
      throw new ServerError(ServerErrorEnum.E_BED_REQUEST);
    }
      
    if (contentType === MIME_TYPES_ENUM['application/json'] && length < JSON_TRANSFORM_LENGTH) {
      Object.assign(params, await this.getJson(req));
      return { options, names, data };
    }
      
    const content = Readable.from(req);
    data.stream = { type: contentType, content };
      
    return { options, names, data };
  }
    
  private getRequestParams(req: IRequest) {
    const { origin, cookie } = req.headers;
    const { pathname, searchParams } = getUrlInstance(req.url, origin);
      
    const names = (pathname
      .replace('/' + this.config.paths.api, '')
      .slice(1) || 'index')
      .split('/')
      .filter((path) => Boolean(path));

    const params = {} as IParams;
    const queryParams = searchParams.entries();
    for (const [key, value] of queryParams) params[key] = value;

    const options: IOperation['options'] = {} as IOperation['options'];
    options.sessionKey = this.getSessionKey(cookie);
    options.origin = origin || '';

    return { options, names, params };
  }
      
  private getSessionKey(cookie?: string) {
    if (cookie) {
      const regExp = /sessionKey=([^\s]*)\s*;?/;
      const [, result] = cookie.match(regExp) || [];
      if (result) return result;
    }
    return createUnicCode(15);
  }
      
  private async getJson(req: IRequest) {
    try {
      const buffers: Uint8Array[] = [];
      for await (const chunk of req) buffers.push(chunk as any);
      const data = Buffer.concat(buffers).toString();
      return JSON.parse(data);
    } catch (e: any) {
      logger.error(e);
      throw new ServerError(ServerErrorEnum.E_BED_REQUEST);
    }
  }
      
  private getLog(req: IRequest, resLog = '') {
    const { pathname } = getUrlInstance(req.url, req.headers.host);
    return format('%s %s', req.method, pathname, '-', resLog);
  }
      
  private onError(e: any, req: IRequest, res: IResponse) {
    let error = e;
    if (!(e instanceof ServerError)) {
      error = new ServerError(ServerErrorEnum.E_SERVER_ERROR);
    }
    const { code, statusCode = 500, details } = error as ServerError;
    
    res.statusCode = statusCode;
    if (code === ServerErrorEnum.E_REDIRECT) res.setHeader('location', details?.location || '/');
    details && res.setHeader('content-type', MIME_TYPES_ENUM['application/json']);
    logger.error({}, this.getLog(req, ServerErrorMap[code]));
    res.end(error.getMessage());

    if (code === ServerErrorEnum.E_SERVER_ERROR) throw e;
  }
}

export default HttpConnection;
