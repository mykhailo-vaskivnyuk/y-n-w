export type TQuery<
  T extends Record<string, any>[] = Record<string, any>[],
  Q extends Record<string, any> = Record<string, any>
> = (params: RecordsToArray<T>) => Promise<Q[]>;

export type TQueriesModule = Record<string, string>

type RecordsToArray<T extends Record<string, any>[]> = { [key in keyof T]: T[key][keyof T[key]] };

export interface IDatabaseQueries {
  getUsers: TQuery;
  session: {
    read: TQuery<[{ id: string }], { session_value: string }>;
    create: TQuery<[{ id: string }, { value: string }]>;
    update: TQuery<[{ id: string }, { value: string }]>;
    del: TQuery<[{ id: string }]>;
  }
}
