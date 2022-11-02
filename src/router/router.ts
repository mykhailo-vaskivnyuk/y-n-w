import fsp from 'node:fs/promises';
import path from 'node:path';
import { THandler, IRoutes, TModule, IContext, TResponseModule } from './types';
import { IRouter, IOperation, TOperationResponse, IRouterConfig, IModulesContext } from '../app/types';
import { RouterError, RouterErrorEnum } from './errors';
import { isHandler } from './utils';
import { createClientApi } from './methods/create.client.api';
import { errorHandler } from './methods/error.handler';
import { applyModules, applyResponseModules } from './methods/modules';
import load from '../loader/loader';

class Router implements IRouter {
  private config: IRouterConfig;
  private routes?: IRoutes;
  private modules: ReturnType<TModule>[] = [];
  private responseModules: ReturnType<TResponseModule>[] = [];
  private context: IModulesContext | null = null;
  constructor(config: IRouterConfig) {
    this.config = config;
  }

  async init(context: IModulesContext) {
    this.context = context;
    try {
      this.modules = applyModules(this.config, this.context);
      this.responseModules = applyResponseModules(this.config, this.context);
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
    if (!this.routes) throw new RouterError(RouterErrorEnum.E_ROUTES);
    const { options: { origin }, names } = operation;
    let context = { origin } as IContext;
    const handler = this.findRoute(names);

    try {
      [operation, context] = await this.runModules(operation, context, handler);
      const { params } = operation.data; 
      let response = await handler(context, params);
      [response] = await this.runResponseModules(response, context, handler);
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
    const dir = await fsp.opendir(routePath);
  
    for await (const item of dir) {
      const ext = path.extname(item.name);
      const name = path.basename(item.name, ext);

      if (item.isDirectory()) {
        const dirPath = path.join(routePath, name);
        route[name] = await this.createRoutes(dirPath);
        continue;
      }

      if (ext !== '.js' || name === 'types') continue;

      const filePath = path.join(routePath, item.name);
      const moduleExport = load(filePath, this.context!) as THandler | IRoutes;

      if (name !== 'index') {
        route[name] = moduleExport;
        continue;
      }
      
      if (typeof moduleExport === 'function')
        throw new Error(`Wrong api module: ${filePath}`);
      else Object.assign(route, moduleExport);
    }

    return route;
  }

  private findRoute(names: IOperation['names']): THandler {
    let handler: IRoutes | THandler = this.routes!;
    for (const key of names) {
      if (!isHandler(handler) && key in handler) handler = handler[key]!;
      else throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
    }
    if (isHandler(handler)) return handler;
    throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
  }

  private async runModules(
    operation: IOperation, context: IContext, handler: THandler
  ): Promise<[IOperation, IContext]> {
    for (const module of this.modules)
      [operation, context] = await module(operation, context, handler);
    return [operation, context];
  }

  private async runResponseModules(
    response: TOperationResponse, context: IContext, handler: THandler
  ): Promise<[TOperationResponse, IContext]> {
    for (const module of this.responseModules)
      [response, context] = await module(response, context, handler);
    return [response, context];
  }
}

export default Router;
