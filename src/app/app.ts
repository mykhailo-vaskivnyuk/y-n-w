import fs from 'node:fs';
import { env } from 'process';
import { IConfig, IModulesContext, IOperation } from './types';
import { AppError, handleOperationError } from './errors';
import { DatabaseError } from '../db/errors';
import { RouterError } from '../router/errors';
import { ServerError } from '../server/http/errors';
import { ILogger } from '../logger/types';
import { IDatabase } from '../db/types';
import { IRouter } from '../router/types';
import { IInputConnection } from '../server/http/types';
import { loadModule } from '../loader/require';

export default class App {
  private config: IConfig;
  private logger?: ILogger;
  private db?: IDatabase;
  private router?: IRouter;
  private server?: IInputConnection;

  constructor(config: IConfig) {
    env.NODE_ENV === 'development' && this.setEnv('.env.json');
    this.config = config;
    this.setUncaughtErrorHandlers();
  }

  async start() {
    try {
      this.setLogger();
      Object.assign(global, { logger: this.logger });
      logger.info('LOGGER IS READY');

      if (env.API_UNAVAILABLE === 'true')
        throw new AppError('E_INIT');

      this.setDatabase();
      await this.db!.init();
      logger.info('DATABASE IS READY');

      this.setRouter();
      await this.router!.init();
      logger.info('ROUTER IS READY');

      this.setInputConnection();
      await this.server!.start();
      logger.info('SERVER IS READY');

      env.RUN_ONCE === 'true' && process.exit(0);

    } catch (e: any) {
      await this.handleAppInitError(e);
    }
  }

  private setEnv(envPath: string) {
    const envJson = fs
      .readFileSync(envPath)
      .toString();
    const envObj = JSON.parse(envJson);
    Object.assign(env, envObj);
  }

  private setUncaughtErrorHandlers() {
    const uncaughtErrorHandler = (e: any) => {
      this.logger ?
        logger.fatal(e) :
        console.error(e);
      if (env.EXIT_ON_ERROR === 'false') return;
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
    if (!logger || !execQuery) throw new AppError('E_INIT');
    const context: IModulesContext = {
      logger,
      execQuery,
    };
    const Router = loadModule(router.path, context);
    this.router = new Router(router);
    return this;
  }

  private setInputConnection() {
    const apiUnavailable = env.API_UNAVAILABLE === 'true';
    const staticUnavailable = env.STATIC_UNAVAILABLE === 'true';
    if (!this.router && !apiUnavailable) throw new AppError('E_INIT');
    const { inConnection } = this.config;
    const { transport } = inConnection;
    const server = inConnection[transport];
    const InConnection = require(server.path);
    const handleOperation = async (operation: IOperation) => {
      try {
        return await this.router?.exec(operation);
      } catch (e: any) {
        return handleOperationError(e);
      }
    };
    this.server = new InConnection(server)
      .onOperation(handleOperation);
    apiUnavailable && this.server!.setUnavailable('api');
    staticUnavailable && this.server!.setUnavailable('static');
    return this;
  }

  private async handleAppInitError(e: any) {
    const isKnown = [
      DatabaseError.name,
      RouterError.name,
      ServerError.name,
      AppError.name,
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
