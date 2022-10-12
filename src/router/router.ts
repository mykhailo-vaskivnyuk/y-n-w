import fsp from 'node:fs/promises';
import path from 'node:path';
import { IRouter, IOperation, TOperationResponse } from '../app/types';
import { THandler, IRoutes, TModule, IContext, ServicesEnum } from './types';
import { RouterError, RouterErrorEnum } from './errors';
import { getStream, GetStreamError } from './modules/getStream';
import { validate, ValidationError } from './modules/validate';
import { SessionError, setSession } from './modules/setSession';

class Router implements IRouter {
  private routes?: IRoutes;
  private modules: TModule[] = [];

  async init() {
    try {
      this.routes = await this.createRoutes('./js/api');
    } catch (e: any) {
      logger.error(e);
      throw new RouterError(RouterErrorEnum.E_ROUTES);
    }
  }

  setModule(module: TModule) {
    this.modules.push(module);
    return this;
  }
  
  async exec(operation: IOperation): Promise<TOperationResponse> {
    if (!this.routes) throw new RouterError(RouterErrorEnum.E_ROUTES);
    const { names, data } = operation;
    let handler: IRoutes | THandler = this.routes;
    for (const key of names) {
      if (this.isHandler(handler)) throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
      if (!handler[key]) throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
      handler = handler[key]!;
    }
    if (!this.isHandler(handler)) throw new RouterError(RouterErrorEnum.E_NO_ROUTE);

    let newContext = {} as IContext;
    let newData = data;
    try {
      for (const module of this.modules) {
        [newContext, newData] = await module(newContext, newData, handler);
      }
    } catch (e: any) {
      const { message, details } = e;
      if (e instanceof SessionError) {
        throw new RouterError(RouterErrorEnum.E_ROUTER, message);
      }
      if (e instanceof ValidationError) {
        throw new RouterError(RouterErrorEnum.E_MODULE, details);
      }
      if (e instanceof GetStreamError) {
        throw new RouterError(RouterErrorEnum.E_MODULE, message);
      }
      logger.error(e);
      throw new RouterError(RouterErrorEnum.E_ROUTER, details || message);
    }

    try {
      return await handler(newContext, newData.params);
    } catch (e: any) {
      logger.error(e);
      throw new RouterError(RouterErrorEnum.E_HANDLER, e.message);
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
        const moduleExport = require(filePath) as THandler | IRoutes;
        if (name === 'index') Object.assign(route, moduleExport);
        else route[name] = (moduleExport);
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
}

const router = new Router()
  .setModule(setSession)
  .setModule(getStream)
  .setModule(validate);

export = router;
