import { DatabaseError } from './errors';
import {
  IDatabaseQueries,
  ITransaction,
  ITransactionConnection,
} from './types/types';

export class Transaction implements ITransaction {
  constructor(
    private connection: ITransactionConnection,
    public execQuery: IDatabaseQueries,
  ) {
    const handler = {
      get(target: IDatabaseQueries, name: keyof IDatabaseQueries) {
        if (!(name in target)) return;
        const newTarget = target[name];
        if (typeof newTarget !== 'function')
          return new Proxy(newTarget, handler as any);
        const func = newTarget as any;
        return (...args: any[]) => func(...args, connection);
      },
    };
    this.execQuery = new Proxy(execQuery, handler as any);
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
