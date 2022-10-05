import { IConnection, IDatabase, IRouter } from './types';

class App {
  private connection?: IConnection;
  private router?: IRouter;
  private db?: IDatabase;

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

  setDatabase(db: IDatabase) {
    this.db = db;
    return this;
  }

  async start() {
    await this.router?.init();
    await this.db?.init();
    this.connection?.start();
  }
}

export = new App();
