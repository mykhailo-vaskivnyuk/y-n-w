import { IConfig, IModulesContext, IOperation } from './types';
import { AppError, AppErrorEnum, handleOperationError } from './errors';
import { DatabaseError } from '../db/errors';
import { RouterError } from '../router/errors';
import { ServerError } from '../server/http/errors';
import { IDatabase, IDatabaseQueries } from '../db/types';
import { loadModule } from '../loader/loader';
import { ILogger } from '../logger/types';
import { IRouter } from '../router/types';
import { IInputConnection } from '../server/http/types';

export default class App {
  private config: IConfig;
  private logger?: ILogger;
  private db?: IDatabase;
  private router?: IRouter;
  private inConnection?: IInputConnection;

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
    this.db = new Database(database) as IDatabase;
    return this;
  }
  
  setRouter(modulesContext: IModulesContext) {
    const { router } = this.config;
    const Router = loadModule(router.path, modulesContext);
    this.router = new Router(router, modulesContext);
    return this;
  }

  setInputConnection() {
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
  
    this.inConnection = new InConnection(server) as IInputConnection;
    this.inConnection.onOperation(handleOperation);
    return this;
  }

  async start() {
    try {
      this.setLogger();
      Object.assign(global, { logger: this.logger });
      logger.info('LOGGER IS READY');

      this.setDatabase();
      const execQuery = await this.db!.init() as IDatabaseQueries;
      logger.info('DATABASE IS READY');

      this.setRouter({ execQuery, logger: this.logger! });
      await this.router!.init();
      logger.info('ROUTER IS READY');

      this.setInputConnection();
      await this.inConnection!.start();
      logger.info('SERVER IS READY');

    } catch (e) {
      const isKnown =
        e instanceof DatabaseError ||
        e instanceof RouterError ||
        e instanceof ServerError;
      if (!isKnown) logger.error(e);
      throw new AppError(AppErrorEnum.E_START);
    }
  }

  private setUncaughtErrorHandlers() {
    const uncaughtErrorHandler = (e: any) => {
      typeof logger !== 'undefined' ? logger.fatal(e) : console.error(e);
      process.nextTick(() => process.exit());
    }
    process.on('unhandledRejection', uncaughtErrorHandler);
    process.on('uncaughtException', uncaughtErrorHandler);
  }
}
