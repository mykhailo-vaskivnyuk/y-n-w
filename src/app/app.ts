import { IConnection, IDatabase, IDatabaseConnection, ILogger, IRouter } from './types';
import db from '../db/db';

class App {
  private connection?: IConnection;
  private router?: IRouter;
  private db?: IDatabase;
  private logger?: ILogger;

  setInConnection(connection: IConnection) {
    this.connection = connection;
    this.connection.onOperation((operation) => {
      if (!this.router) throw Error('Router is not set') ;
      return this.router.exec(operation);
    });
    return this;
  }

  setRouter(router: IRouter) {
    this.router = router;
    return this;
  }

  setDatabase(connection: IDatabaseConnection) {
    db.setConnection(connection);
    this.db = db;
    return this;
  }

  setLogger(logger: ILogger) {
    this.logger = logger
    return this;
  }

  async start() {
    Object.assign(global, { logger: this.logger });

    const execQuery = await this.db?.init();
    Object.assign(global, { execQuery });
    logger.info('DATABASE is OK');
    
    await this.router?.init();
    logger.info('ROUTER is OK');

    await this.connection?.start();
    logger.info('SERVER is OK');
  }
}

export = new App();
