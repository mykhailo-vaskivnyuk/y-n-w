import { IConfig, IModulesContext, IOperation } from './types';
import { AppError, AppErrorEnum, handleOperationError } from './errors';
import { DatabaseError } from '../db/errors';
import { RouterError } from '../router/errors';
import { ServerError } from '../server/http/errors';
import { IDatabase } from '../db/types';
import { IRouter } from '../router/types';
import { IInputConnection } from '../server/http/types';
import { loadModule } from '../loader/loader';

export default class App {
  private config: IConfig;
  private router?: IRouter;

  constructor(config: IConfig) {
    this.config = config;
    this.setUncaughtErrorHandlers();
  }
  
  getLogger() {
    const { logger } = this.config;
    const Logger = require(logger.path);
    return new Logger(logger);
  }
  
  getDatabase() {
    const { database } = this.config;
    const Database = require(database.path);
    return new Database(database) as IDatabase;
  }
  
  setRouter(modulesContext: IModulesContext) {
    const { router } = this.config;
    const Router = loadModule(module)(router.path, modulesContext);
    this.router = new Router(router, modulesContext);
    return this;
  }

  getInputConnection() {
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
  
    const newServer = new InConnection(server) as IInputConnection;
    newServer.onOperation(handleOperation);
    return newServer;
  }

  async start() {
    try {
      const logger = this.getLogger();
      Object.assign(global, { logger });
      logger.info('LOGGER IS READY');

      const db = this.getDatabase();
      const execQuery = await db.init();
      logger.info('DATABASE IS READY');

      this.setRouter({ execQuery, logger });
      await this.router!.init();
      logger.info('ROUTER IS READY');

      await this.getInputConnection().start();
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
      typeof logger !== 'undefined'
        ? logger.fatal(e)
        : console.error(e);
      process.nextTick(() => process.exit());
    }
    process.on('unhandledRejection', uncaughtErrorHandler);
    process.on('uncaughtException', uncaughtErrorHandler);
  }
}
