export type Query = <T extends []>(params: T) => Promise<any[]>;

export interface IDatabaseQueries {
  getUsers: Query;
}
