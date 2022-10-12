import db from '../db/db';
import { IInputConnection, IDatabase, IDatabaseConnection, ILogger, IRouter } from './types';
import { DatabaseError } from '../db/errors';
import { ServerError, ServerErrorEnum } from '../server/errors';
import { RouterError, RouterErrorEnum } from '../router/errors';
import { AppError, AppErrorEnum } from './errors';

class App {
  private logger?: ILogger;
  private inConnection?: IInputConnection;
  private db?: IDatabase;
  private router?: IRouter;

  constructor() {
    this.setErrorHandlers();
  }
  
  setLogger(logger: ILogger) {
    this.logger = logger
    Object.assign(global, { logger: this.logger });
    logger.info('LOGGER IS READY');
    return this;
  }
  
  setInputConnection(inConnection: IInputConnection) {
    this.inConnection = inConnection;

    this.inConnection.onOperation(async (operation) => {
      try {
        return await this.router!.exec(operation);
      } catch (e: any) {
        const { code, message, details } = e;
        if (e instanceof RouterError) {
          switch (code) {
          case RouterErrorEnum.E_NO_ROUTE:
            throw new ServerError(ServerErrorEnum.E_NOT_FOUND, details);
          case RouterErrorEnum.E_MODULE:
            throw new ServerError(ServerErrorEnum.E_BED_REQUEST, details);
          default:
            break;
          }
        } else logger.error(e);
        throw new AppError(AppErrorEnum.E_ROUTER, message);
      }
    });
    return this;
  }
  
  setDatabase(connection: IDatabaseConnection) {
    db.setConnection(connection);
    this.db = db;
    return this;
  }
  
  setRouter(router: IRouter) {
    this.router = router;
    return this;
  }

  async start() {
    try {
      const execQuery = await this.db!.init();
      Object.assign(global, { execQuery });
      logger.info('DATABASE IS READY');

      await this.router!.init();
      logger.info('ROUTER IS READY');

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

  private setErrorHandlers() {
    const uncaughtErrorHandler = (e: any) => {
      typeof logger !== 'undefined' ? logger.fatal(e) : console.error(e);
      process.nextTick(() => process.exit());
    }

    process.on('unhandledRejection', uncaughtErrorHandler);
    process.on('uncaughtException', uncaughtErrorHandler);
  }
}

export = new App();
