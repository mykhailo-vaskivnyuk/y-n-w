import { IInputConnection, IDatabase, IDatabaseConnection, ILogger, IRouter } from './types';
import { AppError, AppErrorEnum } from './errors';
import db from '../db/db';
import { RouterErrorEnum } from '../router/errors';
import { ServerError, ServerErrorEnum } from '../server/errors';

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
        switch (e?.code) {
        case RouterErrorEnum.E_NOT_FOUND:
          throw new ServerError(ServerErrorEnum.E_NOT_FOUND);
        case RouterErrorEnum.E_HANDLER:
          throw new ServerError(ServerErrorEnum.E_BED_REQUEST);
        default:
          throw e;
        }
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
      logger.info('ROUTER is READY');

      await this.inConnection!.start();
      logger.info('SERVER is READY');

    } catch (e: any) {
      logger.error(e);
      throw new AppError(AppErrorEnum.E_START);
    }
  }

  private setErrorHandlers() {
    const uncaughtErrorHandler = (e: any) => {
      logger ? logger.fatal(e) : console.error(e);
      process.nextTick(() => process.exit());
    }

    process.on('unhandledRejection', uncaughtErrorHandler);
    process.on('uncaughtException', uncaughtErrorHandler);
  }
}

export = new App();
