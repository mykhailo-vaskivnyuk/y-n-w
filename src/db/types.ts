export type Query = (params: any[]) => Promise<any[]>;

export interface IDbQueries {
  getUsers: Query;
}
