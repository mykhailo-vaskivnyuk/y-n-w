import { Server, WebSocket } from 'ws';
import { Readable } from 'node:stream';
// import {
//   HTTP_MODULES, REQ_MIME_TYPES_MAP, ReqMimeTypesKeys,
//   REQ_MIME_TYPES_ENUM, JSON_TRANSFORM_LENGTH,
// } from './constants';
import {
  IInputConnection, IInputConnectionConfig,
  IRequest, IResponse, TServerService,
} from '../types';
import { IServer } from './types';
import { TPromiseExecutor } from '../../types/types';
import { IOperation, IParams, TOperationResponse } from '../../app/types';
import { ServerError, ServerErrorMap } from '../errors';
// import { getLog, getUrlInstance } from '../utils';
import { createUnicCode } from '../../utils/crypto';

class WsConnection implements IInputConnection {
  private config: IInputConnectionConfig['ws'];
  private server: IServer;
  private exec?: (operation: IOperation) => Promise<TOperationResponse>;
  // private modules: ReturnType<THttpModule>[] = [];
  // private staticUnavailable = false;
  private apiUnavailable = false;

  constructor(config: IInputConnectionConfig['http']) {
    this.config = config;
    this.server = new Server({ port: config.port });
    this.server.on('connection', this.handleConnection.bind(this));
  }

  onOperation(fn: (operation: IOperation) => Promise<TOperationResponse>) {
    this.exec = fn;
    return this;
  }

  setUnavailable(service: TServerService) {
    // service === 'static' && (this.staticUnavailable = true);
    service === 'api' && (this.apiUnavailable = true);
  }

  async start() {
    if (!this.exec) {
      const e = new ServerError('E_NO_CALLBACK');
      logger.error(e, e.message);
      throw e;
    }

    // try {
    //   const { modules } = this.config;
    //   this.modules = modules.map(
    //     (moduleName) => {
    //       const modulePath = HTTP_MODULES[moduleName];
    //       return require(modulePath)[moduleName](this.config);
    //     });
    // } catch (e: any) {
    //   logger.error(e, e.message);
    //   throw new ServerError('E_SERVER_ERROR');
    // }

    // const executor: TPromiseExecutor<void> = (rv, rj) => {
    //   const { port } = this.config;
    //   try {
    //     this.server.listen(port, rv);
    //   } catch (e: any) {
    //     logger.error(e, e.message);
    //     rj(new ServerError('E_LISTEN'));
    //   }
    // };

    return; // new Promise<void>(executor);
  }

  private handleConnection(connection: WebSocket, req: IRequest) {
    // const ip = req.socket.remoteAddress;
    connection.on('message', async (
      message: string,
    ) => {
      try {
        const response = await this.onRequest(message, req);
        connection.send(JSON.stringify(response), { binary: false });
      } catch (err) {
        console.error(err);
        connection.send('"Server error"', { binary: false });
      }
    });
  }

  private async onRequest(message: string, req: IRequest) {
    console.log(message.toString())
    // const next = await this.runModules(req, res);
    // if (!next) return;

    //     const obj = JSON.parse(message);
    //     const { name, method, args = [] } = obj;
    //     const entity = routing[name];
    //     if (!entity)
    //       return connection.send('"Not found"', { binary: false });
    //     const handler = entity[method];
    //     if (!handler)
    //       return connection.send('"Not found"', { binary: false });
    //     const json = JSON.stringify(args);
    //     const parameters = json.substring(1, json.length - 1);
    //     console.log(`${ip} ${name}.${method}(${parameters})`);
    //     try {
    //       const result = await handler(...args);
    //       connection.send(JSON.stringify(result), { binary: false });
    //     } catch (err) {
    //       console.error(err);
    //       connection.send('"Server error"', { binary: false });
    //     }
    //   });
    // }


    try {
      if (this.apiUnavailable) throw new ServerError('E_UNAVAILABLE');
      const operation = await this.getOperation(message, req);
      // const { options, data: { params } } = operation;
      // const { sessionKey } = options;
      // sessionKey && res.setHeader(
      //   'set-cookie', `sessionKey=${sessionKey}; Path=/; httpOnly`
      // );

      const response = { response: 'test response' };
      // null; // await this.exec!(operation);

      // res.statusCode = 200;

      // if (response instanceof Readable) {
      //   res.setHeader(
      //     'content-type',
      //     REQ_MIME_TYPES_ENUM['application/octet-stream'],
      //   );
      //   await new Promise((rv, rj) => {
      //     response.on('error', rj);
      //     response.on('end', rv);
      //     res.on('finish',
      //       () => logger.info(params, getLog(req, 'OK'))
      //     );
      //     response.pipe(res);
      //   });
      //   return;
      // }

      const data = JSON.stringify(response);
      // res.setHeader('content-type', REQ_MIME_TYPES_ENUM['application/json']);
      // res.on('finish',
      //   () => logger.info(params, getLog(req, 'OK'))
      // );
      // res.end(data);
      return data;
    } catch (e) {
      // this.onError(e, req, res);
      console.log(e);
      throw e;
    }
  }

