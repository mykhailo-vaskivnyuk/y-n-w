import { TQuery } from '../../types';

export interface IQueriesNodeUser {
  connect: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ]>;
  remove: TQuery<[
    ['node_id', number],
  ]>;
}

export const connect = `
  UPDATE nodes
  SET count_of_members = 1, user_id = $2
  WHERE node_id = $1
`;

export const remove = `
  UPDATE nodes
  SET count_of_members = 0, user_id = NULL
  WHERE node_id = $1
`;
