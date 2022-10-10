export type TQuery = <T extends any[] = any[]>(params: T) => Promise<any[]>;

export interface IDatabaseQueries {
  getUsers: TQuery;
}

export type TQueriesModule = Record<string, string>;
