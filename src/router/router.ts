import fs from 'node:fs';
import path from 'node:path';
import { Writable } from 'node:stream';
import { getEnumFromMap } from '../utils/utils';
import { THandler, IRoutes, TModule, IContext, TResponseModule } from './types';
import { TPromiseExecutor } from '../types';
import { IRouter, IOperation, TOperationResponse, IRouterConfig } from '../app/types';
import { HandlerError, HandlerErrorEnum, RouterError, RouterErrorEnum } from './errors';
import { DatabaseError } from '../db/errors';
import { getStream, GetStreamError } from './modules/get.stream';
import { validate, ValidationError } from './modules/validate';
import { isJoiSchema, validateResponse, ValidationResponseError } from './modules.response/validateResponse';
import { SessionError, setSession } from './modules/set.session';
import { setMailService } from './modules/send.mail';

export const MODULES = {
  getStream,
  validate,
  setSession,
  setMailService,
};

export const MODULES_ENUM = getEnumFromMap(MODULES);

export const MODULES_RESPONSE = {
  validateResponse,
};

export const MODULES_RESPONSE_ENUM = getEnumFromMap(MODULES_RESPONSE);

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
      const { modules, responseModules, modulesConfig } = this.config;
      modules.map(
        (module) => {
          const moduleConfig = modulesConfig[module];
          this.modules.push(MODULES[module](moduleConfig || {}));
        });
      responseModules.map(
        (module) => {
          const moduleConfig = modulesConfig[module];
          this.responseModules.push(MODULES_RESPONSE[module](moduleConfig));
        });
    } catch (e: any) {
      logger.error(e);
      throw new RouterError(RouterErrorEnum.E_MODULE);
    }

    try {
      const { apiPath } = this.config;
      this.routes = await this.createRoutes(apiPath);
      await this.createClientApi();
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
      this.onError(e);
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
      if (this.isHandler(handler)) throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
      if (!handler[key]) throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
      handler = handler[key]!;
    }
    if (!this.isHandler(handler)) throw new RouterError(RouterErrorEnum.E_NO_ROUTE);
    return handler;
  }

  private isHandler(handler?: IRoutes | THandler): handler is THandler {
    return typeof handler === 'function';
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

  private createClientApi() {
    if (!this.routes) throw new RouterError(RouterErrorEnum.E_ROUTES);
    const executor: TPromiseExecutor<void> = (rv, rj) => {
      const stream = fs.createWriteStream(this.config.clientApiPath);
      stream.on('error', rj);
      stream.on('finish', rv);
      stream.write(`
export const api = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => (`);
      this.createJs(this.routes!, stream);
      stream.write(');\n');
      stream.close();
    };

    return new Promise(executor);
  }

  private createJs(routes: IRoutes, stream: Writable, pathname = '', indent = '') {
    stream.write('{');
    const nextIndent = indent + '  ';
    const routesKeys = Object.keys(routes);
    for (const key of routesKeys) {
      stream.write(`\n${nextIndent}'${key}': `);
      const handler = routes[key] as THandler | IRoutes;
      const nextPathname = pathname + '/' + key;
      if (this.isHandler(handler)) {
        const types = this.getTypes(handler.params, nextIndent);
        const responseTypes = this.getTypes(handler.responseSchema, nextIndent);
        stream.write(
          `(${types ? `options: ${types}` : ''}) => fetch<${responseTypes}>('${nextPathname}'${types ? ', options' : ''}),`
        );
      }
      else {
        this.createJs(handler, stream, nextPathname, nextIndent);
        stream.write(',');
      }
    }
    stream.write('\n' + indent + '}');
  }

  private getTypes(params?: THandler['params'] | THandler['responseSchema'], indent = ''): string {
    if (!params) return '';
    const result = [];
    if (isJoiSchema(params)) {
      let type = params.type || '';
      type = type === 'object' ? 'Record<string, any>' : type;
      type === 'any' ? `${[...(params as any)._valids._values.values()][0]}` : type;
      return type;
    }
    if (Array.isArray(params)) {
      return params.map((item) => this.getTypes(item, indent)).join(' | ');
    }
    const paramsEntries = Object.entries(params);
    for (const [key, param] of paramsEntries) {
      result.push(`\n${indent}  ${key}: ${this.getTypes(param, indent)};`);
    }
    return `{${result.join('')}\n${indent}}`;
  }

  private onError(e: any): never {
    const { message, code, details } = e;
    if (e instanceof DatabaseError) {
      throw new RouterError(RouterErrorEnum.E_HANDLER, message);
    }

    if (e instanceof HandlerError) {
      if (code === HandlerErrorEnum.E_REDIRECT) {
        throw new RouterError(RouterErrorEnum.E_REDIRECT, details);
      }
      throw new RouterError(RouterErrorEnum.E_HANDLER, message);
    }
    
    if (e instanceof SessionError)
      throw new RouterError(RouterErrorEnum.E_ROUTER, message);
    if (e instanceof ValidationError)
      throw new RouterError(RouterErrorEnum.E_MODULE, details);
    if (e instanceof GetStreamError)
      throw new RouterError(RouterErrorEnum.E_MODULE, message);
    if (e instanceof ValidationResponseError)
      throw new RouterError(RouterErrorEnum.E_MODULE, message);

    logger.error(e);
    throw new RouterError(RouterErrorEnum.E_ROUTER, details || message);
  }
}

export default Router;
