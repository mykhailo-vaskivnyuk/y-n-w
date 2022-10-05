import { IRouter, IOperation, IOperationResponce } from '../app/types';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { Handler, IRoutes } from './types';
import { EventEmitter } from 'node:stream';

class Router extends EventEmitter implements IRouter {
  private routes: IRoutes = {};

  init() {
    return this.createRoutes('./js/routes')
      .then((routes) => { this.routes = routes });
  }

  async exec(operation: IOperation): Promise<IOperationResponce> {
    const { names, data } = operation;
    let handler: IRoutes | Handler = this.routes;
    for (const key of names) {
      if (this.isHandler(handler)) return {};
      if (!handler[key]) return {};
      handler = handler[key]!;
    }
    if (!this.isHandler(handler)) return {};
    return handler(data);
  }

  private async createRoutes(dirPath: string): Promise<IRoutes> {
    const route: IRoutes = {};
    const routePath = path.resolve(dirPath);
    const dir = await fsp.opendir(routePath);
    for await (const item of dir) {
      const ext = path.extname(item.name);
      const name = path.basename(item.name, ext);
      if (item.isFile()) {
        if (ext !== '.js') continue;
        const filePath = path.join(routePath, name);
        const moduleExport = require(filePath);
        if (name === 'index') Object.assign(route, moduleExport)
        else route[name] = moduleExport;
      } else {
        const dirPath = path.join(routePath, name);
        route[name] = await this.createRoutes(dirPath);
      }
    }
    return route;
  }

  private isHandler(handler?: IRoutes | Handler): handler is Handler {
    return typeof handler === 'function';
  }
}

export = new Router();
