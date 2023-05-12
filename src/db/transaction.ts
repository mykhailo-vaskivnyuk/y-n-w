import { DatabaseError } from './errors';
import {
  IDatabaseQueries, ITransaction, ITransactionConnection,
} from './types/types';

export class Transaction implements ITransaction {
  public execQuery: IDatabaseQueries;

  constructor(
    private connection: ITransactionConnection,
    queries: IDatabaseQueries,
  ) {
    let pointer: any = queries;
    const handler = {
      get(
        target: ITransaction,
        name: string,
        receiver: ITransaction,
      ) {
        if (!pointer[name]) return;
        if (typeof pointer[name] !== 'function') {
          pointer = pointer[name];
          return receiver;
        }
        return (...args: any[]) =>
          pointer[name](...args, connection);
      }
    };
    this.execQuery = new Proxy({} as IDatabaseQueries, handler as any);
  }

  public async commit() {
    try {
      await this.connection?.commit();
    } catch (e) {
      logger.error(e);
      throw new DatabaseError('DB_QUERY_ERROR');
    }
  }

  public async rollback() {
    try {
      await this.connection?.rollback();
    } catch (e) {
      logger.error(e);
      throw new DatabaseError('DB_QUERY_ERROR');
    }
  }
}
