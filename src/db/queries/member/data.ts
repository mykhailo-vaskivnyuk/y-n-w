import { TQuery } from '../../types';

export interface IQueriesMemberData {
  create: TQuery<[
    ['user_id', number],
    ['node_id', number],
  ]>;
}

export const create = `
  INSERT INTO users_members (user_id, node_id)
  VALUES ($1, $2)
`;