  // private async runModules(req: IRequest, res: IResponse) {
  //   const context = {
  //     staticUnavailable: this.staticUnavailable,
  //     apiUnavailable: this.apiUnavailable,
  //   };
  //   for (const module of this.modules) {
  //     const next = await module(req, res, context);
  //     if (!next) return false;
  //   }
  //   return true;
  // }

  private async getOperation(message: string, req: IRequest) {
    const { options, names, params } = this.getRequestParams(message, req);
    const data = { params } as IOperation['data'];
    // const { headers } = req;
    // const contentType = headers['content-type']
    //   as ReqMimeTypesKeys | undefined;
    // const length = +(headers['content-length'] || Infinity);

    // if (!contentType) return { options, names, data };

    // if (!REQ_MIME_TYPES_MAP[contentType]) {
    //   throw new ServerError('E_BED_REQUEST');
    // }
    // if (length > REQ_MIME_TYPES_MAP[contentType].maxLength) {
    //   throw new ServerError('E_BED_REQUEST');
    // }

    // if (
    //   contentType === REQ_MIME_TYPES_ENUM['application/json'] &&
    //   length < JSON_TRANSFORM_LENGTH
    // ) {
    //   Object.assign(params, await this.getJson(req));
    //   return { options, names, data };
    // }

    // const content = Readable.from(req);
    // data.stream = { type: contentType, content };

    return { options, names, data };
  }

  private getRequestParams(message: string, req: IRequest) {
    const { origin, cookie } = req.headers;
    // const { pathname, searchParams } = getUrlInstance(req.url, origin);
    const request = JSON.parse(message);
    const { url, data } = request;
    const params = JSON.parse(data);
    const names = ((url as string)
      .slice(1) || 'index')
      .split('/')
      .filter((path) => Boolean(path));

    // const names = (pathname
    //   .replace('/' + this.config.paths.api, '')
    //   .slice(1) || 'index')
    //   .split('/')
    //   .filter((path) => Boolean(path));

    // const params = {} as IParams;
    // const queryParams = searchParams.entries();
    // for (const [key, value] of queryParams) params[key] = value;

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
      logger.error(e, e.message);
      throw new ServerError('E_BED_REQUEST');
    }
  }

  private onError(e: any, req: IRequest, res: IResponse) {
    let error = e;
    if (!(e instanceof ServerError)) {
      error = new ServerError('E_SERVER_ERROR', e.details);
    }
    const { code, statusCode = 500, details } = error as ServerError;

    res.statusCode = statusCode;
    if (code === 'E_REDIRECT') {
      res.setHeader('location', details?.location || '/');
    }
    // if (details) {
    //   res.setHeader('content-type', REQ_MIME_TYPES_ENUM['application/json']);
    // }
    // logger.error({}, getLog(req, statusCode + ' ' + ServerErrorMap[code]));
    res.end(error.getMessage());

    if (e.name !== ServerError.name) throw e;
    if (e.code === 'E_SERVER_ERROR') throw e;
  }
}

export = WsConnection;
