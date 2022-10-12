import { TQuery } from '../types';

export interface IQueriesUser {
  getUsers: TQuery<[], {
    id: number,
    name: string }>;
}

export const getUsers = 'SELECT * FROM users';
