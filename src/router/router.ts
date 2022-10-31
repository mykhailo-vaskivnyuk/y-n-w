import fs from 'node:fs';
import path from 'node:path';
import { THandler, IRoutes, TModule, IContext, TResponseModule } from './types';
import { IRouter, IOperation, TOperationResponse, IRouterConfig } from '../app/types';
import { RouterError, RouterErrorEnum } from './errors';
import { isHandler } from './methods';
import { createClientApi } from './methods/create.client.api';
import { errorHandler } from './methods/error.handler';
import { applyModules, applyResponseModules } from './methods/modules';

class Router implements IRouter {
  private config: IRouterConfig;
  private routes?: IRoutes;
  private modules: ReturnType<TModule>[] = [];
  private responseModules: ReturnType<TResponseModule>[] = [];

  constructor(config: IRouterConfig) {
    this.config = config;
  }

  async init() {
    try {
      this.modules = applyModules(this.config);
      this.responseModules = applyResponseModules(this.config);
    } catch (e: any) {
      logger.error(e);
      throw new RouterError(RouterErrorEnum.E_MODULE);
    }

    try {
      const { apiPath } = this.config;
      this.routes = await this.createRoutes(apiPath);
      await createClientApi(this.config, this.routes);
    } catch (e: any) {
      logger.error(e);
      throw new RouterError(RouterErrorEnum.E_ROUTES);
    }
  }
  
  async exec({ ...operation }: IOperation): Promise<TOperationResponse> {
    const { options: { origin }, names, data: { params } } = operation;
    let context = { origin } as IContext;
    const handler = this.findRoute(names);
    try {
      [context, operation] = await this.runModules(context, operation, handler);
      let response = await handler(context, params);
      [context, response] = await this.runResponseModules(context, response, handler);
      return response;
    } catch (e: any) {
      return errorHandler(e);
    } finally {
      context.session.finalize();
    }
  }

  private async createRoutes(dirPath: string): Promise<IRoutes> {
    const route: IRoutes = {};
    const routePath = path.resolve(dirPath);
    const dir = await fs.promises.opendir(routePath);
    for await (const item of dir) {
      const ext = path.extname(item.name);
      const name = path.basename(item.name, ext);
      if (item.isFile()) {
        if (ext !== '.js' || name === 'types') continue;
        const filePath = path.join(routePath, name);
        const moduleExport = require(filePath) as THandler | IRoutes;
        if (name === 'index') {
          if (typeof moduleExport === 'function') {
            throw new Error(`Wrong api module: ${filePath}`);
          }
          Object.assign(route, moduleExport);
        } else route[name] = moduleExport;
      } else {
        const dirPath = path.join(routePath, name);
        route[name] = await this.createRoutes(dirPath);
      }
    }
    return route;
  }

  private findRoute(names: IOperation['names']): THandler {
    if (!this.routes) throw new RouterError(RouterErrorEnum.E_ROUTES);
    let handler: IRoutes | THandler = this.routes;
    for (const key of names) {
      if (isHandler(handler)) throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
      if (!handler[key]) throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
      handler = handler[key]!;
    }
    if (!isHandler(handler)) throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
    return handler;
  }

  private async runModules(
    context: IContext, operation: IOperation, handler: THandler
  ): Promise<[IContext, IOperation]> {
    for (const module of this.modules)
      [context, operation] = await module(context, operation, handler);
    return [context, operation];
  }

  private async runResponseModules(
    context: IContext, response: TOperationResponse, handler: THandler
  ): Promise<[IContext, TOperationResponse]> {
    for (const module of this.responseModules)
      [context, response] = await module(context, response, handler);
    return [context, response];
  }
}

export default Router;
