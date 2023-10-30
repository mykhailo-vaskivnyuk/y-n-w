/* eslint-disable max-lines */
import { setTimeout, setInterval } from 'node:timers';
import {
  THandler, IRoutes, TInputModule, IContext,
  TOutputModule, IRouter, IRouterConfig, ITask,
} from './types';
import { IOperation, TOperationResponse } from '../types/operation.types';
import { RouterError } from './errors';
import { isHandler } from './utils';
import { errorHandler } from './methods/error.handler';
import { createClientApi } from './methods/create.client.api';
import { createInputModules, createOutputModules } from './methods/modules';
import { getServices } from './methods/services';
import { createRoutes } from './methods/create.routes';
import { setToGlobal } from '../app/methods/utils';
import { pathToArray } from '../utils/utils';
import * as cryptoService from '../utils/crypto';
import * as domain from '../domain/index';

class Router implements IRouter {
  private routes?: IRoutes;
  private execInputModules?: ReturnType<TInputModule>;
  private execOutputModules?: ReturnType<TOutputModule>;
  private inited = false;

  constructor(private config: IRouterConfig) {}

  async init() {
    try {
      const services = getServices(this.config);
      Object.assign(globalThis, services);
      setToGlobal('cryptoService', cryptoService);
      setToGlobal('domain', domain);
    } catch (e: any) {
      logger.error(e);
      throw new RouterError('SERVICE_ERROR');
    }

    try {
      this.execInputModules = createInputModules(this.config);
      this.execOutputModules = createOutputModules(this.config);
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

    try {
      const { tasks = [] } = this.config;
      for (const task of tasks) await this.execTask(task);
    } catch (e: any) {
      logger.error(e);
      throw new RouterError('TASK_ERROR');
    }

    this.inited = true;
    return this;
  }

  private async execTask(task: ITask) {
    const { time, interval = 0, params, path } = task;
    const names = pathToArray(path);
    const handler = this.findRoute(names);
    const context = { isAdmin: true } as IContext;
    setTimeout(() => {
      time !== undefined &&
        handler(context, params).catch((e) => logger.error(e));
      if (!interval) return;
      setInterval(() => handler(context, params)
        .catch((e) => logger.error(e)), interval).unref();
    }, time || 0).unref();
  }

  async exec(operation: IOperation): Promise<TOperationResponse> {
    if (!this.inited) throw new RouterError('ROUTER_ERROR');
    const { options: { origin, connectionId }, names } = operation;
    const context = { origin, connectionId } as IContext;
    const handler = this.findRoute(names);
    try {
      const { data } =
        await this.execInputModules!(operation, context, handler);
      const response = await handler(context, data.params);
      return await this.execOutputModules!(response, context, handler);
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
