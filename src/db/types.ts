export type Query = (params: any[]) => Promise<any[]>;

export interface IDatabaseQueries {
  getUsers: Query;
}
