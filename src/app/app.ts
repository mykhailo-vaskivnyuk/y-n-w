/* eslint-disable max-lines */
import { IControllerContext } from './types';
import { IConfig } from '../types/config.types';
import { IOperation } from '../types/operation.types';
import { ILogger } from '../logger/types';
import { IDatabase } from '../db/types/types';
import { IController } from '../controller/types';
import { IInputConnection } from '../server/types';
import {
  AppError,
  handleAppInitError,
  handleOperationError,
  setUncaughtErrorHandlers,
} from './errors';
import { setToGlobal } from './methods/utils';
import { createSetInputConnection } from './methods/set.input.connection';
import { loadModule } from '../loader/require';

export default class App {
  protected config: IConfig;
  protected logger?: ILogger;
  private db?: IDatabase;
  protected controller?: IController;
  protected server?: IInputConnection;
  protected apiServer?: IInputConnection;
  private messenger?: IInputConnection;
  protected setInputConnection: () => void;

  constructor(config: IConfig) {
    this.config = config;
    setUncaughtErrorHandlers(this as any);
    this.setInputConnection = createSetInputConnection(this as any);
  }

  async start() {
    try {
      const { env } = this.config;
      this.setLogger();
      setToGlobal('logger', this.logger);
      logger.info('LOGGER IS READY');
      await this.setDatabase();
      logger.info('DATABASE IS READY');
      this.setInputConnection();
      logger.info('SERVER IS READY TO START');
      this.setMessenger();
      logger.info('MESSENGER IS READY TO START');
      await this.setController();
      logger.info('CONTROLLER IS READY');
      await this.messenger!.start();
      logger.info('MESSENGER IS RUNNING');
      this.apiServer && (await this.apiServer.start());
      await this.server!.start();
      logger.info('SERVER IS RUNNING');
      env.RUN_ONCE && process.exit();
    } catch (e: any) {
      await handleAppInitError(e, this as any);
    }
  }

  async shutdown(message?: string) {
    const shutdownLogger = this.logger
      ? (message: string) => logger.fatal(message)
      : (message: string) => console.error(message);
    message && shutdownLogger(message);
    shutdownLogger('APP SHUTDOWN...');
    process.nextTick(() => process.exit());
  }

  async stop() {
    await this.apiServer?.stop();
    await this.server?.stop();
    await this.messenger?.stop();
    await this.db?.disconnect();
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

  private async setController() {
    const execQuery = this.db?.getQueries();
    if (!execQuery) throw new AppError('INIT_ERROR', 'DB is not INITIALIZED');

    const server = this.apiServer || this.server;
    if (!server) throw new AppError('INIT_ERROR', 'SERVER is not INITIALIZED');

    if (!this.messenger)
      throw new AppError('INIT_ERROR', 'MESSENGER is not INITIALIZED');

    const connectionService = server.getConnectionService();
    const messengerService = this.messenger!.getConnectionService();
    const { controller, env } = this.config;
    const context: IControllerContext = {
      logger,
      execQuery,
      startTransaction: () => this.db!.startTransaction(),
      connectionService,
      messengerService,
      console,
      env,
    };
    const Controller = loadModule(__dirname, controller.path, context);
    this.controller = await new Controller(controller).init();
    return this;
  }

  private setMessenger() {
    const { tg } = this.config.inConnection;
    const Messenger = require(tg.path);
    this.messenger = new Messenger(tg);

    const handleOperation = async (operation: IOperation) => {
      try {
        return await this.controller!.exec(operation);
      } catch (e: any) {
        return handleOperationError(e);
      }
    };

    this.messenger!.onOperation(handleOperation);
    return this;
  }
}
