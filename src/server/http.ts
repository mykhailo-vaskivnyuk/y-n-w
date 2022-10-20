import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { format } from 'node:util';
import { JSON_TRANSFORM_LENGTH, MIME_TYPES_ENUM, MIME_TYPES_MAP } from '../constants';
import { HEADERS, IRequest, IResponse, IServer } from './types';
import { TPromiseExecutor } from '../types';
import { IInputConnection, IInputConnectionConfig, IOperation, TOperationResponse } from '../app/types';
import { ServerError, ServerErrorEnum, ServerErrorMap } from './errors';
import createStaticServer, { TStaticServer } from './static';
import { getUrlInstance } from './utils';

class HttpConnection implements IInputConnection {
  private config: IInputConnectionConfig;
  private server: IServer;
  private staticServer: TStaticServer;
  private callback?: (operation: IOperation) => Promise<TOperationResponse>;

  constructor(config: IInputConnectionConfig) {
    this.config = config;
    this.server = createServer(this.onRequest.bind(this));
    this.staticServer = createStaticServer(this.config.path.public);
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

    const executor: TPromiseExecutor<void> = (rv, rj) => {
      const { port } = this.config.http;
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
    const { api } = this.config.path;
    const ifApi = new RegExp(`^/${api}(/.*)?$`);
    if (!ifApi.test(req.url || ''))
      return this.staticServer(req, res);
    
    try {
      const operation = await this.getOperation(req);
      const { params } = operation.data;
      const { sessionKey } = params;
      sessionKey && res.setHeader(
        'set-cookie', `sessionKey=${sessionKey}; httpOnly`
      );
        
      const response = await this.callback!(operation);
        
      if (response instanceof Readable) {
        res.setHeader('content-type', MIME_TYPES_ENUM['application/octet-stream']);
        res.writeHead(200, HEADERS);
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
        
      res.setHeader('content-type', MIME_TYPES_ENUM['application/json']);
      res.writeHead(200, HEADERS);
      const data = JSON.stringify(response);
      res.on('finish',
        () => logger.info(params, this.getLog(req, 'OK'))
      );
      res.end(data);
        
    } catch (e) {
      this.onError(e, req, res);
    }
  }
    
  private async getOperation(req: IRequest) {
    const { names, params } = this.getRequestParams(req);
    const data = { params } as IOperation['data'];
    const { headers } = req;
    const contentType = headers['content-type'] as (keyof typeof MIME_TYPES_MAP) | undefined;
    const length = +(headers['content-length'] || Infinity);
      
    if (!contentType) return { names, data };
      
    if (!MIME_TYPES_MAP[contentType]) {
      throw new ServerError(ServerErrorEnum.E_BED_REQUEST);
    }
    if (length > MIME_TYPES_MAP[contentType].maxLength) {
      throw new ServerError(ServerErrorEnum.E_BED_REQUEST);
    }
      
    if (contentType === MIME_TYPES_ENUM['application/json'] && length < JSON_TRANSFORM_LENGTH) {
      Object.assign(params, await this.getJson(req));
      return { names, data };
    }
      
    const content = Readable.from(req);
    data.stream = { type: contentType, content };
      
    return { names, data };
  }
    
  private getRequestParams(req: IRequest) {
    const { host, cookie } = req.headers;
    const { pathname, searchParams } = getUrlInstance(req.url, host);
      
    const names = (pathname
      .replace('/' + this.config.path.api, '')
      .slice(1) || 'index')
      .split('/')
      .filter((path) => Boolean(path));

    const params: IOperation['data']['params'] = {};
    params.sessionKey = this.getSessionKey(cookie);
        
    const queryParams = searchParams.entries();
    for (const [key, value] of queryParams) params[key] = value;
    return { names, params };
  }
      
  private getSessionKey(cookie?: string) {
    if (cookie) {
      const regExp = /sessionKey=([^\s]*)\s*;?/;
      const result = cookie.match(regExp) || [];
      if (result[1]) return result[1];
    }
    return Buffer
      .from(Math.random().toString().slice(2))
      .toString('base64')
      .slice(0, 15);
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
    details && res.setHeader('content-type', MIME_TYPES_ENUM['application/json']);
    logger.error({}, this.getLog(req, ServerErrorMap[code]));
    res.end(error.getMessage());

    if (code === ServerErrorEnum.E_SERVER_ERROR) throw e;
  }
}

export = HttpConnection;
