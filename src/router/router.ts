import {
  THandler, IRoutes, TInputModule, IContext,
  TOutputModule, IRouter, IRouterConfig,
} from './types';
import { IOperation, TOperationResponse } from '../types/operation.types';
import { RouterError } from './errors';
import { isHandler } from './utils';
import { errorHandler } from './methods/error.handler';
import { createClientApi } from './methods/create.client.api';
import {
  applyInputModules, applyOutputModules,
  runInputModules, runOutputModules,
} from './methods/modules';
import { getServices } from './methods/services';
import { createRoutes } from './methods/create.routes';

class Router implements IRouter {
  private config: IRouterConfig;
  private routes?: IRoutes;
  private modules: ReturnType<TInputModule>[] = [];
  private responseModules: ReturnType<TOutputModule>[] = [];

  constructor(config: IRouterConfig) {
    this.config = config;
  }

  async init() {
    try {
      const services = getServices(this.config);
      Object.assign(global, services);
    } catch (e: any) {
      logger.error(e);
      throw new RouterError('SERVICE_ERROR');
    }

    try {
      this.modules = applyInputModules(this.config);
      this.responseModules = applyOutputModules(this.config);
    } catch (e: any) {
      logger.error(e);
      throw new RouterError('MODULE_ERROR');
    }

    try {
      const { apiPath } = this.config;
      this.routes = await createRoutes(apiPath);
      await createClientApi(this.config, this.routes);
    } catch (e: any) {
      logger.error(e);
      throw new RouterError('ROUTES_CREATE_ERROR');
    }
    return this;
  }

  async exec({ ...operation }: IOperation): Promise<TOperationResponse> {
    if (!this.routes) throw new RouterError('ROUTES_CREATE_ERROR');
    const { options: { origin }, names } = operation;
    let context = { origin } as IContext;
    const handler = this.findRoute(names);

    try {
      [operation, context] = await runInputModules(
        this.modules
      )(operation, context, handler);
      const { params } = operation.data;
      let response = await handler(context, params);
      [response, context] = await runOutputModules(
        this.responseModules
      )(response, context, handler);
      return response;
    } catch (e: any) {
      return errorHandler(e);
    } finally {
      await context.session.finalize();
    }
  }

  private findRoute(names: IOperation['names']): THandler {
    let handler: IRoutes | THandler = this.routes!;
    for (const key of names) {
      if (!isHandler(handler) && key in handler) handler = handler[key]!;
      else throw new RouterError('CANT_FIND_ROUTE');
    }
    if (isHandler(handler)) return handler;
    throw new RouterError('CANT_FIND_ROUTE');
  }
}

export = Router;
