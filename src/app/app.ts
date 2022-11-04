import { IConfig, IModulesContext, IOperation } from './types';
import { AppError, handleOperationError } from './errors';
import { DatabaseError } from '../db/errors';
import { RouterError } from '../router/errors';
import { ServerError } from '../server/http/errors';
import { ILogger } from '../logger/types';
import { IDatabase } from '../db/types';
import { IRouter } from '../router/types';
import { IInputConnection } from '../server/http/types';
import { loadModule } from '../loader/custom.require';

export default class App {
  private config: IConfig;
  private logger?: ILogger;
  private db?: IDatabase;
  private router?: IRouter;
  private server?: IInputConnection;

  constructor(config: IConfig) {
    this.config = config;
    this.setUncaughtErrorHandlers();
  }
  
  setLogger() {
    const { logger } = this.config;
    const Logger = require(logger.path);
    this.logger = new Logger(logger);
    return this;
  }
  
  setDatabase() {
    const { database } = this.config;
    const Database = require(database.path);
    this.db = new Database(database);
    return this;
  }
  
  setRouter() {
    const { router } = this.config;
    const logger = this.logger;
    const execQuery = this.db?.getQueries();
    if (!logger || !execQuery) throw new AppError('E_INIT');
    const context: IModulesContext = {
      logger,
      execQuery,
    };
    const Router = loadModule(__dirname)(router.path, context);
    this.router = new Router(router);
    return this;
  }

  setInputConnection() {
    if (!this.router) throw new AppError('E_INIT');
    const { inConnection } = this.config;
    const { transport } = inConnection;
    const server = inConnection[transport];
    const InConnection = require(server.path);
    const handleOperation = async (operation: IOperation) => {
      try {
        return await this.router!.exec(operation);
      } catch (e: any) {
        return handleOperationError(e);
      }
    };
    this.server = new InConnection(server)
      .onOperation(handleOperation);
    return this;
  }

  async start() {
    try {
      this.setLogger();
      Object.assign(global, { logger: this.logger });
      logger.info('LOGGER IS READY');

      this.setDatabase();
      await this.db!.init();
      logger.info('DATABASE IS READY');

      this.setRouter();
      await this.router!.init();
      logger.info('ROUTER IS READY');

      this.setInputConnection();
      await this.server!.start()
      logger.info('SERVER IS READY');

    } catch (e: any) {
      const isKnown =
        e instanceof DatabaseError ||
        e.name === RouterError.name ||
        e instanceof ServerError;
      if (!isKnown) logger.error(e, e.message);
      throw new AppError('E_START');
    }
  }

  private setUncaughtErrorHandlers() {
    const uncaughtErrorHandler = (e: any) => {
      typeof logger !== 'undefined'
        ? logger.fatal(e)
        : console.error(e);
      process.nextTick(() => process.exit());
    }
    process.on('unhandledRejection', uncaughtErrorHandler);
    process.on('uncaughtException', uncaughtErrorHandler);
  }
}
