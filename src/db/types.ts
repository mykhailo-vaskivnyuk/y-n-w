import { IQueriesSession } from './queries/session';
import { IQueriesUser } from './queries/user';

type GetParamsTypes<T extends [string, any][]> =
  { [key in keyof T]: T[key][1] };

export type TQuery<
  T extends [string, any][] = [string, any][],
  Q extends Record<string, any> = Record<string, any>,
> = (params: GetParamsTypes<T>) => Promise<Q[]>;

export type TQueriesModule = Record<string, string> | string;

export interface IDatabaseQueries {
  user: IQueriesUser;
  session: IQueriesSession;
}
