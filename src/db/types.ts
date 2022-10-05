export interface IDatabaseConnection {
  query(sql: string, params: any[]): Promise<any[]>;
}

export type Query = (params: any[]) => Promise<any[]>;

export interface IQueries {
  [key: string]: Query | IQueries;
}

declare global {
  const DbQueries: IDbQueries;
}

export interface IDbQueries {
  getUsers: Query;
}
