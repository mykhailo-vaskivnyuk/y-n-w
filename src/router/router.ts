import { IRouter, IOperation, IOperationResponce } from '../app/types';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { Handler, IRoutes } from './types';
import { RouterError, RouterErrorCode, RouterErrorEnum } from './errors';

class Router implements IRouter {
  private routes?: IRoutes;

  init() {
    try {
      return this.createRoutes('./js/router/routes')
        .then((routes) => { this.routes = routes });
    } catch (e: any) {
      logger.error(e);
      throw this.error(RouterErrorEnum.E_ROUTES);
    }
  }

  async exec(operation: IOperation): Promise<IOperationResponce> {
    if (!this.routes) throw this.error(RouterErrorEnum.E_ROUTES);
    const { names, data } = operation;
    let handler: IRoutes | Handler = this.routes;
    for (const key of names) {
      if (this.isHandler(handler)) throw this.error(RouterErrorEnum.E_NOT_FOUND);
      if (!handler[key]) throw this.error(RouterErrorEnum.E_NOT_FOUND);
      handler = handler[key]!;
    }
    if (!this.isHandler(handler)) throw this.error(RouterErrorEnum.E_NOT_FOUND);
    try {
      return await handler(data);
    } catch (e: any) {
      logger.error(e);
      throw this.error(RouterErrorEnum.E_HANDLER);
    }
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
        if (name === 'index') Object.assign(route, moduleExport);
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

  error(code: RouterErrorCode, message?: string) {
    return new RouterError(code, message);
  }
}

export = new Router();
