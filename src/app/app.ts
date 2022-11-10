import fs from 'node:fs';
import { env } from 'process';
import {
  IConfig, IEnv, IModulesContext, IOperation,
  ICleanedEnv, CleanedEnvKeys, EnvValuesMap, EnvValuesKeys,
} from './types';
import { AppError, handleOperationError } from './errors';
import { DatabaseError } from '../db/errors';
import { RouterError } from '../router/errors';
import { ServerError } from '../server/errors';
import { ILogger } from '../logger/types';
import { IDatabase } from '../db/types';
import { IRouter } from '../router/types';
import { IInputConnection } from '../server/types';
import { setToGlobal } from './utils';
import { loadModule } from '../loader/require';

export default class App {
  private config: IConfig;
  private logger?: ILogger;
  private db?: IDatabase;
  private router?: IRouter;
  private server?: IInputConnection;
  private env = {} as ICleanedEnv;

  constructor(config: IConfig) {
    this.config = config;
    this.setUncaughtErrorHandlers();
  }

  async start() {
    try {
      this.setEnv();

      this.setLogger();
      setToGlobal('logger', this.logger);
      logger.info('LOGGER IS READY');

      if (this.env.API_UNAVAILABLE)
        throw new AppError('E_INIT', 'API set UNAVAILABLE');

      this.setDatabase();
      await this.db!.init();
      logger.info('DATABASE IS READY');

      this.setRouter();
      await this.router!.init();
      logger.info('ROUTER IS READY');

      this.setInputConnection();
      await this.server!.start();
      logger.info('SERVER IS READY');

      this.env.RUN_ONCE && process.exit(0);

    } catch (e: any) {
      await this.handleAppInitError(e);
    }
  }

  private setEnv() {
    const cleanedEnvObj = {
      RUN_ONCE: env.RUN_ONCE === 'true',
      DEV: env.NODE_ENV === 'development'
    } as ICleanedEnv;
    if (cleanedEnvObj.DEV) {
      this.env = cleanedEnvObj;
      return;
    }
    const { envPath } = this.config;
    const envJson = fs
      .readFileSync(envPath)
      .toString();
    const envObj = JSON.parse(envJson) as IEnv;
    const entries = Object
      .entries(envObj) as  [CleanedEnvKeys, EnvValuesKeys][];
    entries.reduce((
      cleanedEnvObj, [key, value],
    ) => Object.assign(cleanedEnvObj, {
      [key]: EnvValuesMap[value] || value,
    }), cleanedEnvObj);
    this.env = cleanedEnvObj;
  }

  private setUncaughtErrorHandlers() {
    const uncaughtErrorHandler = (e: any) => {
      this.logger ?
        logger.fatal(e) :
        console.error(e);
      if (e.name !== ServerError.name) return;
      if (!this.env.EXIT_ON_ERROR) return;
      process.nextTick(() => process.exit());
    };
    process.on('unhandledRejection', uncaughtErrorHandler);
    process.on('uncaughtException', uncaughtErrorHandler);
  }

  private setLogger() {
    const { logger } = this.config;
    const Logger = require(logger.path);
    this.logger = new Logger(logger);
    return this;
  }

  private setDatabase() {
    const { database } = this.config;
    const Database = require(database.path);
    this.db = new Database(database);
    return this;
  }

  private setRouter() {
    const { router } = this.config;
    const logger = this.logger;
    const execQuery = this.db?.getQueries();
    if (!logger || !execQuery)
      throw new AppError('E_INIT', 'LOGGER or DB is not INITIALIZED');
    const context: IModulesContext = {
      logger,
      execQuery,
    };
    const Router = loadModule(router.path, context);
    this.router = new Router(router);
    return this;
  }

  private setInputConnection() {
    if (!this.router && !this.env.API_UNAVAILABLE)
      throw new AppError('E_INIT', 'ROUTER is not INITIALIZED');

    const handleOperation = async (operation: IOperation) => {
      try {
        return await this.router!.exec(operation);
      } catch (e: any) {
        return handleOperationError(e);
      }
    };

    const { inConnection } = this.config;
    const { transport } = inConnection;
    const server = inConnection['http'];
    const apiServer = transport === 'ws' && inConnection['ws'];
    const InConnection = require(server.path);
    const InApiConnection = apiServer && require(apiServer.path);
    this.server = new InConnection(server);
    const apiServerInstance = InApiConnection &&
      new InApiConnection(apiServer, this.server!.getServer());

    if (apiServerInstance) {
      this.server!.setUnavailable('api');
      apiServerInstance.onOperation(handleOperation);
      this.env.API_UNAVAILABLE && apiServerInstance!.setUnavailable('api');
    } else {
      this.server!.onOperation(handleOperation);
      this.env.API_UNAVAILABLE && this.server!.setUnavailable('api');
    }

    this.env.STATIC_UNAVAILABLE && this.server!.setUnavailable('static');
    return this;
  }

  private async handleAppInitError(e: any) {
    const isKnown = [
      DatabaseError.name,
      RouterError.name,
      ServerError.name,
    ];
    if (!isKnown.includes(e.name)) logger.error(e, e.message);
    if (!this.logger) throw new AppError('E_START');
    try {
      this.setInputConnection();
      await this.server!.start();
      this.logger.info('SERVER IS READY');
    } catch (e: any) {
      if (!isKnown.includes(e.name)) logger.error(e, e.message);
      throw new AppError('E_START');
    }
  }
}
