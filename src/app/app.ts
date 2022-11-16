import { IRouterContext, IAppThis } from './types';
import { IConfig } from '../types/config.types';
import {
  AppError, handleAppInitError, setUncaughtErrorHandlers,
} from './errors';
import { ILogger } from '../logger/types';
import { IDatabase } from '../db/types';
import { IRouter } from '../router/types';
import { IInputConnection } from '../server/types';
import { setToGlobal } from './methods/utils';
import { createSetInputConnection } from './methods/set.input.connection';
import { loadModule } from '../loader/require';

export default class App {
  protected config: IConfig;
  protected logger?: ILogger;
  private db?: IDatabase;
  protected router?: IRouter;
  protected server?: IInputConnection;
  protected setInputConnection: () => Promise<IAppThis>;

  constructor(config: IConfig) {
    this.config = config;
    setUncaughtErrorHandlers(this as any);
    this.setInputConnection =
      createSetInputConnection(this as any);
  }

  async start() {
    try {
      const { env } = this.config;
      this.setLogger();
      setToGlobal('logger', this.logger);
      logger.info('LOGGER IS READY');
      if (env.API_UNAVAILABLE)
        throw new AppError('INIT_ERROR', 'API set UNAVAILABLE');
      await this.setDatabase();
      logger.info('DATABASE IS READY');
      await this.setRouter();
      logger.info('ROUTER IS READY');
      await this.setInputConnection();
      logger.info('SERVER IS READY');
      env.RUN_ONCE && process.exit();
    } catch (e: any) {
      await handleAppInitError(e, this as any);
    }
  }

  protected async shutdown(message?: string) {
    const shutdownLogger = this.logger ?
      (message: string) => logger.fatal(message) :
      (message: string) => console.error(message);
    message && shutdownLogger(message);
    shutdownLogger('APP SHUTDOWN...');
    process.nextTick(() => process.exit());
  }

  private setLogger() {
    const { logger } = this.config;
    const Logger = require(logger.path);
    this.logger = new Logger(logger);
    return this;
  }

  private async setDatabase() {
    const { database } = this.config;
    const Database = require(database.path);
    this.db = await new Database(database).init();
    return this;
  }

  private async setRouter() {
    const { router } = this.config;
    const execQuery = this.db?.getQueries();
    if (!execQuery)
      throw new AppError('INIT_ERROR', 'DB is not INITIALIZED');
    const context: IRouterContext = {
      logger,
      execQuery,
      console,
    };
    const Router = loadModule(__dirname, router.path, context);
    this.router = await new Router(router).init();
    return this;
  }
}
