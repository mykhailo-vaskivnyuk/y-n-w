import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http'
import { IRoutes, THandler } from '../router/types';
import { RouterError, RouterErrorEnum } from '../router/errors';
import { MIME_TYPES_ENUM } from '../constants';
import { Writable } from 'node:stream';

export type TApiMethod = (...args: any[]) => Promise<any>;

export interface IApi {
  [key: string]: TApiMethod | IApi;
}

class ClientApi {
  private routes?: IRoutes;
  private api?: IApi;
  // private modules: TModule[] = [];

  async init() {
    try {
      this.routes = await this.createRoutes('./js/api');
      this.api = this.createApi(this.routes, '');
      const stream = fs.createWriteStream('./src/api.client/api.ts');
      stream.write('module.exports = (url: string, fetch: (url: string, options: Record<string, any>) => Promise<any>) => (');
      this.createJs(this.api, stream);
      stream.write(');\n');
      stream.close();
      // fsp.writeFile('./src/file.js', JSON.stringify(this.api, (key, value) =>  {
      //   if (typeof value === 'function') return value.toString();
      //   return value;
      // }, '  '));
    } catch (e: any) {
      // logger.error(e);
      console.log(e);
      throw new RouterError(RouterErrorEnum.E_ROUTES);
    }
  }

  getApi() {
    if (!this.api) throw new Error();
    return this.api;
  }

  private createJs(api: IApi, stream: Writable, pathname = '', indent = '') {
    stream.write('{');
    for (const key of Object.keys(api)) {
      stream.write('\n' + indent + '  \'' + key + '\': ');
      const method = api[key] as IApi | TApiMethod;
      if (this.isMethod(method)) {
        stream.write('(options: Record<string, any>) => fetch(url + \'' + pathname + '\', options),');
      }
      else {
        this.createJs(method, stream, pathname + '/' + key, indent + '  ');
        stream.write(',');
      }
    }
    stream.write('\n' + indent + '}');
  }

  private async createRoutes(dirPath: string): Promise<IRoutes> {
    const route: IRoutes = {};
    const routePath = path.resolve(dirPath);
    const dir = await fs.promises.opendir(routePath);
    for await (const item of dir) {
      const ext = path.extname(item.name);
      const name = path.basename(item.name, ext);
      if (item.isFile()) {
        if (ext !== '.js') continue;
        const filePath = path.join(routePath, name);
        const moduleExport = require(filePath) as THandler | IRoutes;
        if (name === 'index') {
          if (typeof moduleExport === 'function')
            throw new Error(`Wrong api module: ${filePath}`);
          Object.assign(route, moduleExport);
        } else route[name] = moduleExport;
      } else {
        const dirPath = path.join(routePath, name);
        route[name] = await this.createRoutes(dirPath);
      }
    }
    return route;
  }

  private isHandler(handler?: IRoutes | THandler): handler is THandler {
    return typeof handler === 'function';
  }

  private isMethod(method?: IApi | TApiMethod): method is TApiMethod {
    return typeof method === 'function';
  }

  private createApi(routes: IRoutes, url: string): IApi {
    const urls = {} as IApi;
    for (const path of Object.keys(routes)) {
      const nextUrl = url + '/' + path;
      const nextRoutes = routes[path];
      if (this.isHandler(nextRoutes)) {
        urls[path] = (options: Record<string, any>) => this.fetch(url, options);
      } else {
        urls[path] = this.createApi(nextRoutes!, nextUrl);
      }
    }
    return urls;
  }

  private fetch(url: string, options: Record<string, any>) {
    const { data, ...rest } = options;
    const body = JSON.stringify(data) || '';
    const headers = {
      'content-type': MIME_TYPES_ENUM['application/json'],
      'content-length': Buffer.byteLength(body),
    };
    const fn = async (res: http.IncomingMessage) => {
      const buffer = [];
      for await (const chunk of res) buffer.push(chunk);
      const body = Buffer.concat(buffer).toString();
      return JSON.parse(body);
    };
    return new Promise((rv, rj) => {
      const req = http.request(
        'http://localhost:8000' + url,
        { ...rest, method: 'post', headers },
        (res) => rv(fn(res)),
      )
      req.on('error', rj)
      req.write(body);
    });
  }
}

const createClientApi = async () => {
  const clientApi = new ClientApi();
  await clientApi.init();
  return clientApi.getApi();
}

createClientApi().then(async (api) => {
  // await api?.users?.get().then(console.log);
  // await api?.users?.post({ name: 'some name'}).then(console.log);
  // await api?.merega?.get().then(console.log);
})
